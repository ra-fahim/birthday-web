'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { defaultContent, BirthdayContent } from '@/lib/types';
import { MasterTemplate } from '@/components/template/MasterTemplate';
import ExperienceTemplate, { getMissYouDefaults, getMasterProposalDefaults } from '@/components/template/ExperienceTemplates';
import { SingleMediaUpload, GalleryUpload, InlineMediaField } from './MediaUploader';
import FeatureControls from './FeatureControls';
import { TimelineEditor, MemoriesEditor, WishlistEditor, GuestbookToggle } from './ContentListEditors';
import { templateCatalog } from '@/lib/templates';

// Keep the complete occasion list stable even when an occasion has no templates yet.
// New HTML templates can then be registered under any of these categories later.
const OCCASIONS = [
  ['birthday', '🎂', 'Birthday'],
  ['anniversary', '💞', 'Anniversary'],
  ['proposal', '💍', 'Proposal'],
  ['wedding', '💒', 'Wedding'],
  ['sorry', '🥺', 'Sorry'],
  ['miss-you', '💌', 'Miss You'],
  ['thank-you', '💐', 'Thank You'],
  ['congratulations', '🏆', 'Congratulations'],
  ['graduation', '🎓', 'Graduation'],
  ['friendship', '🤝', 'Friendship'],
  ['surprise', '🎁', 'Surprise'],
  ['festival', '🎊', 'Festival'],
] as const;

const TEMPLATES = templateCatalog.map((t) => [t.slug, t.name, t.description] as const);

function templatesForOccasion(nextOccasion: string) {
  return templateCatalog.filter((t) => t.category === nextOccasion);
}

function firstTemplateForOccasion(nextOccasion: string) {
  return templatesForOccasion(nextOccasion)[0]?.slug ?? '';
}

const EFFECTS = [['countdown','Countdown'],['confetti','Confetti'],['fireworks','Fireworks'],['hearts','Floating hearts'],['balloons','Balloons']] as const;

const TABS = [
  ['overview', '✦', 'Overview'], ['opening', '◌', 'Opening & Text'], ['story', '♡', 'Reasons'], ['gallery', '▧', 'Gallery'],
  ['music', '♪', 'Music'], ['video', '▶', 'Video'], ['letter', '✉', 'Letter'], ['theme', '◈', 'Theme'], ['effects', '✧', 'Effects'],
  ['timeline', '⌁', 'Timeline'], ['memories', '◫', 'Memories'], ['wishlist', '◇', 'Wishlist'], ['guestbook', '☷', 'Guestbook'], ['social', '◎', 'Social links'],
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

function reorder<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = items.slice();
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

// Drag handle + up/down buttons shared by both list editors below. Native
// HTML5 drag-and-drop (no extra library) for people who want to drag, plus
// buttons for everyone else — dragging is fiddly on a phone.
function ReorderControls({ index, count, onMove }: { index: number; count: number; onMove: (from: number, to: number) => void }) {
  return <div className="builder-reorder">
    <span className="builder-drag-handle" title="Drag to reorder">⠿</span>
    <button type="button" onClick={() => onMove(index, index - 1)} disabled={index === 0} aria-label="Move up">↑</button>
    <button type="button" onClick={() => onMove(index, index + 1)} disabled={index === count - 1} aria-label="Move down">↓</button>
  </div>;
}

function ArrayEditor({ title, description, items, placeholder, onChange, multiline = false }: {
  title: string; description?: string; items: string[]; placeholder: string; onChange: (items: string[]) => void; multiline?: boolean;
}) {
  const [draft, setDraft] = useState('');
  const dragFrom = useRef<number | null>(null);
  const add = () => { const value = draft.trim(); if (!value) return; onChange([...items, value]); setDraft(''); };
  const move = (from: number, to: number) => onChange(reorder(items, from, to));
  return <div className="builder-list-editor">
    <div><h3>{title}</h3>{description && <p>{description}</p>}</div>
    <div className="builder-add-row">
      {multiline ? <textarea rows={3} value={draft} placeholder={placeholder} onChange={e => setDraft(e.target.value)} /> : <input value={draft} placeholder={placeholder} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />}
      <button className="builder-mini-btn" onClick={add}>+ Add</button>
    </div>
    <div className="builder-item-list">
      {items.map((item, i) => <div
        className="builder-item"
        key={`${item}-${i}`}
        draggable
        onDragStart={() => { dragFrom.current = i; }}
        onDragOver={e => e.preventDefault()}
        onDrop={() => { if (dragFrom.current !== null) move(dragFrom.current, i); dragFrom.current = null; }}
      >
        <ReorderControls index={i} count={items.length} onMove={move} />
        <span>{item}</span>
        <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} aria-label={`Remove item ${i + 1}`}>×</button>
      </div>)}
      {!items.length && <div className="builder-empty">Nothing added yet. Add your first item above.</div>}
    </div>
  </div>;
}

function ObjectArrayEditor<T extends Record<string, any>>({ title, description, items, fields, onChange, newItem, websiteId }: {
  title: string; description?: string; items: T[];
  fields: { key: keyof T; label: string; placeholder?: string; multiline?: boolean; options?: string[]; upload?: { accept: string; folder: string } }[];
  onChange: (items: T[]) => void; newItem: () => T; websiteId?: string;
}) {
  const update = (i: number, key: keyof T, value: string) => onChange(items.map((it, idx) => idx === i ? { ...it, [key]: value } : it));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, newItem()]);
  const move = (from: number, to: number) => onChange(reorder(items, from, to));
  const dragFrom = useRef<number | null>(null);
  return <div className="builder-list-editor">
    <div><h3>{title}</h3>{description && <p>{description}</p>}</div>
    <div className="builder-item-list" style={{ flexDirection: 'column', gap: 12, display: 'flex' }}>
      {items.map((item, i) => (
        <div
          key={i}
          className="builder-item builder-item-card"
          style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6, display: 'flex' }}
          draggable
          onDragStart={() => { dragFrom.current = i; }}
          onDragOver={e => e.preventDefault()}
          onDrop={() => { if (dragFrom.current !== null) move(dragFrom.current, i); dragFrom.current = null; }}
        >
          <div className="builder-item-card-head">
            <ReorderControls index={i} count={items.length} onMove={move} />
            <span className="builder-item-card-num">{title} {i + 1}</span>
          </div>
          {fields.map(f => f.options ? (
            <select key={String(f.key)} value={String(item[f.key] ?? '')} onChange={e => update(i, f.key, e.target.value)}>
              {f.options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : f.upload && websiteId ? (
            <InlineMediaField key={String(f.key)} value={String(item[f.key] ?? '')} placeholder={f.placeholder || f.label} accept={f.upload.accept} folder={f.upload.folder} websiteId={websiteId} onChange={value => update(i, f.key, value)} />
          ) : f.multiline ? (
            <textarea key={String(f.key)} rows={2} placeholder={f.placeholder || f.label} value={String(item[f.key] ?? '')} onChange={e => update(i, f.key, e.target.value)} />
          ) : (
            <input key={String(f.key)} placeholder={f.placeholder || f.label} value={String(item[f.key] ?? '')} onChange={e => update(i, f.key, e.target.value)} />
          ))}
          <button className="builder-mini-btn" onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
    </div>
    <button className="builder-mini-btn mt-2" onClick={add}>+ Add {title}</button>
    {!items.length && <div className="builder-empty">Nothing added yet.</div>}
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
      const occasionTemplates = templatesForOccasion(storedOccasion);
      const storedTemplateIsValid = occasionTemplates.some((t) => t.slug === storedTemplate);
      // Always keep the selected experience inside the selected occasion.
      // Older projects that pointed at Master for another occasion are moved to that occasion's first installed template;
      // if no template exists yet, the studio stays explicitly empty instead of showing the wrong template.
      const resolvedTemplate = storedTemplateIsValid ? storedTemplate : (occasionTemplates[0]?.slug ?? '');
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
    if (!templateId) { setMsg(`Add a ${currentOccasion[2]} template before publishing.`); return; }
    setMsg(publish ? 'Publishing…' : 'Saving…');
    const next = { ...c, occasion, templateId };
    const r = await fetch('/api/websites/' + id, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ content: next, templateId, status: publish ? 'published' : 'draft' }) });
    const j = await r.json();
    setMsg(r.ok ? (publish ? 'Published successfully ✨' : 'Draft saved ✓') : (j.error || 'Something went wrong'));
    if (r.ok) { setStatus(publish ? 'published' : 'draft'); setDirty(false); if (j.slug) setPublicUrl(`${window.location.origin}/site/${j.slug}`); }
    if (publish) { setMsg('Live link ready ✨'); router.refresh(); }
  }

  const currentOccasion = OCCASIONS.find(x => x[0] === occasion) || OCCASIONS[0];
  const occasionTemplates = useMemo(() => templatesForOccasion(occasion), [occasion]);
  const missYouConfig = useMemo(() => ({ ...getMissYouDefaults(), ...(c.templateConfig || {}) }), [c.templateConfig]);
  const updateMissYou = (patch: Record<string, unknown>) => update({ templateConfig: { ...missYouConfig, ...patch } });
  const masterProposalConfig = useMemo(() => ({ ...getMasterProposalDefaults(), ...(c.templateConfig || {}) }), [c.templateConfig]);
  const updateMasterProposal = (patch: Record<string, unknown>) => update({ templateConfig: { ...masterProposalConfig, ...patch } });
  const visibleTabs = templateId === 'wedding-proposal'
    ? TABS.filter(([value]) => value === 'overview' || value === 'opening')
    : templateId === 'miss-you-1'
      ? TABS.filter(([value]) => value === 'overview' || value === 'story' || value === 'music')
      : templateId === 'master-proposal'
        ? TABS.filter(([value]) => ['overview', 'opening', 'story', 'gallery', 'music', 'letter'].includes(value))
        : TABS.filter(([value]) => value !== 'social' || templateId === 'master');
  const activeTab = visibleTabs.find(x => x[0] === tab) || visibleTabs[0];
  useEffect(() => {
    if (!visibleTabs.some(([value]) => value === tab)) setTab('overview');
    setSelectedElement(null);
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
          <div className="min-w-0"><div className="builder-eyebrow">CURRENT PROJECT</div><h1>{c.name || 'Untitled celebration'}</h1><p>{currentOccasion[2]} · {occasionTemplates.find(t => t.slug === templateId)?.name || 'No template added yet'}</p></div>
        </div>

        <div className="builder-selector-grid">
          <div><span>Occasion</span><select value={occasion} onChange={e => { const nextOccasion = e.target.value; const nextTemplate = firstTemplateForOccasion(nextOccasion); setOccasion(nextOccasion); setTemplateId(nextTemplate); if (nextTemplate === 'miss-you-1' && !c.templateConfig) setC(prev => ({ ...prev, templateConfig: getMissYouDefaults() })); if (nextTemplate === 'master-proposal' && !c.templateConfig) setC(prev => ({ ...prev, templateConfig: getMasterProposalDefaults() })); setDirty(true); }}>{OCCASIONS.map(([value, emoji, label]) => <option value={value} key={value}>{emoji} {label}</option>)}</select></div>
          <div><span>Experience</span><select value={templateId} disabled={!occasionTemplates.length} onChange={e => { setTemplateId(e.target.value); setDirty(true); }}>
            {!occasionTemplates.length && <option value="">No {currentOccasion[2]} template added yet</option>}
            {occasionTemplates.map((t) => <option value={t.slug} key={t.slug}>{t.name}</option>)}
          </select></div>
        </div>

        {(() => {
          // Small progress hint: how many of the fillable list sections have
          // at least one item. Not a hard gate — just "here's what's left".
          const trackedTabs = visibleTabs.filter(([value]) => ['gallery', 'story', 'timeline', 'memories', 'wishlist', 'music'].includes(value));
          const countFor = (value: string) => templateId === 'master-proposal'
            ? (value === 'story' ? (Array.isArray(masterProposalConfig.story) ? masterProposalConfig.story.length : 0)
              : value === 'gallery' ? (Array.isArray(masterProposalConfig.museum) ? masterProposalConfig.museum.length : 0)
              : value === 'music' ? (String(masterProposalConfig.bgMusicUrl || '') ? 1 : 0) : 0)
            : (value === 'story' ? c.reasons.length : value === 'gallery' ? c.gallery.length : value === 'timeline' ? c.timeline.length : value === 'memories' ? c.memories.length : value === 'wishlist' ? c.wishlist.length : 0);
          const filled = trackedTabs.filter(([value]) => countFor(value) > 0).length;
          return trackedTabs.length > 0 ? <div className="builder-progress">
            <div className="builder-progress-label"><span>{filled}/{trackedTabs.length} sections started</span></div>
            <div className="builder-progress-bar"><div className="builder-progress-fill" style={{ width: `${trackedTabs.length ? (filled / trackedTabs.length) * 100 : 0}%` }} /></div>
          </div> : null;
        })()}

        <nav className="builder-nav">
          <div className="builder-nav-label">EDIT EXPERIENCE</div>
          {visibleTabs.map(([value, icon, label]) => <button key={value} className={tab === value ? 'active' : ''} onClick={() => setTab(value)}><span>{icon}</span>{label}{templateId !== 'master-proposal' && ['gallery','story','timeline','memories','wishlist'].includes(value) && <b>{value === 'story' ? c.reasons.length : value === 'gallery' ? c.gallery.length : value === 'timeline' ? c.timeline.length : value === 'memories' ? c.memories.length : c.wishlist.length}</b>}{templateId === 'master-proposal' && value === 'story' && <b>{Array.isArray(masterProposalConfig.story) ? masterProposalConfig.story.length : 0}</b>}{templateId === 'master-proposal' && value === 'gallery' && <b>{Array.isArray(masterProposalConfig.museum) ? masterProposalConfig.museum.length : 0}</b>}</button>)}
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
              ) : (['heroSubtitle','heroTitle','secret','buttonText'].includes(selectedElement.key) && templateId !== 'master-proposal') ? (
                <textarea rows={selectedElement.key==='heroSubtitle'||selectedElement.key==='secret'?3:2} value={String((c as any)[selectedElement.key]||'')} onChange={e=>update({[selectedElement.key]:e.target.value} as Partial<BirthdayContent>)} />
              ) : templateId === 'master-proposal' ? (
                selectedElement.key === 'heroTitle' || selectedElement.key === 'heroSubtitle' ? (
                  <input value={String(masterProposalConfig[selectedElement.key] || '')} onChange={e => updateMasterProposal({ [selectedElement.key]: e.target.value })} />
                ) : selectedElement.key === 'story' && typeof selectedElement.index === 'number' ? (() => {
                  const story = (Array.isArray(masterProposalConfig.story) ? masterProposalConfig.story : []) as { title: string; body: string }[];
                  const item = story[selectedElement.index!] || { title: '', body: '' };
                  const setItem = (patch: Partial<{ title: string; body: string }>) => { const next = [...story]; next[selectedElement.index!] = { ...item, ...patch }; updateMasterProposal({ story: next }); };
                  return <div className="builder-grid-2"><Field label="Chapter title"><input value={item.title} onChange={e => setItem({ title: e.target.value })} /></Field><Field label="Chapter text"><textarea rows={4} value={item.body} onChange={e => setItem({ body: e.target.value })} /></Field></div>;
                })() : selectedElement.key.startsWith('introGate.') ? (() => {
                  const field = selectedElement.key.split('.')[1];
                  const gate = (masterProposalConfig.introGate || {}) as Record<string, any>;
                  if (field === 'prompts' && typeof selectedElement.index === 'number') {
                    const prompts = (Array.isArray(gate.prompts) ? gate.prompts : []) as { title: string; subtitle: string }[];
                    const item = prompts[selectedElement.index] || { title: '', subtitle: '' };
                    const setItem = (patch: Partial<{ title: string; subtitle: string }>) => { const next = [...prompts]; next[selectedElement.index!] = { ...item, ...patch }; updateMasterProposal({ introGate: { ...gate, prompts: next } }); };
                    return <div className="builder-grid-2"><Field label="Question"><input value={item.title} onChange={e => setItem({ title: e.target.value })} /></Field><Field label="Subtitle"><input value={item.subtitle} onChange={e => setItem({ subtitle: e.target.value })} /></Field></div>;
                  }
                  return <input value={String(gate[field] || '')} onChange={e => updateMasterProposal({ introGate: { ...gate, [field]: e.target.value } })} />;
                })() : selectedElement.key.startsWith('datePlanner.') ? (() => {
                  const field = selectedElement.key.split('.')[1];
                  const planner = (masterProposalConfig.datePlanner || {}) as Record<string, any>;
                  if (field === 'options' && typeof selectedElement.index === 'number') {
                    const options = (Array.isArray(planner.options) ? planner.options : []) as any[];
                    const item = options[selectedElement.index] || {};
                    const setItem = (patch: Record<string, unknown>) => { const next = [...options]; next[selectedElement.index!] = { ...item, ...patch }; updateMasterProposal({ datePlanner: { ...planner, options: next } }); };
                    return <div className="builder-grid-2"><Field label="Card label"><input value={item.label || ''} onChange={e => setItem({ label: e.target.value })} /></Field><Field label="Ticket title"><input value={item.planTitle || ''} onChange={e => setItem({ planTitle: e.target.value })} /></Field></div>;
                  }
                  return <input value={String(planner[field] || '')} onChange={e => updateMasterProposal({ datePlanner: { ...planner, [field]: e.target.value } })} />;
                })() : null
              ) : null}
            </section>}
            {templateId === 'miss-you-1' && tab === 'overview' && <>
              <Section eyebrow="MISS YOU 1" title="Make it yours" description="Only the content the original Miss You experience actually uses is editable here. The design and animation stay exactly as supplied.">
                <div className="builder-grid-2">
                  <Field label="Person 1 name"><input value={String(missYouConfig.name1 || '')} onChange={e => updateMissYou({ name1: e.target.value })} /></Field>
                  <Field label="Person 2 name"><input value={String(missYouConfig.name2 || '')} onChange={e => updateMissYou({ name2: e.target.value })} /></Field>
                  <Field label="Together text"><input value={String(missYouConfig.together || '')} onChange={e => updateMissYou({ together: e.target.value })} /></Field>
                  <Field label="Start date"><input type="datetime-local" value={String(missYouConfig.memorialDate || '').slice(0,16)} onChange={e => updateMissYou({ memorialDate: e.target.value ? new Date(e.target.value).toISOString() : '' })} /></Field>
                  <Field label="Opening text"><input value={String(missYouConfig.seedText || '')} onChange={e => updateMissYou({ seedText: e.target.value })} /></Field>
                </div>
              </Section>
            </>}

            {templateId === 'miss-you-1' && tab === 'story' && <>
              <Section eyebrow="LETTER CONTENT" title="Your Miss You letter" description="Edit the exact three-part letter used by the original template.">
                {(['paragraph1','paragraph2','paragraph3'] as const).map((key, idx) => <ArrayEditor key={key} title={`Paragraph ${idx + 1}`} items={Array.isArray(missYouConfig[key]) ? missYouConfig[key] as string[] : []} placeholder="Write one line…" multiline onChange={items => updateMissYou({ [key]: items })} />)}
              </Section>
              <Section eyebrow="COUNTER" title="Time labels" description="These are the only counter labels used by this template.">
                <div className="builder-grid-2">
                  <Field label="Prefix"><input value={String(missYouConfig.timePrefix || '')} onChange={e => updateMissYou({ timePrefix: e.target.value })} /></Field>
                  <Field label="Days"><input value={String(missYouConfig.dayLabel || '')} onChange={e => updateMissYou({ dayLabel: e.target.value })} /></Field>
                  <Field label="Hours"><input value={String(missYouConfig.hourLabel || '')} onChange={e => updateMissYou({ hourLabel: e.target.value })} /></Field>
                  <Field label="Minutes"><input value={String(missYouConfig.minuteLabel || '')} onChange={e => updateMissYou({ minuteLabel: e.target.value })} /></Field>
                  <Field label="Seconds"><input value={String(missYouConfig.secondLabel || '')} onChange={e => updateMissYou({ secondLabel: e.target.value })} /></Field>
                </div>
              </Section>
            </>}

            {templateId === 'master-proposal' && tab === 'overview' && <>
              <div className="builder-quickstart"><div className="builder-quick-card"><b>1. Personalize</b><span>Set the recipient and sender names.</span></div><div className="builder-quick-card"><b>2. Set delivery email</b><span>This is where the date ticket is sent automatically.</span></div><div className="builder-quick-card"><b>3. Share</b><span>Save it and create one live link.</span></div></div>
              <Section eyebrow="MASTER PROPOSAL" title="Who is this for?" description="Only the values this original Valentine experience actually uses are shown here. The design, animation and audio stay exactly as supplied.">
                <div className="builder-grid-2">
                  <Field label="Recipient name (shown on the ticket)"><input value={String(masterProposalConfig.toName || '')} onChange={e => updateMasterProposal({ toName: e.target.value })} placeholder="Rodney (The Best Boyfriend)" /></Field>
                  <Field label="Sender name (shown on the ticket)"><input value={String(masterProposalConfig.fromName || '')} onChange={e => updateMasterProposal({ fromName: e.target.value })} placeholder="Sherry (Your Valentine)" /></Field>
                  <Field label="Sender sign-off"><input value={String(masterProposalConfig.fromLabel || '')} onChange={e => updateMasterProposal({ fromLabel: e.target.value })} placeholder="Sherry" /></Field>
                  <Field label="Ticket delivery email"><input type="email" value={String(masterProposalConfig.recipientEmail || '')} onChange={e => updateMasterProposal({ recipientEmail: e.target.value })} placeholder="you@example.com" /></Field>
                </div>
                <div className="builder-note mt-4">When a visitor taps "Send Ticket", the date ticket is emailed to this address automatically — no mail app required.</div>
              </Section>
              <Section eyebrow="OPENING" title="Hero text" description="The very first words visitors see.">
                <div className="builder-grid-2">
                  <Field label="Hero title"><input value={String(masterProposalConfig.heroTitle || '')} onChange={e => updateMasterProposal({ heroTitle: e.target.value })} placeholder="To My Dearest" /></Field>
                  <Field label="Hero subtitle"><input value={String(masterProposalConfig.heroSubtitle || '')} onChange={e => updateMasterProposal({ heroSubtitle: e.target.value })} placeholder="Scroll slowly" /></Field>
                </div>
              </Section>
            </>}

            {templateId === 'master-proposal' && tab === 'story' && <>
              <Section eyebrow="OUR STORY" title="Story chapters" description="Each chapter is one full-screen scroll section. Edit the title and text, or add/remove chapters.">
                <ObjectArrayEditor
                  title="chapter"
                  items={(Array.isArray(masterProposalConfig.story) ? masterProposalConfig.story : []) as { title: string; body: string }[]}
                  fields={[{ key: 'title', label: 'Chapter title', placeholder: 'The Beginning' }, { key: 'body', label: 'Chapter text', placeholder: 'Write the chapter…', multiline: true }]}
                  newItem={() => ({ title: '', body: '' })}
                  onChange={items => updateMasterProposal({ story: items })}
                />
              </Section>
              <Section eyebrow="LOVE NOTES" title="Love note jar" description="Short one-line notes a visitor pulls at random from the jar.">
                <ArrayEditor title="Love notes" items={(Array.isArray(masterProposalConfig.loveNotes) ? masterProposalConfig.loveNotes : []) as string[]} placeholder="Your smile is the best part of my day." onChange={items => updateMasterProposal({ loveNotes: items })} />
              </Section>
              <Section eyebrow="BUCKET LIST" title="Future bucket list" description="Things to look forward to together.">
                <ArrayEditor title="Bucket list items" items={(Array.isArray(masterProposalConfig.bucketList) ? masterProposalConfig.bucketList : []) as string[]} placeholder="Travel to Japan" onChange={items => updateMasterProposal({ bucketList: items })} />
              </Section>
            </>}

            {templateId === 'master-proposal' && tab === 'gallery' && <>
              <Section eyebrow="PHOTOS & VIDEOS" title="Photos & videos" description="Choose a photo or video straight from your phone or computer — or paste a YouTube link instead if you have one.">
                <ObjectArrayEditor
                  title="memory"
                  websiteId={id}
                  items={(Array.isArray(masterProposalConfig.museum) ? masterProposalConfig.museum : []) as any[]}
                  fields={[
                    { key: 'type', label: 'Type', options: ['image', 'video'] },
                    { key: 'url', label: 'Photo or video', placeholder: 'Choose a file, or paste a YouTube link', upload: { accept: 'image/*,video/*', folder: 'museum' } },
                    { key: 'title', label: 'Title', placeholder: 'The First Glance' },
                    { key: 'date', label: 'Date', placeholder: 'January 2025' },
                    { key: 'description', label: 'Description', placeholder: 'What made this moment special…', multiline: true },
                  ]}
                  newItem={() => ({ id: String(Date.now()), type: 'image', url: '', title: '', date: '', description: '' })}
                  onChange={items => updateMasterProposal({ museum: items })}
                />
              </Section>
            </>}

            {templateId === 'master-proposal' && tab === 'music' && <>
              <Section eyebrow="SOUNDTRACK" title="Background music" description="This experience uses one single background track. It starts playing right after your visitor finishes the opening section — no playlist, no extra players.">
                <SingleMediaUpload kind="audio" url={String(masterProposalConfig.bgMusicUrl || '')} onChange={bgMusicUrl => updateMasterProposal({ bgMusicUrl })} websiteId={id} />
                <div className="builder-note mt-4">Leave it empty to keep the experience completely silent. Visitors get a small mute button in the corner.</div>
              </Section>
            </>}

            {templateId === 'master-proposal' && tab === 'letter' && <>
              <Section eyebrow="FINAL LETTER" title="Closing letter" description="Shown at the very end of the experience.">
                <Field label="Letter title"><input value={String((masterProposalConfig.finalLetter as any)?.title || '')} onChange={e => updateMasterProposal({ finalLetter: { ...(masterProposalConfig.finalLetter as any || {}), title: e.target.value } })} placeholder="Happy Valentine's Day" /></Field>
                <ArrayEditor title="Letter paragraphs" items={((masterProposalConfig.finalLetter as any)?.paragraphs || []) as string[]} placeholder="Write a paragraph…" multiline onChange={items => updateMasterProposal({ finalLetter: { ...(masterProposalConfig.finalLetter as any || {}), paragraphs: items } })} />
                <Field label="Sign-off"><input value={String((masterProposalConfig.finalLetter as any)?.signoff || '')} onChange={e => updateMasterProposal({ finalLetter: { ...(masterProposalConfig.finalLetter as any || {}), signoff: e.target.value } })} placeholder="Forever yours" /></Field>
              </Section>
              <Section eyebrow="MOOD REPLIES" title="Mood messages" description="What you say back when a visitor taps how they're feeling. The moods themselves are fixed by the original design — only the words are editable.">
                <div className="builder-grid-2">
                  {Object.entries((masterProposalConfig.comfortResponses || {}) as Record<string, { label?: string; response?: string }>).map(([moodId, entry]) => (
                    <Field key={moodId} label={entry.label || moodId}>
                      <textarea rows={3} value={entry.response || ''} onChange={e => updateMasterProposal({ comfortResponses: { ...(masterProposalConfig.comfortResponses as any), [moodId]: { ...entry, response: e.target.value } } })} />
                    </Field>
                  ))}
                </div>
              </Section>
            </>}

            {tab === 'overview' && templateId !== 'miss-you-1' && templateId !== 'master-proposal' && (templateId === 'wedding-proposal' ? <>
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
            </> : templateId === 'master-proposal' ? (() => {
              const gate = (masterProposalConfig.introGate || {}) as Record<string, any>;
              const updateGate = (patch: Record<string, unknown>) => updateMasterProposal({ introGate: { ...gate, ...patch } });
              const planner = (masterProposalConfig.datePlanner || {}) as Record<string, any>;
              const updatePlanner = (patch: Record<string, unknown>) => updateMasterProposal({ datePlanner: { ...planner, ...patch } });
              return <>
                <Section eyebrow="THE OPENING QUESTION" title="'Will you be my Valentine?' screen" description="Everything visitors see before the experience even starts — the two lead-in lines, the question itself, and both buttons.">
                  <div className="builder-grid-2">
                    <Field label="First line" hint="Shown first, alone on screen."><input value={String(gate.firstLine || '')} onChange={e => updateGate({ firstLine: e.target.value })} placeholder="I made this just for you." /></Field>
                    <Field label="Second line label" hint="Small label above the second line."><input value={String(gate.secondLineLabel || '')} onChange={e => updateGate({ secondLineLabel: e.target.value })} placeholder="But first" /></Field>
                    <Field label="Second line"><input value={String(gate.secondLine || '')} onChange={e => updateGate({ secondLine: e.target.value })} placeholder="Before anything else..." /></Field>
                    <Field label="Yes button text"><input value={String(gate.yesButtonText || '')} onChange={e => updateGate({ yesButtonText: e.target.value })} placeholder="Yes, Forever" /></Field>
                    <Field label="No button text (first tap)"><input value={String(gate.noButtonText || '')} onChange={e => updateGate({ noButtonText: e.target.value })} placeholder="No" /></Field>
                    <Field label="No button text (after that)"><input value={String(gate.noButtonTextRepeat || '')} onChange={e => updateGate({ noButtonTextRepeat: e.target.value })} placeholder="Still No?" /></Field>
                  </div>
                  <div className="mt-4">
                    <ObjectArrayEditor
                      title="teasing prompt"
                      description="Each time someone taps No, the question changes to the next one in this list. The first one is the real question."
                      items={(Array.isArray(gate.prompts) ? gate.prompts : []) as { title: string; subtitle: string }[]}
                      fields={[{ key: 'title', label: 'Question', placeholder: 'Will you be my Valentine?' }, { key: 'subtitle', label: 'Subtitle', placeholder: '...and for a lifetime?' }]}
                      newItem={() => ({ title: '', subtitle: '' })}
                      onChange={items => updateGate({ prompts: items })}
                    />
                  </div>
                </Section>
                <Section eyebrow="DATE PLANNER & TICKET" title="Date options and the ticket button" description="The grid of date ideas visitors pick from, and the button that sends the ticket to your inbox.">
                  <div className="builder-grid-2">
                    <Field label="Section heading"><input value={String(planner.heading || '')} onChange={e => updatePlanner({ heading: e.target.value })} placeholder="Let's Plan Our Date Together" /></Field>
                    <Field label="Section subtitle"><input value={String(planner.subtitle || '')} onChange={e => updatePlanner({ subtitle: e.target.value })} placeholder="Pick what your heart desires." /></Field>
                    <Field label="Send-ticket button text"><input value={String(planner.sendButtonLabel || '')} onChange={e => updatePlanner({ sendButtonLabel: e.target.value })} placeholder="Send Ticket" /></Field>
                  </div>
                  <div className="mt-4">
                    <ObjectArrayEditor
                      title="date option"
                      description="Each card in the date-planner grid. Mark one 'yes' under Special to give it the highlighted full-width VIP style."
                      items={((Array.isArray(planner.options) ? planner.options : []) as any[]).map(o => ({ ...o, isSpecial: o.isSpecial ? 'yes' : 'no' }))}
                      fields={[
                        { key: 'label', label: 'Card label', placeholder: 'Arcade & Ice Cream' },
                        { key: 'planTitle', label: 'Ticket title', placeholder: 'Retro Arcade Duel' },
                        { key: 'planDescription', label: 'Ticket description', placeholder: 'Describe the date plan…', multiline: true },
                        { key: 'budget', label: 'Budget label', placeholder: '$, $$, or Free' },
                        { key: 'isSpecial', label: 'Special (yes/no)', options: ['no', 'yes'] },
                      ]}
                      newItem={() => ({ id: String(Date.now()), label: '', planTitle: '', planDescription: '', budget: '$', isSpecial: 'no' })}
                      onChange={items => updatePlanner({ options: items.map((it: any) => ({ ...it, isSpecial: it.isSpecial === 'yes' })) })}
                    />
                  </div>
                </Section>
              </>;
            })() : <>
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

            {tab === 'story' && templateId !== 'miss-you-1' && <Section eyebrow="THE HEART OF THE STORY" title="Reasons" description="These are the cards visitors reveal one by one. Unlike the old version, every reason is now editable here and updates the live preview immediately.">
              <ArrayEditor title="Your reasons" description="Add as many reasons as you want. The master template will automatically update its counter and sequence." items={c.reasons} placeholder="e.g. Your laugh always makes my day…" multiline onChange={items => updateArray('reasons', items)} />
            </Section>}

            {tab === 'gallery' && <Section eyebrow="MEMORIES" title="Photo gallery" description="Upload the actual photos used by the cinematic photo scene. No fake placeholder cards are required."><GalleryUpload items={c.gallery} onChange={gallery => update({ gallery })} websiteId={id} /><div className="builder-note mt-4">{c.gallery.length ? `${c.gallery.length} photo${c.gallery.length > 1 ? 's' : ''} ready for the experience.` : 'No photos yet — upload your memories to make this section yours.'}</div></Section>}

            {templateId === 'miss-you-1' && tab === 'music' && <Section eyebrow="SOUNDTRACK" title="Background music" description="This template only needs one audio track. Replace it here without changing the original experience."><SingleMediaUpload kind="audio" url={String(missYouConfig.musicUrl || '')} onChange={musicUrl => updateMissYou({ musicUrl })} websiteId={id} /><div className="builder-note mt-4">Leave it empty to keep the original Miss You 1 music file.</div></Section>}

            {tab === 'music' && templateId !== 'miss-you-1' && <Section eyebrow="SOUNDTRACK" title="Background music" description="Upload the track that plays through the cinematic experience."><SingleMediaUpload kind="audio" url={c.musicUrl} onChange={musicUrl => update({ musicUrl })} websiteId={id} /><div className="builder-note mt-4">Audio playback still respects browser autoplay rules; visitors may need to tap once before sound starts.</div></Section>}

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

            {tab === 'social' && <Section eyebrow="SHARE YOUR WORLD" title="Social / Friend link" description="These links power the social buttons at the end of the Master Template. Add the profile or page you want your friends, soulmate, or guests to visit.">
              <div className="builder-grid-2">
                <Field label="Friend / soulmate link (Instagram)" hint="This powers the “See Your Friend” button at the end of the Master Template."><input type="url" value={c.social?.instagram || ''} onChange={e => update({ social: { ...(c.social || {}), instagram: e.target.value } })} placeholder="https://instagram.com/yourname" /></Field>
                <Field label="Facebook link" hint="Used by the Facebook button on the Master Template contact section."><input type="url" value={c.social?.facebook || ''} onChange={e => update({ social: { ...(c.social || {}), facebook: e.target.value } })} placeholder="https://facebook.com/yourname" /></Field>
              </div>
              <div className="builder-note mt-4">Leave a field empty to keep the original Master Template link. Your links are saved with this website and will be included in its published version.</div>
            </Section>}

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
  {templateId !== 'wedding-proposal' && templateId !== 'miss-you-1' && <button className={`builder-device ${editorMode?'active':''}`} onClick={()=>setEditorMode(v=>!v)}>✎ Edit on canvas</button>}
</div></div>
          {status === 'published' && publicUrl && <div className="builder-live-link"><div><span>YOUR LIVE LINK</span><strong>{publicUrl}</strong></div><div className="builder-live-link-actions"><button onClick={() => navigator.clipboard?.writeText(publicUrl)}>Copy link</button><a href={publicUrl} target="_blank" rel="noreferrer">Open ↗</a></div></div>}
          <div className="builder-preview-frame"><div className="builder-browser"><i /><i /><i /><span>/site/{slug || 'your-slug'}</span></div><div className={`builder-preview-canvas device-${device}`}>{templateId === 'master' ? <MasterTemplate content={previewContent} editorMode={editorMode} onElementSelect={handleCanvasSelect} /> : templateId ? <ExperienceTemplate variant={templateId} content={previewContent} editorMode={editorMode} onElementSelect={handleCanvasSelect} /> : <div className="builder-template-empty"><div>✦</div><h3>No {currentOccasion[2]} template yet</h3><p>This occasion is ready for a template. Once you add one to the catalog, it will appear here automatically.</p></div>}</div></div>
        </section>
      </section>
    </div>
    {msg && <div className="builder-toast">{msg}</div>}
  </main>;
}
