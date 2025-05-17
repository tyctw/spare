// 主函數，處理 POST 請求
function doPost(e) {
  try {
    const params = JSON.parse(e.postData.contents);
    const scores = params.scores;
    const filters = params.filters;
    const region = params.region;

    logToSheet(region, '接收請求', JSON.stringify(params));

    const { schoolData, calculateScoresFunc, filterSchoolsFunc } = getRegionConfig(region);

    const scoreResult = calculateScoresFunc(scores);
    const totalPoints = scoreResult.totalPoints;
    const totalCredits = scoreResult.totalCredits || null;

    logToSheet(region, '計算結果', `總分: ${totalPoints}, 學分: ${totalCredits}`);

    const eligibleSchools = filterSchoolsFunc(schoolData, totalPoints, totalCredits, filters, scores);
    logToSheet(region, '篩選結果', `符合學校數: ${eligibleSchools.length}`);

    const response = { totalPoints };
    if (totalCredits !== null) response.totalCredits = totalCredits;
    response.eligibleSchools = eligibleSchools;

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    const region = (() => {
      try {
        return JSON.parse(e.postData.contents).region || '未知';
      } catch (_) {
        return '未知';
      }
    })();

    logToSheet(region, '錯誤', `${error.message}\n${error.stack}`);
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// 記錄 log 到試算表
function logToSheet(region, action, message) {
  const LOG_SHEET_ID = '1yKMl3yEso1Jbi9fUIi2nE2v-6w8YXXc43DyO9_QfbfQ'; // ← 替換成你自己的
  const sheet = SpreadsheetApp.openById(LOG_SHEET_ID).getSheetByName('Logs');
  if (!sheet) throw new Error('找不到 Logs 工作表');
  sheet.appendRow([new Date(), region, action, message]);
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
      spreadsheetId: '1vHKGVcY0Y7VuS4B2Vxm_cZXZQZJT4DnOIj7-1cBzizw',
      calculateScores: calculateTaipeiScores,
      filterSchools: filterSchoolsWithSorting
    },
    'tainan': {
      spreadsheetId: '輸入台南區的試算表ID',
      calculateScores: calculateTainanScores,
      filterSchools: filterSchoolsWithSorting
    }
  };

  if (!configs[region]) throw new Error('無效的地區指定');

  const config = configs[region];
  return {
    schoolData: getSchoolData(config.spreadsheetId),
    calculateScoresFunc: config.calculateScores,
    filterSchoolsFunc: config.filterSchools
  };
}

// 從試算表獲取學校資料
function getSchoolData(spreadsheetId) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
  const data = sheet.getDataRange().getValues();
  return data.slice(1).map(row => ({
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
}

// 過濾學校並排序
function filterSchoolsWithSorting(schools, totalPoints, totalCredits, filters, scores) {
  return schools.filter(school => {
    const matchesOwnership = filters.schoolOwnership === 'all' || school.ownership === filters.schoolOwnership;
    const matchesType = filters.schoolType === 'all' || school.type === filters.schoolType;

    let matchesGroup = true;
    if (filters.vocationalGroups && filters.vocationalGroups.length > 0 && !filters.vocationalGroups.includes('all')) {
      matchesGroup = filters.vocationalGroups.includes(school.group);
    }

    const pointsMatch = totalPoints >= school.points;
    const creditsMatch = school.credits === null || (pointsMatch && (totalPoints > school.points || totalCredits >= school.credits));

    let meetsMinRequirements = true;
    if (totalPoints === school.points && (school.credits === null || totalCredits === school.credits)) {
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

// 各區域計分邏輯
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

// 基北區計分函數
function calculateTaipeiScores(scores) {
  const scorePoints = { 'A++': 7, 'A+': 6, 'A': 5, 'B++': 4, 'B+': 3, 'B': 2, 'C': 1 };
  const compositionPoints = { 0: 0, 1: 0.1, 2: 0.2, 3: 0.4, 4: 0.6, 5: 0.8, 6: 1.0 };
  
  const subjectsTotal = scorePoints[scores.chinese] + scorePoints[scores.english] + scorePoints[scores.math] + scorePoints[scores.science] + scorePoints[scores.social];
  const compositionTotal = compositionPoints[scores.composition];
  
  const totalPoints = subjectsTotal + compositionTotal;
  
  return { totalPoints };
}

// 台南區計分函數
function calculateTainanScores(scores) {
  const scorePoints = { 'A++': 7, 'A+': 6, 'A': 5, 'B++': 4, 'B+': 3, 'B': 2, 'C': 1 };
  const compositionPoints = { 0: 0, 1: 0.1, 2: 0.2, 3: 0.4, 4: 0.6, 5: 0.8, 6: 1.0 };
  
  const subjectsTotal = scorePoints[scores.chinese] + scorePoints[scores.english] + scorePoints[scores.math] + scorePoints[scores.science] + scorePoints[scores.social];
  const compositionTotal = compositionPoints[scores.composition];
  
  const totalPoints = subjectsTotal + compositionTotal;
  
  return { totalPoints };
}
