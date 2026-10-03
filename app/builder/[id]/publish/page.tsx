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

  return (
    <main className="bp-publish">
      <div className="bp-card">
        <div className="bp-badge" aria-hidden>{liveUrl ? '✨' : '🔗'}</div>
        <h1>{liveUrl ? 'Your website is live ✨' : 'Choose your live link'}</h1>
        <p className="bp-sub">
          {liveUrl ? 'Share this link with your special person.' : 'Pick a custom link name. It must be unique — we check it for you.'}
        </p>
        {!site && !err && <p className="bp-loading">Loading…</p>}
        {site && !liveUrl && (<>
          <label className="bp-label">CUSTOM LINK</label>
          <div className={`bp-input-wrap${check.state === 'ok' ? ' is-ok' : check.state === 'bad' ? ' is-bad' : ''}`}>
            <span className="bp-input-prefix">{host}/site/</span>
            <input value={slug} onChange={e => setSlug(clean(e.target.value))} placeholder="my-birthday" maxLength={63} autoCapitalize="none" autoCorrect="off" spellCheck={false} />
          </div>
          <p className={`bp-hint${check.state === 'ok' ? ' is-ok' : check.state === 'bad' ? ' is-bad' : ''}`}>
            {check.state === 'checking' && 'Checking…'}{check.state === 'ok' && '✓ Available'}{check.state === 'bad' && (check.reason || 'Not available')}
          </p>
          {err && <p className="bp-error">{err}</p>}
          <div className="bp-actions">
            <button className="bp-btn bp-btn-ghost" onClick={() => router.push('/builder/' + id)}>← Back to editor</button>
            <button className="bp-btn bp-btn-primary" disabled={check.state !== 'ok' || busy} onClick={publish}>{busy ? 'Publishing…' : 'Publish website ↗'}</button>
          </div>
        </>)}
        {liveUrl && (<>
          <div className="bp-live-url">{liveUrl}</div>
          <div className="bp-actions">
            <button className="bp-btn bp-btn-primary" onClick={() => { navigator.clipboard?.writeText(liveUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? 'Copied ✓' : 'Copy link'}</button>
            <a href={liveUrl} target="_blank" rel="noreferrer" className="bp-btn bp-btn-ghost">Open ↗</a>
            <button className="bp-btn bp-btn-ghost" onClick={() => setLiveUrl('')}>Change link</button>
            <button className="bp-btn bp-btn-ghost" onClick={() => router.push('/builder/' + id)}>Back to editor</button>
          </div>
        </>)}
        {err && !site && <p className="bp-error">{err}</p>}
      </div>
    </main>
  );
}
