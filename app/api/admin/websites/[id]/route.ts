export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { supabaseStorageDelete } from '@/lib/supabase-rest';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const b = await req.json().catch(() => ({}));
  if (!['draft', 'published', 'archived'].includes(b.status)) {
    return NextResponse.json({ error: 'status must be draft, published or archived' }, { status: 400 });
  }
  const row = await db.website.update({ where: { id: params.id }, data: { status: b.status } });
  return NextResponse.json(row);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const site = await db.website.findUnique({ where: { id: params.id } });
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const media = await db.media.findMany({ where: { websiteId: site.id } });
  const marker = '/storage/v1/object/public/birthday-builder/';
  for (const item of media) {
    try {
      const raw = String(item.url || '');
      const idx = raw.indexOf(marker);
      if (idx >= 0) await supabaseStorageDelete('birthday-builder', decodeURIComponent(raw.slice(idx + marker.length)));
    } catch {}
  }
  await db.media.deleteMany({ where: { websiteId: site.id } });
  await db.website.deleteMany({ where: { id: site.id } });
  return NextResponse.json({ ok: true, deletedMedia: media.length });
}
