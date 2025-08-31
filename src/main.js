import { CONFIG, CODE_REGEX } from './config.js';
import {
  TASKS,
  getStandardTaskName,
  DESKTOP_TASKS,
  MOBILE_TASKS,
  mulberry32,
  shuffleWithSeed,
  ensureDemographicsLast,
  isMobileDevice
} from './tasks.js';
import { debugVideoUpload, testCloudinaryUpload } from './debug.js';
import {
  updateRecordingImage,
  bindRecordingSkips,
  setupUploadcareUploader,
  cleanupRecording
} from './recorder.js';

// ----- Configuration -----
/* === MS-RECORDER-CONFIG START === */
const RECORDING_BYTES_LIMIT = 50 * 1024 * 1024; // 50 MB limit
/* === MS-RECORDER-CONFIG END === */

document.querySelectorAll('.support-email').forEach(el => {
  el.textContent = CONFIG.SUPPORT_EMAIL;
  if (el.tagName === 'A') el.href = `mailto:${CONFIG.SUPPORT_EMAIL}`;
});

document.querySelectorAll('.button.skip').forEach(btn => {
  btn.title = `Please try the task first or email ${CONFIG.SUPPORT_EMAIL} for help`;
});


function tryMailto() {
  const addr = CONFIG.SUPPORT_EMAIL;
  const subject = encodeURIComponent('[EEG Add-On] Scheduling — Session ' + (state.sessionCode || ''));
  const body = encodeURIComponent(`Hi Action Brain Lab,

I'd like to schedule the optional EEG visit.

Preferred dates/times:
Communication preference (ASL or English):

Thanks!
Session code: ${state.sessionCode || ''}`);
  window.location.href = `mailto:${addr}?subject=${subject}&body=${body}`;
}

function copyEmail(btn) {
  const addr = CONFIG.SUPPORT_EMAIL;
  navigator.clipboard.writeText(addr).then(() => {
    if (btn) { const t = btn.textContent; btn.textContent = '✅ Copied!'; setTimeout(()=>btn.textContent=t, 1500); }
  });
}

function closeEEGModal() {
  const m = document.getElementById('eeg-modal');
  if (m) m.classList.remove('active');
}

/* === MS-LIVE-PREVIEW START === */
let msLiveStream = null;

async function msEnsureLivePreview(constraints = {
  video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
  audio: true
}) {
  const el = document.querySelector('#rec-preview-video');
  if (!el) return null;

  el.muted = true;
  el.playsInline = true;
  el.autoplay = true;

  if (!msLiveStream) {
    msLiveStream = await navigator.mediaDevices.getUserMedia(constraints);
  }

  // Show the live stream
  el.srcObject = msLiveStream;
  el.style.display = '';
  try { await el.play(); } catch (_) {}

  return msLiveStream;
}
/* === MS-LIVE-PREVIEW END === */
// ----- State -----
let state = {
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

  recording: {
    active: false, mediaRecorder: null, chunks: [], currentImage: 0, recordings: [],
    stream: null, currentBlob: null, isVideoMode: true
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

    start() {
      this.startTime = Date.now();
      this.lastActivity = Date.now();
      this.lastTick = Date.now();
      this.activeTime = 0;
      this.inactivityTime = 0;
      this.pausedTime = 0;
      this.pauseCount = 0;
      this.isPaused = false;
      this.pauseStart = null;
      this.intervalId = setInterval(() => this.tick(), 1000);
    },

    tick() {
      const now = Date.now();
      if (!document.hidden && !this.isPaused) {
        const timeSinceLastActivity = now - this.lastActivity;
        const timeSinceTick = now - this.lastTick;

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

    recordActivity() {
      this.lastActivity = Date.now();
      if (this.isPaused && this.pauseReason === 'inactivity') this.resume();
    },

    pause(reason) {
      if (!this.isPaused) {
        this.isPaused = true;
        this.pauseReason = reason;
        this.pauseCount++;
        this.pauseStart = Date.now();
      }
    },

    resume() {
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

    stop() {
      clearInterval(this.intervalId);
      if (this.isPaused && this.pauseStart && this.pauseReason === 'manual') {
        this.pausedTime += Date.now() - this.pauseStart;
      }
      this.endTime = Date.now();
    },

    getSummary() {
      const elapsed = (this.endTime || Date.now()) - this.startTime;
      const active = Math.min(this.activeTime, elapsed);
      const paused = Math.min(this.pausedTime, elapsed);
      const inactive = Math.min(this.inactivityTime, elapsed);

      const total = active + paused + inactive;
      if (total > elapsed) {
        const scale = elapsed / total;
        return {
          start: new Date(this.startTime).toISOString(),
          end: new Date(this.endTime || Date.now()).toISOString(),
          elapsed,
          active: Math.round(active * scale),
          pauseCount: this.pauseCount,
          paused: Math.round(paused * scale),
          inactive: Math.round(inactive * scale),
          activity: (active / elapsed) * 100
        };
      }

      return {
        start: new Date(this.startTime).toISOString(),
        end: new Date(this.endTime || Date.now()).toISOString(),
        elapsed,
        active,
        pauseCount: this.pauseCount,
        paused,
        inactive,
        activity: elapsed > 0 ? (active / elapsed) * 100 : 0
      };
    }
  };
}

const sessionTimer = createTimer();
const taskTimer = createTimer();

function showInactivityPrompt() {
  sendToSheets({ action: 'inactivity', sessionCode: state.sessionCode, task: getStandardTaskName(state.sequence[state.currentTaskIndex] || ''), deviceType: state.isMobile ? 'mobile/tablet' : 'desktop', timestamp: new Date().toISOString() });
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
  state.heartbeatInterval = setInterval(() => {
    if (state.externalDepart) {
      const away = Date.now() - state.externalDepart;
      if (away > 600000 && !state.externalNotified) {
        sendToSheets({
          action: 'external_task_stuck',
          sessionCode: state.sessionCode,
          task: taskName,
          away: Math.round(away/1000),
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

function logSessionTime(stage, summary = sessionTimer.getSummary()) {
  if (!state.sessionCode) return;
  sendToSheets({
    action: 'session_timer',
    stage,
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

['mousemove','mousedown','keydown','touchstart'].forEach(ev => {
  document.addEventListener(ev, (e) => {
    taskTimer.recordActivity();
    sessionTimer.recordActivity();
    sendInputEvent(ev, e);
  }, { passive: true });
});

function sendInputEvent(type, e) {
  if (!state.sessionCode) return;
  const payload = {
    action: type,
    sessionCode: state.sessionCode,
    timestamp: new Date().toISOString()
  };
  if (type === 'mousemove' || type === 'mousedown' || type === 'touchstart') {
    const point = e.touches && e.touches[0] ? e.touches[0] : e;
    payload.x = point.clientX;
    payload.y = point.clientY;
  }
  if (type === 'keydown') {
    payload.key = e.key;
  }
  sendToSheets(payload);
}

document.addEventListener('visibilitychange', () => {
  const payload = {
    sessionCode: state.sessionCode,
    task: getStandardTaskName(state.sequence[state.currentTaskIndex] || ''),
    deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
    timestamp: new Date().toISOString()
  };
  if (document.hidden) {
    taskTimer.pause('visibility');
    sessionTimer.pause('visibility');
    sendToSheets({ action: 'tab_hidden', ...payload });
  } else {
    taskTimer.resume();
    sessionTimer.resume();
    sendToSheets({ action: 'tab_visible', ...payload });
  }
});

window.addEventListener('blur', () => {
  taskTimer.pause('blur');
  sessionTimer.pause('blur');
  if (state.currentTaskType === 'external') {
    state.externalDepart = Date.now();
    sendToSheets({ action: 'task_departed', sessionCode: state.sessionCode, task: getStandardTaskName(state.sequence[state.currentTaskIndex] || ''), deviceType: state.isMobile ? 'mobile/tablet' : 'desktop', timestamp: new Date().toISOString() });
    startHeartbeat(getStandardTaskName(state.sequence[state.currentTaskIndex] || ''));
  }
});

window.addEventListener('focus', () => {
  taskTimer.resume();
  sessionTimer.resume();
  if (state.currentTaskType === 'external' && state.externalDepart) {
    const away = Date.now() - state.externalDepart;
    taskTimer.externalTime += away;
    taskTimer.lastTick = Date.now();
    sendToSheets({
      action: 'task_returned',
      sessionCode: state.sessionCode,
      task: getStandardTaskName(state.sequence[state.currentTaskIndex] || ''),
      away: Math.round(away/1000),
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
  msRecorderInit();

  // Secure-context guard: disable inline recording if not https
  if (!window.isSecureContext) {
    // Hide the record button if the recording screen gets opened
    const style = document.createElement('style');
    style.textContent = `#record-btn { display: none !important; }`;
    document.head.appendChild(style);
  }

  const params = new URLSearchParams(location.search);
  checkRecoveryLink();
  if (!params.has('recover')) {
    checkSavedSession();
  }

  // Gentle mobile notice content swap
  if (isMobileDevice()) {
    const warning = document.getElementById('device-warning');
    if (warning) {
      warning.className = 'info-box friendly-tip';
      warning.innerHTML = `
  <strong>📱 Mobile or Tablet?</strong>
  <p style="margin-top: 10px;">
    Some tasks work best on a computer. You can pause now. Copy your session code in case of a glitch so support can verify your progress.
  </p>
  <ul style="margin: 10px 0 0 20px; text-align: left;">
    <li><strong>Virtual Campus Navigation</strong> needs keyboard controls (WASD/arrow keys)</li>
    <li>Video recording requires camera & microphone permissions</li>
    <li>Chrome or Firefox recommended on desktop</li>
    <li>For the best experience, we recommend switching to a computer if possible.</li>
  </ul>
`;
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
      document.getElementById('consent-code').addEventListener('input', validateInitials);
      document.getElementById('consent-confirm').addEventListener('change', validateInitials);
      document.getElementById('resume-code').addEventListener('input', e => { e.target.value = e.target.value.toUpperCase(); });
        bindRecordingSkips(showSkipDialog);
    }

    function validateInitials(e) {
      if (e.target.id === 'first-initial' || e.target.id === 'last-initial') {
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 1);
      }
      const first = document.getElementById('first-initial').value;
      const last = document.getElementById('last-initial').value;
      const hearing = document.getElementById('hearing-status').value;
      const fluency = document.getElementById('fluency').value;
      const consentCode = document.getElementById('consent-code').value;
      const consent = document.getElementById('consent-confirm').checked;
      document.getElementById('create-session-btn').disabled = !(first && last && hearing && fluency && consentCode && consent);
    }

    // ----- Screens -----
   // === REPLACE your existing showScreen with this ===
function showScreen(screenId) {
  // Hide all screens, show target
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(screenId);
  if (screen) screen.classList.add('active');

  updateProgressBar();

  const crumbs = ['Home'];
  if (screenId === 'eeg-info') crumbs.push('EEG Info');
  else if (screenId === 'progress-screen') crumbs.push('Tasks');
  else if (screenId === 'task-screen' || screenId === 'recording-screen') {
    crumbs.push('Tasks');
    const t = document.getElementById('task-title');
    if (t) crumbs.push(t.textContent.trim());
  }
  const bc = document.getElementById('breadcrumbs');
  if (bc) bc.textContent = crumbs.join(' › ');

  // Show/hide session widget + FAB
  const widget = document.getElementById('session-widget');
  const showWidget = ['progress-screen','task-screen','recording-screen'].includes(screenId);
  if (widget) widget.classList.toggle('active', showWidget && state.sessionCode);
  const fab = document.getElementById('pause-fab');
  if (fab) fab.classList.toggle('active', showWidget && state.sessionCode);

  // Accessibility: move focus to the screen heading and announce
  const heading = screen ? screen.querySelector('h2, h1, h3') : null;
  if (heading) {
    heading.setAttribute('tabindex', '-1');
    heading.focus({ preventScroll: false });
    // Clean up tabindex after focus so it doesn't stay in tab order
    setTimeout(() => heading.removeAttribute('tabindex'), 500);
    // Live region update
    const live = document.getElementById('live-status');
    if (live) live.textContent = `Section changed: ${heading.textContent}`;
  }
}


    // ----- Session -----
    function generateCode() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
      return code;
    }

    function createNewSession() {
      const honeypot = document.getElementById('registration-website').value.trim();
      if (honeypot) return;
      const first = document.getElementById('first-initial').value.trim().toUpperCase();
      const last = document.getElementById('last-initial').value.trim().toUpperCase();
      const email = document.getElementById('email').value.trim();
      const hearing = document.getElementById('hearing-status').value;
      const fluency = document.getElementById('fluency').value;
      const consentCode = document.getElementById('consent-code').value.trim();
      const consent = document.getElementById('consent-confirm').checked;
      if (!first || !last || !hearing || !fluency || !consentCode || !consent) { alert('Please complete all fields and confirm consent'); return; }

      if (isMobileDevice()) {
        const proceed = confirm(
          'You are on a phone or tablet.\n\n' +
          'A computer is preferred for the best experience, but you can continue now.\n' +
          'If you encounter a glitch, share your session code with support while we fix the resume feature.\n\n' +
          'Continue on this device?'
        );
        if (!proceed) return;
      }

      state.sessionCode = generateCode();
      state.participantID = `${first}${last}_${Date.now().toString().slice(-4)}`;
      state.email = email;
      state.hearingStatus = hearing;
      state.fluency = fluency;
      state.consentCode = consentCode;
      state.consentConfirmed = consent;

      // Choose sequence (mobile vs desktop)
      const seed = Math.abs(hashCode(state.sessionCode));
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
        consentCode: state.consentCode,
        consentConfirmed: state.consentConfirmed,
        deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
        timestamp: new Date().toISOString()
      });

      document.getElementById('display-code').textContent = state.sessionCode;
      showScreen('session-created');
    }

      async function resumeSession(codeFromLink) {
        if (!codeFromLink) {
          const honeypot = document.getElementById('resume-website').value.trim();
          if (honeypot) return;
        }
        const input = codeFromLink || document.getElementById('resume-code').value;
        const code = input.trim().toUpperCase();
        if (!CODE_REGEX.test(code)) { alert('Please enter your 8-character session code'); return; }
      try {
        const res = await fetch(CONFIG.SHEETS_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ action: 'get_session', sessionCode: code })
        });
        const data = await res.json();
        if (!data.success || !data.session || !data.session.state) {
          alert('Session not found. Please check your code.');
          return;
        }
        state = JSON.parse(data.session.state);
        state.sequence = ensureDemographicsLast(state.sequence);
        if (data.activity_tracking) state.activity_tracking = data.activity_tracking;
        if (data.activity_summary) state.activity_summary = data.activity_summary;
        saveState();
        updateSessionWidget();
        showProgressScreen();
        if (!sessionTimer.startTime) sessionTimer.start();
      } catch (err) {
        console.error(err);
        alert('Error loading session');
      }
    }

    // === REPLACE the body of checkSavedSession with this ===
function checkSavedSession() {
  try {
    if (state.sessionCode) return;
    const recentCode = localStorage.getItem('recent_session');
    if (!recentCode) return;

    const saved = localStorage.getItem(`study_${recentCode}`);
    if (!saved) return;

    const data = JSON.parse(saved);
    const daysSince = (Date.now() - new Date(data.lastActivity).getTime()) / (1000*60*60*24);
    if (daysSince < 30) {
      // Delay so it doesn’t clash with initial UI
      setTimeout(() => {
        if (confirm(`Welcome back! Resume session ${recentCode}?`)) {
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
    const params = new URLSearchParams(location.search);
    const token = params.get('recover');
    if (!token) return;
    const code = atob(token);
    if (code && code.length === 8) {
      resumeSession(code);
    }
    try {
      const cleanURL = location.origin + location.pathname;
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
        localStorage.setItem(`study_${state.sessionCode}`, JSON.stringify(state));
        localStorage.setItem('recent_session', state.sessionCode);
        sendToSheets({ action: 'save_state', sessionCode: state.sessionCode, state });
      } catch (e) { console.warn('Could not save state', e); }
    }
    function proceedToEEGInfo() {
      showScreen('eeg-info');
    }
    function proceedToTasks() {
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
      const box = document.getElementById('skipped-notice');
      if (!box) return;
      const count = state.skippedTasks.length;
      if (count > 0) {
        box.style.display = 'block';
        box.textContent = `You have skipped ${count} task${count>1?'s':''}. Each task gives unique data. If you can, go back and try them. Even partial answers help. There is no judgment.`;
      } else {
        box.style.display = 'none';
      }
    }
    function updateProgressSkipButton() {
      const btn = document.getElementById('skip-current-task-btn');
      if (!btn) return;
      const taskCode = state.sequence[state.currentTaskIndex];
      const canSkip = taskCode && TASKS[taskCode] && TASKS[taskCode].canSkip;
      btn.style.display = canSkip ? 'inline-flex' : 'none';
      btn.textContent = taskCode === 'ASLCT' ? 'Unable to complete - I do not know ASL' : 'Unable to continue';
    }
    function updateTaskList() {
      const list = document.getElementById('task-list');
      list.innerHTML = '';
      state.sequence.forEach((taskCode, index) => {
        const task = TASKS[taskCode];
        const li = document.createElement('li');
        li.className = 'task-item';
        const isCompleted = state.completedTasks.includes(taskCode);
        const isCurrent = index === state.currentTaskIndex && !isCompleted;
        if (isCompleted) li.classList.add('completed');
        else if (isCurrent) li.classList.add('current');
        else li.classList.add('locked');
        li.innerHTML = `
          <div class="task-info">
            <div class="task-name">${task.name}<span class="task-badge">${task.estMinutes}m</span></div>
            <div class="task-description">${task.description}</div>
          </div>
          <div class="task-status">${isCompleted ? '✅' : (isCurrent ? '▶️' : '🔒')}</div>
        `;
        list.appendChild(li);
      });
    }
    function getTaskCounts() {
      return {
        total: state.sequence.length,
        completed: state.completedTasks.length
      };
    }
    function updateProgressBar() {
      const { total, completed } = getTaskCounts();
      if (!total) return;
      const progress = (completed / total) * 100;
      const pct = `${Math.round(progress)}%`;
      const fill = document.getElementById('progress-fill');
      const topFill = document.getElementById('top-progress-fill');
      if (fill) { fill.style.width = `${progress}%`; document.getElementById('progress-text').textContent = pct; }
      if (topFill) { topFill.style.width = `${progress}%`; topFill.textContent = pct; }
      const step = document.getElementById('step-indicator');
      if (step) step.textContent = `Step ${Math.min(completed + 1, total)} of ${total}`;
    }
    function updateSessionWidget() {
      if (!state.sessionCode) return;
      const { total, completed } = getTaskCounts();
      document.getElementById('widget-code').textContent = state.sessionCode + (state.isMobile ? ' (Mobile)' : '');
      document.getElementById('widget-progress').textContent = `${completed}/${total}`;
      document.getElementById('widget-time').textContent = `${Math.round(state.totalTimeSpent / 60000)} min`;
      const currentTask = state.sequence[state.currentTaskIndex];
      document.getElementById('widget-current').textContent = currentTask ? TASKS[currentTask].name : 'Complete';
    }

    // ----- Task flow -----
    function continueToCurrentTask() {
      if (state.currentTaskIndex >= state.sequence.length) { showCompletionScreen(); return; }
      startTask(state.sequence[state.currentTaskIndex]);
    }
    function skipCurrentTask() {
      if (state.currentTaskIndex >= state.sequence.length) return;
      const taskCode = state.sequence[state.currentTaskIndex];
      showSkipDialog(taskCode);
    }
    function startTask(taskCode) {
      const task = TASKS[taskCode];
      if (!task) return;

  if (!state.taskData) state.taskData = {};
  state.taskData[taskCode] = { startTime: Date.now() };
      state.currentTaskType = task.type;
      taskTimer.start();

      if (task.type === 'recording') showRecordingTask();
      else if (task.type === 'embed') showEmbeddedTask(taskCode);
      else showExternalTask(taskCode);

      const startISO = new Date().toISOString();
      sendToSheets({ action: 'task_started', sessionCode: state.sessionCode, task: getStandardTaskName(taskCode), deviceType: state.isMobile ? 'mobile/tablet' : 'desktop', timestamp: startISO, startTime: startISO });
    }

    // ----- Distraction-free fallback -----
    function enterDistractionFree() {
      document.documentElement.classList.add('df-mode');
      document.body.dataset.scrollY = window.scrollY;
      document.body.style.top = `-${window.scrollY}px`;
    }
    function exitDistractionFree() {
      document.documentElement.classList.remove('df-mode');
      const y = parseInt(document.body.dataset.scrollY || '0', 10);
      document.body.style.top = '';
      window.scrollTo(0, y);
    }

    // PostMessage completion hook
    window.addEventListener('message', (ev) => {
      const allowedOrigin = 'https://melodyfschwenk.github.io';
      if (ev.origin !== allowedOrigin) return;
      const data = ev.data || {};
      if (data.type === 'task-complete' && data.taskCode && TASKS[data.taskCode]) {
        completeTask(data.taskCode);
      }
    });

    // ----- Embedded tasks -----
    function showEmbeddedTask(taskCode) {
      const task = TASKS[taskCode];
      const url  = task.embedUrl;
      const iframeId = `embed-${taskCode.toLowerCase()}`;

      let extra = '';
      if (taskCode === 'SN') {
        extra = `
          <div class="info-box helpful" style="margin-top:10px;">
            <strong>What you'll do</strong>
            <p style="margin-top:6px;">Press <em>one</em> arrow key for the <em>first</em> step from the gray player to the red stop sign.</p>
          </div>`;
      } else if (taskCode === 'MRT') {
        extra = `
          <div class="info-box friendly-tip" style="margin-top:10px;">
            <strong>Heads up:</strong>
            <p style="margin-top:6px;">Takes about <strong>5–6 minutes</strong>. Work steadily from start to finish.</p>
          </div>`;
      }

      document.getElementById('task-title').textContent = task.name;
      const requiredText = 'This task is required for study completion.';
const eta = (TASKS[taskCode] && TASKS[taskCode].estMinutes) ? `${TASKS[taskCode].estMinutes} minutes` : 'a few minutes';
const reqs = (TASKS[taskCode] && TASKS[taskCode].requirements) || '—';

      document.getElementById('task-instructions').innerHTML = `
  <div class="info-box friendly-tip" style="margin-bottom:10px;">
    <strong> Ready to Start ${task.name}?</strong>
    <ul style="margin:8px 0 0 20px; text-align:left;">
      <li>${requiredText}</li>
      <li>Having problems? Email us instead of skipping</li>
      <li>Estimated time: <strong>${eta}</strong></li>
      <li>Requirements/tips: <em>${reqs}</em></li>
    </ul>
  </div>
  <p>${task.description}</p>
  ${extra}
  <details style="margin-top:10px;"><summary style="cursor:pointer;">More info / troubleshooting</summary>
    <ul style="margin:8px 0 0 20px; text-align:left;">
      <li>If the game doesn't respond, click inside it once to give it keyboard focus.</li>
      <li>If fullscreen doesn't work on your device, we'll switch to a distraction-free view.</li>
    </ul>
  </details>
`;


      const content = document.getElementById('task-content');
      content.innerHTML = `
  <div class="card" id="prestart">
    <p>When you click <strong>Continue</strong>, the task will open in fullscreen. When you're finished, click <em>I'm finished — Continue</em>.</p>
    <div class="button-group" style="margin-top:12px;">
      <button class="button" id="start-embed">Continue</button>
      <button class="button outline" type="button" onclick="openSupportEmail('${taskCode}')">Report Technical Issue Instead</button>
      ${task.canSkip ? `<button class="button skip" onclick="showSkipDialog('${taskCode}')" title="Please try the task first or email ${CONFIG.SUPPORT_EMAIL} for help">Unable to complete</button>` : ''}
    </div>
  </div>

  <div class="embed-shell fs-shell" id="fs-shell" style="display:none;">
    <div class="fs-toolbar" id="fs-toolbar">
      <div>${task.name}</div>
      <div class="actions">
        <button class="button success" id="finish-btn" disabled>I'm finished — Continue</button>
        <button class="button secondary" id="exit-btn">Exit fullscreen</button>
      </div>
    </div>
    <iframe id="${iframeId}" class="embed-frame" src="${url}" allow="fullscreen; gamepad; xr-spatial-tracking" allowfullscreen></iframe>
    <div class="embed-note">Tip: click once inside the game to give it keyboard focus.</div>
  </div>
`;

      showScreen('task-screen');

      const fsShell = document.getElementById('fs-shell');
      const finishBtn = document.getElementById('finish-btn');
      const exitBtn = document.getElementById('exit-btn');
      const prestart = document.getElementById('prestart');
      const iframe = document.getElementById(iframeId);
      iframe.addEventListener('focus', () => taskTimer.recordActivity());

      const enableFinish = () => { finishBtn.disabled = false; };

      async function goFullscreen() {
        prestart.style.display = 'none';
        fsShell.style.display = 'block';

        setTimeout(() => { try { iframe.focus(); } catch(e) {} }, 50);

        try {
          if (fsShell.requestFullscreen) { await fsShell.requestFullscreen({ navigationUI: 'hide' }).catch(() => {}); }
          else if (fsShell.webkitRequestFullscreen) { fsShell.webkitRequestFullscreen(); }
          setTimeout(() => {
            const inFS = document.fullscreenElement || document.webkitFullscreenElement;
            if (!inFS) enterDistractionFree();
          }, 250);
        } catch (e) { enterDistractionFree(); }

        setTimeout(enableFinish, 6000);
      }

      function leaveFullscreenModes() {
        if (document.fullscreenElement) document.exitFullscreen().catch(()=>{});
        if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen();
        exitDistractionFree();
      }

      document.getElementById('start-embed').onclick = goFullscreen;
      finishBtn.onclick = () => { leaveFullscreenModes(); completeTask(taskCode); };
      exitBtn.onclick = () => { leaveFullscreenModes(); fsShell.scrollIntoView({ behavior: 'smooth', block: 'start' }); enableFinish(); };

      const loadTimeout = setTimeout(() => {
        const note = document.createElement('div');
        note.className = 'embed-note';
        note.textContent = 'Still loading… if nothing appears soon, try exiting fullscreen and re-entering.';
        fsShell.appendChild(note);
      }, 7000);
      iframe.addEventListener('load', () => clearTimeout(loadTimeout), { once:true });

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
  const task = TASKS[taskCode];
  let extra = '';

  const requiredText = 'This task is required for study completion.';
  const eta  = (TASKS[taskCode] && TASKS[taskCode].estMinutes) ? `${TASKS[taskCode].estMinutes} minutes` : 'a few minutes';
  const reqs = (TASKS[taskCode] && TASKS[taskCode].requirements) || '—';

  if (taskCode === 'ASLCT') {
    const ASLCT_CODE = CONFIG.ASLCT_ACCESS_CODE;
    extra = `
      <div class="info-box helpful" style="margin-top: 10px;">
        <strong>ASLCT Access Code</strong>
        <p style="margin-top: 6px;">
          On the login page, enter access code:
          <span class="code" style="font-size:22px; background:#fff; color:#333; padding:4px 8px; border-radius:6px; display:inline-block;">${ASLCT_CODE}</span>
        </p>
        <button class="button outline" onclick="navigator.clipboard.writeText('${ASLCT_CODE}').then(()=>{ this.textContent='✅ Copied!'; setTimeout(()=>this.textContent='Copy Access Code',1500); })">Copy Access Code</button>
      </div>
      <div class="info-box helpful" style="margin-top: 10px;">
        <strong>Instructions:</strong>
        <ol style="margin: 10px 0 0 20px; text-align: left;">
          <li>Click "Open Task".</li>
          <li>On the ASLCT portal, paste the access code <em>${ASLCT_CODE}</em> and follow the prompts.</li>
          <li>Return here when finished and click "Mark Complete".</li>
        </ol>
      </div>
      <div style="margin-top: 10px; text-align: left;">
        <p>If you encounter any problems with the ASLCT, please describe them below and click Send.</p>
        <textarea id="aslct-issue-text" style="width: 100%; height: 80px; margin-top: 6px;"></textarea>
        <button class="button secondary" style="margin-top: 10px;" onclick="submitASLCTIssue()">Send</button>
      </div>`;
  } else if (taskCode === 'VCN') {
    extra = `
      <div class="info-box helpful" style="margin-top: 10px;">
        <strong>Virtual SILC Test of Navigation (SILCton) — What you'll do</strong>
        <p style="margin-top: 6px;">Learn a small virtual campus (Learning phase), then answer quick questions (Test phase).</p>
        <ul style="margin: 10px 0 0 20px; text-align: left;">
          <li><strong>Controls:</strong> Move with WASD/arrow keys; look around with the mouse.</li>
          <li>Desktop/laptop recommended (Chrome/Firefox). Keep this page open.</li>
        </ul>
      </div>`;
  }

  document.getElementById('task-title').textContent = task.name;
  document.getElementById('task-instructions').innerHTML = `
    <div class="info-box friendly-tip" style="margin-bottom:10px;">
      <strong>⚠️ Ready to Start ${task.name}?</strong>
      <ul style="margin:8px 0 0 20px; text-align:left;">
        <li>${requiredText}</li>
        <li>Having problems? Email us instead of skipping</li>
        <li>Estimated time: <strong>${eta}</strong></li>
        <li>Requirements/tips: <em>${reqs}</em></li>
      </ul>
    </div>
    <p>${task.description}</p>
    ${extra}
    <div class="info-box helpful" style="margin-top: 10px;">
      <strong>Instructions:</strong>
      <ol style="margin: 10px 0 0 20px; text-align: left;">
        <li>Click "Open Task" to launch in a new tab.</li>
        <li>Complete the task as instructed.</li>
        <li>Return to this tab when finished.</li>
        <li>Click "Mark Complete" to continue.</li>
      </ol>
    </div>
  `;

  const content = document.getElementById('task-content');
  content.innerHTML = `
    <div class="button-group">
      <a class="button" href="${task.url}" target="_blank" rel="noopener"
         aria-label="Open Task (opens in new tab)"
         onclick="sendToSheets({ action: 'task_opened', sessionCode: state.sessionCode || 'none', timestamp: new Date().toISOString(), userAgent: navigator.userAgent, deviceType: state.isMobile ? 'mobile/tablet' : 'desktop' });">
         Open Task
      </a>
      <button class="button success" onclick="completeTask('${taskCode}')">Mark Complete</button>
      <button class="button outline" onclick="openSupportEmail('${taskCode}')">Report Technical Issue Instead</button>
    </div>
  `;
  if (task.canSkip) {
    content.innerHTML += `
      <button class="button skip" onclick="showSkipDialog('${taskCode}')" style="display: block; margin: 20px auto;" title="Please try the task first or email ${CONFIG.SUPPORT_EMAIL} for help">
        ${taskCode === 'ASLCT' ? 'Unable to complete - I do not know ASL' : 'Unable to complete'}
      </button>
    `;
  }
  showScreen('task-screen');
}

function openExternalTask(taskCode) {
  const task = TASKS[taskCode];
  if (!task || !task.url) return;
  window.open(task.url, '_blank', 'noopener');
}

    // ----- Recording task -----
      function showRecordingTask() {
        state.recording.currentImage = 0;
        document.getElementById('recording-content').style.display = 'block';
        updateRecordingImage(state);
        setupUploadcareUploader(state, sendToSheets, completeTask);
        showScreen('recording-screen');
      }

function ensureTaskPointer(taskCode) {
      if (!state.sequence || !state.sequence.length) return;
      if (state.sequence[state.currentTaskIndex] !== taskCode) {
        const idx = state.sequence.indexOf(taskCode);
        if (idx !== -1) state.currentTaskIndex = idx;
      }
    }

    async function skipRecording() {
      if (!confirm('Unable to complete the image description task?')) return;
        try { await cleanupRecording(state); } catch(e) { console.warn('Cleanup on skip failed silently:', e); }
      ensureTaskPointer('ID'); skipTask('ID');
    }
  // ----- Complete/Skip -----
    function completeTask(taskCode) {
      const task = TASKS[taskCode]; if (!task) { console.error('Task not found:', taskCode); return; }
      taskTimer.stop();
      const summary = taskTimer.getSummary();
      state.totalTimeSpent += summary.elapsed;
      if (!state.completedTasks.includes(taskCode)) state.completedTasks.push(taskCode);
      state.skippedTasks = state.skippedTasks.filter(code => code !== taskCode);
      state.currentTaskIndex++;
      while (state.currentTaskIndex < state.sequence.length && state.completedTasks.includes(state.sequence[state.currentTaskIndex])) state.currentTaskIndex++;
      saveState();
        const payload = {
          sessionCode: state.sessionCode,
          task: getStandardTaskName(taskCode),
          elapsed: Math.round(summary.elapsed/1000),
          active: Math.round(summary.active/1000),
          pauseCount: summary.pauseCount,
          paused: Math.round(summary.paused/1000),
          inactive: Math.round(summary.inactive/1000),
          activity: Math.round(summary.activity),
          startTime: summary.start,
          endTime: summary.end,
          timestamp: new Date().toISOString(),
          deviceType: state.isMobile ? 'mobile/tablet' : 'desktop'
        };
        payload.action = task.skilled ? 'skilled_task_completed' : 'task_completed';
        if (taskCode === 'ID' && state.recording && state.recording.recordingDuration) {
          payload.recordingDuration = Math.round(state.recording.recordingDuration/1000);
        }
        sendToSheets(payload);
        logSessionTime(taskCode);
      state.currentTaskType = '';
      if (state.currentTaskIndex >= state.sequence.length) showCompletionScreen(); else showProgressScreen();
    }

    function skipTask(taskCode) {
      const task = TASKS[taskCode]; if (!task) { console.error('Task not found:', taskCode); return; }
      taskTimer.stop();
      if (taskCode === 'ID') {
        if (state.recording && (state.recording.stream || state.recording.active)) {
          try { if (state.recording.stream && state.recording.stream.getTracks) state.recording.stream.getTracks().forEach(t => t.stop()); } catch(e){}
          state.recording.active = false; state.recording.chunks = []; stopRecordingTimer();
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
        reason: taskCode === 'ASLCT' ? 'Does not know ASL' : 'User chose to skip',
        timestamp: new Date().toISOString(),
        deviceType: state.isMobile ? 'mobile/tablet' : 'desktop'
      });
      logSessionTime(taskCode + '_skipped');
      state.currentTaskType = '';
      if (state.currentTaskIndex >= state.sequence.length) showCompletionScreen(); else showProgressScreen();
    }

    // ----- Completion -----
    function showCompletionScreen() {
      document.getElementById('final-code').textContent = state.sessionCode;
      document.getElementById('total-time').textContent = Math.round(state.totalTimeSpent / 60000);
      showScreen('completion-screen');
      document.getElementById('pause-fab').classList.remove('active');
    }

    async function markComplete() {
      if (sessionTimer.startTime && !sessionTimer.endTime) sessionTimer.stop();
      const sessSummary = sessionTimer.getSummary();
      state.totalActiveTime = sessSummary.active;
      logSessionTime('final', sessSummary);
      const btn = document.getElementById('mark-complete-btn');
      btn.disabled = true;
      await sendToSheets({
        action: 'study_completed',
        sessionCode: state.sessionCode,
        status: 'Complete',
        totalDuration: Math.round(state.totalTimeSpent / 60000),
        deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
        timestamp: new Date().toISOString()
      });
      document.getElementById('completion-message').style.display = 'block';
    }

    // ----- Utilities -----
    function pauseStudy() {
      state.pauseStart = Date.now();
      state.lastPauseType = 'manual';
      if (taskTimer.startTime) taskTimer.pause('manual');
      if (sessionTimer.startTime) sessionTimer.pause('manual');
      document.getElementById('pause-modal').classList.add('active');
      document.getElementById('pause-fab').classList.remove('active');
        const { total, completed } = getTaskCounts();
        const progress = total ? `${completed}/${total}` : '';
        sendToSheets({ action: 'session_paused', sessionCode: state.sessionCode, progress, pauseType: 'manual', timestamp: new Date().toISOString() });
      saveState();
    }

    function resumeStudy() {
      if (state.pauseStart) {
        const pausedMs = Date.now() - state.pauseStart;
        state.totalPausedTime = (state.totalPausedTime || 0) + pausedMs;
        state.pauseStart = null;
          const { total, completed } = getTaskCounts();
          const progress = total ? `${completed}/${total}` : '';
          sendToSheets({ action: 'session_resumed', sessionCode: state.sessionCode, progress, pausedSeconds: Math.round(pausedMs/1000), pauseType: state.lastPauseType, timestamp: new Date().toISOString() });
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
        const { total, completed } = getTaskCounts();
        const progress = total ? `${completed}/${total}` : '';
        sendToSheets({ action: 'session_paused', sessionCode: state.sessionCode, progress, pauseType: 'exit', timestamp: new Date().toISOString() });
    }
      function showCopyFeedback(btnEl) {
        if (!btnEl) return;
        const original = btnEl.textContent;
        btnEl.textContent = '✅ Copied!';
        setTimeout(() => btnEl.textContent = original, 2000);
      }

      function fallbackCopy(text, btnEl) {
        const textarea = document.createElement('textarea');
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
        const code = document.getElementById('display-code').textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code)
            .then(() => {
              showCopyFeedback(btnEl);
            })
            .catch(() => fallbackCopy(code, btnEl));
        } else {
          fallbackCopy(code, btnEl);
        }
      }
      function generateRecoveryLink() {
        if (!state.sessionCode) return '';
        const token = btoa(state.sessionCode);
        return `${location.origin}${location.pathname}?recover=${encodeURIComponent(token)}`;
      }
      function copyRecoveryLink(btnEl) {
        const link = generateRecoveryLink();
        if (!link) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(link)
            .then(() => {
              showCopyFeedback(btnEl);
            })
            .catch(() => fallbackCopy(link, btnEl));
        } else {
          fallbackCopy(link, btnEl);
        }
      }

      function copyASLCTCode(btnEl) {
        const code = CONFIG.ASLCT_ACCESS_CODE;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code)
            .then(() => {
              showCopyFeedback(btnEl);
            })
            .catch(() => fallbackCopy(code, btnEl));
        } else {
          fallbackCopy(code, btnEl);
        }
      }

    function openEmbedInNewTab(taskCode) {
      const task = TASKS[taskCode];
      if (task && task.embedUrl) window.open(task.embedUrl, '_blank', 'noopener');
    }
    function reloadEmbed(iframeId) {
      const f = document.getElementById(iframeId);
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

    let pendingSkipTask = null;
    function showSkipDialog(taskCode) {
      pendingSkipTask = taskCode;
      document.getElementById('skip-modal').classList.add('active');
    }

    document.getElementById('skip-help-btn').onclick = () => {
      openSupportEmail(pendingSkipTask);
      sendToSheets({ action: 'help_requested', sessionCode: state.sessionCode || 'none', task: getStandardTaskName(pendingSkipTask), timestamp: new Date().toISOString() });
    };
    document.getElementById('skip-try-btn').onclick = () => {
      document.getElementById('skip-modal').classList.remove('active');
    };
    document.getElementById('skip-break-btn').onclick = () => {
      document.getElementById('skip-modal').classList.remove('active');
      pauseStudy();
    };
    document.getElementById('skip-confirm-btn').onclick = async () => {
      document.getElementById('skip-modal').classList.remove('active');
      await skipTaskProceed(pendingSkipTask);
    };

function openSupportEmail() {
  const subject = encodeURIComponent('Technical Support Request - Spatial Cognition Study');
  const body = encodeURIComponent(`Hi Action Brain Lab,

I need technical support with the spatial cognition study.

Device/Browser: 
Issue description: 
What I've tried: 
Accessibility needs (if any): 

Thank you!`);
  window.location.href = `mailto:${CONFIG.SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}

// Do the actual skip (handles video task cleanup)
  async function skipTaskProceed(taskCode) {
    if (taskCode === 'ID') {
      try { await cleanupRecording(state); } catch(e) {}
    }
    skipTask(taskCode);
  }


    function hashCode(str) { let hash = 0; for (let i=0;i<str.length;i++){const c=str.charCodeAt(i); hash=((hash<<5)-hash)+c; hash|=0;} return hash; }

    function submitASLCTIssue() {
      const el = document.getElementById('aslct-issue-text');
      if (!el) return;
      const message = el.value.trim();
      if (!message) return;
      sendToSheets({
        action: 'aslct_issue',
        sessionCode: state.sessionCode || 'none',
        participantID: state.participantID || 'none',
        message,
        timestamp: new Date().toISOString()
      });
      el.value = '';
      alert('Issue submitted. Thank you!');
    }

    // === REPLACE sendToSheets with this ===
async function sendToSheets(payload) {
  if (!CONFIG.SHEETS_URL) return;

  const body = { ...payload, userAgent: navigator.userAgent, deviceType: payload.deviceType || (state.isMobile ? 'mobile/tablet' : 'desktop') };

  try {
    await fetch(CONFIG.SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // simple request, bypasses CORS preflight
      body: JSON.stringify(body)
    });
  } catch (error) {
    console.error('Error sending to sheets:', error);
  }
}

/* === MS-RECORDER-CODE START === */
function msRecorderInit() {
  const $ = s => document.querySelector(s);

  const btnStart = $('#rec-start');
  const btnStop = $('#rec-stop');
  const btnUpload = $('#rec-upload');
  const statusEl = $('#rec-status');
  const progressEl = $('#rec-progress');
  const videoEl = $('#rec-preview-video');
  const audioEl = $('#rec-preview-audio');
  const modeInputs = Array.from(document.querySelectorAll('input[name="rec-mode"]'));

  let mediaStream = null;
  let mediaRecorder = null;
  let chunks = [];
  let recordedFile = null;
  let chosenMime = '';
  let currentMode = modeInputs.find(r => r.checked)?.value || 'video';

  modeInputs.forEach(r => r.addEventListener('change', () => {
    currentMode = modeInputs.find(x => x.checked)?.value || 'video';
    // Reset any previews when mode changes
    videoEl.style.display = 'none';
    audioEl.style.display = 'none';
    videoEl.src = '';
    audioEl.src = '';
    recordedFile = null;
    btnUpload.disabled = true;
    statusEl.textContent = `Mode set to ${currentMode === 'audio' ? 'Audio only' : 'Video + audio'}`;
  }));

  function pickMime(mode) {
    // Prefer mp4 on Safari, webm on Chromium, include audio candidates
    const ua = navigator.userAgent.toLowerCase();
    const isSafari = ua.includes('safari') && !ua.includes('chrome');
    const videoListSafariFirst = [
      'video/mp4;codecs=avc1,mp4a',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ];
    const videoListChromeFirst = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4;codecs=avc1,mp4a',
      'video/mp4'
    ];
    const audioListSafariFirst = [
      'audio/mp4;codecs=mp4a.40.2',
      'audio/mp4',
      'audio/webm;codecs=opus',
      'audio/webm'
    ];
    const audioListChromeFirst = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4;codecs=mp4a.40.2',
      'audio/mp4'
    ];

    const list = mode === 'audio'
      ? (isSafari ? audioListSafariFirst : audioListChromeFirst)
      : (isSafari ? videoListSafariFirst : videoListChromeFirst);

    for (const t of list) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) {
        return t;
      }
    }
    return ''; // let browser choose
  }

  async function startRecording() {
    try {
      btnStart.disabled = true;
      statusEl.textContent = 'Requesting media...';

      // === MS-LIVE-HOOK START ===
      const constraints = currentMode === 'audio'
        ? { audio: { echoCancellation: true, noiseSuppression: true }, video: false }
        : {
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
            audio: { echoCancellation: true, noiseSuppression: true }
          };

      const live = await msEnsureLivePreview(constraints);
      const stream = live || await navigator.mediaDevices.getUserMedia(constraints);
      // === MS-LIVE-HOOK END ===

      if (currentMode !== 'audio') {
        // === MS-LIVE-KEEP-VISIBLE START ===
        document.querySelector('#rec-preview-video')?.style && (
          document.querySelector('#rec-preview-video').style.display = ''
        );
        // === MS-LIVE-KEEP-VISIBLE END ===
      } else {
        document.querySelector('#rec-preview-video')?.style && (
          document.querySelector('#rec-preview-video').style.display = 'none'
        );
      }

      chosenMime = pickMime(currentMode);
      mediaStream = stream;

      chunks = [];
      // === MS-LIVE-RECORDER START ===
      mediaRecorder = chosenMime ? new MediaRecorder(stream, { mimeType: chosenMime })
                                 : new MediaRecorder(stream);
      // === MS-LIVE-RECORDER END ===

      mediaRecorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
      mediaRecorder.onstart = () => { statusEl.textContent = `Recording... ${chosenMime || '(default)'}`; };
      mediaRecorder.onstop = handleStop;

      // Start must be in a direct click handler. This function is bound directly to a click.
      mediaRecorder.start();
      btnStop.disabled = false;
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Failed to start recording. Check camera and mic permissions.';
      btnStart.disabled = false;
    }
  }

  function stopRecording() {
    try {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
      }
    } catch (e) {
      console.error(e);
      handleStop(); // finalize anyway
    }
  }

  function cleanupStream() {
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop());
      mediaStream = null;
    }
  }

  function handleStop() {
    try {
      const isAudio = currentMode === 'audio';
      const type = chosenMime || (isAudio ? 'audio/webm' : 'video/webm');
      let ext = 'webm';
      if (type.includes('mp4')) ext = isAudio ? 'm4a' : 'mp4';

      const blob = new Blob(chunks, { type });
      if (blob.size > RECORDING_BYTES_LIMIT) {
        statusEl.textContent = `Recording is ${Math.round(blob.size/1024/1024)} MB, over limit of ${Math.round(RECORDING_BYTES_LIMIT/1024/1024)} MB. Please record a shorter clip.`;
        recordedFile = null;
        btnUpload.disabled = true;
        return;
      }

      recordedFile = new File([blob], `study-recording.${ext}`, { type });

      // === MS-LIVE-PLAYBACK START ===
      const el = document.querySelector('#rec-preview-video');
      if (el) {
        try { el.pause(); } catch (_) {}
        el.srcObject = null;
        el.src = URL.createObjectURL(recordedFile);
        try { el.src += '#t=0.001'; } catch (_) {}
        el.style.display = '';
        // Do not auto play recorded clip to avoid autoplay policies
      }
      // === MS-LIVE-PLAYBACK END ===

      // Preview
      if (isAudio) {
        audioEl.src = URL.createObjectURL(recordedFile);
        audioEl.style.display = '';
        videoEl.style.display = 'none';
      } else {
        audioEl.style.display = 'none';
      }

      statusEl.textContent = `Ready to upload, ${Math.round(recordedFile.size/1024/1024)} MB`;
      btnUpload.disabled = false;
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Error finalizing recording.';
    } finally {
      btnStop.disabled = true;
      btnStart.disabled = false;
      cleanupStream();
    }
  }

  function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
      // Use video endpoint for both video and audio
      const url = `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/video/upload`;
      const form = new FormData();
      form.append('file', file, file.name);
      form.append('upload_preset', CONFIG.CLOUDINARY_UPLOAD_PRESET);
      form.append('folder', CONFIG.CLOUDINARY_FOLDER);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', url);

      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          progressEl.style.display = '';
          progressEl.value = pct;
          statusEl.textContent = `Uploading... ${pct}%`;
        }
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          progressEl.style.display = 'none';
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const res = JSON.parse(xhr.responseText);
              statusEl.textContent = 'Upload complete';
              resolve(res);
            } catch (err) {
              statusEl.textContent = 'Upload complete, parse error';
              resolve({ raw: xhr.responseText });
            }
          } else {
            statusEl.textContent = `Upload failed, status ${xhr.status}`;
            reject(new Error(xhr.responseText || `HTTP ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => {
        progressEl.style.display = 'none';
        statusEl.textContent = 'Network error during upload';
        reject(new Error('Network error'));
      };

      xhr.send(form);
    });
  }

  // Bind click handlers. Keep these as real user gestures.
  btnStart.addEventListener('click', startRecording);
  btnStop.addEventListener('click', stopRecording);
  btnUpload.addEventListener('click', async () => {
    if (!recordedFile) return;
    btnUpload.disabled = true;
    try {
      const res = await uploadToCloudinary(recordedFile);
      console.log('Cloudinary response', res);
      statusEl.textContent = 'Uploaded successfully';
    } catch (e) {
      console.error(e);
      statusEl.textContent = 'Upload error. Please try again.';
      btnUpload.disabled = false;
    }
  });

  // Support case where MediaRecorder is missing
  if (!window.MediaRecorder) {
    statusEl.textContent = 'MediaRecorder not supported in this browser.';
    btnStart.disabled = true;
    btnStop.disabled = true;
    btnUpload.disabled = true;
  }
}
/* === MS-RECORDER-CODE END === */

window.addEventListener('beforeunload', () => {
  if (!CONFIG.SHEETS_URL) return;
  const body = {
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
// Expose functions to window
Object.assign(window, {
  // Clipboard and communication helpers
  copyASLCTCode,
  copyCode,
  copyEmail,
  copyRecoveryLink,
  openSupportEmail,
  tryMailto,

  // EEG flow handlers
  closeEEGModal,
  proceedToEEGInfo,

  // Debug utilities
  debugVideoUpload,
  submitASLCTIssue,
  testCloudinaryUpload,

  // EEG scheduling utilities
  expressEEGInterest,
  markEEGScheduled,
  scheduleEEG,

  // Session handlers
  createNewSession,
  pauseStudy,
  proceedToTasks,
  resumeSession,
  resumeStudy,
  saveAndExit,

  // Task flow helpers
  completeTask,
  continueToCurrentTask,
  markComplete,
  openEmbedInNewTab,
  reloadEmbed,
  showScreen,
  showSkipDialog,
  skipCurrentTask,
  skipTask,
  skipTaskProceed,

});

