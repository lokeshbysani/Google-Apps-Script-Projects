function notify(e) {
  if (e.changeType == "EDIT" || e.changeType == "INSERT_ROW") {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName("MS");
    var headings = sheet.getDataRange().offset(2, 0, 1).getValues()[0];
    var column_to_watch = 82; // A=1, B=2, C=3, etc.
    allowedHeaders = [
    "PinCode",
    "District",
    "Address",
    "ContactNo",
    "Consumer Name",
    "Feasibility Timing",
    "Panel Wp",
    "No of Panel",
    "Application No.",
    "System Capacity",
    "ConsumerNo",
    "Discom",
    "Stages",
    "Installer NamePanel Brand",
    "DealerType",
    "DealerName",
    "Installer Name",
    "Panel Brand",
    "RegistrationDate",
    "Subsidy Claimed",
    "Feasibility Approval Date",
    "SalesPersonName",
    "Inverter Capacity",
    "Inverter Brand"
]
;
    var row = sheet.getActiveRange().getRow();
    var column = sheet.getActiveRange().getColumn();

    if (e.changeType == "EDIT" && column != column_to_watch) {
      return;
    }

    var values = sheet.getSheetValues(row, 1, 1, 84);
    var payload = {};

    for (var i = 0; i < headings.length; i++) {
      var name = headings[i];
      var value = values[0][i];

      if (allowedHeaders.includes(name)) {
        if (name == 'RegistrationDate' || name == 'Subsidy Claimed' || name == 'Feasibility Approval Date') {
          var date = new Date(value);
          var formattedDate = Utilities.formatDate(date, 'GMT+0', 'yyyy-MM-dd');
          payload[name] = formattedDate;
        } else {
          payload[name] = value;
        }
      }
    }

    payload["row_number"] = row;
    Logger.log(payload);

    var options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(payload)
    };
    UrlFetchApp.fetch('yourwebhookurl', options);
  }
}
