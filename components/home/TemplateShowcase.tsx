'use client';
import Link from 'next/link';
import { defaultContent } from '@/lib/types';
import { MasterTemplate } from '@/components/template/MasterTemplate';
import ExperienceTemplate from '@/components/template/ExperienceTemplates';

const TEMPLATES = [
  ['master','Magic Bloom','Cinematic master experience','🎂'],['romantic','Midnight Love','Soft & intimate','🌹'],['cute','Pastel Dream','Playful & sweet','🧸'],
  ['luxury','Royal Celebration','Editorial & premium','✨'],['anime','Neon Story','Energetic & electric','⚡'],['gaming','Level Up','Bold & game-like','🎮'],
  ['minimal','Pure Moment','Quiet & modern','◌'],['elegant','Ever After','Classic & graceful','🕊️'],['festival','Color Parade','Bright & joyful','🎊'],
] as const;

export default function TemplateShowcase({ loggedIn }: { loggedIn: boolean }) {
  const content = { ...defaultContent, name: 'Riya', gallery: [], reasons: ['Your smile','Your kindness','Your beautiful heart'] };
  const href = (id:string) => loggedIn ? `/builder/new?template=${id}` : `/signup?next=${encodeURIComponent(`/builder/new?template=${id}`)}`;
  return <div className="home-template-grid">
    {TEMPLATES.map(([id,name,desc,emoji]) => <article key={id} className={`home-template-card ${id==='master'?'home-template-card-master':''}`}>
      <div className="home-template-preview">
        <div className="home-template-topbar"><span>{id==='master'?'MASTER':'TEMPLATE'}</span><b>{emoji}</b></div>
        <div className="home-template-canvas">
          {id==='master' ? <MasterTemplate demo content={content} /> : <ExperienceTemplate variant={id} content={content} />}
        </div>
        <div className="home-template-overlay" />
      </div>
      <div className="home-template-info"><div><span className="home-template-kicker">{id==='master'?'Flagship template':'Ready-to-use design'}</span><h3>{name}</h3><p>{desc}</p></div><Link className="home-template-use" href={href(id)}>Use this →</Link></div>
    </article>)}
  </div>;
}
