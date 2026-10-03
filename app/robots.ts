import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default function robots(): MetadataRoute.Robots {
  const disallow = ['/admin', '/api/', '/builder', '/dashboard', '/settings', '/messages', '/profile', '/auth/', '/login', '/forgot-password', '/reset-password', '/*?recipient=', '/*?to='];
  return {
    rules: [
      { userAgent: '*', allow: ['/', '/api/og'], disallow },
      // Let AI/search crawlers read public marketing pages too.
      { userAgent: ['Googlebot', 'Bingbot'], allow: ['/', '/api/og'], disallow },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
