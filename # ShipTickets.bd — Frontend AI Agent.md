# ShipTickets.bd — Frontend AI Agent Instructions

## 1. Project Objective

Build **ShipTickets.bd** as a Bangladesh-focused Saint Martin ship ticket information and lead-conversion website.

The first version is **frontend-only**.

Do NOT build a complex backend, booking engine, user account system, payment gateway, inventory system, or real-time ticket management system at this stage.

The primary objective is:

**SEO Traffic → Helpful Information → Trust → Ship/Ticket Interest → WhatsApp or Phone Call**

The website must target both:

* 🇧🇩 Bangla-speaking users
* 🇬🇧 English-speaking/searching users in Bangladesh

It must also naturally accommodate **Banglish search behavior**.

---

# 2. Core Brand Positioning

Brand:

**ShipTickets.bd**

Primary positioning:

**Saint Martin Ship Tickets, Made Simple.**

Supporting message:

**Compare ships. Check fares. Verify schedules. Book with confidence.**

Bangla:

**সেন্টমার্টিনের জাহাজের টিকিট, ভাড়া ও সময়সূচি—সব এক জায়গায়।**

The website should feel like a specialized Saint Martin ship-ticket information platform, NOT a generic travel agency.

---

# 3. Main Conversion Goal

Every important page should guide users toward one of two primary actions:

### Primary CTA

**WhatsApp for Ticket / টিকিটের জন্য WhatsApp করুন**

### Secondary CTA

**Call for Ticket / ফোন করে টিকিট নিন**

Use sticky/mobile CTAs where appropriate.

Mobile users are extremely important.

Recommended mobile bottom bar:

```text
[ WhatsApp ]    [ Call Now ]
```

Desktop:

```text
[ WhatsApp for Ticket ] [ Call Now ]
```

Do not overwhelm the page with CTAs.

The CTA should appear naturally after useful information and at important decision points.

---

# 4. Conversion Philosophy

Do NOT use aggressive sales copy.

The user is usually searching for:

* ticket price
* ship name
* schedule
* cabin
* availability
* route
* travel rules
* Travel Pass
* how to go
* whether tickets are available

First answer the question.

Then offer assistance.

Example:

> সেন্টমার্টিন জাহাজের টিকিটের বর্তমান ভাড়া ও availability জানতে WhatsApp-এ আমাদের সাথে যোগাযোগ করুন।

English:

> Want to confirm the latest fare or ticket availability? Contact us on WhatsApp.

The site should feel:

**Helpful → trustworthy → easy to contact.**

---

# 5. No Backend for V1

Do NOT implement:

* login
* registration
* user dashboard
* database
* online payment
* booking engine
* ticket inventory
* seat selection
* automated ticket issuance
* complex CMS
* real-time availability API
* customer accounts

For now, use static/frontend data.

If ship/fare/schedule data is displayed, clearly indicate:

**Last verified:** [date]

Use:

* Verified
* Last updated
* Subject to availability
* Subject to current government rules

Never pretend static frontend data is real-time.

---

# 6. Content Architecture

Initial core pages:

```text
/
 /saint-martin-ship-ticket/
 /saint-martin-ship-ticket-price/
 /saint-martin-ship-schedule/
 /saint-martin-ship-booking/
 /saint-martin-travel-pass/
 /saint-martin-travel-rules/

 /ships/
 /ships/karnafuly-express/
 /ships/baro-awlia/
 /ships/keari-sindbad/
 /ships/keari-cruise-dine/
 /ships/bay-cruiser/
 /ships/bay-one/

 /routes/coxs-bazar-to-saint-martin/

 /ticket/cabin/
 /ticket/vip/

 /saint-martin-guide/
 /saint-martin-guide/how-to-go/
 /saint-martin-guide/jetty/
 /saint-martin-guide/faq/

 /about/
 /contact/
 /refund-policy/
 /booking-policy/
 /privacy-policy/

 /blog/
```

Do not create thin pages simply to increase the number of URLs.

Every indexed page must provide a distinct search intent and useful information.

---

# 7. SEO Language Strategy

The website targets:

### English

Examples:

* Saint Martin ship ticket
* Saint Martin ship ticket price
* Saint Martin ship schedule
* Saint Martin ship booking
* Cox's Bazar to Saint Martin ship
* Saint Martin ship cabin
* Karnafuly Express ticket
* Baro Awlia ticket

### Bangla

Examples:

* সেন্টমার্টিন জাহাজের টিকিট
* সেন্টমার্টিন জাহাজের টিকিটের দাম
* সেন্টমার্টিন যাওয়ার জাহাজ
* কক্সবাজার থেকে সেন্টমার্টিন জাহাজ
* সেন্টমার্টিন জাহাজের সময়সূচি
* সেন্টমার্টিন জাহাজের কেবিন
* সেন্টমার্টিন যাওয়ার নিয়ম

### Banglish

Examples:

* saint martin ship ticket koto
* saint martin ship ticket price koto
* saint martin jawar ship
* cox bazar theke saint martin ship
* saint martin ship er ticket
* saint martin ship cabin price
* karnafuly express ticket koto
* baro awlia ticket price

Do NOT create separate pages for every spelling variation.

Map multiple keyword variations to the same search intent/page.

---

# 8. URL Strategy

Use clean English URLs.

Example:

```text
/saint-martin-ship-ticket/
/saint-martin-ship-ticket-price/
/saint-martin-ship-schedule/
/ships/karnafuly-express/
```

Do not use Bangla URLs for V1.

URLs should be:

* short
* descriptive
* lowercase
* hyphenated
* permanent

Avoid:

```text
/page?id=123
/saint-martin-ticket-new-final
/st-martin-ship-2026
```

Avoid putting changing years into permanent core URLs.

---

# 9. Homepage Requirements

Homepage must immediately explain what ShipTickets.bd does.

Hero:

# Saint Martin Ship Ticket

Supporting copy:

**সেন্টমার্টিনের জাহাজের টিকিট, ভাড়া, সময়সূচি ও কেবিনের তথ্য এক জায়গায়।**

English supporting copy:

**Compare available ships, ticket classes, fares, schedules and facilities for Saint Martin Island.**

Primary CTA:

**WhatsApp for Ticket**

Secondary CTA:

**Call Now**

---

# 10. Homepage Search/Discovery UI

Create a frontend search/filter component.

Fields:

```text
From
To
Travel Date
Passengers
```

Default:

```text
From: Cox's Bazar
To: Saint Martin
```

CTA:

**Search Ships**

This does NOT need backend functionality yet.

For V1 it can:

* filter static ship data
* scroll to available ships
* show relevant ship cards
* or route users to a comparison section

Do not pretend it is a real-time inventory system.

---

# 11. Homepage Sections

Recommended order:

1. Hero
2. Search/Trip selector
3. Quick answer
4. Available ships
5. Ticket price overview
6. Ship comparison
7. Popular ticket types
8. How booking works
9. Saint Martin travel rules
10. Travel Pass information
11. FAQ
12. Trust/verification section
13. WhatsApp CTA
14. Footer

---

# 12. Ship Cards

Every ship card should contain factual information.

Example:

```text
Karnafuly Express

Route
Cox's Bazar → Saint Martin

Ticket From
৳XXXX

Ticket Types
Open Deck
Lounge
Cabin
VIP

Departure
XX:XX AM

Status
Verified / Needs Confirmation

Last verified
DD Month YYYY

[View Ship]
[WhatsApp]
```

Do not use unsupported claims such as:

* Best ship
* No. 1 ship
* Luxury ship
* Cheapest ship
* Fastest ship

unless objectively supported and appropriately qualified.

Prefer factual filters:

* Cabin available
* Open deck
* AC
* Lounge
* VIP
* Family cabin
* Price range

---

# 13. Ship Detail Page

Every ship page should follow the same structure.

Example:

```text
# Karnafuly Express Saint Martin Ticket

Quick Facts

Operator
Route
Departure
Return
Journey duration
Ticket classes
Cabin options
Starting fare
Status
Last verified
```

Then:

### Ticket Prices

Use structured cards/table.

### Ticket Classes

Explain each class.

### Cabin Information

If actual cabin data is available.

### Facilities

Only display verified facilities.

### Schedule

Only display verified schedule information.

### How to Book

Explain the WhatsApp/phone process.

### Cancellation / Refund

Only display confirmed policy.

### FAQ

Use question-based content.

### CTA

**Check Latest Ticket Availability on WhatsApp**

---

# 14. Price Pages

For:

```text
/saint-martin-ship-ticket-price/
```

The page must answer the user's question quickly.

H1:

**Saint Martin Ship Ticket Price | সেন্টমার্টিন জাহাজের টিকিটের দাম**

Immediately explain:

* current/last verified fare
* ticket type
* one-way/round trip if applicable
* cabin pricing
* factors affecting price
* availability

Every price must have:

```text
Last verified:
Source:
Season:
Status:
```

Never present old seasonal prices as current.

---

# 15. Schedule Pages

For:

```text
/saint-martin-ship-schedule/
```

Use a clear table:

| Ship | Departure | Arrival | Return | Status |
| ---- | --------- | ------- | ------ | ------ |

Each schedule entry must have a verification date.

If current schedule information is unavailable:

**Schedule information is currently awaiting confirmation.**

Do not invent schedules.

---

# 16. Important Seasonal Rule

Saint Martin ship operations are seasonal and government rules can change.

Never hardcode old season information as permanently current.

Use:

```text
Season
Last verified
Status
Source
```

Example:

**Last verified: 21 September 2026**

If information has not been verified for the current season:

**Needs confirmation**

This is better than showing potentially incorrect information.

---

# 17. Bangla + English UI

Use bilingual labels where useful.

Examples:

```text
Ticket Price / টিকিটের দাম

Schedule / সময়সূচি

Available Ships / available জাহাজ

Cabin / কেবিন

Booking / বুকিং

Travel Pass / ট্রাভেল পাস

Travel Rules / ভ্রমণ নিয়ম

Facilities / সুবিধাসমূহ
```

Don't translate every sentence twice.

Use natural Bangladeshi bilingual copy.

Example:

> সেন্টমার্টিন জাহাজের টিকিটের দাম জাহাজ ও ticket class অনুযায়ী পরিবর্তিত হতে পারে।

This is acceptable and natural.

---

# 18. AIO / AEO Strategy

The website must be optimized for:

* Google Search
* AI Overviews
* AI search systems
* Answer engines
* voice search
* conversational queries

Do NOT create special fake "AI content".

Instead:

**Answer the question clearly.**

Every major page should begin important sections with a short direct answer.

Example:

### How much is a Saint Martin ship ticket?

> Saint Martin ship ticket prices vary by ship and ticket class. Cabin, VIP and lounge options may have different fares. Check the latest verified fare before booking.

Bangla:

> সেন্টমার্টিন জাহাজের টিকিটের দাম জাহাজ ও টিকিটের ধরন অনুযায়ী ভিন্ন হতে পারে। কেবিন, VIP ও lounge-এর ভাড়া আলাদা হতে পারে।

Then provide detailed information.

---

# 19. FAQ Strategy

FAQ questions should reflect real search behavior.

Examples:

* সেন্টমার্টিন জাহাজের টিকিট কত?
* Saint Martin ship ticket price কত?
* How can I buy a Saint Martin ship ticket?
* কক্সবাজার থেকে সেন্টমার্টিন কোন জাহাজ যায়?
* সেন্টমার্টিন জাহাজ কখন ছাড়ে?
* Saint Martin ship cabin price কত?
* সেন্টমার্টিন যেতে Travel Pass লাগবে?
* সেন্টমার্টিন জাহাজের টিকিট কোথা থেকে পাওয়া যায়?
* Can I book a Saint Martin ship ticket by WhatsApp?
* What documents are required?

Answers must be concise, factual and useful.

---

# 20. Structured Data / JSON-LD

Implement JSON-LD on relevant pages.

Use valid schema types only.

Possible types:

### Website

```text
WebSite
Organization
WebPage
BreadcrumbList
```

### Ship/ticket pages

Where appropriate and semantically accurate:

```text
Product
Offer
Organization
BreadcrumbList
```

### Articles

```text
Article
BreadcrumbList
Person
Organization
```

### FAQ

Use FAQ structured data only when the page content and current Google eligibility/support justify it.

Do NOT invent:

```text
SaintMartinShip
ShipTicket
SaintMartinTicket
```

as schema types.

There is no need to create fake schema types.

---

# 21. JSON-LD Must Match Visible Content

Critical rule:

**Never put information into JSON-LD that users cannot see on the page.**

If price = ৳5,000 in schema, the visible page should also show that price.

If an offer is unavailable, do not mark it as available.

If a ship is not operating, don't create an active offer for it.

---

# 22. SEO Metadata

Every indexable page needs unique:

* `<title>`
* meta description
* canonical URL
* H1
* Open Graph title
* Open Graph description
* Open Graph image

Example:

Title:

**Saint Martin Ship Ticket | Price, Schedule & Booking**

Meta:

**Compare Saint Martin ship tickets, prices, schedules, cabins and facilities from Cox's Bazar. Check the latest verified information before booking.**

Do not keyword-stuff titles.

---

# 23. Heading Structure

Use:

```text
H1
  H2
    H3
```

Only one primary H1.

Example:

```text
H1: Saint Martin Ship Ticket

H2: Saint Martin Ship Ticket Price
H2: Available Ships
H2: Ticket Classes
  H3: Open Deck
  H3: Lounge
  H3: Cabin
  H3: VIP Cabin

H2: Saint Martin Ship Schedule
H2: How to Book
H2: Frequently Asked Questions
```

---

# 24. Internal Linking

Every important page should link to related pages.

Example:

Ship page:

```text
Karnafuly Express
↓
Saint Martin Ship Ticket
↓
Ticket Price
↓
Schedule
↓
Travel Pass
↓
Travel Rules
↓
How to Go
```

Use descriptive anchor text.

Good:

**Saint Martin ship ticket price**

Bad:

**Click here**

---

# 25. Breadcrumbs

Implement visible breadcrumbs.

Example:

```text
Home
>
Ships
>
Karnafuly Express
```

and JSON-LD BreadcrumbList.

---

# 26. Images

Use original or properly licensed images.

Every important image should have descriptive alt text.

Example:

```text
Karnafuly Express Saint Martin ship
```

Bangla where appropriate:

```text
কর্ণফুলী এক্সপ্রেস সেন্টমার্টিনগামী জাহাজ
```

Do not stuff keywords into alt text.

Optimize:

* WebP/AVIF
* responsive sizes
* lazy loading
* width/height attributes
* descriptive filenames

---

# 27. Technical SEO

Implement:

* HTTPS
* sitemap.xml
* robots.txt
* canonical URLs
* clean URLs
* 404 page
* proper redirects
* mobile responsive design
* fast loading
* Core Web Vitals
* semantic HTML
* accessible navigation
* image optimization
* proper heading hierarchy

Avoid unnecessary JavaScript rendering for critical SEO text.

Important content should exist in the initial HTML/SSR/static output whenever possible.

---

# 28. Framework Requirement

Use an SEO-friendly frontend architecture.

Prefer:

**Next.js / React with SSR or static generation**

or another framework that can generate crawlable HTML.

Avoid making the entire website a client-only SPA where Google/AI crawlers have to execute JavaScript to discover critical content.

---

# 29. Performance

Priority:

1. HTML/content
2. LCP
3. mobile performance
4. images
5. fonts
6. JavaScript

Avoid unnecessary:

* animation libraries
* large JS bundles
* video backgrounds
* heavy sliders
* excessive third-party scripts

The website should feel extremely fast on Bangladeshi mobile networks.

---

# 30. Mobile UX

Assume most users will visit from mobile.

Mobile-first design.

Important:

* large readable text
* sticky CTA
* thumb-friendly buttons
* compressed images
* simple tables
* horizontal scrolling for comparison tables
* short paragraphs
* clear prices
* easy WhatsApp access

---

# 31. WhatsApp CTA

Use a configurable WhatsApp number.

Do NOT hardcode the number throughout the application.

Create one frontend configuration value:

```text
WHATSAPP_NUMBER
PHONE_NUMBER
```

Then generate WhatsApp links dynamically.

Example message:

> Hello ShipTickets.bd, I want to know about Saint Martin ship tickets. Travel date: [date]. Passengers: [number].

Where possible, pre-fill the message based on the page.

For Karnafuly Express:

> Hello ShipTickets.bd, I want to book/check availability for Karnafuly Express to Saint Martin.

This improves lead quality.

---

# 32. Phone CTA

Use:

```html
<a href="tel:+880XXXXXXXXXX">
```

on mobile.

CTA:

**Call for Ticket**

or:

**টিকিটের জন্য কল করুন**

Do not make users search for the phone number.

---

# 33. Conversion Tracking

Prepare the frontend for GA4.

Track at minimum:

```text
whatsapp_click
phone_click
ship_view
ticket_interest
search_ships
faq_expand
booking_cta_click
```

Recommended event parameters:

```text
page_type
ship_name
ticket_type
travel_date
language
cta_position
```

Example:

```text
whatsapp_click

page_type = ship
ship_name = Karnafuly Express
cta_position = sticky_mobile
language = bn
```

This will allow us to understand which SEO pages actually generate leads.

---

# 34. UTM Support

The frontend must preserve UTM parameters.

Support:

```text
utm_source
utm_medium
utm_campaign
utm_content
utm_term
```

Do not build a backend for this.

The frontend can read URL parameters and use them for analytics/event attribution.

Example:

```text
?utm_source=facebook
&utm_medium=paid
&utm_campaign=saint_martin
&utm_content=karnafuly
```

When a user clicks WhatsApp or Call, retain campaign context in analytics where possible.

---

# 35. SEO Traffic → Conversion Funnel

Design the website around this funnel:

```text
Google Search
     ↓
SEO Landing Page
     ↓
Quick Answer
     ↓
Relevant Information
     ↓
Ship / Ticket Comparison
     ↓
Trust / Verification
     ↓
CTA
     ↓
WhatsApp / Phone
     ↓
Human-assisted booking
```

The frontend does not need to complete the booking.

The human support team can handle the final booking.

---

# 36. Trust Signals

Include:

### About ShipTickets.bd

Explain:

* who operates the platform
* what information it provides
* how ticket inquiries work
* how ship information is verified
* customer support

Also show:

```text
Information last verified
Source
Updated date
```

Do not create fake:

* reviews
* ratings
* customer counts
* booking numbers
* awards
* certifications

---

# 37. Reviews

If real customer reviews become available later:

Create a proper review section.

For now:

**Do not generate fake reviews.**

Do not add fake star ratings just to obtain rich results.

---

# 38. Content Quality Rules

Content must be:

* original
* factual
* Bangladesh-focused
* useful
* concise
* naturally bilingual
* easy to scan
* updated when information changes

Never copy competitor text.

Never rewrite competitor pages sentence-by-sentence.

Use competitor websites for research only.

---

# 39. Current Information Rules

Never invent:

* ship prices
* schedules
* routes
* cabins
* facilities
* capacity
* operators
* government rules
* Travel Pass requirements
* ticket availability

If information is unknown:

```text
Information currently unavailable
```

or:

```text
Needs confirmation
```

This is preferable to incorrect SEO content.

---

# 40. Ship Data Format for V1

Use a static TypeScript/JSON data structure.

Example:

```ts
{
  slug: "karnafuly-express",
  name: "Karnafuly Express",
  nameBn: "কর্ণফুলী এক্সপ্রেস",
  operator: "",
  route: "Cox's Bazar → Saint Martin",
  status: "needs_confirmation",
  lastVerified: "",
  source: "",
  ticketClasses: [],
  cabins: [],
  facilities: [],
  schedule: [],
  faq: []
}
```

This is NOT a backend database.

It is simply structured frontend content.

The architecture should make it easy to replace static data with an API/database later.

---

# 41. Future-Proof the Frontend

Although V1 has no backend, keep the components/data architecture clean enough that later we can add:

```text
Frontend
    ↓
API
    ↓
Database
    ↓
Live availability
    ↓
Booking
```

Do not tightly couple UI components to hardcoded text.

Use reusable components.

Recommended components:

```text
Header
Footer
Hero
SearchBox
ShipCard
ShipComparison
PriceTable
ScheduleTable
TicketClassCard
CabinCard
FAQ
Breadcrumb
TrustBadge
LastVerified
WhatsAppCTA
PhoneCTA
StickyMobileCTA
ArticleContent
RelatedPages
```

---

# 42. Do Not Overdesign

The website is a utility.

Prioritize:

**Information > decoration**

Avoid excessive:

* gradients
* animations
* giant hero videos
* complicated cards
* unnecessary popups
* intrusive newsletter forms
* full-screen signup prompts

The user came looking for a ticket.

Help them find the answer quickly.

---

# 43. Recommended Visual Style

Clean travel-tech design.

Use:

* white/light background
* strong typography
* blue/teal travel-oriented accents
* high-quality Saint Martin imagery
* clear cards
* generous spacing
* strong CTA buttons
* simple icons

Do not make it look like a generic airline website.

It should feel like:

**Bangladesh travel information + ticket discovery + modern travel technology.**

---

# 44. Homepage SEO Content

The homepage should naturally cover the semantic topic:

```text
Saint Martin ship ticket
Saint Martin ship ticket price
Saint Martin ship schedule
Cox's Bazar to Saint Martin ship
Saint Martin cabin
Saint Martin VIP ticket
Saint Martin Travel Pass
Saint Martin travel rules
Saint Martin ship booking
```

Do not repeatedly insert the keywords.

Use them where they naturally answer user questions.

---

# 45. Programmatic SEO

Do NOT mass-generate hundreds of pages.

Initial programmatic pages should be limited to genuine entities:

```text
Ship
Ticket class
Route
Travel guide
```

Only create a page when there is enough unique information to justify it.

Bad:

```text
/saint-martin-ticket-1
/saint-martin-ticket-2
/saint-martin-ticket-3
```

Good:

```text
/ships/karnafuly-express/
/ships/baro-awlia/
/ticket/cabin/
/routes/coxs-bazar-to-saint-martin/
```

---

# 46. AI Search / LLM Optimization

Make information easy for AI systems to understand.

Use:

* clear headings
* concise answers
* tables
* definitions
* factual statements
* dates
* source information
* entity names
* relationships between entities

Example:

```text
Ship:
Karnafuly Express

Route:
Cox's Bazar → Saint Martin

Operator:
[verified operator]

Ticket:
[verified ticket information]

Status:
[verified status]

Last verified:
[date]
```

This creates a clean information graph.

---

# 47. Entity Consistency

Always use the same canonical names.

Example:

```text
Saint Martin Island, Bangladesh
Karnafuly Express
Baro Awlia
Cox's Bazar
```

Do not randomly alternate between:

```text
Saint Martin
St Martin
St. Martin
Saint Martins
San Martin
```

in entity names.

Keyword variations can appear naturally in content, but the entity should remain consistent.

Important:

**Saint Martin Island, Bangladesh is NOT the Caribbean Saint Martin / Sint Maarten.**

The website must clearly establish the Bangladesh context.

---

# 48. Blog Strategy

Blog content should support commercial pages.

Examples:

```text
/blog/saint-martin-ship-ticket-guide/
/blog/how-to-go-saint-martin-from-coxs-bazar/
/blog/saint-martin-ship-cabin-guide/
/blog/saint-martin-travel-pass-guide/
/blog/saint-martin-travel-rules/
/blog/saint-martin-trip-cost/
/blog/saint-martin-what-to-bring/
```

Each article must link back to relevant commercial pages.

Example:

Article:

**How to Go to Saint Martin from Cox's Bazar**

links to:

**Cox's Bazar to Saint Martin Ship**

and:

**Saint Martin Ship Ticket Price**

---

# 49. Internal Linking Rule

Every new article should have:

* 2–5 contextual internal links
* link to one primary commercial page
* link to one related informational page
* breadcrumbs
* related articles

Commercial pages should also link to supporting guides.

---

# 50. Final Success Metric

Do not measure success only by pageviews.

Track:

```text
Organic users
↓
Landing pages
↓
Ship views
↓
WhatsApp clicks
↓
Phone clicks
↓
Qualified inquiries
↓
Bookings
```

The ultimate goal is:

**SEO traffic that becomes real ticket inquiries.**

Not simply traffic.

---

# 51. V1 Definition of Done

The frontend is ready when:

### SEO

* [ ] Every indexable page has unique title
* [ ] Every indexable page has meta description
* [ ] Canonicals implemented
* [ ] Sitemap generated
* [ ] Robots.txt configured
* [ ] Breadcrumbs implemented
* [ ] Internal linking implemented
* [ ] JSON-LD implemented
* [ ] Open Graph metadata implemented

### AIO/AEO

* [ ] Direct answers near top of pages
* [ ] FAQ sections
* [ ] Clear factual tables
* [ ] Entity information structured consistently
* [ ] Last verified information displayed

### Bangla/English

* [ ] English keywords covered
* [ ] Bangla keywords covered
* [ ] Banglish intent naturally covered
* [ ] Navigation understandable to Bangla users
* [ ] No unnecessary duplicate translation pages

### Conversion

* [ ] WhatsApp CTA
* [ ] Phone CTA
* [ ] Sticky mobile CTA
* [ ] Contextual WhatsApp messages
* [ ] GA4 events
* [ ] UTM tracking support

### Performance

* [ ] Mobile-first
* [ ] Fast initial load
* [ ] Optimized images
* [ ] Minimal JavaScript
* [ ] Crawlable HTML
* [ ] Core Web Vitals considered

### Content Integrity

* [ ] No invented prices
* [ ] No invented schedules
* [ ] No fake reviews
* [ ] No fake ratings
* [ ] No unsupported claims
* [ ] Last verified dates
* [ ] Sources where appropriate

---

# 52. Most Important Principle

Build ShipTickets.bd as:

**A search engine for Saint Martin ship information that converts visitors into WhatsApp/phone inquiries.**

Not:

**A complicated booking platform.**

For V1:

```text
SEO
  +
AIO
  +
AEO
  +
Useful Ship Data
  +
Bangla + English
  +
Fast Frontend
  +
Trust
  +
WhatsApp
  +
Phone
```

That is the priority.

Backend, live inventory, payment, accounts and automated booking can be added later without rebuilding the frontend architecture.
