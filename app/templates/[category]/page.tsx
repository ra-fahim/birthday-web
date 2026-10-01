import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import TemplateCatalogClient from '@/components/template/TemplateCatalogClient';
import { templateCatalog, templatesByCategory } from '@/lib/templates';

const labels: Record<string, string> = {
  birthday: 'Birthday', proposal: 'Proposal', anniversary: 'Anniversary', wedding: 'Wedding', sorry: 'Sorry', 'miss-you': 'Miss You',
  'thank-you': 'Thank You', congratulations: 'Congratulations', graduation: 'Graduation', friendship: 'Friendship', surprise: 'Surprise', festival: 'Festival',
};

export function generateStaticParams() {
  return Array.from(new Set(templateCatalog.map((template) => template.category))).map((category) => ({ category }));
}

export default async function CategoryTemplatesPage({ params }: { params: { category: string } }) {
  const category = decodeURIComponent(params.category).toLowerCase();
  const templates = templatesByCategory[category];
  if (!templates?.length) notFound();
  const u = await getSessionUser().catch(() => null);
  const label = labels[category] || category;

  return (
    <main className="premium-site">
      <PublicNavbar user={u} />
      <div className="premium-container template-breadcrumb"><Link href="/create">← All occasions</Link><span>/</span><strong>{label}</strong></div>
      <TemplateCatalogClient
        templates={templates}
        isAuthenticated={!!u}
        heading={`${label} templates.`}
        subheading={`Preview each ${label.toLowerCase()} experience on its own, then choose the one you want to customize.`}
      />
    </main>
  );
}
