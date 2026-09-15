export type MasterBirthdayReason = { text:string; emoji:string };
export type MasterBirthdayMedia = { id?:string; url:string; title?:string; caption?:string; date?:string; alt?:string; poster?:string; type?:string; enabled?:boolean };
export type MasterBirthdayConfig = typeof MASTER_BIRTHDAY_DEFAULTS;

export const MASTER_BIRTHDAY_DEFAULTS = {
  "recipientName": "Anarkoli",
  "senderName": "",
  "age": 17,
  "birthdayDate": "2026-08-22",
  "birthdayTime": "00:00",
  "timezone": "",
  "pageTitle": "Something special is unlocking...⌛",
  "browserTitle": "Loading... 💫",
  "countdownTitle": "Something special is unlocking...⌛",
  "countdownMessage": "⏰ Something is coming soon...",
  "countdownAudioUrl": "https://res.cloudinary.com/dpctt0wao/video/upload/v1773211012/WhatsApp_Audio_2026-03-11_at_12.33.50_PM_jhzjmt.mp3",
  "countdownAudioEnabled": true,
  "greetingHeading": "Happy Birthday Pagli❤️🎂💫",
  "greetingMessage": "Hey You Know What! You're the most adorable human i ever met! 💖",
  "enterButtonText": "Click to enter your world 💕",
  "cake": {
    "cakeText": "happy",
    "birthdayText": "birthday",
    "recipientName": "Anarkoli",
    "age": 17,
    "wishTitle": "Close your eyes and make a wish...",
    "wishSubtitle": "Then blow out the candles 🕯️",
    "micHint": "🎤 Blow into your mic to blow out the candles, or tap them",
    "cakeStatus": "",
    "cutInstruction": "🔪 Press and drag anywhere on the cake — cut it your way",
    "nextButtonText": "Enter your storyline 💫",
    "microphone": true,
    "soundEffects": true,
    "vibration": true
  },
  "reasons": [
    {
      "text": "You're such a kind and wonderful person, and I feel lucky to share such a good bond with you.",
      "emoji": "🌟"
    },
    {
      "text": "May your day be filled with love, laughter, and endless joy.",
      "emoji": "💗"
    },
    {
      "text": "Wishing you success, happiness, and everything your heart desires.",
      "emoji": "💕"
    },
    {
      "text": "Stay the amazing girl you are—always spreading positivity around. Have the happiest year ahead! 🥳",
      "emoji": "🌟"
    }
  ],
  "gallery": [
    {
      "url": "https://res.cloudinary.com/dpctt0wao/image/upload/v1786824168/zy6ndwpddbrsry4eojcus.png",
      "title": "A Magical Reflection 💖",
      "caption": "A reflection of pure grace, elegance, and unmatched beauty. 🌹👑",
      "date": "A Magical Reflection 💖",
      "alt": "What is time"
    },
    {
      "url": "https://res.cloudinary.com/dpctt0wao/image/upload/v1786824169/auvpgs9bqzbh1g2enuh8z.png",
      "title": "Lost in Bengali Lore",
      "caption": "May your journey ahead be filled with happiness, success, and endless smiles😊💕",
      "date": "Lost in Bengali Lore",
      "alt": "Her Smile"
    },
    {
      "url": "https://res.cloudinary.com/dpctt0wao/image/upload/v1786823873/qj1staxj8jw4hyu1c4wvf.jpg",
      "title": "Her Smile Says It All",
      "caption": "You're truly one of the sweetest girls I know, and I feel lucky to have a friend like you❤️",
      "date": "Her Smile Says It All",
      "alt": "Together Vibes"
    },
    {
      "url": "https://picsum.photos/seed/birthday1/800/600",
      "title": "Demo Memory 1 🌸",
      "caption": "এই জায়গায় আপনার নিজের ছবি ও ক্যাপশন বসবে — URL শুধু বদলে দিলেই হবে।",
      "date": "Demo Memory 1 🌸",
      "alt": "Demo 1"
    },
    {
      "url": "https://picsum.photos/seed/birthday2/800/600",
      "title": "Demo Memory 2 ✨",
      "caption": "প্রতিটি ডেমো কার্ড আলাদা স্টাইল/কালার দেখাতে ব্যবহার করা হয়েছে।",
      "date": "Demo Memory 2 ✨",
      "alt": "Demo 2"
    },
    {
      "url": "https://picsum.photos/seed/birthday3/800/600",
      "title": "Demo Memory 3 💫",
      "caption": "এই ছবিগুলো temporary placeholder, পরে আপনার গ্যালারি দিয়ে replace করবেন।",
      "date": "Demo Memory 3 💫",
      "alt": "Demo 3"
    }
  ],
  "videos": [
    {
      "url": "https://res.cloudinary.com/dpctt0wao/video/upload/v1786828837/ksdkkclkksdsqpgdzfxcp.mp4",
      "title": "Happy Birthday Othoy❤️🎂",
      "caption": "",
      "poster": "",
      "alt": "Happy Birthday video"
    },
    {
      "url": "https://res.cloudinary.com/dpctt0wao/video/upload/v1786827683/esdcqmem9gdaunokk8uo9.mp4",
      "title": "When Othoy act like a actor..",
      "caption": "",
      "poster": "",
      "alt": "Birthday memory video"
    },
    {
      "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      "title": "🎬 Demo Video — Big Buck Bunny",
      "caption": "",
      "poster": "https://picsum.photos/seed/vid1/800/450",
      "alt": "Big Buck Bunny"
    },
    {
      "url": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "title": "🎬 Demo Video — Elephants Dream",
      "caption": "",
      "poster": "https://picsum.photos/seed/vid2/800/450",
      "alt": "Elephants Dream"
    }
  ],
  "soundtrack": [
    {
      "id": "default-youtube",
      "title": "Birthday song",
      "url": "https://youtu.be/73Hld4gpaPA",
      "type": "youtube",
      "enabled": true
    }
  ],
  "letter": {
    "title": "A Letter for You friend 💌",
    "paragraphs": [
      "Every laugh, every chat, and every moment we've shared has been truly special.💫",
      "I'm so grateful for the bond we have, and for the positivity.",
      "On your birthday, I just wish for endless happiness, love, and success to come your way.🌸",
      "You deserve all the joy in the world—keep shining and spreading your beautiful energy.✨",
      "Again Happy Birthday💝"
    ],
    "signature": "",
    "buttonText": "Again, Happy Birthday Othoy Bury"
  },
  "secret": {
    "imageUrl": "https://res.cloudinary.com/dpctt0wao/image/upload/v1786828377/dcdqkuihl9g0ztwpugoar.png",
    "buttonText": "See Your Friend",
    "buttonIcon": "fa-instagram",
    "socialPlatform": "instagram",
    "socialUrl": "https://www.instagram.com/rafahimn",
    "title": "",
    "message": ""
  },
  "visual": {
    "mainThemeColor": "#ff69b4",
    "secondaryColor": "#9370db",
    "accentColor": "#9b6dff",
    "buttonColor": "#ff69b4",
    "textColor": "#4a4a4a",
    "glowColor": "#ff69b4",
    "backgroundOverlay": "",
    "backgroundImage": "",
    "backgroundVideo": "",
    "mode": "light",
    "font": "Quicksand",
    "effects": {
      "butterflies": true,
      "flowers": true,
      "hearts": true,
      "sparkles": true,
      "customCursor": true,
      "confetti": true,
      "smoke": true
    }
  }
} as const;

export function getMasterBirthdayConfig(content:any): any {
  const incoming = content?.templateConfig?.masterBirthday;
  if (!incoming || typeof incoming !== 'object') return JSON.parse(JSON.stringify(MASTER_BIRTHDAY_DEFAULTS));
  return {
    ...JSON.parse(JSON.stringify(MASTER_BIRTHDAY_DEFAULTS)),
    ...incoming,
    cake: {...JSON.parse(JSON.stringify(MASTER_BIRTHDAY_DEFAULTS.cake)), ...(incoming.cake || {})},
    letter: {...JSON.parse(JSON.stringify(MASTER_BIRTHDAY_DEFAULTS.letter)), ...(incoming.letter || {})},
    secret: {...JSON.parse(JSON.stringify(MASTER_BIRTHDAY_DEFAULTS.secret)), ...(incoming.secret || {})},
    visual: {...JSON.parse(JSON.stringify(MASTER_BIRTHDAY_DEFAULTS.visual)), ...(incoming.visual || {}), effects: {...MASTER_BIRTHDAY_DEFAULTS.visual.effects, ...((incoming.visual || {}).effects || {})}},
  };
}

export function getMasterBirthdayContentSeed(): any {
  const d:any = JSON.parse(JSON.stringify(MASTER_BIRTHDAY_DEFAULTS));
  return {
    name: d.recipientName, birthday: `${d.birthdayDate}T${d.birthdayTime}`, greeting: d.greetingHeading, heroSubtitle: d.greetingMessage, buttonText: d.enterButtonText, countdownTitle: d.countdownTitle, countdownMessage: d.countdownMessage, countdownAudioUrl: d.countdownAudioUrl,
    reasons: d.reasons.map((r:any)=>r.text), gallery: d.gallery.map((g:any)=>({url:g.url,caption:g.caption,title:g.title,date:g.date,alt:g.alt})), letter: [...d.letter.paragraphs], photoTitle:'The Beautiful Moments ', photoSubtitle:"Every moment spent with you has been magical. Let's cherish these precious memories Othoy...", photoNextButton:'Again Your Storylane 🎥', videoTitle:'A Special Video Message', videoNextButton:'See your letter 💌', letterTitle:d.letter.title, letterButton:d.letter.buttonText, secretTitle:d.secret.title || 'A little secret for you ✨', secret:d.secret.message || 'You found the secret! 🎁', secretButton:d.secret.buttonText, primaryColor:d.visual.mainThemeColor, font:'sans', templateId:'master-birthday', occasion:'birthday', templateConfig:{masterBirthday:d}
  };
}
