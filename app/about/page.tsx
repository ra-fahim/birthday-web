import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import PublicNavbar from '@/components/navigation/PublicNavbar';

const values = [
  ['01', 'Simple by default', 'Choose a template, click what you want to change, save your work and publish. The interface stays quiet until you need it.'],
  ['02', 'Made for real people', 'Wishly is built for people who want a beautiful result without having to learn HTML, CSS or JavaScript.'],
  ['03', 'Every template stays unique', 'Templates can have different sections, media, music layers and interactive moments. The editor adapts to the experience.'],
];

export default async function AboutPage() {
  const u = await getSessionUser().catch(() => null);
  return <main className="premium-site">
    <PublicNavbar user={u} />
    <section className="premium-container inner-hero about-hero">
      <p className="section-kicker">ABOUT WISHLY STUDIO</p>
      <h1>Small moments deserve<br/><span>a beautiful place online.</span></h1>
      <p>Wishly Studio helps anyone turn a birthday, proposal, wedding, memory or personal story into an interactive experience they can share with one link.</p>
    </section>
    <section className="premium-container about-story">
      <div className="about-story-card"><span>✦</span><h2>We hide the complexity.</h2><p>Under the surface, the templates can be rich and interactive. In the studio, people simply work with the thing they can see.</p></div>
      <div className="about-story-copy"><p className="section-kicker">OUR APPROACH</p><h2>Pick. Personalize. Publish.</h2><p>From the first photo to the final share link, every step is designed to feel obvious. Upload your own media, change the words, set the moment, save a draft and publish when it feels right.</p><Link className="premium-button premium-button-ghost" href="/templates">Explore templates <span>→</span></Link></div>
    </section>
    <section className="feature-section"><div className="premium-container"><div className="section-heading center"><p className="section-kicker">WHAT WE BELIEVE</p><h2>A better builder feels<br/><span>less like software.</span></h2></div><div className="feature-grid about-values">{values.map(([n,t,d])=><article className="feature-card" key={n}><span className="feature-number">{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>
    <section className="premium-container cta-section"><div className="cta-panel"><div><p className="section-kicker">READY TO MAKE SOMETHING?</p><h2>Start with a template that already feels right.</h2></div><Link className="premium-button" href={u?'/builder/new':'/signup'}>{u?'Create website':'Start free'} <span>→</span></Link></div></section>
  </main>;
}
