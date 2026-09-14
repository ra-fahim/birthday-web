import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { templateCatalog, templateCategories } from '@/lib/templates';
export default async function Page({ searchParams }: { searchParams?: { category?: string } }){
 const u=await getSessionUser().catch(()=>null); const selected=searchParams?.category; const cats=templateCategories;
 const href=(id:string)=>u?`/builder/new?template=${id}`:`/signup?next=${encodeURIComponent(`/builder/new?template=${id}`)}`;
 return <main className="mx-auto max-w-7xl px-6 py-10"><Link href="/">← Home</Link>
  <header className="py-16"><p className="text-sm font-bold uppercase tracking-widest text-pink-400">Wish & template studio</p><h1 className="mt-3 text-5xl font-black md:text-7xl">Pick the message first.</h1><p className="mt-5 max-w-2xl text-lg text-zinc-400">Every wish gets its own collection. Birthday stays birthday, Sorry stays sorry, Miss You stays Miss You—and every template can be edited in Wishly Studio.</p></header>
  <div className="template-category-grid template-category-grid-page">{cats.map(c=><Link key={c.id} href={`/templates?category=${c.id}`} className={`template-category-card ${selected===c.id?'is-open':''}`}><span className="template-category-icon">{c.emoji}</span><span><strong>{c.label}</strong><small>{templateCatalog.filter(t=>t.category===c.id).length} designs</small></span><span className="template-category-arrow">→</span></Link>)}</div>
  <section className="mt-10"><div className="mb-6 flex items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-widest text-pink-400">{selected ? cats.find(c=>c.id===selected)?.label : 'All wishes'}</p><h2 className="mt-2 text-3xl font-black">{selected ? 'Templates for this wish' : 'Every template, ready to edit'}</h2></div>{selected&&<Link className="btn2" href="/templates">Show all</Link>}</div>
   <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{templateCatalog.filter(t=>!selected||t.category===selected).map(t=><article className="card overflow-hidden" key={t.slug}><div className="grid h-48 place-items-center bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-cyan-500/10 text-7xl">{t.emoji}</div><div className="p-6"><div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black">{t.name}</h2>{t.slug==='master'&&<span className="rounded-full bg-pink-400/10 px-2 py-1 text-[10px] font-bold uppercase text-pink-300">Flagship</span>}</div><p className="mt-2 text-xs uppercase tracking-widest text-pink-300">{t.categoryLabel}</p><p className="mt-3 text-sm leading-6 text-zinc-400">{t.description}</p><Link className="btn2 mt-5 inline-flex" href={href(t.slug)}>Edit this template →</Link></div></article>)}</div>
  </section>
 </main>;
}
