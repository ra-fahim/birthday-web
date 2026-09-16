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
  await animateSeedShrink(seed);
  await animateSeedMove(seed, footer);
  await animateTreeGrow(tree);
  await animateFlowerBloom(tree);
  tree.resetFallingBlooms();

  footer.draw();
  await animateTreeMove(staticCanvas);

  showLoveLetter();
  startHeartJumpAnimation(tree);
  startClock(CONFIG);
}

document.addEventListener("DOMContentLoaded", startApp);

window.addEventListener('message', function(e){
  if (!e.data || e.data.type !== 'BB_MISSYOU_CONFIG' || !window.__BB_APPLY_RUNTIME_CONFIG) return;
  window.__BB_APPLY_RUNTIME_CONFIG(e.data.config);
  try { initContent(CONFIG); applyBackgroundMusic(CONFIG); } catch (_) {}
});
