// Detects a Spotify share link (track/album/playlist/episode/show) and
// converts it into Spotify's official embeddable player URL. Used by
// OurSoundtrack so a site owner can paste a Spotify link the same way
// they'd paste a YouTube link.

const SPOTIFY_RE = /open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/;

export function getSpotifyEmbedSrc(url: string | undefined | null): string | null {
  if (!url) return null;
  const match = url.match(SPOTIFY_RE);
  if (!match) return null;
  const [, type, id] = match;
  return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
}
