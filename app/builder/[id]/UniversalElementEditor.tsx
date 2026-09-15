
'use client';

import { useMemo } from 'react';
import { Edit3, ImagePlus, Music2, RotateCcw, Trash2, Upload, Video } from 'lucide-react';
import { InlineMediaField, SingleMediaUpload } from './MediaUploader';
import type { BirthdayContent, GalleryItem } from '@/lib/types';

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
  const masterBirthday = templateId === 'master-birthday';
  const mb = (templateConfig.masterBirthday || {}) as any;
  const setMasterBirthday = (next: any) => onTemplateConfigChange({ masterBirthday: next });
  const updateMasterBirthday = (path: string[], value: any) => {
    const next = JSON.parse(JSON.stringify(mb));
    let cur = next;
    for (let i = 0; i < path.length - 1; i++) {
      if (!cur[path[i]] || typeof cur[path[i]] !== 'object') cur[path[i]] = {};
      cur = cur[path[i]];
    }
    cur[path[path.length - 1]] = value;
    setMasterBirthday(next);
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
    if (masterBirthday && key.startsWith('mb.') && !['mb.reasonsButton','mb.reasonsTitle','mb.reasonsNote'].includes(key)) {
      const path = key.slice(3).split('.');
      let value: any = mb;
      for (const part of path) value = value?.[part];
      const isMultiline = ['message','greetingMessage','countdownMessage','cutInstruction','micHint'].some(x => key.endsWith(x));
      const label = selected.label || key.replace(/^mb\./, '').split('.').join(' / ');
      if (selected.kind === 'image') {
        return <Field label={label}><input type="url" value={String(value || '')} onChange={e => updateMasterBirthday(path, e.target.value)} autoFocus placeholder="Image URL" /></Field>;
      }
      if (selected.kind === 'video') {
        return <Field label={label}><input type="url" value={String(value || '')} onChange={e => updateMasterBirthday(path, e.target.value)} autoFocus placeholder="Video URL" /></Field>;
      }
      if (typeof value === 'boolean') {
        return <Switch label={label} value={value} onChange={v => updateMasterBirthday(path, v)} />;
      }
      if (typeof value === 'number') {
        return <Field label={label}><input type="number" value={Number.isFinite(value) ? value : 0} onChange={e => updateMasterBirthday(path, Number(e.target.value))} autoFocus /></Field>;
      }
      return <Field label={label}><>{isMultiline ? <textarea rows={5} value={String(value ?? '')} onChange={e => updateMasterBirthday(path, e.target.value)} autoFocus /> : <input value={String(value ?? '')} onChange={e => updateMasterBirthday(path, e.target.value)} autoFocus />}</></Field>;
    }
    if (masterBirthday && key === 'mb.reasonsButton') {
      return <TextField value={String(mb.reasonsButton || '')} onChange={v => updateMasterBirthday(['reasonsButton'], v)} />;
    }
    if (masterBirthday && key === 'mb.reasonsTitle') {
      return <TextField value={String(mb.reasonsTitle || '')} multiline={false} onChange={v => updateMasterBirthday(['reasonsTitle'], v)} />;
    }
    if (masterBirthday && key === 'mb.reasonsNote') {
      return <TextField value={String(mb.reasonsNote || '')} multiline onChange={v => updateMasterBirthday(['reasonsNote'], v)} />;
    }
    if (masterBirthday && key === 'reasonsButton') {
      return <TextField value={String(mb.reasonsButton || content.reasonsButton || '')} onChange={v => updateMasterBirthday(['reasonsButton'], v)} />;
    }
    if (masterBirthday && key === 'reasonsTitle') {
      return <TextField value={String(mb.reasonsTitle || '')} onChange={v => updateMasterBirthday(['reasonsTitle'], v)} />;
    }
    if (masterBirthday && key === 'photoTitle') {
      return <TextField value={String(mb.photoTitle || '')} onChange={v => updateMasterBirthday(['photoTitle'], v)} />;
    }
    if (masterBirthday && key === 'photoSubtitle') {
      return <TextField value={String(mb.photoSubtitle || '')} multiline onChange={v => updateMasterBirthday(['photoSubtitle'], v)} />;
    }
    if (masterBirthday && key === 'photoNextButton') {
      return <TextField value={String(mb.photoNextButton || '')} onChange={v => updateMasterBirthday(['photoNextButton'], v)} />;
    }
    if (masterBirthday && key === 'videoTitle') {
      return <TextField value={String(mb.videoTitle || '')} onChange={v => updateMasterBirthday(['videoTitle'], v)} />;
    }
    if (masterBirthday && key === 'videoCaption') {
      return <TextField value={String(mb.videoCaption || '')} multiline onChange={v => updateMasterBirthday(['videoCaption'], v)} />;
    }
    if (masterBirthday && key === 'videoNextButton') {
      return <TextField value={String(mb.videoNextButton || '')} onChange={v => updateMasterBirthday(['videoNextButton'], v)} />;
    }
    if (masterBirthday && key === 'reasons' && typeof selected.index === 'number') {
      const items = Array.isArray(mb.reasons) ? [...mb.reasons] : []; const i=selected.index; const item=items[i]||{text:'',emoji:'✨'};
      const setItem=(patch:Record<string,any>)=>{const n=items.slice();n[i]={...item,...patch};onTemplateConfigChange({masterBirthday:{...mb,reasons:n}})};
      return <><div className="universal-editor-media-head"><div className="universal-editor-icon">♡</div><div><b>Reason {i+1}</b><span>Edit emoji or message, or remove this reason</span></div></div><Field label="Emoji"><input value={String(item.emoji||'')} onChange={e=>setItem({emoji:e.target.value})}/></Field><Field label="Reason"><textarea rows={5} value={String(item.text||'')} onChange={e=>setItem({text:e.target.value})}/></Field><Danger onClick={()=>onTemplateConfigChange({masterBirthday:{...mb,reasons:items.filter((_,k)=>k!==i)}})} /></>;
    }
    if (masterBirthday && key === 'mb.letter.paragraphs' && typeof selected.index === 'number') {
      const lines = Array.isArray(mb.letter?.paragraphs) ? [...mb.letter.paragraphs] : []; const i=selected.index;
      return <><Field label={`Letter paragraph ${i+1}`}><textarea rows={5} autoFocus value={String(lines[i]||'')} onChange={e=>{const n=lines.slice();n[i]=e.target.value;onTemplateConfigChange({masterBirthday:{...mb,letter:{...(mb.letter||{}),paragraphs:n}}})}} /></Field><div className="universal-editor-grid"><button type="button" className="builder-mini-btn" onClick={()=>onTemplateConfigChange({masterBirthday:{...mb,letter:{...(mb.letter||{}),paragraphs:lines.filter((_,k)=>k!==i)}}})}>Delete paragraph</button><button type="button" className="builder-mini-btn" onClick={()=>onTemplateConfigChange({masterBirthday:{...mb,letter:{...(mb.letter||{}),paragraphs:[...lines,'New paragraph']}}})}>＋ Add paragraph</button></div></>;
    }
    if (masterBirthday && key === 'gallery' && typeof selected.index === 'number') {
      const items = Array.isArray(mb.gallery) ? [...mb.gallery] : [];
      const i = selected.index;
      const item = items[i] || { url:'', title:'', caption:'', date:'', alt:'' };
      const setItem = (patch: Record<string, any>) => { const n=items.slice(); n[i]={...item,...patch}; onTemplateConfigChange({ masterBirthday:{...mb,gallery:n} }); };
      return <><div className="universal-editor-media-head"><div className="universal-editor-icon"><ImagePlus size={16}/></div><div><b>Photo / Memory</b><span>Edit this photo, caption, date and alt text</span></div></div><InlineMediaField value={String(item.url||'')} placeholder="Photo URL or uploaded photo" accept="image/*" folder="gallery" websiteId={websiteId} onChange={url=>setItem({url})}/><Field label="Title"><input value={String(item.title||'')} onChange={e=>setItem({title:e.target.value})}/></Field><Field label="Caption"><textarea rows={3} value={String(item.caption||'')} onChange={e=>setItem({caption:e.target.value})}/></Field><Field label="Date / label"><input value={String(item.date||'')} onChange={e=>setItem({date:e.target.value})}/></Field><Field label="Alt text"><input value={String(item.alt||'')} onChange={e=>setItem({alt:e.target.value})}/></Field><Danger onClick={()=>onTemplateConfigChange({masterBirthday:{...mb,gallery:items.filter((_,k)=>k!==i)}})} /></>;
    }
    if (masterBirthday && key === 'videos' && typeof selected.index === 'number') {
      const items = Array.isArray(mb.videos) ? [...mb.videos] : []; const i=selected.index; const item=items[i]||{url:'',title:'',caption:'',poster:'',alt:''};
      const setItem=(patch:Record<string,any>)=>{const n=items.slice();n[i]={...item,...patch};onTemplateConfigChange({masterBirthday:{...mb,videos:n}})};
      const addVideo=()=>onTemplateConfigChange({masterBirthday:{...mb,videos:[...items,{id:String(Date.now()),url:'',title:'New Video',caption:'',poster:'',alt:''}]}});
      const duplicate=()=>onTemplateConfigChange({masterBirthday:{...mb,videos:[...items,{...item,id:String(Date.now()),title:String(item.title||'Video')+' copy'}]}});
      return <><div className="universal-editor-media-head"><div className="universal-editor-icon"><Video size={16}/></div><div><b>Video</b><span>Replace video, caption and poster. Add another video anytime.</span></div></div><SingleMediaUpload kind="video" url={String(item.url||'')} websiteId={websiteId} onChange={url=>setItem({url})}/><Field label="Title"><input value={String(item.title||'')} onChange={e=>setItem({title:e.target.value})}/></Field><Field label="Caption"><textarea rows={3} value={String(item.caption||'')} onChange={e=>setItem({caption:e.target.value})}/></Field><Field label="Thumbnail / poster"><input value={String(item.poster||'')} onChange={e=>setItem({poster:e.target.value})}/></Field><Field label="Alt text"><input value={String(item.alt||'')} onChange={e=>setItem({alt:e.target.value})}/></Field><div className="universal-editor-grid"><button type="button" className="builder-mini-btn" onClick={duplicate}>Duplicate video</button><button type="button" className="builder-mini-btn" onClick={addVideo}>＋ Add video</button></div><Danger onClick={()=>onTemplateConfigChange({masterBirthday:{...mb,videos:items.filter((_,k)=>k!==i)}})} /></>;
    }
    if (masterBirthday && key === 'soundtrack' && typeof selected.index === 'number') {
      const items=Array.isArray(mb.soundtrack)?[...mb.soundtrack]:[]; const i=selected.index; const item=items[i]||{id:String(Date.now()),title:'Track',url:'',enabled:true}; const setItem=(patch:Record<string,any>)=>{const n=items.slice();n[i]={...item,...patch};onTemplateConfigChange({masterBirthday:{...mb,soundtrack:n}})};
      return <><div className="universal-editor-media-head"><div className="universal-editor-icon"><Music2 size={16}/></div><div><b>Soundtrack</b><span>Direct audio, YouTube or Spotify source</span></div></div><InlineMediaField value={String(item.url||'')} placeholder="MP3 / YouTube / Spotify URL" accept="audio/*" folder="music" websiteId={websiteId} onChange={url=>setItem({url})}/><Field label="Title"><input value={String(item.title||'')} onChange={e=>setItem({title:e.target.value})}/></Field><Switch label="Enabled" value={item.enabled!==false} onChange={v=>setItem({enabled:v})}/><Danger onClick={()=>onTemplateConfigChange({masterBirthday:{...mb,soundtrack:items.filter((_,k)=>k!==i)}})} /></>;
    }
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
  }, [selected, content, templateId, websiteId, key, common, master, templateConfig]);

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
