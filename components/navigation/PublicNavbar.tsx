'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type PublicNavbarUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  profile?: { avatarUrl?: string | null } | null;
} | null;

const links = [
  ['/templates', 'Templates'],
  ['/features', 'Features'],
  ['/pricing', 'Pricing'],
  ['/demo', 'Demo'],
  ['/about', 'About'],
  ['/how-to-make-website', 'How to make a website'],
] as const;

export default function PublicNavbar({ user }: { user: PublicNavbarUser }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const avatar = user?.profile?.avatarUrl || '';
  const initial = (user?.name || user?.email || 'U').slice(0, 1).toUpperCase();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <nav className="premium-nav">
      <div className="premium-container premium-nav-inner" ref={wrapRef}>
        <Link href="/" className="brand-lockup" onClick={close}>
          <span className="brand-mark">✦</span>
          <span><b>Wishly</b><small>Studio</small></span>
        </Link>

        <div className="premium-nav-links">
          {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
        </div>

        <div className="premium-nav-actions">
          <div className="profile-menu">
            <button type="button" className={`profile-trigger ${open ? 'is-open' : ''}`} aria-expanded={open} aria-label={user ? 'Open profile menu' : 'Open account menu'} onClick={() => setOpen(value => !value)}>
              {avatar ? <img src={avatar} alt="" /> : <span>{initial}</span>}
              <i>⌄</i>
            </button>
            {open && (
              <div className="profile-popover">
                <div className="profile-popover-head">
                  <div className="profile-avatar-lg">{avatar ? <img src={avatar} alt="" /> : initial}</div>
                  <div><strong>{user?.name || (user ? 'Creator' : 'Welcome to Wishly')}</strong><small>{user?.email || 'Create a free account to start'}</small></div>
                </div>
                {user ? <>
                  <div className="profile-quick-grid">
                    <Link href="/dashboard" onClick={close}>Dashboard</Link>
                    <Link href="/builder/new" onClick={close}>Create website</Link>
                  </div>
                  <div className="profile-popover-links">
                    <Link href="/profile" onClick={close}>Profile settings <span>↗</span></Link>
                    <Link href="/profile" onClick={close}>Profile settings <span>↗</span></Link>
                    {user.role === 'admin' && <Link href="/admin" onClick={close}>Admin dashboard <span>↗</span></Link>}
                    <a href="/api/auth/logout">Log out <span>↪</span></a>
                  </div>
                </> : <div className="profile-popover-links"><Link href="/login" onClick={close}>Log in <span>↗</span></Link><Link href="/signup" onClick={close}>Sign up free <span>↗</span></Link></div>}
              </div>
            )}
          </div>
        </div>

        {open && (
          <div className="mobile-nav-panel">
            <div className="mobile-nav-panel-profile">
              <div className="profile-avatar-lg">{avatar ? <img src={avatar} alt="" /> : initial}</div>
              <div><strong>{user?.name || (user ? 'Creator' : 'Welcome')}</strong><small>{user?.email || 'Explore Wishly Studio'}</small></div>
            </div>
            <div className="mobile-nav-links">
              {links.map(([href, label]) => <Link key={href} href={href} onClick={close}>{label}<span>↗</span></Link>)}
              <Link href="/faq" onClick={close}>FAQ<span>↗</span></Link>
              <Link href="/contact" onClick={close}>Contact<span>↗</span></Link>
              <Link href="/how-to-make-website" onClick={close}>How to make a website<span>↗</span></Link>
            </div>
            <div className="mobile-nav-account">
              {user ? <>
                <Link href="/dashboard" onClick={close}>Dashboard</Link>
                <Link href="/builder/new" onClick={close}>Create website</Link>
                <Link href="/profile" onClick={close}>Profile settings</Link>
                <Link href="/profile" onClick={close}>Profile settings</Link>
                {user.role === 'admin' && <Link href="/admin" onClick={close}>Admin</Link>}
                <a href="/api/auth/logout">Log out</a>
              </> : <><Link href="/login" onClick={close}>Log in</Link><Link className="mobile-nav-cta" href="/signup" onClick={close}>Sign up free →</Link></>}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
