function onFormSubmit() {
  record_array = [];
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/1_Si-MTi180PtvjjCmOXjklPT5XUv-5IoxUTd34tE3I0/edit?resourcekey=&gid=2144162136'; 
  var spreadsheet = SpreadsheetApp.openByUrl(sheetUrl); 
  var sheet = spreadsheet.getSheetByName('Form Responses 1'); 

  var lastRow = sheet.getLastRow();
  var lastResponse = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0]; 

  var nama = lastResponse[2]; // Kolom C
  var jawaban = lastResponse.slice(3, 68); // Kolom D sampai BP (nomor 1 - 65)

  // Mengganti nilai kosong dan null dengan nol
  jawaban = jawaban.map((response) => {
    return response === "" || response === null ? 0 : response;
  });

  var form = FormApp.openById('1rlBnH-h-q4uieItcDghjF8X6JwDcu7-0XsQQMBxtOnI');
  var jawabanTwk = jawaban.slice(0, 30); 
  var jawabanTiu = jawaban.slice(30, 65);

  // --------------------------- Start Twk -------------------------------
  var itemOpsiTwk = form.getItems().slice(3, 33).map((item) => {
    return item.asMultipleChoiceItem().getChoices().map((opsi) => {
      return opsi.getValue();
    });
  });

  var kunciTwk = kunciJawaban('twk');
  var mapNilaiTwk = jawabanTwk.map((opsi, index) => {
    var opsiIndex = itemOpsiTwk[index].indexOf(opsi);
    return opsiIndex === -1 ? 0 : (kunciTwk[index] && kunciTwk[index][opsiIndex] !== undefined ? kunciTwk[index][opsiIndex] : 0);
  });
  var sumTwk = mapNilaiTwk.reduce((acc, cur) => acc + cur, 0);
  // --------------------------- End Twk ---------------------------------

  // --------------------------- Start Tiu -------------------------------
  var itemOpsiTiu = form.getItems().slice(34, 69).map((item) => {
    return item.asMultipleChoiceItem().getChoices().map((opsi) => {
      return opsi.getValue();
    });
  });

  var kunciTiu = kunciJawaban('tiu');
  var mapNilaiTiu = jawabanTiu.map((opsi, index) => {
    var opsiIndex = itemOpsiTiu[index].indexOf(opsi);
    return opsiIndex === -1 ? 0 : (kunciTiu[index] && kunciTiu[index][opsiIndex] !== undefined ? kunciTiu[index][opsiIndex] : 0);
  });
  var sumTiu = mapNilaiTiu.reduce((acc, cur) => acc + cur, 0);
  // --------------------------- End Tiu ---------------------------------

  var sum = sumTwk + sumTiu;
  var status = (sumTwk >= 65 && sumTiu >= 80) ? "Lulus" : "Tidak Lulus";
  record_array.push(nama, sumTwk, sumTiu, sum, status);

  var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/16odfYHMrf3Rx_2dgEoSK3WGiefJZ7pXNM7Fu3EJvsEY/edit?gid=0#gid=0');
  var sheet = spreadsheet.getSheetByName('tryout1');
  var row = sheet.getLastRow() + 1;
  var valuesToWrite = [record_array];
  sheet.getRange(row, 1, 1, record_array.length).setValues(valuesToWrite);
  sheet.getRange(row, 1, 1, record_array.length).setHorizontalAlignment("center");
  
}

 function kunciJawaban(sheetName) {
   var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1WWi3dgR2Wi9vlWYQhhsBqSqbBzVHzR8SOG2JKGgCbxA/edit?gid=0#gid=0');
   var sheet = spreadsheet.getSheetByName(sheetName); 

   var lastRow = sheet.getLastRow();
   var dataRange = sheet.getRange(1, 1, lastRow, 5); // Ambil hanya hingga kolom E
   var dataValues = dataRange.getValues();

   var nilaiOpsi = dataValues.map(function(row) {
     return row.map(function(value) {
       return value;
     });
   });
   return nilaiOpsi;
 }


