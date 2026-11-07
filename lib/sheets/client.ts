import { createSign } from 'node:crypto'

const API = 'https://sheets.googleapis.com/v4/spreadsheets'
const TAB = process.env.GOOGLE_SHEETS_TAB || 'Bookings'

/** Website columns come first, then blank columns for staff. New rows never touch staff entries. */
export const SHEET_HEADERS = [
  'Reference', 'Booked at', 'Ship', 'Category', 'Trip', 'Journey date', 'Return date', 'Tickets', 'Seat preference',
  'Customer name', 'Mobile', 'Email', 'Co-passengers', 'Total', 'Advance %', 'Advance due', 'Balance',
  'Payment method', 'TrxID', 'Payment status', 'Rejection reason', 'Ticket status', 'Ticket number', 'Handled by', 'Notes',
  'Ticket collection',
]
const TICKET_COLUMN = 'Z'

async function getAccessToken(): Promise<string> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  if (!email || !key) throw new Error('Google settings are missing')

  const encode = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url')
  const now = Math.floor(Date.now() / 1000)
  const body = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 600,
  })}`
  const signature = createSign('RSA-SHA256').update(body).sign(key, 'base64url')

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${body}.${signature}` }),
  })
  if (!response.ok) throw new Error(`Google sign-in failed (${response.status})`)
  const { access_token: token } = (await response.json()) as { access_token: string }
  return token
}

async function request(path: string, token: string, init?: RequestInit) {
  const response = await fetch(`${API}/${process.env.GOOGLE_SHEETS_ID}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
  })
  if (!response.ok) throw new Error(`Google Sheets request failed (${response.status})`)
  return response.json()
}

/** Creates the tab and its header row the first time. Leaves existing content alone. */
async function ensureTab(token: string) {
  const meta = (await request('?fields=sheets.properties.title', token)) as { sheets: { properties: { title: string } }[] }
  if (!meta.sheets.some((sheet) => sheet.properties.title === TAB)) {
    await request(':batchUpdate', token, { method: 'POST', body: JSON.stringify({ requests: [{ addSheet: { properties: { title: TAB } } }] }) })
  }
  const first = (await request(`/values/${encodeURIComponent(`'${TAB}'!A1:A1`)}`, token)) as { values?: string[][] }
  if (!first.values?.length) {
    await request(`/values/${encodeURIComponent(`'${TAB}'!A1`)}?valueInputOption=RAW`, token, { method: 'PUT', body: JSON.stringify({ values: [SHEET_HEADERS] }) })
    return
  }
  // A Sheet made before this column existed gets its heading on the next booking.
  const heading = (await request(`/values/${encodeURIComponent(`'${TAB}'!${TICKET_COLUMN}1`)}`, token)) as { values?: string[][] }
  if (!heading.values?.length) {
    await request(`/values/${encodeURIComponent(`'${TAB}'!${TICKET_COLUMN}1`)}?valueInputOption=RAW`, token, { method: 'PUT', body: JSON.stringify({ values: [['Ticket collection']] }) })
  }
}

/**
 * Blanks a booking's seat preference, customer name, mobile, email and co-passengers
 * (columns I to M) and its delivery address (column Z). Rows are found by reference,
 * so sorting the Sheet is safe.
 */
export async function clearPersonalDataFromSheet(reference: string) {
  const token = await getAccessToken()
  const meta = (await request('?fields=sheets.properties.title', token)) as { sheets: { properties: { title: string } }[] }
  if (!meta.sheets.some((sheet) => sheet.properties.title === TAB)) return
  const column = (await request(`/values/${encodeURIComponent(`'${TAB}'!A:A`)}`, token)) as { values?: string[][] }
  const ranges = (column.values ?? []).flatMap((row, index) => (row[0] === reference ? [`'${TAB}'!I${index + 1}:M${index + 1}`, `'${TAB}'!${TICKET_COLUMN}${index + 1}`] : []))
  if (ranges.length > 0) await request('/values:batchClear', token, { method: 'POST', body: JSON.stringify({ ranges }) })
}

/** RAW input stops customer text such as "=SUM(...)" from running as a formula. */
export async function appendBookingRow(row: (string | number)[]) {
  const token = await getAccessToken()
  await ensureTab(token)
  await request(`/values/${encodeURIComponent(`'${TAB}'!A:A`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, token, {
    method: 'POST',
    body: JSON.stringify({ values: [row] }),
  })
}
