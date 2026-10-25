import type { Metadata } from 'next'
import { BanglaSummary } from '@/components/bangla-summary'
import { SeoPage, Section, Bullet, Schema, siteSchema, websiteSchema, breadcrumbSchema, ProseSection } from '@/components/seo-page'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'ShipTickets.bd privacy policy — how we handle your data, contact information and travel details.',
  openGraph: { title: 'Privacy Policy — ShipTickets.bd', description: 'How ShipTickets.bd handles your data and contact information.', images: [{ url: '/og_image.png', width: 1200, height: 630 }] },
  alternates: { canonical: 'https://www.shiptickets.bd/privacy-policy' },
}

export default function PrivacyPage() {
  return <SeoPage eyebrow="Policy · নীতি" title="Privacy Policy" intro="This page explains how ShipTickets.bd handles information shared on our website and during support conversations.">
    <BanglaSummary path="/privacy-policy" />
    <Section title="Information we collect">
      <ul className="grid gap-3"><Bullet>Name and phone or WhatsApp number when you contact us</Bullet><Bullet>Travel date, passenger count and preferred ship or class when you share booking details</Bullet><Bullet>Basic website usage data such as pages visited and referral source</Bullet></ul>
    </Section>
    <Section title="How we use your information">
      <ul className="grid gap-3"><Bullet>Answer your questions about Saint Martin ship tickets, fares and schedules</Bullet><Bullet>Help our support team confirm availability and Travel Pass requirements</Bullet><Bullet>Improve the information and layout of our website</Bullet></ul>
    </Section>
    <ProseSection title="How we share your information">
      <p>We do not sell your personal information. When you request booking support, we may share your travel details with our support team and relevant operator channels only to help confirm your ticket. Any sharing is limited to what is needed for your request.</p>
    </ProseSection>
    <ProseSection title="Contact and data requests">
      <p>If you have questions about your data or want to request deletion, contact us on WhatsApp or phone. We will respond within a reasonable timeframe.</p>
    </ProseSection>
    <ProseSection title="Cookies and analytics">
      <p>We use basic analytics to understand how visitors use the site. You can control cookies through your browser settings. We do not use tracking cookies for advertising.</p>
    </ProseSection>
    <Schema data={{ '@context': 'https://schema.org', '@graph': [siteSchema, websiteSchema, { '@type': 'WebPage', name: 'Privacy Policy', isPartOf: { '@id': 'https://www.shiptickets.bd/#website' } }, breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Privacy Policy' }])] }} />
  </SeoPage>
}