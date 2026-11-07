import { Banknote, RefreshCcw, Ticket } from 'lucide-react'
import type { TicketDelivery } from '@/lib/bookings/validate'

const taka = (amount: number) => `৳${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`

const TICKET_TEXT: Record<TicketDelivery, string> = {
  office: 'কাওরান বাজার অফিস থেকে টিকেট নেবেন, কুরিয়ার খরচ নেই।',
  courier_dhaka: 'হোম ডেলিভারি, ঢাকার ভেতরে (পরদিন)। কুরিয়ার খরচ ৳80 পেমেন্টের সঙ্গে যোগ হয়েছে।',
  courier_outside: 'হোম ডেলিভারি, ঢাকার বাইরে (৩ দিন)। কুরিয়ার খরচ ৳130 পেমেন্টের সঙ্গে যোগ হয়েছে।',
}

function Point({ icon: Icon, children }: { icon: typeof Ticket; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[#a15c07]" />
      <div className="min-w-0">{children}</div>
    </li>
  )
}

/** The terms a customer must see before paying, and again after booking. Balance follows the amount chosen. */
export function BookingNotice({ title, delivery, balance, onChangeDelivery }: { title: string; delivery?: TicketDelivery | ''; balance: number; onChangeDelivery?: () => void }) {
  return (
    <section lang="bn" aria-label={title} className="rounded-2xl border-2 border-[#e9b872] bg-[#fff8ee] p-4">
      <h3 className="font-extrabold leading-snug text-ink">{title}</h3>
      <ul className="mt-3 grid gap-3 text-sm leading-relaxed text-ink">
        <Point icon={Ticket}>
          <p>
            {delivery ? TICKET_TEXT[delivery] : 'প্রিন্ট করা টিকেট অফিস থেকে নিন, অথবা কুরিয়ারে নিন।'} <strong>প্রিন্ট করা টিকেট ছাড়া জাহাজে ওঠা যাবে না।</strong>
          </p>
          {onChangeDelivery && <button type="button" lang="en" onClick={onChangeDelivery} className="-mb-2 inline-flex min-h-11 cursor-pointer items-center font-bold text-brand-ink underline underline-offset-2">Change Delivery Method</button>}
        </Point>
        {balance > 0 && (
          <Point icon={Banknote}>
            <p>বাকি <strong className="tabular-nums">{taka(balance)}</strong> টিকেট ইস্যু, সংগ্রহ বা ডেলিভারির সময় দেবেন।</p>
          </Point>
        )}
        <Point icon={RefreshCcw}>
          <p>সিট বা কেবিন না পেলে অন্য তারিখ বা জাহাজ বেছে নিতে পারবেন, অথবা <strong>পুরো টাকা ফেরত পাবেন</strong>।</p>
        </Point>
      </ul>
    </section>
  )
}
