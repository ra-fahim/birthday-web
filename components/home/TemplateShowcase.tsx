'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { defaultContent } from '@/lib/types';
import { templateCatalog, templateCategories } from '@/lib/templates';
import { MasterTemplate } from '@/components/template/MasterTemplate';
import ExperienceTemplate from '@/components/template/ExperienceTemplates';

export default function TemplateShowcase({ loggedIn }: { loggedIn: boolean }) {
  const [showAll, setShowAll] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const content = useMemo(() => ({ ...defaultContent, name: 'Riya', gallery: [], reasons: ['Your smile','Your kindness','Your beautiful heart'] }), []);
  const href = (id:string) => loggedIn ? `/builder/new?template=${id}` : `/signup?next=${encodeURIComponent(`/builder/new?template=${id}`)}`;
  const featured = templateCatalog.slice(0, 3);
  const visibleCategories = showAll ? templateCategories : templateCategories.slice(0, 3);

  return <div>
    <div className="template-category-grid">
      {visibleCategories.map(cat => {
        const items = templateCatalog.filter(t => t.category === cat.id);
        const expanded = openCategory === cat.id;
        return <button key={cat.id} className={`template-category-card ${expanded ? 'is-open' : ''}`} onClick={() => setOpenCategory(expanded ? null : cat.id)}>
          <span className="template-category-icon">{cat.emoji}</span>
          <span><strong>{cat.label}</strong><small>{items.length} template{items.length === 1 ? '' : 's'}</small></span>
          <span className="template-category-arrow">{expanded ? '−' : '+'}</span>
        </button>;
      })}
    </div>

    {!showAll && <div className="home-featured-wrap">
      <div className="home-featured-head"><div><span>START HERE</span><h3>Three great places to begin</h3></div><button className="btn2" onClick={() => setShowAll(true)}>View all templates ↗</button></div>
      <div className="home-featured-grid">
        {featured.map(t => <TemplateCard key={t.slug} t={t} content={content} href={href(t.slug)} />)}
      </div>
    </div>}

    {showAll && <div className="home-all-templates">
      {templateCategories.map(cat => {
        const items = templateCatalog.filter(t => t.category === cat.id);
        return <section key={cat.id} className="home-template-section">
          <div className="home-template-section-head"><div><span>{cat.emoji} {cat.label}</span><h3>{cat.label} templates</h3></div><span>{items.length} ready to edit</span></div>
          <div className="home-template-grid home-template-grid-section">{items.map(t => <TemplateCard key={t.slug} t={t} content={content} href={href(t.slug)} />)}</div>
        </section>;
      })}
    </div>}

    {!showAll && openCategory && <section className="home-category-detail">
      {templateCatalog.filter(t => t.category === openCategory).map(t => <TemplateCard key={t.slug} t={t} content={content} href={href(t.slug)} />)}
    </section>}
    {!showAll && <div className="mt-5 text-center"><button className="btn" onClick={() => setShowAll(true)}>View all wishes & templates →</button></div>}
  </div>;
}

function TemplateCard({ t, content, href }: any) {
  return <article className={`home-template-card ${t.slug === 'master' ? 'home-template-card-master' : ''}`}>
    <div className="home-template-preview">
      <div className="home-template-topbar"><span>{t.categoryLabel.toUpperCase()}</span><b>{t.emoji}</b></div>
      <div className="home-template-canvas">{t.slug === 'master' ? <MasterTemplate demo content={content} /> : <ExperienceTemplate variant={t.slug} content={{ ...content, templateId: t.slug, occasion: t.category }} />}</div>
      <div className="home-template-overlay" />
    </div>
    <div className="home-template-info"><div><span className="home-template-kicker">{t.slug === 'master' ? 'Flagship experience' : 'Ready to edit'}</span><h3>{t.name}</h3><p>{t.description}</p></div><Link className="home-template-use" href={href}>Use this →</Link></div>
  </article>;
}
