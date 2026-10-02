import { redirect } from 'next/navigation';
import { getSessionUser, isApprovalRequired } from '@/lib/auth';
import { db } from '@/lib/db';
import { defaultContent } from '@/lib/types';
import { templateBySlug } from '@/lib/templates';

export default async function New({ searchParams }: { searchParams?: { template?: string; occasion?: string } }) {
  const u = await getSessionUser();
  if (!u) redirect('/login');
  if (u.role !== 'admin' && !u.approved && await isApprovalRequired()) redirect('/dashboard?pending=1');

  const requested = String(searchParams?.template || '');
  if (!requested || !templateBySlug[requested]) redirect('/create');
  const requestedTemplate = requested;
  const template = templateBySlug[requestedTemplate];
  const occasion = searchParams?.occasion && templateBySlug[requestedTemplate]?.category === searchParams.occasion
    ? searchParams.occasion
    : template.category;
  // Reuse the user's newest unpublished draft for this exact template instead
  // of creating duplicate drafts every time they press Use Template. Once the
  // draft is published, a future Use Template can start a fresh website.
  const existingDraft = await db.website.findFirst({
    where: { userId: u.id, templateId: template.slug, status: 'draft' },
    orderBy: { updatedAt: 'desc' },
  });
  if (existingDraft) {
    redirect(`/builder/${existingDraft.id}?template=${encodeURIComponent(template.slug)}`);
  }

  const seed = { ...defaultContent, occasion, templateId: template.slug };
  const label = `${template.name} — ${occasion[0].toUpperCase()}${occasion.slice(1)} `;
  const s = await db.website.create({ data: { userId: u.id, slug: `celebration-${Date.now()}`, title: label.trim(), templateId: template.slug, content: seed, status: 'draft' } });
  redirect(`/builder/${s.id}?template=${encodeURIComponent(template.slug)}`);
}
