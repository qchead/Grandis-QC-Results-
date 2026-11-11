/**
 * ============================================================================
 * GRANDIS TECHNOLOGY Pvt. Ltd. - R&D Department
 * QC Result Management System - Configuration & Shared Utilities
 * ============================================================================
 */

// ============================================================================
// 1. BACKEND GOOGLE APPS SCRIPT WEB APP URL (PASTE YOUR DEPLOYED URL HERE)
// ============================================================================
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxPZw2lzFzwxltDx37RQc1_vEusxx1S7Dx7llOkv4KQYDNgLKPkSxFowVrY5xxLcZbtbQ/exec";

// Set to true ONLY if you explicitly want to test locally with offline mock data.
const USE_MOCK = false;

// Alias for backwards compatibility
const API_URL = GOOGLE_SCRIPT_URL;

// Supported Branches & QC Assessment Types
const DEFAULT_BRANCHES = [
  { name: "Thodupuzha", code: "THDPZ", link: "", active: "Yes" },
  { name: "Chennai", code: "CHN", link: "", active: "Yes" },
  { name: "Ernakulam", code: "EKM", link: "", active: "Yes" },
  { name: "Calicut", code: "CLT", link: "", active: "Yes" }
];
const BRANCHES = DEFAULT_BRANCHES.filter(b => b.active === "Yes").map(b => b.name);
const QCS = ["1ST QC", "2ND QC", "CMT QC", "SOFTWARE QC", "FINAL QC"];

// Default System Configuration (Editable via Settings tab in qc-sheet.html)
const DEFAULT_SETTINGS = {
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
          passMark: 20,
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
        columnHeaders: ["Score", "Pass/ Fail", "Category"],
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
};

// HTML Escaping Utility (prevents XSS vulnerabilities)
function esc(str) {
  if (str === null || str === undefined) return "";
  return String(str).replace(/[&<>"']/g, c => {
    switch (c) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return c;
    }
  });
}

// Convert any Date/ISO string to strict dd-mm-yyyy format without time
// Convert any Date, ISO string, or string like "Wed Nov 11 2026" to strict dd-mm-yyyy
function formatDateDDMMYYYY(val) {
  if (!val) return '-';

  // 1. If it's a Date object or valid parseable text date
  const parsed = (val instanceof Date) ? val : new Date(val);
  if (!isNaN(parsed.getTime()) && typeof val !== 'number') {
    const day = String(parsed.getDate()).padStart(2, '0');
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const year = parsed.getFullYear();
    if (year > 1970) {
      return `${day}-${month}-${year}`;
    }
  }

  // 2. Fallback for strings
  let str = String(val).trim();
  if (str.includes('T')) str = str.split('T')[0];
  
  const parts = str.split(/[-/.]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[2].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[0]}`;
    }
    return `${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}-${parts[2]}`;
  }

  return str;
}

// Convert numbers into standard English words for official marks sheet
function numberToWords(num) {
  if (num === null || num === undefined || isNaN(num)) return "-";
  const whole = Math.floor(num);
  const frac = Math.round((num - whole) * 10);

  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function toW(n) {
    if (n === 0) return "Zero";
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " and " + toW(n % 100) : "");
    return String(n);
  }

  let res = toW(whole);
  if (frac > 0) {
    res += " Point " + (ones[frac] || frac);
  }
  return res + " Marks Only";
}

/**
 * Universal QC Computation Engine
 * Implements all QC rules:
 * - Each mark 0..8
 * - Dynamic fallback for max marks calculation
 * - Dynamic fallback for grade calculation
 */
function evaluateQC(qcDef, marksObj) {
  let totalEntered = 0;
  let totalParts = 0;
  let grandTotal = 0;
  let sectionsSummary = [];
  let allSectionsPassed = true;

  qcDef.sections.forEach(sec => {
    let secEntered = 0;
    let secTotal = 0;
    let secMax = sec.parts.reduce((acc, p) => acc + (p.max || 8), 0);

    sec.parts.forEach(part => {
      totalParts++;
      const val = marksObj[part.name];
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        const num = parseFloat(val);
        if (!isNaN(num)) {
          secTotal += num;
          secEntered++;
          totalEntered++;
        }
      }
    });

    let secStatus = "";
    if (secEntered === 0) {
      secStatus = "";
    } else if (secEntered < sec.parts.length) {
      secStatus = "PENDING";
    } else {
      if (sec.passMark !== null && sec.passMark !== undefined) {
        secStatus = (secTotal >= sec.passMark) ? "PASS" : "FAIL";
        if (secStatus === "FAIL") allSectionsPassed = false;
      } else {
        secStatus = "COMPLETED";
      }
    }

    sectionsSummary.push({
      name: sec.name,
      entered: secEntered,
      count: sec.parts.length,
      total: secTotal,
      max: secMax,
      passMark: sec.passMark,
      status: secStatus
    });

    grandTotal += secTotal;
  });

  // Calculate safe fallback for max marks by summing parts if qcDef.overall.max is undefined
  let calculatedMax = 0;
  qcDef.sections.forEach(sec => {
    sec.parts.forEach(p => {
      calculatedMax += (p.max || 8);
    });
  });

  const overallMax = (qcDef.overall && qcDef.overall.max) ? qcDef.overall.max : calculatedMax;
  let overallResult = "";
  let overallLabel = "";
  let isPending = false;
  let isComplete = false;

  if (totalEntered === 0) {
    overallResult = "";
    overallLabel = "";
  } else if (totalEntered < totalParts) {
    overallResult = "PENDING";
    overallLabel = "";
    isPending = true;
  } else {
    isComplete = true;
    if (qcDef.overall && qcDef.overall.rule === "SECTIONS_PASS") {
      overallResult = allSectionsPassed ? "PASS" : "FAIL";
    } else {
      const minPass = (qcDef.overall && qcDef.overall.passMark) || 0;
      overallResult = (grandTotal >= minPass) ? "PASS" : "FAIL";
    }

    // Determine Grade / Level / Category using qcDef ranges or safe standard thresholds
    const defaultRanges = [
      { min: Math.round(overallMax * 0.85), label: "A" },
      { min: Math.round(overallMax * 0.70), label: "B" },
      { min: 0, label: "C" }
    ];
    const activeRanges = (qcDef.overall && qcDef.overall.ranges && qcDef.overall.ranges.length)
      ? qcDef.overall.ranges
      : defaultRanges;

    for (const r of activeRanges) {
      if (grandTotal >= r.min) {
        overallLabel = r.label;
        break;
      }
    }
  }

  const percentage = totalEntered > 0 && overallMax > 0
    ? ((grandTotal / overallMax) * 100).toFixed(1)
    : "";

  return {
    totalEntered,
    totalParts,
    grandTotal: totalEntered > 0 ? grandTotal : "",
    overallMax,
    percentage,
    overallResult,
    overallLabel,
    labelType: (qcDef.overall && qcDef.overall.labelType) || "Grade",
    isPending,
    isComplete,
    sections: sectionsSummary
  };
}

// -------------------------------------------------------------
// OFFLINE MOCK DATABASE
// -------------------------------------------------------------
const OFFLINE_DB = {
  batches: [
    { branch: "Thodupuzha", qc: "1ST QC", batch: "Batch 24" },
    { branch: "Thodupuzha", qc: "1ST QC", batch: "Batch 23" },
    { branch: "Thodupuzha", qc: "2ND QC", batch: "Batch 24" },
    { branch: "Thodupuzha", qc: "SOFTWARE QC", batch: "Batch 24" },
    { branch: "Thodupuzha", qc: "CMT QC", batch: "Batch 24" },
    { branch: "Thodupuzha", qc: "FINAL QC", batch: "Batch 24" },
    { branch: "Chennai", qc: "1ST QC", batch: "Batch 18" },
    { branch: "Chennai", qc: "FINAL QC", batch: "Batch 18" }
  ],
  students: [
    { gid: "DEMO1001", name: "Anjali S", branch: "Thodupuzha", batch: "Batch 24", faculty: "Mr. Anand Kumar", module: "Module 1", admNo: "ADM-2026-001", status: "Active" },
    { gid: "DEMO1002", name: "Rahul M", branch: "Thodupuzha", batch: "Batch 24", faculty: "Mr. Anand Kumar", module: "Module 1", admNo: "ADM-2026-002", status: "Active" },
    { gid: "DEMO1003", name: "Gokul Krishnan", branch: "Thodupuzha", batch: "Batch 24", faculty: "Mr. Anand Kumar", module: "Module 1", admNo: "ADM-2026-003", status: "Active" },
    { gid: "DEMO1004", name: "Deepa Menon", branch: "Thodupuzha", batch: "Batch 24", faculty: "Mr. Anand Kumar", module: "Module 1", admNo: "ADM-2026-004", status: "Active" },
    { gid: "DEMO1005", name: "Fathima Noor", branch: "Thodupuzha", batch: "Batch 24", faculty: "Mr. Anand Kumar", module: "Module 1", admNo: "ADM-2026-005", status: "Active" },
    { gid: "DEMO1006", name: "Arjun Ramesh", branch: "Thodupuzha", batch: "Batch 24", faculty: "Mr. Anand Kumar", module: "Module 1", admNo: "ADM-2026-006", status: "Active" }
  ],
  records: {
    "1ST QC": {
      "Thodupuzha_Batch 24": {
        info: {
          qcType: "1ST QC",
          qcDate: "2026-10-15",
          faculty: "Mr. Anand Kumar",
          incharge: "Mr. Vignesh R",
          hof: "Dr. K. R. Sharma",
          branch: "Thodupuzha",
          batch: "Batch 24",
          assessors: "R&D Quality Team (Er. Gokul / Er. Nithin)",
          strength: 6
        },
        rows: [
          {
            gid: "DEMO1001",
            name: "Anjali S",
            marks: { "Identification": 5.5, "Checking": 5, "Multimeter": 6, "Logic": 4.5, "JUM/COM": 6, "Connector": 6, "IC": 6 },
            remarks: "Theory re-evaluation recommended"
          },
          {
            gid: "DEMO1002",
            name: "Rahul M",
            marks: { "Identification": 7.5, "Checking": 7, "Multimeter": 8, "Logic": 7.5, "JUM/COM": 7, "Connector": 6.5, "IC": 7.5 },
            remarks: "Excellent grasp of circuitry"
          },
          {
            gid: "DEMO1003",
            name: "Gokul Krishnan",
            marks: { "Identification": 8, "Checking": 7.5, "Multimeter": 8, "Logic": 8, "JUM/COM": 7.5, "Connector": 8, "IC": 7.5 },
            remarks: "Outstanding overall performance"
          },
          {
            gid: "DEMO1004",
            name: "Deepa Menon",
            marks: { "Identification": 6.5, "Checking": 6, "Multimeter": 6.5, "Logic": 6, "JUM/COM": 5.5, "Connector": 6, "IC": 6.5 },
            remarks: "Good effort"
          },
          {
            gid: "DEMO1005",
            name: "Fathima Noor",
            marks: { "Identification": 7, "Checking": 7, "Multimeter": 6.5, "Logic": 7, "JUM/COM": 7, "Connector": 6, "IC": 7 },
            remarks: "Very neat micro-soldering"
          },
          {
            gid: "DEMO1006",
            name: "Arjun Ramesh",
            marks: { "Identification": 4, "Checking": 5, "Multimeter": "", "Logic": "", "JUM/COM": "", "Connector": "", "IC": "" },
            remarks: "Evaluation in progress"
          }
        ]
      }
    }
  }
};

/**
 * Returns true when GOOGLE_SCRIPT_URL has been set to a real deployed Apps Script URL.
 */
function isGoogleSheetConfigured() {
  const scriptUrl = (typeof GOOGLE_SCRIPT_URL !== "undefined" ? GOOGLE_SCRIPT_URL : (typeof API_URL !== "undefined" ? API_URL : "")).trim();
  return Boolean(scriptUrl && scriptUrl !== "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE" && scriptUrl.startsWith("http"));
}

/**
 * Universal API Helper
 */
async function api(action, params = {}, method = "GET", bodyData = null) {
  const scriptUrl = (typeof GOOGLE_SCRIPT_URL !== "undefined" ? GOOGLE_SCRIPT_URL : (typeof API_URL !== "undefined" ? API_URL : "")).trim();
  const isOnlineConfigured = isGoogleSheetConfigured();
  const isMock = (typeof USE_MOCK !== "undefined" && USE_MOCK === true);

  if (isMock || !isOnlineConfigured) {
    return handleOfflineApi(action, params, method, bodyData);
  }

  let canonicalAction = action;
  if (action === "listBatches") canonicalAction = "batches";
  if (action === "studentGetResult") canonicalAction = "login";

  const url = new URL(scriptUrl);
  url.searchParams.set("action", canonicalAction);
  url.searchParams.set("_t", Date.now());

  Object.keys(params).forEach(k => {
    if (params[k] !== undefined && params[k] !== null && k !== "_t") {
      url.searchParams.set(k, params[k]);
    }
  });

  const options = {
    method: method,
    headers: {},
    cache: "no-store"
  };

  if (method === "POST" && bodyData) {
    options.headers["Content-Type"] = "text/plain;charset=utf-8";
    options.body = typeof bodyData === "string" ? bodyData : JSON.stringify(bodyData);
  }

  try {
    const res = await fetch(url.toString(), options);
    const text = await res.text();

    if (text.trim().startsWith("<") || text.includes("<html") || text.includes("Google Drive – Access Denied")) {
      const err = "Cannot connect to result server. Check the Sheet URL / deployment (ensure 'Execute as: Me' and 'Who has access: Anyone').";
      console.error("Apps Script HTML Response:", text);
      throw new Error(err);
    }

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (parseErr) {
      console.error("Non-JSON Server Response:", text);
      throw new Error("Cannot connect to result server. Check the Sheet URL / deployment (invalid JSON response).");
    }

    return parsed;
  } catch (err) {
    console.error("API Error connecting to Google Sheet:", err);
    if (err.message && err.message.startsWith("Cannot connect to result server")) {
      throw err;
    }
    throw new Error("Cannot connect to result server. Check the Sheet URL / deployment.");
  }
}

/**
 * Offline & Local Storage Engine
 */
async function handleOfflineApi(action, params, method, bodyData) {
  let act = action;
  if (act === "listBatches") act = "batches";
  if (act === "studentGetResult") act = "login";

  await new Promise(r => setTimeout(r, 80));

  if (act === "batches") {
    const branch = (params.branch || "").trim().toLowerCase();
    const qc = (params.qc || "").trim().toUpperCase();

    let customBatches = [];
    try {
      const saved = localStorage.getItem("grandis_qc_saved_batches");
      if (saved) customBatches = JSON.parse(saved);
    } catch (e) {}

    const allBatches = [...OFFLINE_DB.batches, ...customBatches];
    const filtered = allBatches.filter(b => {
      const matchBranch = !branch || (b.branch || '').toLowerCase() === branch;
      const matchQc = !qc || (b.qc || '').toUpperCase() === qc;
      return matchBranch && matchQc;
    }).map(b => b.batch);

    const uniqueBatches = Array.from(new Set(filtered.filter(Boolean)));
    return { ok: true, batches: uniqueBatches };
  }

  if (act === "branches") {
    let branches = DEFAULT_BRANCHES;
    try {
      const saved = localStorage.getItem("grandis_qc_branches");
      if (saved) branches = JSON.parse(saved);
    } catch (e) {}
    const active = branches.filter(b => (b.active || '').toLowerCase() === 'yes').map(b => b.name);
    return { ok: true, branches: active.length > 0 ? active : ["Thodupuzha", "Chennai", "Ernakulam", "Calicut"] };
  }

  if (act === "login") {
    const branch = (params.branch || "").trim();
    const qc = (params.qc || "").trim().toUpperCase();
    const batch = (params.batch || "").trim();
    const gid = (params.gid || "").trim().toUpperCase();
    const password = (params.password || "").trim();

    if (!gid) return { ok: false, error: "Please enter your GID Number." };
    if (!password) return { ok: false, error: "Please enter your Password." };
    if (password.toUpperCase() !== gid) {
      return { ok: false, error: "Invalid password. Your password is your GID number." };
    }

    let currentSettings = DEFAULT_SETTINGS;
    try {
      const savedS = localStorage.getItem("grandis_qc_settings");
      if (savedS) currentSettings = JSON.parse(savedS);
    } catch (e) {}

    const qcDef = (currentSettings.qcs && currentSettings.qcs[qc]) || DEFAULT_SETTINGS.qcs[qc] || DEFAULT_SETTINGS.qcs["1ST QC"];
    let foundResults = [];

    function checkAndAddStudent(sheetInfo, rows) {
      if (!sheetInfo || !rows || !Array.isArray(rows)) return;
      const sQc = (sheetInfo.qcType || "").trim().toUpperCase();
      const sBranch = (sheetInfo.branch || "").trim().toLowerCase();
      const sBatch = (sheetInfo.batch || "").trim().toLowerCase();

      const matchQc = !qc || sQc === qc;
      const matchBranch = !branch || sBranch === branch.toLowerCase();
      const matchBatch = !batch || batch.toLowerCase() === "(all batches)" || sBatch === batch.toLowerCase();

      if (matchQc && matchBranch && matchBatch) {
        const studentRow = rows.find(r => (r.gid || "").trim().toUpperCase() === gid);
        if (studentRow) {
          foundResults.push({
            info: sheetInfo,
            row: {
              gid: studentRow.gid,
              name: studentRow.name,
              m: studentRow.marks || studentRow.m || {},
              grade: studentRow.grade || "",
              remarks: studentRow.remarks || ""
            }
          });
        }
      }
    }

    if (OFFLINE_DB.records[qc]) {
      const qcBatches = OFFLINE_DB.records[qc];
      Object.keys(qcBatches).forEach(batchKey => {
        const bData = qcBatches[batchKey];
        if (bData) checkAndAddStudent(bData.info, bData.rows);
      });
    }

    if (foundResults.length === 0) {
      return {
        ok: false,
        error: `No records found for GID ${gid} in ${qc} (${branch || 'Selected Branch'}).`
      };
    }

    return {
      ok: true,
      q: qcDef,
      results: foundResults
    };
  }

  return { ok: false, error: "Action '" + action + "' not supported." };
}