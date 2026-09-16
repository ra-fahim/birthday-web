export type MasterBirthdayMemory = { id: string; url: string; title: string; caption: string; date: string; alt: string; destinationUrl?: string };
export type MasterBirthdayVideo = { id: string; source: string; title: string; caption: string; poster?: string; alt: string };
export type MasterBirthdayReason = { id: string; emoji: string; text: string };
export type MasterBirthdayTrack = { id: string; title: string; artist?: string; sourceType: 'upload'|'url'|'youtube'|'spotify'; url: string; cover?: string };

export type MasterBirthdayConfig = {
  recipientName: string; senderName: string; age: number; birthdayDate: string; birthdayTime: string; timezone: string;
  pageTitle: string; browserTitle: string; ogTitle: string; ogDescription: string; ogImage: string; customSlug: string;
  countdown: { title: string; message: string; audioUrl: string; audioEnabled: boolean };
  greeting: { heading: string; text: string; enterButton: string };
  cake: { cakeText: string; birthdayText: string; recipientName: string; ageCandleCount: number; wishTitle: string; wishSubtitle: string; micHint: string; cakeStatus: string; cutInstruction: string; nextButton: string; microphoneEnabled: boolean; soundEffects: boolean; vibration: boolean };
  reasons: { heading: string; note: string; items: MasterBirthdayReason[]; buttonText: string };
  memories: { heading: string; subtitle: string; nextButton: string; items: MasterBirthdayMemory[] };
  videos: { title: string; nextButton: string; items: MasterBirthdayVideo[] };
  soundtrack: { items: MasterBirthdayTrack[] };
  letter: { title: string; paragraphs: string[]; signature: string; buttonText: string };
  secret: { image: string; imageAlt: string; buttonText: string; buttonIcon: string; socialPlatform: string; socialUrl: string };
  theme: { main: string; secondary: string; accent: string; button: string; text: string; glow: string; overlay: string; backgroundImage: string; backgroundVideo: string; mode: 'light'|'dark'; fontPreset: string; animationIntensity: 'full'|'soft'|'off' };
  effects: { butterflies: boolean; flowers: boolean; hearts: boolean; sparkles: boolean; customCursor: boolean; confetti: boolean; smoke: boolean; soundEffects: boolean; vibration: boolean; microphone: boolean };
};

const suppliedMonth = 7; // original JS CONFIG uses 7 (August)
const suppliedDay = 22;
const suppliedHour = 0;
const suppliedMinute = 0;
const current = new Date();
const thisYearBirthday = new Date(current.getFullYear(), suppliedMonth, suppliedDay, suppliedHour, suppliedMinute, 0);
const birthdayYear = current <= thisYearBirthday ? current.getFullYear() : current.getFullYear() + 1;
const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Dhaka';

export const masterBirthdayDefaults: MasterBirthdayConfig = {
  recipientName: 'Anarkoli',
  senderName: '',
  age: 17,
  birthdayDate: `${birthdayYear}-08-22`,
  birthdayTime: '00:00',
  timezone: localTimezone,
  pageTitle: "Something's Coming 💫",
  browserTitle: 'Loading... 💫',
  ogTitle: "Something's Coming 💫",
  ogDescription: 'Tap to open when the time is right ✨',
  ogImage: '',
  customSlug: '',
  countdown: { title: 'Something special is unlocking...⌛', message: '', audioUrl: 'https://res.cloudinary.com/dpctt0wao/video/upload/v1773211012/WhatsApp_Audio_2026-03-11_at_12.33.50_PM_jhzjmt.mp3', audioEnabled: true },
  greeting: { heading: 'Happy Birthday Pagli❤️🎂💫', text: "Hey You Know What! You're the most adorable human i ever met! 💖", enterButton: 'Click to enter your world 💕' },
  cake: { cakeText: 'happy', birthdayText: 'birthday', recipientName: 'Anarkoli', ageCandleCount: 17, wishTitle: 'Close your eyes and make a wish...', wishSubtitle: 'Then blow out the candles 🕯️', micHint: '🎤 Blow into your mic to blow out the candles, or tap them', cakeStatus: '', cutInstruction: '🔪 Press and drag anywhere on the cake — cut it your way', nextButton: 'Enter your storyline 💫', microphoneEnabled: true, soundEffects: true, vibration: true },
  reasons: { heading: 'Happy Birthday Just Friend.. 💖', note: '', items: [
    { id:'reason-1', text:"You're such a kind and wonderful person, and I feel lucky to share such a good bond with you.", emoji:'🌟' },
    { id:'reason-2', text:'May your day be filled with love, laughter, and endless joy.', emoji:'💗' },
    { id:'reason-3', text:'Wishing you success, happiness, and everything your heart desires.', emoji:'💕' },
    { id:'reason-4', text:'Stay the amazing girl you are—always spreading positivity around. Have the happiest year ahead! 🥳', emoji:'🌟' }
  ], buttonText: 'Click Here... 💕' },
  memories: { heading: 'The Beautiful Moments ', subtitle: "Every moment spent with you has been magical. Let's cherish these precious memories Anarkoli...", nextButton: 'Again Your Storylane 🎥', items: [
    { id:'memory-1', url:'https://res.cloudinary.com/dpctt0wao/image/upload/v1786824168/zy6ndwpddbrsry4eojcus.png', title:'A Magical Reflection 💖', caption:'A reflection of pure grace, elegance, and unmatched beauty. 🌹👑', date:'A Magical Reflection 💖', alt:'What is time' },
    { id:'memory-2', url:'https://res.cloudinary.com/dpctt0wao/image/upload/v1786824169/auvpgs9bqzbh1g2enuh8z.png', title:'Lost in Bengali Lore', caption:'May your journey ahead be filled with happiness, success, and endless smiles😊💕', date:'Lost in Bengali Lore', alt:'Her Smile' },
    { id:'memory-3', url:'https://res.cloudinary.com/dpctt0wao/image/upload/v1786823873/qj1staxj8jw4hyu1c4wvf.jpg', title:'Her Smile Says It All', caption:"You're truly one of the sweetest girls I know, and I feel lucky to have a friend like you❤️", date:'Her Smile Says It All', alt:'Together Vibes' },
    { id:'memory-4', url:'https://picsum.photos/seed/birthday1/800/600', title:'Demo Memory 1 🌸', caption:'এই জায়গায় আপনার নিজের ছবি ও ক্যাপশন বসবে — URL শুধু বদলে দিলেই হবে।', date:'Demo Memory 1 🌸', alt:'Demo 1' },
    { id:'memory-5', url:'https://picsum.photos/seed/birthday2/800/600', title:'Demo Memory 2 ✨', caption:'প্রতিটি ডেমো কার্ড আলাদা স্টাইল/কালার দেখাতে ব্যবহার করা হয়েছে।', date:'Demo Memory 2 ✨', alt:'Demo 2' },
    { id:'memory-6', url:'https://picsum.photos/seed/birthday3/800/600', title:'Demo Memory 3 💫', caption:'এই ছবিগুলো temporary placeholder, পরে আপনার গ্যালারি দিয়ে replace করবেন।', date:'Demo Memory 3 💫', alt:'Demo 3' }
  ]},
  videos: { title: 'A Special Video Message', nextButton: 'See your letter 💌', items: [
    { id:'video-1', source:'https://res.cloudinary.com/dpctt0wao/video/upload/v1786828837/ksdkkclkksdsqpgdzfxcp.mp4', title:'Happy Birthday Anarkoli❤️🎂', caption:'', poster:'', alt:'Happy Birthday video' },
    { id:'video-2', source:'https://res.cloudinary.com/dpctt0wao/video/upload/v1786827683/esdcqmem9gdaunokk8uo9.mp4', title:'When Anarkoli act like a actor..', caption:'', poster:'', alt:'Birthday video' },
    { id:'video-3', source:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', title:'🎬 Demo Video — Big Buck Bunny', caption:'', poster:'https://picsum.photos/seed/vid1/800/450', alt:'Demo video' },
    { id:'video-4', source:'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', title:'🎬 Demo Video — Elephants Dream', caption:'', poster:'https://picsum.photos/seed/vid2/800/450', alt:'Demo video' }
  ]},
  soundtrack: { items: [{ id:'track-1', title:'Birthday soundtrack', artist:'', sourceType:'youtube', url:'https://www.youtube.com/watch?v=73Hld4gpaPA', cover:'' }] },
  letter: { title: 'A Letter for You friend 💌', paragraphs: [
    "Every laugh, every chat, and every moment we've shared has been truly special.💫",
    "I'm so grateful for the bond we have, and for the positivity.",
    "On your birthday, I just wish for endless happiness, love, and success to come your way.🌸",
    "You deserve all the joy in the world—keep shining and spreading your beautiful energy.✨",
    'Again Happy Birthday💝'
  ], signature: '', buttonText: 'Again, Happy Birthday Anarkoli Bury' },
  secret: { image:'https://res.cloudinary.com/dpctt0wao/image/upload/v1786828377/dcdqkuihl9g0ztwpugoar.png', imageAlt:'Secret Memory', buttonText:'See Your Friend', buttonIcon:'instagram', socialPlatform:'Instagram', socialUrl:'https://www.instagram.com/rafahimn' },
  theme: { main:'#ff69b4', secondary:'#9b6dff', accent:'#d4145a', button:'#ff69b4', text:'#4a4a4a', glow:'#ffb6d9', overlay:'linear-gradient(135deg, rgba(255,192,203,0.3), rgba(147,112,219,0.3))', backgroundImage:'', backgroundVideo:'https://assets.mixkit.co/videos/preview/mixkit-candles-in-tshe-dark-1327-large.mp4', mode:'light', fontPreset:'original', animationIntensity:'full' },
  effects: { butterflies:true, flowers:true, hearts:true, sparkles:true, customCursor:true, confetti:true, smoke:true, soundEffects:true, vibration:true, microphone:true },
};

export function mergeMasterBirthdayConfig(value?: Partial<MasterBirthdayConfig> | null): MasterBirthdayConfig {
  const v = value || {};
  return { ...masterBirthdayDefaults, ...v,
    countdown: {...masterBirthdayDefaults.countdown, ...v.countdown},
    greeting: {...masterBirthdayDefaults.greeting, ...v.greeting},
    cake: {...masterBirthdayDefaults.cake, ...v.cake},
    reasons: {...masterBirthdayDefaults.reasons, ...v.reasons, items:Array.isArray(v.reasons?.items)?v.reasons!.items:masterBirthdayDefaults.reasons.items},
    memories: {...masterBirthdayDefaults.memories, ...v.memories, items:Array.isArray(v.memories?.items)?v.memories!.items:masterBirthdayDefaults.memories.items},
    videos: {...masterBirthdayDefaults.videos, ...v.videos, items:Array.isArray(v.videos?.items)?v.videos!.items:masterBirthdayDefaults.videos.items},
    soundtrack: {...masterBirthdayDefaults.soundtrack, ...v.soundtrack, items:Array.isArray(v.soundtrack?.items)?v.soundtrack!.items:masterBirthdayDefaults.soundtrack.items},
    letter: {...masterBirthdayDefaults.letter, ...v.letter, paragraphs:Array.isArray(v.letter?.paragraphs)?v.letter!.paragraphs:masterBirthdayDefaults.letter.paragraphs},
    secret: {...masterBirthdayDefaults.secret, ...v.secret},
    theme: {...masterBirthdayDefaults.theme, ...v.theme},
    effects: {...masterBirthdayDefaults.effects, ...v.effects},
  };
}
