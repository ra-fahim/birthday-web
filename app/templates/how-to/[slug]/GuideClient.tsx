'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { TemplateDefinition } from '@/lib/templates';
import type { TemplateGuide } from '@/lib/template-guides';

export default function GuideClient({ template, guide }: { template: TemplateDefinition; guide: TemplateGuide }) {
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const current = useMemo(() => guide[lang], [guide, lang]);
  return (
    <main className="premium-site guide-page">
      <div className="premium-container guide-wrap">
        <div className="guide-topbar">
          <Link href="/templates" className="text-link">← Template Library</Link>
          <div className="guide-lang-switch" role="group" aria-label="Guide language">
            <button type="button" className={lang === 'bn' ? 'active' : ''} onClick={() => setLang('bn')}>বাংলা</button>
            <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>English</button>
          </div>
        </div>
        <div className="guide-hero">
          <span className="section-kicker">HOW TO CREATE THIS TEMPLATE</span>
          <h1>{template.emoji} {template.name}</h1>
          <p>{current.intro}</p>
          <div className="guide-actions">
            <Link className="premium-button premium-button-sm" href={`/builder/new?template=${encodeURIComponent(template.slug)}`}>Use template →</Link>
            <span className="guide-mode-note">{lang === 'bn' ? 'সহজ ধাপে ধাপে নির্দেশনা' : 'Step-by-step instructions'}</span>
          </div>
        </div>
        <div className="guide-list">
          {current.sections.map((section, index) => (
            <article key={`${lang}-${index}-${section.title}`} className="guide-card">
              <div className="guide-step">{String(index + 1).padStart(2, '0')}</div>
              <div><h2>{section.title}</h2><p>{section.body}</p></div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
