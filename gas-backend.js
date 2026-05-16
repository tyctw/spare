// ==========================================
// 1. 系統喚醒與 API 接收處理
// ==========================================

const INVITATION_SHEET_ID = "1HktioFq3G_3i7tSbSsrCvuH5ucqxKPobFuEqDvtOJP0"; // 替換為你的 Google Sheets ID
const INVITATION_SHEET_NAME = "InvitationLog"; // 設定工作表名稱
const LOG_SHEET_ID = '10rBKIqUNRBz8MM5bW5eAeF54FcP0OGO5nLuMJClwj6Q'; // 請確保此 ID 正確，且裡面有「Logs」工作表

function doGet(e) {
  // GET 請求處理
  const action = e && e.parameter && e.parameter.action;
  
  if (action === 'wakeup') {
    return ContentService.createTextOutput("System is awake and ready!");
  }
  
  if (action === 'getInvitationCode') {
    return getInvitationCode();
  }
  
  return ContentService.createTextOutput("這是會考落點分析系統的後端 API。");
}

function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;

    // 處理邀請碼驗證
    if (action === 'validateInvitationCode') {
      return validateInvitationCode(params.invitationCode);
    }

    // 處理分數計算 (原始邏輯)
    const scores = params.scores;
    if (scores) {
      const filters = params.filters;
      const region = params.region;

      // 記錄請求
      logToSheet(region, '接收請求', JSON.stringify(params));

      // 根據地區獲取學校資料和計分邏輯
      const { schoolData, calculateScoresFunc, filterSchoolsFunc } = getRegionConfig(region);

      // 計算分數和學分
      const scoreResult = calculateScoresFunc(scores);
      const totalPoints = scoreResult.totalPoints;
      const totalCredits = scoreResult.totalCredits || null;

      logToSheet(region, '計算結果', `總分: ${totalPoints}, 學分: ${totalCredits}`);

      // 過濾符合條件的學校
      const eligibleSchools = filterSchoolsFunc(schoolData, totalPoints, totalCredits, filters, scores);
      logToSheet(region, '篩選結果', `符合學校數: ${eligibleSchools.length}`);

      // 準備返回結果
      const response = { totalPoints };
      
      // 攔截竹苗區的 totalCredits，不要回傳到前端顯示
      if (totalCredits !== null && region !== 'hsinchu') {
        response.totalCredits = totalCredits;
      }
      
      response.eligibleSchools = eligibleSchools;

      return ContentService.createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({ error: 'Invalid action or missing scores' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // 錯誤處理機制
    let region = '未知';
    try {
      if (e.postData && e.postData.contents) {
        const p = JSON.parse(e.postData.contents);
        if (p.region) region = p.region;
      }
    } catch (_) {}

    logToSheet(region, '錯誤', `${error.message}\n${error.stack}`);
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ==========================================
// 邀請碼相關邏輯
// ==========================================

// 產生邀請碼
function generateInvitationCode(dateObj) {
  // 將原本的分鐘邏輯改為你需要的產碼邏輯
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hour = String(dateObj.getHours()).padStart(2, '0');
  // 假設預設前綴為 TW
  return `TW${year}${month}${day}${hour}`;
}

// 產生邀請碼並記錄
function getInvitationCode() {
  const now = new Date();
  const invitationCode = generateInvitationCode(now);
  
  // 記錄邀請碼生成
  logInvitationToSheet("生成", invitationCode, now, "成功");

  return ContentService.createTextOutput(JSON.stringify({ invitationCode }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 驗證邀請碼並記錄
function validateInvitationCode(invitationCode) {
  const now = new Date();
  const prefixes = ['TYCTW', 'TW', 'CTTW', 'KHTW', 'CHCTW'];
  const currentHour = String(now.getHours()).padStart(2, '0');
  const previousHour = String(new Date(now.getTime() - 3600000).getHours()).padStart(2, '0');
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const validCodes = prefixes.flatMap(prefix => [
      `${prefix}${year}${month}${day}${currentHour}`,
      `${prefix}${year}${month}${day}${previousHour}`
  ]);

  const valid = validCodes.includes(invitationCode);
  
  logInvitationToSheet("驗證", invitationCode, now, valid ? "成功" : "失敗");
  return ContentService.createTextOutput(JSON.stringify({ valid }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 記錄邀請碼到 Google Sheets
function logInvitationToSheet(action, invitationCode, timestamp, status) {
  try {
    const sheet = SpreadsheetApp.openById(INVITATION_SHEET_ID).getSheetByName(INVITATION_SHEET_NAME);
    if (!sheet) {
      console.error("找不到工作表：" + INVITATION_SHEET_NAME);
      return;
    }
    sheet.appendRow([new Date(), action, invitationCode, status]);
  } catch (e) {
    console.error("邀請碼 Log 寫入失敗: ", e.message);
  }
}

// ==========================================
// 2. 系統日誌與資料讀取
// ==========================================

// 記錄 log 到試算表
function logToSheet(region, action, message) {
  try {
    const sheet = SpreadsheetApp.openById(LOG_SHEET_ID).getSheetByName('Logs');
    if (sheet) {
      sheet.appendRow([new Date(), region, action, message]);
    }
  } catch(e) {
    // 如果紀錄寫入失敗，不影響主程式運行
    console.error("Log 寫入失敗: ", e.message);
  }
}

// 根據地區返回配置（試算表 ID、計分邏輯、過濾邏輯）
function getRegionConfig(region) {
  const configs = {
    'taoyuan': {
      spreadsheetId: '1JNgY20zkJqPdFzvp73TKj5HG0c2wgIXAnzAMvCzuWk4',
      calculateScores: calculateTaoyuanScores,
      filterSchools: filterSchoolsWithSorting
    },
    'kaohsiung': {
      spreadsheetId: '1xz32z-XljP_x6FhG0TSswyL4UFtJ-YIUi7OXcUNWICI',
      calculateScores: calculateKaohsiungScores,
      filterSchools: filterSchoolsWithSorting
    },
    'central': {
      spreadsheetId: '1PNOeR-BPQsmQr27wjJPJ7gni6vH3fTr6paYIytUVQGY',
      calculateScores: calculateCentralScores,
      filterSchools: filterSchoolsWithSorting
    },
    'changhua': {
      spreadsheetId: '11KV9vlOUQ2ncJ_Wlr5XmFMeznZ1TdtKctZ-_ZVQSTNg',
      calculateScores: calculateChanghuaScores,
      filterSchools: filterSchoolsWithSorting
    },
    'taipei': {
      spreadsheetId: '1Xn3NaeU8eFtTqnDl5OfsVj4Q544xqCQgzIaIwOO8kEY',
      calculateScores: calculateTaipeiScores,
      filterSchools: filterSchoolsWithSorting
    },
    'tainan': {
      spreadsheetId: '1i394ipC-B0kkxO66SJdMxFH1MojabuEvfd4zGG7ML-w',
      calculateScores: calculateTainanScores,
      filterSchools: filterSchoolsWithSorting
    },
    'hsinchu': { // 竹苗區
      spreadsheetId: '1SyfWIuNqGSsy30IB548w9XXxhxRXW3cpGkPGpTsRLxw', // ★ 您的竹苗區資料庫試算表 ID
      calculateScores: calculateHsinchuScores,
      filterSchools: filterSchoolsWithSorting
    }
  };

  if (!configs[region]) throw new Error('無效的地區指定: ' + region);

  const config = configs[region];
  return {
    schoolData: getSchoolData(config.spreadsheetId),
    calculateScoresFunc: config.calculateScores,
    filterSchoolsFunc: config.filterSchools
  };
}

// 從試算表獲取學校資料 (🚀 具備 CacheService 快取優化版本)
function getSchoolData(spreadsheetId) {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'schoolData_' + spreadsheetId;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  
  const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  const formattedData = data.slice(1).map(row => ({
    name: row[0],
    points: row[1],
    credits: row[2] || null,
    type: row[3] || row[2],
    ownership: row[4] || row[3],
    group: row[5] || row[4],
    minRequirements: {
      chinese: row[6] || null,
      english: row[7] || null,
      math: row[8] || null,
      science: row[9] || null,
      social: row[10] || null
    }
  }));

  try {
    cache.put(cacheKey, JSON.stringify(formattedData), 21600);
  } catch (e) {
    console.error("快取寫入失敗: ", e.message);
  }
  
  return formattedData;
}

// ==========================================
// 3. 學校過濾與排序邏輯
// ==========================================

function filterSchoolsWithSorting(schools, totalPoints, totalCredits, filters, scores) {
  return schools.filter(school => {
    const matchesOwnership = filters.schoolOwnership === 'all' || school.ownership === filters.schoolOwnership;
    const matchesType = filters.schoolType === 'all' || school.type === filters.schoolType;

    let matchesGroup = true;
    if (filters.vocationalGroups && filters.vocationalGroups.length > 0 && !filters.vocationalGroups.includes('all')) {
      matchesGroup = filters.vocationalGroups.includes(school.group);
    }

    const pointsMatch = totalPoints >= school.points;
    const creditsMatch = school.credits === null || school.credits === '' || (pointsMatch && (totalPoints > school.points || totalCredits >= school.credits));

    let meetsMinRequirements = true;
    if (totalPoints === school.points && (school.credits === null || school.credits === '' || totalCredits === school.credits)) {
      const scoreValues = { 'A++': 9, 'A+': 8, 'A': 7, 'B++': 6, 'B+': 5, 'B': 4, 'C': 3 };

      meetsMinRequirements =
        (!school.minRequirements.chinese || (scoreValues[scores.chinese] >= school.minRequirements.chinese)) &&
        (!school.minRequirements.english || (scoreValues[scores.english] >= school.minRequirements.english)) &&
        (!school.minRequirements.math || (scoreValues[scores.math] >= school.minRequirements.math)) &&
        (!school.minRequirements.science || (scoreValues[scores.science] >= school.minRequirements.science)) &&
        (!school.minRequirements.social || (scoreValues[scores.social] >= school.minRequirements.social));
    }

    return matchesOwnership && matchesType && matchesGroup && pointsMatch && creditsMatch && meetsMinRequirements;
  }).sort((a, b) => b.points - a.points);
}

// ==========================================
// 4. 各區域專屬計分函數
// ==========================================

function calculateTaoyuanScores(scores) {
  const compositionPoints = { 0: 0, 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3 };
  const scorePoints = { 'A++': 6, 'A+': 6, 'A': 6, 'B++': 4, 'B+': 4, 'B': 4, 'C': 2 };
  const creditPoints = { 'A++': 7, 'A+': 6, 'A': 5, 'B++': 4, 'B+': 3, 'B': 2, 'C': 1 };

  const totalPoints = scorePoints[scores.chinese] + scorePoints[scores.english] + scorePoints[scores.math] + scorePoints[scores.science] + scorePoints[scores.social] + compositionPoints[scores.composition];
  const totalCredits = creditPoints[scores.chinese] + creditPoints[scores.english] + creditPoints[scores.math] + creditPoints[scores.science] + creditPoints[scores.social];

  return { totalPoints, totalCredits };
}

function calculateKaohsiungScores(scores) {
  const compositionPoints = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const scorePoints = { 'A++': 6, 'A+': 6, 'A': 6, 'B++': 4, 'B+': 4, 'B': 4, 'C': 2 };
  const creditPoints = { 'A++': 7, 'A+': 6, 'A': 5, 'B++': 4, 'B+': 3, 'B': 2, 'C': 1 };

  const totalPoints = scorePoints[scores.chinese] + scorePoints[scores.english] + scorePoints[scores.math] + scorePoints[scores.science] + scorePoints[scores.social];
  const totalCredits = creditPoints[scores.chinese] + creditPoints[scores.english] + creditPoints[scores.math] + creditPoints[scores.science] + creditPoints[scores.social] + compositionPoints[scores.composition];

  return { totalPoints, totalCredits };
}

function calculateCentralScores(scores) {
  const compositionPoints = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
  const scorePoints = { 'A++': 6, 'A+': 6, 'A': 6, 'B++': 4, 'B+': 4, 'B': 4, 'C': 2 };
  const creditPoints = { 'A++': 21, 'A+': 18, 'A': 15, 'B++': 12, 'B+': 9, 'B': 6, 'C': 3 };

  const totalPoints = scorePoints[scores.chinese] + scorePoints[scores.english] + scorePoints[scores.math] + scorePoints[scores.science] + scorePoints[scores.social];
  const totalCredits = creditPoints[scores.chinese] + creditPoints[scores.english] + creditPoints[scores.math] + creditPoints[scores.science] + creditPoints[scores.social] + compositionPoints[scores.composition];

  return { totalPoints, totalCredits };
}

function calculateChanghuaScores(scores) {
  const scorePoints = { 'A++': 9, 'A+': 8, 'A': 7, 'B++': 6, 'B+': 5, 'B': 4, 'C': 3 };
  const totalPoints = scorePoints[scores.chinese] + scorePoints[scores.english] + scorePoints[scores.math] + scorePoints[scores.science] + scorePoints[scores.social];
  return { totalPoints };
}

function calculateTaipeiScores(scores) {
  const scorePoints = { 'A++': 7, 'A+': 6, 'A': 5, 'B++': 4, 'B+': 3, 'B': 2, 'C': 1 };
  const compositionPoints = { 0: 0, 1: 0.1, 2: 0.2, 3: 0.4, 4: 0.6, 5: 0.8, 6: 1.0 };
  
  const subjectsTotal = scorePoints[scores.chinese] + scorePoints[scores.english] + scorePoints[scores.math] + scorePoints[scores.science] + scorePoints[scores.social];
  const compositionTotal = compositionPoints[scores.composition];
  
  const totalPoints = subjectsTotal + compositionTotal;
  return { totalPoints };
}

function calculateTainanScores(scores) {
  const scorePoints = { 'A++': 7, 'A+': 6, 'A': 5, 'B++': 4, 'B+': 3, 'B': 2, 'C': 1 };
  const compositionPoints = { 0: 0, 1: 0.1, 2: 0.2, 3: 0.4, 4: 0.6, 5: 0.8, 6: 1.0 };
  
  const subjectsTotal = scorePoints[scores.chinese] + scorePoints[scores.english] + scorePoints[scores.math] + scorePoints[scores.science] + scorePoints[scores.social];
  const compositionTotal = compositionPoints[scores.composition];
  
  const totalPoints = subjectsTotal + compositionTotal;
  return { totalPoints };
}

function calculateHsinchuScores(scores) {
  const scorePoints = { 'A++': 6, 'A+': 6, 'A': 6, 'B++': 4, 'B+': 4, 'B': 4, 'C': 2 };
  const creditPoints = { 'A++': 7, 'A+': 6, 'A': 5, 'B++': 4, 'B+': 3, 'B': 2, 'C': 1 };

  const totalPoints = scorePoints[scores.chinese] + scorePoints[scores.english] + 
                      scorePoints[scores.math] + scorePoints[scores.science] + 
                      scorePoints[scores.social];
                      
  const totalCredits = creditPoints[scores.chinese] + creditPoints[scores.english] + 
                       creditPoints[scores.math] + creditPoints[scores.science] + 
                       creditPoints[scores.social];

  return { totalPoints, totalCredits };
}
