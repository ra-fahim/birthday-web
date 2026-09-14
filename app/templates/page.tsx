import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { templatesByCategory } from '@/lib/templates';

const labels: Record<string,string> = {
  birthday:'Birthday', proposal:'Proposal', anniversary:'Anniversary', wedding:'Wedding', sorry:'Sorry', 'miss-you':'Miss You', 'thank-you':'Thank You', congratulations:'Congratulations', graduation:'Graduation', friendship:'Friendship', surprise:'Surprise', festival:'Festival'
};

export default async function Page(){
  const u=await getSessionUser().catch(()=>null);
  const categories=Object.entries(templatesByCategory);
  return <main className="mx-auto max-w-7xl px-6 py-10">
    <Link href="/">← Home</Link>
    <header className="py-16">
      <p className="text-sm font-bold uppercase tracking-widest text-pink-400">Template gallery</p>
      <h1 className="mt-3 text-5xl font-black md:text-7xl">Only the templates you actually add.</h1>
      <p className="mt-5 max-w-2xl text-lg text-zinc-400">Every occasion section is driven by the installed template catalog. Empty sections stay out of the gallery until you add a template.</p>
    </header>
    <div className="space-y-14">
      {categories.map(([category, items]) => <section key={category}>
        <div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.25em] text-pink-400">{labels[category] || category}</p><h2 className="mt-2 text-3xl font-black">{items.length} template{items.length===1?'':'s'}</h2></div></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((template)=><article className={`card overflow-hidden ${template.slug==='master'?'ring-1 ring-pink-400/40':''}`} key={template.slug}>
            <div className="grid h-52 place-items-center bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-cyan-500/10 text-7xl">{template.emoji}</div>
            <div className="p-6"><div className="flex items-center justify-between gap-3"><h3 className="text-xl font-black">{template.name}</h3>{template.slug==='master'&&<span className="rounded-full bg-pink-400/10 px-2 py-1 text-[10px] font-bold uppercase text-pink-300">Master</span>}</div><p className="mt-3 text-sm leading-6 text-zinc-400">{template.description}</p><Link className="btn2 mt-5 inline-flex" href={u ? `/builder/new?template=${template.slug}` : `/signup?next=${encodeURIComponent(`/builder/new?template=${template.slug}`)}`}>{template.slug==='master'?'Start with Master Template':'Use this template'}</Link></div>
          </article>)}
        </div>
      </section>)}
    </div>
  </main>
}
