import type { ReactNode } from 'react'
import { BanglaBox, GuideHero, inlineLink, pageMeta, pageUrl, phoneHref } from '@/components/page-kit'
import { Schema, SeoPage, breadcrumbSchema, siteSchema, websiteSchema } from '@/components/seo-page'
import { PHONE_NUMBER } from '@/lib/ships'

const path = '/privacy-policy'
const h1 = 'Privacy Policy'
const description = 'How ShipTickets.bd collects, uses and protects your name, phone number and travel details when you ask about or book Saint Martin ship tickets.'

export const metadata = pageMeta({ title: h1, description, path })

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line-soft pt-6 first:border-t-0 first:pt-0">
      <h2 className="t-subtitle text-ink">{title}</h2>
      <div className="t-body mt-2 space-y-2 text-prose">{children}</div>
    </section>
  )
}

function Hero() {
  return (
    <GuideHero
      crumbs={[{ name: 'Home', href: '/' }, { name: 'Privacy Policy' }]}
      h1={h1}
      lede={<><strong className="font-extrabold text-ink">We use your details only to help with your ticket, and we don’t sell them.</strong> This page explains how ShipTickets.bd handles information shared on our website and during support conversations.</>}
      updated="6 November 2026"
    />
  )
}

export default function PrivacyPage() {
  return (
    <SeoPage eyebrow="Policy · নীতি" title={h1} intro={description} canonical={pageUrl(path)} modifiedISO="2026-11-06" updated="6 November 2026" hero={<Hero />} backToTopDesktopOnly>
      <div className="mb-12 grid max-w-3xl gap-6">
        <Block title="Information we collect">
          <ul className="list-disc space-y-1 pl-5">
            <li>Name and phone or WhatsApp number when you contact us</li>
            <li>Travel date, passenger count and preferred ship or class when you share booking details</li>
            <li>When you book online: your name, mobile number, email, co-passenger names, how you will get your ticket, your delivery address if you choose courier, and payment Transaction ID</li>
            <li>When you complete a booking on WhatsApp: your payment screenshot, NID number and date of birth, which are needed for your ticket and Travel Pass</li>
            <li>Basic website usage data such as pages visited and referral source</li>
          </ul>
        </Block>
        <Block title="How we use your information">
          <ul className="list-disc space-y-1 pl-5">
            <li>Answer your questions about Saint Martin ship tickets, fares and schedules</li>
            <li>Help our support team confirm availability and Travel Pass details</li>
            <li>Improve the information and layout of our website</li>
          </ul>
        </Block>
        <Block title="How we share your information">
          <p>We do not sell your personal information. When you request booking support, we may share your travel details with our support team and relevant operator channels only to help confirm your ticket. Any sharing is limited to what is needed for your request.</p>
        </Block>
        <Block title="How long we keep your information">
          <p>While you fill in the booking form, your answers are saved only in that browser tab, so a reload doesn’t lose them. They are removed when you submit your booking or close the tab, or after 6 hours.</p>
          <p>We keep your booking details for about one year after your journey. We then remove your name, mobile number, email and passenger details from our booking records. We keep the booking reference, ship, dates, amounts and Transaction ID for our accounts.</p>
          <p>Messages you send us on WhatsApp are kept in WhatsApp and are not part of this automatic removal. You can ask us to delete them at any time.</p>
        </Block>
        <Block title="Cookies and analytics">
          <p>We use Google Tag Manager, analytics and the Meta Pixel to understand how visitors use the site and to measure our advertising. These tools may set cookies. You can control cookies through your browser settings.</p>
        </Block>
        <Block title="Contact and data requests">
          <p>If you have questions about your data or want to request deletion, contact us on WhatsApp or phone at <a href={phoneHref} className={inlineLink}>{PHONE_NUMBER}</a>. We will respond within a reasonable timeframe.</p>
        </Block>
      </div>

      <BanglaBox id="bangla" title="গোপনীয়তা নীতি, সংক্ষেপে">
        <p>আমরা আপনার ভ্রমণের তথ্য নিই শুধু টিকেট বুকিং, ভাড়া নিশ্চিত করা ও সমস্যা সমাধানের জন্য। আপনার তথ্য আমরা বিক্রি করি না। প্রয়োজন হলে শুধু আপনার অনুরোধ পূরণের জন্য আমাদের সাপোর্ট টিম বা জাহাজ কর্তৃপক্ষকে জানানো হতে পারে।</p>
        <p>যাত্রার প্রায় এক বছর পর আমাদের বুকিংয়ের রেকর্ড থেকে আপনার নাম, মোবাইল নম্বর, ইমেইল ও যাত্রীদের তথ্য মুছে ফেলা হয়। হিসাবের জন্য শুধু বুকিং রেফারেন্স, জাহাজ, তারিখ, টাকার পরিমাণ ও ট্রানজেকশন আইডি রাখা হয়। WhatsApp-এ পাঠানো মেসেজ এই স্বয়ংক্রিয় প্রক্রিয়ায় মোছে না, তবে আপনি মুছে ফেলার অনুরোধ করতে পারেন।</p>
        <p>ওয়েবসাইট কীভাবে ব্যবহার হয় ও বিজ্ঞাপনের ফল বুঝতে আমরা Google ও Meta-র টুল ব্যবহার করি, যা কুকি রাখতে পারে। ব্রাউজারের সেটিংস থেকে কুকি নিয়ন্ত্রণ করতে পারবেন। আপনি যেকোনো সময় আপনার তথ্য মুছে ফেলার অনুরোধ করতে পারেন।</p>
      </BanglaBox>

      <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Privacy Policy', url: path }])] }} />
    </SeoPage>
  )
}
