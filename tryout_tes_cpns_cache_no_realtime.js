// Program ini dioptimasi menggunakan cache dengan maksud agar tidak perlu lagi meng-import data
// 1. karena tidak real time, kita tinggal mengganti url sheet google form (response) soal yang dikerjakan dan nama sheetnya
// 2. mengganti id form soal yang dikerjakan
// 3. membuat google sheet serta app scriptnya lalu tempel codingan ini, tempel url google sheet ini pada google sheet hasil nilai pada codingan ini, serta nama sheetnya

function onFormSubmit() {
  // clear cache sebelum data diambil
  // clearCache();

  // URL dari sheet Google Form
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/1X-8xaJA9le6eSiEyOKISbZwsBvBSyooTUHt8perJayo/edit?gid=145693396#gid=145693396'; 
  var spreadsheet = SpreadsheetApp.openByUrl(sheetUrl); 
  var sheet = spreadsheet.getSheetByName('Form Responses 1'); 

  // Ambil seluruh data dari sheet
  var allResponses = sheet.getDataRange().getValues();
  var record_array = [];

  // Proses setiap baris data mulai dari indeks 1 untuk melewati header
  for (var row = 1; row < allResponses.length; row++) {
    var lastResponse = allResponses[row];
    var nama = lastResponse[2]; // Kolom C

    // Ambil jawaban dari masing-masing kategori
    var jawabanTwk = lastResponse.slice(3, 33).map(res => res ? res : 0);
    var jawabanTiu = lastResponse.slice(33, 68).map(res => res ? res : 0);
    var jawabanTkp = lastResponse.slice(68, 113).map(res => res ? res : 0);

    // id form
    var form = FormApp.openById('1sECxVwp__bTsNTjAfC93bFnWoFpkGFZKhsHI3O3_8nI');

    // --------------------------- Start TWK -------------------------------
    var itemOpsiTwk = getItemOpsiFromCache('twk', form, 3, 33);
    var kunciTwk = kunciJawaban('twk');
    
    var mapNilaiTwk = jawabanTwk.map((opsi, index) => {
      var opsiIndex = itemOpsiTwk[index].indexOf(opsi);
      return opsiIndex === -1 ? 0 : kunciTwk[index][opsiIndex] || 0;
    });
    
    var sumTwk = mapNilaiTwk.reduce((acc, cur) => acc + cur, 0);
    // --------------------------- End TWK ---------------------------------

    // --------------------------- Start TIU -------------------------------
    var itemOpsiTiu = getItemOpsiFromCache('tiu', form, 34, 69);
    var kunciTiu = kunciJawaban('tiu');
    
    var mapNilaiTiu = jawabanTiu.map((opsi, index) => {
      var opsiIndex = itemOpsiTiu[index].indexOf(opsi);
      return opsiIndex === -1 ? 0 : kunciTiu[index][opsiIndex] || 0;
    });
    
    var sumTiu = mapNilaiTiu.reduce((acc, cur) => acc + cur, 0);
    // --------------------------- End TIU ---------------------------------

    // --------------------------- Start TKP -------------------------------
    var itemOpsiTkp = getItemOpsiFromCache('tkp', form, 70, 115);
    var kunciTkp = kunciJawaban('tkp');
    
    var mapNilaiTkp = jawabanTkp.map((opsi, index) => {
      var opsiIndex = itemOpsiTkp[index].indexOf(opsi);
      return opsiIndex === -1 ? 0 : kunciTkp[index][opsiIndex] || 0;
    });
    
    var sumTkp = mapNilaiTkp.reduce((acc, cur) => acc + cur, 0);
    // --------------------------- End TKP ---------------------------------

    var sum = sumTwk + sumTiu + sumTkp;
    var status = (sumTwk >= 65 && sumTiu >= 80 && sumTkp >= 166) ? "Lulus" : "Tidak Lulus";
    
    // Simpan hasil ke dalam array
    record_array.push([nama, sumTwk, sumTiu, sumTkp, sum, status]);
  }

  // URL dari Google Sheet hasil nilai
  var hasilSpreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/14uME_rXeFkUCkB9xqXlVzHQF4zNUtQMCEGwcfWXJ_mk/edit?gid=0#gid=0');
  var hasilSheet = hasilSpreadsheet.getSheetByName('giri krisnadi');
  
  // Tulis semua hasil
  if (record_array.length > 0) {
    var startRow = hasilSheet.getLastRow() + 1;
    hasilSheet.getRange(startRow, 1, record_array.length, record_array[0].length).setValues(record_array);
    hasilSheet.getRange(startRow, 1, record_array.length, record_array[0].length).setHorizontalAlignment("center");
  }
}

// Fungsi untuk mendapatkan opsi item dengan caching
function getItemOpsiFromCache(sheetname, form, startIndex, endIndex) {
  var cache = CacheService.getScriptCache();
  var cacheKey = "itemOpsi_" + sheetname;

  var cachedData = cache.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  } else {
    var itemOpsi = form.getItems().slice(startIndex, endIndex).map((item) => {
      return item.asMultipleChoiceItem().getChoices().map((opsi) => {
        return opsi.getValue();
      });
    });

    cache.put(cacheKey, JSON.stringify(itemOpsi), 21600);
    return itemOpsi;
  }
}

// Fungsi kunci jawaban (dari cache)
function kunciJawaban(sheetname) {
  var cache = CacheService.getScriptCache();
  var cacheKey = "keyAnswers_" + sheetname;

  var cachedData = cache.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  } else {
    var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1WWi3dgR2Wi9vlWYQhhsBqSqbBzVHzR8SOG2JKGgCbxA/edit?gid=0#gid=0');
    var sheet = spreadsheet.getSheetByName(sheetname);
    var dataValues = sheet.getDataRange().getValues();

    cache.put(cacheKey, JSON.stringify(dataValues), 21600);
    return dataValues;
  }
}

function clearCache() {
  var cache = CacheService.getScriptCache();
  cache.remove("itemOpsi_twk");
  cache.remove("itemOpsi_tiu");
  cache.remove("itemOpsi_tkp");
  cache.remove("keyAnswers_twk");
  cache.remove("keyAnswers_tiu");
  cache.remove("keyAnswers_tkp");
}
