const SCHEDULE_CONFIG = {
  sheetName: '日程',
  timezone: 'Asia/Taipei',
  defaultUrl: 'https://tyctw.github.io/spare/important-dates',
  broadcastUrl: 'https://api.line.me/v2/bot/message/broadcast',
  validateUrl:
    'https://api.line.me/v2/bot/message/validate/broadcast',
};

// ==============================
// 讀取 Sheet
// ==============================

function getScheduleSheet_() {
  const properties = PropertiesService.getScriptProperties();
  const spreadsheetId = properties.getProperty(
    'SCHEDULE_SPREADSHEET_ID'
  );

  const spreadsheet = spreadsheetId
    ? SpreadsheetApp.openById(spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!spreadsheet) {
    throw new Error(
      '請從 Google Sheet 開啟 Apps Script，或設定 ' +
      'SCHEDULE_SPREADSHEET_ID。'
    );
  }

  const sheet = spreadsheet.getSheetByName(
    SCHEDULE_CONFIG.sheetName
  );

  if (!sheet) {
    throw new Error('找不到工作表：日程');
  }

  return sheet;
}

// 日期統一轉成 yyyy-MM-dd。
// 支援 Sheet 日期儲存格與 yyyy/MM/dd、yyyy-MM-dd 文字。
function scheduleDateKey_(value, timezone) {
  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      throw new Error('日期無效');
    }

    return Utilities.formatDate(
      value,
      timezone || SCHEDULE_CONFIG.timezone,
      'yyyy-MM-dd'
    );
  }

  const text = String(value || '').trim();
  const match = text.match(
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/
  );

  if (!match) {
    throw new Error(
      '日期請使用西元 yyyy/MM/dd，例如 2027/03/04'
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const check = new Date(Date.UTC(year, month - 1, day));

  if (
    year < 2000 ||
    check.getUTCFullYear() !== year ||
    check.getUTCMonth() !== month - 1 ||
    check.getUTCDate() !== day
  ) {
    throw new Error('日期無效：' + text);
  }

  return (
    year + '-' +
    String(month).padStart(2, '0') + '-' +
    String(day).padStart(2, '0')
  );
}

// 用 UTC 日曆運算，避免時區造成提前日期偏移。
function shiftScheduleDate_(dateKey, days) {
  const parts = dateKey.split('-').map(Number);
  const date = new Date(
    Date.UTC(parts[0], parts[1] - 1, parts[2])
  );

  date.setUTCDate(date.getUTCDate() + days);
  return Utilities.formatDate(date, 'UTC', 'yyyy-MM-dd');
}

function collectScheduleJobs_(sheet) {
  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map(function(value) {
    return String(value).trim();
  });

  const required = [
    'enabled', 'date', 'title', 'message', 'url', 'sent',
  ];

  const index = {};

  required.forEach(function(name) {
    index[name] = headers.indexOf(name);

    if (index[name] === -1) {
      throw new Error('缺少欄位：' + name);
    }

    if (headers.lastIndexOf(name) !== index[name]) {
      throw new Error('欄位名稱重複：' + name);
    }
  });

  const today = scheduleDateKey_(new Date());
  const sheetTimezone = sheet
    .getParent()
    .getSpreadsheetTimeZone();

  const jobs = [];

  values.forEach(function(row, offset) {
    const rowNumber = offset + 2;

    if (
      String(row[index.enabled]).trim().toUpperCase() !== 'TRUE'
    ) {
      return;
    }

    const title = String(row[index.title] || '').trim();

    if (!title || !row[index.date]) {
      throw new Error(
        '第 ' + rowNumber + ' 列已啟用，但缺少日期或標題。'
      );
    }

    let eventKey;

    try {
      eventKey = scheduleDateKey_(
        row[index.date],
        sheetTimezone
      );
    } catch (error) {
      throw new Error(
        '第 ' + rowNumber + ' 列：' + error.message
      );
    }

    let reminderType;

    if (today === shiftScheduleDate_(eventKey, -2)) {
      reminderType = '提前2天';
    } else if (today === eventKey) {
      reminderType = '今日';
    } else {
      return;
    }

    const sentRecords = String(row[index.sent] || '')
      .split(',')
      .map(function(value) {
        return value.trim();
      })
      .filter(Boolean);

    const sentKey = eventKey + ':' + reminderType;

    if (sentRecords.includes(sentKey)) {
      return;
    }

    const data = {
      date: eventKey.replace(/-/g, '/'),
      title: title,
      reminderType: reminderType,
      message: String(row[index.message] || '').trim(),
      url: String(row[index.url] || '').trim(),
    };

    jobs.push({
      rowNumber: rowNumber,
      sentColumn: index.sent + 1,
      sentRecords: sentRecords,
      sentKey: sentKey,
      data: data,
      flex: createScheduleFlexMessage_(data),
    });
  });

  return jobs;
}

// ==============================
// 正式廣播
// ==============================

function sendScheduleBroadcast() {
  // 避免兩個排程同時讀取尚未發送的資料。
  const lock = LockService.getScriptLock();

  if (!lock.tryLock(1000)) {
    console.log('已有日程發送程序執行中，本次略過。');
    return;
  }

  try {
    const sheet = getScheduleSheet_();
    const jobs = collectScheduleJobs_(sheet);

    if (!jobs.length) {
      console.log('今天沒有需要發送的日程。');
      return;
    }

    const properties = PropertiesService.getScriptProperties();

    jobs.forEach(function(job) {
      // 保留同一筆請求的 retry key。
      // 如 LINE 已接受但 Sheet 尚未寫入，可在期限內安全重試。
      const identity = [
        sheet.getParent().getId(),
        sheet.getSheetId(),
        job.rowNumber,
        job.sentKey,
      ].join('|');

      const digest = Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        identity,
        Utilities.Charset.UTF_8
      );

      const propertyKey = 'SCHEDULE_PENDING_' +
        Utilities.base64EncodeWebSafe(digest);

      const stored = properties.getProperty(propertyKey);

      const pending = stored ? JSON.parse(stored) : {
        retryKey: Utilities.getUuid(),
        createdAt: Date.now(),
      };

      // LINE retry key 有效管理期間為 24 小時。
      if (Date.now() - pending.createdAt >= 24 * 60 * 60 * 1000) {
        throw new Error(
          '第 ' + job.rowNumber +
          ' 列的發送結果待確認且已超過 24 小時，' +
          '請先核對 LINE 發送紀錄，避免重複廣播。'
        );
      }

      properties.setProperty(
        propertyKey,
        JSON.stringify(pending)
      );

      scheduleLineRequest_(
        SCHEDULE_CONFIG.broadcastUrl,
        { messages: [job.flex] },
        pending.retryKey
      );

      const records = job.sentRecords.concat(job.sentKey);

      sheet
        .getRange(job.rowNumber, job.sentColumn)
        .setValue(records.join(','));

      SpreadsheetApp.flush();
      properties.deleteProperty(propertyKey);

      console.log(
        'LINE 已接受廣播：第 ' +
        job.rowNumber + ' 列｜' +
        job.data.title + '｜' +
        job.data.reminderType
      );
    });
  } finally {
    lock.releaseLock();
  }
}

// ==============================
// 配色與 Flex Message
// ==============================

function getScheduleTheme_(title) {
  const themes = [
    {
      pattern: /截止|放棄/,
      color: '#BE123C',
      soft: '#FFF1F2',
      category: '期限提醒',
      icon: '⏰',
    },
    {
      pattern: /報到/,
      color: '#4338CA',
      soft: '#EEF2FF',
      category: '入學報到',
      icon: '🏫',
    },
    {
      pattern: /報名/,
      color: '#1D4ED8',
      soft: '#EFF6FF',
      category: '報名資訊',
      icon: '📋',
    },
    {
      pattern: /志願|選填|序位/,
      color: '#C2410C',
      soft: '#FFF7ED',
      category: '志願選填',
      icon: '📝',
    },
    {
      pattern: /成績/,
      color: '#0F766E',
      soft: '#F0FDFA',
      category: '成績資訊',
      icon: '📊',
    },
    {
      pattern: /准考證/,
      color: '#0369A1',
      soft: '#F0F9FF',
      category: '考前準備',
      icon: '🎫',
    },
    {
      pattern: /放榜|分發/,
      color: '#047857',
      soft: '#ECFDF5',
      category: '錄取資訊',
      icon: '🎉',
    },
    {
      pattern: /考試|會考|測驗|檢定/,
      color: '#6D28D9',
      soft: '#F5F3FF',
      category: '考試提醒',
      icon: '✏️',
    },
  ];

  return themes.find(function(theme) {
    return theme.pattern.test(title);
  }) || {
    color: '#334155',
    soft: '#F8FAFC',
    category: '升學資訊',
    icon: '📅',
  };
}

function scheduleText_(text, options) {
  return Object.assign({
    type: 'text',
    text: String(text),
    size: 'sm',
    color: '#475569',
    wrap: true,
  }, options || {});
}

function createScheduleFlexMessage_(data) {
  const theme = getScheduleTheme_(data.title);
  const isToday = data.reminderType === '今日';
  const reminderLabel = isToday ? '就是今天' : '還有 2 天';

  const targetUrl = data.url || SCHEDULE_CONFIG.defaultUrl;

  if (!/^https:\/\/[^\s]+$/i.test(targetUrl)) {
    throw new Error(
      'url 請填完整 HTTPS 網址，不要貼 Markdown 連結。'
    );
  }

  const message = data.message ||
    '請依學校通知與招生簡章，確認需要準備的文件及辦理方式。';

  return {
    type: 'flex',
    altText: (
      '【' + reminderLabel + '】' +
      data.date + '｜' + data.title
    ).slice(0, 400),

    contents: {
      type: 'bubble',
      size: 'mega',

      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: theme.color,
        paddingAll: '24px',
        spacing: 'lg',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            alignItems: 'center',
            spacing: 'sm',
            contents: [
              scheduleText_('升學日程提醒', {
                color: '#FFFFFF',
                size: 'xs',
                weight: 'bold',
                flex: 1,
              }),
              {
                type: 'box',
                layout: 'vertical',
                flex: 0,
                backgroundColor: '#FFFFFF',
                cornerRadius: '20px',
                paddingTop: '5px',
                paddingBottom: '5px',
                paddingStart: '12px',
                paddingEnd: '12px',
                contents: [
                  scheduleText_(reminderLabel, {
                    color: theme.color,
                    size: 'xs',
                    weight: 'bold',
                  }),
                ],
              },
            ],
          },
          {
            type: 'box',
            layout: 'horizontal',
            alignItems: 'center',
            spacing: 'md',
            contents: [
              scheduleText_(theme.icon, {
                size: 'xl',
                color: '#FFFFFF',
                flex: 0,
              }),
              scheduleText_(data.title, {
                size: 'xl',
                color: '#FFFFFF',
                weight: 'bold',
                flex: 1,
              }),
            ],
          },
        ],
      },

      body: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#FFFFFF',
        paddingAll: '24px',
        spacing: 'lg',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: theme.soft,
            cornerRadius: '14px',
            paddingAll: '18px',
            spacing: 'sm',
            contents: [
              scheduleText_(theme.category, {
                size: 'xs',
                color: theme.color,
                weight: 'bold',
              }),
              scheduleText_(data.date, {
                size: 'xl',
                color: '#0F172A',
                weight: 'bold',
              }),
              scheduleText_(
                isToday
                  ? '請確認今天需要辦理的事項。'
                  : '提早確認文件與辦理方式，安心準備。',
                { size: 'xs' }
              ),
            ],
          },
          scheduleText_('這次要留意', {
            weight: 'bold',
            color: '#0F172A',
          }),
          scheduleText_(message, {
            size: 'md',
            color: '#334155',
          }),
          {
            type: 'separator',
            color: '#E2E8F0',
          },
          scheduleText_(
            '實際受理時間、資格與辦理方式，請以官方簡章及學校公告為準。',
            {
              size: 'xxs',
              color: '#64748B',
            }
          ),
        ],
      },

      footer: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            height: 'md',
            color: theme.color,
            action: {
              type: 'uri',
              label: '查看日程詳情',
              uri: targetUrl,
            },
          },
          scheduleText_(
            '會考落點分析 · 陪你準備升學下一步',
            {
              size: 'xxs',
              color: '#64748B',
              align: 'center',
            }
          ),
        ],
      },
    },
  };
}

// ==============================
// LINE API
// ==============================

function scheduleLineRequest_(url, payload, retryKey) {
  const token = PropertiesService
    .getScriptProperties()
    .getProperty('LINE_CHANNEL_ACCESS_TOKEN');

  if (!token || !token.trim()) {
    throw new Error(
      '尚未設定 LINE_CHANNEL_ACCESS_TOKEN'
    );
  }

  const headers = {
    Authorization: 'Bearer ' + token.trim(),
  };

  if (retryKey) {
    headers['X-Line-Retry-Key'] = retryKey;
  }

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: headers,
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  const status = response.getResponseCode();

  if (status >= 200 && status < 300) {
    return;
  }

  // 相同 retry key 已被 LINE 接受，不再重複發送。
  if (status === 409 && retryKey) {
    const responseHeaders = response.getAllHeaders();

    const accepted = Object.keys(responseHeaders).some(
      function(name) {
        return (
          name.toLowerCase() === 'x-line-accepted-request-id' &&
          Boolean(responseHeaders[name])
        );
      }
    );

    if (accepted) return;
  }

  throw new Error(
    'LINE API 失敗：HTTP ' +
    status + ' ' +
    response.getContentText()
  );
}

// ==============================
// 預覽與驗證：都不會實際廣播
// ==============================

function previewScheduleBroadcast() {
  const jobs = collectScheduleJobs_(getScheduleSheet_());

  if (!jobs.length) {
    console.log('今天沒有待發送日程。');
    return;
  }

  jobs.forEach(function(job) {
    console.log(
      '待發送：第 ' + job.rowNumber + ' 列｜' +
      job.data.reminderType + '｜' +
      job.data.date + '｜' +
      job.data.title
    );
  });

  console.log('共 ' + jobs.length + ' 則，尚未發送。');
}

function validateScheduleFlexDesign() {
  const titles = [
    '國中教育會考報名開始',
    '國中教育會考報名截止',
    '寄發國中教育會考准考證',
    '國中教育會考第一天',
    '國中教育會考成績公布',
    '免試入學志願選填開始',
    '免試入學放榜',
    '免試入學報到',
  ];

  titles.forEach(function(title, index) {
    const flex = createScheduleFlexMessage_({
      date: '2027/03/04',
      title: title,
      reminderType: index % 2 ? '今日' : '提前2天',
      message: '這是樣式驗證資料，非實際日程通知。',
      url: SCHEDULE_CONFIG.defaultUrl,
    });

    scheduleLineRequest_(
      SCHEDULE_CONFIG.validateUrl,
      { messages: [flex] }
    );

    console.log('格式驗證通過：' + title);
  });

  console.log('全部樣式驗證完成，未發送廣播。');
}

// ==============================
// 每日排程
// ==============================

// 手動執行一次即可。
// 會替換目前帳號建立的同名函式觸發器。
function createDailyTrigger() {
  const sheet = getScheduleSheet_();

  PropertiesService.getScriptProperties().setProperty(
    'SCHEDULE_SPREADSHEET_ID',
    sheet.getParent().getId()
  );

  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (
      trigger.getHandlerFunction() === 'sendScheduleBroadcast'
    ) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('sendScheduleBroadcast')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .nearMinute(0)
    .inTimezone(SCHEDULE_CONFIG.timezone)
    .create();

  console.log('已建立每日臺灣時間約 08:00 的觸發器。');
}