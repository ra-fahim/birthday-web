export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {db} from '@/lib/db';

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export async function GET(req: Request) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const slug = String(searchParams.get('slug') || '').trim().toLowerCase();
  const id = String(searchParams.get('id') || '');
  if (slug.length < 3) return NextResponse.json({ valid: false, available: false, reason: 'Use at least 3 characters.' });
  if (!SLUG_RE.test(slug)) return NextResponse.json({ valid: false, available: false, reason: 'Only a-z, 0-9 and hyphens; cannot start or end with a hyphen.' });
  const existing = await db.website.findFirst({ where: { slug } });
  const available = !existing || existing.id === id;
  return NextResponse.json({ valid: true, available, reason: available ? '' : 'This link is already taken. Try another.' });
}
