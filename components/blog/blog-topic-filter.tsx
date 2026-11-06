'use client'

import { Children, useState, type ReactElement, type ReactNode } from 'react'

/**
 * Topic buttons for the blog list. Every post stays in the HTML, so crawlers
 * see all of them. Filtering only hides cards in the visitor's browser.
 */
export function BlogTopicFilter({ topics, children }: { topics: readonly { id: string; label: string }[]; children: ReactNode }) {
  const [active, setActive] = useState('all')
  const cards = Children.toArray(children) as ReactElement<{ 'data-topic': string }>[]

  return (
    <>
      <div role="group" aria-label="বিষয় বেছে নিন" className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {topics.map((topic) => (
          <button
            key={topic.id}
            type="button"
            aria-pressed={active === topic.id}
            onClick={() => setActive(topic.id)}
            className={`min-h-11 shrink-0 cursor-pointer rounded-full px-4 text-sm font-bold transition duration-200 ${active === topic.id ? 'bg-brand-ink text-white' : 'border border-line-soft bg-white text-prose hover:border-brand-ink hover:text-brand-ink'}`}
          >
            {topic.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.key} hidden={active !== 'all' && card.props['data-topic'] !== active}>{card}</div>
        ))}
      </div>
    </>
  )
}
