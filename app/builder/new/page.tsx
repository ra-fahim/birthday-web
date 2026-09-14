import { redirect } from 'next/navigation';
import { getSessionUser, isApprovalRequired } from '@/lib/auth';
import { db } from '@/lib/db';
import { defaultContent } from '@/lib/types';
import { templateById, templateCatalog } from '@/lib/templates';

export default async function New({ searchParams }: { searchParams?: { template?: string; occasion?: string } }) {
  const u = await getSessionUser();
  if (!u) redirect('/login');
  if (u.role !== 'admin' && !u.approved && await isApprovalRequired()) redirect('/dashboard?pending=1');

  const requestedTemplate = String(searchParams?.template || 'master');
  const template = templateCatalog.find(t => t.slug === requestedTemplate) || templateById('master');
  const templateId = template.slug;
  const occasion = template.category;
  const seed = { ...defaultContent, occasion, templateId, seoTitle: template.name, greeting: template.categoryLabel };
  const label = `${template.name} — ${template.categoryLabel}`;
  const s = await db.website.create({ data: { userId: u.id, slug: `celebration-${Date.now()}`, title: label, templateId, content: seed } });
  redirect(`/builder/${s.id}`);
}
