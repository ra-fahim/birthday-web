export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { ADMIN_GROUPS } from '@/lib/admin-nav';

export default async function Admin() {
  try { await requireAdmin(); } catch { redirect('/login?error=admin_required'); }
  const [users, sites, templates, demos, media, published] = await Promise.all([
    db.user.count(), db.website.count(), db.template.count(), db.demoSite.count(), db.media.count(), db.website.count({where:{status:'published'}}),
  ]);
  const [draft, archived] = await Promise.all([db.website.count({where:{status:'draft'}}), db.website.count({where:{status:'archived'}})]);
  const kpis: [string, number, string, string, string][] = [
    ['Users', users, 'All accounts', '👥', 'blue'],
    ['Live websites', published, 'Currently published', '🌐', 'green'],
    ['All websites', sites, `${draft} draft · ${archived} archived`, '🎂', 'pink'],
    ['Media files', media, 'Photos, video and music', '🖼️', 'violet'],
  ];
  const quick: [string, string, string, string][] = [
    ['User 360°', 'Profile, websites, live links and media for any user.', '/admin/users', '👥'],
    ['Website control', 'Publish, unpublish, archive or remove a website.', '/admin/websites', '🌐'],
    ['Media library', 'Review uploads and clean up stored files.', '/admin/media', '🖼️'],
    ['Settings', 'Approval rules, invite link and site options.', '/admin/settings', '⚙️'],
  ];

  return <main className="adm-page">
    <section className="adm-hero">
      <div>
        <span className="adm-eyebrow">Wishes Control Room</span>
        <h1>Everything under control.</h1>
        <p>See every user, every celebration, every uploaded file and every live link from one place.</p>
        <div className="adm-hero-actions">
          <Link className="adm-btn adm-btn-light" href="/admin/users">View all users</Link>
          <Link className="adm-btn adm-btn-ghost" href="/admin/websites">Manage websites</Link>
        </div>
      </div>
      <div className="adm-hero-art" aria-hidden><span>✦</span><span>♥</span><span>🎂</span></div>
    </section>

    <section className="adm-kpi-grid">
      {kpis.map(([label, value, sub, icon, tone]) => <div className={`adm-kpi tone-${tone}`} key={label}>
        <div className="adm-kpi-ico">{icon}</div>
        <div><span>{label}</span><b>{Number(value).toLocaleString()}</b><small>{sub}</small></div>
      </div>)}
    </section>

    <section className="adm-section">
      <div className="adm-section-head"><h2>Quick actions</h2><p>The things you will do most often.</p></div>
      <div className="adm-quick-grid">
        {quick.map(([title, text, href, icon]) => <Link key={href} href={href} className="adm-quick">
          <span className="adm-quick-ico">{icon}</span><h3>{title}</h3><p>{text}</p><em>Open →</em>
        </Link>)}
      </div>
    </section>

    {ADMIN_GROUPS.filter(([g]) => g !== 'Overview').map(([group, items]) => <section className="adm-section" key={group}>
      <div className="adm-section-head"><h2>{group}</h2></div>
      <div className="adm-module-grid">
        {items.map(([label, href, icon]) => <Link key={href} href={href} className="adm-module"><span>{icon}</span><b>{label}</b><i>→</i></Link>)}
      </div>
    </section>)}
  </main>;
}
