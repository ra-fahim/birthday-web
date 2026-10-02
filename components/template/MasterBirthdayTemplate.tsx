'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { BirthdayContent } from '@/lib/types';
import { masterBirthdayDefaults, mergeMasterBirthdayConfig } from '@/lib/master-birthday';

type Selection = { key: string; label: string; index?: number; value?: string; kind?: string };
type Props = {
  content?: BirthdayContent;
  demo?: boolean;
  preview?: boolean;
  websiteSlug?: string;
  siteKey?: string;
  recipientId?: string;
  editorMode?: boolean;
  standalone?: boolean;
  onElementSelect?: (selection: Selection) => void;
  onHistoryState?: (state: { canBack?: boolean; canForward?: boolean; screen?: string }) => void;
};

export default function MasterBirthdayTemplate({ content, demo = false, preview = false, websiteSlug, siteKey, recipientId, editorMode = false, standalone = false, onElementSelect, onHistoryState }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const config = useMemo(() => mergeMasterBirthdayConfig(content?.templateConfig && typeof content.templateConfig === 'object' ? (content.templateConfig as any).masterBirthday : undefined), [content?.templateConfig]);
  const resolvedContent = useMemo(() => ({
    ...content,
    name: config.recipientName || content?.name || masterBirthdayDefaults.recipientName,
    birthday: `${config.birthdayDate}T${config.birthdayTime}`,
    recipientName: config.recipientName,
    age: config.age,
    birthdayDate: config.birthdayDate,
    birthdayTime: config.birthdayTime,
    templateConfig: { ...(content?.templateConfig || {}), masterBirthday: config },
  }), [content, config]);
  const src = useMemo(() => {
    const params = new URLSearchParams();
    if (demo) { params.set('demo', '1'); params.set('bbDemo', '1'); }
    if (preview) { params.set('preview', '1'); params.set('bbPreview', '1'); }
    if (editorMode) { params.set('edit', '1'); params.set('bbEdit', '1'); }
    if (recipientId) params.set('recipient', recipientId);
    return `/templates/master-birthday/runtime.html${params.toString() ? `?${params.toString()}` : ''}`;
  }, [demo, preview, editorMode, recipientId]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const send = () => {
      frame.contentWindow?.postMessage({ type: 'BB_CONTENT', content: resolvedContent, websiteSlug: websiteSlug || '', siteKey: siteKey || websiteSlug || '', recipientId: recipientId || '' }, '*');
      frame.contentWindow?.postMessage({ type: 'BB_EDITOR_MODE', enabled: !!editorMode }, '*');
      frame.contentWindow?.postMessage({ type: 'BB_PREVIEW_MODE', enabled: !!preview }, '*');
      frame.contentWindow?.postMessage({ type: 'BB_CANVAS_REQUEST_HISTORY_STATE' }, '*');
      if (demo) {
        frame.contentWindow?.postMessage({ type: 'BB_DEMO_MODE', enabled: true, muted: false }, '*');
        frame.contentWindow?.postMessage({ type: 'BB_DEMO_AUDIO_ENABLED', enabled: true }, '*');
      }
    };
    frame.addEventListener('load', send);
    send();
    return () => frame.removeEventListener('load', send);
  }, [resolvedContent, websiteSlug, siteKey, recipientId, editorMode, demo, preview]);

  // Keep the countdown authoritative from the builder/live host. The embedded runtime
  // also has a ticker, but it is locked while this host is mounted so stale 00:00:00:00
  // values can never overwrite the current date/time. Demo/catalog previews are left to
  // the template runtime because they intentionally use their own 10-second simulation.
  useEffect(() => {
    if (demo) return;
    const frame = frameRef.current;
    if (!frame) return;

    const targetFromConfig = () => {
      const cfg = config;
      const date = String(cfg.birthdayDate || '').slice(0, 10);
      const time = String(cfg.birthdayTime || '00:00');
      const zone = String(cfg.timezone || 'Asia/Dhaka');
      const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      if (!m) return new Date(NaN);

      let year = Number(m[1]);
      const makeTarget = (y: number) => {
        const [hh, mm] = time.split(':').map(Number);
        let guess = new Date(Date.UTC(y, Number(m[2]) - 1, Number(m[3]), Number.isFinite(hh) ? hh : 0, Number.isFinite(mm) ? mm : 0, 0));
        try {
          const fmt = new Intl.DateTimeFormat('en-US', {
            timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
          });
          const desired = Date.UTC(y, Number(m[2]) - 1, Number(m[3]), Number.isFinite(hh) ? hh : 0, Number.isFinite(mm) ? mm : 0, 0);
          for (let i = 0; i < 4; i += 1) {
            const parts = Object.fromEntries(fmt.formatToParts(guess).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
            const seen = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
            guess = new Date(guess.getTime() + (desired - seen));
          }
        } catch {
          return new Date(`${y}-${m[2]}-${m[3]}T${time}:00`);
        }
        return guess;
      };

      let target = makeTarget(year);
      const now = new Date();
      while (now.getTime() >= target.getTime() + 86400000) {
        year += 1;
        target = makeTarget(year);
      }
      return target;
    };

    let previousView: 'countdown' | 'greeting' | null = null;
    let previewEndsAt: number | null = null;
    const active = () => {
      const doc = frame.contentDocument;
      return doc?.readyState === 'loading' ? null : doc;
    };
    const show = (view: 'countdown' | 'greeting') => {
      const win = frame.contentWindow as any;
      if (view === previousView) return;
      previousView = view;
      try {
        win?.showScreen?.(view);
      } catch {
        const doc = active();
        if (!doc) return;
        const countdown = doc.getElementById('countdownScreen');
        const greeting = doc.getElementById('greetingScreen');
        if (view === 'greeting') {
          countdown?.classList.add('hide');
          greeting?.classList.add('show');
        } else {
          countdown?.classList.remove('hide');
          greeting?.classList.remove('show');
        }
      }
      if (view === 'greeting') {
        try { if (typeof win?.typeGreeting === 'function') win.typeGreeting(); } catch {}
        try { if (typeof win?.playBirthdayAudio === 'function') win.playBirthdayAudio(); } catch {}
      }
    };

    const setClock = (doc: Document, totalSeconds: number) => {
      const total = Math.max(0, Math.ceil(totalSeconds));
      const values = {
        days: Math.floor(total / 86400),
        hours: Math.floor((total / 3600) % 24),
        mins: Math.floor((total / 60) % 60),
        secs: total % 60,
      };
      (Object.entries(values) as Array<[string, number]>).forEach(([id, value]) => {
        const el = doc.getElementById(id);
        if (el) el.textContent = String(value).padStart(2, '0');
      });
    };

    const sync = () => {
      const doc = active();
      if (!doc) return;
      const now = Date.now();
      const target = targetFromConfig();
      if (!Number.isFinite(target.getTime())) return;

      // Prevent the iframe runtime ticker from writing stale zeros over our clock.
      try { if (frame.contentWindow) (frame.contentWindow as any).__BB_PARENT_CLOCK_LOCK = true; } catch {}

      if (preview) {
        const inGreetingWindow = now >= target.getTime() && now < target.getTime() + 86400000;
        if (inGreetingWindow) {
          previewEndsAt = null;
          show('greeting');
        } else {
          if (previewEndsAt == null) previewEndsAt = now + 10000;
          const left = Math.max(0, previewEndsAt - now);
          setClock(doc, left / 1000);
          if (left <= 0) show('greeting'); else show('countdown');
          if (left > 0 && left <= 10000 && config.countdown.audioEnabled) {
            const audio = doc.getElementById('countdownAudio') as HTMLAudioElement | null;
            if (audio) { audio.muted = false; audio.play().catch(() => {}); }
          }
        }
        return;
      }

      if (editorMode) {
        // Editing always begins on Countdown. The configured/default date changes the
        // numbers live, but editor navigation—not the clock—controls the active screen.
        const activeId = (doc.querySelector('.show') as HTMLElement | null)?.id;
        if (!activeId || activeId === 'countdownScreen') {
          setClock(doc, (target.getTime() - now) / 1000);
          previousView = 'countdown';
        }
        return;
      }

      // Published live site: the target helper already advances beyond a completed
      // 24-hour greeting window to the next annual occurrence.
      const cycleTarget = target;
      const inGreetingWindow = now >= cycleTarget.getTime() && now < cycleTarget.getTime() + 86400000;
      if (inGreetingWindow) show('greeting');
      else {
        const left = Math.max(0, cycleTarget.getTime() - now);
        setClock(doc, left / 1000);
        show('countdown');
        if (left > 0 && left <= 10000 && config.countdown.audioEnabled) {
          const audio = doc.getElementById('countdownAudio') as HTMLAudioElement | null;
          if (audio) { audio.muted = false; audio.play().catch(() => {}); }
        }
      }
    };

    const onLoad = () => {
      previousView = null;
      previewEndsAt = null;
      try { if (frame.contentWindow) (frame.contentWindow as any).__BB_PARENT_CLOCK_LOCK = true; } catch {}
      sync();
    };
    frame.addEventListener('load', onLoad);
    sync();
    const timer = window.setInterval(sync, 250);
    return () => {
      frame.removeEventListener('load', onLoad);
      window.clearInterval(timer);
      try { if (frame.contentWindow) (frame.contentWindow as any).__BB_PARENT_CLOCK_LOCK = false; } catch {}
    };
  }, [config, demo, editorMode, preview]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const frame = frameRef.current;
      if (!frame || event.source !== frame.contentWindow || !event.data) return;
      if (event.data.type === 'BB_ELEMENT_SELECTED') onElementSelect?.(event.data.selection);
      if (event.data.type === 'BB_CANVAS_HISTORY_STATE') onHistoryState?.(event.data);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onElementSelect, onHistoryState]);

  return <div style={{ width: '100%', height: '100%', minHeight: standalone ? '100vh' : 0, position: 'relative' }}>
  <iframe
    ref={frameRef}
    title="Master Birthday"
    src={src}
    className="h-full min-h-0 w-full border-0"
    allow="autoplay; microphone; fullscreen; picture-in-picture"
    sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
    style={{ width: '100%', height: '100%', minHeight: standalone ? '100vh' : 0, display: 'block', border: 0 }}
  />
  </div>;
}
