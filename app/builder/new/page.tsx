import { redirect } from 'next/navigation';
import { getSessionUser, isApprovalRequired } from '@/lib/auth';
import { db } from '@/lib/db';
import { defaultContent, weddingProposalDefaults } from '@/lib/types';
import { templateBySlug } from '@/lib/templates';

export default async function New({ searchParams }: { searchParams?: { template?: string; occasion?: string } }) {
  const u = await getSessionUser();
  if (!u) {
    const back = searchParams?.template ? `/builder/new?template=${encodeURIComponent(String(searchParams.template))}` : '/create';
    redirect(`/login?next=${encodeURIComponent(back)}`);
  }
  if (u.role !== 'admin' && !u.approved && await isApprovalRequired()) redirect('/dashboard?pending=1');

  const requested = String(searchParams?.template || '');
  if (!requested || !templateBySlug[requested]) redirect('/create');
  const requestedTemplate = requested;
  const template = templateBySlug[requestedTemplate];
  const occasion = searchParams?.occasion && templateBySlug[requestedTemplate]?.category === searchParams.occasion
    ? searchParams.occasion
    : template.category;
  const existingDraft = await db.website.findFirst({
    where: { userId: u.id, templateId: template.slug, status: 'draft' },
    orderBy: { updatedAt: 'desc' },
  });
  if (existingDraft) {
    redirect(`/builder/${existingDraft.id}?template=${encodeURIComponent(template.slug)}`);
  }

  const seed = { ...defaultContent, ...(template.slug === 'wedding-proposal' ? weddingProposalDefaults() : {}), occasion, templateId: template.slug };
  const label = `${template.name} — ${occasion[0].toUpperCase()}${occasion.slice(1)} `;
  const s = await db.website.create({ data: { userId: u.id, slug: `celebration-${Date.now()}`, title: label.trim(), templateId: template.slug, content: seed, status: 'draft' } });
  redirect(`/builder/${s.id}?template=${encodeURIComponent(template.slug)}`);
}
