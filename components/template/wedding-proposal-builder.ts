import type { BirthdayContent } from '@/lib/types';

/**
 * Wedding Proposal template – pure helpers (no React).
 *
 * Every visible text of the template is a "field" with a dedicated content key
 * (proposalEyebrow, proposalLetterText, ...). The same field list is used to
 *   1) render the published / preview HTML (buildWeddingHtml)
 *   2) drive the editor bridge that runs inside the iframe (buildWeddingBridge)
 * so edit mode, preview and the live website always show the same text.
 */

export type WeddingField = {
  key: string;
  label: string;
  def: string;
  /** original element in wedding-proposal-original.html */
  re: RegExp;
  open: string;
  close: string;
  /** keep \n as <br> (otherwise a line break becomes a space) */
  br?: boolean;
  /** inner content is filled at runtime by the template itself (typewriter letter) */
  keepInner?: boolean;
};

export const WEDDING_DEFAULT_LETTER =
  "From the moment you walked into my life, everything changed. The colors got brighter, the laughs got louder, and the quiet moments became my favorite parts of the day. You've shown me a kind of love I only ever thought existed in movies. You are my best friend, my confidant, and the most beautiful soul I have ever known. Every day with you is a gift — and I never want to stop unwrapping it.";

export const WEDDING_FIELDS: WeddingField[] = [
  { key: 'proposalEyebrow', label: 'Intro small title', def: 'A little something · made with love', re: /<p class="eyebrow">A little something · made with love<\/p>/, open: '<p class="eyebrow"', close: '</p>' },
  { key: 'proposalGreeting', label: 'Intro greeting', def: 'Hey {name}', re: /<h1 class="script">[\s\S]*?<\/h1>/, open: '<h1 class="script"', close: '</h1>' },
  { key: 'proposalIntroText', label: 'Intro text', def: "I've been holding onto a question for a while now.\nBut before I ask it… walk with me a little. 💫", re: /<p class="sub">[\s\S]*?<\/p>/, open: '<p class="sub"', close: '</p>', br: true },
  { key: 'proposalStartButton', label: 'Start button', def: 'Begin ✦', re: /<button class="btn btn-primary" id="startBtn">[\s\S]*?<\/button>/, open: '<button class="btn btn-primary" id="startBtn"', close: '</button>' },
  { key: 'proposalHintText', label: 'Intro hint', def: '🎧 Best experienced with sound on', re: /<p class="hint">[\s\S]*?<\/p>/, open: '<p class="hint"', close: '</p>' },
  { key: 'proposalGameTitle', label: 'Game title', def: 'Catch the golden pieces of my heart', re: /<p class="hud-title">[\s\S]*?<\/p>/, open: '<p class="hud-title"', close: '</p>' },
  { key: 'proposalLetterText', label: 'Love letter', def: WEDDING_DEFAULT_LETTER, re: /<p class="letter-text" id="letterText"><\/p>/, open: '<p class="letter-text" id="letterText"', close: '</p>', keepInner: true },
  { key: 'proposalContinueButton', label: 'Continue button', def: 'Continue ❤️', re: /<button class="btn btn-primary" id="continueBtn">[\s\S]*?<\/button>/, open: '<button class="btn btn-primary" id="continueBtn"', close: '</button>' },
  { key: 'proposalHeartTitle', label: 'Heart tap title', def: 'Tap to fill my heart with love', re: /<h2 class="tap-title">[\s\S]*?<\/h2>/, open: '<h2 class="tap-title"', close: '</h2>' },
  { key: 'proposalFinalEyebrow', label: 'Proposal small title', def: 'One last thing…', re: /<p class="eyebrow">One last thing…<\/p>/, open: '<p class="eyebrow"', close: '</p>' },
  { key: 'proposalQuestion', label: 'Proposal question', def: 'You are my greatest adventure, my safest home, and my one true love. Will you make me the happiest person in the universe and marry me, {name}?', re: /<h1>You are my greatest adventure,[\s\S]*?<\/h1>/, open: '<h1', close: '</h1>' },
  { key: 'proposalYesButton', label: 'Yes button', def: 'Yes, I will 💍', re: /<button class="btn btn-primary" id="yesBtn">[\s\S]*?<\/button>/, open: '<button class="btn btn-primary" id="yesBtn"', close: '</button>' },
  { key: 'proposalNoButton', label: 'No button', def: 'No', re: /<button class="btn btn-ghost" id="noBtn">[\s\S]*?<\/button>/, open: '<button class="btn btn-ghost" id="noBtn"', close: '</button>' },
  { key: 'proposalFinaleTitle', label: 'Finale title', def: 'I Love You,\n{name} ❤️', re: /<h1 class="final-title">[\s\S]*?<\/h1>/, open: '<h1 class="final-title"', close: '</h1>', br: true },
  { key: 'proposalFinaleSub', label: 'Finale signature', def: 'Yours forever, {sender}', re: /<p class="final-sub">[\s\S]*?<\/p>/, open: '<p class="final-sub"', close: '</p>' },
  { key: 'proposalReplayButton', label: 'Replay button', def: 'Replay ↺', re: /<button class="btn btn-ghost" id="replayBtn">[\s\S]*?<\/button>/, open: '<button class="btn btn-ghost" id="replayBtn"', close: '</button>' },
];

export function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/** JSON that is safe to put inside an inline <script>. */
function safeJson(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

type Loose = Record<string, unknown>;
const asLoose = (content: BirthdayContent) => content as unknown as Loose;

function pick(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

export function weddingNames(content: BirthdayContent) {
  return {
    receiver: content.name || 'You',
    sender: content.profile?.displayName || content.relationship || 'Someone who loves you',
  };
}

export function weddingLetter(content: BirthdayContent) {
  const own = asLoose(content).proposalLetterText;
  if (typeof own === 'string' && own.trim()) return own;
  const joined = content.letter?.join('\n');
  if (joined && joined.trim()) return joined;
  return content.message || '';
}

function renderTemplate(field: WeddingField, template: string, receiver: string, sender: string) {
  const html = escapeHtml(template)
    .replaceAll('{name}', `<span class="js-receiver">${escapeHtml(receiver)}</span>`)
    .replaceAll('{sender}', `<span class="js-sender">${escapeHtml(sender)}</span>`);
  return field.br ? html.replaceAll('\n', '<br>') : html.replaceAll('\n', ' ');
}

export function buildWeddingHtml(source: string, content: BirthdayContent, editorMode = false) {
  const { receiver, sender } = weddingNames(content);
  const loose = asLoose(content);
  const letter = weddingLetter(content);

  let html = source;
  html = html.replace(/const RECEIVER_NAME = "[\s\S]*?";/, () => `const RECEIVER_NAME = ${safeJson(receiver)};`);
  html = html.replace(/const SENDER_NAME\s*=\s*"[\s\S]*?";/, () => `const SENDER_NAME   = ${safeJson(sender)};`);
  html = html.replace(/const LETTER_TEXT =[\s\S]*?;\n\nlet typing/, () => `const LETTER_TEXT = ${safeJson(letter)};\n\nlet typing`);

  for (const field of WEDDING_FIELDS) {
    html = html.replace(field.re, () => {
      const attrs = ` data-bb-key="${field.key}" data-bb-label="${escapeHtml(field.label)}" data-bb-ignore="1"`;
      const inner = field.keepInner ? '' : renderTemplate(field, pick(loose[field.key], field.def), receiver, sender);
      return `${field.open}${attrs}>${inner}${field.close}`;
    });
  }

  // Controls that are not text content: never offered for editing.
  html = html.replace('<button class="sound-btn muted" id="soundBtn"', () => '<button data-bb-ignore="1" class="sound-btn muted" id="soundBtn"');
  html = html.replace('<p class="tap-count">', () => '<p class="tap-count" data-bb-ignore="1">');

  if (editorMode) html = html.replace('</body>', () => buildWeddingBridge(content) + '</body>');
  return html;
}

/** Content the editor bridge needs (kept small). */
function bridgeConfig(content: BirthdayContent) {
  const loose = asLoose(content);
  const cfg: Loose = {
    name: content.name,
    relationship: content.relationship,
    profile: { displayName: content.profile?.displayName },
    letter: content.letter,
    message: content.message,
  };
  for (const field of WEDDING_FIELDS) cfg[field.key] = loose[field.key];
  return cfg;
}

/**
 * Editor-only script that runs INSIDE the template iframe.
 *  - lets the visitor-facing flow be walked with Previous / Next only
 *    (intro → game → letter → heart tap → proposal → finale)
 *  - blocks every template interaction (buttons, heart tap, "No" button running away …)
 *  - click on any text selects it for the Quick Edit panel (dedicated content key)
 *  - applies live content changes (BB_CONTENT) without reloading the iframe
 */
export function buildWeddingBridge(content: BirthdayContent) {
  const fields = WEDDING_FIELDS.map(({ key, label, def, br }) => ({ key, label, def, br: !!br }));
  return `<script id="BB_WEDDING_EDITOR_BRIDGE">(function(){
if(window.__BB_WEDDING_BRIDGE__)return;window.__BB_WEDDING_BRIDGE__=true;
window.__BB_CUSTOM_HISTORY__=true;
var FIELDS=${safeJson(fields)};
var STEPS=[{id:'intro',label:'Intro'},{id:'game',label:'Game'},{id:'letter',label:'Letter'},{id:'heartTap',label:'Heart tap'},{id:'proposal',label:'Proposal'},{id:'finale',label:'Finale'}];
var cfg=${safeJson(bridgeConfig(content))};
var idx=0;
function esc(s){return String(s).split('&').join('&amp;').split('<').join('&lt;').split('>').join('&gt;').split('"').join('&quot;').split("'").join('&#039;');}
function val(f){var v=cfg[f.key];return(typeof v==='string'&&v.trim())?v:f.def;}
function names(){var p=cfg.profile||{};return{name:cfg.name||'You',sender:p.displayName||cfg.relationship||'Someone who loves you'};}
function letterValue(){var v=cfg.proposalLetterText;if(typeof v==='string'&&v.trim())return v;if(cfg.letter&&cfg.letter.join){var j=cfg.letter.join('\\n');if(j.trim())return j;}return cfg.message||'';}
function render(f,tpl){var n=names();var h=esc(tpl).split('{name}').join('<span class="js-receiver">'+esc(n.name)+'</span>').split('{sender}').join('<span class="js-sender">'+esc(n.sender)+'</span>');return f.br?h.split('\\n').join('<br>'):h.split('\\n').join(' ');}
function applyAll(){
  FIELDS.forEach(function(f){
    var el=document.querySelector('[data-bb-key="'+f.key+'"]');if(!el)return;
    if(f.key==='proposalLetterText'){var lv=letterValue();if(el.textContent!==lv)el.textContent=lv;return;}
    var h=render(f,val(f));
    if(el.__bbh!==h){el.innerHTML=h;el.__bbh=h;}
  });
}
function notify(){try{parent.postMessage({type:'BB_CANVAS_HISTORY_STATE',canBack:idx>0,canForward:idx<STEPS.length-1,screen:STEPS[idx].label},'*');}catch(e){}}
function go(i){
  idx=Math.max(0,Math.min(i,STEPS.length-1));
  var id=STEPS[idx].id;
  document.querySelectorAll('.screen').forEach(function(s){s.classList.toggle('is-active',s.id===id);});
  var hud=document.getElementById('hud');if(hud)hud.classList.toggle('is-active',id==='game');
  if(id==='letter'){
    var t=document.getElementById('letterText');
    if(t){t.classList.remove('typing');var lv=letterValue();if(t.textContent!==lv)t.textContent=lv;}
    var b=document.getElementById('continueBtn');if(b)b.classList.add('show');
  }
  if(id==='heartTap'){try{if(typeof resetHeart==='function')resetHeart();}catch(e){}}
  if(id==='finale'){['.final-sub','.final-actions'].forEach(function(q){var e=document.querySelector(q);if(e)e.style.opacity='1';});}
  notify();
}
window.BB_EDITOR_NAVIGATE=function(delta){go(idx+(delta<0?-1:1));};
function select(el){
  var key=el.getAttribute('data-bb-key');
  var f=FIELDS.filter(function(x){return x.key===key;})[0];
  var value=key==='proposalLetterText'?letterValue():(f?val(f):(el.textContent||''));
  try{parent.postMessage({type:'BB_ELEMENT_SELECTED',selection:{key:key,label:el.getAttribute('data-bb-label')||key,value:value,kind:'text'}},'*');}catch(e){}
}
// Capture phase on document: registered before the generic editor bridge, so it runs first.
document.addEventListener('click',function(e){
  var el=e.target&&e.target.closest?e.target.closest('[data-bb-key]'):null;
  if(!el)return;
  e.preventDefault();e.stopImmediatePropagation();
  if(Date.now()-lastTap<700)return;
  select(el);
},true);
// Mobile: a tap must select too. preventDefault on touchstart would cancel the click,
// so touch is handled as an explicit tap (touchstart records, touchend selects).
var tapStart=null,lastTap=0;
document.addEventListener('touchstart',function(e){
  var t=e.touches&&e.touches[0];
  tapStart=t?{x:t.clientX,y:t.clientY,time:Date.now()}:null;
  if(e.target&&e.target.closest&&e.target.closest('[data-bb-editor-nav]'))return;
  e.stopImmediatePropagation();
},{capture:true,passive:true});
document.addEventListener('touchend',function(e){
  if(e.target&&e.target.closest&&e.target.closest('[data-bb-editor-nav]'))return;
  var s0=tapStart;tapStart=null;
  e.stopImmediatePropagation();
  var t=e.changedTouches&&e.changedTouches[0];
  if(!s0||!t)return;
  if(Math.hypot(t.clientX-s0.x,t.clientY-s0.y)>12||Date.now()-s0.time>800)return;
  if(e.cancelable)e.preventDefault();
  var el=e.target&&e.target.closest?e.target.closest('[data-bb-key]'):null;
  if(el){lastTap=Date.now();select(el);}
},{capture:true,passive:false});
// Nothing of the real template flow may run while editing (heart tap, Begin, Yes, "No" running away …)
['pointerdown','mousedown','pointerup','mouseup','pointerenter','mouseenter','pointerover','mouseover'].forEach(function(type){
  document.addEventListener(type,function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    if(type==='pointerenter'||type==='mouseenter'||type==='pointerover'||type==='mouseover'){
      if(t.id==='noBtn'||(t.closest&&t.closest('#noBtn')))e.stopImmediatePropagation();
      return;
    }
    if(t.closest('.screen,.hud,.sound-btn'))e.stopImmediatePropagation();
  },true);
});
window.addEventListener('message',function(e){
  var d=e.data;if(!d)return;
  if(d.type==='BB_CONTENT'){cfg=d.content||cfg;applyAll();}
  else if(d.type==='BB_EDITOR_MODE'){notify();}
});
var st=document.createElement('style');
st.textContent='.bb-w-edit [data-bb-key]{cursor:pointer;outline:2px dashed rgba(255,215,110,.75);outline-offset:5px;transition:outline-color .15s;-webkit-tap-highlight-color:rgba(255,215,110,.3);touch-action:manipulation}.bb-w-edit [data-bb-key]:hover{outline-color:#fff;box-shadow:0 0 0 4px rgba(255,215,110,.25)}.bb-w-edit .hud,.bb-w-edit .hud *{pointer-events:auto}.bb-w-edit .sound-btn{pointer-events:none}';
document.head.appendChild(st);
document.body.classList.add('bb-w-edit');
applyAll();go(0);
window.addEventListener('load',function(){applyAll();go(idx);setTimeout(notify,300);});
})();</script>`;
}
