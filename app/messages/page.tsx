'use client';
import Link from 'next/link';
import { useEffect,useState } from 'react';
export default function Messages(){
 const [withId,setWithId]=useState(''); const [messages,setMessages]=useState<any[]>([]); const [body,setBody]=useState(''); const [status,setStatus]=useState('');
 async function load(){if(!withId)return;const r=await fetch('/api/chat?with='+encodeURIComponent(withId));const j=await r.json();if(r.ok)setMessages(j.messages||[]);else setStatus(j.error||'Could not load chat')}
 useEffect(()=>{const p=new URLSearchParams(location.search);const id=p.get('with')||'';setWithId(id)},[]);
 useEffect(()=>{if(withId)load()},[withId]);
 async function send(){if(!body.trim())return;setStatus('Sending…');const r=await fetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({recipientId:withId,body})});const j=await r.json();if(!r.ok){setStatus(j.error||'Failed');return}setMessages(m=>[...m,j.message]);setBody('');setStatus('Sent');}
 return <main className="mx-auto max-w-4xl px-6 py-10"><Link href="/dashboard">← Dashboard</Link><div className="mt-8 card overflow-hidden"><header className="border-b border-white/10 p-5"><h1 className="text-2xl font-black">Messages</h1><p className="text-sm text-zinc-400">Private 1-to-1 conversations with other members.</p></header><div className="min-h-[420px] space-y-3 p-5">{!withId?<div className="text-zinc-400">Open a public celebration and choose “Message owner” to start a conversation.</div>:messages.length?messages.map(m=><div key={m.id} className="rounded-2xl bg-white/5 p-3 text-sm"><p>{m.body}</p><time className="mt-1 block text-xs text-zinc-500">{new Date(m.created_at).toLocaleString()}</time></div>):<div className="text-zinc-500">No messages yet. Say hello.</div>}</div>{withId&&<div className="border-t border-white/10 p-4"><div className="flex gap-2"><input value={body} onChange={e=>setBody(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Write a message…"/><button className="btn" onClick={send}>Send</button></div><p className="mt-2 text-xs text-zinc-500">{status}</p></div>}</div></main>;
}
