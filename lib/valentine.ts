import defaultsJson from '@/public/templates/valentine-2026/default-config.json';

/**
 * Valentine 2026 content model.
 *
 * Stored in `content.templateConfig.valentine` (partial or full). The template
 * (public/templates/valentine-2026/script.js) renders ONLY from this config, so
 * every word, list, image, theme and music choice can be changed from the very
 * beginning. `public/templates/valentine-2026/default-config.json` is the single
 * source of truth for the default (demo) content — both the template and the
 * editor read it.
 */
export type ValentinePrompt = { title: string; subtitle: string };
export type ValentineStory = { title: string; body: string };

export type ValentineConfig = {
  recipientName: string;
  senderName: string;
  theme: string;
  darkMode: boolean;
  showControls: boolean;
  music: { enabled: boolean; url: string; youtubeId: string };
  intro: {
    line1: string; kicker: string; line2: string;
    yesButton: string; noButton: string; noRepeatButton: string;
    prompts: ValentinePrompt[];
  };
  hero: { title: string; subtitle: string; image: string };
  story: ValentineStory[];
  garden: { enabled: boolean; title: string; subtitle: string; hint: string; placeholder: string; emptyCount: string; count: string; clearButton: string };
  jar: { enabled: boolean; title: string; subtitle: string; label: string; button: string; shakingButton: string; notes: string[] };
  final: { title: string; paragraphs: string[]; signature: string; image: string };
  footer: string;
};

export const VALENTINE_THEMES: { key: string; name: string; color: string }[] = [
  { key: 'blush', name: 'Rose Champagne', color: '#B86B78' },
  { key: 'lavender', name: 'Amethyst Silk', color: '#8B6FB0' },
  { key: 'ocean', name: 'Pearl Ocean', color: '#5A8C98' },
  { key: 'midnight', name: 'Midnight Iris', color: '#6C63C7' },
  { key: 'sunset', name: 'Velvet Sunset', color: '#D65376' },
  { key: 'forest', name: 'Emerald Velvet', color: '#258A72' },
  { key: 'mocha', name: 'Mocha Cashmere', color: '#92725F' },
  { key: 'royal', name: 'Royal Orchid', color: '#8E4DC2' },
];

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

export function valentineDefaults(): ValentineConfig {
  return clone(defaultsJson) as ValentineConfig;
}

function isObj(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

/** Objects merge key by key; arrays and primitives from `over` replace the base value. */
function deepMerge<T>(base: T, over: unknown): T {
  if (Array.isArray(base)) return (Array.isArray(over) ? clone(over) : clone(base)) as unknown as T;
  if (isObj(base)) {
    const out: Record<string, unknown> = {};
    const o = isObj(over) ? over : {};
    for (const k of Object.keys(base)) out[k] = deepMerge((base as Record<string, unknown>)[k], o[k]);
    return out as T;
  }
  if (over === undefined || over === null) return base;
  return (typeof over === typeof base ? over : base) as T;
}

/** Sites saved before this editor existed stored click-to-edit text as `gx.valentine.*`. */
function applyLegacyEdits(cfg: ValentineConfig, edits: Record<string, any> | undefined) {
  if (!edits) return;
  const v = (k: string) => {
    const e = edits['gx.valentine.' + k];
    return e && typeof e.value === 'string' && e.value.trim() ? e.value : undefined;
  };
  const set = (val: string | undefined, fn: (s: string) => void) => { if (val !== undefined) fn(val); };
  set(v('heroTitle'), s => (cfg.hero.title = s));
  set(v('heroSubtitle'), s => (cfg.hero.subtitle = s));
  cfg.story.forEach((_, i) => {
    set(v('storyTitle.' + i), s => (cfg.story[i].title = s));
    set(v('storyBody.' + i), s => (cfg.story[i].body = s));
  });
  set(v('gardenTitle'), s => (cfg.garden.title = s));
  set(v('gardenSubtitle'), s => (cfg.garden.subtitle = s));
  set(v('gardenHint'), s => (cfg.garden.hint = s));
  set(v('jarTitle'), s => (cfg.jar.title = s));
  set(v('jarSubtitle'), s => (cfg.jar.subtitle = s));
  set(v('jarLabel'), s => (cfg.jar.label = s));
  set(v('jarButton'), s => (cfg.jar.button = s));
  set(v('finalTitle'), s => (cfg.final.title = s));
  [1, 2, 3].forEach(n => set(v('finalBody' + n), s => (cfg.final.paragraphs[n - 1] = s)));
  set(v('finalSignature'), s => (cfg.final.signature = s));
  set(v('introTitle'), s => (cfg.intro.line1 = s));
  set(v('introKicker'), s => (cfg.intro.kicker = s));
  set(v('introBefore'), s => (cfg.intro.line2 = s));
  set(v('introQuestion'), s => { if (cfg.intro.prompts[0]) cfg.intro.prompts[0].title = s; });
  set(v('introQuestionSub'), s => { if (cfg.intro.prompts[0]) cfg.intro.prompts[0].subtitle = s; });
  set(v('yesButton'), s => (cfg.intro.yesButton = s));
  set(v('noButton'), s => (cfg.intro.noButton = s));
}

/** Full, ready-to-render config for a website's content. */
export function mergeValentine(content: { templateConfig?: Record<string, unknown>; musicUrl?: string } | null | undefined): ValentineConfig {
  const tc = (content?.templateConfig || {}) as Record<string, any>;
  const cfg = valentineDefaults();
  applyLegacyEdits(cfg, tc.genericEdits);
  const merged = deepMerge(cfg, tc.valentine);
  if (!merged.music.url && content?.musicUrl) merged.music.url = String(content.musicUrl);
  if (!VALENTINE_THEMES.some(t => t.key === merged.theme)) merged.theme = 'blush';
  return merged;
}

/** Immutable set at a dotted path ("story.2.title"). Numeric segments index arrays. */
export function setValentinePath(cfg: ValentineConfig, path: string, value: unknown): ValentineConfig {
  const next = clone(cfg) as any;
  const parts = path.split('.');
  let cur = next;
  for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
  cur[parts[parts.length - 1]] = value;
  return next;
}

export function getValentinePath(cfg: ValentineConfig, path: string): any {
  return path.split('.').reduce<any>((cur, k) => (cur == null ? undefined : cur[k]), cfg);
}
