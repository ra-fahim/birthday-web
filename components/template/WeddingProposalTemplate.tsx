'use client';

import { useEffect, useMemo, useState } from 'react';
import type { BirthdayContent } from '@/lib/types';

export default function WeddingProposalTemplate({ content }: { content: BirthdayContent }) {
  const [screen, setScreen] = useState<'intro'|'letter'|'heart'|'proposal'|'finale'>('intro');
  const [taps, setTaps] = useState(0);
  const [noMoves, setNoMoves] = useState(0);
  const [muted, setMuted] = useState(true);
  const [burst, setBurst] = useState(0);
  const [replaying, setReplaying] = useState(false);

  const receiver = content.name || 'You';
  const sender = content.profile?.displayName || content.relationship || 'Someone who loves you';
  const letter = useMemo(() => content.proposalLetterText || content.letter?.join('\n') || content.message, [content]);
  const question = useMemo(() => (content.proposalQuestion || 'Will you make me the happiest person in the universe and marry me, {name}?').replaceAll('{name}', receiver), [content.proposalQuestion, receiver]);

  useEffect(() => {
    if (replaying) setTimeout(() => setReplaying(false), 50);
  }, [replaying]);

  const nextBurst = () => setBurst(v => v + 1);
  const start = () => { nextBurst(); setScreen('letter'); };
  const continueToHeart = () => { nextBurst(); setScreen('heart'); };
  const tapHeart = () => {
    const next = Math.min(5, taps + 1);
    setTaps(next);
    nextBurst();
    if (next >= 5) setTimeout(() => setScreen('proposal'), 550);
  };
  const moveNo = () => setNoMoves(v => Math.min(6, v + 1));
  const yes = () => { nextBurst(); setScreen('finale'); };
  const replay = () => { setTaps(0); setNoMoves(0); setScreen('intro'); setReplaying(true); };

  return (
    <div className={`wp-root ${replaying ? 'wp-replay' : ''}`} style={{ ['--wp-accent' as string]: content.primaryColor || '#ff2d55' }}>
      <div className="wp-aurora"><span className="wp-blob wp-b1"/><span className="wp-blob wp-b2"/><span className="wp-blob wp-b3"/></div>
      <div className="wp-grain"/>
      <button className={`wp-sound ${muted ? 'muted' : ''}`} onClick={() => setMuted(v => !v)} aria-label="Toggle sound">{muted ? '🔇' : '🔊'}</button>
      <div className="wp-burst-layer" key={burst}>{Array.from({length: 14}).map((_,i)=><span key={i} className="wp-particle" style={{ ['--i' as string]: i }}/>)}</div>

      {screen === 'intro' && <section className="wp-screen wp-show">
        <div className="wp-intro">
          <p className="wp-eyebrow">{content.proposalEyebrow}</p>
          <h1 className="wp-script">Hey <span>{receiver}</span></h1>
          <p className="wp-sub">{content.proposalIntroText}</p>
          <button className="wp-btn wp-primary" onClick={start}>{content.proposalStartButton}</button>
          <p className="wp-hint">🎧 Best experienced with sound on</p>
        </div>
      </section>}

      {screen === 'letter' && <section className="wp-screen wp-show">
        <div className="wp-card">
          <div className="wp-seal">💌</div>
          <p className="wp-letter">{letter}</p>
          <button className="wp-btn wp-primary" onClick={continueToHeart}>{content.proposalContinueButton}</button>
        </div>
      </section>}

      {screen === 'heart' && <section className="wp-screen wp-show">
        <div className="wp-tap-wrap">
          <h2 className="wp-tap-title">Tap to fill my heart with love</h2>
          <button className="wp-heart" onClick={tapHeart} aria-label={`Fill heart ${taps} of 5`}>
            <span className="wp-heart-fill" style={{ height: `${Math.max(8, taps * 20)}%` }}/><span className="wp-heart-shape">♥</span>
          </button>
          <p className="wp-tap-count"><b>{taps}</b> / 5</p>
        </div>
      </section>}

      {screen === 'proposal' && <section className="wp-screen wp-show">
        <div className="wp-card wp-proposal-card">
          <p className="wp-eyebrow">One last thing…</p>
          <h2>{question}</h2>
          <div className="wp-actions">
            <button className="wp-btn wp-primary" onClick={yes} style={{ transform: `scale(${1 + Math.min(noMoves * 0.06, .36)})` }}>{content.proposalYesButton}</button>
            {noMoves < 6 && <button className="wp-btn wp-ghost" onPointerEnter={moveNo} onClick={moveNo} style={{ transform: `scale(${Math.max(.48, 1 - noMoves * .08)}) translate(${noMoves * 18}px, ${noMoves * 8}px)` }}>{noMoves ? ['Are you sure?','Really sure?','Think again 🥺','Last chance…','You can’t catch me 😜','Okay… only Yes left 💘'][Math.min(noMoves-1,5)] : content.proposalNoButton}</button>}
          </div>
        </div>
      </section>}

      {screen === 'finale' && <section className="wp-screen wp-show">
        <div className="wp-finale">
          <h2 className="wp-final-title">I Love You,<br/><span>{receiver}</span> ❤️</h2>
          <p className="wp-final-sub">Yours forever, {sender}</p>
          <button className="wp-btn wp-ghost" onClick={replay}>Replay ↺</button>
        </div>
      </section>}
    </div>
  );
}
