'use client';
import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { normalizeAppUrl } from '@/lib/app-url';

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;
const clean = (v: string) => v.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-{2,}/g, '-').replace(/^-+/, '');

export default function PublishPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [site, setSite] = useState<any>(null);
  const [slug, setSlug] = useState('');
  const [check, setCheck] = useState<{ state: 'idle' | 'checking' | 'ok' | 'bad'; reason?: string }>({ state: 'idle' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const seq = useRef(0);

  const origin = normalizeAppUrl(process.env.NEXT_PUBLIC_APP_URL) || (typeof window !== 'undefined' ? window.location.origin : '');
  const host = origin.replace(/^https?:\/\//, '');

  useEffect(() => {
    (async () => {
      const r = await fetch('/api/websites/' + id);
      if (r.status === 401) { router.push('/login?next=' + encodeURIComponent('/builder/' + id + '/publish')); return; }
      if (!r.ok) { setErr('Website not found.'); return; }
      const j = await r.json();
      setSite(j);
      setSlug(j.slug || '');
      if (j.status === 'published' && j.slug) setLiveUrl(`${origin}/site/${j.slug}`);
    })();
  }, [id]);

  useEffect(() => {
    if (!site) return;
    const s = slug.trim();
    if (!s) { setCheck({ state: 'idle' }); return; }
    if (s.length < 3) { setCheck({ state: 'bad', reason: 'Use at least 3 characters.' }); return; }
    if (!SLUG_RE.test(s)) { setCheck({ state: 'bad', reason: 'Cannot start or end with a hyphen.' }); return; }
    setCheck({ state: 'checking' });
    const n = ++seq.current;
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/websites/slug-check?slug=${encodeURIComponent(s)}&id=${encodeURIComponent(id)}`);
        const j = await r.json();
        if (n !== seq.current) return;
        setCheck(j.valid && j.available ? { state: 'ok' } : { state: 'bad', reason: j.reason || 'Not available.' });
      } catch { if (n === seq.current) setCheck({ state: 'bad', reason: 'Could not check. Try again.' }); }
    }, 400);
    return () => clearTimeout(t);
  }, [slug, site]);

  async function publish() {
    if (check.state !== 'ok' || busy) return;
    setBusy(true); setErr('');
    try {
      const s = slug.trim();
      const content = site.content || {};
      const mb = content.templateConfig?.masterBirthday;
      const nextContent = mb ? { ...content, templateConfig: { ...content.templateConfig, masterBirthday: { ...mb, customSlug: s } } } : content;
      const r = await fetch('/api/websites/' + id, {
        method: 'PUT', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ content: nextContent, templateId: site.template_id, title: site.title, status: 'published', slug: s, seo: site.seo || undefined }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(j.error || 'Could not publish. Try again.'); return; }
      setSite({ ...site, content: nextContent, slug: j.slug || s, status: 'published' });
      setLiveUrl(`${origin}/site/${j.slug || s}`);
    } catch { setErr('Something went wrong. Check your internet and try again.'); }
    finally { setBusy(false); }
  }

  const box: React.CSSProperties = { maxWidth: 560, margin: '0 auto', padding: 24, borderRadius: 20, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)' };
  const btn: React.CSSProperties = { padding: '12px 18px', borderRadius: 12, border: 0, fontWeight: 700, cursor: 'pointer', color: '#fff', background: 'linear-gradient(135deg,#ec4899,#8b5cf6)' };
  const ghost: React.CSSProperties = { ...btn, background: 'rgba(255,255,255,.1)' };

  return (
    <main style={{ minHeight: '100vh', background: '#0b0b12', color: '#fff', padding: '48px 16px' }}>
      <div style={box}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>{liveUrl ? 'Your website is live ✨' : 'Choose your live link'}</h1>
        <p style={{ color: '#a1a1aa', marginBottom: 20, fontSize: 14 }}>
          {liveUrl ? 'Share this link with your special person.' : 'Pick a custom link name. It must be unique — we check it for you.'}
        </p>
        {!site && !err && <p style={{ color: '#a1a1aa' }}>Loading…</p>}
        {site && !liveUrl && (<>
          <label style={{ fontSize: 12, color: '#a1a1aa' }}>CUSTOM LINK</label>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 6, borderRadius: 12, border: '1px solid rgba(255,255,255,.18)', background: 'rgba(0,0,0,.35)', overflow: 'hidden' }}>
            <span style={{ padding: '12px 0 12px 12px', color: '#a1a1aa', fontSize: 14, whiteSpace: 'nowrap' }}>{host}/site/</span>
            <input value={slug} onChange={e => setSlug(clean(e.target.value))} placeholder="my-birthday" maxLength={63} autoCapitalize="none" autoCorrect="off" spellCheck={false}
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: 0, outline: 0, color: '#fff', padding: '12px 12px 12px 2px', fontSize: 14 }} />
          </div>
          <p style={{ minHeight: 20, marginTop: 8, fontSize: 13, color: check.state === 'ok' ? '#4ade80' : check.state === 'bad' ? '#f87171' : '#a1a1aa' }}>
            {check.state === 'checking' && 'Checking…'}{check.state === 'ok' && '✓ Available'}{check.state === 'bad' && (check.reason || 'Not available')}
          </p>
          {err && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 8 }}>{err}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
            <button style={ghost} onClick={() => router.push('/builder/' + id)}>← Back to editor</button>
            <button style={{ ...btn, opacity: check.state === 'ok' && !busy ? 1 : .5 }} disabled={check.state !== 'ok' || busy} onClick={publish}>{busy ? 'Publishing…' : 'Publish website ↗'}</button>
          </div>
        </>)}
        {liveUrl && (<>
          <div style={{ padding: 14, borderRadius: 12, background: 'rgba(0,0,0,.35)', border: '1px solid rgba(255,255,255,.18)', wordBreak: 'break-all', fontWeight: 700 }}>{liveUrl}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
            <button style={btn} onClick={() => { navigator.clipboard?.writeText(liveUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? 'Copied ✓' : 'Copy link'}</button>
            <a href={liveUrl} target="_blank" rel="noreferrer" style={{ ...ghost, textDecoration: 'none', display: 'inline-block' }}>Open ↗</a>
            <button style={ghost} onClick={() => setLiveUrl('')}>Change link</button>
            <button style={ghost} onClick={() => router.push('/builder/' + id)}>Back to editor</button>
          </div>
        </>)}
        {err && !site && <p style={{ color: '#f87171' }}>{err}</p>}
      </div>
    </main>
  );
}
