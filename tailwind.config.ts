import type {Config} from 'tailwindcss';
const config: Config = {
  content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],
  darkMode:'class',
  theme:{extend:{
    fontFamily:{serif:['"Cormorant Garamond"','serif'],sans:['"Montserrat"','sans-serif']},
    colors:{
      'love-bg':'var(--love-bg)','love-text':'var(--love-text)','love-pink':'var(--love-pink)','love-accent':'var(--love-accent)','love-card':'var(--love-card)',
      'love-dark-bg':'var(--love-dark-bg)','love-dark-text':'var(--love-dark-text)','love-dark-accent':'var(--love-dark-accent)','love-dark-card':'var(--love-dark-card)'
    }
  }},
  plugins:[]
};
export default config;
