export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import Link from 'next/link';
import { getSessionUser, isApprovalRequired } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import DeleteWebsiteButton from './DeleteWebsiteButton';

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
    <main className="workspace-dashboard">
      <aside className="workspace-dashboard-sidebar">
        <div className="workspace-wordmark"><span>✦</span><div><b>Wishly</b><small>Create moments</small></div></div>
        <nav>
          <Link className="active" href="/dashboard">▦ <span>My Websites</span></Link>
          <Link href="/templates">◈ <span>Template Library</span></Link>
          <Link href="/create">＋ <span>Create New</span></Link>
        </nav>
        <div className="workspace-sidebar-bottom">
          <Link href="/profile">⚙ <span>Settings</span></Link>
          <a href="/api/auth/logout">↪ <span>Logout</span></a>
          <div className="workspace-user"><div>{(u.name || u.email || 'U').slice(0,1).toUpperCase()}</div><span>{u.name || u.email}</span></div>
        </div>
      </aside>

      <section className="workspace-dashboard-main">
        <header className="workspace-dashboard-header">
          <div><p>YOUR WORKSPACE</p><h1>My Websites</h1><span>Create, edit and publish beautiful experiences.</span></div>
          <div className="workspace-header-actions">
            {u.role === 'admin' && <Link className="workspace-secondary-btn" href="/admin">Admin</Link>}
            {gated ? <span className="workspace-primary-btn disabled">＋ Create New</span> : <Link className="workspace-primary-btn" href="/create">＋ Create New</Link>}
          </div>
        </header>

        {gated && <div className="workspace-alert">Your account is waiting for admin approval before new websites can be created.</div>}
        {loadError && <div className="workspace-alert">{loadError}</div>}

        <div className="workspace-stats">
          <div><span>WEBSITES</span><b>{sites.length}</b><small>All your projects</small></div>
          <div><span>PUBLISHED</span><b>{published}</b><small>Live experiences</small></div>
          <div><span>TOTAL VIEWS</span><b>{views.toLocaleString()}</b><small>Across all websites</small></div>
        </div>

        <div className="workspace-section-title"><div><h2>Recent projects</h2><span>Pick up where you left off.</span></div><Link href="/templates">Browse templates →</Link></div>
        <div className="workspace-project-grid">
          {sites.map(s => {
            const c = s.content || {};
            const tid = s.templateId || c.templateId || 'master';
            return <article className="workspace-project-card" key={s.id}>
              <div className={`workspace-project-preview mood-${tid}`}>
                <span>{moods[tid] || '✦'}</span><b>{c.name || s.title || 'Untitled celebration'}</b><small>{c.occasion || 'Birthday'} experience</small>
                <div className="workspace-preview-pill">{s.status === 'published' ? '● Live' : 'Draft'}</div>
              </div>
              <div className="workspace-project-meta">
                <div><h3>{s.title || c.name || 'Untitled celebration'}</h3><p>/{s.slug} · {s.status}</p>{s.status === 'published' && <a className="workspace-live-link" href={`/site/${s.slug}`} target="_blank" rel="noreferrer">Open live site ↗</a>}</div>
                <div className="workspace-card-actions"><Link href={`/builder/${s.id}`}>Edit ↗</Link><DeleteWebsiteButton id={s.id} /></div>
              </div>
            </article>;
          })}
          {!sites.length && <div className="workspace-empty"><div>✦</div><h3>Your first masterpiece starts here.</h3><p>Choose a template and build a celebration that feels completely personal.</p>{!gated && <Link className="workspace-primary-btn" href="/create">Create your first website</Link>}</div>}
        </div>
      </section>
    </main>
  );
}
