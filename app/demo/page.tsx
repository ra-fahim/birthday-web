import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { templateCatalog } from '@/lib/templates';
import TemplateLibraryClient from '@/components/template/TemplateLibraryClient';

export const dynamic = 'force-dynamic';

export default async function DemoPage() {
  const u = await getSessionUser().catch(() => null);
  return (
    <main className="premium-site demo-page">
      <nav className="premium-nav">
        <div className="premium-container premium-nav-inner">
          <Link href="/" className="brand-lockup"><span className="brand-mark">✦</span><span><b>Wishly</b><small>Studio</small></span></Link>
          <div className="premium-nav-links"><Link href="/templates">Templates</Link><Link href="/features">Features</Link><Link href="/pricing">Pricing</Link><Link href="/demo" className="active">Demo</Link></div>
          <Link className="premium-button premium-button-sm" href={u ? '/builder/new' : '/signup'}>{u ? 'Create website' : 'Start free'} →</Link>
        </div>
      </nav>
      <TemplateLibraryClient templates={templateCatalog} isAuthenticated={!!u} demoMode />
    </main>
  );
}
