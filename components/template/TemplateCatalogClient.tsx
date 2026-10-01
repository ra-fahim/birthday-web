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

function getDemoSrc(template: TemplateDefinition) {
  const src = demoSrc[template.slug] || template.originalHtml || '';
  if (!src || src.includes('bbDemo=')) return src;
  return `${src}${src.includes('?') ? '&' : '?'}bbDemo=1`;
}

function LiveTemplatePreview({ template, compact = false }: { template: TemplateDefinition; compact?: boolean }) {
  const src = getDemoSrc(template);
  return (
    <div className={compact ? 'catalog-template-live catalog-template-live-compact' : 'catalog-template-live'} aria-hidden="true">
      <iframe
        title={`${template.name} live preview`}
        src={src}
        loading="lazy"
        allow="fullscreen; picture-in-picture"
        tabIndex={-1}
        className="catalog-template-live-iframe"
        onLoad={(event) => {
          event.currentTarget.contentWindow?.postMessage({ type: 'BB_DEMO_MODE', enabled: true, muted: true }, '*');
        }}
      />
      <div className="catalog-template-live-head">
        <span className="live-dot" />
        <span>LIVE PREVIEW</span>
        <span className="catalog-template-live-muted">🔇</span>
      </div>
      <div className="catalog-template-live-scrim" />
    </div>
  );
}

function DemoModal({ template, onClose }: { template: TemplateDefinition; onClose: () => void }) {
  const src = getDemoSrc(template);
  return (
    <div className="demo-modal-backdrop" role="dialog" aria-modal="true" aria-label={`${template.name} demo`} onClick={onClose}>
      <div className="demo-modal" onClick={(event) => event.stopPropagation()}>
        <div className="demo-modal-head">
          <div><span className="section-kicker">LIVE DEMO</span><h2>{template.name}</h2></div>
          <button className="demo-modal-close" type="button" onClick={onClose} aria-label="Close demo">×</button>
        </div>
        <div className="demo-modal-frame">
          <iframe
            title={`${template.name} demo`}
            src={src}
            allow="fullscreen; picture-in-picture"
            onLoad={(event) => {
              event.currentTarget.contentWindow?.postMessage({ type: 'BB_DEMO_MODE', enabled: true, muted: true }, '*');
            }}
          />
        </div>
        <div className="demo-modal-footer">
          <p>Live preview is muted. The template will be editable after you use it.</p>
          <Link className="premium-button premium-button-sm" href={`/builder/new?template=${template.slug}`}>Use template <span>→</span></Link>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ template, isAuthenticated, onDemo }: { template: TemplateDefinition; isAuthenticated: boolean; onDemo: (template: TemplateDefinition) => void }) {
  const useHref = isAuthenticated
    ? `/builder/new?template=${template.slug}`
    : `/signup?next=${encodeURIComponent(`/builder/new?template=${template.slug}`)}`;

  return (
    <article className="catalog-template-card">
      <div className="catalog-template-preview" style={{ ['--template-accent' as string]: template.accent }}>
        <LiveTemplatePreview template={template} />
      </div>
      <div className="catalog-template-copy">
        <div>
          <span className="library-kicker">{labels[template.category] || template.category}</span>
          <h2>{template.name}</h2>
          <p>{template.description}</p>
        </div>
        <div className="catalog-template-actions">
          <button type="button" className="premium-button premium-button-ghost premium-button-sm" onClick={() => onDemo(template)}>See demo <span>↗</span></button>
          <Link className="premium-button premium-button-sm" href={useHref}>{isAuthenticated ? 'Use template' : 'Create website'} <span>→</span></Link>
        </div>
      </div>
    </article>
  );
}

export default function TemplateCatalogClient({
  templates,
  isAuthenticated,
  eyebrow = 'TEMPLATES',
  heading = 'Choose a template.',
  subheading = 'Every template is shown on its own. Preview it first, then use it to open the editor.',
}: {
  templates: TemplateDefinition[];
  isAuthenticated: boolean;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
}) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<TemplateDefinition | null>(null);
  const normalized = query.trim().toLowerCase();
  const filtered = useMemo(() => templates.filter((template) => {
    if (!normalized) return true;
    return [template.name, template.description, template.category, template.slug].some((value) => value.toLowerCase().includes(normalized));
  }), [templates, normalized]);

  return (
    <section className="template-catalog-page">
      <div className="premium-container inner-hero template-catalog-hero">
        <p className="section-kicker">{eyebrow}</p>
        <h1>{heading}</h1>
        <p>{subheading}</p>
      </div>

      <div className="premium-container template-catalog-toolbar">
        <div className="template-search-wrap">
          <span className="template-search-icon">⌕</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search templates…" aria-label="Search templates" />
          {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
        </div>
      </div>

      <div className="premium-container catalog-template-list">
        {filtered.map((template) => <TemplateCard key={template.slug} template={template} isAuthenticated={isAuthenticated} onDemo={setSelected} />)}
        {!filtered.length && (
          <div className="template-empty-state"><span>⌕</span><h2>No templates found</h2><p>Try a different template name or occasion.</p></div>
        )}
      </div>

      {selected && <DemoModal template={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
