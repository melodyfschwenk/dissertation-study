import { CONFIG } from './config.js';

export async function uploadToCloudinary(videoBlob, sessionCode, imageNumber) {
  try {
    console.log('Starting Cloudinary upload...');
    console.log('Config check:', {
      cloudName: CONFIG.CLOUDINARY_CLOUD_NAME,
      uploadPreset: CONFIG.CLOUDINARY_UPLOAD_PRESET
    });

    if (!CONFIG.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary cloud name not configured');
    }
    if (!CONFIG.CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('Cloudinary upload preset not configured');
    }

    const formData = new FormData();
    formData.append('file', videoBlob);
    formData.append('upload_preset', CONFIG.CLOUDINARY_UPLOAD_PRESET);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${sessionCode}/image${imageNumber}_${timestamp}`;
    formData.append('public_id', filename);
    formData.append('folder', 'spatial-cognition-videos');

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/video/upload`,
      { method: 'POST', body: formData }
    );

    const responseText = await response.text();
    console.log('Cloudinary response:', responseText);

    if (!response.ok) {
      let errorDetail = responseText;
      try {
        const errorJson = JSON.parse(responseText);
        errorDetail = (errorJson.error && errorJson.error.message) || responseText;
      } catch (e) {}
      throw new Error(`Cloudinary error: ${errorDetail}`);
    }

    const result = JSON.parse(responseText);
    console.log('Cloudinary upload successful:', result);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      duration: result.duration
    };
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    return { success: false, error: error.message };
  }
}

export async function uploadVideoToDrive(videoBlob, sessionCode, imageNumber, sendToSheets) {
  try {
    updateUploadProgress(5, 'Starting upload...');
    console.log('Trying Cloudinary first...');
    updateUploadProgress(10, 'Uploading to cloud storage...');

    const cloudinaryResult = await uploadToCloudinary(videoBlob, sessionCode, imageNumber);
    if (cloudinaryResult.success) {
      updateUploadProgress(100, 'Upload complete!');
      await sendToSheets({
        action: 'log_video_upload',
        sessionCode,
        imageNumber,
        filename: `image${imageNumber}_${Date.now()}.webm`,
        fileId: cloudinaryResult.publicId,
        fileUrl: cloudinaryResult.url,
        fileSize: Math.round(cloudinaryResult.size / 1024),
        uploadTime: new Date().toISOString(),
        uploadMethod: 'cloudinary',
        uploadStatus: 'success'
      });
      return {
        success: true,
        filename: cloudinaryResult.publicId,
        fileId: cloudinaryResult.publicId,
        fileUrl: cloudinaryResult.url,
        uploadMethod: 'cloudinary'
      };
    } else {
      console.log('Cloudinary failed, trying Google Drive fallback...');
      updateUploadProgress(30, 'Trying backup upload method...');
      return await uploadToGoogleDrive(videoBlob, sessionCode, imageNumber);
    }
  } catch (error) {
    console.error('All upload methods failed:', error);
    return { success: false, error: error.message };
  }
}

export async function uploadToGoogleDrive(videoBlob, sessionCode, imageNumber) {
  try {
    updateUploadProgress(15, 'Preparing upload…');
    let videoFormat = 'webm';
    if (videoBlob.recordingFormat) {
      videoFormat = videoBlob.recordingFormat;
    } else if (videoBlob.type) {
      if (videoBlob.type.includes('mp4') || videoBlob.type.includes('mpeg4')) {
        videoFormat = 'mp4';
      } else if (videoBlob.type.includes('quicktime')) {
        videoFormat = 'mov';
      } else if (videoBlob.type.includes('webm')) {
        videoFormat = 'webm';
      }
    } else if (videoBlob.name) {
      const ext = videoBlob.name.split('.').pop().toLowerCase();
      if (['mp4', 'mov', 'webm', 'avi', 'mkv'].includes(ext)) {
        videoFormat = ext;
      }
    }

    console.log(`Upload format detected: ${videoFormat}, size: ${(videoBlob.size/1024/1024).toFixed(2)}MB`);

    const sizeLimits = {
      'mp4': 55 * 1024 * 1024,
      'mov': 50 * 1024 * 1024,
      'webm': 40 * 1024 * 1024,
      'avi': 35 * 1024 * 1024,
      'mkv': 40 * 1024 * 1024
    };
    const maxSize = sizeLimits[videoFormat] || 35 * 1024 * 1024;
    if (videoBlob.size > maxSize) {
      const currentMB = (videoBlob.size / (1024 * 1024)).toFixed(1);
      const maxMB = (maxSize / (1024 * 1024)).toFixed(0);
      throw new Error(`Video too large: ${currentMB}MB. Maximum for ${videoFormat.toUpperCase()}: ${maxMB}MB. Please record a shorter video (30-45 seconds).`);
    }

    updateUploadProgress(20, `Converting ${videoFormat} for upload...`);
    const base64DataUrl = await blobToBase64(videoBlob);
    const base64VideoData = base64DataUrl.split(',')[1] || base64DataUrl.split(',').pop();
    updateUploadProgress(25, 'Encoding complete...');

    const uploadData = {
      action: 'upload_video',
      sessionCode,
      imageNumber,
      videoData: base64VideoData,
      videoFormat,
      mimeType: videoBlob.type || '',
      fileName: videoBlob.name || '',
      fileSize: videoBlob.size,
      timestamp: new Date().toISOString()
    };

    updateUploadProgress(30, `Uploading ${videoFormat.toUpperCase()} to Google Drive...`);
    const response = await fetch(CONFIG.SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(uploadData)
    });
    updateUploadProgress(75, 'Processing response...');

    let result;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      try {
        result = JSON.parse(text);
      } catch (e) {
        console.error('Response text:', text);
        throw new Error('Invalid response format from server');
      }
    }

    if (!response.ok || !result.success) {
      throw new Error(result.error || result.details || `Upload failed (${response.status})`);
    }

    updateUploadProgress(100, 'Upload complete!');
    return {
      success: true,
      filename: result.filename,
      fileId: result.fileId,
      fileUrl: result.fileUrl,
      format: result.format || videoFormat
    };
  } catch (error) {
    console.error('Google Drive upload error:', error);
    return { success: false, error: error.message || String(error) };
  }
}

export function updateUploadProgress(percent, message) {
  const progressDiv = document.getElementById('upload-progress');
  const progressFill = document.getElementById('upload-progress-fill');
  const status = document.getElementById('upload-status');
  if (progressDiv) progressDiv.style.display = 'block';
  if (progressFill) progressFill.style.width = `${percent}%`;
  if (status) status.textContent = `${percent}%`;
  const progressText = progressDiv ? progressDiv.querySelector('div[style*="font-weight: bold"]') : null;
  if (progressText && message) {
    progressText.textContent = message;
  }
}

export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function getExtensionFromMime(mime) {
  if (!mime) return 'bin';
  mime = mime.toLowerCase();
  if (mime.includes('mp4') || mime.includes('m4a')) return 'mp4';
  if (mime.includes('ogg')) return 'ogg';
  if (mime.includes('wav')) return 'wav';
  if (mime.includes('webm')) return 'webm';
  return 'bin';
}
