// ===========================
// Clock Display
// ===========================

function createClockDOM(config) {
  const clock = document.getElementById("clock");
  const cfg = config.time;
  const digits = {};
  clock.textContent = "";

  function addText(text) {
    clock.appendChild(document.createTextNode(text));
  }

  function addDigit(key) {
    const span = document.createElement("span");
    span.className = "digit";
    clock.appendChild(span);
    digits[key] = span;
    return span;
  }

  addText(cfg.prefix);
  addDigit("days");
  addText(` ${cfg.day} `);
  addDigit("hours");
  addText(` ${cfg.hour} `);
  addDigit("minutes");
  addText(` ${cfg.minute} `);
  addDigit("seconds");
  addText(` ${cfg.second}`);

  return digits;
}

function timeElapse(startMs, digits) {
  const secondsPerMinute = 60;
  const secondsPerHour = secondsPerMinute * 60;
  const secondsPerDay = secondsPerHour * 24;

  function twoDigits(value) {
    return String(value).padStart(2, "0");
  }

  const totalSeconds = Math.floor((Date.now() - startMs) / 1000);
  const todaySeconds = totalSeconds % secondsPerDay;
  const days = Math.floor(totalSeconds / secondsPerDay);

  const hours = Math.floor(todaySeconds / secondsPerHour);
  const minutes = Math.floor((todaySeconds % secondsPerHour) / secondsPerMinute);
  const seconds = todaySeconds % secondsPerMinute;

  digits.days.textContent = String(days);
  digits.hours.textContent = twoDigits(hours);
  digits.minutes.textContent = twoDigits(minutes);
  digits.seconds.textContent = twoDigits(seconds);
}

// ===========================
// Responsive Scaling
// ===========================

function scaleContent() {
  const viewport = document.getElementById("viewport");
  const main = document.getElementById("main");

  function resize() {
    let scale;
    if (isMobileLayout()) {
      // On phones the letter + countdown no longer live inside this stage
      // (see setupMobileLayout), so the tree/canvas art is just a
      // decorative strip — cap it to a portion of the viewport height
      // instead of trying to fit the whole 680px-tall stage on screen.
      const maxHeight = window.innerHeight * 0.44;
      scale = Math.min(
        window.innerWidth / StageConfig.width,
        maxHeight / StageConfig.height,
        1
      );
    } else {
      scale = Math.min(
        window.innerWidth / StageConfig.width,
        window.innerHeight / StageConfig.height,
        1
      );
    }
    viewport.style.width = `${StageConfig.width * scale}px`;
    viewport.style.height = `${StageConfig.height * scale}px`;
    main.style.transform = `scale(${scale})`;
  }

  resize();
  window.addEventListener("resize", resize);
}

// ===========================
// Mobile Layout Adaptation
// ===========================
// On narrow phones, scaling the whole 1100x680 stage down to fit the width
// shrinks the letter + countdown text far below a readable size. Instead,
// on phones we physically move #letter and #clock-box out of the scaled
// stage into #mobile-content, a normal below-the-fold block with its own
// always-legible, viewport-relative CSS (see styles.css). The tree/canvas
// art stays inside the stage as a compact decorative scene up top.

const MOBILE_BREAKPOINT = 700;

function isMobileLayout() {
  return window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches;
}

function setupMobileLayout() {
  if (!isMobileLayout()) return;

  const panel = document.getElementById("mobile-content");
  const letter = document.getElementById("letter");
  const clockBox = document.getElementById("clock-box");
  if (!panel || !letter || !clockBox) return;

  panel.appendChild(letter);
  panel.appendChild(clockBox);
  document.body.classList.add("mobile-layout");
}

// ===========================
// Content Initialization
// ===========================

function initContent(config) {
  const letter = document.getElementById("letter");
  letter.textContent = "";

  function addParagraph(lines) {
    lines.forEach(line => {
      const p = document.createElement("p");
      p.textContent = line;
      letter.appendChild(p);
    });
  }

  function createName(text) {
    const span = document.createElement("span");
    span.className = "name";
    span.textContent = text;
    return span;
  }

  const paragraphs = [
    config.letter.paragraph1,
    config.letter.paragraph2,
    config.letter.paragraph3
  ];
  paragraphs.forEach((lines, index) => {
    if (index > 0) letter.appendChild(document.createElement("br"));
    addParagraph(lines);
  });

  fitLetter(letter);

  const clockText = document.getElementById("clock-text");
  clockText.textContent = "";
  clockText.appendChild(createName(config.couple.name1));
  clockText.appendChild(document.createTextNode(` ${config.couple.connector} `));
  clockText.appendChild(createName(config.couple.name2));
  clockText.appendChild(document.createTextNode(` ${config.couple.together}`));
}

// ===========================
// Canvas Initialization
// ===========================

function initCanvas(id) {
  const canvas = document.getElementById(id);
  const { width: w, height: h } = StageConfig;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + "px";
  canvas.style.height = h + "px";
  canvas.getContext("2d").scale(dpr, dpr);
  return canvas;
}

// ===========================
// Letter Auto-Fit
// ===========================
// The letter block sits above the names + countdown. A long (or translated)
// letter used to overflow and collide with them, so the font is scaled down
// until the whole text fits inside the reserved area.

const LETTER_FIT = {
  maxFontSize: 16,
  minFontSize: 9,
  step: 0.5,
  lineHeight: 1.45
};

function fitLetter(letter) {
  if (!letter) return;

  // On phones the letter sits in the normal document flow with its own
  // clamp()-based CSS font size (see styles.css) and can never collide
  // with anything below it, so the fixed-stage shrink-to-fit logic below
  // — which is only meaningful for the absolutely-positioned desktop box
  // — is skipped entirely here.
  if (document.body.classList.contains("mobile-layout")) return;

  // Measure while laid out but invisible, then restore the original state.
  const prevDisplay = letter.style.display;
  const prevVisibility = letter.style.visibility;
  letter.style.display = "block";
  letter.style.visibility = "hidden";

  const available = letter.clientHeight || 470;

  let size = LETTER_FIT.maxFontSize;
  letter.style.lineHeight = String(LETTER_FIT.lineHeight);
  letter.style.fontSize = size + "px";

  while (letter.scrollHeight > available && size > LETTER_FIT.minFontSize) {
    size = Math.round((size - LETTER_FIT.step) * 10) / 10;
    letter.style.fontSize = size + "px";
  }

  // Very long letters: tighten the line spacing a little as a last resort.
  if (letter.scrollHeight > available) {
    letter.style.lineHeight = "1.2";
  }

  letter.style.visibility = prevVisibility;
  letter.style.display = prevDisplay || "none";
}

// ===========================
// Background Music
// ===========================
// The platform lets the owner upload one track; when they do, it replaces the
// bundled bgm.mp3. Playback still starts on the first click (seed tap).

function applyBackgroundMusic(config) {
  const bgm = document.getElementById("bgm");
  if (!bgm) return;

  const url = typeof config.musicUrl === "string" ? config.musicUrl.trim() : "";
  if (url) {
    bgm.textContent = "";
    bgm.src = url;
    bgm.load();
  }
  bgm.volume = 0.35;
}
