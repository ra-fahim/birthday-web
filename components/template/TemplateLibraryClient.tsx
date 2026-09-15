'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { TemplateDefinition } from '@/lib/templates';

const labels: Record<string, string> = {
  birthday: 'Birthday', proposal: 'Proposal', anniversary: 'Anniversary', wedding: 'Wedding', sorry: 'Sorry', 'miss-you': 'Miss You',
  'thank-you': 'Thank You', congratulations: 'Congratulations', graduation: 'Graduation', friendship: 'Friendship', surprise: 'Surprise', festival: 'Festival',
};

const demoSrc: Record<string, string> = {
  master: '/master-template.html?demo=1&bbDemo=1',
  'wedding-proposal': '/templates/wedding-proposal-original.html?bbDemo=1',
  'master-proposal': '/templates/master-proposal/index.html?bbDemo=1',
  'miss-you-1': '/templates/miss-you-1/index.html?bbDemo=1',
};

function DemoFrame({ template }: { template: TemplateDefinition }) {
  const src = demoSrc[template.slug] || template.originalHtml || '';
  return (
    <div className="library-live-demo" aria-hidden="true">
      <div className="library-live-demo-head">
        <span className="live-dot" />
        <span>LIVE DEMO</span>
        <span className="library-live-muted">🔇</span>
      </div>
      <iframe
        title={`${template.name} live demo`}
        src={src}
        loading="lazy"
        allow="autoplay; fullscreen; picture-in-picture"
        tabIndex={-1}
        className="library-live-iframe"
        onLoad={(e) => {
          e.currentTarget.contentWindow?.postMessage({ type: 'BB_DEMO_MODE', enabled: true, muted: true }, '*');
        }}
      />
      <div className="library-demo-scrim" />
    </div>
  );
}

export default function TemplateLibraryClient({ templates, isAuthenticated }: { templates: TemplateDefinition[]; isAuthenticated: boolean }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const normalized = query.trim().toLowerCase();
  const categories = useMemo(() => ['all', ...Array.from(new Set(templates.map((t) => t.category)))], [templates]);
  const filtered = useMemo(() => templates.filter((t) => {
    const categoryMatch = activeCategory === 'all' || t.category === activeCategory;
    if (!categoryMatch) return false;
    if (!normalized) return true;
    return [t.name, t.description, t.category, t.slug].some((value) => value.toLowerCase().includes(normalized));
  }), [templates, activeCategory, normalized]);
  const grouped = useMemo(() => filtered.reduce<Record<string, TemplateDefinition[]>>((acc, template) => {
    (acc[template.category] ||= []).push(template);
    return acc;
  }, {}), [filtered]);

  return (
    <section className="template-library">
      <div className="premium-container template-library-controls">
        <div className="template-search-panel">
          <div className="template-search-wrap">
            <span className="template-search-icon">⌕</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates…"
              aria-label="Search templates"
            />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
          </div>
          <div className="template-filter-row" role="tablist" aria-label="Template categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={activeCategory === category ? 'template-filter active' : 'template-filter'}
                onClick={() => setActiveCategory(category)}
              >
                {category === 'all' ? 'All' : labels[category] || category}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="premium-container inner-hero templates-hero template-library-hero">
        <p className="section-kicker">TEMPLATE LIBRARY</p>
        <h1>Start with a style.<br /><span>Make it yours.</span></h1>
        <p>Preview every experience live, muted and touch-free—then choose the one you want to edit.</p>
      </section>

      <div className="premium-container template-library-results">
      {filtered.length === 0 ? (
        <div className="template-empty-state">
          <span>⌕</span>
          <h2>No template found</h2>
          <p>Try another name, style or occasion.</p>
        </div>
      ) : Object.entries(grouped).map(([category, items]) => (
        <div className="template-category" key={category}>
          <div className="section-heading-row">
            <div>
              <p className="section-kicker">{labels[category] || category}</p>
              <h2>{items.length} ready-to-edit experience{items.length === 1 ? '' : 's'}</h2>
            </div>
          </div>
          <div className="library-grid">
            {items.map((t) => (
              <article className="library-card library-card-live" key={t.slug}>
                <DemoFrame template={t} />
                <div className="library-card-body">
                  <div className="library-card-copy">
                    <span className="library-kicker">{t.slug === 'master' ? 'FLAGSHIP' : 'READY TO EDIT'}</span>
                    <h3>{t.name}</h3>
                    <p>{t.description}</p>
                  </div>
                  <Link className="premium-button premium-button-sm" href={isAuthenticated ? `/builder/new?template=${t.slug}` : `/signup?next=${encodeURIComponent(`/builder/new?template=${t.slug}`)}`}>
                    Use template <span>→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      ))}
      </div>
    </section>
  );
}
