import MasterBirthdayTemplate from '@/components/template/MasterBirthdayTemplate';
import ExperienceTemplate from '@/components/template/ExperienceTemplates';
import { notFound } from 'next/navigation';
import { getPublishedSite, supabaseRest } from '@/lib/supabase-rest';
import { templateBySlug } from '@/lib/templates';
import { mergeMasterBirthdayConfig } from '@/lib/master-birthday';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const site = await getPublishedSite(params.slug);
  const c:any = site?.content || {};
  const mb = site?.template_id === 'master-birthday' ? mergeMasterBirthdayConfig(c.templateConfig?.masterBirthday) : null;
  const title = mb?.browserTitle || mb?.ogTitle || c.seoTitle || c.greeting || 'Happy Birthday';
  const description = mb?.ogDescription || c.seoDescription || 'A special birthday website.';
  const image = mb?.ogImage || '';
  const base = process.env.NEXT_PUBLIC_APP_URL || '';
  return { title, description, openGraph: { title: mb?.ogTitle || title, description, images: image ? [{ url: image }] : [{ url: `${base}/api/og?slug=${encodeURIComponent(params.slug)}` }] } };
}

export default async function PublishedSite({ params, searchParams }: { params: { slug: string }, searchParams?: { recipient?: string; to?: string } }) {
  const site = await getPublishedSite(params.slug);
  if (!site) notFound();
  const c = site.content || {};
  const renderTemplateId = (site.template_id && templateBySlug[site.template_id]) ? site.template_id : 'master';
  try {
    await supabaseRest(`rpc/increment_website_views`, {
      method: 'POST',
      body: JSON.stringify({ p_website_id: site.id }),
    });
  } catch (error) {
    console.error('view increment failed', error);
  }
  return <main className="min-h-screen bg-black"><div className="fixed right-4 top-4 z-[10000]"><a className="rounded-full border border-white/20 bg-black/70 px-4 py-2 text-sm text-white backdrop-blur" href={`/messages?with=${site.user_id}`}>💬 Message owner</a></div>{(renderTemplateId === 'master' || renderTemplateId === 'master-birthday') ? <MasterBirthdayTemplate content={c} websiteSlug={params.slug} recipientId={searchParams?.recipient || searchParams?.to || ''} /> : <ExperienceTemplate variant={renderTemplateId} content={{...c, templateId:renderTemplateId}} />}</main>;
}
