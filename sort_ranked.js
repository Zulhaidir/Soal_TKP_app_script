function myFunction() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Pastikan kita hanya beroperasi pada sheet tertentu
  if (sheet.getName() !== "tryout1") return; // Ganti dengan nama sheet Anda jika diperlukan

  var range = sheet.getDataRange(); // Mengambil semua data
  var values = range.getValues(); // Mengambil nilai dalam bentuk array 2D

  // Membuat array untuk menyimpan baris dengan status "Lulus" dan "Tidak Lulus"
  var lulusRows = [];
  var tidakLulusRows = [];

  for (var i = 1; i < values.length; i++) { // Mulai dari 1 untuk menghindari header
    if (values[i][5] === "Lulus") { // Kolom Status (indeks 5)
      lulusRows.push(values[i]);
    } else if (values[i][5] === "Tidak Lulus") {
      tidakLulusRows.push(values[i]);
    }
  }

  // Menyortir baris "Lulus" berdasarkan nilai total di kolom E (indeks 4)
  lulusRows.sort(function(a, b) {
    return b[4] - a[4]; // Sort dari tinggi ke rendah
  });

  // Menyortir baris "Tidak Lulus" berdasarkan nilai total di kolom E (indeks 4)
  tidakLulusRows.sort(function(a, b) {
    return b[4] - a[4]; // Sort dari tinggi ke rendah
  });

  // Menyusun kembali data di sheet
  var rowIndex = 2; // Mengatur indeks awal untuk menulis ke sheet

  // Menulis baris "Lulus" ke sheet
  for (var j = 0; j < lulusRows.length; j++) {
    sheet.getRange(rowIndex, 1, 1, lulusRows[j].length).setValues([lulusRows[j]]);
    rowIndex++;
  }

  // Menulis baris "Tidak Lulus" ke sheet
  for (var k = 0; k < tidakLulusRows.length; k++) {
    sheet.getRange(rowIndex, 1, 1, tidakLulusRows[k].length).setValues([tidakLulusRows[k]]);
    rowIndex++;
  }
}
