/* ==========================================
   Configuration
   ========================================== */
const __runtime = (() => {
  try {
    const raw = new URLSearchParams(window.location.search).get("config");
    return raw ? JSON.parse(decodeURIComponent(raw)) : {};
  } catch (_) {
    return {};
  }
})();

const CONFIG = {
  couple: {
    name1: typeof __runtime.name1 === "string" && __runtime.name1 ? __runtime.name1 : "Anarkoli",
    name2: typeof __runtime.name2 === "string" && __runtime.name2 ? __runtime.name2 : "Selim",
    connector: typeof __runtime.connector === "string" ? __runtime.connector : "and",
    together: typeof __runtime.together === "string" ? __runtime.together : "together"
  },
  memorialDate: typeof __runtime.memorialDate === "string" && __runtime.memorialDate ? __runtime.memorialDate : "2017-12-25T00:00:00",
  letter: {
    paragraph1: Array.isArray(__runtime.paragraph1) ? __runtime.paragraph1 : [
      "Someday when I am old, I will still be as deeply in love with you as ever,",
      "sending you messages from my desk,",
      "the lamp glowing softly, wind and rain beyond the window,",
      "taking half a day to brew a single 'I miss you',",
      "in the wilderness of my heart,",
      "now meteors chase the moon, now ten thousand horses gallop."
    ],
    paragraph2: Array.isArray(__runtime.paragraph2) ? __runtime.paragraph2 : [
      "Sometimes when the moon is out,",
      "I dream a winding dream with nine turns and eighteen bends,",
      "every corner has something to do with you,",
      "you smile at me once,",
      "and I spend the whole day dazed after waking."
    ],
    paragraph3: Array.isArray(__runtime.paragraph3) ? __runtime.paragraph3 : [
      "Now I am in a night full of stars,",
      "red beans hang heavy on the branches by the steps,",
      "only after being drunk do you know how strong the wine is,",
      "nothing can match this longing."
    ]
  },
  time: {
    prefix: typeof __runtime.timePrefix === "string" ? __runtime.timePrefix : "Day ",
    day: typeof __runtime.dayLabel === "string" ? __runtime.dayLabel : " days",
    hour: typeof __runtime.hourLabel === "string" ? __runtime.hourLabel : " hours",
    minute: typeof __runtime.minuteLabel === "string" ? __runtime.minuteLabel : " minutes",
    second: typeof __runtime.secondLabel === "string" ? __runtime.secondLabel : " seconds"
  },
  seedText: typeof __runtime.seedText === "string" && __runtime.seedText ? __runtime.seedText : "Miss You",
  musicUrl: typeof __runtime.musicUrl === "string" ? __runtime.musicUrl : ""
};

/* ==========================================
   Main Application
   ========================================== */
(function () {
  'use strict';

  const STAGE_W = 1100;
  const STAGE_H = 680;
  const rand = (min, max) => Math.random() * (max - min) + min;

  const viewport     = document.getElementById('viewport');
  const main         = document.getElementById('main');
  const groundCanvas = document.getElementById('ground-canvas');
  const staticCanvas = document.getElementById('static-canvas');
  const canvas       = document.getElementById('canvas');
  const letterEl     = document.getElementById('letter');
  const clockBox     = document.getElementById('clock-box');
  const clockText    = document.getElementById('clock-text');
  const clockEl      = document.getElementById('clock');
  const bgm          = document.getElementById('bgm');
  const startScreen  = document.getElementById('start-screen');
  const startTextEl  = document.getElementById('start-text');

  const groundCtx = groundCanvas.getContext('2d');
  const staticCtx = staticCanvas.getContext('2d');
  const ctx       = canvas.getContext('2d');

  function setupCanvas(c, context) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width  = STAGE_W * dpr;
    c.height = STAGE_H * dpr;
    c.style.width  = STAGE_W + 'px';
    c.style.height = STAGE_H + 'px';
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  setupCanvas(groundCanvas, groundCtx);
  setupCanvas(staticCanvas, staticCtx);
  setupCanvas(canvas, ctx);

  function scaleStage() {
    const scale = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H, 1);
    main.style.transform = `scale(${scale})`;
    viewport.style.width  = STAGE_W * scale + 'px';
    viewport.style.height = STAGE_H * scale + 'px';
  }
  window.addEventListener('resize', scaleStage);
  scaleStage();

  function initMusic() {
    if (!bgm) return;
    bgm.volume = 0.35;
    bgm.play().catch(() => {});
  }

  function initFloatingHearts(count = 14) {
    const container = document.getElementById('floating-hearts');
    if (!container) return;
    const heartSVG = (size, color) => `
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>`;
    const colors = ['#ff6b9d', '#ffb3d1', '#ffd700', '#ff85a2', '#e8a0bf'];
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      const size = 12 + Math.random() * 20;
      heart.innerHTML = heartSVG(size, colors[i % colors.length]);
      heart.style.left = Math.random() * 100 + '%';
      heart.style.animationDuration = (10 + Math.random() * 12) + 's';
      heart.style.animationDelay    = (Math.random() * 12) + 's';
      container.appendChild(heart);
    }
  }

  function burstHearts(x, y) {
    for (let i = 0; i < 14; i++) {
      const el = document.createElement('div');
      el.className = 'burst-heart';
      el.innerHTML = `<svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
      const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const dist = 120 + Math.random() * 180;
      el.style.left = x + 'px';
      el.style.top  = y + 'px';
      el.style.setProperty('--bx', Math.cos(angle) * dist + 'px');
      el.style.setProperty('--by', Math.sin(angle) * dist + 'px');
      el.style.color = ['#ff6b9d', '#ffd700', '#ffb3d1', '#ff85a2'][i % 4];
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1200);
    }
  }

  function drawGround() {
    const g = groundCtx;
    const groundY = STAGE_H - 80;
    g.clearRect(0, 0, STAGE_W, STAGE_H);

    const groundGrad = g.createLinearGradient(0, groundY, 0, STAGE_H);
    groundGrad.addColorStop(0, 'rgba(74, 44, 109, 0.35)');
    groundGrad.addColorStop(1, 'rgba(45, 27, 78, 0.75)');
    g.fillStyle = groundGrad;
    g.beginPath();
    g.moveTo(0, groundY);
    for (let x = 0; x <= STAGE_W; x += 20) {
      const y = groundY + Math.sin(x * 0.01) * 6;
      g.lineTo(x, y);
    }
    g.lineTo(STAGE_W, STAGE_H);
    g.lineTo(0, STAGE_H);
    g.closePath();
    g.fill();

    g.strokeStyle = 'rgba(255, 107, 157, 0.35)';
    g.lineWidth = 1.5;
    g.shadowBlur = 12;
    g.shadowColor = 'rgba(255, 107, 157, 0.6)';
    g.beginPath();
    for (let x = 0; x <= STAGE_W; x += 20) {
      const y = groundY + Math.sin(x * 0.01) * 6;
      if (x === 0) g.moveTo(x, y);
      else g.lineTo(x, y);
    }
    g.stroke();
    g.shadowBlur = 0;
  }

  /* ==========================================
     TREE — Full Cherry Blossom (matches screenshot)
     ========================================== */
  const TREE_BASE_X = 550;
  const TREE_BASE_Y = STAGE_H - 60;

  const BRANCH_DURATION = 380;
  const LEAF_DURATION   = 600;

  // Leaf palette — pinks, peaches, oranges, soft yellows
  const LEAF_COLORS = [
    '#ffb3d1', '#ffcce0', '#ffd1dc', '#ffb8d1', '#ffa8c8',
    '#ff9ec4', '#ff85a2', '#ff7a9a', '#ff95b3', '#ffc2d6',
    '#ffcc99', '#ffb366', '#ffc78a', '#ffd6a3', '#ffad80',
    '#ff9980', '#ffa88c', '#ffb89a', '#ffbfa0',
    '#ffe066', '#ffd966', '#ffcf5c', '#ffda75'
  ];

  const BRANCH_COLORS = {
    trunk: 'rgba(150, 110, 175, 0.95)',
    mid:   'rgba(180, 140, 205, 0.9)',
    tip:   'rgba(210, 170, 225, 0.85)'
  };

  let treeBranches = [];
  let treeLeaves   = [];
  let treeMaxTime  = 0;

  function pickLeafColor() {
    return LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
  }

  function buildTreeStructure() {
    treeBranches = [];
    treeLeaves   = [];

    function growBranch(x, y, len, angle, width, depth, delay) {
      if (depth <= 0) return;

      const endX = x + Math.cos(angle) * len;
      const endY = y + Math.sin(angle) * len;

      treeBranches.push({
        x1: x, y1: y, x2: endX, y2: endY,
        width, depth, delay
      });

      // === Dense leaf clusters on outer branches ===
      if (depth <= 3) {
        let clusterSize, spreadRadius;
        if (depth === 1)      { clusterSize = 26; spreadRadius = 42; }
        else if (depth === 2) { clusterSize = 16; spreadRadius = 28; }
        else                  { clusterSize = 9;  spreadRadius = 18; }

        for (let i = 0; i < clusterSize; i++) {
          const a = Math.random() * Math.PI * 2;
          const d = Math.sqrt(Math.random()) * spreadRadius;
          treeLeaves.push({
            x: endX + Math.cos(a) * d,
            y: endY + Math.sin(a) * d,
            size: rand(2.5, 6.5),
            color: pickLeafColor(),
            delay: delay + 100 + Math.random() * 350
          });
        }
      }

      const nextDelay = delay + 190;
      const spread    = 0.42 + Math.random() * 0.14;
      const shrink    = 0.73;
      const nextDepth = depth - 1;
      const nextWidth = width * 0.68;

      // Two main branches
      growBranch(endX, endY, len * shrink, angle - spread, nextWidth, nextDepth, nextDelay);
      growBranch(endX, endY, len * shrink, angle + spread, nextWidth, nextDepth, nextDelay);

      // Extra branches for fuller canopy
      if (depth > 5 && Math.random() > 0.35) {
        growBranch(endX, endY, len * shrink * 0.9,
          angle + (Math.random() - 0.5) * 0.6,
          nextWidth * 0.85, nextDepth, nextDelay);
      }
      if (depth > 6 && Math.random() > 0.55) {
        growBranch(endX, endY, len * shrink * 0.82,
          angle + (Math.random() - 0.5) * 0.9,
          nextWidth * 0.7, nextDepth - 1, nextDelay);
      }
    }

    // Big trunk, deep recursion for a lush canopy
    growBranch(TREE_BASE_X, TREE_BASE_Y, 120, -Math.PI / 2, 26, 10, 0);

    // Compute total duration
    treeMaxTime = 0;
    for (const b of treeBranches) {
      const t = b.delay + BRANCH_DURATION;
      if (t > treeMaxTime) treeMaxTime = t;
    }
    for (const l of treeLeaves) {
      const t = l.delay + LEAF_DURATION;
      if (t > treeMaxTime) treeMaxTime = t;
    }
  }

  function getBranchColor(depth) {
    if (depth >= 7) return BRANCH_COLORS.trunk;
    if (depth >= 4) return BRANCH_COLORS.mid;
    return BRANCH_COLORS.tip;
  }

  function drawTreeAtTime(elapsed) {
    staticCtx.clearRect(0, 0, STAGE_W, STAGE_H);

    // Pink glow behind tree canopy
    const baseGrad = staticCtx.createRadialGradient(
      TREE_BASE_X, TREE_BASE_Y - 260, 0,
      TREE_BASE_X, TREE_BASE_Y - 260, 380
    );
    baseGrad.addColorStop(0, 'rgba(255, 140, 180, 0.18)');
    baseGrad.addColorStop(1, 'rgba(255, 140, 180, 0)');
    staticCtx.fillStyle = baseGrad;
    staticCtx.fillRect(0, 0, STAGE_W, STAGE_H);

    // Base glow at trunk
    const trunkGlow = staticCtx.createRadialGradient(
      TREE_BASE_X, TREE_BASE_Y, 0,
      TREE_BASE_X, TREE_BASE_Y, 140
    );
    trunkGlow.addColorStop(0, 'rgba(255, 107, 157, 0.28)');
    trunkGlow.addColorStop(1, 'rgba(255, 107, 157, 0)');
    staticCtx.fillStyle = trunkGlow;
    staticCtx.fillRect(TREE_BASE_X - 140, TREE_BASE_Y - 140, 280, 280);

    // ===== Branches =====
    staticCtx.lineCap = 'round';
    staticCtx.lineJoin = 'round';
    for (const b of treeBranches) {
      if (elapsed < b.delay) continue;
      const p = Math.min((elapsed - b.delay) / BRANCH_DURATION, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const ex = b.x1 + (b.x2 - b.x1) * eased;
      const ey = b.y1 + (b.y2 - b.y1) * eased;

      staticCtx.strokeStyle = getBranchColor(b.depth);
      staticCtx.lineWidth   = Math.max(b.width, 0.8);
      staticCtx.shadowBlur  = b.depth > 5 ? 3 : 6;
      staticCtx.shadowColor = 'rgba(255, 160, 200, 0.4)';

      staticCtx.beginPath();
      staticCtx.moveTo(b.x1, b.y1);
      staticCtx.lineTo(ex, ey);
      staticCtx.stroke();
    }
    staticCtx.shadowBlur = 0;

    // ===== Leaves =====
    for (const l of treeLeaves) {
      if (elapsed < l.delay) continue;
      const p = Math.min((elapsed - l.delay) / LEAF_DURATION, 1);
      const eased = p < 0.6 ? 1.15 * p / 0.6 : 1.15 - 0.15 * ((p - 0.6) / 0.4);
      const size = l.size * Math.max(eased, 0);
      const alpha = Math.min(p * 1.5, 1);

      staticCtx.globalAlpha = alpha;
      staticCtx.fillStyle = l.color;
      staticCtx.shadowBlur = 5;
      staticCtx.shadowColor = l.color;
      staticCtx.beginPath();
      staticCtx.arc(l.x, l.y, size, 0, Math.PI * 2);
      staticCtx.fill();
    }
    staticCtx.globalAlpha = 1;
    staticCtx.shadowBlur = 0;
  }

  /* ==========================================
     Falling Hearts
     ========================================== */
  const canvasHearts = [];

  function spawnCanvasHeart() {
    canvasHearts.push({
      x: TREE_BASE_X + rand(-320, 320),
      y: TREE_BASE_Y - rand(120, 480),
      size: rand(5, 13),
      speedY: rand(0.35, 1.1),
      speedX: rand(-0.3, 0.3),
      angle: rand(0, Math.PI * 2),
      rotSpeed: rand(-0.02, 0.02),
      opacity: rand(0.55, 1),
      color: ['#ff6b9d', '#ffb3d1', '#ffd700', '#ff85a2', '#ffcc99'][Math.floor(Math.random() * 5)]
    });
  }

  function drawHeartOnCanvas(g, x, y, size, angle, color, opacity) {
    g.save();
    g.translate(x, y);
    g.rotate(angle);
    g.globalAlpha = opacity;
    g.fillStyle = color;
    g.shadowBlur = 12;
    g.shadowColor = color;

    const s = size / 16;
    g.beginPath();
    g.moveTo(0, -4 * s);
    g.bezierCurveTo(-8 * s, -14 * s, -16 * s, -2 * s, 0, 10 * s);
    g.bezierCurveTo(16 * s, -2 * s, 8 * s, -14 * s, 0, -4 * s);
    g.closePath();
    g.fill();
    g.restore();
  }

  function updateAndDrawHearts() {
    ctx.clearRect(0, 0, STAGE_W, STAGE_H);
    if (Math.random() < 0.06 && canvasHearts.length < 50) spawnCanvasHeart();

    for (let i = canvasHearts.length - 1; i >= 0; i--) {
      const h = canvasHearts[i];
      h.y += h.speedY;
      h.x += h.speedX + Math.sin(h.y * 0.02) * 0.3;
      h.angle += h.rotSpeed;
      drawHeartOnCanvas(ctx, h.x, h.y, h.size, h.angle, h.color, h.opacity);
      if (h.y > STAGE_H + 20) canvasHearts.splice(i, 1);
    }
  }

  function typeWriterLetter(onDone) {
    letterEl.style.display = 'block';
    letterEl.classList.add('letter--visible');
    letterEl.innerHTML = '';

    const lines = [
      ...CONFIG.letter.paragraph1, '',
      ...CONFIG.letter.paragraph2, '',
      ...CONFIG.letter.paragraph3
    ];

    let lineIdx = 0, charIdx = 0, currentDiv = null;

    function type() {
      if (lineIdx >= lines.length) {
        if (currentDiv) {
          const cursor = currentDiv.querySelector('.typewriter-cursor');
          if (cursor) cursor.classList.add('typewriter-cursor--done');
        }
        if (typeof onDone === 'function') onDone();
        return;
      }
      const line = lines[lineIdx];

      if (charIdx === 0) {
        currentDiv = document.createElement('div');
        currentDiv.style.marginBottom = line === '' ? '10px' : '2px';
        currentDiv.style.minHeight = '1em';
        letterEl.appendChild(currentDiv);
      }

      if (charIdx < line.length) {
        currentDiv.textContent = line.slice(0, charIdx + 1);
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        cursor.textContent = '|';
        currentDiv.appendChild(cursor);
        charIdx++;
        setTimeout(type, 45);
      } else {
        const cursor = currentDiv.querySelector('.typewriter-cursor');
        if (cursor) cursor.remove();
        lineIdx++;
        charIdx = 0;
        setTimeout(type, line === '' ? 200 : 380);
      }
    }
    type();
  }

  function startClock() {
    const startDate = new Date(CONFIG.memorialDate);

    function update() {
      const now = new Date();
      let diff = now - startDate;
      if (diff < 0) diff = 0;

      const totalSec = Math.floor(diff / 1000);
      const days    = Math.floor(totalSec / 86400);
      const hours   = Math.floor((totalSec % 86400) / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      clockText.innerHTML = `
        <span class="name">${CONFIG.couple.name1}</span>
        <span class="connector">${CONFIG.couple.connector}</span>
        <span class="name">${CONFIG.couple.name2}</span>
        <span style="margin-left:10px">${CONFIG.couple.together}</span>
      `;
      clockEl.innerHTML = `
        <span class="digit">${days}</span><span class="unit">${CONFIG.time.day}</span>
        <span class="digit">${hours}</span><span class="unit">${CONFIG.time.hour}</span>
        <span class="digit">${minutes}</span><span class="unit">${CONFIG.time.minute}</span>
        <span class="digit">${seconds}</span><span class="unit">${CONFIG.time.second}</span>
      `;
    }
    update();
    setInterval(update, 1000);
  }

  function initParallax() {
    const stars = document.querySelector('.bg-stars');
    if (!stars) return;
    let ticking = false;
    document.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        stars.style.transform = `translate(${x}px, ${y}px)`;
        ticking = false;
      });
    });
  }

  function animate() {
    updateAndDrawHearts();
    requestAnimationFrame(animate);
  }

  function startExperience() {
    startScreen.classList.add('hidden');
    initMusic();
    drawGround();
    buildTreeStructure();
    const treeStart = performance.now();

    function growTree(now) {
      const elapsed = now - treeStart;
      drawTreeAtTime(elapsed);

      if (elapsed < treeMaxTime + 150) {
        requestAnimationFrame(growTree);
      } else {
        drawTreeAtTime(treeMaxTime + 150);
        setTimeout(() => {
          typeWriterLetter(() => {
            setTimeout(() => {
              clockBox.classList.add('clock-box--visible');
              staticCanvas.classList.add('shifted');
            }, 500);
          });
        }, 500);
      }
    }
    requestAnimationFrame(growTree);

    for (let i = 0; i < 12; i++) spawnCanvasHeart();
  }

  function init() {
    if (startTextEl && CONFIG.seedText) {
      startTextEl.textContent = CONFIG.seedText;
    }
    initFloatingHearts(12);
    initParallax();
    animate();

    let started = false;
    const handleStart = (e) => {
      if (started) return;
      started = true;
      const x = (e && e.clientX) || window.innerWidth / 2;
      const y = (e && e.clientY) || window.innerHeight / 2;
      burstHearts(x, y);
      startExperience();
      startClock();
      startScreen.removeEventListener('click', handleStart);
      startScreen.removeEventListener('touchstart', handleStart);
      startScreen.removeEventListener('keydown', handleStart);
    };

    startScreen.addEventListener('click', handleStart);
    startScreen.addEventListener('touchstart', handleStart, { passive: true });
    startScreen.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') handleStart(e);
    });

    console.log('%c💕 Love Letter ready — click the heart', 'color:#ff6b9d;font-size:14px;font-weight:bold;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();