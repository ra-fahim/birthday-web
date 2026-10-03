export type TemplateDefinition = {
  slug: string;
  name: string;
  description: string;
  category: string;
  emoji: string;
  accent: string;
  kind: 'master' | 'master-birthday' | 'wedding-proposal' | 'miss-you-1';
  originalHtml?: string;
};

export const templateCatalog: TemplateDefinition[] = [
  {
    slug: 'master',
    name: 'Master Template',
    description: 'The flagship cinematic birthday experience — built as the main editable template for your first website.',
    category: 'birthday',
    emoji: '🎂',
    accent: '#ec4899',
    kind: 'master',
    originalHtml: '/templates/master-birthday/runtime.html',
  },
  {
    slug: 'wedding-proposal',
    name: 'Wedding Proposal',
    description: 'The exact Wedding Proposal experience you supplied.',
    category: 'wedding',
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
