import { CONFIG } from './config.js';

export function updateRecordingImage(state) {
  const imageNum = state.recording.currentImage + 1;
  const numSpan = document.getElementById('image-number');
  const img = document.getElementById('current-image');
  if (numSpan) numSpan.textContent = imageNum;
  if (img) img.src = imageNum === 1 ? CONFIG.IMAGE_1 : CONFIG.IMAGE_2;

  const status = document.getElementById('recording-status');
  if (status) {
    status.textContent = 'Ready to upload';
    status.className = 'recording-status ready';
  }

  const ctx = document.getElementById('ucctx');
  if (ctx && ctx.uploadCollection && typeof ctx.uploadCollection.clearAll === 'function') {
    ctx.uploadCollection.clearAll();
  }
}

export function setupUploadcareUploader(state, sendToSheets, completeTask) {
  const cfg = document.querySelector('uc-config[ctx-name="study-uploader"]');
  if (cfg) {
    cfg.metadata = () => ({
      session_code: state.sessionCode,
      image_number: state.recording.currentImage + 1
    });
  }

  const ctx = document.getElementById('ucctx');
  if (!ctx) return;

  ctx.addEventListener('file-upload-success', (e) => {
    const entry = e.detail;
    const cdnUrl = (entry.cdnUrl || (entry.fileInfo && entry.fileInfo.cdnUrl) || '').replace(/\/$/, '');
    const mime = entry.mimeType || (entry.fileInfo && entry.fileInfo.mimeType) || '';
    const imageNumber = state.recording.currentImage + 1;

    sendToSheets({
      action: 'image_recorded_and_uploaded',
      sessionCode: state.sessionCode,
      imageNumber,
      fileUrl: cdnUrl,
      filename: (entry.fileInfo && entry.fileInfo.originalFilename) || '',
      uploadMethod: 'uploadcare',
      recordingType: 'video',
      mimeType: mime
    });

    const status = document.getElementById('recording-status');
    if (status) {
      status.textContent = '✅ Upload complete!';
      status.className = 'recording-status recorded';
    }

    setTimeout(() => {
      if (state.recording.currentImage === 0) {
        state.recording.currentImage = 1;
        updateRecordingImage(state);
      } else {
        completeTask('ID');
      }
    }, 1000);
  });
}

export function bindRecordingSkips(showSkipDialog) {
  const btn = document.getElementById('skip-recording-btn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showSkipDialog('ID');
    });
  }
}

export function cleanupRecording() {
  return Promise.resolve();
}

export default {
  updateRecordingImage,
  setupUploadcareUploader,
  bindRecordingSkips,
  cleanupRecording
};
