import { existsSync } from 'node:fs'
import path from 'node:path'
import type { BlogPost } from '@/content/blog'

const EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png']
const inPublic = (src: string) => existsSync(path.join(process.cwd(), 'public', src))

/**
 * A post's image. Adding public/blog/<post slug>.jpg (or .webp, .jpeg, .png)
 * is all that is needed. Until then this uses the post's `thumbnail` if that
 * file exists, and otherwise returns null so the page shows /no-image.jpg.
 */
export function blogImage(post: BlogPost): string | null {
  for (const extension of EXTENSIONS) {
    const src = `/blog/${post.slug}.${extension}`
    if (inPublic(src)) return src
  }
  return post.thumbnail && inPublic(post.thumbnail) ? post.thumbnail : null
}

const BANGLA_DIGITS = '০১২৩৪৫৬৭৮৯'
export const toBanglaDigits = (value: number | string) => String(value).replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)])

export const banglaDate = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export const postText = (post: BlogPost) => post.content.map((block) => `${block.heading ?? ''} ${block.body}`).join(' ').replace(/\[(.+?)\]\(.+?\)/g, '$1').replace(/[|*#>]/g, ' ')

export const wordCount = (post: BlogPost) => postText(post).split(/\s+/).filter(Boolean).length

/** Reading time in minutes, at about 200 words a minute. */
export const readingMinutes = (post: BlogPost) => Math.max(1, Math.round(wordCount(post) / 200))

export const modifiedISO = (post: BlogPost) => post.updated ?? post.date

/** The most recently published posts first. Posts added later come before older ones of the same date. */
export const newestFirst = (posts: BlogPost[]) => posts.map((post, index) => ({ post, index })).sort((a, b) => b.post.date.localeCompare(a.post.date) || b.index - a.index).map(({ post }) => post)

/** Posts with a photo come first, keeping their order, so lists don't open with placeholders. */
export const photosFirst = (posts: BlogPost[]) => [...posts.filter((post) => blogImage(post)), ...posts.filter((post) => !blogImage(post))]

export const QUICK_ANSWER_LABEL = '**দ্রুত উত্তর:**'

/** Moves a "দ্রুত উত্তর" paragraph out of the body, so it shows once, at the top of the post. */
export function splitQuickAnswer(post: BlogPost): { quick: string | null; content: BlogPost['content'] } {
  if (post.quickAnswerBn) return { quick: post.quickAnswerBn, content: post.content }
  let quick: string | null = null
  const content = post.content.map((block) => {
    const paragraphs = block.body.split('\n\n')
    const index = paragraphs.findIndex((paragraph) => paragraph.trim().startsWith(QUICK_ANSWER_LABEL))
    if (index === -1 || quick) return block
    quick = paragraphs[index].trim().slice(QUICK_ANSWER_LABEL.length).trim()
    paragraphs.splice(index, 1)
    return { ...block, body: paragraphs.join('\n\n') }
  })
  return { quick, content }
}

export const TOPICS = [
  { id: 'all', label: 'সব লেখা' },
  { id: 'fares', label: 'ভাড়া ও টিকেট' },
  { id: 'ships', label: 'জাহাজ' },
  { id: 'rules', label: 'নিয়ম ও ট্রাভেল পাস' },
  { id: 'plan', label: 'ভ্রমণ পরিকল্পনা' },
] as const

const TOPIC_OF_TAG: Record<string, string> = {
  price: 'fares', tickets: 'fares', cheapest: 'fares', booking: 'fares', cost: 'plan', budget: 'plan', travel: 'plan', dhaka: 'plan', distance: 'plan', route: 'plan', teknaf: 'plan',
  comparison: 'ships', ships: 'ships', news: 'ships', rules: 'rules', 'travel pass': 'rules', overnight: 'rules',
}

export const postTopic = (post: BlogPost) => TOPIC_OF_TAG[post.tags[0]] ?? 'plan'
export const topicLabel = (post: BlogPost) => TOPICS.find((topic) => topic.id === postTopic(post))?.label ?? 'ভ্রমণ পরিকল্পনা'
