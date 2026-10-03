'use client';

import { useEffect, useState } from 'react';

export const GUIDE_STORAGE_KEY = 'wishly_builder_guide_v1';

const STEPS = [
  { icon: '👆', title: 'Tap or click to edit', body: 'Every highlighted text, photo, video or button in the preview can be edited. On a computer click it, on a phone or tablet just tap it.' },
  { icon: '✏️', title: 'Change it in the edit box', body: 'After you select something, an edit box opens under the preview. Type your own words, replace photos or music, then press Done. The preview updates instantly.' },
  { icon: '↔️', title: 'Move with ← Previous / Next →', body: 'The two round arrow buttons on the preview move between the screens of your website. While editing, the template\'s own buttons are switched off so nothing jumps away.' },
  { icon: '▶️', title: 'Check it with Preview', body: 'Press Preview at the top to see your website exactly like your visitor will. Press it again to go back to editing.' },
  { icon: '🔗', title: 'Save and share', body: 'Your changes are saved automatically. When you are happy, press Create Live Link to publish and share your website.' },
];

export function readGuideSeen() {
  try { return window.localStorage.getItem(GUIDE_STORAGE_KEY) === '1'; } catch { return true; }
}
export function markGuideSeen() {
  try { window.localStorage.setItem(GUIDE_STORAGE_KEY, '1'); } catch {}
}

export default function BuilderGuide({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const last = step === STEPS.length - 1;
  const current = STEPS[step];

  const finish = () => { markGuideSeen(); onClose(); };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
      if (e.key === 'ArrowRight') setStep(s => Math.min(STEPS.length - 1, s + 1));
      if (e.key === 'ArrowLeft') setStep(s => Math.max(0, s - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bb-guide-backdrop" role="dialog" aria-modal="true" aria-label="How to edit your website">
      <div className="bb-guide-card">
        <button type="button" className="bb-guide-skip" onClick={finish}>Skip guide</button>
        <div className="bb-guide-icon" aria-hidden>{current.icon}</div>
        <span className="bb-guide-step">Step {step + 1} of {STEPS.length}</span>
        <h3>{current.title}</h3>
        <p>{current.body}</p>
        <div className="bb-guide-dots" aria-hidden>
          {STEPS.map((_, i) => <i key={i} className={i === step ? 'on' : ''} />)}
        </div>
        <div className="bb-guide-actions">
          <button type="button" className="bb-guide-back" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>Back</button>
          <button type="button" className="bb-guide-next" onClick={() => (last ? finish() : setStep(s => s + 1))}>{last ? 'Start editing ✨' : 'Next'}</button>
        </div>
      </div>
    </div>
  );
}
