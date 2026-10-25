import { Plus } from 'lucide-react'

export function FaqAccordion({
  items,
  heading = 'FAQ',
  headingBn,
  id,
}: {
  items: [string, string][]
  heading?: string
  headingBn?: string
  id?: string
}) {
  if (items.length === 0) return null

  return (
    <section id={id} className="mb-10 rounded-3xl border border-line-soft bg-white p-6 md:p-8">
      <h2 className="t-title">{heading}</h2>
      {headingBn && <p className="mt-1 text-sm font-semibold text-brand-ink">{headingBn}</p>}
      <div className="mt-4 flex flex-col divide-y divide-line-soft">
        {items.map(([question, answer]) => (
          <details key={question} className="group">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 font-extrabold text-ink marker:content-none">
              <span className="t-body">{question}</span>
              <span
                className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#eaf5f3] text-brand-ink transition group-open:rotate-45"
                aria-hidden="true"
              >
                <Plus size={15} />
              </span>
            </summary>
            <p className="t-body t-measure pb-5 text-prose">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}