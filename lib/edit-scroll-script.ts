/**
 * Editor-only helper that runs INSIDE a template iframe. Phone/tablet: when a finger
 * drags over the template and the template itself cannot scroll any further, the page
 * (parent) is scrolled instead, so the builder page never "sticks" under the finger.
 * Plain ES5, injected as text (no backticks / template placeholders).
 */
export const EDIT_SCROLL_JS = `(function(){
if(window.__bbScrollFwd)return;window.__bbScrollFwd=1;
var isActive=function(){return false;};
var y0=null,target=null,raf=0,pending=0;
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
function parentScroller(){
  try{
    var doc=window.parent.document, node=window.frameElement;
    while(node&&node!==doc.body){
      node=node.parentElement;
      if(!node)break;
      var oy=window.parent.getComputedStyle(node).overflowY;
      if((oy==='auto'||oy==='scroll')&&node.scrollHeight>node.clientHeight+1)return node;
    }
    return doc.scrollingElement||doc.documentElement;
  }catch(_){return null;}
}
function scrollParent(dy){
  if(!dy)return;
  try{
    var se=parentScroller();
    if(se){
      var max=Math.max(0,se.scrollHeight-se.clientHeight),next=Math.max(0,Math.min(max,se.scrollTop+dy));
      if(next!==se.scrollTop)se.scrollTop=next;
      return;
    }
  }catch(_){}
  try{window.parent.scrollBy(0,dy);}catch(__){}
}
function flush(){
  raf=0;
  if(!pending)return;
  var dy=pending;pending=0;scrollParent(dy);
}
function queueParent(dy){
  pending+=dy;
  if(!raf)raf=requestAnimationFrame(flush);
}
window.addEventListener('touchstart',function(e){
  var t=e.touches&&e.touches[0];
  if(!t||e.touches.length>1||!isActive()){y0=null;target=null;return;}
  y0=yOf(t);target=e.target;
},{capture:true,passive:true});
window.addEventListener('touchmove',function(e){
  if(y0===null||!isActive())return;
  var t=e.touches&&e.touches[0];if(!t)return;
  var ny=yOf(t),dy=y0-ny;if(!dy)return;
  y0=ny;
  if(movable(target,dy)){return;}
  if(e.cancelable)e.preventDefault();
  queueParent(dy);
},{capture:true,passive:false});
window.addEventListener('touchend',function(){if(raf)cancelAnimationFrame(raf);raf=0;flush();y0=null;target=null;},{capture:true,passive:true});
window.addEventListener('touchcancel',function(){if(raf)cancelAnimationFrame(raf);raf=0;pending=0;y0=null;target=null;},{capture:true,passive:true});
window.addEventListener('wheel',function(e){
  if(!isActive()||!e||!e.deltaY)return;
  if(movable(e.target,e.deltaY))return;
  if(e.cancelable)e.preventDefault();
  queueParent(e.deltaY);
},{capture:true,passive:false});
window.__bbScrollFwdSet=function(fn){isActive=fn;};
})();`;

/** Script text that installs the helper and tells it when to be active. */
export function editScrollSnippet(activeExpr: string): string {
  return EDIT_SCROLL_JS + '\nwindow.__bbScrollFwdSet(function(){return !!(' + activeExpr + ');});\n';
}
