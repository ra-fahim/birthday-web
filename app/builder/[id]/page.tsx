'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { defaultContent, BirthdayContent } from '@/lib/types';
import { MasterTemplate } from '@/components/template/MasterTemplate';
import ExperienceTemplate from '@/components/template/ExperienceTemplates';
import { SingleMediaUpload, GalleryUpload } from './MediaUploader';
import FeatureControls from './FeatureControls';
import { TimelineEditor, MemoriesEditor, WishlistEditor, GuestbookToggle } from './ContentListEditors';

const OCCASIONS = [
  ['birthday', '🎂', 'Birthday'], ['anniversary', '💕', 'Anniversary'], ['proposal', '💍', 'Proposal'],
  ['wedding', '💒', 'Wedding'], ['graduation', '🎓', 'Graduation'], ['congratulations', '🏆', 'Congratulations'],
  ['thank-you', '💐', 'Thank You'], ['surprise', '🎁', 'Surprise'], ['friendship', '🤝', 'Friendship'], ['festival', '🎊', 'Festival'],
] as const;

const TEMPLATES = [
  ['master', 'Magic Bloom', 'The cinematic master experience'], ['romantic', 'Midnight Love', 'Soft, intimate and romantic'],
  ['cute', 'Pastel Dream', 'Playful, bright and adorable'], ['luxury', 'Royal Celebration', 'Editorial luxury and elegance'],
  ['anime', 'Neon Story', 'Anime-inspired energy'], ['gaming', 'Level Up', 'Arcade / gamer celebration'],
  ['minimal', 'Pure Moment', 'Quiet, clean and modern'], ['elegant', 'Ever After', 'Classic, graceful and timeless'],
  ['festival', 'Color Parade', 'Big, joyful festival energy'],
] as const;

const TABS = [
  ['overview', '✦', 'Overview'], ['opening', '◌', 'Opening'], ['story', '♡', 'Reasons'], ['gallery', '▧', 'Gallery'],
  ['music', '♪', 'Music'], ['video', '▶', 'Video'], ['letter', '✉', 'Letter'], ['theme', '◈', 'Theme'], ['effects', '✧', 'Effects'],
  ['timeline', '⌁', 'Timeline'], ['memories', '◫', 'Memories'], ['wishlist', '◇', 'Wishlist'], ['guestbook', '☷', 'Guestbook'],
  ['growth', '↗', 'Growth'], ['advanced', '⚙', 'Advanced'],
] as const;

type TabId = typeof TABS[number][0];

function Section({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children: React.ReactNode }) {
  return <section className="builder-section">
    <div className="builder-section-head">
      <div>{eyebrow && <div className="builder-eyebrow">{eyebrow}</div>}<h2>{title}</h2>{description && <p>{description}</p>}</div>
    </div>
    <div className="mt-5">{children}</div>
  </section>;
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="builder-field"><span>{label}</span>{hint && <small>{hint}</small>}{children}</label>;
}

function ArrayEditor({ title, description, items, placeholder, onChange, multiline = false }: {
  title: string; description?: string; items: string[]; placeholder: string; onChange: (items: string[]) => void; multiline?: boolean;
}) {
  const [draft, setDraft] = useState('');
  const add = () => { const value = draft.trim(); if (!value) return; onChange([...items, value]); setDraft(''); };
  return <div className="builder-list-editor">
    <div><h3>{title}</h3>{description && <p>{description}</p>}</div>
    <div className="builder-add-row">
      {multiline ? <textarea rows={3} value={draft} placeholder={placeholder} onChange={e => setDraft(e.target.value)} /> : <input value={draft} placeholder={placeholder} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />}
      <button className="builder-mini-btn" onClick={add}>+ Add</button>
    </div>
    <div className="builder-item-list">
      {items.map((item, i) => <div className="builder-item" key={`${item}-${i}`}><span>{item}</span><button onClick={() => onChange(items.filter((_, idx) => idx !== i))} aria-label={`Remove item ${i + 1}`}>×</button></div>)}
      {!items.length && <div className="builder-empty">Nothing added yet. Add your first item above.</div>}
    </div>
  </div>;
}

export default function Builder() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [c, setC] = useState<BirthdayContent>(defaultContent);
  const [tab, setTab] = useState<TabId>('overview');
  const [msg, setMsg] = useState('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState('draft');
  const [templateId, setTemplateId] = useState('master');
  const [occasion, setOccasion] = useState('birthday');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch('/api/websites/' + id).then(r => r.json()).then(j => {
      if (j.content) setC({ ...defaultContent, ...j.content });
      if (j.slug) setSlug(j.slug);
      if (j.status) setStatus(j.status);
      if (j.templateId) setTemplateId(j.templateId);
      if (j.content?.occasion) setOccasion(j.content.occasion);
    });
  }, [id]);

  const update = (patch: Partial<BirthdayContent>) => { setC(prev => ({ ...prev, ...patch })); setDirty(true); };
  const updateArray = (key: keyof BirthdayContent, value: unknown) => update({ [key]: value } as Partial<BirthdayContent>);

  async function save(publish = false) {
    setMsg(publish ? 'Publishing…' : 'Saving…');
    const next = { ...c, occasion, templateId };
    const r = await fetch('/api/websites/' + id, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ content: next, templateId, status: publish ? 'published' : 'draft' }) });
    const j = await r.json();
    setMsg(r.ok ? (publish ? 'Published successfully ✨' : 'Draft saved ✓') : (j.error || 'Something went wrong'));
    if (r.ok) { setStatus(publish ? 'published' : 'draft'); setDirty(false); }
    if (publish) router.refresh();
  }

  const currentOccasion = OCCASIONS.find(x => x[0] === occasion) || OCCASIONS[0];
  const activeTab = TABS.find(x => x[0] === tab);
  const previewContent = useMemo(() => ({ ...c, occasion, templateId }), [c, occasion, templateId]);

  return <main className="builder-shell">
    <header className="builder-topbar">
      <div className="builder-brand"><div className="builder-logo">W</div><div><strong>Wishly Studio</strong><span>Experience editor</span></div></div>
      <div className="builder-top-actions">
        <div className={`builder-status ${dirty ? 'is-dirty' : ''}`}><i />{dirty ? 'Unsaved changes' : status === 'published' ? 'Published' : 'All changes saved'}</div>
        <button className="builder-ghost" onClick={() => router.push('/dashboard')}>Exit</button>
        <button className="builder-save" onClick={() => save(false)}>Save draft</button>
        <button className="builder-publish" onClick={() => save(true)}>Publish ↗</button>
      </div>
    </header>

    <div className="builder-layout">
      <aside className="builder-sidebar">
        <div className="builder-project-card">
          <div className="builder-project-icon">{currentOccasion[1]}</div>
          <div className="min-w-0"><div className="builder-eyebrow">CURRENT PROJECT</div><h1>{c.name || 'Untitled celebration'}</h1><p>{currentOccasion[2]} · {templateId}</p></div>
        </div>

        <div className="builder-selector-grid">
          <div><span>Occasion</span><select value={occasion} onChange={e => { setOccasion(e.target.value); setDirty(true); }}>{OCCASIONS.map(([value, emoji, label]) => <option value={value} key={value}>{emoji} {label}</option>)}</select></div>
          <div><span>Experience</span><select value={templateId} onChange={e => { setTemplateId(e.target.value); setDirty(true); }}>{TEMPLATES.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>
        </div>

        <nav className="builder-nav">
          <div className="builder-nav-label">EDIT EXPERIENCE</div>
          {TABS.map(([value, icon, label]) => <button key={value} className={tab === value ? 'active' : ''} onClick={() => setTab(value)}><span>{icon}</span>{label}{['gallery','story','timeline','memories','wishlist'].includes(value) && <b>{value === 'story' ? c.reasons.length : value === 'gallery' ? c.gallery.length : value === 'timeline' ? c.timeline.length : value === 'memories' ? c.memories.length : c.wishlist.length}</b>}</button>)}
        </nav>

        <div className="builder-side-tip"><span>⌘</span><div><b>Live editing</b><p>Every change appears in the preview instantly.</p></div></div>
      </aside>

      <section className="builder-workspace">
        <div className="builder-editor-panel">
          <div className="builder-panel-head"><div><div className="builder-eyebrow">{activeTab?.[1]} {activeTab?.[2]}</div><h2>{activeTab?.[2]}</h2></div><span className="builder-live-pill">● LIVE</span></div>
          <div className="builder-form-scroll">
            {tab === 'overview' && <>
              <Section eyebrow="IDENTITY" title="Who is this celebration for?" description="These details personalize the experience without changing the master template structure.">
                <div className="builder-grid-2">
                  <Field label="Person / recipient name"><input value={c.name} onChange={e => update({ name: e.target.value })} placeholder="e.g. Riya" /></Field>
                  <Field label="Date"><input type="date" value={c.birthday} onChange={e => update({ birthday: e.target.value })} /></Field>
                  <Field label="Relationship"><input value={c.relationship} onChange={e => update({ relationship: e.target.value })} placeholder="Best friend, partner, sister…" /></Field>
                  <Field label="Public button text"><input value={c.buttonText} onChange={e => update({ buttonText: e.target.value })} placeholder="Make a wish" /></Field>
                </div>
              </Section>
              <Section eyebrow="CONTENT MAP" title="Your experience at a glance" description="Nothing here is decorative: these counters show what will actually render on the published page.">
                <div className="builder-metric-grid">{[['♡', c.reasons.length, 'Reasons'], ['▧', c.gallery.length, 'Photos'], ['✉', c.letter.length, 'Letter lines'], ['⌁', c.timeline.length, 'Timeline moments'], ['◫', c.memories.length, 'Memories'], ['◇', c.wishlist.length, 'Wishlist items']].map(([icon, value, label]) => <button key={String(label)} onClick={() => setTab(label === 'Reasons' ? 'story' : label === 'Photos' ? 'gallery' : label === 'Letter lines' ? 'letter' : label === 'Timeline moments' ? 'timeline' : label === 'Memories' ? 'memories' : 'wishlist')}><span>{icon}</span><b>{String(value)}</b><small>{String(label)}</small></button>)}</div>
              </Section>
              <Section eyebrow="CORE EXPERIENCE" title="One thing stays protected" description="The cinematic master experience, its sequence and fixed core message remain part of the template. You customize the meaningful inputs around it."><div className="builder-protected"><span>🔒</span><div><b>Master experience structure</b><p>The reveal flow, animation choreography and core message are intentionally protected so every published site keeps the same signature feel.</p></div></div></Section>
            </>}

            {tab === 'opening' && <>
              <Section eyebrow="OPENING" title="Shape the first impression" description="Edit the visible hero copy and opening CTA. The animation sequence itself stays intact.">
                <div className="builder-grid-2">
                  <Field label="Greeting"><input value={c.greeting} onChange={e => update({ greeting: e.target.value })} placeholder="Happy Birthday" /></Field>
                  <Field label="Hero title"><input value={c.heroTitle} onChange={e => update({ heroTitle: e.target.value })} /></Field>
                </div>
                <Field label="Hero subtitle"><textarea rows={4} value={c.heroSubtitle} onChange={e => update({ heroSubtitle: e.target.value })} /></Field>
                <div className="builder-note">Tip: Keep the title short. The master template uses typography and motion to make a short line feel cinematic.</div>
              </Section>
              <Section eyebrow="PRIVATE LINKS" title="Recipient-specific personalization" description="Create multiple private versions of the same experience from Growth → Personalized links."><div className="builder-protected"><span>🔗</span><div><b>Same design, different recipient</b><p>Each recipient can receive a unique link and a private personal note without changing the master layout.</p></div></div></Section>
            </>}

            {tab === 'story' && <Section eyebrow="THE HEART OF THE STORY" title="Reasons" description="These are the cards visitors reveal one by one. Unlike the old version, every reason is now editable here and updates the live preview immediately.">
              <ArrayEditor title="Your reasons" description="Add as many reasons as you want. The master template will automatically update its counter and sequence." items={c.reasons} placeholder="e.g. Your laugh always makes my day…" multiline onChange={items => updateArray('reasons', items)} />
            </Section>}

            {tab === 'gallery' && <Section eyebrow="MEMORIES" title="Photo gallery" description="Upload the actual photos used by the cinematic photo scene. No fake placeholder cards are required."><GalleryUpload items={c.gallery} onChange={gallery => update({ gallery })} /><div className="builder-note mt-4">{c.gallery.length ? `${c.gallery.length} photo${c.gallery.length > 1 ? 's' : ''} ready for the experience.` : 'No photos yet — upload your memories to make this section yours.'}</div></Section>}

            {tab === 'music' && <Section eyebrow="SOUNDTRACK" title="Background music" description="Upload the track that plays through the cinematic experience."><SingleMediaUpload kind="audio" url={c.musicUrl} onChange={musicUrl => update({ musicUrl })} /><div className="builder-note mt-4">Audio playback still respects browser autoplay rules; visitors may need to tap once before sound starts.</div></Section>}

            {tab === 'video' && <Section eyebrow="MOVING MEMORIES" title="Special video" description="Upload one video for the master experience. The video scene remains in the same position in the story."><SingleMediaUpload kind="video" url={c.videoUrl} onChange={videoUrl => update({ videoUrl })} /><div className="builder-grid-2 mt-4"><Field label="Video section title"><input value="A Special Video Message" readOnly /></Field><Field label="Status"><input value={c.videoUrl ? 'Ready to play' : 'No video uploaded'} readOnly /></Field></div></Section>}

            {tab === 'letter' && <Section eyebrow="THE LETTER" title="Your letter" description="The envelope animation stays fixed, but the words inside the letter are fully editable line by line."><ArrayEditor title="Letter lines" description="Each item becomes a handwritten line in the reveal animation." items={c.letter} placeholder="Write one line for the letter…" multiline onChange={items => updateArray('letter', items)} /><div className="builder-note mt-4">The protected core message is separate from this editable letter. This lets the template keep its signature reveal while still giving you a real writing surface.</div></Section>}

            {tab === 'theme' && <Section eyebrow="VISUAL IDENTITY" title="Make it yours" description="Theme changes affect the live master experience while keeping its layout and animation language intact.">
              <div className="builder-theme-preview" style={{ ['--accent' as string]: c.primaryColor }}><div className="builder-theme-orb" /><div><span>LIVE THEME</span><strong>{c.theme}</strong><small>{c.primaryColor}</small></div></div>
              <div className="builder-grid-2 mt-5">
                <Field label="Accent color"><div className="builder-color-row"><input type="color" value={c.primaryColor} onChange={e => update({ primaryColor: e.target.value })} /><input value={c.primaryColor} onChange={e => update({ primaryColor: e.target.value })} /></div></Field>
                <Field label="Font"><select value={c.font} onChange={e => update({ font: e.target.value })}><option value="sans">Quicksand</option><option value="script">Dancing Script</option><option value="bubble">Bubblegum Sans</option><option value="comic">Comic Neue</option><option value="caveat">Caveat</option></select></Field>
                <Field label="Theme mood"><select value={c.theme} onChange={e => update({ theme: e.target.value })}><option value="romantic">Romantic</option><option value="cute">Cute</option><option value="luxury">Luxury</option><option value="anime">Anime</option><option value="gaming">Gaming</option><option value="minimal">Minimal</option><option value="elegant">Elegant</option><option value="festival">Festival</option></select></Field>
              </div>
              <div className="builder-palette-grid">{['#ec4899','#8b5cf6','#06b6d4','#f59e0b','#22c55e','#ef4444','#f43f5e','#111827'].map(color => <button key={color} style={{ background: color }} aria-label={`Use ${color}`} onClick={() => update({ primaryColor: color })} />)}</div>
            </Section>}

            {tab === 'effects' && <Section eyebrow="MOTION" title="Control the magic" description="These switches are wired to the master template. Turn effects on or off and preview the result immediately."><div className="builder-toggle-grid">{([['countdown','Countdown'],['confetti','Confetti'],['fireworks','Fireworks'],['hearts','Floating hearts'],['balloons','Balloons']] as const).map(([key, label]) => <label key={key} className={`builder-toggle ${c[key] ? 'on' : ''}`}><span><b>{label}</b><small>{c[key] ? 'Enabled' : 'Disabled'}</small></span><input type="checkbox" checked={c[key]} onChange={e => update({ [key]: e.target.checked } as Partial<BirthdayContent)} /></label>)}</div></Section>}

            {tab === 'timeline' && <Section eyebrow="YOUR JOURNEY" title="Timeline" description="Add real milestones. They render inside the public experience instead of being a dashboard-only setting."><TimelineEditor content={c} onChange={next => { setC(next); setDirty(true); }} /></Section>}
            {tab === 'memories' && <Section eyebrow="LITTLE THINGS" title="Memories" description="Short memory snippets that visitors can discover in the experience."><MemoriesEditor content={c} onChange={next => { setC(next); setDirty(true); }} /></Section>}
            {tab === 'wishlist' && <Section eyebrow="WISHES" title="Wishlist" description="Add gift ideas or future wishes that visitors can see."><WishlistEditor content={c} onChange={next => { setC(next); setDirty(true); }} /></Section>}
            {tab === 'guestbook' && <Section eyebrow="COMMUNITY" title="Guestbook" description="Let visitors leave messages on the published experience."><GuestbookToggle content={c} onChange={next => { setC(next); setDirty(true); }} /></Section>}

            {tab === 'growth' && <FeatureControls content={c} onChange={next => { setC(next); setDirty(true); }} websiteId={id} siteSlug={slug} siteStatus={status} />}

            {tab === 'advanced' && <>
              <Section eyebrow="SEARCH" title="SEO" description="Control how your published celebration appears when shared or discovered."><div className="builder-grid-2"><Field label="SEO title"><input value={c.seoTitle} onChange={e => update({ seoTitle: e.target.value })} /></Field><Field label="SEO description"><textarea rows={4} value={c.seoDescription} onChange={e => update({ seoDescription: e.target.value })} /></Field></div></Section>
              <Section eyebrow="CUSTOM" title="Custom CSS" description="Optional advanced styling for your published site. Use this only if you know CSS."><textarea className="builder-code" rows={12} value={c.customCss} onChange={e => update({ customCss: e.target.value })} placeholder="/* Your CSS */" /></Section>
              <Section eyebrow="LANGUAGE & TOOLS" title="Advanced features" description="These controls are wired through the existing feature layer."><FeatureControls content={c} onChange={next => { setC(next); setDirty(true); }} websiteId={id} siteSlug={slug} siteStatus={status} /></Section>
            </>}
          </div>
        </div>

        <section className="builder-preview-panel">
          <div className="builder-preview-head"><div><span>LIVE PREVIEW</span><strong>{c.name || 'Untitled celebration'}</strong></div><div className="builder-preview-actions"><span className="builder-device active">Desktop</span><span className="builder-device">Mobile</span></div></div>
          <div className="builder-preview-frame"><div className="builder-browser"><i /><i /><i /><span>/site/{slug || 'your-slug'}</span></div><div className="builder-preview-canvas">{templateId === 'master' ? <MasterTemplate content={previewContent} /> : <ExperienceTemplate variant={templateId} content={previewContent} />}</div></div>
        </section>
      </section>
    </div>
    {msg && <div className="builder-toast">{msg}</div>}
  </main>;
}
