// Every editable section of this template reads its content from here.
// The platform (Wishly Studio) injects a single JSON `config` query param
// when it loads this page inside an iframe — see ExperienceTemplates.tsx
// (MasterProposalTemplate) on the Next.js side. When the template is opened
// directly (no config param), every section simply falls back to its own
// original default content, so the original experience never breaks.

export interface SiteStoryItem { number?: string; title: string; body: string }
export interface SiteMuseumItem { id?: string; type: 'image' | 'video'; url: string; thumbnail?: string; title: string; date?: string; description: string }
export interface SiteSong { id?: string; title: string; artist: string; albumArt: string; note: string; audioUrl: string }
export interface SiteFinalLetter { title?: string; paragraphs?: string[]; signoff?: string }

export interface SiteConfig {
  heroTitle?: string;
  heroSubtitle?: string;
  story?: SiteStoryItem[];
  museum?: SiteMuseumItem[];
  songs?: SiteSong[];
  loveNotes?: string[];
  bucketList?: string[];
  comfortResponses?: Record<string, { label?: string; response?: string }>;
  finalLetter?: SiteFinalLetter;
  // Ticket / date-planner delivery settings (see ticketConfig.ts for the
  // narrower reader already used by DatePlanner).
  recipientEmail?: string;
  toName?: string;
  fromName?: string;
  fromLabel?: string;
}

let cached: SiteConfig | null = null;

export function getSiteConfig(): SiteConfig {
  if (cached) return cached;
  cached = {};
  try {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get('config');
    if (raw) cached = JSON.parse(raw) || {};
  } catch {
    cached = {};
  }
  return cached;
}
