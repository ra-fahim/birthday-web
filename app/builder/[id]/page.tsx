'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { defaultContent, BirthdayContent, weddingProposalDefaults } from '@/lib/types';
import { valentineDefaults } from '@/lib/valentine';
import MasterBirthdayTemplate from '@/components/template/MasterBirthdayTemplate';
import MasterBirthdayEditor from './MasterBirthdayEditor';
import { masterBirthdayDefaults, mergeMasterBirthdayConfig } from '@/lib/master-birthday';
import ExperienceTemplate, { getMissYouDefaults } from '@/components/template/ExperienceTemplates';
import { SingleMediaUpload, GalleryUpload, InlineMediaField } from './MediaUploader';
import FeatureControls from './FeatureControls';
import UniversalElementEditor from './UniversalElementEditor';
import BuilderGuide, { readGuideSeen } from './BuilderGuide';
import { TimelineEditor, MemoriesEditor, WishlistEditor, GuestbookToggle } from './ContentListEditors';
import { templateCatalog } from '@/lib/templates';
import { getTemplateInspection } from '@/lib/template-inspector';
import { enableCanvasScroll } from '@/lib/editor-canvas-scroll';

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
  const [templateId, setTemplateId] = useState('');
  const [occasion, setOccasion] = useState('birthday');
  const [dirty, setDirty] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const editorMode = !previewMode;
  const [editGroup, setEditGroup] = useState<EditGroupId>('content');
  const [device, setDevice] = useState<'desktop'|'tablet'|'mobile'>('desktop');
  const [viewport, setViewport] = useState<'desktop'|'tablet'|'mobile'>('desktop');
  const [selectedElement, setSelectedElement] = useState<CanvasSelection | null>(null);
  const [publicUrl, setPublicUrl] = useState('');
  const [canvasHistory, setCanvasHistory] = useState({ canBack: false, canForward: false });
  const [loaded, setLoaded] = useState(false);
  const [syncState, setSyncState] = useState<'synced'|'updating'|'saving'|'saved'>('synced');
  const [historyVersion, setHistoryVersion] = useState(0);
  const historyRef = useRef<{ past: BirthdayContent[]; future: BirthdayContent[] }>({ past: [], future: [] });
  const latestContentRef = useRef<BirthdayContent>(defaultContent);
  const historyReadyRef = useRef(false);
  const saveDraftRef = useRef<((publish?: boolean, silent?: boolean) => Promise<void>) | null>(null);
  const shellRef = useRef<HTMLElement | null>(null);
  const savingRef = useRef(false);
  const queuedSaveRef = useRef<{ publish: boolean } | null>(null);
  const editVersionRef = useRef(0);
  const dirtyRef = useRef(false);
  const statusRef = useRef('draft');
  const templateIdRef = useRef('');
  const occasionRef = useRef('birthday');
  statusRef.current = status;
  templateIdRef.current = templateId;
  occasionRef.current = occasion;
  dirtyRef.current = dirty;

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const bar = shell?.querySelector<HTMLElement>('.builder-topbar');
    if (!shell || !bar) return;
    const apply = () => shell.style.setProperty('--bb-top', `${bar.offsetHeight}px`);
    apply();
    if (typeof ResizeObserver === 'undefined') { window.addEventListener('resize', apply); return () => window.removeEventListener('resize', apply); }
    const ro = new ResizeObserver(apply);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const detect = () => {
      const w = window.innerWidth;
      const next: 'desktop'|'tablet'|'mobile' = w <= 640 ? 'mobile' : w <= 1024 ? 'tablet' : 'desktop';
      setViewport(prev => {
        if (prev !== next) setDevice(next);
        return next;
      });
    };
    const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(detect); };
    detect();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); window.removeEventListener('orientationchange', onResize); };
  }, []);

  useEffect(() => {
    fetch('/api/websites/' + id, { cache: 'no-store' }).then(r => r.json()).then(j => {
      if (j.content) {
        const nextContent = { ...defaultContent, ...j.content };
        if (typeof j.templateId === 'string' && (j.templateId === 'master' || j.templateId === 'master-birthday')) {
          const mb = mergeMasterBirthdayConfig((j.content.templateConfig as any)?.masterBirthday);
          nextContent.name = mb.recipientName;
          nextContent.birthday = `${mb.birthdayDate}T${mb.birthdayTime}`;
          nextContent.templateConfig = { ...(j.content.templateConfig || {}), masterBirthday: mb };
        }
        setC(nextContent);
        latestContentRef.current = nextContent;
        historyRef.current = { past: [], future: [] };
        historyReadyRef.current = true;
        setHistoryVersion(v => v + 1);
      }
      if (j.slug) setSlug(j.slug);
      if (j.status) setStatus(j.status);
      const queryTemplate = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('template') : null;
      const requestedTemplate = queryTemplate && templateCatalog.some((t) => t.slug === queryTemplate) ? queryTemplate : '';
      const storedOccasion = typeof j.content?.occasion === 'string' ? j.content.occasion : 'birthday';
      const storedTemplate = typeof j.templateId === 'string' ? j.templateId : '';
      const effectiveRequestedTemplate = requestedTemplate || storedTemplate;
      const storedTemplateEntry = templateCatalog.find((t) => t.slug === effectiveRequestedTemplate);
      let resolvedTemplate: string;
      let resolvedOccasion: string;
      if (storedTemplateEntry) {
        resolvedTemplate = storedTemplateEntry.slug;
        resolvedOccasion = storedTemplateEntry.category;
      } else {
        const occasionTemplates = templatesForOccasion(storedOccasion);
        resolvedTemplate = effectiveRequestedTemplate || occasionTemplates[0]?.slug || '';
        resolvedOccasion = resolvedTemplate ? (templateCatalog.find((t) => t.slug === resolvedTemplate)?.category || storedOccasion) : storedOccasion;
      }
      setTemplateId(resolvedTemplate);
      setOccasion(resolvedOccasion);
      if (requestedTemplate && requestedTemplate !== storedTemplate) setDirty(true);
      if (resolvedTemplate !== storedTemplate || resolvedOccasion !== storedOccasion) setDirty(true);
      if (j.slug) setPublicUrl(`${window.location.origin}/site/${j.slug}`);
      setLoaded(true);
      setSyncState('synced');
    }).catch(() => { setLoaded(true); setSyncState('updating'); });
  }, [id]);

  const update = (patch: Partial<BirthdayContent>) => {
    const current = latestContentRef.current;
    const next = { ...current, ...patch };
    latestContentRef.current = next;
    editVersionRef.current += 1;
    if (historyReadyRef.current) {
      const snapshot = JSON.parse(JSON.stringify(current)) as BirthdayContent;
      const past = historyRef.current.past.concat(snapshot).slice(-50);
      historyRef.current = { past, future: [] };
      setHistoryVersion(v => v + 1);
    }
    setC(next);
    setDirty(true);
    setSyncState('updating');
  };

  const undoEdit = () => {
    const { past, future } = historyRef.current;
    if (!past.length) return;
    const current = JSON.parse(JSON.stringify(latestContentRef.current)) as BirthdayContent;
    const previous = past[past.length - 1];
    historyRef.current = { past: past.slice(0, -1), future: [current, ...future].slice(0, 50) };
    latestContentRef.current = JSON.parse(JSON.stringify(previous));
    editVersionRef.current += 1;
    setC(JSON.parse(JSON.stringify(previous)));
    setSelectedElement(null);
    setDirty(true);
    setSyncState('updating');
    setHistoryVersion(v => v + 1);
  };

  const redoEdit = () => {
    const { past, future } = historyRef.current;
    if (!future.length) return;
    const current = JSON.parse(JSON.stringify(latestContentRef.current)) as BirthdayContent;
    const next = future[0];
    historyRef.current = { past: [...past, current].slice(-50), future: future.slice(1) };
    latestContentRef.current = JSON.parse(JSON.stringify(next));
    editVersionRef.current += 1;
    setC(JSON.parse(JSON.stringify(next)));
    setSelectedElement(null);
    setDirty(true);
    setSyncState('updating');
    setHistoryVersion(v => v + 1);
  };

  const buildTemplateDefaults = useCallback((targetTemplate: string, targetOccasion: string): BirthdayContent => {
    const base = { ...defaultContent, templateId: targetTemplate, occasion: targetOccasion };
    if (targetTemplate === 'master' || targetTemplate === 'master-birthday') {
      const mb = mergeMasterBirthdayConfig(undefined);
      return {
        ...base, templateId: 'master', occasion: 'birthday', name: mb.recipientName,
        birthday: `${mb.birthdayDate}T${mb.birthdayTime}`, greeting: mb.greeting.text,
        buttonText: mb.greeting.enterButton, countdownTitle: mb.countdown.title, countdownMessage: mb.countdown.message,
        reasons: mb.reasons.items.map(item => item.text),
        gallery: mb.memories.items.map(item => ({ url: item.url, caption: item.caption })),
        videoUrl: mb.videos.items[0]?.source || '', videoCaption: mb.videos.items[0]?.caption || '',
        letter: mb.letter.paragraphs.slice(), secret: mb.secret.image,
        social: { ...base.social, instagram: mb.secret.socialUrl },
        templateConfig: { masterBirthday: mb },
      };
    }
    if (targetTemplate === 'wedding-proposal') return { ...base, ...weddingProposalDefaults() } as BirthdayContent;
    if (targetTemplate === 'valentine-2026') return { ...base, templateConfig: { valentine: valentineDefaults() } };
    if (targetTemplate === 'miss-you-1') return { ...base, templateConfig: { ...getMissYouDefaults() } };
    return base;
  }, []);

  const resetEdits = () => {
    const next = buildTemplateDefaults(templateId || 'master', occasion);
    historyRef.current = { past: [JSON.parse(JSON.stringify(latestContentRef.current))], future: [] };
    latestContentRef.current = JSON.parse(JSON.stringify(next));
    editVersionRef.current += 1;
    setC(next);
    setSelectedElement(null);
    setDirty(true);
    setSyncState('updating');
    setMsg('Template defaults restored.');
    setHistoryVersion(v => v + 1);
  };
  const updateArray = (key: keyof BirthdayContent, value: unknown) => update({ [key]: value } as Partial<BirthdayContent>);
  const toggleEffect = (key: keyof BirthdayContent, checked: boolean) => update({ [key]: checked } as Partial<BirthdayContent>);

  const handleCanvasSelect = useCallback((selection: CanvasSelection) => {
    if (!editorMode) return;
    setSelectedElement(selection);
  }, [editorMode]);

  const handleCanvasHistory = useCallback((direction: 'back' | 'forward') => {
    const delta = direction === 'back' ? -1 : 1;
    const experienceRoot = document.querySelector<HTMLElement>('.builder-canvas-stage [data-bb-experience-root]') as (HTMLElement & { __bbEditorNavigate?: (delta: number) => void }) | null;
    if (experienceRoot?.__bbEditorNavigate) {
      experienceRoot.__bbEditorNavigate(delta);
      return;
    }
    const iframe = document.querySelector<HTMLIFrameElement>('.builder-canvas-stage iframe');
    const target = iframe?.contentWindow as (Window & { BB_EDITOR_NAVIGATE?: (delta: number) => void }) | null;
    if (!target) return;
    try {
      if (typeof target.BB_EDITOR_NAVIGATE === 'function') {
        target.BB_EDITOR_NAVIGATE(delta);
        return;
      }
    } catch {}
    target.postMessage({ type: 'BB_CANVAS_HISTORY', direction }, '*');
  }, []);
  const handleCanvasHistoryState = useCallback((state: { canBack?: boolean; canForward?: boolean }) => {
    setCanvasHistory({ canBack: !!state.canBack, canForward: !!state.canForward });
  }, []);

  useEffect(() => {
    if (loaded && templateId && !readGuideSeen()) setGuideOpen(true);
  }, [loaded, templateId]);

  useEffect(() => {
    if (loaded) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [loaded]);

  useEffect(() => {
    if (!selectedElement || !editorMode) return;
    const run = () => {
      const panel = document.querySelector<HTMLElement>('.builder-context-editor');
      if (!panel) return false;
      const topbar = (shellRef.current?.querySelector<HTMLElement>('.builder-topbar')?.offsetHeight || 64) + 12;
      panel.style.scrollMarginTop = `${topbar}px`;
      panel.style.scrollMarginBottom = '16px';
      const rect = panel.getBoundingClientRect();
      const avail = window.innerHeight - topbar - 16;
      if (viewport === 'desktop') {
        const fullyVisible = rect.top >= topbar && rect.bottom <= window.innerHeight - 16;
        if (fullyVisible) return true;
        panel.scrollIntoView({ behavior: 'smooth', block: rect.height <= avail ? 'center' : 'start', inline: 'nearest' });
        return false;
      }
      const want = Math.max(topbar + 8, window.innerHeight - 300);
      if (rect.top > want || rect.top < topbar - 4) {
        window.scrollTo({ top: Math.max(0, window.scrollY + rect.top - want), behavior: 'smooth' });
        return false;
      }
      return true;
    };
    // First pass right after the box mounts, second pass once its content has finished rendering.
    const t1 = window.setTimeout(run, 60);
    const t2 = window.setTimeout(run, 320);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
  }, [selectedElement, editorMode, viewport]);

  const closeSelectedElement = useCallback(() => {
    setSelectedElement(null);
    if (viewport === 'desktop') return;
    window.setTimeout(() => {
      const frame = document.querySelector<HTMLElement>('.builder-preview-frame');
      if (!frame) return;
      const top = (shellRef.current?.querySelector<HTMLElement>('.builder-topbar')?.offsetHeight || 64) + 8;
      window.scrollTo({ top: Math.max(0, window.scrollY + frame.getBoundingClientRect().top - top), behavior: 'smooth' });
    }, 40);
  }, [viewport]);

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
        if (raw.key === 'mb.cake.group') {
          setSelectedElement({ key: raw.key, label, index, value });
          return;
        }
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

  function buildPayload(source: BirthdayContent & { templateConfig?: Record<string, unknown> }, publish: boolean) {
    const templateId = templateIdRef.current;
    const occasion = occasionRef.current;
    let next: BirthdayContent & { templateConfig?: Record<string, unknown> } = { ...source, occasion, templateId };
    const isMaster = templateId === 'master' || templateId === 'master-birthday';
    if (isMaster) {
      const mb = mergeMasterBirthdayConfig((source.templateConfig as any)?.masterBirthday);
      next = {
        ...next,
        name: mb.recipientName || next.name,
        birthday: `${mb.birthdayDate}T${mb.birthdayTime}`,
        seoTitle: mb.ogTitle || next.seoTitle,
        seoDescription: mb.ogDescription || next.seoDescription,
        shareImage: mb.ogImage || next.shareImage,
        templateConfig: { ...(source.templateConfig || {}), masterBirthday: mb },
      };
    }
    const targetStatus = publish || statusRef.current === 'published' ? 'published' : 'draft';
    const customSlug = isMaster ? String((next.templateConfig as any)?.masterBirthday?.customSlug || '').trim() : '';
    return {
      targetStatus,
      body: JSON.stringify({
        content: next, templateId, status: targetStatus, title: next.name || source.name,
        seo: { title: next.seoTitle, description: next.seoDescription, shareImage: next.shareImage },
        ...(customSlug ? { slug: customSlug } : {}),
      }),
    };
  }

  async function save(publish = false, silent = false) {
    if (!templateId) { if (!silent) setMsg(`Add a ${currentOccasion[2]} template before publishing.`); return; }
    if (savingRef.current) {
      queuedSaveRef.current = { publish: publish || !!queuedSaveRef.current?.publish };
      if (!silent) setMsg(publish ? 'Publishing…' : 'Saving…');
      return;
    }
    savingRef.current = true;
    const startedVersion = editVersionRef.current;
    if (!silent) setMsg(publish ? 'Publishing…' : 'Saving…');
    else setSyncState('saving');
    const { targetStatus, body } = buildPayload(latestContentRef.current, publish);
    let ok = false;
    try {
      const r = await fetch('/api/websites/' + id, { method: 'PUT', headers: { 'content-type': 'application/json' }, body });
      const j = await r.json().catch(() => ({}));
      ok = r.ok;
      if (!silent) setMsg(r.ok ? (targetStatus === 'published' ? (publish ? 'Published successfully ✨' : 'Changes saved ✓') : 'Draft saved ✓') : (j.error || 'Something went wrong'));
      if (r.ok) {
        statusRef.current = targetStatus;
        setStatus(targetStatus);
        const stillClean = editVersionRef.current === startedVersion;
        if (stillClean) setDirty(false);
        setSyncState(stillClean ? (silent ? 'saved' : 'synced') : 'updating');
        if (j.slug) setPublicUrl(`${window.location.origin}/site/${j.slug}`);
        if (publish) { setMsg('Live link ready ✨'); router.refresh(); }
      } else if (silent) {
        setSyncState('updating');
      }
    } catch {
      if (silent) setSyncState('updating'); else setMsg('Something went wrong. Check your internet and try again.');
    } finally {
      savingRef.current = false;
      const queued = queuedSaveRef.current;
      queuedSaveRef.current = null;
      if (queued || (ok && editVersionRef.current !== startedVersion)) void saveDraftRef.current?.(!!queued?.publish, true);
    }
  }

  saveDraftRef.current = save;

  useEffect(() => {
    if (!loaded || !dirty || previewMode || !templateId) return;
    const timer = window.setTimeout(() => { void saveDraftRef.current?.(false, true); }, 850);
    return () => window.clearTimeout(timer);
  }, [loaded, dirty, c, occasion, templateId, previewMode]);

  useEffect(() => {
    const flush = () => {
      if (!dirtyRef.current || !templateIdRef.current || !historyReadyRef.current) return;
      const { body } = buildPayload(latestContentRef.current, false);
      try { void fetch('/api/websites/' + id, { method: 'PUT', headers: { 'content-type': 'application/json' }, body, keepalive: body.length < 60000 }); } catch {}
    };
    const onVisibility = () => { if (document.visibilityState === 'hidden') flush(); };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flush);
    return () => { document.removeEventListener('visibilitychange', onVisibility); window.removeEventListener('pagehide', flush); };
  }, [id]);

  const goToPublish = async () => {
    if (!templateIdRef.current) { setMsg(`Add a ${currentOccasion[2]} template before publishing.`); return; }
    await saveDraftRef.current?.(false, true);
    for (let i = 0; i < 40 && (savingRef.current || queuedSaveRef.current); i++) await new Promise(res => setTimeout(res, 100));
    router.push('/builder/' + id + '/publish');
  };

  const exitBuilder = async () => {
    if (dirtyRef.current && templateIdRef.current) await saveDraftRef.current?.(false, true);
    router.push('/dashboard');
  };

  const currentOccasion = OCCASIONS.find(x => x[0] === occasion) || OCCASIONS[0];
  const occasionTemplates = useMemo(() => templatesForOccasion(occasion), [occasion]);
  const missYouConfig = useMemo(() => ({ ...getMissYouDefaults(), ...(c.templateConfig || {}) }), [c.templateConfig]);
  const updateMissYou = (patch: Record<string, unknown>) => update({ templateConfig: { ...missYouConfig, ...patch } });
  const masterBirthdayConfig = useMemo(() => mergeMasterBirthdayConfig((c.templateConfig as any)?.masterBirthday), [c.templateConfig]);
  const updateMasterBirthday = useCallback((next: typeof masterBirthdayDefaults) => update({ templateConfig: { ...(c.templateConfig || {}), masterBirthday: next } }), [c.templateConfig]);
  const templateInspection = useMemo(() => getTemplateInspection(templateId), [templateId]);
  const templateDisplayName = useMemo(() => templateCatalog.find(t => t.slug === templateId)?.name || templateInspection.slug || 'Template', [templateId, templateInspection.slug]);
  const editableMediaKeys = useMemo(() => new Set(
    templateInspection.media.filter(slot => slot.sourceType === 'file-or-url').map(slot => slot.key)
  ), [templateInspection]);
  const hasGalleryMedia = editableMediaKeys.has('gallery') || editableMediaKeys.has('museum');
  const hasVideoMedia = editableMediaKeys.has('videos') || editableMediaKeys.has('videoUrl') || editableMediaKeys.has('museum');
  const hasMusicMedia = editableMediaKeys.has('soundtrack') || editableMediaKeys.has('musicUrl') || editableMediaKeys.has('bgMusicUrl') || editableMediaKeys.has('countdownAudioUrl') || editableMediaKeys.has('wishingAudioUrl');
  const visibleTabs = TABS.filter(([value]) => {
    if (value === 'gallery') return hasGalleryMedia;
    if (value === 'video') return hasVideoMedia;
    if (value === 'music') return hasMusicMedia;
    if (templateId === 'wedding-proposal') return ['overview', 'opening', 'music'].includes(value as string);
    if (templateId === 'miss-you-1') return ['overview', 'story', 'music'].includes(value as string);
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
    setPreviewMode(false);
  }, [templateId]);
  useEffect(() => {
    const group = EDIT_GROUPS.find(([, , , tabs]) => tabs.includes(tab as TabId));
    if (group) setEditGroup(group[0]);
  }, [tab]);
  useEffect(() => {
    if (!loaded || !templateId || !editorMode) return;
    return enableCanvasScroll(shellRef.current || document);
  }, [loaded, templateId, editorMode]);
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

  return <main ref={shellRef} className="builder-shell" data-viewport={viewport} data-device={device} data-selected={selectedElement && editorMode ? '1' : '0'} data-preview={previewMode ? '1' : '0'}>
    <header className="builder-topbar">
      <div className="builder-brand">
        <div className="builder-logo">W</div>
        <div><strong>Wishes</strong><span>Website editor</span></div>
      </div>
      <div className="builder-top-actions">
        <div className={`builder-status ${dirty ? 'is-dirty' : ''}`}><i />{dirty ? 'Unsaved changes' : status === 'published' ? 'Published' : 'All changes saved'}</div>
        <div className={`builder-live-sync builder-live-sync-${syncState}`} aria-live="polite">{syncState === 'updating' ? '● Preview updating' : syncState === 'saving' ? '● Auto-saving' : syncState === 'saved' ? '✓ Saved automatically' : '✓ Preview synced'}</div>
        <div className="builder-top-view-switch" aria-label="Preview device controls">
          {viewport === 'desktop'
            ? (['desktop','tablet','mobile'] as const).map(d => <button key={d} type="button" className={`builder-device ${device===d?'active':''}`} onClick={()=>setDevice(d)}>{d[0].toUpperCase()+d.slice(1)}</button>)
            : <span className="builder-device-badge" title="The preview automatically matches the screen you are using">{viewport === 'mobile' ? '📱 Mobile view' : '📲 Tablet view'}</span>}
          <button type="button" className={`builder-device builder-preview-toggle ${previewMode ? 'active' : ''}`} aria-pressed={previewMode} onClick={() => setPreviewMode(v => !v)} title={previewMode ? 'Return to template editing' : 'Preview the website as a visitor'}>{previewMode ? '✎ Preview off' : '▶ Preview'}</button>
          <button type="button" className="builder-device bb-guide-open" onClick={() => setGuideOpen(true)} title="How to edit your website" aria-label="Open editing guide">? Guide</button>
        </div>
        <button className="builder-ghost bb-act-undo" type="button" onClick={undoEdit} disabled={!historyRef.current.past.length} title="Undo last change" aria-label="Undo"><span aria-hidden>↶</span><span className="bb-btn-label"> Undo</span></button>
        <button className="builder-ghost bb-act-redo" type="button" onClick={redoEdit} disabled={!historyRef.current.future.length} title="Redo last undone change" aria-label="Redo"><span aria-hidden>↷</span><span className="bb-btn-label"> Redo</span></button>
        <button className="builder-ghost bb-act-reset" type="button" onClick={resetEdits} title="Restore this template default content">Reset</button>
        <button className="builder-ghost bb-act-exit" onClick={() => { void exitBuilder(); }}>Exit</button>
        <button className="builder-save bb-act-save" onClick={() => save(false)}>{status === 'published' ? 'Save changes' : 'Save draft'}</button>
        <button className="builder-publish bb-act-publish" onClick={() => { void goToPublish(); }}>Create Live Link ↗</button>
      </div>
    </header>

    <div className="builder-layout builder-canvas-only" data-history-version={historyVersion}>
      <section className="builder-preview-panel">
          <div className="builder-preview-head">
            <div className="builder-preview-title">
              <div><span>LIVE PREVIEW</span><strong>{previewMode ? 'Preview Mode' : templateDisplayName}</strong><em>{previewMode ? 'See your website without waiting for the full countdown.' : 'Live canvas • Auto-sync enabled'}</em>{previewMode && <small className="builder-preview-note">Preview Rule: You can preview the final 10 seconds without waiting for a long countdown. If the birthday time has already passed but the 24-hour birthday window is still active, Preview starts directly from the Greeting Screen.</small>}</div>
            </div>
            <div className="builder-preview-badge">{previewMode ? 'Visitor mode' : 'Edit mode'}</div>
          </div>
          {editorMode && <div className="bb-edit-hint" role="note"><span className="bb-edit-hint-icon" aria-hidden>✎</span><p><b>Click</b> <small>(on phone: <b>tap</b>)</small> any <u>highlighted</u> text, photo or button on the preview to edit it.</p></div>}
          {status === 'published' && publicUrl && <div className="builder-live-link"><div><span>YOUR LIVE LINK</span><strong>{publicUrl}</strong></div><div className="builder-live-link-actions"><button onClick={() => navigator.clipboard?.writeText(publicUrl)}>Copy link</button><a href={publicUrl} target="_blank" rel="noreferrer">Open ↗</a></div></div>}
          <div className="builder-preview-frame"><div className="builder-browser"><i /><i /><i /><span>/site/{slug || 'your-slug'}</span></div><div className={`builder-preview-canvas device-${device}${(templateId === 'master' || templateId === 'master-birthday') ? ' is-master-canvas' : ''}`}><div className="builder-canvas-nav-overlay" aria-label="Canvas screen navigation">{editorMode && <><button type="button" className="builder-canvas-nav builder-canvas-nav-prev" onClick={() => handleCanvasHistory('back')} disabled={!canvasHistory.canBack} title="Previous screen" aria-label="Previous screen">←</button><button type="button" className="builder-canvas-nav builder-canvas-nav-next" onClick={() => handleCanvasHistory('forward')} disabled={!canvasHistory.canForward} title="Next screen" aria-label="Next screen">→</button></>}</div><div className="builder-canvas-stage">{!loaded || !previewContent ? <div className="builder-template-empty"><div>…</div><h3>Loading website</h3><p>Preparing the selected template…</p></div> : (templateId === 'master' || templateId === 'master-birthday') ? <MasterBirthdayTemplate key={`${templateId}-${previewMode ? 'preview' : 'edit'}`} content={previewContent} demo={false} preview={previewMode} editorMode={editorMode} websiteSlug={slug} siteKey={id} onElementSelect={handleCanvasSelect} onHistoryState={handleCanvasHistoryState} /> : templateId ? <ExperienceTemplate variant={templateId} content={previewContent} editorMode={editorMode} onElementSelect={handleCanvasSelect} onHistoryState={handleCanvasHistoryState} /> : <div className="builder-template-empty"><div>✦</div><h3>No {currentOccasion[2]} template yet</h3><p>This occasion is ready for a template. Once you add one to the catalog, it will appear here automatically.</p></div>}</div></div></div>
          {editorMode && (
            <section className={`builder-context-editor ${selectedElement ? 'has-selection' : 'is-empty'}`} aria-label="Selected element editor" aria-live="polite">
              {selectedElement ? (
                <>
                  <div className="builder-context-editor-head">
                    <div><span>SELECTED ELEMENT</span><strong>{selectedElement.label}</strong></div>
                    <button type="button" onClick={closeSelectedElement} aria-label="Close selected element editor">Done</button>
                  </div>
                  <div className="builder-context-editor-body">
                    <UniversalElementEditor
                      selected={selectedElement}
                      content={c}
                      templateId={templateId}
                      websiteId={id}
                      onChange={update}
                      onTemplateConfigChange={(patch) => update({ templateConfig: { ...(c.templateConfig || {}), ...patch } })}
                      onClose={closeSelectedElement}
                    />
                  </div>
                </>
              ) : (
                <div className="builder-context-empty">
                  <span className="builder-context-empty-icon" aria-hidden>✎</span>
                  <strong>Edit options appear here</strong>
                  <p>Tap any highlighted text, photo or button on the template above — its options will show up in this box.</p>
                </div>
              )}
            </section>
          )}
      </section>
    </div>
    {msg && <div className="builder-toast">{msg}</div>}
    {guideOpen && <BuilderGuide onClose={() => setGuideOpen(false)} />}
  </main>;
}
