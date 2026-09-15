'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Redo2, Undo2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { defaultContent, BirthdayContent } from '@/lib/types';
import { MasterTemplate } from '@/components/template/MasterTemplate';
import ExperienceTemplate, { getMissYouDefaults, getMasterProposalDefaults } from '@/components/template/ExperienceTemplates';
import { SingleMediaUpload, GalleryUpload, InlineMediaField } from './MediaUploader';
import FeatureControls from './FeatureControls';
import { TimelineEditor, MemoriesEditor, WishlistEditor, GuestbookToggle } from './ContentListEditors';
import { templateCatalog } from '@/lib/templates';
import UniversalElementEditor from './UniversalElementEditor';

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
  const [showTools, setShowTools] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [device, setDevice] = useState<'desktop'|'tablet'|'mobile'>('mobile');
  const [selectedElement, setSelectedElement] = useState<CanvasSelection | null>(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [past, setPast] = useState<BirthdayContent[]>([]);
  const [future, setFuture] = useState<BirthdayContent[]>([]);

  const commitContent = useCallback((next: BirthdayContent) => {
    setC(prev => {
      setPast(h => [...h.slice(-39), prev]);
      setFuture([]);
      return next;
    });
    setDirty(true);
  }, []);

  const undo = useCallback(() => {
    setPast(history => {
      const previous = history[history.length - 1];
      if (!previous) return history;
      setC(current => { setFuture(f => [...f.slice(-39), current]); return previous; });
      return history.slice(0, -1);
    });
    setDirty(true);
    setSelectedElement(null);
  }, []);

  const redo = useCallback(() => {
    setFuture(history => {
      const next = history[history.length - 1];
      if (!next) return history;
      setC(current => { setPast(p => [...p.slice(-39), current]); return next; });
      return history.slice(0, -1);
    });
    setDirty(true);
    setSelectedElement(null);
  }, []);

  useEffect(() => {
    fetch('/api/websites/' + id).then(r => r.json()).then(j => {
      if (j.content) { setC({ ...defaultContent, ...j.content }); setPast([]); setFuture([]); }
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

  const update = useCallback((patch: Partial<BirthdayContent>) => { commitContent({ ...c, ...patch }); }, [c, commitContent]);
  const updateArray = (key: keyof BirthdayContent, value: unknown) => update({ [key]: value } as Partial<BirthdayContent>);
  const toggleEffect = (key: keyof BirthdayContent, checked: boolean) => update({ [key]: checked } as Partial<BirthdayContent>);

  const handleCanvasSelect = useCallback((selection: CanvasSelection) => {
    setSelectedElement(selection);
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== 'BB_TEXT_EDITED') return;
      const raw = event.data.selection as { key?: unknown; label?: unknown; index?: unknown; value?: unknown; kind?: unknown } | null;
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
      setSelectedElement({ key: raw.key, label, index, value, kind: typeof raw.kind === 'string' ? raw.kind : undefined });
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
    commitContent({ ...defaultContent, name: keepName || defaultContent.name, templateId: 'master', occasion: 'birthday' });
    setTemplateId('master'); setOccasion('birthday'); setDirty(true); setMsg('Master template defaults restored.');
  };

  const addMenu = editorMode && addMenuOpen ? (
    <div className="studio-add-menu" role="menu" aria-label="Add content">
      <button type="button" onClick={() => { setSelectedElement({ key: 'gallery', label: 'Add photo', index: c.gallery.length, kind: 'image' }); setShowTools(false); setAddMenuOpen(false); }}>📷 <span>Photo</span></button>
      <button type="button" onClick={() => { setSelectedElement({ key: 'videoUrl', label: 'Add video', kind: 'video' }); setShowTools(false); setAddMenuOpen(false); }}>🎬 <span>Video</span></button>
      <button type="button" onClick={() => { setSelectedElement({ key: 'musicUrl', label: 'Background music', kind: 'audio' }); setShowTools(false); setAddMenuOpen(false); }}>🎵 <span>Music</span></button>
      {templateId === 'master' && <>
        <button type="button" onClick={() => { setSelectedElement({ key: 'countdownAudioUrl', label: 'Countdown audio', kind: 'audio' }); setShowTools(false); setAddMenuOpen(false); }}>⏳ <span>Countdown sound</span></button>
        <button type="button" onClick={() => { setSelectedElement({ key: 'wishingAudioUrl', label: 'Wishing audio', kind: 'audio' }); setShowTools(false); setAddMenuOpen(false); }}>🎉 <span>Wishing sound</span></button>
      </>}
      <button type="button" onClick={() => { setSelectedElement({ key: 'reasons', label: 'Add reason', index: c.reasons.length, kind: 'text' }); setShowTools(false); setAddMenuOpen(false); }}>💬 <span>Reason</span></button>
    </div>
  ) : null;

  return <main className="builder-shell studio-simple-shell">
    <header className="builder-topbar studio-simple-topbar">
      <div className="builder-brand">
        <button type="button" className="studio-back" onClick={() => router.push('/dashboard')} aria-label="Back to dashboard">←</button>
        <div className="builder-logo">W</div>
        <div><strong>{c.name || 'Untitled website'}</strong><span>{currentOccasion[2]} · {occasionTemplates.find(t => t.slug === templateId)?.name || 'Template'}</span></div>
      </div>
      <div className="studio-simple-actions">
        <div className={`builder-status studio-save-status ${dirty ? 'is-dirty' : ''}`}><i />{dirty ? 'Unsaved' : 'Saved'}</div>
        <button className="builder-icon-btn" onClick={undo} disabled={!past.length} title="Undo" aria-label="Undo"><Undo2 size={16}/></button>
        <button className="builder-icon-btn" onClick={redo} disabled={!future.length} title="Redo" aria-label="Redo"><Redo2 size={16}/></button>
        <button className="studio-tool-btn" onClick={() => { setShowTools(v => !v); setAddMenuOpen(false); }} aria-expanded={showTools}>⚙ <span>Settings</span></button>
        <button className={`studio-mode-btn ${editorMode ? 'active' : ''}`} onClick={() => { setEditorMode(v => !v); setSelectedElement(null); }}>
          {editorMode ? 'Preview' : 'Edit'}
        </button>
        <button className="builder-save studio-save-btn" onClick={() => save(false)}>Save</button>
        <button className="builder-publish studio-publish-btn" onClick={() => save(true)}>Publish</button>
      </div>
    </header>

    <div className="studio-canvas-area">
      <div className="studio-canvas-header">
        <div>
          <span className="studio-kicker">{editorMode ? 'EDITING' : 'PREVIEW'}</span>
          <strong>{editorMode ? 'Tap anything on the website to change it.' : 'Your website, exactly as visitors will see it.'}</strong>
        </div>
        <div className="studio-device-picker" aria-label="Preview size">
          {(['mobile','tablet','desktop'] as const).map(d => <button key={d} className={device===d?'active':''} onClick={() => setDevice(d)} title={`${d} preview`} aria-label={`${d} preview`}>{d==='mobile'?'📱':d==='tablet'?'▣':'▤'}</button>)}
        </div>
      </div>

      {showTools && <>
        <button type="button" className="studio-drawer-backdrop" aria-label="Close settings" onClick={() => setShowTools(false)} />
        <aside className="studio-settings-drawer">
          <div className="studio-drawer-head"><div><span>SETTINGS</span><h2>Website settings</h2></div><button type="button" onClick={() => setShowTools(false)} aria-label="Close settings">×</button></div>
          <div className="studio-setting-block">
            <label>Website name<input value={c.name} onChange={e => update({ name: e.target.value })} placeholder="Birthday website" /></label>
            <div className="studio-setting-grid">
              <label>Occasion<select value={occasion} onChange={e => { const next = e.target.value; const nextTemplate = firstTemplateForOccasion(next); setOccasion(next); setTemplateId(nextTemplate); setDirty(true); }}>{AVAILABLE_OCCASIONS.map(([value, emoji, label]) => <option value={value} key={value}>{emoji} {label}</option>)}</select></label>
              <label>Template<select value={templateId} disabled={!occasionTemplates.length} onChange={e => { setTemplateId(e.target.value); setDirty(true); }}>{occasionTemplates.map(t => <option key={t.slug} value={t.slug}>{t.name}</option>)}</select></label>
            </div>
          </div>
          <div className="studio-setting-block">
            <div className="studio-setting-title">Quick changes</div>
            <button className="studio-setting-row" onClick={() => { setSelectedElement({key:'heroTitle',label:'Main text',kind:'text'}); setShowTools(false); }}>✏️ <span>Main text</span><b>›</b></button>
            <button className="studio-setting-row" onClick={() => { setSelectedElement({key:'gallery',label:'Add photo',index:c.gallery.length,kind:'image'}); setShowTools(false); }}>📷 <span>Add photo</span><b>›</b></button>
            <button className="studio-setting-row" onClick={() => { setSelectedElement({key:'musicUrl',label:'Background music',kind:'audio'}); setShowTools(false); }}>🎵 <span>Background music</span><b>›</b></button>
            {templateId === 'master' && <>
              <button className="studio-setting-row" onClick={() => { setSelectedElement({key:'countdownAudioUrl',label:'Countdown audio',kind:'audio'}); setShowTools(false); }}>⏳ <span>Countdown audio</span><b>›</b></button>
              <button className="studio-setting-row" onClick={() => { setSelectedElement({key:'wishingAudioUrl',label:'Wishing audio',kind:'audio'}); setShowTools(false); }}>🎉 <span>Wishing audio</span><b>›</b></button>
            </>}
          </div>
          <details className="studio-advanced-details">
            <summary>All settings</summary>
            <div className="studio-advanced-note">Everything remains available here for power users. The normal workflow is still: tap something on the website → edit it.</div>
            <div className="studio-legacy-tabs">{visibleTabs.map(([value, icon, label]) => <button key={value} className={tab===value?'active':''} onClick={() => { setTab(value as TabId); setShowTools(false); }}>{icon} {label}</button>)}</div>
          </details>
        </aside>
      </>}

      <div className={`studio-preview-wrap ${selectedElement ? 'has-editor' : ''}`}>
        <div className="builder-preview-frame studio-preview-frame">
          <div className="builder-browser studio-browser"><i /><i /><i /><span>/site/{slug || 'your-slug'}</span></div>
          <div className={`builder-preview-canvas device-${device}`}>
            {templateId === 'master' ? <MasterTemplate content={previewContent} editorMode={editorMode} onElementSelect={handleCanvasSelect} /> : templateId ? <ExperienceTemplate variant={templateId} content={previewContent} editorMode={editorMode} onElementSelect={handleCanvasSelect} /> : <div className="builder-template-empty"><div>✦</div><h3>No {currentOccasion[2]} template yet</h3><p>Choose a template in Settings.</p></div>}
          </div>
        </div>

        {editorMode && !selectedElement && <div className="studio-hint">✨ Tap an element or its <b>✏️</b> icon to edit it</div>}

        {selectedElement && <div className="studio-editor-sheet">
          <div className="studio-editor-drag" />
          <div className="studio-sheet-head"><div><span>EDIT</span><strong>{selectedElement.label}</strong></div><button type="button" onClick={() => setSelectedElement(null)} aria-label="Close editor">Done</button></div>
          <div className="studio-sheet-body">
            <UniversalElementEditor selected={selectedElement} content={c} templateId={templateId} websiteId={id} onChange={update} onTemplateConfigChange={patch => update({ templateConfig: { ...((c.templateConfig || {}) as Record<string, unknown>), ...patch } })} onClose={() => setSelectedElement(null)} />
          </div>
        </div>}
      </div>

      {editorMode && <div className="studio-bottom-bar">
        <div className="studio-bottom-left">
          <button className={`studio-add-trigger ${addMenuOpen ? 'active' : ''}`} type="button" onClick={() => { setAddMenuOpen(v => !v); setShowTools(false); }}>＋ Add</button>
          <span>Tap any part of the page to edit</span>
        </div>
        {status === 'published' && publicUrl && <div className="studio-live-link"><span>Live</span><a href={publicUrl} target="_blank" rel="noreferrer">Open website ↗</a><button onClick={() => navigator.clipboard?.writeText(publicUrl)}>Copy</button></div>}
      </div>}
    </div>

    {showTools && addMenu}
    {msg && <div className="builder-toast studio-toast">{msg}</div>}
  </main>;

}
