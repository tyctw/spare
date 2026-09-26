import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context = vm.createContext({
  Utilities: { formatDate: date => date.toISOString().slice(0, 10) },
});
vm.runInContext(fs.readFileSync(new URL('a.gs', import.meta.url), 'utf8'), context);

const cases = [
  ['115 學年度國三第 2 次模擬考', '考試範圍'],
  ['五專聯合免試入學現場登記分發', '現場登記資格'],
  ['報到後放棄錄取資格截止', '放棄資格'],
  ['高中職免試入學續招簡章公告截止', '續招學校'],
  ['國中教育會考報名截止', '報名資格'],
  ['免試入學報到', '報到學校'],
  ['免試入學志願選填截止', '志願順序'],
  ['寄發國中教育會考准考證', '准考證'],
  ['國中教育會考成績公布', '查詢入口'],
  ['國中教育會考第一天', '考場'],
  ['申請作業截止', '截止時間'],
  ['升學說明會', '適用的對象'],
];

function assertValidAlignment(value) {
  if (!value || typeof value !== 'object') return;
  if (Object.hasOwn(value, 'alignItems')) {
    assert.ok(['flex-start', 'center', 'flex-end'].includes(value.alignItems),
      `LINE Flex 不支援 alignItems=${value.alignItems}`);
  }
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach(assertValidAlignment);
    else assertValidAlignment(child);
  }
}

for (const [title, expected] of cases) {
  for (const reminderType of ['提前2天', '今日']) {
    const data = { date: '2027/03/04', title, reminderType, message: '請查看活動說明。', url: 'https://example.com' };
    const card = vm.runInContext(`createScheduleFlexMessage_(${JSON.stringify(data)})`, context);
    assertValidAlignment(card);
    const body = card.contents.body.contents;
    const checklist = body.find(item => item.type === 'box' && item.contents?.[0]?.text === '準備清單');
    assert.ok(checklist, `${title} 缺少準備清單`);
    assert.equal(checklist.contents.length, 4);
    assert.ok(JSON.stringify(checklist).includes(expected), `${title} 的清單與事件不符`);
    assert.ok(Buffer.byteLength(JSON.stringify(card)) < 50000);
  }
}

const signupToday = vm.runInContext("getScheduleChecklist_('國中教育會考報名截止', true)", context);
const signupEarly = vm.runInContext("getScheduleChecklist_('國中教育會考報名截止', false)", context);
assert.notEqual(signupToday[2], signupEarly[2]);
assert.equal(context.scheduleReminderMessage_('今天為會考報名截止日，請確認學校是否已完成受理。', '提前2天'), '兩天後為會考報名截止日，請確認學校是否已完成受理。');
assert.equal(context.scheduleReminderMessage_('今天為會考報名截止日。', '今日'), '今天為會考報名截止日。');
const pastedUrlCard = vm.runInContext(`createScheduleFlexMessage_(${JSON.stringify({
  date: '2027/03/04', title: '國中教育會考報名開始', reminderType: '今日',
  message: '確認個人資料。',
  url: '[https://tyctw.github.io/spare/important-dates/](https://tyctw.github.io/spare/important-dates/)',
})})`, context);
assert.equal(pastedUrlCard.contents.footer.contents[0].action.uri, 'https://tyctw.github.io/spare/important-dates/');

const mockCsv = fs.readFileSync(new URL('115-mock-exams.csv', import.meta.url), 'utf8').trim().split(/\r?\n/);
assert.equal(mockCsv.length, 5, '模擬考應有 4 筆資料');
assert.equal(mockCsv[0], 'enabled,date,title,message,url,sent');
const mockRows = mockCsv.slice(1).map(row => row.split(','));
for (const row of mockRows) {
  assert.equal(row.length, 6);
  assert.equal(row[0], 'TRUE');
  assert.equal(row[4], 'https://tyctw.github.io/clock/#/schedule');
  assert.equal(row[5], '');
}
const sheet = {
  getDataRange: () => ({ getValues: () => [mockCsv[0].split(','), ...mockRows.map(row => [...row])] }),
  getParent: () => ({ getSpreadsheetTimeZone: () => 'Asia/Taipei', getId: () => 'sheet-id' }),
  getSheetId: () => 1,
  getRange: (row, column) => ({ setValue: value => { mockRows[row - 2][column - 1] = value; } }),
};
const jobsOn = date => context.collectScheduleJobs_(sheet, date);
assert.equal(jobsOn('2026-09-06')[0].data.reminderType, '提前2天');
assert.equal(jobsOn('2026-09-08')[0].data.reminderType, '今日');
assert.ok(jobsOn('2026-09-08')[0].data.message.includes('自然第1、3冊'));
assert.equal(jobsOn('2026-09-26').length, 0, '過期的第一次模擬考不得補發');
assert.equal(jobsOn('2026-12-21')[0].data.reminderType, '提前2天');
assert.equal(jobsOn('2026-12-23')[0].data.reminderType, '今日');
assert.ok(jobsOn('2026-12-23')[0].data.message.includes('12/24（四）'));
assert.equal(jobsOn('2026-12-23')[0].flex.contents.footer.contents[0].action.uri, 'https://tyctw.github.io/clock/#/schedule');
assert.ok(jobsOn('2027-02-16')[0].data.message.includes('第1～5冊'));
assert.ok(jobsOn('2027-04-13')[0].data.message.includes('康軒版'));
const decemberEarly = jobsOn('2026-12-21')[0];
mockRows[1][5] = decemberEarly.sentKey;
assert.equal(jobsOn('2026-12-21').length, 0, '已發送的提醒不得重複排入');
mockRows[1][5] = '';

const saved = new Map();
const scriptProperties = {
  getProperty: key => saved.get(key) ?? null,
  setProperty: (key, value) => saved.set(key, value),
  deleteProperty: key => saved.delete(key),
};
const sentMessages = [];
const februaryJob = jobsOn('2027-02-16')[0];
context.PropertiesService = { getScriptProperties: () => scriptProperties };
context.LockService = { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) };
context.Utilities.computeDigest = () => [1, 2, 3];
context.Utilities.DigestAlgorithm = { SHA_256: 'SHA_256' };
context.Utilities.Charset = { UTF_8: 'UTF_8' };
context.Utilities.base64EncodeWebSafe = () => 'sheet-reminder-test';
context.Utilities.getUuid = () => 'sheet-reminder-retry-key';
context.getScheduleSheet_ = () => sheet;
context.collectScheduleJobs_ = () => mockRows[2][5] ? [] : [februaryJob];
context.SpreadsheetApp = { flush() {} };
context.scheduleLineRequest_ = (_url, payload, retryKey) => sentMessages.push({ payload, retryKey });
context.console = { log() {} };
context.sendScheduleBroadcast();
context.sendScheduleBroadcast();
assert.equal(sentMessages.length, 1, '同一提醒不得重複廣播');
assert.equal(sentMessages[0].retryKey, 'sheet-reminder-retry-key');
assert.equal(mockRows[2][5], februaryJob.sentKey);

const csv = fs.readFileSync(new URL('116-admission-schedule.csv', import.meta.url), 'utf8').trim().split(/\r?\n/);
assert.equal(csv.length, 16, '正式日程應有 15 筆資料');
assert.equal(csv[0], 'enabled,date,title,message,url,sent');
for (const row of csv.slice(1)) {
  const cells = row.split(',');
  assert.equal(cells.length, 6);
  assert.equal(cells[0], 'TRUE');
  assert.match(cells[1], /^2027\/\d{2}\/\d{2}$/);
  assert.equal(cells[5], '');
}
for (const [date, expected] of [
  ['2027/05/15', ['08:30–09:40 社會（70 分）', '10:30–11:50 數學（80 分）', '13:50–15:00 國文（70 分）', '15:50–16:40 寫作測驗（50 分）']],
  ['2027/05/16', ['08:30–09:40 自然（70 分）', '10:30–11:30 英語閱讀（60 分）', '12:05–12:30 英語聽力（25 分）']],
]) {
  const cells = csv.slice(1).map(row => row.split(',')).find(row => row[1] === date);
  assert.ok(cells, `${date} 考程缺失`);
  const card = context.createScheduleFlexMessage_({ date, title: cells[2], reminderType: '今日', message: cells[3], url: cells[4] });
  const timetable = card.contents.body.contents.find(item => item.type === 'text' && item.text.startsWith('當日考程：'))?.text;
  assert.ok(timetable);
  assert.deepEqual(timetable.split('\n').slice(1), expected);
}
console.log('PASS: 12 類日程準備清單、四次模擬考提醒與 15 筆正式日程。');
