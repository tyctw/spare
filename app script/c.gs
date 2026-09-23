// 聊天室逐步操作。與 b.gs 放在同一個 Apps Script 專案，無新增 Token。
// 按鈕包含完整路徑，不依賴 Session；Cache 僅用於文字回覆與「上一步」。
// 不在 Sheet / Properties 保存成績；聊天文字與卡片仍會留在 LINE 對話中。
const GUIDE_REGIONS = [
  ['taipei', '基北區'], ['taoyuan', '桃連區'], ['hsinchu', '竹苗區'],
  ['central', '中投區'], ['changhua', '彰化區'], ['chiayi', '嘉義區'],
  ['tainan', '臺南區'], ['kaohsiung', '高雄區'],
];
const GUIDE_GRADES = ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C'];
const GUIDE_SUBJECTS = ['國文', '英文', '數學', '自然', '社會', '寫作'];
const GUIDE_VOCATIONAL = ['機械群', '動力機械群', '電機與電子群', '化工群', '土木與建築群', '商業與管理群', '外語群', '設計群', '農業群', '食品群', '家政群', '餐旅群', '水產群', '海事群', '藝術群'];

// 每個功能都有獨立的準備與操作說明；以既有網站功能為準。
const GUIDE_STEPS = {
  '落點分析': ['準備五科等級與寫作級分，先選擇就學區。', '在聊天室逐科輸入後，確認成績，再帶入網站。', '網站確認授權碼或會員資格後執行分析，再檢查校科與落點區間。'],
  '成績紀錄': ['先準備模擬考或正式會考的五科等級與寫作級分。', '開啟成績紀錄並登入 LINE，依頁面新增或管理紀錄。', '回首頁可匯入已儲存成績；官方會考成績仍需到官方系統查詢。'],
  '模擬志願序': ['先整理有意願就讀的學校與科別。', '開啟模擬志願序，搜尋並加入校科，再調整順序。', '檢查校科、通勤與就讀意願；可匯出或建立分享連結，會員可開啟協作。'],
  '志願選填攻略': ['想想最在意的是課程、興趣、地點或生活條件。', '閱讀選填攻略，再用學校比較與模擬志願序整理選擇。', '核對招生簡章與正式選填期限；網站模擬不會替你送出正式志願。'],
  '歷年錄取統計': ['準備想查的學校、科別與就學區。', '開啟歷年錄取統計，查看頁面提供的年度與資料。', '確認年份、招生管道與計分方式是否相同，再作比較。'],
  '學校比較': ['先到落點分析結果加入候選校科。', '開啟學校比較，查看各項條件與差異。', '結合興趣、交通和費用討論，再整理到志願序。'],
  '成績變動分析': ['準備基準成績，並先依網站提示完成所需的分析。', '開啟成績變動分析，調整想比較的成績條件。', '觀察校科選項的差異；分析只是規劃參考。'],
  '搜尋學校與科別': ['準備校名、科別、縣市或群別關鍵字。', '可在聊天室輸入關鍵字，再開啟已帶入文字的搜尋頁。', '在網站用縣市、學制與群別篩選，核對學校及科別資料。'],
  '學校類型解析': ['先想想偏好學科探索或實作學習。', '閱讀普高、技高、綜高與五專的學制差異。', '再用群科百科與後續進路，確認學習內容與方向。'],
  '普通科與綜合高中': ['先了解自己是否已有明確的學科或職群方向。', '比較普通科課程與綜合高中的學程安排。', '實際開設學程與選課規定，請再查各校公告。'],
  '技職群科百科': ['先選有興趣的職群，不確定時可先做興趣測驗。', '閱讀該群的學習內容、常見科別與未來進路。', '再查開設學校，確認課程、實習及通勤條件。'],
  '技職群科比較': ['先從群科百科挑選想比較的群別。', '開啟群科比較，加入候選群別。', '比較課程、進路與自己的興趣，再找開設學校。'],
  '高二班群選擇': ['先整理喜歡的科目與想探索的大學學群。', '閱讀高二班群與學群介紹，比較學習方向。', '核對就讀學校實際班群、課程與選課規定。'],
  '高中職後續進路': ['先確認想了解的學制與群科。', '閱讀對應的升學與就業方向。', '有證照、術科或體格條件的進路，需另外核對官方規定。'],
  '積分換算說明': ['準備五科等級、寫作級分與就學區。', '先了解等級、積分與積點的差異，再查看各區規則。', '完整超額比序可能還包含志願序及多元學習表現，不能只看會考分數。'],
  '五專計分規則': ['先確認報名的是哪一種五專招生管道。', '閱讀五專積分項目與同分比序說明。', '依當年度該管道簡章確認採計資料、報名與選填方式。'],
  '重要日程': ['先確認招生年度、就學區及高中職或五專管道。', '開啟重要日程，找到報名、選填、放榜與報到項目。', '核對主辦單位公告的截止時間及辦理方式，尤其注意報到程序。'],
  'Holland 興趣測驗': ['找一段能專心作答的時間，依自己的偏好回答。', '開啟測驗並依頁面完成題目。', '把結果當作探索起點，再到群科百科了解課程。'],
  '最新消息': ['先確認想了解網站更新還是升學資訊。', '開啟最新消息，注意發布日期與適用年度。', '涉及招生辦法與時程時，再核對原始官方公告。'],
  '就讀可行性評估': ['整理通勤時間、交通方式、費用與住宿需求。', '開啟就讀可行性評估，依頁面檢視生活條件。', '和家人討論可接受範圍，再調整志願順序。'],
  '會考成績查詢導覽': ['準備官方查詢系統要求的資料，請勿把證號或驗證碼傳到聊天室。', '開啟首頁選單 → 我要規劃升學 → 會考成績查詢。', '依官方系統指示查詢；網站個人成績紀錄不是官方成績單。'],
  '會員功能': ['先查看方案期限、價格與需要的會員功能。', '開啟會員頁並登入 LINE，確認方案後依頁面付款。', '完成後到我的會員帳號確認資格與到期時間。'],
  '我的會員帳號': ['準備使用購買時的同一個 LINE 帳號登入。', '開啟我的會員帳號，查看會員資格、到期時間及交易資料。', '若付款後未啟用，先確認帳號，再透過售後服務或問題回報求助。'],
  '個資與分享管理': ['先確認想管理的是保存資料還是分享連結。', '登入後開啟個資與分享管理，檢查對應項目。', '刪除資料或撤銷分享前，閱讀網站的確認提示。'],
  '使用說明': ['第一次使用可從落點分析開始，也能先探索學制與群科。', '開啟使用說明，依序了解資料輸入、分析與志願規劃。', '遇到問題可查看常見問答，或選擇問題回報。'],
  '常見問答': ['整理不清楚的名詞或操作問題。', '開啟常見問答，查看會考、超額比序與志願序說明。', '各區規則不同，涉及計分時請再查對應就學區。'],
  '問題回報': ['整理發生問題的頁面、操作步驟與錯誤訊息。', '開啟回報頁，依表單填寫；如提供截圖，請遮住個資與付款敏感資料。', '依頁面提交回報；目前聊天室不會自動建立客服案件。'],
  '網站地圖': ['想直接找所有頁面時，可以使用網站地圖。', '開啟網站地圖，依分類選擇功能。', '也可回聊天室輸入功能名稱，查看逐步操作。'],
  '小額支持': ['先閱讀支持方式、金額與相關說明。', '開啟支持頁，確認內容後依頁面操作。', '支持與會員購買是不同流程；會員資格請到會員方案查看。'],
  '評分與回饋': ['整理想分享的使用感受或功能建議。', '開啟首頁選單 → 使用協助 → 評分與回饋。', '依彈窗填寫並提交；系統錯誤請改用問題回報。'],
  '延伸志願選填平台': ['先整理候選學校與科別。', '開啟延伸平台，依其頁面說明進行規劃。', '此平台不是招生委員會正式報名系統。'],
  '錄取分享': ['先分辨需要的是參考資料還是自己的正式錄取結果。', '開啟錄取分享平台查看或依平台規則分享。', '分享內容僅供參考，自己的錄取與報到請看正式公告。'],
  '序位分享': ['先確認年度與就學區，避免混用資料。', '開啟序位分享平台查看或依平台規則分享。', '群眾分享不等於官方個人序位查詢。'],
  '平台特色': ['可先了解平台提供的升學工具。', '閱讀平台特色，再從選單選擇需要的功能。', '分析工具協助規劃，實際招生請以官方公告為準。'],
  '更新紀錄': ['想確認功能變動時，可查看更新紀錄。', '開啟更新頁，依日期閱讀版本調整。', '若更新後操作有問題，可附上頁面與步驟回報。'],
  '免責聲明': ['使用分析或歷年資料前，先確認其適用限制。', '開啟免責聲明閱讀資料與分析結果的使用說明。', '錄取、比序、招生與報到仍以官方最新公告為準。'],
  '隱私權政策': ['先確認想了解的資料蒐集與使用項目。', '開啟隱私權政策閱讀說明。', '管理自己的資料或分享連結，請前往個資與分享管理。'],
  '服務條款': ['使用服務或付款前可先閱讀條款。', '開啟服務條款，確認適用規範。', '付款後的協助與退款規定，另見售後及退款政策。'],
  '售後服務': ['整理交易時間、遇到的問題與必要的訂單資訊。', '開啟售後服務頁，依指定方式取得協助。', '請勿在聊天室提供完整卡號、密碼或一次性驗證碼。'],
  '退款與取消政策': ['先查看交易日期、方案與退款適用條件。', '開啟退款與取消政策，依頁面說明提出申請。', '點擊此引導不會取消方案或退款，仍需完成網站指定程序。'],
};

function guideFeatureId_(feature) {
  return feature.groupId + '-' + BOT_FEATURE_DATA[feature.groupId].findIndex(function(row) { return row[0] === feature.title; });
}
function guideFeature_(id) {
  return BOT_FEATURES.find(function(feature) { return guideFeatureId_(feature) === id; });
}
function guideSteps_(feature) {
  if (feature.url.indexOf('/scoring-rules/') !== -1) {
    return ['先確認招生年度、就學區與招生管道。', '查看' + feature.title + '，分別核對會考換算、其他積分項目與同分比序。', '依當年度官方簡章計算；只有五科等級與作文不足以推算完整超額比序總分。'];
  }
  return GUIDE_STEPS[feature.title];
}
function guideAction_(label, route) {
  return { type: 'postback', label: label.slice(0, 20), data: 'guide:v1:' + route, displayText: label };
}
function guideChoice_(label, route) { return { label: label, route: route }; }
function guideLink_(label, url) { return { label: label, url: url }; }
function guideVisual_(route) {
  const key = String(route || '').split('/')[0];
  const visuals = {
    home: ['🧭', '#172554', '#DBEAFE'], group: ['✦', '#312E81', '#EDE9FE'],
    feature: ['✦', '#0F766E', '#CCFBF1'], steps: ['✓', '#0369A1', '#E0F2FE'],
    regions: ['📍', '#9A3412', '#FFEDD5'], rule: ['🧮', '#0F766E', '#CCFBF1'],
    scores: ['✎', '#BE185D', '#FCE7F3'], search: ['⌕', '#075985', '#E0F2FE'],
    vocational: ['⚙', '#166534', '#DCFCE7'], vgroup: ['★', '#166534', '#DCFCE7'],
    cancel: ['↶', '#475569', '#F1F5F9'], private: ['🔒', '#7C2D12', '#FFEDD5'],
  };
  return visuals[key] || ['✦', '#334155', '#F1F5F9'];
}
function guideFeatureChoice_(title) {
  const feature = BOT_FEATURES.find(function(item) { return item.title === title; });
  if (!feature) throw new Error('找不到導覽功能：' + title);
  return guideChoice_(title, 'feature/' + guideFeatureId_(feature));
}

// 每頁最多 6 個選項；Quick Reply 最多 13 個，label 最多 20 字。
function guideCard_(title, description, choices, back, route) {
  const pages = [];
  const items = choices.length ? choices : [guideChoice_('回主選單', 'home')];
  for (let i = 0; i < items.length; i += 6) pages.push(items.slice(i, i + 6));
  const controls = [];
  if (back) controls.push(guideChoice_('上一步', back));
  controls.push(guideChoice_('重新開始', 'home'), guideChoice_('取消操作', 'cancel'));
  const visual = guideVisual_(route);
  const action = function(item, index) {
    if (item.url) return { type: 'uri', label: item.label.slice(0, 20), uri: item.url };
    const result = guideAction_(item.label, item.route);
    result.label = item.label.slice(0, 20);
    return result;
  };
  const bubbles = pages.map(function(page, index) {
    return {
      type: 'bubble', size: 'mega',
      header: { type: 'box', layout: 'vertical', backgroundColor: visual[1], paddingAll: '22px', spacing: 'md', contents: [
        { type: 'box', layout: 'horizontal', alignItems: 'center', contents: [
          botText_('SPARE · 升學小助手', { color: visual[2], size: 'xxs', weight: 'bold', flex: 1 }),
          { type: 'box', layout: 'vertical', flex: 0, cornerRadius: '10px', backgroundColor: '#FFFFFF33', paddingAll: '5px', contents: [
            botText_(pages.length > 1 ? (index + 1) + '/' + pages.length : 'GUIDE', { color: '#FFFFFF', size: 'xxs', weight: 'bold', align: 'center' }),
          ] },
        ] },
        { type: 'box', layout: 'horizontal', alignItems: 'center', spacing: 'md', contents: [
          botText_(visual[0], { color: '#FFFFFF', size: 'xxl', flex: 0 }),
          botText_(title, { color: '#FFFFFF', size: 'xl', weight: 'bold', flex: 1 }),
        ] },
        botText_('逐步操作' + (pages.length > 1 ? ' · 左右滑動查看' : ''), { color: visual[2], size: 'xs' }),
      ] },
      body: { type: 'box', layout: 'vertical', paddingAll: '18px', spacing: 'md', backgroundColor: '#FFFFFF', contents: [
        { type: 'box', layout: 'vertical', paddingAll: '14px', cornerRadius: '12px', backgroundColor: visual[2], contents: [botText_(description, { color: '#0F172A', size: 'sm' })] },
      ].concat(page.map(function(item, itemIndex) {
        const button = { type: 'button', style: item.url || itemIndex === 0 ? 'primary' : 'secondary', color: item.url || itemIndex === 0 ? visual[1] : undefined, height: 'sm', action: action(item, itemIndex) };
        return button;
      })) },
      footer: { type: 'box', layout: 'vertical', backgroundColor: '#F8FAFC', paddingAll: '12px', spacing: 'xs', contents: controls.map(function(item) {
        return { type: 'button', style: 'link', color: '#64748B', height: 'sm', action: action(item) };
      }) },
    };
  });
  const message = { type: 'flex', altText: (title + '｜' + description).slice(0, 400), contents: bubbles.length === 1 ? bubbles[0] : { type: 'carousel', contents: bubbles } };
  const quick = (choices.length <= 10 ? choices : []).concat(controls);
  message.quickReply = { items: quick.map(function(item) { return { type: 'action', action: action(item) }; }) };
  // 路徑資訊不放進 LINE payload，只交給本地對話處理器保存。
  return { message: message, route: route, back: back, choices: choices };
}

function guideRender_(route, privateChat) {
  if (typeof route !== 'string' || route.length > 260) return guideInvalid_();
  const parts = route.split('/');
  const kind = parts[0];
  if (route === 'home') return guideCard_('你想先做什麼？', '選擇分類，再依提示一步一步操作。也可以直接輸入功能名稱。', BOT_GROUPS.map(function(group) { return guideChoice_(group.icon + ' ' + group.title, 'group/' + group.id); }), null, route);
  if (route === 'cancel') return guideCard_('已取消操作', '已清除這次文字操作進度。想繼續時，輸入「開始」或點選重新開始；LINE 中已送出的訊息仍會保留。', [guideChoice_('重新開始', 'home')], null, route);
  if (kind === 'group' && parts.length === 2) {
    const group = BOT_GROUPS.find(function(item) { return item.id === parts[1]; });
    if (!group) return guideInvalid_();
    let choices = BOT_FEATURES.filter(function(item) { return item.groupId === group.id; }).map(function(item) { return guideFeatureChoice_(item.title); });
    if (group.id === 'scoring') choices = [guideChoice_('選就學區查計分', 'regions/rules')].concat(choices);
    return guideCard_(group.title, '你想完成哪一件事？選擇後會顯示準備事項與操作步驟。', choices, 'home', route);
  }
  if (kind === 'feature' && parts.length === 2) {
    const feature = guideFeature_(parts[1]);
    if (!feature) return guideInvalid_();
    const choices = [];
    if (feature.title === '落點分析') choices.push(guideChoice_('開始輸入成績', 'regions/analysis'));
    if (feature.title === '搜尋學校與科別') choices.push(guideChoice_('輸入搜尋關鍵字', 'search'));
    if (feature.title === '技職群科百科') choices.push(guideChoice_('先選有興趣的職群', 'vocational'));
    if (feature.groupId === 'scoring') choices.push(guideChoice_('選就學區查規則', 'regions/rules'));
    choices.push(guideChoice_('一步一步教我', 'steps/' + parts[1] + '/0'), guideLink_('直接開啟功能', feature.url));
    return guideCard_(feature.title, feature.description + '\n\n' + feature.hint, choices, 'group/' + feature.groupId, route);
  }
  if (kind === 'steps' && parts.length === 3) {
    const feature = guideFeature_(parts[1]);
    if (!feature || !/^[0-2]$/.test(parts[2])) return guideInvalid_();
    const step = Number(parts[2]);
    const steps = guideSteps_(feature);
    if (!steps) return guideInvalid_();
    const choices = step < 2 ? [guideChoice_('下一步', 'steps/' + parts[1] + '/' + (step + 1))] : [guideChoice_('查看同類其他功能', 'group/' + feature.groupId)];
    choices.push(guideLink_('開啟' + feature.title, feature.url));
    if (step === 2 && feature.groupId === 'choose') choices.push(guideFeatureChoice_('就讀可行性評估'));
    if (step === 2 && feature.groupId === 'member') choices.push(guideFeatureChoice_('售後服務'));
    return guideCard_(feature.title + ' · ' + (step + 1) + '/3', steps[step], choices, step ? 'steps/' + parts[1] + '/' + (step - 1) : 'feature/' + parts[1], route);
  }
  if (kind === 'regions' && parts.length === 2 && ['analysis', 'rules'].indexOf(parts[1]) !== -1) {
    const analysis = parts[1] === 'analysis';
    if (analysis && !privateChat) return guidePrivate_();
    const choices = GUIDE_REGIONS.map(function(region) { return guideChoice_(region[1], analysis ? 'scores/' + region[0] + '/-' : 'rule/' + region[0]); });
    choices.push(guideFeatureChoice_('五專計分規則'), guideChoice_('其他就學區', 'other-regions'));
    return guideCard_(analysis ? '步驟 1：選就學區' : '想查哪個就學區？', analysis ? '以下為網站已開放分析的就學區。接下來依序選五科等級與寫作級分，確認後可帶入網站。' : '先確認就學區；各區會考換算與超額比序不同。', choices, analysis ? 'feature/choose-0' : 'group/scoring', route);
  }
  if (route === 'other-regions') return guideCard_('其他就學區', '目前逐科輸入只提供網站已開放的 8 區。其他區域請查官方招生簡章；仍可使用校科搜尋與志願規劃工具。', [guideFeatureChoice_('搜尋學校與科別'), guideFeatureChoice_('模擬志願序'), guideFeatureChoice_('重要日程')], 'regions/rules', route);
  if (kind === 'rule' && parts.length === 2) {
    const region = GUIDE_REGIONS.find(function(item) { return item[0] === parts[1]; });
    if (!region) return guideInvalid_();
    return guideCard_(region[1] + '：想了解什麼？', '完整比序除了會考，還可能包含其他積分與同分比較。請以當年度該招生管道簡章為準。', [guideLink_('查看完整計分與比序', SITE_URL + 'scoring-rules/' + region[0]), guideFeatureChoice_('積分換算說明'), guideChoice_('輸入成績準備落點分析', 'scores/' + region[0] + '/-'), guideFeatureChoice_('重要日程')], 'regions/rules', route);
  }
  if (kind === 'scores' && parts.length === 3) return guideScores_(parts[1], parts[2], privateChat, route);
  if (route === 'search') {
    if (!privateChat) return guidePrivate_();
    return guideCard_('輸入校名或科別', '請直接傳送一個關鍵字，例如「中壢高中」「資訊科」或「餐旅群」（最多 60 字）。\n也可使用「搜尋：校名」，避免與選單指令重複。', [guideChoice_('改用職群探索', 'vocational'), guideLink_('直接開啟搜尋頁', SITE_URL + 'search')], 'feature/schools-0', route);
  }
  if (route === 'vocational') return guideCard_('你想探索哪個職群？', '左右滑動查看所有職群。不確定方向，也可先做興趣測驗。', GUIDE_VOCATIONAL.map(function(name, index) { return guideChoice_(name, 'vgroup/' + index); }).concat([guideFeatureChoice_('Holland 興趣測驗')]), 'group/schools', route);
  if (kind === 'vgroup' && parts.length === 2 && /^(?:[0-9]|1[0-4])$/.test(parts[1])) {
    const name = GUIDE_VOCATIONAL[Number(parts[1])];
    return guideCard_(name + '：下一步', '先了解學習內容，再找學校或比較其他職群。', [guideLink_('了解課程與未來進路', SITE_URL + 'vocational-encyclopedia?group=' + encodeURIComponent(name)), guideLink_('搜尋開設學校', SITE_URL + 'search?q=' + encodeURIComponent(name)), guideLink_('加入群科比較', SITE_URL + 'vocational-compare?group=' + encodeURIComponent(name))], 'vocational', route);
  }
  return guideInvalid_();
}

function guidePrivate_() {
  return guideCard_('請在一對一聊天室操作', '逐科輸入與文字搜尋請到本官方帳號的一對一聊天室，輸入「開始」。此處仍可查看公開功能導覽。', [guideChoice_('查看功能選單', 'home')], 'home', 'private');
}
function guideInvalid_() {
  return guideCard_('這個操作無法使用', '按鈕版本或資料不正確，請重新選擇功能。', [guideChoice_('重新開始', 'home')], 'home', 'invalid');
}

function guideScores_(regionId, encoded, privateChat, route) {
  if (!privateChat) return guidePrivate_();
  const region = GUIDE_REGIONS.find(function(item) { return item[0] === regionId; });
  if (!region || !/^(?:-|[0-6]{1,6})$/.test(encoded)) return guideInvalid_();
  const digits = encoded === '-' ? '' : encoded;
  const prefix = 'scores/' + regionId + '/';
  const back = digits.length ? prefix + (digits.slice(0, -1) || '-') : 'regions/analysis';
  const summary = digits.split('').map(function(value, index) { return GUIDE_SUBJECTS[index] + '：' + (index === 5 ? value + ' 級分' : GUIDE_GRADES[Number(value)]); }).join('、');
  if (digits.length < 6) {
    const index = digits.length;
    const options = index === 5 ? ['6', '5', '4', '3', '2', '1', '0'] : GUIDE_GRADES;
    return guideCard_('步驟 ' + (index + 2) + '/8：' + GUIDE_SUBJECTS[index], region[1] + (summary ? '\n已填：' + summary : '') + '\n請點選' + (index === 5 ? '寫作級分（0～6）。' : '等級（A++～C）。') + '\n也可直接輸入等級，或輸入「上一步」修改。', options.map(function(value) { return guideChoice_(index === 5 ? value + ' 級分' : value, prefix + digits + (index === 5 ? value : GUIDE_GRADES.indexOf(value))); }), back, route);
  }
  // Fragment 不會隨 HTTP request 傳給網站主機；網站只預填，不自動送出分析。
  const handoff = SITE_URL + '#line-guide=v1.' + regionId + '.' + digits;
  return guideCard_('步驟 8/8：確認成績', region[1] + '\n' + summary + '\n\n確認後可帶入網站，完成授權碼或會員驗證並執行分析。這裡尚未計算落點或完整比序總分。成績會留在這段 LINE 對話中。', [guideLink_('確認並帶入網站分析', handoff), guideChoice_('修改成績（重新逐科填）', prefix + '-'), guideChoice_('改選就學區', 'regions/analysis'), guideLink_('查看該區計分規則', SITE_URL + 'scoring-rules/' + regionId)], back, route);
}

function guideSessionKey_(event) {
  const source = event.source || {};
  // 不使用 UserCache：Web App 執行身分不是 LINE 使用者。
  return source.type === 'user' && source.userId ? 'guide:v1:' + source.userId : null;
}
function guideRemember_(event, page) {
  const key = guideSessionKey_(event);
  if (!key) return;
  const cache = CacheService.getScriptCache();
  if (page.route === 'cancel') cache.remove(key);
  else cache.put(key, JSON.stringify({ route: page.route, back: page.back, choices: page.choices }), 1800);
}
function guideSession_(event) {
  const key = guideSessionKey_(event);
  if (!key) return null;
  const raw = CacheService.getScriptCache().get(key);
  try { return raw ? JSON.parse(raw) : null; } catch (_) { return null; }
}

function guideHandleEvent_(event) {
  const privateChat = !!guideSessionKey_(event);
  const eventKey = typeof event.webhookEventId === 'string' && /^[A-Za-z0-9_-]{1,100}$/.test(event.webhookEventId) ? 'guide:event:' + event.webhookEventId : null;
  if (eventKey && CacheService.getScriptCache().get(eventKey)) return true;
  let page = null;
  if (event.type === 'postback') {
    const data = event.postback && event.postback.data;
    if (typeof data !== 'string' || data.indexOf('guide:') !== 0) return false;
    page = data.indexOf('guide:v1:') === 0 ? guideRender_(data.slice(9), privateChat) : guideInvalid_();
  } else if (event.type === 'message' && event.message && event.message.type === 'text') {
    const text = event.message.text.trim();
    const word = botNormalize_(text);
    const session = guideSession_(event);
    if (['開始', '開始操作', '逐步操作', '一步一步', '重新開始', '主選單'].concat(BOT_HELP_KEYWORDS).some(function(item) { return botNormalize_(item) === word; })) page = guideRender_('home', privateChat);
    else if (['取消', '取消操作', '結束', '退出'].indexOf(word) !== -1) page = guideRender_('cancel', privateChat);
    else if (['上一步', '返回', '回上一步'].indexOf(word) !== -1) page = session ? guideRender_(session.back || 'home', privateChat) : guideExpired_();
    else if (/^(搜尋|查學校)[:：]/.test(text)) page = privateChat ? guideSearch_(text.replace(/^[^:：]+[:：]/, '').trim()) : guidePrivate_();
    else {
      // 目前選項優先（例如寫作 0 級分、下一步），其次完整關鍵字，最後才是自由輸入。
      const choice = session && session.choices.find(function(item) { return item.route && botNormalize_(item.label) === word; });
      const group = BOT_GROUPS.find(function(item) { return [item.title].concat(item.keywords).some(function(value) { return botNormalize_(value) === word; }); });
      const feature = BOT_FEATURES.find(function(item) { return item.keywords.some(function(value) { return botNormalize_(value) === word; }); });
      if (choice) page = guideRender_(choice.route, privateChat);
      else if (group) page = guideRender_('group/' + group.id, privateChat);
      else if (feature) page = guideRender_('feature/' + guideFeatureId_(feature), privateChat);
      else if (session && session.route.indexOf('scores/') === 0) {
        const parts = session.route.split('/');
        const digits = parts[2] === '-' ? '' : parts[2];
        const value = text.normalize('NFKC').replace(/\s|級分/g, '').toUpperCase();
        const index = digits.length === 5 && /^[0-6]$/.test(value) ? Number(value) : digits.length < 5 ? GUIDE_GRADES.indexOf(value) : -1;
        page = guideRender_(index >= 0 ? 'scores/' + parts[1] + '/' + digits + index : session.route, privateChat);
        if (index < 0 && digits.length < 6) {
          page.message.altText = '輸入格式不正確，請使用卡片上的等級按鈕。';
          const bubbles = page.message.contents.type === 'carousel' ? page.message.contents.contents : [page.message.contents];
          bubbles.forEach(function(bubble) { bubble.body.contents.unshift(botText_('輸入格式不正確，請選下方等級，或輸入 A++、B+ 等格式。寫作請輸入 0～6。', { color: '#BE123C' })); });
        }
      } else if (session && session.route === 'search') page = guideSearch_(text);
      else if (session && ['下一步', '繼續'].indexOf(word) !== -1) page = guideRender_(session.route, privateChat);
      else if (!session && (/^(?:[ABC](?:\+\+|\+)?|[0-6](?:級分)?)$/i.test(word) || ['下一步', '繼續'].indexOf(word) !== -1)) page = guideExpired_();
    }
  }
  if (!page) {
    if (event.type === 'message' && event.message && event.message.type === 'text') {
      const key = guideSessionKey_(event);
      if (key) CacheService.getScriptCache().remove(key);
    }
    return false;
  }
  replyMessage(event.replyToken, page.message);
  guideRemember_(event, page);
  // LINE 重送同一事件時，不把同一則文字再次當成下一科成績。
  // Cache 是盡力去重；按鈕的完整路徑則不會因重送而多前進一步。
  if (eventKey) CacheService.getScriptCache().put(eventKey, '1', 21600);
  return true;
}
function guideExpired_() {
  return guideCard_('請重新選擇操作', '文字操作進度已到期或尚未開始。可以點原本卡片上的按鈕繼續，或重新開始。', [guideChoice_('重新開始', 'home')], null, 'expired');
}
function guideSearch_(query) {
  if (!query || query.length > 60 || /[\u0000-\u001f]/.test(query)) return guideCard_('請輸入 1～60 字關鍵字', '一次輸入校名、科別或群別即可，例如「資訊科」。', [guideChoice_('重新輸入', 'search')], 'search', 'search');
  return guideCard_('搜尋條件已準備好', '關鍵字：' + query + '\n開啟網站即可查看符合關鍵字的資料，再用縣市、學制或群別篩選。', [guideLink_('查看搜尋結果', SITE_URL + 'search?q=' + encodeURIComponent(query)), guideChoice_('換個關鍵字', 'search'), guideChoice_('改看職群', 'vocational')], 'search', 'search-result');
}

// 在 Apps Script 中執行：呼叫 LINE 格式驗證端點，不向使用者發送訊息。
function validateGuideMessages() {
  const routes = ['home', 'cancel', 'regions/analysis', 'regions/rules', 'other-regions', 'search', 'vocational'];
  BOT_GROUPS.forEach(function(group) { routes.push('group/' + group.id); });
  BOT_FEATURES.forEach(function(feature) {
    routes.push('feature/' + guideFeatureId_(feature));
    [0, 1, 2].forEach(function(step) { routes.push('steps/' + guideFeatureId_(feature) + '/' + step); });
  });
  GUIDE_REGIONS.forEach(function(region) {
    routes.push('rule/' + region[0]);
    ['-', '0', '01', '012', '0123', '01234', '012340'].forEach(function(scores) { routes.push('scores/' + region[0] + '/' + scores); });
  });
  GUIDE_VOCATIONAL.forEach(function(_, index) { routes.push('vgroup/' + index); });
  routes.forEach(function(route) { botLineApi_('validate/reply', { messages: [guideRender_(route, true).message] }); });
  [guidePrivate_(), guideInvalid_(), guideExpired_(), guideSearch_('資訊科'), guideSearch_('')].forEach(function(page) { botLineApi_('validate/reply', { messages: [page.message] }); });
  console.log('逐步操作格式驗證完成，未發送訊息。');
}
