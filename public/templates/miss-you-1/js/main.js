// ===========================
// Show Letter & Start Clock
// ===========================

function showLoveLetter() {
  const letter = document.getElementById("letter");
  const clockBox = document.getElementById("clock-box");
  typewriter(letter);
  clockBox.classList.add("clock-box--visible");
}

function startClock(config) {
  const startMs = new Date(config.memorialDate).getTime();
  const digits = createClockDOM(config);
  timeElapse(startMs, digits);
  if (window.__BB_CLOCK_INTERVAL) clearInterval(window.__BB_CLOCK_INTERVAL);
  window.__BB_CLOCK_INTERVAL = setInterval(() => timeElapse(startMs, digits), AnimationConfig.TIME_UPDATE_INTERVAL);
}

// ===========================
// Main Initialization
// ===========================

async function startApp() {
  setupMobileLayout();
  initContent(CONFIG);
  applyBackgroundMusic(CONFIG);

  const staticCanvas = initCanvas("static-canvas");
  const groundCanvas = initCanvas("ground-canvas");
  const dynamicCanvas = initCanvas("canvas");

  const tree = new Tree(
    staticCanvas,
    dynamicCanvas,
    groundCanvas,
    StageConfig.width,
    StageConfig.height,
    TreeShape,
    CONFIG
  );
  const { seed, footer } = tree;

  scaleContent();

  seed.draw();

  await waitForUserClick(seed, dynamicCanvas);

  // Reveal the letter + countdown exactly once, however we get here.
  let revealed = false;
  function revealOnce() {
    if (revealed) return;
    revealed = true;
    showLoveLetter();
    startHeartJumpAnimation(tree);
    startClock(CONFIG);
  }

  // Safety net: the love letter and countdown used to be gated entirely
  // behind this decorative tree-growth/bloom animation finishing. On
  // slower hardware (most phones, versus the desktop this was designed
  // and tested on) or if any single animation step stalls or throws,
  // that chain could take far longer than expected — or never finish —
  // leaving the visitor staring at a tree with a blank page below it
  // and no way to ever see the actual message. Give it a few seconds;
  // if it hasn't finished by then, reveal the letter and countdown
  // anyway. The tree animation is purely decorative and can keep
  // catching up in the background either way.
  const revealTimeout = setTimeout(revealOnce, 6000);

  try {
    await animateSeedShrink(seed);
    await animateSeedMove(seed, footer);
    await animateTreeGrow(tree);
    await animateFlowerBloom(tree);
    tree.resetFallingBlooms();

    footer.draw();
    await animateTreeMove(staticCanvas);
  } catch (e) {
    // Ignore — the safety net above (or the call below) still reveals
    // the letter even if a decorative animation step failed.
  }

  clearTimeout(revealTimeout);
  revealOnce();
}

document.addEventListener("DOMContentLoaded", startApp);

window.addEventListener('message', function(e){
  if (!e.data || e.data.type !== 'BB_MISSYOU_CONFIG' || !window.__BB_APPLY_RUNTIME_CONFIG) return;
  window.__BB_APPLY_RUNTIME_CONFIG(e.data.config);
  try { initContent(CONFIG); applyBackgroundMusic(CONFIG); } catch (_) {}
});
