// 主函數，處理 POST 請求
function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const scores = params.scores; // 成績
  const filters = params.filters; // 篩選條件
  const region = params.region; // 地區參數，例如 "taoyuan", "kaohsiung", "central", "changhua"

  // 根據地區獲取學校資料和計分邏輯
  const { schoolData, calculateScoresFunc, filterSchoolsFunc } = getRegionConfig(region);

  // 計算分數和學分（彰化區僅計算分數）
  const scoreResult = calculateScoresFunc(scores);
  const totalPoints = scoreResult.totalPoints; // 總分
  const totalCredits = scoreResult.totalCredits || null; // 總學分，彰化區無學分

  // 過濾符合條件的學校，傳入原始成績以檢查最低科目要求
  const eligibleSchools = filterSchoolsFunc(schoolData, totalPoints, totalCredits, filters, scores);

  // 返回結果
  const response = { totalPoints };
  if (totalCredits !== null) response.totalCredits = totalCredits;
  response.eligibleSchools = eligibleSchools;

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

// 根據地區返回配置（試算表 ID、計分邏輯、過濾邏輯）
function getRegionConfig(region) {
  const configs = {
    'taoyuan': { // 桃園區
      spreadsheetId: '1JNgY20zkJqPdFzvp73TKj5HG0c2wgIXAnzAMvCzuWk4',
      calculateScores: calculateTaoyuanScores,
      filterSchools: filterSchoolsWithSorting
    },
    'kaohsiung': { // 高雄區
      spreadsheetId: '1xz32z-XljP_x6FhG0TSswyL4UFtJ-YIUi7OXcUNWICI',
      calculateScores: calculateKaohsiungScores,
      filterSchools: filterSchoolsWithSorting
    },
    'central': { // 中投區
      spreadsheetId: '1PNOeR-BPQsmQr27wjJPJ7gni6vH3fTr6paYIytUVQGY',
      calculateScores: calculateCentralScores,
      filterSchools: filterSchoolsWithSorting
    },
    'changhua': { // 彰化區
      spreadsheetId: '11KV9vlOUQ2ncJ_Wlr5XmFMeznZ1TdtKctZ-_ZVQSTNg',
      calculateScores: calculateChanghuaScores,
      filterSchools: filterSchoolsWithSorting
    }
  };

  if (!configs[region]) throw new Error('無效的地區指定');
  
  const config = configs[region];
  return {
    schoolData: getSchoolData(config.spreadsheetId), // 學校資料
    calculateScoresFunc: config.calculateScores, // 計分函數
    filterSchoolsFunc: config.filterSchools // 過濾函數
  };
}

// 從試算表獲取學校資料
function getSchoolData(spreadsheetId) {
  const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
  const data = sheet.getDataRange().getValues();
  return data.slice(1).map(row => ({
    name: row[0], // 學校名稱
    points: row[1], // 所需分數
    credits: row[2] || null, // 所需學分（彰化區無此欄位）
    type: row[3] || row[2], // 學校類型
    ownership: row[4] || row[3], // 公私立
    group: row[5] || row[4], // 科別群組
    // 新增各科目最低要求（可選）
    minRequirements: {
      chinese: row[6] || null, // 國文最低要求
      english: row[7] || null, // 英文最低要求
      math: row[8] || null, // 數學最低要求
      science: row[9] || null, // 自然最低要求
      social: row[10] || null // 社會最低要求
    }
  }));
}

// 過濾學校並排序，僅在總分和學分都等於最低要求時檢查科目最低要求
function filterSchoolsWithSorting(schools, totalPoints, totalCredits, filters, scores) {
  return schools.filter(school => {
    // 現有篩選條件
    const matchesOwnership = filters.schoolOwnership === 'all' || school.ownership === filters.schoolOwnership; // 公私立
    const matchesType = filters.schoolType === 'all' || school.type === filters.schoolType; // 學校類型
    
    // 檢查是否符合多選職業群組
    let matchesGroup = true;
    if (filters.vocationalGroups && filters.vocationalGroups.length > 0 && !filters.vocationalGroups.includes('all')) {
      matchesGroup = filters.vocationalGroups.includes(school.group);
    }
    
    const pointsMatch = totalPoints >= school.points; // 分數要求
    const creditsMatch = school.credits === null || (pointsMatch && (totalPoints > school.points || totalCredits >= school.credits)); // 學分要求

    // 只有當總分等於學校最低分且學分等於學校最低學分時才檢查科目最低要求
    let meetsMinRequirements = true;
    if (totalPoints === school.points && (school.credits === null || totalCredits === school.credits)) {
      const scoreValues = {
        'A++': 9, 'A+': 8, 'A': 7, 'B++': 6, 'B+': 5, 'B': 4, 'C': 3 // 分數對應數值
      };
      
      meetsMinRequirements = (!school.minRequirements.chinese || (scoreValues[scores.chinese] >= school.minRequirements.chinese)) &&
                            (!school.minRequirements.english || (scoreValues[scores.english] >= school.minRequirements.english)) &&
                            (!school.minRequirements.math || (scoreValues[scores.math] >= school.minRequirements.math)) &&
                            (!school.minRequirements.science || (scoreValues[scores.science] >= school.minRequirements.science)) &&
                            (!school.minRequirements.social || (scoreValues[scores.social] >= school.minRequirements.social));
    }

    return matchesOwnership && matchesType && matchesGroup && pointsMatch && creditsMatch && meetsMinRequirements;
  }).sort((a, b) => b.points - a.points); // 按分數高到低排序
}

// 以下為各區域計分函數（保持不變）
function calculateTaoyuanScores(scores) {
  const compositionPoints = { 0: 0, 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3 };
  const scorePoints = { 'A++': 6, 'A+': 6, 'A': 6, 'B++': 4, 'B+': 4, 'B': 4, 'C': 2 };
  const creditPoints = { 'A++': 7, 'A+': 6, 'A': 5, 'B++': 4, 'B+': 3, 'B': 2, 'C': 1 };

  const totalPoints = scorePoints[scores.chinese] + scorePoints[scores.english] +
                     scorePoints[scores.math] + scorePoints[scores.science] +
                     scorePoints[scores.social] + compositionPoints[scores.composition];
  const totalCredits = creditPoints[scores.chinese] + creditPoints[scores.english] +
                      creditPoints[scores.math] + creditPoints[scores.science] +
                      creditPoints[scores.social];

  return { totalPoints, totalCredits };
}

function calculateKaohsiungScores(scores) {
  const compositionPoints = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  const scorePoints = { 'A++': 6, 'A+': 6, 'A': 6, 'B++': 4, 'B+': 4, 'B': 4, 'C': 2 };
  const creditPoints = { 'A++': 7, 'A+': 6, 'A': 5, 'B++': 4, 'B+': 3, 'B': 2, 'C': 1 };

  const totalPoints = scorePoints[scores.chinese] + scorePoints[scores.english] +
                     scorePoints[scores.math] + scorePoints[scores.science] +
                     scorePoints[scores.social];
  const totalCredits = creditPoints[scores.chinese] + creditPoints[scores.english] +
                      creditPoints[scores.math] + creditPoints[scores.science] +
                      creditPoints[scores.social] + compositionPoints[scores.composition];

  return { totalPoints, totalCredits };
}

function calculateCentralScores(scores) {
  const compositionPoints = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
  const scorePoints = { 'A++': 6, 'A+': 6, 'A': 6, 'B++': 4, 'B+': 4, 'B': 4, 'C': 2 };
  const creditPoints = { 'A++': 21, 'A+': 18, 'A': 15, 'B++': 12, 'B+': 9, 'B': 6, 'C': 3 };

  const totalPoints = scorePoints[scores.chinese] + scorePoints[scores.english] +
                     scorePoints[scores.math] + scorePoints[scores.science] +
                     scorePoints[scores.social];
  const totalCredits = creditPoints[scores.chinese] + creditPoints[scores.english] +
                      creditPoints[scores.math] + creditPoints[scores.science] +
                      creditPoints[scores.social] + compositionPoints[scores.composition];

  return { totalPoints, totalCredits };
}

function calculateChanghuaScores(scores) {
  const scorePoints = { 'A++': 9, 'A+': 8, 'A': 7, 'B++': 6, 'B+': 5, 'B': 4, 'C': 3 };

  const totalPoints = scorePoints[scores.chinese] + scorePoints[scores.english] +
                     scorePoints[scores.math] + scorePoints[scores.science] +
                     scorePoints[scores.social];

  return { totalPoints };
}