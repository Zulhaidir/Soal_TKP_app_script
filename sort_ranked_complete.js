// code ini berasal dari google sheet hasil nilai
// untuk trigger gunakan "On Open"

function myFunction() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Pastikan kita hanya beroperasi pada sheet tertentu
  if (sheet.getName() !== "tryout1") return; // Ganti dengan nama sheet Anda jika diperlukan

  var range = sheet.getDataRange(); // Mengambil semua data
  var values = range.getValues(); // Mengambil nilai dalam bentuk array 2D

  // Membuat array untuk menyimpan baris dengan status "Lulus" dan "Tidak Lulus"
  var lulusRows = [];
  var tidakLulusRows = [];

  // Memisahkan data berdasarkan status
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

  // Panggil fungsi untuk menetapkan ranking
  setRanking(sheet, 2, lulusRows.length);

  // Tambahkan tanda "-" untuk "Tidak Lulus"
  markNotPassed(sheet, 2 + lulusRows.length, tidakLulusRows.length);
}

// sorting Total berstatus "Lulus"
function setRanking(sheet, startRow, totalRows) {
  var lastTotal = null; // Untuk menyimpan total terakhir
  var rank = 1; // Peringkat awal
  var currentRank = 1; // Peringkat saat ini yang ditampilkan

  for (var i = startRow; i < startRow + totalRows; i++) {
    var currentTotal = sheet.getRange(i, 5).getValue(); // Kolom E (Total, indeks 4)

    // Jika ini adalah baris pertama atau total berbeda
    if (lastTotal === null || currentTotal !== lastTotal) {
      lastTotal = currentTotal; // Update total terakhir
      sheet.getRange(i, 7).setValue("#" + currentRank); // Kolom G (indeks 6)
      currentRank++; // Increment ranking untuk peringkat berikutnya
    } else {
      // Jika total sama, gunakan peringkat yang sama
      sheet.getRange(i, 7).setValue("#" + (currentRank - 1)); // Kolom G (indeks 6)
    }
  }
}

// cetak "-" berstatus "Tidak Lulus"
function markNotPassed(sheet, startRow, totalRows) {
  for (var j = startRow; j < startRow + totalRows; j++) {
    sheet.getRange(j, 7).setValue("-"); // Kolom G (indeks 6)
  }
}
