export const dynamic='force-dynamic';
import Link from 'next/link';
import {redirect} from 'next/navigation';
import {requireAdmin} from '@/lib/auth';
import {db} from '@/lib/db';
import DeleteAdminWebsiteButton from './DeleteAdminWebsiteButton';

export default async function User360({params}:{params:{id:string}}){
  try{await requireAdmin();}catch{redirect('/login?error=admin_required');}
  const user=await db.user.findUnique({where:{id:params.id}});
  if(!user) return <main className="p-10"><h1 className="text-2xl font-bold">User not found</h1></main>;
  const [websites,media]=await Promise.all([
    db.website.findMany({where:{userId:params.id},orderBy:{updatedAt:'desc'}}),
    db.media.findMany({where:{userId:params.id},orderBy:{createdAt:'desc'}})
  ]);
  return <main className="mx-auto max-w-7xl px-6 py-10">
    <Link href="/admin/users" className="text-zinc-400 underline">← Users</Link>
    <div className="mt-3"><h1 className="text-4xl font-black">User 360°</h1><p className="mt-2 text-zinc-400">Everything this user has on the platform — profile, projects, live links and uploaded media.</p></div>
    <section className="mt-6 grid gap-4 md:grid-cols-4">
      <div className="card p-5"><span className="text-xs text-zinc-500">NAME</span><b className="mt-2 block">{user.name||'—'}</b></div>
      <div className="card p-5"><span className="text-xs text-zinc-500">EMAIL</span><b className="mt-2 block break-all">{user.email}</b></div>
      <div className="card p-5"><span className="text-xs text-zinc-500">ROLE / ACCESS</span><b className="mt-2 block capitalize">{user.role} · {user.approved===false?'Pending':'Approved'}</b></div>
      <div className="card p-5"><span className="text-xs text-zinc-500">ACCOUNT CREATED</span><b className="mt-2 block">{user.createdAt?new Date(user.createdAt).toLocaleString():'—'}</b></div>
      <div className="card p-5 md:col-span-2"><span className="text-xs text-zinc-500">PHONE</span><b className="mt-2 block">{(user as any).phone||'—'}</b></div>
      <div className="card p-5 md:col-span-2"><span className="text-xs text-zinc-500">BIO</span><p className="mt-2 text-sm text-zinc-400">{(user as any).bio||'No bio added.'}</p></div>
    </section>
    <section className="card mt-6 p-6">
      <div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">All Websites</h2><p className="text-sm text-zinc-400">Every celebration created by this user.</p></div><span>{websites.length} total</span></div>
      <div className="mt-5 overflow-auto"><table className="w-full text-left text-sm"><thead className="text-zinc-400"><tr><th className="px-3 py-3">Title</th><th className="px-3 py-3">Template</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Views</th><th className="px-3 py-3">Actions</th></tr></thead><tbody>
      {websites.map((w:any)=><tr key={w.id} className="border-t border-white/10"><td className="px-3 py-3">{w.title}</td><td className="px-3 py-3">{w.templateId}</td><td className="px-3 py-3 capitalize">{w.status}</td><td className="px-3 py-3">{w.views||0}</td><td className="px-3 py-3 flex flex-wrap gap-2"><Link className="btn2" href={`/builder/${w.id}`}>Edit</Link>{w.status==='published'&&<a className="btn2" href={`/site/${w.slug}`} target="_blank" rel="noreferrer">Open</a>}<DeleteAdminWebsiteButton id={w.id}/></td></tr>)}
      {!websites.length&&<tr><td colSpan={5} className="px-3 py-6 text-zinc-500">No websites.</td></tr>}</tbody></table></div>
    </section>
    <section className="card mt-6 p-6"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold">Uploaded Media</h2><p className="text-sm text-zinc-400">Photos, videos, music and other files for this account.</p></div><span>{media.length} files</span></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{media.map((m:any)=><div key={m.id} className="rounded-2xl border border-white/10 bg-white/[.03] p-3"><div className="aspect-video overflow-hidden rounded-xl bg-black/20">{String(m.type||'').startsWith('image/')?<img src={m.url} alt="" className="h-full w-full object-cover"/>:String(m.type||'').startsWith('video/')?<video src={m.url} controls className="h-full w-full object-cover"/>:<div className="grid h-full place-items-center text-3xl">🎵</div>}</div><p className="mt-2 truncate text-xs text-zinc-400">{m.folder||m.type}</p></div>)}</div>
    </section>
  </main>;
}
