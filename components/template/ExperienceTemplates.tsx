'use client';
import React from 'react';
import type { BirthdayContent } from '@/lib/types';
import WeddingProposalTemplate from './WeddingProposalTemplate';

const presets: Record<string,{label:string;eyebrow:string;headline:string;accent:string;surface:string;emoji:string}> = {
  birthday:{label:'Birthday',eyebrow:'A day made just for you',headline:'Celebrate the person who makes every day brighter.',accent:'#ec4899',surface:'#1b1020',emoji:'🎂'},
  anniversary:{label:'Anniversary',eyebrow:'Another chapter together',headline:'A beautiful story deserves another beautiful chapter.',accent:'#ef4444',surface:'#210f16',emoji:'💞'},
  proposal:{label:'Proposal',eyebrow:'The big question',headline:'A once-in-a-lifetime moment, made completely yours.',accent:'#f97316',surface:'#1a1010',emoji:'💍'},
  wedding:{label:'Wedding',eyebrow:'A day worth remembering',headline:'Two hearts, one unforgettable beginning.',accent:'#c4a27a',surface:'#17130f',emoji:'💒'},
  sorry:{label:'Sorry',eyebrow:'From my heart',headline:'Some words matter most when they are truly meant.',accent:'#60a5fa',surface:'#111827',emoji:'🥺'},
  'miss-you':{label:'Miss You',eyebrow:'Distance feels a little smaller',headline:'For the person I wish was here right now.',accent:'#a78bfa',surface:'#141126',emoji:'💌'},
  'thank-you':{label:'Thank You',eyebrow:'A little gratitude',headline:'For everything you do, and everything you are.',accent:'#22c55e',surface:'#0f1a14',emoji:'💐'},
  congratulations:{label:'Congratulations',eyebrow:'You did it',headline:'This moment belongs to you—celebrate it.',accent:'#f59e0b',surface:'#1a1508',emoji:'🏆'},
  graduation:{label:'Graduation',eyebrow:'The next chapter starts now',headline:'Look how far you have come. Now go even further.',accent:'#38bdf8',surface:'#0b1520',emoji:'🎓'},
  friendship:{label:'Friendship',eyebrow:'For my favorite human',headline:'Life is better, louder and brighter with you in it.',accent:'#fb7185',surface:'#1a1014',emoji:'🤝'},
  surprise:{label:'Surprise',eyebrow:'One little secret',headline:'Something wonderful has been waiting just for you.',accent:'#8b5cf6',surface:'#120f1d',emoji:'🎁'},
  romantic:{label:'Romantic',eyebrow:'A love note in motion',headline:'For someone who makes ordinary days unforgettable.',accent:'#f43f5e',surface:'#fff1f2',emoji:'🌹'},
  cute:{label:'Cute',eyebrow:'Tiny moments. Big smiles.',headline:'A pocket-sized celebration made just for you.',accent:'#f59e0b',surface:'#fffbeb',emoji:'🧸'},
  luxury:{label:'Luxury',eyebrow:'An elegant celebration',headline:'A timeless moment, beautifully presented.',accent:'#a78bfa',surface:'#111827',emoji:'✨'},
  anime:{label:'Anime',eyebrow:'Main character energy',headline:'Your next chapter starts with a legendary celebration.',accent:'#22d3ee',surface:'#07111f',emoji:'⚡'},
  gaming:{label:'Gaming',eyebrow:'Achievement unlocked',headline:'LEVEL UP! Today belongs to you.',accent:'#34d399',surface:'#07110d',emoji:'🎮'},
  minimal:{label:'Minimal',eyebrow:'Simply, sincerely',headline:'A beautiful day for a beautiful person.',accent:'#0f172a',surface:'#f8fafc',emoji:'◌'},
  elegant:{label:'Elegant',eyebrow:'With warmest wishes',headline:'Celebrating you, and all the wonderful days ahead.',accent:'#92400e',surface:'#fffbeb',emoji:'🕊️'},
  festival:{label:'Festival',eyebrow:'Let the celebration begin',headline:'More color. More laughter. More reasons to celebrate.',accent:'#db2777',surface:'#fdf2f8',emoji:'🎊'},
};

function MissYouTemplate({ content }: { content: BirthdayContent }) {
  const [config, setConfig] = React.useState(() => ({ ...getMissYouDefaults(), ...(content.templateConfig || {}) }));
  React.useEffect(() => {
    const next = { ...getMissYouDefaults(), ...(content.templateConfig || {}) };
    setConfig(next);
  }, [content.templateConfig]);
  const src = React.useMemo(() => `/templates/miss-you-1/index.html?config=${encodeURIComponent(JSON.stringify(config))}`, [config]);
  return <iframe title="Miss You 1" src={src} style={{ width: '100%', height: '100vh', minHeight: 760, border: 0, display: 'block', background: '#ffe' }} />;
}

export function getMissYouDefaults() {
  return {
    name1: 'Anarkoli', name2: 'Selim', connector: 'and', together: 'together',
    memorialDate: '2017-12-25T00:00:00', seedText: 'Miss You',
    paragraph1: [
      'Someday when I am old, I will still be as deeply in love with you as ever,',
      'sending you messages from my desk,',
      'the lamp glowing softly, wind and rain beyond the window,',
      "taking half a day to brew a single 'I miss you',",
      'in the wilderness of my heart,',
      'now meteors chase the moon, now ten thousand horses gallop.'
    ],
    paragraph2: [
      'Sometimes when the moon is out,',
      'I dream a winding dream with nine turns and eighteen bends,',
      'every corner has something to do with you,',
      'you smile at me once,',
      'and I spend the whole day dazed after waking.'
    ],
    paragraph3: [
      'Now I am in a night full of stars,',
      'red beans hang heavy on the branches by the steps,',
      'only after being drunk do you know how strong the wine is,',
      'nothing can match this longing.'
    ],
    timePrefix: 'Day ', dayLabel: ' days', hourLabel: ' hours', minuteLabel: ' minutes', secondLabel: ' seconds', musicUrl: ''
  } as Record<string, unknown>;
}

export default function ExperienceTemplate({variant='romantic',content}:{variant?:string;content:BirthdayContent}){
 if (variant === 'wedding-proposal') return <WeddingProposalTemplate content={content} />;
 if (variant === 'miss-you-1') return <MissYouTemplate content={content} />;
 const p=presets[variant]||presets.romantic; const gallery=content.gallery||[];
 return <div style={{minHeight:'100%',background:p.surface,color:variant==='minimal'||variant==='elegant'?'#111827':'white',fontFamily:'ui-sans-serif,system-ui'}}>
  <section style={{padding:'72px 24px',textAlign:'center',background:`radial-gradient(circle at 20% 10%, ${p.accent}55, transparent 35%), ${p.surface}`}}>
   <div style={{fontSize:42}}>{p.emoji}</div><p style={{letterSpacing:3,textTransform:'uppercase',fontSize:12,color:p.accent,fontWeight:800}}>{p.eyebrow}</p>
   <h1 style={{fontSize:'clamp(38px,8vw,78px)',lineHeight:1.02,maxWidth:900,margin:'18px auto',fontWeight:900}}>{content.name ? `${content.name}, ${p.headline}` : p.headline}</h1>
   <p style={{maxWidth:650,margin:'20px auto',opacity:.75,fontSize:18}}>{content.heroSubtitle || 'A personalized celebration, made to be remembered.'}</p>
   {content.birthday && <div style={{display:'inline-block',marginTop:14,padding:'10px 18px',borderRadius:999,border:`1px solid ${p.accent}66`}}>{new Date(content.birthday).toLocaleDateString()}</div>}
  </section>
  <section style={{maxWidth:1050,margin:'0 auto',padding:'55px 24px'}}>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:18}}>
    {(content.reasons?.length?content.reasons:['Beautiful memories','Little moments','A whole lot of joy']).map((x,i)=><article key={i} style={{padding:24,borderRadius:24,background:variant==='minimal'||variant==='elegant'?'white':'rgba(255,255,255,.06)',border:`1px solid ${p.accent}33`}}><b style={{color:p.accent}}>0{i+1}</b><p style={{marginTop:10,fontSize:18}}>{x}</p></article>)}
   </div>
   {gallery.length>0 && <div style={{marginTop:55}}><h2 style={{fontSize:30,fontWeight:800,marginBottom:20}}>Moments worth keeping</h2><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14}}>{gallery.map((g,i)=><img key={i} src={g.url} alt={g.caption||`Memory ${i+1}`} style={{width:'100%',aspectRatio:'1',objectFit:'cover',borderRadius:22}} />)}</div></div>}
   <div style={{marginTop:55,padding:'35px 28px',borderRadius:28,background:`linear-gradient(135deg, ${p.accent}22, transparent)`,border:`1px solid ${p.accent}44`}}><p style={{fontSize:14,textTransform:'uppercase',letterSpacing:2,color:p.accent,fontWeight:800}}>Today & always</p><p style={{fontSize:24,lineHeight:1.5,marginTop:12}}>{content.greeting || 'Wishing you the very best.'}</p></div>
  </section>
 </div>;
}
