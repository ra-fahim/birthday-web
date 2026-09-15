import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import { templateCatalog } from '@/lib/templates';
import TemplateLibraryClient from '@/components/template/TemplateLibraryClient';

export default async function Page() {
  const u = await getSessionUser().catch(() => null);
  return (
    <main className="premium-site">
      <PublicNavbar user={u} />
      <TemplateLibraryClient templates={templateCatalog} isAuthenticated={!!u} />
    </main>
  );
}
