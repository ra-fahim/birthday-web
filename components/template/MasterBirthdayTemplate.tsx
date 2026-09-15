'use client';

import { useEffect, useRef } from 'react';
import type { BirthdayContent } from '@/lib/types';

type Props = {
  content: BirthdayContent; demo?: boolean; websiteSlug?: string; recipientId?: string; editorMode?: boolean;
  onElementSelect?: (selection:{key:string;label:string;index?:number;value?:string;kind?:string}) => void;
  onHistoryState?: (state:{canBack?:boolean;canForward?:boolean;screen?:string}) => void;
};

export default function MasterBirthdayTemplate({content,demo,websiteSlug,recipientId,editorMode=false,onElementSelect,onHistoryState}:Props){
  const ref=useRef<HTMLIFrameElement>(null);
  const src = editorMode ? '/master-birthday-editor.html' : '/master-birthday.html';
  useEffect(()=>{
    const f=ref.current; if(!f)return;
    const send=()=>{ try {
      f.contentWindow?.postMessage({type:'BB_CONTENT',content,websiteSlug:websiteSlug||'',recipientId:recipientId||''},'*');
      f.contentWindow?.postMessage({type:'BB_EDITOR_MODE',enabled:editorMode},'*');
      if(demo) f.contentWindow?.postMessage({type:'BB_DEMO_MODE',enabled:true},'*');
    } catch {} };
    f.addEventListener('load',send); send(); return()=>f.removeEventListener('load',send);
  },[content,websiteSlug,recipientId,editorMode,demo]);
  useEffect(()=>{
    const h=(e:MessageEvent)=>{ if(e.source!==ref.current?.contentWindow||!e.data)return;
      if(e.data.type==='BB_ELEMENT_SELECTED') onElementSelect?.(e.data.selection);
      if(e.data.type==='BB_CANVAS_HISTORY_STATE') onHistoryState?.(e.data);
    };
    window.addEventListener('message',h); return()=>window.removeEventListener('message',h);
  },[onElementSelect,onHistoryState]);
  return <iframe ref={ref} title="Master Birthday" src={`${src}?mb=1${demo?'&demo=1':''}`} className="h-full w-full min-h-0 border-0" allow="autoplay;microphone;camera;fullscreen" sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"/>;
}
