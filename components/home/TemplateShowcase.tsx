'use client';

import Link from 'next/link';
import { templateCatalog } from '@/lib/templates';

export default function TemplateShowcase({ loggedIn }: { loggedIn: boolean }) {
  const href = (id: string) => loggedIn ? `/builder/new?template=${id}` : `/signup?next=${encodeURIComponent(`/builder/new?template=${id}`)}`;
  return <div className="home-template-grid">
    {templateCatalog.map((template) => <article key={template.slug} className={`home-template-card ${template.slug === 'master' ? 'home-template-card-master' : ''}`}>
      <div className="home-template-preview" style={{ background: `radial-gradient(circle at 20% 20%, ${template.accent}44, transparent 42%), linear-gradient(135deg,#111318,#0a0a0d)` }}>
        <div className="home-template-topbar"><span>{template.category.toUpperCase()}</span><b>{template.emoji}</b></div>
        <div className="home-template-static-card" style={{ ['--accent' as string]: template.accent }}>
          <span className="home-template-static-kicker">{template.name}</span>
          <strong>{template.slug === 'wedding-proposal' ? 'A question worth remembering.' : 'Your moment, beautifully yours.'}</strong>
          <p>{template.description}</p>
          <div className="home-template-static-dots"><i /><i /><i /></div>
        </div>
      </div>
      <div className="home-template-info">
        <div><span className="home-template-kicker">{template.slug === 'master' ? 'Flagship template' : template.category}</span><h3>{template.name}</h3><p>{template.description}</p></div>
        <Link className="home-template-use" href={href(template.slug)}>Use this →</Link>
      </div>
    </article>)}
  </div>;
}
