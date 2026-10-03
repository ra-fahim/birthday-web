export interface SiteStoryItem { number?: string; title: string; body: string }
export interface SiteMuseumItem { id?: string; type: 'image' | 'video'; url: string; thumbnail?: string; title: string; date?: string; description: string }
export interface SiteFinalLetter { title?: string; paragraphs?: string[]; signoff?: string }
export interface SiteIntroPrompt { title: string; subtitle: string }
export interface SiteIntroGate {
  firstLine?: string;
  secondLineLabel?: string;
  secondLine?: string;
  prompts?: SiteIntroPrompt[];
  yesButtonText?: string;
  noButtonText?: string;
  noButtonTextRepeat?: string;
}
export interface SiteDateOption {
  id?: string;
  label: string;
  planTitle: string;
  planDescription: string;
  budget?: string;
  isSpecial?: boolean;
}
export interface SiteDatePlanner {
  heading?: string;
  subtitle?: string;
  sendButtonLabel?: string;
  options?: SiteDateOption[];
}

export interface SiteConfig {
  texts?: Record<string, string>;
  heroTitle?: string;
  heroSubtitle?: string;
  story?: SiteStoryItem[];
  museum?: SiteMuseumItem[];
  bgMusicUrl?: string;
  loveNotes?: string[];
  bucketList?: string[];
  comfortResponses?: Record<string, { label?: string; response?: string }>;
  finalLetter?: SiteFinalLetter;
  introGate?: SiteIntroGate;
  datePlanner?: SiteDatePlanner;
  recipientEmail?: string;
  toName?: string;
  fromName?: string;
  fromLabel?: string;
}

import { useSyncExternalStore } from 'react';

let cached: SiteConfig | null = null;
let received = false;
let editorOn = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function readQuery(): SiteConfig {
  try {
    const raw = new URLSearchParams(window.location.search).get('config');
    if (raw) return JSON.parse(raw) || {};
  } catch {
  }
  return {};
}

export function getSiteConfig(): SiteConfig {
  if (!cached) cached = readQuery();
  return cached;
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function useSiteConfig(): SiteConfig {
  useSyncExternalStore(subscribe, getSiteConfig, getSiteConfig);
  return getSiteConfig();
}

export function useEditorMode(): boolean {
  return useSyncExternalStore(subscribe, () => editorOn, () => false);
}

export function isEditorMode() { return editorOn; }

export const DEFAULT_TEXTS: Record<string, string> = {
  museumTitle: 'Museum of Our Love',
  museumSubtitle: 'A Curated Collection of Us',
  comfortTitle: 'Comfort Corner',
  comfortSubtitle: 'A safe space for any emotions you may be feeling',
  comfortHint: 'Select a feeling to minimize the distance',
  gardenTitle: 'The Digital Garden',
  gardenSubtitle: "I can't bring you flowers every hour, so I built you a garden that never dies.",
  gardenHint: '(Tap anywhere in the box below to plant a flower)',
  gardenEmpty: 'Plant me...',
  gardenWaiting: 'Waiting for your touch...',
  gardenCount: '{count} flowers planted for you',
  jarTitle: 'The Love Jar',
  jarSubtitle: 'Pull a note whenever you need a reminder',
  jarButton: 'Pull a Note',
  bucketTitle: 'Our Bucket List',
  bucketSubtitle: 'Dreams for Someday',
  bucketFooter: 'Checking these off, one by one, with you.',
  footer: 'Made with love, for you.',
};

export function t(cfg: SiteConfig, name: string): string {
  const v = cfg.texts?.[name];
  return typeof v === 'string' && v.trim() ? v : DEFAULT_TEXTS[name];
}

export function bb(key: string, label: string, index?: number) {
  const p: Record<string, string | number> = { 'data-bb-key': key, 'data-bb-label': label };
  if (index !== undefined) p['data-bb-index'] = index;
  return p;
}

export function initSiteConfigBridge(): Promise<void> {
  let embedded = false;
  try { embedded = window.parent !== window; } catch { embedded = true; }
  const hasQuery = Object.keys(readQuery()).length > 0;
  let resolveReady: () => void = () => {};
  const ready = new Promise<void>((r) => { resolveReady = r; });

  window.addEventListener('message', (event) => {
    const d = event.data;
    if (!d || typeof d !== 'object') return;
    if (d.type === 'BB_SITE_CONFIG' && d.config && typeof d.config === 'object') {
      cached = d.config as SiteConfig;
      received = true;
      emit();
      resolveReady();
    } else if (d.type === 'BB_EDITOR_MODE') {
      const on = !!d.enabled;
      if (on !== editorOn) { editorOn = on; emit(); }
    }
  });

  if (!embedded || hasQuery) { resolveReady(); return ready; }
  try { window.parent.postMessage({ type: 'BB_CONFIG_REQUEST' }, '*'); } catch {  }
  setTimeout(() => { if (!received) resolveReady(); }, 2500);
  return ready;
}
