// 考試日期設定
export const EXAM_DATE = new Date('2025-04-26T08:00:00');

// 開始計算的日期（從何時開始準備統測）
export const START_DATE = new Date('2024-01-01T00:00:00');

// 動機訊息
export const MESSAGES = [
  "加油！堅持就是勝利！",
  "每一天的努力都會有回報",
  "相信自己，你做得到！",
  "休息是為了走更長遠的路",
  "不要放棄，堅持到最後",
  "夢想的路上沒有捷徑，只有堅持",
  "今天的付出，明天的收穫",
  "目標在前方，別停下腳步",
  "態度決定高度，堅持創造奇蹟",
  "你比想像中更強大"
];

// 計時器設定（分鐘）
export const TIMER_SETTINGS = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15
};

// 預設科目設定
export const DEFAULT_SUBJECTS = [
  { name: "國文", progress: 0 },
  { name: "英文", progress: 0 },
  { name: "數學", progress: 0 },
  { name: "專業科目一", progress: 0 },
  { name: "專業科目二", progress: 0 }
];

// UI settings
export const UI_SETTINGS = {
  // Modal background opacity - higher numbers are more opaque
  modalOpacity: 0.95
};