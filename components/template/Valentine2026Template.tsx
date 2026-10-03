'use client';

import React from 'react';
import GenericEditableIframe from './GenericEditableIframe';
import type { BirthdayContent } from '@/lib/types';

type Props = {
  content: BirthdayContent;
  editorMode?: boolean;
  onElementSelect?: (selection: { key:string; label:string; index?:number; value?:string; kind?:string })=>void;
  onHistoryState?: (state:{canBack?:boolean;canForward?:boolean;screen?:string})=>void;
};

export default function Valentine2026Template({ content, editorMode = false, onElementSelect, onHistoryState }: Props) {
  const src = React.useMemo(
    () => `/templates/valentine-2026/index.html${editorMode ? '?bbEdit=1' : ''}`,
    [editorMode],
  );
  const genericEdits = ((content.templateConfig || {}) as any).genericEdits || {};

  return (
    <GenericEditableIframe
      title="Valentine 2026"
      src={src}
      content={content}
      editorMode={editorMode}
      genericEdits={genericEdits}
      minHeight={760}
      background="#171418"
      onElementSelect={onElementSelect}
      onHistoryState={onHistoryState}
    />
  );
}
