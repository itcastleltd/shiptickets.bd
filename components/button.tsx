import Link from 'next/link'

/**
 * Shared button styles.
 *
 * The same three looks were hand-written as long className strings on almost
 * every card, ticket block and CTA, which is why call-to-action buttons drifted
 * apart in padding, radius and hover behaviour. These are referenced by meaning
 * so a button is chosen by role rather than by remembering a class string.
 *
 * Focus outlines are global (see app/globals.css), so these classes only have
 * to carry size, weight and colour.
 */
type ButtonVariant = 'primary' | 'secondary' | 'quiet'
type ButtonSize = 'sm' | 'md'

const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-full font-extrabold transition disabled:cursor-not-allowed'

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  // Solid brand-ink. One primary action per card, so the eye knows where to go.
  primary: 'bg-brand-ink text-white hover:bg-[#13734f]',
  // Outlined. Pairs with a primary as the lower-commitment option.
  secondary: 'border border-line bg-white text-ink hover:border-brand-ink hover:text-brand-ink',
  // Text-only, for use inside dense panels such as the dark booking CTA.
  quiet: 'border border-white/25 text-white hover:bg-white/10',
}

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2.5 text-xs',
  md: 'px-5 py-3 text-sm',
}

export function buttonClass({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return [BUTTON_BASE, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className].filter(Boolean).join(' ')
}

/**
 * An internal link that looks like a button.
 *
 * Buttons on this site are links, not form submissions: nothing is bought or
 * booked on-site, so a real <a>/<Link> is the correct element and keeps
 * middle-click, right-click and keyboard behaviour working. This wrapper only
 * exists so the styling is shared.
 */
export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
}: {
  href: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link href={href} className={buttonClass({ variant, size, className })}>
      {children}
    </Link>
  )
}
