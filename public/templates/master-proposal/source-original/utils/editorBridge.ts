// Lets the Studio (parent window) turn this iframe into a "click to edit"
// canvas. When the parent enables editor mode, every element carrying
// data-bb-key gets a hover outline; double-clicking one tells the parent
// which config field it represents (BB_ELEMENT_SELECTED) so the Studio can
// open the right editor for it. Opened directly (no parent, no postMessage),
// none of this activates and the page behaves exactly like the original.

export interface BBSelection {
  key: string;
  label: string;
  index?: number;
}

let editorModeOn = false;
let styleTag: HTMLStyleElement | null = null;

function ensureStyle() {
  if (styleTag) return;
  styleTag = document.createElement('style');
  styleTag.textContent = `
    body.bb-editor-mode [data-bb-key] { cursor: pointer; transition: outline-color .15s ease, background-color .15s ease; outline: 2px dashed transparent; outline-offset: 4px; border-radius: 6px; }
    body.bb-editor-mode [data-bb-key]:hover { outline-color: rgba(192,128,129,0.55); background-color: rgba(192,128,129,0.06); }
  `;
  document.head.appendChild(styleTag);
}

function findEditable(target: EventTarget | null): HTMLElement | null {
  let el = target as HTMLElement | null;
  while (el && el !== document.body) {
    if (el.dataset && el.dataset.bbKey) return el;
    el = el.parentElement;
  }
  return null;
}

function handleDoubleClick(e: MouseEvent) {
  if (!editorModeOn) return;
  const el = findEditable(e.target);
  if (!el) return;
  e.preventDefault();
  e.stopPropagation();
  const key = el.dataset.bbKey!;
  const label = el.dataset.bbLabel || key;
  const indexAttr = el.dataset.bbIndex;
  const selection: BBSelection = { key, label };
  if (indexAttr !== undefined) selection.index = Number(indexAttr);
  window.parent?.postMessage({ type: 'BB_ELEMENT_SELECTED', selection }, '*');
}

let initialized = false;
export function initEditorBridge() {
  if (initialized) return;
  initialized = true;
  window.addEventListener('message', (event) => {
    if (!event.data || event.data.type !== 'BB_EDITOR_MODE') return;
    editorModeOn = !!event.data.enabled;
    ensureStyle();
    document.body.classList.toggle('bb-editor-mode', editorModeOn);
  });
  document.addEventListener('dblclick', handleDoubleClick, true);
  // Let the parent know we're ready to receive BB_EDITOR_MODE even if it
  // sent it before our listener was attached.
  window.parent?.postMessage({ type: 'BB_EDITOR_READY' }, '*');
}
