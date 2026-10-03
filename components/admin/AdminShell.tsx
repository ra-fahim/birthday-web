'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ADMIN_GROUPS } from '@/lib/admin-nav';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/admin';
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);

  const isActive = (href: string) => href === '/admin' ? pathname === '/admin' : pathname === href || pathname.startsWith(href + '/');
  const current = ADMIN_GROUPS.flatMap(([, items]) => items).find(([, href]) => isActive(href));

  return (
    <div className="adm" data-open={open ? '1' : '0'}>
      <aside className="adm-side" aria-label="Admin navigation">
        <Link href="/admin" className="adm-brand">
          <span className="adm-logo">W</span>
          <span><b>Wishes</b><small>Admin console</small></span>
        </Link>
        <nav className="adm-nav">
          {ADMIN_GROUPS.map(([group, items]) => (
            <div key={group} className="adm-group">
              <div className="adm-group-label">{group}</div>
              {items.map(([label, href, icon]) => (
                <Link key={href} href={href} className={`adm-link ${isActive(href) ? 'is-active' : ''}`} aria-current={isActive(href) ? 'page' : undefined}>
                  <span className="adm-ico" aria-hidden>{icon}</span><span>{label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="adm-side-foot">
          <Link href="/dashboard" className="adm-foot-link">← Back to my workspace</Link>
        </div>
      </aside>
      <button type="button" className="adm-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />
      <div className="adm-main">
        <header className="adm-top">
          <button type="button" className="adm-burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(v => !v)}>☰</button>
          <div className="adm-crumb"><span>Admin</span><i>/</i><b>{current ? current[0] : 'Dashboard'}</b></div>
          <div className="adm-top-right">
            <Link href="/" className="adm-pill" target="_blank">View site ↗</Link>
          </div>
        </header>
        <div className="adm-content">{children}</div>
      </div>
    </div>
  );
}
