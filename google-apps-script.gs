function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  let result = { status: 'ok' };
  switch (data.action) {
    case 'aslct_issue':
      logASLCTIssue(data);
      break;
    case 'study_completed':
      markStudyComplete(data);
      break;
    // other cases...
    default:
      result = { status: 'unknown_action' };
  }
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function logASLCTIssue(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = 'ASLCT Issues';
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(['Timestamp', 'Session Code', 'Participant ID', 'Message']);
  }
  sheet.appendRow([new Date().toISOString(), data.sessionCode, data.participantID, data.message]);
  MailApp.sendEmail(
    'action.brain.lab@gallaudet.edu',
    'ASLCT Issue Reported',
    'Session Code: ' + data.sessionCode + '\nParticipant ID: ' + data.participantID + '\nMessage: ' + data.message
  );
}

function markStudyComplete(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Sessions');
  if (!sheet) return;

  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.sessionCode) {
      const deviceType = rows[i][11] ? rows[i][11].toString() : '';
      const totalTasks = deviceType.toLowerCase().includes('mobile') ? 6 : 7;

      sheet.getRange(i + 1, 6).setValue(data.timestamp || new Date().toISOString());
      if (data.totalDuration !== undefined) {
        sheet.getRange(i + 1, 7).setValue(data.totalDuration);
      }
      sheet.getRange(i + 1, 8).setValue(totalTasks + '/' + totalTasks);

      const consent1 = sheet.getRange(i + 1, 9);
      if (consent1.getValue() !== 'Declined') consent1.setValue('Complete');

      const consent2 = sheet.getRange(i + 1, 10);
      if (consent2.getValue() !== 'Declined') consent2.setValue('Complete');

      sheet.getRange(i + 1, 11).setValue('Complete');
      break;
    }
  }
}
