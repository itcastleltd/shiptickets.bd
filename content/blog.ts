export type BlogPost = {
  slug: string
  title: string
  titleBn: string
  description: string
  descriptionBn: string
  date: string
  author: string
  tags: string[]
  thumbnail: string
  content: { heading?: string; paragraphs: string[] }[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'saint-martin-travel-guide',
    title: 'Saint Martin Travel Guide',
    titleBn: 'সেন্টমার্টিন ভ্রমণ গাইড',
    description: 'Best time to visit, what to pack, food, accommodation and tips for Saint Martin.',
    descriptionBn: 'সেন্টমার্টিনে কখন যাবেন, কী নিয়ে যাবেন, খাবার, থাকার ব্যবস্থা ও টিপস।',
    date: '2026-10-28',
    author: 'ShipTickets.bd',
    tags: ['travel', 'saint-martin'],
    thumbnail: '/blog/saint-martin-travel-guide.jpg',
    content: [
      { heading: 'সেরা সময়', paragraphs: ['নভেম্বর থেকে মার্চ—এই সময়টাই সেন্টমার্টিন ভ্রমণের জন্য সবচেয়ে ভালো। সমুদ্র শান্ত, আবহাওয়া পরিষ্কার, ফেরি নিয়মিত চলে।'] },
      { heading: 'কী নিয়ে যাবেন', paragraphs: ['সানস্ক্রিন, টুপি, স্যান্ডেল, হালকা জ্যাকেট, পানির বোতল, পরিচয়পত্র ও নগদ টাকা। কার্ড সুবিধা সীমিত।'] },
      { heading: 'খাবার ও থাকার ব্যবস্থা', paragraphs: ['দ্বীপে ফ্রেশ সি-ফুড, নারিকেল পানি ও স্থানীয় খাবার পাওয়া যায়। বাজেট থেকে মিড-রেঞ্জ হোটেল ও কটেজ আছে।'] },
    ],
  },
  {
    slug: 'ship-ticket-booking-guide',
    title: 'Ship Ticket Booking Guide',
    titleBn: 'জাহাজের টিকিট বুকিং গাইড',
    description: 'How to book Saint Martin ship tickets, fares, cabins and operators.',
    descriptionBn: 'সেন্টমার্টিন জাহাজের টিকিট কীভাবে বুক করবেন, ভাড়া, কেবিন ও অপারেটর।',
    date: '2026-10-28',
    author: 'ShipTickets.bd',
    tags: ['booking', 'tickets'],
    thumbnail: '/blog/ship-ticket-booking-guide.jpg',
    content: [
      { heading: 'টিকিট বুকিং', paragraphs: ['তারিখ ও যাত্রী সংখ্যা ঠিক করে WhatsApp-এ যোগাযোগ করুন। আমরা অপারেটর ও কেবিন অপশন জানাবো।'] },
      { heading: 'ভাড়া', paragraphs: ['ওয়ান-ওয়ে ৳২,২০০, রাউন্ড-ট্রিপ ৳৪,২০০ (অপারেটর প্রকাশিত)। পরিবেশ সংরক্ষণ ফি ৳১০০।'] },
      { heading: 'কেবিন', paragraphs: ['ওপেন ডেক, লাউঞ্জ, কেবিন ও VIP—বাজেট ও স্বাচ্ছন্দ্য অনুযায়ী বেছে নিন।'] },
    ],
  },
  {
    slug: 'coxs-bazar-to-saint-martin-route',
    title: "Cox's Bazar to Saint Martin Route",
    titleBn: 'কক্সবাজার থেকে সেন্টমার্টিন রুট',
    description: 'Journey, jetty, schedule and tips from Cox\'s Bazar to Saint Martin.',
    descriptionBn: 'কক্সবাজার থেকে সেন্টমার্টিন—যাত্রা, জেটি, সময়সূচি ও টিপস।',
    date: '2026-10-28',
    author: 'ShipTickets.bd',
    tags: ['route', 'schedule'],
    thumbnail: '/blog/coxs-bazar-to-saint-martin-route.jpg',
    content: [
      { heading: 'জেটি', paragraphs: ['কক্সবাজারের নুনিয়ারছড়া জেটি থেকে জাহাজ ছাড়ে। সকালে পৌঁছাতে হয়।'] },
      { heading: 'যাত্রার সময়', paragraphs: ['জাহাজে যাত্রা প্রায় ৫–৭ ঘণ্টা। সমুদ্রের অবস্থা অনুযায়ী সময় বদলাতে পারে।'] },
      { heading: 'টিপস', paragraphs: ['আগে পৌঁছান, পরিচয়পত্র সঙ্গে রাখুন, সিজনাল সময়সূচি আগে নিশ্চিত করুন।'] },
    ],
  },
  {
    slug: 'saint-martin-travel-rules',
    title: 'Saint Martin Travel Rules',
    titleBn: 'সেন্টমার্টিন ভ্রমণ নিয়ম',
    description: 'Daily visitor limit, conservation fee, permits and season info.',
    descriptionBn: 'দৈনিক পর্যটক সীমা, সংরক্ষণ ফি, পারমিট ও সিজন তথ্য।',
    date: '2026-10-28',
    author: 'ShipTickets.bd',
    tags: ['rules', 'conservation'],
    thumbnail: '/blog/saint-martin-travel-rules.jpg',
    content: [
      { heading: 'দৈনিক পর্যটক সীমা', paragraphs: ['প্রতিদিন সর্বোচ্চ ৩,৫০০ পর্যটক সেন্টমার্টিনে যেতে পারেন।'] },
      { heading: 'সংরক্ষণ ফি', paragraphs: ['প্রতি পর্যটকের জন্য ৳১০০ পরিবেশ সংরক্ষণ ফি প্রযোজ্য।'] },
      { heading: 'সিজন', paragraphs: ['মৌসুম নভেম্বর–মার্চ। অফ-সিজনে জাহাজ কম চলে। সর্বশেষ তথ্য আমাদের সাইটে আপডেট থাকে।'] },
    ],
  },
]
export function getPost(slug: string) { return blogPosts.find((p) => p.slug === slug) }
export function getAllSlugs() { return blogPosts.map((p) => p.slug) }
