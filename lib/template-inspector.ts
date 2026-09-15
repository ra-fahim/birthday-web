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

// These maps are based on the actual source files currently installed in
// public/templates. They intentionally describe each template separately;
// the studio must never assume every template has the same media structure.
export const templateInspections: Record<string, TemplateInspection> = {
  'master-birthday': {
    slug: 'master-birthday',
    sourceFiles: ['/master-birthday.html', '/master-birthday-editor.html', '/docs/master-birthday-original.html'],
    summary: 'The supplied original Birthday HTML/CSS/JS source, kept intact and wrapped with template-specific data hydration for Studio and live publishing.',
    media: [
      { key: 'gallery', label: 'Photo / Memory collection', kind: 'image', behavior: 'Multiple original photos plus user-added memories. Upload or public image URL.', sourceType: 'file-or-url', count: 6 },
      { key: 'videos', label: 'Video collection', kind: 'video', behavior: 'Multiple original videos plus user-added videos. Direct video, YouTube or upload.', sourceType: 'file-or-url', count: 4 },
      { key: 'countdownAudioUrl', label: 'Countdown audio', kind: 'audio', behavior: 'Original countdown sound slot.', sourceType: 'file-or-url' },
      { key: 'soundtrack', label: 'Our Soundtrack', kind: 'audio', behavior: 'Multiple tracks; direct audio, YouTube/playlist or Spotify links are supported by the data layer.', sourceType: 'file-or-url', count: 1 },
      { key: 'background-video', label: 'Built-in background video', kind: 'video', behavior: 'Original template background video. Can be overridden by the safe visual customization control.', sourceType: 'code-generated' },
    ],
    editableAreas: ['basic identity', 'countdown', 'greeting', 'cake interaction', 'reasons', 'photo memories', 'lightbox', 'video collection', 'soundtrack', 'letter', 'secret section', 'visual customization', 'effects']
  },
  master: {
    slug: 'master',
    sourceFiles: ['/master-template.html', '/master-template-editor.html'],
    summary: 'Cinematic birthday template with separate background, countdown and wishing audio plus gallery and one video scene.',
    media: [
      { key: 'musicUrl', label: 'Background music', kind: 'audio', behavior: 'Loops as the main soundtrack.', sourceType: 'file-or-url' },
      { key: 'countdownAudioUrl', label: 'Countdown audio', kind: 'audio', behavior: 'Plays during the final countdown window.', sourceType: 'file-or-url' },
      { key: 'wishingAudioUrl', label: 'Wishing / birthday audio', kind: 'audio', behavior: 'Plays when the celebration unlocks.', sourceType: 'file-or-url' },
      { key: 'gallery', label: 'Photo gallery', kind: 'image', behavior: 'Multiple photos; each item can use an uploaded file or public image URL.', sourceType: 'file-or-url', count: 0 },
      { key: 'videoUrl', label: 'Special video', kind: 'video', behavior: 'One video scene; direct video URL, YouTube or Vimeo link, or upload.', sourceType: 'file-or-url' },
      { key: 'video-bg', label: 'Animated background video', kind: 'video', behavior: 'Built into the original template; not a user content slot by default.', sourceType: 'code-generated' },
    ],
    editableAreas: ['text', 'buttons', 'countdown date/time', 'countdown labels', 'photos', 'special video', 'three audio slots', 'theme']
  },
  'master-proposal': {
    slug: 'master-proposal',
    sourceFiles: ['/templates/master-proposal/source-original/App.tsx', '/templates/master-proposal/source-original/components/MuseumGallery.tsx', '/templates/master-proposal/source-original/components/BackgroundMusic.tsx'],
    summary: 'Proposal experience with one background soundtrack and a museum containing mixed photo/video memories.',
    media: [
      { key: 'bgMusicUrl', label: 'Background music', kind: 'audio', behavior: 'Loops as the proposal soundtrack.', sourceType: 'file-or-url' },
      { key: 'museum', label: 'Museum memories', kind: 'image', behavior: 'Each museum item can independently be a photo or video; video supports direct links and YouTube.', sourceType: 'file-or-url', count: 6 },
    ],
    editableAreas: ['opening gate', 'story chapters', 'museum photo/video items', 'background music', 'date planner', 'buttons', 'letter']
  },
  'miss-you-1': {
    slug: 'miss-you-1',
    sourceFiles: ['/templates/miss-you-1/index.html', '/templates/miss-you-1/config.js', '/templates/miss-you-1/js/ui.js'],
    summary: 'Love-letter experience with one background music slot and a built-in animated scene.',
    media: [
      { key: 'musicUrl', label: 'Background music', kind: 'audio', behavior: 'Replaces the bundled bgm.mp3 when a public URL or uploaded file is supplied.', sourceType: 'file-or-url' },
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
};

export function getTemplateInspection(slug?: string) {
  return (slug && templateInspections[slug]) || templateInspections.master;
}
