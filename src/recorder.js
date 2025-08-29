import { CONFIG } from './config.js';
import { TASKS } from './tasks.js';
import { uploadVideoToDrive } from './videoUpload.js';

function revokeRecordedURL() {
  const recorded = document.getElementById('recorded-video');
  if (recorded && recorded.src) {
    try { URL.revokeObjectURL(recorded.src); } catch (e) {}
    recorded.removeAttribute('src');
    if (recorded.load) recorded.load();
  }
}

export async function startPreview(state) {
  const preview = document.getElementById('video-preview');
  if (!preview) return;
  preview.muted = true;
  preview.playsInline = true;
  preview.autoplay = true;
  if (state.recording.stream) {
    preview.srcObject = state.recording.stream;
    preview.style.display = state.recording.isVideoMode ? 'block' : 'none';
    if (state.recording.isVideoMode) preview.play().catch(() => {});
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    state.recording.stream = stream;
    state.recording.isVideoMode = true;
    preview.srcObject = stream;
    preview.style.display = 'block';
    preview.play().catch(() => {});
  } catch (videoErr) {
    console.warn('Video preview failed, trying audio-only', videoErr);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.recording.stream = stream;
      state.recording.isVideoMode = false;
      preview.style.display = 'none';
      const status = document.getElementById('recording-status');
      status.textContent = '🎤 Audio ready to record';
      status.className = 'recording-status ready';
    } catch (err) {
      console.error('Audio preview failed', err);
      showRecordingError('<strong>Camera or microphone not available</strong><p style="margin-top: 6px;">Please upload a recording instead.</p>');
    }
  }
}

export function updateRecordingImage(state) {
  const imageNum = state.recording.currentImage + 1;
  document.getElementById('image-number').textContent = imageNum;
  document.getElementById('current-image').src = imageNum === 1 ? CONFIG.IMAGE_1 : CONFIG.IMAGE_2;

  const preview = document.getElementById('video-preview');
  const recorded = document.getElementById('recorded-video');
  preview.style.display = 'none';
  recorded.style.display = 'none';

  revokeRecordedURL();
  state.recording.currentBlob = null;

  document.getElementById('record-btn').style.display = 'inline-block';
  document.getElementById('rerecord-btn').style.display = 'none';
  document.getElementById('save-recording-btn').style.display = 'none';

  const status = document.getElementById('recording-status');
  status.textContent = 'Ready to record';
  status.className = 'recording-status ready';

  document.getElementById('recording-error').style.display = 'none';
  document.getElementById('video-upload-fallback').style.display = 'none';
  document.getElementById('upload-progress').style.display = 'none';

  const fileInput = document.getElementById('video-file-input');
  if (fileInput) fileInput.value = '';

  const uploadBtn = document.getElementById('upload-save-btn');
  if (uploadBtn) {
    uploadBtn.style.display = 'none';
    uploadBtn.textContent = 'Use this upload';
  }

  const recordingInstructions = document.createElement('div');
  recordingInstructions.className = 'info-box important';
  recordingInstructions.id = 'recording-size-warning';
  recordingInstructions.innerHTML = `
  <strong>📹 Recording Guidelines</strong>
  <ul style="margin: 8px 0 0 20px; text-align: left;">
    <li><strong>Duration:</strong> Keep recordings between 30-60 seconds</li>
    <li><strong>File size:</strong> Recordings over 45 seconds may fail to upload</li>
    <li><strong>Language:</strong> Use ASL if you know it, otherwise spoken English</li>
    <li><strong>Can't record?</strong> Use the "Upload a Recording" option below</li>
  </ul>
`;

  const recordingContent = document.getElementById('recording-content');
  const recordingControls = recordingContent ? recordingContent.querySelector('.recording-controls') : null;
  if (recordingControls && recordingControls.parentNode && !document.getElementById('recording-size-warning')) {
    recordingControls.parentNode.insertBefore(recordingInstructions, recordingControls);
  }

  const requiredTextRec = 'This task is required for study completion.';
  const etaRec = (TASKS['ID'] && TASKS['ID'].estMinutes) ? `${TASKS['ID'].estMinutes} minutes` : 'a few minutes';
  const reqsRec = (TASKS['ID'] && TASKS['ID'].requirements) || '—';

  const instructionBox = document.getElementById('task-instructions');
  if (instructionBox) {
    document.getElementById('task-title').textContent = TASKS['ID'].name;
    instructionBox.innerHTML = `
      <div class="info-box friendly-tip" style="margin-bottom:10px;">
        <strong>⚠️ Ready to Start ${TASKS['ID'].name}?</strong>
        <ul style="margin:8px 0 0 20px; text-align:left;">
          <li>${requiredTextRec}</li>
          <li>Having problems? Email us instead of skipping</li>
          <li>Estimated time: <strong>${etaRec}</strong></li>
          <li>Requirements/tips: <em>${reqsRec}</em></li>
        </ul>
      </div>
    `;
  }
}

function showRecordingError(html, showFallback = true) {
  const box = document.getElementById('recording-error');
  if (!box) return;
  box.style.display = 'block';
  box.innerHTML = html;
  if (showFallback) {
    const fb = document.getElementById('video-upload-fallback');
    if (fb) fb.style.display = 'block';
  }
}

export function enhanceUploadFallback(state, saveRecordingFn) {
  const fallbackDiv = document.getElementById('video-upload-fallback');
  if (fallbackDiv) {
    fallbackDiv.innerHTML = `
    <h3>📁 Upload a Recording Instead</h3>
    <div class="info-box helpful" style="margin: 15px 0;">
      <strong>Upload Instructions:</strong>
      <ol style="margin: 8px 0 0 20px; text-align: left;">
        <li>Record a 30-60 second video/audio on your device</li>
        <li>Accepted formats: MP4, MOV, WebM (video) or MP3, M4A, WAV (audio)</li>
        <li>Maximum size: 50MB for MP4/MOV, 40MB for WebM, 25MB for audio</li>
        <li>Select your file below</li>
      </ol>
    </div>
    <input type="file"
           id="video-file-input"
           accept="video/mp4,video/quicktime,video/webm,video/*,audio/mp3,audio/mpeg,audio/m4a,audio/wav,audio/*,.mp4,.mov,.webm,.mp3,.m4a,.wav"
           style="margin: 15px 0; padding: 10px; border: 2px solid var(--gray-300); border-radius: 8px; width: 100%;" />
    <div id="file-info" style="margin: 10px 0; font-weight: bold;"></div>
    <div class="button-group">
      <button class="button success" id="upload-save-btn" style="display:none;">Upload This File</button>
    </div>
    <p style="font-size: 14px; color: var(--text-secondary); margin-top: 10px;">
      💡 Tips: Use Camera app for video (iPhone/Android) or Voice Memos for audio (iPhone) or Voice Recorder (Android)
    </p>
  `;
  }
  bindUploadFallback(state, saveRecordingFn);
}

function bindUploadFallback(state, saveRecordingFn) {
  const input = document.getElementById('video-file-input');
  const btn = document.getElementById('upload-save-btn');
  const info = document.getElementById('file-info');
  if (!input || !btn || !info) return;

  input.addEventListener('change', () => {
    const f = input.files && input.files[0];
    if (!f) return;

    if (!f.type.startsWith('video/') && !f.type.startsWith('audio/')) {
      alert('Please select a video or audio file');
      input.value = '';
      info.textContent = '';
      btn.style.display = 'none';
      return;
    }

    let format = 'audio';
    if (f.type.includes('mp4') || f.name.toLowerCase().endsWith('.mp4')) format = 'mp4';
    else if (f.type.includes('quicktime') || f.name.toLowerCase().endsWith('.mov')) format = 'mov';
    else if (f.type.includes('webm') || f.name.toLowerCase().endsWith('.webm')) format = 'webm';
    else if (f.type.startsWith('video/')) format = 'other-video';

    const sizeLimits = { mp4: 50, mov: 50, webm: 40, 'other-video': 40, audio: 25 };
    const maxMB = sizeLimits[format];
    const sizeMB = f.size / (1024 * 1024);
    if (sizeMB > maxMB) {
      alert(`File too large: ${sizeMB.toFixed(1)}MB. Maximum for ${format.toUpperCase()} is ${maxMB}MB.`);
      input.value = '';
      info.textContent = '';
      btn.style.display = 'none';
      return;
    }

    state.recording.currentBlob = f;
    info.textContent = `${f.name} (${sizeMB.toFixed(1)}MB)`;
    btn.style.display = 'inline-block';
  });

  btn.addEventListener('click', saveRecordingFn);
}

export function bindRecordingSkips(showSkipDialog) {
  const btn1 = document.getElementById('skip-recording-btn');
  if (btn1) btn1.addEventListener('click', () => showSkipDialog('ID'));
}

function startRecordingTimer(state) {
  const timer = document.getElementById('recording-timer');
  timer.style.display = 'block';
  let seconds = 0;
  state.recording.recordingStart = Date.now();
  state.recording._timer = setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, 1000);
}

function stopRecordingTimer(state) {
  clearInterval(state.recording._timer);
  const t = document.getElementById('recording-timer');
  if (t) t.style.display = 'none';
  if (state.recording.recordingStart) {
    state.recording.recordingDuration = Date.now() - state.recording.recordingStart;
  }
}

export async function toggleRecording(state) {
  const btn = document.getElementById('record-btn');
  const status = document.getElementById('recording-status');
  const preview = document.getElementById('video-preview');
  if (!state.recording.mediaRecorder) {
    if (!state.recording.stream) await startPreview(state);
    if (!state.recording.stream) return;
    let mimeType;
    if (state.recording.isVideoMode) {
      mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' :
        MediaRecorder.isTypeSupported('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' : 'video/webm';
    } else {
      mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
    }
    state.recording.chunks = [];
    state.recording.mediaRecorder = new MediaRecorder(state.recording.stream, { mimeType });
    state.recording.mediaRecorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) state.recording.chunks.push(e.data);
    };
    state.recording.mediaRecorder.onstop = () => {
      const blob = new Blob(state.recording.chunks, { type: mimeType });
      state.recording.currentBlob = blob;
      revokeRecordedURL();
      const recordedEl = document.getElementById('recorded-video');
      if (state.recording.isVideoMode) {
        recordedEl.src = URL.createObjectURL(blob);
        recordedEl.style.display = 'block';
        preview.style.display = 'none';
      } else {
        const audioPlayer = document.createElement('audio');
        audioPlayer.id = 'recorded-audio';
        audioPlayer.controls = true;
        audioPlayer.src = URL.createObjectURL(blob);
        const container = recordedEl.parentElement;
        const existing = document.getElementById('recorded-audio');
        if (existing) existing.remove();
        container.insertBefore(audioPlayer, recordedEl);
        recordedEl.style.display = 'none';
      }
      document.getElementById('record-btn').style.display = 'none';
      document.getElementById('rerecord-btn').style.display = 'inline-block';
      document.getElementById('save-recording-btn').style.display = 'inline-block';
      status.textContent = '✅ Recording complete! Ready to save.';
      status.className = 'recording-status recorded';
      state.recording.mediaRecorder = null;
    };
  }
  if (state.recording.mediaRecorder && state.recording.mediaRecorder.state === 'recording') {
    state.recording.mediaRecorder.stop();
    btn.textContent = 'Start Recording';
    btn.className = 'button danger';
    stopRecordingTimer(state);
  } else if (state.recording.mediaRecorder) {
    state.recording.mediaRecorder.start();
    startRecordingTimer(state);
    btn.textContent = 'Stop Recording';
    btn.className = 'button danger';
    status.textContent = state.recording.isVideoMode ? '🔴 Recording video...' : '🎤 Recording audio...';
    status.className = 'recording-status recording';
  }
}

export async function reRecord(state) {
  await cleanupRecording(state, true);
  updateRecordingImage(state);
  if (window.isSecureContext) startPreview(state);
}

export async function saveRecording(state, sendToSheets, completeTask) {
  if (!state.recording.currentBlob) {
    alert('Please record or upload a recording first.');
    return;
  }

  const saveBtn = document.getElementById('save-recording-btn');
  const originalText = saveBtn.textContent;
  saveBtn.disabled = true;
  saveBtn.textContent = 'Processing...';

  const status = document.getElementById('recording-status');
  status.textContent = '⚙️ Processing recording...';
  status.className = 'recording-status recording';

  const uploadProgress = document.getElementById('upload-progress');
  uploadProgress.style.display = 'block';

  const recType = state.recording.isVideoMode ? 'video'
    : (state.recording.currentBlob && state.recording.currentBlob.type && state.recording.currentBlob.type.startsWith('audio') ? 'audio' : 'video');

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

  try {
    const uploadResult = await uploadVideoToDrive(
      state.recording.currentBlob,
      state.sessionCode,
      state.recording.currentImage + 1,
      sendToSheets
    );

    if (uploadResult.success) {
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

      const logData = {
        action: 'image_recorded_and_uploaded',
        sessionCode: state.sessionCode,
        imageNumber: state.recording.currentImage + 1,
        driveFileId: uploadResult.fileId,
        filename: uploadResult.filename,
        timestamp: new Date().toISOString(),
        deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
        uploadMethod: uploadResult.uploadMethod,
        fileSize: Math.round(state.recording.currentBlob.size / 1024),
        uploadStatus: 'success',
        recordingType: state.recording.isVideoMode ? 'video' : 'audio',
        mimeType: state.recording.currentBlob.type
      };

      sendToSheets(logData);

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

      status.textContent = `✅ Upload complete via ${uploadResult.uploadMethod}!`;
      status.className = 'recording-status recorded';
      uploadProgress.style.display = 'none';

      setTimeout(() => {
        if (state.recording.currentImage === 0) {
          state.recording.currentImage = 1;
          updateRecordingImage(state);
          if (window.isSecureContext) startPreview(state);
        } else {
          completeTask('ID');
        }
      }, 1000);
    } else {
      throw new Error(uploadResult.error || 'Upload failed');
    }
  } catch (error) {
    console.error('Upload error:', error);

    sendToSheets({
      action: 'log_video_upload_error',
      sessionCode: state.sessionCode,
      imageNumber: state.recording.currentImage + 1,
      error: error.message,
      timestamp: new Date().toISOString(),
      deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
      attemptedMethod: 'drive',
      recordingType: state.recording.isVideoMode ? 'video' : 'audio',
      mimeType: state.recording.currentBlob.type
    });

    status.textContent = '⚠️ Upload failed. Retrying...';
    status.className = 'recording-status recording';
    enqueueFailedUpload(state, state.recording.currentBlob, state.sessionCode, state.recording.currentImage + 1, sendToSheets, completeTask);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = originalText;
  }
}

export async function retryVideoUpload(state, sendToSheets, completeTask) {
  document.getElementById('recording-error').style.display = 'none';
  await saveRecording(state, sendToSheets, completeTask);
}

function enqueueFailedUpload(state, blob, sessionCode, imageNumber, sendToSheets, completeTask) {
  state.uploadQueue.push({ blob, sessionCode, imageNumber, attempts: 0 });
  processUploadQueue(state, sendToSheets, completeTask);
}

async function processUploadQueue(state, sendToSheets, completeTask) {
  if (state.processingUpload || state.uploadQueue.length === 0) return;
  state.processingUpload = true;
  const item = state.uploadQueue[0];
  try {
    const uploadResult = await uploadVideoToDrive(item.blob, item.sessionCode, item.imageNumber, sendToSheets);
    if (uploadResult.success) {
      handleUploadSuccess(state, uploadResult, item.imageNumber, item.blob, sendToSheets, completeTask);
      state.uploadQueue.shift();
    } else {
      throw new Error(uploadResult.error || 'Upload failed');
    }
  } catch (err) {
    item.attempts++;
    if (item.attempts < 3) {
      setTimeout(() => {
        state.processingUpload = false;
        processUploadQueue(state, sendToSheets, completeTask);
      }, 5000 * item.attempts);
      return;
    }
    state.uploadQueue.shift();
    showUploadError(state, err, item.imageNumber, item.blob, sendToSheets);
  }
  state.processingUpload = false;
  if (state.uploadQueue.length > 0) processUploadQueue(state, sendToSheets, completeTask);
}

function handleUploadSuccess(state, uploadResult, imageNumber, blob, sendToSheets, completeTask) {
  state.recording.recordings.push({
    image: imageNumber,
    blob,
    timestamp: new Date().toISOString(),
    driveFileId: uploadResult.fileId,
    driveFileUrl: uploadResult.fileUrl,
    filename: uploadResult.filename,
    uploadMethod: uploadResult.uploadMethod,
    recordingType: state.recording.isVideoMode ? 'video' : 'audio',
    mimeType: blob.type
  });

  const logData = {
    action: 'image_recorded_and_uploaded',
    sessionCode: state.sessionCode,
    imageNumber,
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
    imageNumber,
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

  const status = document.getElementById('recording-status');
  status.textContent = `✅ Upload complete via ${uploadResult.uploadMethod}!`;
  status.className = 'recording-status recorded';
  document.getElementById('upload-progress').style.display = 'none';

  setTimeout(() => {
    if (imageNumber === 1 && state.recording.currentImage === 0) {
      state.recording.currentImage = 1;
      updateRecordingImage(state);
      if (window.isSecureContext) startPreview(state);
    } else {
      completeTask('ID');
    }
  }, 1000);
}

function showUploadError(state, error, imageNumber, blob, sendToSheets) {
  sendToSheets({
    action: 'log_video_upload_error',
    sessionCode: state.sessionCode,
    imageNumber,
    error: error.message,
    timestamp: new Date().toISOString(),
    deviceType: state.isMobile ? 'mobile/tablet' : 'desktop',
    attemptedMethod: 'drive',
    recordingType: state.recording.isVideoMode ? 'video' : 'audio',
    mimeType: blob.type
  });

  const uploadProgress = document.getElementById('upload-progress');
  uploadProgress.style.display = 'none';
  const errorDiv = document.getElementById('recording-error');
  errorDiv.style.display = 'block';
  errorDiv.innerHTML = `
      <strong>Upload failed</strong>
      <p style="margin-top: 6px;">Error: ${error.message}. You can try again or continue without uploading. The video is saved locally in your browser.</p>
      <div class="button-group" style="margin-top: 10px;"><button class="button" onclick="retryVideoUpload()">Try Again</button><button class="button secondary" onclick="continueWithoutUpload()">Continue Without Upload</button></div>`;
  const status = document.getElementById('recording-status');
  status.textContent = '❌ Upload failed';
  status.className = 'recording-status ready';
}

export function cleanupRecording(state, keepPreviewUI = false) {
  return new Promise(resolve => {
    try {
      if (state.recording.mediaRecorder && state.recording.mediaRecorder.state !== 'inactive') {
        state.recording.mediaRecorder.addEventListener('stop', () => resolve(), { once: true });
        try { state.recording.mediaRecorder.stop(); } catch (e) { resolve(); }
      } else { resolve(); }
    } catch (e) { resolve(); }
  }).finally(() => {
    try { if (state.recording.stream) state.recording.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
    state.recording.stream = null;
    state.recording.active = false;
    state.recording.chunks = [];
    stopRecordingTimer(state);

    if (!keepPreviewUI) {
      const preview = document.getElementById('video-preview');
      if (preview) {
        if (preview.pause) preview.pause();
        preview.srcObject = null;
        preview.style.display = 'none';
      }
      const recorded = document.getElementById('recorded-video');
      if (recorded) {
        revokeRecordedURL();
        recorded.style.display = 'none';
      }
      state.recording.mediaRecorder = null;
    }
  });
}

export default {
  startPreview,
  updateRecordingImage,
  enhanceUploadFallback,
  bindRecordingSkips,
  toggleRecording,
  reRecord,
  saveRecording,
  retryVideoUpload,
  cleanupRecording
};
