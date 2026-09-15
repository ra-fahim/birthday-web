import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import { templateCatalog } from '@/lib/templates';
import TemplateLibraryClient from '@/components/template/TemplateLibraryClient';

export const dynamic = 'force-dynamic';

export default async function DemoPage() {
  const u = await getSessionUser().catch(() => null);
  return (
    <main className="premium-site demo-page">
      <PublicNavbar user={u} />
      <TemplateLibraryClient templates={templateCatalog} isAuthenticated={!!u} demoMode />
    </main>
  );
}
