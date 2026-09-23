import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { parseLineGuideImport } from '../src/lib/lineGuide.ts';

const memory = new Map();
const replies = [];
let now = 0;
const cache = {
  put(key, value, ttl) { memory.set(key, { value, expires: now + ttl }); },
  get(key) { const row = memory.get(key); return row && row.expires > now ? row.value : null; },
  remove(key) { memory.delete(key); },
};
const context = vm.createContext({ console, CacheService: { getScriptCache: () => cache } });
for (const file of ['a.gs', 'b.gs', 'c.gs']) vm.runInContext(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), context, { filename: file });
vm.runInContext('replyMessage = function(token, message) { capture(token, message); };', context);
context.capture = (token, message) => replies.push({ token, message });
const get = expression => vm.runInContext(expression, context);
const render = (route, privateChat = true) => context.guideRender_(route, privateChat);
const features = get('BOT_FEATURES');
const groups = get('BOT_GROUPS');
const routes = new Set();

function validateMessage(message) {
  assert.equal(message.type, 'flex');
  assert.ok(message.altText.length > 0 && message.altText.length <= 400);
  assert.ok(Buffer.byteLength(JSON.stringify(message)) < 50000);
  if (message.quickReply) assert.ok(message.quickReply.items.length <= 13);
  const bubbles = message.contents.type === 'carousel' ? message.contents.contents : [message.contents];
  assert.ok(bubbles.length <= 12);
  for (const bubble of bubbles) {
    assert.ok(Buffer.byteLength(JSON.stringify(bubble)) < 30000);
    const primaryCount = JSON.stringify(bubble).match(/"style":"primary"/g)?.length || 0;
    assert.ok(primaryCount <= 1, '每張 LINE 卡片只能有一個主要按鈕');
  }
  function walk(value) {
    if (!value || typeof value !== 'object') return;
    if (value.type === 'postback') {
      assert.ok(value.data.length <= 300);
      assert.ok(value.label.length <= 20);
      assert.ok(value.displayText.length <= 300);
      assert.ok(value.data.startsWith('guide:v1:'));
    }
    if (value.type === 'uri') {
      assert.ok(value.label.length <= 20);
      assert.equal(new URL(value.uri).protocol, 'https:');
    }
    if (value.type === 'text') assert.ok(value.text.length > 0);
    for (const child of Object.values(value)) {
      if (Array.isArray(child)) child.forEach(walk); else walk(child);
    }
  }
  walk(message);
}

// Traverse every public branch and all feature steps. Grade paths are tested
// separately to avoid expanding 7^6 combinations in this graph traversal.
function visit(route) {
  if (routes.has(route)) return;
  routes.add(route);
  const page = render(route);
  assert.notEqual(page.route, 'invalid', route);
  validateMessage(page.message);
  if (page.back) visit(page.back);
  for (const choice of page.choices) {
    if (choice.route && !choice.route.startsWith('scores/')) visit(choice.route);
  }
}
visit('home');
for (const feature of features) {
  const id = context.guideFeatureId_(feature);
  assert.ok(routes.has('feature/' + id), feature.title);
  assert.equal(context.guideSteps_(feature).length, 3, feature.title);
  for (let i = 0; i < 3; i++) assert.ok(routes.has('steps/' + id + '/' + i));
}

for (const [region] of get('GUIDE_REGIONS')) {
  for (let grade = 0; grade < 7; grade++) {
    for (let length = 0; length <= 6; length++) {
      const digits = String(grade).repeat(length);
      const route = 'scores/' + region + '/' + (digits || '-');
      const page = render(route);
      assert.equal(page.route, route);
      validateMessage(page.message);
      assert.equal(render(route, false).route, 'private');
      if (length > 0) assert.equal(page.back, 'scores/' + region + '/' + (digits.slice(0, -1) || '-'));
      if (length === 6) {
        const url = page.choices.find(choice => choice.url?.includes('#line-guide'))?.url;
        const imported = parseLineGuideImport(new URL(url).hash);
        assert.equal(imported.region, region);
        assert.equal(imported.chinese, get('GUIDE_GRADES')[grade]);
        assert.equal(imported.composition, String(grade));
        assert.equal(Object.keys(imported).length, 7);
      }
    }
  }
}
for (const route of ['scores/taipei/0123456', 'scores/taipei/7', 'scores/taipei/', 'scores/yunlin/-', 'scores/taipei/0/1', 'feature/__proto__', 'steps/choose-0/-1', 'steps/choose-0/3', 'vgroup/15', 'vgroup/01', 'regions/other', 'rule/yunlin', 'https://evil.example', 'home/'.repeat(100)]) assert.equal(render(route).route, 'invalid', route);
for (const hash of ['#line-guide=v2.taipei.012340', '#line-guide=v1.yunlin.012340', '#line-guide=v1.taipei.012347', '#line-guide=v1.taipei.01234', '#line-guide=v1.taipei.012340&line_login_code=secret', '#line-guide=v1.taipei.012340&line-guide=v1.taipei.000000', '#line_login_code=secret', '#line-guide=' + 'a'.repeat(300)]) assert.equal(parseLineGuideImport(hash), null, hash);
assert.equal(parseLineGuideImport('#line-guide=v1.taipei.012340').composition, '0');

function event(type, value, user = 'alice', sourceType = 'user') {
  const input = { type, replyToken: 'reply-' + replies.length, source: { type: sourceType, userId: user } };
  if (type === 'postback') input.postback = { data: value }; else input.message = { type: 'text', text: value };
  context.handleLineEvent(input);
  return replies.at(-1)?.message;
}
const state = user => JSON.parse(cache.get('guide:v1:' + user) || 'null');
event('message', '開始');
assert.equal(state('alice').route, 'home');
event('message', '查計分');
assert.equal(state('alice').route, 'group/scoring');
event('postback', 'guide:v1:scores/taipei/-');
event('message', 'a++');
assert.equal(state('alice').route, 'scores/taipei/0');
event('message', '錯誤等級');
assert.equal(state('alice').route, 'scores/taipei/0');
assert.ok(JSON.stringify(replies.at(-1).message.contents).includes('輸入格式不正確'));
event('postback', 'guide:v1:scores/taoyuan/-', 'bob');
event('message', 'B+', 'bob');
assert.equal(state('bob').route, 'scores/taoyuan/4');
assert.equal(state('alice').route, 'scores/taipei/0');
for (const grade of ['A+', 'A', 'B++', 'B+', '0']) event('message', grade);
assert.equal(state('alice').route, 'scores/taipei/012340');
event('message', '上一步');
assert.equal(state('alice').route, 'scores/taipei/01234');
event('message', '６級分');
assert.equal(state('alice').route, 'scores/taipei/012346');
event('message', '取消');
assert.equal(state('alice'), null);
event('message', '上一步');
assert.equal(state('alice').route, 'expired');
event('postback', 'guide:v1:scores/taipei/01'); // old button restores its explicit branch
assert.equal(state('alice').route, 'scores/taipei/01');
now += 1801;
event('message', 'B+');
assert.equal(state('alice').route, 'expired');
event('postback', 'guide:v1:scores/taipei/01');
assert.equal(state('alice').route, 'scores/taipei/01');
assert.equal(event('postback', 'guide:v1:scores/taipei/-', 'carol', 'group').contents.header.contents[1].contents[1].text, '請在一對一聊天室操作');
assert.equal(state('carol'), null);
event('postback', 'guide:v1:search');
event('message', '資訊科 & 設計');
assert.equal(state('alice').route, 'search-result');
assert.ok(JSON.stringify(replies.at(-1).message).includes('q=%E8%B3%87%E8%A8%8A%E7%A7%91%20%26%20%E8%A8%AD%E8%A8%88'));
event('message', '搜尋：會員');
assert.equal(state('alice').route, 'search-result');
event('message', '搜尋：' + '字'.repeat(61));
assert.equal(state('alice').route, 'search');
event('message', '會員');
assert.equal(state('alice').route, 'feature/member-0');
event('postback', 'guide:v2:home');
assert.equal(state('alice').route, 'invalid');
const count = replies.length;
context.handleLineEvent({ type: 'message', mode: 'standby', replyToken: 't', message: { type: 'text', text: '開始' } });
context.handleLineEvent({ type: 'message', replyToken: 't', message: { type: 'image' } });
assert.equal(replies.length, count);
event('postback', 'guide:v1:scores/taipei/-');
const duplicate = { type: 'message', webhookEventId: 'duplicate-grade-event', replyToken: 'once', source: { type: 'user', userId: 'alice' }, message: { type: 'text', text: 'A++' } };
context.handleLineEvent(duplicate);
const afterFirst = replies.length;
context.handleLineEvent(duplicate);
assert.equal(replies.length, afterFirst);
assert.equal(state('alice').route, 'scores/taipei/0');
context.testBotRouting();
for (const reply of replies) validateMessage(reply.message);
console.log(`PASS: ${features.length} features, ${groups.length} groups, ${routes.size} navigation routes; all region/grade boundaries, imports, input errors, isolation, expiry and legacy routing.`);
