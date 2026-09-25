// LINE 即時日程查詢。與 b.gs、c.gs 放在同一個 Webhook Apps Script 專案。
// 讀取現有「日程」工作表，不使用 sent 欄，也不會改動廣播紀錄。
const BOT_SCHEDULE_TIMEZONE = 'Asia/Taipei';
const BOT_SCHEDULE_COMMANDS = {
  today: ['今天日程', '今日日程', '今天考什麼', '今天考程', '今日考程'],
  week: ['本週日程', '這週日程', '本周日程', '這周日程', '本週考程'],
  next: ['下一個重要日期', '下個重要日期', '下一個日程', '下個日程', '最近日程'],
};

function botScheduleQueryKind_(text) {
  const keyword = botNormalize_(text);
  return Object.keys(BOT_SCHEDULE_COMMANDS).find(function(kind) {
    return BOT_SCHEDULE_COMMANDS[kind].some(function(command) {
      return botNormalize_(command) === keyword;
    });
  }) || null;
}

function botScheduleDateKey_(value, timezone) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    if (isNaN(value.getTime())) return null;
    return Utilities.formatDate(value, timezone, 'yyyy-MM-dd');
  }
  const match = String(value || '').trim().match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const check = new Date(Date.UTC(year, month - 1, day));
  if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return null;
  return year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
}

function botScheduleSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SCHEDULE_SPREADSHEET_ID');
  const spreadsheet = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('未設定日程試算表');
  const sheet = spreadsheet.getSheetByName('日程');
  if (!sheet) throw new Error('找不到日程工作表');
  return sheet;
}

function botScheduleRows_(sheet) {
  const values = sheet.getDataRange().getValues();
  if (!values.length) return [];
  const headers = values[0].map(function(value) { return String(value).trim(); });
  const index = {};
  ['enabled', 'date', 'title', 'message', 'url'].forEach(function(name) {
    index[name] = headers.indexOf(name);
    if (index[name] === -1) throw new Error('日程工作表缺少欄位：' + name);
  });
  const timezone = sheet.getParent().getSpreadsheetTimeZone();
  return values.slice(1).map(function(row) {
    if (String(row[index.enabled]).trim().toUpperCase() !== 'TRUE') return null;
    const date = botScheduleDateKey_(row[index.date], timezone);
    const title = String(row[index.title] || '').trim();
    if (!date || !title) return null;
    return {
      date: date,
      title: title,
      message: String(row[index.message] || '').trim(),
    };
  }).filter(Boolean).sort(function(a, b) {
    return a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'zh-Hant');
  });
}

function botScheduleShift_(dateKey, days) {
  const date = new Date(dateKey + 'T00:00:00Z');
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function botScheduleWeek_(today) {
  const day = new Date(today + 'T00:00:00Z').getUTCDay();
  const start = botScheduleShift_(today, -(day === 0 ? 6 : day - 1));
  return [start, botScheduleShift_(start, 6)];
}

function botScheduleDateLabel_(dateKey) {
  const date = new Date(dateKey + 'T00:00:00Z');
  const weekday = '日一二三四五六'[date.getUTCDay()];
  return (date.getUTCFullYear() - 1911) + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCDate() + '（' + weekday + '）';
}

function botScheduleCard_(kind, today, rows, unavailable) {
  const names = { today: '今天日程', week: '本週日程', next: '下一個重要日期' };
  const week = botScheduleWeek_(today);
  const future = rows.filter(function(row) { return row.date >= today; });
  const nextDate = future.length ? future[0].date : null;
  const selected = unavailable ? [] : rows.filter(function(row) {
    if (kind === 'today') return row.date === today;
    if (kind === 'week') return row.date >= week[0] && row.date <= week[1];
    return row.date === nextDate;
  });
  const visible = selected.slice(0, 6);
  const period = kind === 'week'
    ? botScheduleDateLabel_(week[0]) + '－' + botScheduleDateLabel_(week[1])
    : kind === 'today' ? botScheduleDateLabel_(today)
      : nextDate ? botScheduleDateLabel_(nextDate) : '目前沒有未到的日程';
  const empty = unavailable ? '目前無法讀取日程資料，請稍後再試。'
    : kind === 'today' ? '今天沒有已列入的日程。'
      : kind === 'week' ? '本週沒有已列入的日程。' : '目前沒有下一筆未到的日程。';

  return {
    type: 'flex',
    altText: names[kind] + '｜' + (selected.length ? period + '，共 ' + selected.length + ' 項' : empty),
    contents: {
      type: 'bubble', size: 'mega',
      header: { type: 'box', layout: 'vertical', backgroundColor: '#14243A', paddingAll: '20px', spacing: 'sm', contents: [
        botText_('升學小助手  ／  日程查詢', { color: '#A7F3D0', size: 'xs', weight: 'bold' }),
        botText_('📅 ' + names[kind], { color: '#FFFFFF', size: 'xl', weight: 'bold' }),
        botText_(period, { color: '#CBD5E1', size: 'sm' }),
      ] },
      body: { type: 'box', layout: 'vertical', paddingAll: '18px', spacing: 'md', contents: visible.length ? visible.map(function(row) {
        return { type: 'box', layout: 'vertical', backgroundColor: '#F1F5F9', cornerRadius: '12px', paddingAll: '14px', spacing: 'xs', contents: [
          botText_(botScheduleDateLabel_(row.date), { color: '#0F766E', size: 'xs', weight: 'bold' }),
          botText_(row.title, { color: '#0F172A', size: 'md', weight: 'bold' }),
          botText_(row.message.indexOf('當日考程：／') === 0 ? row.message.replace(/／/g, '\n') : (row.message || '請查看官方公告與學校通知。'), { color: '#475569', size: 'sm' }),
        ] };
      }).concat(selected.length > visible.length ? [botText_('另有 ' + (selected.length - visible.length) + ' 項，請到完整日程查看。', { color: '#64748B', size: 'xs' })] : [])
        : [botText_(empty, { color: '#475569', size: 'sm' })] },
      footer: { type: 'box', layout: 'vertical', paddingAll: '14px', spacing: 'sm', contents: [
        { type: 'button', style: 'link', color: '#0F766E', action: { type: 'uri', label: '查看完整日程', uri: SITE_URL + 'important-dates' } },
        botText_('日程如有異動，請以當年度官方公告與學校通知為準。', { color: '#64748B', size: 'xxs', align: 'center' }),
      ] },
    },
    quickReply: { items: [
      ['今天日程', '今天日程'], ['本週日程', '本週日程'], ['下一個重要日期', '下一個重要日期'],
    ].map(function(pair) { return { type: 'action', action: { type: 'message', label: pair[0], text: pair[1] } }; }) },
  };
}

function botScheduleReply_(kind, today) {
  const dateKey = today || Utilities.formatDate(new Date(), BOT_SCHEDULE_TIMEZONE, 'yyyy-MM-dd');
  try {
    return botScheduleCard_(kind, dateKey, botScheduleRows_(botScheduleSheet_()), false);
  } catch (error) {
    console.error('日程查詢失敗：' + String(error.message || error));
    return botScheduleCard_(kind, dateKey, [], true);
  }
}

// 在 Webhook Apps Script 專案手動執行，不會向 LINE 發送訊息。
function testScheduleQuerySource() {
  const rows = botScheduleRows_(botScheduleSheet_());
  console.log('日程工作表連線正常，已讀取 ' + rows.length + ' 筆啟用日程。');
}

function botScheduleHandleEvent_(event) {
  if (event.type !== 'message' || !event.message || event.message.type !== 'text') return false;
  const kind = botScheduleQueryKind_(event.message.text);
  if (!kind) return false;
  const eventId = typeof event.webhookEventId === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(event.webhookEventId)
    ? 'schedule:event:' + event.webhookEventId : null;
  const cache = CacheService.getScriptCache();
  if (eventId && cache.get(eventId)) return true;
  replyMessage(event.replyToken, botScheduleReply_(kind));
  if (eventId) cache.put(eventId, '1', 21600);
  return true;
}
