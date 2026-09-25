import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const headers = ['enabled', 'date', 'title', 'message', 'url', 'sent'];
const readRows = file => fs.readFileSync(new URL(file, import.meta.url), 'utf8').trim().split(/\r?\n/).slice(1).map(line => line.split(','));
const rows = [...readRows('115-mock-exams.csv'), ...readRows('116-admission-schedule.csv')];
const sheet = {
  getDataRange: () => ({ getValues: () => [headers, ...rows] }),
  getParent: () => ({ getSpreadsheetTimeZone: () => 'Asia/Taipei' }),
};
const replies = [];
const seen = new Map();
let now = '2027-05-15';
let hasSheetId = true;
const context = vm.createContext({
  console: { error() {} },
  Utilities: { formatDate: () => now },
  PropertiesService: { getScriptProperties: () => ({ getProperty: () => hasSheetId ? 'schedule-sheet-id' : null }) },
  SpreadsheetApp: { openById: id => { assert.equal(id, 'schedule-sheet-id'); return { getSheetByName: () => sheet }; }, getActiveSpreadsheet: () => null },
  CacheService: { getScriptCache: () => ({ get: key => seen.get(key), put: (key, value) => seen.set(key, value) }) },
});
for (const file of ['b.gs', 'c.gs', 'd.gs']) vm.runInContext(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), context, { filename: file });
context.replyMessage = (token, message) => replies.push({ token, message });

const query = (kind, date) => context.botScheduleReply_(kind, date);
const cardText = card => JSON.stringify(card.contents);
assert.equal(context.botScheduleQueryKind_('今天考什麼'), 'today');
assert.equal(context.botScheduleQueryKind_('這周日程'), 'week');
assert.equal(context.botScheduleQueryKind_('下個日程'), 'next');
assert.equal(context.botScheduleQueryKind_('成績'), null);

const today = query('today', '2027-05-15');
assert.ok(cardText(today).includes('國中教育會考第一天'));
assert.ok(cardText(today).includes('08:30–09:40 社會'));
assert.ok(!cardText(today).includes('國中教育會考第二天'));
assert.ok(Buffer.byteLength(JSON.stringify(today)) < 50000);

const week = query('week', '2027-05-16');
assert.ok(cardText(week).includes('國中教育會考第一天'));
assert.ok(cardText(week).includes('國中教育會考第二天'));
assert.ok(!cardText(query('week', '2027-05-17')).includes('國中教育會考第一天'));
assert.ok(cardText(query('next', '2027-05-17')).includes('國中教育會考成績公布'));
assert.ok(cardText(query('next', '2027-05-15')).includes('國中教育會考第一天'));
assert.ok(cardText(query('today', '2027-05-17')).includes('今天沒有已列入的日程'));
assert.ok(cardText(query('next', '2027-08-01')).includes('目前沒有下一筆未到的日程'));
const examRow = rows.find(row => row[1] === '2027/05/15');
examRow[5] = '2027-05-15:今日';
assert.ok(cardText(query('today', '2027-05-15')).includes('國中教育會考第一天'), 'sent 欄不得影響查詢');
examRow[0] = 'FALSE';
assert.ok(!cardText(query('today', '2027-05-15')).includes('國中教育會考第一天'), '停用日程不可顯示');
examRow[0] = 'TRUE';

context.handleLineEvent({ type: 'message', replyToken: 'reply-1', webhookEventId: 'same-event', message: { type: 'text', text: '今天日程' } });
context.handleLineEvent({ type: 'message', replyToken: 'reply-2', webhookEventId: 'same-event', message: { type: 'text', text: '今天日程' } });
assert.equal(replies.length, 1, '重送事件不可重複回覆');
assert.ok(cardText(replies[0].message).includes('國中教育會考第一天'));

hasSheetId = false;
assert.ok(cardText(query('today', '2027-05-15')).includes('目前無法讀取日程資料'));
console.log('PASS: 今天、本週、下一筆日程、空資料與重送處理。');
