export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { supabaseStorageDelete } from '@/lib/supabase-rest';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: 'Forbidden' }, { status: 403 }); }
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const [websites, media] = await Promise.all([
    db.website.findMany({ where: { userId: params.id }, orderBy: { updatedAt: 'desc' } }),
    db.media.findMany({ where: { userId: params.id }, orderBy: { createdAt: 'desc' } }),
  ]);
  return NextResponse.json({ user, websites, media });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const data: any = {};
  if (typeof body.approved === 'boolean') data.approved = body.approved;
  if (typeof body.role === 'string' && ['user', 'admin', 'support'].includes(body.role)) data.role = body.role;
  if (!Object.keys(data).length) {
    return NextResponse.json({ error: 'approved (boolean) or role (user|admin|support) is required' }, { status: 400 });
  }
  const updated = await db.user.update({ where: { id: params.id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error:'Forbidden' }, { status:403 }); }
  const user = await db.user.findUnique({ where:{ id:params.id } });
  if (!user) return NextResponse.json({ error:'User not found' }, { status:404 });
  if (user.role === 'admin') return NextResponse.json({ error:'Admin accounts cannot be deleted from this screen.' }, { status:400 });
  const sites = await db.website.findMany({ where:{ userId:user.id } });
  for (const site of sites) {
    const media = await db.media.findMany({ where:{ websiteId:site.id } });
    const gallery = await db.gallery.findMany({ where:{ websiteId:site.id } });
    const music = await db.music.findMany({ where:{ websiteId:site.id } });
    const videos = await db.video.findMany({ where:{ websiteId:site.id } });
    const marker='/storage/v1/object/public/birthday-builder/'; const paths=new Set<string>();
    const add=(url:string)=>{const raw=String(url||''); const i=raw.indexOf(marker); if(i>=0) paths.add(decodeURIComponent(raw.slice(i+marker.length)))};
    const walk=(v:any)=>{if(!v)return;if(typeof v==='string'){add(v);return}if(Array.isArray(v)){v.forEach(walk);return}if(typeof v==='object')Object.values(v).forEach(walk)};
    walk(site.content); [...media,...gallery,...music,...videos].forEach((m:any)=>add(m.url));
    await Promise.all(Array.from(paths).map(p=>supabaseStorageDelete('birthday-builder',p).catch(()=>{})));
    await Promise.all([db.media.deleteMany({where:{websiteId:site.id}}),db.gallery.deleteMany({where:{websiteId:site.id}}),db.music.deleteMany({where:{websiteId:site.id}}),db.video.deleteMany({where:{websiteId:site.id}}),db.timeline.deleteMany({where:{websiteId:site.id}}),db.memory.deleteMany({where:{websiteId:site.id}}),db.wishlistItem.deleteMany({where:{websiteId:site.id}}),db.guestbook.deleteMany({where:{websiteId:site.id}}),db.analyticsEvent.deleteMany({where:{websiteId:site.id}}),db.recipientEvent.deleteMany({where:{websiteId:site.id}}),db.collaborativeWish.deleteMany({where:{websiteId:site.id}}),db.reaction.deleteMany({where:{websiteId:site.id}}),db.referral.deleteMany({where:{websiteId:site.id}})]);
    await db.website.deleteMany({where:{id:site.id}});
  }
  await db.user.deleteMany({where:{id:user.id}});
  // Also remove the Supabase Auth account when server-side service-role credentials are available.
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/,'');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (base && serviceKey) {
    await fetch(`${base}/auth/v1/admin/users/${encodeURIComponent(user.id)}`, { method:'DELETE', headers:{ apikey:serviceKey, Authorization:`Bearer ${serviceKey}` } }).catch(()=>{});
  }
  return NextResponse.json({ok:true,deletedWebsites:sites.length});
}
