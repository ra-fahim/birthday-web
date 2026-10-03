'use client';
import React from 'react';
import type { BirthdayContent } from '@/lib/types';
import WeddingProposalTemplate from './WeddingProposalTemplate';
import GenericEditableIframe from './GenericEditableIframe';

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

function MissYouTemplate({ content, editorMode = false, onElementSelect, onHistoryState }: { content: BirthdayContent; editorMode?: boolean; onElementSelect?: (selection: { key: string; label: string; index?: number; value?: string; kind?: string }) => void; onHistoryState?: (state: { canBack?: boolean; canForward?: boolean; screen?: string }) => void }) {
  const config = { ...getMissYouDefaults(), ...(content.templateConfig || {}) };
  const src = React.useMemo(() => '/templates/miss-you-1/index.html?bbEdit=1', []);
  return <GenericEditableIframe title="Miss You 1" src={src} content={content} editorMode={editorMode} genericEdits={((content.templateConfig || {}) as any).genericEdits || {}} extraMessages={[{ type: 'BB_MISSYOU_CONFIG', config }, { type: 'BB_EDITOR_MODE', enabled: !!editorMode }]} minHeight={760} background="#ffe" onElementSelect={onElementSelect} onHistoryState={onHistoryState} />;
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

function MasterProposalTemplate({ content, editorMode, onElementSelect, onHistoryState }: { content: BirthdayContent; editorMode?: boolean; onElementSelect?: (selection: { key: string; label: string; index?: number; value?: string; kind?: string }) => void; onHistoryState?: (state: { canBack?: boolean; canForward?: boolean; screen?: string }) => void }) {
  // The template (a separate Vite app inside the iframe) reads ALL of its content from this config.
  // It is sent with BB_SITE_CONFIG on request and after every edit; the app re-renders live without
  // reloading, so the current position in the page is kept while typing.
  const config = React.useMemo(() => {
    const { genericEdits: _ignored, ...rest } = { ...getMasterProposalDefaults(), ...(content.templateConfig || {}) } as Record<string, unknown>;
    return rest;
  }, [content.templateConfig]);
  const src = React.useMemo(() => '/templates/master-proposal/index.html?bbEdit=1', []);
  const extraMessages = React.useMemo(() => [{ type: 'BB_SITE_CONFIG', config }], [config]);
  return <GenericEditableIframe title="Master Proposal" src={src} content={content} editorMode={editorMode} genericEdits={((content.templateConfig||{}) as any).genericEdits || {}} extraMessages={extraMessages} minHeight={720} background="#FAF9F6" onElementSelect={onElementSelect} onHistoryState={onHistoryState} />}

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
      { id: '2', type: 'image', url: '/museum-gallery/4.jpg', title: 'My First Birthday with You!', date: 'November 2025', description: 'We celebrated a beautiful little memory together.' },
      { id: '3', type: 'video', url: '/museum-gallery/2.mp4', thumbnail: '/museum-gallery/2-thumb.png', title: 'Samgyeopsal and Moral Support', date: 'March 2025', description: 'We shared a meal and a laugh together. I love your laughs.' },
    ],
    bgMusicUrl: '',
    texts: {
      museumTitle: 'Museum of Our Love', museumSubtitle: 'A Curated Collection of Us',
      comfortTitle: 'Comfort Corner', comfortSubtitle: 'A safe space for any emotions you may be feeling', comfortHint: 'Select a feeling to minimize the distance',
      gardenTitle: 'The Digital Garden', gardenSubtitle: "I can't bring you flowers every hour, so I built you a garden that never dies.", gardenHint: '(Tap anywhere in the box below to plant a flower)', gardenEmpty: 'Plant me...', gardenWaiting: 'Waiting for your touch...', gardenCount: '{count} flowers planted for you',
      jarTitle: 'The Love Jar', jarSubtitle: 'Pull a note whenever you need a reminder', jarButton: 'Pull a Note',
      bucketTitle: 'Our Bucket List', bucketSubtitle: 'Dreams for Someday', bucketFooter: 'Checking these off, one by one, with you.',
      footer: 'Made with love, for you.',
    },
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
    introGate: {
      firstLine: 'I made this just for you.',
      secondLineLabel: 'But first',
      secondLine: 'Before anything else...',
      yesButtonText: 'Yes, Forever',
      noButtonText: 'No',
      noButtonTextRepeat: 'Still No?',
      prompts: [
        { title: 'Will you be my Valentine?', subtitle: '...and for a lifetime?' },
        { title: 'Wait, did you click the wrong button?', subtitle: 'I think your finger slipped!' },
        { title: 'Are you sure? I have snacks!', subtitle: 'All your favorites, unlimited supply.' },
        { title: 'What if I promise to do the dishes?', subtitle: 'For like... a whole week.' },
        { title: "I'll give you a foot massage...", subtitle: 'Anytime you want. Seriously.' },
        { title: "Don't break my heart! 🥺", subtitle: 'Look at this sad face.' },
        { title: "I'm going to cry...", subtitle: 'Tears are actually forming right now.' },
        { title: 'Okay, seriously, just click Yes.', subtitle: "The 'No' button is getting tired." },
        { title: "You're being stubborn!", subtitle: 'But I still love you.' },
        { title: 'Please? Please? Please?', subtitle: "I'll be the best Valentine ever." },
        { title: "I'm not taking no for an answer!", subtitle: 'Resistance is futile, darling.' },
      ],
    },
    datePlanner: {
      heading: "Let's Plan Our Date Together",
      subtitle: 'Pick what your heart desires.',
      sendButtonLabel: 'Send Ticket',
      options: [
        { id: 'massage', label: 'Massage & Class', planTitle: 'The Stress Melter', planDescription: "Multitasking at its finest. While you attend your online class, I'll be your personal masseur. I'll give you a full body massage to help you relax and recharge before you have to clock in at 5 PM.", budget: 'Free' },
        { id: 'preshift', label: 'Pre-Work Recharge', planTitle: 'The 30-Minute Power Date', planDescription: "I know you're busy between class and work. I'll meet you right in that gap. I'll bring you food/coffee, we'll sit for a bit, and I'll hype you up before your 5 PM shift starts.", budget: '$' },
        { id: 'color', label: 'Color Challenge', planTitle: 'The Color Snack Challenge', planDescription: 'We pick a random color (Pink? Blue? Red?) and head to the nearest convenience store. We can only buy and eat snacks/drinks that match that color!', budget: '$$' },
        { id: 'arcade', label: 'Arcade & Ice Cream', planTitle: 'Retro Arcade Duel', planDescription: "We hit the arcade. Air hockey, basketball, and crane games. Loser buys the winner ice cream afterwards (but let's be honest, I'll buy it anyway).", budget: '$$' },
        { id: 'movie', label: 'Laptop Cinema', planTitle: 'Dorm/Room Movie Night', planDescription: "I'll bring the popcorn and snacks. We build a blanket nest and watch that movie you've been wanting to see on your laptop.", budget: '$' },
        { id: 'study', label: 'Study & Sip', planTitle: 'Coffee Shop Focus Date', planDescription: "We'll find a quiet corner at a cute cafe. I'll buy the coffee/boba, you bring the notes. 50% studying, 50% holding hands under the table.", budget: '$' },
        { id: 'capitaltown', label: 'Capital Town', planTitle: 'Capital Town Anniversary Redo', planDescription: "We missed going here for our anniversary, but we're making up for it now. Let's finally have that date at Capital Town Pampanga. We'll walk around, grab food, and enjoy the vibe before your schedule gets busy.", budget: '$$', isSpecial: true },
      ],
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

function Editable({ editorMode, onSelect, selection, className, children }: { editorMode?: boolean; onSelect?: (selection: { key:string; label:string; index?:number; value?:string; kind?:string })=>void; selection:{key:string;label:string;index?:number;kind?:string}; className?:string; children:React.ReactNode }) {
  return <div
    className={`experience-editable ${editorMode ? 'is-editor' : ''} ${className || ''}`}
    data-bb-editor-wrap="1"
    data-bb-selection-key={selection.key}
    data-bb-selection-label={selection.label}
    data-bb-selection-kind={selection.kind || 'text'}
    data-bb-selection-index={selection.index == null ? '' : String(selection.index)}
    onClick={editorMode ? (e)=>{
      e.preventDefault();
      e.stopPropagation();
      const value = (e.currentTarget.querySelector('[data-bb-value]') as HTMLElement | null)?.innerText || '';
      onSelect?.({...selection, value});
    } : undefined}
  >
    {children}
  </div>;
}

export default function ExperienceTemplate(props:{variant?:string;content:BirthdayContent;editorMode?:boolean;onElementSelect?:(selection:{key:string;label:string;index?:number;value?:string;kind?:string})=>void;onHistoryState?:(state:{canBack?:boolean;canForward?:boolean;screen?:string})=>void}){
 const {variant='romantic',content,editorMode,onElementSelect,onHistoryState}=props;
 if (variant === 'wedding-proposal') return <WeddingProposalTemplate content={content} editorMode={editorMode} onElementSelect={onElementSelect} onHistoryState={onHistoryState} />;
 if (variant === 'miss-you-1') return <MissYouTemplate content={content} editorMode={editorMode} onElementSelect={onElementSelect} onHistoryState={onHistoryState} />;
 if (variant === 'master-proposal') return <MasterProposalTemplate content={content} editorMode={editorMode} onElementSelect={onElementSelect} onHistoryState={onHistoryState} />;
 return <StandardExperienceTemplate variant={variant} content={content} editorMode={editorMode} onElementSelect={onElementSelect} onHistoryState={onHistoryState} />;
}

function StandardExperienceTemplate({variant='romantic',content,editorMode,onElementSelect,onHistoryState}:{variant?:string;content:BirthdayContent;editorMode?:boolean;onElementSelect?:(selection:{key:string;label:string;index?:number;value?:string;kind?:string})=>void;onHistoryState?:(state:{canBack?:boolean;canForward?:boolean;screen?:string})=>void}){
 const p=presets[variant]||presets.romantic; const gallery=content.gallery||[]; const presetCfg=((content.templateConfig||{}) as any).preset || {};
 const rootRef = React.useRef<HTMLDivElement>(null);
 const musicRef = React.useRef<HTMLAudioElement>(null);
 const [musicPlaying, setMusicPlaying] = React.useState(false);
 React.useEffect(() => {
   const audio = musicRef.current;
   if (!audio) return;
   audio.loop = true;
   audio.volume = 0.45;
   audio.muted = true;
   if (editorMode || !content.musicUrl) {
     try { audio.pause(); audio.currentTime = 0; } catch {}
     setMusicPlaying(false);
     return;
   }
   let unlocked = false;
   const start = () => {
     if (unlocked || !musicRef.current || !content.musicUrl) return;
     unlocked = true;
     const a = musicRef.current;
     a.muted = false;
     a.volume = 0.45;
     a.play().then(() => setMusicPlaying(true)).catch(() => { unlocked = false; });
   };
   window.addEventListener('pointerdown', start, { once: true, capture: true });
   window.addEventListener('keydown', start, { once: true, capture: true });
   return () => { window.removeEventListener('pointerdown', start, true); window.removeEventListener('keydown', start, true); };
 }, [editorMode, content.musicUrl]);
 const toggleMusic = () => {
   const a = musicRef.current;
   if (!a || !content.musicUrl || editorMode) return;
   if (a.paused) { a.muted = false; a.volume = 0.45; a.play().then(() => setMusicPlaying(true)).catch(() => {}); }
   else { a.pause(); setMusicPlaying(false); }
 };
 const screenIndexRef = React.useRef(0);
 const [editorHistory, setEditorHistory] = React.useState({canBack:false, canForward:false, screen:'Section 1'});
 const syncCanvasHistory = React.useCallback(() => {
   if (!editorMode) { const next={canBack:false,canForward:false,screen:'experience'}; setEditorHistory(next); onHistoryState?.(next); return; }
   const root = rootRef.current;
   const screens = root ? Array.from(root.querySelectorAll(':scope > section')) as HTMLElement[] : [];
   if (!screens.length) { const next={canBack:false,canForward:false,screen:'experience'}; setEditorHistory(next); onHistoryState?.(next); return; }
   screenIndexRef.current = Math.max(0, Math.min(screenIndexRef.current, screens.length - 1));
   const next={canBack:screenIndexRef.current > 0, canForward:screenIndexRef.current < screens.length - 1, screen:`Section ${screenIndexRef.current + 1}`};
   setEditorHistory(next);
   onHistoryState?.(next);
 }, [editorMode, onHistoryState]);
 React.useEffect(() => {
   const root = rootRef.current as (HTMLDivElement & { __bbEditorNavigate?: (delta:number)=>void }) | null;
   if (!root) return;
   const navigate = (delta:number) => {
     if (!editorMode) return;
     const screens = Array.from(root.querySelectorAll(':scope > section')) as HTMLElement[];
     if (!screens.length) return;
     const next = Math.max(0, Math.min(screenIndexRef.current + (delta < 0 ? -1 : 1), screens.length - 1));
     screenIndexRef.current = next;
     screens[next]?.scrollIntoView({ behavior:'smooth', block:'center' });
     syncCanvasHistory();
   };
   root.__bbEditorNavigate = navigate;
   syncCanvasHistory();
   return () => { delete root.__bbEditorNavigate; };
 }, [editorMode, syncCanvasHistory]);
 const guardEditInteraction = (e: React.SyntheticEvent) => {
   if (!editorMode) return;
   const target = e.target as HTMLElement | null;
   if (!target) return;
   if (target.closest('[data-bb-editor-nav-overlay],.experience-editor-control')) return;
   const editable = target.closest('.experience-editable') as HTMLElement | null;
   const actionable = target.closest('button,a,input,select,textarea,video,audio,summary,[role=button]') as HTMLElement | null;
   if (actionable) {
     e.preventDefault();
     e.stopPropagation();
     if (editable) {
       onElementSelect?.({
         key: editable.getAttribute('data-bb-selection-key') || '',
         label: editable.getAttribute('data-bb-selection-label') || 'Element',
         kind: editable.getAttribute('data-bb-selection-kind') || 'text',
         index: editable.getAttribute('data-bb-selection-index') ? Number(editable.getAttribute('data-bb-selection-index')) : undefined,
         value: ((editable.querySelector('[data-bb-value]') as HTMLElement | null)?.innerText || editable.innerText || '').trim(),
       });
     }
     return;
   }
   if (editable) return;
   e.preventDefault();
   e.stopPropagation();
 };
 return <div ref={rootRef} data-bb-experience-root style={{position:'relative',minHeight:'100%',background:p.surface,color:variant==='minimal'||variant==='elegant'?'#111827':'white',fontFamily:'ui-sans-serif,system-ui'}} onClickCapture={guardEditInteraction} onPointerDownCapture={guardEditInteraction} onTouchStartCapture={guardEditInteraction} onKeyDownCapture={(e)=>{ if(editorMode && (e.key==='Enter'||e.key===' ')){ const target=e.target as HTMLElement|null; if(target?.closest('[data-bb-editor-nav-overlay],.experience-editor-control')) return; const editable=target?.closest('.experience-editable'); const actionable=target?.closest('button,a,input,select,textarea,video,audio,summary,[role=button]'); if(actionable || !editable){ e.preventDefault(); e.stopPropagation(); } } }}>
  <section style={{padding:'72px 24px',textAlign:'center',background:`radial-gradient(circle at 20% 10%, ${p.accent}55, transparent 35%), ${p.surface}`}}>
   <Editable editorMode={editorMode} onSelect={onElementSelect} selection={{key:'preset.emoji',label:'Hero emoji'}}><div data-bb-value style={{fontSize:42}}>{String(presetCfg.emoji || p.emoji)}</div></Editable>
   <Editable editorMode={editorMode} onSelect={onElementSelect} selection={{key:'preset.eyebrow',label:'Hero eyebrow'}}><p data-bb-value style={{letterSpacing:3,textTransform:'uppercase',fontSize:12,color:p.accent,fontWeight:800}}>{String(presetCfg.eyebrow || p.eyebrow)}</p></Editable>
   <Editable editorMode={editorMode} onSelect={onElementSelect} selection={{key:'heroTitle',label:'Hero title'}}><h1 style={{fontSize:'clamp(38px,8vw,78px)',lineHeight:1.02,maxWidth:900,margin:'18px auto',fontWeight:900}}>{content.name ? `${content.name}, ${content.heroTitle || p.headline}` : (content.heroTitle || p.headline)}</h1></Editable>
   <Editable editorMode={editorMode} onSelect={onElementSelect} selection={{key:'heroSubtitle',label:'Hero subtitle'}}><p data-bb-value style={{maxWidth:650,margin:'20px auto',opacity:.75,fontSize:18}}>{content.heroSubtitle || 'A personalized celebration, made to be remembered.'}</p></Editable>
   <Editable editorMode={editorMode} onSelect={onElementSelect} selection={{key:'buttonText',label:'Main button',kind:'button'}}>
    <button type="button" data-bb-value style={{marginTop:22,padding:'13px 20px',border:0,borderRadius:999,background:p.accent,color:'#fff',fontWeight:800,cursor:'pointer',boxShadow:`0 12px 30px ${p.accent}33`}}>{content.buttonText || 'Start the celebration ✨'}</button>
   </Editable>
   {content.birthday && <Editable editorMode={editorMode} onSelect={onElementSelect} selection={{key:'birthday',label:'Date'}}>
    <div data-bb-value style={{display:'inline-block',marginTop:14,padding:'10px 18px',borderRadius:999,border:`1px solid ${p.accent}66`}}>{new Date(content.birthday).toLocaleDateString()}</div>
   </Editable>}
  </section>
  <section style={{maxWidth:1050,margin:'0 auto',padding:'55px 24px'}}>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:18}}>
    {(content.reasons?.length?content.reasons:['Beautiful memories','Little moments','A whole lot of joy']).map((x,i)=><Editable key={`reason-${i}`} editorMode={editorMode} onSelect={onElementSelect} selection={{key:'reasons',index:i,label:`Reason ${i+1}`}}><article data-bb-value style={{padding:24,borderRadius:24,background:variant==='minimal'||variant==='elegant'?'white':'rgba(255,255,255,.06)',border:`1px solid ${p.accent}33`}}><b style={{color:p.accent}}>0{i+1}</b><p style={{marginTop:10,fontSize:18}}>{x}</p></article></Editable>)}
   </div>
   {gallery.length>0 && <div style={{marginTop:55}}><Editable editorMode={editorMode} onSelect={onElementSelect} selection={{key:'preset.sectionTitle',label:'Gallery section title'}}><h2 data-bb-value style={{fontSize:30,fontWeight:800,marginBottom:20}}>{String(presetCfg.sectionTitle || 'Moments worth keeping')}</h2></Editable><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:14}}>{gallery.map((g,i)=><Editable key={i} editorMode={editorMode} onSelect={onElementSelect} selection={{key:'gallery',index:i,label:`Photo ${i+1}`,kind:'image'}}><img src={g.url} data-bb-value alt={g.caption||`Memory ${i+1}`} style={{width:'100%',aspectRatio:'1',objectFit:'cover',borderRadius:22}} /></Editable>)}</div></div>}
   {content.videoUrl && <Editable editorMode={editorMode} onSelect={onElementSelect} selection={{key:'videoUrl',label:'Special video',kind:'video'}}><div style={{marginTop:55}}><video data-bb-value src={content.videoUrl} controls playsInline style={{width:'100%',maxHeight:520,borderRadius:24,background:'#000'}}/><p style={{marginTop:12,opacity:.72}}>{content.videoCaption || 'A special moment worth replaying.'}</p></div></Editable>}
   <div style={{marginTop:55,padding:'35px 28px',borderRadius:28,background:`linear-gradient(135deg, ${p.accent}22, transparent)`,border:`1px solid ${p.accent}44`}}><Editable editorMode={editorMode} onSelect={onElementSelect} selection={{key:'preset.todayLabel',label:'Greeting eyebrow'}}><p data-bb-value style={{fontSize:14,textTransform:'uppercase',letterSpacing:2,color:p.accent,fontWeight:800}}>{String(presetCfg.todayLabel || 'Today & always')}</p></Editable><Editable editorMode={editorMode} onSelect={onElementSelect} selection={{key:'greeting',label:'Greeting'}}><p data-bb-value style={{fontSize:24,lineHeight:1.5,marginTop:12}}>{content.greeting || 'Wishing you the very best.'}</p></Editable></div>
   {editorMode && <div style={{display:'flex',gap:10,justifyContent:'center',flexWrap:'wrap',marginTop:20}}><button type="button" className="experience-add-media experience-editor-control" onClick={()=>onElementSelect?.({key:'gallery',label:'Add photo',index:gallery.length,kind:'image'})}>＋ Add Photo</button><button type="button" className="experience-add-media experience-editor-control" onClick={()=>onElementSelect?.({key:'videoUrl',label:'Special video',kind:'video'})}>＋ Add Video</button></div>}
  </section>
  <audio ref={musicRef} src={content.musicUrl || undefined} preload="auto" loop aria-label="Background music" data-bb-background-music style={{display:'none'}} />
  {!editorMode && content.musicUrl && <button type="button" onClick={(e)=>{e.preventDefault();e.stopPropagation();toggleMusic();}} style={{position:'fixed',right:18,bottom:18,zIndex:20,padding:'10px 14px',borderRadius:999,border:`1px solid ${p.accent}55`,background:variant==='minimal'||variant==='elegant'?'rgba(255,255,255,.92)':'rgba(15,15,20,.72)',color:variant==='minimal'||variant==='elegant'?'#111827':'#fff',backdropFilter:'blur(10px)',cursor:'pointer',fontWeight:800}}>{musicPlaying ? '🔊 Music ON' : '🔇 Music OFF'}</button>}
  {editorMode && <button type="button" className="experience-music-chip experience-editor-control" onClick={(e)=>{e.preventDefault();e.stopPropagation();onElementSelect?.({key:'musicUrl',label:'Background music',kind:'audio'});}}>🎵 {content.musicUrl ? 'Edit music' : 'Add background music'}</button>}
  {editorMode && <div data-bb-editor-nav-overlay="1" aria-label="Editor navigation" style={{position:'absolute',left:'50%',bottom:18,transform:'translateX(-50%)',zIndex:100,display:'flex',alignItems:'center',gap:10,padding:'8px 10px',borderRadius:16,background:'rgba(18,18,24,.84)',border:'1px solid rgba(255,255,255,.18)',boxShadow:'0 10px 28px rgba(0,0,0,.24)',backdropFilter:'blur(12px)'}}>
    <button type="button" onClick={(e)=>{e.preventDefault();e.stopPropagation();rootRef.current && (rootRef.current as any).__bbEditorNavigate?.(-1);}} disabled={!editorHistory.canBack} style={{border:0,borderRadius:10,padding:'9px 13px',fontWeight:700,cursor:editorHistory.canBack?'pointer':'not-allowed',opacity:editorHistory.canBack?1:.45}}>← Previous</button>
    <span style={{minWidth:92,textAlign:'center',color:'rgba(255,255,255,.78)',fontSize:12}}>{editorHistory.screen || 'Editor'}</span>
    <button type="button" onClick={(e)=>{e.preventDefault();e.stopPropagation();rootRef.current && (rootRef.current as any).__bbEditorNavigate?.(1);}} disabled={!editorHistory.canForward} style={{border:0,borderRadius:10,padding:'9px 13px',fontWeight:700,cursor:editorHistory.canForward?'pointer':'not-allowed',opacity:editorHistory.canForward?1:.45}}>Next →</button>
  </div>}
 </div>

}
