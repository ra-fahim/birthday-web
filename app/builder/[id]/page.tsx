'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
  ['master', 'Magic Bloom', 'The cinematic master experience'],
  ['birthday', 'Birthday Story', 'A dedicated birthday celebration'],
  ['anniversary', 'Anniversary Story', 'A dedicated anniversary experience'],
  ['proposal', 'Proposal Story', 'A dedicated proposal experience'],
  ['wedding-proposal', 'Wedding Proposal', 'Cinematic proposal question experience'],
  ['wedding', 'Wedding Story', 'A dedicated wedding experience'],
  ['sorry', 'Sorry Story', 'A thoughtful apology experience'],
  ['miss-you', 'Miss You Story', 'A warm long-distance message'],
  ['thank-you', 'Thank You Story', 'A gratitude-focused experience'],
  ['congratulations', 'Congratulations Story', 'A celebration of a big win'],
  ['graduation', 'Graduation Story', 'A next-chapter celebration'],
  ['friendship', 'Friendship Story', 'A tribute to a special friend'],
  ['surprise', 'Surprise Story', 'A playful reveal experience'],
  ['festival', 'Festival Story', 'A bright colorful celebration'],
  ['romantic', 'Midnight Love', 'Soft, intimate and romantic'], ['cute', 'Pastel Dream', 'Playful, bright and adorable'],
  ['luxury', 'Royal Celebration', 'Editorial luxury and elegance'], ['anime', 'Neon Story', 'Anime-inspired energy'],
  ['gaming', 'Level Up', 'Arcade / gamer celebration'], ['minimal', 'Pure Moment', 'Quiet, clean and modern'],
  ['elegant', 'Ever After', 'Classic, graceful and timeless'], 
] as const;

const OCCASION_TEMPLATE: Record<string,string> = {
  birthday:'birthday', anniversary:'anniversary', proposal:'wedding-proposal', wedding:'wedding',
  graduation:'graduation', congratulations:'congratulations', 'thank-you':'thank-you',
  surprise:'surprise', friendship:'friendship', festival:'festival', sorry:'sorry', 'miss-you':'miss-you'
};

const EFFECTS = [['countdown','Countdown'],['confetti','Confetti'],['fireworks','Fireworks'],['hearts','Floating hearts'],['balloons','Balloons']] as const;

const TABS = [
  ['overview', '✦', 'Overview'], ['opening', '◌', 'Opening & Text'], ['story', '♡', 'Reasons'], ['gallery', '▧', 'Gallery'],
  ['music', '♪', 'Music'], ['video', '▶', 'Video'], ['letter', '✉', 'Letter'], ['theme', '◈', 'Theme'], ['effects', '✧', 'Effects'],
  ['timeline', '⌁', 'Timeline'], ['memories', '◫', 'Memories'], ['wishlist', '◇', 'Wishlist'], ['guestbook', '☷', 'Guestbook'],
  ['growth', '↗', 'Growth'], ['advanced', '⚙', 'Advanced'],
] as const;

type TabId = typeof TABS[number][0];
type CanvasSelection = { key: string; label: string; index?: number; value: string };

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
  const [editorMode, setEditorMode] = useState(true);
  const [device, setDevice] = useState<'desktop'|'tablet'|'mobile'>('desktop');
  const [selectedElement, setSelectedElement] = useState<CanvasSelection | null>(null);
  const [publicUrl, setPublicUrl] = useState('');

  useEffect(() => {
    fetch('/api/websites/' + id).then(r => r.json()).then(j => {
      if (j.content) setC({ ...defaultContent, ...j.content });
      if (j.slug) setSlug(j.slug);
      if (j.status) setStatus(j.status);
      const storedOccasion = typeof j.content?.occasion === 'string' ? j.content.occasion : 'birthday';
      const storedTemplate = typeof j.templateId === 'string' ? j.templateId : 'master';
      const occasionTemplate = OCCASION_TEMPLATE[storedOccasion];
      // Older projects may have a non-birthday occasion saved with the master template.
      // Upgrade those projects automatically so the studio preview matches the selected occasion.
      const resolvedTemplate = storedTemplate === 'master' && storedOccasion !== 'birthday' && occasionTemplate ? occasionTemplate : storedTemplate;
      setTemplateId(resolvedTemplate);
      setOccasion(storedOccasion);
      if (resolvedTemplate !== storedTemplate) setDirty(true);
      if (j.slug) setPublicUrl(`${window.location.origin}/site/${j.slug}`);
    });
  }, [id]);

  const update = (patch: Partial<BirthdayContent>) => { setC(prev => ({ ...prev, ...patch })); setDirty(true); };
  const updateArray = (key: keyof BirthdayContent, value: unknown) => update({ [key]: value } as Partial<BirthdayContent>);
  const toggleEffect = (key: keyof BirthdayContent, checked: boolean) => update({ [key]: checked } as Partial<BirthdayContent>);

  const handleCanvasSelect = useCallback((selection: CanvasSelection) => {
    setSelectedElement(selection);
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== 'BB_TEXT_EDITED') return;
      const raw = event.data.selection as { key?: unknown; label?: unknown; index?: unknown; value?: unknown } | null;
      if (!raw || typeof raw.key !== 'string') return;
      const value = String(raw.value ?? '').trim();
      if (!value) return;
      const index = typeof raw.index === 'number' ? raw.index : undefined;
      const label = typeof raw.label === 'string' && raw.label.trim() ? raw.label : raw.key;
      if (raw.key === 'reasons' && typeof index === 'number') {
        const reasons = [...c.reasons];
        if (index >= 0 && index < reasons.length) {
          reasons[index] = value;
          update({ reasons });
        }
      } else if (raw.key === 'greeting') {
        const cleaned = value.replace(new RegExp('\\s*' + (c.name || '') + '\\s*[❤️✨🎂💫🎉]*$','iu'),'').trim();
        update({ greeting: cleaned || value });
      } else if (raw.key in c) {
        update({ [raw.key]: value } as Partial<BirthdayContent>);
      }
      setSelectedElement({ key: raw.key, label, index, value });
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [c]);

  async function save(publish = false) {
    setMsg(publish ? 'Publishing…' : 'Saving…');
    const next = { ...c, occasion, templateId };
    const r = await fetch('/api/websites/' + id, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ content: next, templateId, status: publish ? 'published' : 'draft' }) });
    const j = await r.json();
    setMsg(r.ok ? (publish ? 'Published successfully ✨' : 'Draft saved ✓') : (j.error || 'Something went wrong'));
    if (r.ok) { setStatus(publish ? 'published' : 'draft'); setDirty(false); if (j.slug) setPublicUrl(`${window.location.origin}/site/${j.slug}`); }
    if (publish) { setMsg('Live link ready ✨'); router.refresh(); }
  }

  const currentOccasion = OCCASIONS.find(x => x[0] === occasion) || OCCASIONS[0];
  const visibleTabs = templateId === 'wedding-proposal' ? TABS.filter(([value]) => value === 'overview' || value === 'opening') : TABS;
  const activeTab = visibleTabs.find(x => x[0] === tab) || visibleTabs[0];
  useEffect(() => {
    if (!visibleTabs.some(([value]) => value === tab)) setTab('overview');
  }, [templateId]);
  const previewContent = useMemo(() => ({ ...c, occasion, templateId }), [c, occasion, templateId]);
  const resetToMasterDefaults = () => {
    const keepName = c.name;
    setC({ ...defaultContent, name: keepName || defaultContent.name, templateId: 'master', occasion: 'birthday' });
    setTemplateId('master'); setOccasion('birthday'); setDirty(true); setMsg('Master template defaults restored.');
  };

  return <main className="builder-shell">
    <header className="builder-topbar">
      <div className="builder-brand"><div className="builder-logo">W</div><div><strong>Wishly Studio</strong><span>Experience editor</span></div></div>
      <div className="builder-top-actions">
        <div className={`builder-status ${dirty ? 'is-dirty' : ''}`}><i />{dirty ? 'Unsaved changes' : status === 'published' ? 'Published' : 'All changes saved'}</div>
        <button className="builder-ghost" onClick={() => router.push('/dashboard')}>Exit</button>
        <button className="builder-save" onClick={() => save(false)}>Save draft</button>
        <button className="builder-publish" onClick={() => save(true)}>Create Live Link ↗</button>
      </div>
    </header>

    <div className="builder-layout">
      <aside className="builder-sidebar">
        <div className="builder-project-card">
          <div className="builder-project-icon">{currentOccasion[1]}</div>
          <div className="min-w-0"><div className="builder-eyebrow">CURRENT PROJECT</div><h1>{c.name || 'Untitled celebration'}</h1><p>{currentOccasion[2]} · {templateId}</p></div>
        </div>

        <div className="builder-selector-grid">
          <div><span>Occasion</span><select value={occasion} onChange={e => { const nextOccasion = e.target.value; setOccasion(nextOccasion); setTemplateId(OCCASION_TEMPLATE[nextOccasion] || 'master'); setDirty(true); }}>{OCCASIONS.map(([value, emoji, label]) => <option value={value} key={value}>{emoji} {label}</option>)}</select></div>
          <div><span>Experience</span><select value={templateId} onChange={e => { setTemplateId(e.target.value); setDirty(true); }}>{TEMPLATES.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></div>
        </div>

        <nav className="builder-nav">
          <div className="builder-nav-label">EDIT EXPERIENCE</div>
          {visibleTabs.map(([value, icon, label]) => <button key={value} className={tab === value ? 'active' : ''} onClick={() => setTab(value)}><span>{icon}</span>{label}{['gallery','story','timeline','memories','wishlist'].includes(value) && <b>{value === 'story' ? c.reasons.length : value === 'gallery' ? c.gallery.length : value === 'timeline' ? c.timeline.length : value === 'memories' ? c.memories.length : c.wishlist.length}</b>}</button>)}
        </nav>

        <div className="builder-side-tip"><span>⌘</span><div><b>Easy mode</b><p>Edit here or directly on the page. When ready, create one live link for this website.</p></div></div>
      </aside>

      <section className="builder-workspace">
        <div className="builder-editor-panel">
          <div className="builder-panel-head"><div><div className="builder-eyebrow">{activeTab?.[1]} {activeTab?.[2]}</div><h2>{activeTab?.[2]}</h2></div><span className="builder-live-pill">● LIVE</span></div>
          <div className="builder-form-scroll">
                      {selectedElement && <section className="builder-selection-card">
              <div><span className="builder-eyebrow">CANVAS SELECTION</span><h3>{selectedElement.label}</h3><p>Double-click text in the preview to edit it directly.</p></div>
              <button className="builder-clear-selection" onClick={()=>setSelectedElement(null)}>Clear</button>
              {selectedElement.key === 'reasons' && typeof selectedElement.index === 'number' ? (
                <textarea rows={3} value={c.reasons[selectedElement.index] || ''} onChange={e=>{const reasons=[...c.reasons]; reasons[selectedElement.index!] = e.target.value; update({reasons});}} />
              ) : selectedElement.key === 'greeting' ? (
                <input value={c.greeting} onChange={e=>update({greeting:e.target.value})} />
              ) : (['heroSubtitle','heroTitle','secret','buttonText'].includes(selectedElement.key)) ? (
                <textarea rows={selectedElement.key==='heroSubtitle'||selectedElement.key==='secret'?3:2} value={String((c as any)[selectedElement.key]||'')} onChange={e=>update({[selectedElement.key]:e.target.value} as Partial<BirthdayContent>)} />
              ) : null}
            </section>}
            {tab === 'overview' && (templateId === 'wedding-proposal' ? <>
              <div className="builder-quickstart"><div className="builder-quick-card"><b>1. Personalize</b><span>Set the recipient and sender names.</span></div><div className="builder-quick-card"><b>2. Edit the proposal</b><span>Only the words used by this original HTML are editable.</span></div><div className="builder-quick-card"><b>3. Share</b><span>Save it and create one live link.</span></div></div>
              <Section eyebrow="IDENTITY" title="Who is this proposal for?" description="Only the values used by the Wedding Proposal template are shown.">
                <div className="builder-grid-2">
                  <Field label="Recipient name"><input value={c.name} onChange={e => update({ name: e.target.value })} placeholder="Anarkali" /></Field>
                  <Field label="Sender name"><input value={c.profile?.displayName || ''} onChange={e => update({ profile: { ...(c.profile || {}), displayName: e.target.value } })} placeholder="Selim" /></Field>
                </div>
              </Section>
              <Section eyebrow="TEMPLATE" title="Wedding Proposal content" description="These fields map directly to the supplied HTML. Nothing else is added to the template.">
                <div className="builder-grid-2">
                  <Field label="Intro eyebrow"><input value={c.proposalEyebrow} onChange={e => update({ proposalEyebrow: e.target.value })} /></Field>
                  <Field label="Start button"><input value={c.proposalStartButton} onChange={e => update({ proposalStartButton: e.target.value })} /></Field>
                  <Field label="Intro message"><textarea rows={4} value={c.proposalIntroText} onChange={e => update({ proposalIntroText: e.target.value })} /></Field>
                  <Field label="Continue button"><input value={c.proposalContinueButton} onChange={e => update({ proposalContinueButton: e.target.value })} /></Field>
                  <Field label="Proposal question"><textarea rows={5} value={c.proposalQuestion} onChange={e => update({ proposalQuestion: e.target.value })} /></Field>
                  <Field label="Letter"><textarea rows={7} value={c.proposalLetterText} onChange={e => update({ proposalLetterText: e.target.value })} /></Field>
                  <Field label="Yes button"><input value={c.proposalYesButton} onChange={e => update({ proposalYesButton: e.target.value })} /></Field>
                  <Field label="No button"><input value={c.proposalNoButton} onChange={e => update({ proposalNoButton: e.target.value })} /></Field>
                </div>
              </Section>
            </> : <>
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
              <Section eyebrow="MASTER TEMPLATE" title="Everything important is editable" description="Change the words, photos, soundtrack, buttons, colors and story details below. The beautiful cinematic layout stays intact while your content becomes completely yours."><div className="builder-protected"><span>✨</span><div><b>Your content, your version</b><p>Nothing about the master experience is locked from you. The template is the design system; your project controls the content and presentation.</p></div></div></Section><div className="mt-3 flex justify-end"><button type="button" className="builder-mini-btn" onClick={resetToMasterDefaults}>↺ Reset to Master defaults</button></div>
            </>)}

            {tab === 'opening' && (templateId === 'wedding-proposal' ? <>
              <Section eyebrow="ORIGINAL HTML" title="Wedding Proposal" description="The preview below is the exact HTML you supplied. This editor only changes the values that HTML actually uses.">
                <div className="builder-note">Visual design, GSAP animation, sound engine, heart interaction, moving No button, finale, fonts and effects are kept from the original file.</div>
              </Section>
            </> : <>
              <Section eyebrow="OPENING" title="Shape the first impression" description="Edit the visible hero copy and opening CTA. The animation sequence itself stays intact.">
                <div className="builder-grid-2">
                  <Field label="Greeting"><input value={c.greeting} onChange={e => update({ greeting: e.target.value })} placeholder="Happy Birthday" /></Field>
                  <Field label="Hero title"><input value={c.heroTitle} onChange={e => update({ heroTitle: e.target.value })} /></Field>
                </div>
                <Field label="Hero subtitle"><textarea rows={4} value={c.heroSubtitle} onChange={e => update({ heroSubtitle: e.target.value })} /></Field>
                <div className="builder-grid-2 mt-4">
                  <Field label="Main CTA"><input value={c.buttonText} onChange={e => update({ buttonText: e.target.value })} /></Field>
                  <Field label="Cake next button"><input value={c.cakeNextButton} onChange={e => update({ cakeNextButton: e.target.value })} /></Field>
                  <Field label="Reasons button"><input value={c.reasonsButton} onChange={e => update({ reasonsButton: e.target.value })} /></Field>
                  <Field label="Gallery heading"><input value={c.photoTitle} onChange={e => update({ photoTitle: e.target.value })} /></Field>
                  <Field label="Gallery subtitle"><textarea rows={3} value={c.photoSubtitle} onChange={e => update({ photoSubtitle: e.target.value })} /></Field>
                  <Field label="Gallery next button"><input value={c.photoNextButton} onChange={e => update({ photoNextButton: e.target.value })} /></Field>
                  <Field label="Video heading"><input value={c.videoTitle} onChange={e => update({ videoTitle: e.target.value })} /></Field>
                  <Field label="Video next button"><input value={c.videoNextButton} onChange={e => update({ videoNextButton: e.target.value })} /></Field>
                  <Field label="Letter heading"><input value={c.letterTitle} onChange={e => update({ letterTitle: e.target.value })} /></Field>
                  <Field label="Letter button"><input value={c.letterButton} onChange={e => update({ letterButton: e.target.value })} /></Field>
                  <Field label="Secret heading"><input value={c.secretTitle} onChange={e => update({ secretTitle: e.target.value })} /></Field>
                  <Field label="Secret button"><input value={c.secretButton} onChange={e => update({ secretButton: e.target.value })} /></Field>
                </div>
              </Section>
              <Section eyebrow="PRIVATE LINKS" title="Recipient-specific personalization" description="Create multiple private versions of the same experience from Growth → Personalized links."><div className="builder-protected"><span>🔗</span><div><b>Same design, different recipient</b><p>Each recipient can receive a unique link and a private personal note without changing the master layout.</p></div></div></Section>
            </>)}

            {tab === 'story' && <Section eyebrow="THE HEART OF THE STORY" title="Reasons" description="These are the cards visitors reveal one by one. Unlike the old version, every reason is now editable here and updates the live preview immediately.">
              <ArrayEditor title="Your reasons" description="Add as many reasons as you want. The master template will automatically update its counter and sequence." items={c.reasons} placeholder="e.g. Your laugh always makes my day…" multiline onChange={items => updateArray('reasons', items)} />
            </Section>}

            {tab === 'gallery' && <Section eyebrow="MEMORIES" title="Photo gallery" description="Upload the actual photos used by the cinematic photo scene. No fake placeholder cards are required."><GalleryUpload items={c.gallery} onChange={gallery => update({ gallery })} websiteId={id} /><div className="builder-note mt-4">{c.gallery.length ? `${c.gallery.length} photo${c.gallery.length > 1 ? 's' : ''} ready for the experience.` : 'No photos yet — upload your memories to make this section yours.'}</div></Section>}

            {tab === 'music' && <Section eyebrow="SOUNDTRACK" title="Background music" description="Upload the track that plays through the cinematic experience."><SingleMediaUpload kind="audio" url={c.musicUrl} onChange={musicUrl => update({ musicUrl })} websiteId={id} /><div className="builder-note mt-4">Audio playback still respects browser autoplay rules; visitors may need to tap once before sound starts.</div></Section>}

            {tab === 'video' && <Section eyebrow="MOVING MEMORIES" title="Special video" description="Upload one video for the master experience. The video scene remains in the same position in the story."><SingleMediaUpload kind="video" url={c.videoUrl} onChange={videoUrl => update({ videoUrl })} websiteId={id} /><div className="builder-grid-2 mt-4"><Field label="Video section title"><input value="A Special Video Message" readOnly /></Field><Field label="Status"><input value={c.videoUrl ? 'Ready to play' : 'No video uploaded'} readOnly /></Field></div></Section>}

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

            {tab === 'effects' && <Section eyebrow="MOTION" title="Control the magic" description="These switches are wired to the master template. Turn effects on or off and preview the result immediately."><div className="builder-toggle-grid">{EFFECTS.map(([key, label]) => <label key={key} className={`builder-toggle ${c[key] ? 'on' : ''}`}><span><b>{label}</b><small>{c[key] ? 'Enabled' : 'Disabled'}</small></span><input type="checkbox" checked={c[key]} onChange={e => toggleEffect(key as keyof BirthdayContent, e.target.checked)} /></label>)}</div></Section>}

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
          <div className="builder-preview-head"><div><span>LIVE PREVIEW</span><strong>{c.name || 'Untitled celebration'}</strong></div><div className="builder-preview-actions">
  {(['desktop','tablet','mobile'] as const).map(d => <button key={d} className={`builder-device ${device===d?'active':''}`} onClick={()=>setDevice(d)}>{d[0].toUpperCase()+d.slice(1)}</button>)}
  {templateId !== 'wedding-proposal' && <button className={`builder-device ${editorMode?'active':''}`} onClick={()=>setEditorMode(v=>!v)}>✎ Edit on canvas</button>}
</div></div>
          {status === 'published' && publicUrl && <div className="builder-live-link"><div><span>YOUR LIVE LINK</span><strong>{publicUrl}</strong></div><div className="builder-live-link-actions"><button onClick={() => navigator.clipboard?.writeText(publicUrl)}>Copy link</button><a href={publicUrl} target="_blank" rel="noreferrer">Open ↗</a></div></div>}
          <div className="builder-preview-frame"><div className="builder-browser"><i /><i /><i /><span>/site/{slug || 'your-slug'}</span></div><div className={`builder-preview-canvas device-${device}`}>{templateId === 'master' ? <MasterTemplate content={previewContent} editorMode={editorMode} onElementSelect={handleCanvasSelect} /> : <ExperienceTemplate variant={templateId} content={previewContent} />}</div></div>
        </section>
      </section>
    </div>
    {msg && <div className="builder-toast">{msg}</div>}
  </main>;
}
