/**
 * Shared editor-only script that draws a small pencil badge on every highlighted
 * (editable) element inside a template iframe. Tapping the badge opens the same
 * editor as tapping the element itself. Plain ES5 on purpose: it is injected as text
 * into several different template documents (no backticks, no template placeholders).
 */
export const EDIT_BADGE_JS = `(function(){
if(window.__bbEditBadges)return;
var cfg={selector:'',active:function(){return false;},bg:'linear-gradient(135deg,#ec4899,#8b5cf6)'};
var layer=null,pool=[],started=false,raf=0;
var SVG='<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" style="display:block;pointer-events:none"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
function addStyle(){
  if(document.getElementById('bb-edit-badge-style')||!document.head)return;
  var s=document.createElement('style');s.id='bb-edit-badge-style';
  s.textContent='html,body{overscroll-behavior:contain}#bb-edit-badge-layer{position:fixed;left:0;top:0;width:0;height:0;z-index:2147483000;pointer-events:none}#bb-edit-badge-layer .bb-edit-badge{position:fixed;box-sizing:border-box;width:20px;height:20px;margin:0;padding:0;border:1.5px solid rgba(255,255,255,.95);border-radius:50%;display:none;align-items:center;justify-content:center;cursor:pointer;pointer-events:auto;box-shadow:0 2px 6px rgba(15,23,42,.28);touch-action:manipulation;-webkit-tap-highlight-color:transparent;line-height:0;transition:transform .12s ease,box-shadow .12s ease}#bb-edit-badge-layer .bb-edit-badge:before{content:"";position:absolute;inset:-8px}#bb-edit-badge-layer .bb-edit-badge:hover{transform:scale(1.12);box-shadow:0 3px 9px rgba(15,23,42,.35)}#bb-edit-badge-layer .bb-edit-badge:active{transform:scale(.92)}@media (pointer:coarse){#bb-edit-badge-layer .bb-edit-badge{width:22px;height:22px}}';
  document.head.appendChild(s);
}
function ensureLayer(){
  if(layer&&layer.isConnected)return layer;
  layer=document.createElement('div');layer.id='bb-edit-badge-layer';layer.setAttribute('data-bb-ignore','1');
  (document.body||document.documentElement).appendChild(layer);
  pool=[];
  return layer;
}
function shown(el){
  if(typeof el.checkVisibility==='function'){
    try{return el.checkVisibility({checkOpacity:true,checkVisibilityCSS:true,opacityProperty:true,visibilityProperty:true});}catch(e){}
  }
  var n=el,cs;
  while(n&&n.nodeType===1){
    cs=getComputedStyle(n);
    if(cs.display==='none'||cs.visibility==='hidden'||parseFloat(cs.opacity)<0.05)return false;
    n=n.parentElement;
  }
  return true;
}
function onBadge(ev){
  ev.preventDefault();ev.stopPropagation();
  var el=ev.currentTarget.__el;if(!el)return;
  try{el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));}
  catch(e){try{el.click();}catch(_){}}
}
function hideAll(){for(var i=0;i<pool.length;i++)pool[i].style.display='none';}
function render(){
  if(!cfg.active()){hideAll();return;}
  addStyle();ensureLayer();
  var list=document.querySelectorAll(cfg.selector),n=0,seen={},vw=window.innerWidth,vh=window.innerHeight;
  for(var i=0;i<list.length;i++){
    var el=list[i];
    if(layer.contains(el))continue;
    if(el.closest&&el.closest('[data-bb-editor-nav]'))continue;
    var r=el.getBoundingClientRect();
    if(r.width<4||r.height<4||r.bottom<6||r.top>vh-6||r.right<6||r.left>vw-6)continue;
    if(!shown(el))continue;
    var cx=(Math.max(r.left,0)+Math.min(r.right,vw))/2,cy=(Math.max(r.top,0)+Math.min(r.bottom,vh))/2;
    var t=document.elementFromPoint(cx,cy);
    if(t&&!(t===el||el.contains(t)||t.contains(el)))continue;
    var left=Math.min(Math.max(r.right-12,3),vw-26),top=Math.min(Math.max(r.top-12,3),vh-26);
    var k=Math.round(left/12)+','+Math.round(top/12);
    if(seen[k])continue;seen[k]=1;
    var b=pool[n];
    if(!b){
      b=document.createElement('button');b.type='button';b.className='bb-edit-badge';
      b.setAttribute('data-bb-editor-nav','1');b.setAttribute('aria-label','Edit');b.title='Edit';
      b.innerHTML=SVG;b.addEventListener('click',onBadge);layer.appendChild(b);pool.push(b);
    }
    b.__el=el;b.style.left=left+'px';b.style.top=top+'px';b.style.background=cfg.bg;b.style.display='flex';
    n++;
  }
  for(;n<pool.length;n++)pool[n].style.display='none';
}
function tick(){raf=0;try{render();}catch(e){}}
function schedule(){if(!raf)raf=requestAnimationFrame(tick);}
window.__bbEditBadges={
  start:function(selector,active,bg){
    cfg.selector=selector;if(typeof active==='function')cfg.active=active;if(bg)cfg.bg=bg;
    if(!started){
      started=true;
      window.addEventListener('scroll',schedule,true);
      window.addEventListener('resize',schedule);
      window.addEventListener('orientationchange',schedule);
      document.addEventListener('transitionend',schedule,true);
      document.addEventListener('animationend',schedule,true);
      setInterval(schedule,250);
    }
    schedule();
  }
};
})();`;

/** Script text that installs the badge layer and starts it for a selector. */
export function editBadgeSnippet(selector: string, activeExpr: string, bg?: string): string {
  return EDIT_BADGE_JS + '\nwindow.__bbEditBadges.start(' + JSON.stringify(selector) + ',function(){return !!(' + activeExpr + ');},' + JSON.stringify(bg || '') + ');\n';
}
