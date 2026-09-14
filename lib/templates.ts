export type TemplateCatalogItem = {
  slug: string;
  name: string;
  description: string;
  category: string;
};

export const templateCatalog: TemplateCatalogItem[] = [
  ['master','Master Template','Original HTML experience','birthday'],
  ['birthday','Birthday Story','Dedicated birthday celebration','birthday'],
  ['anniversary','Anniversary Story','Dedicated anniversary experience','anniversary'],
  ['proposal','Proposal Story','Dedicated proposal experience','proposal'],
  ['master-proposal','Master proposal','A full cinematic love-letter proposal experience','proposal'],
  ['wedding-proposal','Wedding Proposal','A cinematic proposal question experience','wedding'],
  ['wedding','Wedding Story','Dedicated wedding experience','wedding'],
  ['sorry','Sorry Story','Thoughtful apology experience','sorry'],
  ['miss-you','Miss You Story','Warm long-distance message','miss-you'],
  ['thank-you','Thank You Story','Gratitude-focused experience','thank-you'],
  ['congratulations','Congratulations Story','Big-win celebration','congratulations'],
  ['graduation','Graduation Story','Next-chapter celebration','graduation'],
  ['friendship','Friendship Story','Friendship tribute','friendship'],
  ['surprise','Surprise Story','Playful reveal experience','surprise'],
  ['festival','Festival Story','Colorful celebration','festival'],
  ['romantic','Romantic','Soft romantic style','romantic'],
  ['cute','Cute','Playful style','cute'],
  ['luxury','Luxury','Premium elegant style','luxury'],
  ['anime','Anime','Anime-inspired style','anime'],
  ['gaming','Gaming','Gaming style','gaming'],
  ['minimal','Minimal','Clean minimal style','minimal'],
  ['elegant','Elegant','Classic elegant style','elegant'],
].map(([slug,name,description,category]) => ({slug,name,description,category}));

export function getTemplatesForOccasion(occasion: string) {
  return templateCatalog.filter((template) => template.category === occasion);
}

export function getTemplate(slug: string) {
  return templateCatalog.find((template) => template.slug === slug) || null;
}
