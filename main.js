"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// ----- Configuration -----
var CONFIG = {
  SHEETS_URL: 'https://script.google.com/macros/s/AKfycbxT4jpPNG6hTDbmpeo6utlOwHLPTrxBna_YjcG0yLNI9pO5hcI7yIJcTwgesvocSYSG4A/exec',
  IMAGE_1: 'images/description1.jpg',
  IMAGE_2: 'images/description2.jpg',
  ASLCT_ACCESS_CODE: 'DVCWHNABJ',
  EEG_CALENDLY_URL: 'https://calendly.com/action-brain-lab-gallaudet/spatial-cognition-eeg-only',
  SUPPORT_EMAIL: 'action.brain.lab@gallaudet.edu',
  CLOUDINARY_CLOUD_NAME: 'dll2sorkn',
  CLOUDINARY_UPLOAD_PRESET: 'study_videos',
  CLOUDINARY_FOLDER: 'spatial-cognition-videos'
};
var CODE_REGEX = /^\d{6}$/; // six digits from Qualtrics code

document.querySelectorAll('.support-email').forEach(function (el) {
  el.textContent = CONFIG.SUPPORT_EMAIL;
  if (el.tagName === 'A') el.href = "mailto:".concat(CONFIG.SUPPORT_EMAIL);
});
document.querySelectorAll('.button.skip').forEach(function (btn) {
  btn.title = "Please try the task first or email ".concat(CONFIG.SUPPORT_EMAIL, " for help");
});

// ----- Tasks -----
var TASKS = {
  'RC': {
    name: 'Reading Comprehension Task',
    description: 'Read passages and answer questions',
    type: 'embed',
    embedUrl: 'https://melodyfschwenk.github.io/readingcomp/',
    canSkip: true,
    estMinutes: 15,
    requirements: 'None',
    skilled: true
  },
  'MRT': {
    name: 'Mental Rotation Task',
    description: 'Decide if two images are the same or not',
    type: 'embed',
    embedUrl: 'https://melodyfschwenk.github.io/mrt/',
    canSkip: true,
    estMinutes: 6,
    requirements: 'Keyboard recommended',
    skilled: true
  },
  'ASLCT': {
    name: 'ASL Comprehension Test',
    description: 'For ASL users only',
    url: 'https://vl2portal.gallaudet.edu/assessment/',
    type: 'external',
    canSkip: true,
    estMinutes: 15,
    requirements: 'ASL users; stable connection',
    skilled: true
  },
  'VCN': {
    name: 'Virtual Campus Navigation',
    description: 'Virtual SILC Test of Navigation (SILCton)',
    url: 'http://www.virtualsilcton.com/study/753798747',
    type: 'external',
    canSkip: true,
    estMinutes: 20,
    requirements: 'Desktop/laptop; keyboard (WASD) & mouse',
    skilled: true
  },
  'SN': {
    name: 'Spatial Navigation',
    description: 'Choose the first step from the player to the stop sign (embedded below)',
    type: 'embed',
    embedUrl: 'https://melodyfschwenk.github.io/spatial-navigation-web/',
    canSkip: true,
    estMinutes: 8,
    requirements: 'Arrow keys',
    skilled: true
  },
  'ID': {
    name: 'Image Description',
    description: 'Record two short videos describing images (or upload if recording is unavailable).',
    type: 'recording',
    canSkip: true,
    estMinutes: 2,
    requirements: 'Camera & microphone or video upload'
  },
  'DEMO': {
    name: 'Demographics Survey',
    description: 'Background information & payment',
    url: 'https://gallaudet.iad1.qualtrics.com/jfe/form/SV_8GJcoF3hkHoP8BU',
    type: 'external',
    estMinutes: 6,
    requirements: 'None'
  }
};
// Add this after TASKS definition
function getStandardTaskName(taskCode) {
  var mapping = {
    'RC': 'Reading Comprehension Task',
    'MRT': 'Mental Rotation Task',
    'ASLCT': 'ASL Comprehension Test',
    'VCN': 'Virtual Campus Navigation',
    'SN': 'Spatial Navigation',
    'ID': 'Image Description',
    'DEMO': 'Demographics Survey'
  };
  return mapping[taskCode] || (TASKS[taskCode] ? TASKS[taskCode].name : undefined) || taskCode;
}

// ----- Consents -----
var CONSENTS = {
  'CONSENT1': {
    name: 'Research Consent',
    url: 'https://gallaudet.iad1.qualtrics.com/jfe/form/SV_cGZEQDXQpUbGq1g'
  },
  'CONSENT2': {
    name: 'Video Consent',
    url: 'https://gallaudet.iad1.qualtrics.com/jfe/form/SV_5j0XhME387Kii8u'
  }
};

// ----- Task sequencing -----
var DESKTOP_TASKS = ['RC', 'MRT', 'ASLCT', 'VCN', 'SN', 'ID'];
var MOBILE_TASKS = ['RC', 'MRT', 'ASLCT', 'SN', 'ID'];
function mulberry32(a) {
  return function () {
    a |= 0;
    a = a + 0x6D2B79F5 | 0;
    var t = Math.imul(a ^ a >>> 15, 1 | a);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function shuffleWithSeed(array, seed) {
  var rng = mulberry32(seed);
  var a = array.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(rng() * (i + 1));
    var _ref = [a[j], a[i]];
    a[i] = _ref[0];
    a[j] = _ref[1];
  }
  return a;
}
function ensureDemographicsLast(sequence) {
  var filtered = (sequence || []).filter(function (code) {
    return code !== 'DEMO';
  });
  filtered.push('DEMO');
  return filtered;
}

// Detect if mobile/tablet
function isMobileDevice() {
  var hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  var mobileUA = /Android|webOS|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent);
  var isSmallScreen = window.innerWidth <= 1024;
  return hasTouch && (mobileUA || isSmallScreen);
}
function tryMailto() {
  var addr = CONFIG.SUPPORT_EMAIL;
  var subject = encodeURIComponent('[EEG Add-On] Scheduling — Session ' + (state.sessionCode || ''));
  var body = encodeURIComponent("Hi Action Brain Lab,\n\nI'd like to schedule the optional EEG visit.\n\nPreferred dates/times:\nCommunication preference (ASL or English):\n\nThanks!\nSession code: ".concat(state.sessionCode || ''));
  window.location.href = "mailto:".concat(addr, "?subject=").concat(subject, "&body=").concat(body);
}
function copyEmail(btn) {
  var addr = CONFIG.SUPPORT_EMAIL;
  navigator.clipboard.writeText(addr).then(function () {
    if (btn) {
      var t = btn.textContent;
      btn.textContent = '✅ Copied!';
      setTimeout(function () {
        return btn.textContent = t;
      }, 1500);
    }
  });
}
function closeEEGModal() {
  var m = document.getElementById('eeg-modal');
  if (m) m.classList.remove('active');
}
// ----- State -----
var state = {
  sessionCode: '',
  participantID: '',
  email: '',
  hearingStatus: '',
  fluency: '',
  sequenceIndex: -1,
  sequence: [],
  currentTaskIndex: 0,
  completedTasks: [],
  skippedTasks: [],
  startTime: null,
  totalTimeSpent: 0,
  totalActiveTime: 0,
  lastActivity: null,
  currentTaskType: '',
  externalDepart: null,
  heartbeatInterval: null,
  heartbeatMisses: 0,
  externalNotified: false,
  pauseStart: null,
  totalPausedTime: 0,
  lastPauseType: null,
  consentStatus: {
    consent1: false,
    consent2: false,
    videoDeclined: false
  },
  // ⬇️ ADD THIS INSIDE THE STATE OBJECT
  consentVerify: {
    consent1: {
      verified: false,
      method: null,
      note: ''
    },
    consent2: {
      verified: false,
      method: null,
      note: ''
    }
  },
  recording: {
    active: false,
    mediaRecorder: null,
    chunks: [],
    currentImage: 0,
    recordings: [],
    stream: null,
    currentBlob: null,
    isVideoMode: true
  },
  uploadQueue: [],
  processingUpload: false
};

// Reusable activity timer for tasks and session tracking
function createTimer() {
  return {
    startTime: null,
    endTime: null,
    activeTime: 0,
    lastActivity: 0,
    isPaused: false,
    pauseReason: null,
    pauseCount: 0,
    inactivityTime: 0,
    pausedTime: 0,
    pauseStart: null,
    lastTick: 0,
    intervalId: null,
    externalTime: 0,
    onInactivity: null,
    start: function start() {
      var _this = this;
      this.startTime = Date.now();
      this.lastActivity = Date.now();
      this.lastTick = Date.now();
      this.activeTime = 0;
      this.inactivityTime = 0;
      this.pausedTime = 0;
      this.pauseCount = 0;
      this.isPaused = false;
      this.pauseStart = null;
      this.intervalId = setInterval(function () {
        return _this.tick();
      }, 1000);
    },
    tick: function tick() {
      var now = Date.now();
      if (!document.hidden && !this.isPaused) {
        var timeSinceLastActivity = now - this.lastActivity;
        var timeSinceTick = now - this.lastTick;
        if (timeSinceLastActivity > 120000) {
          this.pause('inactivity');
          if (this.onInactivity) this.onInactivity();
        } else if (timeSinceLastActivity < 5000) {
          this.activeTime += timeSinceTick;
        } else {
          this.inactivityTime += timeSinceTick;
        }
      } else if (this.isPaused && this.pauseReason === 'inactivity') {
        this.inactivityTime += now - this.lastTick;
      }
      this.lastTick = now;
    },
    recordActivity: function recordActivity() {
      this.lastActivity = Date.now();
      if (this.isPaused && this.pauseReason === 'inactivity') this.resume();
    },
    pause: function pause(reason) {
      if (!this.isPaused) {
        this.isPaused = true;
        this.pauseReason = reason;
        this.pauseCount++;
        this.pauseStart = Date.now();
      }
    },
    resume: function resume() {
      if (this.isPaused) {
        if (this.pauseReason === 'manual' && this.pauseStart) {
          this.pausedTime += Date.now() - this.pauseStart;
        }
        this.isPaused = false;
        this.pauseReason = null;
        this.lastActivity = Date.now();
        this.lastTick = Date.now();
      }
    },
    stop: function stop() {
      clearInterval(this.intervalId);
      if (this.isPaused && this.pauseStart && this.pauseReason === 'manual') {
        this.pausedTime += Date.now() - this.pauseStart;
      }
      this.endTime = Date.now();
    },
    getSummary: function getSummary() {
      var elapsed = (this.endTime || Date.now()) - this.startTime;
      var active = Math.min(this.activeTime, elapsed);
      var paused = Math.min(this.pausedTime, elapsed);
      var inactive = Math.min(this.inactivityTime, elapsed);
      var total = active + paused + inactive;
      if (total > elapsed) {
        var scale = elapsed / total;
        return {
          start: new Date(this.startTime).toISOString(),
          end: new Date(this.endTime || Date.now()).toISOString(),
          elapsed: elapsed,
          active: Math.round(active * scale),
          pauseCount: this.pauseCount,
          paused: Math.round(paused * scale),
          inactive: Math.round(inactive * scale),
          activity: active / elapsed * 100
        };
      }
      return {
        start: new Date(this.startTime).toISOString(),
        end: new Date(this.endTime || Date.now()).toISOString(),
        elapsed: elapsed,
        active: active,
        pauseCount: this.pauseCount,
        paused: paused,
        inactive: inactive,
        activity: elapsed > 0 ? active / elapsed * 100 : 0
      };
    }
  };
}
var sessionTimer = createTimer();
var taskTimer = createTimer();
function showInactivityPrompt() {
  sendToSheets({
    action: 'inactivity',
    sessionCode: state.sessionCode,
    task: getStandardTaskName(state.sequence[state.currentTaskIndex] || ''),
    deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
    timestamp: new Date().toISOString()
  });
  if (confirm('Are you still there?')) {
    taskTimer.resume();
    taskTimer.recordActivity();
    sessionTimer.resume();
    sessionTimer.recordActivity();
  }
}
taskTimer.onInactivity = showInactivityPrompt;
function startHeartbeat(taskName) {
  if (state.heartbeatInterval) return;
  state.heartbeatMisses = 0;
  state.heartbeatInterval = setInterval(function () {
    if (state.externalDepart) {
      var away = Date.now() - state.externalDepart;
      if (away > 600000 && !state.externalNotified) {
        sendToSheets({
          action: 'external_task_stuck',
          sessionCode: state.sessionCode,
          task: taskName,
          away: Math.round(away / 1000),
          timestamp: new Date().toISOString()
        });
        state.externalNotified = true;
      }
    }
    sendToSheets({
      action: 'heartbeat',
      sessionCode: state.sessionCode,
      task: taskName,
      timestamp: new Date().toISOString()
    });
  }, 30000);
}
function stopHeartbeat() {
  if (state.heartbeatInterval) {
    clearInterval(state.heartbeatInterval);
    state.heartbeatInterval = null;
    state.heartbeatMisses = 0;
    state.externalNotified = false;
  }
}
function logSessionTime(stage) {
  var summary = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : sessionTimer.getSummary();
  if (!state.sessionCode) return;
  sendToSheets({
    action: 'session_timer',
    stage: stage,
    sessionCode: state.sessionCode,
    elapsed: Math.round(summary.elapsed / 1000),
    active: Math.round(summary.active / 1000),
    pauseCount: summary.pauseCount,
    paused: Math.round(summary.paused / 1000),
    inactive: Math.round(summary.inactive / 1000),
    activity: Math.round(summary.activity),
    startTime: summary.start,
    endTime: summary.end,
    timestamp: new Date().toISOString()
  });
}
['mousemove', 'mousedown', 'keydown', 'touchstart'].forEach(function (ev) {
  document.addEventListener(ev, function (e) {
    taskTimer.recordActivity();
    sessionTimer.recordActivity();
    sendInputEvent(ev, e);
  }, {
    passive: true
  });
});
function sendInputEvent(type, e) {
  if (!state.sessionCode) return;
  var payload = {
    action: type,
    sessionCode: state.sessionCode,
    timestamp: new Date().toISOString()
  };
  if (type === 'mousemove' || type === 'mousedown' || type === 'touchstart') {
    var point = e.touches && e.touches[0] ? e.touches[0] : e;
    payload.x = point.clientX;
    payload.y = point.clientY;
  }
  if (type === 'keydown') {
    payload.key = e.key;
  }
  sendToSheets(payload);
}
document.addEventListener('visibilitychange', function () {
  var payload = {
    sessionCode: state.sessionCode,
    task: getStandardTaskName(state.sequence[state.currentTaskIndex] || ''),
    deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
    timestamp: new Date().toISOString()
  };
  if (document.hidden) {
    taskTimer.pause('visibility');
    sessionTimer.pause('visibility');
    sendToSheets(_objectSpread({
      action: 'tab_hidden'
    }, payload));
  } else {
    taskTimer.resume();
    sessionTimer.resume();
    sendToSheets(_objectSpread({
      action: 'tab_visible'
    }, payload));
  }
});
window.addEventListener('blur', function () {
  taskTimer.pause('blur');
  sessionTimer.pause('blur');
  if (state.currentTaskType === 'external') {
    state.externalDepart = Date.now();
    sendToSheets({
      action: 'task_departed',
      sessionCode: state.sessionCode,
      task: getStandardTaskName(state.sequence[state.currentTaskIndex] || ''),
      deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
      timestamp: new Date().toISOString()
    });
    startHeartbeat(getStandardTaskName(state.sequence[state.currentTaskIndex] || ''));
  }
});
window.addEventListener('focus', function () {
  taskTimer.resume();
  sessionTimer.resume();
  if (state.currentTaskType === 'external' && state.externalDepart) {
    var away = Date.now() - state.externalDepart;
    taskTimer.externalTime += away;
    taskTimer.lastTick = Date.now();
    sendToSheets({
      action: 'task_returned',
      sessionCode: state.sessionCode,
      task: getStandardTaskName(state.sequence[state.currentTaskIndex] || ''),
      away: Math.round(away / 1000),
      deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
      timestamp: new Date().toISOString()
    });
    state.externalDepart = null;
    stopHeartbeat();
  }
});

// Call on page load
function init() {
  setupEventListeners();

  // Secure-context guard: disable inline recording if not https
  if (!window.isSecureContext) {
    // Hide the record button if the recording screen gets opened
    var style = document.createElement('style');
    style.textContent = "#record-btn { display: none !important; }";
    document.head.appendChild(style);
  }
  var params = new URLSearchParams(location.search);
  checkRecoveryLink();
  if (!params.has('recover')) {
    checkSavedSession();
  }

  // Gentle mobile notice content swap
  if (isMobileDevice()) {
    var warning = document.getElementById('device-warning');
    if (warning) {
      warning.className = 'info-box friendly-tip';
      warning.innerHTML = "\n  <strong>\uD83D\uDCF1 Mobile or Tablet?</strong>\n  <p style=\"margin-top: 10px;\">\n    Some tasks work best on a computer. You can pause now and resume later with your code.\n  </p>\n  <ul style=\"margin: 10px 0 0 20px; text-align: left;\">\n    <li><strong>Virtual Campus Navigation</strong> needs keyboard controls (WASD/arrow keys)</li>\n    <li>Video recording requires camera & microphone permissions</li>\n    <li>Chrome or Firefox recommended on desktop</li>\n    <li>For the best experience, we recommend switching to a computer if possible.</li>\n  </ul>\n";
    }
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
function setupEventListeners() {
  document.getElementById('first-initial').addEventListener('input', validateInitials);
  document.getElementById('last-initial').addEventListener('input', validateInitials);
  document.getElementById('hearing-status').addEventListener('change', validateInitials);
  document.getElementById('fluency').addEventListener('change', validateInitials);
  document.getElementById('resume-code').addEventListener('input', function (e) {
    e.target.value = e.target.value.toUpperCase();
  });
  bindRecordingSkips();
  enhanceUploadFallback();
  bindUploadFallback();
}
function validateInitials(e) {
  if (e.target.id === 'first-initial' || e.target.id === 'last-initial') {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1);
  }
  var first = document.getElementById('first-initial').value;
  var last = document.getElementById('last-initial').value;
  var hearing = document.getElementById('hearing-status').value;
  var fluency = document.getElementById('fluency').value;
  document.getElementById('create-session-btn').disabled = !(first && last && hearing && fluency);
}

// ----- Screens -----
// === REPLACE your existing showScreen with this ===
function showScreen(screenId) {
  // Hide all screens, show target
  document.querySelectorAll('.screen').forEach(function (s) {
    return s.classList.remove('active');
  });
  var screen = document.getElementById(screenId);
  if (screen) screen.classList.add('active');
  updateProgressBar();
  var crumbs = ['Home'];
  if (screenId === 'consent-screen') crumbs.push('Consent');else if (screenId === 'eeg-info') crumbs.push('EEG Info');else if (screenId === 'progress-screen') crumbs.push('Tasks');else if (screenId === 'task-screen' || screenId === 'recording-screen') {
    crumbs.push('Tasks');
    var t = document.getElementById('task-title');
    if (t) crumbs.push(t.textContent.trim());
  }
  var bc = document.getElementById('breadcrumbs');
  if (bc) bc.textContent = crumbs.join(' › ');

  // Show/hide session widget + FAB
  var widget = document.getElementById('session-widget');
  var showWidget = ['progress-screen', 'task-screen', 'consent-screen', 'recording-screen'].includes(screenId);
  if (widget) widget.classList.toggle('active', showWidget && state.sessionCode);
  var fab = document.getElementById('pause-fab');
  if (fab) fab.classList.toggle('active', showWidget && state.sessionCode);

  // Accessibility: move focus to the screen heading and announce
  var heading = screen ? screen.querySelector('h2, h1, h3') : null;
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({
      preventScroll: false
    });
    // Clean up tabindex after focus so it doesn't stay in tab order
    setTimeout(function () {
      return heading.removeAttribute('tabindex');
    }, 500);
    // Live region update
    var live = document.getElementById('live-status');
    if (live) live.textContent = "Section changed: ".concat(heading.textContent);
  }
}

// ----- Session -----
function generateCode() {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var code = '';
  for (var i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
}
function createNewSession() {
  var first = document.getElementById('first-initial').value.trim().toUpperCase();
  var last = document.getElementById('last-initial').value.trim().toUpperCase();
  var email = document.getElementById('email').value.trim();
  var hearing = document.getElementById('hearing-status').value;
  var fluency = document.getElementById('fluency').value;
  if (!first || !last || !hearing || !fluency) {
    alert('Please complete all fields');
    return;
  }
  if (isMobileDevice()) {
    var proceed = confirm('You are on a phone or tablet.\n\n' + 'A computer is preferred for the best experience, but you can continue now.\n' + 'You can also pause and resume later on a computer using your resume code.\n\n' + 'Continue on this device?');
    if (!proceed) return;
  }
  state.sessionCode = generateCode();
  state.participantID = "".concat(first).concat(last, "_").concat(Date.now().toString().slice(-4));
  state.email = email;
  state.hearingStatus = hearing;
  state.fluency = fluency;

  // Choose sequence (mobile vs desktop)
  var seed = Math.abs(hashCode(state.sessionCode));
  state.sequenceIndex = seed;
  if (isMobileDevice()) {
    state.sequence = shuffleWithSeed(MOBILE_TASKS, seed);
    state.isMobile = true;
  } else {
    state.sequence = shuffleWithSeed(DESKTOP_TASKS, seed);
    state.isMobile = false;
  }
  state.sequence = ensureDemographicsLast(state.sequence);
  state.startTime = Date.now();
  state.lastActivity = new Date().toISOString();
  saveState();
  sendToSheets({
    action: 'session_created',
    sessionCode: state.sessionCode,
    participantID: state.participantID,
    email: state.email,
    hearingStatus: state.hearingStatus,
    fluency: state.fluency,
    deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
    timestamp: new Date().toISOString()
  });
  document.getElementById('display-code').textContent = state.sessionCode;
  showScreen('session-created');
}
function resumeSession(_x) {
  return _resumeSession.apply(this, arguments);
} // === REPLACE the body of checkSavedSession with this ===
function _resumeSession() {
  _resumeSession = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(codeFromLink) {
    var input, code, res, data, _t2;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          input = codeFromLink || document.getElementById('resume-code').value;
          code = input.toUpperCase();
          if (!(code.length !== 8)) {
            _context3.n = 1;
            break;
          }
          alert('Please enter your 8-character resume code');
          return _context3.a(2);
        case 1:
          _context3.p = 1;
          _context3.n = 2;
          return fetch(CONFIG.SHEETS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify({
              action: 'get_session',
              sessionCode: code
            })
          });
        case 2:
          res = _context3.v;
          _context3.n = 3;
          return res.json();
        case 3:
          data = _context3.v;
          if (!(!data.success || !data.session || !data.session.state)) {
            _context3.n = 4;
            break;
          }
          alert('Session not found. Please check your code.');
          return _context3.a(2);
        case 4:
          state = JSON.parse(data.session.state);
          state.sequence = ensureDemographicsLast(state.sequence);
          if (data.activity_tracking) state.activity_tracking = data.activity_tracking;
          if (data.activity_summary) state.activity_summary = data.activity_summary;
          saveState();
          updateSessionWidget();
          if (!state.consentStatus.consent1) showScreen('consent-screen');else showProgressScreen();
          if (!sessionTimer.startTime) sessionTimer.start();
          _context3.n = 6;
          break;
        case 5:
          _context3.p = 5;
          _t2 = _context3.v;
          console.error(_t2);
          alert('Error loading session');
        case 6:
          return _context3.a(2);
      }
    }, _callee3, null, [[1, 5]]);
  }));
  return _resumeSession.apply(this, arguments);
}
function checkSavedSession() {
  try {
    if (state.sessionCode) return;
    var recentCode = localStorage.getItem('recent_session');
    if (!recentCode) return;
    var saved = localStorage.getItem("study_".concat(recentCode));
    if (!saved) return;
    var data = JSON.parse(saved);
    var daysSince = (Date.now() - new Date(data.lastActivity).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 30) {
      // Delay so it doesn’t clash with initial UI
      setTimeout(function () {
        if (confirm("Welcome back! Resume session ".concat(recentCode, "?"))) {
          state = data;
          state.sequence = ensureDemographicsLast(state.sequence);
          saveState();
          updateSessionWidget();
          showProgressScreen();
        }
      }, 700); // ~0.7s feels smooth with your animations
    }
  } catch (e) {
    console.warn('Could not check saved session', e);
  }
}
function checkRecoveryLink() {
  try {
    var params = new URLSearchParams(location.search);
    var token = params.get('recover');
    if (!token) return;
    var code = atob(token);
    if (code && code.length === 8) {
      resumeSession(code);
    }
    try {
      var cleanURL = location.origin + location.pathname;
      window.history.replaceState({}, '', cleanURL);
    } catch (e) {}
  } catch (e) {
    console.warn('Invalid recovery link', e);
  }
}
function saveState() {
  try {
    if (!state || !state.sessionCode) {
      console.warn('Invalid state, not saving');
      return;
    }
    state.lastActivity = new Date().toISOString();
    localStorage.setItem("study_".concat(state.sessionCode), JSON.stringify(state));
    localStorage.setItem('recent_session', state.sessionCode);
    sendToSheets({
      action: 'save_state',
      sessionCode: state.sessionCode,
      state: state
    });
  } catch (e) {
    console.warn('Could not save state', e);
  }
}
function proceedToEEGInfo() {
  showScreen('eeg-info');
}

// ----- Consent -----
function proceedToConsent() {
  if (!sessionTimer.startTime) sessionTimer.start();
  showScreen('consent-screen');
  updateConsentDisplay();
}
function openConsent(type) {
  var consent = CONSENTS[type];
  if (consent) {
    window.open(consent.url, '_blank', 'noopener');
    sendToSheets({
      action: 'consent_opened',
      sessionCode: state.sessionCode,
      type: type,
      timestamp: new Date().toISOString()
    });
  }
}
function toggleCodeEntry(type) {
  var container = document.getElementById("".concat(type, "-code-container"));
  var note = document.getElementById("".concat(type, "-verify-note"));
  if (!container) return;
  var show = container.style.display === 'none' || container.style.display === '';
  container.style.display = show ? 'block' : 'none';
  if (show && note) {
    note.textContent = '🔄 Waiting for consent form code...';
    note.style.color = 'var(--text-secondary)';
  }
}
function markConsentDone(type) {
  // Safety interlock: explicit warning + typed phrase
  var niceName = type === 'consent1' ? 'Research Consent' : 'Video Consent';
  var ok = confirm("Did you actually complete and submit the ".concat(niceName, " form on Qualtrics?\n\n") + "Clicking \u201COK\u201D without completing the form will disqualify your participation.");
  if (!ok) return;
  var phrase = prompt("To confirm, type exactly: I COMPLETED THE CONSENT\n\n" + "This helps prevent accidental or invalid confirmation.");
  if (!phrase || phrase.trim().toUpperCase() !== 'I COMPLETED THE CONSENT') {
    alert('Not confirmed. Please complete the form first.');
    return;
  }

  // Mark the consent as completed (same as before)
  if (type === 'consent1') {
    state.consentStatus.consent1 = true;
  } else if (type === 'consent2') {
    state.consentStatus.consent2 = true;
  }
  saveState();
  updateConsentDisplay();

  // Log a stricter audit trail
  sendToSheets({
    action: 'consent_affirmed',
    sessionCode: state.sessionCode,
    type: type,
    method: 'typed-affirmation',
    timestamp: new Date().toISOString()
  });
  logSessionTime(type);
}
function verifyConsentCode(type) {
  var inputId = type === 'consent1' ? 'consent1-code' : 'consent2-code';
  var noteId = type === 'consent1' ? 'consent1-verify-note' : 'consent2-verify-note';
  var el = document.getElementById(inputId);
  var noteEl = document.getElementById(noteId);
  var code = (el && el.value || '').trim();

  // Enforce 6 digits only
  if (!CODE_REGEX.test(code)) {
    alert('Enter the 6-digit code shown at the end of the Qualtrics form.');
    if (el) el.focus();
    return;
  }

  // Mark this consent complete & verified
  if (type === 'consent1') state.consentStatus.consent1 = true;
  if (type === 'consent2') state.consentStatus.consent2 = true;
  state.consentVerify[type] = {
    verified: true,
    method: 'code',
    note: '6-digit'
  };
  saveState();
  updateConsentDisplay();
  if (noteEl) {
    noteEl.textContent = '✅ Code verified!';
    noteEl.style.color = '#1b5e20';
  }

  // Log (store only the 6-digit suffix; no PII)
  sendToSheets({
    action: 'consent_verified',
    sessionCode: state.sessionCode || 'none',
    type: type,
    method: 'code',
    codeSuffix: code,
    // already 6 digits
    timestamp: new Date().toISOString()
  });
}
function autoVerifyConsentsFromURL() {
  try {
    var p = new URLSearchParams(location.search);
    // Support: ?c1=1&c2=1 or ?consent1=done etc. You can set these in Qualtrics "End of Survey" redirect.
    var c1 = p.get('c1') || p.get('consent1');
    var c2 = p.get('c2') || p.get('consent2');
    var rid1 = p.get('rid1') || p.get('rid'); // optionally pass ResponseID
    var rid2 = p.get('rid2');
    if (c1 && String(c1).toLowerCase() !== '0') {
      state.consentStatus.consent1 = true;
      state.consentVerify.consent1 = {
        verified: true,
        method: 'url-param',
        note: rid1 ? "RID \u2026".concat(String(rid1).slice(-6)) : ''
      };
      sendToSheets({
        action: 'consent_verified',
        sessionCode: state.sessionCode || 'none',
        type: 'consent1',
        method: 'url-param',
        ridSuffix: rid1 ? String(rid1).slice(-6) : '',
        timestamp: new Date().toISOString()
      });
    }
    if (c2 && String(c2).toLowerCase() !== '0') {
      state.consentStatus.consent2 = true;
      state.consentVerify.consent2 = {
        verified: true,
        method: 'url-param',
        note: rid2 ? "RID \u2026".concat(String(rid2).slice(-6)) : ''
      };
      sendToSheets({
        action: 'consent_verified',
        sessionCode: state.sessionCode || 'none',
        type: 'consent2',
        method: 'url-param',
        ridSuffix: rid2 ? String(rid2).slice(-6) : '',
        timestamp: new Date().toISOString()
      });
    }
    if (c1 || c2) {
      saveState();
      updateConsentDisplay();
      // Optional: clean query so it doesn't re-trigger on refresh
      try {
        var cleanURL = location.origin + location.pathname;
        window.history.replaceState({}, '', cleanURL);
      } catch (e) {}
    }
  } catch (e) {
    console.warn('Auto-verify failed', e);
  }
}

// Call it during init:
document.addEventListener('DOMContentLoaded', function () {
  // ... your existing init
  autoVerifyConsentsFromURL(); // <— add this line
});
function declineVideo() {
  if (confirm('Decline video consent? You can still participate in other tasks.')) {
    state.consentStatus.videoDeclined = true;
    state.consentStatus.consent2 = true;
    document.getElementById('consent2-card').classList.add('declined');
    document.querySelector('#consent2-card .status-icon').textContent = '⚠️';
    saveState();
    updateConsentDisplay();
    sendToSheets({
      action: 'video_declined',
      sessionCode: state.sessionCode,
      timestamp: new Date().toISOString()
    });
    logSessionTime('consent2_declined');
    updateSessionWidget();
    updateProgressBar();
  }
}
function updateConsentDisplay() {
  var c1 = state.consentStatus.consent1;
  var c2 = state.consentStatus.consent2 || state.consentStatus.videoDeclined;

  // Buttons state
  document.getElementById('continue-from-consent').disabled = !(c1 && c2);

  // Card styles + badges
  var card1 = document.getElementById('consent1-card');
  var card2 = document.getElementById('consent2-card');
  if (c1) {
    card1.classList.remove('declined');
    card1.classList.add('completed');
    card1.querySelector('.status-icon').textContent = '✅';
    var note = document.getElementById('consent1-verify-note');
    if (state.consentVerify.consent1.verified) {
      if (note) {
        note.textContent = '✅ Code verified!';
        note.style.color = '#1b5e20';
      }
    } else {
      if (note) {
        note.textContent = 'Affirmed without code';
        note.style.color = '#856404';
      }
    }
  }
  if (state.consentStatus.videoDeclined) {
    card2.classList.remove('completed');
    card2.classList.add('declined');
    card2.querySelector('.status-icon').textContent = '⚠️';
  } else if (state.consentStatus.consent2) {
    card2.classList.remove('declined');
    card2.classList.add('completed');
    card2.querySelector('.status-icon').textContent = '✅';
    var _note = document.getElementById('consent2-verify-note');
    if (state.consentVerify.consent2.verified) {
      if (_note) {
        _note.textContent = '✅ Code verified!';
        _note.style.color = '#1b5e20';
      }
    } else if (_note) {
      _note.textContent = state.consentStatus.consent2 ? 'Affirmed without code' : '';
      _note.style.color = '#856404';
    }
  }
}
function proceedToTasks() {
  if (!state.consentStatus.consent1) {
    alert('Please complete the research consent form');
    return;
  }
  showProgressScreen();
}

// ----- Progress -----
function showProgressScreen() {
  updateTaskList();
  updateProgressBar();
  updateSessionWidget();
  updateSkippedNotice();
  updateProgressSkipButton();
  showScreen('progress-screen');
}
function updateSkippedNotice() {
  var box = document.getElementById('skipped-notice');
  if (!box) return;
  var count = state.skippedTasks.length;
  if (count > 0) {
    box.style.display = 'block';
    box.textContent = "You have skipped ".concat(count, " task").concat(count > 1 ? 's' : '', ". Each task gives unique data. If you can, go back and try them. Even partial answers help. There is no judgment.");
  } else {
    box.style.display = 'none';
  }
}
function updateProgressSkipButton() {
  var btn = document.getElementById('skip-current-task-btn');
  if (!btn) return;
  var taskCode = state.sequence[state.currentTaskIndex];
  var canSkip = taskCode && TASKS[taskCode] && TASKS[taskCode].canSkip;
  btn.style.display = canSkip ? 'inline-flex' : 'none';
  btn.textContent = taskCode === 'ASLCT' ? 'Unable to complete - I do not know ASL' : 'Unable to continue';
}
function updateTaskList() {
  var list = document.getElementById('task-list');
  list.innerHTML = '';
  state.sequence.forEach(function (taskCode, index) {
    var task = TASKS[taskCode];
    var li = document.createElement('li');
    li.className = 'task-item';
    var isCompleted = state.completedTasks.includes(taskCode);
    var isCurrent = index === state.currentTaskIndex && !isCompleted;
    if (isCompleted) li.classList.add('completed');else if (isCurrent) li.classList.add('current');else li.classList.add('locked');
    li.innerHTML = "\n          <div class=\"task-info\">\n            <div class=\"task-name\">".concat(task.name, "<span class=\"task-badge\">").concat(task.estMinutes, "m</span></div>\n            <div class=\"task-description\">").concat(task.description, "</div>\n          </div>\n          <div class=\"task-status\">").concat(isCompleted ? '✅' : isCurrent ? '▶️' : '🔒', "</div>\n        ");
    list.appendChild(li);
  });
}
function getTaskCounts() {
  var isRequired = function isRequired(code) {
    return !(code === 'ID' && state.consentStatus.videoDeclined);
  };
  return {
    total: state.sequence.filter(isRequired).length,
    completed: state.completedTasks.filter(isRequired).length
  };
}
function updateProgressBar() {
  var _getTaskCounts = getTaskCounts(),
    total = _getTaskCounts.total,
    completed = _getTaskCounts.completed;
  if (!total) return;
  var progress = completed / total * 100;
  var pct = "".concat(Math.round(progress), "%");
  var fill = document.getElementById('progress-fill');
  var topFill = document.getElementById('top-progress-fill');
  if (fill) {
    fill.style.width = "".concat(progress, "%");
    document.getElementById('progress-text').textContent = pct;
  }
  if (topFill) {
    topFill.style.width = "".concat(progress, "%");
    topFill.textContent = pct;
  }
  var step = document.getElementById('step-indicator');
  if (step) step.textContent = "Step ".concat(Math.min(completed + 1, total), " of ").concat(total);
}
function updateSessionWidget() {
  if (!state.sessionCode) return;
  var _getTaskCounts2 = getTaskCounts(),
    total = _getTaskCounts2.total,
    completed = _getTaskCounts2.completed;
  document.getElementById('widget-code').textContent = state.sessionCode + (state.isMobile ? ' (Mobile)' : '');
  document.getElementById('widget-progress').textContent = "".concat(completed, "/").concat(total);
  document.getElementById('widget-time').textContent = "".concat(Math.round(state.totalTimeSpent / 60000), " min");
  var currentTask = state.sequence[state.currentTaskIndex];
  document.getElementById('widget-current').textContent = currentTask ? TASKS[currentTask].name : 'Complete';
}

// ----- Task flow -----
function continueToCurrentTask() {
  if (state.currentTaskIndex >= state.sequence.length) {
    showCompletionScreen();
    return;
  }
  startTask(state.sequence[state.currentTaskIndex]);
}
function skipCurrentTask() {
  if (state.currentTaskIndex >= state.sequence.length) return;
  var taskCode = state.sequence[state.currentTaskIndex];
  showSkipDialog(taskCode);
}
function startTask(taskCode) {
  var task = TASKS[taskCode];
  if (!task) return;
  if (!state.taskData) state.taskData = {};
  state.taskData[taskCode] = {
    startTime: Date.now()
  };
  state.currentTaskType = task.type;
  taskTimer.start();
  if (task.type === 'recording') showRecordingTask();else if (task.type === 'embed') showEmbeddedTask(taskCode);else showExternalTask(taskCode);
  var startISO = new Date().toISOString();
  sendToSheets({
    action: 'task_started',
    sessionCode: state.sessionCode,
    task: getStandardTaskName(taskCode),
    deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
    timestamp: startISO,
    startTime: startISO
  });
}

// ----- Distraction-free fallback -----
function enterDistractionFree() {
  document.documentElement.classList.add('df-mode');
  document.body.dataset.scrollY = window.scrollY;
  document.body.style.top = "-".concat(window.scrollY, "px");
}
function exitDistractionFree() {
  document.documentElement.classList.remove('df-mode');
  var y = parseInt(document.body.dataset.scrollY || '0', 10);
  document.body.style.top = '';
  window.scrollTo(0, y);
}

// PostMessage completion hook
window.addEventListener('message', function (ev) {
  var allowedOrigin = 'https://melodyfschwenk.github.io';
  if (ev.origin !== allowedOrigin) return;
  var data = ev.data || {};
  if (data.type === 'task-complete' && data.taskCode && TASKS[data.taskCode]) {
    completeTask(data.taskCode);
  }
});

// ----- Embedded tasks -----
function showEmbeddedTask(taskCode) {
  var task = TASKS[taskCode];
  var url = task.embedUrl;
  var iframeId = "embed-".concat(taskCode.toLowerCase());
  var extra = '';
  if (taskCode === 'SN') {
    extra = "\n          <div class=\"info-box helpful\" style=\"margin-top:10px;\">\n            <strong>What you'll do</strong>\n            <p style=\"margin-top:6px;\">Press <em>one</em> arrow key for the <em>first</em> step from the gray player to the red stop sign.</p>\n          </div>";
  } else if (taskCode === 'MRT') {
    extra = "\n          <div class=\"info-box friendly-tip\" style=\"margin-top:10px;\">\n            <strong>Heads up:</strong>\n            <p style=\"margin-top:6px;\">Takes about <strong>5\u20136 minutes</strong>. Work steadily from start to finish.</p>\n          </div>";
  }
  document.getElementById('task-title').textContent = task.name;
  var requiredText = taskCode === 'ID' && state.consentStatus.videoDeclined ? 'This task is optional for you (video consent declined).' : 'This task is required for study completion.';
  var eta = TASKS[taskCode] && TASKS[taskCode].estMinutes ? "".concat(TASKS[taskCode].estMinutes, " minutes") : 'a few minutes';
  var reqs = TASKS[taskCode] && TASKS[taskCode].requirements || '—';
  document.getElementById('task-instructions').innerHTML = "\n  <div class=\"info-box friendly-tip\" style=\"margin-bottom:10px;\">\n    <strong> Ready to Start ".concat(task.name, "?</strong>\n    <ul style=\"margin:8px 0 0 20px; text-align:left;\">\n      <li>").concat(requiredText, "</li>\n      <li>Having problems? Email us instead of skipping</li>\n      <li>Estimated time: <strong>").concat(eta, "</strong></li>\n      <li>Requirements/tips: <em>").concat(reqs, "</em></li>\n    </ul>\n  </div>\n  <p>").concat(task.description, "</p>\n  ").concat(extra, "\n  <details style=\"margin-top:10px;\"><summary style=\"cursor:pointer;\">More info / troubleshooting</summary>\n    <ul style=\"margin:8px 0 0 20px; text-align:left;\">\n      <li>If the game doesn't respond, click inside it once to give it keyboard focus.</li>\n      <li>If fullscreen doesn't work on your device, we'll switch to a distraction-free view.</li>\n    </ul>\n  </details>\n");
  var content = document.getElementById('task-content');
  content.innerHTML = "\n  <div class=\"card\" id=\"prestart\">\n    <p>When you click <strong>Continue</strong>, the task will open in fullscreen. When you're finished, click <em>I'm finished \u2014 Continue</em>.</p>\n    <div class=\"button-group\" style=\"margin-top:12px;\">\n      <button class=\"button\" id=\"start-embed\">Continue</button>\n      <button class=\"button outline\" type=\"button\" onclick=\"openSupportEmail('".concat(taskCode, "')\">Report Technical Issue Instead</button>\n      ").concat(task.canSkip ? "<button class=\"button skip\" onclick=\"showSkipDialog('".concat(taskCode, "')\" title=\"Please try the task first or email ").concat(CONFIG.SUPPORT_EMAIL, " for help\">Unable to complete</button>") : '', "\n    </div>\n  </div>\n\n  <div class=\"embed-shell fs-shell\" id=\"fs-shell\" style=\"display:none;\">\n    <div class=\"fs-toolbar\" id=\"fs-toolbar\">\n      <div>").concat(task.name, "</div>\n      <div class=\"actions\">\n        <button class=\"button success\" id=\"finish-btn\" disabled>I'm finished \u2014 Continue</button>\n        <button class=\"button secondary\" id=\"exit-btn\">Exit fullscreen</button>\n      </div>\n    </div>\n    <iframe id=\"").concat(iframeId, "\" class=\"embed-frame\" src=\"").concat(url, "\" allow=\"fullscreen; gamepad; xr-spatial-tracking\" allowfullscreen></iframe>\n    <div class=\"embed-note\">Tip: click once inside the game to give it keyboard focus.</div>\n  </div>\n");
  showScreen('task-screen');
  var fsShell = document.getElementById('fs-shell');
  var finishBtn = document.getElementById('finish-btn');
  var exitBtn = document.getElementById('exit-btn');
  var prestart = document.getElementById('prestart');
  var iframe = document.getElementById(iframeId);
  iframe.addEventListener('focus', function () {
    return taskTimer.recordActivity();
  });
  var enableFinish = function enableFinish() {
    finishBtn.disabled = false;
  };
  function goFullscreen() {
    return _goFullscreen.apply(this, arguments);
  }
  function _goFullscreen() {
    _goFullscreen = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.p = _context.n) {
          case 0:
            prestart.style.display = 'none';
            fsShell.style.display = 'block';
            setTimeout(function () {
              try {
                iframe.focus();
              } catch (e) {}
            }, 50);
            _context.p = 1;
            if (!fsShell.requestFullscreen) {
              _context.n = 3;
              break;
            }
            _context.n = 2;
            return fsShell.requestFullscreen({
              navigationUI: 'hide'
            })["catch"](function () {});
          case 2:
            _context.n = 4;
            break;
          case 3:
            if (fsShell.webkitRequestFullscreen) {
              fsShell.webkitRequestFullscreen();
            }
          case 4:
            setTimeout(function () {
              var inFS = document.fullscreenElement || document.webkitFullscreenElement;
              if (!inFS) enterDistractionFree();
            }, 250);
            _context.n = 6;
            break;
          case 5:
            _context.p = 5;
            _t = _context.v;
            enterDistractionFree();
          case 6:
            setTimeout(enableFinish, 6000);
          case 7:
            return _context.a(2);
        }
      }, _callee, null, [[1, 5]]);
    }));
    return _goFullscreen.apply(this, arguments);
  }
  function leaveFullscreenModes() {
    if (document.fullscreenElement) document.exitFullscreen()["catch"](function () {});
    if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen();
    exitDistractionFree();
  }
  document.getElementById('start-embed').onclick = goFullscreen;
  finishBtn.onclick = function () {
    leaveFullscreenModes();
    completeTask(taskCode);
  };
  exitBtn.onclick = function () {
    leaveFullscreenModes();
    fsShell.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    enableFinish();
  };
  var loadTimeout = setTimeout(function () {
    var note = document.createElement('div');
    note.className = 'embed-note';
    note.textContent = 'Still loading… if nothing appears soon, try exiting fullscreen and re-entering.';
    fsShell.appendChild(note);
  }, 7000);
  iframe.addEventListener('load', function () {
    return clearTimeout(loadTimeout);
  }, {
    once: true
  });
  document.addEventListener('keydown', function escHandler(ev) {
    if (ev.key === 'Escape') {
      setTimeout(leaveFullscreenModes, 0);
      document.removeEventListener('keydown', escHandler);
    }
  });
}

// ----- External tasks -----

// === REPLACE your existing showExternalTask with this ===
function showExternalTask(taskCode) {
  var task = TASKS[taskCode];
  var extra = '';
  var requiredText = taskCode === 'ID' && state.consentStatus.videoDeclined ? 'This task is OPTIONAL for you (video consent declined).' : 'This task is required for study completion.';
  var eta = TASKS[taskCode] && TASKS[taskCode].estMinutes ? "".concat(TASKS[taskCode].estMinutes, " minutes") : 'a few minutes';
  var reqs = TASKS[taskCode] && TASKS[taskCode].requirements || '—';
  if (taskCode === 'ASLCT') {
    var ASLCT_CODE = CONFIG.ASLCT_ACCESS_CODE;
    extra = "\n      <div class=\"info-box helpful\" style=\"margin-top: 10px;\">\n        <strong>ASLCT Access Code</strong>\n        <p style=\"margin-top: 6px;\">\n          On the login page, enter access code:\n          <span class=\"code\" style=\"font-size:22px; background:#fff; color:#333; padding:4px 8px; border-radius:6px; display:inline-block;\">".concat(ASLCT_CODE, "</span>\n        </p>\n        <button class=\"button outline\" onclick=\"navigator.clipboard.writeText('").concat(ASLCT_CODE, "').then(()=>{ this.textContent='\u2705 Copied!'; setTimeout(()=>this.textContent='Copy Access Code',1500); })\">Copy Access Code</button>\n      </div>\n      <div class=\"info-box helpful\" style=\"margin-top: 10px;\">\n        <strong>Instructions:</strong>\n        <ol style=\"margin: 10px 0 0 20px; text-align: left;\">\n          <li>Click \"Open Task\".</li>\n          <li>On the ASLCT portal, paste the access code <em>").concat(ASLCT_CODE, "</em> and follow the prompts.</li>\n          <li>Return here when finished and click \"Mark Complete\".</li>\n        </ol>\n      </div>\n      <div style=\"margin-top: 10px; text-align: left;\">\n        <p>If you encounter any problems with the ASLCT, please describe them below and click Send.</p>\n        <textarea id=\"aslct-issue-text\" style=\"width: 100%; height: 80px; margin-top: 6px;\"></textarea>\n        <button class=\"button secondary\" style=\"margin-top: 10px;\" onclick=\"submitASLCTIssue()\">Send</button>\n      </div>");
  } else if (taskCode === 'VCN') {
    extra = "\n      <div class=\"info-box helpful\" style=\"margin-top: 10px;\">\n        <strong>Virtual SILC Test of Navigation (SILCton) \u2014 What you'll do</strong>\n        <p style=\"margin-top: 6px;\">Learn a small virtual campus (Learning phase), then answer quick questions (Test phase).</p>\n        <ul style=\"margin: 10px 0 0 20px; text-align: left;\">\n          <li><strong>Controls:</strong> Move with WASD/arrow keys; look around with the mouse.</li>\n          <li>Desktop/laptop recommended (Chrome/Firefox). Keep this page open.</li>\n        </ul>\n      </div>";
  }
  document.getElementById('task-title').textContent = task.name;
  document.getElementById('task-instructions').innerHTML = "\n    <div class=\"info-box friendly-tip\" style=\"margin-bottom:10px;\">\n      <strong>\u26A0\uFE0F Ready to Start ".concat(task.name, "?</strong>\n      <ul style=\"margin:8px 0 0 20px; text-align:left;\">\n        <li>").concat(requiredText, "</li>\n        <li>Having problems? Email us instead of skipping</li>\n        <li>Estimated time: <strong>").concat(eta, "</strong></li>\n        <li>Requirements/tips: <em>").concat(reqs, "</em></li>\n      </ul>\n    </div>\n    <p>").concat(task.description, "</p>\n    ").concat(extra, "\n    <div class=\"info-box helpful\" style=\"margin-top: 10px;\">\n      <strong>Instructions:</strong>\n      <ol style=\"margin: 10px 0 0 20px; text-align: left;\">\n        <li>Click \"Open Task\" to launch in a new tab.</li>\n        <li>Complete the task as instructed.</li>\n        <li>Return to this tab when finished.</li>\n        <li>Click \"Mark Complete\" to continue.</li>\n      </ol>\n    </div>\n  ");
  var content = document.getElementById('task-content');
  content.innerHTML = "\n    <div class=\"button-group\">\n      <a class=\"button\" href=\"".concat(task.url, "\" target=\"_blank\" rel=\"noopener\"\n         aria-label=\"Open Task (opens in new tab)\"\n         onclick=\"sendToSheets({ action: 'task_opened', sessionCode: state.sessionCode || 'none', timestamp: new Date().toISOString(), userAgent: navigator.userAgent, deviceType: state.isMobile ? 'mobile/tablet' : 'desktop' });\">\n         Open Task\n      </a>\n      <button class=\"button success\" onclick=\"completeTask('").concat(taskCode, "')\">Mark Complete</button>\n      <button class=\"button outline\" onclick=\"openSupportEmail('").concat(taskCode, "')\">Report Technical Issue Instead</button>\n    </div>\n  ");
  if (task.canSkip) {
    content.innerHTML += "\n      <button class=\"button skip\" onclick=\"showSkipDialog('".concat(taskCode, "')\" style=\"display: block; margin: 20px auto;\" title=\"Please try the task first or email ").concat(CONFIG.SUPPORT_EMAIL, " for help\">\n        ").concat(taskCode === 'ASLCT' ? 'Unable to complete - I do not know ASL' : 'Unable to complete', "\n      </button>\n    ");
  }
  showScreen('task-screen');
}
function openExternalTask(taskCode) {
  var task = TASKS[taskCode];
  if (!task || !task.url) return;
  window.open(task.url, '_blank', 'noopener');
}

// ----- Recording task -----
function showRecordingTask() {
  state.recording.currentImage = 0;
  state.recording.recordings = [];
  state.recording.currentBlob = null;
  if (!state.consentStatus.consent2 || state.consentStatus.videoDeclined) {
    document.getElementById('recording-consent-check').style.display = 'block';
    document.getElementById('recording-content').style.display = 'none';
  } else {
    document.getElementById('recording-consent-check').style.display = 'none';
    document.getElementById('recording-content').style.display = 'block';
    updateRecordingImage();
  }
  // NEW: if page not secure, skip recorder UI and show upload UI
  if (!window.isSecureContext) {
    document.getElementById('recording-consent-check').style.display = 'none';
    document.getElementById('recording-content').style.display = 'block';
    document.getElementById('video-upload-fallback').style.display = 'block';
    // Ensure the current image is shown even without recording
    updateRecordingImage();
    var status = document.getElementById('recording-status');
    status.textContent = 'Recording disabled (requires https). Please use the upload option below.';
    status.className = 'recording-status warning';
  }
  showScreen('recording-screen');
}
function revokeRecordedURL() {
  var recorded = document.getElementById('recorded-video');
  if (recorded && recorded.src) {
    try {
      URL.revokeObjectURL(recorded.src);
    } catch (e) {}
    recorded.removeAttribute('src');
    if (recorded.load) recorded.load();
  }
}
function startPreview() {
  return _startPreview.apply(this, arguments);
}
function _startPreview() {
  _startPreview = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    var preview, perm, how, stream, _t3;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          preview = document.getElementById('video-preview');
          if (!state.recording.stream) {
            _context4.n = 1;
            break;
          }
          preview.srcObject = state.recording.stream;
          preview.style.display = 'block';
          preview.play()["catch"](function () {});
          return _context4.a(2);
        case 1:
          _context4.p = 1;
          _context4.n = 2;
          return checkSecureAndPermissions();
        case 2:
          perm = _context4.v;
          if (!(perm.permissionsChecked && (perm.cam === 'denied' || perm.mic === 'denied'))) {
            _context4.n = 3;
            break;
          }
          how = isIOS() ? "Settings \u2192 Safari \u2192 Camera/Microphone \u2192 Allow for this site, then reload." : 'Click the camera icon in the address bar and allow camera and microphone, then reload.';
          showRecordingError("<strong>Camera or microphone is blocked</strong><p style=\"margin-top: 6px;\">Please allow access for this site. ".concat(how, "</p>"));
          return _context4.a(2);
        case 3:
          _context4.n = 4;
          return navigator.mediaDevices.getUserMedia({
            video: {
              width: 640,
              height: 480
            },
            audio: true
          });
        case 4:
          stream = _context4.v;
          state.recording.stream = stream;
          state.recording.isVideoMode = true;
          preview.srcObject = stream;
          preview.style.display = 'block';
          preview.play()["catch"](function () {});
          _context4.n = 6;
          break;
        case 5:
          _context4.p = 5;
          _t3 = _context4.v;
          console.error('Preview failed:', _t3);
        case 6:
          return _context4.a(2);
      }
    }, _callee4, null, [[1, 5]]);
  }));
  return _startPreview.apply(this, arguments);
}
function updateRecordingImage() {
  var imageNum = state.recording.currentImage + 1;
  document.getElementById('image-number').textContent = imageNum;
  document.getElementById('current-image').src = imageNum === 1 ? CONFIG.IMAGE_1 : CONFIG.IMAGE_2;
  var preview = document.getElementById('video-preview');
  var recorded = document.getElementById('recorded-video');
  preview.style.display = 'none';
  recorded.style.display = 'none';

  // Clean up previous recording blob URL
  revokeRecordedURL();
  state.recording.currentBlob = null;

  // Reset UI elements
  document.getElementById('record-btn').style.display = 'inline-block';
  document.getElementById('rerecord-btn').style.display = 'none';
  document.getElementById('save-recording-btn').style.display = 'none';
  var status = document.getElementById('recording-status');
  status.textContent = 'Ready to record';
  status.className = 'recording-status ready';

  // Clear any previous errors
  document.getElementById('recording-error').style.display = 'none';
  document.getElementById('video-upload-fallback').style.display = 'none';
  document.getElementById('upload-progress').style.display = 'none';

  // Clear file input
  var fileInput = document.getElementById('video-file-input');
  if (fileInput) fileInput.value = '';
  var uploadBtn = document.getElementById('upload-save-btn');
  if (uploadBtn) {
    uploadBtn.style.display = 'none';
    uploadBtn.textContent = 'Use this upload';
  }

  // Add recording instructions with size warning
  var recordingInstructions = document.createElement('div');
  recordingInstructions.className = 'info-box important';
  recordingInstructions.id = 'recording-size-warning';
  recordingInstructions.innerHTML = "\n  <strong>\uD83D\uDCF9 Recording Guidelines</strong>\n  <ul style=\"margin: 8px 0 0 20px; text-align: left;\">\n    <li><strong>Duration:</strong> Keep recordings between 30-60 seconds</li>\n    <li><strong>File size:</strong> Recordings over 45 seconds may fail to upload</li>\n    <li><strong>Language:</strong> Use ASL if you know it, otherwise spoken English</li>\n    <li><strong>Can't record?</strong> Use the \"Upload a Recording\" option below</li>\n  </ul>\n";

  // Insert before recording controls
  var recordingContent = document.getElementById('recording-content');
  var recordingControls = recordingContent ? recordingContent.querySelector('.recording-controls') : null;
  if (recordingControls && recordingControls.parentNode && !document.getElementById('recording-size-warning')) {
    recordingControls.parentNode.insertBefore(recordingInstructions, recordingControls);
  }
  var requiredTextRec = state.consentStatus.videoDeclined ? 'This task is OPTIONAL for you (video consent declined).' : 'This task is required for study completion.';
  var etaRec = TASKS['ID'] && TASKS['ID'].estMinutes ? "".concat(TASKS['ID'].estMinutes, " minutes") : 'a few minutes';
  var reqsRec = TASKS['ID'] && TASKS['ID'].requirements || '—';
  var instructionBox = document.getElementById('task-instructions');
  if (instructionBox) {
    document.getElementById('task-title').textContent = TASKS['ID'].name;
    instructionBox.innerHTML = "\n    <div class=\"info-box friendly-tip\" style=\"margin-bottom:10px;\">\n      <strong>\u26A0\uFE0F Ready to Start ".concat(TASKS['ID'].name, "?</strong>\n      <ul style=\"margin:8px 0 0 20px; text-align:left;\">\n        <li>").concat(requiredTextRec, "</li>\n        <li>Having problems? Email us instead of skipping</li>\n        <li>Estimated time: <strong>").concat(etaRec, "</strong></li>\n        <li>Requirements/tips: <em>").concat(reqsRec, "</em></li>\n      </ul>\n    </div>\n  ");
  }
  if (window.isSecureContext) startPreview();
}
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}
function checkSecureAndPermissions() {
  return _checkSecureAndPermissions.apply(this, arguments);
}
function _checkSecureAndPermissions() {
  _checkSecureAndPermissions = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var hint, cam, mic, permissionsChecked, camPerm, micPerm, _t4;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          if (window.isSecureContext) {
            _context5.n = 1;
            break;
          }
          hint = location.protocol === 'http:' ? 'This page must be served over https.' : 'This page cannot run from a local file.';
          throw {
            code: 'NOT_SECURE',
            message: hint
          };
        case 1:
          if (!(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia)) {
            _context5.n = 2;
            break;
          }
          throw {
            code: 'NO_MEDIADEVICES',
            message: 'This browser does not support in-page recording.'
          };
        case 2:
          if (window.MediaRecorder) {
            _context5.n = 3;
            break;
          }
          throw {
            code: 'NO_MEDIARECORDER',
            message: 'This browser does not support in-page recording.'
          };
        case 3:
          cam = 'unknown', mic = 'unknown';
          permissionsChecked = false;
          if (!(navigator.permissions && navigator.permissions.query)) {
            _context5.n = 9;
            break;
          }
          _context5.p = 4;
          _context5.n = 5;
          return navigator.permissions.query({
            name: 'camera'
          });
        case 5:
          camPerm = _context5.v;
          _context5.n = 6;
          return navigator.permissions.query({
            name: 'microphone'
          });
        case 6:
          micPerm = _context5.v;
          cam = camPerm && camPerm.state || 'unknown';
          mic = micPerm && micPerm.state || 'unknown';
          permissionsChecked = true;
          _context5.n = 8;
          break;
        case 7:
          _context5.p = 7;
          _t4 = _context5.v;
          console.warn('Permission query failed:', _t4);
        case 8:
          _context5.n = 10;
          break;
        case 9:
          console.warn('Permissions API not available; skipping permission pre-check.');
        case 10:
          return _context5.a(2, {
            cam: cam,
            mic: mic,
            permissionsChecked: permissionsChecked
          });
      }
    }, _callee5, null, [[4, 7]]);
  }));
  return _checkSecureAndPermissions.apply(this, arguments);
}
function showRecordingError(html) {
  var showFallback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var box = document.getElementById('recording-error');
  if (!box) return;
  box.style.display = 'block';
  box.innerHTML = html;
  if (showFallback) {
    var fb = document.getElementById('video-upload-fallback');
    if (fb) fb.style.display = 'block';
  }
}

// Enhanced file upload handling for the fallback option
function enhanceUploadFallback() {
  var fallbackDiv = document.getElementById('video-upload-fallback');
  if (fallbackDiv) {
    fallbackDiv.innerHTML = "\n  <h3>\uD83D\uDCC1 Upload a Recording Instead</h3>\n  <div class=\"info-box helpful\" style=\"margin: 15px 0;\">\n    <strong>Upload Instructions:</strong>\n    <ol style=\"margin: 8px 0 0 20px; text-align: left;\">\n      <li>Record a 30-60 second video/audio on your device</li>\n      <li>Accepted formats: MP4, MOV, WebM (video) or MP3, M4A, WAV (audio)</li>\n      <li>Maximum size: 50MB for MP4/MOV, 40MB for WebM, 25MB for audio</li>\n      <li>Select your file below</li>\n    </ol>\n  </div>\n  <input type=\"file\" \n         id=\"video-file-input\" \n         accept=\"video/mp4,video/quicktime,video/webm,video/*,audio/mp3,audio/mpeg,audio/m4a,audio/wav,audio/*,.mp4,.mov,.webm,.mp3,.m4a,.wav\" \n         style=\"margin: 15px 0; padding: 10px; border: 2px solid var(--gray-300); border-radius: 8px; width: 100%;\" />\n  <div id=\"file-info\" style=\"margin: 10px 0; font-weight: bold;\"></div>\n  <div class=\"button-group\">\n    <button class=\"button success\" id=\"upload-save-btn\" style=\"display:none;\">Upload This File</button>\n  </div>\n  <p style=\"font-size: 14px; color: var(--text-secondary); margin-top: 10px;\">\n    \uD83D\uDCA1 Tips: Use Camera app for video (iPhone/Android) or Voice Memos for audio (iPhone) or Voice Recorder (Android)\n  </p>\n";
  }
}
function bindUploadFallback() {
  var input = document.getElementById('video-file-input');
  var btn = document.getElementById('upload-save-btn');
  var info = document.getElementById('file-info');
  if (!input || !btn || !info) return;
  input.addEventListener('change', function () {
    var f = input.files && input.files[0];
    if (!f) return;
    if (!f.type.startsWith('video/') && !f.type.startsWith('audio/')) {
      alert('Please select a video or audio file');
      input.value = '';
      info.textContent = '';
      btn.style.display = 'none';
      return;
    }

    // Determine format for size limit
    var format = 'audio';
    if (f.type.includes('mp4') || f.name.toLowerCase().endsWith('.mp4')) format = 'mp4';else if (f.type.includes('quicktime') || f.name.toLowerCase().endsWith('.mov')) format = 'mov';else if (f.type.includes('webm') || f.name.toLowerCase().endsWith('.webm')) format = 'webm';else if (f.type.startsWith('video/')) format = 'other-video';
    var sizeLimits = {
      mp4: 50,
      mov: 50,
      webm: 40,
      'other-video': 40,
      audio: 25
    };
    var maxMB = sizeLimits[format];
    var sizeMB = f.size / (1024 * 1024);
    if (sizeMB > maxMB) {
      alert("File too large: ".concat(sizeMB.toFixed(1), "MB. Maximum for ").concat(format.toUpperCase(), " is ").concat(maxMB, "MB."));
      input.value = '';
      info.textContent = '';
      btn.style.display = 'none';
      return;
    }
    state.recording.currentBlob = f;
    info.textContent = "".concat(f.name, " (").concat(sizeMB.toFixed(1), "MB)");
    btn.style.display = 'inline-block';
  });
  btn.addEventListener('click', saveRecording);
}
function bindRecordingSkips() {
  var btn1 = document.getElementById('skip-recording-btn');
  if (btn1) btn1.addEventListener('click', function () {
    return showSkipDialog('ID');
  });
  var btn2 = document.getElementById('skip-recording-consent-btn');
  if (btn2) btn2.addEventListener('click', function () {
    return showSkipDialog('ID');
  });
}
function toggleRecording() {
  return _toggleRecording.apply(this, arguments);
}
function _toggleRecording() {
  _toggleRecording = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var btn, status, preview, stream, isVideoMode, perm, how, audioNotice, options, recordingFormat, formatTests, _i, _formatTests, test, _t5, _t6, _t7;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          btn = document.getElementById('record-btn');
          status = document.getElementById('recording-status');
          preview = document.getElementById('video-preview');
          if (state.recording.active) {
            _context6.n = 20;
            break;
          }
          _context6.p = 1;
          stream = state.recording.stream;
          isVideoMode = state.recording.isVideoMode;
          if (stream) {
            _context6.n = 11;
            break;
          }
          _context6.n = 2;
          return checkSecureAndPermissions();
        case 2:
          perm = _context6.v;
          if (!(perm.permissionsChecked && (perm.cam === 'denied' || perm.mic === 'denied'))) {
            _context6.n = 3;
            break;
          }
          how = isIOS() ? "Settings \u2192 Safari \u2192 Camera/Microphone \u2192 Allow for this site, then reload." : 'Click the camera icon in the address bar and allow camera and microphone, then reload.';
          showRecordingError("<strong>Camera or microphone is blocked</strong><p style=\"margin-top: 6px;\">Please allow access for this site. ".concat(how, "</p>"));
          return _context6.a(2);
        case 3:
          if (!perm.permissionsChecked) {
            console.warn('Permissions API unsupported; unable to pre-check camera/microphone permissions.');
          }
        case 4:
          _context6.p = 4;
          _context6.n = 5;
          return navigator.mediaDevices.getUserMedia({
            video: {
              width: 640,
              height: 480
            },
            audio: true
          });
        case 5:
          stream = _context6.v;
          isVideoMode = true;
          _context6.n = 10;
          break;
        case 6:
          _context6.p = 6;
          _t5 = _context6.v;
          console.warn('Video capture failed, trying audio-only:', _t5);
          _context6.p = 7;
          _context6.n = 8;
          return navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false
          });
        case 8:
          stream = _context6.v;
          isVideoMode = false;
          audioNotice = document.createElement('div');
          audioNotice.className = 'info-box helpful';
          audioNotice.innerHTML = "\n            <strong>\uD83D\uDCE2 Audio-Only Mode</strong>\n            <p>Recording voice only (camera not available). This is fine for the task!</p>\n          ";
          document.getElementById('recording-content').insertBefore(audioNotice, document.querySelector('.recording-controls'));
          _context6.n = 10;
          break;
        case 9:
          _context6.p = 9;
          _t6 = _context6.v;
          console.error('Audio capture also failed:', _t6);
          throw _t6;
        case 10:
          state.recording.stream = stream;
          state.recording.isVideoMode = isVideoMode;
        case 11:
          if (isVideoMode) {
            preview.srcObject = stream;
            preview.style.display = 'block';
            preview.play()["catch"](function () {});
          } else {
            preview.style.display = 'none';
            status.textContent = '🎤 Audio ready to record';
          }
          if (window.MediaRecorder) {
            _context6.n = 12;
            break;
          }
          showRecordingError("<strong>Recording not supported in this browser</strong><p style=\"margin-top: 6px;\">Please record using your device's camera or voice recorder, then upload the file below.</p>");
          return _context6.a(2);
        case 12:
          // Determine best format based on mode and browser support
          // Detect best format with size optimization
          options = {};
          recordingFormat = 'webm'; // default
          if (!isVideoMode) {
            _context6.n = 16;
            break;
          }
          formatTests = [{
            mime: 'video/mp4;codecs=h264,aac',
            format: 'mp4',
            ext: 'mp4'
          }, {
            mime: 'video/webm;codecs=vp9,opus',
            format: 'webm-vp9',
            ext: 'webm'
          }, {
            mime: 'video/webm;codecs=vp8,opus',
            format: 'webm-vp8',
            ext: 'webm'
          }, {
            mime: 'video/webm',
            format: 'webm',
            ext: 'webm'
          }];
          _i = 0, _formatTests = formatTests;
        case 13:
          if (!(_i < _formatTests.length)) {
            _context6.n = 15;
            break;
          }
          test = _formatTests[_i];
          if (!(MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(test.mime))) {
            _context6.n = 14;
            break;
          }
          options.mimeType = test.mime;
          recordingFormat = test.ext;
          console.log("Recording format selected: ".concat(test.format, " (").concat(test.mime, ")"));
          return _context6.a(3, 15);
        case 14:
          _i++;
          _context6.n = 13;
          break;
        case 15:
          // Add bitrate limits to reduce file size (CRITICAL)
          options.videoBitsPerSecond = 500000; // 500 kbps video
          options.audioBitsPerSecond = 64000; // 64 kbps audio

          // Store format for later use
          state.recording.recordingFormat = recordingFormat;
          state.recording.recordingMimeType = options.mimeType || 'video/webm';
          _context6.n = 17;
          break;
        case 16:
          // Audio-only formats
          if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            options.mimeType = 'audio/webm;codecs=opus';
          } else if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
            options.mimeType = 'audio/ogg;codecs=opus';
          } else if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported('audio/mp4')) {
            options.mimeType = 'audio/mp4';
          }

          // Store audio format info
          state.recording.recordingFormat = 'webm';
          state.recording.recordingMimeType = options.mimeType || 'audio/webm';
        case 17:
          state.recording.mediaRecorder = new MediaRecorder(stream, options);
          state.recording.chunks = [];
          state.recording.mediaRecorder.ondataavailable = function (e) {
            if (e.data && e.data.size > 0) state.recording.chunks.push(e.data);
          };
          state.recording.mediaRecorder.onstop = function () {
            try {
              revokeRecordedURL();
              var mimeType = state.recording.recordingMimeType || (isVideoMode ? 'video/webm' : 'audio/webm');
              var blob = new Blob(state.recording.chunks, {
                type: mimeType
              });

              // Attach format metadata to blob for upload
              blob.recordingFormat = state.recording.recordingFormat || (isVideoMode ? 'webm' : 'webm');
              blob.recordingMimeType = mimeType;
              if (!isVideoMode) {
                var audioPlayer = document.createElement('audio');
                audioPlayer.id = 'recorded-audio';
                audioPlayer.controls = true;
                audioPlayer.style.width = '100%';
                audioPlayer.src = URL.createObjectURL(blob);
                var container = document.getElementById('recorded-video').parentElement;
                var existingAudio = document.getElementById('recorded-audio');
                if (existingAudio) existingAudio.remove();
                container.insertBefore(audioPlayer, document.getElementById('recorded-video'));
                document.getElementById('recorded-video').style.display = 'none';
              } else {
                var url = URL.createObjectURL(blob);
                var recordedEl = document.getElementById('recorded-video');
                recordedEl.src = url;
                recordedEl.style.display = 'block';
                preview.style.display = 'none';
              }
              document.getElementById('record-btn').style.display = 'none';
              document.getElementById('rerecord-btn').style.display = 'inline-block';
              document.getElementById('save-recording-btn').style.display = 'inline-block';
              var format = blob.recordingFormat === 'mp4' ? 'MP4' : isVideoMode ? 'WebM' : 'Audio';
              var sizeKB = Math.round(blob.size / 1024);
              var sizeMB = (blob.size / (1024 * 1024)).toFixed(1);
              status.textContent = "Recording complete (".concat(format, ", ").concat(sizeMB, "MB)");
              status.className = 'recording-status recorded';
              if (blob.size > 25 * 1024 * 1024) {
                var warningDiv = document.createElement('div');
                warningDiv.className = 'info-box warning';
                warningDiv.innerHTML = "\n        <strong>\u26A0\uFE0F Large file warning</strong>\n        <p>Your recording is ".concat(sizeMB, "MB. Files over 25MB may fail to upload. Consider re-recording with a shorter description (30-45 seconds).</p>\n      ");
                document.querySelector('.recording-controls').appendChild(warningDiv);
              }
              state.recording.currentBlob = blob;
            } catch (e) {
              console.error('Finalize error:', e);
              alert('There was an issue finalizing the recording. Please try the upload option below.');
            }
          };
          state.recording.mediaRecorder.start();
          state.recording.active = true;
          btn.textContent = 'Stop Recording';
          btn.className = 'button danger';
          status.textContent = isVideoMode ? '🔴 Recording video...' : '🎤 Recording audio...';
          status.className = 'recording-status recording';
          startRecordingTimer();
          _context6.n = 19;
          break;
        case 18:
          _context6.p = 18;
          _t7 = _context6.v;
          console.error('Recording error:', _t7);
          handleRecordingError(_t7);
        case 19:
          _context6.n = 21;
          break;
        case 20:
          // Stop recording (existing code)
          try {
            if (state.recording.mediaRecorder && state.recording.mediaRecorder.state !== 'inactive') {
              state.recording.mediaRecorder.stop();
            }
          } catch (e) {
            console.warn('Stop error:', e);
          } finally {
            if (state.recording.stream) {
              try {
                state.recording.stream.getTracks().forEach(function (track) {
                  return track.stop();
                });
              } catch (e) {}
            }
            state.recording.active = false;
            btn.textContent = 'Start Recording';
            btn.className = 'button danger';
            stopRecordingTimer();
          }
        case 21:
          return _context6.a(2);
      }
    }, _callee6, null, [[7, 9], [4, 6], [1, 18]]);
  }));
  return _toggleRecording.apply(this, arguments);
}
function handleRecordingError(err) {
  var name = err && (err.name || err.code) || 'Unknown';

  // More helpful error messages
  var errorMessages = {
    'NOT_SECURE': {
      title: 'Secure connection required',
      message: 'This page must be served over HTTPS for recording to work.',
      showUpload: true
    },
    'NotAllowedError': {
      title: 'Permission needed',
      message: 'Please allow camera and/or microphone access. If no prompt appeared, check your browser settings and refresh after granting permission.',
      showUpload: true
    },
    'NotFoundError': {
      title: 'No recording device found',
      message: 'No camera or microphone detected. You can upload a recording instead.',
      showUpload: true
    },
    'NotReadableError': {
      title: 'Device in use',
      message: 'Camera or microphone is being used by another application. Please close other apps and try again.',
      showUpload: true
    },
    'NO_MEDIARECORDER': {
      title: 'Recording not supported',
      message: 'This browser cannot record directly. Use your device\'s camera or voice recorder and upload the file below.',
      showUpload: true
    }
  };
  var errorInfo = errorMessages[name] || {
    title: 'Recording not available',
    message: "".concat(err && err.message || 'Recording failed', ". You can upload a file instead."),
    showUpload: true
  };
  showRecordingError("<strong>".concat(errorInfo.title, "</strong>\n     <p style=\"margin-top: 6px;\">").concat(errorInfo.message, "</p>"), errorInfo.showUpload);
}
function reRecord() {
  cleanupRecording(true)["finally"](function () {
    return updateRecordingImage();
  });
}

// Updated saveRecording function with Google Drive upload
// Updated saveRecording function with enhanced logging
function saveRecording() {
  return _saveRecording.apply(this, arguments);
} // Updated continueWithoutUpload with enhanced logging
function _saveRecording() {
  _saveRecording = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var saveBtn, originalText, status, uploadProgress, recType, uploadResult, logData, _t8;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          if (state.recording.currentBlob) {
            _context7.n = 1;
            break;
          }
          alert('Please record or upload a recording first.');
          return _context7.a(2);
        case 1:
          saveBtn = document.getElementById('save-recording-btn');
          originalText = saveBtn.textContent;
          saveBtn.disabled = true;
          saveBtn.textContent = 'Processing...';
          status = document.getElementById('recording-status');
          status.textContent = '⚙️ Processing recording...';
          status.className = 'recording-status recording';
          uploadProgress = document.getElementById('upload-progress');
          uploadProgress.style.display = 'block';
          recType = state.recording.isVideoMode ? 'video' : state.recording.currentBlob && state.recording.currentBlob.type && state.recording.currentBlob.type.startsWith('audio') ? 'audio' : 'video';
          sendToSheets({
            action: 'image_recorded',
            sessionCode: state.sessionCode,
            imageNumber: state.recording.currentImage + 1,
            timestamp: new Date().toISOString(),
            recordingType: recType
          });
          sendToSheets({
            action: 'video_recorded',
            sessionCode: state.sessionCode,
            imageNumber: state.recording.currentImage + 1,
            timestamp: new Date().toISOString(),
            recordingType: recType
          });
          _context7.p = 2;
          _context7.n = 3;
          return uploadVideoToDrive(state.recording.currentBlob, state.sessionCode, state.recording.currentImage + 1);
        case 3:
          uploadResult = _context7.v;
          if (!uploadResult.success) {
            _context7.n = 4;
            break;
          }
          // Store the upload info with method tracking
          state.recording.recordings.push({
            image: state.recording.currentImage + 1,
            blob: state.recording.currentBlob,
            timestamp: new Date().toISOString(),
            driveFileId: uploadResult.fileId,
            driveFileUrl: uploadResult.fileUrl,
            filename: uploadResult.filename,
            uploadMethod: uploadResult.uploadMethod,
            recordingType: state.recording.isVideoMode ? 'video' : 'audio',
            mimeType: state.recording.currentBlob.type
          });

          // Enhanced logging to Google Sheets
          logData = {
            action: 'image_recorded_and_uploaded',
            sessionCode: state.sessionCode,
            imageNumber: state.recording.currentImage + 1,
            driveFileId: uploadResult.fileId,
            filename: uploadResult.filename,
            timestamp: new Date().toISOString(),
            deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
            // Enhanced fields
            uploadMethod: uploadResult.uploadMethod,
            fileSize: Math.round(state.recording.currentBlob.size / 1024),
            uploadStatus: 'success',
            recordingType: state.recording.isVideoMode ? 'video' : 'audio',
            mimeType: state.recording.currentBlob.type
          }; // Send to both the task logging and video upload logging
          sendToSheets(logData);

          // Also log specifically to video uploads table
          sendToSheets({
            action: 'log_video_upload',
            sessionCode: state.sessionCode,
            imageNumber: state.recording.currentImage + 1,
            filename: uploadResult.filename,
            fileId: uploadResult.fileId,
            fileUrl: uploadResult.fileUrl,
            fileSize: Math.round(state.recording.currentBlob.size / 1024),
            uploadTime: new Date().toISOString(),
            uploadMethod: uploadResult.uploadMethod,
            uploadStatus: 'success',
            recordingType: state.recording.isVideoMode ? 'video' : 'audio',
            mimeType: state.recording.currentBlob.type
          });
          status.textContent = "\u2705 Upload complete via ".concat(uploadResult.uploadMethod, "!");
          status.className = 'recording-status recorded';
          uploadProgress.style.display = 'none';
          setTimeout(function () {
            if (state.recording.currentImage === 0) {
              state.recording.currentImage = 1;
              updateRecordingImage();
            } else {
              completeTask('ID');
            }
          }, 1000);
          _context7.n = 5;
          break;
        case 4:
          throw new Error(uploadResult.error || 'Upload failed');
        case 5:
          _context7.n = 7;
          break;
        case 6:
          _context7.p = 6;
          _t8 = _context7.v;
          console.error('Upload error:', _t8);

          // Enhanced error logging
          sendToSheets({
            action: 'log_video_upload_error',
            sessionCode: state.sessionCode,
            imageNumber: state.recording.currentImage + 1,
            error: _t8.message,
            timestamp: new Date().toISOString(),
            deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
            attemptedMethod: 'drive',
            recordingType: state.recording.isVideoMode ? 'video' : 'audio',
            mimeType: state.recording.currentBlob.type
          });
          status.textContent = '⚠️ Upload failed. Retrying...';
          status.className = 'recording-status recording';
          enqueueFailedUpload(state.recording.currentBlob, state.sessionCode, state.recording.currentImage + 1);
        case 7:
          _context7.p = 7;
          saveBtn.disabled = false;
          saveBtn.textContent = originalText;
          return _context7.f(7);
        case 8:
          return _context7.a(2);
      }
    }, _callee7, null, [[2, 6, 7, 8]]);
  }));
  return _saveRecording.apply(this, arguments);
}
function continueWithoutUpload() {
  if (confirm('Continue without uploading the video? The recording will only be saved locally in your browser.')) {
    state.recording.recordings.push({
      image: state.recording.currentImage + 1,
      blob: state.recording.currentBlob,
      timestamp: new Date().toISOString(),
      uploadSkipped: true,
      uploadMethod: 'local_only',
      recordingType: state.recording.isVideoMode ? 'video' : 'audio',
      mimeType: state.recording.currentBlob.type
    });

    // Enhanced logging for skipped upload
    sendToSheets({
      action: 'image_recorded_no_upload',
      sessionCode: state.sessionCode,
      imageNumber: state.recording.currentImage + 1,
      reason: 'Upload failed - continued locally',
      timestamp: new Date().toISOString(),
      deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
      uploadMethod: 'local_only',
      uploadStatus: 'skipped',
      recordingType: state.recording.isVideoMode ? 'video' : 'audio',
      mimeType: state.recording.currentBlob.type
    });
    if (state.recording.currentImage === 0) {
      state.recording.currentImage = 1;
      updateRecordingImage();
    } else {
      completeTask('ID');
    }
    document.getElementById('recording-error').style.display = 'none';
  }
}

// Enhanced upload function - uses Google Drive for uploads
function getExtensionFromMime(mime) {
  if (!mime) return 'bin';
  mime = mime.toLowerCase();
  if (mime.includes('mp4') || mime.includes('m4a')) return 'mp4';
  if (mime.includes('ogg')) return 'ogg';
  if (mime.includes('wav')) return 'wav';
  if (mime.includes('webm')) return 'webm';
  return 'bin';
}
function uploadToCloudinary(_x2, _x3, _x4) {
  return _uploadToCloudinary.apply(this, arguments);
} // Makes a valid 0.8s WebM by recording a tiny canvas
function _uploadToCloudinary() {
  _uploadToCloudinary = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(videoBlob, sessionCode, imageNumber) {
    var formData, timestamp, filename, response, responseText, errorDetail, errorJson, result, _t9;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          console.log('Starting Cloudinary upload...');
          console.log('Config check:', {
            cloudName: CONFIG.CLOUDINARY_CLOUD_NAME,
            uploadPreset: CONFIG.CLOUDINARY_UPLOAD_PRESET
          });

          // Verify config
          if (CONFIG.CLOUDINARY_CLOUD_NAME) {
            _context8.n = 1;
            break;
          }
          throw new Error('Cloudinary cloud name not configured');
        case 1:
          if (CONFIG.CLOUDINARY_UPLOAD_PRESET) {
            _context8.n = 2;
            break;
          }
          throw new Error('Cloudinary upload preset not configured');
        case 2:
          // Create form data
          formData = new FormData();
          formData.append('file', videoBlob);
          formData.append('upload_preset', CONFIG.CLOUDINARY_UPLOAD_PRESET);

          // Create a unique filename
          timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          filename = "".concat(sessionCode, "/image").concat(imageNumber, "_").concat(timestamp);
          formData.append('public_id', filename);

          // Set the folder
          formData.append('folder', 'spatial-cognition-videos');

          // Log what we're sending
          console.log('Sending to Cloudinary:', {
            url: "https://api.cloudinary.com/v1_1/".concat(CONFIG.CLOUDINARY_CLOUD_NAME, "/video/upload"),
            preset: CONFIG.CLOUDINARY_UPLOAD_PRESET,
            folder: 'spatial-cognition-videos'
          });

          // Actually upload
          _context8.n = 3;
          return fetch("https://api.cloudinary.com/v1_1/".concat(CONFIG.CLOUDINARY_CLOUD_NAME, "/video/upload"), {
            method: 'POST',
            body: formData
          });
        case 3:
          response = _context8.v;
          _context8.n = 4;
          return response.text();
        case 4:
          responseText = _context8.v;
          console.log('Cloudinary response:', responseText);
          if (response.ok) {
            _context8.n = 5;
            break;
          }
          // Parse error details
          errorDetail = responseText;
          try {
            errorJson = JSON.parse(responseText);
            errorDetail = errorJson.error && errorJson.error.message || responseText;
          } catch (e) {
            // responseText is not JSON
          }
          console.error('Cloudinary error details:', errorDetail);
          throw new Error("Cloudinary error: ".concat(errorDetail));
        case 5:
          // Parse successful response
          result = JSON.parse(responseText);
          console.log('Cloudinary upload successful:', result);
          return _context8.a(2, {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            size: result.bytes,
            duration: result.duration
          });
        case 6:
          _context8.p = 6;
          _t9 = _context8.v;
          console.error('Cloudinary upload failed:', _t9);
          return _context8.a(2, {
            success: false,
            error: _t9.message
          });
      }
    }, _callee8, null, [[0, 6]]);
  }));
  return _uploadToCloudinary.apply(this, arguments);
}
function makeTinyTestVideo() {
  return _makeTinyTestVideo.apply(this, arguments);
}
function _makeTinyTestVideo() {
  _makeTinyTestVideo = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
    var _MediaRecorder, _MediaRecorder$isType, _MediaRecorder2, _MediaRecorder2$isTyp, _canvas$captureStream;
    var _ref3,
      _ref3$ms,
      ms,
      _ref3$fps,
      fps,
      canvas,
      ctx,
      mime,
      stream,
      rec,
      chunks,
      t,
      drawId,
      _args9 = arguments;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.n) {
        case 0:
          _ref3 = _args9.length > 0 && _args9[0] !== undefined ? _args9[0] : {}, _ref3$ms = _ref3.ms, ms = _ref3$ms === void 0 ? 800 : _ref3$ms, _ref3$fps = _ref3.fps, fps = _ref3$fps === void 0 ? 10 : _ref3$fps;
          canvas = document.createElement('canvas');
          canvas.width = 64;
          canvas.height = 64;
          ctx = canvas.getContext('2d'); // Pick a supported WebM mime
          mime = (_MediaRecorder = MediaRecorder) !== null && _MediaRecorder !== void 0 && (_MediaRecorder$isType = _MediaRecorder.isTypeSupported) !== null && _MediaRecorder$isType !== void 0 && _MediaRecorder$isType.call(_MediaRecorder, 'video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : (_MediaRecorder2 = MediaRecorder) !== null && _MediaRecorder2 !== void 0 && (_MediaRecorder2$isTyp = _MediaRecorder2.isTypeSupported) !== null && _MediaRecorder2$isTyp !== void 0 && _MediaRecorder2$isTyp.call(_MediaRecorder2, 'video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm';
          stream = (_canvas$captureStream = canvas.captureStream) === null || _canvas$captureStream === void 0 ? void 0 : _canvas$captureStream.call(canvas, fps);
          if (stream) {
            _context9.n = 1;
            break;
          }
          throw new Error('Canvas captureStream is not supported in this browser');
        case 1:
          rec = new MediaRecorder(stream, {
            mimeType: mime,
            videoBitsPerSecond: 250000
          });
          chunks = [];
          rec.ondataavailable = function (e) {
            if (e.data && e.data.size > 0) chunks.push(e.data);
          };

          // Animate a little square so there are multiple frames
          t = 0;
          drawId = setInterval(function () {
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, 64, 64);
            ctx.fillStyle = '#fff';
            ctx.fillRect(t * 3 % 64, t * 2 % 64, 16, 16);
            t++;
          }, Math.round(1000 / fps));
          rec.start(100);
          _context9.n = 2;
          return new Promise(function (r) {
            return setTimeout(r, ms);
          });
        case 2:
          rec.stop();
          _context9.n = 3;
          return new Promise(function (r) {
            return rec.onstop = r;
          });
        case 3:
          clearInterval(drawId);
          stream.getTracks().forEach(function (tr) {
            return tr.stop();
          });
          return _context9.a(2, new Blob(chunks, {
            type: 'video/webm'
          }));
      }
    }, _callee9);
  }));
  return _makeTinyTestVideo.apply(this, arguments);
}
function testCloudinaryUpload() {
  return _testCloudinaryUpload.apply(this, arguments);
}
function _testCloudinaryUpload() {
  _testCloudinaryUpload = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
    var blob, input, file, result, _t0;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          console.log('🧪 Testing Cloudinary setup...');
          console.log('Config check:', {
            cloudName: CONFIG.CLOUDINARY_CLOUD_NAME,
            uploadPreset: CONFIG.CLOUDINARY_UPLOAD_PRESET,
            folder: 'spatial-cognition-videos'
          });
          if (!(!CONFIG.CLOUDINARY_CLOUD_NAME || !CONFIG.CLOUDINARY_UPLOAD_PRESET)) {
            _context0.n = 1;
            break;
          }
          alert('Set CONFIG.CLOUDINARY_CLOUD_NAME and CONFIG.CLOUDINARY_UPLOAD_PRESET first.');
          return _context0.a(2);
        case 1:
          _context0.p = 1;
          _context0.n = 2;
          return makeTinyTestVideo();
        case 2:
          blob = _context0.v;
          _context0.n = 6;
          break;
        case 3:
          _context0.p = 3;
          _t0 = _context0.v;
          // Fallback: let you pick any small mp4 or webm
          input = document.createElement('input');
          input.type = 'file';
          input.accept = 'video/mp4,video/webm,video/quicktime';
          input.click();
          _context0.n = 4;
          return new Promise(function (resolve) {
            return input.onchange = function () {
              var _input$files;
              return resolve((_input$files = input.files) === null || _input$files === void 0 ? void 0 : _input$files[0]);
            };
          });
        case 4:
          file = _context0.v;
          if (file) {
            _context0.n = 5;
            break;
          }
          alert('No file selected.');
          return _context0.a(2);
        case 5:
          blob = file;
        case 6:
          _context0.n = 7;
          return uploadToCloudinary(blob, 'TEST_' + Date.now(), 1);
        case 7:
          result = _context0.v;
          if (result.success) {
            console.log('✅ SUCCESS! Video URL:', result.url);
            alert('Cloudinary is working! URL: ' + result.url);
          } else {
            console.error('❌ FAILED:', result.error);
            alert('Cloudinary setup has an issue: ' + result.error);
          }
        case 8:
          return _context0.a(2);
      }
    }, _callee0, null, [[1, 3]]);
  }));
  return _testCloudinaryUpload.apply(this, arguments);
}
function uploadVideoToDrive(_x5, _x6, _x7) {
  return _uploadVideoToDrive.apply(this, arguments);
}
function _uploadVideoToDrive() {
  _uploadVideoToDrive = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(videoBlob, sessionCode, imageNumber) {
    var cloudinaryResult, _t1;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          _context1.p = 0;
          updateUploadProgress(5, 'Starting upload...');

          // TRY CLOUDINARY FIRST (NEW!)
          console.log('Trying Cloudinary first...');
          updateUploadProgress(10, 'Uploading to cloud storage...');
          _context1.n = 1;
          return uploadToCloudinary(videoBlob, sessionCode, imageNumber);
        case 1:
          cloudinaryResult = _context1.v;
          if (!cloudinaryResult.success) {
            _context1.n = 3;
            break;
          }
          updateUploadProgress(100, 'Upload complete!');

          // Log to Google Sheets (just the URL, not the video data)
          _context1.n = 2;
          return sendToSheets({
            action: 'log_video_upload',
            sessionCode: sessionCode,
            imageNumber: imageNumber,
            filename: "image".concat(imageNumber, "_").concat(Date.now(), ".webm"),
            fileId: cloudinaryResult.publicId,
            fileUrl: cloudinaryResult.url,
            fileSize: Math.round(cloudinaryResult.size / 1024),
            // KB
            uploadTime: new Date().toISOString(),
            uploadMethod: 'cloudinary',
            uploadStatus: 'success'
          });
        case 2:
          return _context1.a(2, {
            success: true,
            filename: cloudinaryResult.publicId,
            fileId: cloudinaryResult.publicId,
            fileUrl: cloudinaryResult.url,
            uploadMethod: 'cloudinary'
          });
        case 3:
          console.log('Cloudinary failed, trying Google Drive fallback...');
          updateUploadProgress(30, 'Trying backup upload method...');

          // YOUR EXISTING GOOGLE DRIVE CODE STAYS AS FALLBACK
          // (Keep your existing code here as backup)
          _context1.n = 4;
          return uploadToGoogleDrive(videoBlob, sessionCode, imageNumber);
        case 4:
          return _context1.a(2, _context1.v);
        case 5:
          _context1.n = 7;
          break;
        case 6:
          _context1.p = 6;
          _t1 = _context1.v;
          console.error('All upload methods failed:', _t1);
          return _context1.a(2, {
            success: false,
            error: _t1.message
          });
        case 7:
          return _context1.a(2);
      }
    }, _callee1, null, [[0, 6]]);
  }));
  return _uploadVideoToDrive.apply(this, arguments);
}
function uploadToGoogleDrive(_x8, _x9, _x0) {
  return _uploadToGoogleDrive.apply(this, arguments);
} // Add this NEW function after uploadVideoToDrive
function _uploadToGoogleDrive() {
  _uploadToGoogleDrive = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(videoBlob, sessionCode, imageNumber) {
    var videoFormat, ext, sizeLimits, maxSize, currentMB, maxMB, base64DataUrl, base64VideoData, uploadData, response, result, contentType, text, _t10, _t11;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          _context10.p = 0;
          updateUploadProgress(15, 'Preparing upload…');

          // Detect format from blob metadata, with multiple fallbacks
          videoFormat = 'webm'; // ultimate fallback
          // Priority 1: Check blob metadata we added
          if (videoBlob.recordingFormat) {
            videoFormat = videoBlob.recordingFormat;
          }
          // Priority 2: Check MIME type
          else if (videoBlob.type) {
            if (videoBlob.type.includes('mp4') || videoBlob.type.includes('mpeg4')) {
              videoFormat = 'mp4';
            } else if (videoBlob.type.includes('quicktime')) {
              videoFormat = 'mov';
            } else if (videoBlob.type.includes('webm')) {
              videoFormat = 'webm';
            }
          }
          // Priority 3: Check file name if this is an uploaded file
          else if (videoBlob.name) {
            ext = videoBlob.name.split('.').pop().toLowerCase();
            if (['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext)) {
              videoFormat = ext;
            }
          }
          console.log("Upload format detected: ".concat(videoFormat, ", size: ").concat((videoBlob.size / 1024 / 1024).toFixed(2), "MB"));

          // Format-specific size limits
          sizeLimits = {
            'mp4': 55 * 1024 * 1024,
            // 55MB for MP4 (more compressed)
            'mov': 50 * 1024 * 1024,
            // 50MB for MOV
            'webm': 40 * 1024 * 1024,
            // 40MB for WebM (less compressed)
            'avi': 35 * 1024 * 1024,
            // 35MB for AVI
            'mkv': 40 * 1024 * 1024 // 40MB for MKV
          };
          maxSize = sizeLimits[videoFormat] || 35 * 1024 * 1024;
          if (!(videoBlob.size > maxSize)) {
            _context10.n = 1;
            break;
          }
          currentMB = (videoBlob.size / (1024 * 1024)).toFixed(1);
          maxMB = (maxSize / (1024 * 1024)).toFixed(0);
          throw new Error("Video too large: ".concat(currentMB, "MB. Maximum for ").concat(videoFormat.toUpperCase(), ": ").concat(maxMB, "MB. Please record a shorter video (30-45 seconds)."));
        case 1:
          updateUploadProgress(20, "Converting ".concat(videoFormat, " for upload..."));
          _context10.n = 2;
          return blobToBase64(videoBlob);
        case 2:
          base64DataUrl = _context10.v;
          base64VideoData = base64DataUrl.split(',')[1] || base64DataUrl.split(',').pop();
          updateUploadProgress(25, 'Encoding complete...');
          uploadData = {
            action: 'upload_video',
            sessionCode: sessionCode,
            imageNumber: imageNumber,
            videoData: base64VideoData,
            videoFormat: videoFormat,
            // CRITICAL: Send format to backend
            mimeType: videoBlob.type || '',
            // Send MIME type too
            fileName: videoBlob.name || '',
            // Send filename if available
            fileSize: videoBlob.size,
            timestamp: new Date().toISOString()
          };
          updateUploadProgress(30, "Uploading ".concat(videoFormat.toUpperCase(), " to Google Drive..."));
          _context10.n = 3;
          return fetch(CONFIG.SHEETS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(uploadData)
          });
        case 3:
          response = _context10.v;
          updateUploadProgress(75, 'Processing response...');
          contentType = response.headers.get('content-type');
          if (!(contentType && contentType.includes('application/json'))) {
            _context10.n = 5;
            break;
          }
          _context10.n = 4;
          return response.json();
        case 4:
          result = _context10.v;
          _context10.n = 9;
          break;
        case 5:
          _context10.n = 6;
          return response.text();
        case 6:
          text = _context10.v;
          _context10.p = 7;
          result = JSON.parse(text);
          _context10.n = 9;
          break;
        case 8:
          _context10.p = 8;
          _t10 = _context10.v;
          console.error('Response text:', text);
          throw new Error('Invalid response format from server');
        case 9:
          if (!(!response.ok || !result.success)) {
            _context10.n = 10;
            break;
          }
          throw new Error(result.error || result.details || "Upload failed (".concat(response.status, ")"));
        case 10:
          updateUploadProgress(100, 'Upload complete!');
          return _context10.a(2, {
            success: true,
            filename: result.filename,
            fileId: result.fileId,
            fileUrl: result.fileUrl,
            format: result.format || videoFormat
          });
        case 11:
          _context10.p = 11;
          _t11 = _context10.v;
          console.error('Google Drive upload error:', _t11);
          return _context10.a(2, {
            success: false,
            error: _t11.message || String(_t11)
          });
      }
    }, _callee10, null, [[7, 8], [0, 11]]);
  }));
  return _uploadToGoogleDrive.apply(this, arguments);
}
function updateUploadProgress(percent, message) {
  var progressDiv = document.getElementById('upload-progress');
  var progressFill = document.getElementById('upload-progress-fill');
  var status = document.getElementById('upload-status');
  if (progressDiv) progressDiv.style.display = 'block';
  if (progressFill) progressFill.style.width = "".concat(percent, "%");
  if (status) status.textContent = "".concat(percent, "%");

  // Update the progress message
  var progressText = progressDiv ? progressDiv.querySelector('div[style*="font-weight: bold"]') : null;
  if (progressText && message) {
    progressText.textContent = message;
  }
}

// Helper function to convert blob to base64
function blobToBase64(blob) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onload = function () {
      return resolve(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
function enqueueFailedUpload(blob, sessionCode, imageNumber) {
  state.uploadQueue.push({
    blob: blob,
    sessionCode: sessionCode,
    imageNumber: imageNumber,
    attempts: 0
  });
  processUploadQueue();
}
function processUploadQueue() {
  return _processUploadQueue.apply(this, arguments);
}
function _processUploadQueue() {
  _processUploadQueue = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11() {
    var item, uploadResult, _t12;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.p = _context11.n) {
        case 0:
          if (!(state.processingUpload || state.uploadQueue.length === 0)) {
            _context11.n = 1;
            break;
          }
          return _context11.a(2);
        case 1:
          state.processingUpload = true;
          item = state.uploadQueue[0];
          _context11.p = 2;
          _context11.n = 3;
          return uploadVideoToDrive(item.blob, item.sessionCode, item.imageNumber);
        case 3:
          uploadResult = _context11.v;
          if (!uploadResult.success) {
            _context11.n = 4;
            break;
          }
          handleUploadSuccess(uploadResult, item.imageNumber, item.blob);
          state.uploadQueue.shift();
          _context11.n = 5;
          break;
        case 4:
          throw new Error(uploadResult.error || 'Upload failed');
        case 5:
          _context11.n = 8;
          break;
        case 6:
          _context11.p = 6;
          _t12 = _context11.v;
          item.attempts++;
          if (!(item.attempts < 3)) {
            _context11.n = 7;
            break;
          }
          setTimeout(function () {
            state.processingUpload = false;
            processUploadQueue();
          }, 5000 * item.attempts);
          return _context11.a(2);
        case 7:
          state.uploadQueue.shift();
          showUploadError(_t12, item.imageNumber, item.blob);
        case 8:
          state.processingUpload = false;
          if (state.uploadQueue.length > 0) processUploadQueue();
        case 9:
          return _context11.a(2);
      }
    }, _callee11, null, [[2, 6]]);
  }));
  return _processUploadQueue.apply(this, arguments);
}
function handleUploadSuccess(uploadResult, imageNumber, blob) {
  state.recording.recordings.push({
    image: imageNumber,
    blob: blob,
    timestamp: new Date().toISOString(),
    driveFileId: uploadResult.fileId,
    driveFileUrl: uploadResult.fileUrl,
    filename: uploadResult.filename,
    uploadMethod: uploadResult.uploadMethod,
    recordingType: state.recording.isVideoMode ? 'video' : 'audio',
    mimeType: blob.type
  });
  var logData = {
    action: 'image_recorded_and_uploaded',
    sessionCode: state.sessionCode,
    imageNumber: imageNumber,
    driveFileId: uploadResult.fileId,
    filename: uploadResult.filename,
    timestamp: new Date().toISOString(),
    deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
    uploadMethod: uploadResult.uploadMethod,
    fileSize: Math.round(blob.size / 1024),
    uploadStatus: 'success',
    recordingType: state.recording.isVideoMode ? 'video' : 'audio',
    mimeType: blob.type
  };
  sendToSheets(logData);
  sendToSheets({
    action: 'log_video_upload',
    sessionCode: state.sessionCode,
    imageNumber: imageNumber,
    filename: uploadResult.filename,
    fileId: uploadResult.fileId,
    fileUrl: uploadResult.fileUrl,
    fileSize: Math.round(blob.size / 1024),
    uploadTime: new Date().toISOString(),
    uploadMethod: uploadResult.uploadMethod,
    uploadStatus: 'success',
    recordingType: state.recording.isVideoMode ? 'video' : 'audio',
    mimeType: blob.type
  });
  var status = document.getElementById('recording-status');
  status.textContent = "\u2705 Upload complete via ".concat(uploadResult.uploadMethod, "!");
  status.className = 'recording-status recorded';
  document.getElementById('upload-progress').style.display = 'none';
  setTimeout(function () {
    if (imageNumber === 1 && state.recording.currentImage === 0) {
      state.recording.currentImage = 1;
      updateRecordingImage();
    } else {
      completeTask('ID');
    }
  }, 1000);
}
function showUploadError(error, imageNumber, blob) {
  sendToSheets({
    action: 'log_video_upload_error',
    sessionCode: state.sessionCode,
    imageNumber: imageNumber,
    error: error.message,
    timestamp: new Date().toISOString(),
    deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
    attemptedMethod: 'drive',
    recordingType: state.recording.isVideoMode ? 'video' : 'audio',
    mimeType: blob.type
  });
  var uploadProgress = document.getElementById('upload-progress');
  uploadProgress.style.display = 'none';
  var errorDiv = document.getElementById('recording-error');
  errorDiv.style.display = 'block';
  errorDiv.innerHTML = "\n      <strong>Upload failed</strong>\n      <p style=\"margin-top: 6px;\">Error: ".concat(error.message, ". You can try again or continue without uploading. The video is saved locally in your browser.</p>\n      <div class=\"button-group\" style=\"margin-top: 10px;\"><button class=\"button\" onclick=\"retryVideoUpload()\">Try Again</button><button class=\"button secondary\" onclick=\"continueWithoutUpload()\">Continue Without Upload</button></div>");
  var status = document.getElementById('recording-status');
  status.textContent = '❌ Upload failed';
  status.className = 'recording-status ready';
}

// Retry upload function
function retryVideoUpload() {
  return _retryVideoUpload.apply(this, arguments);
}
function _retryVideoUpload() {
  _retryVideoUpload = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12() {
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          document.getElementById('recording-error').style.display = 'none';
          _context12.n = 1;
          return saveRecording();
        case 1:
          return _context12.a(2);
      }
    }, _callee12);
  }));
  return _retryVideoUpload.apply(this, arguments);
}
function cleanupRecording() {
  var keepPreviewUI = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return new Promise(function (resolve) {
    try {
      if (state.recording.mediaRecorder && state.recording.mediaRecorder.state !== 'inactive') {
        state.recording.mediaRecorder.addEventListener('stop', function () {
          return resolve();
        }, {
          once: true
        });
        try {
          state.recording.mediaRecorder.stop();
        } catch (e) {
          resolve();
        }
      } else {
        resolve();
      }
    } catch (e) {
      resolve();
    }
  })["finally"](function () {
    try {
      if (state.recording.stream) state.recording.stream.getTracks().forEach(function (t) {
        return t.stop();
      });
    } catch (e) {}
    state.recording.stream = null;
    state.recording.active = false;
    state.recording.chunks = [];
    stopRecordingTimer();
    if (!keepPreviewUI) {
      var preview = document.getElementById('video-preview');
      if (preview) {
        if (preview.pause) preview.pause();
        preview.srcObject = null;
        preview.style.display = 'none';
      }
      var recorded = document.getElementById('recorded-video');
      if (recorded) {
        revokeRecordedURL();
        recorded.style.display = 'none';
      }
      state.recording.mediaRecorder = null;
    }
  });
}
function ensureTaskPointer(taskCode) {
  if (!state.sequence || !state.sequence.length) return;
  if (state.sequence[state.currentTaskIndex] !== taskCode) {
    var idx = state.sequence.indexOf(taskCode);
    if (idx !== -1) state.currentTaskIndex = idx;
  }
}
function skipRecording() {
  return _skipRecording.apply(this, arguments);
}
function _skipRecording() {
  _skipRecording = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13() {
    var _t13;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.p = _context13.n) {
        case 0:
          if (confirm('Unable to complete the image description task?')) {
            _context13.n = 1;
            break;
          }
          return _context13.a(2);
        case 1:
          _context13.p = 1;
          _context13.n = 2;
          return cleanupRecording();
        case 2:
          _context13.n = 4;
          break;
        case 3:
          _context13.p = 3;
          _t13 = _context13.v;
          console.warn('Cleanup on skip failed silently:', _t13);
        case 4:
          ensureTaskPointer('ID');
          skipTask('ID');
        case 5:
          return _context13.a(2);
      }
    }, _callee13, null, [[1, 3]]);
  }));
  return _skipRecording.apply(this, arguments);
}
var recordingTimer;
function startRecordingTimer() {
  var timer = document.getElementById('recording-timer');
  timer.style.display = 'block';
  var seconds = 0;
  state.recording.recordingStart = Date.now();
  recordingTimer = setInterval(function () {
    seconds++;
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    timer.textContent = "".concat(mins.toString().padStart(2, '0'), ":").concat(secs.toString().padStart(2, '0'));
  }, 1000);
}
function stopRecordingTimer() {
  clearInterval(recordingTimer);
  var t = document.getElementById('recording-timer');
  if (t) t.style.display = 'none';
  if (state.recording.recordingStart) {
    state.recording.recordingDuration = Date.now() - state.recording.recordingStart;
  }
}

// ----- Complete/Skip -----
function completeTask(taskCode) {
  var task = TASKS[taskCode];
  if (!task) {
    console.error('Task not found:', taskCode);
    return;
  }
  taskTimer.stop();
  var summary = taskTimer.getSummary();
  state.totalTimeSpent += summary.elapsed;
  if (!state.completedTasks.includes(taskCode)) state.completedTasks.push(taskCode);
  state.skippedTasks = state.skippedTasks.filter(function (code) {
    return code !== taskCode;
  });
  state.currentTaskIndex++;
  while (state.currentTaskIndex < state.sequence.length && state.completedTasks.includes(state.sequence[state.currentTaskIndex])) state.currentTaskIndex++;
  saveState();
  var payload = {
    sessionCode: state.sessionCode,
    task: getStandardTaskName(taskCode),
    elapsed: Math.round(summary.elapsed / 1000),
    active: Math.round(summary.active / 1000),
    pauseCount: summary.pauseCount,
    paused: Math.round(summary.paused / 1000),
    inactive: Math.round(summary.inactive / 1000),
    activity: Math.round(summary.activity),
    startTime: summary.start,
    endTime: summary.end,
    timestamp: new Date().toISOString(),
    deviceType: state.isMobile ? 'mobile/tablet' : 'desktop'
  };
  payload.action = task.skilled ? 'skilled_task_completed' : 'task_completed';
  if (taskCode === 'ID' && state.recording && state.recording.recordingDuration) {
    payload.recordingDuration = Math.round(state.recording.recordingDuration / 1000);
  }
  sendToSheets(payload);
  logSessionTime(taskCode);
  state.currentTaskType = '';
  if (state.currentTaskIndex >= state.sequence.length) showCompletionScreen();else showProgressScreen();
}
function skipTask(taskCode) {
  var task = TASKS[taskCode];
  if (!task) {
    console.error('Task not found:', taskCode);
    return;
  }
  taskTimer.stop();
  if (taskCode === 'ID') {
    if (state.recording && (state.recording.stream || state.recording.active)) {
      try {
        if (state.recording.stream && state.recording.stream.getTracks) state.recording.stream.getTracks().forEach(function (t) {
          return t.stop();
        });
      } catch (e) {}
      state.recording.active = false;
      state.recording.chunks = [];
      stopRecordingTimer();
    }
  }
  if (!state.completedTasks.includes(taskCode)) state.completedTasks.push(taskCode);
  if (!state.skippedTasks.includes(taskCode)) state.skippedTasks.push(taskCode);
  state.currentTaskIndex++;
  while (state.currentTaskIndex < state.sequence.length && state.completedTasks.includes(state.sequence[state.currentTaskIndex])) state.currentTaskIndex++;
  saveState();
  sendToSheets({
    action: 'task_skipped',
    sessionCode: state.sessionCode,
    task: getStandardTaskName(taskCode),
    reason: taskCode === 'ASLCT' ? 'Does not know ASL' : taskCode === 'ID' ? state.consentStatus.videoDeclined ? 'Video consent declined' : 'User chose to skip' : 'User chose to skip',
    timestamp: new Date().toISOString(),
    deviceType: state.isMobile ? 'mobile/tablet' : 'desktop'
  });
  logSessionTime(taskCode + '_skipped');
  state.currentTaskType = '';
  if (state.currentTaskIndex >= state.sequence.length) showCompletionScreen();else showProgressScreen();
}

// ----- Completion -----
function showCompletionScreen() {
  document.getElementById('final-code').textContent = state.sessionCode;
  document.getElementById('total-time').textContent = Math.round(state.totalTimeSpent / 60000);
  showScreen('completion-screen');
  document.getElementById('pause-fab').classList.remove('active');
}
function markComplete() {
  return _markComplete.apply(this, arguments);
} // ----- Utilities -----
function _markComplete() {
  _markComplete = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14() {
    var sessSummary, btn;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.n) {
        case 0:
          if (sessionTimer.startTime && !sessionTimer.endTime) sessionTimer.stop();
          sessSummary = sessionTimer.getSummary();
          state.totalActiveTime = sessSummary.active;
          logSessionTime('final', sessSummary);
          btn = document.getElementById('mark-complete-btn');
          btn.disabled = true;
          _context14.n = 1;
          return sendToSheets({
            action: 'study_completed',
            sessionCode: state.sessionCode,
            status: 'Complete',
            totalDuration: Math.round(state.totalTimeSpent / 60000),
            deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
            timestamp: new Date().toISOString()
          });
        case 1:
          document.getElementById('completion-message').style.display = 'block';
        case 2:
          return _context14.a(2);
      }
    }, _callee14);
  }));
  return _markComplete.apply(this, arguments);
}
function pauseStudy() {
  state.pauseStart = Date.now();
  state.lastPauseType = 'manual';
  if (taskTimer.startTime) taskTimer.pause('manual');
  if (sessionTimer.startTime) sessionTimer.pause('manual');
  document.getElementById('pause-modal').classList.add('active');
  document.getElementById('pause-fab').classList.remove('active');
  var _getTaskCounts3 = getTaskCounts(),
    total = _getTaskCounts3.total,
    completed = _getTaskCounts3.completed;
  var progress = total ? "".concat(completed, "/").concat(total) : '';
  sendToSheets({
    action: 'session_paused',
    sessionCode: state.sessionCode,
    progress: progress,
    pauseType: 'manual',
    timestamp: new Date().toISOString()
  });
  saveState();
}
function resumeStudy() {
  if (state.pauseStart) {
    var pausedMs = Date.now() - state.pauseStart;
    state.totalPausedTime = (state.totalPausedTime || 0) + pausedMs;
    state.pauseStart = null;
    var _getTaskCounts4 = getTaskCounts(),
      total = _getTaskCounts4.total,
      completed = _getTaskCounts4.completed;
    var progress = total ? "".concat(completed, "/").concat(total) : '';
    sendToSheets({
      action: 'session_resumed',
      sessionCode: state.sessionCode,
      progress: progress,
      pausedSeconds: Math.round(pausedMs / 1000),
      pauseType: state.lastPauseType,
      timestamp: new Date().toISOString()
    });
  }
  if (taskTimer.startTime) taskTimer.resume();
  if (sessionTimer.startTime) sessionTimer.resume();
  document.getElementById('pause-modal').classList.remove('active');
  document.getElementById('pause-fab').classList.add('active');
  saveState();
}
function saveAndExit() {
  state.pauseStart = Date.now();
  state.lastPauseType = 'exit';
  if (taskTimer.startTime) taskTimer.pause('exit');
  if (sessionTimer.startTime) sessionTimer.pause('exit');
  saveState();
  document.getElementById('modal-code').textContent = state.sessionCode;
  document.getElementById('exit-modal').classList.add('active');
  var _getTaskCounts5 = getTaskCounts(),
    total = _getTaskCounts5.total,
    completed = _getTaskCounts5.completed;
  var progress = total ? "".concat(completed, "/").concat(total) : '';
  sendToSheets({
    action: 'session_paused',
    sessionCode: state.sessionCode,
    progress: progress,
    pauseType: 'exit',
    timestamp: new Date().toISOString()
  });
}
function showCopyFeedback(btnEl) {
  if (!btnEl) return;
  var original = btnEl.textContent;
  btnEl.textContent = '✅ Copied!';
  setTimeout(function () {
    return btnEl.textContent = original;
  }, 2000);
}
function fallbackCopy(text, btnEl) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    showCopyFeedback(btnEl);
    alert('Copied to clipboard: ' + text);
  } catch (err) {
    alert('Copy this text manually: ' + text);
  }
  document.body.removeChild(textarea);
}
function copyCode(btnEl) {
  var code = document.getElementById('display-code').textContent;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(function () {
      showCopyFeedback(btnEl);
    })["catch"](function () {
      return fallbackCopy(code, btnEl);
    });
  } else {
    fallbackCopy(code, btnEl);
  }
}
function generateRecoveryLink() {
  if (!state.sessionCode) return '';
  var token = btoa(state.sessionCode);
  return "".concat(location.origin).concat(location.pathname, "?recover=").concat(encodeURIComponent(token));
}
function copyRecoveryLink(btnEl) {
  var link = generateRecoveryLink();
  if (!link) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link).then(function () {
      showCopyFeedback(btnEl);
    })["catch"](function () {
      return fallbackCopy(link, btnEl);
    });
  } else {
    fallbackCopy(link, btnEl);
  }
}
function copyASLCTCode(btnEl) {
  var code = CONFIG.ASLCT_ACCESS_CODE;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(function () {
      showCopyFeedback(btnEl);
    })["catch"](function () {
      return fallbackCopy(code, btnEl);
    });
  } else {
    fallbackCopy(code, btnEl);
  }
}
function openEmbedInNewTab(taskCode) {
  var task = TASKS[taskCode];
  if (task && task.embedUrl) window.open(task.embedUrl, '_blank', 'noopener');
}
function reloadEmbed(iframeId) {
  var f = document.getElementById(iframeId);
  if (f) f.src = f.src;
}
function scheduleEEG() {
  // Log the intent then open Calendly in a new tab
  sendToSheets({
    action: 'calendly_opened',
    sessionCode: state.sessionCode || 'none',
    participantID: state.participantID || 'none',
    timestamp: new Date().toISOString()
  });
  window.open(CONFIG.EEG_CALENDLY_URL, '_blank', 'noopener');
}
function expressEEGInterest() {
  sendToSheets({
    action: 'eeg_interest',
    sessionCode: state.sessionCode || 'none',
    participantID: state.participantID || 'none',
    timestamp: new Date().toISOString()
  });
  alert('Thanks! We will contact you when more EEG times are available.');
}
function markEEGScheduled() {
  // Optional prompt so you can capture a date-time string if the participant knows it
  var when = prompt('If you know your scheduled date-time, enter it here (optional). You can also leave this blank and press OK.');
  sendToSheets({
    action: 'eeg_scheduled',
    sessionCode: state.sessionCode || 'none',
    participantID: state.participantID || 'none',
    scheduledAt: when || new Date().toISOString(),
    source: 'Calendly',
    timestamp: new Date().toISOString()
  });
  alert('Thanks. We marked EEG as scheduled on our side.');
}
var pendingSkipTask = null;
function showSkipDialog(taskCode) {
  pendingSkipTask = taskCode;
  var pre = document.getElementById('pre-skip-modal');
  pre.classList.add('active');
}
document.getElementById('pre-skip-try-btn').onclick = function () {
  document.getElementById('pre-skip-modal').classList.remove('active');
};
document.getElementById('pre-skip-help-btn').onclick = function () {
  document.getElementById('pre-skip-modal').classList.remove('active');
  openSupportEmail(pendingSkipTask);
  sendToSheets({
    action: 'help_requested',
    sessionCode: state.sessionCode || 'none',
    task: getStandardTaskName(pendingSkipTask),
    timestamp: new Date().toISOString()
  });
};
document.getElementById('pre-skip-break-btn').onclick = function () {
  document.getElementById('pre-skip-modal').classList.remove('active');
  pauseStudy();
};
document.getElementById('pre-skip-skip-btn').onclick = function () {
  document.getElementById('pre-skip-modal').classList.remove('active');
  document.getElementById('skip-modal').classList.add('active');
};
document.getElementById('skip-help-btn').onclick = function () {
  openSupportEmail(pendingSkipTask);
  sendToSheets({
    action: 'help_requested',
    sessionCode: state.sessionCode || 'none',
    task: getStandardTaskName(pendingSkipTask),
    timestamp: new Date().toISOString()
  });
};
document.getElementById('skip-try-btn').onclick = function () {
  document.getElementById('skip-modal').classList.remove('active');
};
document.getElementById('skip-break-btn').onclick = function () {
  document.getElementById('skip-modal').classList.remove('active');
  pauseStudy();
};
document.getElementById('skip-confirm-btn').onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
  return _regenerator().w(function (_context2) {
    while (1) switch (_context2.n) {
      case 0:
        document.getElementById('skip-modal').classList.remove('active');
        _context2.n = 1;
        return skipTaskProceed(pendingSkipTask);
      case 1:
        return _context2.a(2);
    }
  }, _callee2);
}));
function openSupportEmail() {
  var subject = encodeURIComponent('Technical Support Request - Spatial Cognition Study');
  var body = encodeURIComponent("Hi Action Brain Lab,\n\nI need technical support with the spatial cognition study.\n\nDevice/Browser: \nIssue description: \nWhat I've tried: \nAccessibility needs (if any): \n\nThank you!");
  window.open("mailto:".concat(CONFIG.SUPPORT_EMAIL, "?subject=").concat(subject, "&body=").concat(body), '_blank');
}

// Do the actual skip (handles video task cleanup)
function skipTaskProceed(_x1) {
  return _skipTaskProceed.apply(this, arguments);
}
function _skipTaskProceed() {
  _skipTaskProceed = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(taskCode) {
    var _t14;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.p = _context15.n) {
        case 0:
          if (!(taskCode === 'ID')) {
            _context15.n = 4;
            break;
          }
          _context15.p = 1;
          _context15.n = 2;
          return cleanupRecording();
        case 2:
          _context15.n = 4;
          break;
        case 3:
          _context15.p = 3;
          _t14 = _context15.v;
        case 4:
          // Call your existing skip function
          skipTask(taskCode);
        case 5:
          return _context15.a(2);
      }
    }, _callee15, null, [[1, 3]]);
  }));
  return _skipTaskProceed.apply(this, arguments);
}
function hashCode(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    hash = (hash << 5) - hash + c;
    hash |= 0;
  }
  return hash;
}
function submitASLCTIssue() {
  var el = document.getElementById('aslct-issue-text');
  if (!el) return;
  var message = el.value.trim();
  if (!message) return;
  sendToSheets({
    action: 'aslct_issue',
    sessionCode: state.sessionCode || 'none',
    participantID: state.participantID || 'none',
    message: message,
    timestamp: new Date().toISOString()
  });
  el.value = '';
  alert('Issue submitted. Thank you!');
}

// === REPLACE sendToSheets with this ===
function sendToSheets(_x10) {
  return _sendToSheets.apply(this, arguments);
}
function _sendToSheets() {
  _sendToSheets = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee16(payload) {
    var body, _t15;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.p = _context16.n) {
        case 0:
          if (CONFIG.SHEETS_URL) {
            _context16.n = 1;
            break;
          }
          return _context16.a(2);
        case 1:
          body = _objectSpread(_objectSpread({}, payload), {}, {
            userAgent: navigator.userAgent,
            deviceType: payload.deviceType || (state.isMobile ? 'mobile/tablet' : 'desktop')
          });
          _context16.p = 2;
          _context16.n = 3;
          return fetch(CONFIG.SHEETS_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain'
            },
            // simple request, bypasses CORS preflight
            body: JSON.stringify(body)
          });
        case 3:
          _context16.n = 5;
          break;
        case 4:
          _context16.p = 4;
          _t15 = _context16.v;
          console.error('Error sending to sheets:', _t15);
        case 5:
          return _context16.a(2);
      }
    }, _callee16, null, [[2, 4]]);
  }));
  return _sendToSheets.apply(this, arguments);
}
window.addEventListener('beforeunload', function () {
  if (!CONFIG.SHEETS_URL) return;
  var body = {
    action: 'window_closed',
    sessionCode: state.sessionCode || 'none',
    task: getStandardTaskName(state.sequence[state.currentTaskIndex] || ''),
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    deviceType: state.isMobile ? 'mobile/tablet' : 'desktop'
  };
  navigator.sendBeacon(CONFIG.SHEETS_URL, JSON.stringify(body));
});

// ---------- OPTIONAL AUTH HELPERS (frontend) ----------

// DEBUG FUNCTION - Add this before "// Expose to window"
function debugVideoUpload() {
  return _debugVideoUpload.apply(this, arguments);
} // Expose functions to window
function _debugVideoUpload() {
  _debugVideoUpload = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee17() {
    var res, text, payload, testData, testBlob, base64Data, base64VideoData, uploadData, uploadResponse, uploadText, uploadResult, _t16, _t17;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.p = _context17.n) {
        case 0:
          console.log('🔍 Starting video upload debug...');

          // Test 1: Check configuration
          console.log('1. Configuration check:');
          console.log('SHEETS_URL:', CONFIG.SHEETS_URL);
          console.log('Is valid URL:', CONFIG.SHEETS_URL.includes('script.google.com'));

          // Test 2: Test basic connection
          console.log('2. Testing basic connection...');
          _context17.p = 1;
          _context17.n = 2;
          return fetch(CONFIG.SHEETS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify({
              action: 'test_connection',
              timestamp: new Date().toISOString()
            })
          });
        case 2:
          res = _context17.v;
          console.log('✅ Connection response:', {
            status: res.status,
            ok: res.ok,
            statusText: res.statusText,
            contentType: res.headers.get('content-type')
          });

          // Handle response carefully
          _context17.n = 3;
          return res.text();
        case 3:
          text = _context17.v;
          try {
            payload = JSON.parse(text);
          } catch (_unused2) {
            payload = text;
          }
          console.log('✅ Connection result:', payload);
          _context17.n = 5;
          break;
        case 4:
          _context17.p = 4;
          _t16 = _context17.v;
          console.error('❌ Connection failed:', _t16);
          return _context17.a(2);
        case 5:
          // Test 3: Create a tiny test video blob
          console.log('3. Creating test video blob...');
          _context17.p = 6;
          // Create a minimal test "video" (just some bytes)
          testData = new Uint8Array([0x1A, 0x45, 0xDF, 0xA3]); // WebM magic number
          testBlob = new Blob([testData], {
            type: 'video/webm'
          });
          console.log('Test blob created:', {
            size: testBlob.size,
            type: testBlob.type
          });

          // Test 4: Test base64 conversion
          console.log('4. Testing base64 conversion...');
          _context17.n = 7;
          return blobToBase64(testBlob);
        case 7:
          base64Data = _context17.v;
          base64VideoData = base64Data.split(',')[1];
          console.log('✅ Base64 conversion successful:', {
            originalSize: testBlob.size,
            base64Length: base64VideoData.length
          });

          // Test 5: Test actual upload
          console.log('5. Testing upload with tiny file...');
          uploadData = {
            action: 'upload_video',
            sessionCode: 'DEBUG_' + Date.now(),
            imageNumber: 99,
            videoData: base64VideoData,
            mimeType: testBlob.type,
            timestamp: new Date().toISOString()
          };
          _context17.n = 8;
          return fetch(CONFIG.SHEETS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify(uploadData)
          });
        case 8:
          uploadResponse = _context17.v;
          console.log('Upload response:', {
            status: uploadResponse.status,
            ok: uploadResponse.ok,
            statusText: uploadResponse.statusText,
            contentType: uploadResponse.headers.get('content-type')
          });
          _context17.n = 9;
          return uploadResponse.text();
        case 9:
          uploadText = _context17.v;
          try {
            uploadResult = JSON.parse(uploadText);
          } catch (_unused3) {
            uploadResult = uploadText;
          }
          if (uploadResponse.ok && uploadResult.success) {
            console.log('✅ Upload successful:', uploadResult);

            // Note about cleanup
            if (uploadResult.fileId) {
              console.log('🧹 Test file created with ID:', uploadResult.fileId);
              console.log('Note: You may want to delete this test file from Google Drive');
            }
          } else {
            console.error('❌ Upload failed:', uploadResult);
          }
          _context17.n = 11;
          break;
        case 10:
          _context17.p = 10;
          _t17 = _context17.v;
          console.error('❌ Debug test failed:', _t17);
        case 11:
          console.log('🔍 Debug complete! Check the console messages above.');
        case 12:
          return _context17.a(2);
      }
    }, _callee17, null, [[6, 10], [1, 4]]);
  }));
  return _debugVideoUpload.apply(this, arguments);
}
Object.assign(window, {
  showScreen: showScreen,
  createNewSession: createNewSession,
  resumeSession: resumeSession,
  proceedToEEGInfo: proceedToEEGInfo,
  proceedToConsent: proceedToConsent,
  openConsent: openConsent,
  markConsentDone: markConsentDone,
  declineVideo: declineVideo,
  proceedToTasks: proceedToTasks,
  continueToCurrentTask: continueToCurrentTask,
  skipCurrentTask: skipCurrentTask,
  pauseStudy: pauseStudy,
  resumeStudy: resumeStudy,
  saveAndExit: saveAndExit,
  copyCode: copyCode,
  copyRecoveryLink: copyRecoveryLink,
  copyASLCTCode: copyASLCTCode,
  tryMailto: tryMailto,
  copyEmail: copyEmail,
  closeEEGModal: closeEEGModal,
  completeTask: completeTask,
  skipTask: skipTask,
  openEmbedInNewTab: openEmbedInNewTab,
  reloadEmbed: reloadEmbed,
  retryVideoUpload: retryVideoUpload,
  continueWithoutUpload: continueWithoutUpload,
  debugVideoUpload: debugVideoUpload,
  submitASLCTIssue: submitASLCTIssue,
  markComplete: markComplete,
  scheduleEEG: scheduleEEG,
  expressEEGInterest: expressEEGInterest,
  markEEGScheduled: markEEGScheduled,
  showSkipDialog: showSkipDialog,
  skipTaskProceed: skipTaskProceed,
  openSupportEmail: openSupportEmail,
  testCloudinaryUpload: testCloudinaryUpload
});
