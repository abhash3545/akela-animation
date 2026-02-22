var SHEET_NAME = 'akela_rates';
var SPREADSHEET_ID = '12-v235Zp4bSnbJTdXrkKBX2A6KBf6mMmLvX3KIPIhX4';
var REQUIRED_OFFICES = ['giridih', 'deoghar', 'barhi', 'chatra', 'jamua'];

function doGet() {
  var sheet = getRatesSheet_();
  if (!sheet) {
    return jsonResponse({ ok: false, error: 'Sheet not found: ' + SHEET_NAME });
  }

  var payload = readRatesFromSheet_(sheet);
  return jsonResponse({ ok: true, data: payload });
}

function doPost(e) {
  try {
    var body = parsePostBody_(e);
    if (!body || body.action !== 'upsert_rates') {
      return jsonResponse({ ok: false, error: 'Invalid action' });
    }

    var expectedToken = PropertiesService.getScriptProperties().getProperty('ADMIN_API_TOKEN');
    if (!expectedToken) {
      return jsonResponse({ ok: false, error: 'ADMIN_API_TOKEN is not configured in Script Properties' });
    }

    if (String(body.auth_key || '') !== expectedToken) {
      return jsonResponse({ ok: false, error: 'Unauthorized' });
    }

    var data = body.data;
    var validationError = validateRatesPayload_(data);
    if (validationError) {
      return jsonResponse({ ok: false, error: validationError });
    }

    var sheet = getRatesSheet_();
    if (!sheet) {
      return jsonResponse({ ok: false, error: 'Sheet not found: ' + SHEET_NAME });
    }

    writeRatesToSheet_(sheet, data);
    return jsonResponse({ ok: true, message: 'Rates updated' });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function getRatesSheet_() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(SHEET_NAME);
}

function readRatesFromSheet_(sheet) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) {
    return { rate_board_date: '', offices: {} };
  }

  var headers = values[0].map(function (h) {
    return String(h).trim();
  });

  var rows = values.slice(1);
  var offices = {};
  var rateBoardDate = '';

  rows.forEach(function (row) {
    if (!row || row.length === 0) return;

    var rowObj = {};
    headers.forEach(function (header, idx) {
      rowObj[header] = row[idx];
    });

    var office = String(rowObj.office || '').trim().toLowerCase();
    if (!office) return;

    if (!rateBoardDate) {
      rateBoardDate = normalizeDate_(rowObj.rate_board_date);
    }

    offices[office] = {
      chota_per_kg: String(rowObj.chota_per_kg || '').trim(),
      mota_per_kg: String(rowObj.mota_per_kg || '').trim(),
      chicks_per_piece: String(rowObj.chicks_per_piece || '').trim()
    };
  });

  return {
    rate_board_date: rateBoardDate,
    offices: offices
  };
}

function writeRatesToSheet_(sheet, data) {
  var header = ['rate_board_date', 'office', 'chota_per_kg', 'mota_per_kg', 'chicks_per_piece'];
  var rows = [header];

  REQUIRED_OFFICES.forEach(function (office) {
    var o = data.offices[office];
    rows.push([
      String(data.rate_board_date || '').trim(),
      office,
      String(o.chota_per_kg || '').trim(),
      String(o.mota_per_kg || '').trim(),
      String(o.chicks_per_piece || '').trim()
    ]);
  });

  sheet.clearContents();
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
}

function validateRatesPayload_(data) {
  if (!data || typeof data !== 'object') return 'Missing data payload';

  var dateText = String(data.rate_board_date || '').trim();
  if (!/^\d{6}$/.test(dateText)) {
    return 'rate_board_date must be in ddmmyy format';
  }

  if (!parseDdMmYyToIso_(dateText)) {
    return 'rate_board_date is invalid';
  }

  if (!data.offices || typeof data.offices !== 'object') {
    return 'offices object is missing';
  }

  for (var i = 0; i < REQUIRED_OFFICES.length; i += 1) {
    var office = REQUIRED_OFFICES[i];
    var o = data.offices[office];
    if (!o || typeof o !== 'object') return 'Missing office: ' + office;

    if (!String(o.chota_per_kg || '').trim()) return 'Missing chota_per_kg for ' + office;
    if (!String(o.mota_per_kg || '').trim()) return 'Missing mota_per_kg for ' + office;
    if (!String(o.chicks_per_piece || '').trim()) return 'Missing chicks_per_piece for ' + office;
  }

  return '';
}

function parsePostBody_(e) {
  if (!e || !e.postData || !e.postData.contents) return null;
  return JSON.parse(e.postData.contents);
}

function normalizeDate_(value) {
  if (!value) return '';

  if (Object.prototype.toString.call(value) === '[object Date]') {
    var ddmmyy = Utilities.formatDate(value, Session.getScriptTimeZone(), 'ddMMyy');
    return parseDdMmYyToIso_(ddmmyy);
  }

  var text = String(value).trim().replace(/\D/g, '');
  if (!text) return '';
  if (text.length < 6) {
    text = text.padStart(6, '0');
  }
  if (text.length !== 6) return '';
  return parseDdMmYyToIso_(text);
}

function parseDdMmYyToIso_(ddmmyy) {
  var m = /^(\d{2})(\d{2})(\d{2})$/.exec(String(ddmmyy || '').trim());
  if (!m) return '';

  var day = parseInt(m[1], 10);
  var month = parseInt(m[2], 10);
  var year = 2000 + parseInt(m[3], 10);
  if (month < 1 || month > 12 || day < 1 || day > 31) return '';

  var dt = new Date(Date.UTC(year, month - 1, day));
  if (dt.getUTCFullYear() !== year || (dt.getUTCMonth() + 1) !== month || dt.getUTCDate() !== day) {
    return '';
  }

  var mm = month < 10 ? '0' + month : String(month);
  var dd = day < 10 ? '0' + day : String(day);
  return year + '-' + mm + '-' + dd;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


