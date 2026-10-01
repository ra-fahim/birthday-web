import { getSessionUser } from '@/lib/auth';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import TemplateCatalogClient from '@/components/template/TemplateCatalogClient';
import { templateCatalog } from '@/lib/templates';

export default async function Page() {
  const u = await getSessionUser().catch(() => null);
  return (
    <main className="premium-site">
      <PublicNavbar user={u} />
      <TemplateCatalogClient templates={templateCatalog} isAuthenticated={!!u} />
    </main>
  );
}
