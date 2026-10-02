'use client';

import { useEffect, useMemo, useRef } from 'react';
import type { BirthdayContent } from '@/lib/types';
import { masterBirthdayDefaults, mergeMasterBirthdayConfig } from '@/lib/master-birthday';

type Selection = { key: string; label: string; index?: number; value?: string; kind?: string };
type Props = {
  content?: BirthdayContent;
  demo?: boolean;
  websiteSlug?: string;
  recipientId?: string;
  editorMode?: boolean;
  onElementSelect?: (selection: Selection) => void;
  onHistoryState?: (state: { canBack?: boolean; canForward?: boolean; screen?: string }) => void;
};

export default function MasterBirthdayTemplate({ content, demo = false, websiteSlug, recipientId, editorMode = false, onElementSelect, onHistoryState }: Props) {
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
    if (editorMode) { params.set('edit', '1'); params.set('bbEdit', '1'); }
    if (recipientId) params.set('recipient', recipientId);
    return `/templates/master-birthday/runtime.html${params.toString() ? `?${params.toString()}` : ''}`;
  }, [demo, editorMode, recipientId]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const send = () => {
      frame.contentWindow?.postMessage({ type: 'BB_CONTENT', content: resolvedContent, websiteSlug: websiteSlug || '', recipientId: recipientId || '' }, '*');
      frame.contentWindow?.postMessage({ type: 'BB_EDITOR_MODE', enabled: !!editorMode }, '*');
      frame.contentWindow?.postMessage({ type: 'BB_CANVAS_REQUEST_HISTORY_STATE' }, '*');
      if (demo) {
        frame.contentWindow?.postMessage({ type: 'BB_DEMO_MODE', enabled: true, muted: false }, '*');
        frame.contentWindow?.postMessage({ type: 'BB_DEMO_AUDIO_ENABLED', enabled: true }, '*');
      }
    };
    frame.addEventListener('load', send);
    send();
    return () => frame.removeEventListener('load', send);
  }, [resolvedContent, websiteSlug, recipientId, editorMode, demo]);

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

  return <iframe
    ref={frameRef}
    title="Master Birthday"
    src={src}
    className="h-full min-h-0 w-full border-0"
    allow="autoplay; microphone; fullscreen; picture-in-picture"
    sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
    style={{ width: '100%', height: '100%', minHeight: 0, display: 'block', border: 0 }}
  />;
}
