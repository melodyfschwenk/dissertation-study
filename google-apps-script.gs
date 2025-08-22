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
    
    // Handle preflight
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
          uploadStatus: data.uploadStatus || 'skipped'
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
  
  // Note: We can't set custom headers in Apps Script, but ContentService
  // automatically handles CORS for deployed web apps when accessed from any origin
  return output;
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

  // Merge old consent columns into single Consent Status
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

  // Remove redundant columns
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

  // Sessions sheet cleanup and setup
  cleanSessionsSheet_(ss);
  ensureSheetWithHeaders_(ss, 'Sessions', [
    'Session Code','Participant ID','Email','Created Date','Last Activity','Total Time (min)','Active Time (min)','Tasks Completed','Status','Device Type','Consent Status'
  ]);

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

  // Dashboard
  var dash = ss.getSheetByName('Dashboard') || ss.insertSheet('Dashboard');
  dash.getRange('A1').setValue('Dashboard').setFontSize(16).setFontWeight('bold');
  dash.getRange('A3').setValue('Total Sessions');
  dash.getRange('B3').setFormula('=COUNTA(Sessions!A2:A)');
  dash.getRange('A4').setValue('Completed Studies');
  dash.getRange('B4').setFormula('=COUNTIF(Sessions!I2:I,"Complete")');

  dash.getRange('A6').setValue('Device Breakdown');
  dash.getRange('A7').setValue('Desktop');
  dash.getRange('B7').setFormula('=COUNTIF(Sessions!J2:J,"desktop")');
  dash.getRange('A8').setValue('Mobile');
  dash.getRange('B8').setFormula('=COUNTIF(Sessions!J2:J,"mobile")');
  dash.getRange('A9').setValue('Tablet');
  dash.getRange('B9').setFormula('=COUNTIF(Sessions!J2:J,"tablet")');

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

  dash.getRange('A19').setValue('EEG Interested');
  dash.getRange('B19').setFormula('=COUNTIF(Sessions!O2:O,"Interested")');
  dash.autoResizeColumns(1, 2);

  // Dynamic columns on Sessions
  ensureConsentColumns_(ss);
  ensureEEGColumns_(ss);

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

    // Check size (Apps Script has a ~50MB limit for base64 strings in practice)
    var base64Length = data.videoData.length;
    var approxBytes = base64Length * 0.75; // rough estimate
    
    console.log('Video size estimate:', Math.round(approxBytes / 1024), 'KB');
    
    if (approxBytes > 50 * 1024 * 1024) {
      throw new Error('Video file too large (limit ~50MB)');
    }

    // Get or create folders
    var studyFolder = getOrCreateStudyFolder();
    var participantFolder = getOrCreateParticipantFolder(studyFolder, data.sessionCode);

    // Decode base64 to bytes
    var bytes;
    try {
      bytes = Utilities.base64Decode(data.videoData);
      console.log('Decoded video bytes:', bytes.length);
    } catch (decodeError) {
      console.error('Base64 decode error:', decodeError);
      throw new Error('Invalid video data encoding');
    }

    // Create filename with timestamp
    var ts = new Date().toISOString().replace(/[:.]/g, '-');
    var filename = data.sessionCode + '_image' + data.imageNumber + '_' + ts + '.webm';

    // Create blob and save to Drive
    var blob = Utilities.newBlob(bytes, 'video/webm', filename);
    var file = participantFolder.createFile(blob);

    // Set file permissions (private by default)
    try {
      file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.VIEW);
    } catch (e) {
      console.warn('Could not set file sharing:', e);
    }

    // Log the upload with enhanced data
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
    
    // Log the error with enhanced data
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
  sessionsSheet.getRange(1, 1, 1, 11).setValues([
    [
    'Session Code','Participant ID','Email','Created Date','Last Activity',
    'Total Time (min)','Active Time (min)','Tasks Completed','Status','Device Type','Consent Status'
  ]]);
  formatHeaders(sessionsSheet, 11);

  var progressSheet = ss.getSheetByName('Task Progress') || ss.insertSheet('Task Progress');
  progressSheet.clear();
  progressSheet.getRange(1, 1, 1, 14).setValues([
    [
    'Timestamp','Session Code','Participant ID','Task Name','Event Type','Start Time','End Time','Elapsed Time (sec)','Active Time (sec)','Pause Count','Inactive Time (sec)','Activity Score (%)','Details','Completed'
  ]]);
  formatHeaders(progressSheet, 14);

  var eventsSheet = ss.getSheetByName('Session Events') || ss.insertSheet('Session Events');
  eventsSheet.clear();
  eventsSheet.getRange(1, 1, 1, 6).setValues([
    [
    'Timestamp','Session Code','Event Type','Details','IP Address','User Agent'
  ]]);
  formatHeaders(eventsSheet, 6);


  var videoSheet = ss.getSheetByName('Video Tracking') || ss.insertSheet('Video Tracking');
  videoSheet.clear();
  videoSheet.getRange(1, 1, 1, 12).setValues([
    [
    'Timestamp','Session Code','Image Number','Filename','File ID','File URL','File Size (KB)','Upload Time','Upload Method','Dropbox Path','Upload Status','Error Message'
  ]]);
  formatHeaders(videoSheet, 12);

  var reminders = ss.getSheetByName('Email Reminders') || ss.insertSheet('Email Reminders');
  reminders.clear();
  reminders.getRange(1, 1, 1, 5).setValues([
    [
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
  sheet.getRange('A3').setValue('Total Sessions');
  sheet.getRange('B3').setFormula('=COUNTA(Sessions!A2:A)');
  sheet.getRange('A4').setValue('Completed Studies');
  sheet.getRange('B4').setFormula('=COUNTIF(Sessions!I2:I,"Complete")');
  sheet.getRange('A5').setValue('Videos Uploaded');
  sheet.getRange('B5').setFormula('=COUNTA(\'Video Tracking\'!A2:A)');
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
function createSession(ss, data) {
  var sheet = ss.getSheetByName('Sessions');
  var isMobile = (data.sequenceIndex === -1) || data.deviceType === 'mobile/tablet';
  var totalTasks = isMobile ? 6 : 7;
  var deviceType = isMobile ? 'Mobile/Tablet' : 'Desktop';

  sheet.appendRow([
    data.sessionCode,
    data.participantID,
    data.email || '',
    data.sequenceIndex,
    data.timestamp,
    data.timestamp,
    0,
    0,
    0,
    '0/' + totalTasks,
    'Pending',
    'Pending',
    'Active',
    deviceType,
    'Created on ' + deviceType
  ]);

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
  
  // Add to Session Events for better tracking
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

  // Add to Session Events for better tracking
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

// Add helper function to get participant ID from session
function getParticipantIDFromSession(ss, sessionCode) {
  var sheet = ss.getSheetByName('Sessions');
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === sessionCode) {
      return rows[i][1]; // Column B is Participant ID
    }
  }
  return '';
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
    'Video Recorded - Image ' + data.imageNumber,
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
}

function completeStudy(ss, data) {
  var required = getRequiredTasksForSession_(ss, data.sessionCode);
  var sheet = ss.getSheetByName('Sessions');
  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.sessionCode) {
      sheet.getRange(i + 1, 6).setValue(data.totalDuration || 0);                    // Total Time (min)
      sheet.getRange(i + 1, 8).setValue(required.length + '/' + required.length);   // Tasks Completed
      sheet.getRange(i + 1, 9).setValue('Complete');                                // Status
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
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === sessionCode) {
      sheet.getRange(i + 1, 5).setValue(timestamp);
      break;
    }
  }
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
  var rows = s.getDataRange().getValues();
  for (var r = 1; r < rows.length; r++) {
    if (rows[r][0] === sessionCode) {
      s.getRange(r + 1, 7).setValue(Math.round(totalElapsed / 60));
      s.getRange(r + 1, 8).setValue(Math.round(totalActive / 60));
      var pct = totalElapsed ? Math.round((totalActive / totalElapsed) * 100) : 0;
      s.getRange(r + 1, 9).setValue(pct);
      if (pct < 30) {
        var notes = rows[r][14] || '';
        s.getRange(r + 1, 15).setValue(notes ? (notes + ' | Low activity') : 'Low activity');
      }
      break;
    }
  }
}

function getRequiredTasksForSession_(ss, sessionCode) {
  var sessionsSheet = ss.getSheetByName('Sessions');
  var s = sessionsSheet.getDataRange().getValues();
  var deviceType = 'Desktop';
  var consent2 = '';
  for (var r = 1; r < s.length; r++) {
    if (s[r][0] === sessionCode) {
      deviceType = s[r][13] || 'Desktop'; // col N
      consent2   = s[r][11]  || '';       // col L
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

  if (String(consent2).toLowerCase() === 'declined') {
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
    
    // Check BOTH 'Completed' status OR 'Skipped' with valid reasons
    var eventType = progress[i][4]; // Column E: Event Type
    var taskName = progress[i][3];  // Column D: Task Name
    var details = String(progress[i][12] || ''); // Column M: Details
    
    // Task is considered done if:
    // 1. Event Type is 'Completed'
    // 2. Event Type is 'Skipped' AND it's either ASLCT (doesn't know ASL) or ID (video declined)
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
      sessionsSheet.getRange(r + 1, 8).setValue(completedCount + '/' + required.length);

      // Also update status to Complete if all required tasks are done
      if (completedCount === required.length) {
        sessionsSheet.getRange(r + 1, 9).setValue('Complete');
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

  var s = ss.getSheetByName('Sessions').getDataRange().getValues();
  for (var i = 1; i < s.length; i++) {
    if (s[i][0] === sessionCode) {
      return createCorsOutput({
        success: true,
        session: {
          sessionCode: s[i][0],
          participantID: s[i][1],
          email: s[i][2],
          created: s[i][3],
          lastActivity: s[i][4],
          totalTimeMin: s[i][5],
          activeTimeMin: s[i][6],
          tasksCompleted: s[i][7],
          status: s[i][8],
          deviceType: s[i][9],
          consentStatus: s[i][10]
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
    .addItem('Safe setup / migrate', 'safeSetupOrMigrate')
    .addItem('Test video upload', 'testVideoUpload')
    .addItem('Repair task counts', 'repairAllSessionCounts')
    .addItem('Test activity summary', 'testActivitySummary')
    .addItem('View session activity', 'viewSessionActivity')
    .addToUi();
}

