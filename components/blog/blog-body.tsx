const SITE = /^https?:\/\/(www\.)?shiptickets\.bd/

function linkHtml(text: string, url: string) {
  const internal = url.startsWith('/') || SITE.test(url)
  if (internal) {
    // Same-site links are relative and without a trailing slash, so crawlers never hit a redirect.
    const href = url.replace(SITE, '').replace(/(.)\/$/, '$1') || '/'
    return `<a href="${href}" class="font-semibold text-brand-ink underline underline-offset-2 hover:text-[#13734f]">${text}</a>`
  }
  return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="font-semibold text-brand-ink underline underline-offset-2 hover:text-[#13734f]">${text}<span aria-hidden="true" class="ml-0.5 text-[0.8em]">↗</span><span class="sr-only"> (অন্য সাইটে খুলবে)</span></a>`
}

function inline(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-extrabold text-ink">$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, (_, label: string, url: string) => linkHtml(label, url))
}

type Block =
  | { type: 'paragraph'; lines: string[] }
  | { type: 'h2' | 'h3'; text: string }
  | { type: 'ul' | 'ol'; items: string[] }
  | { type: 'quote'; lines: string[] }
  | { type: 'table'; rows: string[][] }

function parse(body: string): Block[] {
  const blocks: Block[] = []
  const lines = body.split('\n').map((line) => (line.includes('\t') ? `| ${line.split('\t').map((cell) => cell.trim()).join(' | ')} |` : line.trim()))
  const last = () => blocks[blocks.length - 1]

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line) continue

    if (line.startsWith('|')) {
      const cells = line.split('|').map((cell) => cell.trim()).filter(Boolean)
      if (cells.length === 0 || cells.every((cell) => /^:?-+:?$/.test(cell))) continue
      const previous = last()
      if (previous?.type === 'table') previous.rows.push(cells)
      else blocks.push({ type: 'table', rows: [cells] })
      continue
    }
    if (line.startsWith('### ')) { blocks.push({ type: 'h3', text: line.slice(4) }); continue }
    if (line.startsWith('## ')) { blocks.push({ type: 'h2', text: line.slice(3) }); continue }
    if (line.startsWith('> ')) {
      const previous = last()
      if (previous?.type === 'quote' && !lines[i - 1] === false) previous.lines.push(line.slice(2))
      else blocks.push({ type: 'quote', lines: [line.slice(2)] })
      continue
    }
    if (/^[-*]\s+/.test(line)) {
      const item = line.replace(/^[-*]\s+/, '').replace(/^\[ \]\s*/, '☐ ').replace(/^\[x\]\s*/i, '☑ ')
      const previous = last()
      if (previous?.type === 'ul' && (lines[i - 1] || lines[i - 2]?.match(/^[-*]\s+/))) previous.items.push(item)
      else blocks.push({ type: 'ul', items: [item] })
      continue
    }
    if (/^\d+\.\s+/.test(line)) {
      const item = line.replace(/^\d+\.\s+/, '')
      const previous = last()
      if (previous?.type === 'ol') previous.items.push(item)
      else blocks.push({ type: 'ol', items: [item] })
      continue
    }
    const previous = last()
    if (previous?.type === 'paragraph' && lines[i - 1]) previous.lines.push(line)
    else blocks.push({ type: 'paragraph', lines: [line] })
  }
  return blocks
}

/** Renders a post's lightweight Markdown: headings, lists, tables, callouts, bold and links. */
export function BlogBody({ body }: { body: string }) {
  return (
    <>
      {parse(body).map((block, index) => {
        switch (block.type) {
          case 'h2':
            return <h3 key={index} className="mb-2 mt-7 text-xl font-extrabold leading-snug text-ink" dangerouslySetInnerHTML={{ __html: inline(block.text) }} />
          case 'h3':
            return <h3 key={index} className="mb-1.5 mt-6 text-lg font-extrabold leading-snug text-ink" dangerouslySetInnerHTML={{ __html: inline(block.text) }} />
          case 'ul':
            return (
              <ul key={index} className="my-4 list-disc space-y-2 pl-6 marker:text-brand">
                {block.items.map((item, position) => <li key={position} dangerouslySetInnerHTML={{ __html: inline(item) }} />)}
              </ul>
            )
          case 'ol':
            return (
              <ol key={index} className="my-4 list-decimal space-y-2 pl-6 marker:font-bold marker:text-brand-ink">
                {block.items.map((item, position) => <li key={position} dangerouslySetInnerHTML={{ __html: inline(item) }} />)}
              </ol>
            )
          case 'quote':
            return <blockquote key={index} className="my-5 rounded-r-2xl border-l-4 border-brand bg-[#f1f8f6] px-4 py-3 text-ink" dangerouslySetInnerHTML={{ __html: inline(block.lines.join('<br/>')) }} />
          case 'table':
            return (
              <div key={index} tabIndex={0} role="region" aria-label="তথ্যের টেবিল" className="my-5 overflow-x-auto rounded-2xl border border-line-soft">
                <table className={`w-full border-collapse text-left text-[0.9375rem] ${block.rows[0].length > 3 ? 'min-w-[520px]' : ''}`}>
                  <thead className="bg-[#e3ecea] text-ink">
                    <tr>{block.rows[0].map((cell, position) => <th key={position} scope="col" className="px-3 py-3 font-extrabold" dangerouslySetInnerHTML={{ __html: inline(cell) }} />)}</tr>
                  </thead>
                  <tbody>
                    {block.rows.slice(1).map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t border-line-soft odd:bg-white even:bg-[#f7fbfa]">
                        {row.map((cell, position) => <td key={position} className="px-3 py-3 align-top" dangerouslySetInnerHTML={{ __html: inline(cell) }} />)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          default:
            return <p key={index} className="my-4" dangerouslySetInnerHTML={{ __html: inline(block.lines.join('<br/>')) }} />
        }
      })}
    </>
  )
}
