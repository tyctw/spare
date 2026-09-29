// Per-region metadata for /scoring-rules/:id pages
export const SCORING_RULES_META: Record<string, { title: string; description: string; cityKeywords: string }> = {
  taipei: {
    title: '基北區超額比序計分規則｜臺北市、新北市、基隆市免試入學',
    description: '整理 115 學年度基北區（臺北市、新北市、基隆市）免試入學超額比序項目：志願序、多元學習表現與國中教育會考積分換算，最高 108 分；正式規則以簡章為準。',
    cityKeywords: '基北區, 臺北市, 新北市, 基隆市',
  },
  taoyuan: {
    title: '桃連區超額比序計分規則｜桃園市、連江縣免試入學',
    description: '整理 115 學年度桃連區（桃園市、連江縣）免試入學超額比序項目：適性輔導、多元學習表現與國中教育會考積分換算，合計 100 分；正式規則以簡章為準。',
    cityKeywords: '桃連區, 桃園市, 連江縣, 馬祖',
  },
  hsinchu: {
    title: '竹苗區超額比序計分規則｜新竹縣市、苗栗縣免試入學',
    description: '整理 115 學年度竹苗區（新竹縣市、苗栗縣）免試入學超額比序項目：均衡發展、多元學習表現與國中教育會考積分換算，合計 100 分；正式規則以簡章為準。',
    cityKeywords: '竹苗區, 新竹縣, 新竹市, 苗栗縣',
  },
  central: {
    title: '中投區超額比序計分規則｜臺中市、南投縣免試入學',
    description: '整理 115 學年度中投區（臺中市、南投縣）免試入學超額比序項目：志願序、多元學習表現、會考成績與扶助弱勢積分換算；正式規則以簡章為準。',
    cityKeywords: '中投區, 臺中市, 南投縣',
  },
  changhua: {
    title: '彰化區超額比序計分規則｜彰化縣免試入學',
    description: '整理 115 學年度彰化區（彰化縣）免試入學超額比序項目與積分換算規則，協助國中生規劃會考升學志願；正式規則以官方簡章為準。',
    cityKeywords: '彰化區, 彰化縣',
  },
  chiayi: {
    title: '嘉義區超額比序計分規則｜嘉義市、嘉義縣免試入學',
    description: '整理 115 學年度嘉義區（嘉義市、嘉義縣）免試入學超額比序項目與會考積分換算，總分 82 分；正式規則以官方簡章為準。',
    cityKeywords: '嘉義區, 嘉義市, 嘉義縣',
  },
  tainan: {
    title: '臺南區超額比序計分規則｜臺南市免試入學',
    description: '整理 115 學年度臺南區（臺南市）免試入學超額比序項目與積分換算規則，協助國中生規劃會考升學志願；正式規則以官方簡章為準。',
    cityKeywords: '臺南區, 台南區, 臺南市',
  },
  kaohsiung: {
    title: '高雄區超額比序計分規則｜高雄市免試入學',
    description: '整理 115 學年度高雄區（高雄市）免試入學超額比序項目與積分換算規則，協助國中生規劃會考升學志願；正式規則以官方簡章為準。',
    cityKeywords: '高雄區, 高雄市',
  },
};

const defaultDescription = '你的會考成績，能選哪些高中職？輸入成績與就學區，免費查看落點、探索五專選擇，志願選填更有方向。';

type PageMeta = {
  title: string;
  description: string;
  noindex?: boolean;
  nofollow?: boolean;
};

export const pageMetadata: Record<string, PageMeta> = {
  '/departments': {
    title: '技術型高中科別總覽｜87 個科別獨立介紹',
    description: '依 6 大類別與 15 個群別探索 87 個技術型高中科別，逐一了解學習內容、實作方向、選校提醒與開設學校。',
  },
  '/vocational-compare': {
    title: '職群比較｜高中職課程、升學與職涯方向比較',
    description: '選擇 2～3 個技術型高中職群，從主要課程、相關科別、升學方向、可能職涯與 Holland 興趣比較差異，並查詢開設學校，探索適合自己的升學方向。',
  },
  '/': {
    title: '免費會考落點分析｜你的成績，能選哪些高中職？',
    description: defaultDescription,
  },
  '/advantages': {
    title: '關於我們｜全國會考落點分析',
    description: '認識全國會考落點分析如何整理升學資訊，協助國中生與家長規劃高中職、五專志願。',
  },
  '/five-year-college-rules': {
    title: '五專優先免試計分規則｜全國會考落點分析',
    description: '了解五專優先免試入學的積分項目、志願序與同分比序規則，協助規劃適合自己的升學選擇。',
  },
  '/grade-level': {
    title: '會考等級對照表｜答對題數與積分說明',
    description: '查詢國中教育會考各科等級、標示與答對題數對照，快速了解會考成績的判讀方式。',
  },
  '/score-inquiry': {
    title: '會考成績查詢｜官方入口與落點分析下一步',
    description: '從國中教育會考官方網站查詢成績，了解查詢後如何填入成績與就學區，使用本站探索高中職校科及規劃志願。',
  },
  '/guide/find': {
    title: '學校與科別｜搜尋學校及探索技職群科｜全國會考落點分析',
    description: '搜尋學校與科別，了解學校類型、技職群科與職群比較，整理適合自己的升學方向。',
  },
  '/guide/choose': {
    title: '成績與志願｜會考查詢、落點分析與志願序｜全國會考落點分析',
    description: '從會考成績查詢、落點分析到模擬志願序，逐步整理選填方向。',
  },
  '/guide/scoring': {
    title: '計分與比序｜會考積分換算與各區規則｜全國會考落點分析',
    description: '集中查詢基北、桃連、竹苗、中投、彰化、嘉義、臺南、高雄計分規則，以及積分換算與五專優先免試比序。',
  },
  '/guide/plan': {
    title: '升學規劃｜興趣探索、班群與重要時程｜全國會考落點分析',
    description: '探索興趣、比較生活條件，認識班群與未來路徑，掌握升學重要時程。',
  },
  '/guide/member': {
    title: '會員與資源｜會員方案與升學工具｜全國會考落點分析',
    description: '查看會員資格、免廣告方案與延伸升學資源，持續完成個人升學規劃。',
  },
  '/guide/help': {
    title: '說明與支援｜會考落點分析操作說明｜全國會考落點分析',
    description: '查找功能使用說明、常見問題、平台規範與更新資訊，快速取得操作協助。',
  },
  '/grade-11-pathways': {
    title: '高二班群怎麼選？｜全國會考落點分析',
    description: '認識高二班群、自然與社會取向、數學 A／B 及 18 學群，規劃自己的高中學習路徑。',
  },
  '/future-pathways': {
    title: '高中職三年後的下一步地圖｜全國會考落點分析',
    description: '互動整理普高、技高、綜高與五專畢業後的常見升學、技優、特殊選才、就業與轉換路徑；正式資格以當年度簡章為準。',
  },
  '/life-feasibility': {
    title: '生活條件比較單｜通勤、費用與住宿評估｜全國會考落點分析',
    description: '比較兩所候選校科的通勤時間、轉乘、費用、住宿與家庭支持，可列印後和學生、家長或導師討論。',
  },
  '/general-comprehensive-high-school': {
    title: '普通科與綜合高中怎麼選？｜全國會考落點分析',
    description: '比較普通科與綜合高中的課程與探索方向，協助學生選擇適合自己的高中學程。',
  },
  '/faq-glossary': {
    title: '會考常見問答與名詞百科｜全國會考落點分析',
    description: '快速認識會考、免試入學、超額比序、志願序、個別序位、技高與五專等常見升學名詞。',
  },
  '/historical-stats': {
    title: '歷年會考統計資料｜成績趨勢與級距',
    description: '彙整歷年國中教育會考統計資料與級距資訊，協助考生與家長掌握成績分布及升學趨勢。',
  },
  '/important-dates': {
    title: '116 學年度重要日程｜會考、高中職與五專入學時程',
    description: '依教育部日程表整理 116 年（2027 年）2 至 7 月會考、高中職與五專各入學管道：5 月 15、16 日會考、6 月 4 日成績查詢、7 月 6 日免試入學放榜，並附完整報名、選填及報到日程。',
  },
  '/news': {
    title: '最新消息｜全國會考落點分析',
    description: '查看本站資料更新、系統公告與教育合作資訊。',
  },
  '/instructions': {
    title: '落點分析使用說明｜會考志願選填指南',
    description: '了解如何輸入會考成績、選擇就學區並閱讀落點分析結果，完成志願選填前的規劃。',
  },
  '/mock-volunteer': {
    title: '模擬志願選填｜高中職與五專志願序規劃',
    description: '依照會考成績與就學區建立模擬志願選填清單，整理高中職與五專校系的志願順序。',
  },
  '/search': {
    title: '高中職、五專學校與科別搜尋｜全國會考落點分析',
    description: '搜尋各就學區高中職、五專與科別資訊，作為會考落點分析及志願選填的參考。',
  },
  '/score-change': {
    title: '一分改變分析｜會員升學決策工具｜全國會考落點分析',
    description: '以本次會考成績與篩選條件，模擬六科提高或降低一級後可能增減的校科選擇；僅供升學規劃參考。',
    noindex: true,
  },
  '/site-map': {
    title: '網站地圖｜全國會考落點分析',
    description: '瀏覽全國會考落點分析的所有功能與升學資訊頁面，快速找到需要的工具與說明。',
  },
  '/support': {
    title: '小額支持｜升學選校工具',
    description: '支持我們持續維護升學資訊、優化選校工具，讓核心服務免費開放給學生與家長使用。',
  },
  '/support/failed': {
    title: '付款未完成｜小額支持',
    description: '小額支持付款未完成時的重新付款與客服協助說明。',
    noindex: true,
  },
  '/support/success': {
    title: '付款完成｜小額支持',
    description: '感謝支持全國會考落點分析。',
    noindex: true,
  },
  '/membership': {
    title: '會員方案｜免廣告與升學工具｜全國會考落點分析',
    description: '以 LINE 登入確認會員資格，選擇免廣告方案並持續使用會考落點分析與升學規劃工具。',
  },
  '/membership/account': {
    title: '我的會員帳號｜全國會考落點分析',
    description: '查看目前會員資格與到期時間。',
    noindex: true,
  },
  '/privacy-center': {
    title: '個資與分享管理中心｜全國會考落點分析',
    description: '集中管理分享期限、撤銷連結、本機升學資料與個人資料管理入口。',
    noindex: true,
    nofollow: true,
  },
  '/membership/success': {
    title: '會員付款完成｜全國會考落點分析',
    description: '會員付款完成後的資格確認頁面。',
    noindex: true,
  },
  '/after-sales-service': {
    title: '售後服務｜升學選校工具',
    description: '小額支持的售後服務、交易聯絡與付款爭議處理說明。',
  },
  '/refund-cancellation-policy': {
    title: '退款與取消政策｜升學選校工具',
    description: '小額支持的取消、退款申請、原付款方式退回及交易爭議處理政策。',
  },
  '/holland': {
    title: '荷倫碼性向測驗｜探索適合的職群科系',
    description: '透過荷倫碼性向測驗認識個人興趣特質，探索適合的技職群科與升學方向。',
  },
  '/school-types': {
    title: '學校類型解析｜普通高中、技高與五專怎麼選',
    description: '比較普通型高中、技術型高中與五專的特色，協助學生依興趣與升學規劃選擇學校類型。',
  },
  '/strategy': {
    title: '會考志願選填攻略｜落點分析與志願序策略',
    description: '說明會考志願選填原則、個別序位與志願區間策略，協助考生做好免試入學規劃。',
  },
  '/vocational-encyclopedia': {
    title: '職群科系百科｜技職群科與升學方向',
    description: '認識技職教育各職群與科系特色，探索興趣、能力與未來升學方向的連結。',
  },
  '/privacy': {
    title: '隱私權政策｜全國會考落點分析',
    description: '全國會考落點分析的隱私權政策與資料使用說明。',
  },
  '/terms': {
    title: '服務條款｜全國會考落點分析',
    description: '全國會考落點分析的服務條款與使用注意事項。',
  },
  '/disclaimer': {
    title: '免責聲明｜全國會考落點分析',
    description: '說明會考落點分析結果的資料來源、使用範圍與正式招生資訊的確認方式。',
  },
  '/changelog': {
    title: '更新紀錄｜全國會考落點分析',
    description: '查看全國會考落點分析的功能更新、資料調整與服務改善紀錄。',
  },
  '/report-error': {
    title: '資料問題回報｜全國會考落點分析',
    description: '回報學校資料、功能操作或升學資訊問題，協助我們持續改善服務品質。',
  },
  '/score-records': {
    title: '我的會考成績紀錄｜全國會考落點分析',
    description: '登入後查看及管理自己的會考成績紀錄。',
    noindex: true,
    nofollow: true,
  },
  '/results': {
    title: '落點分析結果｜全國會考落點分析',
    description: defaultDescription,
    noindex: true,
  },
  '/compare': {
    title: '分析結果比較｜全國會考落點分析',
    description: '比較個人暫存的候選學校資料。',
    noindex: true,
  },
};
