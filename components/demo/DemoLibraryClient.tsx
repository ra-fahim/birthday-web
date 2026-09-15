'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { TemplateDefinition } from '@/lib/templates';

const labels: Record<string, string> = { birthday:'Birthday', wedding:'Wedding', proposal:'Proposal', 'miss-you':'Miss You' };
const demoSrc: Record<string,string> = {
  master:'/master-template.html?demo=1&bbDemo=1',
  'wedding-proposal':'/templates/wedding-proposal-original.html?bbDemo=1',
  'master-proposal':'/templates/master-proposal/index.html?bbDemo=1',
  'miss-you-1':'/templates/miss-you-1/index.html?bbDemo=1',
};

function CardPreview({ template }: { template: TemplateDefinition }) {
  return <div className="demo-template-preview" style={{ ['--demo-accent' as string]: template.accent, background:`radial-gradient(circle at 20% 18%, ${template.accent}55, transparent 38%), radial-gradient(circle at 88% 18%, ${template.accent}28, transparent 33%), linear-gradient(145deg,#17131a,#08090d)` }}>
    <div className="demo-template-topline"><span>{(labels[template.category] || template.category).toUpperCase()}</span><span>{template.emoji}</span></div>
    <div className="demo-template-content"><small>{template.slug === 'master' ? 'FLAGSHIP' : 'READY TO PREVIEW'}</small><strong>{template.name}</strong><p>{template.description}</p></div>
    <div className="demo-template-corner" />
    <div className="demo-template-play"><span>▶</span></div>
  </div>;
}

function DemoModal({ template, onClose }: { template: TemplateDefinition; onClose: () => void }) {
  const src = demoSrc[template.slug] || template.originalHtml || '';
  return <div className="demo-modal-backdrop" role="dialog" aria-modal="true" aria-label={`${template.name} demo`} onClick={onClose}>
    <div className="demo-modal" onClick={(e) => e.stopPropagation()}>
      <div className="demo-modal-head"><div><span className="section-kicker">LIVE DEMO</span><h2>{template.name}</h2></div><button className="demo-modal-close" type="button" onClick={onClose} aria-label="Close demo">×</button></div>
      <div className="demo-modal-frame"><iframe title={`${template.name} demo`} src={src} allow="autoplay; fullscreen; picture-in-picture" /></div>
      <div className="demo-modal-footer"><p>Live preview is muted and touch-free.</p><Link className="premium-button premium-button-sm" href={`/builder/new?template=${template.slug}`}>Use template →</Link></div>
    </div>
  </div>;
}

export default function DemoLibraryClient({ templates }: { templates: TemplateDefinition[] }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selected, setSelected] = useState<TemplateDefinition | null>(null);
  const normalized = query.trim().toLowerCase();
  const categories = useMemo(() => ['all', ...Array.from(new Set(templates.map((t) => t.category)))], [templates]);
  const filtered = useMemo(() => templates.filter((t) => {
    if (activeCategory !== 'all' && t.category !== activeCategory) return false;
    if (!normalized) return true;
    return [t.name,t.description,t.category,t.slug].some((v) => v.toLowerCase().includes(normalized));
  }), [templates, activeCategory, normalized]);

  return <>
    <section className="demo-library-toolbar premium-container">
      <div className="demo-search-wrap"><span>⌕</span><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search demos..." aria-label="Search demos" />{query && <button type="button" onClick={()=>setQuery('')} aria-label="Clear search">×</button>}</div>
      <div className="demo-filter-row" role="tablist" aria-label="Demo categories">
        {categories.map((category)=><button key={category} type="button" className={activeCategory===category?'demo-filter active':'demo-filter'} onClick={()=>setActiveCategory(category)}>{category==='all'?'All':labels[category]||category}</button>)}
      </div>
    </section>
    <section className="premium-container demo-template-results">
      <div className="demo-results-head"><div><p className="section-kicker">EXPLORE THE COLLECTION</p><h2>{filtered.length} template{filtered.length===1?'':'s'} to preview</h2></div><p>Click any card to open its live demo without loading every demo at once.</p></div>
      {filtered.length===0 ? <div className="template-empty-state"><span>⌕</span><h2>No demo found</h2><p>Try another search or category.</p></div> : <div className="demo-template-grid">
        {filtered.map((template)=><button key={template.slug} type="button" className="demo-template-card" onClick={()=>setSelected(template)}><CardPreview template={template}/><div className="demo-template-card-body"><div><span className="library-kicker">{template.slug==='master'?'FLAGSHIP':labels[template.category]||template.category}</span><h3>{template.name}</h3><p>{template.description}</p></div><span className="demo-template-card-arrow">↗</span></div></button>)}
      </div>}
    </section>
    {selected && <DemoModal template={selected} onClose={()=>setSelected(null)} />}
  </>;
}
