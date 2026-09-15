import Link from 'next/link';
import PublicNavbar from '@/components/navigation/PublicNavbar';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const steps = [
  ['01', 'Create an account', 'Sign up or log in first. Your websites, drafts and published links are kept inside your account workspace.'],
  ['02', 'Choose a template', 'Open Template Library, search by name or category, preview the options, then choose the template that fits your occasion.'],
  ['03', 'Open Studio', 'Your selected template opens in Studio. The original template structure stays in place while the editor works with its editable content.'],
  ['04', 'Turn Canvas Edit ON', 'Use Canvas Edit when you want to select items directly from the live preview. Editable items can show an edit icon. You can click that icon or double-click an editable item.'],
  ['05', 'Edit text', 'Select an editable text item and change the wording. The editor only changes the data connected to that template field.'],
  ['06', 'Edit photos', 'Open the photo/gallery editor to replace an existing photo, remove it, add a new photo, reorder items when supported, and edit captions where the template uses captions.'],
  ['07', 'Edit videos', 'Replace or add videos with an uploaded file or a public video URL supported by the template. When a video has a caption field, edit the caption from the same section.'],
  ['08', 'Edit music', 'Templates can have different music slots. For example, a template may have background, countdown or wishing audio separately. Edit only the slots that exist in that template.'],
  ['09', 'Set a countdown', 'When a template has a countdown, select the countdown and choose its target date and time. The saved target is used by both Studio preview and the published version.'],
  ['10', 'Use the sidebar', 'The Studio menu groups controls by the current template. Media, music and other sections only appear when the template exposes those editable parts.'],
  ['11', 'Save draft', 'Click Save draft while you work. A draft keeps your changes saved for this website but does not make them public yet.'],
  ['12', 'Create your live link', 'When everything looks right, publish/create the live link. Your published URL opens the saved version you published for that website.'],
] as const;

const tips = [
  ['Edit mode', 'Normal preview stays clean. Turn Canvas Edit ON only when you want selection controls.'],
  ['Mobile first', 'The Studio is designed to be comfortable on a phone, with the side menu and contextual editor available without forcing you to use code.'],
  ['Template-aware', 'Every template can have a different set of editable fields. Do not expect one template to have exactly the same controls as another.'],
  ['Save vs Publish', 'Save draft is for your private working version. Publish is the step that updates the public live version.'],
] as const;

export default async function HowToMakeWebsite() {
  const user = await getSessionUser().catch(() => null);
  return <main className="premium-site howto-page">
    <PublicNavbar user={user} />
    <section className="premium-container simple-heading howto-hero">
      <Link className="back-link" href="/">← Back to home</Link>
      <p className="section-kicker">HOW TO MAKE A WEBSITE</p>
      <h1>Build it your way.<br/><span>One simple flow.</span></h1>
      <p>Everything you need to go from a ready-made template to a saved, shareable website — explained step by step.</p>
      <div className="howto-actions"><Link className="premium-button" href={user ? '/builder/new' : '/signup'}>Start creating →</Link><Link className="premium-button premium-button-ghost" href="/templates">Browse templates</Link></div>
    </section>

    <section className="premium-container howto-section">
      <div className="howto-intro"><div><p className="section-kicker">THE BASIC FLOW</p><h2>Template → Edit → Save → Publish</h2></div><p>Wishly keeps the original template code and lets the Studio edit the data exposed by that specific template.</p></div>
      <div className="howto-step-grid">{steps.map(([n,title,desc]) => <article className="howto-step" key={n}><span>{n}</span><div><h3>{title}</h3><p>{desc}</p></div></article>)}</div>
    </section>

    <section className="feature-section howto-dark-section"><div className="premium-container"><div className="section-heading center"><p className="section-kicker">STUDIO BASICS</p><h2>Know these four things<br/><span>and you’re ready.</span></h2></div><div className="howto-tip-grid">{tips.map(([title,desc])=><article className="howto-tip" key={title}><span>✦</span><h3>{title}</h3><p>{desc}</p></article>)}</div></div></section>

    <section className="premium-container howto-section"><div className="howto-checklist"><div><p className="section-kicker">BEFORE YOU PUBLISH</p><h2>Quick final check.</h2><p>Open Preview and make sure your content, media and countdown are correct. Save your draft, then publish when you are happy.</p></div><div className="howto-checklist-card">{['Recipient / names look correct','Photos and videos are the right ones','Music slots are correct','Countdown date and time are correct','Buttons and links open the right destination','Draft is saved before publishing'].map(item=><div key={item}><i>✓</i><span>{item}</span></div>)}</div></div></section>

    <footer className="premium-footer"><div className="premium-container footer-inner"><div className="brand-lockup"><span className="brand-mark">✦</span><span><b>Wishly</b><small>Studio</small></span></div><div className="footer-links"><Link href="/templates">Templates</Link><Link href="/demo">Demo</Link><Link href="/about">About</Link><Link href="/faq">FAQ</Link><Link href="/contact">Contact</Link></div><small>© {new Date().getFullYear()} Wishly Studio</small></div></footer>
  </main>;
}
