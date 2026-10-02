import Link from 'next/link';
import { notFound } from 'next/navigation';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import GuideClient from './GuideClient';
import { templateBySlug, templateCatalog } from '@/lib/templates';
import { getTemplateGuide } from '@/lib/template-guides';
import { getSessionUser } from '@/lib/auth';

export function generateStaticParams() {
  return templateCatalog.map((template) => ({ slug: template.slug }));
}

export default async function HowToTemplatePage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug).toLowerCase();
  const template = templateBySlug[slug];
  if (!template) notFound();
  const user = await getSessionUser().catch(() => null);
  return (
    <>
      <PublicNavbar user={user} />
      <div className="premium-container template-breadcrumb"><Link href="/templates">← All templates</Link><span>/</span><strong>{template.name}</strong></div>
      <GuideClient template={template} guide={getTemplateGuide(template)} />
    </>
  );
}
