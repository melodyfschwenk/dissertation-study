/**
 * Spatial Cognition Study - Backend (Apps Script)
 * Complete version with Dropbox logging and enhanced video tracking
 */

// ===============================
// Entry point - Fixed CORS handling
// ===============================
function doPost(e) {
  try {
    console.log('\uD83D\uDCE8 Received POST');

    // Handle preflight / empty body
    if (!e || !e.postData || !e.postData.contents) {
      return createCorsOutput({ success: false, error: 'No data received' });
    }

    var data = JSON.parse(e.postData.contents || '{}');
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // Always allow ping
    if (data.action === 'test_connection') {
      return createCorsOutput({ success: true, pong: true, now: new Date().toISOString() });
    }

    // Allow an explicit setup call
    if (data.action === 'safe_setup') {
      safeSetupOrMigrate_();
      return createCorsOutput({ success: true, migrated: true });
    }

    // Ensure required sheets exist
    var mustHave = ['Sessions', 'Task Progress', 'Session Events'];
    var missing = mustHave.filter(function (n) { return !ss.getSheetByName(n); });
    if (missing.length) safeSetupOrMigrate_();

    // Ensure dynamic columns before we write to Sessions
    ensureEEGColumns_(ss);

    switch (data.action) {
      case 'upload_video':
        return handleVideoUpload(data);

      case 'log_video_upload':
        logVideoUpload({
          sessionCode: data.sessionCode,
          imageNumber: data.imageNumber,
          filename: data.filename,
          fileId: data.fileId,
          fileUrl: data.fileUrl,
          fileSize: data.fileSize,
          uploadTime: data.uploadTime,
          uploadMethod: data.uploadMethod || 'unknown',
          dropboxPath: data.dropboxPath || '',
          uploadStatus: data.uploadStatus || 'success'
        });
        break;

      case 'log_video_upload_error':
        logVideoUploadError(ss, {
          sessionCode: data.sessionCode,
          imageNumber: data.imageNumber,
          error: data.error,
          timestamp: data.timestamp,
          attemptedMethod: data.attemptedMethod || 'unknown',
          fallbackUsed: data.fallbackUsed || false
        });
        break;

      case 'eeg_scheduled':
        setEEGStatus_(ss, data.sessionCode || 'none',
          'Scheduled',
          data.scheduledAt || data.timestamp,
          data.source || 'self-report',
          'User confirmed scheduling');
        break;

      case 'session_created':
        createSession(ss, data);
        break;

      case 'session_resumed':
        resumeSession(ss, data);
        break;

      case 'session_paused':
        pauseSession(ss, data);
        break;

      case 'consent_opened':
        logConsentOpened(ss, data);
        break;

      case 'consent_completed':
        logConsentCompleted(ss, data);
        break;

      case 'consent_verified':
        setConsentVerify_(ss, data.sessionCode || 'none', data.type, 'Verified',
          data.method || 'unknown', data.codeSuffix || data.ridSuffix || '', data.timestamp);
        logSessionEvent(ss, {
          sessionCode: data.sessionCode || '',
          eventType: 'Consent Verified',
          details: (data.type || '') + ' via ' + (data.method || 'unknown'),
          timestamp: data.timestamp || new Date().toISOString()
        });
        break;

      case 'consent_affirmed':
        setConsentVerify_(ss, data.sessionCode || 'none', data.type, 'Affirmed',
          data.method || 'affirmation', '', data.timestamp);
        logSessionEvent(ss, {
          sessionCode: data.sessionCode || '',
          eventType: 'Consent Affirmed',
          details: (data.type || '') + ' via typed affirmation',
          timestamp: data.timestamp || new Date().toISOString()
        });
        break;

      case 'video_declined':
        logVideoDeclined(ss, data);
        break;

      case 'task_started':
        logTaskStart(ss, data);
        break;

      case 'task_departed':
        logSessionEvent(ss, {
          sessionCode: data.sessionCode,
          eventType: 'Task Departed',
          details: data.task,
          timestamp: data.timestamp
        });
        break;

      case 'task_returned':
        logSessionEvent(ss, {
          sessionCode: data.sessionCode,
          eventType: 'Task Returned',
          details: data.task + ' (Away: ' + (data.away || 0) + 's)',
          timestamp: data.timestamp
        });
        break;

      case 'inactivity':
        logSessionEvent(ss, {
          sessionCode: data.sessionCode,
          eventType: 'Inactivity',
          details: data.task,
          timestamp: data.timestamp
        });
        break;

      case 'task_skipped':
        logTaskSkipped(ss, data);
        break;

      case 'task_completed':
        logTaskComplete(ss, data);
        break;

      case 'image_recorded':
        logImageRecorded(ss, data);
        break;

      case 'image_recorded_and_uploaded':
        logImageRecordedAndUploaded(ss, data);
        // Also log to video uploads table with enhanced data
        logVideoUpload({
          sessionCode: data.sessionCode,
          imageNumber: data.imageNumber,
          filename: data.filename,
          fileId: data.driveFileId,
          fileUrl: data.driveFileUrl || '',
          fileSize: data.fileSize || 0,
          uploadTime: data.timestamp,
          uploadMethod: data.uploadMethod || 'unknown',
          dropboxPath: data.dropboxPath || '',
          uploadStatus: data.uploadStatus || 'success'
        });
        break;

      case 'image_recorded_no_upload':
        logImageRecordedNoUpload(ss, data);
        // Also log the non-upload to video uploads table
        logVideoUpload({
          sessionCode: data.sessionCode,
          imageNumber: data.imageNumber,
          filename: 'local_only_' + data.imageNumber,
          fileId: '',
          fileUrl: '',
          fileSize: 0,
          uploadTime: data.timestamp,
          uploadMethod: data.uploadMethod || 'local_only',
          dropboxPath: '',
          uploadStatus: 'skipped'
        });
        break;

      case 'video_recorded':
        logVideoRecording(ss, data);
        break;

      case 'calendly_opened':
        logCalendlyOpened(ss, data);
        setEEGStatus_(ss, data.sessionCode || 'none', 'Scheduling started', data.timestamp, 'Calendly', 'Calendly link opened');
        break;

      case 'eeg_interest_clicked':
        logEEGInterest(ss, data);
        break;

      case 'study_completed':
        completeStudy(ss, data);
        break;

      case 'save_state':
        saveSessionState(ss, data);
        break;

      case 'get_session':
        return getSessionData(ss, data.sessionCode);

      default:
        logEvent(ss, data);
    }

    return createCorsOutput({ success: true });
  } catch (err) {
    console.error('doPost error:', err);
    return createCorsOutput({ success: false, error: String(err) });
  }
}

// Handle OPTIONS requests for CORS preflight
function doGet(e) {
  return createCorsOutput({ success: true, status: 'ok', method: 'GET' });
}

// Proper CORS output helper - FIXED VERSION
function createCorsOutput(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  // Note: ContentService handles CORS for deployed web apps
  return output;
}

// >>> CANONICAL SESSIONS HEADERS AND HELPERS
var SESSIONS_HEADERS = [
  'Session Code','Participant ID','Email','Created Date','Last Activity',
  'Total Time (min)','Active Time (min)','Idle Time (min)','Tasks Completed','Status',
  'Device Type','Consent Status','Consent Source','Consent Code','Consent Timestamp',
  'EEG Status','EEG Scheduled At','EEG Scheduling Source',
  'Hearing Status','Fluency','State JSON'
];

// Older header names mapped to canonical names
var CONSENT_HEADER_VARIANTS = {
  'Consent1 Verify': 'Consent Status',
  'Consent2 Verify': 'Consent Status',
  'Consent 1': 'Consent Status',
  'Consent 2': 'Consent Status',
  'Consent Verify Source': 'Consent Source',
  'Consent Verify Code': 'Consent Code',
  'Consent Verify Timestamp': 'Consent Timestamp'
};

// Header utils
function headerMap_(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return {};
  var headers = sheet.getRange(1, 1, 1, lastCol)
    .getValues()[0]
    .map(function(v){return String(v || '').trim();});
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    if (headers[i]) map[headers[i]] = i + 1; // 1-based
  }
  return map;
}
function setByHeader_(sheet, rowIndex, headerName, value) {
  var map = headerMap_(sheet);
  var col = map[headerName];
  if (!col) {
    var newCol = sheet.getLastColumn() + 1;
    sheet.insertColumnAfter(sheet.getLastColumn());
    sheet.getRange(1, newCol).setValue(headerName)
      .setFontWeight('bold').setBackground('#f1f3f4');
    col = newCol;
  }
  sheet.getRange(rowIndex, col).setValue(value);
}
function getByHeader_(sheet, rowIndex, headerName) {
  var map = headerMap_(sheet);
  var col = map[headerName];
  if (!col) return '';
  return sheet.getRange(rowIndex, col).getValue();
}
function findRowBySessionCode_(sheet, sessionCode) {
  if (!sessionCode) return 0;
  var data = sheet.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    if (data[r][0] === sessionCode) return r + 1;
  }
  return 0;
}

// ===============================
// Non-destructive setup / migration
// ===============================
function ensureSheetWithHeaders_(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);

  var lastCol = sheet.getLastColumn();
  var haveAnyRows = sheet.getLastRow() > 0;
  var headerRow;

  if (!haveAnyRows) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    headerRow = headers.slice();
  } else {
    if (lastCol < 1) lastCol = headers.length;
    headerRow = sheet.getRange(1, 1, 1, Math.max(lastCol, headers.length)).getValues()[0];
    headerRow = headerRow.map(function (v) { return (v == null) ? '' : String(v); });

    headers.forEach(function (h) {
      if (headerRow.indexOf(h) === -1) {
        var newCol = sheet.getLastColumn() + 1;
        sheet.insertColumnAfter(sheet.getLastColumn());
        sheet.getRange(1, newCol).setValue(h);
      }
    });
  }

  var finalCols = sheet.getLastColumn();
  sheet.getRange(1, 1, 1, finalCols)
       .setFontWeight('bold')
       .setBackground('#f1f3f4');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, Math.min(finalCols, 20));
  return sheet;
}

// ---- Data migration & cleanup helpers ----
function normalizeSessionsSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var old = ss.getSheetByName('Sessions');
  if (!old) return;

  var data = old.getDataRange().getValues();
  var headers = (data.length ? data[0] : []).map(function(v){return String(v || '').trim();});

  // Build lookup of existing header -> index
  var idxByName = {};
  for (var i = 0; i < headers.length; i++) {
    if (headers[i]) idxByName[headers[i]] = i;
  }

  // Create temp target with canonical headers
  var tmp = ss.getSheetByName('Sessions__normalized__tmp');
  if (tmp) ss.deleteSheet(tmp);
  tmp = ss.insertSheet('Sessions__normalized__tmp');
  tmp.getRange(1, 1, 1, SESSIONS_HEADERS.length).setValues([SESSIONS_HEADERS]);
  formatHeaders(tmp, SESSIONS_HEADERS.length);

  // Copy rows, mapping header variants to canonical
  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var out = new Array(SESSIONS_HEADERS.length).fill('');

    for (var c = 0; c < SESSIONS_HEADERS.length; c++) {
      var targetName = SESSIONS_HEADERS[c];
      var sourceName = targetName;

      if (!(sourceName in idxByName)) {
        // try variant that maps to this target
        for (var variant in CONSENT_HEADER_VARIANTS) {
          if (CONSENT_HEADER_VARIANTS[variant] === targetName && (variant in idxByName)) {
            sourceName = variant;
            break;
          }
        }
      }
      if (sourceName in idxByName) {
        out[c] = row[idxByName[sourceName]];
      }
    }

    // Extra merge rule for Consent Status if still blank
    var csIdx = SESSIONS_HEADERS.indexOf('Consent Status');
    if (csIdx !== -1 && !out[csIdx]) {
      var c1i = headers.indexOf('Consent 1');
      var c2i = headers.indexOf('Consent 2');
      var c1 = c1i > -1 ? row[c1i] : '';
      var c2 = c2i > -1 ? row[c2i] : '';
      out[csIdx] = c1 || c2 || '';
    }

    tmp.appendRow(out);
  }

  // Swap sheets safely
  var oldName = 'Sessions__backup_' + new Date().toISOString().replace(/[:.]/g, '-');
  old.setName(oldName);
  tmp.setName('Sessions');
}
function normalizeSessionsSheet() { return normalizeSessionsSheet_(); }

function backupParticipantData_(ss) {
  var backup = SpreadsheetApp.create('Backup_' + new Date().toISOString().replace(/[:.]/g, '-'));
  ['Sessions', 'Task Progress', 'Session Events', 'Video_Uploads', 'Video_Upload_Errors', 'Video Tracking']
    .forEach(function(name) {
      var sh = ss.getSheetByName(name);
      if (sh) sh.copyTo(backup).setName(name);
    });
}

function cleanSessionsSheet_(ss) {
  var sheet = ss.getSheetByName('Sessions');
  if (!sheet) return;
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return;

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

  // Merge old consent columns into single Consent Status if present
  var c1 = headers.indexOf('Consent 1');
  var c2 = headers.indexOf('Consent 2');
  var statusIdx = headers.indexOf('Consent Status');
  if (statusIdx === -1) {
    statusIdx = lastCol + 1;
    sheet.insertColumnAfter(lastCol);
    sheet.getRange(1, statusIdx).setValue('Consent Status')
         .setFontWeight('bold').setBackground('#f1f3f4');
    lastCol++;
  }

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    var val = '';
    if (c1 !== -1 && data[i][c1]) val = data[i][c1];
    if (!val && c2 !== -1 && data[i][c2]) val = data[i][c2];
    if (val) sheet.getRange(i + 1, statusIdx).setValue(val);
  }

  // Remove redundant columns if they exist
  var removeNames = ['Sequence Index', 'Activity %', 'Consent 1', 'Consent 2', 'Notes'];
  removeNames.forEach(function(name) {
    var idx = headers.indexOf(name);
    if (idx !== -1) sheet.deleteColumn(idx + 1);
  });
}

function migrateVideoSheets_(ss) {
  var headers = ['Timestamp','Session Code','Image Number','Filename','File ID','File URL','File Size (KB)','Upload Time','Upload Method','Dropbox Path','Upload Status','Error Message'];
  var tracking = ensureSheetWithHeaders_(ss, 'Video Tracking', headers);

  var oldUploads = ss.getSheetByName('Video_Uploads');
  if (oldUploads) {
    var upData = oldUploads.getDataRange().getValues();
    for (var i = 1; i < upData.length; i++) {
      tracking.appendRow(upData[i].concat(['']));
    }
    ss.deleteSheet(oldUploads);
  }

  var oldErr = ss.getSheetByName('Video_Upload_Errors');
  if (oldErr) {
    var errData = oldErr.getDataRange().getValues();
    for (var j = 1; j < errData.length; j++) {
      tracking.appendRow([
        errData[j][0], errData[j][1], errData[j][2], '', '', '', '', errData[j][4] || '', errData[j][5] || '', '', 'error', errData[j][3]
      ]);
    }
    ss.deleteSheet(oldErr);
  }

  return tracking;
}

function safeSetupOrMigrate_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  backupParticipantData_(ss);

  // Sessions sheet cleanup and setup - seed with canonical order
  cleanSessionsSheet_(ss);
  var sessionsSheet = ensureSheetWithHeaders_(ss, 'Sessions', SESSIONS_HEADERS);

  // Task Progress
  ensureSheetWithHeaders_(ss, 'Task Progress', [
    'Timestamp','Session Code','Participant ID','Task Name','Event Type','Start Time','End Time','Elapsed Time (sec)','Active Time (sec)','Pause Count','Inactive Time (sec)','Activity Score (%)','Details','Completed'
  ]);

  // Session Events
  ensureSheetWithHeaders_(ss, 'Session Events', [
    'Timestamp','Session Code','Event Type','Details','IP Address','User Agent'
  ]);

  // Video tracking (single sheet)
  migrateVideoSheets_(ss);

  // Email reminders
  ensureSheetWithHeaders_(ss, 'Email Reminders', [
    'Session Code','Email','Last Reminder Sent','Reminders Count','Status'
  ]);

  // Score tracking sheets
  ensureSheetWithHeaders_(ss, 'ASLCT Scores', ['Session Code','ASLCT Score','Entry Time','Notes']);
  ensureSheetWithHeaders_(ss, 'WIAT Scores', ['Session Code','WIAT Score','Entry Time','Notes']);
  var summary = ensureSheetWithHeaders_(ss, 'Scores Summary', ['Session Code','ASLCT Score','WIAT Score']);
  if (summary.getLastRow() < 2) {
    summary.getRange('B2').setFormula('=ARRAYFORMULA(IF(A2:A="",,IFERROR(VLOOKUP(A2:A,\'ASLCT Scores\'!A:B,2,false),"")))');
    summary.getRange('C2').setFormula('=ARRAYFORMULA(IF(A2:A="",,IFERROR(VLOOKUP(A2:A,\'WIAT Scores\'!A:B,2,false),"")))');
  }

  // Dashboard (dynamic column references)
  var dash = ss.getSheetByName('Dashboard') || ss.insertSheet('Dashboard');
  dash.getRange('A1').setValue('Dashboard').setFontSize(16).setFontWeight('bold');
  dash.getRange('A3').setValue('Total Sessions');
  dash.getRange('B3').setFormula('=COUNTA(Sessions!A2:A)');

  var hmap = headerMap_(sessionsSheet);
  function colLetter(colIndex){ return sessionsSheet.getRange(1, colIndex).getA1Notation().replace(/[0-9]/g,''); }
  var STATUS_COL = colLetter(hmap['Status']);
  var DEVICE_COL = colLetter(hmap['Device Type']);

  dash.getRange('A4').setValue('Completed Studies');
  dash.getRange('B4').setFormula('=COUNTIF(Sessions!' + STATUS_COL + '2:' + STATUS_COL + ',"Complete")');

  dash.getRange('A6').setValue('Device Breakdown');
  dash.getRange('A7').setValue('Desktop');
  dash.getRange('B7').setFormula('=COUNTIF(Sessions!' + DEVICE_COL + '2:' + DEVICE_COL + ',"*Desktop*")');
  dash.getRange('A8').setValue('Mobile');
  dash.getRange('B8').setFormula('=COUNTIF(Sessions!' + DEVICE_COL + '2:' + DEVICE_COL + ',"*Mobile*")');
  dash.getRange('A9').setValue('Tablet');
  dash.getRange('B9').setFormula('=COUNTIF(Sessions!' + DEVICE_COL + '2:' + DEVICE_COL + ',"*Tablet*")');

  dash.getRange('A11').setValue('Video Uploads');
  dash.getRange('A12').setValue('Successful');
  dash.getRange('B12').setFormula('=COUNTIF(\'Video Tracking\'!K2:K,"success")');
  dash.getRange('A13').setValue('Failed');
  dash.getRange('B13').setFormula('=COUNTIF(\'Video Tracking\'!K2:K,"error")');

  dash.getRange('A15').setValue('Score Entries');
  dash.getRange('A16').setValue('ASLCT Scores Entered');
  dash.getRange('B16').setFormula('=COUNTA(\'ASLCT Scores\'!A2:A)');
  dash.getRange('A17').setValue('WIAT Scores Entered');
  dash.getRange('B17').setFormula('=COUNTA(\'WIAT Scores\'!A2:A)');

  // Dynamic columns on Sessions
  ensureConsentColumns_(ss);
  var eegCols = ensureEEGColumns_(ss);

  dash.getRange('A19').setValue('EEG Interested');
  var eegStatusCol = sessionsSheet.getRange(1, eegCols.status).getA1Notation().replace(/[0-9]/g, '');
  dash.getRange('B19').setFormula('=COUNTIF(Sessions!' + eegStatusCol + '2:' + eegStatusCol + ',"Interested")');
  dash.autoResizeColumns(1, 2);

  // Pre-create Drive root folder
  getOrCreateStudyFolder();

  return true;
}

// ===============================
// Video upload - Fixed version
// ===============================
function handleVideoUpload(data) {
  try {
    console.log('Starting video upload for session:', data.sessionCode);

    if (!data || !data.sessionCode || !data.imageNumber || !data.videoData) {
      throw new Error('Missing required fields: sessionCode, imageNumber, videoData');
    }

    // Check size (~50MB practical limit for base64 in Apps Script)
    var base64Length = data.videoData.length;
    var approxBytes = base64Length * 0.75; // rough estimate
    console.log('Video size estimate:', Math.round(approxBytes / 1024), 'KB');
    if (approxBytes > 50 * 1024 * 1024) {
      throw new Error('Video file too large (limit ~50MB)');
    }

    // Get or create folders
    var studyFolder = getOrCreateStudyFolder();
    var participantFolder = getOrCreateParticipantFolder(studyFolder, data.sessionCode);

    // Decode base64
    var bytes;
    try {
      bytes = Utilities.base64Decode(data.videoData);
      console.log('Decoded video bytes:', bytes.length);
    } catch (decodeError) {
      console.error('Base64 decode error:', decodeError);
      throw new Error('Invalid video data encoding');
    }

    // Generate filename
    var ts = new Date().toISOString().replace(/[:.]/g, '-');
    var filename = data.sessionCode + '_image' + data.imageNumber + '_' + ts + '.webm';

    // Create blob and save to Drive
    var blob = Utilities.newBlob(bytes, 'video/webm', filename);
    var file = participantFolder.createFile(blob);

    // Private permissions
    try {
      file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW);
    } catch (e) {
      console.warn('Could not set file sharing:', e);
    }

    // Log the upload
    logVideoUpload({
      sessionCode: data.sessionCode,
      imageNumber: data.imageNumber,
      filename: filename,
      fileId: file.getId(),
      fileUrl: file.getUrl(),
      fileSize: Math.round(bytes.length / 1024),
      uploadTime: new Date().toISOString(),
      uploadMethod: 'google_drive',
      dropboxPath: '',
      uploadStatus: 'success'
    });

    console.log('Video uploaded successfully:', filename);

    return createCorsOutput({
      success: true,
      fileId: file.getId(),
      fileUrl: file.getUrl(),
      filename: filename
    });

  } catch (err) {
    console.error('Video upload error:', err);

    // Log the error
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      logVideoUploadError(ss, {
        sessionCode: (data && data.sessionCode) || 'unknown',
        imageNumber: (data && data.imageNumber) || 0,
        error: String(err),
        timestamp: new Date().toISOString(),
        attemptedMethod: 'google_drive',
        fallbackUsed: false
      });
    } catch (logErr) {
      console.error('Failed to log video upload error:', logErr);
    }

    return createCorsOutput({
      success: false,
      error: String(err),
      details: err.message || 'Upload failed'
    });
  }
}

// ===============================
// Setup helpers (legacy destructive; avoid on live data)
// ===============================
function initialSetup() {
  // USE ONLY ON A BRAND NEW SPREADSHEET - THIS CLEARS SHEETS
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var sessionsSheet = ss.getSheetByName('Sessions') || ss.insertSheet('Sessions');
  sessionsSheet.clear();
  sessionsSheet.getRange(1, 1, 1, SESSIONS_HEADERS.length).setValues([SESSIONS_HEADERS]);
  formatHeaders(sessionsSheet, SESSIONS_HEADERS.length);

  var progressSheet = ss.getSheetByName('Task Progress') || ss.insertSheet('Task Progress');
  progressSheet.clear();
  progressSheet.getRange(1, 1, 1, 14).setValues([[
    'Timestamp','Session Code','Participant ID','Task Name','Event Type','Start Time','End Time','Elapsed Time (sec)','Active Time (sec)','Pause Count','Inactive Time (sec)','Activity Score (%)','Details','Completed'
  ]]);
  formatHeaders(progressSheet, 14);

  var eventsSheet = ss.getSheetByName('Session Events') || ss.insertSheet('Session Events');
  eventsSheet.clear();
  eventsSheet.getRange(1, 1, 1, 6).setValues([[
    'Timestamp','Session Code','Event Type','Details','IP Address','User Agent'
  ]]);
  formatHeaders(eventsSheet, 6);

  var videoSheet = ss.getSheetByName('Video Tracking') || ss.insertSheet('Video Tracking');
  videoSheet.clear();
  videoSheet.getRange(1, 1, 1, 12).setValues([[
    'Timestamp','Session Code','Image Number','Filename','File ID','File URL','File Size (KB)','Upload Time','Upload Method','Dropbox Path','Upload Status','Error Message'
  ]]);
  formatHeaders(videoSheet, 12);

  var reminders = ss.getSheetByName('Email Reminders') || ss.insertSheet('Email Reminders');
  reminders.clear();
  reminders.getRange(1, 1, 1, 5).setValues([[
    'Session Code','Email','Last Reminder Sent','Reminders Count','Status'
  ]]);
  formatHeaders(reminders, 5);

  var dash = ss.getSheetByName('Dashboard') || ss.insertSheet('Dashboard');
  setupDashboard(dash);

  getOrCreateStudyFolder();
  console.log('Destructive setup complete.');
}

function formatHeaders(sheet, nCols) {
  var range = sheet.getRange(1, 1, 1, nCols);
  range.setFontWeight('bold').setBackground('#f1f3f4');
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, nCols);
}

function setupDashboard(sheet) {
  sheet.clear();
  sheet.getRange('A1').setValue('Dashboard');
  sheet.getRange('A1').setFontSize(16).setFontWeight('bold');

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sessionsSheet = ss.getSheetByName('Sessions');
  var hmap = headerMap_(sessionsSheet);
  function colLetter(colIndex){ return sessionsSheet.getRange(1, colIndex).getA1Notation().replace(/[0-9]/g,''); }
  var STATUS_COL = colLetter(hmap['Status']);
  var DEVICE_COL = colLetter(hmap['Device Type']);

  sheet.getRange('A3').setValue('Total Sessions');
  sheet.getRange('B3').setFormula('=COUNTA(Sessions!A2:A)');

  sheet.getRange('A4').setValue('Completed Studies');
  sheet.getRange('B4').setFormula('=COUNTIF(Sessions!' + STATUS_COL + '2:' + STATUS_COL + ',"Complete")');

  sheet.getRange('A5').setValue('Videos Uploaded');
  sheet.getRange('B5').setFormula('=COUNTA(\'Video Tracking\'!A2:A)');

  sheet.getRange('A6').setValue('Device Breakdown');
  sheet.getRange('A7').setValue('Desktop');
  sheet.getRange('B7').setFormula('=COUNTIF(Sessions!' + DEVICE_COL + '2:' + DEVICE_COL + ',"*Desktop*")');
  sheet.getRange('A8').setValue('Mobile');
  sheet.getRange('B8').setFormula('=COUNTIF(Sessions!' + DEVICE_COL + '2:' + DEVICE_COL + ',"*Mobile*")');
  sheet.getRange('A9').setValue('Tablet');
  sheet.getRange('B9').setFormula('=COUNTIF(Sessions!' + DEVICE_COL + '2:' + DEVICE_COL + ',"*Tablet*")');

  sheet.autoResizeColumns(1, 2);
}

// ===============================
// Drive helpers
// ===============================
function getOrCreateStudyFolder() {
  var name = 'Spatial Cognition Study Videos';
  var it = DriveApp.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  var folder = DriveApp.createFolder(name);
  console.log('Created study folder:', name);
  return folder;
}
function getOrCreateParticipantFolder(parent, sessionCode) {
  var name = 'Participant_' + sessionCode;
  var it = parent.getFoldersByName(name);
  if (it.hasNext()) return it.next();
  var folder = parent.createFolder(name);
  console.log('Created participant folder:', name);
  return folder;
}

// ===============================
// Sessions and events
// ===============================
// Header-safe createSession
function createSession(ss, data) {
  var sheet = ss.getSheetByName('Sessions') || ss.insertSheet('Sessions');
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, SESSIONS_HEADERS.length).setValues([SESSIONS_HEADERS]);
    formatHeaders(sheet, SESSIONS_HEADERS.length);
  }

  var isMobile = data.deviceType === 'mobile/tablet';
  var totalTasks = isMobile ? 6 : 7;
  var deviceType = isMobile ? 'Mobile/Tablet' : 'Desktop';

  var row = findRowBySessionCode_(sheet, data.sessionCode);
  if (!row) {
    row = sheet.getLastRow() + 1;
    sheet.insertRowsAfter(sheet.getLastRow() || 1, 1);
  }

  setByHeader_(sheet, row, 'Session Code', data.sessionCode);
  setByHeader_(sheet, row, 'Participant ID', data.participantID);
  setByHeader_(sheet, row, 'Email', data.email || '');
  setByHeader_(sheet, row, 'Created Date', data.timestamp);
  setByHeader_(sheet, row, 'Last Activity', data.timestamp);
  setByHeader_(sheet, row, 'Total Time (min)', 0);
  setByHeader_(sheet, row, 'Active Time (min)', 0);
  setByHeader_(sheet, row, 'Idle Time (min)', 0);
  setByHeader_(sheet, row, 'Tasks Completed', '0/' + totalTasks);
  setByHeader_(sheet, row, 'Status', 'Active');
  setByHeader_(sheet, row, 'Device Type', deviceType);
  setByHeader_(sheet, row, 'Consent Status', 'Pending');
  setByHeader_(sheet, row, 'Hearing Status', data.hearingStatus || '');
  setByHeader_(sheet, row, 'Fluency', data.fluency || '');
  setByHeader_(sheet, row, 'State JSON', '');

  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Session Created',
    details: 'ID: ' + (data.participantID || '') + ', Device: ' + deviceType + ', Tasks: ' + totalTasks,
    timestamp: data.timestamp,
    userAgent: data.userAgent || ''
  });

  if (data.email) addEmailReminder(ss, data.sessionCode, data.email);

  try {
    var folder = getOrCreateStudyFolder();
    getOrCreateParticipantFolder(folder, data.sessionCode);
  } catch (e) {
    console.warn('Could not pre-create participant folder:', e);
  }
}

function resumeSession(ss, data) {
  updateSessionActivity(ss, data.sessionCode, data.timestamp);
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Session Resumed',
    details: 'Progress: ' + (data.progress || 'unknown'),
    timestamp: data.timestamp,
    userAgent: data.userAgent || ''
  });
}

function pauseSession(ss, data) {
  updateSessionActivity(ss, data.sessionCode, data.timestamp);
  updateTotalTime(ss, data.sessionCode);
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Session Paused',
    details: 'Progress: ' + (data.progress || 'unknown'),
    timestamp: data.timestamp,
    userAgent: data.userAgent || ''
  });
}

function logConsentOpened(ss, data) {
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Consent Opened',
    details: data.type,
    timestamp: data.timestamp
  });
}

function logConsentCompleted(ss, data) {
  var sheet = ss.getSheetByName('Sessions');
  var cols = ensureConsentColumns_(ss);
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.sessionCode) {
      sheet.getRange(i + 1, cols.status).setValue('Complete');
      break;
    }
  }
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Consent Completed',
    details: 'Consent marked complete',
    timestamp: data.timestamp
  });
}

function logVideoDeclined(ss, data) {
  var sheet = ss.getSheetByName('Sessions');
  var cols = ensureConsentColumns_(ss);
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.sessionCode) {
      sheet.getRange(i + 1, cols.status).setValue('Declined');
      break;
    }
  }
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Video Declined',
    details: 'User declined video consent',
    timestamp: data.timestamp
  });
}

function saveSessionState(ss, data) {
  if (!data.sessionCode) return;
  var sheet = ss.getSheetByName('Sessions');
  if (!sheet) return;

  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (v) { return String(v || ''); });

  var stateIdx = headers.indexOf('State JSON');
  if (stateIdx === -1) {
    stateIdx = lastCol;
    sheet.insertColumnAfter(lastCol);
    stateIdx++;
    sheet.getRange(1, stateIdx).setValue('State JSON').setFontWeight('bold').setBackground('#f1f3f4');
    headers.push('State JSON');
  } else {
    stateIdx = stateIdx + 1;
  }

  var lastIdx = headers.indexOf('Last Activity');
  lastIdx = lastIdx === -1 ? null : lastIdx + 1;

  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.sessionCode) {
      sheet.getRange(i + 1, stateIdx).setValue(JSON.stringify(data.state || {}));
      if (lastIdx) sheet.getRange(i + 1, lastIdx).setValue(data.timestamp || new Date().toISOString());
      break;
    }
  }
}

// ===============================
// Tasks
// ===============================
function getSessionActivitySummary(sessionCode) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var progressSheet = ss.getSheetByName('Task Progress');
  var eventsSheet = ss.getSheetByName('Session Events');

  var progressData = progressSheet.getDataRange().getValues();
  var eventsData = eventsSheet.getDataRange().getValues();

  var summary = {
    sessionCode: sessionCode,
    tasks: {},
    events: [],
    totalDuration: 0,
    completedCount: 0,
    startedCount: 0
  };

  // Process task progress
  for (var i = 1; i < progressData.length; i++) {
    if (progressData[i][1] === sessionCode) {
      var taskName = progressData[i][3];
      var eventType = progressData[i][4];
      var duration = progressData[i][7];

      if (!summary.tasks[taskName]) {
        summary.tasks[taskName] = {
          started: false,
          completed: false,
          duration: 0,
          attempts: 0
        };
      }

      if (eventType === 'Started') {
        summary.tasks[taskName].started = true;
        summary.tasks[taskName].attempts++;
        summary.startedCount++;
      } else if (eventType === 'Completed') {
        summary.tasks[taskName].completed = true;
        summary.tasks[taskName].duration = duration;
        summary.totalDuration += Number(duration) || 0;
        summary.completedCount++;
      }
    }
  }

  // Process events
  for (var j = 1; j < eventsData.length; j++) {
    if (eventsData[j][1] === sessionCode) {
      summary.events.push({
        timestamp: eventsData[j][0],
        type: eventsData[j][2],
        details: eventsData[j][3]
      });
    }
  }

  return summary;
}

// Add to menu for testing
function testActivitySummary() {
  var code = SpreadsheetApp.getUi().prompt('Enter session code:').getResponseText();
  var summary = getSessionActivitySummary(code);
  SpreadsheetApp.getUi().alert(JSON.stringify(summary, null, 2));
}

function logTaskStart(ss, data) {
  var sheet = ss.getSheetByName('Task Progress');
  sheet.appendRow([
    data.timestamp,
    data.sessionCode,
    data.participantID || getParticipantIDFromSession(ss, data.sessionCode), // Fetch if missing
    data.task,
    'Started',
    data.startTime || data.timestamp,
    '',
    0,
    0,
    0,
    0,
    0,
    '',
    false
  ]);
  updateSessionActivity(ss, data.sessionCode, data.timestamp);

  // Add to Session Events
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Task Started',
    details: data.task,
    timestamp: data.timestamp
  });
}

function logTaskComplete(ss, data) {
  var sheet = ss.getSheetByName('Task Progress');
  var details = data.details || '';
  var activityPct = data.activity || (data.elapsed ? (data.active / data.elapsed * 100) : 0);
  var suspicious = (data.elapsed && data.active && (data.active / data.elapsed) < 0.3);
  if (data.recordingDuration) {
    details = (details ? details + '; ' : '') + 'Recording ' + data.recordingDuration + 's';
  }
  if (suspicious) {
    details = (details ? details + ' | ' : '') + 'FLAG: Low activity';
  }
  sheet.appendRow([
    data.timestamp,
    data.sessionCode,
    data.participantID || getParticipantIDFromSession(ss, data.sessionCode), // Fetch if missing
    data.task,
    'Completed',
    data.startTime || '',
    data.endTime || '',
    data.elapsed || 0,
    data.active || 0,
    data.pauseCount || 0,
    data.inactive || 0,
    activityPct || 0,
    details,
    true
  ]);
  updateCompletedTasksCount(ss, data.sessionCode);
  updateSessionActivity(ss, data.sessionCode, data.timestamp);
  updateTotalTime(ss, data.sessionCode);

  // Add to Session Events
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Task Completed',
    details: data.task + ' (Elapsed: ' + (data.elapsed || 0) + 's, Active: ' + (data.active || 0) + 's)',
    timestamp: data.timestamp
  });
  if (suspicious) {
    logSessionEvent(ss, {
      sessionCode: data.sessionCode,
      eventType: 'Suspicious Activity',
      details: data.task + ' activity ' + Math.round((data.active / data.elapsed) * 100) + '%',
      timestamp: data.timestamp
    });
  }
}

// Header-safe participant ID getter
function getParticipantIDFromSession(ss, sessionCode) {
  var sheet = ss.getSheetByName('Sessions');
  if (!sheet) return '';
  var row = findRowBySessionCode_(sheet, sessionCode);
  if (!row) return '';
  return getByHeader_(sheet, row, 'Participant ID') || '';
}

function logTaskSkipped(ss, data) {
  var sheet = ss.getSheetByName('Task Progress');
  sheet.appendRow([
    data.timestamp,
    data.sessionCode,
    data.participantID || '',
    data.task,
    'Skipped',
    '',
    '',
    0,
    0,
    0,
    0,
    0,
    data.reason || 'User choice',
    true
  ]);

  updateCompletedTasksCount(ss, data.sessionCode);
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Task Skipped',
    details: data.task + ' - Reason: ' + (data.reason || 'User choice'),
    timestamp: data.timestamp
  });
  updateSessionActivity(ss, data.sessionCode, data.timestamp);
}

// Special events around image/video
function logImageRecorded(ss, data) {
  var p = ss.getSheetByName('Task Progress');
  p.appendRow([
    data.timestamp,
    data.sessionCode,
    data.participantID || '',
    'Image Description',
    'Image ' + data.imageNumber + ' Recorded',
    '',
    '',
    0,
    0,
    0,
    0,
    0,
    'Image ' + data.imageNumber + '/2',
    false
  ]);
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Image Recorded',
    details: 'Image ' + data.imageNumber + '/2',
    timestamp: data.timestamp
  });
}

function logImageRecordedAndUploaded(ss, data) {
  var p = ss.getSheetByName('Task Progress');
  p.appendRow([
    data.timestamp,
    data.sessionCode,
    data.participantID || '',
    'Image Description',
    'Image ' + data.imageNumber + ' Recorded & Uploaded',
    '',
    '',
    0,
    0,
    0,
    0,
    0,
    'File: ' + data.filename,
    false
  ]);
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Image Recorded & Uploaded',
    details: 'Image ' + data.imageNumber + '/2 - File: ' + data.filename + ' - ID: ' + data.driveFileId + ' - Method: ' + (data.uploadMethod || 'unknown'),
    timestamp: data.timestamp
  });
}

function logImageRecordedNoUpload(ss, data) {
  var p = ss.getSheetByName('Task Progress');
  p.appendRow([
    data.timestamp,
    data.sessionCode,
    data.participantID || '',
    'Image Description',
    'Image ' + data.imageNumber + ' Recorded (Local Only)',
    '',
    '',
    0,
    0,
    0,
    0,
    0,
    'Reason: ' + data.reason,
    false
  ]);
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Image Recorded (No Upload)',
    details: 'Image ' + data.imageNumber + '/2 - Reason: ' + data.reason,
    timestamp: data.timestamp
  });
}

function logVideoRecording(ss, data) {
  var p = ss.getSheetByName('Task Progress');
  p.appendRow([
    data.timestamp,
    data.sessionCode,
    data.participantID || '',
    'Image Description',
    'Video Recorded - Image ' + data.imageNumber',
    '',
    '',
    0,
    0,
    0,
    0,
    0,
    'Image ' + data.imageNumber + ' of 2 recorded',
    false
  ]);

  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Video Recording',
    details: 'Image ' + data.imageNumber + ' recorded',
    timestamp: data.timestamp
  });
}

function logCalendlyOpened(ss, data) {
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Calendly Opened',
    details: 'Participant opened Calendly scheduling',
    timestamp: data.timestamp
  });
}

function logEEGInterest(ss, data) {
  logSessionEvent(ss, {
    sessionCode: data.sessionCode || 'none',
    eventType: 'EEG Interest',
    details: 'Participant ID: ' + (data.participantID || 'none'),
    timestamp: data.timestamp
  });

  if (data.sessionCode && data.sessionCode !== 'none') {
    setEEGStatus_(ss, data.sessionCode, 'Interested', data.timestamp, 'self-report', 'EEG Interest');
  }

  if (data.email) addEEGReminder(ss, data.sessionCode || 'none', data.email);
}

function addEEGReminder(ss, sessionCode, email) {
  var sheet = ss.getSheetByName('Email Reminders');
  if (!sheet) return;
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === sessionCode) {
      sheet.getRange(i + 1, 2).setValue(email || data[i][1] || '');
      sheet.getRange(i + 1, 5).setValue('EEG Reminder Requested');
      return;
    }
  }
  sheet.appendRow([sessionCode, email || '', '', 0, 'EEG Reminder Requested']);
}

function completeStudy(ss, data) {
  var required = getRequiredTasksForSession_(ss, data.sessionCode);
  var sheet = ss.getSheetByName('Sessions');
  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.sessionCode) {
      setByHeader_(sheet, i + 1, 'Total Time (min)', data.totalDuration || 0);
      setByHeader_(sheet, i + 1, 'Tasks Completed', required.length + '/' + required.length);
      setByHeader_(sheet, i + 1, 'Status', 'Complete');
      break;
    }
  }

  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Study Completed',
    details: 'Duration: ' + data.totalDuration + ' min, Device: ' + data.deviceType,
    timestamp: data.timestamp
  });
}

// ===============================
// Sheet utilities
// ===============================
function updateSessionActivity(ss, sessionCode, timestamp) {
  var sheet = ss.getSheetByName('Sessions');
  if (!sheet) return;
  var row = findRowBySessionCode_(sheet, sessionCode);
  if (!row) return;
  setByHeader_(sheet, row, 'Last Activity', timestamp);
}

function updateTotalTime(ss, sessionCode) {
  var p = ss.getSheetByName('Task Progress').getDataRange().getValues();
  var totalElapsed = 0;
  var totalActive = 0;
  for (var i = 1; i < p.length; i++) {
    if (p[i][1] === sessionCode && p[i][4] === 'Completed') {
      totalElapsed += Number(p[i][7]) || 0;
      totalActive += Number(p[i][8]) || 0;
    }
  }

  var s = ss.getSheetByName('Sessions');
  if (!s) return;
  var row = findRowBySessionCode_(s, sessionCode);
  if (!row) return;

  var totalMin = Math.round(totalElapsed / 60);
  var activeMin = Math.round(totalActive / 60);
  var idleMin = Math.max(0, totalMin - activeMin);

  setByHeader_(s, row, 'Total Time (min)', totalMin);
  setByHeader_(s, row, 'Active Time (min)', activeMin);
  setByHeader_(s, row, 'Idle Time (min)', idleMin);
}

function getRequiredTasksForSession_(ss, sessionCode) {
  var sessionsSheet = ss.getSheetByName('Sessions');
  var rows = sessionsSheet.getDataRange().getValues();
  var headers = rows[0].map(function (v) { return String(v || ''); });
  var map = {};
  for (var i = 0; i < headers.length; i++) map[headers[i]] = i;

  var deviceType = 'Desktop';
  var consentStatus = '';
  for (var r = 1; r < rows.length; r++) {
    if (rows[r][0] === sessionCode) {
      if (map['Device Type'] != null) deviceType = rows[r][map['Device Type']] || 'Desktop';
      if (map['Consent Status'] != null) consentStatus = rows[r][map['Consent Status']] || '';
      break;
    }
  }
  var isMobile = String(deviceType).toLowerCase().indexOf('mobile') !== -1;

  var required = [
    'Reading Comprehension Task',
    'Mental Rotation Task',
    'ASL Comprehension Test',
    'Spatial Navigation',
    'Image Description',
    'Demographics Survey'
  ];
  if (!isMobile) required.splice(3, 0, 'Virtual Campus Navigation'); // add VCN after ASLCT

  if (String(consentStatus).toLowerCase() === 'declined') {
    required = required.filter(function (t) { return t !== 'Image Description'; });
  }

  var progress = ss.getSheetByName('Task Progress').getDataRange().getValues();
  var aslctOptional = false;
  for (var i = 1; i < progress.length; i++) {
    if (progress[i][1] === sessionCode &&
        progress[i][3] === 'ASL Comprehension Test' &&
        progress[i][4] === 'Skipped') {
      var details = String(progress[i][12] || '').toLowerCase();
      if (details.indexOf('does not know asl') !== -1) {
        aslctOptional = true;
        break;
      }
    }
  }
  if (aslctOptional) {
    required = required.filter(function (t) { return t !== 'ASL Comprehension Test'; });
  }

  return required;
}

function updateCompletedTasksCount(ss, sessionCode) {
  var required = getRequiredTasksForSession_(ss, sessionCode);
  var requiredSet = {};
  for (var k = 0; k < required.length; k++) requiredSet[required[k]] = true;

  var progress = ss.getSheetByName('Task Progress').getDataRange().getValues();
  var completedSet = {};

  for (var i = 1; i < progress.length; i++) {
    if (progress[i][1] !== sessionCode) continue;

    var eventType = progress[i][4]; // Column E: Event Type
    var taskName = progress[i][3];  // Column D: Task Name
    var details = String(progress[i][12] || '');

    var isCompleted = (eventType === 'Completed');
    var isValidSkip = (eventType === 'Skipped' && (
      (taskName === 'ASL Comprehension Test' && details.toLowerCase().indexOf('does not know asl') !== -1) ||
      (taskName === 'Image Description' && details.toLowerCase().indexOf('video consent declined') !== -1)
    ));

    if ((isCompleted || isValidSkip) && requiredSet[taskName]) {
      completedSet[taskName] = true;
    }
  }

  var completedCount = Object.keys(completedSet).length;

  var sessionsSheet = ss.getSheetByName('Sessions');
  var rows = sessionsSheet.getDataRange().getValues();
  for (var r = 1; r < rows.length; r++) {
    if (rows[r][0] === sessionCode) {
      setByHeader_(sessionsSheet, r + 1, 'Tasks Completed', completedCount + '/' + required.length);
      if (completedCount === required.length) {
        setByHeader_(sessionsSheet, r + 1, 'Status', 'Complete');
      }
      break;
    }
  }
}

function repairAllSessionCounts() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sessionsSheet = ss.getSheetByName('Sessions');
  var data = sessionsSheet.getDataRange().getValues();

  var repaired = 0;
  for (var i = 1; i < data.length; i++) {
    var sessionCode = data[i][0];
    if (sessionCode) {
      updateCompletedTasksCount(ss, sessionCode);
      repaired++;
    }
  }

  SpreadsheetApp.getUi().alert('Repaired ' + repaired + ' sessions');
  return repaired;
}

function viewSessionActivity() {
  var ui = SpreadsheetApp.getUi();
  var code = ui.prompt('Enter session code:').getResponseText();
  if (!code) return;

  var summary = getSessionActivitySummary(code);
  var output = 'Session: ' + code + '\n\n';
  output += 'Tasks Started: ' + summary.startedCount + '\n';
  output += 'Tasks Completed: ' + summary.completedCount + '\n';
  output += 'Total Duration: ' + Math.round(summary.totalDuration / 60) + ' minutes\n\n';

  output += 'Task Details:\n';
  for (var task in summary.tasks) {
    var t = summary.tasks[task];
    output += '- ' + task + ': ';
    output += t.completed ? 'COMPLETED' : (t.started ? 'STARTED' : 'NOT STARTED');
    if (t.duration) output += ' (' + t.duration + 's)';
    output += '\n';
  }

  ui.alert('Session Activity', output, ui.ButtonSet.OK);
}

// ===============================
// Logging and utilities
// ===============================
function logSessionEvent(ss, ev) {
  var sheet = ss.getSheetByName('Session Events');
  sheet.appendRow([
    ev.timestamp || new Date(),
    ev.sessionCode || '',
    ev.eventType || '',
    ev.details || '',
    ev.ip || '',
    ev.userAgent || ''
  ]);
}

function logEvent(ss, data) {
  logSessionEvent(ss, {
    sessionCode: data.sessionCode || '',
    eventType: data.action || 'event',
    details: JSON.stringify(data),
    timestamp: data.timestamp || new Date().toISOString(),
    userAgent: data.userAgent || ''
  });
}

function getSessionData(ss, sessionCode) {
  if (!sessionCode) return createCorsOutput({ success: false, error: 'Missing sessionCode' });

  var sheet = ss.getSheetByName('Sessions');
  var data = sheet.getDataRange().getValues();
  var headers = data[0].map(function (v) { return String(v || ''); });
  var map = {};
  for (var i = 0; i < headers.length; i++) map[headers[i]] = i;

  for (var r = 1; r < data.length; r++) {
    if (data[r][0] === sessionCode) {
      return createCorsOutput({
        success: true,
        session: {
          sessionCode: data[r][0],
          participantID: map['Participant ID'] != null ? data[r][map['Participant ID']] : '',
          email: map['Email'] != null ? data[r][map['Email']] : '',
          created: map['Created Date'] != null ? data[r][map['Created Date']] : '',
          lastActivity: map['Last Activity'] != null ? data[r][map['Last Activity']] : '',
          totalTimeMin: map['Total Time (min)'] != null ? data[r][map['Total Time (min)']] : '',
          activeTimeMin: map['Active Time (min)'] != null ? data[r][map['Active Time (min)']] : '',
          tasksCompleted: map['Tasks Completed'] != null ? data[r][map['Tasks Completed']] : '',
          status: map['Status'] != null ? data[r][map['Status']] : '',
          deviceType: map['Device Type'] != null ? data[r][map['Device Type']] : '',
          consentStatus: map['Consent Status'] != null ? data[r][map['Consent Status']] : '',
          state: map['State JSON'] != null ? data[r][map['State JSON']] : ''
        }
      });
    }
  }
  return createCorsOutput({ success: false, error: 'Not found' });
}

// ===============================
// Enhanced video logging functions
// ===============================
function logVideoEvent(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Video Tracking') || ss.insertSheet('Video Tracking');

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 12).setValues([[
      'Timestamp','Session Code','Image Number','Filename','File ID','File URL','File Size (KB)','Upload Time','Upload Method','Dropbox Path','Upload Status','Error Message'
    ]]);
    formatHeaders(sheet, 12);
  }

  sheet.appendRow([
    new Date(),
    data.sessionCode || '',
    data.imageNumber || '',
    data.filename || '',
    data.fileId || '',
    data.fileUrl || '',
    data.fileSize || 0,
    data.uploadTime || new Date().toISOString(),
    data.uploadMethod || 'unknown',
    data.dropboxPath || '',
    data.uploadStatus || 'success',
    data.error || ''
  ]);
}
function logVideoUpload(data) {
  data.uploadStatus = data.uploadStatus || 'success';
  logVideoEvent(data);
}
function logVideoUploadError(ss, data) {
  data.uploadStatus = 'error';
  logVideoEvent(data);
}

// ===============================
// EEG columns helpers
// ===============================
function ensureEEGColumns_(ss) {
  var sheet = ss.getSheetByName('Sessions');
  if (!sheet) return null;
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return null;

  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (v) { return String(v || ''); });

  function ensureHeader_(name) {
    var idx = headers.indexOf(name);
    if (idx !== -1) return idx + 1;
    var newCol = sheet.getLastColumn() + 1;
    sheet.insertColumnAfter(sheet.getLastColumn());
    sheet.getRange(1, newCol).setValue(name)
      .setFontWeight('bold')
      .setBackground('#f1f3f4');
    headers.push(name);
    return newCol;
  }

  return {
    status: ensureHeader_('EEG Status'),
    when: ensureHeader_('EEG Scheduled At'),
    source: ensureHeader_('EEG Scheduling Source')
  };
}

function setEEGStatus_(ss, sessionCode, status, scheduledAt, source, note) {
  if (!sessionCode || sessionCode === 'none') return;
  var sheet = ss.getSheetByName('Sessions');
  if (!sheet) return;
  var eegCols = ensureEEGColumns_(ss);
  if (!eegCols) return;

  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === sessionCode) {
      if (status)      sheet.getRange(i + 1, eegCols.status).setValue(status);
      if (scheduledAt) sheet.getRange(i + 1, eegCols.when).setValue(scheduledAt);
      if (source)      sheet.getRange(i + 1, eegCols.source).setValue(source);
      break;
    }
  }
}

// ---------- Consent verification columns ----------
function ensureConsentColumns_(ss) {
  var sheet = ss.getSheetByName('Sessions');
  if (!sheet) return null;

  var lastCol = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (v) { return String(v || ''); });

  function ensureHeader_(name) {
    var idx = headers.indexOf(name);
    if (idx !== -1) return idx + 1;
    var newCol = sheet.getLastColumn() + 1;
    sheet.insertColumnAfter(sheet.getLastColumn());
    sheet.getRange(1, newCol).setValue(name)
         .setFontWeight('bold').setBackground('#f1f3f4');
    headers.push(name);
    return newCol;
  }

  return {
    status: ensureHeader_('Consent Status'),
    src: ensureHeader_('Consent Source'),
    code: ensureHeader_('Consent Code'),
    when: ensureHeader_('Consent Timestamp')
  };
}

function setConsentVerify_(ss, sessionCode, which, status, source, codeSuffix, ts) {
  if (!sessionCode || sessionCode === 'none') return;
  var sheet = ss.getSheetByName('Sessions');
  if (!sheet) return;
  var cols = ensureConsentColumns_(ss);
  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === sessionCode) {
      sheet.getRange(i + 1, cols.status).setValue(status || 'Verified');
      sheet.getRange(i + 1, cols.src).setValue(source || '');
      if (codeSuffix) sheet.getRange(i + 1, cols.code).setValue(codeSuffix);
      sheet.getRange(i + 1, cols.when).setValue(ts || new Date().toISOString());
      break;
    }
  }
}

// ===============================
// Diagnostics
// ===============================
function quickDiagnostic() {
  var ok = true;
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    console.log('Spreadsheet:', ss.getName());
  } catch (e) { ok = false; console.error(e); }

  try {
    var tmp = DriveApp.createFolder('DIAG_' + Date.now());
    tmp.setTrashed(true);
  } catch (e2) { ok = false; console.error(e2); }

  return ok;
}

function sendEEGReminderEmails() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Email Reminders');
  if (!sheet) return;
  var rows = sheet.getDataRange().getValues();
  var now = new Date();
  if (now.getMonth() !== 8 || now.getDate() !== 22) return; // Only run on Sept 22
  var link = 'https://calendly.com/action-brain-lab-gallaudet/spatial-cognition-eeg-only';

  for (var i = 1; i < rows.length; i++) {
    var status = rows[i][4];
    var email = rows[i][1];
    if (status === 'EEG Reminder Requested' && email) {
      MailApp.sendEmail(email,
        'EEG scheduling now open',
        'Scheduling for EEG sessions has reopened. You can now choose your time here: ' + link + '\n\nThank you!');
      sheet.getRange(i + 1, 3).setValue(now);
      sheet.getRange(i + 1, 4).setValue((rows[i][3] || 0) + 1);
      sheet.getRange(i + 1, 5).setValue('EEG Reminder Sent');
    }
  }
}

// ===============================
// Test function for debugging
// ===============================
function testVideoUpload() {
  // Create a small test video
  var testData = 'dGVzdCB2aWRlbyBkYXRh'; // "test video data" in base64

  var result = handleVideoUpload({
    action: 'upload_video',
    sessionCode: 'TEST' + new Date().getTime(),
    imageNumber: 1,
    videoData: testData
  });

  console.log('Test result:', JSON.stringify(result));
  SpreadsheetApp.getUi().alert('Test result: ' + JSON.stringify(result));
}

// ---- Convenience wrapper + menu ----
function safeSetupOrMigrate() { return safeSetupOrMigrate_(); }
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Study Admin')
    .addItem('Normalize Sessions sheet', 'normalizeSessionsSheet')
    .addItem('Safe setup / migrate', 'safeSetupOrMigrate')
    .addItem('Test video upload', 'testVideoUpload')
    .addItem('Repair task counts', 'repairAllSessionCounts')
    .addItem('Test activity summary', 'testActivitySummary')
    .addItem('View session activity', 'viewSessionActivity')
    .addToUi();
}
