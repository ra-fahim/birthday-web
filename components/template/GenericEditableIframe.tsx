'use client';

import { useEffect, useRef, useState } from 'react';
import type { BirthdayContent } from '@/lib/types';
import { editBadgeSnippet } from '@/lib/edit-badge-script';

export type GenericEdit = {
  type: 'text' | 'image' | 'video' | 'audio' | 'link';
  value: string;
  label?: string;
  alt?: string;
  poster?: string;
  href?: string;
};

export type GenericEdits = Record<string, GenericEdit>;

type Selection = { key: string; label: string; index?: number; value?: string; kind?: string };

type Props = {
  title: string;
  src?: string;
  srcDoc?: string;
  content: BirthdayContent;
  editorMode?: boolean;
  genericEdits?: GenericEdits;
  minHeight?: number | string;
  background?: string;
  extraMessages?: Array<Record<string, unknown>>;
  onElementSelect?: (selection: Selection) => void;
  onHistoryState?: (state: { canBack?: boolean; canForward?: boolean; screen?: string }) => void;
};

function injectBridge(frame: HTMLIFrameElement) {
  let doc: Document | null = null;
  try { doc = frame.contentDocument; } catch { return; }
  if (!doc || !doc.body || doc.getElementById('bb-generic-editor-bridge')) return;
  const script = doc.createElement('script');
  script.id = 'bb-generic-editor-bridge';
  script.textContent = `
(function(){
  if(window.__BB_GENERIC_EDITOR__) return;
  window.__BB_GENERIC_EDITOR__ = true;
  var enabled=false, observer=null, edits={};
  var TEXT='h1,h2,h3,h4,h5,h6,p,span,button,a,label,li,blockquote,figcaption,small,strong,em,td,th,dt,dd';
  var MEDIA='img,video,audio,iframe';
  var audioSnapshot=[];
  var previewAudioUnlocked=false;
  var screens=[];
  var screenIndex=0;
  function visible(el){
    if(!el || el.closest('script,style,noscript,template,[data-bb-ignore]') || el.classList.contains('bb-edit-btn') || el.classList.contains('bb-inline-edit') || el.getAttribute('aria-label')==='Edit') return false;
    var s=getComputedStyle(el),r=el.getBoundingClientRect();
    return s.display!=='none' && s.visibility!=='hidden' && Number(s.opacity||1)>0 && r.width>1 && r.height>1;
  }
  function nth(el){ var n=1,p=el; while(p= p.previousElementSibling){ if(p.tagName===el.tagName && !p.classList.contains('bb-edit-btn') && !p.classList.contains('bb-inline-edit') && !p.matches('[data-bb-ignore]')) n++; } return n; }
  function path(el){ var parts=[]; var p=el; while(p && p.tagName && p.tagName!=='HTML' && parts.length<8){ parts.unshift(p.tagName.toLowerCase()+':nth-of-type('+nth(p)+')'); p=p.parentElement; } return parts.join('/'); }
  function kind(el){ var t=el.tagName; if(t==='IMG') return 'image'; if(t==='VIDEO') return 'video'; if(t==='AUDIO') return 'audio'; if(t==='A') return 'link'; if(t==='BUTTON') return 'button'; return 'text'; }
  function keyFor(el){ return 'gx.'+kind(el)+'.'+path(el); }
  function labelFor(el){
    var explicit=el.getAttribute('aria-label')||el.getAttribute('data-bb-label');
    if(explicit) return explicit;
    var text=(el.innerText||el.textContent||'').replace(/\\s+/g,' ').trim();
    if(text.length>70) text=text.slice(0,67)+'…';
    if(text) return text;
    if(el.tagName==='IMG') return 'Image';
    if(el.tagName==='VIDEO') return 'Video';
    if(el.tagName==='AUDIO') return 'Audio';
    if(el.tagName==='IFRAME') return 'Embedded video';
    return el.tagName.toLowerCase();
  }
  function candidates(){
    var out=[];
    document.querySelectorAll(TEXT+','+MEDIA).forEach(function(el){
      if(!visible(el)) return;
      if(el.matches(TEXT) && !((el.innerText||el.textContent||'').trim())) return;
      out.push(el);
    });
    return out;
  }
  function applyOne(el, edit){
    if(!edit) return;
    try{
      var t=el.tagName;
      if(t==='IMG'){
        if(edit.value) el.setAttribute('src',edit.value);
        if(edit.alt!=null) el.setAttribute('alt',edit.alt);
      } else if(t==='VIDEO'){
        if(edit.value) el.setAttribute('src',edit.value);
        if(edit.poster!=null) el.setAttribute('poster',edit.poster);
        try{el.load();}catch(_){ }
      } else if(t==='AUDIO'){
        if(edit.value) el.setAttribute('src',edit.value);
        try{el.load();}catch(_){ }
      } else if(t==='IFRAME'){
        if(edit.value && el.getAttribute('src')!==String(edit.value)) el.setAttribute('src',edit.value);
      } else if(t==='A'){
        if(edit.value!=null && el.textContent!==String(edit.value)) el.textContent=edit.value;
        if(edit.href!=null && el.getAttribute('href')!==String(edit.href)) el.setAttribute('href',edit.href);
      } else {
        if(edit.value!=null && el.textContent!==String(edit.value)) el.textContent=edit.value;
      }
    }catch(_){ }
  }
  function applyAll(){
    candidates().forEach(function(el){ var k=keyFor(el); if(edits[k]) applyOne(el,edits[k]); });
  }
  function snapshotAndMuteMedia(){
    var known=audioSnapshot.map(function(s){return s.el});
    document.querySelectorAll('audio,video').forEach(function(el){
      if(known.indexOf(el)===-1){
        audioSnapshot.push({el:el,muted:!!el.muted,volume:el.volume,paused:!!el.paused});
      }
      try{ el.muted=true; el.pause(); }catch(_){}
    });
  }
  function restoreMedia(){
    audioSnapshot.forEach(function(s){
      try{ s.el.muted=s.muted; s.el.volume=s.volume; if(!s.paused) s.el.play().catch(function(){}); }catch(_){}
    });
    audioSnapshot=[];
  }
  function playPreviewAudio(){
    if(enabled || previewAudioUnlocked) return;
    previewAudioUnlocked=true;
    var selectors='audio#bgm,audio#backgroundMusic,audio#bgAudio,audio#music,audio[data-bb-background-music],audio[loop]';
    document.querySelectorAll(selectors).forEach(function(el){ try{ el.muted=false; el.volume=el.volume>0?el.volume:0.45; el.play().catch(function(){}); }catch(_){} });
  }
  function discoverScreens(){
    var list=Array.prototype.slice.call(document.querySelectorAll('[data-bb-screen],.screen'));
    screens=list.filter(function(el){ return el && !el.closest('[data-bb-ignore]'); });
    if(!screens.length) return;
    var active=screens.findIndex(function(el){ return el.classList.contains('is-active') || el.classList.contains('show') || getComputedStyle(el).display!=='none'; });
    screenIndex=active>=0?active:Math.min(screenIndex,screens.length-1);
  }
  function postHistory(){
    if(window.__BB_CUSTOM_HISTORY__) return;
    try{ parent.postMessage({type:'BB_CANVAS_HISTORY_STATE',canBack:screenIndex>0,canForward:screenIndex<screens.length-1,screen:(screens[screenIndex]&&screens[screenIndex].id)||String(screenIndex)},'*'); }catch(_){}
  }
  function showScreenAt(i){
    discoverScreens(); if(!screens.length) return false;
    screenIndex=Math.max(0,Math.min(i,screens.length-1));
    screens.forEach(function(el,n){
      var active=n===screenIndex;
      el.classList.toggle('is-active',active);
      el.classList.toggle('show',active);
      if(el.classList.contains('screen')) el.style.display=active?'flex':'';
    });
    postHistory();
    return true;
  }
  function decorate(){
    if(!document.body||!document.head) return;
    var style=document.getElementById('bb-generic-editor-style');
    if(!style){ style=document.createElement('style'); style.id='bb-generic-editor-style'; style.textContent='.bb-generic-edit-on [data-bb-generic-hl]{outline:2px dashed rgba(236,72,153,.7);outline-offset:4px;cursor:pointer;-webkit-tap-highlight-color:rgba(236,72,153,.25);touch-action:manipulation}.bb-generic-edit-on [data-bb-generic-hl]:hover{outline-color:#fff;box-shadow:0 0 0 4px rgba(236,72,153,.35)}';document.head.appendChild(style); }
    document.body.classList.toggle('bb-generic-edit-on',enabled);
    var list=candidates();
    list.forEach(function(el){
      var key=keyFor(el); el.setAttribute('data-bb-generic-key',key); el.setAttribute('title','Edit '+labelFor(el));
      var leaf=!list.some(function(o){ return o!==el && el.contains(o); });
      if(leaf && enabled) el.setAttribute('data-bb-generic-hl','1'); else el.removeAttribute('data-bb-generic-hl');
    });
    if(enabled) snapshotAndMuteMedia(); else restoreMedia();
    discoverScreens();
    applyAll();
    if(enabled) postHistory();
  }
  function select(el){
    var k=keyFor(el), e=edits[k]||{}, value='';
    if(el.tagName==='IMG'||el.tagName==='VIDEO'||el.tagName==='AUDIO'||el.tagName==='IFRAME') value=el.getAttribute('src')||'';
    else value=(el.innerText||el.textContent||'').trim();
    parent.postMessage({type:'BB_ELEMENT_SELECTED',selection:{key:k,label:labelFor(el),value:value,kind:kind(el)}},'*');
  }
  function interactionTarget(target){ return target&&target.closest?target.closest('[data-bb-generic-key],[data-bb-editor-nav],[data-bb-ignore],.bb-inline-edit,.bb-edit-btn,.bb-editor-audio-control,.bb-editor-link-edit,#bb-global-edit-actions'):null; }
  function guardPointer(e){
    if(!enabled) return;
    var t=interactionTarget(e.target);
    if(t && t.matches('[data-bb-editor-nav],.bb-inline-edit,.bb-edit-btn,.bb-editor-audio-control,.bb-editor-link-edit,#bb-global-edit-actions')) return;
    if(t && t.matches('[data-bb-generic-key]')) { e.preventDefault(); if(e.type==='click') select(t); e.stopImmediatePropagation(); return; }
    if(t && t.matches('[data-bb-ignore]')) { e.preventDefault(); e.stopImmediatePropagation(); return; }
    e.preventDefault(); e.stopImmediatePropagation();
  }
  document.addEventListener('click',function(e){ if(!enabled) playPreviewAudio(); if(enabled && Date.now()-lastTap<700){ e.preventDefault(); e.stopImmediatePropagation(); return; } guardPointer(e); },true);
  document.addEventListener('pointerdown',function(e){ if(!enabled) playPreviewAudio(); guardPointer(e); },true);
  var tap=null, lastTap=0;
  document.addEventListener('touchstart',function(e){
    if(!enabled) return;
    var t=e.touches&&e.touches[0];
    tap=t?{x:t.clientX,y:t.clientY,target:e.target,time:Date.now()}:null;
    var nav=e.target&&e.target.closest?e.target.closest('[data-bb-editor-nav],.bb-inline-edit,.bb-edit-btn,.bb-editor-audio-control,.bb-editor-link-edit,#bb-global-edit-actions'):null;
    if(!nav) e.stopImmediatePropagation();
  },{capture:true,passive:true});
  document.addEventListener('touchend',function(e){
    if(!enabled) return;
    var nav=e.target&&e.target.closest?e.target.closest('[data-bb-editor-nav],.bb-inline-edit,.bb-edit-btn,.bb-editor-audio-control,.bb-editor-link-edit,#bb-global-edit-actions'):null;
    if(nav) return;
    var start=tap; tap=null;
    e.stopImmediatePropagation();
    var t=e.changedTouches&&e.changedTouches[0];
    if(!start||!t) return;
    if(Math.hypot(t.clientX-start.x,t.clientY-start.y)>12 || Date.now()-start.time>800) return;
    var el=interactionTarget(e.target);
    if(e.cancelable) e.preventDefault();
    if(el && el.matches('[data-bb-generic-key]')){ lastTap=Date.now(); select(el); }
  },{capture:true,passive:false});
  document.addEventListener('keydown',function(e){
    if(!enabled) return;
    if(e.key!=='Enter' && e.key!==' ') return;
    var t=interactionTarget(e.target);
    if(t && t.matches('[data-bb-editor-nav],.bb-inline-edit,.bb-edit-btn,.bb-editor-audio-control,.bb-editor-link-edit,#bb-global-edit-actions')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if(t && t.matches('[data-bb-generic-key]')) select(t);
  },true);
  window.BB_EDITOR_NAVIGATE=window.BB_EDITOR_NAVIGATE||function(delta){
    if(!enabled || !screens.length) return;
    showScreenAt(screenIndex+(delta<0?-1:1));
  };
  window.addEventListener('message',function(e){
    if(!e.data) return;
    if(e.data.type==='BB_EDITOR_MODE'){ enabled=!!e.data.enabled; decorate(); }
    if(e.data.type==='BB_GENERIC_EDITS'){ edits=e.data.edits&&typeof e.data.edits==='object'?e.data.edits:{}; decorate(); }
    if(e.data.type==='BB_CANVAS_HISTORY'){ if(typeof window.BB_EDITOR_NAVIGATE==='function') window.BB_EDITOR_NAVIGATE(e.data.direction==='back'?-1:1); }
  });
  observer=new MutationObserver(function(){ if(enabled){ discoverScreens(); decorate(); } });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  decorate();
})();
${editBadgeSnippet('[data-bb-generic-hl]', "document.body && document.body.classList.contains('bb-generic-edit-on')")}`;
  doc.body.appendChild(script);
}

export default function GenericEditableIframe({ title, src, srcDoc, content, editorMode = false, genericEdits = {}, minHeight = 720, background = '#0b0b0d', extraMessages = [], onElementSelect, onHistoryState }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [history, setHistory] = useState<{canBack?: boolean; canForward?: boolean; screen?: string}>({ canBack: false, canForward: false, screen: '' });

  const sendHistory = (direction: 'back' | 'forward') => {
    frameRef.current?.contentWindow?.postMessage({ type: 'BB_CANVAS_HISTORY', direction }, '*');
  };

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const post = () => {
      injectBridge(frame);
      frame.contentWindow?.postMessage({ type: 'BB_EDITOR_MODE', enabled: editorMode }, '*');
      frame.contentWindow?.postMessage({ type: 'BB_GENERIC_EDITS', edits: genericEdits || {} }, '*');
      (extraMessages || []).forEach((message) => frame.contentWindow?.postMessage(message, '*'));
    };
    const onLoad = () => post();
    frame.addEventListener('load', onLoad);
    post();
    return () => frame.removeEventListener('load', onLoad);
  }, [editorMode, genericEdits, extraMessages, src, srcDoc]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.source !== frameRef.current?.contentWindow || !event.data) return;
      if (event.data.type === 'BB_ELEMENT_SELECTED') onElementSelect?.(event.data.selection);
      if (event.data.type === 'BB_CANVAS_HISTORY_STATE') {
        const next = { canBack: !!event.data.canBack, canForward: !!event.data.canForward, screen: event.data.screen || '' };
        setHistory(next);
        onHistoryState?.(next);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onElementSelect, onHistoryState]);

  const showEditorNav = editorMode;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight, background }}>
      <iframe
        ref={frameRef}
        title={title}
        src={src}
        srcDoc={srcDoc}
        sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
        allow="autoplay; microphone; camera; fullscreen; picture-in-picture"
        style={{ width: '100%', height: '100%', minHeight, border: 0, display: 'block', background }}
      />
      {showEditorNav && (
        <div
          aria-label="Editor navigation"
          data-bb-editor-nav-overlay="1"
          style={{ position: 'absolute', left: '50%', bottom: 14, transform: 'translateX(-50%)', zIndex: 20, display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 16, background: 'rgba(18,18,24,.84)', border: '1px solid rgba(255,255,255,.18)', boxShadow: '0 10px 28px rgba(0,0,0,.24)', backdropFilter: 'blur(12px)' }}
        >
          <button type="button" onClick={() => sendHistory('back')} disabled={!history.canBack} style={{ border: 0, borderRadius: 10, padding: '9px 13px', fontWeight: 700, cursor: history.canBack ? 'pointer' : 'not-allowed', opacity: history.canBack ? 1 : .45 }}>← Previous</button>
          <span style={{ minWidth: 90, textAlign: 'center', color: 'rgba(255,255,255,.78)', fontSize: 12 }}>{history.screen || 'Editor'}</span>
          <button type="button" onClick={() => sendHistory('forward')} disabled={!history.canForward} style={{ border: 0, borderRadius: 10, padding: '9px 13px', fontWeight: 700, cursor: history.canForward ? 'pointer' : 'not-allowed', opacity: history.canForward ? 1 : .45 }}>Next →</button>
        </div>
      )}
    </div>
  );
}
