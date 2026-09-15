import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import PublicNavbar from '@/components/navigation/PublicNavbar';
type Plan = { name: string; sub: string; items: string[] };
const plans: Plan[] = [
  { name: 'Free', sub: 'A beautiful starting point', items: ['1 published experience', 'Master template', 'Basic theme controls', 'Guestbook & reactions'] },
  { name: 'Pro', sub: 'More creative control', items: ['Unlimited experiences', 'All available templates', 'Advanced media & themes', 'Analytics + remove branding'] },
  { name: 'Studio', sub: 'For serious creators', items: ['Everything in Pro', 'Advanced publishing tools', 'Priority limits', 'Creator/admin controls'] },
];
export default async function Page(){const u=await getSessionUser().catch(()=>null);return <main className="premium-site"><PublicNavbar user={u} /><section className="premium-container inner-hero center"><p className="section-kicker">SIMPLE PLANS</p><h1>Start with the moment.<br/><span>Upgrade the toolkit.</span></h1><p>Keep the experience simple. Choose more tools only when you actually need them.</p></section><section className="premium-container pricing-grid">{plans.map((plan,i)=><article className={`pricing-card ${i===1?'featured':''}`} key={plan.name}>{i===1&&<div className="pricing-ribbon">MOST POPULAR</div>}<span className="pricing-index">0{i+1}</span><h2>{plan.name}</h2><p>{plan.sub}</p><div className="pricing-divider"></div><ul>{plan.items.map(x=><li key={x}><span>✓</span>{x}</li>)}</ul><Link className={`premium-button ${i===1?'':'premium-button-ghost'}`} href="/signup">Get started <span>→</span></Link></article>)}</section></main>}
