'use client';
import { useRef, useState } from 'react';
import { ImagePlus, Music2, Video, Upload, Trash2, CheckCircle2 } from 'lucide-react';
import type { GalleryItem } from '@/lib/types';

export async function uploadFile(file: File, folder: string, websiteId: string): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('folder', folder);
  fd.append('websiteId', websiteId);
  const r = await fetch('/api/upload', { method: 'POST', body: fd });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || 'Upload failed');
  return j.url as string;
}

// Single-file uploader for music/video: no URL field, just pick a file and it
// uploads straight to storage.
export function SingleMediaUpload({
  kind,
  url,
  onChange,
  websiteId,
}: {
  kind: 'audio' | 'video';
  url: string;
  onChange: (url: string) => void;
  websiteId: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const isVideo = kind === 'video';

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true); setError('');
    try {
      const uploaded = await uploadFile(file, isVideo ? 'video' : 'music', websiteId);
      onChange(uploaded);
    } catch (err: any) { setError(err.message || 'Upload failed'); }
    finally { setBusy(false); }
  }

  return <div className="space-y-3">
    <div className="builder-media-drop">
      <div className="flex min-w-0 items-center gap-3">
        <div className="builder-media-drop-icon">{isVideo ? <Video size={19}/> : <Music2 size={19}/>}</div>
        <div className="min-w-0"><h4>{isVideo ? 'Add your special video' : 'Choose your soundtrack'}</h4><p>{isVideo ? 'MP4, WebM or MOV · up to 25 MB' : 'MP3, WAV, OGG or M4A · up to 25 MB'}</p></div>
      </div>
      <button type="button" className="builder-upload-btn" onClick={() => inputRef.current?.click()} disabled={busy}><Upload size={14}/>{busy ? 'Uploading…' : url ? 'Replace file' : 'Choose file'}</button>
    </div>
    {url && <div className="builder-media-preview">
      {isVideo ? <video controls src={url} className="w-full rounded-xl max-h-72 bg-black"/> : <audio controls src={url} className="w-full"/>}
      <div className="mt-3 flex items-center justify-between gap-3"><span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600"><CheckCircle2 size={14}/> Ready to use</span><button type="button" className="builder-secondary-upload" onClick={() => onChange('')} disabled={busy}><Trash2 size={14}/> Remove</button></div>
    </div>}
    <input ref={inputRef} type="file" accept={isVideo ? 'video/*' : 'audio/*'} className="hidden" onChange={pick}/>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>;
}

// Small "text field + upload button" combo for use inside list rows (a museum
// item's photo/video, a song's audio/album art). Keeps the URL text field
// (for people who already have a YouTube/Spotify link) but adds a one-tap
// "Choose file" option next to it, so nobody is forced to know what a URL is.
export function InlineMediaField({
  value,
  onChange,
  placeholder,
  accept,
  folder,
  websiteId,
}: {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  accept: string;
  folder: string;
  websiteId: string;
}) {
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try { onChange(await uploadFile(file, folder, websiteId)); }
    catch (err: any) { alert(err.message || 'Upload failed'); }
    finally { setBusy(false); }
  }

  return <div className="builder-inline-media">
    <input value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} />
    <button type="button" className="builder-inline-upload-btn" onClick={() => inputRef.current?.click()} disabled={busy}>
      <Upload size={12} />{busy ? 'Uploading…' : 'Choose file'}
    </button>
    <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={pick} />
  </div>;
}

export function GalleryUpload({
  items,
  onChange,
  websiteId,
}: {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  websiteId: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []); e.target.value = '';
    if (!files.length) return;
    setBusy(true); setError('');
    try {
      const uploaded: GalleryItem[] = [];
      for (const file of files) uploaded.push({ url: await uploadFile(file, 'gallery', websiteId) });
      onChange([...items, ...uploaded]);
    } catch (err: any) { setError(err.message || 'Upload failed'); }
    finally { setBusy(false); }
  }

  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }

  return <div className="space-y-3">
    <div className="builder-media-drop">
      <div className="flex min-w-0 items-center gap-3"><div className="builder-media-drop-icon"><ImagePlus size={19}/></div><div className="min-w-0"><h4>Add your memories</h4><p>Choose one or many photos · JPG, PNG, WebP or GIF · up to 25 MB each</p></div></div>
      <button type="button" className="builder-upload-btn" onClick={() => inputRef.current?.click()} disabled={busy}><ImagePlus size={14}/>{busy ? 'Uploading…' : 'Choose photos'}</button>
    </div>
    {items.length > 0 ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((item, i) => <div key={item.url + i} className="group overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="relative"><img src={item.url} alt={item.caption || ''} className="h-28 w-full object-cover"/><button type="button" onClick={() => remove(i)} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-black/65 text-white opacity-0 transition group-hover:opacity-100" aria-label={`Remove photo ${i+1}`}><Trash2 size={13}/></button></div>
        <input className="!rounded-none !border-0 !border-t !border-slate-200 !bg-white !text-xs !text-slate-700" placeholder="Add a caption…" value={item.caption || ''} onChange={e => onChange(items.map((x, idx) => idx === i ? {...x, caption: e.target.value} : x))}/>
      </div>)}
    </div> : <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center"><ImagePlus className="mx-auto text-slate-400" size={24}/><p className="mt-2 text-xs text-slate-500">No photos yet. Add a few memories and they will appear here immediately.</p></div>}
    <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={pick}/>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>;
}
