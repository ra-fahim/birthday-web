const ICONS = {
  heart: (cls='w-6 h-6', fill='none') => `<svg class="${cls}" viewBox="0 0 24 24" fill="${fill}" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  palette: (cls='w-4 h-4') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3a9 9 0 0 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a2 2 0 0 1 0-4h3a6 6 0 0 0 0-12h-3Z" stroke="currentColor" stroke-width="1.5"/><circle cx="7.5" cy="10" r="1" fill="currentColor"/><circle cx="9.5" cy="6.5" r="1" fill="currentColor"/><circle cx="13.5" cy="6" r="1" fill="currentColor"/></svg>`,
  moon: (cls='w-4 h-4') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12.8A8.5 8.5 0 0 1 11.2 3a6.9 6.9 0 1 0 9.8 9.8Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
  sun: (cls='w-4 h-4') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  check: (cls='w-3 h-3') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m5 12 4 4L19 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  refresh: (cls='w-4 h-4') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  x: (cls='w-4 h-4') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  smartphone: (cls='w-8 h-8') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="2" width="12" height="20" rx="3" stroke="currentColor" stroke-width="1.5"/><path d="M10 19h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  external: (cls='w-3 h-3') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 5h5v5M13 11l6-6M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  more: (cls='w-4 h-4') => `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>`,
  flower: (cls='w-8 h-8') => `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c-3.2-6.5-8.5-7.1-9.2-3.8-.5 2.1 1.5 3.5 4.2 3.8-2.7.3-4.7 1.7-4.2 3.8.7 3.3 6 2.7 9.2-3.8-3.2 6.5-.3 10.9 2 9.2 1.7-1.2 1.1-3.8 0-6.2 1.1 2.4 3.7 3 5.4 1.8 2.3-1.7-.6-6.2-3.8-9.4 3.2-3.2 4.1-6.3 1.8-8-1.7-1.2-4.3.4-5.4 2.8 1.1-2.4 1.7-5 0-6.2-2.3-1.7-5.2 2.7-2 9.2Z"/></svg>`,
  flower2: (cls='w-8 h-8') => `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 13c-1.6-3.6-5.5-4.9-7.1-2.6-1.3 1.9.5 4.5 3.8 4.9-3.3.4-5.1 3-3.8 4.9 1.6 2.3 5.5 1 7.1-2.6-1.6 3.6.6 6.5 2.9 5.2 2-1.1 1.6-4.4-.1-7.1 1.7 2.7 5 3.9 6.1 1.9 1.3-2.3-.8-4.7-4.5-5.5 3.7-.8 5.8-3.2 4.5-5.5-1.1-2-4.4-.8-6.1 1.9 1.7-2.7 2.1-6 .1-7.1C12.6.5 10.4 4.4 12 8c-1.6-3.6-5.5-4.9-7.1-2.6C3.6 7.3 5.4 9.9 8.7 10.3 5.4 10.7 3.6 13.3 4.9 15.2c1.6 2.3 5.5 1 7.1-2.6Z"/></svg>`
};

const THEMES = {
  blush: { name: 'Rose Champagne', color: '#B86B78', colors: {'--love-bg':'#F7F1EE','--love-text':'#2E2026','--love-pink':'#E9D4D8','--love-accent':'#B86B78','--love-accent-2':'#D8A6AE','--love-card':'#FFFCFB','--love-dark-bg':'#171418','--love-dark-text':'#F5EAED','--love-dark-accent':'#E3A4AF','--love-dark-accent-2':'#B97888','--love-dark-card':'#262026','--love-glow':'rgba(227,164,175,.14)','--love-glow-2':'rgba(185,120,136,.10)'} },
  lavender: { name: 'Amethyst Silk', color: '#8B6FB0', colors: {'--love-bg':'#F6F2FA','--love-text':'#2D2434','--love-pink':'#E5DAEF','--love-accent':'#8B6FB0','--love-accent-2':'#BBA6D1','--love-card':'#FEFBFF','--love-dark-bg':'#17141C','--love-dark-text':'#F1EAF6','--love-dark-accent':'#C7AEE0','--love-dark-accent-2':'#9678B8','--love-dark-card':'#28222F','--love-glow':'rgba(199,174,224,.13)','--love-glow-2':'rgba(150,120,184,.09)'} },
  ocean: { name: 'Pearl Ocean', color: '#5A8C98', colors: {'--love-bg':'#EFF7F8','--love-text':'#20343A','--love-pink':'#D5E8EA','--love-accent':'#5A8C98','--love-accent-2':'#91BBC3','--love-card':'#FCFFFF','--love-dark-bg':'#0E1B1E','--love-dark-text':'#E5F1F3','--love-dark-accent':'#A6D2D8','--love-dark-accent-2':'#6EA4AE','--love-dark-card':'#1C292D','--love-glow':'rgba(166,210,216,.12)','--love-glow-2':'rgba(110,164,174,.09)'} },
  midnight: { name: 'Midnight Iris', color: '#6C63C7', colors: {'--love-bg':'#F0F1FA','--love-text':'#24213B','--love-pink':'#D7D7F4','--love-accent':'#6C63C7','--love-accent-2':'#A89FE3','--love-card':'#FEFEFF','--love-dark-bg':'#111321','--love-dark-text':'#ECECFF','--love-dark-accent':'#9993F4','--love-dark-accent-2':'#6962C7','--love-dark-card':'#1E2131','--love-glow':'rgba(153,147,244,.14)','--love-glow-2':'rgba(105,98,199,.10)'} },
  sunset: { name: 'Velvet Sunset', color: '#D65376', colors: {'--love-bg':'#FFF3F1','--love-text':'#3A1F2A','--love-pink':'#F4D1D6','--love-accent':'#D65376','--love-accent-2':'#F29BA9','--love-card':'#FFFCF8','--love-dark-bg':'#1E1219','--love-dark-text':'#FFECEF','--love-dark-accent':'#F6A0B2','--love-dark-accent-2':'#C86780','--love-dark-card':'#2E1D25','--love-glow':'rgba(246,160,178,.14)','--love-glow-2':'rgba(200,103,128,.09)'} },
  forest: { name: 'Emerald Velvet', color: '#258A72', colors: {'--love-bg':'#F0F7F3','--love-text':'#183A33','--love-pink':'#CBE6DB','--love-accent':'#258A72','--love-accent-2':'#74B8A2','--love-card':'#FCFFFD','--love-dark-bg':'#0C1916','--love-dark-text':'#E5F4EE','--love-dark-accent':'#76CDB8','--love-dark-accent-2':'#3A9B83','--love-dark-card':'#182823','--love-glow':'rgba(118,205,184,.12)','--love-glow-2':'rgba(58,155,131,.09)'} },
  mocha: { name: 'Mocha Cashmere', color: '#92725F', colors: {'--love-bg':'#F8F3ED','--love-text':'#34271F','--love-pink':'#E7D6C8','--love-accent':'#92725F','--love-accent-2':'#C3A38B','--love-card':'#FFFDF9','--love-dark-bg':'#1B1715','--love-dark-text':'#F1E7DE','--love-dark-accent':'#D0AE95','--love-dark-accent-2':'#98745E','--love-dark-card':'#2B2420','--love-glow':'rgba(208,174,149,.12)','--love-glow-2':'rgba(152,116,94,.09)'} },
  royal: { name: 'Royal Orchid', color: '#8E4DC2', colors: {'--love-bg':'#F7F1FC','--love-text':'#2F1D3B','--love-pink':'#E7D5F1','--love-accent':'#8E4DC2','--love-accent-2':'#BE8FE0','--love-card':'#FFFCFF','--love-dark-bg':'#17111F','--love-dark-text':'#F3EAF8','--love-dark-accent':'#C9A0E5','--love-dark-accent-2':'#965BC5','--love-dark-card':'#291C33','--love-glow':'rgba(201,160,229,.13)','--love-glow-2':'rgba(150,91,197,.09)'} }
};

const STORY_DATA = [
  { number:'I', title:'The Beginning', body:'It started with a simple moment, a glance that felt different from all the others. In that instant, the noise of the world faded, and I knew my life was about to change forever.' },
  { number:'II', title:'The Little Things', body:"It's the way you laugh at my terrible jokes, the warmth of your hand in mine, and the quiet comfort of just being near you. These small moments build a universe I never want to leave." },
  { number:'III', title:'The Strength', body:'On days when the world feels heavy, you are my sanctuary. Your kindness is a beacon, guiding me back to who I want to be. You make me better, simply by being you.' },
  { number:'IV', title:'The Promise', body:'To listen when you speak, to support you when you dream, and to hold you when you need rest. My heart is a steady rhythm, beating in time with yours, today and always.' },
  { number:'V', title:'The Horizon', body:'As we look forward, I see a future painted with our shared dreams. Hand in hand, we will write the rest of this story, creating a masterpiece of moments that lasts a lifetime.' }
];

const SILLY_PROMPTS = [
  { title:'Will you be my Valentine?', subtitle:'...and for a lifetime?' },
  { title:'Wait, did you click the wrong button?', subtitle:'I think your finger slipped!' },
  { title:'Are you sure? I have snacks!', subtitle:'All your favorites, unlimited supply.' },
  { title:'What if I promise to do the dishes?', subtitle:'For like... a whole week.' },
  { title:"I'll give you a foot massage...", subtitle:'Anytime you want. Seriously.' },
  { title:"Don't break my heart! 🥺", subtitle:'Look at this sad face.' },
  { title:"I'm going to cry...", subtitle:'Tears are actually forming right now.' },
  { title:'Okay, seriously, just click Yes.', subtitle:"The 'No' button is getting tired." },
  { title:"You're being stubborn!", subtitle:'But I still love you.' },
  { title:'Please? Please? Please?', subtitle:"I'll be the best Valentine ever." },
  { title:"I'm not taking no for an answer!", subtitle:'Resistance is futile, darling.' }
];

const NOTES = [
  'I love how hard you work for your dreams.',
  "Your smile is literally the best part of my day.",
  'You make even boring things fun just by being there.',
  "I'm so proud of everything you've accomplished.",
  'You give the best hugs in the world.',
  "I love listening to you talk about things you're passionate about.",
  'You are beautiful, inside and out.',
  'Thank you for being my peace in a chaotic world.',
  'I admire your strength and resilience.',
  'Just thinking about you makes me smile.',
  'I love that I can be myself around you.',
  'You are my favorite person to do nothing with.',
  'I love the way your eyes light up when you\'re happy.',
  "You're stuck with me now (and I love it).",
  'I appreciate how caring you are.',
  'Every moment with you is a memory I cherish.'
];

let isDarkMode = false;
let currentTheme = 'blush';
let musicEnabled = true;
let musicStarted = false;
let musicFrame = null;
const BACKGROUND_YOUTUBE_ID = 'AfybMbBSwaA';
let showThemePicker = false;
let introComplete = false;
let gardenFlowers = [];
let noteOpen = null;
let rejectionCount = 0;
let noteTimer = null;

const app = document.getElementById('app');
const BB_EDITOR_MODE = new URLSearchParams(window.location.search).has('bbEdit');

function setTheme(themeKey) {
  currentTheme = themeKey;
  const theme = THEMES[themeKey];
  Object.entries(theme.colors).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
}

function setDarkMode(next) {
  isDarkMode = next;
  document.documentElement.classList.toggle('dark', isDarkMode);
  renderControls();
}

function icon(name, cls) { return ICONS[name] ? ICONS[name](cls) : ''; }

function backgroundHTML() {
  return `<div class="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-love-bg dark:bg-love-dark-bg">
    <div class="absolute inset-[-40%] w-[180%] h-[180%] bg-drift" style="background:radial-gradient(circle at 25% 25%,var(--love-glow),transparent 34%),radial-gradient(circle at 75% 75%,var(--love-glow-2),transparent 36%),linear-gradient(135deg,var(--love-bg),var(--love-pink),var(--love-bg));filter:saturate(1.08) blur(2px);"></div>
    <div class="absolute -top-[12vw] -left-[12vw] w-[65vw] h-[65vw] rounded-full pointer-events-none" style="background:radial-gradient(circle,var(--love-glow),transparent 68%);animation:aurora-one 18s ease-in-out infinite alternate;"></div>
    <div class="absolute -bottom-[14vw] -right-[12vw] w-[70vw] h-[70vw] rounded-full pointer-events-none" style="background:radial-gradient(circle,var(--love-glow-2),transparent 70%);animation:aurora-two 22s ease-in-out infinite alternate;"></div>
    <div class="absolute inset-0 opacity-[0.32] dark:opacity-[0.22]" style="background-image:url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.045'/%3E%3C/svg%3E&quot;);background-size:150px 150px;"></div>
  </div>`;
}

function renderControls() {
  let container = document.getElementById('controls');
  if (!container) {
    container = document.createElement('div');
    container.id = 'controls';
    container.className = 'fixed top-6 right-6 z-[60] flex flex-col items-end gap-3';
    document.body.appendChild(container);
  }
  container.innerHTML = `<div class="relative">
    <button id="theme-btn" class="p-2 md:p-2.5 rounded-full bg-love-accent/15 hover:bg-love-accent/25 dark:bg-love-dark-accent/15 dark:hover:bg-love-dark-accent/25 text-love-accent dark:text-love-dark-accent backdrop-blur-md shadow-sm border border-love-accent/20 dark:border-love-dark-accent/20 transition-transform active:scale-95" aria-label="Choose theme">${icon('palette','w-4 h-4 md:w-[18px] md:h-[18px]')}</button>
    <div id="theme-picker" class="theme-transition absolute top-full right-0 mt-2 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl border border-love-accent/10 shadow-2xl min-w-[220px] ${showThemePicker ? 'theme-visible' : 'theme-hidden'}">
      <div class="flex items-center justify-between mb-3 px-1"><span class="text-xs uppercase tracking-widest text-love-accent/80 dark:text-love-dark-accent/80 font-bold">Select Theme</span><button id="theme-close" class="text-xs text-love-text/50 hover:text-love-text">Close</button></div>
      <div class="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
        ${Object.keys(THEMES).map(t => `<button data-theme="${t}" class="w-full px-3 py-2.5 text-sm text-left rounded-lg transition-all flex items-center gap-3 ${currentTheme === t ? 'bg-love-accent/10 dark:bg-love-dark-accent/20 text-love-text dark:text-love-dark-text font-medium' : 'text-love-text/70 dark:text-love-dark-text/70 hover:bg-love-bg dark:hover:bg-white/5'}"><span class="w-4 h-4 rounded-full border border-black/10 dark:border-white/10 shadow-sm shrink-0" style="background-color:${THEMES[t].color}"></span><span class="flex-1">${THEMES[t].name}</span>${currentTheme === t ? icon('check','w-3 h-3 text-love-accent dark:text-love-dark-accent') : ''}</button>`).join('')}
      </div>
    </div>
  </div>
  <button id="dark-btn" class="p-2 md:p-2.5 rounded-full bg-love-accent/15 hover:bg-love-accent/25 dark:bg-love-dark-accent/15 dark:hover:bg-love-dark-accent/25 text-love-accent dark:text-love-dark-accent transition-all duration-300 backdrop-blur-md shadow-sm active:scale-95 border border-love-accent/20 dark:border-love-dark-accent/20" aria-label="Toggle dark mode">${isDarkMode ? icon('sun','w-4 h-4 md:w-[18px] md:h-[18px] rotate-icon') : icon('moon','w-4 h-4 md:w-[18px] md:h-[18px] rotate-icon')}</button>
  <button id="music-btn" class="p-2 md:p-2.5 rounded-full bg-love-accent/15 hover:bg-love-accent/25 dark:bg-love-dark-accent/15 dark:hover:bg-love-dark-accent/25 text-love-accent dark:text-love-dark-accent transition-all duration-300 backdrop-blur-md shadow-sm active:scale-95 border border-love-accent/20 dark:border-love-dark-accent/20" aria-label="Toggle background music">${musicEnabled ? '♫' : '×'}</button>`;
  document.getElementById('theme-btn').onclick = () => { showThemePicker = !showThemePicker; renderControls(); };
  document.getElementById('theme-close').onclick = () => { showThemePicker = false; renderControls(); };
  container.querySelectorAll('[data-theme]').forEach(btn => btn.onclick = () => { setTheme(btn.dataset.theme); showThemePicker = false; renderControls(); });
  document.getElementById('dark-btn').onclick = () => setDarkMode(!isDarkMode);
  document.getElementById('music-btn').onclick = () => toggleBackgroundMusic();
}

function sendYouTubeCommand(func) {
  if (!musicFrame || !musicFrame.contentWindow) return;
  musicFrame.contentWindow.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*');
}

function startBackgroundMusic() {
  if (!musicEnabled || musicStarted) return;
  musicStarted = true;
  musicFrame = document.createElement('iframe');
  musicFrame.id = 'background-music-frame';
  musicFrame.title = 'Background music';
  musicFrame.setAttribute('aria-hidden', 'true');
  musicFrame.allow = 'autoplay; encrypted-media';
  musicFrame.style.position = 'fixed';
  musicFrame.style.width = '1px';
  musicFrame.style.height = '1px';
  musicFrame.style.left = '-10px';
  musicFrame.style.bottom = '-10px';
  musicFrame.style.opacity = '0.01';
  musicFrame.style.pointerEvents = 'none';
  musicFrame.src = `https://www.youtube.com/embed/${BACKGROUND_YOUTUBE_ID}?autoplay=1&controls=0&disablekb=1&loop=1&playlist=${BACKGROUND_YOUTUBE_ID}&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`;
  document.body.appendChild(musicFrame);
  setTimeout(() => { sendYouTubeCommand('unMute'); sendYouTubeCommand('playVideo'); }, 1200);
}

function toggleBackgroundMusic() {
  musicEnabled = !musicEnabled;
  if (musicEnabled) {
    if (!musicStarted) startBackgroundMusic();
    else { sendYouTubeCommand('unMute'); sendYouTubeCommand('playVideo'); }
  } else if (musicStarted) {
    sendYouTubeCommand('pauseVideo');
    sendYouTubeCommand('mute');
  }
  renderControls();
}


let SECTION_INDEX = 0;
function section(html, className='') {
  SECTION_INDEX += 1;
  return `<section data-bb-screen="section-${SECTION_INDEX}" class="w-full relative overflow-x-hidden ${className}"><div class="h-full flex flex-col justify-center items-center section-reveal">${html}</div></section>`;
}

function renderHeroAndStory() {
  let html = '';
  html += section(`<div class="hero-heart mb-8"><div class="p-4 rounded-full border border-love-accent/20 dark:border-love-dark-accent/20 inline-block bg-white/30 dark:bg-black/30 backdrop-blur-md shadow-lg">${icon('heart','w-8 h-8 text-love-accent dark:text-love-dark-accent')}</div></div><h1 class="hero-title font-serif text-5xl md:text-7xl lg:text-8xl font-light italic mb-6 text-love-text dark:text-love-dark-text tracking-tight drop-shadow-sm">To My Dearest</h1><p class="hero-subtitle text-sm md:text-base uppercase tracking-[0.3em] text-love-accent/80 dark:text-love-dark-accent/80 mt-4 font-medium">Scroll slowly</p><div class="absolute bottom-12 animate-bounce-soft"><div class="w-[1px] h-16 bg-love-accent/30 dark:bg-love-dark-accent/30 mx-auto"></div></div>`, 'min-h-screen flex flex-col justify-center items-center text-center px-6 relative z-10');
  STORY_DATA.forEach(item => {
    html += section(`<div class="max-w-3xl text-center flex flex-col items-center story-item"><span class="story-number block font-serif text-3xl md:text-4xl text-love-accent/50 dark:text-love-dark-accent/50 mb-6">${item.number}</span><h2 class="story-title font-serif text-3xl md:text-5xl lg:text-6xl leading-tight mb-8 text-love-text dark:text-love-dark-text">${item.title}</h2><p class="story-body text-lg md:text-xl leading-relaxed text-love-text/80 dark:text-love-dark-text/80 font-light max-w-xl mx-auto">${item.body}</p></div>`, 'min-h-screen flex flex-col justify-center items-center px-6 md:px-20 py-20 z-10');
  });
  return html;
}

function bloomGardenHTML() {
  return section(`<div class="w-full max-w-4xl mx-auto px-6 relative"><div class="text-center mb-10"><h2 class="font-serif text-3xl md:text-5xl mb-4 text-love-text dark:text-love-dark-text">The Digital Garden</h2><p class="text-love-accent dark:text-love-dark-accent/80 text-sm md:text-base tracking-wide uppercase">I can't bring you flowers every hour, so I built you a garden that never dies.</p><p class="text-xs text-love-text/50 dark:text-love-dark-text/50 mt-2">(Tap anywhere in the box below to plant a flower)</p></div><div id="garden" class="relative w-full h-[400px] bg-white/40 dark:bg-black/20 rounded-xl border border-love-accent/20 dark:border-love-dark-accent/10 shadow-inner overflow-hidden cursor-crosshair touch-none"><div class="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-t from-green-100/30 to-transparent dark:from-green-900/10 pointer-events-none"></div><div id="garden-placeholder" class="absolute inset-0 flex items-center justify-center pointer-events-none"><span class="text-love-text/10 dark:text-love-dark-text/10 font-serif text-4xl italic">Plant me...</span></div><div id="garden-layer"></div><button id="garden-clear" class="hidden absolute bottom-4 right-4 z-10 text-[10px] uppercase tracking-widest text-love-text/40 hover:text-love-accent transition-colors bg-white/50 px-2 py-1 rounded">Clear Garden</button></div><div class="text-center mt-6"><span id="garden-count" class="font-serif italic text-love-accent dark:text-love-dark-accent text-lg">Waiting for your touch...</span></div></div>`, 'min-h-screen flex flex-col justify-center items-center px-4 py-20 z-10');
}

function loveJarHTML() {
  return section(`<div class="w-full max-w-2xl mx-auto px-6 text-center"><div class="mb-12"><h2 class="font-serif text-3xl md:text-5xl mb-4 text-love-text dark:text-love-dark-text">The Love Jar</h2><p class="text-love-accent dark:text-love-dark-accent/80 text-sm md:text-base tracking-wide uppercase">Pull a note whenever you need a reminder</p></div><div class="relative h-[400px] flex items-center justify-center"><div id="jar-wrap" class="relative cursor-pointer group"><div id="jar" class="relative w-48 h-64 border-4 border-love-accent/30 dark:border-love-dark-accent/30 rounded-[2rem] bg-white/20 dark:bg-white/5 backdrop-blur-sm flex items-center justify-center shadow-xl overflow-hidden"><div class="absolute -top-4 left-0 right-0 h-8 bg-love-accent/50 dark:bg-love-dark-accent/50 rounded-t-lg mx-4"></div><div id="jar-papers"><div class="absolute bottom-4 left-6 w-12 h-8 bg-love-pink/50 dark:bg-love-dark-accent/20 rotate-12 rounded shadow-sm"></div><div class="absolute bottom-8 right-8 w-12 h-8 bg-love-accent/40 dark:bg-love-dark-accent/30 -rotate-6 rounded shadow-sm"></div><div class="absolute bottom-12 left-12 w-12 h-8 bg-white/60 dark:bg-love-dark-text/20 rotate-45 rounded shadow-sm"></div><div class="absolute bottom-6 right-16 w-12 h-8 bg-love-pink/60 dark:bg-love-dark-accent/40 -rotate-12 rounded shadow-sm"></div></div><div class="bg-love-card dark:bg-love-dark-card px-4 py-2 rounded shadow border border-love-accent/20"><span class="font-serif italic text-love-text dark:text-love-dark-text">For You</span></div></div><div class="mt-8"><button id="pull-note" class="px-6 py-2 rounded-full bg-love-accent/10 dark:bg-love-dark-accent/10 text-love-accent dark:text-love-dark-accent text-sm font-medium uppercase tracking-widest hover:bg-love-accent hover:text-white dark:hover:bg-love-dark-accent dark:hover:text-love-dark-bg transition-colors duration-300">Pull a Note</button></div></div><div id="note-backdrop" class="hidden absolute inset-0 bg-white/60 dark:bg-black/40 backdrop-blur-sm z-10 rounded-xl"></div><div id="note-overlay" class="hidden absolute z-20 w-72 h-72 md:w-80 md:h-80 bg-love-card dark:bg-love-dark-card shadow-2xl rounded-sm p-8 flex flex-col items-center justify-center border border-love-accent/10 dark:border-love-dark-accent/10"><div class="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-love-accent/20 dark:bg-love-dark-accent/20 opacity-50 rotate-1"></div>${icon('heart','w-8 h-8 text-love-accent dark:text-love-dark-accent mb-6 opacity-80')}<p id="note-text" class="font-serif text-xl md:text-2xl text-love-text dark:text-love-dark-text italic leading-relaxed"></p><div class="absolute bottom-4 right-4 flex gap-2"><button id="another-note" class="p-2 rounded-full hover:bg-love-accent/10 dark:hover:bg-love-dark-accent/10 text-love-text/50 dark:text-love-dark-text/50 transition-colors" aria-label="Another note">${icon('refresh')}</button><button id="close-note" class="p-2 rounded-full hover:bg-love-accent/10 dark:hover:bg-love-dark-accent/10 text-love-text/50 dark:text-love-dark-text/50 transition-colors" aria-label="Close note">${icon('x')}</button></div></div></div></div>`, 'min-h-screen flex flex-col justify-center items-center px-4 py-20 z-10');
}

function finalLetterHTML() {
  return section(`<div class="relative max-w-2xl w-full bg-love-card dark:bg-love-dark-card p-8 md:p-16 final-letter border border-love-pink/30 dark:border-love-dark-accent/20 text-center transition-colors duration-700"><div class="absolute top-4 left-4 w-4 h-4 border-t border-l border-love-accent/30 dark:border-love-dark-accent/30"></div><div class="absolute top-4 right-4 w-4 h-4 border-t border-r border-love-accent/30 dark:border-love-dark-accent/30"></div><div class="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-love-accent/30 dark:border-love-dark-accent/30"></div><div class="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-love-accent/30 dark:border-love-dark-accent/30"></div><div class="final-content opacity-0 scale-95"><div>${icon('heart','w-6 h-6 mx-auto text-love-accent dark:text-love-dark-accent mb-8')}</div><h3 class="font-serif text-3xl md:text-4xl italic text-love-text dark:text-love-dark-text mb-8">Happy Valentine's Day</h3><div class="space-y-6 font-light text-love-text/90 dark:text-love-dark-text/90 leading-loose"><p>Words often fail to capture the depth of what I feel, but I hope this small gesture reminds you of how incredibly special you are to me.</p><p>You are my best friend, my confidant, and my greatest love. Thank you for filling my days with light and my heart with peace.</p><p>I love you, more than yesterday, but less than tomorrow.</p></div><div class="mt-12 pt-8 border-t border-love-accent/10 dark:border-love-dark-accent/10"><p class="font-serif italic text-xl text-love-text dark:text-love-dark-text">Forever yours</p></div></div></div>`, 'min-h-screen flex justify-center items-center px-4 py-20 z-10');
}

function introHTML() {
  return `<div id="intro-gate" class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-love-bg dark:bg-love-dark-bg px-6 transition-colors duration-700"><div id="gate-stage" class="text-center max-w-3xl w-full"></div></div>`;
}

function setIntroStage() {
  const stage = document.getElementById('gate-stage');
  if (!stage) return;
  if (window.__gateTimer) clearTimeout(window.__gateTimer);
  if (window.__gateTimer2) clearTimeout(window.__gateTimer2);
  if (window.__gateStep < 2) {
    if (window.__gateStep === 0) {
      stage.innerHTML = `<div class="text-center gate-in"><div class="mb-8 inline-block p-4 rounded-full border border-love-accent/10 dark:border-love-dark-accent/10">${icon('heart','w-8 h-8 text-love-accent/60 dark:text-love-dark-accent/60')}</div><h2 class="font-serif text-3xl md:text-5xl text-love-text dark:text-love-dark-text font-light italic tracking-wide">I made this just for you.</h2></div>`;
      window.__gateTimer = setTimeout(() => { window.__gateStep = 1; setIntroStage(); }, 2500);
      return;
    }
    stage.innerHTML = `<div class="text-center gate-in"><p class="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-love-accent/80 dark:text-love-dark-accent/80 mb-6">But first</p><h2 class="font-serif text-3xl md:text-5xl text-love-text dark:text-love-dark-text font-light italic tracking-wide">Before anything else...</h2></div>`;
    window.__gateTimer2 = setTimeout(() => { window.__gateStep = 2; setIntroStage(); }, 3000);
    return;
  }
  const p = SILLY_PROMPTS[Math.min(rejectionCount, SILLY_PROMPTS.length-1)];
  const yesScale = 1 + rejectionCount * .1;
  stage.innerHTML = `<div class="text-center gate-in"><div class="mb-10 flex justify-center animate-pulse-soft">${icon('heart','w-20 h-20 text-love-accent dark:text-love-dark-accent')}</div><div class="min-h-[8rem] md:min-h-[10rem] flex flex-col justify-end items-center mb-12"><div key="${rejectionCount}"><h1 class="font-serif text-3xl md:text-5xl lg:text-6xl text-love-text dark:text-love-dark-text italic mb-4 leading-tight px-4">${p.title}</h1><p class="text-lg md:text-xl text-love-text/60 dark:text-love-dark-text/60 font-light">${p.subtitle}</p></div></div><div class="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4"><button id="yes-btn" style="transform:scale(${yesScale})" class="group relative px-12 py-5 overflow-hidden rounded-full bg-transparent border border-love-accent/30 hover:border-love-accent/60 dark:border-love-dark-accent/30 dark:hover:border-love-dark-accent/60 transition-colors duration-700 z-10"><span class="absolute inset-0 w-full h-full bg-love-accent/5 dark:bg-love-dark-accent/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700"></span><span class="relative font-sans text-sm tracking-[0.25em] uppercase text-love-text group-hover:text-love-accent dark:text-love-dark-text dark:group-hover:text-love-dark-accent transition-colors duration-500 whitespace-nowrap">Yes, Forever</span></button><button id="no-btn" class="px-8 py-4 rounded-full text-love-text/40 hover:text-love-text/80 dark:text-love-dark-text/40 dark:hover:text-love-dark-text/80 hover:bg-love-accent/5 dark:hover:bg-love-dark-accent/5 transition-all duration-300 font-sans text-xs tracking-[0.2em] uppercase">${rejectionCount === 0 ? 'No' : 'Still No?'}</button></div></div>`;
  document.getElementById('yes-btn').onclick = completeIntro;
  document.getElementById('no-btn').onclick = () => { rejectionCount = Math.min(rejectionCount + 1, SILLY_PROMPTS.length - 1); setIntroStage(); };
}

function completeIntro() {
  introComplete = true;
  startBackgroundMusic();
  const gate = document.getElementById('intro-gate');
  gate.classList.add('hidden-gate');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  document.body.style.height = '';
  document.documentElement.style.height = '';
  setTimeout(() => gate.remove(), 2100);
  document.querySelectorAll('.section-reveal').forEach(el => observeReveal(el));
}

function observeReveal(el) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.05, rootMargin: '-10% 0px' });
  observer.observe(el);
}

function updateProgress() {
  const bar = document.getElementById('progress');
  if (!bar) return;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? window.scrollY / max : 0;
  bar.style.transform = `scaleX(${ratio})`;
}

function renderGarden() {
  const layer = document.getElementById('garden-layer');
  const placeholder = document.getElementById('garden-placeholder');
  const clear = document.getElementById('garden-clear');
  const count = document.getElementById('garden-count');
  if (!layer) return;
  placeholder.classList.toggle('hidden', gardenFlowers.length > 0);
  clear.classList.toggle('hidden', gardenFlowers.length <= 5);
  count.textContent = gardenFlowers.length > 0 ? `${gardenFlowers.length} flowers planted for you` : 'Waiting for your touch...';
  layer.innerHTML = gardenFlowers.map(f => {
    let content = '';
    if (f.type === 0) content = icon('flower','w-8 h-8 md:w-12 md:h-12 drop-shadow-sm');
    else if (f.type === 1) content = icon('flower2','w-8 h-8 md:w-12 md:h-12 drop-shadow-sm');
    else content = icon('heart','w-6 h-6 md:w-8 md:h-8 drop-shadow-sm');
    return `<div class="absolute -translate-x-1/2 -translate-y-1/2 plant-in ${f.color}" style="left:${f.x}px;top:${f.y}px;transform:translate(-50%,-50%) rotate(${f.rotation}deg)">${content}</div>`;
  }).join('');
}

function setupGarden() {
  const garden = document.getElementById('garden');
  const clear = document.getElementById('garden-clear');
  if (!garden) return;
  garden.onclick = (e) => {
    if (e.target === clear) return;
    const rect = garden.getBoundingClientRect();
    gardenFlowers.push({ id: Date.now() + Math.random(), x: e.clientX - rect.left, y: e.clientY - rect.top, type: Math.floor(Math.random()*3), color: ['text-pink-400 dark:text-pink-300','text-rose-400 dark:text-rose-300','text-purple-400 dark:text-purple-300','text-red-400 dark:text-red-300','text-orange-400 dark:text-orange-300'][Math.floor(Math.random()*5)], rotation: Math.random()*60-30 });
    renderGarden();
  };
  clear.onclick = (e) => { e.stopPropagation(); gardenFlowers = []; renderGarden(); };
  renderGarden();
}

function showNote() {
  if (noteOpen || noteTimer) return;
  const jar = document.getElementById('jar');
  const btn = document.getElementById('pull-note');
  noteTimer = true;
  jar.classList.remove('shake-jar'); void jar.offsetWidth; jar.classList.add('shake-jar');
  btn.textContent = 'Shaking...';
  setTimeout(() => {
    noteTimer = null;
    noteOpen = NOTES[Math.floor(Math.random()*NOTES.length)];
    document.getElementById('note-text').textContent = `"${noteOpen}"`;
    document.getElementById('note-overlay').classList.remove('hidden');
    document.getElementById('note-overlay').classList.remove('note-pop'); void document.getElementById('note-overlay').offsetWidth; document.getElementById('note-overlay').classList.add('note-pop');
    document.getElementById('note-backdrop').classList.remove('hidden');
    document.getElementById('jar-papers').style.opacity = '0';
    btn.textContent = 'Pull a Note';
  }, 1000);
}

function closeNote() {
  noteOpen = null;
  document.getElementById('note-overlay').classList.add('hidden');
  document.getElementById('note-backdrop').classList.add('hidden');
  document.getElementById('jar-papers').style.opacity = '';
}

function setupLoveJar() {
  const jarWrap = document.getElementById('jar-wrap');
  const pull = document.getElementById('pull-note');
  const another = document.getElementById('another-note');
  const close = document.getElementById('close-note');
  const backdrop = document.getElementById('note-backdrop');
  if (!jarWrap) return;
  jarWrap.onclick = (e) => { if (e.target === pull || e.target.closest('#pull-note')) return; if (!noteOpen) showNote(); };
  pull.onclick = (e) => { e.stopPropagation(); showNote(); };
  another.onclick = (e) => { e.stopPropagation(); closeNote(); setTimeout(showNote, 50); };
  close.onclick = (e) => { e.stopPropagation(); closeNote(); };
  backdrop.onclick = closeNote;
}

function setupInAppGuard() {
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const detected = [/FBAN/,/FBAV/,/Instagram/,/Line/,/Twitter/,/LinkedIn/,/Messenger/].some(re => re.test(ua));
  if (!detected) return;
  const el = document.createElement('div');
  el.id = 'browser-guard';
  el.className = 'fixed inset-0 z-[100000] bg-love-bg dark:bg-love-dark-bg flex flex-col items-center justify-center p-6 text-center';
  el.innerHTML = `<div class="max-w-md w-full bg-love-card dark:bg-love-dark-card p-8 rounded-3xl shadow-2xl border border-love-pink/20 fade-scale-in"><div class="w-16 h-16 bg-love-pink/20 rounded-full flex items-center justify-center mx-auto mb-6">${icon('smartphone','w-8 h-8 text-love-accent dark:text-love-dark-accent')}</div><h2 class="font-serif text-2xl mb-4 text-love-text dark:text-love-dark-text">Open in System Browser</h2><p class="text-love-text/80 dark:text-love-dark-text/80 mb-8 leading-relaxed">For the best experience (especially the music!), please open this link in your phone's native browser.</p><div class="flex flex-col gap-4 items-center text-sm text-love-text/70 dark:text-love-dark-text/70"><div class="flex items-center gap-3 w-full p-4 bg-love-bg/50 dark:bg-love-dark-bg/50 rounded-xl"><span class="flex items-center justify-center w-8 h-8 rounded-full bg-love-accent text-white font-bold text-xs shrink-0">1</span><span class="text-left flex-1">Tap the ${icon('more','w-4 h-4 inline mx-1')} menu icon usually in the top right</span></div><div class="flex items-center gap-3 w-full p-4 bg-love-bg/50 dark:bg-love-dark-bg/50 rounded-xl"><span class="flex items-center justify-center w-8 h-8 rounded-full bg-love-accent text-white font-bold text-xs shrink-0">2</span><span class="text-left flex-1">Select <span class="font-semibold inline-flex items-center gap-1">${icon('external','w-3 h-3')} Open in Chrome/Safari</span></span></div></div><button id="continue-browser" class="mt-8 text-xs text-love-text/50 underline hover:text-love-text/80">Continue anyway (Experience might be limited)</button></div>`;
  document.body.appendChild(el);
  document.getElementById('continue-browser').onclick = () => el.remove();
}

function setupScrollAnimations() {
  document.querySelectorAll('.story-item').forEach(item => {
    const number = item.querySelector('.story-number');
    const title = item.querySelector('.story-title');
    const body = item.querySelector('.story-body');
    const o = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          number.style.animation = 'gate-in 1s .2s both';
          title.style.animation = 'gate-in 1.1s .4s both';
          body.style.animation = 'float-in 1.2s .6s both';
          o.unobserve(item);
        }
      });
    }, { threshold: .1, rootMargin: '-10% 0px' });
    o.observe(item);
  });
  const final = document.querySelector('.final-content');
  if (final) {
    const o = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { final.style.animation='fade-scale-in 1s both'; o.unobserve(final); } }), {threshold:.1});
    o.observe(final);
  }
}

function mainRender() {
  app.innerHTML = `${backgroundHTML()}<div class="min-h-screen font-sans selection:bg-love-accent selection:text-white transition-colors duration-700 relative">${renderHeroAndStory()}${bloomGardenHTML()}${loveJarHTML()}${finalLetterHTML()}<footer class="py-8 text-center text-love-text/30 dark:text-love-dark-text/30 text-xs tracking-widest uppercase relative z-10 font-medium">Made with love, for you.</footer></div>${introHTML()}<div id="progress" class="fixed top-0 left-0 right-0 h-1 bg-love-accent dark:bg-love-dark-accent origin-left z-50 opacity-50" style="transform:scaleX(0)"></div>`;
  setTheme('blush');
  renderControls();
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  document.body.style.height = '100vh';
  document.documentElement.style.height = '100vh';
  window.__gateStep = 0;
  setIntroStage();
  setupGarden();
  setupLoveJar();
  setupScrollAnimations();
  window.addEventListener('scroll', updateProgress, {passive:true});
  window.addEventListener('resize', updateProgress);
  updateProgress();
  setupInAppGuard();
  if (BB_EDITOR_MODE) {
    introComplete = true;
    const gate = document.getElementById('intro-gate');
    if (gate) gate.remove();
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.height = '';
    document.documentElement.style.height = '';
  }
}

mainRender();
