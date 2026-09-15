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

window.__BB_APPLY_RUNTIME_CONFIG = function(next) {
  if (!next || typeof next !== 'object') return;
  if (next.name1 !== undefined) CONFIG.couple.name1 = String(next.name1);
  if (next.name2 !== undefined) CONFIG.couple.name2 = String(next.name2);
  if (next.connector !== undefined) CONFIG.couple.connector = String(next.connector);
  if (next.together !== undefined) CONFIG.couple.together = String(next.together);
  if (next.memorialDate !== undefined) CONFIG.memorialDate = String(next.memorialDate);
  if (Array.isArray(next.paragraph1)) CONFIG.letter.paragraph1 = next.paragraph1;
  if (Array.isArray(next.paragraph2)) CONFIG.letter.paragraph2 = next.paragraph2;
  if (Array.isArray(next.paragraph3)) CONFIG.letter.paragraph3 = next.paragraph3;
  if (next.timePrefix !== undefined) CONFIG.time.prefix = String(next.timePrefix);
  if (next.dayLabel !== undefined) CONFIG.time.day = String(next.dayLabel);
  if (next.hourLabel !== undefined) CONFIG.time.hour = String(next.hourLabel);
  if (next.minuteLabel !== undefined) CONFIG.time.minute = String(next.minuteLabel);
  if (next.secondLabel !== undefined) CONFIG.time.second = String(next.secondLabel);
  if (next.seedText !== undefined) CONFIG.seedText = String(next.seedText);
  if (next.musicUrl !== undefined) CONFIG.musicUrl = String(next.musicUrl);
};
