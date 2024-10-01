// file ini berasal dari appscript google sheet hasil nilai

function myFunction() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Pastikan kita hanya beroperasi pada sheet tertentu
  if (sheet.getName() !== "tryout1") return; // Ganti dengan nama sheet Anda

  var range = sheet.getDataRange(); // Mengambil semua data
  var values = range.getValues(); // Mengambil nilai dalam bentuk array 2D

  // Membuat array untuk menyimpan baris dengan status "Lulus" dan "Tidak Lulus"
  var lulusRows = [];
  var tidakLulusRows = [];

  for (var i = 1; i < values.length; i++) { // Mulai dari 1 untuk menghindari header
    if (values[i][4] === "Lulus") { // Kolom E (indeks 4)
      lulusRows.push(values[i]);
    } else if (values[i][4] === "Tidak Lulus") {
      tidakLulusRows.push(values[i]);
    }
  }

  // Menyortir baris berdasarkan nilai total di kolom D (indeks 3)
  lulusRows.sort(function(a, b) {
    return b[3] - a[3]; // Sort dari tinggi ke rendah
  });

  tidakLulusRows.sort(function(a, b) {
    return b[3] - a[3]; // Sort dari tinggi ke rendah
  });

  // Menggabungkan hasil
  var sortedRows = lulusRows.concat(tidakLulusRows);

  // Menyusun kembali data di sheet
  for (var i = 0; i < sortedRows.length; i++) {
    sheet.getRange(i + 2, 1, 1, sortedRows[i].length).setValues([sortedRows[i]]);
  }
}
