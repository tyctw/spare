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

function scheduleReminderMessage_(message, reminderType) {
  if (reminderType !== '提前2天') return message;
  return message.replace(/^今天為/, '兩天後為')
    .replace(/今天/g, '當天')
    .replace(/今日/g, '當天');
}

function collectScheduleJobs_(sheet, dateKey) {
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

  const today = dateKey || scheduleDateKey_(new Date());
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
      message: scheduleReminderMessage_(String(row[index.message] || '').trim(), reminderType),
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
          '第 ' + job.rowNumber + ' 列' +
          '的發送結果待確認且已超過 24 小時，' +
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
        'LINE 已接受廣播：' +
        '第 ' + job.rowNumber + ' 列｜' +
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
      pattern: /模擬考|複習考/,
      color: '#0F766E',
      soft: '#F0FDFA',
      category: '模擬考提醒',
      icon: '✏️',
    },
    {
      pattern: /現場登記分發/,
      color: '#4338CA',
      soft: '#EEF2FF',
      category: '現場分發',
      icon: '🏫',
    },
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

// 依事件內容給準備方向，避免把所有提醒都寫成同一份通用清單。
// 實際文件與辦理程序仍以該筆日程的連結及官方公告為準。
function getScheduleChecklist_(title, isToday) {
  if (/模擬考|複習考/.test(title)) return [
    '對照本次考試範圍，整理最後複習重點。',
    '確認學校公布的考程、地點與應試用品。',
    isToday ? '留意今天的科目與入場時間。' : '預留交通與作息調整時間。',
  ];
  if (/放棄錄取資格/.test(title)) return [
    '確認放棄資格的適用條件與截止時間。',
    '依簡章備妥聲明文件與辦理方式。',
    isToday ? '今天完成聲明並確認是否受理。' : '先與學校核對程序，保留辦理紀錄。',
  ];
  if (/現場登記分發/.test(title)) return [
    '確認現場登記資格、地點與梯次時間。',
    '備妥公告要求的證件與相關文件。',
    isToday ? '依現場流程完成分發與報到確認。' : '事先查好交通與現場辦理方式。',
  ];
  if (/續招|簡章公告/.test(title)) return [
    '查看是否已有續招學校與正式簡章。',
    '核對報名資格、名額與辦理日期。',
    '有意參加時，依各校公告準備後續資料。',
  ];
  if (/報到/.test(title)) return [
    '確認錄取結果與報到學校。',
    '備妥通知要求的身分與報到文件。',
    isToday ? '核對今天的時間、地點並完成報到。' : '先查好報到時間、地點與辦理方式。',
  ];
  if (/報名/.test(title)) return [
    '核對報名資格、管道與受理時間。',
    '備妥簡章要求的資料與證明文件。',
    isToday ? '確認今天是否已完成報名及必要程序。' : '送出後確認報名結果，留意截止時間。',
  ];
  if (/志願|選填|序位/.test(title)) return [
    '核對可選校科與當年度招生規則。',
    '依自己的意願檢查志願順序。',
    isToday ? '確認今天完成送出並查核結果。' : '留意截止時間與送出後的確認方式。',
  ];
  if (/准考證/.test(title)) return [
    '確認准考證的領取或查詢方式。',
    '核對姓名、考區與其他應試資料。',
    '資料有誤時，依官方說明儘速處理。',
  ];
  if (/放榜|分發|成績/.test(title)) return [
    '確認官方公告時間與查詢入口。',
    '準備查詢所需的個人資料。',
    '查詢後記下後續申請或報到期限。',
  ];
  if (/考試|會考|測驗|檢定/.test(title)) return [
    '確認應試時間、考場與交通方式。',
    '依通知備妥應試證件與用品。',
    isToday ? '預留交通時間，留意入場規定。' : '再次核對官方應試注意事項。',
  ];
  if (/截止|放棄/.test(title)) return [
    '確認官方截止時間與適用資格。',
    '核對表單、文件與送出方式。',
    isToday ? '今天完成辦理並確認受理結果。' : '提早完成辦理，保留確認紀錄。',
  ];
  return [
    '確認這項日程適用的對象與時間。',
    '查看官方公告的辦理方式與所需資料。',
    '記下後續步驟與相關期限。',
  ];
}

function createScheduleFlexMessage_(data) {
  const theme = getScheduleTheme_(data.title);
  const isToday = data.reminderType === '今日';
  const isExamDay = /國中教育會考第[一二]天/.test(data.title);
  const reminderLabel = isToday ? '今天要留意' : '提前 2 天提醒';
  const checklist = getScheduleChecklist_(data.title, isToday);

  // 允許從 Markdown 表格貼入的 [文字](網址)，實際送給 LINE 時只保留網址。
  const rawUrl = String(data.url || '').trim();
  const markdownUrl = rawUrl.match(/^\[[^\]]+\]\((https:\/\/[^\s)]+)\)$/i);
  const targetUrl = (markdownUrl ? markdownUrl[1] : rawUrl) || SCHEDULE_CONFIG.defaultUrl;

  if (!/^https:\/\/[^\s]+$/i.test(targetUrl)) {
    throw new Error(
      'url 請填完整 HTTPS 網址，不要貼 Markdown 連結。'
    );
  }

  const message = data.message ||
    '請依學校通知與招生簡章，確認需要準備的文件及辦理方式。';
  const displayMessage = message.indexOf('當日考程：／') === 0
    ? message.replace(/／/g, '\n') : message;

  return {
    type: 'flex',
    altText: (
      '【升學日程・' + reminderLabel + '】' +
      data.date + '｜' + data.title
    ).slice(0, 400),

    contents: {
      type: 'bubble',
      size: 'mega',

      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#14243A',
        paddingAll: '24px',
        spacing: 'lg',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            alignItems: 'center',
            spacing: 'sm',
            contents: [
              scheduleText_('升學小助手  ／  日程提醒', {
                color: '#CBD5E1',
                size: 'xs',
                weight: 'bold',
                flex: 1,
              }),
              {
                type: 'box',
                layout: 'vertical',
                flex: 0,
                backgroundColor: theme.soft,
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
          scheduleText_(theme.category, {
            color: '#A7F3D0', size: 'xs', weight: 'bold',
          }),
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
        paddingAll: '22px',
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
              scheduleText_('重要日期', {
                size: 'xs',
                color: theme.color,
                weight: 'bold',
              }),
              scheduleText_(data.date, {
                size: 'xxl',
                color: '#0F172A',
                weight: 'bold',
              }),
              scheduleText_(
                isExamDay
                  ? (isToday ? '請提前到場，依准考證與考場公告應試。' : '先核對考場、交通與應試用品。')
                  : (isToday ? '請在今天核對受理時間與辦理方式。' : '先確認所需文件、資格與辦理方式。'),
                { size: 'sm', color: '#475569' }
              ),
            ],
          },
          scheduleText_('這次要做什麼', {
            weight: 'bold',
            color: '#0F172A',
          }),
          scheduleText_(displayMessage, {
            size: 'md',
            color: '#334155',
          }),
          {
            type: 'box',
            layout: 'vertical',
            backgroundColor: '#F8FAFC',
            cornerRadius: '14px',
            paddingAll: '16px',
            spacing: 'md',
            contents: [
              scheduleText_('準備清單', {
                size: 'sm', color: '#0F172A', weight: 'bold',
              }),
            ].concat(checklist.map(function(item, index) {
              return {
                type: 'box', layout: 'horizontal', spacing: 'sm',
                alignItems: 'start', contents: [
                  scheduleText_(String(index + 1).padStart(2, '0'), {
                    size: 'xs', color: theme.color, weight: 'bold', flex: 0,
                  }),
                  scheduleText_(item, { size: 'sm', color: '#334155', flex: 1 }),
                ],
              };
            })),
          },
          {
            type: 'separator',
            color: '#E2E8F0',
          },
          scheduleText_(
            data.sourceNote || (/模擬考|複習考/.test(data.title)
              ? '各校是否施測、考程與範圍，請以就讀學校通知為準。'
              : '實際受理時間、資格與辦理方式，請以官方簡章及學校公告為準。'),
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
              label: /模擬考|複習考/.test(data.title) ? '查看模擬考公告' : '查看日程與辦理資訊',
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
