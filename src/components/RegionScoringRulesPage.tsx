import React from 'react';
import { AlertTriangle, ArrowLeft, ArrowRight, BookOpenCheck, Calculator, CheckCircle2, ExternalLink, FileText, MapPin, Scale } from 'lucide-react';
import { ALL_REGIONS } from './RegionModal';
import { withBasePath } from '../lib/routes';

type Rule = {
  title: string;
  maximum: string;
  description: string;
  points: string[];
};

type RegionRule = {
  total: string;
  source: string;
  sourceLabel: string;
  overview: string;
  rules: Rule[];
  exam: string[];
  reminders: string[];
  entryNote?: string;
  comparisonTable?: { category: string; maximum: string; item: string; conversion: string[]; description: string[] }[];
  specialNotes?: string[];
  tieBreakOrder?: string[];
  futureRule?: { title: string; announcements: string[]; total: string; table: { category: string; maximum: string; item: string; conversion: string[]; description: string[] }[]; tieBreakOrder: string[]; notes: string[] };
};

// 115 學年度資料以各區免試入學委員會核定簡章為準。這裡只整理「一般免試入學」的超額比序架構；
// 優先免試、完全免試、技優甄審與各校單獨招生可能使用不同規則。
const REGION_RULES: Record<string, RegionRule> = {
  taipei: {
    total: '108',
    source: 'https://12basic.tp.edu.tw/news/115%E5%AD%B8%E5%B9%B4%E5%BA%A6%E5%9F%BA%E5%8C%97%E5%8D%80%E9%AB%98%E7%B4%9A%E4%B8%AD%E7%AD%89%E5%AD%B8%E6%A0%A1%E5%85%8D%E8%A9%A6%E5%85%A5%E5%AD%B8%E7%B0%A1%E7%AB%A0/',
    sourceLabel: '115 學年度基北區免試入學簡章（修訂版）',
    overview: '基北區免試入學的超額比序總分為108分，由志願序、多元學習表現與國中教育會考三大項組成，每項最高36分。報名人數未超過招生名額時全額錄取；超過名額時，才依官方比序順序逐項比較。',
    entryNote: '以下規則適用於111學年度起入學國中的學生；115學年度應屆畢業生的多元學習表現採計七年級至九年級上學期。',
    comparisonTable: [
      { category: '志願序', maximum: '36 分', item: '—', conversion: ['36 分：第 1–5 志願', '35 分：第 6–10 志願', '34 分：第 11–15 志願', '33 分：第 16–20 志願', '32 分：第 21–30 志願'], description: ['同校、兩個以上科別連續選填，則視為同一志願。'] },
      { category: '多元學習表現', maximum: '36 分', item: '均衡學習（上限 24 分）', conversion: ['每符合1個領域：6分', '四領域全部符合：24分', '未符合該領域：0分'], description: ['健康與體育、藝術、綜合活動、科技四領域，前五學期平均成績及格者，每一領域得6分。', '其他在校學習領域成績不列入均衡學習計分。'] },
      { category: '多元學習表現', maximum: '36 分', item: '服務學習（上限 12 分）', conversion: ['每學期服務滿6小時以上：4分', '每學期未滿6小時：0分', '最多採計3學期：12分'], description: ['由國中學校認證。', '115學年度應屆畢（修）業生採計七年級上學期至九年級上學期。', '非應屆或具同等學力者，由原畢業學校採計，並得採計至114學年度上學期。', '服務內容、時數認證及轉換方式，依基北區服務學習時數認證及轉換採計原則辦理。'] },
      { category: '國中教育會考', maximum: '36 分', item: '五科會考（上限 35 分）', conversion: ['A++：7分', 'A+：6分', 'A：5分', 'B++：4分', 'B+：3分', 'B：2分', 'C：1分'], description: ['國文、數學、英語、社會、自然五科，依各科等級加標示換算。', '五科合計最高35分。'] },
      { category: '國中教育會考', maximum: '36 分', item: '寫作測驗（上限 1 分）', conversion: ['6級分：1分', '5級分：0.8分', '4級分：0.6分', '3級分：0.4分', '2級分：0.2分', '1級分：0.1分'], description: ['寫作測驗與五科會考積分合計，教育會考項目最高36分。'] },
    ],
    specialNotes: ['原住民學生、身心障礙學生、蒙藏學生、政府派赴國外工作人員子女、境外優秀科學技術人才子女、僑生及退伍軍人等法律授權訂定升學優待辦法之特殊身分學生，依相關特殊身分學生升學優待辦法辦理。', '非應屆國中畢業生得向本區免試入學委員會提出申請參加免試入學，參加本年度國中教育會考，並採計其國中就學期間之紀錄；採計項目及積分由本區免試入學委員會審查認定。'],
    tieBreakOrder: ['總積分（108）', '多元學習表現（36）', '國中教育會考積分（36）', '志願序積分（36）', '國文科等級加標示', '數學科等級加標示', '英語科等級加標示', '社會科等級加標示', '自然科等級加標示', '寫作測驗'],
    rules: [
      { title: '志願序', maximum: '36 分', description: '依志願序與校科（群）志願的認定方式計分。', points: ['一般志願序最高 36 分。', '同校多科、連續選填的認定應依簡章及系統規則確認。'] },
      { title: '多元學習表現', maximum: '36 分', description: '只採計均衡學習與服務學習兩項。', points: ['均衡學習最高24分：健體、藝術、綜合活動、科技四領域，前五學期平均成績及格，每領域6分。', '服務學習最高12分：每學期滿6小時得4分，最多採計3學期。'] },
      { title: '國中教育會考', maximum: '36 分', description: '五科會考積分加上寫作測驗積分。', points: ['五科依A++至C換算7至1分，五科最高35分。', '寫作6至1級分換算1至0.1分，會考項目合計最高36分。'] },
    ],
    exam: ['會考五科積分與寫作測驗積分合計最高36分；A++至C依序為7、6、5、4、3、2、1分。', '會考積分相同時，再依國文、數學、英語、社會、自然各科等級加標示，最後比較寫作測驗。', '未參加國中教育會考者，會考比序項目積分為0分。'],
    reminders: ['基北區每位學生最多填30個志願，每生依志願序最多錄取1個校（科、群）。', '同校不同科連續選填視為同一志願；若同校不同科分開填在不同志願序，則依各自志願序計分。', '服務學習須由國中認證，且要符合基北區服務學習時數認證及轉換採計原則。', '基北區優先免試、完全免試、技優甄審及各校單獨招生，均不適用本頁一般免試規則。'],
  },
  taoyuan: {
    total: '100', source: 'https://tyc.entry.edu.tw/NoExamImitate_TL/NoExamImitate/Apps/Page/Public/News.aspx', sourceLabel: '115 學年度桃連區免試入學委員會官方網站',
    overview: '桃連區（桃園市、連江縣）免試入學的超額比序總分為100分，由適性輔導32分、多元學習表現35分及國中教育會考33分組成。總積分相同時，先比低收入戶身分，再依官方規定逐項比序。',
    comparisonTable: [
      { category: '適性輔導', maximum: '32 分', item: '畢業資格', conversion: ['符合畢業資格者 6 分', '修業資格者 2 分'], description: ['依國民小學及國民中學學生學習評量辦法辦理。'] },
      { category: '適性輔導', maximum: '32 分', item: '志願序', conversion: ['第 1、2、3 志願：15 分', '第 4、5、6 志願：12 分', '第 7、8、9 志願：9 分', '第 10、11、12 志願：6 分', '第 13、14、15 志願：3 分', '第 16 至 30 志願：1 分'], description: ['可選填 30 志願數；專業群科以 1 校 1 科為 1 志願數。', '專業群科同一職群各科別連續選填為志願時，視為同一志願序計分。', '當總積分完全相同需進行超額比序，比序至志願序積分項目時，積分高者優先錄取。'] },
      { category: '適性輔導', maximum: '32 分', item: '生涯規劃（上限6分）', conversion: ['報名校科與家長意見相符：2分', '報名校科與導師意見相符：2分', '報名校科與輔導教師意見相符：2分'], description: ['各國中依免試入學委員會期程，經家長簽名確認家長、導師及輔導教師三種意見。', '意見完成確認後不得修改。'] },
      { category: '適性輔導', maximum: '32 分', item: '就近入學（上限5分）', conversion: ['符合桃連區或共同就學區就近入學資格：5分', '不符合資格：0分'], description: ['桃連區為一個就學區；設籍在桃連區，或於桃連區國中就讀，均符合桃連區就近入學資格。', '共同就學區範圍依教育部公告認定。'] },
      { category: '多元學習表現', maximum: '35 分', item: '均衡學習（上限 9 分）', conversion: ['單一領域五學期平均及格：3 分', '未達標準：0 分'], description: ['健康與體育、藝術、綜合活動、科技四領域，各領域最高 3 分。', '108 學年度以後入學者適用四領域；107 學年度以前入學者採健康與體育、藝術與人文、綜合活動三領域。'] },
      { category: '多元學習表現', maximum: '35 分', item: '品德表現（上限10分）', conversion: ['銷過後無記過或二次（含）警告以下：6分', '大功每次：4.5分', '記功每次：1.5分', '嘉獎每次：0.5分'], description: ['獎勵部分採功過相抵後的紀錄計算。', '上述兩項積分依簡章規定合計，最高10分。'] },
      { category: '多元學習表現', maximum: '35 分', item: '服務表現（上限10分）', conversion: ['班級、自治市或社團幹部任滿1學期且考核優良：2分', '志願服務學習每1小時：0.3分', '幹部服務最高4分；本項合計最高10分'], description: ['服務學習時數未滿1小時不計分。', '採計期間為七年級入學至免試入學申請報名作業前。'] },
      { category: '多元學習表現', maximum: '35 分', item: '才藝表現（上限5分）', conversion: ['個人賽全市（縣）性：第1至4名得6、5、4、3分', '個人賽區域性（3縣市以上）：第1至5名得7、6、5、4、3分', '個人賽全國性：第1至6名得8、7、6、5、4、3分', '個人賽國際性：第1至6名得10、9、8、7、6、5分', '團體賽：依相同層級個人賽積分折半'], description: ['本項實際採計最高5分。', '國際性與全國性競賽依教育部公告；區域性與全市（縣）性競賽依桃連區推動工作小組公告。', '特優比照第1名、優等比照第2名、甲等比照第3名、乙等比照第4名。', '同學年度同項比賽擇優1次；同一事蹟或獎項不得重複計分。'] },
      { category: '多元學習表現', maximum: '35 分', item: '體適能（上限6分）', conversion: ['單項達門檻標準：6分', '本項最高：6分'], description: ['檢測項目包括柔軟度、瞬發力、肌力及肌耐力、心肺耐力。', '身心障礙、重大疾病、體弱或因故無法測試者，依教育部相關規定辦理。', '非應屆、非學校型態實驗教育、臺商學校及跨區學生，依簡章規定至原設籍學校、檢測站或醫院辦理。'] },
      { category: '多元學習表現', maximum: '35 分', item: '本土語言認證', conversion: ['通過原住民族語、客語或閩南語初級以上：2 分'], description: ['採認主管機關核發的證書：原住民族語為原住民族委員會、客語為客家委員會、閩南語為教育部。'] },
      { category: '國中教育會考', maximum: '33 分', item: '國中教育會考表現', conversion: ['國文、數學、英語、社會、自然：精熟每科6分', '五科基礎：每科4分', '五科待加強：每科2分', '寫作4、5、6級分：3分', '寫作2、3級分：2分', '寫作1級分：1分'], description: ['五科會考最高30分，寫作測驗最高3分，合計最高33分。'] },
    ],
    tieBreakOrder: ['低收入戶學生優先', '適性輔導', '多元學習表現', '國中教育會考', '志願序積分', '會考等級標示總點數', '國文單科標示', '數學、英語、社會、自然單科標示'],
    specialNotes: ['比序項目共計三大項；申請超額時全數採計。總積分完全相同且名額不足時，先以低收入戶學生為優先，其餘再依適性輔導、多元學習表現、教育會考分別比序。', '會考單科成績等級標示點數：A++、A+、A、B++、B+、B、C 依序為 7、6、5、4、3、2、1 點。', '「多元學習表現」除本土語言認證外，其餘項目採計期間為 7 年級入學至申請報名作業前。', '連江縣各國中畢業生第一志願選填馬祖高中者優先錄取。', '免試作業階段，武陵高中、中大壢中及其他經同意試辦之高級中等學校登記超額時，保障提供學生提出申請的桃園市國中每校及連江縣至少各 1 個名額，擇優錄取。', '適性輔導的志願序與生涯規劃積分，會隨志願序別及家長、導師、輔導教師意見的相符狀況而影響總積分。', '各項積分以同一事蹟不重複計分為原則。', '本區得視實際需要另訂補充說明。'],
    rules: [
      { title: '適性輔導', maximum: '32 分', description: '包含志願序、畢業資格、生涯規劃建議與就近入學。', points: ['志願序最高 15 分。', '畢業資格最高 6 分、生涯規劃符合建議最高 6 分、就近入學 5 分。'] },
      { title: '多元學習表現', maximum: '35 分', description: '包含均衡學習、品德、服務、才藝、體適能及本土語言認證。', points: ['均衡學習最高9分、品德最高10分、服務最高10分、才藝最高5分、體適能最高6分。', '通過原住民族語、客語或閩南語初級以上認證得2分；各項依簡章資格與上限採計。'] },
      { title: '國中教育會考', maximum: '33 分', description: '五科積分與寫作測驗合計。', points: ['五科：精熟 6 分、基礎 4 分、待加強 2 分。', '寫作 4 至 6 級分為 3 分、2 至 3 級分為 2 分、1 級分為 1 分。'] },
    ], exam: ['會考五科採精熟6分、基礎4分、待加強2分，最高30分；寫作4至6級分3分、2至3級分2分、1級分1分，最高33分。', '同分時的會考等級標示點數為A++、A+、A、B++、B+、B、C依序7、6、5、4、3、2、1點。', '會考標示總點數只在前面比序仍同分時使用，不是100分總積分的直接加總項目。'], reminders: ['桃連區可填30個志願；專業群科以1校1科為1個志願數。', '生涯規劃意見須在國中端確認，確認後不得修改。', '品德、服務、才藝、體適能及本土語認證等多元資料，除本土語言認證外，採計期間為七年級入學至報名作業前。', '連江縣各國中畢業生第一志願填寫馬祖高中者優先錄取；武陵高中、中大壢中等特定學校另有保障名額規定。', '桃連區優先免試、完全免試、技優甄審及各校單獨招生，均不適用本頁一般免試規則。'],
  },
  central: {
    total: '100', source: 'https://www.nehs.tc.edu.tw/2026/01/15/%E3%80%90%E5%8D%87%E5%AD%B8%E3%80%91115%E5%AD%B8%E5%B9%B4%E5%BA%A6%E4%B8%AD%E6%8A%95%E5%8D%80%E5%85%8D%E8%A9%A6%E5%85%A5%E5%AD%B8%E7%B0%A1%E7%AB%A0%E5%85%AC%E5%91%8A%E5%85%8D%E8%A9%A6%E3%80%81/', sourceLabel: '115 學年度中投區免試入學簡章',
    overview: '中投區由志願序、多元學習表現、會考成績與扶助弱勢四部分構成。',
    comparisonTable: [
      { category: '志願序積分', maximum: '30 分', item: '志願序群組', conversion: ['第 1 至 10 個志願序：30 分', '第 11 至 20 個志願序：29 分', '第 21 個志願序以後：28 分'], description: ['志願以群組方式計分，每 10 個志願序為一群組；同一群組內的志願序皆為同一積分。', '連續選填同校不同類科者皆計為同一志願序。'] },
      { category: '就近入學積分', maximum: '10 分', item: '就近入學資格', conversion: ['符合中投區免試就學區：10 分', '符合中投區共同就學區：10 分'], description: ['資格及共同就學區範圍依當學年度簡章認定。'] },
      { category: '扶助弱勢積分', maximum: '3 分', item: '偏遠與經濟弱勢資格', conversion: ['符合偏遠地區：1 分', '符合中低收入戶：1 分', '符合低收入戶：2 分'], description: ['偏遠地區學校須經主管機關核准，且國中三年就讀偏遠學校。', '經濟弱勢須持有當學年度鄉、鎮、市、區公所證明文件。'] },
      { category: '多元學習表現積分', maximum: '27 分', item: '均衡學習', conversion: ['任一領域符合：3 分', '四領域皆符合：12 分'], description: ['科技、健體、藝文、綜合四領域，五學期平均成績達 60 分（含）以上者，每一領域 3 分。', '採計國中前五個學期。'] },
      { category: '多元學習表現積分', maximum: '27 分', item: '德行表現', conversion: ['社團：最高 2 分', '服務學習：最高 3 分'], description: ['社團及服務學習由國中認證。', '任一學期參加一項校內社團給 1 分。', '任一學期累積服務滿 6 小時給 1 分，未滿不計；第六學期採計至委員會公告截止日。'] },
      { category: '多元學習表現積分', maximum: '27 分', item: '無記過紀錄', conversion: ['無處分或銷過後無懲處：6 分', '銷過後無小過（含）以上紀錄：3 分'], description: ['依銷過後紀錄計算，採計至本區免試入學委員會公告截止日。'] },
      { category: '多元學習表現積分', maximum: '27 分', item: '獎勵紀錄', conversion: ['大功每支：3 分', '小功每支：1 分', '嘉獎每支：0.5 分'], description: ['最高 4 分，採計國中前五個學期。'] },
      { category: '教育會考表現積分', maximum: '30 分', item: '五科教育會考', conversion: ['精熟：每科 6 分', '基礎：每科 4 分', '待加強：每科 2 分'], description: ['國文、數學、英語、社會、自然五科加總，最高 30 分。'] },
    ],
    rules: [
      { title: '志願序', maximum: '30 分', description: '依志願序及志願群組規定計分。', points: ['志願序最高 30 分。', '群組及連續選填的認定，請依當年度簡章操作說明。'] },
      { title: '多元學習表現', maximum: '30 分', description: '包含均衡學習、服務學習、體適能等。', points: ['各子項採計資格、時間與證明文件，依中投區作業要點辦理。'] },
      { title: '國中教育會考', maximum: '30 分', description: '五科採精熟、基礎、待加強換算。', points: ['精熟 6 分、基礎 4 分、待加強 2 分。'] },
      { title: '扶助弱勢', maximum: '10 分', description: '符合簡章列示資格者始得採計。', points: ['請向原就讀國中確認身分資格及應備證明。'] },
    ], exam: ['A++、A+、A、B++、B+、B、C 對應 21、18、15、12、9、6、3 點。', '會考等級標示與寫作測驗仍可能影響同分比序。'], reminders: ['弱勢身分須在規定期限內完成認定，逾期通常無法補列。'],
  },
  changhua: {
    total: '135', source: 'https://chash.chc.edu.tw/posts/3359', sourceLabel: '115 學年度彰化區免試入學簡章',
    overview: '彰化區採六大項目：志願序、身分別、就近入學、品德服務、績優表現與會考成績。',
    comparisonTable: [
      { category: '志願序', maximum: '45 分', item: '志願序', conversion: ['第 1 至 20 個志願序：45 分', '第 21 個志願序以後：44 分'], description: ['連續選填同校同職群者，皆計為同一志願序積分。'] },
      { category: '身分別', maximum: '2 分', item: '經濟弱勢', conversion: ['低收入戶：2 分', '中低收入戶：1 分'], description: ['限升學當年度取得鄉鎮（市）公所開立的證明文件。'] },
      { category: '就近入學', maximum: '7 分', item: '就近入學資格', conversion: ['符合彰化區免試就學區：7 分', '符合彰化區共同就學區：7 分'], description: ['資格認定依當學年度簡章及共同就學區規定辦理。'] },
      { category: '品德服務', maximum: '20 分', item: '服務學習（上限 8 分）', conversion: ['幹部任滿 1 學期：2 分', '服務學習時數每滿 1 小時：0.1 分'], description: ['幹部包含班級、社團及學校幹部。', '服務學習時數須由學校認定服務表現績優者。'] },
      { category: '品德服務', maximum: '20 分', item: '獎勵紀錄（上限 6 分）', conversion: ['大功每次：4.5 分', '小功每次：1.5 分', '嘉獎每次：0.5 分'], description: ['不含已列入其他比序項目積分的獎勵；以功過相抵後的獎勵計算。'] },
      { category: '品德服務', maximum: '20 分', item: '生活教育（上限 8 分）', conversion: ['完全或銷過後無懲處紀錄：6 分', '符合無曠課紀錄：2 分'], description: ['依簡章規定的生活教育紀錄與採計期間認定。'] },
      { category: '績優表現', maximum: '16 分', item: '均衡學習（上限 6 分）', conversion: ['5 學期皆符合：6 分', '4 學期皆符合：4 分', '3 學期皆符合：2 分', '2 學期（含）以下符合：0 分'], description: ['健康與體育、藝術、綜合活動、科技四領域中，同一學期任三領域成績皆達及格（含）以上。', '採計國一、國二及國三上，共 5 學期。'] },
      { category: '績優表現', maximum: '16 分', item: '社團參與（上限 4 分）', conversion: ['參與學校社團且績優，每 1 學期：1 分'], description: ['由學校認定社團參與表現優良者；採計國一、國二及國三上共 5 學期。'] },
      { category: '績優表現', maximum: '16 分', item: '競賽表現（上限 6 分）', conversion: ['國際：第 1、2、3、3 名以外，依序 6、5、4、3 分', '全國：第 1、2、3、3 名以外，依序 5、4、3、2 分', '全縣：第 1、2、3、3 名以外，依序 4、3、2、1 分'], description: ['限本縣正面表列競賽採計項目；外縣（市）學生可採計就學期間所在地縣市政府核發的獎狀。', '特優、優等、甲等依序比照第 1、2、3 名；3 人（含）以下為個人賽，4 人（含）以上為團體賽，團體賽依個人賽積分折半。', '參賽證明不予採計積分。'] },
      { category: '績優表現', maximum: '16 分', item: '體適能（上限 6 分）', conversion: ['每單項銅牌以上：2 分', '每單項中等或待加強：1 分'], description: ['排除身體質量指數，其餘四項任採三項。', '符合規定的身心障礙或重大傷病學生比照銅牌；因身體羸弱持證明未檢測者比照待加強。'] },
      { category: '教育會考', maximum: '45 分', item: '五科等級加標示', conversion: ['A++、A+、A、B++、B+、B、C：每科依序 9、8、7、6、5、4、3 分'], description: ['國文、數學、英語、自然、社會五科按等級加標示換算積分，五科合計最高 45 分。', '寫作測驗列為比序總積分相同後的比序項目，不納入 135 分總積分。'] },
    ],
    rules: [
      { title: '志願序', maximum: '45 分', description: '前 20 志願為 45 分，第 21 志願以後為 44 分。', points: ['連續選填同校同職群時，依簡章視為同一志願的規定辦理。'] },
      { title: '身分別／就近入學', maximum: '9 分', description: '身分別最高 2 分；符合彰化區或共同就學區的就近入學資格為 7 分。', points: ['低收入戶 2 分、中低收入戶 1 分。', '就近入學資格以簡章列示區域及證明為準。'] },
      { title: '品德服務／績優表現', maximum: '36 分', description: '品德服務最高 20 分，績優表現最高 16 分。', points: ['服務學習、獎勵紀錄、生活教育、均衡學習、社團、競賽及體適能均有個別上限。'] },
      { title: '國中教育會考', maximum: '45 分', description: '五科依等級標示換算 3 至 9 分。', points: ['A++ 至 C 對應 9、8、7、6、5、4、3 分。'] },
    ], exam: ['國文、數學、英語、自然、社會五科，A++ 至 C 依序換算為 9、8、7、6、5、4、3 分。', '寫作測驗不納入 135 分總積分，但列為總積分相同後的比序項目。'], reminders: ['除教育會考外，各項採計限國中階段取得；入學當年度以 8 月 1 日起算。', '各子項上限不等於每位學生都能直接取得，需符合採計條件。'],
  },
  tainan: {
    total: '108', source: 'https://tn.entry.edu.tw/NoExamImitate_TN/NoExamImitate/Apps/Page/Public/News.aspx?SEQNO=18', sourceLabel: '115 學年度臺南區免試入學委員會官方網站',
    overview: '臺南區一般免試入學超額比序總分為 108 分，由志願序 12 分、多元學習表現 50 分、就近入學 10 分及國中教育會考 36 分組成；同分時再依簡章順序逐項比序。',
    comparisonTable: [
      { category: '志願序', maximum: '12 分', item: '志願序學校／科別', conversion: ['第 1 志願序：12 分', '第 2 志願序：11 分', '第 3 志願序：10 分', '第 4 志願序：9 分', '第 5 志願序：8 分', '第 6 志願序（含）後：每一志願序 7 分'], description: ['每一志願序最多可選 3 校作為同一群組，群組內學校同分。', '同一學校多科或核定以群招生，視為同一志願序；同校第二次選填則視為不同志願序。', '第 6 志願序起，改以單一學校科別計算，且每一志願序為 7 分。'] },
      { category: '多元學習表現', maximum: '50 分', item: '競賽成績（上限 10 分）', conversion: ['國際：第 1、2、3 名及第 4–8 名為 10、9、8、7 分', '全國：第 1、2、3 名及第 4–8 名為 7、6、5、4 分', '縣市：第 1、2、3 名及第 4–8 名為 4、3、2、1 分'], description: ['採計七年級上至九年級上，共五學期的競賽成績。', '包含科學展覽、學科能力、語文、藝能及運動類競賽；同一性質或同一項目僅擇優一次。'] },
      { category: '多元學習表現', maximum: '50 分', item: '獎勵紀錄（上限 15 分）', conversion: ['基本分：3 分', '嘉獎每次加 0.5 分；小功每次加 1.5 分；大功每次加 4.5 分', '警告每次減 0.5 分；小過每次減 1.5 分；大過每次減 4.5 分', '功過相抵後最高 15 分'], description: ['以校內正式獎懲紀錄辦理，獎勵與懲處先依規定功過相抵，再計算本項分數。', '24 次嘉獎可達本項最高 15 分；實際紀錄仍以原國中核發資料為準。'] },
      { category: '多元學習表現', maximum: '50 分', item: '服務學習（上限 15 分）', conversion: ['每服務 1 小時：0.3 分', '服務滿 50 小時：15 分（本項最高）'], description: ['服務時數須於規定採計期間完成，並由學校或合格服務單位提供可認證的紀錄。', '未滿 1 小時的零碎時數依簡章及學校認證規定辦理。'] },
      { category: '多元學習表現', maximum: '50 分', item: '社團參與（上限 15 分）', conversion: ['每學期社團達 16 小時且評量合格：3 分', '五學期最高：15 分'], description: ['採計七年級上至九年級上五學期；每學期須同時符合時數及教師評量合格。', '技藝教育課程依規定得比照社團採計，仍以學校認證結果為準。'] },
      { category: '多元學習表現', maximum: '50 分', item: '體適能（上限 10 分）', conversion: ['完成檢測基本分：4 分', '任 2 項達 PR50：8 分', '任 2 項達 PR75：9 分', '任 2 項達 PR85：10 分'], description: ['檢測項目包括仰臥起坐、坐姿體前彎、立定跳遠及 1600／800 公尺跑走。', '達較高級距時採較高分，不重複累加；身心障礙、重大傷病或體弱學生依規定比照。'] },
      { category: '多元學習表現', maximum: '50 分', item: '語言認證（上限 5 分）', conversion: ['英語能力達 CEF A2 以上：5 分', '閩南語、客語或原住民族語初級以上：5 分'], description: ['不同語言認證原則上擇優採計 5 分，不因持有多張證書重複累加。', '證書須為簡章認可的政府機關或正式測驗機構核發，取得期間依當年度簡章認定。'] },
      { category: '就近入學', maximum: '10 分', item: '就近入學資格', conversion: ['符合臺南區、共同就學區或核准變更就學區資格：10 分', '不符合：0 分'], description: ['就讀本區國中、共同就學區或經核准變更免試就學區者，依資格取得本項分數。', '是否符合資格由原國中及免試入學委員會依報名資料審查。'] },
      { category: '國中教育會考', maximum: '36 分', item: '五科等級與寫作測驗', conversion: ['五科：A++、A+、A、B++、B+、B、C 分別為 7、6、5、4、3、2、1 分', '寫作 6、5、4、3、2、1、0 級分分別為 1、0.8、0.6、0.4、0.2、0.1、0 分'], description: ['國文、數學、英語、社會、自然五科合計最高 35 分，寫作測驗最高 1 分，會考項目合計最高 36 分。', '會考成績只占總分的一部分；同分時還要依等級加標示及分科順序比序。'] },
    ],
    tieBreakOrder: ['總積分（108 分；同分時低收入戶優先）', '志願序積分（12 分）', '多元學習表現總積分（50 分）', '國中教育會考總積分（36 分）', '會考等級加標示總和（先比 A+ 號，再比 B+ 號）', '國文科等級加標示', '數學科等級加標示', '英語科等級加標示', '社會科等級加標示', '自然科等級加標示', '志願序內的學校順序與科別順序'],
    specialNotes: ['本頁整理 115 學年度一般免試入學；優先免試、完全免試、技優甄審、直升及其他單獨招生，不能直接套用本表。', '競賽、獎勵、服務、社團、體適能及語言認證不得因同一事由重複計分；多元學習表現合計最高 50 分。', '競賽成績採計七上至九上五學期；社團每學期須達 16 小時且評量合格；服務學習每小時 0.3 分、最多 50 小時。', '同分比序第一順位為總積分；總積分仍相同時，具低收入戶身分者優先，再依頁面所列順序比較。', '招生名額、報名資格、採計截止日、認證文件及特殊身分定義，最後都以臺南區官方最新簡章及原國中審查結果為準。'],
    rules: [
      { title: '志願序', maximum: '12 分', description: '前五個志願序依序由 12 分遞減至 8 分，第六志願序起每一校科志願為 7 分。', points: ['每一志願序最多 3 校同群組；同校多科視為同一志願序，同校第二次選填另計志願序。', '第 6 志願序以後改採單一校科填列，不能把多個校科併成一個群組。'] },
      { title: '多元學習表現', maximum: '50 分', description: '競賽、獎勵、服務學習、社團、體適能及語言認證合計採計。', points: ['競賽最高 10 分、獎勵最高 15 分、服務最高 15 分、社團最高 15 分、體適能最高 10 分、語言認證最高 5 分。', '各子項先依規定換算，再以多元學習表現總上限 50 分計入。'] },
      { title: '就近入學', maximum: '10 分', description: '符合臺南區、共同就學區或核准變更就學區資格者取得分數。', points: ['符合得 10 分；不符合為 0 分。資格由原國中及委員會審查認定。'] },
      { title: '國中教育會考', maximum: '36 分', description: '五科等級分數加寫作測驗分數。', points: ['五科 A++ 至 C 為 7 至 1 分，五科最高 35 分。', '寫作 6 至 0 級分為 1 至 0 分的級距，最高 1 分；會考項目合計最高 36 分。'] },
    ], exam: ['會考五科換算：A++、A+、A、B++、B+、B、C 分別為 7、6、5、4、3、2、1 分；五科最高 35 分。', '寫作測驗 6、5、4、3、2、1、0 級分分別為 1、0.8、0.6、0.4、0.2、0.1、0 分。', '臺南區超額比序總分為 108 分：志願序 12、多元學習表現 50、就近入學 10、會考 36。'], reminders: ['填志願前先確認每一群組最多 3 校、同校多科及第 6 志願序後的單科計分方式。', '競賽、獎勵、服務、社團、體適能與語言認證的證明及採計截止日，應交由原國中確認。', '本頁是規則整理，不代替正式招生簡章；招生名額與資格異動時，以臺南區官方公告為準。'],
  },
  kaohsiung: {
    total: '100', source: 'https://kh.entry.edu.tw/news/news-show.php?id=209&page=1', sourceLabel: '115 學年度高雄區免試入學比序項目採計說明',
    overview: '高雄區一般免試入學超額比序總分為 100 分，由志願序 30 分、多元發展 40 分及國中教育會考 30 分組成。多元發展七個子項原始合計最高 100 分，但最後最多只採計 40 分。',
    comparisonTable: [
      { category: '志願序積分', maximum: '30 分', item: '志願學校群', conversion: ['第 1 志願學校群：30 分', '第 2 志願學校群：29 分', '第 3 志願學校群：28 分'], description: ['至多可選填 3 個志願學校群，每群可填 10 所學校，最多 30 個志願學校。', '技術型、綜合型或單科型高中同一校不同科別／核定以群招生的群別，採相同積分；連續選填同校不同科者計為同一志願序。', '同一學校第 2 次選填，視為第 2 所志願學校計分。'] },
      { category: '多元發展', maximum: '40 分', item: '均衡學習（原始上限 10 分）', conversion: ['3 領域五學期平均達 60 分以上：10 分', '2 領域五學期平均達 60 分以上：6 分', '1 領域五學期平均達 60 分以上：3 分', '未達 1 領域：0 分'], description: ['採健康與體育、藝術、綜合活動、科技四領域，計算前五學期平均成績。', '本子項最高 10 分，資料由國中校務成績系統產出。'] },
      { category: '多元發展', maximum: '40 分', item: '服務學習（原始上限 10 分）', conversion: ['每學年度服務滿 3 小時：1 分', '每學年度最高：4 分', '三學年合計最高：10 分'], description: ['學年度以每年 8 月 1 日至翌年 7 月 31 日計算；未滿 3 小時的部分不計分。', '校外服務須事先向學校告知，完成後持服務單位證明回學校認證。'] },
      { category: '多元發展', maximum: '40 分', item: '體適能（原始上限 20 分）', conversion: ['每學年每一項達中等以上：3 分', '每學年四項最多：12 分', '三學年原始最多：36 分；本子項採計最多 20 分'], description: ['四項為坐姿體前彎、立定跳遠、一分鐘屈膝仰臥起坐及 800／1600 公尺跑走。', '同學年度檢測成績擇一採計；可由學校或合格檢測站檢測，特殊身分學生依規定比照。'] },
      { category: '多元發展', maximum: '40 分', item: '競賽表現', conversion: ['國際性前 8 名或全國性前 3 名：9 分', '全國性第 4 至 8 名或區域性（縣市性）前 3 名：6 分', '區域性（縣市性）第 4 至 8 名：3 分'], description: ['本子項最高 20 分；比賽須由教育部（局、處）主辦，或由民間團體承辦並註明核准（備）文號。', '同一學年度、同一性質或項目的競賽擇優計分一次；團體獎依參賽人數規定換算。', '同一事由同時符合競賽及其他比序項目時，擇一計分，不重複給分。'] },
      { category: '多元發展', maximum: '40 分', item: '檢定證照（原始上限 20 分）', conversion: ['達認可 CEFR A2 等值：10 分', '達認可 CEFR B1 等值：20 分', '本子項最高：20 分'], description: ['以國中生可報考且列入高雄區採計表的英語檢定為主，例如全民英檢、TOEFL Junior、TOEFL、TOEIC 等。', '各測驗的科目門檻不同，須依官方採計表逐項確認，不能只以參加測驗認定。'] },
      { category: '多元發展', maximum: '40 分', item: '獎勵紀錄', conversion: ['大功：每次 4.5 分', '小功：每次 1.5 分', '嘉獎：每次 0.5 分'], description: ['功過相抵後計算，本子項最高 10 分。', '同一事由同時獲獎勵紀錄及其他比序項目分數時，擇一計分。'] },
      { category: '多元發展', maximum: '40 分', item: '幹部任期', conversion: ['任滿 1 學期：2 分'], description: ['本子項最高 10 分；班級、全校性與社團幹部可分別採計，須由國中認定服務表現績優並提出證明。', '幹部應以公平、公開、民主程序產生，不得輪流或由教師指派。'] },
      { category: '國中教育會考', maximum: '30 分', item: '五科會考成績', conversion: ['精熟：每科 6 分', '基礎：每科 4 分', '待加強：每科 2 分', '五科合計最高：30 分'], description: ['採計國文、數學、英語、社會、自然五科；寫作測驗不列入 30 分會考總積分。', '會考標示點數另用於同分比序：A++、A+、A、B++、B+、B、C 依序為 7、6、5、4、3、2、1 點，五科最高 35 點。'] },
    ],
    tieBreakOrder: ['總積分（多元發展 40＋志願序 30＋會考 30）', '多元發展項目總積分（40 分）', '志願序積分（30 分）', '國中教育會考總積分（30 分）', '會考總積點（35 點）', '會考國文積分', '會考數學積分', '會考英語積分', '會考社會積分', '會考自然積分', '會考國文積點', '會考數學積點', '會考英語積點', '會考社會積點', '會考自然積點', '寫作測驗級分', '經濟弱勢保障', '同一志願學校群中的優先志願', '增額錄取'],
    specialNotes: ['本頁整理 115 學年度一般免試入學；優先免試、技優甄審、直升、獨立招生及特色招生另有規定，不能直接套用本表。', '多元發展共有七項：均衡學習、服務學習、體適能、競賽表現、檢定證照、獎勵紀錄及幹部任期；七項原始分數合計最高 100 分，但實際最多採計 40 分。', '服務學習、體適能、均衡學習及幹部任期通常由原國中校務系統或學校證明資料產出；非應屆或變更就學區學生須依公告申請審查並檢附證明。', '競賽及檢定證照必須符合高雄區採計項目、主辦資格、名次／能力門檻及證明文件要求。', '同一優良事蹟不得跨不同多元發展子項重複計分；報名人數未超過招生名額時全額錄取，超過名額才依總分及同分比序分發。'],
    rules: [
      { title: '志願序', maximum: '30 分', description: '依三個志願學校群計分，每群最多填 10 所學校。', points: ['第 1 志願學校群 30 分、第 2 志願學校群 29 分、第 3 志願學校群 28 分。', '同一校連續填不同科別通常視為同一志願序；志願群排列也會影響同分時的分發順序。'] },
      { title: '多元發展', maximum: '40 分', description: '七個子項先各自換算，再將原始分數合計，最後以 40 分為採計上限。', points: ['均衡學習 10、服務學習 10、體適能 20、競賽表現 20、檢定證照 20、獎勵紀錄 10、幹部任期 10；原始合計上限 100 分。', '同一事由只能擇一子項計分；各項採計期間、認證資料與競賽／證照清單以官方說明為準。'] },
      { title: '國中教育會考', maximum: '30 分', description: '五科採精熟、基礎、待加強換算，另以標示點數及寫作級分作為同分比序。', points: ['國文、數學、英語、社會、自然：精熟每科 6 分、基礎每科 4 分、待加強每科 2 分。', '五科總積分最高 30 分；A++ 至 C 另換算 7 至 1 點，五科總積點最高 35 點。', '寫作測驗不列入會考 30 分，但會在後段同分比序使用。'] },
    ], exam: ['高雄區總積分公式：多元發展 40 分＋志願序 30 分＋國中教育會考 30 分＝100 分。', '會考五科積分：精熟 6 分、基礎 4 分、待加強 2 分；A++、A+、A、B++、B+、B、C 另換算為 7、6、5、4、3、2、1 點。', '寫作測驗分 6 級，不列入會考 30 分或 35 點，但會在會考積分、總積點及各科比較後，作為同分比序項目。'], reminders: ['三個志願學校群各最多填 10 所學校；同校不同科別、技術型／綜合型／單科型學校的填法要依官方志願選填說明確認。', '多元發展七項原始分數不等於最後加到總分的分數，七項合計後最多只採計 40 分。', '競賽、檢定證照、服務學習及幹部任期都要有符合規定的證明；非應屆或變更就學區學生應特別留意個別審查期限。', '本頁是規則整理，不代替正式招生簡章；招生名額、採計截止日、競賽清單及證照門檻異動時，以高雄區官方公告為準。'],
  },
  chiayi: {
    total: '82', source: 'https://cyc.entry.edu.tw/NoExamImitate_CY/NoExamImitate/Apps/Page/Public/News.aspx?SEQNO=1', sourceLabel: '115 學年度嘉義區免試入學簡章',
    overview: '嘉義區一般免試入學的超額比序由志願序、扶助弱勢、均衡學習、適性輔導、多元學習表現及國中教育會考組成，總分 82 分。',
    entryNote: '下列內容依 115 學年度嘉義區免試入學簡章整理；比序積分須由原國中依採計規範審查認定。',
    comparisonTable: [
      { category: '志願序', maximum: '10 分', item: '志願序', conversion: ['第 1–6 志願：10 分', '第 7–12 志願：9 分', '第 13–18 志願：8 分', '第 19–24 志願：7 分', '第 25–30 志願：6 分'], description: ['最多可填 30 個志願；為鼓勵將心目中的校科填在前面，志願越前面積分越高。'] },
      { category: '扶助弱勢', maximum: '1 分', item: '低收入戶', conversion: ['符合：1 分', '不符合：0 分'], description: ['限升學當年度取得鄉鎮（市）公所開立的證明文件。'] },
      { category: '均衡學習', maximum: '12 分', item: '四領域學習', conversion: ['健康與體育：3 分', '藝術：3 分', '綜合活動：3 分', '科技：3 分'], description: ['各領域前五學期平均及格或達丙等者得分；未達標準為 0 分。'] },
      { category: '適性輔導', maximum: '6 分', item: '生涯輔導意見', conversion: ['與家長意見相符：2 分', '與導師意見相符：2 分', '與輔導教師意見相符：2 分'], description: ['報名科、群與三項適性輔導意見逐項比對後給分。'] },
      { category: '多元學習表現', maximum: '26 分', item: '品德表現', conversion: ['無懲處紀錄，或功過相抵／銷過後無懲處：6 分', '另有嘉獎、小功、大功：每次加 1、3、9 分', '功過相抵及銷過後仍有懲處但未達大過：3 分', '累積達一次大過（含）以上：0 分'], description: ['本子項原始上限 12 分。獎懲換算：3 嘉獎＝1 小功、3 小功＝1 大功；3 警告＝1 小過、3 小過＝1 大過。', '如獎勵事由與服務學習或競賽相同，僅可擇一採計。'] },
      { category: '多元學習表現', maximum: '26 分', item: '服務學習', conversion: ['每服務滿 2 小時：1 分'], description: ['本子項上限 8 分；服務時數須由學校或服務單位出具證明。'] },
      { category: '多元學習表現', maximum: '26 分', item: '體適能', conversion: ['任一單項達 PR25 中等標準：3 分', '中等標準項目最高：9 分', '同次四項總成績達銅質以上：另加 1 分', '符合規定的身心障礙、重大傷病或體弱學生：比照核給 9 分'], description: ['檢測項目為柔軟度、肌力及肌耐力、瞬發力、心肺耐力；採最優一次成績。', '本子項上限 10 分。'] },
      { category: '多元學習表現', maximum: '26 分', item: '競賽成績', conversion: ['個人賽縣市級：第 1 至 4 名 5、4、3、2 分；第 5–8 名、佳作、優選、入選 1 分', '個人賽全國／國際賽：第 1 至 8 名 10、9、8、7、6、5、4、3 分；佳作、優選、入選 2 分', '團體賽：依個人賽積分折半'], description: ['本子項上限 10 分；同一學年度、同類競賽採最高層級或最佳名次一次。', '競賽事由若與品德表現重複，僅可擇一採計。'] },
      { category: '多元學習表現', maximum: '26 分', item: '採計上限', conversion: ['品德、服務、體適能、競賽原始合計最高：40 分', '多元學習表現實際採計上限：26 分'], description: ['採大水庫理論：各子項合計後，任取最高 26 分作為本項積分。'] },
      { category: '國中教育會考', maximum: '27 分', item: '五科與寫作測驗', conversion: ['精熟：每科 5 分', '基礎：每科 3 分', '待加強：每科 1 分', '寫作 6、5 級分：2 分；4、3 級分：1.5 分；2、1 級分：1 分'], description: ['國文、數學、英語、社會、自然五科與寫作測驗合計，最高 27 分。', '五科積點：A++、A+、A、B++、B+、B、C 分別為 9、8、7、5、4、3、1 點。'] },
    ],
    rules: [
      { title: '志願序與適性輔導', maximum: '16 分', description: '志願序最高 10 分，另依國中生涯輔導意見取得適性輔導最高 6 分。', points: ['第 1 至 6 志願為 10 分，之後每 6 個志願遞減 1 分。', '報名科、群分別與家長、導師、輔導教師意見相符者，各得 2 分。'] },
      { title: '均衡學習與扶助弱勢', maximum: '13 分', description: '四個非會考領域與低收入戶資格分別計分。', points: ['健康與體育、藝術、綜合活動、科技，前五學期平均及格或達丙等者各 3 分。', '升學當年度具低收入戶證明者得 1 分。'] },
      { title: '多元學習表現', maximum: '26 分', description: '品德、服務、體適能、競賽四項採大水庫方式加總。', points: ['四個子項原始總分最高 40 分，實際僅採計最高 26 分。', '同一事由不得跨品德、服務學習與競賽重複加分。'] },
      { title: '國中教育會考', maximum: '27 分', description: '五科依精熟、基礎、待加強換算，再加上寫作測驗積分。', points: ['精熟每科 5 分、基礎每科 3 分、待加強每科 1 分。', '寫作 6、5 級分 2 分；4、3 級分 1.5 分；2、1 級分 1 分。', '五科積點依 A++、A+、A、B++、B+、B、C 分別換算為 9、8、7、5、4、3、1 點。'] },
    ],
    exam: ['五科積分僅按精熟、基礎、待加強三個等級換算；另以 A++、A+、A、B++、B+、B、C 的 9、8、7、5、4、3、1 點細分積點。', '寫作測驗積分與五科積分合計，國中教育會考項目最高 27 分。'],
    reminders: ['服務、獎勵與競賽須在規定採計期間內，並備妥學校或主辦單位認證資料。', '品德表現的功過相抵、銷過與各項資格，均以原國中審查及當年度簡章為準。'],
  },
  hsinchu: {
    total: '100', source: 'https://hhm.entry.edu.tw/NoExamImitate_HM/NoExamImitate/Apps/Page/Public/News.aspx', sourceLabel: '115 學年度竹苗區免試入學委員會官方網站',
    overview: '竹苗區（新竹縣、新竹市、苗栗縣）免試入學的超額比序總分為100分，由均衡發展30分、多元學習表現40分及國中教育會考30分組成。三大項資料在超額時全部採計。',
    comparisonTable: [
      { category: '均衡發展', maximum: '30 分', item: '扶助弱勢（原始35分，採計上限30分）', conversion: ['偏遠地區國中或經濟弱勢（中低、低收入戶）：5分', '非山非市國中：3分', '不符合：0分'], description: ['偏遠、經濟弱勢、非山非市，以及偏遠與非山非市國中互轉的學生，符合其中一項即給分，擇優採計。', '本大項原始合計最高35分，但均衡發展實際採計上限為30分。'] },
      { category: '均衡發展', maximum: '30 分', item: '就近入學', conversion: ['符合：5分', '不符合：0分'], description: ['竹苗區含共同就學區及經核准變更就學區的學生，符合資格者採計5分。', '其他就學區學生未完成變更就學區，不得報名竹苗區免試入學。'] },
      { category: '均衡發展', maximum: '30 分', item: '志願序位積分', conversion: ['第1至5志願：10分', '第6至10志願：9分', '第11至15志願：8分', '第16至20志願：7分', '第21至25志願：6分'], description: ['學生參考國中學生生涯發展紀錄手冊的生涯發展規劃書選填志願。', '竹苗區一般免試最多填25個志願序位。'] },
      { category: '均衡發展', maximum: '30 分', item: '均衡學習', conversion: ['四領域符合：15分', '三領域符合：12分', '二領域符合：8分', '一領域符合：4分', '未符合：0分'], description: ['採健康與體育、藝術、綜合活動、科技四領域，計算七年級上、下，八年級上、下及九年級上共五學期的加總平均成績。', '各領域平均成績達及格才算符合。'] },
      { category: '多元學習表現', maximum: '40 分', item: '日常生活表現評量（原始54分，採計上限40分）', conversion: ['功過相抵後或銷過後無懲罰紀錄：10分', '每學期無曠課紀錄：2分，最高12分', '大功每次4.5分；小功每次1.5分；嘉獎每次0.5分，最高20分'], description: ['日常生活表現採計七年級上、下，八年級上、下及九年級上、下共六學期。', '九年級下學期採計至115年4月20日。', '本子項原始合計最高54分，但多元學習表現實際採計上限為40分。'] },
      { category: '多元學習表現', maximum: '40 分', item: '服務學習', conversion: ['每學期服務每滿 3 小時：1 分', '每學期最高：2 分', '五學期最高：10 分'], description: ['服務學習類型及認定程序，依教育部十二年國民基本教育免試入學「多元學習表現」採計原則辦理。', '採計國一上、下，國二上、下及國三上共五學期。'] },
      { category: '多元學習表現', maximum: '40 分', item: '本土語言認證', conversion: ['通過原住民族語、客語或閩南語初級以上：2 分'], description: ['獲得其中一種認證即採計，最高 2 分。', '採認主管機關核發的證書：原住民族語為原住民族委員會、客語為客家委員會、閩南語為教育部。', '認證採計截止日比照日常生活表現，至當年 4 月 20 日止。'] },
      { category: '國中教育會考', maximum: '30 分', item: '國中教育會考成績', conversion: ['精熟：每科6分', '基礎：每科4分', '待加強：每科2分', '五科合計最高：30分'], description: ['採計國文、數學、英語、社會、自然五科。', '會考違規記點依簡章扣減會考總積分：1點扣0.3分、2點扣0.6分，不另扣單科積分。'] },
    ],
    specialNotes: ['偏遠地區國中為教育部核定的極偏、特偏、偏遠國民中學；學生須於偏遠地區國中就讀合計至少 3 學期，且畢業國中為偏遠地區國民中學，始符合扶助弱勢 5 分認定。', '學生如因突發狀況或不可抗力發生經濟弱勢身分變更，得於免試入學集體報名作業日前一日，向主委學校申請身分別變更。', '非山非市國中為教育部核定教育資源需要協助的公立高級中等以下學校；學生須就讀合計至少 3 學期，且畢業國中為非山非市國中，始符合 3 分認定。', '107 學年度以前入學者採健康與體育、藝術與人文及綜合活動三領域；108 學年度以後入學者採健康與體育、藝術及綜合活動三領域；110 學年度以後入學者採健康與體育、藝術、綜合活動及科技四領域。不同入學年度的均衡學習積分換算，依附表註 4 辦理。', '偏遠地區國中與非山非市國中互轉時，畢業於非山非市國中或偏遠地區國中者，兩類學校合計就讀達 3 學期可給 3 分；未達 3 學期不予給分。'],
    futureRule: {
      title: '預告：117 學年度起竹苗區比序項目採計方式', total: '101',
      announcements: ['新竹市政府 114 年 11 月 07 日府教學字第 1140181680 號函公告。', '新竹縣政府 114 年 11 月 07 日府授教學字第 1140392745 號函公告。', '苗栗縣政府 114 年 11 月 07 日府教務字第 1140241871 號函公告。', '修正竹苗區高級中等學校免試入學作業要點的比序項目及順序，自 117 學年度起正式實施。'],
      table: [
        { category: '扶助弱勢', maximum: '1 分', item: '扶助弱勢', conversion: ['偏遠地區、非山非市或經濟弱勢學生：符合 1 分；不符 0 分'], description: ['符合偏遠、經濟弱勢、非山非市，或兩類國中互轉的其中一項者即給分，擇優採計。', '採計上限 1 分。'] },
        { category: '均衡發展', maximum: '30 分', item: '就近入學／志願序位／均衡學習', conversion: ['就近入學：符合 5 分，不符 0 分', '志願序位：第 1–5、6–10、11–15、16–20、21–25 志願，依序 10、9、8、7、6 分', '均衡學習：四、三、二、一領域符合，依序 15、12、8、4 分'], description: ['竹苗區（含共同就學區及變更就學區）學生採計就近入學 5 分。', '均衡學習採計國一上、下，國二上、下及國三上五學期；四領域為健康與體育、藝術、綜合活動及科技。'] },
        { category: '多元學習表現', maximum: '40 分', item: '日常生活表現／服務學習／本土語言認證', conversion: ['無懲罰紀錄 10 分；無曠課每學期 2 分、最高 12 分；獎勵最高 20 分', '服務每滿 3 小時 1 分、每學期最高 2 分、五學期最高 10 分', '本土語言初級以上認證：2 分'], description: ['日常生活表現採計六學期，國三下至當年 4 月 20 日止。', '服務學習採計五學期；本土語言認證採計截止日比照日常生活表現。'] },
        { category: '教育會考', maximum: '30 分', item: '國中教育會考成績', conversion: ['A++、A+：每科 6 分', 'A：每科 5 分', 'B++：每科 4 分', 'B+：每科 3 分', 'B：每科 2 分', 'C：每科 1 分'], description: ['國文、數學、英語、社會、自然五科，單科上限 6 分，合計最高 30 分。'] },
      ],
      tieBreakOrder: ['總積分（扶助弱勢、均衡發展、多元學習表現、教育會考）', '均衡發展總積分', '志願序位積分', '多元學習表現總積分', '教育會考五科總積分', '教育會考含寫作等級標示總點數', '國文、數學、英語、社會、自然各科積分', '寫作測驗級分', '國文、數學、英語、社會、自然各科標示點數'],
      notes: ['會考標示點數：A++、A+、A、B++、B+、B、C 依序為 7、6、5、4、3、2、1 點；寫作六至零級分依序為 1、0.8、0.6、0.4、0.2、0.1、0 點。', '偏遠、非山非市與經濟弱勢的資格、均衡學習入學年度差異及轉學認定，仍依預告附表的註 1 至註 5 辦理。', '偏遠與非山非市國中互轉者，合計就讀達 3 學期給 1 分；未達 3 學期不予給分。'],
    },
    rules: [
      { title: '均衡發展', maximum: '30 分', description: '包含扶助弱勢、就近入學、志願順序與均衡學習。', points: ['扶助弱勢與就近入學各最高 5 分。', '志願順序最高 10 分；第 1 至 5 志願為 10 分。', '均衡學習最高 15 分。'] },
      { title: '多元學習表現', maximum: '40 分', description: '採計日常生活表現、服務學習及本土語言認證。', points: ['日常生活表現原始最高54分、服務學習最高10分、本土語言認證2分；三者合計後，實際採計上限40分。', '日常生活表現採計六學期；服務學習採計前五學期；本土語言認證截止日依當年度簡章。'] },
      { title: '國中教育會考', maximum: '30 分', description: '五科採精熟、基礎、待加強換算。', points: ['精熟 6 分、基礎 4 分、待加強 2 分。'] },
    ], exam: ['會考五科依精熟6分、基礎4分、待加強2分計算，最高30分；寫作測驗不列入30分會考積分。', '同分時依序比較五科會考積分、A與B的加號總數、國文至自然各科積分、寫作級分，再比較各科標示。', '會考標示點數為A++、A+、A、B++、B+、B、C依序7、6、5、4、3、2、1點。'], reminders: ['竹苗區一般免試最多填25個志願序位；優先免試與一般免試的填志願規則不同。', '均衡發展中的扶助弱勢原始積分最高35分，但本大項實際上限為30分。', '多元學習表現採大水庫方式，原始項目合計後以40分為實際上限。', '竹苗區另有優先免試、直升、技優甄審及其他招生管道，請勿直接套用一般免試規則。'],
  },
};

export default function RegionScoringRulesPage({ regionId }: { regionId: string }) {
  const region = ALL_REGIONS.find((item) => item.id === regionId);
  const data = REGION_RULES[regionId];

  if (!region || !data) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 p-6"><section className="max-w-lg rounded-3xl border-4 border-slate-900 bg-white p-8 text-center shadow-[8px_8px_0_0_#0f172a]"><h1 className="text-2xl font-black">找不到此就學區規則</h1><a className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-300 px-4 py-3 font-black" href={withBasePath('/')}>返回首頁 <ArrowRight className="h-4 w-4" /></a></section></main>;
  }

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <section className="border-b-4 border-slate-900 bg-sky-100"><div className="mx-auto max-w-[110rem] px-4 py-6 sm:px-6 lg:px-10">
      <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[2px_2px_0_0_#0f172a]"><ArrowLeft className="h-4 w-4" />返回首頁</a>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-sm font-black"><MapPin className="h-4 w-4 text-rose-600" />{region.name}・{region.desc.split('·')[0].trim()}</div><h1 className="mt-4 text-4xl font-black sm:text-5xl">{region.name}計分規則</h1><p className="mt-4 max-w-3xl text-lg font-bold leading-8 text-slate-700">{data.overview}</p></div><div className="rounded-3xl border-4 border-slate-900 bg-amber-300 p-5 text-center shadow-[5px_5px_0_0_#0f172a]"><p className="text-sm font-black">超額比序總分</p><p className="mt-1 text-5xl font-black">{data.total}<span className="ml-1 text-xl">分</span></p></div></div>
    </div></section>
    <section className="mx-auto max-w-[110rem] px-4 py-10 sm:px-6 lg:px-10"><div className="mb-8 rounded-2xl border-2 border-amber-400 bg-amber-50 p-5"><div className="flex gap-3"><AlertTriangle className="h-6 w-6 shrink-0 text-amber-700" /><div><h2 className="font-black">使用前請先確認招生管道</h2><p className="mt-1 text-sm font-bold leading-6 text-slate-700">本頁整理的是 115 學年度一般免試入學的超額比序架構。優先免試、完全免試、技優甄審及個別學校招生可能另有規定；正式報名與資格認定一律以官方簡章及原國中審查結果為準。</p>{data.entryNote && <p className="mt-3 inline-flex rounded-lg bg-amber-200 px-3 py-1.5 text-sm font-black text-amber-950">{data.entryNote}</p>}</div></div></div>
      {data.comparisonTable && <section className="mb-8"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><Calculator className="h-6 w-6 text-indigo-700" /><h2 className="text-2xl font-black">免試入學比序項目積分對照表</h2></div><span className="rounded-full border-2 border-slate-300 bg-white px-3 py-1 text-xs font-black text-slate-600 sm:hidden">← 左右滑動查看完整欄位 →</span></div><div className="overflow-x-auto rounded-3xl border-4 border-slate-900 bg-white shadow-[5px_5px_0_0_#0f172a]"><table className="w-full min-w-[760px] border-collapse text-left"><thead className="bg-slate-900 text-white"><tr><th className="sticky left-0 z-10 bg-slate-900 p-3 text-sm font-black sm:p-4">類別</th><th className="p-3 text-sm font-black sm:p-4">上限</th><th className="p-3 text-sm font-black sm:p-4">項目</th><th className="p-3 text-sm font-black sm:p-4">積分換算</th><th className="p-3 text-sm font-black sm:p-4">說明</th></tr></thead><tbody>{data.comparisonTable.map((row) => <tr key={`${row.category}-${row.item}`} className="border-t-2 border-slate-200 align-top"><td className="sticky left-0 z-10 bg-white p-3 text-sm font-black shadow-[2px_0_0_0_rgba(226,232,240,1)] sm:p-4">{row.category}</td><td className="p-3 text-sm font-black text-fuchsia-700 sm:p-4">{row.maximum}</td><td className="p-3 text-sm font-black text-slate-800 sm:p-4">{row.item}</td><td className="p-3 sm:p-4"><ul className="space-y-1 text-xs font-bold leading-5 text-slate-700 sm:text-sm sm:leading-6">{row.conversion.map((item) => <li key={item}>{item}</li>)}</ul></td><td className="p-3 sm:p-4"><ul className="space-y-2 text-xs font-bold leading-5 text-slate-700 sm:text-sm sm:leading-6">{row.description.map((item) => <li key={item}>{item}</li>)}</ul></td></tr>)}</tbody><tfoot><tr className="border-t-4 border-slate-900 bg-amber-200"><td colSpan={4} className="p-3 text-base font-black sm:p-4 sm:text-lg">總積分</td><td className="p-3 text-base font-black sm:p-4 sm:text-lg">{data.total} 分</td></tr></tfoot></table></div></section>}
      <div className="grid gap-5 md:grid-cols-2">{data.rules.map((rule) => <article key={rule.title} className="rounded-3xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0_0_#0f172a]"><div className="flex items-start justify-between gap-3"><div><h2 className="text-2xl font-black">{rule.title}</h2><p className="mt-2 font-bold leading-7 text-slate-600">{rule.description}</p></div><span className="shrink-0 rounded-full border-2 border-slate-900 bg-fuchsia-200 px-3 py-1 font-black">{rule.maximum}</span></div><ul className="mt-5 space-y-2 border-t-2 border-slate-200 pt-4">{rule.points.map((point) => <li key={point} className="flex gap-2 text-sm font-bold leading-6 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />{point}</li>)}</ul></article>)}</div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2"><section className="rounded-3xl border-4 border-slate-900 bg-indigo-50 p-6 shadow-[5px_5px_0_0_#0f172a]"><div className="flex items-center gap-2"><Calculator className="h-6 w-6 text-indigo-700" /><h2 className="text-2xl font-black">會考成績怎麼看</h2></div><ul className="mt-4 space-y-3">{data.exam.map((text) => <li key={text} className="flex gap-2 text-sm font-bold leading-7 text-slate-700"><Scale className="mt-1 h-4 w-4 shrink-0 text-indigo-700" />{text}</li>)}</ul></section><section className="rounded-3xl border-4 border-slate-900 bg-rose-50 p-6 shadow-[5px_5px_0_0_#0f172a]"><div className="flex items-center gap-2"><BookOpenCheck className="h-6 w-6 text-rose-700" /><h2 className="text-2xl font-black">填志願前的核對事項</h2></div><ul className="mt-4 space-y-3">{data.reminders.map((text) => <li key={text} className="flex gap-2 text-sm font-bold leading-7 text-slate-700"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-rose-700" />{text}</li>)}</ul></section></div>
      {data.tieBreakOrder && <section className="mt-8 rounded-3xl border-4 border-slate-900 bg-emerald-50 p-6 shadow-[5px_5px_0_0_#0f172a]"><h2 className="text-2xl font-black">超額比序順次</h2><ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{data.tieBreakOrder.map((item, index) => <li key={item} className="rounded-xl border-2 border-slate-900 bg-white p-3 text-sm font-black"><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">{index + 1}</span>{item}</li>)}</ol></section>}
      {data.specialNotes && <section className="mt-8 rounded-3xl border-4 border-slate-900 bg-slate-100 p-6 shadow-[5px_5px_0_0_#0f172a]"><h2 className="text-2xl font-black">特殊身分與非應屆學生註記</h2><ul className="mt-4 space-y-3">{data.specialNotes.map((note) => <li key={note} className="flex gap-2 text-sm font-bold leading-7 text-slate-700"><FileText className="mt-1 h-4 w-4 shrink-0" />{note}</li>)}</ul></section>}
      {data.futureRule && <section className="mt-8 rounded-3xl border-4 border-slate-900 bg-violet-50 p-6 shadow-[6px_6px_0_0_#7c3aed]"><div className="flex items-start gap-3"><AlertTriangle className="mt-1 h-7 w-7 shrink-0 text-violet-700" /><div><p className="text-sm font-black tracking-widest text-violet-700">FUTURE RULES · 尚未適用於 115 學年度</p><h2 className="mt-1 text-2xl font-black">{data.futureRule.title}</h2><ul className="mt-3 space-y-1 text-sm font-bold leading-6 text-slate-700">{data.futureRule.announcements.map((item) => <li key={item}>{item}</li>)}</ul></div></div><p className="mt-5 rounded-full border-2 border-violet-200 bg-white px-3 py-1 text-center text-xs font-black text-violet-800 sm:hidden">← 左右滑動查看完整欄位 →</p><div className="mt-3 overflow-x-auto rounded-2xl border-2 border-slate-900 bg-white"><table className="w-full min-w-[760px] border-collapse text-left"><thead className="bg-violet-900 text-white"><tr><th className="sticky left-0 z-10 bg-violet-900 p-3 text-sm">比序項目</th><th className="p-3 text-sm">上限</th><th className="p-3 text-sm">分項目</th><th className="p-3 text-sm">積分換算</th><th className="p-3 text-sm">備註</th></tr></thead><tbody>{data.futureRule.table.map((row) => <tr key={`${row.category}-${row.item}`} className="border-t-2 border-slate-200 align-top"><td className="sticky left-0 z-10 bg-white p-3 text-sm font-black shadow-[2px_0_0_0_rgba(226,232,240,1)]">{row.category}</td><td className="p-3 text-sm font-black text-violet-700">{row.maximum}</td><td className="p-3 text-sm font-black">{row.item}</td><td className="p-3"><ul className="space-y-1 text-xs font-bold leading-5 text-slate-700 sm:text-sm sm:leading-6">{row.conversion.map((item) => <li key={item}>{item}</li>)}</ul></td><td className="p-3"><ul className="space-y-1 text-xs font-bold leading-5 text-slate-700 sm:text-sm sm:leading-6">{row.description.map((item) => <li key={item}>{item}</li>)}</ul></td></tr>)}</tbody><tfoot><tr className="border-t-4 border-slate-900 bg-violet-200"><td colSpan={4} className="p-3 text-base font-black">四項積分總和</td><td className="p-3 text-base font-black">{data.futureRule.total} 分</td></tr></tfoot></table></div><h3 className="mt-6 text-xl font-black">117 學年度超額比序順序</h3><ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{data.futureRule.tieBreakOrder.map((item, index) => <li key={item} className="rounded-xl border-2 border-slate-900 bg-white p-3 text-sm font-black"><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-violet-700 text-xs text-white">{index + 1}</span>{item}</li>)}</ol><ul className="mt-6 space-y-3 border-t-2 border-violet-200 pt-5">{data.futureRule.notes.map((note) => <li key={note} className="flex gap-2 text-sm font-bold leading-7 text-slate-700"><FileText className="mt-1 h-4 w-4 shrink-0 text-violet-700" />{note}</li>)}</ul></section>}
      <section className="mt-8 rounded-3xl border-4 border-slate-900 bg-sky-50 p-6 text-slate-900 shadow-[5px_5px_0_0_#38bdf8]"><FileText className="h-7 w-7 text-sky-700" /><h2 className="mt-3 text-2xl font-black">核對官方完整簡章</h2><p className="mt-2 max-w-3xl text-sm font-bold leading-7 text-slate-700">招生名額、校科限制、資格、採計期間、文件與同分比序順序都以官方最新公告為準。報名前請再開啟以下來源逐項確認。</p><a href={data.source} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-4 py-3 font-black text-white shadow-[2px_2px_0_0_#0f172a]"><ExternalLink className="h-4 w-4" />{data.sourceLabel}</a></section>
    </section>
  </main>;
}

export const scoringRuleRegionIds = Object.keys(REGION_RULES);
