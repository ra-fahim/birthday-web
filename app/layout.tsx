import './globals.css';
import type { Metadata, Viewport } from 'next';
import { ALL_KEYWORDS, SITE_NAME, SITE_URL } from '@/lib/seo';

const DESC = 'Create a personalized birthday wish, proposal, anniversary, sorry or miss-you website in minutes. Wish your girlfriend, boyfriend, wife, husband or friend with photos, music and a secret letter — then share it with one link.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Wishes — Birthday Wish, Proposal & Surprise Website Maker', template: '%s' },
  description: DESC,
  keywords: ALL_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: 'lifestyle',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: SITE_NAME, title: 'Wishes — Birthday Wish, Proposal & Surprise Website Maker', description: DESC, url: SITE_URL, locale: 'en_US', images: [{ url: '/api/og', width: 1200, height: 630, alt: 'Wishes' }] },
  twitter: { card: 'summary_large_image', title: 'Wishes — Birthday Wish, Proposal & Surprise Website Maker', description: DESC, images: ['/api/og'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 } },
  formatDetection: { telephone: false, email: false, address: false },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0b0b12' };

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': `${SITE_URL}/#org`, name: SITE_NAME, url: SITE_URL },
    { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, description: DESC, inLanguage: ['en', 'bn'], publisher: { '@id': `${SITE_URL}/#org` } },
    { '@type': 'WebApplication', name: SITE_NAME, url: SITE_URL, applicationCategory: 'LifestyleApplication', operatingSystem: 'Any', description: DESC, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, keywords: ALL_KEYWORDS.slice(0, 40).join(', ') },
  ],
};

export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</body></html>}
