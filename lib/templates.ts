export type TemplateDefinition = {
  slug: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
  accent: string;
  kind: 'master' | 'wedding-proposal' | 'miss-you-1';
  originalHtml?: string;
};

// Single source of truth for templates that are actually installed and visible.
// A template only appears anywhere in the product when it is registered here.
export const templateCatalog: TemplateDefinition[] = [
  {
    slug: 'master',
    name: 'Magic Bloom',
    description: 'The original cinematic master experience.',
    category: 'birthday',
    emoji: '🎂',
    accent: '#ec4899',
    kind: 'master',
    originalHtml: '/master-template.html',
  },
  {
    slug: 'wedding-proposal',
    name: 'Wedding Proposal',
    description: 'The exact Wedding Proposal experience you supplied.',
    category: 'proposal',
    emoji: '💍',
    accent: '#ff2d55',
    kind: 'wedding-proposal',
    originalHtml: '/templates/wedding-proposal-original.html',
  },
  {
    slug: 'miss-you-1',
    name: 'Miss You 1',
    description: 'The original cherry-blossom Love Letter experience supplied for the Miss You section.',
    category: 'miss-you',
    emoji: '💌',
    accent: '#ff6b9d',
    kind: 'miss-you-1',
    originalHtml: '/templates/miss-you-1/index.html',
  },
];

export const templateBySlug = Object.fromEntries(templateCatalog.map((template) => [template.slug, template])) as Record<string, TemplateDefinition>;
export const templatesByCategory = templateCatalog.reduce<Record<string, TemplateDefinition[]>>((acc, template) => {
  (acc[template.category] ||= []).push(template);
  return acc;
}, {});
