'use client';

import React from 'react';
import GenericEditableIframe from './GenericEditableIframe';
import { mergeValentine } from '@/lib/valentine';
import type { BirthdayContent } from '@/lib/types';

type Props = {
  content: BirthdayContent;
  editorMode?: boolean;
  onElementSelect?: (selection: { key:string; label:string; index?:number; value?:string; kind?:string })=>void;
  onHistoryState?: (state:{canBack?:boolean;canForward?:boolean;screen?:string})=>void;
};

const NO_EDITS = {};

export default function Valentine2026Template({ content, editorMode = false, onElementSelect, onHistoryState }: Props) {
  // ?bbEdit=1 -> builder canvas (click to edit), ?bb=1 -> published site (renders the saved config).
  const src = React.useMemo(
    () => `/templates/valentine-2026/index.html?${editorMode ? 'bbEdit=1' : 'bb=1'}`,
    [editorMode],
  );
  const config = React.useMemo(() => mergeValentine(content), [content]);
  const extraMessages = React.useMemo(
    () => [{ type: 'BB_VALENTINE_CONFIG', config }, { type: 'BB_EDITOR_MODE', enabled: editorMode }],
    [config, editorMode],
  );

  return (
    <GenericEditableIframe
      title="Valentine 2026"
      src={src}
      content={content}
      editorMode={editorMode}
      genericEdits={NO_EDITS}
      extraMessages={extraMessages}
      minHeight={760}
      background="#171418"
      onElementSelect={onElementSelect}
      onHistoryState={onHistoryState}
    />
  );
}
