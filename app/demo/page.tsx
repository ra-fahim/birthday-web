import { getSessionUser } from '@/lib/auth';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import TemplateCatalogClient from '@/components/template/TemplateCatalogClient';
import { templateCatalog } from '@/lib/templates';

export const dynamic = 'force-dynamic';

export default async function DemoPage() {
  const u = await getSessionUser().catch(() => null);
  return (
    <main className="premium-site demo-page">
      <PublicNavbar user={u} />
      <TemplateCatalogClient
        templates={templateCatalog}
        isAuthenticated={!!u}
        eyebrow="LIVE DEMOS"
        heading="See the experience."
        subheading="Every live experience appears as one clean card. Preview it here, then use the template you want to customize."
      />
    </main>
  );
}
