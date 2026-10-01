'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { defaultContent, BirthdayContent } from '@/lib/types';
import { MasterTemplate } from '@/components/template/MasterTemplate';
import MasterBirthdayTemplate from '@/components/template/MasterBirthdayTemplate';
import MasterBirthdayEditor from './MasterBirthdayEditor';
import { masterBirthdayDefaults, mergeMasterBirthdayConfig } from '@/lib/master-birthday';
import ExperienceTemplate, { getMissYouDefaults, getMasterProposalDefaults } from '@/components/template/ExperienceTemplates';
import { SingleMediaUpload, GalleryUpload, InlineMediaField } from './MediaUploader';
import FeatureControls from './FeatureControls';
import UniversalElementEditor from './UniversalElementEditor';
import { TimelineEditor, MemoriesEditor, WishlistEditor, GuestbookToggle } from './ContentListEditors';
import { templateCatalog } from '@/lib/templates';
import { getTemplateInspection } from '@/lib/template-inspector';

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
  const [editorMode, setEditorMode] = useState(true);
  const [editGroup, setEditGroup] = useState<EditGroupId>('content');
  const [device, setDevice] = useState<'desktop'|'tablet'|'mobile'>('desktop');
  const [selectedElement, setSelectedElement] = useState<CanvasSelection | null>(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [canvasHistory, setCanvasHistory] = useState({ canBack: false, canForward: false });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/websites/' + id).then(r => r.json()).then(j => {
      if (j.content) {
        const nextContent = { ...defaultContent, ...j.content };
        if (typeof j.templateId === 'string' && (j.templateId === 'master' || j.templateId === 'master-birthday')) {
          const mb = mergeMasterBirthdayConfig((j.content.templateConfig as any)?.masterBirthday);
          nextContent.name = mb.recipientName;
          nextContent.birthday = `${mb.birthdayDate}T${mb.birthdayTime}`;
          nextContent.templateConfig = { ...(j.content.templateConfig || {}), masterBirthday: mb };
        }
        setC(nextContent);
      }
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
        // yet, the builder stays explicitly empty instead of showing the
        // wrong template.
        const occasionTemplates = templatesForOccasion(storedOccasion);
        resolvedTemplate = occasionTemplates[0]?.slug ?? '';
        resolvedOccasion = storedOccasion;
      }
      setTemplateId(resolvedTemplate);
      setOccasion(resolvedOccasion);
      if (resolvedTemplate !== storedTemplate || resolvedOccasion !== storedOccasion) setDirty(true);
      if (j.slug) setPublicUrl(`${window.location.origin}/site/${j.slug}`);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, [id]);

  const update = (patch: Partial<BirthdayContent>) => { setC(prev => ({ ...prev, ...patch })); setDirty(true); };
  const updateArray = (key: keyof BirthdayContent, value: unknown) => update({ [key]: value } as Partial<BirthdayContent>);
  const toggleEffect = (key: keyof BirthdayContent, checked: boolean) => update({ [key]: checked } as Partial<BirthdayContent>);

  const handleCanvasSelect = useCallback((selection: CanvasSelection) => {
    if (!editorMode) return;
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
      if ((templateId === 'master' || templateId === 'master-birthday') && raw.key.startsWith('mb.')) {
        const current = mergeMasterBirthdayConfig((c.templateConfig as any)?.masterBirthday);
        const next: any = JSON.parse(JSON.stringify(current));
        const path = raw.key.slice(3).split('.');
        let cursor = next;
        for (let i=0;i<path.length-1;i++) cursor = cursor[path[i]] ?? (cursor[path[i]] = {});
        const leaf = path[path.length-1];
        if (Array.isArray(cursor) && typeof index === 'number') {
          const i = index;
          if (i >= 0 && i < cursor.length) {
            if (typeof cursor[i] === 'object' && cursor[i] !== null) {
              if (typeof raw.value === 'string') { if ('text' in cursor[i]) cursor[i].text = value; else if ('title' in cursor[i]) cursor[i].title = value; else if ('caption' in cursor[i]) cursor[i].caption = value; }
            } else cursor[i] = value;
          }
        } else {
          cursor[leaf] = value;
        }
        update({ templateConfig: { ...(c.templateConfig || {}), masterBirthday: next } });
        setSelectedElement({ key: raw.key, label, index, value });
        return;
      }
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
    let next: BirthdayContent & { templateConfig?: Record<string, unknown> } = { ...c, occasion, templateId };
    if (templateId === 'master' || templateId === 'master-birthday') {
      const mb = mergeMasterBirthdayConfig((c.templateConfig as any)?.masterBirthday);
      next = {
        ...next,
        name: mb.recipientName || next.name,
        birthday: `${mb.birthdayDate}T${mb.birthdayTime}`,
        seoTitle: mb.ogTitle || next.seoTitle,
        seoDescription: mb.ogDescription || next.seoDescription,
        shareImage: mb.ogImage || next.shareImage,
        templateConfig: { ...(c.templateConfig || {}), masterBirthday: mb },
      };
    }
    const r = await fetch('/api/websites/' + id, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ content: next, templateId, status: publish ? 'published' : 'draft', title: next.name || c.name, seo: { title: next.seoTitle, description: next.seoDescription, shareImage: next.shareImage }, ...((templateId === 'master' || templateId === 'master-birthday') && String((next.templateConfig as any)?.masterBirthday?.customSlug || '').trim() ? { slug: String((next.templateConfig as any).masterBirthday.customSlug).trim() } : {}) }) });
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
  const masterBirthdayConfig = useMemo(() => mergeMasterBirthdayConfig((c.templateConfig as any)?.masterBirthday), [c.templateConfig]);
  const updateMasterBirthday = useCallback((next: typeof masterBirthdayDefaults) => update({ templateConfig: { ...(c.templateConfig || {}), masterBirthday: next } }), [c.templateConfig]);
  const templateInspection = useMemo(() => getTemplateInspection(templateId), [templateId]);
  const editableMediaKeys = useMemo(() => new Set(
    templateInspection.media.filter(slot => slot.sourceType === 'file-or-url').map(slot => slot.key)
  ), [templateInspection]);
  // Media visibility is template-aware: each template only exposes the media
  // slots its source actually contains.
  const hasGalleryMedia = editableMediaKeys.has('gallery') || editableMediaKeys.has('museum');
  const hasVideoMedia = editableMediaKeys.has('videos') || editableMediaKeys.has('videoUrl') || editableMediaKeys.has('museum');
  const hasMusicMedia = editableMediaKeys.has('soundtrack') || editableMediaKeys.has('musicUrl') || editableMediaKeys.has('bgMusicUrl') || editableMediaKeys.has('countdownAudioUrl') || editableMediaKeys.has('wishingAudioUrl');
  const visibleTabs = TABS.filter(([value]) => {
    if (value === 'gallery') return hasGalleryMedia;
    if (value === 'video') return hasVideoMedia;
    if (value === 'music') return hasMusicMedia;
    if (templateId === 'wedding-proposal') return ['overview', 'opening', 'music'].includes(value as string);
    if (templateId === 'miss-you-1') return ['overview', 'story', 'music'].includes(value as string);
    if (templateId === 'master-proposal') return ['overview', 'opening', 'story', 'gallery', 'music', 'letter'].includes(value as string);
    if (templateId === 'master' || templateId === 'master-birthday') return ['overview','opening','story','gallery','video','music','letter','theme','effects','social','advanced'].includes(value as string);
    return value !== 'social' || templateId === 'master';
  });
  const activeTab = visibleTabs.find(x => x[0] === tab) || visibleTabs[0];
  const visibleGroups = EDIT_GROUPS.map(([id, icon, label, tabs]) => ({ id, icon, label, tabs: tabs.filter(t => visibleTabs.some(v => v[0] === t)) })).filter(g => g.tabs.length);
  const activeGroup = visibleGroups.find(g => g.id === editGroup) || visibleGroups[0];
  const groupTabs = activeGroup?.tabs.map(t => visibleTabs.find(v => v[0] === t)).filter(Boolean) as typeof visibleTabs[number][] | undefined;
  useEffect(() => {
    if (!visibleTabs.some(([value]) => value === tab)) setTab('overview');
    setSelectedElement(null);
    setEditorMode(false);
  }, [templateId]);
  useEffect(() => {
    const group = EDIT_GROUPS.find(([, , , tabs]) => tabs.includes(tab as TabId));
    if (group) setEditGroup(group[0]);
  }, [tab]);
  useEffect(() => {
    if (!editorMode) {
      setSelectedElement(null);
      setCanvasHistory({ canBack: false, canForward: false });
    }
  }, [editorMode]);

  const previewContent = useMemo<BirthdayContent | null>(() => !loaded ? null : ((templateId === 'master' || templateId === 'master-birthday') ? ({ ...c, occasion, templateId, name: masterBirthdayConfig.recipientName, birthday: `${masterBirthdayConfig.birthdayDate}T${masterBirthdayConfig.birthdayTime}`, templateConfig: { ...(c.templateConfig || {}), masterBirthday: masterBirthdayConfig } }) : ({ ...c, occasion, templateId })), [c, occasion, templateId, masterBirthdayConfig, loaded]);
  const resetToMasterDefaults = () => {
    const keepName = c.name;
    const mb = mergeMasterBirthdayConfig(undefined);
    setC({ ...defaultContent, name: keepName || mb.recipientName, birthday: `${mb.birthdayDate}T${mb.birthdayTime}`, templateId: 'master', occasion: 'birthday', templateConfig: { ...(c.templateConfig || {}), masterBirthday: mb } });
    setTemplateId('master'); setOccasion('birthday'); setDirty(true); setMsg('Master template defaults restored.');
  };

  return <main className="builder-shell">
    <header className="builder-topbar">
      <div className="builder-brand">
        <div className="builder-logo">W</div>
        <div><strong>Wishly</strong><span>Website editor</span></div>
      </div>
      <div className="builder-top-actions">
        <div className={`builder-status ${dirty ? 'is-dirty' : ''}`}><i />{dirty ? 'Unsaved changes' : status === 'published' ? 'Published' : 'All changes saved'}</div>
        <button className="builder-ghost" onClick={() => router.push('/dashboard')}>Exit</button>
        <button className="builder-save" onClick={() => save(false)}>Save draft</button>
        <button className="builder-publish" onClick={() => save(true)}>Create Live Link ↗</button>
      </div>
    </header>

    <div className="builder-layout builder-canvas-only">
      <section className="builder-preview-panel">
          <div className="builder-preview-head">
            <div className="builder-preview-title">
              <div><span>LIVE PREVIEW</span><strong>{c.name || 'Untitled celebration'}</strong></div>
            </div>
            <div className="builder-preview-actions">
              {(['desktop','tablet','mobile'] as const).map(d => <button key={d} className={`builder-device ${device===d?'active':''}`} onClick={()=>{setDevice(d)}}>{d[0].toUpperCase()+d.slice(1)}</button>)}
              {editorMode && <><button type="button" className="builder-device" onClick={() => handleCanvasHistory('back')} disabled={!canvasHistory.canBack} title="Previous screen">← Previous</button><button type="button" className="builder-device" onClick={() => handleCanvasHistory('forward')} disabled={!canvasHistory.canForward} title="Next screen">Next →</button></>}
              <button
                type="button"
                className={`builder-device builder-canvas-edit-toggle ${editorMode ? 'active' : ''}`}
                aria-pressed={editorMode}
                onClick={() => setEditorMode(v => !v)}
              >
                {editorMode ? '✎ Canvas editing' : '✎ Enable canvas editing'}
              </button>
            </div>
          </div>
          <div className="builder-canvas-hint">Click any editable text, photo, video, button, reason, memory, letter or audio control inside the template to change it. Use Previous / Next to move between screens while editing.</div>
          {status === 'published' && publicUrl && <div className="builder-live-link"><div><span>YOUR LIVE LINK</span><strong>{publicUrl}</strong></div><div className="builder-live-link-actions"><button onClick={() => navigator.clipboard?.writeText(publicUrl)}>Copy link</button><a href={publicUrl} target="_blank" rel="noreferrer">Open ↗</a></div></div>}
          <div className="builder-preview-frame"><div className="builder-browser"><i /><i /><i /><span>/site/{slug || 'your-slug'}</span></div><div className={`builder-preview-canvas device-${device}`}><div className="builder-canvas-stage">{!loaded || !previewContent ? <div className="builder-template-empty"><div>…</div><h3>Loading website</h3><p>Preparing the selected template…</p></div> : templateId === 'master-birthday' ? <MasterBirthdayTemplate content={previewContent} editorMode={editorMode} onElementSelect={handleCanvasSelect} onHistoryState={handleCanvasHistoryState} /> : templateId === 'master' ? <MasterTemplate content={previewContent} editorMode={editorMode} onElementSelect={handleCanvasSelect} onHistoryState={handleCanvasHistoryState} /> : templateId ? <ExperienceTemplate variant={templateId} content={previewContent} editorMode={editorMode} onElementSelect={handleCanvasSelect} onHistoryState={handleCanvasHistoryState} /> : <div className="builder-template-empty"><div>✦</div><h3>No {currentOccasion[2]} template yet</h3><p>This occasion is ready for a template. Once you add one to the catalog, it will appear here automatically.</p></div>}</div></div></div>
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
    </div>
    {msg && <div className="builder-toast">{msg}</div>}
  </main>;
}
