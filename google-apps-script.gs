function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  let result = { status: 'ok' };
  switch (data.action) {
    case 'aslct_issue':
      logASLCTIssue(data);
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
