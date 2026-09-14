import { redirect } from 'next/navigation';
import { getSessionUser, isApprovalRequired } from '@/lib/auth';
import { db } from '@/lib/db';
import { defaultContent } from '@/lib/types';

const ALLOWED = new Set(['master','romantic','cute','luxury','anime','gaming','minimal','elegant','festival']);
const OCCASIONS = new Set(['birthday','anniversary','proposal','wedding','graduation','congratulations','thank-you','surprise','friendship','festival']);

export default async function New({ searchParams }: { searchParams?: { template?: string; occasion?: string } }) {
  const u = await getSessionUser();
  if (!u) redirect('/login');
  if (u.role !== 'admin' && !u.approved && await isApprovalRequired()) redirect('/dashboard?pending=1');

  const templateId = ALLOWED.has(searchParams?.template || '') ? String(searchParams!.template) : 'master';
  const occasion = OCCASIONS.has(searchParams?.occasion || '') ? String(searchParams!.occasion) : 'birthday';
  const seed = { ...defaultContent, occasion, templateId };
  const label = templateId === 'master' ? 'Master Celebration' : `${templateId[0].toUpperCase()}${templateId.slice(1)} Celebration`;
  const s = await db.website.create({ data: { userId: u.id, slug: `celebration-${Date.now()}`, title: label, templateId, content: seed } });
  redirect(`/builder/${s.id}`);
}
