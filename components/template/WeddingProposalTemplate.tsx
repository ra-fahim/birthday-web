'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import GenericEditableIframe from './GenericEditableIframe';
import { buildWeddingHtml } from './wedding-proposal-builder';
import type { BirthdayContent } from '@/lib/types';

type Props = { content: BirthdayContent; editorMode?: boolean; onElementSelect?: (selection: { key:string; label:string; index?:number; value?:string; kind?:string })=>void; onHistoryState?: (state:{canBack?:boolean;canForward?:boolean;screen?:string})=>void };

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

const NO_EDITS = {};

export default function WeddingProposalTemplate({ content, editorMode = false, onElementSelect, onHistoryState }: Props) {
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

  const latestContent = useRef<BirthdayContent>(content);
  latestContent.current = content;
  const html = useMemo(() => (source ? buildWeddingHtml(source, latestContent.current, editorMode) : ''), [source, editorMode]);

  const genericEdits = useMemo(
    () => ((content.templateConfig || {}) as any).genericEdits || NO_EDITS,
    [content.templateConfig],
  );
  const extraMessages = useMemo(
    () => [{ type: 'BB_CONTENT', content }, { type: 'BB_EDITOR_MODE', enabled: !!editorMode }],
    [content, editorMode],
  );

  if (!html) {
    return <div aria-label="Loading template" style={{ width: '100%', height: '100%', minHeight: 720, background: '#07000b' }} />;
  }

  return (
    <GenericEditableIframe
      title="Wedding Proposal template"
      srcDoc={html}
      content={content}
      editorMode={editorMode}
      genericEdits={genericEdits}
      extraMessages={extraMessages}
      minHeight={720}
      background="#07000b"
      onElementSelect={onElementSelect}
      onHistoryState={onHistoryState}
    />
  );
}
