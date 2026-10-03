'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Mode = 'login' | 'signup';

const googleErrors: Record<string, string> = {
  google_not_configured: 'Google Login is not configured yet.',
  google_invalid_state: 'Google Login security check failed. Please try again.',
  google_token_failed: 'Google Login could not be completed. Please try again.',
  google_profile_failed: 'Could not read your Google profile. Please try again.',
  google_email_not_verified: 'Your Google email is not verified.',
  google_login_failed: 'Google Login failed. Please try again.',
  auth_callback_failed: 'Authentication could not be completed. Please try again.',
  supabase_not_configured: 'Supabase authentication is not configured yet.',
};

function safeNext(v: string | null) {
  if (!v || !v.startsWith('/') || v.startsWith('//') || v.includes('\\')) return '';
  return v;
}

function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p) || p.length >= 12) s++;
  return s;
}

const STRENGTH_LABEL = ['Too short', 'Weak', 'Okay', 'Good', 'Strong'];

export default function AuthExperience({ mode }: { mode: Mode }) {
  const router = useRouter();
  const isSignup = mode === 'signup';
  const [next, setNext] = useState('');
  const [invite, setInvite] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    setNext(safeNext(q.get('next')));
    setInvite(q.get('invite') || '');
    const code = q.get('error');
    if (code) setErr(googleErrors[code] || 'Login failed. Please try again.');
  }, []);

  const qs = (extra: Record<string, string>) => {
    const p = new URLSearchParams();
    Object.entries(extra).forEach(([k, v]) => { if (v) p.set(k, v); });
    const s = p.toString();
    return s ? `?${s}` : '';
  };

  const googleHref = `/api/auth/google${qs({ next, invite })}`;
  const loginHref = `/login${qs({ next })}`;
  const signupHref = `/signup${qs({ next, invite })}`;
  const fromCreate = next.startsWith('/builder') || next.startsWith('/create') || next.startsWith('/templates');
  const score = useMemo(() => strength(password), [password]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(''); setMsg('');
    setLoading(true);
    try {
      const r = await fetch(isSignup ? '/api/auth/signup' : '/api/auth/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(isSignup ? (invite ? { name, email, password, invite } : { name, email, password }) : { email, password }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(j.error || (isSignup ? 'Signup failed' : 'Login failed')); return; }
      if (isSignup && j.requiresEmailVerification) {
        setMsg('Account created. Please check your email and verify your address, then log in to continue.');
        return;
      }
      router.push(next || '/dashboard');
      router.refresh();
    } catch {
      setErr('Something went wrong. Check your internet and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="ax-shell">
      <div className="ax-orb ax-orb-a" aria-hidden />
      <div className="ax-orb ax-orb-b" aria-hidden />

      <section className="ax-brand">
        <Link href="/" className="ax-lockup" aria-label="Wishes home">
          <span className="ax-mark">✦</span>
          <span><b>Wishes</b><small>Create moments</small></span>
        </Link>

        <div className="ax-brand-body">
          <span className="ax-chip"><i /> Free to start · No card needed</span>
          <h1>
            {isSignup ? <>Make something they’ll <em>remember.</em></> : <>Welcome back to your <em>creative space.</em></>}
          </h1>
          <p>
            {isSignup
              ? 'Pick a template, add your story, and publish one beautiful link that feels like it was made just for them.'
              : 'Your celebrations, memories and stories — kept beautifully in one place, ready whenever you are.'}
          </p>

          <div className="ax-stack" aria-hidden>
            <div className="ax-glass ax-glass-1"><span>🎂</span><div><b>Happy Birthday</b><small>Countdown · Cake · Letter</small></div></div>
            <div className="ax-glass ax-glass-2"><span>💌</span><div><b>A letter for you</b><small>Opens with a tap</small></div></div>
            <div className="ax-glass ax-glass-3"><span>🔗</span><div><b>yourword.link</b><small>One shareable link</small></div></div>
          </div>

          <ul className="ax-points">
            <li><i>⚡</i> Live in minutes, not days</li>
            <li><i>📱</i> Looks perfect on every phone</li>
            <li><i>🎨</i> Edit every word and photo yourself</li>
          </ul>
        </div>

        <p className="ax-foot">© Wishes · Made for the moments that matter</p>
      </section>

      <section className="ax-formside">
        <Link href="/" className="ax-lockup ax-lockup-m" aria-label="Wishes home"><span className="ax-mark">✦</span><span><b>Wishes</b><small>Create moments</small></span></Link>
        <div className="ax-card">
          <div className="ax-tabs" role="tablist" aria-label="Account">
            <Link role="tab" aria-selected={!isSignup} className={!isSignup ? 'on' : ''} href={loginHref}>Log in</Link>
            <Link role="tab" aria-selected={isSignup} className={isSignup ? 'on' : ''} href={signupHref}>Sign up</Link>
          </div>

          <h2>{isSignup ? 'Create your free account' : 'Welcome back'}</h2>
          <p className="ax-sub">
            {fromCreate
              ? (isSignup ? 'One quick step and you can start creating your website.' : 'Log in to continue creating your website.')
              : (isSignup ? 'Start building your first celebration website.' : 'Log in to open your dashboard.')}
          </p>

          {invite && isSignup && <div className="ax-note ax-note-ok">✓ Invite link detected — your account will be approved instantly.</div>}

          <a href={googleHref} className="ax-google">
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"/></svg>
            Continue with Google
          </a>

          <div className="ax-or"><span>or use email</span></div>

          <form onSubmit={submit} className="ax-form" noValidate={false}>
            {isSignup && (
              <label className="ax-field">
                <span>Full name</span>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" autoComplete="name" required />
              </label>
            )}
            <label className="ax-field">
              <span>Email</span>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
            </label>
            <label className="ax-field">
              <span>Password {!isSignup && <Link href="/forgot-password" className="ax-forgot">Forgot?</Link>}</span>
              <div className="ax-pass">
                <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={isSignup ? 'At least 8 characters' : 'Your password'} autoComplete={isSignup ? 'new-password' : 'current-password'} required />
                <button type="button" onClick={() => setShow(v => !v)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? 'Hide' : 'Show'}</button>
              </div>
            </label>

            {isSignup && password && (
              <div className="ax-meter" aria-live="polite">
                <div>{[0, 1, 2, 3].map(i => <i key={i} className={i < score ? `on s${score}` : ''} />)}</div>
                <small>{STRENGTH_LABEL[score]}</small>
              </div>
            )}

            {err && <div className="ax-note ax-note-err" role="alert">{err}</div>}
            {msg && <div className="ax-note ax-note-ok" role="status">{msg}</div>}

            <button className="ax-submit" type="submit" disabled={loading}>
              {loading ? <span className="ax-spin" aria-hidden /> : null}
              {loading ? (isSignup ? 'Creating account…' : 'Logging in…') : (isSignup ? 'Create account' : 'Log in')}
              {!loading && <b>→</b>}
            </button>
          </form>

          <p className="ax-switch">
            {isSignup ? <>Already have an account? <Link href={loginHref}>Log in</Link></> : <>New to Wishes? <Link href={signupHref}>Create a free account</Link></>}
          </p>
          <p className="ax-legal">Your content stays private until you publish a link.</p>
        </div>
      </section>
    </main>
  );
}
