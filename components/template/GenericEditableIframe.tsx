'use client';

import { useEffect, useRef } from 'react';
import type { BirthdayContent } from '@/lib/types';

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
  const doc = frame.contentDocument;
  if (!doc || doc.getElementById('bb-generic-editor-bridge')) return;
  const script = doc.createElement('script');
  script.id = 'bb-generic-editor-bridge';
  script.textContent = `
(function(){
  if(window.__BB_GENERIC_EDITOR__) return;
  window.__BB_GENERIC_EDITOR__ = true;
  var enabled=false, observer=null, edits={};
  var TEXT='h1,h2,h3,h4,h5,h6,p,span,button,a,label,li,blockquote,figcaption,small,strong,em,td,th,dt,dd';
  var MEDIA='img,video,audio,iframe';
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
  function decorate(){
    var style=document.getElementById('bb-generic-editor-style');
    if(!style){ style=document.createElement('style'); style.id='bb-generic-editor-style'; style.textContent='.bb-generic-edit-on [data-bb-generic-key]{outline:2px dashed transparent;outline-offset:4px;cursor:pointer}.bb-generic-edit-on [data-bb-generic-key]:hover{outline-color:rgba(255,255,255,.72)}';document.head.appendChild(style); }
    document.body.classList.toggle('bb-generic-edit-on',enabled);
    candidates().forEach(function(el){
      var key=keyFor(el); el.setAttribute('data-bb-generic-key',key); el.setAttribute('title','Edit '+labelFor(el));
    });
    applyAll();
  }
  function select(el){
    var k=keyFor(el), e=edits[k]||{}, value='';
    if(el.tagName==='IMG'||el.tagName==='VIDEO'||el.tagName==='AUDIO'||el.tagName==='IFRAME') value=el.getAttribute('src')||'';
    else value=(el.innerText||el.textContent||'').trim();
    parent.postMessage({type:'BB_ELEMENT_SELECTED',selection:{key:k,label:labelFor(el),value:value,kind:kind(el)}},'*');
  }
  document.addEventListener('click',function(e){
    if(!enabled) return;
    if(e.target && e.target.closest && e.target.closest('.bb-edit-btn,.bb-inline-edit,[data-bb-ignore]')) return;
    var el=e.target&&e.target.closest?e.target.closest('[data-bb-generic-key]'):null;
    if(!el) return;
    e.preventDefault(); e.stopPropagation();
    select(el);
  },true);
  window.addEventListener('message',function(e){
    if(!e.data) return;
    if(e.data.type==='BB_EDITOR_MODE'){ enabled=!!e.data.enabled; decorate(); }
    if(e.data.type==='BB_GENERIC_EDITS'){ edits=e.data.edits&&typeof e.data.edits==='object'?e.data.edits:{}; decorate(); }
  });
  observer=new MutationObserver(function(){ if(enabled){ decorate(); } });
  observer.observe(document.documentElement,{subtree:true,childList:true});
  decorate();
})();`;
  doc.body.appendChild(script);
}

export default function GenericEditableIframe({ title, src, srcDoc, content, editorMode = false, genericEdits = {}, minHeight = 720, background = '#0b0b0d', extraMessages = [], onElementSelect, onHistoryState }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);

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
      if (event.data.type === 'BB_CANVAS_HISTORY_STATE') onHistoryState?.(event.data);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onElementSelect, onHistoryState]);

  return (
    <iframe
      ref={frameRef}
      title={title}
      src={src}
      srcDoc={srcDoc}
      sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
      allow="autoplay; microphone; camera; fullscreen; picture-in-picture"
      style={{ width: '100%', height: '100%', minHeight, border: 0, display: 'block', background }}
    />
  );
}
