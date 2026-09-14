export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import Link from 'next/link';
import { getSessionUser, isApprovalRequired } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';

const moods: Record<string,string> = {
  master:'✨', romantic:'🌹', cute:'🧸', luxury:'✦', anime:'⚡', gaming:'🎮', minimal:'◌', elegant:'🕊️', festival:'🎊'
};

export default async function Dashboard({ searchParams }: { searchParams: { pending?: string } }) {
  const u = await getSessionUser();
  if (!u) redirect('/login');
  const gated = u.role !== 'admin' && !u.approved && await isApprovalRequired();

  let sites: any[] = [];
  let loadError = '';
  try { sites = await db.website.findMany({ where: { userId: u.id }, orderBy: { updatedAt: 'desc' } }); }
  catch (error) { console.error('dashboard websites load failed', error); loadError = 'Your account loaded, but websites could not be loaded. Check Supabase tables/RLS.'; }

  const published = sites.filter(s => s.status === 'published').length;
  const views = sites.reduce((a, s) => a + Number(s.views || 0), 0);

  return (
    <main className="studio-dashboard">
      <aside className="studio-dashboard-sidebar">
        <div className="studio-wordmark"><span>✦</span><div><b>Wishly</b><small>Studio</small></div></div>
        <nav>
          <Link className="active" href="/dashboard">▦ <span>My Websites</span></Link>
          <Link href="/templates">◈ <span>Template Library</span></Link>
          <Link href="/builder/new">＋ <span>Create New</span></Link>
        </nav>
        <div className="studio-sidebar-bottom">
          <Link href="/profile">⚙ <span>Settings</span></Link>
          <a href="/api/auth/logout">↪ <span>Logout</span></a>
          <div className="studio-user"><div>{(u.name || u.email || 'U').slice(0,1).toUpperCase()}</div><span>{u.name || u.email}</span></div>
        </div>
      </aside>

      <section className="studio-dashboard-main">
        <header className="studio-dashboard-header">
          <div><p>YOUR WORKSPACE</p><h1>My Websites</h1><span>Create, edit and publish beautiful experiences.</span></div>
          <div className="studio-header-actions">
            {u.role === 'admin' && <Link className="studio-secondary-btn" href="/admin">Admin</Link>}
            {gated ? <span className="studio-primary-btn disabled">＋ Create New</span> : <Link className="studio-primary-btn" href="/builder/new">＋ Create New</Link>}
          </div>
        </header>

        {gated && <div className="studio-alert">Your account is waiting for admin approval before new websites can be created.</div>}
        {loadError && <div className="studio-alert">{loadError}</div>}

        <div className="studio-stats">
          <div><span>WEBSITES</span><b>{sites.length}</b><small>All your projects</small></div>
          <div><span>PUBLISHED</span><b>{published}</b><small>Live experiences</small></div>
          <div><span>TOTAL VIEWS</span><b>{views.toLocaleString()}</b><small>Across all websites</small></div>
        </div>

        <div className="studio-section-title"><div><h2>Recent projects</h2><span>Pick up where you left off.</span></div><Link href="/templates">Browse templates →</Link></div>
        <div className="studio-project-grid">
          {sites.map(s => {
            const c = s.content || {};
            const tid = s.templateId || c.templateId || 'master';
            return <article className="studio-project-card" key={s.id}>
              <div className={`studio-project-preview mood-${tid}`}>
                <span>{moods[tid] || '✦'}</span><b>{c.name || s.title || 'Untitled celebration'}</b><small>{c.occasion || 'Birthday'} experience</small>
                <div className="studio-preview-pill">{s.status === 'published' ? '● Live' : 'Draft'}</div>
              </div>
              <div className="studio-project-meta">
                <div><h3>{s.title || c.name || 'Untitled celebration'}</h3><p>/{s.slug} · {s.status}</p>{s.status === 'published' && <a className="studio-live-link" href={`/site/${s.slug}`} target="_blank" rel="noreferrer">Open live site ↗</a>}</div>
                <div className="studio-card-actions"><Link href={`/builder/${s.id}`}>Edit ↗</Link><form action={`/api/websites/${s.id}`} method="post" onSubmit={(e)=>{ if(!confirm('Delete this website permanently?')) e.preventDefault(); }}><input type="hidden" name="_method" value="DELETE"/><button type="submit">Delete</button></form></div>
              </div>
            </article>;
          })}
          {!sites.length && <div className="studio-empty"><div>✦</div><h3>Your first masterpiece starts here.</h3><p>Choose a template and build a celebration that feels completely personal.</p>{!gated && <Link className="studio-primary-btn" href="/builder/new">Create your first website</Link>}</div>}
        </div>
      </section>
    </main>
  );
}
