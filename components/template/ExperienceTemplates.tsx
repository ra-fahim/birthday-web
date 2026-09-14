'use client';
import type { BirthdayContent } from '@/lib/types';

const presets: Record<string,{label:string;eyebrow:string;headline:string;accent:string;surface:string;emoji:string;light?:boolean}> = {
  romantic:{label:'Anniversary',eyebrow:'A love story worth keeping',headline:'For the person who makes life feel like home.',accent:'#f43f5e',surface:'#fff1f2',emoji:'💕',light:true},
  proposal:{label:'Proposal',eyebrow:'One very important question',headline:'Some questions deserve a beautiful moment.',accent:'#f59e0b',surface:'#111827',emoji:'💍'},
  wedding:{label:'Wedding',eyebrow:'Forever starts here',headline:'Two hearts, one beautiful next chapter.',accent:'#c084fc',surface:'#fdfaf5',emoji:'💐',light:true},
  sorry:{label:'Sorry',eyebrow:'From the heart',headline:'I know I hurt you. Let me make this right.',accent:'#2563eb',surface:'#eff6ff',emoji:'🥺',light:true},
  'miss-you':{label:'Miss You',eyebrow:'A little note across the distance',headline:'I miss your laugh, your presence, your little things.',accent:'#818cf8',surface:'#0f1021',emoji:'🌙'},
  'thank-you':{label:'Thank You',eyebrow:'A note of gratitude',headline:'Some people deserve more than a simple thank you.',accent:'#14b8a6',surface:'#f0fdfa',emoji:'💌',light:true},
  congratulations:{label:'Congratulations',eyebrow:'You did it',headline:'This win deserves its own moment.',accent:'#22c55e',surface:'#07110d',emoji:'🏆'},
  graduation:{label:'Graduation',eyebrow:'Next chapter unlocked',headline:'Look how far you’ve come. Now go make what’s next.',accent:'#0ea5e9',surface:'#eff6ff',emoji:'🎓',light:true},
  friendship:{label:'Friendship',eyebrow:'For my favorite human',headline:'Life is better, louder and funnier with you in it.',accent:'#f97316',surface:'#fff7ed',emoji:'🤝',light:true},
  surprise:{label:'Surprise',eyebrow:'Keep this between us',headline:'There is something waiting for you…',accent:'#ec4899',surface:'#1a1020',emoji:'🎁'},
  festival:{label:'Festival',eyebrow:'Let the celebration begin',headline:'More color. More laughter. More reasons to celebrate.',accent:'#db2777',surface:'#fdf2f8',emoji:'🎊',light:true},
  'birthday-sweet':{label:'Birthday',eyebrow:'Tiny moments. Big smiles.',headline:'A pocket-sized celebration made just for you.',accent:'#f59e0b',surface:'#fffbeb',emoji:'🧁',light:true},
  'birthday-festival':{label:'Birthday',eyebrow:'The party starts now',headline:'Today is brighter because it belongs to you.',accent:'#ec4899',surface:'#fff1f2',emoji:'🎉',light:true},
  gaming:{label:'Gaming',eyebrow:'Achievement unlocked',headline:'LEVEL UP! Today belongs to you.',accent:'#34d399',surface:'#07110d',emoji:'🎮'},
  anime:{label:'Anime',eyebrow:'Main character energy',headline:'Your next chapter starts with a legendary celebration.',accent:'#22d3ee',surface:'#07111f',emoji:'⚡'},
  minimal:{label:'Minimal',eyebrow:'Simply, sincerely',headline:'A beautiful message for a beautiful person.',accent:'#0f172a',surface:'#f8fafc',emoji:'◌',light:true},
  cute:{label:'Cute',eyebrow:'Tiny moments. Big smiles.',headline:'A pocket-sized celebration made just for you.',accent:'#f59e0b',surface:'#fffbeb',emoji:'🧸',light:true},
  luxury:{label:'Luxury',eyebrow:'An elegant celebration',headline:'A timeless moment, beautifully presented.',accent:'#a78bfa',surface:'#111827',emoji:'✨'},
  elegant:{label:'Elegant',eyebrow:'With warmest wishes',headline:'Celebrating you, and all the wonderful days ahead.',accent:'#92400e',surface:'#fffbeb',emoji:'🕊️',light:true},
  master:{label:'Birthday',eyebrow:'A magical birthday experience',headline:'A special day for someone special.',accent:'#ec4899',surface:'#fdf2f8',emoji:'🎂',light:true},
};

export default function ExperienceTemplate({variant='romantic',content}:{variant?:string;content:BirthdayContent}){
 const p=presets[variant]||presets.master; const gallery=content.gallery||[]; const ink=p.light?'#111827':'#fff';
 return <div style={{minHeight:'100%',background:p.surface,color:ink,fontFamily:'ui-sans-serif,system-ui'}}>
  <section style={{padding:'72px 24px',textAlign:'center',background:`radial-gradient(circle at 20% 10%, ${p.accent}55, transparent 35%), ${p.surface}`}}>
   <div style={{fontSize:42}}>{p.emoji}</div><p style={{letterSpacing:3,textTransform:'uppercase',fontSize:12,color:p.accent,fontWeight:800}}>{p.eyebrow}</p>
   <h1 style={{fontSize:'clamp(38px,8vw,78px)',lineHeight:1.02,maxWidth:900,margin:'18px auto',fontWeight:900}}>{content.name ? `${content.name}, ${p.headline}` : p.headline}</h1>
   <p style={{maxWidth:650,margin:'20px auto',opacity:.72,fontSize:18}}>{content.heroSubtitle || 'A personalized celebration, made to be remembered.'}</p>
   {content.birthday && <div style={{display:'inline-block',marginTop:14,padding:'10px 18px',borderRadius:999,border:`1px solid ${p.accent}66`}}>{new Date(content.birthday).toLocaleDateString()}</div>}
  </section>
  <section style={{maxWidth:1050,margin:'0 auto',padding:'55px 24px'}}>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:18}}>
    {(content.reasons?.length?content.reasons:['Beautiful memories','Little moments','A whole lot of joy']).map((x,i)=><article key={i} style={{padding:24,borderRadius:24,background:p.light?'rgba(255,255,255,.75)':'rgba(255,255,255,.06)',border:`1px solid ${p.accent}33`}}><b style={{color:p.accent}}>0{i+1}</b><p style={{marginTop:10,fontSize:18}}>{x}</p></article>)}
   </div>
   {gallery.length>0 && <div style={{marginTop:55}}><h2 style={{fontSize:30,fontWeight:800,marginBottom:20}}>Moments worth keeping</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14}}>{gallery.map((g,i)=><img key={i} src={g.url} alt={g.caption||`Memory ${i+1}`} style={{width:'100%',aspectRatio:'1',objectFit:'cover',borderRadius:22}} />)}</div></div>}
   <div style={{marginTop:55,padding:'35px 28px',borderRadius:28,background:`linear-gradient(135deg, ${p.accent}22, transparent)`,border:`1px solid ${p.accent}44`}}><p style={{fontSize:14,textTransform:'uppercase',letterSpacing:2,color:p.accent,fontWeight:800}}>Made for this moment</p><p style={{fontSize:24,lineHeight:1.5,marginTop:12}}>{content.greeting || 'Wishing you the very best.'}</p></div>
  </section>
 </div>;
}
