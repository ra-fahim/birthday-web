'use client';

import React, { useMemo, useState } from 'react';
import type { BirthdayContent } from '@/lib/types';

type Props = { content: BirthdayContent };

type Theme = { name: string; accent: string; bg: string; text: string; card: string };

const THEMES: Record<string, Theme> = {
  blush: { name: 'Classic Rose', accent: '#C08081', bg: '#FAF9F6', text: '#5D4037', card: '#FFFBFB' },
  lavender: { name: 'Soft Lavender', accent: '#9F88B0', bg: '#FDFBFD', text: '#4A3B52', card: '#FCFAFD' },
  ocean: { name: 'Calm Breeze', accent: '#7DA0A6', bg: '#F6FAFA', text: '#2C3E50', card: '#FBFFFF' },
  midnight: { name: 'Midnight Serenade', accent: '#6366F1', bg: '#EEF2FF', text: '#1E1B4B', card: '#FFFFFF' },
  sunset: { name: 'Sunset Kiss', accent: '#F43F5E', bg: '#FFF1F2', text: '#881337', card: '#FFFFEF' },
  forest: { name: 'Forest Whisper', accent: '#10B981', bg: '#F0FDF4', text: '#064E3B', card: '#FFFFFF' },
  mocha: { name: 'Velvet Mocha', accent: '#8D6E63', bg: '#FDFCF8', text: '#5D4037', card: '#FAF9F6' },
  royal: { name: 'Royal Amethyst', accent: '#9333EA', bg: '#FAF5FF', text: '#581C87', card: '#FFFFFF' },
};

const fallbackStory = [
  {number:'I',title:'The Beginning',body:'Every beautiful story starts with a moment that feels ordinary—until you realize it changed everything.'},
  {number:'II',title:'The Little Things',body:'It is the little laughs, quiet conversations, and tiny memories that slowly become your favorite parts of life.'},
  {number:'III',title:'The Strength',body:'You make difficult days softer and bright days brighter. That is one of the many reasons I choose you.'},
  {number:'IV',title:'The Promise',body:'To listen, support, laugh, grow, and keep choosing each other through every chapter ahead.'},
  {number:'V',title:'The Horizon',body:'I cannot promise every day will be perfect. I can promise I want to be there for the story that comes next.'},
];

const defaultBucket = ['Graduate Together','Late Night Road Trip','Travel Somewhere New','Adopt a Puppy','Cook a Fancy Meal','Build Our First Home'];
const defaultNotes = ['You are my favorite person.','I would choose you again.','Your smile makes ordinary days special.','You make my world feel like home.','I am proud of us.'];

function SectionHeading({ title, subtitle, accent }: {title:string;subtitle?:string;accent:string}) {
  return <div className="mp-heading"><h2>{title}</h2>{subtitle && <p style={{color:accent}}>{subtitle}</p>}<span style={{background:accent}} /></div>;
}

export default function MasterProposalTemplate({ content }: Props) {
  const [themeKey, setThemeKey] = useState(content.theme && THEMES[content.theme] ? content.theme : 'blush');
  const [dark, setDark] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const [entered, setEntered] = useState(false);
  const [noteIndex, setNoteIndex] = useState(0);
  const [planted, setPlanted] = useState(0);
  const [checked, setChecked] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('Evening (After 5 PM)');
  const [ticketEmail, setTicketEmail] = useState(content.proposalMasterTicketEmail || '');
  const [ticketStatus, setTicketStatus] = useState('');
  const theme = THEMES[themeKey] || THEMES.blush;
  const accent = content.primaryColor || theme.accent;
  const story = content.proposalMasterStory?.length ? content.proposalMasterStory : fallbackStory;
  const recipient = content.proposalMasterRecipient || content.name || 'My Dearest';
  const sender = content.proposalMasterSender || content.profile?.displayName || 'Someone who loves you';
  const gallery = content.gallery || [];
  const bucket = content.wishlist?.length ? content.wishlist : defaultBucket;
  const notes = defaultNotes;

  const dateOptions = useMemo(() => [
    {label:'Morning Coffee', title:'Slow Morning Date', description:'Coffee, quiet conversation, and nowhere else to be.', budget:'Free'},
    {label:'Lunch Break', title:'A Little Midday Escape', description:'A simple meal and a little quality time together.', budget:'$'},
    {label:'Sunset Walk', title:'Golden Hour Walk', description:'A sunset, your favorite snack, and a long walk together.', budget:'$'},
    {label:'Movie Night', title:'Our Tiny Cinema', description:'Blankets, snacks, your favorite movie, and no notifications.', budget:'$$'},
    {label:'Adventure', title:'A Day We Will Remember', description:'Pick a new place, take too many photos, and make a story out of it.', budget:'$$'},
    {label:'Dream Date', title:'One Extra-Special Date', description:'Whatever feels most like us. The plan matters less than the company.', budget:'✨'},
  ], []);

  const sendTicket = async () => {
    if (!selectedDate) return;
    const email = ticketEmail.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setTicketStatus('Please enter a valid Gmail or email address.'); return; }
    setTicketStatus('Sending ticket…');
    try {
      const selected = dateOptions[selectedDate - 1];
      const res = await fetch('/api/proposal-ticket', {
        method: 'POST', headers: {'content-type':'application/json'},
        body: JSON.stringify({
          to: email,
          recipient,
          sender,
          dateTitle: selected.title,
          dateDetails: selected.description,
          budget: selected.budget,
          time: selectedTime,
          siteName: content.seoTitle || `${recipient} — Master proposal`,
          buttonText: content.proposalMasterTicketButton || 'Send Ticket',
        })
      });
      const json = await res.json();
      setTicketStatus(res.ok ? 'Ticket sent to your email ✨' : (json.error || 'Could not send ticket.'));
    } catch { setTicketStatus('Could not send ticket. Please try again.'); }
  };

  return (
    <main className={`master-proposal ${dark ? 'is-dark' : ''}`} style={{'--mp-bg': dark ? '#1F1717' : theme.bg, '--mp-text': dark ? '#EAD4D4' : theme.text, '--mp-card': dark ? '#291D1D' : theme.card, '--mp-accent': accent} as React.CSSProperties}>
      <div className="mp-bg-orb mp-orb-a"/><div className="mp-bg-orb mp-orb-b"/>
      <div className="mp-toolbar">
        <button onClick={() => setShowThemes(v=>!v)} aria-label="Theme picker">◈</button>
        <button onClick={() => setDark(v=>!v)} aria-label="Toggle dark mode">{dark ? '☀' : '☾'}</button>
        {showThemes && <div className="mp-theme-menu">{Object.entries(THEMES).map(([key,t]) => <button key={key} onClick={() => {setThemeKey(key);setShowThemes(false)}}><i style={{background:t.accent}}/>{t.name}</button>)}</div>}
      </div>

      {!entered && <section className="mp-gate"><div className="mp-gate-card"><div className="mp-heart">♥</div><p className="mp-eyebrow">A little question</p><h1>{content.proposalMasterIntroTitle || 'Will you be my Valentine?'}</h1><p>{content.proposalMasterIntroSubtitle || '...and for a lifetime?'}</p><button className="mp-button" onClick={()=>setEntered(true)}>Yes, let me in ♥</button><small>A private little world for {recipient}</small></div></section>}

      <div className={entered ? '' : 'mp-hidden-content'}>
        <section className="mp-hero">
          <div className="mp-hero-mark">♥</div>
          <p className="mp-eyebrow">For {recipient}</p>
          <h1>{content.proposalMasterHeroTitle || 'To My Dearest'}</h1>
          <p>{content.proposalMasterHeroSubtitle || 'A love letter, written just for you.'}</p>
          <span className="mp-scroll">{content.proposalMasterScrollLabel || 'Scroll slowly'} ↓</span>
        </section>

        {story.map((item, i) => <section className="mp-story" key={`${item.number}-${i}`}><div><span className="mp-number">{item.number}</span><h2>{item.title}</h2><p>{item.body}</p></div></section>)}

        <section className="mp-section"><SectionHeading title={content.proposalMasterMuseumTitle || 'Museum of Our Love'} subtitle={content.proposalMasterMuseumSubtitle || 'A Curated Collection of Us'} accent={accent}/><div className="mp-gallery">{(gallery.length ? gallery : [{url:'https://picsum.photos/900/1200?random=81',caption:'A moment worth keeping'},{url:'https://picsum.photos/1200/800?random=82',caption:'Little things'},{url:'https://picsum.photos/1000/1000?random=83',caption:'Just us'}]).map((g,i)=><figure key={i}><img src={g.url} alt={g.caption || `Memory ${i+1}`} /><figcaption>{g.caption || `Memory ${i+1}`}</figcaption></figure>)}</div></section>

        <section className="mp-section"><SectionHeading title={content.proposalMasterSoundtrackTitle || 'Our Soundtrack'} subtitle={content.proposalMasterSoundtrackSubtitle || 'Songs that sound like us'} accent={accent}/><div className="mp-sound-card"><div className="mp-vinyl">♪</div><div><strong>{content.proposalMasterHeroTitle || 'Our soundtrack'}</strong><p>{content.musicUrl ? 'Your selected music is ready to play.' : 'Add a music link in the editor to personalize this section.'}</p>{content.musicUrl && <audio controls src={content.musicUrl} />}</div></div></section>

        <section className="mp-section"><SectionHeading title={content.proposalMasterComfortTitle || 'Comfort Corner'} subtitle="For the days that feel heavy" accent={accent}/><div className="mp-comfort-grid"><article>☁<h3>Need comfort?</h3><p>You do not have to be okay every second. Take a breath, stay a little longer, and remember you are loved.</p></article><article>☀<h3>Need a smile?</h3><p>Come back to this page, pick a tiny memory, and let yourself smile at something good.</p></article><article>♥<h3>Need a reminder?</h3><p>{recipient}, you are deeply appreciated, exactly as you are.</p></article></div></section>

        <section className="mp-section"><SectionHeading title={content.proposalMasterDateTitle || "Let's Plan Our Date Together"} subtitle={content.proposalMasterDateSubtitle || 'Pick what your heart desires.'} accent={accent}/><div className="mp-date-grid">{dateOptions.map((d,i)=><button key={d.title} className={selectedDate===i+1?'selected':''} onClick={()=>setSelectedDate(i+1)}><span>{d.label}</span><strong>{d.title}</strong><small>{d.budget}</small></button>)}</div>{selectedDate && <div className="mp-ticket"><h3>{dateOptions[selectedDate-1].title}</h3><p>{dateOptions[selectedDate-1].description}</p><label>Preferred time<select className="mp-ticket-select" value={selectedTime} onChange={e=>setSelectedTime(e.target.value)}><option>Morning (10 AM - 12 PM)</option><option>Lunch (12 PM - 2 PM)</option><option>Afternoon (2 PM - 5 PM)</option><option>Evening (After 5 PM)</option><option>Weekend (All Day)</option></select></label><label>Your Gmail / email<input value={ticketEmail} onChange={e=>setTicketEmail(e.target.value)} placeholder="you@gmail.com" type="email" /></label><button className="mp-button" onClick={sendTicket}>✉ {content.proposalMasterTicketButton || 'Send Ticket'}</button>{ticketStatus && <p className="mp-ticket-status">{ticketStatus}</p>}<small>Your ticket is sent automatically through the website email server.</small></div>}</section>

        <section className="mp-section"><SectionHeading title={content.proposalMasterGardenTitle || 'Our Bloom Garden'} subtitle={content.proposalMasterGardenSubtitle} accent={accent}/><div className="mp-garden" onClick={()=>setPlanted(v=>v+1)}>{Array.from({length:Math.min(planted,28)}).map((_,i)=><span key={i} style={{left:`${8+(i*31)%82}%`,top:`${20+(i*17)%65}%`,transform:`rotate(${i*17}deg)`}}>♥</span>)}<div className="mp-garden-hint">Click the garden to plant a little love</div></div></section>

        <section className="mp-section"><SectionHeading title={content.proposalMasterNotesTitle || 'Love Note Jar'} subtitle={content.proposalMasterNotesSubtitle} accent={accent}/><div className="mp-note-wrap"><div className="mp-jar">{Array.from({length:7}).map((_,i)=><span key={i}>✦</span>)}</div><div className="mp-note"><span>♥</span><p>{notes[noteIndex % notes.length]}</p><button onClick={()=>setNoteIndex(v=>v+1)}>Another note ↻</button></div></div></section>

        <section className="mp-section"><SectionHeading title={content.proposalMasterBucketTitle || 'Future Bucket List'} subtitle={content.proposalMasterBucketSubtitle} accent={accent}/><div className="mp-bucket">{bucket.slice(0,8).map((item,i)=><button key={`${item}-${i}`} className={checked.includes(i)?'done':''} onClick={()=>setChecked(v=>v.includes(i)?v.filter(x=>x!==i):[...v,i])}><span>{checked.includes(i)?'✓':'☆'}</span>{item}</button>)}</div></section>

        <section className="mp-final"><div className="mp-final-card"><div className="mp-heart">♥</div><h2>{content.proposalMasterFinalTitle || 'A Letter for You'}</h2>{(content.proposalMasterFinalParagraphs?.length?content.proposalMasterFinalParagraphs:['Words often fail to capture the depth of what I feel.','You are my favorite person and my safest home.','I love you, more than yesterday, but less than tomorrow.']).map((p,i)=><p key={i}>{p}</p>)}<div className="mp-signoff"><span>{content.proposalMasterFinalSignoff || 'Forever yours'}</span><strong>{sender}</strong></div></div></section>
        <footer className="mp-footer">Made with love, for {recipient}.</footer>
      </div>
    </main>
  );
}
