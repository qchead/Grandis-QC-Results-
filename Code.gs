/**
 * ============================================================================
 * GRANDIS TECHNOLOGY Pvt. Ltd. - R&D Department
 * QC (Quality Check) Result Management System - Backend Engine (Google Apps Script)
 * ============================================================================
 *
 * HOW TO DEPLOY:
 * 1. Open your Google Sheet workbook -> click "Extensions" -> "Apps Script".
 *    (Or go to https://script.google.com, create a project, and paste your
 *    Google Sheet ID into SPREADSHEET_ID below.)
 * 2. Paste this entire file into Code.gs and click Save (Ctrl+S).
 * 3. (Recommended once) Select "setup" from the top function dropdown and click Run
 *    to create any missing "Settings", "Branches", or "Students" sheets safely.
 *    Existing student data and existing batch tabs are NEVER deleted or overwritten.
 * 4. Click "Deploy" -> "New deployment" -> Type: "Web app"
 *      - Execute as: "Me"
 *      - Who has access: "Anyone"
 *    Click Deploy, authorize permissions, and copy the Web App URL (.../exec).
 * 5. Paste that URL into config.js -> GOOGLE_SCRIPT_URL = "YOUR_URL_HERE";
 *
 * NOTE: Every time you edit Code.gs later, go to:
 *       Deploy -> Manage deployments -> Edit (pencil) -> Version: New version -> Deploy
 */

// ============================================================================
// CONFIGURATION CONSTANTS
// ============================================================================

// Optional: Leave as placeholder if you opened Extensions > Apps Script FROM your Google Sheet.
// Paste your Sheet ID here ONLY if deploying standalone at script.google.com:
var SPREADSHEET_ID = "YOUR_GOOGLE_SHEET_ID_HERE";

// Optional: Set a Google Drive Folder ID ONLY if you want to also scan separate spreadsheets in that folder:
var FOLDER_ID = "YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE";

// Must match the Admin Portal password used by qc-sheet.html (Admin1 / QCheadR&D)
var ADMIN_PASSWORD = "QCheadR&D";

// Fallback workbook name if creating a brand new standalone spreadsheet
var BOOK_NAME = "QC_DATA";

// System / non-batch sheet names ignored when scanning batch tabs
var SYSTEM_SHEET_NAMES = {
  "students": true,
  "settings": true,
  "branches": true,
  "batch info": true,
  "how to use": true,
  "sheet1": true
};

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

// Default Branches List (Thodupuzha & Chennai first as requested)
var DEFAULT_BRANCHES_DATA = [
  ["Thodupuzha", "THDPZ", "", "Yes"],
  ["Chennai", "CHN", "", "Yes"],
  ["Ernakulam", "EKM", "", "Yes"],
  ["Calicut", "CLT", "", "Yes"]
];

// ============================================================================
// GOOGLE SHEET CUSTOM MENU (Safe when container-bound)
// ============================================================================
function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu("Grandis QC System")
      .addItem("Initialize / Verify System Sheets", "setup")
      .addToUi();
  } catch (e) {}
}

// ============================================================================
// SYSTEM SETUP FUNCTION (Safe: Never deletes or overwrites student/batch data)
// ============================================================================
function setup() {
  var ss = getQCDataSpreadsheet();

  // 1. Setup 'Settings' sheet (Tabular pass marks supporting live VLOOKUP)
  setupSettingsSheet(ss);

  // 2. Setup 'Branches' sheet (Branch Name, Code, Sheet Link, Active)
  setupBranchesSheet(ss);

  // 3. Setup 'Students' sheet (Only creates if missing; preserves existing records)
  setupStudentsSheet(ss);

  // Remove empty default "Sheet1" only if unused and other sheets exist
  var sheet1 = ss.getSheetByName("Sheet1");
  if (sheet1 && ss.getSheets().length > 1 && sheet1.getLastRow() === 0) {
    try { ss.deleteSheet(sheet1); } catch (e) {}
  }

  Logger.log("Grandis QC System ready. Spreadsheet ID: " + ss.getId() + " | URL: " + ss.getUrl());
  return { ok: true, spreadsheetId: ss.getId(), url: ss.getUrl() };
}

/**
 * Creates 'Settings' sheet if missing or lacking table headers.
 * Stores one row per QC type with Theory Pass Mark, Practical Pass Mark, Overall Pass Mark.
 * 1ST QC theory pass mark = 20 by default.
 */
function setupSettingsSheet(ss) {
  var sheet = ss.getSheetByName("Settings");
  if (!sheet) {
    sheet = ss.insertSheet("Settings");
  }

  var existingVal = String(sheet.getRange("A1").getValue() || "").trim();
  if (existingVal !== "QC Type") {
    // Only populate if sheet does not already have the Settings table
    if (sheet.getLastRow() === 0) {
      var headers = [
        "QC Type", "QC Full Name", "Theory Pass Mark", "Practical Pass Mark", "Overall Pass Mark", "Max Marks", "Passing Rule"
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers])
        .setFontWeight("bold").setBackground("#e2e8f0");

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
      sheet.getRange("Z1").setValue(DEFAULT_SETTINGS_JSON);
    }
  }
}

/**
 * Creates 'Branches' sheet if missing.
 * Columns: Branch Name, Branch Code, Workbook/Sheet link, Active (Yes/No)
 */
function setupBranchesSheet(ss) {
  var sheet = ss.getSheetByName("Branches");
  if (!sheet) {
    sheet = ss.insertSheet("Branches");
    var headers = ["Branch Name", "Branch Code", "Workbook/Sheet link", "Active (Yes/No)"];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold").setBackground("#e2e8f0");

    var rows = DEFAULT_BRANCHES_DATA.map(function(item) {
      return [item[0], item[1], ss.getUrl(), item[3]];
    });
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);
  }
}

/**
 * Creates 'Students' sheet if missing without altering existing student rows.
 */
function setupStudentsSheet(ss) {
  var sheet = ss.getSheetByName("Students");
  if (!sheet) {
    sheet = ss.insertSheet("Students");
    sheet.appendRow([
      "GID", "Name", "Branch", "Batch", "Faculty", "Module", "Admission No", "Status"
    ]);
    sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#e2e8f0");

    // Demo rows added only on brand-new creation
    sheet.appendRow(["DEMO1001", "Anjali S", "Thodupuzha", "Batch 24", "Mr. Anand Kumar", "Module 1", "ADM-001", "Active"]);
    sheet.appendRow(["DEMO1002", "Rahul M", "Thodupuzha", "Batch 24", "Mr. Anand Kumar", "Module 1", "ADM-002", "Active"]);
    sheet.appendRow(["DEMO1003", "Gokul Krishnan", "Thodupuzha", "Batch 24", "Mr. Anand Kumar", "Module 1", "ADM-003", "Active"]);
    sheet.setFrozenRows(1);
  }
}

// ============================================================================
// AUTH HELPER & SPREADSHEET RESOLUTION
// ============================================================================
function isValidStaffPassword(pwd) {
  var p = String(pwd || "").trim();
  if (!p) return false;
  if (p === ADMIN_PASSWORD) return true;
  if (ADMIN_PASSWORD === "QCheadR&D" && (p === "QcheadR&D" || p === "grandis@rnd2026")) return true;
  return false;
}

function isConfiguredValue(val) {
  var s = String(val || "").trim();
  return Boolean(s && s.indexOf("YOUR_") !== 0);
}

function getQCDataSpreadsheet() {
  // 1. Explicit SPREADSHEET_ID constant if configured
  if (isConfiguredValue(SPREADSHEET_ID)) {
    return SpreadsheetApp.openById(SPREADSHEET_ID.trim());
  }

  // 2. Active bound spreadsheet (when added via Extensions > Apps Script inside your Google Sheet)
  try {
    var active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}

  // 3. Standalone script fallback: find BOOK_NAME in FOLDER_ID (or root)
  var folder = DriveApp.getRootFolder();
  if (isConfiguredValue(FOLDER_ID)) {
    try {
      folder = DriveApp.getFolderById(FOLDER_ID.trim());
    } catch (e) {
      folder = DriveApp.getRootFolder();
    }
  }

  var files = folder.getFilesByName(BOOK_NAME);
  if (files.hasNext()) {
    return SpreadsheetApp.open(files.next());
  }

  // Create fresh workbook once if none exists
  var ss = SpreadsheetApp.create(BOOK_NAME);
  try {
    if (folder.getId() !== DriveApp.getRootFolder().getId()) {
      DriveApp.getFileById(ss.getId()).moveTo(folder);
    }
  } catch (e) {}
  setupSettingsSheet(ss);
  setupBranchesSheet(ss);
  setupStudentsSheet(ss);
  return ss;
}

function extractSpreadsheetIdFromLink(link) {
  var s = String(link || "").trim();
  if (!s) return "";
  var match = s.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) return match[1];
  if (/^[a-zA-Z0-9-_]{25,}$/.test(s)) return s;
  return "";
}

function getBranchRegistry(ss) {
  var list = [];
  try {
    var sheet = ss.getSheetByName("Branches");
    if (sheet && sheet.getLastRow() >= 2) {
      var data = sheet.getDataRange().getValues();
      for (var i = 1; i < data.length; i++) {
        var name = String(data[i][0] || "").trim();
        var code = String(data[i][1] || "").trim();
        var link = String(data[i][2] || "").trim();
        var activeRaw = String(data[i][3] || "Yes").trim().toLowerCase();
        var isActive = (activeRaw === "yes" || activeRaw === "true" || activeRaw === "1" || activeRaw === "active");
        if (name) {
          list.push({
            name: name,
            code: code,
            link: link,
            ssId: extractSpreadsheetIdFromLink(link),
            active: isActive ? "Yes" : "No",
            isActive: isActive
          });
        }
      }
    }
  } catch (e) {}

  if (list.length === 0) {
    DEFAULT_BRANCHES_DATA.forEach(function(b) {
      list.push({
        name: b[0],
        code: b[1],
        link: b[2],
        ssId: "",
        active: b[3],
        isActive: true
      });
    });
  }
  return list;
}

function getAllWorkbooksToScan(masterSS) {
  var results = [];
  var seenIds = {};

  function addBook(ss) {
    if (!ss) return;
    var id = ss.getId();
    if (seenIds[id]) return;
    seenIds[id] = true;
    results.push({ spreadsheet: ss, fileName: ss.getName() });
  }

  // 1. Always include master spreadsheet first
  addBook(masterSS);

  // 2. Include any distinct workbooks linked in the Branches sheet
  var branches = getBranchRegistry(masterSS);
  branches.forEach(function(b) {
    if (b.isActive && b.ssId && !seenIds[b.ssId]) {
      try {
        addBook(SpreadsheetApp.openById(b.ssId));
      } catch (e) {}
    }
  });

  // 3. ONLY scan a Google Drive folder if FOLDER_ID is explicitly configured (never scan root Drive!)
  if (isConfiguredValue(FOLDER_ID)) {
    try {
      var folder = DriveApp.getFolderById(FOLDER_ID.trim());
      var folderBooks = getAllSpreadsheetsRecursive(folder, 0);
      folderBooks.forEach(function(item) {
        addBook(item.spreadsheet);
      });
    } catch (e) {}
  }

  return results;
}

function getAllSpreadsheetsRecursive(folder, depth) {
  var list = [];
  if (depth > 3) return list; // safeguard depth

  var files = folder.getFilesByType(MimeType.GOOGLE_SHEETS);
  while (files.hasNext()) {
    var f = files.next();
    try {
      list.push({ spreadsheet: SpreadsheetApp.open(f), fileName: f.getName() });
    } catch (e) {}
  }

  var subfolders = folder.getFolders();
  while (subfolders.hasNext()) {
    list = list.concat(getAllSpreadsheetsRecursive(subfolders.next(), depth + 1));
  }
  return list;
}

// ============================================================================
// WEB APP REQUEST DISPATCHER (doGet & doPost) - CORS-Safe JSON Output
// ============================================================================
function doGet(e) {
  var p = (e && e.parameter) ? e.parameter : {};
  var action = String(p.action || "").trim();

  try {
    // Health check / direct browser test URL
    if (!action || action === "ping" || action === "status") {
      var ss = getQCDataSpreadsheet();
      return jsonResponse({
        ok: true,
        status: "READY",
        service: "Grandis Technology QC Result API",
        spreadsheetName: ss.getName(),
        spreadsheetId: ss.getId()
      });
    }

    // Optional setup trigger
    if (action === "setup") {
      return jsonResponse(setup());
    }

    // 1. PUBLIC: Student Result Login & Lookup (always fresh live read)
    if (action === "login" || action === "studentGetResult") {
      return jsonResponse(handleStudentLogin(p));
    }

    // 2. PUBLIC: Batches list for selected Branch & QC type
    if (action === "batches" || action === "listBatches") {
      return jsonResponse(handleGetBatches(p));
    }

    // 3. PUBLIC: Active Branches & Active QC Types
    if (action === "branches") {
      return jsonResponse(handleGetBranchesPublic());
    }

    // 4. PUBLIC: Live Settings & Pass Marks
    if (action === "getSettings") {
      return jsonResponse({ ok: true, settings: getStoredSettings() });
    }

    // 5. ADMIN / STAFF: Load system data + saved batch tabs
    if (action === "load") {
      if (!isValidStaffPassword(p.password)) {
        return jsonResponse({ ok: false, error: "Unauthorized. Invalid staff password." });
      }
      return jsonResponse(handleStaffLoad());
    }

    // 6. ADMIN / STAFF: Load a specific batch sheet tab into Admin Panel grid
    if (action === "loadBatch" || action === "getBatch") {
      if (!isValidStaffPassword(p.password)) {
        return jsonResponse({ ok: false, error: "Unauthorized. Invalid staff password." });
      }
      return jsonResponse(handleLoadSingleBatch(p));
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

    var p = (e && e.parameter) ? e.parameter : {};
    var password = String(body.password || p.password || "").trim();
    if (!isValidStaffPassword(password)) {
      return jsonResponse({ ok: false, error: "Unauthorized. Invalid staff password." });
    }

    var action = String(body.action || p.action || "").trim();

    if (action === "saveBatch") {
      return jsonResponse(handleSaveBatch(body.batchData || body));
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
// PUBLIC ACTION: STUDENT LOGIN (Reads fresh live marks + Settings pass marks)
// ============================================================================
function handleStudentLogin(p) {
  var branch = String(p.branch || "").trim();
  var qc = String(p.qc || "").trim().toUpperCase();
  var batch = String(p.batch || "").trim();
  var gid = String(p.gid || "").trim().toUpperCase();
  var password = String(p.password || "").trim();

  if (!gid) return { ok: false, error: "GID number is required." };
  if (!password) return { ok: false, error: "Password is required." };
  if (password.toUpperCase() !== gid) {
    return { ok: false, error: "Invalid password. Your password is your GID number." };
  }

  var masterSS = getQCDataSpreadsheet();
  var settings = getStoredSettings(masterSS);
  var branchesRegistry = getBranchRegistry(masterSS);
  var qcDef = settings.qcs[qc] || settings.qcs["1ST QC"];

  var allBooks = getAllWorkbooksToScan(masterSS);
  var matchingResults = [];
  var seenKeys = {};

  for (var i = 0; i < allBooks.length; i++) {
    var ss = allBooks[i].spreadsheet;
    var fileName = allBooks[i].fileName;
    var workbookDefaultInfo = getBatchInfoTabDefaults(ss);
    var tabs = ss.getSheets();

    for (var t = 0; t < tabs.length; t++) {
      var sheet = tabs[t];
      var sheetName = sheet.getName();
      if (SYSTEM_SHEET_NAMES[sheetName.toLowerCase()]) continue;

      var parsed = parseSheetDataGeneric(sheet, fileName, settings, workbookDefaultInfo);
      if (!parsed) continue;

      var branchMatches = matchBranch(parsed.info.branch, sheetName + " " + fileName, branch, branchesRegistry);
      var qcMatches = !qc || (parsed.qcType || "").toUpperCase() === qc;
      var batchMatches = !batch ||
        batch.toLowerCase() === "(all batches)" ||
        String(parsed.info.batch || "").trim().toLowerCase() === batch.toLowerCase();

      if (branchMatches && qcMatches && batchMatches) {
        var studentRow = null;
        for (var r = 0; r < parsed.rows.length; r++) {
          if (String(parsed.rows[r].gid || "").trim().toUpperCase() === gid) {
            studentRow = parsed.rows[r];
            break;
          }
        }

        if (studentRow) {
          var dedupKey = parsed.qcType + "|" + (parsed.info.branch || branch) + "|" + (parsed.info.batch || sheetName) + "|" + gid;
          if (!seenKeys[dedupKey]) {
            seenKeys[dedupKey] = true;
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
  var branch = String(p.branch || "").trim();
  var qc = String(p.qc || "").trim().toUpperCase();

  var masterSS = getQCDataSpreadsheet();
  var settings = getStoredSettings(masterSS);
  var branchesRegistry = getBranchRegistry(masterSS);
  var allBooks = getAllWorkbooksToScan(masterSS);
  var batchList = [];

  for (var i = 0; i < allBooks.length; i++) {
    var ss = allBooks[i].spreadsheet;
    var fileName = allBooks[i].fileName;
    var workbookDefaultInfo = getBatchInfoTabDefaults(ss);
    var tabs = ss.getSheets();

    for (var t = 0; t < tabs.length; t++) {
      var sheet = tabs[t];
      var sheetName = sheet.getName();
      if (SYSTEM_SHEET_NAMES[sheetName.toLowerCase()]) continue;

      var parsed = parseSheetDataGeneric(sheet, fileName, settings, workbookDefaultInfo);
      if (parsed && parsed.info && parsed.info.batch) {
        var matchBr = !branch || matchBranch(parsed.info.branch, sheetName + " " + fileName, branch, branchesRegistry);
        var matchQ = !qc || (parsed.qcType || "").toUpperCase() === qc;
        if (matchBr && matchQ) {
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

// ============================================================================
// PUBLIC ACTION: ACTIVE BRANCHES & QC TYPES
// ============================================================================
function handleGetBranchesPublic() {
  var ss = getQCDataSpreadsheet();
  var branchesRegistry = getBranchRegistry(ss);
  var activeBranches = branchesRegistry.filter(function(b) {
    return b.isActive;
  }).map(function(b) {
    return b.name;
  });

  if (activeBranches.length === 0) {
    activeBranches = ["Thodupuzha", "Chennai"];
  }

  // Also read live QC list from Settings sheet so website dropdown stays synced
  var activeQcs = ["1ST QC", "2ND QC", "CMT QC", "SOFTWARE QC", "FINAL QC"];
  try {
    var settingsSheet = ss.getSheetByName("Settings");
    if (settingsSheet && settingsSheet.getLastRow() >= 2) {
      var sData = settingsSheet.getDataRange().getValues();
      var parsedQcs = [];
      for (var i = 1; i < sData.length; i++) {
        var qName = String(sData[i][0] || "").trim().toUpperCase();
        if (qName && parsedQcs.indexOf(qName) === -1) {
          parsedQcs.push(qName);
        }
      }
      if (parsedQcs.length > 0) activeQcs = parsedQcs;
    }
  } catch (e) {}

  return {
    ok: true,
    branches: activeBranches,
    qcs: activeQcs
  };
}

// Branch matching helper (supports dynamic Branches codes like THDPZ, CHN, new branches)
function matchBranch(cellBranch, contextName, requestedBranch, branchesRegistry) {
  if (!requestedBranch) return true;
  var req = requestedBranch.trim().toLowerCase();
  var cell = String(cellBranch || "").trim().toLowerCase();
  var ctx = String(contextName || "").trim().toLowerCase();

  if (cell && (cell === req || cell.indexOf(req) !== -1 || req.indexOf(cell) !== -1)) return true;
  if (ctx.indexOf(req) !== -1) return true;

  // Check code match from dynamic Branches registry
  if (branchesRegistry && branchesRegistry.length > 0) {
    for (var i = 0; i < branchesRegistry.length; i++) {
      var b = branchesRegistry[i];
      var bName = b.name.toLowerCase();
      var bCode = b.code.toLowerCase();
      if (bName === req || bName.indexOf(req) !== -1 || req.indexOf(bName) !== -1) {
        if (bCode && (cell.indexOf(bCode) !== -1 || ctx.indexOf(bCode) !== -1)) {
          return true;
        }
      }
    }
  }

  if (req.indexOf("thodu") !== -1 && (ctx.indexOf("thdpz") !== -1 || cell.indexOf("thdpz") !== -1)) return true;
  if (req.indexOf("chennai") !== -1 && (ctx.indexOf("chn") !== -1 || cell.indexOf("chn") !== -1)) return true;
  if (req.indexOf("ernakulam") !== -1 && (ctx.indexOf("ekm") !== -1 || cell.indexOf("ekm") !== -1)) return true;
  if (req.indexOf("calicut") !== -1 && (ctx.indexOf("clt") !== -1 || cell.indexOf("clt") !== -1)) return true;

  return false;
}

// ============================================================================
// GENERIC SHEET PARSER (Handles saved tabs + custom/Excel batch layouts)
// ============================================================================
function cellToStr(val) {
  if (val === null || val === undefined) return "";
  if (val instanceof Date) {
    try {
      return Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
    } catch (e) {
      return String(val);
    }
  }
  return String(val).trim();
}

function normKey(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getBatchInfoTabDefaults(ss) {
  var defaults = {};
  try {
    var infoSheet = ss.getSheetByName("Batch Info");
    if (!infoSheet || infoSheet.getLastRow() < 2) return defaults;
    var vals = infoSheet.getDataRange().getValues();
    for (var r = 0; r < vals.length; r++) {
      for (var c = 0; c < vals[r].length - 1; c++) {
        var k = cellToStr(vals[r][c]).toLowerCase().replace(/:$/, "");
        var v = cellToStr(vals[r][c + 1]);
        if (!v) continue;
        if (k === "branch") defaults.branch = v;
        else if (k === "batch") defaults.batch = v;
        else if (k === "qc date" || k === "date") defaults.qcDate = v;
        else if (k === "faculty" || k === "faculty incharge") defaults.faculty = v;
        else if (k === "module incharge" || k === "incharge") defaults.incharge = v;
        else if (k === "hof" || k === "head of faculty") defaults.hof = v;
        else if (k === "qc assessors" || k === "assessors") defaults.assessors = v;
      }
    }
  } catch (e) {}
  return defaults;
}

function parseSheetDataGeneric(sheet, fileName, settings, workbookDefaults) {
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 3) return null;

  var sheetName = sheet.getName();
  var rangeValues = sheet.getRange(1, 1, lastRow, lastCol).getValues();

  // Locate actual table header row containing GID/MID AND Student Name (or part header)
  var headerRowIdx = -1;
  var idColIdx = -1;
  var nameColIdx = -1;

  for (var r = 0; r < Math.min(rangeValues.length, 30); r++) {
    var candidateIdCol = -1;
    var hasNameOrParts = false;

    for (var c = 0; c < rangeValues[r].length; c++) {
      var cellVal = cellToStr(rangeValues[r][c]).toLowerCase();
      if (cellVal === "gid" || cellVal === "gid no" || cellVal === "gid number" ||
          cellVal === "mid / gid" || cellVal === "mid/gid" || cellVal === "mid") {
        candidateIdCol = c;
      } else if (candidateIdCol === -1 && cellVal.indexOf("gid") !== -1 && cellVal.length <= 20) {
        candidateIdCol = c;
      }
      if (cellVal.indexOf("name") !== -1 || cellVal.indexOf("student") !== -1 || cellVal === "identification") {
        hasNameOrParts = true;
      }
    }

    if (candidateIdCol !== -1 && (hasNameOrParts || r >= 8)) {
      headerRowIdx = r;
      idColIdx = candidateIdCol;
      break;
    }
  }

  if (headerRowIdx === -1) return null;

  var headerRow = rangeValues[headerRowIdx];
  var snColIdx = -1;
  var remarksColIdx = -1;

  for (var c = 0; c < headerRow.length; c++) {
    var val = cellToStr(headerRow[c]).toLowerCase();
    if (val === "sn" || val === "s.no" || val === "sl.no" || val === "sl no") {
      snColIdx = c;
    }
    if (nameColIdx === -1 && (val.indexOf("name") !== -1 || val.indexOf("student") !== -1)) {
      nameColIdx = c;
    }
    if (val.indexOf("remark") !== -1 || val === "notes") {
      remarksColIdx = c;
    }
  }
  if (nameColIdx === -1) nameColIdx = idColIdx + 1;

  var info = extractBatchInfo(rangeValues, headerRowIdx, sheetName, fileName, workbookDefaults);

  var markColIndices = [];
  var computedKeywords = [
    "score", "pass", "total", "grade", "level", "category",
    "overall", "result", "remark", "sn", "s.no", "sl", "mid",
    "gid", "name", "status", "date", "notes"
  ];

  for (var c = 0; c < headerRow.length; c++) {
    if (c === idColIdx || c === nameColIdx || c === snColIdx || c === remarksColIdx) continue;
    var rawH = cellToStr(headerRow[c]);
    var hName = rawH.toLowerCase();
    if (!hName) continue;

    var isComputed = false;
    for (var k = 0; k < computedKeywords.length; k++) {
      if (hName.indexOf(computedKeywords[k]) !== -1) {
        isComputed = true;
        break;
      }
    }

    if (!isComputed) {
      markColIndices.push({ idx: c, name: rawH });
    }
  }

  var qcType = detectQCType(info.qcType, info.title, sheetName, fileName, markColIndices.length, settings);
  info.qcType = qcType;
  var qcDef = (settings && settings.qcs && settings.qcs[qcType]) ? settings.qcs[qcType] : null;

  // Map column headers cleanly to canonical part names in qcDef (fixes minor spacing/typo differences)
  var normalizePartAlias = function(s) {
    var k = normKey(s).replace(/cheking/g, "checking").replace(/jumb/g, "jum");
    if (k === "conn") k = "connector";
    return k;
  };

  var partAliasMap = {};
  if (qcDef && qcDef.sections) {
    qcDef.sections.forEach(function(sec) {
      sec.parts.forEach(function(part) {
        partAliasMap[normalizePartAlias(part.name)] = part.name;
      });
    });
  }

  markColIndices.forEach(function(mCol) {
    var nk = normalizePartAlias(mCol.name);
    if (partAliasMap[nk]) {
      mCol.canonicalName = partAliasMap[nk];
    } else {
      // Fuzzy substring fallback against canonical parts
      var resolved = mCol.name;
      Object.keys(partAliasMap).forEach(function(pk) {
        if (nk === pk || (pk.length >= 4 && nk.indexOf(pk) !== -1) || (nk.length >= 4 && pk.indexOf(nk) !== -1)) {
          resolved = partAliasMap[pk];
        }
      });
      mCol.canonicalName = resolved;
    }
  });

  var rows = [];
  for (var r = headerRowIdx + 1; r < rangeValues.length; r++) {
    var row = rangeValues[r];
    var gidVal = cellToStr(row[idColIdx]);
    if (!gidVal) continue;

    var gidLower = gidVal.toLowerCase();
    if (gidLower === "total" || gidLower === "average" || gidLower === "pass %" || gidLower === "summary") continue;

    var nameVal = cellToStr(row[nameColIdx]);
    var marksObj = {};
    var hasAnyMark = false;

    markColIndices.forEach(function(mCol) {
      var rawMark = row[mCol.idx];
      var strMark = cellToStr(rawMark);
      if (strMark !== "" && !isNaN(Number(strMark))) {
        marksObj[mCol.canonicalName] = Number(strMark);
        hasAnyMark = true;
      }
    });

    rows.push({
      sn: snColIdx !== -1 ? cellToStr(row[snColIdx]) : (rows.length + 1),
      gid: gidVal,
      name: nameVal,
      marks: marksObj,
      remarks: remarksColIdx !== -1 ? cellToStr(row[remarksColIdx]) : ""
    });
  }

  info.strength = info.strength || rows.length;

  return {
    tabName: sheetName,
    qcType: qcType,
    info: info,
    rows: rows
  };
}

function extractBatchInfo(values, headerRowIdx, sheetName, fileName, workbookDefaults) {
  var info = {
    title: "",
    qcType: "",
    branch: (workbookDefaults && workbookDefaults.branch) ? workbookDefaults.branch : "",
    batch: (workbookDefaults && workbookDefaults.batch) ? workbookDefaults.batch : "",
    qcDate: (workbookDefaults && workbookDefaults.qcDate) ? workbookDefaults.qcDate : "",
    faculty: (workbookDefaults && workbookDefaults.faculty) ? workbookDefaults.faculty : "",
    incharge: (workbookDefaults && workbookDefaults.incharge) ? workbookDefaults.incharge : "",
    hof: (workbookDefaults && workbookDefaults.hof) ? workbookDefaults.hof : "",
    assessors: (workbookDefaults && workbookDefaults.assessors) ? workbookDefaults.assessors : "",
    strength: ""
  };

  var knownKeys = {
    "qc type": true, "qc date": true, "date": true, "faculty": true, "faculty incharge": true,
    "module incharge": true, "incharge": true, "hof": true, "head of faculty": true,
    "branch": true, "batch": true, "qc assessors": true, "assessor": true, "assessors": true,
    "batch strength": true, "strength": true
  };

  for (var r = 0; r < headerRowIdx; r++) {
    for (var c = 0; c < values[r].length; c++) {
      var val = cellToStr(values[r][c]);
      if (!val) continue;
      var lower = val.toLowerCase().replace(/:$/, "").trim();

      if (lower.indexOf("quality check") !== -1 || lower.indexOf("qc report") !== -1 ||
          lower.indexOf("term quality") !== -1 || lower === "cmt qc" || lower === "final qc report") {
        if (!info.title) info.title = val;
      }

      if (knownKeys[lower]) {
        // Find next non-empty cell in row (that isn't another metadata key)
        var nextVal = "";
        for (var nc = c + 1; nc < Math.min(c + 3, values[r].length); nc++) {
          var cand = cellToStr(values[r][nc]);
          if (cand) {
            if (!knownKeys[cand.toLowerCase().replace(/:$/, "").trim()]) {
              nextVal = cand;
            }
            break;
          }
        }
        if (!nextVal) continue;

        if (lower === "qc type") info.qcType = nextVal;
        else if (lower === "branch") info.branch = nextVal;
        else if (lower === "batch") info.batch = nextVal;
        else if (lower === "qc date" || lower === "date") info.qcDate = nextVal;
        else if (lower === "faculty" || lower === "faculty incharge") info.faculty = nextVal;
        else if (lower === "module incharge" || lower === "incharge") info.incharge = nextVal;
        else if (lower === "hof" || lower === "head of faculty") info.hof = nextVal;
        else if (lower === "qc assessors" || lower === "assessor" || lower === "assessors") info.assessors = nextVal;
        else if (lower === "batch strength" || lower === "strength") info.strength = nextVal;
      }
    }
  }

  var ctx = (sheetName + " " + fileName).toLowerCase();
  if (!info.branch) {
    if (ctx.indexOf("thdpz") !== -1 || ctx.indexOf("thodupuzha") !== -1) info.branch = "Thodupuzha";
    else if (ctx.indexOf("chn") !== -1 || ctx.indexOf("chennai") !== -1) info.branch = "Chennai";
    else if (ctx.indexOf("ekm") !== -1 || ctx.indexOf("ernakulam") !== -1) info.branch = "Ernakulam";
    else if (ctx.indexOf("clt") !== -1 || ctx.indexOf("calicut") !== -1) info.branch = "Calicut";
  }

  // Fallback batch name from sheet tab if tab doesn't contain a Batch metadata cell
  if (!info.batch && sheetName) {
    var parts = sheetName.split("_").filter(Boolean);
    if (parts.length >= 3) {
      info.batch = parts.slice(2).join(" ").trim();
    } else {
      info.batch = sheetName;
    }
  }

  return info;
}

function detectQCType(explicitQc, title, sheetName, fileName, markCount, settings) {
  var sources = [explicitQc, title, sheetName, fileName];
  for (var i = 0; i < sources.length; i++) {
    var t = String(sources[i] || "").toLowerCase();
    if (!t) continue;
    if (t.indexOf("cmt") !== -1) return "CMT QC";
    if (t.indexOf("soft") !== -1) return "SOFTWARE QC";
    if (t.indexOf("final") !== -1) return "FINAL QC";
    if (t.indexOf("2nd") !== -1 || t.indexOf("second") !== -1) return "2ND QC";
    if (t.indexOf("1st") !== -1 || t.indexOf("first") !== -1) return "1ST QC";
  }

  if (markCount === 7) return "1ST QC";
  if (markCount === 8) return "2ND QC";
  if (markCount === 4) return "SOFTWARE QC";
  if (markCount === 5) return "CMT QC";
  if (markCount === 10) return "FINAL QC";

  return "1ST QC";
}

// ============================================================================
// STAFF / ADMIN PANEL ACTIONS: LOAD, LOAD SINGLE BATCH, SAVE & MANAGE SHEETS
// ============================================================================
function handleStaffLoad() {
  var ss = getQCDataSpreadsheet();
  var settings = getStoredSettings(ss);

  // Load students
  var studentsSheet = ss.getSheetByName("Students");
  var students = [];
  if (studentsSheet && studentsSheet.getLastRow() >= 2) {
    var data = studentsSheet.getDataRange().getValues();
    data.slice(1).forEach(function(r) {
      if (r[0] || r[1]) {
        students.push({
          gid: cellToStr(r[0]),
          name: cellToStr(r[1]),
          branch: cellToStr(r[2]),
          batch: cellToStr(r[3]),
          faculty: cellToStr(r[4]),
          module: cellToStr(r[5]),
          admNo: cellToStr(r[6]),
          status: cellToStr(r[7]) || "Active"
        });
      }
    });
  }

  // Load branches
  var branches = getBranchRegistry(ss).map(function(b) {
    return { name: b.name, code: b.code, link: b.link, active: b.active };
  });

  // Load batch metadata across connected workbooks
  var allBooks = getAllWorkbooksToScan(ss);
  var batches = [];
  allBooks.forEach(function(book) {
    var wb = book.spreadsheet;
    var fileName = book.fileName;
    var wbDefaults = getBatchInfoTabDefaults(wb);
    wb.getSheets().forEach(function(s) {
      var name = s.getName();
      if (SYSTEM_SHEET_NAMES[name.toLowerCase()]) return;
      var parsed = parseSheetDataGeneric(s, fileName, settings, wbDefaults);
      if (parsed) {
        batches.push({
          tabName: name,
          spreadsheetId: wb.getId(),
          qcType: parsed.qcType,
          branch: parsed.info.branch || "",
          batch: parsed.info.batch || name,
          date: parsed.info.qcDate || "",
          rowCount: parsed.rows.length
        });
      } else {
        batches.push({ tabName: name, spreadsheetId: wb.getId() });
      }
    });
  });

  return {
    ok: true,
    settings: settings,
    students: students,
    branches: branches,
    batches: batches
  };
}

function handleLoadSingleBatch(p) {
  var tabName = String(p.tabName || "").trim();
  if (!tabName) return { ok: false, error: "tabName parameter is required." };

  var masterSS = getQCDataSpreadsheet();
  var settings = getStoredSettings(masterSS);
  var allBooks = getAllWorkbooksToScan(masterSS);

  for (var i = 0; i < allBooks.length; i++) {
    var wb = allBooks[i].spreadsheet;
    if (p.spreadsheetId && wb.getId() !== p.spreadsheetId) continue;
    var sheet = wb.getSheetByName(tabName);
    if (sheet) {
      var parsed = parseSheetDataGeneric(sheet, allBooks[i].fileName, settings, getBatchInfoTabDefaults(wb));
      if (!parsed) return { ok: false, error: "Could not parse sheet tab: " + tabName };
      return {
        ok: true,
        batchData: {
          tabName: tabName,
          info: parsed.info,
          rows: parsed.rows
        }
      };
    }
  }
  return { ok: false, error: "Batch sheet tab not found: " + tabName };
}

/**
 * Helper to build a dynamic Google Sheets nested IF formula for Grade / Level / Category
 * from qcDef.overall.ranges without hardcoding fixed QC thresholds.
 */
function buildGradeFormula(totalCellRef, allPartsRangeArgs, totalPartsCount, ranges) {
  if (!ranges || ranges.length === 0) return '=""';
  var sorted = ranges.slice().sort(function(a, b) { return b.min - a.min; });

  var expr = '"' + String(sorted[sorted.length - 1].label).replace(/"/g, '""') + '"';
  for (var i = sorted.length - 2; i >= 0; i--) {
    var lbl = String(sorted[i].label).replace(/"/g, '""');
    expr = 'IF(' + totalCellRef + '>=' + sorted[i].min + ',"' + lbl + '",' + expr + ')';
  }

  return '=IF(OR(' + totalCellRef + '="",COUNT(' + allPartsRangeArgs + ')<' + totalPartsCount + '),"",' + expr + ')';
}

/**
 * Saves or creates a batch mark entry sheet tab.
 * Writes live spreadsheet formulas referencing Settings!$A$2:$G$50 via VLOOKUP
 * so updating pass marks in Settings recalculates all students automatically!
 */
function handleSaveBatch(batchData) {
  if (!batchData || !batchData.info) {
    return { ok: false, error: "Missing batch data." };
  }

  var ss = getQCDataSpreadsheet();
  setupSettingsSheet(ss);

  var info = batchData.info;
  var qcType = String(info.qcType || "1ST QC").trim().toUpperCase();
  var branch = String(info.branch || "General").trim();
  var batch = String(info.batch || "Batch").trim();
  var tabName = String(batchData.tabName || (qcType + "_" + branch + "_" + batch))
    .replace(/[\/\\?*:[\]]/g, "_")
    .substring(0, 31);

  if (SYSTEM_SHEET_NAMES[tabName.toLowerCase()]) {
    return { ok: false, error: "Invalid batch tab name: " + tabName };
  }

  var sheet = ss.getSheetByName(tabName);
  if (sheet) {
    // Remove previous range protections & conditional formats before clearing values
    try {
      sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE).forEach(function(prot) {
        prot.remove();
      });
    } catch (e) {}
    try { sheet.clearConditionalFormatRules(); } catch (e) {}
    sheet.clear();
  } else {
    sheet = ss.insertSheet(tabName);
  }

  var settings = getStoredSettings(ss);
  var qcDef = settings.qcs[qcType] || settings.qcs["1ST QC"];

  // Helper for Excel-style column letters (1 -> A, 27 -> AA)
  var colLetter = function(c) {
    var l = "";
    while (c > 0) {
      var m = (c - 1) % 26;
      l = String.fromCharCode(65 + m) + l;
      c = Math.floor((c - m) / 26);
    }
    return l;
  };

  // 1. Title Row A1
  sheet.getRange("A1").setValue(String(qcDef.title || qcType).toUpperCase())
    .setFontWeight("bold").setFontSize(14);

  // 2. Rows 2-9 Info Block (B2 = QC Type used by VLOOKUP formulas!)
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

  // 3. Build Row 11 Headers & Track Column Structure
  var headers = [];
  if (qcDef.hasSn) headers.push("SN");
  var gidColIdx = headers.length + 1;
  headers.push(qcDef.idLabel || "GID");
  headers.push("Student Name");

  var markBlockSpans = []; // [{ startCol, length }] for exact 0..8 validation
  var secPlan = [];        // tracks each section's exact column positions
  var totalParts = 0;

  qcDef.sections.forEach(function(sec) {
    var partStartCol = headers.length + 1;
    sec.parts.forEach(function(p) {
      headers.push(p.name);
      totalParts++;
    });
    var partEndCol = headers.length;
    markBlockSpans.push({ startCol: partStartCol, length: sec.parts.length });

    var secScoreCol = null;
    var secPfCol = null;
    if (sec.passMark !== null && sec.passMark !== undefined) {
      headers.push(sec.name + " Score");
      secScoreCol = headers.length;
      headers.push(sec.name + " Pass/Fail");
      secPfCol = headers.length;
    }

    secPlan.push({
      sec: sec,
      partStartCol: partStartCol,
      partEndCol: partEndCol,
      partCount: sec.parts.length,
      scoreCol: secScoreCol,
      pfCol: secPfCol
    });
  });

  // Overall columns (respect custom order, e.g. CMT QC = ["Total", "Level", "Pass/Fail"])
  var overallHdrList = qcDef.overall.columnHeaders
    ? qcDef.overall.columnHeaders
    : ["Total", "Result", (qcDef.overall.labelType || "Grade")];

  var overallPlan = [];
  var overallTotalColIdx = null;
  overallHdrList.forEach(function(hdr) {
    headers.push(hdr);
    var cIdx = headers.length;
    var lower = hdr.toLowerCase();
    var kind = "grade";
    if (lower === "total" || lower === "score") {
      kind = "total";
      overallTotalColIdx = cIdx;
    } else if (lower.indexOf("pass") !== -1 || lower.indexOf("result") !== -1) {
      kind = "result";
    }
    overallPlan.push({ colIdx: cIdx, kind: kind, name: hdr });
  });

  headers.push("Remarks");

  var headerRange = sheet.getRange(11, 1, 1, headers.length);
  headerRange.setValues([headers]).setFontWeight("bold").setBackground("#e2e8f0");
  sheet.setFrozenRows(11);

  // 4. Populate Student Data & Live Spreadsheet Formulas
  var studentList = batchData.rows || [];
  var rowCount = Math.max(studentList.length, 60);
  var dataRows = [];
  var formulaColIndices = [];
  var statusColIndices = [];

  secPlan.forEach(function(sp) {
    if (sp.scoreCol) formulaColIndices.push(sp.scoreCol);
    if (sp.pfCol) {
      formulaColIndices.push(sp.pfCol);
      statusColIndices.push(sp.pfCol);
    }
  });
  overallPlan.forEach(function(op) {
    formulaColIndices.push(op.colIdx);
    if (op.kind === "result") statusColIndices.push(op.colIdx);
  });

  var totalColLet = colLetter(overallTotalColIdx);

  for (var rIdx = 0; rIdx < rowCount; rIdx++) {
    var rNum = rIdx + 12;
    var rowData = [];
    var s = (rIdx < studentList.length) ? studentList[rIdx] : null;

    if (qcDef.hasSn) rowData.push(s && s.sn !== undefined && s.sn !== "" ? s.sn : (rIdx + 1));
    rowData.push(s ? (s.gid || "") : "");
    rowData.push(s ? (s.name || "") : "");

    var allPartRangeStrings = [];
    var secPfRefs = [];

    secPlan.forEach(function(sp) {
      sp.sec.parts.forEach(function(p) {
        var m = (s && s.marks && s.marks[p.name] !== undefined && s.marks[p.name] !== "" && s.marks[p.name] !== null)
          ? Number(s.marks[p.name])
          : "";
        rowData.push(m);
      });

      var secRangeStr = colLetter(sp.partStartCol) + rNum + ":" + colLetter(sp.partEndCol) + rNum;
      allPartRangeStrings.push(secRangeStr);

      if (sp.scoreCol && sp.pfCol) {
        var scoreColLet = colLetter(sp.scoreCol);
        // Section Score Formula
        rowData.push('=IF(COUNT(' + secRangeStr + ')=0,"",SUM(' + secRangeStr + '))');

        // Section Pass/Fail Formula (Reads live pass mark from Settings!$A$2:$G$50 via VLOOKUP!)
        // Column 3 = Theory Pass Mark, Column 4 = Practical Pass Mark
        var settingsPassCol = sp.sec.name.toLowerCase().indexOf("theor") !== -1 ? 3 : 4;
        var fPf = '=IF(COUNT(' + secRangeStr + ')=0,"",IF(COUNT(' + secRangeStr + ')<' + sp.partCount + ',"PENDING",IF(' + scoreColLet + rNum + '>=VLOOKUP($B$2,Settings!$A$2:$G$50,' + settingsPassCol + ',FALSE),"PASS","FAIL")))';
        rowData.push(fPf);

        secPfRefs.push(colLetter(sp.pfCol) + rNum + '="PASS"');
      }
    });

    // Multi-range argument string containing ONLY actual mark cells (never Score columns!)
    var allPartsArgs = allPartRangeStrings.join(",");
    var totalCellRef = totalColLet + rNum;

    var fTotal = '=IF(COUNT(' + allPartsArgs + ')=0,"",SUM(' + allPartsArgs + '))';
    var fResult;
    if (qcDef.overall.rule === "SECTIONS_PASS" && secPfRefs.length > 0) {
      fResult = '=IF(COUNT(' + allPartsArgs + ')=0,"",IF(COUNT(' + allPartsArgs + ')<' + totalParts + ',"PENDING",IF(AND(' + secPfRefs.join(",") + '),"PASS","FAIL")))';
    } else {
      // Reads Overall Pass Mark from Settings column 5
      fResult = '=IF(COUNT(' + allPartsArgs + ')=0,"",IF(COUNT(' + allPartsArgs + ')<' + totalParts + ',"PENDING",IF(' + totalCellRef + '>=VLOOKUP($B$2,Settings!$A$2:$G$50,5,FALSE),"PASS","FAIL")))';
    }
    var fGrade = buildGradeFormula(totalCellRef, allPartsArgs, totalParts, qcDef.overall.ranges);

    overallPlan.forEach(function(op) {
      if (op.kind === "total") rowData.push(fTotal);
      else if (op.kind === "result") rowData.push(fResult);
      else rowData.push(fGrade);
    });

    rowData.push(s ? (s.remarks || "") : "");
    dataRows.push(rowData);
  }

  // Format GID column as Plain Text so leading zeroes are preserved
  sheet.getRange(12, gidColIdx, rowCount, 1).setNumberFormat("@");

  // Write values + live formulas in one batch call
  sheet.getRange(12, 1, dataRows.length, headers.length).setValues(dataRows);

  // 5. Data Validation: 0 to 8 ONLY on mark-entry columns (excludes Score / Pass-Fail / Total)
  var markValidation = SpreadsheetApp.newDataValidation()
    .requireNumberBetween(0, 8)
    .setAllowInvalid(false)
    .setHelpText("Maximum mark for this part is 8. Enter a number from 0 to 8 (half marks allowed).")
    .build();

  markBlockSpans.forEach(function(span) {
    sheet.getRange(12, span.startCol, rowCount, span.length).setDataValidation(markValidation);
  });

  // Duplicate GID Validation Warning (shows red triangle warning tooltip on duplicates)
  var gidColLet = colLetter(gidColIdx);
  var dupValidation = SpreadsheetApp.newDataValidation()
    .requireFormulaSatisfied('=COUNTIF($' + gidColLet + '$12:$' + gidColLet + ', ' + gidColLet + '12)<=1')
    .setAllowInvalid(true)
    .setHelpText("Duplicate GID number detected! GID must be unique within the batch.")
    .build();
  sheet.getRange(12, gidColIdx, rowCount, 1).setDataValidation(dupValidation);

  // 6. Conditional Formatting: Duplicate GID in Red; PASS = Green, FAIL = Red, PENDING = Amber
  var cfRules = [];
  cfRules.push(
    SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND(NOT(ISBLANK(' + gidColLet + '12)), COUNTIF($' + gidColLet + '$12:$' + gidColLet + ', ' + gidColLet + '12)>1)')
      .setBackground("#ffc7ce")
      .setFontColor("#9c0006")
      .setRanges([sheet.getRange(12, gidColIdx, rowCount, 1)])
      .build()
  );

  var statusRanges = statusColIndices.map(function(cIdx) {
    return sheet.getRange(12, cIdx, rowCount, 1);
  });

  if (statusRanges.length > 0) {
    cfRules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("PASS")
        .setBackground("#c6efce")
        .setFontColor("#006100")
        .setRanges(statusRanges)
        .build()
    );
    cfRules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("FAIL")
        .setBackground("#ffc7ce")
        .setFontColor("#9c0006")
        .setRanges(statusRanges)
        .build()
    );
    cfRules.push(
      SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo("PENDING")
        .setBackground("#ffeb9c")
        .setFontColor("#9c5700")
        .setRanges(statusRanges)
        .build()
    );
  }
  sheet.setConditionalFormatRules(cfRules);

  // 7. Protect Formula Columns (Warning-only so only mark-entry cells are freely editable)
  try {
    formulaColIndices.forEach(function(cIdx) {
      var protection = sheet.getRange(12, cIdx, rowCount, 1).protect();
      protection.setDescription("Protected Formula Column: " + headers[cIdx - 1]);
      protection.setWarningOnly(true);
    });
  } catch (protErr) {}

  try { sheet.autoResizeColumns(1, headers.length); } catch (e) {}

  return { ok: true, message: "Batch saved to Google Sheet tab: " + tabName, tabName: tabName };
}

function handleDeleteBatch(body) {
  var tabName = String(body.tabName || "").trim();
  if (!tabName && body.qcType && body.branch && body.batch) {
    tabName = (String(body.qcType).toUpperCase() + "_" + body.branch + "_" + body.batch)
      .replace(/[\/\\?*:[\]]/g, "_").substring(0, 31);
  }
  if (!tabName) return { ok: false, error: "Missing tabName to delete." };
  if (SYSTEM_SHEET_NAMES[tabName.toLowerCase()]) {
    return { ok: false, error: "Cannot delete protected system sheet: " + tabName };
  }

  var ss = getQCDataSpreadsheet();
  var sheet = ss.getSheetByName(tabName);
  if (sheet) {
    if (ss.getSheets().length <= 1) {
      return { ok: false, error: "Cannot delete the only remaining sheet in the workbook." };
    }
    ss.deleteSheet(sheet);
    return { ok: true, message: "Sheet tab deleted: " + tabName };
  }
  return { ok: false, error: "Sheet tab not found: " + tabName };
}

function handleSaveStudents(studentsList) {
  var ss = getQCDataSpreadsheet();
  var sheet = ss.getSheetByName("Students");
  if (!sheet) sheet = ss.insertSheet("Students");

  sheet.clear();
  sheet.appendRow(["GID", "Name", "Branch", "Batch", "Faculty", "Module", "Admission No", "Status"]);
  sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#e2e8f0");

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
    sheet.getRange(2, 1, rows.length, 1).setNumberFormat("@");
    sheet.getRange(2, 1, rows.length, 8).setValues(rows);
  }
  sheet.setFrozenRows(1);

  return { ok: true, count: (studentsList ? studentsList.length : 0) };
}

function handleSaveConfig(configObj) {
  var ss = getQCDataSpreadsheet();
  setupSettingsSheet(ss);
  var sheet = ss.getSheetByName("Settings");

  var parsed = typeof configObj === "string" ? JSON.parse(configObj) : configObj;
  var jsonStr = JSON.stringify(parsed);
  sheet.getRange("Z1").setValue(jsonStr);

  // Keep visible Settings table rows synchronized with updated config JSON
  if (parsed && parsed.qcs) {
    var qcKeys = ["1ST QC", "2ND QC", "CMT QC", "SOFTWARE QC", "FINAL QC"];
    qcKeys.forEach(function(k, idx) {
      var qDef = parsed.qcs[k];
      if (!qDef) return;
      var tSec = (qDef.sections || []).find(function(s) { return s.name.toLowerCase().indexOf("theor") !== -1; });
      var pSec = (qDef.sections || []).find(function(s) { return s.name.toLowerCase().indexOf("prac") !== -1; });
      var rNum = idx + 2;
      sheet.getRange(rNum, 1, 1, 7).setValues([[
        k,
        qDef.title || k,
        (tSec && tSec.passMark !== null && tSec.passMark !== undefined) ? Number(tSec.passMark) : "NA",
        (pSec && pSec.passMark !== null && pSec.passMark !== undefined) ? Number(pSec.passMark) : "NA",
        (qDef.overall && qDef.overall.passMark !== null && qDef.overall.passMark !== undefined) ? Number(qDef.overall.passMark) : "NA",
        (qDef.overall && qDef.overall.max) ? qDef.overall.max : "",
        (qDef.overall && qDef.overall.rule) ? qDef.overall.rule : "SECTIONS_PASS"
      ]]);
    });
  }

  return { ok: true, message: "Configuration and Settings table synced." };
}

// Save Branches List & Auto-Create Starter Batch Tab for Newly Added Branches
function handleSaveBranches(branchesList) {
  var ss = getQCDataSpreadsheet();
  var sheet = ss.getSheetByName("Branches");
  var previousBranches = {};
  if (sheet && sheet.getLastRow() >= 2) {
    sheet.getDataRange().getValues().slice(1).forEach(function(r) {
      var n = cellToStr(r[0]).toLowerCase();
      if (n) previousBranches[n] = true;
    });
  }

  if (!sheet) sheet = ss.insertSheet("Branches");
  sheet.clear();
  sheet.appendRow(["Branch Name", "Branch Code", "Workbook/Sheet link", "Active (Yes/No)"]);
  sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#e2e8f0");

  var newlyAddedActive = [];
  if (branchesList && branchesList.length > 0) {
    var rows = branchesList.map(function(b) {
      var name = String(b.name || "").trim();
      var code = String(b.code || name.substring(0, 5).toUpperCase()).trim();
      var link = String(b.link || "").trim() || ss.getUrl();
      var active = String(b.active || "Yes").trim();

      if (name && !previousBranches[name.toLowerCase()] &&
          (active.toLowerCase() === "yes" || active.toLowerCase() === "true" || active === "1")) {
        newlyAddedActive.push(name);
      }
      return [name, code, link, active];
    });
    sheet.getRange(2, 1, rows.length, 4).setValues(rows);
  }
  sheet.setFrozenRows(1);

  // Auto-create starter 1ST QC batch tab ONLY for brand-new active branches
  var existingSheetNames = ss.getSheets().map(function(s) { return s.getName().toLowerCase(); });
  newlyAddedActive.forEach(function(bName) {
    var hasExisting = existingSheetNames.some(function(n) {
      return n.indexOf(bName.toLowerCase()) !== -1;
    });
    if (!hasExisting) {
      try {
        handleSaveBatch({
          info: {
            qcType: "1ST QC",
            branch: bName,
            batch: "Batch 01",
            qcDate: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"),
            faculty: "",
            incharge: "",
            hof: "",
            assessors: ""
          },
          rows: []
        });
      } catch (e) {}
    }
  });

  return { ok: true, message: "Branches saved to Google Sheet." };
}

// Add a single New Branch and automatically create standard batch tab template
function handleAddBranch(branchData) {
  if (!branchData || !branchData.name) {
    return { ok: false, error: "Branch name is required." };
  }

  var bName = String(branchData.name).trim();
  var bCode = String(branchData.code || bName.substring(0, 5).toUpperCase()).trim();
  var ss = getQCDataSpreadsheet();
  setupBranchesSheet(ss);
  var sheet = ss.getSheetByName("Branches");

  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]).trim().toLowerCase() === bName.toLowerCase()) {
      return { ok: false, error: "Branch '" + bName + "' already exists." };
    }
  }

  sheet.appendRow([bName, bCode, branchData.link || ss.getUrl(), "Yes"]);

  try {
    handleSaveBatch({
      info: {
        qcType: "1ST QC",
        branch: bName,
        batch: "Batch 01",
        qcDate: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd"),
        faculty: "",
        incharge: "",
        hof: "",
        assessors: ""
      },
      rows: []
    });
  } catch (e) {}

  return { ok: true, message: "Branch '" + bName + "' added with starter batch template." };
}

// Save Settings Table (Updates Settings rows & syncs Z1 JSON backup)
function handleSaveSettingsTable(tableRows) {
  var ss = getQCDataSpreadsheet();
  setupSettingsSheet(ss);
  var sheet = ss.getSheetByName("Settings");

  var currentSettings = getStoredSettings(ss);

  if (tableRows && tableRows.length > 0) {
    for (var i = 0; i < tableRows.length; i++) {
      var row = tableRows[i];
      var rNum = i + 2;
      var qKey = String(row.qcType || "").trim().toUpperCase();

      sheet.getRange(rNum, 1, 1, 7).setValues([[
        qKey,
        row.title || "",
        (row.theoryPass !== undefined && row.theoryPass !== "") ? row.theoryPass : "NA",
        (row.practicalPass !== undefined && row.practicalPass !== "") ? row.practicalPass : "NA",
        (row.overallPass !== undefined && row.overallPass !== "") ? row.overallPass : "NA",
        row.maxMarks || "",
        row.passingRule || "SECTIONS_PASS"
      ]]);

      if (currentSettings.qcs && currentSettings.qcs[qKey]) {
        if (row.theoryPass !== "NA" && !isNaN(Number(row.theoryPass))) {
          var tSec = currentSettings.qcs[qKey].sections.find(function(s) {
            return s.name.toLowerCase().indexOf("theor") !== -1;
          });
          if (tSec) tSec.passMark = Number(row.theoryPass);
        }
        if (row.practicalPass !== "NA" && !isNaN(Number(row.practicalPass))) {
          var pSec = currentSettings.qcs[qKey].sections.find(function(s) {
            return s.name.toLowerCase().indexOf("prac") !== -1;
          });
          if (pSec) pSec.passMark = Number(row.practicalPass);
        }
        if (row.overallPass !== "NA" && !isNaN(Number(row.overallPass))) {
          currentSettings.qcs[qKey].overall.passMark = Number(row.overallPass);
        }
      }
    }
    sheet.getRange("Z1").setValue(JSON.stringify(currentSettings));
  }

  return { ok: true, message: "Settings table saved. All dynamic batch formulas recalculated." };
}

/**
 * Returns live Settings by starting from JSON (Z1 backup or DEFAULT_SETTINGS_JSON)
 * and overlaying live numeric pass marks read directly from the Settings sheet table!
 */
function getStoredSettings(existingSS) {
  var settings = JSON.parse(DEFAULT_SETTINGS_JSON);
  try {
    var ss = existingSS || getQCDataSpreadsheet();
    var sheet = ss.getSheetByName("Settings");
    if (sheet) {
      // Load custom lists/ranges from Z1 if valid
      try {
        var z1 = String(sheet.getRange("Z1").getValue() || "").trim();
        if (z1 && z1.charAt(0) === "{") {
          var parsedZ1 = JSON.parse(z1);
          if (parsedZ1 && parsedZ1.qcs) settings = parsedZ1;
        }
      } catch (e) {}

      // Overlay live pass marks & max marks edited directly in Settings table columns A:G
      if (sheet.getLastRow() >= 2) {
        var data = sheet.getDataRange().getValues();
        for (var i = 1; i < data.length; i++) {
          var qcKey = String(data[i][0] || "").trim().toUpperCase();
          if (!qcKey || !settings.qcs[qcKey]) continue;

          var titleVal = String(data[i][1] || "").trim();
          var tPass = data[i][2];
          var pPass = data[i][3];
          var oPass = data[i][4];
          var maxM = data[i][5];

          if (titleVal) settings.qcs[qcKey].title = titleVal;

          if (tPass !== "NA" && tPass !== "" && !isNaN(Number(tPass))) {
            var theorySec = settings.qcs[qcKey].sections.find(function(s) {
              return s.name.toLowerCase().indexOf("theor") !== -1;
            });
            if (theorySec) theorySec.passMark = Number(tPass);
          }
          if (pPass !== "NA" && pPass !== "" && !isNaN(Number(pPass))) {
            var pracSec = settings.qcs[qcKey].sections.find(function(s) {
              return s.name.toLowerCase().indexOf("prac") !== -1;
            });
            if (pracSec) pracSec.passMark = Number(pPass);
          }
          if (oPass !== "NA" && oPass !== "" && !isNaN(Number(oPass))) {
            settings.qcs[qcKey].overall.passMark = Number(oPass);
          }
          if (maxM !== "" && !isNaN(Number(maxM))) {
            settings.qcs[qcKey].overall.max = Number(maxM);
          }
        }
      }
    }
  } catch (e) {}

  return settings;
}
