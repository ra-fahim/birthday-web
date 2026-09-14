/**
 * Helpers for supporting YouTube links as a media source, alongside
 * regular direct file URLs (local path, Cloudinary, any static host).
 *
 * You do NOT need any of this for Cloudinary or other direct file links —
 * those just work as plain URLs (e.g. "https://res.cloudinary.com/.../video.mp4").
 * This file only exists to make YouTube links work the same way.
 */

const YOUTUBE_ID_PATTERNS: RegExp[] = [
  /youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
];

/** Returns the 11-char YouTube video id if `url` is a YouTube link, else null. */
export const getYouTubeId = (url?: string | null): string | null => {
  if (!url) return null;
  for (const pattern of YOUTUBE_ID_PATTERNS) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

export const isYouTubeUrl = (url?: string | null): boolean => getYouTubeId(url) !== null;

/** Auto thumbnail for a YouTube video — no need to upload/host a separate poster image. */
export const youtubeThumbnail = (id: string): string => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

export interface YouTubeOEmbedInfo {
  title: string;
  author_name: string; // channel name — used as a stand-in "artist"
  thumbnail_url: string;
}

/**
 * Fetches a YouTube video's title/channel/thumbnail via the public oEmbed
 * endpoint — no API key needed. Used to auto-fill song name + album art
 * from just a YouTube link. Returns null on any failure (offline, private
 * video, etc.) so callers can fall back to manually-provided values.
 */
export const fetchYouTubeOEmbed = async (videoUrl: string): Promise<YouTubeOEmbedInfo | null> => {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: data.title ?? '',
      author_name: data.author_name ?? '',
      thumbnail_url: data.thumbnail_url ?? '',
    };
  } catch {
    return null;
  }
};

// -----------------------------------------------------------------------------
// YouTube IFrame Player API loader (singleton) — used by OurSoundtrack to play
// a YouTube link through the existing player UI (vinyl, play/pause, next/prev).
// -----------------------------------------------------------------------------

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiLoadPromise: Promise<void> | null = null;

export const loadYouTubeIframeAPI = (): Promise<void> => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof previousCallback === 'function') previousCallback();
      resolve();
    };

    if (!document.getElementById('youtube-iframe-api')) {
      const tag = document.createElement('script');
      tag.id = 'youtube-iframe-api';
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
  });

  return apiLoadPromise;
};
