export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { ADMIN_MODULES } from '@/lib/admin-nav';

export default async function Admin() {
  try { await requireAdmin(); } catch { redirect('/login?error=admin_required'); }
  const [users, sites, templates, demos, media, published] = await Promise.all([
    db.user.count(), db.website.count(), db.template.count(), db.demoSite.count(), db.media.count(), db.website.count({where:{status:'published'}}),
  ]);
  const modules = ADMIN_MODULES.map(([label,href]) => ({label,href}));

  return <main className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
    <div className="admin-hero">
      <section className="admin-hero-card">
        <div className="text-xs font-black uppercase tracking-[.18em] text-pink-300">Wishly Control Room</div>
        <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">Everything under control.</h1>
        <p className="mt-4 max-w-xl text-sm leading-7">See every user, every celebration, every uploaded file and every live link from one place. Open a user's 360° view whenever you need the full story.</p>
        <div className="mt-6 flex flex-wrap gap-2"><Link className="rounded-xl bg-white px-4 py-2 text-sm font-extrabold text-slate-900" href="/admin/users">View all users</Link><Link className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-extrabold text-white" href="/admin/websites">Manage websites</Link></div>
      </section>
      <section className="admin-kpis">
        {[['Users',users,'All accounts'],['Live websites',published,'Currently published'],['All websites',sites,'Draft + live + archived'],['Media files',media,'Photos, video and music']].map(([a,b,c])=><div className="admin-kpi" key={String(a)}><span>{a}</span><b>{Number(b).toLocaleString()}</b><small>{c}</small></div>)}
      </section>
    </div>

    <div className="mt-8 grid gap-4 md:grid-cols-3">
      <Link href="/admin/users" className="card block p-5 transition hover:-translate-y-0.5"><span className="text-xs font-black uppercase tracking-[.15em] text-blue-500">01</span><h2 className="mt-2 text-lg font-black">User 360°</h2><p className="mt-2 text-sm leading-6 text-zinc-500">Open any user and see their profile, all websites, live links and uploaded media.</p></Link>
      <Link href="/admin/websites" className="card block p-5 transition hover:-translate-y-0.5"><span className="text-xs font-black uppercase tracking-[.15em] text-pink-500">02</span><h2 className="mt-2 text-lg font-black">Website control</h2><p className="mt-2 text-sm leading-6 text-zinc-500">Publish, unpublish, archive or permanently remove a user's website and its media.</p></Link>
      <Link href="/admin/media" className="card block p-5 transition hover:-translate-y-0.5"><span className="text-xs font-black uppercase tracking-[.15em] text-emerald-500">03</span><h2 className="mt-2 text-lg font-black">Media library</h2><p className="mt-2 text-sm leading-6 text-zinc-500">Review stored uploads and clean up files when needed.</p></Link>
    </div>

    <div className="mt-10"><div className="mb-4"><h2 className="text-xl font-black">Admin modules</h2><p className="mt-1 text-sm text-zinc-500">Everything else is one click away.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{modules.map((m,i)=><Link href={m.href} key={m.href} className="card p-4 transition hover:bg-white/10"><div className="flex items-center justify-between"><b className="text-sm">{m.label}</b><span className="text-xs text-zinc-400">{String(i+1).padStart(2,'0')}</span></div><p className="mt-2 text-xs text-zinc-500">Open →</p></Link>)}</div></div>
  </main>;
}
