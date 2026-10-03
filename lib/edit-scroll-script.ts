/**
 * Editor-only helper that runs INSIDE a template iframe. Phone/tablet: when a finger
 * drags over the template and the template itself cannot scroll any further, the page
 * (parent) is scrolled instead, so the builder page never "sticks" under the finger.
 * Plain ES5, injected as text (no backticks / template placeholders).
 */
export const EDIT_SCROLL_JS = `(function(){
if(window.__bbScrollFwd)return;window.__bbScrollFwd=1;
var isActive=function(){return false;};
var y0=null,target=null,mode=0;
// finger position in the PARENT viewport: stays put while the page scrolls under the finger
function yOf(t){var o=0;try{if(window.frameElement)o=window.frameElement.getBoundingClientRect().top;}catch(_){}return t.clientY+o;}
function movable(el,dy){
  while(el&&el.nodeType===1){
    var oy=getComputedStyle(el).overflowY;
    if((oy==='auto'||oy==='scroll')&&el.scrollHeight>el.clientHeight+1){
      if(dy>0&&el.scrollTop+el.clientHeight<el.scrollHeight-1)return true;
      if(dy<0&&el.scrollTop>0)return true;
    }
    el=el.parentElement;
  }
  var se=document.scrollingElement||document.documentElement;
  var ov=function(n){try{return getComputedStyle(n).overflowY;}catch(_){return 'visible';}};
  var vo=ov(document.documentElement);if(vo==='visible'&&document.body)vo=ov(document.body);
  if(se&&vo!=='hidden'&&vo!=='clip'&&se.scrollHeight>se.clientHeight+1){
    if(dy>0&&se.scrollTop+se.clientHeight<se.scrollHeight-1)return true;
    if(dy<0&&se.scrollTop>0)return true;
  }
  return false;
}
window.addEventListener('touchstart',function(e){
  var t=e.touches&&e.touches[0];
  if(!t||e.touches.length>1||!isActive()){y0=null;return;}
  y0=yOf(t);target=e.target;mode=0;
},{capture:true,passive:true});
window.addEventListener('touchmove',function(e){
  if(y0===null)return;
  var t=e.touches&&e.touches[0];if(!t)return;
  var ny=yOf(t),dy=y0-ny;if(!dy)return;
  y0=ny;
  if(mode===0)mode=movable(target,dy)?1:2;
  if(mode===2&&e.cancelable){
    e.preventDefault();
    try{window.parent.scrollBy({top:dy,left:0,behavior:'instant'});}catch(_){try{window.parent.scrollBy(0,dy);}catch(__){}}
  }
},{capture:true,passive:false});
window.addEventListener('touchend',function(){y0=null;},{capture:true,passive:true});
window.addEventListener('touchcancel',function(){y0=null;},{capture:true,passive:true});
window.__bbScrollFwdSet=function(fn){isActive=fn;};
})();`;

/** Script text that installs the helper and tells it when to be active. */
export function editScrollSnippet(activeExpr: string): string {
  return EDIT_SCROLL_JS + '\nwindow.__bbScrollFwdSet(function(){return !!(' + activeExpr + ');});\n';
}
