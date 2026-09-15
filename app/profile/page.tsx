
'use client';
import { useEffect, useRef, useState } from 'react';

export default function Page(){
 const [p,setP]=useState<any>({}),[msg,setMsg]=useState('');
 const [uploading,setUploading]=useState(false);
 const inputRef=useRef<HTMLInputElement>(null);
 useEffect(()=>{fetch('/api/profile').then(r=>r.ok?r.json():{}).then(setP).catch(()=>{})},[]);
 async function save(next=p){
   setMsg('Saving...');
   const r=await fetch('/api/profile',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(next)});
   setMsg(r.ok?'Profile saved!':'Could not save');
 }
 async function pickPhoto(e: React.ChangeEvent<HTMLInputElement>){
   const file=e.target.files?.[0]; e.target.value=''; if(!file) return;
   if(!file.type.startsWith('image/')){setMsg('Please choose an image file.');return;}
   if(file.size>8*1024*1024){setMsg('Image must be 8 MB or smaller.');return;}
   setUploading(true); setMsg('Uploading photo...');
   try{
     const fd=new FormData(); fd.append('file',file); fd.append('folder','profile');
     const r=await fetch('/api/upload',{method:'POST',body:fd});
     const j=await r.json();
     if(!r.ok) throw new Error(j.error||'Upload failed');
     const next={...p,avatarUrl:j.url}; setP(next);
     const pr=await fetch('/api/profile',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(next)});
     if(!pr.ok) throw new Error('Photo uploaded but profile could not be saved.');
     setMsg('Profile photo updated!');
   }catch(err:any){setMsg(err.message||'Photo upload failed');}
   finally{setUploading(false);}
 }
 return <main className="mx-auto max-w-3xl p-6 md:p-10">
   <div className="card p-6 md:p-8">
     <h1 className="text-3xl font-bold">Profile Settings</h1>
     <p className="mt-2 text-zinc-400">Update the profile information shown on your public creator profile.</p>
     <div className="mt-6 grid gap-5">
       <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
         <button type="button" onClick={()=>inputRef.current?.click()} className="group relative h-24 w-24 overflow-hidden rounded-full bg-white/10 ring-1 ring-white/10" aria-label="Change profile photo">
           {p.avatarUrl?<img src={p.avatarUrl} alt="Profile" className="h-full w-full object-cover"/>:<div className="grid h-full place-items-center text-3xl">👤</div>}
           <span className="absolute inset-x-0 bottom-0 bg-black/60 py-1 text-center text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100">Change</span>
         </button>
         <div>
           <button type="button" className="btn" onClick={()=>inputRef.current?.click()} disabled={uploading}>{uploading?'Uploading…':'Upload profile photo'}</button>
           <p className="mt-2 text-xs text-zinc-500">JPG, PNG, WebP or GIF • up to 8 MB</p>
           <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={pickPhoto}/>
         </div>
       </div>
       <label>Display name<input className="mt-1" value={p.name||''} onChange={e=>setP({...p,name:e.target.value})}/></label>
       <label>Bio<textarea className="mt-1" rows={5} value={p.bio||''} onChange={e=>setP({...p,bio:e.target.value})}/></label>
       <button className="btn" onClick={()=>save()} disabled={uploading}>Save Profile</button>
       {msg&&<p className="text-emerald-400">{msg}</p>}
     </div>
   </div>
 </main>
}
