import type { Metadata } from 'next';
import { normalizeAppUrl } from '@/lib/app-url';

export const SITE_NAME = 'Wishly';
export const SITE_URL = normalizeAppUrl(process.env.NEXT_PUBLIC_APP_URL) || 'http://localhost:3000';

// ---- Keyword groups -------------------------------------------------------
// English, Banglish and Bangla spellings, grouped by occasion. Used for the
// <meta keywords> tag and to power per-page / per-category descriptions.
export const KEYWORDS = {
  birthday: [
    'birthday wish', 'birthday wishes', 'happy birthday website', 'birthday wish website', 'birthday surprise website',
    'personalized birthday website', 'birthday website maker', 'create birthday website', 'birthday countdown website',
    'interactive birthday card', 'digital birthday card', 'online birthday card', 'birthday greeting website', 'birthday gift website',
    'birthday wish link', 'birthday wish for girlfriend', 'birthday wish for boyfriend', 'birthday wish for wife', 'birthday wish for husband',
    'birthday wish for best friend', 'birthday wish for mom', 'birthday wish for dad', 'birthday wish for sister', 'birthday wish for brother',
    'birthday surprise for girlfriend', 'birthday surprise for boyfriend', 'romantic birthday wish', 'long distance birthday surprise',
    'birthday wish with photos and music', 'midnight birthday wish', 'birthday cake animation website', 'birthday letter website',
    'happy birthday gf', 'happy birthday bf', 'birthday wish bangla', 'birthday wish bengali',
    'জন্মদিনের শুভেচ্ছা', 'জন্মদিনের উইশ', 'জন্মদিনের সারপ্রাইজ', 'বার্থডে উইশ', 'বার্থডে সারপ্রাইজ ওয়েবসাইট', 'গার্লফ্রেন্ডকে জন্মদিনের শুভেচ্ছা', 'বয়ফ্রেন্ডকে জন্মদিনের শুভেচ্ছা',
    'শুভ জন্মদিন', 'জন্মদিনের ওয়েবসাইট',
  ],
  proposal: [
    'proposal website', 'propose website', 'how to propose girlfriend', 'how to propose a girl', 'how to propose boyfriend', 'propose girlfriend online',
    'romantic proposal website', 'love proposal website', 'valentine proposal website', 'valentine website for girlfriend', 'will you be my girlfriend website',
    'will you marry me website', 'marriage proposal website', 'propose day website', 'propose day wish', 'creative way to propose', 'unique proposal idea',
    'online proposal idea', 'love confession website', 'proposal link for girlfriend', 'propose gf', 'propose crush',
    'প্রপোজ করার ওয়েবসাইট', 'গার্লফ্রেন্ডকে প্রপোজ', 'প্রপোজ করার উপায়', 'ভালোবাসার প্রস্তাব', 'ভ্যালেন্টাইন ওয়েবসাইট',
  ],
  wedding: [
    'wedding proposal website', 'wedding invitation website', 'digital wedding card', 'online wedding invitation', 'marriage anniversary website',
    'wedding wish website', 'wedding wishes', 'বিয়ের শুভেচ্ছা', 'বিয়ের ওয়েবসাইট', 'ডিজিটাল বিয়ের কার্ড',
  ],
  anniversary: [
    'anniversary wish website', 'anniversary wishes', 'happy anniversary website', 'anniversary surprise for girlfriend', 'anniversary surprise for husband',
    'anniversary surprise for wife', 'relationship anniversary website', 'love story website', 'couple website', 'monthsary website',
    'বিবাহবার্ষিকীর শুভেচ্ছা', 'অ্যানিভার্সারি উইশ', 'অ্যানিভার্সারি সারপ্রাইজ',
  ],
  sorry: [
    'sorry website', 'apology website for girlfriend', 'say sorry to girlfriend', 'sorry message for girlfriend', 'how to say sorry', 'sorry wish', 'apology letter website',
    'sorry gf', 'sorry bf', 'সরি বলার ওয়েবসাইট', 'গার্লফ্রেন্ডকে সরি বলা', 'ক্ষমা চাওয়ার মেসেজ',
  ],
  missYou: [
    'miss you website', 'i miss you website', 'miss you message for girlfriend', 'miss you message for boyfriend', 'long distance relationship website',
    'long distance love website', 'love letter website', 'romantic website for girlfriend', 'love message website', 'তোমাকে মিস করছি', 'মিস ইউ ওয়েবসাইট', 'ভালোবাসার চিঠি',
  ],
  thankYou: ['thank you website', 'thank you message website', 'thank you wish', 'gratitude website', 'ধন্যবাদ ওয়েবসাইট'],
  congratulations: ['congratulations website', 'congratulation wish', 'congrats website', 'success wish website', 'অভিনন্দন ওয়েবসাইট', 'অভিনন্দন বার্তা'],
  graduation: ['graduation wish website', 'graduation wishes', 'graduation card online', 'ssc hsc wish', 'farewell wish website', 'গ্র্যাজুয়েশন শুভেচ্ছা', 'বিদায়ী শুভেচ্ছা'],
  friendship: ['friendship day website', 'friendship wish website', 'best friend surprise website', 'friend birthday website', 'বন্ধুত্ব দিবসের শুভেচ্ছা', 'বন্ধুকে উইশ'],
  surprise: ['surprise website', 'surprise gift website', 'secret message website', 'surprise for girlfriend', 'surprise for boyfriend', 'সারপ্রাইজ ওয়েবসাইট', 'সারপ্রাইজ গিফট'],
  festival: [
    'eid mubarak wish website', 'eid wishes', 'eid greeting website', 'pohela boishakh wish', 'shubho noboborsho', 'new year wish website', 'valentines day website',
    'mothers day website', 'fathers day website', 'ঈদ মোবারক', 'ঈদের শুভেচ্ছা', 'শুভ নববর্ষ', 'পহেলা বৈশাখের শুভেচ্ছা',
  ],
  general: [
    'wish website maker', 'wish maker', 'greeting website maker', 'celebration website maker', 'create wish website free', 'free birthday website', 'no code website builder',
    'personalized wish link', 'custom wish link', 'send wish online', 'wish for loved ones', 'digital gift', 'digital celebration', 'interactive greeting card',
    'gift for girlfriend', 'gift for boyfriend', 'romantic gift idea', 'online surprise',
    'birthday website bangladesh', 'wish website bangladesh', 'bangla wish website', 'বাংলাদেশ উইশ ওয়েবসাইট', 'উইশ ওয়েবসাইট', 'wishly',
  ],
} as const;

export const ALL_KEYWORDS: string[] = Array.from(new Set(Object.values(KEYWORDS).flat()));

export const CATEGORY_SEO: Record<string, { title: string; description: string; keywords: string[] }> = {
  birthday: { title: 'Birthday Wish Website Templates', description: 'Create a personalized birthday wish website for your girlfriend, boyfriend, wife, husband, friend or family — countdown, cake, photos, music and a secret letter. Share it as a link.', keywords: [...KEYWORDS.birthday] },
  proposal: { title: 'Proposal Website Templates — Propose Your Girlfriend Online', description: 'Propose to your girlfriend or boyfriend in a creative, romantic way with an interactive proposal website. Perfect for Propose Day, Valentine’s Day and “Will you marry me?”.', keywords: [...KEYWORDS.proposal] },
  anniversary: { title: 'Anniversary Wish Website Templates', description: 'Celebrate your love story with a beautiful anniversary wish website — photos, memories, music and heartfelt messages in one shareable link.', keywords: [...KEYWORDS.anniversary] },
  wedding: { title: 'Wedding & Marriage Proposal Website Templates', description: 'Wedding proposal and digital wedding invitation websites you can personalize in minutes and share with one link.', keywords: [...KEYWORDS.wedding] },
  sorry: { title: 'Sorry Website Templates — Say Sorry to Your Girlfriend', description: 'Say sorry in a heartfelt way with an interactive apology website for your girlfriend, boyfriend or friend.', keywords: [...KEYWORDS.sorry] },
  'miss-you': { title: 'Miss You Website Templates — Long Distance Love', description: 'Tell someone “I miss you” with a romantic miss-you website. Ideal for long distance relationships.', keywords: [...KEYWORDS.missYou] },
  'thank-you': { title: 'Thank You Website Templates', description: 'Say thank you with a personalized thank-you website with photos, music and your own words.', keywords: [...KEYWORDS.thankYou] },
  congratulations: { title: 'Congratulations Website Templates', description: 'Congratulate someone special with an interactive congratulations wish website.', keywords: [...KEYWORDS.congratulations] },
  graduation: { title: 'Graduation & Farewell Wish Website Templates', description: 'Celebrate graduation, SSC/HSC results and farewells with a personalized wish website.', keywords: [...KEYWORDS.graduation] },
  friendship: { title: 'Friendship Wish Website Templates', description: 'Make your best friend smile with a friendship day or friend birthday website.', keywords: [...KEYWORDS.friendship] },
  surprise: { title: 'Surprise Website Templates', description: 'Create a surprise gift website with a secret message, photos and music, then share the link.', keywords: [...KEYWORDS.surprise] },
  festival: { title: 'Festival & Eid Wish Website Templates', description: 'Eid Mubarak, Pohela Boishakh, New Year and Valentine’s wishes — create a festive greeting website in minutes.', keywords: [...KEYWORDS.festival] },
};

type MetaInput = { title: string; description: string; path?: string; keywords?: string[]; noindex?: boolean };

/** Builds consistent metadata (title, description, keywords, canonical, OG, Twitter) for a page. */
export function pageMeta({ title, description, path = '', keywords = [], noindex = false }: MetaInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const merged = Array.from(new Set([...keywords, ...ALL_KEYWORDS]));
  return {
    title,
    description,
    keywords: merged,
    alternates: { canonical: path || '/' },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: { type: 'website', siteName: SITE_NAME, title, description, url, locale: 'en_US', images: [{ url: `${SITE_URL}/api/og`, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [`${SITE_URL}/api/og`] },
  };
}
