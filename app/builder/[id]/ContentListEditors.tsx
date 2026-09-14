'use client';
import { useState } from 'react';
import type { BirthdayContent } from '@/lib/types';

type Props = { content: BirthdayContent; onChange: (c: BirthdayContent) => void };

export function TimelineEditor({ content, onChange }: Props) {
  const [draft, setDraft] = useState({ date: '', title: '', description: '' });
  function add() { if (!draft.date.trim() && !draft.title.trim() && !draft.description.trim()) return; onChange({ ...content, timeline: [...content.timeline, { ...draft }] }); setDraft({ date: '', title: '', description: '' }); }
  function edit(i: number, key: 'date'|'title'|'description', value: string) { onChange({ ...content, timeline: content.timeline.map((item, idx) => idx === i ? { ...item, [key]: value } : item) }); }
  return <div>
    <p className="text-zinc-400">Create milestones and edit them directly after adding.</p>
    <div className="mt-3 grid gap-2 md:grid-cols-3"><input placeholder="Date" value={draft.date} onChange={e=>setDraft({...draft,date:e.target.value})}/><input placeholder="Title" value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/><input placeholder="Description" value={draft.description} onChange={e=>setDraft({...draft,description:e.target.value})}/></div>
    <button className="btn2 mt-2" onClick={add}>+ Add moment</button>
    <div className="mt-4 space-y-3">{content.timeline.map((t,i)=><div key={i} className="rounded-2xl bg-white/5 p-3"><div className="grid gap-2 md:grid-cols-3"><input value={t.date} onChange={e=>edit(i,'date',e.target.value)}/><input value={t.title} onChange={e=>edit(i,'title',e.target.value)}/><input value={t.description} onChange={e=>edit(i,'description',e.target.value)}/></div><button className="mt-2 text-xs text-red-300" onClick={()=>onChange({...content,timeline:content.timeline.filter((_,idx)=>idx!==i)})}>Remove moment</button></div>)}{!content.timeline.length&&<p className="text-sm text-zinc-500">No timeline moments yet.</p>}</div>
  </div>;
}

export function MemoriesEditor({ content, onChange }: Props) {
  const [draft, setDraft] = useState('');
  function add(){if(!draft.trim())return;onChange({...content,memories:[...content.memories,draft.trim()]});setDraft('');}
  function edit(i:number,value:string){onChange({...content,memories:content.memories.map((m,idx)=>idx===i?value:m)});}
  return <div><p className="text-zinc-400">Short memory notes — fully editable after adding.</p><div className="mt-3 flex gap-2"><input placeholder="e.g. That road trip to Cox's Bazar" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();add()}}}/><button className="btn2" onClick={add}>+ Add</button></div><div className="mt-4 space-y-2">{content.memories.map((m,i)=><div key={i} className="flex gap-2"><textarea rows={2} className="flex-1" value={m} onChange={e=>edit(i,e.target.value)}/><button className="btn2 h-fit" onClick={()=>onChange({...content,memories:content.memories.filter((_,idx)=>idx!==i)})}>×</button></div>)}{!content.memories.length&&<p className="text-sm text-zinc-500">No memories added yet.</p>}</div></div>;
}

export function WishlistEditor({ content, onChange }: Props) {
  const [draft, setDraft] = useState('');
  function add(){if(!draft.trim())return;onChange({...content,wishlist:[...content.wishlist,draft.trim()]});setDraft('');}
  return <div><p className="text-zinc-400">Gift ideas or future wishes — edit them directly in the list.</p><div className="mt-3 flex gap-2"><input placeholder="e.g. A good pair of headphones" value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();add()}}}/><button className="btn2" onClick={add}>+ Add</button></div><div className="mt-4 space-y-2">{content.wishlist.map((w,i)=><div key={i} className="flex gap-2"><input className="flex-1" value={w} onChange={e=>onChange({...content,wishlist:content.wishlist.map((x,idx)=>idx===i?e.target.value:x)})}/><button className="btn2" onClick={()=>onChange({...content,wishlist:content.wishlist.filter((_,idx)=>idx!==i)})}>×</button></div>)}{!content.wishlist.length&&<p className="text-sm text-zinc-500">No wishlist items yet.</p>}</div></div>;
}

export function GuestbookToggle({ content, onChange }: Props) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><label className="flex items-center gap-3 text-sm"><input className="!w-5 !h-5" type="checkbox" checked={content.guestbook} onChange={e=>onChange({...content,guestbook:e.target.checked})}/><span><b>Allow guestbook messages</b><small className="block text-zinc-500 mt-1">Visitors can leave public messages on the experience.</small></span></label></div>;
}
