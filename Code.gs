/**
 * ============================================================================
 * GRANDIS TECHNOLOGY Pvt. Ltd. - R&D Department
 * QC (Quality Check) Result Management System - Backend Engine (Google Apps Script)
 * ============================================================================
 * Instructions:
 * 1. Deploy as a Web App:
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone"
 * 2. Set FOLDER_ID to the Google Drive folder where QC spreadsheets are stored.
 * 3. Run the setup() function once from the Apps Script editor to initialize sheets.
 *    (Existing student data and batch tabs are NEVER deleted or overwritten).
 */

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================
var FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE";
var ADMIN_PASSWORD = "grandis@rnd2026";
var BOOK_NAME = "QC_DATA";

// Default settings JSON (1ST QC theory pass mark = 20 by default)
var DEFAULT_SETTINGS_JSON = JSON.stringify({
  lists: {
    branches: ["Thodupuzha", "Chennai", "Ernakulam", "Calicut"],
    batches: ["Batch 21", "Batch 22", "Batch 23", "Batch 24", "Batch 25"],
    faculty: ["Mr. Anand Kumar", "Mr. Rajesh S", "Mr. Senthil Nathan", "Ms. Priya V"],
    incharge: ["Mr. Vignesh R", "Mr. Suresh K", "Mr. Arun P"],
    hof: ["Dr. K. R. Sharma (Head of R&D)", "Mr. P. V. Nair (Director - Technical)"],
    assessors: [
      "R&D Quality Team",
      "Er. Gokul / Er. Nithin",
      "Senior QC Inspector",
      "QC Evaluation Panel"
    ]
  },
  qcs: {
    "1ST QC": {
      name: "FIRST QC",
      key: "1ST QC",
      title: "First Term Quality Checking Evaluation Result",
      reportTitle: "FIRST TERM QUALITY CHECKING",
      idLabel: "GID",
      hasSn: false,
      sections: [
        {
          name: "Theory",
          passMark: 20, // 1ST QC theory pass mark = 20 by default
          parts: [
            { name: "Identification", max: 8 },
            { name: "Checking", max: 8 },
            { name: "Multimeter", max: 8 },
            { name: "Logic", max: 8 }
          ]
        },
        {
          name: "Practical",
          passMark: 18,
          parts: [
            { name: "JUM/COM", max: 8 },
            { name: "Connector", max: 8 },
            { name: "IC", max: 8 }
          ]
        }
      ],
      overall: {
        rule: "SECTIONS_PASS",
        max: 56,
        labelType: "Grade",
        ranges: [
          { min: 48, label: "A" },
          { min: 40, label: "B" },
          { min: 0, label: "C" }
        ]
      }
    },
    "2ND QC": {
      name: "SECOND QC",
      key: "2ND QC",
      title: "Second Term Quality Checking Evaluation Result",
      reportTitle: "SECOND TERM QUALITY CHECKING",
      idLabel: "GID",
      hasSn: false,
      sections: [
        {
          name: "Theory",
          passMark: 30,
          parts: [
            { name: "Identification", max: 8 },
            { name: "Checking", max: 8 },
            { name: "Multimeter", max: 8 },
            { name: "IC & Sections", max: 8 },
            { name: "Logic", max: 8 }
          ]
        },
        {
          name: "Practical",
          passMark: 18,
          parts: [
            { name: "Jumb&Combo", max: 8 },
            { name: "Connector", max: 8 },
            { name: "IC", max: 8 }
          ]
        }
      ],
      overall: {
        rule: "SECTIONS_PASS",
        max: 64,
        labelType: "Grade",
        ranges: [
          { min: 50, label: "A" },
          { min: 40, label: "B" },
          { min: 0, label: "C" }
        ]
      }
    },
    "SOFTWARE QC": {
      name: "SOFTWARE QC",
      key: "SOFTWARE QC",
      title: "Software Quality Checking Evaluation Result",
      reportTitle: "SOFTWARE QUALITY CHECKING",
      idLabel: "GID",
      hasSn: true,
      sections: [
        {
          name: "Practical",
          passMark: null,
          parts: [
            { name: "Unlocking / FRP", max: 8 },
            { name: "Flashing", max: 8 },
            { name: "Reprogramming", max: 8 }
          ]
        },
        {
          name: "Theory",
          passMark: null,
          parts: [
            { name: "Theory", max: 8 }
          ]
        }
      ],
      overall: {
        rule: "TOTAL_PASS",
        passMark: 24,
        max: 32,
        labelType: "Category",
        columnHeaders: ["Score", "Pass/Fail", "Category"],
        ranges: [
          { min: 28, label: "A" },
          { min: 24, label: "B" },
          { min: 16, label: "C" },
          { min: 0, label: "D" }
        ]
      }
    },
    "CMT QC": {
      name: "CMT QC",
      key: "CMT QC",
      title: "CMT QC",
      reportTitle: "CMT QUALITY CHECKING",
      idLabel: "GID",
      hasSn: false,
      sections: [
        {
          name: "CMT Modules & Practical",
          passMark: null,
          parts: [
            { name: "1st QC", max: 8 },
            { name: "2nd Module", max: 8 },
            { name: "3rd Module", max: 8 },
            { name: "4th Module", max: 8 },
            { name: "Practical", max: 8 }
          ]
        }
      ],
      overall: {
        rule: "TOTAL_PASS",
        passMark: 30,
        max: 40,
        labelType: "Level",
        columnHeaders: ["Total", "Level", "Pass/Fail"],
        ranges: [
          { min: 36, label: "Level 3" },
          { min: 30, label: "Level 2" },
          { min: 20, label: "Level 1" },
          { min: 0, label: "Level 0" }
        ]
      }
    },
    "FINAL QC": {
      name: "FINAL QC",
      key: "FINAL QC",
      title: "Final QC Report",
      reportTitle: "FINAL QUALITY CHECKING",
      idLabel: "MID / GID",
      hasSn: false,
      sections: [
        {
          name: "Theory",
          passMark: 36,
          parts: [
            { name: "Identification", max: 8 },
            { name: "Checking", max: 8 },
            { name: "Multimeter", max: 8 },
            { name: "DC & AMP", max: 8 },
            { name: "Troubleshooting", max: 8 },
            { name: "Software", max: 8 }
          ]
        },
        {
          name: "Practical",
          passMark: 24,
          parts: [
            { name: "Component / Jumper", max: 8 },
            { name: "Connector", max: 8 },
            { name: "IC", max: 8 },
            { name: "OCA", max: 8 }
          ]
        }
      ],
      overall: {
        rule: "SECTIONS_PASS",
        max: 80,
        labelType: "Level",
        ranges: [
          { min: 72, label: "Level 3" },
          { min: 60, label: "Level 2" },
          { min: 40, label: "Level 1" },
          { min: 0, label: "Level 0" }
        ]
      }
    }
  }
});

// Default Branches List
var DEFAULT_BRANCHES_DATA = [
  ["Thodupuzha", "THDPZ", "", "Yes"],
  ["Chennai", "CHN", "", "Yes"],
  ["Ernakulam", "EKM", "", "Yes"],
  ["Calicut", "CLT", "", "Yes"]
];

// ============================================================================
// SYSTEM SETUP FUNCTION (Safe: Preserves existing student data and batch tabs)
// ============================================================================
function setup() {
  var folder;
  try {
    folder = DriveApp.getFolderById(FOLDER_ID);
  } catch (e) {
    folder = DriveApp.getRootFolder();
  }

  // Find or create QC_DATA spreadsheet
  var files = folder.getFilesByName(BOOK_NAME);
  var ss;
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    ss = SpreadsheetApp.create(BOOK_NAME);
    var file = DriveApp.getFileById(ss.getId());
    file.moveTo(folder);
  }

  // 1. Setup 'Settings' sheet (Tabular pass marks with dynamic formulas support)
  setupSettingsSheet(ss);

  // 2. Setup 'Branches' sheet (Branch Name, Code, Sheet Link, Active)
  setupBranchesSheet(ss);

  // 3. Setup 'Students' sheet (Preserves existing data!)
  setupStudentsSheet(ss);

  // Remove default blank "Sheet1" if redundant
  var sheet1 = ss.getSheetByName("Sheet1");
  if (sheet1 && ss.getSheets().length > 1) {
    try { ss.deleteSheet(sheet1); } catch (e) {}
  }

  Logger.log("QC System initialized successfully. Spreadsheet ID: " + ss.getId());
  return ss.getId();
}

/**
 * Creates / updates the tabular 'Settings' sheet.
 * Stores one row per QC type with Theory Pass Mark, Practical Pass Mark, Overall Pass Mark.
 * Batch sheet formulas reference these cells directly via VLOOKUP!
 */
function setupSettingsSheet(ss) {
  var sheet = ss.getSheetByName("Settings");
  if (!sheet) {
    sheet = ss.insertSheet("Settings");
  }

  // Check if table headers already exist
  var existingVal = sheet.getRange("A1").getValue();
  if (existingVal !== "QC Type") {
    sheet.clear();
    var headers = [
      "QC Type", "QC Full Name", "Theory Pass Mark", "Practical Pass Mark", "Overall Pass Mark", "Max Marks", "Passing Rule"
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold").setBackground("#ebebeb");

    var settingsRows = [
      ["1ST QC", "First Term Quality Checking Evaluation Result", 20, 18, "NA", 56, "SECTIONS_PASS"],
      ["2ND QC", "Second Term Quality Checking Evaluation Result", 30, 18, "NA", 64, "SECTIONS_PASS"],
      ["CMT QC", "CMT QC", "NA", "NA", 30, 40, "TOTAL_PASS"],
      ["SOFTWARE QC", "Software Quality Checking Evaluation Result", "NA", "NA", 24, 32, "TOTAL_PASS"],
      ["FINAL QC", "Final QC Report", 36, 24, "NA", 80, "SECTIONS_PASS"]
    ];

    sheet.getRange(2, 1, settingsRows.length, headers.length).setValues(settingsRows);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);

    // Store backup full JSON in cell Z1
    sheet.getRange("Z1").setValue(DEFAULT_SETTINGS_JSON);
  }
}

/**
 * Creates / updates the 'Branches' sheet.
 * Columns: Branch Name, Branch Code, Workbook/Sheet link, Active (Yes/No)
 */
function setupBranchesSheet(ss) {
  var sheet = ss.getSheetByName("Branches");
  if (!sheet) {
    sheet = ss.insertSheet("Branches");
    var headers = ["Branch Name", "Branch Code", "Workbook/Sheet link", "Active (Yes/No)"];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold").setBackground("#ebebeb");

    var rows = DEFAULT_BRANCHES_DATA.map(function(item) {
      return [item[0], item[1], ss.getUrl(), item[3]];
    });
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
}

/**
 * Creates 'Students' sheet if missing without altering existing records.
 */
function setupStudentsSheet(ss) {
  var sheet = ss.getSheetByName("Students");
  if (!sheet) {
    sheet = ss.insertSheet("Students");
    sheet.appendRow([
      "GID", "Name", "Branch", "Batch", "Faculty", "Module", "Admission No", "Status"
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#f3f3f3");

    // Add demo entries only on fresh install
    sheet.appendRow(["DEMO1001", "Anjali S", "Thodupuzha", "Batch 24", "Mr. Anand Kumar", "Module 1", "ADM-001", "Active"]);
    sheet.appendRow(["DEMO1002", "Rahul M", "Thodupuzha", "Batch 24", "Mr. Anand Kumar", "Module 1", "ADM-002", "Active"]);
    sheet.appendRow(["DEMO1003", "Gokul Krishnan", "Thodupuzha", "Batch 24", "Mr. Anand Kumar", "Module 1", "ADM-003", "Active"]);
    sheet.setFrozenRows(1);
  }
}

// ============================================================================
// WEB APP REQUEST DISPATCHER (doGet & doPost)
// ============================================================================
function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  var action = (p.action || "").trim();

  try {
    // 1. PUBLIC: Student Login
    if (action === "login" || action === "studentGetResult") {
      return jsonResponse(handleStudentLogin(p));
    }

    // 2. PUBLIC: Batches list (always real-time fresh query)
    if (action === "batches" || action === "listBatches") {
      return jsonResponse(handleGetBatches(p));
    }

    // 3. PUBLIC: Active Branches list
    if (action === "branches") {
      return jsonResponse(handleGetBranchesPublic());
    }

    // 4. PUBLIC: Settings / Pass marks query
    if (action === "getSettings") {
      return jsonResponse({ ok: true, settings: getStoredSettings() });
    }

    // 5. STAFF: Load system data (requires staff password)
    if (action === "load") {
      if ((p.password || "").trim() !== ADMIN_PASSWORD) {
        return jsonResponse({ ok: false, error: "Unauthorized. Invalid staff password." });
      }
      return jsonResponse(handleStaffLoad());
    }

    return jsonResponse({ ok: false, error: "Unknown action specified: " + action });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (lockErr) {
    return jsonResponse({ ok: false, error: "Server busy. Please try again in a few seconds." });
  }

  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "";
    var body = {};
    if (raw) {
      try { body = JSON.parse(raw); } catch (ex) { body = {}; }
    }

    var password = (body.password || (e && e.parameter ? e.parameter.password : "") || "").trim();
    if (password !== ADMIN_PASSWORD) {
      return jsonResponse({ ok: false, error: "Unauthorized. Invalid staff password." });
    }

    var action = (body.action || (e && e.parameter ? e.parameter.action : "") || "").trim();

    if (action === "saveBatch") {
      return jsonResponse(handleSaveBatch(body.batchData));
    }
    if (action === "deleteBatch") {
      return jsonResponse(handleDeleteBatch(body));
    }
    if (action === "saveStudents") {
      return jsonResponse(handleSaveStudents(body.students));
    }
    if (action === "saveConfig") {
      return jsonResponse(handleSaveConfig(body.config));
    }
    if (action === "saveBranches") {
      return jsonResponse(handleSaveBranches(body.branches));
    }
    if (action === "addBranch") {
      return jsonResponse(handleAddBranch(body.branchData));
    }
    if (action === "saveSettingsTable") {
      return jsonResponse(handleSaveSettingsTable(body.tableRows));
    }

    return jsonResponse({ ok: false, error: "Unknown POST action: " + action });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================================
// PUBLIC ACTION: STUDENT LOGIN (Drive Folder Recursive Scanner)
// ============================================================================
function handleStudentLogin(p) {
  var branch = (p.branch || "").trim();
  var qc = (p.qc || "").trim().toUpperCase();
  var batch = (p.batch || "").trim();
  var gid = (p.gid || "").trim().toUpperCase();
  var password = (p.password || "").trim();

  if (!gid) return { ok: false, error: "GID number is required." };
  if (!password) return { ok: false, error: "Password is required." };
  if (password.toUpperCase() !== gid) {
    return { ok: false, error: "Invalid password. Your password is your GID number." };
  }

  var settings = getStoredSettings();
  var qcDef = settings.qcs[qc] || settings.qcs["1ST QC"];

  var folder;
  try {
    folder = DriveApp.getFolderById(FOLDER_ID);
  } catch (e) {
    folder = DriveApp.getRootFolder();
  }

  // Scan all Google Spreadsheets in folder and subfolders
  var allSheets = getAllSpreadsheetsRecursive(folder);
  var matchingResults = [];

  for (var i = 0; i < allSheets.length; i++) {
    var ss = allSheets[i].spreadsheet;
    var fileName = allSheets[i].fileName;
    var tabs = ss.getSheets();

    for (var t = 0; t < tabs.length; t++) {
      var sheet = tabs[t];
      var sheetName = sheet.getName();
      if (sheetName === "Students" || sheetName === "Settings" || sheetName === "Branches" || sheetName === "How to use") continue;

      var parsed = parseSheetDataGeneric(sheet, fileName, settings);
      if (!parsed) continue;

      var branchMatches = matchBranch(parsed.info.branch, fileName, branch);
      var qcMatches = !qc || (parsed.qcType || "").toUpperCase() === qc;
      var batchMatches = !batch || batch.toLowerCase() === "(all batches)" || (parsed.info.batch || "").toLowerCase() === batch.toLowerCase();

      if (branchMatches && qcMatches && batchMatches) {
        var studentRow = parsed.rows.find(function(r) {
          return (r.gid || "").trim().toUpperCase() === gid;
        });

        if (studentRow) {
          matchingResults.push({
            info: parsed.info,
            row: {
              gid: studentRow.gid,
              name: studentRow.name,
              m: studentRow.marks,
              remarks: studentRow.remarks || ""
            }
          });
        }
      }
    }
  }

  if (matchingResults.length === 0) {
    return {
      ok: false,
      error: "No verified result found for GID " + gid + " in " + qc + " (" + (branch || "Selected Branch") + ")."
    };
  }

  return {
    ok: true,
    q: qcDef,
    results: matchingResults
  };
}

// ============================================================================
// PUBLIC ACTION: BATCH LIST (Real-time live query from Google Sheets)
// ============================================================================
function handleGetBatches(p) {
  var branch = (p.branch || "").trim().toLowerCase();
  var qc = (p.qc || "").trim().toUpperCase();

  var folder;
  try {
    folder = DriveApp.getFolderById(FOLDER_ID);
  } catch (e) {
    folder = DriveApp.getRootFolder();
  }

  var allSheets = getAllSpreadsheetsRecursive(folder);
  var settings = getStoredSettings();
  var batchList = [];

  for (var i = 0; i < allSheets.length; i++) {
    var ss = allSheets[i].spreadsheet;
    var fileName = allSheets[i].fileName;
    var tabs = ss.getSheets();

    for (var t = 0; t < tabs.length; t++) {
      var sheet = tabs[t];
      var sheetName = sheet.getName();
      if (sheetName === "Students" || sheetName === "Settings" || sheetName === "Branches" || sheetName === "How to use") continue;

      var parsed = parseSheetDataGeneric(sheet, fileName, settings);
      if (parsed && parsed.info.batch) {
        var matchBr = !branch || matchBranch(parsed.info.branch, fileName, branch);
        var matchQ = !qc || (parsed.qcType || "").toUpperCase() === qc;
        if (matchBr && matchQ && parsed.info.batch) {
          batchList.push(parsed.info.batch);
        }
      }
    }
  }

  var unique = [];
  batchList.forEach(function(b) {
    if (unique.indexOf(b) === -1) unique.push(b);
  });
  unique.sort();

  return { ok: true, batches: unique };
}

// PUBLIC: Get active branches list
function handleGetBranchesPublic() {
  var ss = getQCDataSpreadsheet();
  var sheet = ss.getSheetByName("Branches");
  if (!sheet) {
    return { ok: true, branches: ["Thodupuzha", "Chennai", "Ernakulam", "Calicut"] };
  }

  var data = sheet.getDataRange().getValues();
  var activeBranches = [];
  for (var i = 1; i < data.length; i++) {
    var bName = String(data[i][0] || "").trim();
    var bActive = String(data[i][3] || "").trim().toLowerCase();
    if (bName && (bActive === "yes" || bActive === "true" || bActive === "1")) {
      activeBranches.push(bName);
    }
  }

  if (activeBranches.length === 0) {
    activeBranches = ["Thodupuzha", "Chennai"];
  }

  return { ok: true, branches: activeBranches };
}

// Branch matching helper
function matchBranch(cellBranch, fileName, requestedBranch) {
  if (!requestedBranch) return true;
  var req = requestedBranch.toLowerCase();
  var cell = (cellBranch || "").toLowerCase();
  var file = (fileName || "").toLowerCase();

  if (cell.indexOf(req) !== -1 || req.indexOf(cell) !== -1) return true;
  if (file.indexOf(req) !== -1) return true;

  if (req.indexOf("thodu") !== -1 && (file.indexOf("thdpz") !== -1 || cell.indexOf("thdpz") !== -1)) return true;
  if (req.indexOf("chennai") !== -1 && (file.indexOf("chn") !== -1 || cell.indexOf("chn") !== -1)) return true;
  if (req.indexOf("ernakulam") !== -1 && (file.indexOf("ekm") !== -1 || cell.indexOf("ekm") !== -1)) return true;
  if (req.indexOf("calicut") !== -1 && (file.indexOf("clt") !== -1 || cell.indexOf("clt") !== -1)) return true;

  return false;
}

// Recursively retrieve all Google Sheets in folder and subfolders
function getAllSpreadsheetsRecursive(folder) {
  var list = [];
  var files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
  while (files.hasNext()) {
    var f = files.next();
    try {
      list.push({ spreadsheet: SpreadsheetApp.open(f), fileName: f.getName() });
    } catch (e) {}
  }

  var subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    var sf = subfolders.next();
    list = list.concat(getAllSpreadsheetsRecursive(sf));
  }
  return list;
}

// ============================================================================
// GENERIC SHEET PARSER: Robust layout detection, column count mapping
// ============================================================================
function parseSheetDataGeneric(sheet, fileName, settings) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 5 || lastCol < 3) return null;

  var rangeValues = sheet.getRange(1, 1, Math.min(lastRow, 150), lastCol).getValues();

  var headerRowIdx = -1;
  var idColIdx = -1;
  var nameColIdx = -1;

  for (var r = 0; r < Math.min(rangeValues.length, 25); r++) {
    for (var c = 0; c < rangeValues[r].length; c++) {
      var cellVal = String(rangeValues[r][c] || "").trim().toLowerCase();
      if (cellVal === "gid" || cellVal === "mid / gid" || cellVal === "mid/gid" || cellVal === "mid" || cellVal.indexOf("gid") !== -1) {
        headerRowIdx = r;
        idColIdx = c;
        break;
      }
    }
    if (headerRowIdx !== -1) break;
  }

  if (headerRowIdx === -1) return null;

  var headerRow = rangeValues[headerRowIdx];
  for (var c = 0; c < headerRow.length; c++) {
    var val = String(headerRow[c] || "").trim().toLowerCase();
    if (val.indexOf("name") !== -1 || val.indexOf("student") !== -1) {
      nameColIdx = c;
      break;
    }
  }
  if (nameColIdx === -1) nameColIdx = idColIdx + 1;

  var info = extractBatchInfo(rangeValues, headerRowIdx, fileName);

  var markColIndices = [];
  var computedKeywords = ["score", "pass", "total", "grade", "level", "category", "overall", "result", "remarks", "sn", "mid", "gid", "name"];

  for (var c = nameColIdx + 1; c < headerRow.length; c++) {
    var hName = String(headerRow[c] || "").trim().toLowerCase();
    if (!hName) continue;

    var isComputed = false;
    for (var k = 0; k < computedKeywords.length; k++) {
      if (hName.indexOf(computedKeywords[k]) !== -1) {
        isComputed = true;
        break;
      }
    }

    if (!isComputed) {
      markColIndices.push({ idx: c, name: String(headerRow[c] || "").trim() });
    }
  }

  var qcType = detectQCType(info.title, fileName, markColIndices.length, settings);

  var rows = [];
  for (var r = headerRowIdx + 1; r < rangeValues.length; r++) {
    var row = rangeValues[r];
    var gidVal = String(row[idColIdx] || "").trim();
    if (!gidVal) continue;

    var nameVal = String(row[nameColIdx] || "").trim();
    var marksObj = {};

    markColIndices.forEach(function(mCol) {
      var rawMark = row[mCol.idx];
      if (rawMark !== undefined && rawMark !== null && String(rawMark).trim() !== "") {
        marksObj[mCol.name] = Number(rawMark);
      }
    });

    rows.push({
      gid: gidVal,
      name: nameVal,
      marks: marksObj,
      remarks: String(row[row.length - 1] || "").trim()
    });
  }

  return {
    qcType: qcType,
    info: info,
    rows: rows
  };
}

function extractBatchInfo(values, headerRowIdx, fileName) {
  var info = {
    title: "",
    branch: "",
    batch: "",
    qcDate: "",
    faculty: "",
    incharge: "",
    hof: "",
    assessors: "",
    strength: ""
  };

  for (var r = 0; r < headerRowIdx; r++) {
    for (var c = 0; c < values[r].length; c++) {
      var val = String(values[r][c] || "").trim();
      var nextVal = (c + 1 < values[r].length) ? String(values[r][c + 1] || "").trim() : "";
      var lower = val.toLowerCase();

      if (lower.indexOf("quality check") !== -1 || lower.indexOf("qc report") !== -1 || lower.indexOf("term quality") !== -1) {
        if (!info.title) info.title = val;
      }
      if (lower === "branch" || lower === "branch:") {
        info.branch = nextVal || info.branch;
      }
      if (lower === "batch" || lower === "batch:") {
        info.batch = nextVal || info.batch;
      }
      if (lower === "qc date" || lower === "date" || lower === "date:") {
        info.qcDate = nextVal || info.qcDate;
      }
      if (lower === "faculty" || lower === "faculty incharge") {
        info.faculty = nextVal || info.faculty;
      }
      if (lower === "module incharge" || lower === "incharge") {
        info.incharge = nextVal || info.incharge;
      }
      if (lower === "hof" || lower === "head of faculty") {
        info.hof = nextVal || info.hof;
      }
      if (lower === "qc assessors" || lower === "assessor" || lower === "assessors") {
        info.assessors = nextVal || info.assessors;
      }
      if (lower === "batch strength" || lower === "strength") {
        info.strength = nextVal || info.strength;
      }
    }
  }

  var fnLower = fileName.toLowerCase();
  if (!info.branch) {
    if (fnLower.indexOf("thdpz") !== -1 || fnLower.indexOf("thodupuzha") !== -1) info.branch = "Thodupuzha";
    else if (fnLower.indexOf("chn") !== -1 || fnLower.indexOf("chennai") !== -1) info.branch = "Chennai";
    else if (fnLower.indexOf("ekm") !== -1 || fnLower.indexOf("ernakulam") !== -1) info.branch = "Ernakulam";
    else if (fnLower.indexOf("clt") !== -1 || fnLower.indexOf("calicut") !== -1) info.branch = "Calicut";
  }

  return info;
}

function detectQCType(title, fileName, markCount, settings) {
  var t = (title + " " + fileName).toLowerCase();
  if (t.indexOf("cmt") !== -1) return "CMT QC";
  if (t.indexOf("soft") !== -1) return "SOFTWARE QC";
  if (t.indexOf("final") !== -1) return "FINAL QC";
  if (t.indexOf("2nd") !== -1 || t.indexOf("second") !== -1) return "2ND QC";
  if (t.indexOf("1st") !== -1 || t.indexOf("first") !== -1) return "1ST QC";

  if (markCount === 7) return "1ST QC";
  if (markCount === 8) return "2ND QC";
  if (markCount === 4) return "SOFTWARE QC";
  if (markCount === 5) return "CMT QC";
  if (markCount === 10) return "FINAL QC";

  return "1ST QC";
}

// ============================================================================
// STAFF ACTIONS: LOAD, SAVE BATCH, BRANCHES & SETTINGS TABLE
// ============================================================================
function handleStaffLoad() {
  var ss = getQCDataSpreadsheet();
  var settings = getStoredSettings();

  // Load students
  var studentsSheet = ss.getSheetByName("Students");
  var students = [];
  if (studentsSheet) {
    var data = studentsSheet.getDataRange().getValues();
    data.slice(1).forEach(function(r) {
      if (r[0]) {
        students.push({
          gid: String(r[0] || "").trim(),
          name: String(r[1] || "").trim(),
          branch: String(r[2] || "").trim(),
          batch: String(r[3] || "").trim(),
          faculty: String(r[4] || "").trim(),
          module: String(r[5] || "").trim(),
          admNo: String(r[6] || "").trim(),
          status: String(r[7] || "Active").trim()
        });
      }
    });
  }

  // Load branches
  var branchesSheet = ss.getSheetByName("Branches");
  var branches = [];
  if (branchesSheet) {
    var bData = branchesSheet.getDataRange().getValues();
    bData.slice(1).forEach(function(r) {
      if (r[0]) {
        branches.push({
          name: String(r[0] || "").trim(),
          code: String(r[1] || "").trim(),
          link: String(r[2] || "").trim(),
          active: String(r[3] || "Yes").trim()
        });
      }
    });
  }

  // Load saved batches
  var sheets = ss.getSheets();
  var batches = [];
  sheets.forEach(function(s) {
    var name = s.getName();
    if (name !== "Students" && name !== "Settings" && name !== "Branches") {
      batches.push({ tabName: name });
    }
  });

  return {
    ok: true,
    settings: settings,
    students: students,
    branches: branches,
    batches: batches
  };
}

/**
 * Saves or creates a batch mark entry sheet.
 * Adds real spreadsheet formulas referencing Settings!$A$2:$G$6 via VLOOKUP
 * so pass/fail status updates dynamically if pass marks are edited in Settings!
 */
function handleSaveBatch(batchData) {
  if (!batchData || !batchData.info) {
    return { ok: false, error: "Missing batch data." };
  }

  var info = batchData.info;
  var qcType = (info.qcType || "1ST QC").toUpperCase();
  var branch = (info.branch || "General").trim();
  var batch = (info.batch || "Batch").trim();
  var tabName = (qcType + "_" + branch + "_" + batch).replace(/[\/\\?*:[\]]/g, "_").substring(0, 30);

  var ss = getQCDataSpreadsheet();
  var sheet = ss.getSheetByName(tabName);
  if (sheet) {
    sheet.clear();
  } else {
    sheet = ss.insertSheet(tabName);
  }

  var settings = getStoredSettings();
  var qcDef = settings.qcs[qcType] || settings.qcs["1ST QC"];

  // 1. Title Row A1
  sheet.getRange("A1").setValue(qcDef.title.toUpperCase()).setFontWeight("bold").setFontSize(14);

  // 2. Rows 2-9 Info Block
  var infoRows = [
    ["QC Type", qcType],
    ["QC Date", info.qcDate || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd")],
    ["Faculty", info.faculty || ""],
    ["Module Incharge", info.incharge || ""],
    ["HOF", info.hof || ""],
    ["Branch", branch],
    ["Batch", batch],
    ["QC Assessors", info.assessors || ""]
  ];

  for (var i = 0; i < infoRows.length; i++) {
    sheet.getRange(i + 2, 1).setValue(infoRows[i][0]).setFontWeight("bold");
    sheet.getRange(i + 2, 2).setNumberFormat("@").setValue(infoRows[i][1]);
  }

  // 3. Row 11: Column Headers
  var headers = [];
  if (qcDef.hasSn) headers.push("SN");
  headers.push(qcDef.idLabel || "GID");
  headers.push("Student Name");

  var markColStartIdx = headers.length + 1;
  var theoryCols = [];
  var practicalCols = [];
  var allParts = [];

  qcDef.sections.forEach(function(sec) {
    sec.parts.forEach(function(p) {
      headers.push(p.name);
      allParts.push(p.name);
      if (sec.name.toLowerCase().indexOf("theor") !== -1) theoryCols.push(headers.length);
      else practicalCols.push(headers.length);
    });

    if (sec.passMark !== null && sec.passMark !== undefined) {
      headers.push(sec.name + " Score");
      headers.push(sec.name + " Pass/Fail");
    }
  });

  if (qcDef.overall.columnHeaders) {
    qcDef.overall.columnHeaders.forEach(function(hdr) { headers.push(hdr); });
  } else {
    headers.push("Total");
    headers.push("Result");
    headers.push(qcDef.overall.labelType || "Grade");
  }
  headers.push("Remarks");

  var headerRange = sheet.getRange(11, 1, 1, headers.length);
  headerRange.setValues([headers]).setFontWeight("bold").setBackground("#ebebeb");

  // 4. Helper for column letters
  var colLetter = function(c) {
    var l = "";
    while (c > 0) {
      var m = (c - 1) % 26;
      l = String.fromCharCode(65 + m) + l;
      c = Math.floor((c - m) / 26);
    }
    return l;
  };

  // 5. Populate student rows with dynamic spreadsheet formulas!
  var studentList = batchData.rows || [];
  var rowCount = Math.max(studentList.length, 60);
  var dataRows = [];
  var formulaColIndices = []; // for column protection

  for (var rIdx = 0; rIdx < rowCount; rIdx++) {
    var rNum = rIdx + 12;
    var rowData = [];
    var s = (rIdx < studentList.length) ? studentList[rIdx] : null;

    if (qcDef.hasSn) rowData.push(s ? (s.sn || (rIdx + 1)) : (rIdx + 1));
    rowData.push(s ? (s.gid || "") : "");
    rowData.push(s ? (s.name || "") : "");

    var currentC = (qcDef.hasSn ? 4 : 3);

    qcDef.sections.forEach(function(sec) {
      var secStartC = currentC;
      sec.parts.forEach(function(p) {
        var m = (s && s.marks && s.marks[p.name] !== undefined && s.marks[p.name] !== "") ? Number(s.marks[p.name]) : "";
        rowData.push(m);
        currentC++;
      });
      var secEndC = currentC - 1;

      if (sec.passMark !== null && sec.passMark !== undefined) {
        // Section Score Formula
        var sumRange = colLetter(secStartC) + rNum + ":" + colLetter(secEndC) + rNum;
        var fScore = '=IF(COUNT(' + sumRange + ')=0,"",SUM(' + sumRange + '))';
        rowData.push(fScore);
        if (formulaColIndices.indexOf(currentC) === -1) formulaColIndices.push(currentC);
        currentC++;

        // Section Pass/Fail Formula - Dynamic VLOOKUP from Settings sheet!
        // Col 3 in Settings is Theory Pass Mark, Col 4 is Practical Pass Mark
        var settingsPassCol = sec.name.toLowerCase().indexOf("theor") !== -1 ? 3 : 4;
        var countRequired = sec.parts.length;
        var fPf = '=IF(COUNT(' + sumRange + ')=0,"",IF(COUNT(' + sumRange + ')<' + countRequired + ',"PENDING",IF(SUM(' + sumRange + ')>=VLOOKUP($B$2,Settings!$A$2:$G$6,' + settingsPassCol + ',FALSE),"PASS","FAIL")))';
        rowData.push(fPf);
        if (formulaColIndices.indexOf(currentC) === -1) formulaColIndices.push(currentC);
        currentC++;
      }
    });

    // Overall Total & Result Formulas
    var allMarksEndC = currentC - (qcDef.sections.length > 1 ? 3 : 1);
    var allMarksRange = colLetter(qcDef.hasSn ? 4 : 3) + rNum + ":" + colLetter(allMarksEndC) + rNum;

    if (qcDef.overall.rule === "SECTIONS_PASS") {
      // Total formula
      var fTotal = '=IF(COUNT(' + allMarksRange + ')=0,"",SUM(' + allMarksRange + '))';
      rowData.push(fTotal);
      if (formulaColIndices.indexOf(currentC) === -1) formulaColIndices.push(currentC);
      currentC++;

      // Result formula (needs theory AND practical pass!)
      var tPfColLetter = colLetter(qcDef.hasSn ? 9 : 8);
      var pPfColLetter = colLetter(qcDef.hasSn ? 14 : 13);
      var totalParts = theoryCols.length + practicalCols.length;
      var fResult = '=IF(COUNT(' + allMarksRange + ')=0,"",IF(COUNT(' + allMarksRange + ')<' + totalParts + ',"PENDING",IF(AND(' + tPfColLetter + rNum + '="PASS",' + pPfColLetter + rNum + '="PASS"),"PASS","FAIL")))';
      rowData.push(fResult);
      if (formulaColIndices.indexOf(currentC) === -1) formulaColIndices.push(currentC);
      currentC++;

      // Grade / Level formula
      var totalColLet = colLetter(headers.indexOf("Total") + 1);
      var fGrade = '=IF(OR(' + totalColLet + rNum + '="",COUNT(' + allMarksRange + ')<' + totalParts + '),"",IF(' + totalColLet + rNum + '>=48,"A",IF(' + totalColLet + rNum + '>=40,"B","C")))';
      rowData.push(fGrade);
      if (formulaColIndices.indexOf(currentC) === -1) formulaColIndices.push(currentC);
      currentC++;
    } else {
      // Total formula for CMT / Software QC
      var fTotal = '=IF(COUNT(' + allMarksRange + ')=0,"",SUM(' + allMarksRange + '))';
      rowData.push(fTotal);
      if (formulaColIndices.indexOf(currentC) === -1) formulaColIndices.push(currentC);
      currentC++;

      // Result formula reading Overall Pass Mark from Settings col 5
      var fResult = '=IF(COUNT(' + allMarksRange + ')=0,"",IF(COUNT(' + allMarksRange + ')<' + allParts.length + ',"PENDING",IF(SUM(' + allMarksRange + ')>=VLOOKUP($B$2,Settings!$A$2:$G$6,5,FALSE),"PASS","FAIL")))';
      rowData.push(fResult);
      if (formulaColIndices.indexOf(currentC) === -1) formulaColIndices.push(currentC);
      currentC++;

      var fCat = '=""';
      rowData.push(fCat);
      if (formulaColIndices.indexOf(currentC) === -1) formulaColIndices.push(currentC);
      currentC++;
    }

    rowData.push(s ? (s.remarks || "") : "");
    dataRows.push(rowData);
  }

  var dataRange = sheet.getRange(12, 1, dataRows.length, headers.length);
  dataRange.setValues(dataRows);

  // 6. Data Validation: 0 to 8 on Mark Entry Cells
  var markValidation = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(0, 8)
    .setAllowInvalid(false)
    .setHelpText("Maximum mark for this part is 8. Accepts 0 to 8 only.")
    .build();

  var allMarksColStart = qcDef.hasSn ? 4 : 3;
  sheet.getRange(12, allMarksColStart, rowCount, allParts.length).setDataValidation(markValidation);

  // 7. Duplicate GID Warning: Conditional Formatting highlights duplicates in red
  var gidColIdx = qcDef.hasSn ? 2 : 1;
  var gidColLetter = colLetter(gidColIdx);
  var ruleDupGid = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND(NOT(ISBLANK(' + gidColLetter + '12)), COUNTIF($' + gidColLetter + '$12:$' + gidColLetter + ', ' + gidColLetter + '12)>1)')
    .setBackground("#ffc7ce")
    .setFontColor("#9c0006")
    .setRanges([sheet.getRange(12, gidColIdx, rowCount, 1)])
    .build();

  // 8. Conditional Formatting: PASS = Green, FAIL = Red, PENDING = Amber
  var rulePass = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("PASS")
    .setBackground("#c6efce")
    .setFontColor("#006100")
    .setRanges([sheet.getRange(12, 1, rowCount, headers.length)])
    .build();

  var ruleFail = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("FAIL")
    .setBackground("#ffc7ce")
    .setFontColor("#9c0006")
    .setRanges([sheet.getRange(12, 1, rowCount, headers.length)])
    .build();

  var rulePending = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("PENDING")
    .setBackground("#ffeb9c")
    .setFontColor("#9c5700")
    .setRanges([sheet.getRange(12, 1, rowCount, headers.length)])
    .build();

  sheet.setConditionalFormatRules([ruleDupGid, rulePass, ruleFail, rulePending]);

  // 9. Protect Formula Columns (Leave mark cells editable)
  try {
    formulaColIndices.forEach(function(cIdx) {
      var protection = sheet.getRange(12, cIdx, rowCount, 1).protect();
      protection.setDescription("Protected Formula Column: " + headers[cIdx - 1]);
      protection.setWarningOnly(true); // Shows clear warning when modified
    });
  } catch (protErr) {}

  return { ok: true, message: "Batch saved to sheet " + tabName, tabName: tabName };
}

function handleDeleteBatch(body) {
  var tabName = (body.tabName || "").trim();
  if (!tabName) return { ok: false, error: "Missing tabName to delete." };

  var ss = getQCDataSpreadsheet();
  var sheet = ss.getSheetByName(tabName);
  if (sheet) {
    ss.deleteSheet(sheet);
    return { ok: true, message: "Sheet deleted." };
  }
  return { ok: false, error: "Sheet tab not found." };
}

function handleSaveStudents(studentsList) {
  var ss = getQCDataSpreadsheet();
  var sheet = ss.getSheetByName("Students");
  if (!sheet) sheet = ss.insertSheet("Students");

  sheet.clear();
  sheet.appendRow(["GID", "Name", "Branch", "Batch", "Faculty", "Module", "Admission No", "Status"]);
  sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#f3f3f3");

  if (studentsList && studentsList.length > 0) {
    var rows = studentsList.map(function(s) {
      return [
        s.gid || "",
        s.name || "",
        s.branch || "",
        s.batch || "",
        s.faculty || "",
        s.module || "",
        s.admNo || "",
        s.status || "Active"
      ];
    });
    sheet.getRange(2, 1, rows.length, 8).setValues(rows);
  }

  return { ok: true, count: (studentsList ? studentsList.length : 0) };
}

function handleSaveConfig(configObj) {
  var ss = getQCDataSpreadsheet();
  var sheet = ss.getSheetByName("Settings");
  if (!sheet) setupSettingsSheet(ss);

  var jsonStr = typeof configObj === "string" ? configObj : JSON.stringify(configObj);
  sheet.getRange("Z1").setValue(jsonStr);

  return { ok: true, message: "Configuration backup saved." };
}

// Save Branches List
function handleSaveBranches(branchesList) {
  var ss = getQCDataSpreadsheet();
  var sheet = ss.getSheetByName("Branches");
  if (!sheet) sheet = ss.insertSheet("Branches");

  sheet.clear();
  sheet.appendRow(["Branch Name", "Branch Code", "Workbook/Sheet link", "Active (Yes/No)"]);
  sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#ebebeb");

  if (branchesList && branchesList.length > 0) {
    var rows = branchesList.map(function(b) {
      return [
        b.name || "",
        b.code || "",
        b.link || ss.getUrl(),
        b.active || "Yes"
      ];
    });
    sheet.getRange(2, 1, rows.length, 4).setValues(rows);
  }

  return { ok: true, message: "Branches saved successfully." };
}

// Add a New Branch and automatically create standard batch tab templates
function handleAddBranch(branchData) {
  if (!branchData || !branchData.name) {
    return { ok: false, error: "Branch name is required." };
  }

  var bName = branchData.name.trim();
  var bCode = (branchData.code || bName.substring(0, 5).toUpperCase()).trim();
  var ss = getQCDataSpreadsheet();
  var sheet = ss.getSheetByName("Branches");
  if (!sheet) setupBranchesSheet(ss);

  // Check if branch already exists
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).toLowerCase() === bName.toLowerCase()) {
      return { ok: false, error: "Branch '" + bName + "' already exists." };
    }
  }

  sheet.appendRow([bName, bCode, ss.getUrl(), "Yes"]);

  // Automatically create standard 1ST QC batch sheet template for the new branch
  try {
    handleSaveBatch({
      info: {
        qcType: "1ST QC",
        branch: bName,
        batch: "Batch 01",
        qcDate: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"),
        faculty: "Faculty",
        incharge: "Module Incharge",
        hof: "HOF",
        assessors: "QC Assessors"
      },
      rows: []
    });
  } catch (e) {}

  return { ok: true, message: "Branch '" + bName + "' added successfully with template batch tabs." };
}

// Save Settings Table (Pass Marks per QC type directly to Settings sheet)
function handleSaveSettingsTable(tableRows) {
  var ss = getQCDataSpreadsheet();
  var sheet = ss.getSheetByName("Settings");
  if (!sheet) setupSettingsSheet(ss);

  if (tableRows && tableRows.length > 0) {
    for (var i = 0; i < tableRows.length; i++) {
      var row = tableRows[i];
      var rNum = i + 2;
      sheet.getRange(rNum, 1).setValue(row.qcType || "");
      sheet.getRange(rNum, 2).setValue(row.title || "");
      sheet.getRange(rNum, 3).setValue(row.theoryPass !== undefined ? row.theoryPass : "NA");
      sheet.getRange(rNum, 4).setValue(row.practicalPass !== undefined ? row.practicalPass : "NA");
      sheet.getRange(rNum, 5).setValue(row.overallPass !== undefined ? row.overallPass : "NA");
      sheet.getRange(rNum, 6).setValue(row.maxMarks || "");
      sheet.getRange(rNum, 7).setValue(row.passingRule || "SECTIONS_PASS");
    }
  }

  return { ok: true, message: "Settings table saved. All dynamic batch formulas will recalculate instantly." };
}

function getQCDataSpreadsheet() {
  var folder;
  try {
    folder = DriveApp.getFolderById(FOLDER_ID);
  } catch (e) {
    folder = DriveApp.getRootFolder();
  }

  var files = folder.getFilesByName(BOOK_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }
  setup();
  return SpreadsheetApp.open(folder.getFilesByName(BOOK_NAME).next());
}

/**
 * Returns stored settings by reading pass marks from the tabular Settings sheet!
 * If 1ST QC theory pass mark in sheet was edited, it returns that value!
 */
function getStoredSettings() {
  var settings = JSON.parse(DEFAULT_SETTINGS_JSON);
  try {
    var ss = getQCDataSpreadsheet();
    var sheet = ss.getSheetByName("Settings");
    if (sheet && sheet.getLastRow() >= 2) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        var qcKey = String(data[i][0] || "").trim().toUpperCase();
        if (settings.qcs[qcKey]) {
          var tPass = data[i][2];
          var pPass = data[i][3];
          var oPass = data[i][4];

          if (tPass !== "NA" && tPass !== "" && !isNaN(tPass)) {
            var theorySec = settings.qcs[qcKey].sections.find(function(s) {
              return s.name.toLowerCase().indexOf("theor") !== -1;
            });
            if (theorySec) theorySec.passMark = Number(tPass);
          }
          if (pPass !== "NA" && pPass !== "" && !isNaN(pPass)) {
            var pracSec = settings.qcs[qcKey].sections.find(function(s) {
              return s.name.toLowerCase().indexOf("prac") !== -1;
            });
            if (pracSec) pracSec.passMark = Number(pPass);
          }
          if (oPass !== "NA" && oPass !== "" && !isNaN(oPass)) {
            settings.qcs[qcKey].overall.passMark = Number(oPass);
          }
        }
      }
    }
  } catch (e) {}

  return settings;
}
