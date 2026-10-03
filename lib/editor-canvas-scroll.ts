/**
 * Editor-only helper: template canvases are full-screen "apps" whose pages often
 * use overflow:hidden. When a screen has more content than fits in the editor
 * canvas (small laptop / phone), the cut-off part could not be reached.
 * This lets the page inside the preview iframe scroll while editing.
 * It touches only the editor preview, never the published website.
 */
const STYLE_ID = 'bb-editor-scroll-enable';
const CSS = 'html.bb-countdown-lock,body.bb-countdown-lock{overflow-y:auto!important;overflow-x:hidden!important}html{overflow-y:auto!important;overflow-x:hidden!important;-webkit-overflow-scrolling:touch}body{overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior-y:contain}';

function patch(frame: HTMLIFrameElement) {
  let doc: Document | null = null;
  try { doc = frame.contentDocument; } catch { return; }
  if (!doc || !doc.head || doc.getElementById(STYLE_ID)) return;
  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  doc.head.appendChild(style);
}

export function enableCanvasScroll(root: ParentNode = document): () => void {
  const bound = new WeakSet<HTMLIFrameElement>();
  const bind = (frame: HTMLIFrameElement) => {
    if (bound.has(frame)) return;
    bound.add(frame);
    frame.addEventListener('load', () => patch(frame));
    patch(frame);
  };
  const scan = () => root.querySelectorAll<HTMLIFrameElement>('.builder-canvas-stage iframe').forEach(bind);
  scan();
  const mo = new MutationObserver(scan);
  const stage = root.querySelector('.builder-canvas-stage');
  mo.observe(stage || (root as Node), { childList: true, subtree: true });
  // late-loading documents (srcDoc / slow network): re-check for a short while
  const t = window.setInterval(() => root.querySelectorAll<HTMLIFrameElement>('.builder-canvas-stage iframe').forEach(patch), 700);
  const stop = window.setTimeout(() => window.clearInterval(t), 8000);
  return () => { mo.disconnect(); window.clearInterval(t); window.clearTimeout(stop); };
}
