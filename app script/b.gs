// ========================================
// 基本設定
// ========================================

const SITE_URL = 'https://tyctw.github.io/spare/';

const BOT_GROUPS = [
  {
    id: 'choose',
    title: '落點與志願',
    keywords: ['選志願', '我要選志願'],
    icon: '🎯',
    color: '#C2410C',
    soft: '#FFF7ED',
  },
  {
    id: 'schools',
    title: '學校與科別',
    keywords: ['學校', '科別', '查學校'],
    icon: '🏫',
    color: '#0369A1',
    soft: '#F0F9FF',
  },
  {
    id: 'scoring',
    title: '各區計分',
    keywords: ['比序', '計分', '查計分', '超額比序'],
    icon: '🧮',
    color: '#0F766E',
    soft: '#F0FDFA',
  },
  {
    id: 'plan',
    title: '日程與探索',
    keywords: ['升學規劃', '探索'],
    icon: '📅',
    color: '#6D28D9',
    soft: '#F5F3FF',
  },
  {
    id: 'member',
    title: '會員與個資',
    keywords: ['會員服務'],
    icon: '✨',
    color: '#BE185D',
    soft: '#FDF2F8',
  },
  {
    id: 'help',
    title: '操作與回報',
    keywords: ['使用協助', '客服'],
    icon: '💬',
    color: '#B45309',
    soft: '#FFFBEB',
  },
  {
    id: 'resources',
    title: '延伸資源',
    keywords: ['分享平台', '外部連結'],
    icon: '🔗',
    color: '#4338CA',
    soft: '#EEF2FF',
  },
  {
    id: 'about',
    title: '平台與政策',
    keywords: ['關於', '平台資訊'],
    icon: '📖',
    color: '#334155',
    soft: '#F8FAFC',
  },
];

// 格式：標題、關鍵字、網址路徑、說明、提醒
const BOT_FEATURE_DATA = {
  choose: [
    [
      '落點分析',
      '落點|分析|首頁|會考落點',
      '',
      '依會考成績與就學區，探索高中職與科別。',
      '分析結果供規劃參考，不代表錄取保證。',
      '🎯',
    ],
    [
      '成績紀錄',
      '成績|我的成績|模擬考紀錄',
      'score-records',
      '登入後保存與管理模擬考、正式會考成績。',
      '這是個人成績紀錄，不是官方成績查詢系統。',
      '📝',
    ],
    [
      '模擬志願序',
      '志願|志願規劃|模擬志願|排志願|填志願',
      'mock-volunteer',
      '建立校科清單，練習調整志願順序。',
      '正式選填仍須依招生簡章，到指定系統辦理。',
      '📋',
    ],
    [
      '志願選填攻略',
      '攻略|選填攻略|志願策略',
      'strategy',
      '了解志願搭配方式，檢查排序是否符合自己的意願。',
      '開啟網站後，依頁面說明使用此功能。',
      '🗺️',
    ],
    [
      '歷年錄取統計',
      '歷年|錄取分數|歷年分數|歷年統計',
      'historical-stats',
      '查看歷年統計與相關升學資料。',
      '歷年資料只供參考，實際錄取依當年度招生結果。',
      '📊',
    ],
    [
      '學校比較',
      '比較學校|校科比較',
      'compare',
      '比較候選校科，協助整理志願選擇。',
      '若沒有比較資料，請先在網站加入候選項目。',
      '⚖️',
    ],
    [
      '成績變動分析',
      '分數變動|成績變動|成績變化',
      'score-change',
      '查看不同成績條件下的升學分析。',
      '請依頁面提示先輸入所需資料。',
      '📈',
    ],
  ],

  schools: [
    [
      '搜尋學校與科別',
      '搜尋|搜尋學校|查科別|學校搜尋',
      'search',
      '使用校名、科別或職群尋找學校資料。',
      '開啟網站後，依頁面說明使用此功能。',
      '🔍',
    ],
    [
      '學校類型解析',
      '學制|學校類型|高中高職|普高技高',
      'school-types',
      '了解普通高中、技術型高中、綜合高中與五專的差異。',
      '開啟網站後，依頁面說明使用此功能。',
      '📚',
    ],
    [
      '普通科與綜合高中',
      '普通科|綜高|綜合高中',
      'general-comprehensive-high-school',
      '比較普通科與綜高的課程及學程選擇。',
      '開啟網站後，依頁面說明使用此功能。',
      '🏫',
    ],
    [
      '技職群科百科',
      '技職|群科|職群|高職科別|群科百科',
      'vocational-encyclopedia',
      '認識職群、常見科別與未來進路。',
      '開啟網站後，依頁面說明使用此功能。',
      '🔧',
    ],
    [
      '技職群科比較',
      '群科比較|職群比較|技職比較',
      'vocational-compare',
      '比較不同技職群科，了解學習方向。',
      '如頁面尚無資料，請先加入比較項目。',
      '🆚',
    ],
    [
      '高二班群選擇',
      '高二|班群|自然組|社會組|18學群',
      'grade-11-pathways',
      '了解高二班群、自然與社會取向，以及學群規劃。',
      '開啟網站後，依頁面說明使用此功能。',
      '🗂️',
    ],
    [
      '高中職後續進路',
      '未來進路|升學就業|畢業出路|出路',
      'future-pathways',
      '查看不同學制後續的升學與就業方向。',
      '開啟網站後，依頁面說明使用此功能。',
      '🚀',
    ],
  ],

  scoring: [
    [
      '積分換算說明',
      '積分|積點|換算|等級|分數換算',
      'grade-level',
      '了解會考等級、積分與積點的換算概念。',
      '開啟網站後，依頁面說明使用此功能。',
      '🧮',
    ],
    [
      '基北區計分規則',
      '基北|基隆|台北|臺北|新北',
      'scoring-rules/taipei',
      '查看基北區會考換算與超額比序說明。',
      '開啟網站後，依頁面說明使用此功能。',
      '🏙️',
    ],
    [
      '桃連區計分規則',
      '桃連|桃園|連江',
      'scoring-rules/taoyuan',
      '查看桃連區會考換算與超額比序說明。',
      '開啟網站後，依頁面說明使用此功能。',
      '🍑',
    ],
    [
      '竹苗區計分規則',
      '竹苗|新竹|苗栗',
      'scoring-rules/hsinchu',
      '查看竹苗區會考換算與超額比序說明。',
      '開啟網站後，依頁面說明使用此功能。',
      '🎋',
    ],
    [
      '中投區計分規則',
      '中投|台中|臺中|南投',
      'scoring-rules/central',
      '查看中投區會考換算與超額比序說明。',
      '開啟網站後，依頁面說明使用此功能。',
      '🏔️',
    ],
    [
      '彰化區計分規則',
      '彰化',
      'scoring-rules/changhua',
      '查看彰化區會考換算與超額比序說明。',
      '開啟網站後，依頁面說明使用此功能。',
      '🌾',
    ],
    [
      '嘉義區計分規則',
      '嘉義|嘉義市|嘉義縣',
      'scoring-rules/chiayi',
      '查看嘉義區會考換算與超額比序說明。',
      '開啟網站後，依頁面說明使用此功能。',
      '🌲',
    ],
    [
      '臺南區計分規則',
      '台南|臺南',
      'scoring-rules/tainan',
      '查看臺南區會考換算與超額比序說明。',
      '開啟網站後，依頁面說明使用此功能。',
      '🏯',
    ],
    [
      '高雄區計分規則',
      '高雄',
      'scoring-rules/kaohsiung',
      '查看高雄區會考換算與超額比序說明。',
      '開啟網站後，依頁面說明使用此功能。',
      '⚓',
    ],
    [
      '五專計分規則',
      '五專|五專比序|五專積分|五專優先免試',
      'five-year-college-rules',
      '查看五專優先免試的積分項目與同分比序參考。',
      '不同招生管道規則可能不同，請核對當年度簡章。',
      '🎓',
    ],
  ],

  plan: [
    [
      '重要日程',
      '日程|日期|時程|時間表|報名|放榜|報到',
      'important-dates',
      '查看會考、高中職與五專的報名、選填、放榜及報到日期。',
      '確切受理時間與程序，請依簡章及學校公告。',
      '📅',
    ],
    [
      'Holland 興趣測驗',
      'holland|興趣|興趣測驗|性向測驗',
      'holland',
      '探索興趣類型，作為認識群科與升學方向的參考。',
      '測驗結果供探索參考，不是能力或職涯的定論。',
      '🧩',
    ],
    [
      '最新消息',
      '消息|公告|新聞|升學資訊',
      'news',
      '查看網站消息、升學文章與資料更新。',
      '開啟網站後，依頁面說明使用此功能。',
      '📰',
    ],
    [
      '就讀可行性評估',
      '通勤|生活評估|可行性|就讀可行性',
      'life-feasibility',
      '思考通勤與生活條件，評估就讀安排。',
      '開啟網站後，依頁面說明使用此功能。',
      '🏠',
    ],
    [
      '會考成績查詢導覽',
      '成績查詢|查會考成績|官方成績',
      '',
      '開啟首頁選單，在「我要規劃升學」中選擇「會考成績查詢」。',
      '此功能以彈窗開啟，按鈕會先帶你回首頁。',
      '🔎',
    ],
  ],

  member: [
    [
      '會員功能',
      '會員|會員方案|加入會員|免廣告|月費|年費',
      'membership',
      '查看會員方案、免廣告與其他會員權益。',
      '開啟網站後，依頁面說明使用此功能。',
      '✨',
    ],
    [
      '我的會員帳號',
      '帳號|會員帳號|登入|會員到期|到期日',
      'membership/account',
      '查看會員資格、方案、到期日與登入狀態。',
      '需先完成 LINE 登入。',
      '👤',
    ],
    [
      '個資與分享管理',
      '個資|分享管理|撤銷分享|刪除資料',
      'privacy-center',
      '查看個資與分享管理功能。',
      '開啟網站後，依頁面說明使用此功能。',
      '🔒',
    ],
  ],

  help: [
    [
      '使用說明',
      '教學|操作|怎麼用|使用教學',
      'instructions',
      '第一次使用網站，可先閱讀操作流程。',
      '開啟網站後，依頁面說明使用此功能。',
      '📖',
    ],
    [
      '常見問答',
      'faq|常見問題|名詞|問答',
      'faq-glossary',
      '認識會考、超額比序、志願序與常見升學名詞。',
      '開啟網站後，依頁面說明使用此功能。',
      '❓',
    ],
    [
      '問題回報',
      '回報|錯誤|bug|資料錯誤|系統問題',
      'report-error',
      '回報學校資料錯誤或網站操作問題。',
      '開啟網站後，依頁面說明使用此功能。',
      '🐛',
    ],
    [
      '網站地圖',
      '全部頁面|網站地圖|sitemap',
      'site-map',
      '一次查看網站各功能入口。',
      '開啟網站後，依頁面說明使用此功能。',
      '🗺️',
    ],
    [
      '小額支持',
      '支持|贊助|捐款',
      'support',
      '支持網站持續維護與更新升學工具。',
      '開啟網站後，依頁面說明使用此功能。',
      '💛',
    ],
    [
      '評分與回饋',
      '評分|回饋|建議',
      '',
      '開啟首頁選單，在「使用協助」中選擇「評分與回饋」。',
      '此功能以彈窗開啟，按鈕會先帶你回首頁。',
      '💬',
    ],
  ],

  resources: [
    [
      '延伸志願選填平台',
      '志願平台|選填平台',
      'https://tyctw.github.io/volunteer/',
      '前往延伸的志願選填平台。',
      '這不是招生委員會的正式報名系統。',
      '📝',
    ],
    [
      '錄取分享',
      '分享錄取|錄取結果分享',
      'https://tyctw.github.io/shared/',
      '查看全國錄取結果分享平台。',
      '分享資料供參考，录取結果請以正式公告為準。',
      '🏆',
    ],
    [
      '序位分享',
      '分享序位|積分分享',
      'https://tyctw.github.io/score/',
      '前往會考積分與序位分享平台。',
      '分享資料不等同官方個人序位查詢。',
      '🔢',
    ],
  ],

  about: [
    [
      '平台特色',
      '平台介紹|關於網站',
      'advantages',
      '了解網站提供的升學輔助工具。',
      '開啟網站後，依頁面說明使用此功能。',
      '⭐',
    ],
    [
      '更新紀錄',
      '版本|更新|changelog',
      'changelog',
      '查看網站功能調整與版本變更。',
      '開啟網站後，依頁面說明使用此功能。',
      '🔄',
    ],
    [
      '免責聲明',
      '免責|使用限制',
      'disclaimer',
      '了解資料與分析結果的使用限制。',
      '開啟網站後，依頁面說明使用此功能。',
      '⚠️',
    ],
    [
      '隱私權政策',
      '隱私|隱私政策|privacy',
      'privacy',
      '查看個人資料使用及隱私說明。',
      '開啟網站後，依頁面說明使用此功能。',
      '🔐',
    ],
    [
      '服務條款',
      '條款|terms',
      'terms',
      '了解平台使用規範。',
      '開啟網站後，依頁面說明使用此功能。',
      '📜',
    ],
    [
      '售後服務',
      '售後',
      'after-sales-service',
      '查看付款後的服務與協助說明。',
      '開啟網站後，依頁面說明使用此功能。',
      '🛎️',
    ],
    [
      '退款與取消政策',
      '退款|取消訂閱|取消方案',
      'refund-cancellation-policy',
      '查看退款與取消相關規定。',
      '開啟政策頁不會直接取消方案或完成退款。',
      '↩️',
    ],
  ],
};

// 建立完整功能資料
const BOT_FEATURES = BOT_GROUPS.reduce(function(all, group) {
  const features = BOT_FEATURE_DATA[group.id].map(function(row) {
    return {
      groupId: group.id,
      title: row[0],
      keywords: [row[0]].concat(row[1].split('|')),
      url: /^https:\/\//.test(row[2])
        ? row[2]
        : SITE_URL + row[2],
      description: row[3],
      hint: row[4] || '開啟網站後，依頁面說明使用此功能。',
      color: group.color,
      soft: group.soft,
      tag: group.title,
      icon: row[5] || group.icon,
    };
  });

  return all.concat(features);
}, []);

const BOT_HELP_KEYWORDS = [
  '幫助', '選單', '功能', '全部功能',
  '功能選單', 'help', 'menu', '你好', '您好',
];

// ========================================
// Webhook 入口
// ========================================

function doGet() {
  return botOutput_('LINE Flex Webhook is running');
}

function doPost(e) {
  if (!e || !e.postData || !e.postData.contents) {
    console.log('請由 LINE 呼叫 Webhook；手動測試請執行 testBotRouting。');
    return botOutput_('No request body');
  }

  const body = JSON.parse(e.postData.contents);

  if (!Array.isArray(body.events)) {
    throw new Error('Webhook 缺少 events');
  }

  const failures = [];

  body.events.forEach(function(event) {
    try {
      handleLineEvent(event);
    } catch (error) {
      console.error(String(error.message || error));
      failures.push(error);
    }
  });

  if (failures.length) {
    throw new Error(
      failures.length + ' 筆事件處理失敗，請查看執行記錄。'
    );
  }

  return botOutput_('OK');
}

function botOutput_(text) {
  return ContentService
    .createTextOutput(text)
    .setMimeType(ContentService.MimeType.TEXT);
}

function handleLineEvent(event) {
  if (
    !event ||
    event.mode === 'standby' ||
    !event.replyToken
  ) {
    return;
  }

  if (typeof botScheduleHandleEvent_ === 'function' && botScheduleHandleEvent_(event)) return;
  if (typeof guideHandleEvent_ === 'function' && guideHandleEvent_(event)) return;

  if (event.type === 'follow') {
    replyMessage(event.replyToken, createWelcomeFlexMessage());
    return;
  }

  if (
    event.type === 'message' &&
    event.message &&
    event.message.type === 'text'
  ) {
    handleTextMessage(event);
  }
}

function handleTextMessage(event) {
  if (
    !event ||
    !event.message ||
    typeof event.message.text !== 'string' ||
    !event.replyToken
  ) {
    console.log(
      '不要直接執行 handleTextMessage。' +
      '請執行 testBotRouting，或從 LINE 傳送文字。'
    );
    return;
  }

  const message = buildBotReply_(event.message.text);
  replyMessage(event.replyToken, message);
}

// ========================================
// 關鍵字判斷
// ========================================

function botNormalize_(text) {
  return String(text || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/\s+/g, '')
    .trim();
}

function buildBotReply_(text) {
  const keyword = botNormalize_(text);

  if (!keyword) {
    return createHelpFlexMessage(false);
  }

  if (typeof botScheduleQueryKind_ === 'function') {
    const scheduleKind = botScheduleQueryKind_(text);
    if (scheduleKind) return botScheduleReply_(scheduleKind);
  }

  const isHelp = BOT_HELP_KEYWORDS.some(function(word) {
    return botNormalize_(word) === keyword;
  });

  if (isHelp) {
    return createHelpFlexMessage(false);
  }

  const group = BOT_GROUPS.find(function(item) {
    return [item.title].concat(item.keywords).some(function(word) {
      return botNormalize_(word) === keyword;
    });
  });

  if (group) {
    const features = BOT_FEATURES.filter(function(item) {
      return item.groupId === group.id;
    });

    return createFeatureListFlex_(
      group.title,
      features,
      group.color,
      group.icon
    );
  }

  // 完整匹配優先
  const exact = BOT_FEATURES.filter(function(item) {
    return item.keywords.some(function(word) {
      return botNormalize_(word) === keyword;
    });
  });

  if (exact.length === 1) {
    return typeof guideRender_ === 'function'
      ? guideRender_('feature/' + guideFeatureId_(exact[0]), false).message
      : createFeatureFlexMessage(exact[0]);
  }

  if (exact.length > 1) {
    return createFeatureListFlex_('請選擇功能', exact);
  }

  // 支援部分文字或句子搜尋
  const matches = keyword.length < 2 ? [] :
    BOT_FEATURES.filter(function(item) {
      return item.keywords.some(function(word) {
        const normalized = botNormalize_(word);

        return normalized.length >= 2 && (
          keyword.includes(normalized) ||
          normalized.includes(keyword)
        );
      });
    });

  if (matches.length === 1) {
    return typeof guideRender_ === 'function'
      ? guideRender_('feature/' + guideFeatureId_(matches[0]), false).message
      : createFeatureFlexMessage(matches[0]);
  }

  if (matches.length > 1) {
    return createFeatureListFlex_('找到這些相關功能', matches);
  }

  return createHelpFlexMessage(true);
}

// ========================================
// Flex 共用元件
// ========================================

function botText_(text, options) {
  return Object.assign({
    type: 'text',
    text: String(text),
    size: 'sm',
    color: '#475569',
    wrap: true,
  }, options || {});
}

function botTitle_(icon, title, color) {
  return {
    type: 'box',
    layout: 'horizontal',
    alignItems: 'center',
    spacing: 'md',
    contents: [
      botText_(icon, {
        size: 'xl',
        flex: 0,
        color: color,
      }),
      botText_(title, {
        size: 'xl',
        weight: 'bold',
        color: color,
        flex: 1,
      }),
    ],
  };
}

function botMenuButton_() {
  return {
    type: 'button',
    style: 'link',
    height: 'sm',
    color: '#64748B',
    action: {
      type: 'message',
      label: '返回功能分類',
      text: '選單',
    },
  };
}

function botScheduleQuickReply_() {
  return { items: ['今天日程', '本週日程', '下一個重要日期'].map(function(label) {
    return { type: 'action', action: { type: 'message', label: label, text: label } };
  }) };
}

// ========================================
// 單一功能卡片
// ========================================

function createFeatureFlexMessage(feature) {
  return {
    type: 'flex',
    altText: (
      feature.title + '｜' + feature.description
    ).slice(0, 400),

    contents: {
      type: 'bubble',
      size: 'mega',

      header: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '22px',
        spacing: 'lg',
        backgroundColor: '#14243A',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            alignItems: 'center',
            spacing: 'sm',
            contents: [
              botText_('升學小助手  ／  功能導覽', {
                color: '#CBD5E1',
                size: 'xs',
                weight: 'bold',
                flex: 1,
              }),
              {
                type: 'box',
                layout: 'vertical',
                flex: 0,
                backgroundColor: feature.soft,
                cornerRadius: '20px',
                paddingAll: '8px',
                contents: [
                  botText_(feature.tag, {
                  color: feature.color,
                    size: 'xxs',
                    weight: 'bold',
                  }),
                ],
              },
            ],
          },
          botTitle_(feature.icon, feature.title, '#FFFFFF'),
          botText_('找到需要的資訊，接著到網站使用完整功能。', {
            color: '#CBD5E1', size: 'xs',
          }),
        ],
      },

      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '22px',
        spacing: 'lg',
        contents: [
          botText_('你可以做什麼', { color: feature.color, size: 'xs', weight: 'bold' }),
          botText_(feature.description, {
            size: 'md', weight: 'bold',
            color: '#0F172A',
          }),
          {
            type: 'box',
            layout: 'vertical',
            paddingAll: '16px',
            cornerRadius: '14px',
            backgroundColor: feature.soft,
            spacing: 'sm',
            contents: [
              botText_('使用前先知道', {
                color: feature.color,
                weight: 'bold',
                size: 'xs',
              }),
              botText_(feature.hint),
            ],
          },
        ],
      },

      footer: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '18px',
        spacing: 'sm',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: feature.color,
            action: {
              type: 'uri',
              label: '前往' + feature.title.slice(0, 14),
              uri: feature.url,
            },
          },
          botMenuButton_(),
        ],
      },
    },
  };
}

// ========================================
// 8 類功能首頁
// ========================================

function createHelpFlexMessage(unknownKeyword) {
  return {
    type: 'flex',
    altText: '升學小助手｜選擇功能分類，找到需要的升學資訊',
    quickReply: botScheduleQuickReply_(),

    contents: {
      type: 'bubble',
      size: 'mega',

      header: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '22px',
        backgroundColor: '#14243A',
        spacing: 'md',
        contents: [
          botText_('升學小助手  ／  功能選單', { color: '#A7F3D0', size: 'xs', weight: 'bold' }),
          botTitle_('🧭', '今天想查什麼？', '#FFFFFF'),
          botText_(
            unknownKeyword
              ? '還沒找到相符項目。選一個分類，或換個關鍵字試試。'
              : '從下方選擇分類，快速找到下一步。',
            { color: '#CBD5E1' }
          ),
        ],
      },

      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '18px',
        spacing: 'sm',
        contents: BOT_GROUPS.map(function(group) {
          const count = BOT_FEATURE_DATA[group.id].length;

          return {
            type: 'box',
            layout: 'horizontal',
            alignItems: 'center',
            spacing: 'sm',
            paddingAll: '14px',
            cornerRadius: '14px',
            backgroundColor: group.soft,
            action: {
              type: 'message',
              label: group.title,
              text: group.title,
            },
            contents: [
              botText_(group.icon, {
                size: 'lg',
                flex: 0,
              }),
              botText_(group.title, {
                color: group.color,
                weight: 'bold',
                flex: 1,
              }),
              botText_(count + ' 項  ›', {
                color: group.color,
                size: 'xs',
                flex: 0,
              }),
            ],
          };
        }),
      },

      footer: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '14px',
        contents: [
          {
            type: 'button',
            style: 'link',
            color: '#475569',
            action: {
              type: 'uri',
              label: '查看完整網站地圖',
              uri: SITE_URL + 'site-map',
            },
          },
        ],
      },
    },
  };
}

// ========================================
// 分類列表與搜尋結果
// 每張卡 6 項，超過可左右滑動
// ========================================

function createFeatureListFlex_(title, features, color, icon) {
  color = color || '#334155';
  icon = icon || '🔎';

  if (!features.length) {
    return createHelpFlexMessage(true);
  }

  // 最多 12 張卡，每張 6 項。
  const visible = features.slice(0, 72);
  const pages = [];

  for (let i = 0; i < visible.length; i += 6) {
    pages.push(visible.slice(i, i + 6));
  }

  const bubbles = pages.map(function(items, pageIndex) {
    return {
      type: 'bubble',
      size: 'mega',

      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#14243A',
        paddingAll: '20px',
        spacing: 'sm',
        contents: [
          botText_('升學小助手  ／  功能清單', { color: '#CBD5E1', size: 'xs', weight: 'bold' }),
          botTitle_(icon, title, '#FFFFFF'),
          botText_(
            '共 ' + features.length + ' 項' +
            (pages.length > 1
              ? ' · 第 ' + (pageIndex + 1) +
                '/' + pages.length + ' 頁，左右滑動查看'
              : ''),
            { size: 'xs', color: '#CBD5E1' }
          ),
        ],
      },

      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '16px',
        spacing: 'sm',
        contents: items.map(function(feature) {
          return {
            type: 'box',
            layout: 'horizontal',
            paddingAll: '14px',
            cornerRadius: '14px',
            backgroundColor: feature.soft,
            spacing: 'sm',
            alignItems: 'center',
            action: {
              type: 'message',
              label: '查看操作步驟',
              text: feature.title,
            },
            contents: [
              botText_(feature.icon, {
                size: 'lg',
                flex: 0,
              }),
              {
                type: 'box',
                layout: 'vertical',
                flex: 1,
                spacing: 'xs',
                contents: [
                  botText_(feature.title, {
                    color: feature.color,
                    weight: 'bold',
                  }),
                  botText_(feature.description, {
                    size: 'xs', color: '#475569',
                  }),
                ],
              },
              botText_('›', {
                color: feature.color,
                flex: 0,
              }),
            ],
          };
        }),
      },

      footer: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '12px',
        contents: [botMenuButton_()],
      },
    };
  });

  return {
    type: 'flex',
    altText: title + '｜共 ' + features.length + ' 項功能',
    contents: bubbles.length === 1
      ? bubbles[0]
      : {
          type: 'carousel',
          contents: bubbles,
        },
  };
}

// ========================================
// 新好友歡迎卡片
// ========================================

function createWelcomeFlexMessage() {
  return {
    type: 'flex',
    altText: '歡迎加入升學小助手！輸入「選單」查看功能。',
    quickReply: botScheduleQuickReply_(),

    contents: {
      type: 'bubble',
      size: 'mega',

      header: {
        type: 'box',
        layout: 'vertical',
        backgroundColor: '#14243A',
        paddingAll: '24px',
        spacing: 'md',
        contents: [
          botText_('升學小助手  ／  歡迎加入', {
            color: '#A7F3D0',
            size: 'xs',
          }),
          botTitle_('🌱', '一起整理升學下一步', '#FFFFFF'),
        ],
      },

      body: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '24px',
        spacing: 'lg',
        contents: [
          botText_(
            '重要日程、學校科別、成績紀錄與志願規劃，都可以從這裡開始。',
            {
              size: 'md',
              color: '#0F172A',
            }
          ),
          {
            type: 'box',
            layout: 'vertical',
            paddingAll: '16px',
            cornerRadius: '12px',
            backgroundColor: '#ECFDF5',
            contents: [
              botText_(
                '想一步步操作？點下方按鈕。\n想查日期？輸入「今天日程」、「本週日程」或「下一個重要日期」。',
                { color: '#065F46' }
              ),
            ],
          },
        ],
      },

      footer: {
        type: 'box',
        layout: 'vertical',
        paddingAll: '20px',
        contents: [
          {
            type: 'button',
            style: 'primary',
            color: '#047857',
            action: {
              type: 'message',
              label: '開始逐步操作',
              text: '開始',
            },
          },
        ],
      },
    },
  };
}

// ========================================
// LINE API
// ========================================

function botLineApi_(endpoint, payload) {
  const token = PropertiesService
    .getScriptProperties()
    .getProperty('LINE_CHANNEL_ACCESS_TOKEN');

  if (!token || !token.trim()) {
    throw new Error(
      '請在指令碼屬性設定 LINE_CHANNEL_ACCESS_TOKEN'
    );
  }

  const response = UrlFetchApp.fetch(
    'https://api.line.me/v2/bot/message/' + endpoint,
    {
      method: 'post',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token.trim(),
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    }
  );

  const status = response.getResponseCode();

  if (status < 200 || status >= 300) {
    throw new Error(
      'LINE API 失敗：HTTP ' +
      status + ' ' +
      response.getContentText()
    );
  }
}

function replyMessage(replyToken, message) {
  if (!replyToken) {
    throw new Error('缺少 replyToken');
  }

  botLineApi_('reply', {
    replyToken: replyToken,
    messages: [message],
  });
}

// ========================================
// 手動測試：不會發送訊息
// ========================================

// 不需要 Token，測試關鍵字是否能產生回覆。
function testBotRouting() {
  const examples = [
    '選單',
    '日程',
    '成績',
    '成績查詢',
    '桃園',
    '各區計分',
    '我想看興趣測驗',
    '會員到期',
    '退款',
    '不存在的關鍵字',
  ];

  examples.forEach(function(text) {
    const reply = buildBotReply_(text);

    if (!reply || reply.type !== 'flex' || !reply.contents) {
      throw new Error('無法產生回覆：' + text);
    }

    console.log(text + ' → ' + reply.altText);
  });

  console.log('關鍵字測試完成，未發送任何訊息。');
}

// 需要 Token，只向 LINE 驗證格式，不實際回覆或廣播。
function validateAllFlexMessages() {
  const messages = BOT_FEATURES.map(function(feature) {
    return createFeatureFlexMessage(feature);
  });

  messages.push(createHelpFlexMessage(false));
  messages.push(createHelpFlexMessage(true));
  messages.push(createWelcomeFlexMessage());

  BOT_GROUPS.forEach(function(group) {
    const features = BOT_FEATURES.filter(function(feature) {
      return feature.groupId === group.id;
    });

    messages.push(
      createFeatureListFlex_(
        group.title,
        features,
        group.color,
        group.icon
      )
    );
  });

  messages.forEach(function(message) {
    botLineApi_('validate/reply', {
      messages: [message],
    });

    console.log('格式通過：' + message.altText);
  });

  console.log('全部格式驗證完成，未發送訊息。');
}
