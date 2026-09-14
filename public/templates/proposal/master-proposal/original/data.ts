import { StoryItem, PhotoItem } from './types';

export const STORY_DATA: StoryItem[] = [
  {
    number: "I",
    title: "The Beginning",
    body: "It started with a simple moment, a glance that felt different from all the others. In that instant, the noise of the world faded, and I knew my life was about to change forever."
  },
  {
    number: "II",
    title: "The Little Things",
    body: "It's the way you laugh at my terrible jokes, the warmth of your hand in mine, and the quiet comfort of just being near you. These small moments build a universe I never want to leave."
  },
  {
    number: "III",
    title: "The Strength",
    body: "On days when the world feels heavy, you are my sanctuary. Your kindness is a beacon, guiding me back to who I want to be. You make me better, simply by being you."
  },
  {
    number: "IV",
    title: "The Promise",
    body: "To listen when you speak, to support you when you dream, and to hold you when you need rest. My heart is a steady rhythm, beating in time with yours, today and always."
  },
  {
    number: "V",
    title: "The Horizon",
    body: "As we look forward, I see a future painted with our shared dreams. Hand in hand, we will write the rest of this story, creating a masterpiece of moments that lasts a lifetime."
  }
];

export const PHOTO_DATA: PhotoItem[] = [
  {
    url: "https://picsum.photos/600/800?random=1",
    caption: "Our first adventure",
    gridClass: "md:col-span-1 md:row-span-2"
  },
  {
    url: "https://picsum.photos/800/600?random=2",
    caption: "Quiet mornings",
    gridClass: "md:col-span-2 md:row-span-1"
  },
  {
    url: "https://picsum.photos/600/600?random=3",
    caption: "Celebrations",
    gridClass: "md:col-span-1 md:row-span-1"
  },
  {
    url: "https://picsum.photos/600/600?random=4",
    caption: "Just us",
    gridClass: "md:col-span-1 md:row-span-1"
  }
];