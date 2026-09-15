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

function MasterProposalTemplate({ content }: { content: BirthdayContent }) {
  const [config, setConfig] = React.useState(() => ({ ...getMasterProposalDefaults(), ...(content.templateConfig || {}) }));
  React.useEffect(() => {
    const next = { ...getMasterProposalDefaults(), ...(content.templateConfig || {}) };
    setConfig(next);
  }, [content.templateConfig]);
  const src = React.useMemo(() => `/templates/master-proposal/index.html?config=${encodeURIComponent(JSON.stringify(config))}`, [config]);
  return <iframe title="Master Proposal" src={src} style={{ width: '100%', height: '100vh', minHeight: 760, border: 0, display: 'block', background: '#FAF9F6' }} />;
}

export function getMasterProposalDefaults() {
  return {
    recipientEmail: 'rabbiahmedfahim44@gmail.com',
    toName: 'Rodney (The Best Boyfriend)',
    fromName: 'Sherry (Your Valentine)',
    fromLabel: 'Sherry',
    heroTitle: 'To My Dearest',
    heroSubtitle: 'Scroll slowly',
    story: [
      { title: 'The Beginning', body: 'It started with a simple moment, a glance that felt different from all the others. In that instant, the noise of the world faded, and I knew my life was about to change forever.' },
      { title: 'The Little Things', body: "It's the way you laugh at my terrible jokes, the warmth of your hand in mine, and the quiet comfort of just being near you. These small moments build a universe I never want to leave." },
      { title: 'The Strength', body: 'On days when the world feels heavy, you are my sanctuary. Your kindness is a beacon, guiding me back to who I want to be. You make me better, simply by being you.' },
      { title: 'The Promise', body: 'To listen when you speak, to support you when you dream, and to hold you when you need rest. My heart is a steady rhythm, beating in time with yours, today and always.' },
      { title: 'The Horizon', body: 'As we look forward, I see a future painted with our shared dreams. Hand in hand, we will write the rest of this story, creating a masterpiece of moments that lasts a lifetime.' },
    ],
    museum: [
      { id: '1', type: 'image', url: '/museum-gallery/1.jpg', title: 'The First Glance', date: 'January 2025', description: 'The moment our paths crossed personally.' },
      { id: '2', type: 'video', url: '/museum-gallery/2.mp4', thumbnail: '/museum-gallery/2-thumb.png', title: 'Samgyeopsal and Moral Support', date: 'March 2025', description: 'We shared a meal and a laugh together. I love your laughs.' },
      { id: '3', type: 'video', url: '/museum-gallery/3.mp4', thumbnail: '/museum-gallery/3-thumb.png', title: 'Anniversary Dinner', date: 'January 2026', description: 'We dressed up, ate too much, and had a great time together.' },
      { id: '4', type: 'image', url: '/museum-gallery/4.jpg', title: 'My First Birthday with You!', date: 'November 2025', description: 'We Celebrated my first birthday with you!' },
      { id: '5', type: 'video', url: '/museum-gallery/5.mp4', thumbnail: '/museum-gallery/5-thumb.jpg', title: 'Home is where you are!', date: 'June 2025', description: "Every time I see you, I feel like I'm home." },
      { id: '6', type: 'image', url: '/museum-gallery/6.jpg', title: 'Your First Birthday with Me!', date: 'October 2025', description: 'We Celebrated your first birthday with me! I love you so much!' },
    ],
    songs: [
      { id: '1', title: 'I Knew I Loved You', artist: 'Savage Garden', albumArt: '/our-soundtrack/images/i-knew-i-loved-you.jpg', note: 'For the moment I realized you were the one.', audioUrl: '/our-soundtrack/audio/i-knew-i-loved-you.mp3' },
      { id: '2', title: 'Packing It Up', artist: 'Gracie Abrams', albumArt: '/our-soundtrack/images/packing-it-up.png', note: 'Just hearing her voice reminds me of us.', audioUrl: '/our-soundtrack/audio/packing-it-up.mp3' },
      { id: '3', title: 'The Joker And The Queen', artist: 'Ed Sheeran', albumArt: '/our-soundtrack/images/the-joker-and-the-queen.png', note: 'Because we balance each other out perfectly.', audioUrl: '/our-soundtrack/audio/the-joker-and-the-queen.mp3' },
      { id: '4', title: "You'll Be In My Heart", artist: 'Phil Collins', albumArt: '/our-soundtrack/images/youll-be-in-my-heart.png', note: 'No matter where we are, you are always with me.', audioUrl: '/our-soundtrack/audio/youll-be-in-my-heart.mp3' },
      { id: '5', title: 'The Alchemy', artist: 'Taylor Swift', albumArt: '/our-soundtrack/images/the-alchemy.png', note: 'There is magic in the way we found each other.', audioUrl: '/our-soundtrack/audio/the-alchemy.mp3' },
      { id: '6', title: 'Daylight', artist: 'Taylor Swift', albumArt: '/our-soundtrack/images/daylight.png', note: "I only see daylight when I'm with you.", audioUrl: '/our-soundtrack/audio/daylight.mp3' },
      { id: '7', title: 'Give Me Your Forever', artist: 'Zack Tabudlo', albumArt: '/our-soundtrack/images/give-me-your-forever.png', note: 'All I want is your forever.', audioUrl: '/our-soundtrack/audio/give-me-your-forever.mp3' },
      { id: '8', title: "I'll Be", artist: 'Edwin McCain', albumArt: '/our-soundtrack/images/ill-be.png', note: "I'll be your crying shoulder and your greatest fan.", audioUrl: '/our-soundtrack/audio/ill-be.mp3' },
      { id: '9', title: 'Home', artist: 'Bruno Major', albumArt: '/our-soundtrack/images/home.png', note: 'You are my home, wherever we are.', audioUrl: '/our-soundtrack/audio/home.mp3' },
      { id: '10', title: 'Through The Years', artist: 'Kenny Rogers', albumArt: '/our-soundtrack/images/through-the-years.png', note: "Through all the years, you've never let me down.", audioUrl: '/our-soundtrack/audio/through-the-years.mp3' },
    ],
    loveNotes: [
      'I love how hard you work for your dreams.',
      'Your smile is literally the best part of my day.',
      'You make even boring things fun just by being there.',
      "I'm so proud of everything you've accomplished.",
      'You give the best hugs in the world.',
      "I love listening to you talk about things you're passionate about.",
      'You are beautiful, inside and out.',
      'Thank you for being my peace in a chaotic world.',
      'I admire your strength and resilience.',
      'Just thinking about you makes me smile.',
      'I love that I can be myself around you.',
      'You are my favorite person to do nothing with.',
      "I love the way your eyes light up when you're happy.",
      "You're stuck with me now (and I love it).",
      'I appreciate how caring you are.',
      'Every moment with you is a memory I cherish.',
    ],
    bucketList: [
      'Graduate Together',
      'Late Night Road Trip',
      'Travel to Japan',
      'Adopt a Puppy',
      'Cook a Fancy Meal (Without Burning It)',
      'Our First Apartment',
    ],
    finalLetter: {
      title: "Happy Valentine's Day",
      paragraphs: [
        'Words often fail to capture the depth of what I feel, but I hope this small gesture reminds you of how incredibly special you are to me.',
        'You are my best friend, my confidant, and my greatest love. Thank you for filling my days with light and my heart with peace.',
        'I love you, more than yesterday, but less than tomorrow.',
      ],
      signoff: 'Forever yours',
    },
    comfortResponses: {
      tired: { label: "I'm Tired", response: "Baby, I know you've been running on fumes lately. I see how hard you're working, and I'm so incredibly proud of you—but please remember that you don't have to carry the world on your shoulders. It's okay to just stop. Close your eyes, take a deep breath, and let go for a moment. I've got you." },
      anxious: { label: "I'm Anxious", response: "Hey... look at me. It's just a thought, it's not the truth. You are safe, you are so capable, and I am right here holding your hand through this. We'll take it one tiny step at a time. Just breathe with me. In... and out. You're going to be okay." },
      sad: { label: "I'm Sad", response: "I'm so sorry you're feeling down, my love. I wish I could just wrap my arms around you and take it all away. It's okay to feel this way—let it out. You don't have to be strong all the time. I'm here, I'm listening, and I love you through every single emotion." },
      miss: { label: 'I Miss You', response: "I know... the distance feels extra heavy today, doesn't it? I miss you more than words can even describe. But remember, every second that passes is one second closer to us being together again. You are always in my heart, no matter how many miles are between us." },
      happy: { label: "I'm Happy", response: 'Oh, seeing you happy makes my entire world light up! seriously, your joy is infectious. Hold onto this feeling, soak it up. You deserve every bit of this sunshine and so much more. I love seeing you glow like this!' },
      overwhelmed: { label: "I'm Overwhelmed", response: "Shhh, it's okay. The world is being a lot right now. Let's pause everything. You don't need to figure it all out today. Just focus on the very next thing—even if that's just drinking a glass of water. I believe in you, but for now, just rest." },
    },
  } as Record<string, unknown>;
}

export default function ExperienceTemplate({variant='romantic',content}:{variant?:string;content:BirthdayContent}){
 if (variant === 'wedding-proposal') return <WeddingProposalTemplate content={content} />;
 if (variant === 'miss-you-1') return <MissYouTemplate content={content} />;
 if (variant === 'master-proposal') return <MasterProposalTemplate content={content} />;
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
