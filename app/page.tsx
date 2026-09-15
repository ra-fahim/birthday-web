import Link from 'next/link';
import type { Metadata } from 'next';
import { getSessionUser } from '@/lib/auth';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import TemplateShowcase from '@/components/home/TemplateShowcase';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title:'Wishly Studio — Create moments they remember', description:'Build beautiful interactive celebration websites in minutes.' };

const chips=[['🎂','Birthday'],['💍','Proposal'],['💕','Anniversary'],['💒','Wedding'],['💌','Miss You'],['🎓','Graduation']];
const features=[['01','Visual editor','Tap any part of your page and edit it instantly. No complicated forms.'],['02','Your memories, beautifully','Photos, gallery, video, letters, wishes and music all live in one experience.'],['03','Made for phones','Design comfortably from mobile, preview every breakpoint and publish with confidence.']];

export default async function Home(){
 const u=await getSessionUser().catch(()=>null);
 return <main className="premium-site">
  <PublicNavbar user={u} />


  <section className="hero premium-container">
   <div className="hero-copy">
    <div className="eyebrow"><span>✦</span> DIGITAL EXPERIENCES FOR REAL FEELINGS</div>
    <h1>Make their moment feel <em>unforgettable.</em></h1>
    <p>Create a beautiful, interactive website for the person, story or celebration that matters. Pick a template, make it yours, share one link.</p>
    <div className="hero-actions"><Link className="premium-button" href={u?'/builder/new':'/signup'}>Create for free <span>→</span></Link><Link className="premium-button premium-button-ghost" href="/demo"><span className="play-dot">▶</span> See the experience</Link></div>
    <div className="hero-proof"><span><b>⚡</b> Fast to create</span><span><b>📱</b> Mobile first</span><span><b>🔗</b> One shareable link</span></div>
   </div>
   <div className="hero-art">
    <div className="hero-orbit orbit-a"></div><div className="hero-orbit orbit-b"></div>
    <div className="hero-card hero-card-back"><small>FOR SOMEONE SPECIAL</small><strong>Keep the memories close.</strong><span>Photos · Music · Wishes</span></div>
    <div className="hero-card hero-card-main"><div className="hero-card-top"><span>✦ WISHLy STUDIO</span><span>•••</span></div><div className="hero-photo"><span>♥</span></div><p>A little corner of the internet, made just for you.</p><div className="hero-mini-actions"><i>♡</i><i>♫</i><i>✉</i></div></div>
    <div className="floating-badge badge-one">✓ Auto-saved</div><div className="floating-badge badge-two">🎵 Music on</div>
   </div>
  </section>

  <section className="occasion-strip"><div className="premium-container"><p className="section-kicker">START WITH A FEELING</p><div className="occasion-row">{chips.map(([i,t])=><Link href={`/templates?occasion=${t.toLowerCase().replace(' ','-')}`} key={t}><span>{i}</span>{t}<b>↗</b></Link>)}</div></div></section>

  <section className="premium-container showcase-section"><div className="section-heading-row"><div><p className="section-kicker">TEMPLATE COLLECTION</p><h2>Beautiful before you even edit it.</h2><p>Distinct visual styles, ready for your story.</p></div><Link className="text-link" href="/templates">Browse all templates →</Link></div><TemplateShowcase loggedIn={!!u}/></section>

  <section className="feature-section"><div className="premium-container"><div className="section-heading center"><p className="section-kicker">WHY WISHLY</p><h2>Simple enough for anyone.<br/><span>Premium enough to keep.</span></h2></div><div className="feature-grid">{features.map(([n,t,d])=><article className="feature-card" key={n}><span className="feature-number">{n}</span><div className="feature-icon">✦</div><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>

  <section className="premium-container cta-section"><div className="cta-panel"><div><p className="section-kicker">YOUR NEXT STORY</p><h2>Make something they’ll want to open twice.</h2><p>Start with a template. Finish with something that feels like them.</p></div><Link className="premium-button" href={u?'/builder/new':'/signup'}>Start creating <span>→</span></Link></div></section>

  <footer className="premium-footer"><div className="premium-container footer-inner"><div className="brand-lockup"><span className="brand-mark">✦</span><span><b>Wishly</b><small>Studio</small></span></div><div className="footer-links"><Link href="/templates">Templates</Link><Link href="/features">Features</Link><Link href="/pricing">Pricing</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link></div><small>© {new Date().getFullYear()} Wishly Studio</small></div></footer>
 </main>
}
