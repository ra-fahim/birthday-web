'use client';
import Link from 'next/link';
import { defaultContent } from '@/lib/types';
import { MasterTemplate } from '@/components/template/MasterTemplate';
import ExperienceTemplate from '@/components/template/ExperienceTemplates';
import { templateCatalog } from '@/lib/templates';

const TEMPLATES = templateCatalog.filter(t => ['master','master-proposal','romantic','cute','luxury','anime','gaming','minimal','elegant','festival'].includes(t.slug)).map(t => [t.slug,t.name,t.description] as const);

export default function TemplateShowcase({ loggedIn }: { loggedIn: boolean }) {
  const content = { ...defaultContent, name: 'Natu', gallery: [], reasons: ['Your smile','Your kindness','Your beautiful heart'] };
  const href = (id:string) => loggedIn ? `/builder/new?template=${id}` : `/signup?next=${encodeURIComponent(`/builder/new?template=${id}`)}`;
  return <div className="home-template-grid">
    {TEMPLATES.map(([id,name,desc]) => <article key={id} className={`home-template-card ${id==='master'?'home-template-card-master':''}`}>
      <div className="home-template-preview">
        <div className="home-template-topbar"><span>{id==='master'?'MASTER':id==='master-proposal'?'PROPOSAL':'TEMPLATE'}</span><b>{id==='master'?'🎂':id==='master-proposal'?'💌':'✦'}</b></div>
        <div className="home-template-canvas">
          {id==='master' ? <MasterTemplate demo content={content} /> : id==='master-proposal' ? <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_50%_35%,rgba(192,128,129,.32),transparent_55%)] text-center px-8"><div><div className="text-7xl">💌</div><div className="mt-4 text-4xl font-serif italic text-white">To My Dearest</div><p className="mt-3 text-sm tracking-widest uppercase text-pink-200/70">Master proposal</p></div></div> : <ExperienceTemplate variant={id} content={{...content, proposalMasterRecipient:'Natu'}} />}
        </div>
        <div className="home-template-overlay" />
      </div>
      <div className="home-template-info"><div><span className="home-template-kicker">{id==='master'?'Flagship template':'Ready-to-use design'}</span><h3>{name}</h3><p>{desc}</p></div><Link className="home-template-use" href={href(id)}>Use this →</Link></div>
    </article>)}
  </div>;
}
