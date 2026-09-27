export const revalidate = 86400

function escapeXml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c] as string))
}

export function GET() {
  const base = 'https://www.shiptickets.bd'
  const now = new Date().toISOString()
  const items = [
    { title: 'Saint Martin ship tickets, made simple.', link: base, pubDate: '2026-09-22T00:00:00Z', description: 'Compare ships, check fares and book your Saint Martin journey with confidence.' },
    { title: 'Saint Martin ship ticket price guide', link: `${base}/saint-martin-ship-ticket-price`, pubDate: '2026-09-22T00:00:00Z', description: 'Compare one-way, round-trip, seat, lounge and cabin fares for Cox\'s Bazar to Saint Martin.' },
    { title: 'Saint Martin ship schedule and departure times', link: `${base}/saint-martin-ship-schedule`, pubDate: '2026-09-22T00:00:00Z', description: 'Check seasonal departure times, return schedules, jetty check-in points and operating status.' },
    { title: 'Saint Martin Travel Pass and QR ticket guide', link: `${base}/saint-martin-travel-pass`, pubDate: '2026-09-22T00:00:00Z', description: 'Learn what the Travel Pass and QR-coded ship ticket mean and what to verify before travel.' },
    { title: 'Saint Martin travel rules and restrictions', link: `${base}/saint-martin-travel-rules`, pubDate: '2026-09-22T00:00:00Z', description: 'Visitor limits, overnight stays, environmental restrictions and ticket checks for Saint Martin Island.' },
    { title: 'Saint Martin travel guide for ship passengers', link: `${base}/saint-martin-guide`, pubDate: '2026-09-22T00:00:00Z', description: 'Practical guide covering ships, tickets, schedule, Travel Pass, jetty and trip preparation.' },
    { title: 'Cox\'s Bazar to Saint Martin ship route guide', link: `${base}/routes/coxs-bazar-to-saint-martin`, pubDate: '2026-09-22T00:00:00Z', description: 'Understand the route, jetty, check-in, ticket types and Travel Pass requirements.' },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>ShipTickets.bd — Saint Martin ship ticket updates</title>
    <description>Latest verified information about Saint Martin ship tickets, fares, schedules and travel rules.</description>
    <link>${base}</link>
    <lastBuildDate>${now}</lastBuildDate>
    ${items.map((item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid>${item.link}</guid>
      <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
      <description>${escapeXml(item.description)}</description>
    </item>`).join('')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400',
    },
  })
}