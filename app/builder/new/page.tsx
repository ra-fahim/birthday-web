import { redirect } from 'next/navigation';
import { getSessionUser, isApprovalRequired } from '@/lib/auth';
import { db } from '@/lib/db';
import { defaultContent } from '@/lib/types';
import { getTemplate } from '@/lib/templates';

const ALLOWED = new Set(['master','birthday','anniversary','proposal','master-proposal','wedding-proposal','wedding','sorry','miss-you','thank-you','congratulations','graduation','friendship','surprise','festival','romantic','cute','luxury','anime','gaming','minimal','elegant']);
const OCCASIONS = new Set(['birthday','anniversary','proposal','wedding','graduation','congratulations','thank-you','surprise','friendship','festival','sorry','miss-you']);

export default async function New({ searchParams }: { searchParams?: { template?: string; occasion?: string } }) {
  const u = await getSessionUser();
  if (!u) redirect('/login');
  if (u.role !== 'admin' && !u.approved && await isApprovalRequired()) redirect('/dashboard?pending=1');

  const requestedTemplate = ALLOWED.has(searchParams?.template || '') ? String(searchParams!.template) : 'master';
  const registered = getTemplate(requestedTemplate);
  const templateId = registered?.slug || 'master';
  const requestedOccasion = OCCASIONS.has(searchParams?.occasion || '') ? String(searchParams!.occasion) : '';
  const occasion = requestedOccasion || registered?.category || 'birthday';
  const seed = { ...defaultContent, occasion, templateId };
  const label = templateId === 'master' ? 'Master Celebration' : `${registered?.name || templateId} Celebration`;
  const s = await db.website.create({ data: { userId: u.id, slug: `celebration-${Date.now()}`, title: label, templateId, content: seed } });
  redirect(`/builder/${s.id}`);
}
