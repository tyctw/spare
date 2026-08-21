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
    source: 'https://12basic.tp.edu.tw/brief_desc/115-%E5%AD%B8%E5%B9%B4%E5%BA%A6%E7%B0%A1%E7%AB%A0%E4%B8%8B%E8%BC%89/',
    sourceLabel: '115 學年度基北區免試入學簡章（修訂版）',
    overview: '免試入學分發沒有入學門檻或申請條件；報名人數未超過學校招生名額時全額錄取，超過名額時才依志願序、多元學習表現及國中教育會考進行超額比序。',
    entryNote: '115 學年度採計期間為 112 至 114 學年；以下積分對照表適用於 111 學年度後入學之學生。',
    comparisonTable: [
      { category: '志願序', maximum: '36 分', item: '—', conversion: ['36 分：第 1–5 志願', '35 分：第 6–10 志願', '34 分：第 11–15 志願', '33 分：第 16–20 志願', '32 分：第 21–30 志願'], description: ['同校、兩個以上科別連續選填，則視為同一志願。'] },
      { category: '多元學習表現', maximum: '36 分', item: '均衡學習（上限 24 分）', conversion: ['6 分：符合 1 個領域', '0 分：未符合'], description: ['健體、藝術、綜合、科技四領域前五學期平均成績及格者，每一領域得 6 分，滿分 24 分。'] },
      { category: '多元學習表現', maximum: '36 分', item: '服務學習（上限 12 分）', conversion: ['4 分：每學期服務滿 6 小時以上'], description: ['由國民中學學校認證。', '應屆畢（修）業生採計期間為 112 學年度（七年級）上學期至 114 學年度（九年級）上學期。', '非應屆畢業生或具同等學力資格者，由原畢業學校進行服務時數採計，並得採計畢業後服務時數至 114 學年度上學期止，比照在校生方式辦理。', '採計原則依「基北區免試入學服務學習時數認證及轉換採計原則」辦理。'] },
      { category: '國中教育會考', maximum: '36 分', item: '五科（上限 35 分）', conversion: ['7 分：A++', '6 分：A+', '5 分：A', '4 分：B++', '3 分：B+', '2 分：B', '1 分：C'], description: ['國文、數學、英語、社會、自然五科，各科按等級加標示轉換積分 1–7 分。', '寫作測驗 1–6 級分轉換積分 0.1–1 分。'] },
      { category: '國中教育會考', maximum: '36 分', item: '寫作測驗（上限 1 分）', conversion: ['1 分：6 級', '0.8 分：5 級', '0.6 分：4 級', '0.4 分：3 級', '0.2 分：2 級', '0.1 分：1 級'], description: ['寫作測驗積分與五科積分合計，國中教育會考項目最高 36 分。'] },
    ],
    specialNotes: ['原住民學生、身心障礙學生、蒙藏學生、政府派赴國外工作人員子女、境外優秀科學技術人才子女、僑生及退伍軍人等法律授權訂定升學優待辦法之特殊身分學生，依相關特殊身分學生升學優待辦法辦理。', '非應屆國中畢業生得向本區免試入學委員會提出申請參加免試入學，參加本年度國中教育會考，並採計其國中就學期間之紀錄；採計項目及積分由本區免試入學委員會審查認定。'],
    tieBreakOrder: ['總積分（108）', '多元學習表現積分（36）', '國中教育會考積分（36）', '志願序積分（36）', '各科會考等級加標示'],
    rules: [
      { title: '志願序', maximum: '36 分', description: '依志願序與校科（群）志願的認定方式計分。', points: ['一般志願序最高 36 分。', '同校多科、連續選填的認定應依簡章及系統規則確認。'] },
      { title: '多元學習表現', maximum: '36 分', description: '採計均衡學習與服務學習。', points: ['均衡學習最高 24 分；四領域前五學期平均成績及格者，每領域 6 分。', '服務學習最高 12 分；每學期服務滿 6 小時得 4 分，並須符合基北區認證及採計原則。'] },
      { title: '國中教育會考', maximum: '36 分', description: '五科等級標示換算積分，並納入寫作測驗的細部比序。', points: ['A++、A+、A、B++、B+、B、C 分別為 7、6、5、4、3、2、1 點。', '寫作測驗級分依簡章規定，作為會考比序的細部依據。'] },
    ],
    exam: ['會考成績由等級與標示組成；「積分」與「積點」用途不同，請勿混用。', '當各比序項目相同時，仍須依簡章所列的逐項比序順序處理。'],
    reminders: ['服務學習須符合基北區認證及轉換採計原則。', '基北區另有優先免試，規則與一般免試入學不同。'],
  },
  taoyuan: {
    total: '100', source: 'https://tyc.entry.edu.tw/NoExamImitate_TL/NoExamImitate/Apps/Page/Public/News.aspx', sourceLabel: '115 學年度桃連區免試入學系統與簡章',
    overview: '桃連區的超額比序由適性輔導、多元學習表現及國中教育會考組成，合計 100 分。',
    comparisonTable: [
      { category: '適性輔導', maximum: '32 分', item: '畢業資格', conversion: ['符合畢業資格者 6 分', '修業資格者 2 分'], description: ['依國民小學及國民中學學生學習評量辦法辦理。'] },
      { category: '適性輔導', maximum: '32 分', item: '志願序', conversion: ['第 1、2、3 志願：15 分', '第 4、5、6 志願：12 分', '第 7、8、9 志願：9 分', '第 10、11、12 志願：6 分', '第 13、14、15 志願：3 分', '第 16 至 30 志願：1 分'], description: ['可選填 30 志願數；專業群科以 1 校 1 科為 1 志願數。', '專業群科同一職群各科別連續選填為志願時，視為同一志願序計分。', '當總積分完全相同需進行超額比序，比序至志願序積分項目時，積分高者優先錄取。'] },
      { category: '適性輔導', maximum: '32 分', item: '生涯規劃', conversion: ['與家長意見相符：2 分', '與導師意見相符：2 分', '與輔導教師意見相符：2 分'], description: ['各國中應依免試入學委員會期程，經家長簽名確認三種意見結果。', '意見經確認後，不得修正。'] },
      { category: '適性輔導', maximum: '32 分', item: '就近入學', conversion: ['符合資格：5 分'], description: ['桃連區及共同就學區學生符合就近入學得 5 分。', '設籍在桃連區，或於桃連區國中就讀皆符合就近入學；共同就學區範圍依教育部公告為準。'] },
      { category: '多元學習表現', maximum: '35 分', item: '均衡學習（上限 9 分）', conversion: ['單一領域五學期平均及格：3 分', '未達標準：0 分'], description: ['健康與體育、藝術、綜合活動、科技四領域，各領域最高 3 分。', '108 學年度以後入學者適用四領域；107 學年度以前入學者採健康與體育、藝術與人文、綜合活動三領域。'] },
      { category: '多元學習表現', maximum: '35 分', item: '品德表現（上限 10 分）', conversion: ['銷過後無記過或二次（含）警告以下：6 分', '大功每次：4.5 分；記功每次：1.5 分；嘉獎每次：0.5 分'], description: ['品德表現採功過相抵後的獎勵紀錄。', '上述兩項積分合計最高 10 分。'] },
      { category: '多元學習表現', maximum: '35 分', item: '服務表現（上限 10 分）', conversion: ['擔任班級、自治市或社團幹部滿 1 學期且考核優良：2 分', '志願服務學習時數每 1 小時：0.3 分'], description: ['擔任班級或學生幹部最高 4 分。', '服務時數未滿 1 小時不計分。'] },
      { category: '多元學習表現', maximum: '35 分', item: '才藝表現（上限 5 分）', conversion: ['個人賽全市（縣）性第 1 至 4 名：6、5、4、3 分', '區域性（3 縣市以上）第 1 至 5 名：7、6、5、4、3 分', '全國性第 1 至 6 名：8、7、6、5、4、3 分', '國際性第 1 至 6 名：10、9、8、7、6、5 分', '團體賽：依個人賽積分折半計算'], description: ['國際性與全國性競賽採計項目依教育部公告；區域性與全市（縣）性競賽採計項目，依本區免試入學推動工作小組審議後公告。', '特優比照第 1 名、優等比照第 2 名、甲等比照第 3 名、乙等比照第 4 名。', '同（學）年度同項比賽擇優 1 次採計；同一事蹟、同一獎項不得重複採計。'] },
      { category: '多元學習表現', maximum: '35 分', item: '體適能（上限 6 分）', conversion: ['單項達門檻標準：6 分'], description: ['單項為柔軟度、瞬發力、肌力及肌耐力、心肺耐力。', '身心障礙、重大疾病、體弱或因故無法測試的特殊學生，依教育部相關辦法辦理。', '非應屆、非學校型態實驗教育、臺商學校及跨區學生的檢測方式，依簡章規定辦理。'] },
      { category: '多元學習表現', maximum: '35 分', item: '本土語言認證', conversion: ['通過原住民族語、客語或閩南語初級以上：2 分'], description: ['採認主管機關核發的證書：原住民族語為原住民族委員會、客語為客家委員會、閩南語為教育部。'] },
      { category: '國中教育會考', maximum: '33 分', item: '國中教育會考表現', conversion: ['五科精熟：每科 6 分', '五科基礎：每科 4 分', '五科待加強：每科 2 分', '寫作 4、5、6 級分：3 分', '寫作 2、3 級分：2 分', '寫作 1 級分：1 分'], description: ['國文、數學、英語、社會、自然五科與寫作測驗合計最高 33 分。'] },
    ],
    tieBreakOrder: ['低收入戶學生優先', '適性輔導', '多元學習表現', '國中教育會考', '志願序積分', '會考等級標示總點數', '國文單科標示', '數學、英語、社會、自然單科標示'],
    specialNotes: ['比序項目共計三大項；申請超額時全數採計。總積分完全相同且名額不足時，先以低收入戶學生為優先，其餘再依適性輔導、多元學習表現、教育會考分別比序。', '會考單科成績等級標示點數：A++、A+、A、B++、B+、B、C 依序為 7、6、5、4、3、2、1 點。', '「多元學習表現」除本土語言認證外，其餘項目採計期間為 7 年級入學至申請報名作業前。', '連江縣各國中畢業生第一志願選填馬祖高中者優先錄取。', '免試作業階段，武陵高中、中大壢中及其他經同意試辦之高級中等學校登記超額時，保障提供學生提出申請的桃園市國中每校及連江縣至少各 1 個名額，擇優錄取。', '適性輔導的志願序與生涯規劃積分，會隨志願序別及家長、導師、輔導教師意見的相符狀況而影響總積分。', '各項積分以同一事蹟不重複計分為原則。', '本區得視實際需要另訂補充說明。'],
    rules: [
      { title: '適性輔導', maximum: '32 分', description: '包含志願序、畢業資格、生涯規劃建議與就近入學。', points: ['志願序最高 15 分。', '畢業資格最高 6 分、生涯規劃符合建議最高 6 分、就近入學 5 分。'] },
      { title: '多元學習表現', maximum: '35 分', description: '依品德、服務、均衡學習、體適能、才藝及本土語認證等項目採計。', points: ['品德與服務學習各最高 10 分；均衡學習最高 9 分；體適能最高 6 分。', '才藝表現及本土語認證依簡章資格與上限採計。'] },
      { title: '國中教育會考', maximum: '33 分', description: '五科積分與寫作測驗合計。', points: ['五科：精熟 6 分、基礎 4 分、待加強 2 分。', '寫作 4 至 6 級分為 3 分、2 至 3 級分為 2 分、1 級分為 1 分。'] },
    ], exam: ['A++、A+、A 另對應 7、6、5 點；B++、B+、B 對應 4、3、2 點；C 對應 1 點。', '點數用於同分時的後續比序，非所有項目的直接加總。'], reminders: ['生涯發展規劃書與就近入學資格須由國中端依規定確認。'],
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
    total: '100', source: 'https://12basic.tn.edu.tw/modules/tadnews/index.php?ncsn=6', sourceLabel: '115 學年度臺南區免試入學簡章',
    overview: '臺南區以志願序、就近入學、多元表現與會考成績加總為 100 分。',
    comparisonTable: [
      { category: '志願序', maximum: '10 分', item: '志願序學校', conversion: ['第 1 志願序：10 分', '第 2 志願序：9 分', '第 3 志願序：8 分', '第 4 志願序：7 分', '第 5 志願序：6 分', '第 6 志願序（含）後：5 分'], description: ['學生參考國中學生生涯輔導紀錄手冊的生涯發展規劃書選填志願。', '每一志願序至多可選填 3 校為一群組，群組內志願序積分相同。', '同一志願序學校如有多科別，選填時視為同一志願序；同一學校第 2 次選填，視為不同志願序。', '第 6 志願序（含）後以單科為單位選填。'] },
      { category: '多元學習表現', maximum: '50 分', item: '競賽成績', conversion: ['國際第 1、2、3 名及第 4 至 8 名：10、9、8、7 分', '全國第 1、2、3 名及第 4 至 8 名：7、6、5、4 分', '縣市第 1、2、3 名及第 4 至 8 名：4、3、2、1 分'], description: ['限國中階段七上至九上五學期獲得的成績採計。', '採計科學展覽、各學科能力、語文、藝能及運動類競賽。', '同一性質或同一項目競賽僅擇優計分一次，本項最高 10 分。'] },
      { category: '多元學習表現', maximum: '50 分', item: '獎勵、服務、社團、體適能、語言認證', conversion: ['獎勵紀錄、服務學習、社團參與：各單項最高 15 分', '體適能：最高 10 分', '語言認證：最高 5 分'], description: ['獎勵紀錄由國中依學生表現計算。', '多元學習表現總分最高採計 50 分。'] },
      { category: '就近入學', maximum: '10 分', item: '就近入學資格', conversion: ['符合：10 分', '不符：0 分'], description: ['本區、共同就學區及變更免試就學區學生，計分標準一致。'] },
      { category: '國中教育會考', maximum: '30 分', item: '五科等級與寫作測驗', conversion: ['精熟：每科 6 分', '基礎：每科 4 分', '待加強：每科 2 分'], description: ['五科會考積分最高 30 分。', '五科加寫作測驗的總積點為 36 點。', 'A++、A+、A、B++、B+、B、C 依序為 7、6、5、4、3、2、1 點；寫作 6 至 0 級分依序為 1、0.8、0.6、0.4、0.2、0.1、0 點。'] },
    ],
    tieBreakOrder: ['會考加註標示總標示', '會考分科標示：國文、英文、數學、自然、社會', '志願序內的學校序與科別序'],
    specialNotes: ['競賽成績、獎勵紀錄、社團參與及服務學習等項目，不得因同一事由重複採計加分。', '多元學習表現各項目採計依「臺南區十二年國民基本教育免試入學比序項目多元學習表現採計原則」辦理。', '同為精熟級時，依五科 A++、A+ 的組合順序比序；同為基礎級時，依五科 B++、B+ 的組合順序比序。', '若部分科目精熟、部分科目基礎，仍依加註標示順序比序：A++＞A+＞A＞B++＞B+＞B＞C。', '會考總標示與分科標示皆依 A++＞A+＞A＞B++＞B+＞B＞C 比序；分科順序為國文、英文、數學、自然、社會。'],
    rules: [
      { title: '志願序', maximum: '10 分', description: '第 1 至 3 志願 10 分，之後每三個志願序遞減。', points: ['第 4 至 6 志願 9 分；第 7 至 9 志願 8 分；第 10 至 12 志願 7 分。', '第 13 至 15 志願 6 分；第 16 至 30 志願 5 分。'] },
      { title: '就近入學', maximum: '10 分', description: '符合臺南區免試就學區（含共同就學區）資格者得分。', points: ['符合得 10 分；不符合為 0 分。'] },
      { title: '多元表現', maximum: '50 分', description: '包含競賽、獎勵、服務學習、社團與體適能。', points: ['競賽最高 10 分、獎勵最高 15 分、服務學習最高 15 分、社團最高 10 分、體適能最高 10 分。', '各項實際換算與採計條件，依臺南區簡章為準。'] },
      { title: '國中教育會考', maximum: '30 分', description: '五科採精熟、基礎、待加強換算。', points: ['精熟 6 分、基礎 4 分、待加強 2 分。'] },
    ], exam: ['會考成績相同時，仍依簡章所訂項目順序進行超額比序。'], reminders: ['志願序分組、共同就學區與多元表現的認證資料，應由原國中端確認。'],
  },
  kaohsiung: {
    total: '100', source: 'https://kh.entry.edu.tw/news/news-show.php?id=200&page=1', sourceLabel: '115 學年度高雄區免試入學委員會公告',
    overview: '高雄區以志願序、多元發展及國中教育會考三項合計 100 分。',
    comparisonTable: [
      { category: '志願序積分', maximum: '30 分', item: '志願學校群', conversion: ['第 1 志願學校群：30 分', '第 2 志願學校群：29 分', '第 3 志願學校群：28 分'], description: ['至多可選填 3 個志願學校群，每群可填 10 所學校，最多 30 個志願學校。', '技術型、綜合型或單科型高中同一校不同科別／核定以群招生的群別，採相同積分；連續選填同校不同科者計為同一志願序。', '同一學校第 2 次選填，視為第 2 所志願學校計分。'] },
      { category: '多元發展', maximum: '40 分', item: '均衡學習', conversion: ['單一領域五學期平均及格：3 分', '2 領域及格：6 分', '3 領域及格：10 分'], description: ['健體、藝術、綜合、科技四領域中，依其中三領域前五學期平均成績及格以上換算。', '本子項最高 10 分。'] },
      { category: '多元發展', maximum: '40 分', item: '服務學習', conversion: ['每學年每滿 3 小時：1 分', '每學年最高：4 分'], description: ['未滿 3 小時不予採計；本子項最高 10 分。', '校內服務由國中規劃並核發證明；校外服務須先經家長同意、向學校登記，並由合格單位核發證明後送學校認證。'] },
      { category: '多元發展', maximum: '40 分', item: '體適能', conversion: ['單項中等以上：每學年 3 分'], description: ['本子項最高 20 分。', '可由學校依教育部標準檢測，或至合格體適能檢測站檢測；符合規定的身心障礙、重大傷病及體弱學生，比照單項中等以上計分。'] },
      { category: '多元發展', maximum: '40 分', item: '競賽表現', conversion: ['國際性前 8 名或全國性前 3 名：9 分', '全國性第 4 至 8 名或區域性（縣市性）前 3 名：6 分', '區域性（縣市性）第 4 至 8 名：3 分'], description: ['本子項最高 20 分；比賽須由教育部（局、處）主辦，或由民間團體承辦並註明核准（備）文號。', '同一學年度、同一性質或項目的競賽擇優計分一次；團體獎依參賽人數規定換算。', '同一事由同時符合競賽及其他比序項目時，擇一計分，不重複給分。'] },
      { category: '多元發展', maximum: '40 分', item: '檢定證照', conversion: ['依政府機關核准的證照採計方式計分'], description: ['本子項最高 20 分。', '證照考試須由政府機關主辦；民間團體承辦者須註明政府機關核准（備）文號。'] },
      { category: '多元發展', maximum: '40 分', item: '獎勵紀錄', conversion: ['大功：每次 4.5 分', '小功：每次 1.5 分', '嘉獎：每次 0.5 分'], description: ['功過相抵後計算，本子項最高 10 分。', '同一事由同時獲獎勵紀錄及其他比序項目分數時，擇一計分。'] },
      { category: '多元發展', maximum: '40 分', item: '幹部任期', conversion: ['任滿 1 學期：2 分'], description: ['本子項最高 10 分；班級、全校性與社團幹部可分別採計，須由國中認定服務表現績優並提出證明。', '幹部應以公平、公開、民主程序產生，不得輪流或由教師指派。'] },
      { category: '國中教育會考', maximum: '30 分', item: '五科會考成績', conversion: ['精熟：每科 6 分', '基礎：每科 4 分', '待加強：每科 2 分'], description: ['國文、數學、英語、社會、自然五科；單科最高 6 分，五科最高 30 分。', '會考標示點數：A++、A+、A、B++、B+、B、C 依序為 7、6、5、4、3、2、1 點；五科總標示最高 35 點。'] },
    ],
    rules: [
      { title: '志願序', maximum: '30 分', description: '依志願群組計分。', points: ['第 1 志願群 30 分、第 2 志願群 29 分、第 3 志願群 28 分。', '每一志願群可填 10 校；實際群組規則依簡章說明。'] },
      { title: '多元發展', maximum: '40 分', description: '包含均衡學習、服務、體適能、競賽、證照、獎勵及幹部任期。', points: ['各子項均有採計期間、資格與最高分限制。', '服務學習、獎勵、競賽及證照應備文件依簡章規定辦理。'] },
      { title: '國中教育會考', maximum: '30 分', description: '五科採精熟、基礎、待加強換算。', points: ['精熟 6 分、基礎 4 分、待加強 2 分。'] },
    ], exam: ['會考積分：精熟每科 6 分、基礎每科 4 分、待加強每科 2 分。', '會考標示點數：A++、A+、A、B++、B+、B、C 依序為 7、6、5、4、3、2、1 點，五科總標示最高 35 點。'], reminders: ['志願群與同校同群的認定會影響志願序積分，送出前須逐一核對。', '各項比序採計依「高雄區高級中等學校免試入學－比序項目採計說明」辦理。'],
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
    total: '100', source: 'https://sites.google.com/nehs.hc.edu.tw/115hhmentry/%E9%A6%96%E9%A0%81', sourceLabel: '115 學年度竹苗區免試入學委員會',
    overview: '竹苗區由均衡發展、多元學習表現與國中教育會考三部分組成。',
    comparisonTable: [
      { category: '均衡發展', maximum: '30 分', item: '扶助弱勢', conversion: ['偏遠地區國中學生、經濟弱勢（中低、低收入戶）學生：符合 5 分；不符 0 分', '非山非市國中學生：符合 3 分；不符 0 分'], description: ['偏遠、經濟弱勢、非山非市，以及偏遠與非山非市轉學的認定，符合其中一項者即給分，擇優採計。', '此大項總分 35 分，採計上限 30 分。'] },
      { category: '均衡發展', maximum: '30 分', item: '就近入學', conversion: ['符合：5 分', '不符：0 分'], description: ['竹苗區（含共同就學區及變更就學區）學生皆採計 5 分；其他就學區未完成變更就學區不得報名。'] },
      { category: '均衡發展', maximum: '30 分', item: '志願序位積分', conversion: ['第 1–5 志願：10 分', '第 6–10 志願：9 分', '第 11–15 志願：8 分', '第 16–20 志願：7 分', '第 21–25 志願：6 分'], description: ['學生參考「國中學生生涯發展紀錄手冊」的生涯發展規劃書選填志願。'] },
      { category: '均衡發展', maximum: '30 分', item: '均衡學習', conversion: ['四領域皆符合：15 分', '僅三領域符合：12 分', '僅二領域符合：8 分', '僅一領域符合：4 分'], description: ['以健康與體育、藝術、綜合活動及科技四領域，各學期加總平均成績達及格者換算。', '採計國一上、下，國二上、下及國三上共五學期。'] },
      { category: '多元學習表現', maximum: '40 分', item: '日常生活表現評量', conversion: ['功過相抵後或銷過後無懲罰紀錄：10 分', '每學期無曠課紀錄：2 分，最高 12 分', '大功每次 4.5 分；小功每次 1.5 分；嘉獎每次 0.5 分，最高 20 分'], description: ['日常生活表現評量採計國一上、下，國二上、下及國三上、下共六學期。', '國三下採計至當年 4 月 20 日止。', '此大項總分 54 分，採計上限 40 分。'] },
      { category: '多元學習表現', maximum: '40 分', item: '服務學習', conversion: ['每學期服務每滿 3 小時：1 分', '每學期最高：2 分', '五學期最高：10 分'], description: ['服務學習類型及認定程序，依教育部十二年國民基本教育免試入學「多元學習表現」採計原則辦理。', '採計國一上、下，國二上、下及國三上共五學期。'] },
      { category: '多元學習表現', maximum: '40 分', item: '本土語言認證', conversion: ['通過原住民族語、客語或閩南語初級以上：2 分'], description: ['獲得其中一種認證即採計，最高 2 分。', '採認主管機關核發的證書：原住民族語為原住民族委員會、客語為客家委員會、閩南語為教育部。', '認證採計截止日比照日常生活表現，至當年 4 月 20 日止。'] },
      { category: '國中教育會考', maximum: '30 分', item: '國中教育會考成績', conversion: ['精熟：每科 6 分', '基礎：每科 4 分', '待加強：每科 2 分'], description: ['單科上限 6 分；國文、數學、英語、社會、自然五科合計最高 30 分。'] },
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
      { title: '多元學習表現', maximum: '40 分', description: '採計日常表現、出席、獎勵及服務學習。', points: ['日常表現最高 10 分、出席狀況最高 12 分、獎勵狀況最高 20 分、服務學習最高 10 分。', '子項分數的取得方式與採計區間，依竹苗區簡章規定。'] },
      { title: '國中教育會考', maximum: '30 分', description: '五科採精熟、基礎、待加強換算。', points: ['精熟 6 分、基礎 4 分、待加強 2 分。'] },
    ], exam: ['會考與寫作測驗同為超額比序資料；相同積分時要回到簡章的比序順序判定。'], reminders: ['竹苗區另有優先免試與其他招生管道，請勿直接套用一般免試規則。'],
  },
};

export default function RegionScoringRulesPage({ regionId }: { regionId: string }) {
  const region = ALL_REGIONS.find((item) => item.id === regionId);
  const data = REGION_RULES[regionId];

  if (!region || !data) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 p-6"><section className="max-w-lg rounded-3xl border-4 border-slate-900 bg-white p-8 text-center shadow-[8px_8px_0_0_#0f172a]"><h1 className="text-2xl font-black">找不到此就學區規則</h1><a className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-300 px-4 py-3 font-black" href={withBasePath('/')}>返回首頁 <ArrowRight className="h-4 w-4" /></a></section></main>;
  }

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    <section className="border-b-4 border-slate-900 bg-sky-100"><div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[2px_2px_0_0_#0f172a]"><ArrowLeft className="h-4 w-4" />返回首頁</a>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-sm font-black"><MapPin className="h-4 w-4 text-rose-600" />{region.name}・{region.desc.split('·')[0].trim()}</div><h1 className="mt-4 text-4xl font-black sm:text-5xl">{region.name}計分規則</h1><p className="mt-4 max-w-3xl text-lg font-bold leading-8 text-slate-700">{data.overview}</p></div><div className="rounded-3xl border-4 border-slate-900 bg-amber-300 p-5 text-center shadow-[5px_5px_0_0_#0f172a]"><p className="text-sm font-black">超額比序總分</p><p className="mt-1 text-5xl font-black">{data.total}<span className="ml-1 text-xl">分</span></p></div></div>
    </div></section>
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><div className="mb-8 rounded-2xl border-2 border-amber-400 bg-amber-50 p-5"><div className="flex gap-3"><AlertTriangle className="h-6 w-6 shrink-0 text-amber-700" /><div><h2 className="font-black">使用前請先確認招生管道</h2><p className="mt-1 text-sm font-bold leading-6 text-slate-700">本頁整理的是 115 學年度一般免試入學的超額比序架構。優先免試、完全免試、技優甄審及個別學校招生可能另有規定；正式報名與資格認定一律以官方簡章及原國中審查結果為準。</p>{data.entryNote && <p className="mt-3 inline-flex rounded-lg bg-amber-200 px-3 py-1.5 text-sm font-black text-amber-950">{data.entryNote}</p>}</div></div></div>
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
