import { getSessionUser } from '@/lib/auth';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import TemplateCatalogClient from '@/components/template/TemplateCatalogClient';
import { templateCatalog } from '@/lib/templates';
import { pageMeta } from '@/lib/seo';
export const metadata = pageMeta({ title: 'Wish Website Templates — Birthday, Proposal, Anniversary, Sorry & More', description: 'Browse templates for birthday wishes, proposing to your girlfriend, anniversary, wedding, sorry, miss you, thank you, graduation, friendship and festival wishes.', path: '/templates', keywords: [] });

export default async function Page() {
  const u = await getSessionUser().catch(() => null);
  return (
    <main className="premium-site">
      <PublicNavbar user={u} />
      <TemplateCatalogClient templates={templateCatalog} isAuthenticated={!!u} />
    </main>
  );
}
