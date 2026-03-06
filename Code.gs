// 主函數，處理 POST 請求
function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  const scores = params.scores; // 成績
  const filters = params.filters; // 篩選條件
  const region = params.region; // 地區參數，例如 "taoyuan", "kaohsiung", "central", "changhua", "hsinchu"

  // 根據地區獲取學校資料和計分邏輯
  const { schoolData, calculateScoresFunc, filterSchoolsFunc } = getRegionConfig(region);

  // 計算分數和學分（彰化區、竹苗區僅計算分數）
  const scoreResult = calculateScoresFunc(scores);
  const totalPoints = scoreResult.totalPoints; // 總分
  const totalCredits = scoreResult.totalCredits || null; // 總學分，部分地區無學分

  // 過濾符合條件的學校，傳入原始成績以檢查最低科目要求
  const eligibleSchools = filterSchoolsFunc(schoolData, totalPoints, totalCredits, filters, scores);

// 返回結果
  const response = { totalPoints };
  
  // 加上 region !== 'hsinchu' 的條件，讓竹苗區的 creditPoints 不會回傳到前端
  if (totalCredits !== null && region !== 'hsinchu') {
    response.totalCredits = totalCredits;
  }
  
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
    },
    'hsinchu': { // 竹苗區 (新增)
      spreadsheetId: '1SyfWIuNqGSsy30IB548w9XXxhxRXW3cpGkPGpTsRLxw', // 注意：請替換為真實的試算表 ID
      calculateScores: calculateHsinchuScores,
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

// 從試算表獲取學校資料 (🚀 具備快取優化版本)
function getSchoolData(spreadsheetId) {
  const cache = CacheService.getScriptCache();
  const cacheKey = 'schoolData_' + spreadsheetId;
  const cachedData = cache.get(cacheKey);
  
  // 1. 如果快取裡有資料，直接回傳 (速度極快，不用等試算表開啟)
  if (cachedData) {
    return JSON.parse(cachedData);
  }
  
  // 2. 如果快取沒有資料 (或是過期了)，才去讀取試算表
  const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  const formattedData = data.slice(1).map(row => ({
    name: row[0], // 學校名稱
    points: row[1], // 所需分數
    credits: row[2] || null, // 所需學分
    type: row[3] || row[2], // 學校類型
    ownership: row[4] || row[3], // 公私立
    group: row[5] || row[4], // 科別群組
    minRequirements: {
      chinese: row[6] || null,
      english: row[7] || null,
      math: row[8] || null,
      science: row[9] || null,
      social: row[10] || null
    }
  }));

  // 3. 將讀取到的資料存入快取，保留 6 小時 (21600 秒)
  try {
    // 將 JSON 字串化存入快取
    cache.put(cacheKey, JSON.stringify(formattedData), 21600);
  } catch (e) {
    // 預防資料量過大超過快取限制 (100KB)，若發生錯誤則忽略，不影響正常執行
    console.error("快取寫入失敗: ", e.message);
  }
  
  return formattedData;
}

// 過濾學校並排序，僅在總分和學分都等於最低要求時檢查科目最低要求
function filterSchoolsWithSorting(schools, totalPoints, totalCredits, filters, scores) {
  return schools.filter(school => {
    // 1. 公私立與學校類型篩選
    const matchesOwnership = filters.schoolOwnership === 'all' || school.ownership === filters.schoolOwnership; 
    const matchesType = filters.schoolType === 'all' || school.type === filters.schoolType; 

    // 2. ★ 修復此處：正確解析科別群組 (處理陣列格式)
    let matchesGroup = true;
    if (filters.vocationalGroups && filters.vocationalGroups.length > 0 && !filters.vocationalGroups.includes('all')) {
      matchesGroup = filters.vocationalGroups.includes(school.group);
    }

    // 3. 分數與學分要求
    const pointsMatch = totalPoints >= school.points; 
    const creditsMatch = school.credits === null || school.credits === '' || (pointsMatch && (totalPoints > school.points || totalCredits >= school.credits));

    // 4. 單科最低要求
    let meetsMinRequirements = true;
    if (totalPoints === school.points && (school.credits === null || school.credits === '' || totalCredits === school.credits)) {
      
      // 注意：如果您試算表裡單科標準是填 7~1，請務必把這裡的 9~3 改成 7~1
      const scoreValues = {
        'A++': 9, 'A+': 8, 'A': 7, 'B++': 6, 'B+': 5, 'B': 4, 'C': 3 
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

// 以下為各區域計分函數
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

// 竹苗區計分函數
function calculateHsinchuScores(scores) {
  // 總積分轉換 (滿分 30 分)
  const scorePoints = { 'A++': 6, 'A+': 6, 'A': 6, 'B++': 4, 'B+': 4, 'B': 4, 'C': 2 };
  
  // 總積點轉換 (七級分制，滿分 35 點)
  const creditPoints = { 'A++': 7, 'A+': 6, 'A': 5, 'B++': 4, 'B+': 3, 'B': 2, 'C': 1 };

  const totalPoints = scorePoints[scores.chinese] + scorePoints[scores.english] + 
                      scorePoints[scores.math] + scorePoints[scores.science] + 
                      scorePoints[scores.social];
                      
  const totalCredits = creditPoints[scores.chinese] + creditPoints[scores.english] + 
                       creditPoints[scores.math] + creditPoints[scores.science] + 
                       creditPoints[scores.social];

  return { totalPoints, totalCredits };
}
