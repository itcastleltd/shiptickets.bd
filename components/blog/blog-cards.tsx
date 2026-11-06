import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { BlogPost } from '@/content/blog'
import { banglaDate, blogImage, modifiedISO, readingMinutes, toBanglaDigits, topicLabel } from '@/lib/blog-helpers'

/** A post's image, or the no-image picture until one is added. */
export function BlogCover({ post, sizes, priority, className = '' }: { post: BlogPost; sizes: string; priority?: boolean; className?: string }) {
  const src = blogImage(post)
  return (
    <div className={`relative overflow-hidden ${src ? 'bg-[#0d1b2a]' : 'bg-[#e7e7e7]'} ${className}`}>
      {src ? (
        <Image src={src} alt={post.imageAlt || post.titleBn} fill sizes={sizes} priority={priority} fetchPriority={priority ? 'high' : undefined} className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
      ) : (
        <Image src="/no-image.jpg" alt="" fill sizes="(min-width: 640px) 240px, 50vw" className="object-contain" />
      )}
    </div>
  )
}

export function PostMeta({ post }: { post: BlogPost }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] font-semibold text-quiet">
      <time dateTime={modifiedISO(post)}>{banglaDate(modifiedISO(post))}</time>
      <span className="inline-flex items-center gap-1"><Clock size={13} aria-hidden="true" /> {toBanglaDigits(readingMinutes(post))} মিনিট</span>
    </p>
  )
}

export function BlogCard({ post, headingAs: Heading = 'h3', showSummary = true }: { post: BlogPost; headingAs?: 'h3' | 'p'; showSummary?: boolean }) {
  return (
    <article lang="bn" className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line-soft bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-raised">
      <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true">
        <BlogCover post={post} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="aspect-[16/9]" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.8125rem] font-bold text-brand-ink">{topicLabel(post)}</p>
        <Heading className="mt-1 text-lg font-extrabold leading-snug text-ink">
          <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-brand-ink">{post.titleBn}</Link>
        </Heading>
        {showSummary && <p className="t-small mt-2 line-clamp-3 text-prose">{post.descriptionBn}</p>}
        <div className="mt-auto pt-3"><PostMeta post={post} /></div>
      </div>
    </article>
  )
}
