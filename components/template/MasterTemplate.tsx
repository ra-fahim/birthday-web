'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { BirthdayContent } from '@/lib/types';

type Props = {
  data?: { name?: string; age?: number; year?: number; month?: number; day?: number; hour?: number; minute?: number };
  content?: BirthdayContent;
  /** Demo/preview mode: countdown always ends 10 seconds after load, then behaves as normal. */
  demo?: boolean;
  websiteSlug?: string;
  recipientId?: string;
  editorMode?: boolean;
  onElementSelect?: (selection: { key: string; label: string; index?: number; value?: string; kind?: string }) => void;
  onHistoryState?: (state: { canBack?: boolean; canForward?: boolean; screen?: string }) => void;
};

function contentToData(content?: BirthdayContent) {
  if (!content) return {};
  const result: Props['data'] = { name: content.name };
  if (content.birthday) {
    const d = new Date(content.birthday);
    if (!Number.isNaN(d.getTime())) {
      result.year = d.getFullYear();
      result.month = d.getMonth();
      result.day = d.getDate();
      // Pass the exact selected date and time to the standalone HTML template.
      // The editor and the published page therefore share one countdown target.
      result.hour = d.getHours();
      result.minute = d.getMinutes();
    }
  }
  return result;
}

export default function MasterTemplate({ data, content, demo, websiteSlug, recipientId, editorMode = false, onElementSelect, onHistoryState }: Props) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const resolved = useMemo(() => ({ ...contentToData(content), ...data }), [content, data]);
  // Keep the iframe URL stable while editing so keystrokes and sidebar changes
  // update the live preview through postMessage instead of restarting the
  // template (which would replay its intro/animations on every change).
  const src = useMemo(() => {
    const p = new URLSearchParams();
    if (demo) p.set('demo', '1');
    if (recipientId) p.set('recipient', recipientId);
    const templatePath = editorMode ? '/master-template-editor.html' : '/master-template.html';
    return `${templatePath}${p.toString() ? `?${p.toString()}` : ''}`;
  }, [demo, recipientId, editorMode]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const send = () => {
      frame.contentWindow?.postMessage({ type: 'BB_CONTENT', content, websiteSlug: websiteSlug || '', recipientId: recipientId || '' }, '*');
      frame.contentWindow?.postMessage({ type: 'BB_EDITOR_MODE', enabled: !!editorMode }, '*');
    };
    frame.addEventListener('load', send);
    send();
    return () => frame.removeEventListener('load', send);
  }, [content, websiteSlug, recipientId, editorMode]);

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
      title="Birthday Master Template"
      src={src}
      className="h-full min-h-0 w-full border-0"
      allow="autoplay; microphone; camera; fullscreen"
      sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts" style={{ width: '100%', height: '100%', minHeight: 0, display: 'block', border: 0 }}
    />
  );
}

export { MasterTemplate };
