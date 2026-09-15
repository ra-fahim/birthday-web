import MasterTemplate from '@/components/template/MasterTemplate';
import ExperienceTemplate from '@/components/template/ExperienceTemplates';
import MasterBirthdayTemplate from '@/components/template/MasterBirthdayTemplate';
import { notFound } from 'next/navigation';
import { getPublishedSite, supabaseRest } from '@/lib/supabase-rest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const site = await getPublishedSite(params.slug);
  const c:any = site?.content || {};
  const base = process.env.NEXT_PUBLIC_APP_URL || '';
  return { title: c.seoTitle || c.greeting || 'Happy Birthday', description: c.seoDescription || 'A special birthday website.', openGraph: { title: c.seoTitle || c.greeting || 'Happy Birthday', description: c.seoDescription || '', images: [{ url: `${base}/api/og?slug=${encodeURIComponent(params.slug)}` }] } };
}

export default async function PublishedSite({ params, searchParams }: { params: { slug: string }, searchParams?: { recipient?: string; to?: string } }) {
  const site = await getPublishedSite(params.slug);
  if (!site) notFound();
  const c = site.content || {};
  try {
    await supabaseRest(`rpc/increment_website_views`, {
      method: 'POST',
      body: JSON.stringify({ p_website_id: site.id }),
    });
  } catch (error) {
    console.error('view increment failed', error);
  }
  return <main className="min-h-screen bg-black"><div className="fixed right-4 top-4 z-[10000]"><a className="rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm text-white backdrop-blur" href={`/messages?with=${site.user_id}`}>💬 Message owner</a></div>{site.template_id === 'master-birthday' ? <MasterBirthdayTemplate content={{...c, templateId:'master-birthday'}} websiteSlug={params.slug} recipientId={searchParams?.recipient || searchParams?.to || ''} /> : site.template_id === 'master' || !site.template_id ? <MasterTemplate content={c} websiteSlug={params.slug} recipientId={searchParams?.recipient || searchParams?.to || ''} /> : <ExperienceTemplate variant={site.template_id} content={{...c, templateId:site.template_id}} />}</main>;
}
