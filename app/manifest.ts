import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Wishly — Birthday Wish & Proposal Website Maker',
    short_name: 'Wishly',
    description: 'Create birthday wish, proposal, anniversary and surprise websites and share them with one link.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0b12',
    theme_color: '#0b0b12',
    lang: 'en',
  };
}
