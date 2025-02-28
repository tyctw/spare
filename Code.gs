// 主函數，處理 POST 請求
function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const scores = params.scores;
  const filters = params.filters;
  const region = params.region; // 新增地區參數，需在前端傳入，例如 "taoyuan", "kaohsiung", "central", "changhua"

  // 根據地區獲取學校資料和計分邏輯
  const { schoolData, calculateScoresFunc, filterSchoolsFunc } = getRegionConfig(region);

  // 計算分數和學分（彰化區僅計算分數）
  const scoreResult = calculateScoresFunc(scores);
  const totalPoints = scoreResult.totalPoints;
  const totalCredits = scoreResult.totalCredits || null; // 彰化區無學分

  // 過濾符合條件的學校
  const eligibleSchools = filterSchoolsFunc(schoolData, totalPoints, totalCredits, filters);

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
    'taoyuan': {
      spreadsheetId: '1mtZOhJq8prZ7SyEK1e-jrLr-dVHny82ceHUdC9qm6c0',
      calculateScores: calculateTaoyuanScores,
      filterSchools: filterSchoolsWithSorting
    },
    'kaohsiung': {
      spreadsheetId: '1xz32z-XljP_x6FhG0TSswyL4UFtJ-YIUi7OXcUNWICI',
      calculateScores: calculateKaohsiungScores,
      filterSchools: filterSchoolsNoSorting
    },
    'central': {
      spreadsheetId: '1PNOeR-BPQsmQr27wjJPJ7gni6vH3fTr6paYIytUVQGY',
      calculateScores: calculateCentralScores,
      filterSchools: filterSchoolsNoSorting
    },
    'changhua': {
      spreadsheetId: '11KV9vlOUQ2ncJ_Wlr5XmFMeznZ1TdtKctZ-_ZVQSTNg',
      calculateScores: calculateChanghuaScores,
      filterSchools: filterSchoolsWithSorting
    }
  };

  if (!configs[region]) throw new Error('Invalid region specified');
  
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
    credits: row[2] || null, // 彰化區無 credits 欄位
    type: row[3] || row[2], // 彰化區 type 在第 3 欄
    ownership: row[4] || row[3], // 調整欄位索引
    group: row[5] || row[4]
  }));
}

// 桃聯區計分邏輯
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

// 高雄區計分邏輯
function calculateKaohsiungScores(scores) {
  const compositionPoints = { 0: 0, 1: 0.1, 2: 0.2, 3: 0.4, 4: 0.6, 5: 0.8, 6: 1 };
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

// 中投區計分邏輯
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

// 彰化區計分邏輯（僅分數）
function calculateChanghuaScores(scores) {
  const scorePoints = { 'A++': 9, 'A+': 8, 'A': 7, 'B++': 6, 'B+': 5, 'B': 4, 'C': 3 };

  const totalPoints = scorePoints[scores.chinese] + scorePoints[scores.english] +
                     scorePoints[scores.math] + scorePoints[scores.science] +
                     scorePoints[scores.social];

  return { totalPoints };
}

// 過濾學校（帶排序，高分到低分）
function filterSchoolsWithSorting(schools, totalPoints, totalCredits, filters) {
  return schools.filter(school => {
    const matchesOwnership = filters.schoolOwnership === 'all' || school.ownership === filters.schoolOwnership;
    const matchesType = filters.schoolType === 'all' || school.type === filters.schoolType;
    const matchesGroup = filters.vocationalGroup === 'all' || school.group === filters.vocationalGroup;
    const pointsMatch = totalPoints >= school.points;
    const creditsMatch = school.credits === null || (pointsMatch && (totalPoints > school.points || totalCredits >= school.credits));

    return matchesOwnership && matchesType && matchesGroup && pointsMatch && creditsMatch;
  }).sort((a, b) => b.points - a.points);
}

// 過濾學校（無排序）
function filterSchoolsNoSorting(schools, totalPoints, totalCredits, filters) {
  return schools.filter(school => {
    const matchesOwnership = filters.schoolOwnership === 'all' || school.ownership === filters.schoolOwnership;
    const matchesType = filters.schoolType === 'all' || school.type === filters.schoolType;
    const matchesGroup = filters.vocationalGroup === 'all' || school.group === filters.vocationalGroup;
    const pointsMatch = totalPoints >= school.points;
    const creditsMatch = school.credits === null || (pointsMatch && (totalPoints > school.points || totalCredits >= school.credits));

    return matchesOwnership && matchesType && matchesGroup && pointsMatch && creditsMatch;
  });
}