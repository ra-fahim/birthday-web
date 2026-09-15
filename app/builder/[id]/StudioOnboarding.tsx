'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, MousePointer2, PanelLeft, Rocket, Save, Sparkles, X } from 'lucide-react';

const STEPS = [
  {
    eyebrow: 'WELCOME TO WISHLY STUDIO',
    title: 'Make your template yours — without touching code.',
    body: 'You can edit the supplied template visually. Your HTML, CSS and JavaScript stay in place while your changes are saved as this website’s content.',
    icon: Sparkles,
  },
  {
    eyebrow: '01 · CHOOSE YOUR TEMPLATE',
    title: 'Start with the template that fits your moment.',
    body: 'Use Occasion and Experience to switch between the templates installed in your Studio. Each template can expose different editable controls.',
    icon: PanelLeft,
  },
  {
    eyebrow: '02 · EDIT ANYTHING EDITABLE',
    title: 'Edit from the canvas or the Studio menu.',
    body: 'Turn Canvas Edit ON, then use the ✏ edit icon or double-click an editable item. You can also open the matching section from the Studio menu.',
    icon: MousePointer2,
  },
  {
    eyebrow: '03 · MEDIA & SPECIAL FIELDS',
    title: 'Photos, videos, music and countdowns stay template-aware.',
    body: 'If the template contains them, you can replace media, add new items, edit captions and set dates/times such as a countdown. Only controls that fit the current template are shown.',
    icon: Check,
  },
  {
    eyebrow: '04 · SAVE BEFORE YOU PUBLISH',
    title: 'Draft first. Publish when you are ready.',
    body: 'Save draft keeps your work private to this website. Your changes do not become the public version until you choose Create Live Link / Publish.',
    icon: Save,
  },
  {
    eyebrow: '05 · SHARE THE LIVE LINK',
    title: 'One link shows the saved website.',
    body: 'After publishing, copy the live link and send it anywhere. People who open it will see the version you published for this website.',
    icon: Rocket,
  },
] as const;

const STORAGE_KEY = 'wishly:studio-onboarding-complete:v1';

export default function StudioOnboarding() {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      const completed = window.localStorage.getItem(STORAGE_KEY) === '1';
      setOpen(!completed);
    } catch {
      setOpen(true);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  const current = useMemo(() => STEPS[step], [step]);
  const Icon = current.icon;
  if (!ready || !open) return null;

  const finish = () => {
    try { window.localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setOpen(false);
  };

  const next = () => {
    if (step >= STEPS.length - 1) finish();
    else setStep(value => value + 1);
  };

  return (
    <div className="studio-onboarding-backdrop" role="dialog" aria-modal="true" aria-label="Studio introduction">
      <div className="studio-onboarding">
        <button className="studio-onboarding-close" type="button" onClick={finish} aria-label="Skip introduction"><X size={18} /></button>
        <div className="studio-onboarding-progress">
          <span>STUDIO GUIDE</span>
          <div>{STEPS.map((_, index) => <i key={index} className={index <= step ? 'active' : ''} />)}</div>
          <small>{step + 1}/{STEPS.length}</small>
        </div>
        <div className="studio-onboarding-icon"><Icon size={28} /></div>
        <div className="studio-onboarding-copy">
          <span>{current.eyebrow}</span>
          <h2>{current.title}</h2>
          <p>{current.body}</p>
        </div>
        {step === 0 && <div className="studio-onboarding-tip"><b>Good to know</b><span>You can skip this guide now and open the detailed “How to make a website” page anytime.</span></div>}
        <div className="studio-onboarding-actions">
          <button className="studio-onboarding-skip" type="button" onClick={finish}>Skip guide</button>
          <div className="studio-onboarding-nav">
            {step > 0 && <button type="button" className="studio-onboarding-back" onClick={() => setStep(value => value - 1)}><ChevronLeft size={16} /> Back</button>}
            <button type="button" className="studio-onboarding-next" onClick={next}>{step === STEPS.length - 1 ? 'Start creating' : 'Next'} <ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
