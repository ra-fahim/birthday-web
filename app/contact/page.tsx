import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import { pageMeta } from '@/lib/seo';
export const metadata = pageMeta({ title: 'Contact Wishes', description: 'Questions about your birthday wish or proposal website? Get in touch with the Wishes team.', path: '/contact', keywords: [] });
export default async function Page(){const u=await getSessionUser().catch(()=>null);return <main className="premium-site"><PublicNavbar user={u}/><section className="premium-container simple-page"><div className="simple-panel"><p className="section-kicker">CONTACT</p><h1>Let’s make the experience better.</h1><p>Need help with a website, publishing, templates or account settings? Your support setup lives here.</p><Link className="premium-button" href={u?'/dashboard':'/login'}>{u?'Open workspace':'Sign in'} <span>→</span></Link></div></section></main>}
