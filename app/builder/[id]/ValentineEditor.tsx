'use client';

import React from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Music2, Plus, Trash2 } from 'lucide-react';
import { InlineMediaField, SingleMediaUpload } from './MediaUploader';
import type { BirthdayContent } from '@/lib/types';
import {
  VALENTINE_THEMES,
  getValentinePath,
  mergeValentine,
  setValentinePath,
  valentineDefaults,
  type ValentineConfig,
} from '@/lib/valentine';

type Selection = { key: string; label: string; index?: number; value?: string; kind?: string };

type Props = {
  selected: Selection;
  content: BirthdayContent;
  websiteId: string;
  onChange: (patch: Partial<BirthdayContent>) => void;
  onTemplateConfigChange: (patch: Record<string, unknown>) => void;
};

/** Fields that live next to the clicked one, so nothing in the template is out of reach. */
const RELATED: Record<string, { path: string; label: string; multiline?: boolean }[]> = {
  'val.jar.button': [{ path: 'jar.shakingButton', label: 'Text while the jar shakes' }],
  'val.garden.emptyCount': [{ path: 'garden.count', label: 'Counter after planting ({n} = number of flowers)' }],
  'val.garden.count': [{ path: 'garden.emptyCount', label: 'Counter before planting' }],
  'val.intro.noButton': [{ path: 'intro.noRepeatButton', label: 'Text after the first "No"' }],
};

const SECTION_TOGGLE: Record<string, { path: 'garden.enabled' | 'jar.enabled'; label: string }> = {
  'val.garden.': { path: 'garden.enabled', label: 'Show the Digital Garden to visitors' },
  'val.jar.': { path: 'jar.enabled', label: 'Show the Love Jar to visitors' },
};

export default function ValentineEditor({ selected, content, websiteId, onChange, onTemplateConfigChange }: Props) {
  const cfg = React.useMemo(() => mergeValentine(content), [content]);
  const key = selected.key;
  const path = key.startsWith('val.') ? key.slice(4) : key;

  const commit = (next: ValentineConfig) => onTemplateConfigChange({ valentine: next });
  const setAt = (p: string, value: unknown) => commit(setValentinePath(cfg, p, value));
  const str = (p: string) => String(getValentinePath(cfg, p) ?? '');

  const tip = <p className="builder-note">Tip: type <b>{'{name}'}</b> for the receiver&apos;s name and <b>{'{sender}'}</b> for yours — they are filled in automatically (set them under <b>👤 Names</b>).</p>;

  const text = (p: string, label: string, multiline = false, autoFocus = false) => (
    <Field label={label}>
      {multiline
        ? <textarea rows={4} autoFocus={autoFocus} value={str(p)} onChange={e => setAt(p, e.target.value)} />
        : <input autoFocus={autoFocus} value={str(p)} onChange={e => setAt(p, e.target.value)} />}
    </Field>
  );

  /* ---------- names ---------- */
  if (key === 'val.names') {
    return <>
      <Field label="Receiver's name"><input autoFocus value={cfg.recipientName} placeholder="e.g. Anika" onChange={e => setAt('recipientName', e.target.value)} /></Field>
      <Field label="Your name"><input value={cfg.senderName} placeholder="e.g. Rafi" onChange={e => setAt('senderName', e.target.value)} /></Field>
      <p className="builder-note">Use <b>{'{name}'}</b> and <b>{'{sender}'}</b> inside any text of this website (for example the hero title: <i>To My Dearest {'{name}'}</i> or the signature: <i>Forever yours, {'{sender}'}</i>). If left empty they become &ldquo;my love&rdquo; and &ldquo;me&rdquo;.</p>
    </>;
  }

  /* ---------- theme ---------- */
  if (key === 'val.theme') {
    return <>
      <div className="builder-field"><span>Color theme</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 8 }}>
          {VALENTINE_THEMES.map(t => (
            <button key={t.key} type="button" onClick={() => setAt('theme', t.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', borderRadius: 12, textAlign: 'left', cursor: 'pointer', border: cfg.theme === t.key ? `2px solid ${t.color}` : '1px solid #e2e8f0', background: cfg.theme === t.key ? '#f8fafc' : '#fff', fontWeight: cfg.theme === t.key ? 700 : 500, fontSize: 13 }}>
              <span style={{ width: 18, height: 18, borderRadius: 999, background: t.color, flex: '0 0 auto' }} />{t.name}
            </button>
          ))}
        </div>
      </div>
      <Switch label="Dark mode by default" value={cfg.darkMode} onChange={v => setAt('darkMode', v)} />
      <Switch label="Let visitors change the theme" value={cfg.showControls} onChange={v => setAt('showControls', v)} />
    </>;
  }

  /* ---------- music ---------- */
  if (key === 'val.music') {
    const hasFile = !!cfg.music.url;
    return <>
      <div className="universal-editor-media-head"><div className="universal-editor-icon"><Music2 size={16} /></div><div><b>Background music</b><span>{!cfg.music.enabled ? 'Music is off' : hasFile ? 'Your own song plays after “Yes”' : cfg.music.youtubeId ? 'A YouTube song plays after “Yes”' : 'No song selected'}</span></div></div>
      <Switch label="Play background music" value={cfg.music.enabled} onChange={v => setAt('music.enabled', v)} />
      {cfg.music.enabled && <>
        <SingleMediaUpload kind="audio" url={cfg.music.url} websiteId={websiteId} onChange={url => { setAt('music.url', url); if (!url) onChange({ musicUrl: '' } as Partial<BirthdayContent>); }} />
        {hasFile && <audio controls preload="none" src={cfg.music.url} style={{ width: '100%', marginTop: 6 }} />}
        {hasFile && <button type="button" className="builder-mini-btn" onClick={() => { setAt('music.url', ''); onChange({ musicUrl: '' } as Partial<BirthdayContent>); }}><Trash2 size={14} /> Remove my song</button>}
        <Field label="…or a YouTube link / video ID (used when no file is uploaded)">
          <input value={cfg.music.youtubeId} placeholder="https://www.youtube.com/watch?v=…" onChange={e => setAt('music.youtubeId', e.target.value)} />
        </Field>
        <button type="button" className="builder-mini-btn" onClick={() => setAt('music.youtubeId', valentineDefaults().music.youtubeId)}>Use the default song</button>
      </>}
      <p className="builder-note">Music starts when the receiver taps the &ldquo;Yes&rdquo; button, and loops. A ♫ button lets them mute it.</p>
    </>;
  }

  /* ---------- photos ---------- */
  if (key === 'val.hero.image' || key === 'val.final.image') {
    const url = str(path);
    return <>
      <div className="universal-editor-media-head"><div className="universal-editor-icon"><ImagePlus size={16} /></div><div><b>{selected.label}</b><span>{url ? 'Replace or remove this photo' : 'Optional — shown instead of the heart icon'}</span></div></div>
      <InlineMediaField value={url} placeholder="Photo URL" accept="image/*" folder="gallery" websiteId={websiteId} onChange={v => setAt(path, v)} />
      <Field label="Photo URL"><input type="url" value={url} placeholder="https://…" onChange={e => setAt(path, e.target.value)} /></Field>
      {url && <button type="button" className="universal-danger" onClick={() => setAt(path, '')}><Trash2 size={14} /> Remove photo (use the heart icon)</button>}
    </>;
  }

  /* ---------- story chapters ---------- */
  if (key === 'val.story') {
    return <ListShell title="Story chapters" hint="Each chapter is its own full screen. Add as many as you like." count={cfg.story.length} addLabel="Add chapter"
      onAdd={() => commit({ ...cfg, story: [...cfg.story, { title: 'New chapter', body: 'Write what you want to say…' }] })}>
      {cfg.story.map((s, i) => (
        <ListCard key={i} title={`Chapter ${i + 1}`} index={i} total={cfg.story.length}
          onMove={d => commit({ ...cfg, story: move(cfg.story, i, d) })}
          onRemove={() => commit({ ...cfg, story: cfg.story.filter((_, j) => j !== i) })}>
          <input value={s.title} placeholder="Title" onChange={e => setAt(`story.${i}.title`, e.target.value)} />
          <textarea rows={3} value={s.body} placeholder="Text" onChange={e => setAt(`story.${i}.body`, e.target.value)} />
        </ListCard>
      ))}
    </ListShell>;
  }
  const storyMatch = /^val\.story\.(\d+)\.(title|body)$/.exec(key);
  if (storyMatch) {
    const i = Number(storyMatch[1]);
    if (!cfg.story[i]) return <Empty />;
    return <>
      {text(path, selected.label, storyMatch[2] === 'body', true)}
      {tip}
      <div className="universal-editor-grid">
        <button type="button" className="builder-mini-btn" onClick={() => commit({ ...cfg, story: [...cfg.story.slice(0, i + 1), { title: 'New chapter', body: 'Write what you want to say…' }, ...cfg.story.slice(i + 1)] })}><Plus size={14} /> Add chapter after</button>
        <button type="button" className="universal-danger compact" onClick={() => commit({ ...cfg, story: cfg.story.filter((_, j) => j !== i) })}><Trash2 size={13} /> Remove chapter</button>
      </div>
    </>;
  }

  /* ---------- love notes ---------- */
  if (key === 'val.jar.notes') {
    return <ListShell title="Love notes" hint="One of these is pulled at random every time the jar is tapped." count={cfg.jar.notes.length} addLabel="Add note"
      onAdd={() => commit({ ...cfg, jar: { ...cfg.jar, notes: [...cfg.jar.notes, ''] } })}>
      {cfg.jar.notes.map((n, i) => (
        <ListCard key={i} title={`Note ${i + 1}`} index={i} total={cfg.jar.notes.length}
          onMove={d => commit({ ...cfg, jar: { ...cfg.jar, notes: move(cfg.jar.notes, i, d) } })}
          onRemove={() => commit({ ...cfg, jar: { ...cfg.jar, notes: cfg.jar.notes.filter((_, j) => j !== i) } })}>
          <textarea rows={2} value={n} placeholder="Write something sweet…" onChange={e => setAt(`jar.notes.${i}`, e.target.value)} />
        </ListCard>
      ))}
    </ListShell>;
  }

  /* ---------- letter paragraphs ---------- */
  if (key === 'val.final.paragraphs') {
    return <ListShell title="Letter paragraphs" hint="The final letter, one paragraph per card." count={cfg.final.paragraphs.length} addLabel="Add paragraph"
      onAdd={() => commit({ ...cfg, final: { ...cfg.final, paragraphs: [...cfg.final.paragraphs, ''] } })}>
      {cfg.final.paragraphs.map((p, i) => (
        <ListCard key={i} title={`Paragraph ${i + 1}`} index={i} total={cfg.final.paragraphs.length}
          onMove={d => commit({ ...cfg, final: { ...cfg.final, paragraphs: move(cfg.final.paragraphs, i, d) } })}
          onRemove={() => commit({ ...cfg, final: { ...cfg.final, paragraphs: cfg.final.paragraphs.filter((_, j) => j !== i) } })}>
          <textarea rows={3} value={p} placeholder="Write from the heart…" onChange={e => setAt(`final.paragraphs.${i}`, e.target.value)} />
        </ListCard>
      ))}
    </ListShell>;
  }
  const paraMatch = /^val\.final\.paragraphs\.(\d+)$/.exec(key);
  if (paraMatch) {
    const i = Number(paraMatch[1]);
    if (cfg.final.paragraphs[i] === undefined) return <Empty />;
    return <>
      {text(path, selected.label, true, true)}
      {tip}
      <div className="universal-editor-grid">
        <button type="button" className="builder-mini-btn" onClick={() => commit({ ...cfg, final: { ...cfg.final, paragraphs: [...cfg.final.paragraphs.slice(0, i + 1), '', ...cfg.final.paragraphs.slice(i + 1)] } })}><Plus size={14} /> Add paragraph after</button>
        <button type="button" className="universal-danger compact" onClick={() => commit({ ...cfg, final: { ...cfg.final, paragraphs: cfg.final.paragraphs.filter((_, j) => j !== i) } })}><Trash2 size={13} /> Remove paragraph</button>
      </div>
    </>;
  }

  /* ---------- "No" reactions ---------- */
  if (key === 'val.intro.prompts') {
    return <ListShell title={'"No" reactions'} hint="The first card is the real question. Each time the receiver taps “No”, the next card appears and the “Yes” button grows." count={cfg.intro.prompts.length} addLabel="Add reaction"
      onAdd={() => commit({ ...cfg, intro: { ...cfg.intro, prompts: [...cfg.intro.prompts, { title: 'Are you really sure?', subtitle: 'Think again…' }] } })}>
      {cfg.intro.prompts.map((p, i) => (
        <ListCard key={i} title={i === 0 ? 'The question' : `Reaction ${i}`} index={i} total={cfg.intro.prompts.length} lockRemove={cfg.intro.prompts.length <= 1}
          onMove={d => commit({ ...cfg, intro: { ...cfg.intro, prompts: move(cfg.intro.prompts, i, d) } })}
          onRemove={() => commit({ ...cfg, intro: { ...cfg.intro, prompts: cfg.intro.prompts.filter((_, j) => j !== i) } })}>
          <input value={p.title} placeholder="Big text" onChange={e => setAt(`intro.prompts.${i}.title`, e.target.value)} />
          <input value={p.subtitle} placeholder="Small text" onChange={e => setAt(`intro.prompts.${i}.subtitle`, e.target.value)} />
        </ListCard>
      ))}
    </ListShell>;
  }

  /* ---------- plain text fields ---------- */
  const value = getValentinePath(cfg, path);
  if (typeof value === 'string') {
    const toggleKey = Object.keys(SECTION_TOGGLE).find(prefix => key.startsWith(prefix));
    const toggle = toggleKey ? SECTION_TOGGLE[toggleKey] : null;
    const related = RELATED[key] || [];
    return <>
      {text(path, selected.label, selected.kind === 'textarea', true)}
      {related.map(r => <React.Fragment key={r.path}>{text(r.path, r.label)}</React.Fragment>)}
      {tip}
      {toggle && <Switch label={toggle.label} value={!!getValentinePath(cfg, toggle.path)} onChange={v => setAt(toggle.path, v)} />}
    </>;
  }

  return <div className="builder-note">This element does not have an editor field yet.</div>;
}

/* ---------- small building blocks ---------- */
function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = arr.slice();
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="builder-field"><span>{label}</span>{children}</label>;
}
function Switch({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return <label className={`builder-toggle ${value ? 'on' : ''}`}><span><b>{label}</b><small>{value ? 'Enabled' : 'Disabled'}</small></span><input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} /></label>;
}
function Empty() { return <div className="builder-empty">This item is no longer available.</div>; }

function ListShell({ title, hint, count, addLabel, onAdd, children }: { title: string; hint: string; count: number; addLabel: string; onAdd: () => void; children: React.ReactNode }) {
  return <>
    <div className="universal-editor-media-head"><div><b>{title} ({count})</b><span>{hint}</span></div></div>
    <div style={{ display: 'grid', gap: 10, maxHeight: 320, overflowY: 'auto', paddingRight: 2 }}>{children}</div>
    <button type="button" className="builder-upload-btn universal-add-media" onClick={onAdd}><Plus size={14} /> {addLabel}</button>
  </>;
}

function ListCard({ title, index, total, onMove, onRemove, lockRemove, children }: { title: string; index: number; total: number; onMove: (dir: -1 | 1) => void; onRemove: () => void; lockRemove?: boolean; children: React.ReactNode }) {
  const iconBtn: React.CSSProperties = { width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer' };
  return <div className="builder-field" style={{ padding: 10, border: '1px solid #e2e8f0', borderRadius: 12, background: '#f8fafc', display: 'grid', gap: 6 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <strong style={{ fontSize: 12 }}>{title}</strong>
      <span style={{ display: 'inline-flex', gap: 4 }}>
        <button type="button" aria-label="Move up" disabled={index === 0} style={{ ...iconBtn, opacity: index === 0 ? .4 : 1 }} onClick={() => onMove(-1)}><ArrowUp size={14} /></button>
        <button type="button" aria-label="Move down" disabled={index === total - 1} style={{ ...iconBtn, opacity: index === total - 1 ? .4 : 1 }} onClick={() => onMove(1)}><ArrowDown size={14} /></button>
        <button type="button" aria-label="Remove" disabled={lockRemove} style={{ ...iconBtn, color: '#dc2626', opacity: lockRemove ? .4 : 1 }} onClick={onRemove}><Trash2 size={14} /></button>
      </span>
    </div>
    {children}
  </div>;
}
