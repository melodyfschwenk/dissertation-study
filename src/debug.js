import { CONFIG } from './config.js';
import { blobToBase64, uploadToCloudinary } from './videoUpload.js';

export async function debugVideoUpload() {
  console.log('🔍 Starting video upload debug...');

  console.log('1. Configuration check:');
  console.log('SHEETS_URL:', CONFIG.SHEETS_URL);

  console.log('2. Testing basic connection...');
  try {
    const res = await fetch(CONFIG.SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'test_connection',
        timestamp: new Date().toISOString()
      })
    });

    console.log('✅ Connection response:', {
      status: res.status,
      ok: res.ok,
      statusText: res.statusText,
      contentType: res.headers.get('content-type')
    });

    const text = await res.text();
    let payload;
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
    console.log('✅ Connection result:', payload);
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return;
  }

  console.log('3. Creating test video blob...');
  try {
    const testData = new Uint8Array([0x1A, 0x45, 0xDF, 0xA3]);
    const testBlob = new Blob([testData], { type: 'video/webm' });

    console.log('Test blob created:', {
      size: testBlob.size,
      type: testBlob.type
    });

    console.log('4. Testing base64 conversion...');
    const base64Data = await blobToBase64(testBlob);
    const base64VideoData = base64Data.split(',')[1];

    console.log('✅ Base64 conversion successful:', {
      originalSize: testBlob.size,
      base64Length: base64VideoData.length
    });

    console.log('5. Testing upload with tiny file...');
    const uploadData = {
      action: 'upload_video',
      sessionCode: 'DEBUG_' + Date.now(),
      imageNumber: 99,
      videoData: base64VideoData,
      mimeType: testBlob.type,
      timestamp: new Date().toISOString()
    };

    const uploadResponse = await fetch(CONFIG.SHEETS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(uploadData)
    });

    console.log('Upload response:', {
      status: uploadResponse.status,
      ok: uploadResponse.ok,
      statusText: uploadResponse.statusText,
      contentType: uploadResponse.headers.get('content-type')
    });

    const uploadText = await uploadResponse.text();
    let uploadResult;
    try {
      uploadResult = JSON.parse(uploadText);
    } catch {
      uploadResult = uploadText;
    }

    if (uploadResponse.ok && uploadResult.success) {
      console.log('✅ Upload successful:', uploadResult);
      if (uploadResult.fileId) {
        console.log('🧹 Test file created with ID:', uploadResult.fileId);
        console.log('Note: You may want to delete this test file from Google Drive');
      }
    } else {
      console.error('❌ Upload failed:', uploadResult);
    }
  } catch (error) {
    console.error('❌ Debug test failed:', error);
  }

  console.log('🔍 Debug complete! Check the console messages above.');
}

async function makeTinyTestVideo({ ms = 800, fps = 10 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const mime =
    MediaRecorder?.isTypeSupported?.('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' :
    MediaRecorder?.isTypeSupported?.('video/webm;codecs=vp8') ? 'video/webm;codecs=vp8' :
    'video/webm';
  const stream = canvas.captureStream?.(fps);
  if (!stream) throw new Error('Canvas captureStream is not supported in this browser');
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 250000 });
  const chunks = [];
  rec.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };
  let t = 0;
  const drawId = setInterval(() => {
    ctx.fillStyle = '#111'; ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#fff'; ctx.fillRect((t * 3) % 64, (t * 2) % 64, 16, 16);
    t++;
  }, Math.round(1000 / fps));
  rec.start(100);
  await new Promise(r => setTimeout(r, ms));
  rec.stop();
  await new Promise(r => rec.onstop = r);
  clearInterval(drawId);
  stream.getTracks().forEach(tr => tr.stop());
  return new Blob(chunks, { type: 'video/webm' });
}

export async function testCloudinaryUpload() {
  console.log('🧪 Testing Cloudinary setup...');
  console.log('Config check:', {
    cloudName: CONFIG.CLOUDINARY_CLOUD_NAME,
    uploadPreset: CONFIG.CLOUDINARY_UPLOAD_PRESET,
    folder: 'spatial-cognition-videos'
  });

  if (!CONFIG.CLOUDINARY_CLOUD_NAME || !CONFIG.CLOUDINARY_UPLOAD_PRESET) {
    alert('Set CONFIG.CLOUDINARY_CLOUD_NAME and CONFIG.CLOUDINARY_UPLOAD_PRESET first.');
    return;
  }

  let blob;
  try {
    blob = await makeTinyTestVideo();
  } catch {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4,video/webm,video/quicktime';
    input.click();
    const file = await new Promise(resolve => input.onchange = () => resolve(input.files?.[0]));
    if (!file) { alert('No file selected.'); return; }
    blob = file;
  }

  const result = await uploadToCloudinary(blob, 'TEST_' + Date.now(), 1);
  if (result.success) {
    console.log('✅ SUCCESS! Video URL:', result.url);
    alert('Cloudinary is working! URL: ' + result.url);
  } else {
    console.error('❌ FAILED:', result.error);
    alert('Cloudinary setup has an issue: ' + result.error);
  }
}
