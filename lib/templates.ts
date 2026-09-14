export type TemplateCatalogItem={slug:string;name:string;category:string;categoryLabel:string;description:string;emoji:string};

export const templateCatalog: TemplateCatalogItem[] = [
  {slug:'master',name:'Magic Bloom',category:'birthday',categoryLabel:'Birthday',description:'The flagship cinematic birthday experience with surprise moments.',emoji:'🎂'},
  {slug:'birthday-sweet',name:'Pastel Birthday',category:'birthday',categoryLabel:'Birthday',description:'Soft, playful and joyful for a bright birthday surprise.',emoji:'🧁'},
  {slug:'birthday-festival',name:'Birthday Parade',category:'birthday',categoryLabel:'Birthday',description:'Color, confetti and celebration energy for a big day.',emoji:'🎉'},
  {slug:'romantic',name:'Midnight Love',category:'anniversary',categoryLabel:'Anniversary',description:'Warm, intimate and cinematic for your shared story.',emoji:'💕'},
  {slug:'proposal',name:'The Big Question',category:'proposal',categoryLabel:'Proposal',description:'An elegant build-up to one unforgettable question.',emoji:'💍'},
  {slug:'wedding',name:'Ever After',category:'wedding',categoryLabel:'Wedding',description:'Graceful, timeless and romantic for a wedding story.',emoji:'💐'},
  {slug:'sorry',name:'I’m Sorry',category:'sorry',categoryLabel:'Sorry',description:'A gentle, sincere page for saying what matters.',emoji:'🥺'},
  {slug:'miss-you',name:'Wish You Were Here',category:'miss-you',categoryLabel:'Miss You',description:'A soft memory-filled experience for someone you miss.',emoji:'🌙'},
  {slug:'thank-you',name:'With Gratitude',category:'thank-you',categoryLabel:'Thank You',description:'Turn a simple thank you into a beautiful keepsake.',emoji:'💌'},
  {slug:'congratulations',name:'Achievement Unlocked',category:'congratulations',categoryLabel:'Congratulations',description:'Bold and celebratory for a win worth remembering.',emoji:'🏆'},
  {slug:'graduation',name:'Next Chapter',category:'graduation',categoryLabel:'Graduation',description:'Modern milestone storytelling for a new chapter.',emoji:'🎓'},
  {slug:'friendship',name:'Best Friends',category:'friendship',categoryLabel:'Friendship',description:'Playful memories and inside-joke energy for your people.',emoji:'🤝'},
  {slug:'surprise',name:'Secret Surprise',category:'surprise',categoryLabel:'Surprise',description:'A playful reveal-driven experience for a special secret.',emoji:'🎁'},
  {slug:'festival',name:'Color Parade',category:'festival',categoryLabel:'Festival',description:'Bright, expressive and full of celebration energy.',emoji:'🎊'},
];

export const templateById = (id?:string) => templateCatalog.find(t=>t.slug===id) || templateCatalog[0];
export const templateCategories = Array.from(new Map(templateCatalog.map(t=>[t.category,{id:t.category,label:t.categoryLabel,emoji:t.emoji}])).values());
