// program ini di optimasi menggunakan cache dengan maksud agar tidak perlu lagi meng-import data, tinggal disimpan di cache saja

function onFormSubmit() {
  // clear cache sebelum data diambil,jika ada update-an kunciJawaban dan opsiItem tinggal di clear saja dari pada tunggu 6 jam
  // clearCache();

  record_array = [];
  // url dari sheet google form
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/1X-8xaJA9le6eSiEyOKISbZwsBvBSyooTUHt8perJayo/edit?resourcekey=&gid=145693396#gid=145693396'; 
  var spreadsheet = SpreadsheetApp.openByUrl(sheetUrl); 
  var sheet = spreadsheet.getSheetByName('Form Responses 1'); 

  var lastRow = sheet.getLastRow();
  var lastResponse = sheet.getRange(lastRow, 1, 1, sheet.getLastColumn()).getValues()[0]; 

  var nama = lastResponse[2]; // Kolom C

  // (3, 33) berasal dari kolom sheet google form yaitu nilai twk
  var jawabanTwk = lastResponse.slice(3, 33).map((res) => {
    return res === "" || res === null ? 0 : res;
  });

  // (33, 68) berasal dari kolom sheet google form yaitu nilai tiu
  var jawabanTiu = lastResponse.slice(33, 68).map((res) => {
    return res === "" || res === null ? 0 : res;
  });

  // (68, 113) berasal dari kolom sheet google form yaitu nilai tkp
  var jawabanTkp = lastResponse.slice(68, 113).map((res) => {
    return res === "" || res === null ? 0 : res;
  });

  // id google form berasal dari url nya: https://docs.google.com/forms/d/1jw4ezySWSJS-RPhrWHXDVPkMPwDmRNvq3D6OJish8Sw/edit
  var form = FormApp.openById('1jw4ezySWSJS-RPhrWHXDVPkMPwDmRNvq3D6OJish8Sw');

  // --------------------------- Start TWK -------------------------------
  // (3, 33) berasal dari index item opsi twk pada google form 
  var itemOpsiTwk = getItemOpsiFromCache('twk', form, 3, 33); // Menggunakan cache
  var kunciTwk = kunciJawaban('twk');
  
  var mapNilaiTwk = jawabanTwk.map((opsi, index) => {
    var opsiIndex = itemOpsiTwk[index].indexOf(opsi);
    return opsiIndex === -1 ? 0 : (kunciTwk[index] && kunciTwk[index][opsiIndex] !== undefined ? kunciTwk[index][opsiIndex] : 0);
  });
  
  var sumTwk = mapNilaiTwk.reduce((acc, cur) => acc + cur, 0);
  // --------------------------- End TWK ---------------------------------

  // --------------------------- Start TIU -------------------------------
  // (34, 69) berasal dari index item opsi tiu pada google form
  var itemOpsiTiu = getItemOpsiFromCache('tiu', form, 34, 69); // Menggunakan cache
  var kunciTiu = kunciJawaban('tiu');
  
  var mapNilaiTiu = jawabanTiu.map((opsi, index) => {
    var opsiIndex = itemOpsiTiu[index].indexOf(opsi);
    return opsiIndex === -1 ? 0 : (kunciTiu[index] && kunciTiu[index][opsiIndex] !== undefined ? kunciTiu[index][opsiIndex] : 0);
  });
  
  var sumTiu = mapNilaiTiu.reduce((acc, cur) => acc + cur, 0);
  // --------------------------- End TIU ---------------------------------

  // --------------------------- Start TKP -------------------------------
  // (70, 115) berasal dari index item opsi tkp pada google form
  var itemOpsiTkp = getItemOpsiFromCache('tkp', form, 70, 115); // Menggunakan cache
  var kunciTkp = kunciJawaban('tkp');
  
  var mapNilaiTkp = jawabanTkp.map((opsi, index) => {
    var opsiIndex = itemOpsiTkp[index].indexOf(opsi);
    return opsiIndex === -1 ? 0 : (kunciTkp[index] && kunciTkp[index][opsiIndex] !== undefined ? kunciTkp[index][opsiIndex] : 0);
  });
  
  var sumTkp = mapNilaiTkp.reduce((acc, cur) => acc + cur, 0);
  // --------------------------- End TKP ---------------------------------
  Logger.log("jawaban TKP :" + jawabanTkp);
  Logger.log("item opsi tkp: " + itemOpsiTkp);
  Logger.log("map nilai tkp: " + mapNilaiTkp);
  Logger.log("sum tkp: " + sumTkp);

  var sum = sumTwk + sumTiu + sumTkp;
  var status = (sumTwk >= 65 && sumTiu >= 80 && sumTkp >= 166) ? "Lulus" : "Tidak Lulus";
  record_array.push(nama, sumTwk, sumTiu, sumTkp, sum, status);

  // url dari google sheet hasil nilai
  var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/16odfYHMrf3Rx_2dgEoSK3WGiefJZ7pXNM7Fu3EJvsEY/edit?gid=0#gid=0');
  var sheet = spreadsheet.getSheetByName('tryout1');
  var row = sheet.getLastRow() + 1;
  var valuesToWrite = [record_array];
  sheet.getRange(row, 1, 1, record_array.length).setValues(valuesToWrite);
  sheet.getRange(row, 1, 1, record_array.length).setHorizontalAlignment("center");
}

// Fungsi untuk mendapatkan opsi item dengan caching
function getItemOpsiFromCache(sheetname, form, startIndex, endIndex) {
  var cache = CacheService.getScriptCache();
  var cacheKey = "itemOpsi_" + sheetname;

  var cachedData = cache.get(cacheKey);

  if (cachedData) {
    // Menggunakan data dari cache
    return JSON.parse(cachedData);
  } else {
    // Ambil data dari form
    var itemOpsi = form.getItems().slice(startIndex, endIndex).map((item) => {
      return item.asMultipleChoiceItem().getChoices().map((opsi) => {
        return opsi.getValue();
      });
    });

    // Simpan data baru ke cache dengan key yang unik
    cache.put(cacheKey, JSON.stringify(itemOpsi), 21600); // Simpan selama 6 jam
    return itemOpsi;
  }
}

// Fungsi kunci jawaban (dari cache)
function kunciJawaban(sheetname) {
  var cache = CacheService.getScriptCache();
  var cacheKey = "keyAnswers_" + sheetname;

  var cachedData = cache.get(cacheKey);

  if (cachedData) {
    // Menggunakan data dari cache
    return JSON.parse(cachedData);
  } else {
    // Ambil data dari spreadsheet
    var spreadsheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1WWi3dgR2Wi9vlWYQhhsBqSqbBzVHzR8SOG2JKGgCbxA/edit?gid=0#gid=0');
    var sheet = spreadsheet.getSheetByName(sheetname);
    var dataValues = sheet.getDataRange().getValues();

    // Simpan data baru ke cache dengan key yang unik
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
