
'use client';

import { useMemo } from 'react';
import { Edit3, ImagePlus, Music2, RotateCcw, Trash2, Upload, Video } from 'lucide-react';
import { InlineMediaField, SingleMediaUpload } from './MediaUploader';
import type { BirthdayContent, GalleryItem } from '@/lib/types';
import { mergeMasterBirthdayConfig } from '@/lib/master-birthday';

type Selection = { key: string; label: string; index?: number; value?: string; kind?: string };
type Props = {
  selected: Selection;
  content: BirthdayContent;
  templateId: string;
  websiteId: string;
  onChange: (patch: Partial<BirthdayContent>) => void;
  onTemplateConfigChange: (patch: Record<string, unknown>) => void;
  onClose: () => void;
};

export default function UniversalElementEditor({ selected, content, templateId, websiteId, onChange, onTemplateConfigChange, onClose }: Props) {
  const key = selected.key;
  const common = (content as any)[key];
  const templateConfig = (content.templateConfig || {}) as Record<string, any>;
  const master = templateId === 'master-proposal';
  const masterBirthday = templateId === 'master-birthday' || templateId === 'master';
  const masterBirthdayConfig = mergeMasterBirthdayConfig((templateConfig as any)?.masterBirthday);
  const updateMasterBirthdayPath = (path: string, value: unknown) => {
    const parts = path.split('.');
    const next: any = JSON.parse(JSON.stringify(masterBirthdayConfig));
    let cursor = next;
    for (let i=0;i<parts.length-1;i++) cursor = cursor[parts[i]] ?? (cursor[parts[i]] = {});
    cursor[parts[parts.length-1]] = value;
    onTemplateConfigChange({ masterBirthday: next });
  };

  const updateGallery = (patch: Partial<GalleryItem>, remove = false) => {
    const items = [...(content.gallery || [])];
    const i = selected.index ?? -1;
    if (i < 0 || i >= items.length) return;
    onChange({ gallery: remove ? items.filter((_, idx) => idx !== i) : items.map((item, idx) => idx === i ? { ...item, ...patch } : item) });
  };

  const setMasterArrayItem = (field: string, patch: Record<string, unknown>, remove = false) => {
    const items = Array.isArray(templateConfig[field]) ? [...templateConfig[field]] : [];
    const i = selected.index ?? -1;
    if (i < 0) return;
    if (remove) items.splice(i, 1); else items[i] = { ...(items[i] || {}), ...patch };
    onTemplateConfigChange({ [field]: items });
  };

  const render = useMemo(() => {
    if (!selected) return null;
    if (key === 'gallery' && typeof selected.index === 'number' && (selected.index >= (content.gallery?.length || 0))) {
      const add = () => onChange({ gallery: [...(content.gallery || []), { url: '', caption: '' }] });
      return <><div className="universal-editor-media-head"><div className="universal-editor-icon"><ImagePlus size={16}/></div><div><b>Add a new photo</b><span>Your next memory</span></div></div><button type="button" className="builder-upload-btn" onClick={add}><ImagePlus size={14}/> Create photo slot</button><p className="builder-note mt-3">After the slot is created, choose the photo, add a caption, and it appears in the preview.</p></>;
    }
    if (key === 'reasons' && typeof selected.index === 'number') {
      const items = [...(content.reasons || [])];
      if (selected.index >= items.length) {
        return <><Field label={`Reason ${selected.index + 1}`}><textarea rows={4} autoFocus placeholder="Write a reason…" onChange={e=>{ if(e.target.value.trim()) onChange({ reasons:[...items, e.target.value] }); }} /></Field><p className="builder-note">Use this slot to add another reason. It will appear immediately in the story.</p></>;
      }
      return <><Field label={`Reason ${selected.index + 1}`}><textarea rows={4} autoFocus value={items[selected.index] || ''} onChange={e=>onChange({ reasons: items.map((x,i)=>i===selected.index ? e.target.value : x) })} /></Field><div className="universal-editor-grid"><button type="button" className="builder-mini-btn" onClick={()=>onChange({ reasons:items.filter((_,i)=>i!==selected.index) })}>Remove</button><button type="button" className="builder-mini-btn" onClick={()=>onChange({ reasons:[...items,''] })}>＋ Add another</button></div></>;
    }
    if (key.startsWith('preset.')) {
      const field = key.slice('preset.'.length);
      const preset = (templateConfig.preset || {}) as Record<string, unknown>;
      return <TextField value={String(preset[field] ?? selected.value ?? '')} multiline={field === 'sectionTitle'} onChange={value => onTemplateConfigChange({ preset: { ...preset, [field]: value } })} />;
    }
    if (templateId === 'wedding-proposal' && key.startsWith('proposal')) {
      const stored = (content as any)[key];
      const text = typeof stored === 'string' ? stored : String(selected.value ?? '');
      return <>
        <TextField value={text} multiline={text.length > 40 || text.includes('\n')} onChange={value => onChange({ [key]: value } as Partial<BirthdayContent>)} />
        <p className="builder-note">Use <b>{'{name}'}</b> for the receiver's name and <b>{'{sender}'}</b> for your name. Leave empty to use the default text.</p>
      </>;
    }
    if (key.startsWith('gx.')) {
      const genericEdits = (templateConfig.genericEdits || {}) as Record<string, any>;
      const current = genericEdits[key] || { type: selected.kind === 'image' ? 'image' : selected.kind === 'video' ? 'video' : selected.kind === 'audio' ? 'audio' : selected.kind === 'link' ? 'link' : 'text', value: selected.value || '', label: selected.label };
      const updateGeneric = (patch: Record<string, unknown>) => {
        const next = { ...genericEdits, [key]: { ...current, ...patch, label: current.label || selected.label } };
        onTemplateConfigChange({ genericEdits: next });
      };
      if (current.type === 'image') return <>
        <div className="universal-editor-media-head"><div className="universal-editor-icon"><ImagePlus size={16}/></div><div><b>{current.label || selected.label}</b><span>Replace this image</span></div></div>
        <InlineMediaField value={String(current.value || '')} placeholder="Image URL" accept="image/*" folder="gallery" websiteId={websiteId} onChange={url=>updateGeneric({ value: url })}/>
        <Field label="Image URL"><input type="url" value={String(current.value || '')} onChange={e=>updateGeneric({ value: e.target.value })} placeholder="https://..." /></Field>
        <Field label="Alt text"><input value={String(current.alt || '')} onChange={e=>updateGeneric({ alt: e.target.value })} /></Field>
      </>;
      if (current.type === 'video') return <>
        <div className="universal-editor-media-head"><div className="universal-editor-icon"><Video size={16}/></div><div><b>{current.label || selected.label}</b><span>Replace this video</span></div></div>
        <SingleMediaUpload kind="video" url={String(current.value || '')} websiteId={websiteId} onChange={url=>updateGeneric({ value: url })}/>
        <Field label="Video source URL"><input type="url" value={String(current.value || '')} onChange={e=>updateGeneric({ value: e.target.value })} placeholder="YouTube or direct video URL" /></Field>
        <Field label="Poster / thumbnail"><input value={String(current.poster || '')} onChange={e=>updateGeneric({ poster: e.target.value })} /></Field>
      </>;
      if (current.type === 'audio') return <>
        <div className="universal-editor-media-head"><div className="universal-editor-icon"><Music2 size={16}/></div><div><b>{current.label || selected.label}</b><span>Replace this audio</span></div></div>
        <SingleMediaUpload kind="audio" url={String(current.value || '')} websiteId={websiteId} onChange={url=>updateGeneric({ value: url })}/>
        <Field label="Audio URL"><input type="url" value={String(current.value || '')} onChange={e=>updateGeneric({ value: e.target.value })} placeholder="https://..." /></Field>
      </>;
      if (current.type === 'link') return <>
        <Field label={selected.label || 'Link text'}><input autoFocus value={String(current.value || '')} onChange={e=>updateGeneric({ value: e.target.value })} /></Field>
        <Field label="Link URL"><input type="url" value={String(current.href || '')} onChange={e=>updateGeneric({ href: e.target.value })} placeholder="https://..." /></Field>
      </>;
      return <TextField value={String(current.value ?? selected.value ?? '')} multiline={true} onChange={value=>updateGeneric({ value })} />;
    }

    if (masterBirthday && key.startsWith('mb.')) {
      const path = key.slice(3);
      const cfg:any = masterBirthdayConfig;
      const get = (p:string) => p.split('.').reduce((acc:any,k)=>acc?.[k],cfg);
      if (path === 'reasons.items' && typeof selected.index === 'number') {
        const items = [...(cfg.reasons?.items || [])];
        const i=selected.index; const item=items[i] || {id:`reason-${Date.now()}`,emoji:'💖',text:''};
        if (i >= items.length) items.push(item);
        const updateItem=(patch:Record<string,unknown>)=>{const next=items.slice();next[i]={...next[i],...patch};updateMasterBirthdayPath('reasons.items',next)};
        return <><Field label="Emoji"><input autoFocus value={String(item.emoji||'')} onChange={e=>updateItem({emoji:e.target.value})}/></Field><Field label="Reason text"><textarea rows={4} value={String(item.text||'')} onChange={e=>updateItem({text:e.target.value})}/></Field><div className="universal-editor-grid"><button type="button" className="builder-mini-btn" onClick={()=>updateMasterBirthdayPath('reasons.items',[...items,{...item,id:`reason-${Date.now()}`}])}>Duplicate</button><button type="button" className="builder-mini-btn" disabled={items.length<=1} onClick={()=>updateMasterBirthdayPath('reasons.items',items.filter((_,idx)=>idx!==i))}>Delete</button></div></>;
      }
      if (path === 'memories.items' && typeof selected.index === 'number') {
        const items=[...(cfg.memories?.items||[])]; const i=selected.index; const item=items[i] || {id:`memory-${Date.now()}`,url:'',title:'New memory',caption:'',date:'',alt:''}; if(i>=items.length)items.push(item);
        const updateItem=(patch:Record<string,unknown>)=>{const next=items.slice();next[i]={...next[i],...patch};updateMasterBirthdayPath('memories.items',next)};
        return <><div className="universal-editor-media-head"><div className="universal-editor-icon"><ImagePlus size={16}/></div><div><b>Memory {i+1}</b><span>Replace, edit, duplicate or remove</span></div></div><InlineMediaField value={String(item.url||'')} placeholder="Photo URL" accept="image/*" folder="gallery" websiteId={websiteId} onChange={url=>updateItem({url})}/><Field label="Title"><input value={String(item.title||'')} onChange={e=>updateItem({title:e.target.value})}/></Field><Field label="Caption"><textarea rows={3} value={String(item.caption||'')} onChange={e=>updateItem({caption:e.target.value})}/></Field><Field label="Date / label"><input value={String(item.date||'')} onChange={e=>updateItem({date:e.target.value})}/></Field><Field label="Alt text"><input value={String(item.alt||'')} onChange={e=>updateItem({alt:e.target.value})}/></Field><Field label="Destination URL"><input type="url" value={String(item.destinationUrl||'')} onChange={e=>updateItem({destinationUrl:e.target.value})}/></Field><div className="universal-editor-grid"><button type="button" className="builder-mini-btn" onClick={()=>updateMasterBirthdayPath('memories.items',[...items,{...item,id:`memory-${Date.now()}`}])}>Duplicate</button><button type="button" className="builder-mini-btn" onClick={()=>updateMasterBirthdayPath('memories.items',items.filter((_,idx)=>idx!==i))}>Delete</button></div></>;
      }
      if (path === 'videos.items' && typeof selected.index === 'number') {
        const items=[...(cfg.videos?.items||[])]; const i=selected.index; const item=items[i] || {id:`video-${Date.now()}`,source:'',title:'New video',caption:'',poster:'',alt:'Video'}; if(i>=items.length)items.push(item);
        const updateItem=(patch:Record<string,unknown>)=>{const next=items.slice();next[i]={...next[i],...patch};updateMasterBirthdayPath('videos.items',next)};
        return <><div className="universal-editor-media-head"><div className="universal-editor-icon"><Video size={16}/></div><div><b>Video {i+1}</b><span>Upload, public URL, YouTube, caption and poster</span></div></div><SingleMediaUpload kind="video" url={String(item.source||'').match(/^(https?:\/\/.*\.(?:mp4|webm|mov)(?:\?.*)?)$/i)?.[1] || ''} websiteId={websiteId} onChange={url=>updateItem({source:url})}/><Field label="Video source URL"><input type="url" value={String(item.source||'')} onChange={e=>updateItem({source:e.target.value})} placeholder="YouTube or direct video URL"/></Field><Field label="Title"><input autoFocus value={String(item.title||'')} onChange={e=>updateItem({title:e.target.value})}/></Field><Field label="Caption"><textarea rows={3} value={String(item.caption||'')} onChange={e=>updateItem({caption:e.target.value})}/></Field><Field label="Poster / thumbnail"><input value={String(item.poster||'')} onChange={e=>updateItem({poster:e.target.value})}/></Field><Field label="Alt text"><input value={String(item.alt||'')} onChange={e=>updateItem({alt:e.target.value})}/></Field><div className="universal-editor-grid"><button type="button" className="builder-mini-btn" onClick={()=>updateMasterBirthdayPath('videos.items',[...items,{...item,id:`video-${Date.now()}`}])}>Duplicate</button><button type="button" className="builder-mini-btn" onClick={()=>updateMasterBirthdayPath('videos.items',items.filter((_,idx)=>idx!==i))}>Delete</button></div></>;
      }
      if (path === 'puzzle.word') {
        const cur = String(get(path) || '').trim() || String(selected.value || '').trim();
        const count = Array.from(cur.replace(/[\s.,!?\-_~]+/g, '')).length;
        return <>
          <div className="universal-editor-media-head"><div className="universal-editor-icon"><Edit3 size={16}/></div><div><b>Puzzle word</b><span>Type any word — the letter boxes and hint update automatically</span></div></div>
          <Field label="Word to arrange"><input autoFocus value={String(get(path) || '')} placeholder={cur} onChange={e => updateMasterBirthdayPath(path, e.target.value)} /><small className="builder-field-hint">{count} letter box{count === 1 ? '' : 'es'} · the hint is generated from this word. Leave empty to use the recipient name.</small></Field>
        </>;
      }
      if (path === 'secret.image') {
        return <>
          <div className="universal-editor-media-head"><div className="universal-editor-icon"><ImagePlus size={16}/></div><div><b>Secret photo</b><span>Upload a photo or use a public image URL</span></div></div>
          <InlineMediaField value={String(get(path) || '')} placeholder="Secret photo URL" accept="image/*" folder="secret" websiteId={websiteId} onChange={url => updateMasterBirthdayPath(path, url)} />
          <Field label="Image URL"><input type="url" value={String(get(path) || '')} onChange={e => updateMasterBirthdayPath(path, e.target.value)} placeholder="https://..." /></Field>
          <p className="builder-note">Upload directly here or paste a public image link. The photo updates live in the Secret screen.</p>
        </>;
      }
      if (path === 'secret.socialUrl') {
        return <>
          <div className="universal-editor-media-head"><div className="universal-editor-icon"><Edit3 size={16}/></div><div><b>Secret profile link</b><span>Facebook, Instagram, website or any public profile</span></div></div>
          <Field label="Profile URL"><input type="url" autoFocus value={String(get(path) || '')} onChange={e => updateMasterBirthdayPath(path, e.target.value)} placeholder="https://instagram.com/..." /></Field>
          <p className="builder-note">This is the destination opened by the “See Your Friend” button in the live website.</p>
        </>;
      }
      if (path === 'letter.paragraphs' && typeof selected.index === 'number') {
        const items = [...(cfg.letter?.paragraphs || [])];
        const i = selected.index;
        if (i >= items.length) return <Field label={`Letter paragraph ${i + 1}`}><textarea rows={6} autoFocus placeholder="Write this paragraph…" onChange={e=>{ if(e.target.value.trim()) updateMasterBirthdayPath('letter.paragraphs',[...items,e.target.value]); }} /></Field>;
        return <><Field label={`Letter paragraph ${i + 1}`}><textarea rows={7} autoFocus value={String(items[i] || '')} onChange={e=>updateMasterBirthdayPath('letter.paragraphs',items.map((x,idx)=>idx===i?e.target.value:x))}/></Field><div className="universal-editor-grid"><button type="button" className="builder-mini-btn" onClick={()=>updateMasterBirthdayPath('letter.paragraphs',[...items,items[i] || ''])}>Duplicate</button><button type="button" className="builder-mini-btn" disabled={items.length<=1} onClick={()=>updateMasterBirthdayPath('letter.paragraphs',items.filter((_,idx)=>idx!==i))}>Delete</button></div></>;
      }
      const value = String(get(path) ?? selected.value ?? '');
      if (path === 'countdown.birthdayDateTime') {
        const current = `${masterBirthdayConfig.birthdayDate}T${masterBirthdayConfig.birthdayTime}`;
        return <>
          <Field label="Birthday date & time"><input type="datetime-local" value={current} autoFocus onChange={e => {
            const raw = e.target.value;
            if (!raw || !raw.includes('T')) return;
            const [birthdayDate, birthdayTime] = raw.split('T');
            const next = JSON.parse(JSON.stringify(masterBirthdayConfig));
            next.birthdayDate = birthdayDate;
            next.birthdayTime = birthdayTime.slice(0, 5);
            onTemplateConfigChange({ masterBirthday: next });
          }} /><small className="builder-field-hint">Set the exact birthday date and time used by the countdown.</small></Field>
          <Field label="Birthday age"><input type="number" min={1} max={120} value={Number(masterBirthdayConfig.age || 1)} onChange={e => {
            const age = Math.max(1, Math.min(120, Number(e.target.value) || 1));
            const next = JSON.parse(JSON.stringify(masterBirthdayConfig));
            next.age = age;
            next.cake = { ...(next.cake || {}), ageCandleCount: age };
            onTemplateConfigChange({ masterBirthday: next });
          }} /><small className="builder-field-hint">Also updates the cake candle count.</small></Field>
        </>;
      }
      if (path === 'cake.group') {
        const cake = cfg.cake || {};
        return <>
          <div className="universal-editor-media-head"><div className="universal-editor-icon"><Edit3 size={16}/></div><div><b>Cake text</b><span>Edit all three cake texts together</span></div></div>
          <Field label="First line"><input autoFocus value={String(cake.cakeText || '')} onChange={e => updateMasterBirthdayPath('cake.cakeText', e.target.value)} /></Field>
          <Field label="Second line"><input value={String(cake.birthdayText || '')} onChange={e => updateMasterBirthdayPath('cake.birthdayText', e.target.value)} /></Field>
          <Field label="Name"><input value={String(cake.recipientName || '')} onChange={e => updateMasterBirthdayPath('cake.recipientName', e.target.value)} /></Field>
          <p className="builder-note">Click any of the three texts on the cake to open this same editor. Changes appear instantly in the canvas.</p>
        </>;
      }
      if (path === 'cake.ageCandleCount') {
        return <Field label="Birthday age"><input type="number" min="1" max="120" value={Number(get(path) || 1)} onChange={e=>updateMasterBirthdayPath(path, Math.max(1, Number(e.target.value)||1))} /><small className="builder-field-hint">Sets the number of birthday candles.</small></Field>;
      }
      if (path === 'countdown.audioUrl') {
        return <>
          <div className="universal-editor-media-head"><div className="universal-editor-icon"><Music2 size={16}/></div><div><b>Countdown audio</b><span>Change the sound used during the countdown.</span></div></div>
          <SingleMediaUpload kind="audio" url={String(get(path) || '')} websiteId={websiteId} onChange={url=>updateMasterBirthdayPath(path,url)} />
          <Field label="Audio URL"><input type="url" value={String(get(path) || '')} onChange={e=>updateMasterBirthdayPath(path,e.target.value)} placeholder="https://..." /></Field>
          <Switch label="Countdown audio" value={Boolean(get('countdown.audioEnabled'))} onChange={v=>updateMasterBirthdayPath('countdown.audioEnabled',v)} />
          <MoreSettings rows={[['Playback','Final countdown window'],['Loop','Off'],['Editor','Silent']]}/>
        </>;
      }
      if (path === 'wishingAudioUrl') {
        return <>
          <div className="universal-editor-media-head"><div className="universal-editor-icon"><Music2 size={16}/></div><div><b>Wishing audio</b><span>Plays once after the countdown finishes.</span></div></div>
          <Field label="YouTube / audio URL"><input type="url" value={String(get(path) || '')} onChange={e=>updateMasterBirthdayPath(path,e.target.value)} placeholder="YouTube or direct audio URL" /></Field>
          <SingleMediaUpload kind="audio" url={String(get(path) || '')} websiteId={websiteId} onChange={url=>updateMasterBirthdayPath(path,url)} />
          <MoreSettings rows={[['Playback','Once after countdown'],['Loop','Off'],['Editor','Silent']]}/>
        </>;
      }
      const isToggle = ['cake.microphoneEnabled','cake.soundEffects','cake.vibration','countdown.audioEnabled'].includes(path) || path.startsWith('effects.');
      if (isToggle) return <Switch label={selected.label} value={Boolean(get(path))} onChange={v=>updateMasterBirthdayPath(path,v)} />;
      return <TextField value={value} multiline={value.length>70 || /message|note|subtitle|text/.test(path)} onChange={v=>updateMasterBirthdayPath(path,v)} />;
    }
    if (['countdownTitle','countdownMessage','countdownDaysLabel','countdownHoursLabel','countdownMinutesLabel','countdownSecondsLabel'].includes(key)) {
      return <TextField value={String(common ?? '')} multiline={key === 'countdownMessage'} onChange={value => onChange({ [key]: value } as Partial<BirthdayContent>)} />;
    }
    if (key === 'letter' && typeof selected.index === 'number') {
      const lines = [...(content.letter || [])];
      if (selected.index >= lines.length) {
        return <><Field label={`Letter line ${selected.index + 1}`}><textarea rows={5} autoFocus placeholder="Write this letter line…" onChange={e=>{ if(e.target.value.trim()) onChange({ letter:[...lines, e.target.value] }); }} /></Field><p className="builder-note">Add this line to the letter animation. It will appear in the published website.</p></>;
      }
      return <><Field label={`Letter line ${selected.index + 1}`}><textarea rows={5} autoFocus value={lines[selected.index] || ''} onChange={e=>onChange({ letter: lines.map((x,i)=>i===selected.index ? e.target.value : x) })} /></Field><div className="universal-editor-grid"><button type="button" className="builder-mini-btn" onClick={()=>onChange({ letter: lines.filter((_,i)=>i!==selected.index) })}>Remove</button><button type="button" className="builder-mini-btn" onClick={()=>onChange({ letter:[...lines,''] })}>＋ Add another</button></div></>;
    }
    if (key === 'birthday') {
      const toLocalDateTime = (value: string) => {
        const d = new Date(value || '');
        if (Number.isNaN(d.getTime())) return '';
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };
      return <Field label="Birthday countdown target"><input type="datetime-local" value={toLocalDateTime(String(content.birthday || ''))} onChange={e => onChange({ birthday: e.target.value })} autoFocus /><small className="builder-field-hint">The countdown uses this exact date and time.</small></Field>;
    }
    if (key === 'gallery' && typeof selected.index === 'number') {
      const items = [...(content.gallery || [])];
      const addPhoto = () => onChange({ gallery: [...items, { url: '', caption: '' }] });
      const remove = (i: number) => onChange({ gallery: items.filter((_, idx) => idx !== i) });
      const updateAt = (i: number, patch: Partial<GalleryItem>) => onChange({ gallery: items.map((item, idx) => idx === i ? { ...item, ...patch } : item) });
      return <>
        <div className="universal-editor-media-head"><div className="universal-editor-icon"><ImagePlus size={16}/></div><div><b>Photo section</b><span>Edit, replace, remove or add memories</span></div></div>
        <div className="universal-media-section-list">
          {items.map((item, i) => <div key={i} className="universal-media-section-item">
            <div className="universal-media-section-item-top"><strong>Photo {i + 1}</strong><button type="button" className="universal-danger compact" onClick={() => remove(i)}><Trash2 size={13}/> Remove</button></div>
            <InlineMediaField value={item.url} placeholder="Photo URL" accept="image/*" folder="gallery" websiteId={websiteId} onChange={url => updateAt(i, { url })} />
            <Field label="Caption"><input value={item.caption || ''} onChange={e => updateAt(i, { caption: e.target.value })} placeholder="Caption shown with this photo…" /></Field>
          </div>)}
        </div>
        <button type="button" className="builder-upload-btn universal-add-media" onClick={addPhoto}><ImagePlus size={14}/> Add new photo</button>
      </>;
    }
    if (key === 'musicUrl' || key === 'countdownAudioUrl' || key === 'wishingAudioUrl') {
      const audioMeta = key === 'countdownAudioUrl'
        ? { title: 'Countdown audio', sub: 'Plays in the final countdown window', field: 'countdownAudioUrl' as const }
        : key === 'wishingAudioUrl'
          ? { title: 'Wishing / birthday audio', sub: 'Plays when the celebration unlocks', field: 'wishingAudioUrl' as const }
          : { title: 'Background music', sub: 'Your main soundtrack', field: 'musicUrl' as const };
      return <>
        <div className="universal-editor-media-head"><div className="universal-editor-icon"><Music2 size={16}/></div><div><b>{audioMeta.title}</b><span>{audioMeta.sub}</span></div></div>
        <SingleMediaUpload kind="audio" url={String(content[audioMeta.field] || '')} websiteId={websiteId} onChange={url => onChange({ [audioMeta.field]: url } as Partial<BirthdayContent>)} />
        <MoreSettings rows={audioMeta.field === 'countdownAudioUrl' ? [['Playback','Final countdown only'],['Loop','Off'],['Volume','100%']] : audioMeta.field === 'wishingAudioUrl' ? [['Playback','Birthday / wish moment'],['Loop','Off'],['Volume','100%']] : [['Playback','Background soundtrack'],['Loop','On'],['Volume','100%']]} />
        <button type="button" className="universal-danger" onClick={() => onChange({ [audioMeta.field]: '' } as Partial<BirthdayContent>)}><Trash2 size={14}/> Remove this audio</button>
      </>;
    }
    if (key === 'videoUrl') return <>
      <div className="universal-editor-media-head"><div className="universal-editor-icon"><Video size={16}/></div><div><b>Video section</b><span>Replace, remove, add caption</span></div></div>
      <div className="universal-media-section-item">
        <div className="universal-media-section-item-top"><strong>Special video</strong><button type="button" className="universal-danger compact" onClick={() => onChange({ videoUrl: '', videoCaption: '' })}><Trash2 size={13}/> Remove</button></div>
        <SingleMediaUpload kind="video" url={String(content.videoUrl || '')} websiteId={websiteId} onChange={url => onChange({ videoUrl: url })} />
        <Field label="Video caption"><textarea rows={3} value={String((content as any).videoCaption || '')} onChange={e => onChange({ videoCaption: e.target.value })} placeholder="Write a caption for the video…" /></Field>
      </div>
      <button type="button" className="builder-upload-btn universal-add-media" onClick={() => onChange({ videoUrl: '', videoCaption: '' })}><Video size={14}/> Add / replace video</button>
      <MoreSettings rows={[['Controls','On'],['Autoplay','Off'],['Loop','Off']]} />
    </>;
    if (master && key === 'bgMusicUrl') return <>
      <div className="universal-editor-media-head"><div className="universal-editor-icon"><Music2 size={16}/></div><div><b>Background music</b><span>Master Proposal soundtrack</span></div></div>
      <SingleMediaUpload kind="audio" url={String(templateConfig.bgMusicUrl || '')} websiteId={websiteId} onChange={url => onTemplateConfigChange({ bgMusicUrl: url })} />
      <MoreSettings rows={[['Autoplay','Tap-to-play safe'],['Loop','On'],['Player','Hidden background']]} />
    </>;
    if (master && key === 'museum' && typeof selected.index === 'number') {
      const museum = Array.isArray(templateConfig.museum) ? [...templateConfig.museum] : [];
      if (selected.index >= museum.length) {
        return <><div className="universal-editor-media-head"><div className="universal-editor-icon"><ImagePlus size={16}/></div><div><b>Add gallery item</b><span>New memory</span></div></div><button type="button" className="builder-upload-btn" onClick={()=>onTemplateConfigChange({ museum:[...museum,{id:String(Date.now()),type:'image',url:'',title:'New Memory',date:'',description:''}] })}><ImagePlus size={14}/> Create gallery item</button></>;
      }
      const item = museum[selected.index] || {};
      return <>
        <div className="universal-editor-media-head"><div className="universal-editor-icon"><ImagePlus size={16}/></div><div><b>Gallery item</b><span>Memory {selected.index + 1}</span></div></div>
        <Field label="Type"><select value={String(item.type || 'image')} onChange={e => setMasterArrayItem('museum', { type: e.target.value })}><option value="image">Photo</option><option value="video">Video</option></select></Field>
        <InlineMediaField value={String(item.url || '')} placeholder="Photo or video URL" accept={item.type === 'video' ? 'video/*' : 'image/*'} folder={item.type === 'video' ? 'video' : 'gallery'} websiteId={websiteId} onChange={url => setMasterArrayItem('museum', { url })} />
        <Field label="Title"><input value={String(item.title || '')} onChange={e => setMasterArrayItem('museum', { title: e.target.value })} /></Field>
        <Field label="Date"><input value={String(item.date || '')} onChange={e => setMasterArrayItem('museum', { date: e.target.value })} /></Field>
        <Field label="Description"><textarea rows={4} value={String(item.description || '')} onChange={e => setMasterArrayItem('museum', { description: e.target.value })} /></Field>
        <Danger onClick={() => setMasterArrayItem('museum', {}, true)} />
      </>;
    }
    if (master && key === 'story' && typeof selected.index === 'number') {
      const item = (Array.isArray(templateConfig.story) ? templateConfig.story : [])[selected.index] || {};
      return <>
        <Field label="Chapter title"><input value={String(item.title || '')} onChange={e => setMasterArrayItem('story', { title: e.target.value })} /></Field>
        <Field label="Chapter text"><textarea rows={7} value={String(item.body || '')} onChange={e => setMasterArrayItem('story', { body: e.target.value })} /></Field>
        <Danger onClick={() => setMasterArrayItem('story', {}, true)} />
      </>;
    }
    if (master && key.startsWith('introGate.')) {
      const field = key.split('.')[1];
      const gate = (templateConfig.introGate || {}) as Record<string, any>;
      if (field === 'prompts' && typeof selected.index === 'number') {
        const item = (Array.isArray(gate.prompts) ? gate.prompts : [])[selected.index] || {};
        const set = (patch: Record<string, unknown>) => {
          const next = [...(Array.isArray(gate.prompts) ? gate.prompts : [])];
          next[selected.index!] = { ...(next[selected.index!] || {}), ...patch };
          onTemplateConfigChange({ introGate: { ...gate, prompts: next } });
        };
        return <><Field label="Question"><input value={String(item.title || '')} onChange={e => set({ title: e.target.value })} /></Field><Field label="Subtitle"><input value={String(item.subtitle || '')} onChange={e => set({ subtitle: e.target.value })} /></Field></>;
      }
      if (field === 'yesButtonText' || field === 'noButtonText' || field === 'noButtonTextRepeat' || field === 'firstLine' || field === 'secondLineLabel' || field === 'secondLine') return <TextField value={String(gate[field] || '')} multiline={field === 'firstLine' || field === 'secondLine'} onChange={value => onTemplateConfigChange({ introGate: { ...gate, [field]: value } })} />;
    }
    if (master && key.startsWith('datePlanner.')) {
      const field = key.split('.')[1];
      const planner = (templateConfig.datePlanner || {}) as Record<string, any>;
      if (field === 'options' && typeof selected.index === 'number') {
        const item = (Array.isArray(planner.options) ? planner.options : [])[selected.index] || {};
        const set = (patch: Record<string, unknown>) => { const next = [...(Array.isArray(planner.options) ? planner.options : [])]; next[selected.index!] = { ...(next[selected.index!] || {}), ...patch }; onTemplateConfigChange({ datePlanner: { ...planner, options: next } }); };
        return <><Field label="Option label"><input value={String(item.label || '')} onChange={e => set({ label: e.target.value })} /></Field><Field label="Plan title"><input value={String(item.planTitle || '')} onChange={e => set({ planTitle: e.target.value })} /></Field><Field label="Description"><textarea rows={6} value={String(item.planDescription || '')} onChange={e => set({ planDescription: e.target.value })} /></Field><Field label="Budget"><input value={String(item.budget || '')} onChange={e => set({ budget: e.target.value })} /></Field></>;
      }
      return <TextField value={String(planner[field] || '')} multiline={field === 'heading' || field === 'subtitle'} onChange={value => onTemplateConfigChange({ datePlanner: { ...planner, [field]: value } })} />;
    }
    if (key === 'missYou') { const cfg = templateConfig; const set=(field:string,value:any)=>onTemplateConfigChange({[field]:value}); return <><Field label="Name 1"><input value={String(cfg.name1||'')} onChange={e=>set('name1',e.target.value)} /></Field><Field label="Name 2"><input value={String(cfg.name2||'')} onChange={e=>set('name2',e.target.value)} /></Field><Field label="Main line"><input value={String(cfg.seedText||'')} onChange={e=>set('seedText',e.target.value)} /></Field><Field label="Paragraph 1"><textarea rows={6} value={Array.isArray(cfg.paragraph1)?cfg.paragraph1.join('\n'):String(cfg.paragraph1||'')} onChange={e=>set('paragraph1',e.target.value.split('\n'))} /></Field><Field label="Paragraph 2"><textarea rows={6} value={Array.isArray(cfg.paragraph2)?cfg.paragraph2.join('\n'):String(cfg.paragraph2||'')} onChange={e=>set('paragraph2',e.target.value.split('\n'))} /></Field><Field label="Paragraph 3"><textarea rows={6} value={Array.isArray(cfg.paragraph3)?cfg.paragraph3.join('\n'):String(cfg.paragraph3||'')} onChange={e=>set('paragraph3',e.target.value.split('\n'))} /></Field><div className="mt-3"><b className="builder-eyebrow">BACKGROUND MUSIC</b><div className="mt-2"><SingleMediaUpload kind="audio" url={String(cfg.musicUrl||'')} websiteId={websiteId} onChange={url=>set('musicUrl',url)} /></div></div></>; }
    if (key in content) return <TextField value={String(common ?? '')} multiline={['message','greeting','heroSubtitle','secret','buttonText'].includes(key)} onChange={value => onChange({ [key]: value } as Partial<BirthdayContent>)} />;
    return <div className="builder-note">This element is visible in the template but does not expose a direct editor field yet.</div>;
  }, [selected, content, templateId, websiteId, key, common, master, masterBirthday, masterBirthdayConfig, templateConfig]);

  return <section className="builder-selection-card universal-editor-card">
    <div className="universal-editor-top"><div><span className="builder-eyebrow">QUICK EDIT</span><h3>{selected.label}</h3><p>Make one change at a time. Your preview updates instantly.</p></div><button className="builder-clear-selection" onClick={onClose} aria-label="Close editor">×</button></div>
    <div className="universal-editor-body">{render}</div>
  </section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="builder-field"><span>{label}</span>{children}</label>; }
function TextField({ value, multiline, onChange }: { value: string; multiline?: boolean; onChange: (value: string) => void }) { return <Field label="Content">{multiline ? <textarea rows={5} value={value} onChange={e => onChange(e.target.value)} autoFocus /> : <input value={value} onChange={e => onChange(e.target.value)} autoFocus />}</Field>; }
function Empty() { return <div className="builder-empty">This item is no longer available.</div>; }
function Danger({ onClick }: { onClick: () => void }) { return <button type="button" className="universal-danger" onClick={onClick}><Trash2 size={14}/> Remove this item</button>; }
function MoreSettings({ rows }: { rows: string[][] }) { return <details className="universal-more"><summary>More options</summary><div>{rows.map(([a,b]) => <div key={a}><span>{a}</span><b>{b}</b></div>)}</div></details>; }

function Switch({label,value,onChange}:{label:string;value:boolean;onChange:(v:boolean)=>void}){return <label className={`builder-toggle ${value?'on':''}`}><span><b>{label}</b><small>{value?'Enabled':'Disabled'}</small></span><input type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)}/></label>}
