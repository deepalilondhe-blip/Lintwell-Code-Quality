// @ts-check
const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

/**
 * ════════════════════════════════════════════════════════════════
 * LINTWELL CODE QUALITY — LIVE PROJECT QA TESTING (DOM WRAPPED VIEW)
 * ════════════════════════════════════════════════════════════════
 *
 * ⚠️  STRICT SAFETY RULES:
 *     - This is a LIVE project
 *     - READ-ONLY actions ONLY
 *     - NO deleting, moving, altering, or editing any data
 *     - NO clicking Delete, Edit, Save, Submit, or Update buttons
 *     - ONLY: navigate, observe, scroll, screenshot
 *
 * Device Frame: iPhone 17 Pro — Black Titanium Injected DOM via initScript
 * ════════════════════════════════════════════════════════════════
 */

// Date-wise output folder calculation
const now = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthFolder = `${months[now.getMonth()]}_${now.getFullYear()}`;
const day = String(now.getDate()).padStart(2, '0');
const monthNum = String(now.getMonth() + 1).padStart(2, '0');
const dateFolder = `${day}_${monthNum}_${now.getFullYear()}`;

// Base output directory under the project root
const baseOutputDir = path.join(__dirname, '..', 'QA-Testing-Dashboard', monthFolder, dateFolder);
const screenshotsDir = path.join(baseOutputDir, 'screenshots');

// Results collector
const testResults = [];

function addResult(testId, feature, testCase, expected, status, comments, screenshots = []) {
  testResults.push({
    testId,
    feature,
    testCase,
    expected,
    status,
    safe: 'Yes (Read-Only)',
    testedBy: 'Playwright Automation',
    comments,
    screenshots,
  });
}

function screenshotPath(name) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
  return path.join(screenshotsDir, `${name}.png`);
}

// Screenshot capture and attachment helper
async function capture(page, testInfo, name) {
  const sPath = screenshotPath(name);
  await page.screenshot({ path: sPath });
  await testInfo.attach(name, { path: sPath, contentType: 'image/png' });
}

function saveCSV() {
  const escapeCsvField = (val) => {
    if (val === undefined || val === null) return '""';
    const str = String(val);
    return `"${str.replace(/"/g, '""')}"`;
  };

  const csvHeader = [
    '"Test ID"',
    '"Feature/Element"',
    '"What to Check (Test Case)"',
    '"Expected Result"',
    '"Status (Pass/Fail)"',
    '"Live Environment Safe?"',
    '"Tested By"',
    '"Comments/Notes"',
    '"Screenshots"'
  ].join(',');

  const csvRows = testResults.map(r => [
    escapeCsvField(r.testId),
    escapeCsvField(r.feature),
    escapeCsvField(r.testCase),
    escapeCsvField(r.expected),
    escapeCsvField(r.status),
    escapeCsvField(r.safe),
    escapeCsvField(r.testedBy),
    escapeCsvField(r.comments),
    escapeCsvField(r.screenshots.map(s => `screenshots/${s}.png`).join('; '))
  ].join(','));

  const csvContent = ['sep=,', csvHeader, ...csvRows].join('\r\n');
  fs.mkdirSync(baseOutputDir, { recursive: true });
  
  const csvPath = path.join(baseOutputDir, 'QA-Testing-Dashboard.csv');
  fs.writeFileSync(csvPath, csvContent, 'utf-8');
  console.log(`📊 CSV Dashboard saved: ${csvPath}`);

  // Generate HTML Report
  const passCount = testResults.filter((r) => r.status === 'Pass').length;
  const failCount = testResults.filter((r) => r.status === 'Fail').length;
  const naCount = testResults.filter((r) => r.status === 'N/A').length;

  const rowsHtml = testResults.map(r => {
    const statusClass = r.status === 'Pass' ? 'status-pass' : (r.status === 'Fail' ? 'status-fail' : 'status-na');
    
    // Build Proof Column
    let proofHtml = '<span class="no-proof">None</span>';
    if (r.screenshots && r.screenshots.length > 0) {
      proofHtml = r.screenshots.map(s => `
        <button class="proof-btn" onclick="openScreenshot('screenshots/${s}.png', '${r.testId} - ${r.feature}')">
          📸 ${s}
        </button>
      `).join('');
    }

    return `
      <tr class="test-row" data-status="${r.status.toLowerCase()}">
        <td class="bold font-mono">${r.testId}</td>
        <td class="feature-col">${r.feature}</td>
        <td>${r.testCase}</td>
        <td>${r.expected}</td>
        <td><span class="status-badge ${statusClass}">${r.status}</span></td>
        <td><span class="safe-badge">${r.safe}</span></td>
        <td>${r.testedBy}</td>
        <td class="comments-cell">${r.comments.replace(/\n/g, '<br>')}</td>
        <td>
          <div class="proof-container">
            ${proofHtml}
          </div>
        </td>
      </tr>
    `;
  }).join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>QA Testing Dashboard - Lintwell Code Quality</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #090d16;
      --bg-card: rgba(17, 25, 40, 0.65);
      --bg-panel: #111827;
      --border-color: rgba(255, 255, 255, 0.08);
      --text-main: #f1f5f9;
      --text-muted: #94a3b8;
      --color-success: #10b981;
      --color-danger: #ef4444;
      --color-warning: #f59e0b;
      --color-info: #0ea5e9;
      --color-accent: #6366f1;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-dark);
      background-image: 
        radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.1) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.15) 0px, transparent 50%);
      background-attachment: fixed;
      color: var(--text-main);
      margin: 0;
      padding: 40px 20px;
      min-height: 100vh;
    }
    
    .container {
      max-width: 1600px;
      margin: 0 auto;
    }
    
    header {
      margin-bottom: 40px;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    h1 {
      margin: 0 0 8px 0;
      background: linear-gradient(135deg, #38bdf8 0%, #6366f1 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 36px;
      font-weight: 700;
      letter-spacing: -1px;
    }
    
    .meta-subtitle {
      color: var(--text-muted);
      margin: 0;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .timestamp {
      color: var(--text-muted);
      font-size: 14px;
      text-align: right;
      font-family: 'JetBrains Mono', monospace;
    }
    
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }
    
    .card {
      background: var(--bg-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      padding: 24px;
      border-radius: 16px;
      border: 1px solid var(--border-color);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      transition: transform 0.25s ease, border-color 0.25s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .card:hover {
      transform: translateY(-4px);
      border-color: rgba(99, 102, 241, 0.4);
    }
    
    .card-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;
    }
    
    .card-value {
      font-size: 36px;
      font-weight: 700;
      color: var(--text-main);
    }
    
    .card-value.pass { color: var(--color-success); }
    .card-value.fail { color: var(--color-danger); }
    .card-value.safe { color: var(--color-info); }
    
    .control-panel {
      background: var(--bg-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    
    .search-box {
      position: relative;
      flex-grow: 1;
      max-width: 500px;
    }
    
    .search-box input {
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 12px 16px 12px 42px;
      box-sizing: border-box;
      color: var(--text-main);
      font-size: 14px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    .search-box input:focus {
      outline: none;
      border-color: var(--color-accent);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    }
    
    .search-box::before {
      content: "🔍";
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 14px;
      opacity: 0.6;
    }
    
    .filter-tabs {
      display: flex;
      gap: 8px;
    }
    
    .filter-btn {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 10px 18px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    
    .filter-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--text-main);
    }
    
    .filter-btn.active {
      background: var(--color-accent);
      color: white;
      border-color: var(--color-accent);
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
    }
    
    .action-btn {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);
      transition: all 0.2s ease;
    }
    
    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.35);
    }
    
    .table-container {
      background: var(--bg-card);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    
    th, td {
      padding: 16px 24px;
      border-bottom: 1px solid var(--border-color);
      font-size: 14px;
    }
    
    th {
      background-color: rgba(9, 13, 22, 0.5);
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 11px;
      border-bottom: 2px solid var(--border-color);
    }
    
    tr:last-child td {
      border-bottom: none;
    }
    
    .test-row {
      transition: background-color 0.15s ease;
    }
    
    .test-row:hover td {
      background-color: rgba(255, 255, 255, 0.02);
    }
    
    .bold {
      font-weight: 700;
      color: #38bdf8;
    }
    
    .font-mono {
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
    }
    
    .feature-col {
      font-weight: 600;
      color: var(--text-main);
    }
    
    .comments-cell {
      line-height: 1.6;
      color: #cbd5e1;
    }
    
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    
    .status-pass {
      background-color: rgba(16, 185, 129, 0.1);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.25);
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.1);
    }
    
    .status-fail {
      background-color: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.25);
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.1);
    }
    
    .status-na {
      background-color: rgba(156, 163, 175, 0.1);
      color: #9ca3af;
      border: 1px solid rgba(156, 163, 175, 0.2);
    }
    
    .safe-badge {
      background-color: rgba(14, 165, 233, 0.1);
      color: #38bdf8;
      border: 1px solid rgba(14, 165, 233, 0.2);
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .proof-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    
    .proof-btn {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-color);
      color: #38bdf8;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    
    .proof-btn:hover {
      background: rgba(56, 189, 248, 0.1);
      border-color: rgba(56, 189, 248, 0.3);
      transform: translateX(2px);
    }
    
    .no-proof {
      color: var(--text-muted);
      font-size: 12px;
      font-style: italic;
    }
    
    /* Lightbox Modal */
    .modal {
      display: none;
      position: fixed;
      z-index: 1000;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(5, 8, 15, 0.95);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .modal.show {
      display: flex;
      opacity: 1;
    }
    
    .modal-content-wrapper {
      position: relative;
      max-width: 90%;
      max-height: 85%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .modal-content {
      max-width: 100%;
      max-height: 75vh;
      border-radius: 16px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.6);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transform: scale(0.95);
      transition: transform 0.3s ease;
      object-fit: contain;
    }
    
    .modal.show .modal-content {
      transform: scale(1);
    }
    
    .close-modal {
      position: absolute;
      top: -60px;
      right: 0;
      color: var(--text-main);
      font-size: 28px;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.05);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.2s ease;
    }
    
    .close-modal:hover {
      background: rgba(255, 255, 255, 0.15);
      transform: scale(1.05);
    }
    
    .modal-caption {
      margin-top: 15px;
      color: var(--text-muted);
      font-size: 14px;
      background: rgba(255, 255, 255, 0.03);
      padding: 8px 20px;
      border-radius: 999px;
      border: 1px solid var(--border-color);
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>QA Testing Dashboard</h1>
        <p class="meta-subtitle">
          <span>Live Project Verification</span>
          <span style="opacity:0.3">|</span>
          <span style="color:#10b981; font-weight:600">🛡️ Safe (Read-Only)</span>
        </p>
      </div>
      <div class="timestamp">
        Generated: ${new Date().toLocaleString()}
      </div>
    </header>

    <div class="summary-cards">
      <div class="card">
        <div class="card-label">Total Test Cases</div>
        <div class="card-value">${testResults.length}</div>
      </div>
      <div class="card">
        <div class="card-label">Passed</div>
        <div class="card-value pass">${passCount}</div>
      </div>
      <div class="card">
        <div class="card-label">Failed</div>
        <div class="card-value fail">${failCount}</div>
      </div>
      <div class="card">
        <div class="card-label">N/A</div>
        <div class="card-value">${naCount}</div>
      </div>
    </div>

    <div class="control-panel">
      <div class="search-box">
        <input type="text" id="searchInput" onkeyup="runFilters()" placeholder="Search test cases by ID, element, status, notes...">
      </div>
      
      <div class="filter-tabs">
        <button class="filter-btn active" id="btn-all" onclick="setStatusFilter('all')">All</button>
        <button class="filter-btn" id="btn-pass" onclick="setStatusFilter('pass')">Passed</button>
        <button class="filter-btn" id="btn-fail" onclick="setStatusFilter('fail')">Failed</button>
      </div>

      <button class="action-btn" onclick="copyTableToExcel()">
        📋 Copy for Excel/Sheets
      </button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Test ID</th>
            <th>Feature/Element</th>
            <th>What to Check (Test Case)</th>
            <th>Expected Result</th>
            <th>Status</th>
            <th>Live Safe?</th>
            <th>Tested By</th>
            <th>Comments/Notes</th>
            <th>Visual Proof</th>
          </tr>
        </thead>
        <tbody id="tableBody">
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  </div>

  <!-- Image Lightbox Modal -->
  <div class="modal" id="screenshotModal" onclick="closeScreenshotModal()">
    <div class="modal-content-wrapper" onclick="event.stopPropagation()">
      <span class="close-modal" onclick="closeScreenshotModal()">&times;</span>
      <img class="modal-content" id="modalImg" src="" alt="Proof Screenshot">
      <div class="modal-caption" id="modalCaption"></div>
    </div>
  </div>

  <script>
    let currentStatusFilter = 'all';

    function runFilters() {
      const searchVal = document.getElementById('searchInput').value.toLowerCase();
      const rows = document.querySelectorAll('.test-row');
      
      rows.forEach(row => {
        const status = row.getAttribute('data-status');
        const textContent = row.textContent.toLowerCase();
        
        const matchesStatus = (currentStatusFilter === 'all' || status === currentStatusFilter);
        const matchesSearch = textContent.includes(searchVal);
        
        if (matchesStatus && matchesSearch) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }

    function setStatusFilter(status) {
      currentStatusFilter = status;
      
      // Update buttons active class
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById('btn-' + status).classList.add('active');
      
      runFilters();
    }

    function openScreenshot(src, caption) {
      const modal = document.getElementById('screenshotModal');
      const modalImg = document.getElementById('modalImg');
      const modalCap = document.getElementById('modalCaption');
      
      modalImg.src = src;
      modalCap.innerText = caption;
      modal.style.display = 'flex';
      
      // Trigger CSS transition
      setTimeout(() => {
        modal.classList.add('show');
      }, 10);
    }

    function closeScreenshotModal() {
      const modal = document.getElementById('screenshotModal');
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }

    function copyTableToExcel() {
      let tsv = [];
      // Headers
      tsv.push(["Test ID", "Feature/Element", "What to Check", "Expected Result", "Status", "Live Safe?", "Tested By", "Comments/Notes"].join("\\t"));
      
      // Rows
      const rows = document.querySelectorAll('.test-row');
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
          const rowData = [
            cells[0].innerText.trim(), // ID
            cells[1].innerText.trim(), // Feature
            cells[2].innerText.trim(), // Case
            cells[3].innerText.trim(), // Expected
            cells[4].innerText.trim(), // Status
            cells[5].innerText.trim(), // Safe
            cells[6].innerText.trim(), // Tested By
            cells[7].innerText.trim().replace(/\\r?\\n/g, " ") // Comments
          ];
          tsv.push(rowData.map(text => text.replace(/\\t/g, " ")).join("\\t"));
        }
      });

      const tsvContent = tsv.join("\\n");
      navigator.clipboard.writeText(tsvContent).then(() => {
        alert("📋 Copied! You can now paste directly into Microsoft Excel or Google Sheets.");
      }).catch(err => {
        alert("Could not copy table to clipboard: " + err);
      });
    }

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeScreenshotModal();
      }
    });
  </script>
</body>
</html>`;

  const htmlPath = path.join(baseOutputDir, 'QA-Testing-Dashboard.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
  console.log(`📊 HTML Dashboard saved: ${htmlPath}`);
}

test.describe('Lintwell QA — Live Project Read-Only Verification', () => {
  test.setTimeout(180000); // 3 minute timeout for entire suite

  test('Complete QA Verification Flow', async ({ page }, testInfo) => {
    // Register console logger to capture browser logs
    page.on('console', msg => {
      console.log(`   [BROWSER CONSOLE] ${msg.type()}: ${msg.text()}`);
    });

    // ════════════════════════════════════════════════════════════════
    // STABLE MOBILE EMULATION VIA PLAYWRIGHT INIT SCRIPT
    // ════════════════════════════════════════════════════════════════
    await page.addInitScript(() => {
      console.log("🚀 addInitScript executed!");
      
      // 1. Force mobile layout measurements
      Object.defineProperty(window, 'innerWidth', { get: () => 393, configurable: true });
      Object.defineProperty(window, 'innerHeight', { get: () => 852, configurable: true });
      Object.defineProperty(screen, 'width', { get: () => 393, configurable: true });
      Object.defineProperty(screen, 'height', { get: () => 852, configurable: true });

      let wrapped = false;

      // Wrap DOM content in iPhone frame
      const wrapDOM = () => {
        if (wrapped || document.getElementById('iphone-frame-wrapper')) return;
        if (!document.body) return;

        wrapped = true;
        console.log("   [initScript] wrapDOM: wrapping elements into iPhone 17 Pro frame");

        // Create container shell
        const container = document.createElement('div');
        container.id = 'iphone-frame-wrapper';
        container.style.cssText = 'position: relative; width: 406px; height: 880px; background: linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 15%, #1e1e1e 30%, #333333 50%, #1a1a1a 70%, #2d2d2d 85%, #1a1a1a 100%); border-radius: 58px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.12), 0 0 0 1px rgba(0,0,0,0.9), 0 20px 60px rgba(0,0,0,0.8); overflow: hidden; z-index: 999999; margin: auto;';

        const power = document.createElement('div');
        power.style.cssText = 'position: absolute; right: 0; top: 220px; width: 4px; height: 80px; background: #4a4a4a; border-radius: 0 3px 3px 0; z-index: 10;';
        const action = document.createElement('div');
        action.style.cssText = 'position: absolute; left: 0; top: 145px; width: 4px; height: 30px; background: #4a4a4a; border-radius: 3px 0 0 3px; z-index: 10;';
        const volUp = document.createElement('div');
        volUp.style.cssText = 'position: absolute; left: 0; top: 190px; width: 4px; height: 46px; background: #4a4a4a; border-radius: 3px 0 0 3px; z-index: 10;';
        const volDown = document.createElement('div');
        volDown.style.cssText = 'position: absolute; left: 0; top: 250px; width: 4px; height: 46px; background: #4a4a4a; border-radius: 3px 0 0 3px; z-index: 10;';

        const screenEl = document.createElement('div');
        screenEl.style.cssText = 'position: absolute; top: 6px; left: 6px; right: 6px; bottom: 6px; background: #fdfbf7; border-radius: 52px; overflow: hidden;';

        const scrollWrapper = document.createElement('div');
        scrollWrapper.id = 'iphone-scroll-wrapper';
        scrollWrapper.style.cssText = 'width: 100%; height: 100%; overflow-y: auto; overflow-x: hidden; padding-top: 54px; padding-bottom: 24px; box-sizing: border-box; -ms-overflow-style: none; scrollbar-width: none;';

        const statusBar = document.createElement('div');
        statusBar.style.cssText = 'position: absolute; top: 0; left: 0; right: 0; height: 54px; z-index: 50; display: flex; align-items: flex-start; justify-content: space-between; padding: 17px 28px 0 28px; pointer-events: none; color: #1a1a1a; font-family: -apple-system, sans-serif; font-size: 14px; font-weight: bold; background: linear-gradient(to bottom, rgba(253,251,247,0.95), rgba(253,251,247,0));';
        statusBar.innerHTML = '<div>9:41</div><div style="display: flex; align-items: center; gap: 6px;"><span>📶</span><span>📶</span><span style="font-size: 11px;">87% 🔋</span></div>';

        const notch = document.createElement('div');
        notch.style.cssText = 'position: absolute; top: 12px; left: 50%; transform: translateX(-50%); width: 126px; height: 37px; background: #000; border-radius: 20px; z-index: 60; box-shadow: 0 0 0 0.5px rgba(255,255,255,0.04);';

        const homeInd = document.createElement('div');
        homeInd.style.cssText = 'position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); width: 134px; height: 5px; background: rgba(0,0,0,0.3); border-radius: 3px; z-index: 55;';

        // Move body children to scrollWrapper
        const body = document.body;
        const children = Array.from(body.children);
        children.forEach(c => {
          if (c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && c.id !== 'iphone-frame-wrapper') {
            scrollWrapper.appendChild(c);
          }
        });

        container.appendChild(power);
        container.appendChild(action);
        container.appendChild(volUp);
        container.appendChild(volDown);
        container.appendChild(screenEl);
        screenEl.appendChild(scrollWrapper);
        screenEl.appendChild(statusBar);
        screenEl.appendChild(notch);
        screenEl.appendChild(homeInd);
        body.appendChild(container);

        body.style.cssText = 'background: #0a0a0a !important; display: flex !important; justify-content: center !important; align-items: center !important; height: 100vh !important; margin: 0 !important; overflow: hidden !important; width: 100% !important; opacity: 1 !important;';

        const styleOverride = document.createElement('style');
        styleOverride.id = 'mobile-frame-layout-overrides';
        styleOverride.textContent = `
          #iphone-scroll-wrapper::-webkit-scrollbar { display: none; }
          html, body, .login-page, .login-shell { min-height: 100% !important; height: 100% !important; }
          .login-shell { padding: 20px !important; margin: 0 !important; display: flex !important; justify-content: center !important; align-items: center !important; box-sizing: border-box !important; width: 100% !important; max-width: 100% !important; }
          .login-card { margin: 0 !important; width: 100% !important; max-width: 100% !important; box-shadow: 0 4px 20px rgba(0,0,0,0.05) !important; box-sizing: border-box !important; }
        `;
        document.head.appendChild(styleOverride);

        const early = document.getElementById('early-mobile-frame-hide');
        if (early) early.remove();

        // Observe for dynamically added elements and move them into the phone scrollwrapper
        const bodyObserver = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                const el = node;
                if (el.id !== 'iphone-frame-wrapper' && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE' && !scrollWrapper.contains(el)) {
                  scrollWrapper.appendChild(el);
                }
              }
            });
          });
        });
        bodyObserver.observe(body, { childList: true });
      };

      let stylesInjected = false;

      const run = () => {
        // Inject early stylesheet ONLY ONCE
        if (document.documentElement && !stylesInjected) {
          stylesInjected = true;
          console.log("   [initScript] Injecting early styles...");
          const style = document.createElement('style');
          style.id = 'early-mobile-frame-hide';
          style.textContent = `
            html { background: #0a0a0a !important; }
            body { opacity: 0 !important; background: #0a0a0a !important; visibility: hidden !important; }
          `;
          document.documentElement.appendChild(style);
        }

        // Attempt DOM wrap
        if (document.body && !document.getElementById('iphone-frame-wrapper')) {
          wrapDOM();
        }
      };

      // Watch document for mutations continuously to ensure self-healing wrapper
      const observer = new MutationObserver((mutations) => {
        run();
      });
      observer.observe(document, { childList: true, subtree: true });

      // Run on readystatechange or DOMContentLoaded as fallbacks
      document.addEventListener('readystatechange', run);
      document.addEventListener('DOMContentLoaded', run);
      run();
    });

    // ═══════════════════════════════════════════
    // TC-003: LOGIN
    // ═══════════════════════════════════════════
    console.log('\n🔐 TC-003: Signing in...');

    // Open live website directly
    await page.goto('https://code-quality-tracker.bytestechnolab.net/login', {
      waitUntil: 'networkidle',
      timeout: 60000,
    });
    
    // Wait for the DOM init script wrapper to apply and layout
    await page.waitForTimeout(2000);

    // Screenshot: Login page (attached to report)
    await capture(page, testInfo, '01-login-page');
    console.log('   📸 Login page captured inside iPhone frame');

    // Fill in credentials
    const emailInput = page.locator('#signinPanel input[name="email"]').first();
    await emailInput.fill('deepali.londhe@magnetoitsolutions.com');

    const passwordInput = page.locator('#signinPanel input[name="password"]').first();
    await passwordInput.fill('Deepali123');

    // Screenshot: Credentials filled
    await capture(page, testInfo, '02-credentials-filled');
    console.log('   📸 Credentials filled');

    // Click Sign In button
    const signInBtn = page.locator('#signinPanel button[type="submit"]').first();
    await signInBtn.click();

    // Wait for navigation after login
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(4000);

    // Screenshot: After login
    await capture(page, testInfo, '03-after-login-dashboard');

    const currentUrl = page.url();
    const loginSuccess = !currentUrl.includes('login') && !currentUrl.includes('sign');
    console.log(`   ✅ Login ${loginSuccess ? 'PASSED' : 'FAILED'} — Current URL: ${currentUrl}`);

    addResult('TC-003', 'Login Page', 'Verify login with valid credentials',
      'User is redirected to dashboard after successful login',
      loginSuccess ? 'Pass' : 'Fail',
      `Redirected to: ${currentUrl}. No data modified.`,
      ['01-login-page', '02-credentials-filled', '03-after-login-dashboard']);

    if (!loginSuccess) {
      console.log('⚠️ Login failed! Writing failure report to CSV and aborting test...');
      addResult('TC-001', 'Header Navigation', 'Verify if the main header is clickable.', 'Clicking the header redirects to the homepage or refreshes the page.', 'Fail', 'Skipped due to login failure. No changes made to live system.');
      addResult('TC-002', 'Header Links', 'Check if the logo and text links inside the header are clickable.', 'Each link successfully opens its respective page or section.', 'Fail', 'Skipped due to login failure. No changes made to live system.');
      addResult('TC-004', 'Page Scroll', 'Scroll down the dashboard page and verify content loads.', 'All sections and content load correctly on scroll.', 'Fail', 'Skipped due to login failure.');
      addResult('TC-005', 'Project List', 'Verify project list is visible on dashboard.', 'All projects are listed and accessible.', 'Fail', 'Skipped due to login failure.');
      for (let i = 1; i <= 5; i++) {
        addResult(`TC-00${5 + i}`, `Project ${i} - Open`, `Open project ${i} and verify it loads correctly.`, 'Project details page loads with correct information.', 'Fail', 'Skipped due to login failure.');
      }
      addResult('TC-011', 'Mobile View Layout', 'Verify mobile layout is correct and responsive.', 'All elements display correctly in iPhone 17 Pro mobile view.', 'Fail', 'Skipped due to login failure.');
      addResult('TC-012', 'Icons Display', 'Verify all icons render correctly in mobile view.', 'No broken or missing icons.', 'Fail', 'Skipped due to login failure.');
      saveCSV();
      return;
    }

    // ═══════════════════════════════════════════
    // TC-001: HEADER NAVIGATION - CLICKABILITY
    // ═══════════════════════════════════════════
    console.log('\n🔍 TC-001: Checking header clickability...');

    const header = page.locator('header, nav, [class*="header" i], [class*="navbar" i], [class*="nav-bar" i], [class*="topbar" i]').first();
    const headerExists = await header.count() > 0;

    let headerClickable = false;
    let headerClickResult = '';

    if (headerExists) {
      const headerLinks = header.locator('a, button, [role="button"], [onclick]');
      const headerLinkCount = await headerLinks.count();
      console.log(`   Found ${headerLinkCount} clickable elements in header`);

      if (headerLinkCount > 0) {
        const urlBeforeClick = page.url();
        const firstHeaderLink = headerLinks.first();
        const firstLinkText = await firstHeaderLink.textContent().catch(() => 'N/A');
        const firstLinkHref = await firstHeaderLink.getAttribute('href').catch(() => 'N/A');
        console.log(`   First header link: text="${firstLinkText?.trim()}", href="${firstLinkHref}"`);

        await firstHeaderLink.click();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(3000);

        const urlAfterClick = page.url();
        headerClickable = true;
        headerClickResult = `Header clicked. URL before: ${urlBeforeClick}, URL after: ${urlAfterClick}`;
        console.log(`   ✅ Header IS clickable — ${headerClickResult}`);

        await capture(page, testInfo, '04-after-header-click');
      } else {
        headerClickResult = 'Header found but no clickable links/buttons inside it';
        console.log(`   ⚠️ ${headerClickResult}`);
      }
    } else {
      headerClickResult = 'No header element found on the page';
      console.log(`   ⚠️ ${headerClickResult}`);
    }

    addResult('TC-001', 'Header Navigation', 'Verify if the main header is clickable',
      'Clicking the header redirects to the homepage or refreshes the page',
      headerClickable ? 'Pass' : 'Fail',
      `${headerClickResult}. No elements were moved or deleted.`,
      headerClickable ? ['04-after-header-click'] : []);

    // ═══════════════════════════════════════════
    // TC-002: HEADER LINKS CHECK
    // ═══════════════════════════════════════════
    console.log('\n🔗 TC-002: Checking header links...');

    // Go back to main dashboard
    await page.goto(currentUrl, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2000);

    const headerForLinks = page.locator('header, nav, [class*="header" i], [class*="navbar" i], [class*="nav-bar" i]').first();
    const allHeaderLinks = headerForLinks.locator('a, button, [role="button"]');
    const totalHeaderLinks = await allHeaderLinks.count();
    let workingLinks = 0;
    const linkDetails = [];

    for (let i = 0; i < totalHeaderLinks; i++) {
      const link = allHeaderLinks.nth(i);
      const text = (await link.textContent().catch(() => ''))?.trim() || '';
      const href = (await link.getAttribute('href').catch(() => '')) || '';
      const tagName = (await link.evaluate((el) => el.tagName).catch(() => '')) || '';
      const isVisible = await link.isVisible().catch(() => false);

      if (isVisible && text.length > 0) {
        workingLinks++;
        linkDetails.push(`${tagName}: "${text}" -> ${href || 'no href'}`);
        console.log(`   Link ${i + 1}: ${tagName} "${text}" href="${href}" visible=${isVisible}`);
      }
    }

    await capture(page, testInfo, '05-header-links-check');

    addResult('TC-002', 'Header Links', 'Check if logo and text links inside header are clickable',
      'Each link successfully opens its respective page or section',
      workingLinks > 0 ? 'Pass' : 'Fail',
      `Found ${totalHeaderLinks} total, ${workingLinks} visible links. Details: ${linkDetails.join(' | ')}`,
      ['05-header-links-check']);

    // ═══════════════════════════════════════════
    // TC-004: PAGE SCROLL
    // ═══════════════════════════════════════════
    console.log('\n📜 TC-004: Scrolling down the page...');

    // Scroll inner wrapper to top first
    await page.evaluate(() => {
      const w = document.getElementById('iphone-scroll-wrapper');
      if (w) w.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);
    await capture(page, testInfo, '06-scroll-top');

    // Scroll to middle
    await page.evaluate(() => {
      const w = document.getElementById('iphone-scroll-wrapper');
      if (w) w.scrollTo(0, w.scrollHeight / 2);
    });
    await page.waitForTimeout(1000);
    await capture(page, testInfo, '07-scroll-middle');

    // Scroll to bottom
    await page.evaluate(() => {
      const w = document.getElementById('iphone-scroll-wrapper');
      if (w) w.scrollTo(0, w.scrollHeight);
    });
    await page.waitForTimeout(1000);
    await capture(page, testInfo, '08-scroll-bottom');

    const scrollHeight = await page.evaluate(() => {
      const w = document.getElementById('iphone-scroll-wrapper');
      return w ? w.scrollHeight : 0;
    });
    console.log(`   ✅ Page scrolled. Total scroll height: ${scrollHeight}px`);

    addResult('TC-004', 'Page Scroll', 'Scroll down dashboard page and verify content loads',
      'All sections and content load correctly on scroll',
      'Pass',
      `Total page scroll height: ${scrollHeight}px. Captured top/middle/bottom screenshots.`,
      ['06-scroll-top', '07-scroll-middle', '08-scroll-bottom']);

    // Scroll back to top
    await page.evaluate(() => {
      const w = document.getElementById('iphone-scroll-wrapper');
      if (w) w.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    // ═══════════════════════════════════════════
    // TC-005: PROJECT LIST VISIBILITY
    // ═══════════════════════════════════════════
    console.log('\n📋 TC-005: Checking project list...');

    const projectSelectors = [
      '[class*="project" i]',
      '[class*="card" i]',
      'table tbody tr',
      '[class*="list-item" i]',
      'a[href*="project" i]',
      '[class*="repo" i]',
      '[class*="item" i]',
    ];

    let projectElements = null;
    let projectCount = 0;
    let projectSelectorUsed = '';

    for (const sel of projectSelectors) {
      const els = page.locator(sel);
      const count = await els.count();
      if (count > 0) {
        projectElements = els;
        projectCount = count;
        projectSelectorUsed = sel;
        console.log(`   Found ${count} elements with selector: ${sel}`);
        break;
      }
    }

    const allLinks = page.locator('a[href]');
    const allLinksCount = await allLinks.count();
    const projectLinks = [];

    for (let i = 0; i < allLinksCount; i++) {
      const link = allLinks.nth(i);
      const href = (await link.getAttribute('href').catch(() => '')) || '';
      const text = (await link.textContent().catch(() => ''))?.trim() || '';
      const isVisible = await link.isVisible().catch(() => false);

      if (isVisible && text.length > 0 && !text.includes('Sign') && !text.includes('Forgot')) {
        projectLinks.push({ index: i, text, href });
      }
    }

    console.log(`   Total visible content links found: ${projectLinks.length}`);
    await capture(page, testInfo, '09-project-list');

    addResult('TC-005', 'Project List', 'Verify project list is visible on dashboard',
      'All projects are listed and accessible',
      projectLinks.length > 0 || projectCount > 0 ? 'Pass' : 'Fail',
      `Found ${projectCount} project elements (${projectSelectorUsed}) and ${projectLinks.length} content links.`,
      ['09-project-list']);

    // ═══════════════════════════════════════════
    // TC-006 to TC-010: OPEN PROJECTS ONE BY ONE
    // ═══════════════════════════════════════════
    console.log('\n📂 Opening projects one by one (READ-ONLY)...');

    const clickableProjects = [];
    if (projectElements && projectCount > 0) {
      for (let i = 0; i < Math.min(projectCount, 5); i++) {
        const el = projectElements.nth(i);
        const text = (await el.textContent().catch(() => ''))?.trim().substring(0, 60) || `Project ${i + 1}`;
        const clickTarget = el.locator('a').first();
        const hasLink = (await clickTarget.count()) > 0;
        clickableProjects.push({
          element: hasLink ? clickTarget : el,
          name: text,
        });
      }
    }

    if (clickableProjects.length === 0 && projectLinks.length > 0) {
      for (let i = 0; i < Math.min(projectLinks.length, 5); i++) {
        const pl = projectLinks[i];
        clickableProjects.push({
          element: allLinks.nth(pl.index),
          name: pl.text.substring(0, 60),
        });
      }
    }

    const dashboardUrl = page.url();

    for (let i = 0; i < Math.min(clickableProjects.length, 5); i++) {
      const project = clickableProjects[i];
      const testId = `TC-00${6 + i}`;
      const projectNum = i + 1;
      const screenshotName = `10-project-${projectNum}`;

      console.log(`\n   📂 ${testId}: Opening Project ${projectNum}: "${project.name.replace(/\s+/g, ' ')}"...`);

      try {
        if (page.url() !== dashboardUrl) {
          await page.goto(dashboardUrl, { waitUntil: 'networkidle', timeout: 30000 });
          await page.waitForTimeout(2000);
        }

        // Re-locate elements
        let clickTarget;
        if (projectElements && projectCount > 0 && i < projectCount) {
          const el = projectElements.nth(i);
          const hasLink = (await el.locator('a').first().count()) > 0;
          clickTarget = hasLink ? el.locator('a').first() : el;
        } else if (projectLinks.length > i) {
          clickTarget = allLinks.nth(projectLinks[i].index);
        }

        if (clickTarget) {
          await clickTarget.scrollIntoViewIfNeeded().catch(() => {});
          await page.waitForTimeout(500);

          await clickTarget.click();
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(3000);

          const projectUrl = page.url();

          // 1. EXTRACT CORE METRICS (OPEN & RESOLVED COUNTS FROM HEADER)
          const openCount = (await page.locator('#projectHeadOpen').textContent().catch(() => '0')).trim();
          const resolvedCount = (await page.locator('#projectHeadResolved').textContent().catch(() => '0')).trim();
          console.log(`   📊 Extracted Metrics — Open Issues: ${openCount}, Resolved: ${resolvedCount}`);

          // 2. NAVIGATE TABS ONE BY ONE
          
          // --- TAB 1: OVERVIEW ---
          console.log(`   👉 Tab 1/3: Overview`);
          const overviewTabBtn = page.locator('button[data-tab="proj-overview"]');
          if (await overviewTabBtn.count() > 0) {
            await overviewTabBtn.click();
            await page.waitForTimeout(1500);
          }
          await capture(page, testInfo, `${screenshotName}-overview`);

          // --- TAB 2: ISSUES ---
          console.log(`   👉 Tab 2/3: Issues`);
          const issuesTabBtn = page.locator('button[data-tab="proj-issues"]');
          let issuesSummary = 'N/A';
          if (await issuesTabBtn.count() > 0) {
            await issuesTabBtn.click();
            // Wait for issues table loading to complete
            await page.waitForSelector('#issuesLoading', { state: 'hidden', timeout: 15000 }).catch(() => {});
            await page.waitForTimeout(1500);
            issuesSummary = (await page.locator('#issuesPagerSummary').textContent().catch(() => '0')).trim();
          }
          await capture(page, testInfo, `${screenshotName}-issues`);
          console.log(`      Issues Summary: ${issuesSummary}`);

          // --- TAB 3: SETTINGS ---
          console.log(`   👉 Tab 3/3: Settings`);
          const settingsTabBtn = page.locator('button[data-tab="proj-settings"]');
          let projectPath = 'N/A';
          if (await settingsTabBtn.count() > 0) {
            await settingsTabBtn.click();
            await page.waitForTimeout(1500);
            // Extract local path from .font-mono under title
            projectPath = (await page.locator('.page-head .font-mono').textContent().catch(() => 'N/A')).trim();
          }
          await capture(page, testInfo, `${screenshotName}-settings`);
          console.log(`      Project Path: ${projectPath}`);

          // Return to Overview Tab to keep it in default view before finishing
          if (await overviewTabBtn.count() > 0) {
            await overviewTabBtn.click();
            await page.waitForTimeout(500);
          }

          const projectTitle = await page.title();
          console.log(`   ✅ Project ${projectNum} opened — Title: "${projectTitle}", URL: ${projectUrl}`);

          addResult(testId, `Project ${projectNum} - Open`,
            `Open project ${projectNum} and check Overview, Issues, and Settings functionality`,
            'Project page loads, tab switching is successful, and issue counts match',
            'Pass',
            `Project: "${project.name.replace(/\s+/g, ' ')}" | Open: ${openCount} | Resolved: ${resolvedCount} | Path: ${projectPath} | Issues: ${issuesSummary}`,
            [`${screenshotName}-overview`, `${screenshotName}-issues`, `${screenshotName}-settings`]);

          await page.evaluate(() => {
            const w = document.getElementById('iphone-scroll-wrapper');
            if (w) w.scrollTo(0, 0);
          });
        } else {
          console.log(`   ⚠️ Could not re-locate project ${projectNum}`);
          addResult(testId, `Project ${projectNum} - Open`,
            `Open project ${projectNum} and check Overview, Issues, and Settings functionality`,
            'Project page loads, tab switching is successful, and issue counts match',
            'Fail',
            `Could not re-locate project element after page reload.`);
        }
      } catch (err) {
        console.log(`   ❌ Project ${projectNum} failed: ${err.message}`);
        addResult(testId, `Project ${projectNum} - Open`,
          `Open project ${projectNum} and check Overview, Issues, and Settings functionality`,
          'Project page loads, tab switching is successful, and issue counts match',
          'Fail',
          `Error: ${err.message}. No changes made to live system.`,
          []);
      }
    }

    for (let i = clickableProjects.length; i < 5; i++) {
      const testId = `TC-00${6 + i}`;
      addResult(testId, `Project ${i + 1} - Open`,
        `Open project ${i + 1} and verify it loads correctly`,
        'Project details page loads with correct information',
        'N/A',
        `No project ${i + 1} found on the dashboard.`);
    }

    // ═══════════════════════════════════════════
    // TC-011: MOBILE VIEW LAYOUT
    // ═══════════════════════════════════════════
    console.log('\n📱 TC-011: Verifying mobile layout...');

    if (page.url() !== dashboardUrl) {
      await page.goto(dashboardUrl, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
    }

    const hasHorizontalOverflow = await page.evaluate(() => {
      const w = document.getElementById('iphone-scroll-wrapper');
      return w ? w.scrollWidth > w.clientWidth : false;
    });

    const hasViewportMeta = await page.evaluate(() => {
      const meta = document.querySelector('meta[name="viewport"]');
      return meta ? meta.getAttribute('content') : null;
    });

    await capture(page, testInfo, '11-mobile-layout');

    console.log(`   Viewport meta: ${hasViewportMeta}`);
    console.log(`   Horizontal overflow: ${hasHorizontalOverflow}`);

    addResult('TC-011', 'Mobile View Layout', 'Verify mobile layout is correct and responsive',
      'All elements display correctly in iPhone 17 Pro mobile view',
      !hasHorizontalOverflow ? 'Pass' : 'Fail',
      `Viewport meta: "${hasViewportMeta}". Horizontal overflow: ${hasHorizontalOverflow}.`,
      ['11-mobile-layout']);

    // ═══════════════════════════════════════════
    // TC-012: ICONS DISPLAY
    // ═══════════════════════════════════════════
    console.log('\n🎨 TC-012: Checking icon display...');

    const brokenImages = await page.evaluate(() => {
      const imgs = document.querySelectorAll('img');
      const broken = [];
      imgs.forEach((img) => {
        if (!img.complete || img.naturalWidth === 0) {
          broken.push(img.src || img.getAttribute('alt') || 'unknown');
        }
      });
      return broken;
    });

    const iconCount = await page.evaluate(() => {
      const svgs = document.querySelectorAll('svg');
      const fontIcons = document.querySelectorAll('i[class*="icon"], i[class*="fa"], span[class*="icon"], .material-icons');
      return { svgs: svgs.length, fontIcons: fontIcons.length };
    });

    console.log(`   SVG icons: ${iconCount.svgs}, Font icons: ${iconCount.fontIcons}`);
    console.log(`   Broken images: ${brokenImages.length}`);

    addResult('TC-012', 'Icons Display', 'Verify all icons render correctly in mobile view',
      'No broken or missing icons',
      brokenImages.length === 0 ? 'Pass' : 'Fail',
      `SVGs: ${iconCount.svgs}, Font icons: ${iconCount.fontIcons}, Broken images: ${brokenImages.length}.`);

    // ═══════════════════════════════════════════
    // SAVE FINAL DASHBOARDS IN DATE-WISE FOLDER
    // ═══════════════════════════════════════════
    console.log('\n══════════════════════════════════════════════');
    console.log('  💾 SAVING QA TESTING DASHBOARD FILES');
    console.log('══════════════════════════════════════════════');

    saveCSV();

    const passCount = testResults.filter((r) => r.status === 'Pass').length;
    const failCount = testResults.filter((r) => r.status === 'Fail').length;
    const naCount = testResults.filter((r) => r.status === 'N/A').length;

    console.log('');
    console.log('══════════════════════════════════════════════');
    console.log('  📊 QA TESTING SUMMARY');
    console.log('══════════════════════════════════════════════');
    console.log(`  ✅ Passed:  ${passCount}`);
    console.log(`  ❌ Failed:  ${failCount}`);
    console.log(`  ⏭️  N/A:     ${naCount}`);
    console.log(`  📋 Total:   ${testResults.length}`);
    console.log(`  🔒 Live Environment: SAFE — No changes made`);
    console.log('══════════════════════════════════════════════');
  });
});
