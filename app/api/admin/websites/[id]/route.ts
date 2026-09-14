export const dynamic='force-dynamic';
export const runtime='nodejs';
import {NextResponse} from 'next/server';
import {requireAdmin} from '@/lib/auth';
import {db} from '@/lib/db';
import {supabaseStorageDelete} from '@/lib/supabase-rest';
const MARKER='/storage/v1/object/public/birthday-builder/';
function pathOf(url:string){const i=String(url||'').indexOf(MARKER);return i>=0?decodeURIComponent(String(url).slice(i+MARKER.length)):null}
function collect(value:any,set:Set<string>){if(!value)return;if(typeof value==='string'){const p=pathOf(value);if(p)set.add(p);return}if(Array.isArray(value)){value.forEach(v=>collect(v,set));return}if(typeof value==='object')Object.values(value).forEach(v=>collect(v,set));}
export async function PATCH(req:Request,{params}:{params:{id:string}}){try{await requireAdmin()}catch{return NextResponse.json({error:'Forbidden'},{status:403})}const b=await req.json().catch(()=>({}));if(!['draft','published','archived'].includes(b.status))return NextResponse.json({error:'Invalid status'},{status:400});return NextResponse.json(await db.website.update({where:{id:params.id},data:{status:b.status}}))}
export async function DELETE(_req:Request,{params}:{params:{id:string}}){try{await requireAdmin()}catch{return NextResponse.json({error:'Forbidden'},{status:403})}const site=await db.website.findUnique({where:{id:params.id}});if(!site)return NextResponse.json({error:'Not found'},{status:404});const paths=new Set<string>();collect(site.content,paths);
const [media,gallery,music,videos,timeline,memories,wishlist,guestbook,analytics,events,wishes,reactions,referrals]=await Promise.all([
 db.media.findMany({where:{websiteId:site.id}}),db.gallery.findMany({where:{websiteId:site.id}}),db.music.findMany({where:{websiteId:site.id}}),db.video.findMany({where:{websiteId:site.id}}),db.timeline.findMany({where:{websiteId:site.id}}),db.memory.findMany({where:{websiteId:site.id}}),db.wishlistItem.findMany({where:{websiteId:site.id}}),db.guestbook.findMany({where:{websiteId:site.id}}),db.analyticsEvent.findMany({where:{websiteId:site.id}}),db.recipientEvent.findMany({where:{websiteId:site.id}}),db.collaborativeWish.findMany({where:{websiteId:site.id}}),db.reaction.findMany({where:{websiteId:site.id}}),db.referral.findMany({where:{websiteId:site.id}})
]);
for(const row of [...media,...gallery,...music,...videos]){const p=pathOf((row as any).url);if(p)paths.add(p)}
await Promise.all(Array.from(paths).map(p=>supabaseStorageDelete('birthday-builder',p).catch(()=>{})));
await Promise.all([db.media.deleteMany({where:{websiteId:site.id}}),db.gallery.deleteMany({where:{websiteId:site.id}}),db.music.deleteMany({where:{websiteId:site.id}}),db.video.deleteMany({where:{websiteId:site.id}}),db.timeline.deleteMany({where:{websiteId:site.id}}),db.memory.deleteMany({where:{websiteId:site.id}}),db.wishlistItem.deleteMany({where:{websiteId:site.id}}),db.guestbook.deleteMany({where:{websiteId:site.id}}),db.analyticsEvent.deleteMany({where:{websiteId:site.id}}),db.recipientEvent.deleteMany({where:{websiteId:site.id}}),db.collaborativeWish.deleteMany({where:{websiteId:site.id}}),db.reaction.deleteMany({where:{websiteId:site.id}}),db.referral.deleteMany({where:{websiteId:site.id}})]);
await db.website.deleteMany({where:{id:site.id}});return NextResponse.json({ok:true,deletedStorageObjects:paths.size})}
