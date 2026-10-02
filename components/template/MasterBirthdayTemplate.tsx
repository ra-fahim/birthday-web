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

  // The editor canvas must remain a live clock even if the embedded runtime
  // is briefly between state updates. Keep the DOM display synchronized from
  // the authoritative React config while editing. Preview/Demo/live runtime
  // behavior is left to the iframe so their existing simulation/audio flows
  // are not changed.
  useEffect(() => {
    if (!editorMode || preview) return;
    const frame = frameRef.current;
    if (!frame) return;

    const toZonedDate = (date: string, time: string, timeZone: string) => {
      const [y, m, d] = String(date || '').split('-').map(Number);
      const [hh, mm] = String(time || '00:00').split(':').map(Number);
      if (![y, m, d, hh, mm].every(Number.isFinite)) return new Date(NaN);
      let guess = new Date(Date.UTC(y, m - 1, d, hh, mm, 0));
      try {
        const fmt = new Intl.DateTimeFormat('en-US', {
          timeZone: timeZone || 'Asia/Dhaka',
          year: 'numeric', month: '2-digit', day: '2-digit',
          hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
        });
        const desired = Date.UTC(y, m - 1, d, hh, mm, 0);
        for (let i = 0; i < 3; i += 1) {
          const parts = Object.fromEntries(fmt.formatToParts(guess).filter(part => part.type !== 'literal').map(part => [part.type, part.value]));
          const seen = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), Number(parts.hour), Number(parts.minute), Number(parts.second));
          guess = new Date(guess.getTime() + (desired - seen));
        }
      } catch {
        return new Date(`${date}T${time || '00:00'}:00`);
      }
      return guess;
    };

    const getCycleTarget = () => {
      const cfg = (resolvedContent.templateConfig as any)?.masterBirthday || {};
      const baseDate = String(cfg.birthdayDate || '').slice(0, 10);
      const time = String(cfg.birthdayTime || '00:00');
      const zone = String(cfg.timezone || 'Asia/Dhaka');
      const baseYear = Number(baseDate.slice(0, 4));
      const monthDay = baseDate.slice(5, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(baseDate) || !/^\d+$/.test(String(baseYear)) || !monthDay) return new Date(NaN);
      let year = baseYear;
      let target = toZonedDate(`${year}-${monthDay}`, time, zone);
      const now = new Date();
      const greetingEnd = () => new Date(target.getTime() + 24 * 60 * 60 * 1000);
      while (now >= greetingEnd()) {
        year += 1;
        target = toZonedDate(`${year}-${monthDay}`, time, zone);
      }
      return target;
    };

    const syncEditorClock = () => {
      const doc = frame.contentDocument;
      if (!doc) return;
      const target = getCycleTarget();
      if (Number.isNaN(target.getTime())) return;
      const now = new Date();
      const diff = Math.max(0, target.getTime() - now.getTime());
      const total = Math.ceil(diff / 1000);
      const days = Math.floor(total / 86400);
      const hours = Math.floor((total / 3600) % 24);
      const mins = Math.floor((total / 60) % 60);
      const secs = total % 60;
      const set = (id: string, value: number) => {
        const node = doc.getElementById(id);
        if (node) node.textContent = String(value).padStart(2, '0');
      };
      set('days', days);
      set('hours', hours);
      set('mins', mins);
      set('secs', secs);

      // When the real birthday is active, keep the editor canvas on the
      // greeting screen instead of displaying a misleading 00:00:00:00.
      const greeting = doc.getElementById('greetingScreen');
      const countdown = doc.getElementById('countdownScreen');
      const inGreeting = now >= target && now < new Date(target.getTime() + 86400000);
      if (inGreeting) {
        greeting?.classList.add('show');
        countdown?.classList.add('hide');
      } else {
        greeting?.classList.remove('show');
        countdown?.classList.remove('hide');
      }
    };

    frame.addEventListener('load', syncEditorClock);
    syncEditorClock();
    const timer = window.setInterval(syncEditorClock, 250);
    return () => {
      frame.removeEventListener('load', syncEditorClock);
      window.clearInterval(timer);
    };
  }, [resolvedContent, editorMode, preview]);

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
