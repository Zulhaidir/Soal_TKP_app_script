function myFunction() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Pastikan kita hanya beroperasi pada sheet tertentu
  if (sheet.getName() !== "tryout1") return; // Ganti dengan nama sheet Anda jika diperlukan

  var range = sheet.getDataRange(); // Mengambil semua data
  var values = range.getValues(); // Mengambil nilai dalam bentuk array 2D

  // Memisahkan data berdasarkan status
  var lulusRows = [];
  var tidakLulusRows = [];

  for (var i = 1; i < values.length; i++) { // Mulai dari 1 untuk menghindari header
    if (values[i][5] === "Lulus") { // Kolom Status (indeks 5)
      lulusRows.push(values[i]);
    } else if (values[i][5] === "Tidak Lulus") {
      tidakLulusRows.push(values[i]);
    }
  }

  // Menyortir baris "Lulus"
  lulusRows.sort(function(a, b) {
    if (b[4] !== a[4]) return b[4] - a[4]; // Sort by total
    if (b[3] !== a[3]) return b[3] - a[3]; // Sort by TKP
    if (b[2] !== a[2]) return b[2] - a[2]; // Sort by TIU
    return b[1] - a[1]; // Finally, sort by TWK
  });

  // Menyortir baris "Tidak Lulus" berdasarkan total
  tidakLulusRows.sort(function(a, b) {
    return b[4] - a[4]; // Sort by total (kolom E)
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

// Fungsi untuk menyusun peringkat
function setRanking(sheet, startRow, totalRows) {
  var lastTotal = null; // Untuk menyimpan total terakhir
  var lastTKP = null; // Untuk menyimpan TKP terakhir
  var lastTIU = null; // Untuk menyimpan TIU terakhir
  var lastTWK = null; // Untuk menyimpan TWK terakhir
  var rank = 1; // Peringkat awal

  for (var i = startRow; i < startRow + totalRows; i++) {
    var currentTotal = sheet.getRange(i, 5).getValue(); // Kolom E (Total, indeks 4)
    var currentTKP = sheet.getRange(i, 4).getValue(); // Kolom D (TKP, indeks 3)
    var currentTIU = sheet.getRange(i, 3).getValue(); // Kolom C (TIU, indeks 2)
    var currentTWK = sheet.getRange(i, 2).getValue(); // Kolom B (TWK, indeks 1)

    // Jika ini adalah baris pertama atau total berbeda
    if (lastTotal === null || currentTotal !== lastTotal || currentTKP !== lastTKP || currentTIU !== lastTIU || currentTWK !== lastTWK) {
      sheet.getRange(i, 7).setValue("#" + rank); // Kolom G (indeks 6)
      lastTotal = currentTotal; // Update total terakhir
      lastTKP = currentTKP; // Update TKP terakhir
      lastTIU = currentTIU; // Update TIU terakhir
      lastTWK = currentTWK; // Update TWK terakhir
      rank++; // Increment ranking untuk peringkat berikutnya
    } else {
      // Jika semua nilai sama, gunakan peringkat yang sama
      sheet.getRange(i, 7).setValue("#" + (rank - 1)); // Kolom G (indeks 6)
    }
  }
}

// Cetak "-" Total berstatus "Tidak Lulus"
function markNotPassed(sheet, startRow, totalRows) {
  for (var j = startRow; j < startRow + totalRows; j++) {
    sheet.getRange(j, 7).setValue("-"); // Kolom G (indeks 6)
  }
}
