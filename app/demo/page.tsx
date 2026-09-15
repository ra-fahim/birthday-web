import Link from 'next/link';
import MasterTemplate from '@/components/template/MasterTemplate';
import DemoLibraryClient from '@/components/demo/DemoLibraryClient';
import { templateCatalog } from '@/lib/templates';

export const dynamic = 'force-dynamic';

export default function DemoPage() {
  const master = templateCatalog.find((t) => t.slug === 'master') || templateCatalog[0];
  return <main className="premium-site demo-page">
    <nav className="premium-nav"><div className="premium-container premium-nav-inner"><Link href="/" className="brand-lockup"><span className="brand-mark">✦</span><span><b>Wishly</b><small>Studio</small></span></Link><div className="premium-nav-links"><Link href="/templates">Templates</Link><Link href="/features">Features</Link><Link href="/pricing">Pricing</Link><Link href="/demo" className="active">Demo</Link></div><Link className="premium-button premium-button-sm" href="/builder/new">Create website →</Link></div></nav>
    <section className="premium-container demo-hero"><div className="demo-hero-copy"><p className="section-kicker">THE DEMO ROOM</p><h1>See the real<br/><span>experience.</span></h1><p>One featured Master Birthday experience runs live here. Choose another template below to open its demo without leaving this page.</p></div><div className="demo-feature-card"><div className="demo-feature-head"><div><span className="library-kicker">BIRTHDAY · FLAGSHIP</span><h2>{master?.name || 'Master Birthday'}</h2></div><span className="demo-live-pill"><i/> LIVE</span></div><div className="demo-feature-canvas"><MasterTemplate demo/><div className="demo-feature-scrim"/><div className="demo-feature-badge">🔇 Muted auto demo</div></div></div></section>
    <DemoLibraryClient templates={templateCatalog}/>
  </main>;
}
