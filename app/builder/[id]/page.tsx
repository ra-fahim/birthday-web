'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { defaultContent, BirthdayContent } from '@/lib/types';
import { MasterTemplate } from '@/components/template/MasterTemplate';
import MasterBirthdayEditor from '../MasterBirthdayEditor';
import MasterBirthdayTemplate from '@/components/template/MasterBirthdayTemplate';
import { getMasterBirthdayConfig } from '@/lib/master-birthday';
import ExperienceTemplate, { getMissYouDefaults, getMasterProposalDefaults } from '@/components/template/ExperienceTemplates';
import { SingleMediaUpload, GalleryUpload, InlineMediaField } from './MediaUploader';
import FeatureControls from './FeatureControls';
import UniversalElementEditor from './UniversalElementEditor';
import { TimelineEditor, MemoriesEditor, WishlistEditor, GuestbookToggle } from './ContentListEditors';
import { templateCatalog } from '@/lib/templates';
import { getTemplateInspection } from '@/lib/template-inspector';
import StudioOnboarding from './StudioOnboarding';

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

// Only occasions that actually have an installed template show up in the
// Occasion picker — an empty category is just noise for the person building
// their site. OCCASIONS itself stays complete so labels/emoji still resolve
// correctly for older sites already saved under a category that has since
// lost its last template.
const AVAILABLE_OCCASIONS = OCCASIONS.filter(([value]) => templateCatalog.some((t) => t.category === value));

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
type EditGroup = readonly [string, string, string, readonly TabId[]];

const EDIT_GROUPS: readonly EditGroup[] = [
  ['content', '✍', 'Content', ['overview','opening']],
  ['story', '♡', 'Story', ['story','timeline','memories','wishlist','guestbook','letter']],
  ['media', '▧', 'Photos & Music', ['gallery','music','video']],
  ['style', '◈', 'Style & Effects', ['theme','effects']],
  ['share', '↗', 'Share & Growth', ['social','growth']],
  ['advanced', '⚙', 'Advanced', ['advanced']],
];
type EditGroupId = typeof EDIT_GROUPS[number][0];
type CanvasSelection = { key: string; label: string; index?: number; value?: string; kind?: string };

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

function MusicSlotCard({ icon, title, description, value, onChange, websiteId }: { icon: string; title: string; description: string; value: string; onChange: (value: string) => void; websiteId: string }) {
  return <div className="builder-item builder-item-card" style={{display:'flex',flexDirection:'column',alignItems:'stretch',gap:10}}>
    <div className="builder-item-card-head"><span className="builder-item-card-num">{icon} {title}</span>{value && <span className="builder-live-pill">READY</span>}</div>
    <small>{description}</small>
    <SingleMediaUpload kind="audio" url={value || ''} onChange={onChange} websiteId={websiteId} />
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
  const [editorMode, setEditorMode] = useState(false);
  const [editGroup, setEditGroup] = useState<EditGroupId>('content');
  const [device, setDevice] = useState<'desktop'|'tablet'|'mobile'>('desktop');
  const [selectedElement, setSelectedElement] = useState<CanvasSelection | null>(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [canvasHistory, setCanvasHistory] = useState({ canBack: false, canForward: false });

  useEffect(() => {
    fetch('/api/websites/' + id).then(r => r.json()).then(j => {
      if (j.content) setC({ ...defaultContent, ...j.content });
      if (j.slug) setSlug(j.slug);
      if (j.status) setStatus(j.status);
      const storedOccasion = typeof j.content?.occasion === 'string' ? j.content.occasion : 'birthday';
      const storedTemplate = typeof j.templateId === 'string' ? j.templateId : 'master';
      const storedTemplateEntry = templateCatalog.find((t) => t.slug === storedTemplate);
      let resolvedTemplate: string;
      let resolvedOccasion: string;
      if (storedTemplateEntry) {
        // The template itself still exists — trust its own category as the
        // source of truth. This keeps older sites pointed at the same
        // template even after a template gets moved to a different
        // occasion (e.g. Wedding Proposal moving from Proposal to
        // Wedding); the site's occasion just gets silently corrected to
        // match instead of the template being swapped out from under them.
        resolvedTemplate = storedTemplateEntry.slug;
        resolvedOccasion = storedTemplateEntry.category;
      } else {
        // Template no longer installed at all — fall back to whatever the
        // stored occasion's first installed template is; if none exists
        // yet, the studio stays explicitly empty instead of showing the
        // wrong template.
        const occasionTemplates = templatesForOccasion(storedOccasion);
        resolvedTemplate = occasionTemplates[0]?.slug ?? '';
        resolvedOccasion = storedOccasion;
      }
      setTemplateId(resolvedTemplate);
      setOccasion(resolvedOccasion);
      if (resolvedTemplate !== storedTemplate || resolvedOccasion !== storedOccasion) setDirty(true);
      if (j.slug) setPublicUrl(`${window.location.origin}/site/${j.slug}`);
    });
  }, [id]);

  const update = (patch: Partial<BirthdayContent>) => { setC(prev => ({ ...prev, ...patch })); setDirty(true); };
  const updateArray = (key: keyof BirthdayContent, value: unknown) => update({ [key]: value } as Partial<BirthdayContent>);
  const toggleEffect = (key: keyof BirthdayContent, checked: boolean) => update({ [key]: checked } as Partial<BirthdayContent>);

  const handleCanvasSelect = useCallback((selection: CanvasSelection) => {
    if (!editorMode) return;
    setMobileToolsOpen(false);
    setSelectedElement(selection);
  }, [editorMode]);

  const handleCanvasHistory = useCallback((direction: 'back' | 'forward') => {
    const iframe = document.querySelector<HTMLIFrameElement>('.builder-canvas-stage iframe');
    iframe?.contentWindow?.postMessage({ type: 'BB_CANVAS_HISTORY', direction }, '*');
  }, []);
  const handleCanvasHistoryState = useCallback((state: { canBack?: boolean; canForward?: boolean }) => {
    setCanvasHistory({ canBack: !!state.canBack, canForward: !!state.canForward });
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'BB_CANVAS_HISTORY_STATE') { handleCanvasHistoryState(event.data); return; }
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
  }, [c, handleCanvasHistoryState]);

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
  const templateInspection = useMemo(() => getTemplateInspection(templateId), [templateId]);
  const editableMediaKeys = useMemo(() => new Set(
    templateInspection.media.filter(slot => slot.sourceType === 'file-or-url').map(slot => slot.key)
  ), [templateInspection]);
  const hasGalleryMedia = editableMediaKeys.has('gallery') || editableMediaKeys.has('museum');
  const hasVideoMedia = editableMediaKeys.has('videoUrl') || editableMediaKeys.has('museum');
  const hasMusicMedia = editableMediaKeys.has('musicUrl') || editableMediaKeys.has('bgMusicUrl') || editableMediaKeys.has('countdownAudioUrl') || editableMediaKeys.has('wishingAudioUrl');
  const visibleTabs = TABS.filter(([value]) => {
    if (value === 'gallery') return hasGalleryMedia;
    if (value === 'video') return hasVideoMedia;
    if (value === 'music') return hasMusicMedia || ['wedding-proposal','master-birthday'].includes(templateId);
    if (templateId === 'wedding-proposal') return ['overview', 'opening', 'music'].includes(value as string);
    if (templateId === 'miss-you-1') return ['overview', 'story', 'music'].includes(value as string);
    if (templateId === 'master-proposal') return ['overview', 'opening', 'story', 'gallery', 'music', 'letter'].includes(value as string);
    if (templateId === 'master-birthday') return ['overview','opening','story','gallery','music','video','letter','theme','effects'].includes(value as string);
    return value !== 'social' || templateId === 'master';
  });
  const activeTab = visibleTabs.find(x => x[0] === tab) || visibleTabs[0];
  const visibleGroups = EDIT_GROUPS.map(([id, icon, label, tabs]) => ({ id, icon, label, tabs: tabs.filter(t => visibleTabs.some(v => v[0] === t)) })).filter(g => g.tabs.length);
  const activeGroup = visibleGroups.find(g => g.id === editGroup) || visibleGroups[0];
  const groupTabs = activeGroup?.tabs.map(t => visibleTabs.find(v => v[0] === t)).filter(Boolean) as typeof visibleTabs[number][] | undefined;
  useEffect(() => {
    if (!visibleTabs.some(([value]) => value === tab)) setTab('overview');
    setSelectedElement(null);
    setMobileSidebarOpen(false);
    setMobileToolsOpen(false);
    setEditorMode(false);
  }, [templateId]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = mobileSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileSidebarOpen]);
  useEffect(() => {
    const group = EDIT_GROUPS.find(([, , , tabs]) => tabs.includes(tab as TabId));
    if (group) setEditGroup(group[0]);
  }, [tab]);
  useEffect(() => {
    if (!editorMode) setSelectedElement(null);
  }, [editorMode]);

  const previewContent = useMemo(() => ({ ...c, occasion, templateId }), [c, occasion, templateId]);
  const resetToMasterDefaults = () => {
    const keepName = c.name;
    setC({ ...defaultContent, name: keepName || defaultContent.name, templateId: 'master', occasion: 'birthday' });
    setTemplateId('master'); setOccasion('birthday'); setDirty(true); setMsg('Master template defaults restored.');
  };

  return <main className="builder-shell">
    <header className="builder-topbar">
      <div className="builder-brand">
        <div className="builder-logo">W</div>
        <div><strong>Wishly Studio</strong><span>Experience editor</span></div>
      </div>
      <div className="builder-top-actions">
        <div className={`builder-status ${dirty ? 'is-dirty' : ''}`}><i />{dirty ? 'Unsaved changes' : status === 'published' ? 'Published' : 'All changes saved'}</div>
        <button className="builder-ghost" onClick={() => router.push('/dashboard')}>Exit</button>
        <button className="builder-save" onClick={() => save(false)}>Save draft</button>
        <button className="builder-publish" onClick={() => save(true)}>Create Live Link ↗</button>
      </div>
    </header>

    <div className={`builder-mobile-sidebar-overlay ${mobileSidebarOpen ? 'is-open' : ''}`} onClick={() => setMobileSidebarOpen(false)} aria-hidden={!mobileSidebarOpen} />
    <div className="builder-layout">
      <aside className={`builder-sidebar ${mobileSidebarOpen ? 'is-mobile-open' : ''}`}>
        <div className="builder-mobile-sidebar-head">
          <div><span className="builder-eyebrow">STUDIO MENU</span><strong>Build your website</strong></div>
          <button type="button" onClick={() => setMobileSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="builder-project-card">
          <div className="builder-project-icon">{currentOccasion[1]}</div>
          <div className="min-w-0"><div className="builder-eyebrow">CURRENT PROJECT</div><h1>{c.name || 'Untitled celebration'}</h1><p>{currentOccasion[2]} · {occasionTemplates.find(t => t.slug === templateId)?.name || 'No template added yet'}</p></div>
        </div>

        <div className="builder-selector-grid">
          <div><span>Occasion</span><select value={occasion} onChange={e => { const nextOccasion = e.target.value; const nextTemplate = firstTemplateForOccasion(nextOccasion); setOccasion(nextOccasion); setTemplateId(nextTemplate); if (nextTemplate === 'miss-you-1' && !c.templateConfig) setC(prev => ({ ...prev, templateConfig: getMissYouDefaults() })); if (nextTemplate === 'master-proposal' && !c.templateConfig) setC(prev => ({ ...prev, templateConfig: getMasterProposalDefaults() })); setDirty(true); }}>{AVAILABLE_OCCASIONS.map(([value, emoji, label]) => <option value={value} key={value}>{emoji} {label}</option>)}</select></div>
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

        <nav className="builder-nav builder-category-nav">
          <div className="builder-nav-label">EDIT YOUR WEBSITE</div>
          {visibleGroups.map(g => <button key={g.id} className={activeGroup?.id === g.id ? 'active' : ''} onClick={() => { setEditGroup(g.id); setTab(g.tabs[0] as TabId); setMobileSidebarOpen(false); setMobileToolsOpen(true); }}><span>{g.icon}</span>{g.label}<b>{g.tabs.length}</b></button>)}
        </nav>
        <div className="builder-subnav">
          {groupTabs?.map(([value, icon, label]) => <button key={value} className={tab === value ? 'active' : ''} onClick={() => { setTab(value as TabId); setMobileSidebarOpen(false); setMobileToolsOpen(true); }}><span>{icon}</span>{label}</button>)}
        </div>

        <div className="builder-side-tip"><span>⌘</span><div><b>Easy mode</b><p>Edit here or directly on the page. When ready, create one live link for this website.</p></div></div>
      </aside>

      <section className="builder-workspace">
        <div className={`builder-editor-panel ${mobileToolsOpen ? 'mobile-tools-open' : ''}`}>
          {mobileToolsOpen && <div className="builder-mobile-editor-toolbar">
            <button type="button" className="builder-mobile-editor-nav" onClick={() => setMobileToolsOpen(false)} aria-label="Back to studio preview">← Preview</button>
            <button type="button" className="builder-mobile-editor-nav builder-mobile-editor-menu" onClick={() => setMobileSidebarOpen(true)} aria-label="Open studio sidebar"><Menu size={15} /> Studio menu</button>
          </div>}
          <div className="builder-panel-head"><div><div className="builder-eyebrow">{activeGroup?.icon} {activeGroup?.label || 'Editor'}</div><h2>{activeTab?.[2]}</h2></div><span className="builder-live-pill">● LIVE</span></div>
          <div className="builder-mobile-category-tabs">{visibleGroups.map(g => <button key={g.id} className={activeGroup?.id === g.id ? 'active' : ''} onClick={() => { setEditGroup(g.id); setTab(g.tabs[0] as TabId); setMobileToolsOpen(true); }}><span>{g.icon}</span>{g.label}</button>)}</div>
          <div className="builder-form-scroll">
            {templateId === 'master-birthday' && <MasterBirthdayEditor tab={tab as string} config={getMasterBirthdayConfig(c)} websiteId={id} onChange={(masterBirthday) => update({ templateConfig: { ...(c.templateConfig || {}), masterBirthday } })} />}

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
              <Section eyebrow="QUICK CUSTOMIZE" title="Make the important changes first" description="Start here on mobile. Everything else stays available in the tabs below, but these are the changes people make most often.">
                <div className="builder-quick-actions builder-quick-actions-panel">
                  <button type="button" onClick={() => setTab('opening')}>✍️ Text</button>
                  <button type="button" onClick={() => document.getElementById('countdown-settings')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>⏳ Countdown</button>
                  <button type="button" onClick={() => setTab('gallery')}>🖼️ Photos</button>
                  <button type="button" onClick={() => setTab('music')}>🎵 Music</button>
                  <button type="button" onClick={() => setTab('theme')}>🎨 Style</button>
                  <button type="button" onClick={() => setTab('effects')}>✨ Effects</button>
                </div>
              </Section>
              <Section eyebrow="IDENTITY" title="Who is this celebration for?" description="These details personalize the experience without changing the master template structure.">
                <div className="builder-grid-2">
                  <Field label="Person / recipient name"><input value={c.name} onChange={e => update({ name: e.target.value })} placeholder="e.g. Riya" /></Field>
                  <Field label="Relationship"><input value={c.relationship} onChange={e => update({ relationship: e.target.value })} placeholder="Best friend, partner, sister…" /></Field>
                  <Field label="Public button text"><input value={c.buttonText} onChange={e => update({ buttonText: e.target.value })} placeholder="Make a wish" /></Field>
                </div>
              </Section>
              <Section eyebrow="COUNTDOWN" title="Choose exactly when the surprise unlocks" description="Pick both the date and time. The live preview uses the same target, so you can test the result before publishing.">
                <div id="countdown-settings" className="builder-countdown-card">
                  <div className="builder-countdown-head">
                    <div><span className="builder-eyebrow">LIVE TARGET</span><strong>Birthday countdown</strong><small>Visitors will see the countdown until this moment.</small></div>
                    <label className={`builder-toggle builder-toggle-inline ${c.countdown ? 'on' : ''}`}><span><b>{c.countdown ? 'On' : 'Off'}</b></span><input type="checkbox" checked={c.countdown} onChange={e => toggleEffect('countdown', e.target.checked)} /></label>
                  </div>
                  <div className="builder-grid-2">
                    <Field label="Birthday date & time" hint="Use your local time."><input type="datetime-local" value={(() => { const d = new Date(c.birthday || ''); if (Number.isNaN(d.getTime())) return ''; const pad=(n:number)=>String(n).padStart(2,'0'); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`; })()} onChange={e => update({ birthday: e.target.value })} /></Field>
                    <Field label="Countdown sound" hint="Optional sound during the final countdown."><button type="button" className="builder-inline-jump" onClick={() => setSelectedElement({ key: 'countdownAudioUrl', label: 'Countdown audio', kind: 'audio' })}>🎵 {c.countdownAudioUrl ? 'Change countdown audio' : 'Add countdown audio'} <span>→</span></button></Field>
                  </div>
                  <div className="builder-grid-2 mt-3">
                    <Field label="Countdown title"><input value={c.countdownTitle} onChange={e => update({ countdownTitle: e.target.value })} placeholder="Something special is unlocking...⌛" /></Field>
                    <Field label="Countdown message"><input value={c.countdownMessage} onChange={e => update({ countdownMessage: e.target.value })} placeholder="⏰ Something is coming soon..." /></Field>
                    <Field label="Countdown style"><select value={c.countdownStyle} onChange={e => update({ countdownStyle: e.target.value })}><option value="glass">Glass</option><option value="solid">Premium dark</option><option value="minimal">Minimal</option></select></Field>
                    <Field label="Time labels" hint="Separate with commas: Days, Hours, Mins, Secs"><input value={[c.countdownDaysLabel,c.countdownHoursLabel,c.countdownMinutesLabel,c.countdownSecondsLabel].join(', ')} onChange={e => { const parts=e.target.value.split(',').map(x=>x.trim()); update({ countdownDaysLabel:parts[0]||'Days', countdownHoursLabel:parts[1]||'Hours', countdownMinutesLabel:parts[2]||'Mins', countdownSecondsLabel:parts[3]||'Secs' }); }} /></Field>
                  </div>
                  <div className="builder-countdown-status"><span>Target</span><b>{(() => { const d = new Date(c.birthday || ''); return Number.isNaN(d.getTime()) ? 'Choose a date & time' : d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }); })()}</b></div>
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

            {tab === 'story' && templateId !== 'miss-you-1' && templateId !== 'master-birthday' && <Section eyebrow="THE HEART OF THE STORY" title="Reasons" description="These are the cards visitors reveal one by one. Unlike the old version, every reason is now editable here and updates the live preview immediately.">
              <ArrayEditor title="Your reasons" description="Add as many reasons as you want. The master template will automatically update its counter and sequence." items={c.reasons} placeholder="e.g. Your laugh always makes my day…" multiline onChange={items => updateArray('reasons', items)} />
            </Section>}

            {tab === 'gallery' && templateId === 'master' && <Section eyebrow="MEMORIES" title="Photo gallery" description="This template has one photo sequence. Add local files or public image URLs."><GalleryUpload items={c.gallery} onChange={gallery => update({ gallery })} websiteId={id} /><div className="builder-note mt-4">{c.gallery.length ? `${c.gallery.length} photo${c.gallery.length > 1 ? 's' : ''} ready for the experience.` : 'No photos yet — upload your memories to make this section yours.'}</div></Section>}
            {tab === 'gallery' && templateId === 'master-proposal' && <Section eyebrow="MUSEUM" title="Photos & videos" description="This template was built with a mixed museum. Each memory keeps its own type, title and media URL."><ObjectArrayEditor title="memory" description="Choose Photo or Video per item. For video, YouTube links are supported by the original template." items={(Array.isArray(masterProposalConfig.museum) ? masterProposalConfig.museum : []) as any[]} fields={[{key:'type',label:'Media type',options:['image','video']},{key:'url',label:'Public media URL',placeholder:'https://…',upload:{accept:'image/*,video/*',folder:'museum',}},{key:'thumbnail',label:'Video thumbnail (optional)',placeholder:'https://…',upload:{accept:'image/*',folder:'museum-thumbnails'}},{key:'title',label:'Title',placeholder:'Our favorite memory'},{key:'date',label:'Date / label',placeholder:'January 2026'},{key:'description',label:'Description',placeholder:'A little story…',multiline:true}]} newItem={() => ({id:String(Date.now()),type:'image',url:'',thumbnail:'',title:'New Memory',date:'',description:''})} websiteId={id} onChange={items => updateMasterProposal({ museum: items })} /></Section>}

            {tab === 'music' && templateId === 'master' && <Section eyebrow="SOUNDTRACK" title="Template music layers" description="This exact template contains three separate audio elements, so each one gets its own editor here.">
              <div className="space-y-5">
                <MusicSlotCard icon="🎵" title="Background music" description="Main soundtrack — loops while the experience is running." value={c.musicUrl} onChange={musicUrl => update({ musicUrl })} websiteId={id} />
                <MusicSlotCard icon="⏳" title="Countdown audio" description="Separate sound used in the final countdown window." value={c.countdownAudioUrl} onChange={countdownAudioUrl => update({ countdownAudioUrl })} websiteId={id} />
                <MusicSlotCard icon="🎉" title="Wishing / birthday audio" description="Separate sound played when the celebration unlocks." value={c.wishingAudioUrl} onChange={wishingAudioUrl => update({ wishingAudioUrl })} websiteId={id} />
              </div>
            </Section>}
            {templateId === 'miss-you-1' && tab === 'music' && <Section eyebrow="SOUNDTRACK" title="Background music" description="This template contains one audio element. Replace the bundled track with an uploaded file or public direct audio URL."><SingleMediaUpload kind="audio" url={String(missYouConfig.musicUrl || '')} onChange={musicUrl => updateMissYou({ musicUrl })} websiteId={id} /></Section>}
            {templateId === 'master-proposal' && tab === 'music' && <Section eyebrow="SOUNDTRACK" title="Background music" description="The source code contains one BackgroundMusic component and one configurable soundtrack URL."><SingleMediaUpload kind="audio" url={String(masterProposalConfig.bgMusicUrl || '')} onChange={bgMusicUrl => updateMasterProposal({ bgMusicUrl })} websiteId={id} /></Section>}
            {templateId === 'wedding-proposal' && tab === 'music' && <Section eyebrow="SOURCE MUSIC" title="Built-in wedding soundtrack" description="This template does not use an uploaded music file. Its music and sound effects are generated in the original JavaScript with AudioContext, so the Studio preserves that exact behavior."><div className="builder-protected"><span>♫</span><div><b>Code-generated audio</b><p>The source contains a generated music layer plus sound effects. There is no external audio URL in this template to replace.</p></div></div></Section>}

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
          <div className="builder-preview-head">
            <div className="builder-preview-title">
              <button type="button" className="builder-mobile-menu-btn builder-preview-menu-btn" onClick={() => setMobileSidebarOpen(v => !v)} aria-label={mobileSidebarOpen ? 'Close studio menu' : 'Open studio menu'} aria-expanded={mobileSidebarOpen}>
                {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <button
                type="button"
                className={`builder-mobile-canvas-toggle ${editorMode ? 'active' : ''}`}
                aria-pressed={editorMode}
                onClick={() => setEditorMode(v => !v)}
              >
                {editorMode ? '✎ Edit ON' : '✎ Edit OFF'}
              </button>
              <div><span>LIVE PREVIEW</span><strong>{c.name || 'Untitled celebration'}</strong></div>
            </div>
            <div className="builder-preview-actions">
              {(['desktop','tablet','mobile'] as const).map(d => <button key={d} className={`builder-device ${device===d?'active':''}`} onClick={()=>{setDevice(d)}}>{d[0].toUpperCase()+d.slice(1)}</button>)}
              {editorMode && <><button type="button" className="builder-device" onClick={() => handleCanvasHistory('back')} disabled={!canvasHistory.canBack} title="Previous canvas screen">← Back</button><button type="button" className="builder-device" onClick={() => handleCanvasHistory('forward')} disabled={!canvasHistory.canForward} title="Next canvas screen">Forward →</button></>}
              <button
                type="button"
                className={`builder-device builder-canvas-edit-toggle ${editorMode ? 'active' : ''}`}
                aria-pressed={editorMode}
                onClick={() => setEditorMode(v => !v)}
              >
                {editorMode ? '✎ Canvas edit ON' : '✎ Canvas edit OFF'}
              </button>
            </div>
          </div>
          {status === 'published' && publicUrl && <div className="builder-live-link"><div><span>YOUR LIVE LINK</span><strong>{publicUrl}</strong></div><div className="builder-live-link-actions"><button onClick={() => navigator.clipboard?.writeText(publicUrl)}>Copy link</button><a href={publicUrl} target="_blank" rel="noreferrer">Open ↗</a></div></div>}
          <div className="builder-preview-frame"><div className="builder-browser"><i /><i /><i /><span>/site/{slug || 'your-slug'}</span></div><div className={`builder-preview-canvas device-${device}`}><div className="builder-canvas-stage">{templateId === 'master-birthday' ? <MasterBirthdayTemplate content={previewContent} demo={false} editorMode={editorMode} onElementSelect={handleCanvasSelect} onHistoryState={handleCanvasHistoryState} /> : templateId === 'master' ? <MasterTemplate content={previewContent} editorMode={editorMode} onElementSelect={handleCanvasSelect} onHistoryState={handleCanvasHistoryState} /> : templateId ? <ExperienceTemplate variant={templateId} content={previewContent} editorMode={editorMode} onElementSelect={handleCanvasSelect} onHistoryState={handleCanvasHistoryState} /> : <div className="builder-template-empty"><div>✦</div><h3>No {currentOccasion[2]} template yet</h3><p>This occasion is ready for a template. Once you add one to the catalog, it will appear here automatically.</p></div>}</div></div></div>
          {selectedElement && editorMode && (
            <section className="builder-context-editor" aria-label="Selected element editor">
              <div className="builder-context-editor-head">
                <div><span>SELECTED ELEMENT</span><strong>{selectedElement.label}</strong></div>
                <button type="button" onClick={() => setSelectedElement(null)} aria-label="Close selected element editor">Done</button>
              </div>
              <div className="builder-context-editor-body">
                <UniversalElementEditor
                  selected={selectedElement}
                  content={c}
                  templateId={templateId}
                  websiteId={id}
                  onChange={update}
                  onTemplateConfigChange={(patch) => update({ templateConfig: { ...(c.templateConfig || {}), ...patch } })}
                  onClose={() => setSelectedElement(null)}
                />
              </div>
            </section>
          )}
        </section>
      </section>
    </div>
    {msg && <div className="builder-toast">{msg}</div>}
    <StudioOnboarding />
  </main>;
}
