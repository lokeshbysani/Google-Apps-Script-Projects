function UpdateGsheetsFromSlack(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('TransactionsData'); 
  var slackToken = 'slack-bot-token'; 
  var webhookUrl = 'https://hooks.slack.com/services/rpa/webhook/url'; 
  
  var json = JSON.parse(e.postData.contents);
  
  // Validate the incoming message
  if (json.event && json.event.type === 'message' && json.event.subtype !== 'bot_message') {
    var userMessage = json.event.text;
    var userId = json.event.user;
    var responseUrl = json.response_url;
    
    // Search for the entry in Google Sheets
    var data = sheet.getDataRange().getValues();
    var found = false;
    var rowIndex = -1;
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][1] === userMessage) {
        rowIndex = i + 1; 
        found = true;
        break;
      }
    }
    
    var responseMessage;
    
    if (found) {
      // Update the existing row
      sheet.getRange(rowIndex, 3).setValue('Updated');  
      responseMessage = 'Entry updated successfully!';
    } else {
      // Create a new row
      sheet.appendRow([new Date().toISOString(), userMessage, 'Created']); 
      responseMessage = 'New entry created!';
    }
    
    // Send response to Slack
    UrlFetchApp.fetch(responseUrl, {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify({
        text: responseMessage,
        thread_ts: json.event.thread_ts 
      })
    });
  }
  
  return ContentService.createTextOutput('OK');
}
