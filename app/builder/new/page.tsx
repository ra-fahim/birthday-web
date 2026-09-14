import { redirect } from 'next/navigation';
import { getSessionUser, isApprovalRequired } from '@/lib/auth';
import { db } from '@/lib/db';
import { defaultContent } from '@/lib/types';
import { templateBySlug } from '@/lib/templates';

export default async function New({ searchParams }: { searchParams?: { template?: string; occasion?: string } }) {
  const u = await getSessionUser();
  if (!u) redirect('/login');
  if (u.role !== 'admin' && !u.approved && await isApprovalRequired()) redirect('/dashboard?pending=1');

  const requestedTemplate = String(searchParams?.template || 'master');
  const template = templateBySlug[requestedTemplate] || templateBySlug.master;
  const occasion = searchParams?.occasion && templateBySlug[requestedTemplate]?.category === searchParams.occasion
    ? searchParams.occasion
    : template.category;
  const seed = { ...defaultContent, occasion, templateId: template.slug };
  const label = `${template.name} — ${occasion[0].toUpperCase()}${occasion.slice(1)} `;
  const s = await db.website.create({ data: { userId: u.id, slug: `celebration-${Date.now()}`, title: label.trim(), templateId: template.slug, content: seed } });
  redirect(`/builder/${s.id}`);
}
