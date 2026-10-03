export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import {NextResponse} from 'next/server';
import {getSessionUser} from '@/lib/auth';
import {db} from '@/lib/db';
import {supabaseStorageDelete} from '@/lib/supabase-rest';

const STORAGE_MARKER = '/storage/v1/object/public/birthday-builder/';
function storagePath(url:string){
  const raw=String(url||'');
  const idx=raw.indexOf(STORAGE_MARKER);
  return idx>=0 ? decodeURIComponent(raw.slice(idx+STORAGE_MARKER.length)) : null;
}
function collectUrls(value:any, out:Set<string>){
  if(!value) return;
  if(typeof value==='string'){
    const path=storagePath(value); if(path) out.add(path);
    return;
  }
  if(Array.isArray(value)){ for(const item of value) collectUrls(item,out); return; }
  if(typeof value==='object'){ for(const item of Object.values(value)) collectUrls(item,out); }
}

export async function GET(_req:Request,{params}:{params:{id:string}}){
  const u=await getSessionUser();if(!u)return NextResponse.json({error:'Unauthorized'},{status:401});
  const s=await db.website.findFirst({where:{id:params.id,userId:u.id}});if(!s)return NextResponse.json({error:'Not found'},{status:404});
  return NextResponse.json(s);
}

export async function PUT(req:Request,{params}:{params:{id:string}}){
  const u=await getSessionUser();if(!u)return NextResponse.json({error:'Unauthorized'},{status:401});
  const old=await db.website.findFirst({where:{id:params.id,userId:u.id}});if(!old)return NextResponse.json({error:'Not found'},{status:404});
  const b=await req.json();
  const nextSlug = typeof b.slug === 'string' && /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(b.slug.trim()) ? b.slug.trim() : old.slug;
  if (nextSlug !== old.slug) {
    const conflict = await db.website.findFirst({ where: { slug: nextSlug } });
    if (conflict && conflict.id !== old.id) {
      return NextResponse.json({ error: 'That live link is already in use. Choose another slug.' }, { status: 409 });
    }
  }
  try {
    const s=await db.website.update({where:{id:old.id},data:{content:b.content??old.content,templateId:b.templateId??old.templateId,status:b.status==='published'?'published':'draft',title:b.title??old.title,slug:nextSlug,seo:b.seo,referralCode:b.content?.referralCode||null}});
    return NextResponse.json(s);
  } catch (error:any) {
    const message=String(error?.message||'');
    if(/duplicate key|unique constraint|websites_slug/i.test(message)) {
      return NextResponse.json({ error: 'That live link is already in use. Choose another slug.' }, { status: 409 });
    }
    throw error;
  }
}

export async function POST(req:Request,{params}:{params:{id:string}}){const form=await req.formData().catch(()=>null);if(form?.get('_method')==='DELETE') return DELETE(req,{params}); return NextResponse.json({error:'Method not allowed'},{status:405});}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const u = await getSessionUser();
  if (!u) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const site = await db.website.findFirst({ where: u.role === 'admin' ? { id: params.id } : { id: params.id, userId: u.id } });
  if (!site) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const storagePaths = new Set<string>();
  collectUrls(site.content, storagePaths);
  const media = await db.media.findMany({ where: { websiteId: site.id } });
  for (const item of media) { const path=storagePath(item.url); if(path) storagePaths.add(path); }

  const [gallery, music, videos] = await Promise.all([
    db.gallery.findMany({ where: { websiteId: site.id } }),
    db.music.findMany({ where: { websiteId: site.id } }),
    db.video.findMany({ where: { websiteId: site.id } }),
  ]);
  for (const row of [...gallery,...music,...videos]) { const path=storagePath((row as any).url); if(path) storagePaths.add(path); }

  await Promise.all(Array.from(storagePaths).map(path => supabaseStorageDelete('birthday-builder', path).catch(()=>{})));

  await Promise.all([
    db.media.deleteMany({ where: { websiteId: site.id } }),
    db.gallery.deleteMany({ where: { websiteId: site.id } }),
    db.music.deleteMany({ where: { websiteId: site.id } }),
    db.video.deleteMany({ where: { websiteId: site.id } }),
  ]);
  await db.website.deleteMany({ where: { id: site.id } });
  return NextResponse.json({ ok: true, deletedMedia: media.length, deletedStorageObjects: storagePaths.size });
}
