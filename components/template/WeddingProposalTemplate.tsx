'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BirthdayContent } from '@/lib/types';

type Props = { content: BirthdayContent };

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildHtml(source: string, content: BirthdayContent) {
  const receiver = content.name || 'You';
  const sender = content.profile?.displayName || content.relationship || 'Someone who loves you';
  const eyebrow = content.proposalEyebrow || 'A little something · made with love';
  const intro = content.proposalIntroText || 'I\'ve been holding onto a question for a while now.\nBut before I ask it… walk with me a little. 💫';
  const startButton = content.proposalStartButton || 'Begin ✦';
  const letter = content.proposalLetterText || content.letter?.join('\n') || content.message || '';
  const continueButton = content.proposalContinueButton || 'Continue ❤️';
  const questionTemplate = content.proposalQuestion || 'You are my greatest adventure, my safest home, and my one true love.\n      Will you make me the happiest person in the universe and marry me,\n      <span class="js-receiver"></span>?';
  const question = questionTemplate.replaceAll('{name}', `<span class="js-receiver">${escapeHtml(receiver)}</span>`);
  const yesButton = content.proposalYesButton || 'Yes, I will 💍';
  const noButton = content.proposalNoButton || 'No';

  let html = source;

  html = html.replace(/const RECEIVER_NAME = "[\\s\\S]*?";/, `const RECEIVER_NAME = ${JSON.stringify(receiver)};`);
  html = html.replace(/const SENDER_NAME\s*=\s*"[\\s\\S]*?";/, `const SENDER_NAME   = ${JSON.stringify(sender)};`);

  html = html.replace(/<p class="eyebrow">A little something · made with love<\/p>/, `<p class="eyebrow">${escapeHtml(eyebrow)}</p>`);
  html = html.replace(
    /<p class="sub">[\\s\\S]*?<\/p>/,
    `<p class="sub">${escapeHtml(intro).replaceAll('\n', '<br>')}</p>`,
  );
  html = html.replace(/<button class="btn btn-primary" id="startBtn">[\\s\\S]*?<\/button>/, `<button class="btn btn-primary" id="startBtn">${escapeHtml(startButton)}</button>`);
  html = html.replace(/const LETTER_TEXT =[\\s\\S]*?;\n\nlet typing/, `const LETTER_TEXT = ${JSON.stringify(letter)};\n\nlet typing`);
  html = html.replace(/<button class="btn btn-primary" id="continueBtn">[\\s\\S]*?<\/button>/, `<button class="btn btn-primary" id="continueBtn">${escapeHtml(continueButton)}</button>`);
  html = html.replace(/<h1>You are my greatest adventure,[\\s\\S]*?<\/h1>/, `<h1>${question}</h1>`);
  html = html.replace(/<button class="btn btn-primary" id="yesBtn">[\\s\\S]*?<\/button>/, `<button class="btn btn-primary" id="yesBtn">${escapeHtml(yesButton)}</button>`);
  html = html.replace(/<button class="btn btn-ghost" id="noBtn">[\\s\\S]*?<\/button>/, `<button class="btn btn-ghost" id="noBtn">${escapeHtml(noButton)}</button>`);

  return html;
}

export default function WeddingProposalTemplate({ content }: Props) {
  const [source, setSource] = useState('');

  const html = useMemo(() => (source ? buildHtml(source, content) : ''), [source, content]);

  useEffect(() => {
    let active = true;
    fetch('/templates/wedding-proposal-original.html', { cache: 'no-store' })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load wedding proposal template');
        return response.text();
      })
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

  if (!html) {
    return <div aria-label="Loading template" style={{ width: '100%', height: '100%', minHeight: 720, background: '#07000b' }} />;
  }

  return (
    <iframe
      title="Wedding Proposal template"
      srcDoc={html}
      sandbox="allow-scripts allow-same-origin"
      style={{ width: '100%', height: '100%', minHeight: 720, border: 0, display: 'block', background: '#07000b' }}
      referrerPolicy="no-referrer"
    />
  );
}
