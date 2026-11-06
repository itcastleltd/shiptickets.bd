import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SeasonBar } from '@/components/season-bar'

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="min-h-screen bg-[#f7fbfa] text-ink">
      <SeasonBar />
      <Header />
      <div className="mx-auto max-w-6xl px-4 py-5 md:px-5 md:py-8 lg:pb-10">{children}</div>
      <Footer />
    </main>
  )
}
