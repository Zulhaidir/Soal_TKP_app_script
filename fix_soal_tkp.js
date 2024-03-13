function onFormSubmit(even) {
  var record_array = [];

  var form = FormApp.openById('13h9Zs9ujYfZZcvV8KMbUgZO4UWn3j00wSvgRKujExk0');
  var responses = form.getResponses();
  var lastResponse = responses[responses.length - 1];
  var name = lastResponse.getItemResponses()[0].getResponse();

  record_array.push(name);

  var answer = lastResponse.getItemResponses().slice(1).map(function(a) { 
    return a.getResponse();
  });

  var mChoiceItem = form.getItems().slice(1).map(function(item) {
    return item.asMultipleChoiceItem().getChoices().map(function(choice) {
      return choice.getValue();
    });
  });

  var valueChoice = convertTo2DArray();

  var mappedValues = answer.map(function(choice, index) {
    var choiceIndex = mChoiceItem[index].indexOf(choice);
    var value = valueChoice[index][choiceIndex];
    return value;
  });

  var sum = mappedValues.reduce(function(acc, cur) {
    return acc + cur;
  });
  record_array.push(sum);

  // Menampilkan data berupa nama dan total nilai ke spreadsheet
  var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1IvMpfeR4l5b6eLtv-E9tQgfZO3_ZeAi_mfPGWZLEKqU/edit?resourcekey#gid=996274651');
  // var sheet = spreadsheet.getSheetByName('TKP5');
  var sheet = spreadsheet.getSheetByName('TKP4');
  var row = sheet.getLastRow() + 1;
  sheet.getRange(row, 1).setValue(record_array[0]);
  sheet.getRange(row, 2).setValue(record_array[1]);
}

// import Nilai Score Pada Opsi di Spreadsheet
function convertTo2DArray() {
  var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/19xtZjMddE7xRxl2jxge1MbkRYly7b1QcMBLAVzzG91o/edit?hl=id#gid=0');
  var sheet = spreadsheet.getSheetByName('TKP5'); 

  var lastRow = sheet.getLastRow();
  var lastColumn = sheet.getLastColumn();
  var dataRange = sheet.getRange(1, 1, lastRow, lastColumn);
  var dataValues = dataRange.getValues();

  var valueChoice = dataValues.map(function(row) {
    return row.map(function(value) {
      return value;
    });
  });
  return valueChoice;
}






