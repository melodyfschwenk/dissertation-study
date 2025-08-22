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

function safeSetupOrMigrate_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // Sessions
  ensureSheetWithHeaders_(ss, 'Sessions', [
    'Session Code', 'Participant ID', 'Email', 'Sequence Index',
    'Created Date', 'Last Activity', 'Total Time (min)', 'Tasks Completed',
    'Consent 1', 'Consent 2', 'Status', 'Device Type', 'Notes'
  ]);

  // Task Progress
  ensureSheetWithHeaders_(ss, 'Task Progress', [
    'Timestamp','Session Code','Participant ID','Task Name',
    'Event Type','Duration (sec)','Details','Completed'
  ]);

  // Session Events
  ensureSheetWithHeaders_(ss, 'Session Events', [
    'Timestamp','Session Code','Event Type','Details','IP Address','User Agent'
  ]);

  // Enhanced video uploads logging with Dropbox support
  ensureSheetWithHeaders_(ss, 'Video_Uploads', [
    'Timestamp','Session Code','Image Number','Filename',
    'File ID','File URL','File Size (KB)','Upload Time',
    'Upload Method','Dropbox Path','Upload Status'
  ]);
  
  ensureSheetWithHeaders_(ss, 'Video_Upload_Errors', [
    'Timestamp','Session Code','Image Number','Error Message',
    'Upload Time','Attempted Method','Fallback Used'
  ]);

  // Email reminders
  ensureSheetWithHeaders_(ss, 'Email Reminders', [
    'Session Code','Email','Last Reminder Sent','Reminders Count','Status'
  ]);

  // Dashboard with upload method summary
  var dash = ss.getSheetByName('Dashboard') || ss.insertSheet('Dashboard');
  if (dash.getLastRow() < 1) dash.getRange(1, 1).setValue('Dashboard');
  dash.getRange('A1').setFontSize(16).setFontWeight('bold');
  if (!dash.getRange('A3').getDisplayValue()) dash.getRange('A3').setValue('Total Sessions');
  if (!dash.getRange('B3').getDisplayValue()) dash.getRange('B3').setFormula('=COUNTA(Sessions!A2:A)');
  if (!dash.getRange('A4').getDisplayValue()) dash.getRange('A4').setValue('Completed Studies');
  if (!dash.getRange('B4').getDisplayValue()) dash.getRange('B4').setFormula('=COUNTIF(Sessions!K2:K,"Complete")');
  if (!dash.getRange('A5').getDisplayValue()) dash.getRange('A5').setValue('Videos Uploaded');
  if (!dash.getRange('B5').getDisplayValue()) dash.getRange('B5').setFormula('=COUNTA(Video_Uploads!A2:A)');
  
  // Add upload method breakdown
  if (!dash.getRange('A7').getDisplayValue()) {
    dash.getRange('A7').setValue('Upload Method Breakdown');
    dash.getRange('A7').setFontWeight('bold');
    dash.getRange('A8').setValue('Dropbox Uploads');
    dash.getRange('B8').setFormula('=COUNTIF(Video_Uploads!I2:I,"dropbox")');
    dash.getRange('A9').setValue('Google Drive Uploads');
    dash.getRange('B9').setFormula('=COUNTIF(Video_Uploads!I2:I,"google_drive")');
    dash.getRange('A10').setValue('Local Only');
    dash.getRange('B10').setFormula('=COUNTIF(Video_Uploads!I2:I,"local_only")');
    dash.getRange('A11').setValue('Failed Uploads');
    dash.getRange('B11').setFormula('=COUNTA(Video_Upload_Errors!A2:A)');
  }
  
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
  sessionsSheet.getRange(1, 1, 1, 13).setValues([
    [
    'Session Code','Participant ID','Email','Sequence Index','Created Date','Last Activity',
    'Total Time (min)','Tasks Completed','Consent 1','Consent 2','Status','Device Type','Notes'
  ]]);
  formatHeaders(sessionsSheet, 13);

  var progressSheet = ss.getSheetByName('Task Progress') || ss.insertSheet('Task Progress');
  progressSheet.clear();
  progressSheet.getRange(1, 1, 1, 8).setValues([
    [
    'Timestamp','Session Code','Participant ID','Task Name','Event Type','Duration (sec)','Details','Completed'
  ]]);
  formatHeaders(progressSheet, 8);

  var eventsSheet = ss.getSheetByName('Session Events') || ss.insertSheet('Session Events');
  eventsSheet.clear();
  eventsSheet.getRange(1, 1, 1, 6).setValues([
    [
    'Timestamp','Session Code','Event Type','Details','IP Address','User Agent'
  ]]);
  formatHeaders(eventsSheet, 6);


  var videoSheet = ss.getSheetByName('Video_Uploads') || ss.insertSheet('Video_Uploads');
  videoSheet.clear();
  videoSheet.getRange(1, 1, 1, 11).setValues([
    [
    'Timestamp','Session Code','Image Number','Filename','File ID','File URL','File Size (KB)',
    'Upload Time','Upload Method','Dropbox Path','Upload Status'
  ]]);
  formatHeaders(videoSheet, 11);

  var videoErr = ss.getSheetByName('Video_Upload_Errors') || ss.insertSheet('Video_Upload_Errors');
  videoErr.clear();
  videoErr.getRange(1, 1, 1, 7).setValues([
    [
    'Timestamp','Session Code','Image Number','Error Message','Upload Time','Attempted Method','Fallback Used'
  ]]);
  formatHeaders(videoErr, 7);

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
  sheet.getRange('B4').setFormula('=COUNTIF(Sessions!K2:K,"Complete")');
  sheet.getRange('A5').setValue('Videos Uploaded');
  sheet.getRange('B5').setFormula('=COUNTA(Video_Uploads!A2:A)');
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
  var rows = sheet.getDataRange().getValues();
  var col = (data.type === 'consent1') ? 9 : 10;

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.sessionCode) {
      sheet.getRange(i + 1, col).setValue('Complete');
      break;
    }
  }
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Consent Completed',
    details: (data.type === 'consent1' ? 'Research Consent' : 'Video Consent') + ' marked complete',
    timestamp: data.timestamp
  });
}

function logVideoDeclined(ss, data) {
  var sheet = ss.getSheetByName('Sessions');
  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.sessionCode) {
      sheet.getRange(i + 1, 10).setValue('Declined');
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
      var duration = progressData[i][5];
      
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
    '',
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
  sheet.appendRow([
    data.timestamp,
    data.sessionCode,
    data.participantID || getParticipantIDFromSession(ss, data.sessionCode), // Fetch if missing
    data.task,
    'Completed',
    data.duration || 0,
    '',
    true
  ]);
  updateCompletedTasksCount(ss, data.sessionCode);
  updateSessionActivity(ss, data.sessionCode, data.timestamp);
  updateTotalTime(ss, data.sessionCode);
  
  // Add to Session Events for better tracking
  logSessionEvent(ss, {
    sessionCode: data.sessionCode,
    eventType: 'Task Completed',
    details: data.task + ' (Duration: ' + (data.duration || 0) + 's)',
    timestamp: data.timestamp
  });
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
    var sheet = ss.getSheetByName('Sessions');
    var rows = sheet.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] === data.sessionCode) {
        var notes = rows[i][12] || '';
        sheet.getRange(i + 1, 13).setValue(notes ? (notes + ' | EEG Interest') : 'EEG Interest');
        break;
      }
    }
  }
}

function completeStudy(ss, data) {
  var required = getRequiredTasksForSession_(ss, data.sessionCode);
  var sheet = ss.getSheetByName('Sessions');
  var rows = sheet.getDataRange().getValues();

  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.sessionCode) {
      sheet.getRange(i + 1, 7).setValue(data.totalDuration || 0);                    // Total Time (min)
      sheet.getRange(i + 1, 8).setValue(required.length + '/' + required.length);    // Tasks Completed
      sheet.getRange(i + 1, 11).setValue('Complete');                                // Status
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
      sheet.getRange(i + 1, 6).setValue(timestamp);
      break;
    }
  }
}

function updateTotalTime(ss, sessionCode) {
  var p = ss.getSheetByName('Task Progress').getDataRange().getValues();
  var total = 0;
  for (var i = 1; i < p.length; i++) {
    if (p[i][1] === sessionCode && p[i][5]) total += Number(p[i][5]) || 0;
  }
  var s = ss.getSheetByName('Sessions').getDataRange().getValues();
  for (var r = 1; r < s.length; r++) {
    if (s[r][0] === sessionCode) {
      ss.getSheetByName('Sessions').getRange(r + 1, 7).setValue(Math.round(total / 60));
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
      deviceType = s[r][11] || 'Desktop'; // col L
      consent2   = s[r][9]  || '';        // col J
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
      var details = String(progress[i][6] || '').toLowerCase();
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
    var details = String(progress[i][6] || ''); // Column G: Details
    
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
        sessionsSheet.getRange(r + 1, 11).setValue('Complete');
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
          created: s[i][4],
          lastActivity: s[i][5],
          totalTimeMin: s[i][6],
          tasksCompleted: s[i][7],
          consent1: s[i][8],
          consent2: s[i][9],
          status: s[i][10],
          deviceType: s[i][11],
          notes: s[i][12]
        }
      });
    }
  }
  return createCorsOutput({ success: false, error: 'Not found' });
}

// ===============================
// Enhanced video logging functions
// ===============================
function logVideoUpload(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Video_Uploads') || ss.insertSheet('Video_Uploads');
  
  // Ensure all columns exist
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 11).setValues([
      [
      'Timestamp', 'Session Code', 'Image Number', 'Filename',
      'File ID', 'File URL', 'File Size (KB)', 'Upload Time',
      'Upload Method', 'Dropbox Path', 'Upload Status'
    ]]);
    formatHeaders(sheet, 11);
  }
  
  // Add new columns if they don't exist (for existing sheets)
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var headersToAdd = [
    { name: 'Upload Method', position: 9 },
    { name: 'Dropbox Path', position: 10 },
    { name: 'Upload Status', position: 11 }
  ];
  
  headersToAdd.forEach(function(header) {
    if (headers.indexOf(header.name) === -1) {
      var newCol = sheet.getLastColumn() + 1;
      sheet.insertColumnAfter(sheet.getLastColumn());
      sheet.getRange(1, newCol).setValue(header.name)
           .setFontWeight('bold').setBackground('#f1f3f4');
    }
  });
  
  // Log the upload with enhanced data
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
    data.uploadStatus || 'success'
  ]);
}

function logVideoUploadError(ss, data) {
  var sheet = ss.getSheetByName('Video_Upload_Errors') || ss.insertSheet('Video_Upload_Errors');
  
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 7).setValues([
      [
      'Timestamp', 'Session Code', 'Image Number', 'Error Message', 
      'Upload Time', 'Attempted Method', 'Fallback Used'
    ]]);
    formatHeaders(sheet, 7);
  }
  
  // Add new columns if they don't exist
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (headers.indexOf('Attempted Method') === -1) {
    var newCol = sheet.getLastColumn() + 1;
    sheet.insertColumnAfter(sheet.getLastColumn());
    sheet.getRange(1, newCol).setValue('Attempted Method')
         .setFontWeight('bold').setBackground('#f1f3f4');
  }
  if (headers.indexOf('Fallback Used') === -1) {
    var newCol2 = sheet.getLastColumn() + 1;
    sheet.insertColumnAfter(sheet.getLastColumn());
    sheet.getRange(1, newCol2).setValue('Fallback Used')
         .setFontWeight('bold').setBackground('#f1f3f4');
  }
  
  sheet.appendRow([
    new Date(),
    data.sessionCode || 'unknown',
    data.imageNumber || 0,
    data.error || '',
    data.timestamp || new Date().toISOString(),
    data.attemptedMethod || 'unknown',
    data.fallbackUsed || false
  ]);
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
      if (note) {
        var existing = rows[i][12] || '';
        sheet.getRange(i + 1, 13).setValue(existing ? (existing + ' | ' + note) : note);
      }
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
    c1: ensureHeader_('Consent1 Verify'),
    c2: ensureHeader_('Consent2 Verify'),
    src: ensureHeader_('Consent Verify Source'),
    code: ensureHeader_('Consent Verify Code'),
    when: ensureHeader_('Consent Verify Timestamp')
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
      var colVerify = (which === 'consent1') ? cols.c1 : cols.c2;
      sheet.getRange(i + 1, colVerify).setValue(status || 'Verified');
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

