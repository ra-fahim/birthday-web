import type { MetadataRoute } from 'next';
import { db } from '@/lib/db';
import { SITE_URL } from '@/lib/seo';
import { templateCatalog } from '@/lib/templates';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL;
  const staticPaths = ['', '/create', '/templates', '/features', '/pricing', '/faq', '/about', '/contact', '/how-to-make-website', '/signup'];
  const entries: MetadataRoute.Sitemap = staticPaths.map(p => ({ url: `${base}${p}`, lastModified: new Date(), changeFrequency: 'weekly', priority: p === '' ? 1 : p === '/signup' ? 0.5 : 0.7 }));
  // One landing page per occasion (birthday, proposal, sorry, miss-you …) for long-tail searches.
  for (const category of Array.from(new Set(templateCatalog.map(t => t.category)))) {
    entries.push({ url: `${base}/templates/${category}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 });
  }
  try {
    const sites = await db.website.findMany({ where: { status: 'published' }, select: { slug: true, updatedAt: true } });
    for (const s of sites) entries.push({ url: `${base}/site/${s.slug}`, lastModified: s.updatedAt || undefined, changeFrequency: 'monthly', priority: 0.4 });
  } catch {}
  return entries;
}
