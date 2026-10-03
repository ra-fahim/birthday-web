export type TemplateMediaSlot = {
  key: string;
  label: string;
  kind: 'audio' | 'video' | 'image';
  behavior: string;
  sourceType: 'file-or-url' | 'code-generated';
  count?: number;
};

export type TemplateInspection = {
  slug: string;
  sourceFiles: string[];
  summary: string;
  media: TemplateMediaSlot[];
  editableAreas: string[];
};

export const templateInspections: Record<string, TemplateInspection> = {
  'master': {
    slug: 'master',
    sourceFiles: ['/master-template.html', '/master-template-editor.html'],
    summary: 'Original supplied Birthday HTML/CSS/JS experience with countdown, cinematic cake interaction, reasons, dynamic memories, videos, letter, secret ending, audio and effects.',
    media: [
      { key: 'memories', label: 'Photo / Memory gallery', kind: 'image', behavior: 'Dynamic memories rendered in the original gallery and Lightbox.', sourceType: 'file-or-url', count: 0 },
      { key: 'videos', label: 'Videos', kind: 'video', behavior: 'Dynamic video collection with direct video and YouTube sources.', sourceType: 'file-or-url', count: 0 },
      { key: 'soundtrack', label: 'Soundtrack', kind: 'audio', behavior: 'Dynamic soundtrack collection; direct audio, YouTube or Spotify sources.', sourceType: 'file-or-url', count: 1 },
      { key: 'countdown.audioUrl', label: 'Countdown audio', kind: 'audio', behavior: 'Plays during the countdown when enabled.', sourceType: 'file-or-url' },
      { key: 'backgroundVideo', label: 'Background video', kind: 'video', behavior: 'Original full-screen background video; safely replaceable.', sourceType: 'file-or-url' },
      { key: 'secret.image', label: 'Secret image', kind: 'image', behavior: 'Final secret section image.', sourceType: 'file-or-url' },
    ],
    editableAreas: [
      'basic information', 'countdown', 'greeting', 'cake interaction copy and candle count', 'reasons', 'memories', 'Lightbox', 'videos', 'soundtrack', 'letter', 'secret ending', 'theme', 'effects'
    ],
  },
  'miss-you-1': {
    slug: 'miss-you-1',
    sourceFiles: ['/templates/miss-you-1/index.html', '/templates/miss-you-1/config.js', '/templates/miss-you-1/js/ui.js'],
    summary: 'Love-letter experience with one background music slot and a built-in animated scene.',
    media: [
      { key: 'musicUrl', label: 'Background music', kind: 'audio', behavior: 'Replaces the default hosted background music when a public URL or uploaded file is supplied.', sourceType: 'file-or-url' },
    ],
    editableAreas: ['names', 'letter paragraphs', 'counter labels', 'seed text', 'background music']
  },
  'wedding-proposal': {
    slug: 'wedding-proposal',
    sourceFiles: ['/templates/wedding-proposal-original.html'],
    summary: 'Original wedding proposal built with generated Web Audio tones rather than external media files.',
    media: [
      { key: 'generatedMusic', label: 'Built-in music', kind: 'audio', behavior: 'Generated in the original JavaScript with AudioContext; there is no source audio file to replace.', sourceType: 'code-generated' },
    ],
    editableAreas: ['recipient/sender names', 'proposal copy', 'buttons', 'built-in sound state']
  },
  'valentine-2026': {
    slug: 'valentine-2026',
    sourceFiles: ['/templates/valentine-2026/index.html', '/templates/valentine-2026/script.js', '/templates/valentine-2026/styles.css', '/templates/valentine-2026/default-config.json'],
    summary: 'Valentine 2026 proposal experience rendered entirely from an editable config: intro question with "No" reactions, hero, any number of story chapters, digital garden, love jar notes, final letter, names, themes, photos and music.',
    media: [
      { key: 'musicUrl', label: 'Background music', kind: 'audio', behavior: 'Your uploaded song (or a YouTube link) plays after the receiver taps Yes; the default song is used until replaced.', sourceType: 'file-or-url' },
    ],
    editableAreas: ['names and {name}/{sender} placeholders', 'intro lines and Yes/No buttons', '"No" reactions', 'hero title, subtitle and photo', 'story chapters (add, remove, reorder)', 'digital garden copy and visibility', 'love jar copy, notes and visibility', 'final letter paragraphs, signature and photo', 'footer', 'color theme and dark mode', 'background music']
  },
};

export function getTemplateInspection(slug?: string) {
  return (slug && templateInspections[slug]) || templateInspections.master;
}
