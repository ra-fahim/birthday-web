'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BirthdayContent } from '@/lib/types';

type Props = { content: BirthdayContent; editorMode?: boolean; onElementSelect?: (selection: { key:string; label:string; index?:number; value?:string; kind?:string })=>void };

let sourcePromise: Promise<string> | null = null;

function loadSource() {
  if (!sourcePromise) {
    sourcePromise = fetch('/templates/wedding-proposal-original.html', { cache: 'force-cache' })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load wedding proposal template');
        return response.text();
      });
  }
  return sourcePromise;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

const bridge = "<script>(function(){var on=false,style=null;function setup(){if(style)return;style=document.createElement('style');style.textContent='.bb-edit-wrap{position:relative!important}.bb-edit-btn{position:absolute;top:6px;right:6px;z-index:99999;border:1px solid rgba(255,255,255,.35);background:rgba(15,15,20,.86);backdrop-filter:blur(10px);color:#fff;border-radius:999px;width:30px;height:30px;display:none;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(0,0,0,.25);cursor:pointer;font-size:13px}.bb-editor-mode [data-bb-key]:hover{outline:2px solid rgba(255,255,255,.55);outline-offset:4px}.bb-editor-mode [data-bb-key]:hover>.bb-edit-btn{display:flex}';document.head.appendChild(style)}function install(){setup();document.querySelectorAll('[data-bb-key]').forEach(function(el){if(el.querySelector(':scope>.bb-edit-btn'))return;el.classList.add('bb-edit-wrap');var b=document.createElement('span');b.className='bb-edit-btn';b.setAttribute('role','button');b.setAttribute('tabindex','0');b.textContent='\u270f';b.title='Edit '+(el.dataset.bbLabel||el.dataset.bbKey);b.onclick=function(e){e.preventDefault();e.stopPropagation();parent.postMessage({type:'BB_ELEMENT_SELECTED',selection:{key:el.dataset.bbKey,label:el.dataset.bbLabel||el.dataset.bbKey,value:(el.textContent||'').trim(),kind:el.tagName==='IMG'?'image':el.tagName==='VIDEO'?'video':'text'}},'*')};el.appendChild(b)})}window.addEventListener('message',function(e){if(e.data&&e.data.type==='BB_EDITOR_MODE'){on=!!e.data.enabled;setup();document.body.classList.toggle('bb-editor-mode',on);if(on)install()}});new MutationObserver(function(){if(on)install()}).observe(document.documentElement,{subtree:true,childList:true});})();</script>";

function buildHtml(source: string, content: BirthdayContent, editorMode = false) {
  const receiver = content.name || 'You';
  const sender = content.profile?.displayName || content.relationship || 'Someone who loves you';
  const eyebrow = content.proposalEyebrow || 'A little something · made with love';
  const intro = content.proposalIntroText || "I've been holding onto a question for a while now.\nBut before I ask it… walk with me a little. 💫";
  const startButton = content.proposalStartButton || 'Begin ✦';
  const letter = content.proposalLetterText || content.letter?.join('\n') || content.message || '';
  const continueButton = content.proposalContinueButton || 'Continue ❤️';
  const questionTemplate = content.proposalQuestion || 'You are my greatest adventure, my safest home, and my one true love.\n      Will you make me the happiest person in the universe and marry me,\n      <span class="js-receiver"></span>?';
  const question = questionTemplate.replaceAll('{name}', `<span class="js-receiver">${escapeHtml(receiver)}</span>`);
  const yesButton = content.proposalYesButton || 'Yes, I will 💍';
  const noButton = content.proposalNoButton || 'No';

  let html = source;
  html = html.replace(/const RECEIVER_NAME = "[\s\S]*?";/, `const RECEIVER_NAME = ${JSON.stringify(receiver)};`);
  html = html.replace(/const SENDER_NAME\s*=\s*"[\s\S]*?";/, `const SENDER_NAME   = ${JSON.stringify(sender)};`);
  html = html.replace(/<p class="eyebrow">A little something · made with love<\/p>/, `<p class="eyebrow" data-bb-key="proposalEyebrow" data-bb-label="Proposal eyebrow">${escapeHtml(eyebrow)}</p>`);
  html = html.replace(/<p class="sub">[\s\S]*?<\/p>/, `<p class="sub" data-bb-key="proposalIntroText" data-bb-label="Proposal intro">${escapeHtml(intro).replaceAll('\n', '<br>')}</p>`);
  html = html.replace(/<button class="btn btn-primary" id="startBtn">[\s\S]*?<\/button>/, `<button class="btn btn-primary" id="startBtn" data-bb-key="proposalStartButton" data-bb-label="Start button text">${escapeHtml(startButton)}</button>`);
  html = html.replace(/const LETTER_TEXT =[\s\S]*?;\n\nlet typing/, `const LETTER_TEXT = ${JSON.stringify(letter)};\n\nlet typing`);
  html = html.replace(/<button class="btn btn-primary" id="continueBtn">[\s\S]*?<\/button>/, `<button class="btn btn-primary" id="continueBtn" data-bb-key="proposalContinueButton" data-bb-label="Continue button text">${escapeHtml(continueButton)}</button>`);
  html = html.replace(/<h1>You are my greatest adventure,[\s\S]*?<\/h1>/, `<h1 data-bb-key="proposalQuestion" data-bb-label="Proposal question">${question}</h1>`);
  html = html.replace(/<button class="btn btn-primary" id="yesBtn">[\s\S]*?<\/button>/, `<button class="btn btn-primary" id="yesBtn" data-bb-key="proposalYesButton" data-bb-label="Yes button text">${escapeHtml(yesButton)}</button>`);
  html = html.replace(/<button class="btn btn-ghost" id="noBtn">[\s\S]*?<\/button>/, `<button class="btn btn-ghost" id="noBtn" data-bb-key="proposalNoButton" data-bb-label="No button text">${escapeHtml(noButton)}</button>`);
  if (editorMode) html = html.replace('</body>', bridge + '</body>');
  return html;
}

export default function WeddingProposalTemplate({ content, editorMode = false, onElementSelect }: Props) {
  const [source, setSource] = useState('');

  useEffect(() => {
    let active = true;
    loadSource()
      .then((text) => {
        if (active) setSource(text);
      })
      .catch(() => {
        if (active) setSource('');
      });
    return () => {
      active = false;
    };
  }, []);

  // Debounce preview rebuilds so editing a field does not restart the original animation on every keystroke.
  const [previewContent, setPreviewContent] = useState(content);
  useEffect(() => {
    const timer = window.setTimeout(() => setPreviewContent(content), 350);
    return () => window.clearTimeout(timer);
  }, [content]);


  useEffect(() => { const h=(event:MessageEvent)=>{ if(event.data?.type==='BB_ELEMENT_SELECTED') onElementSelect?.(event.data.selection); }; window.addEventListener('message',h); return()=>window.removeEventListener('message',h); }, [onElementSelect]);

  const html = useMemo(() => (source ? buildHtml(source, previewContent, editorMode) : ''), [source, previewContent, editorMode]);

  if (!html) {
    return <div aria-label="Loading template" style={{ width: '100%', height: '100%', minHeight: 720, background: '#07000b' }} />;
  }

  return (
    <iframe
      title="Wedding Proposal template"
      srcDoc={html}
      sandbox="allow-scripts allow-same-origin"
      loading="eager"
      style={{ width: '100%', height: '100%', minHeight: 720, border: 0, display: 'block', background: '#07000b' }}
      referrerPolicy="no-referrer"
    />
  );
}
