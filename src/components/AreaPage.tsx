import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Building2, Calculator, Compass, ExternalLink, GraduationCap, HelpCircle, LineChart, ListChecks, MapPin, Search, Sparkles, Target } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import { AREA_SCHOOLS } from '../lib/areaSchools';

type FAQ = { q: string; a: string };

type AreaData = {
  slug: string;
  regionId: string;
  name: string;
  cities: string;
  active: boolean;
  scoringRulesId?: string;
  description: string;
  keywords: string[];
  faqs: FAQ[];
};

export const AREA_DATA: AreaData[] = [
  {
    slug: 'keelung-taipei',
    regionId: 'taipei',
    name: '基北區',
    cities: '臺北市、新北市、基隆市',
    active: true,
    scoringRulesId: 'taipei',
    description: '基北區涵蓋臺北市、新北市與基隆市，是全國報名人數最多的免試入學就學區。超額比序總分 108 分，由志願序、多元學習表現與國中教育會考三大項目組成。區內高中職與五專校數眾多，競爭較為激烈，建議考生善用落點分析工具釐清志願方向。',
    keywords: ['基北區會考落點分析', '基北區志願選填', '臺北市會考落點', '新北市高中落點', '基隆市會考落點', '基北區高中錄取分數', '基北區會考積分', '台北高中職落點'],
    faqs: [
      { q: '基北區會考落點分析怎麼用？', a: '輸入國中教育會考各科等級與標示，選擇基北區後即可查看推薦校科與落點區間，作為志願選填的參考依據。' },
      { q: '基北區超額比序總分是多少？', a: '基北區超額比序總分為 108 分，包含志願序 36 分、多元學習表現 36 分與國中教育會考 36 分。' },
      { q: '基北區有哪些縣市的學生可以報名？', a: '設籍或就讀於臺北市、新北市、基隆市的國中畢業生，皆可參加基北區免試入學。' },
      { q: '基北區志願選填最多可以填幾個志願？', a: '基北區一般免試入學最多可選填 30 個志願，同校多個科別連續選填可視為同一志願序。' },
    ],
  },
  {
    slug: 'taoyuan',
    regionId: 'taoyuan',
    name: '桃連區',
    cities: '桃園市、連江縣',
    active: true,
    scoringRulesId: 'taoyuan',
    description: '桃連區涵蓋桃園市與連江縣，超額比序由適性輔導、多元學習表現及國中教育會考組成，合計 100 分。桃園市近年學校數成長快速，考生可透過落點分析工具比較各校科的錄取趨勢。',
    keywords: ['桃連區會考落點分析', '桃連區志願選填', '桃園高中落點', '桃園會考落點分析', '桃連區高中錄取分數', '桃連區會考積分', '桃園高中職落點', '桃園高中志願選填'],
    faqs: [
      { q: '桃連區會考落點分析怎麼用？', a: '輸入會考成績並選擇桃連區，系統會比對校科資料並推薦落點區間，協助規劃志願選填方向。' },
      { q: '桃連區超額比序總分是多少？', a: '桃連區超額比序合計 100 分，由適性輔導 32 分、多元學習表現 35 分與國中教育會考 33 分組成。' },
      { q: '桃連區涵蓋哪些縣市？', a: '桃連區涵蓋桃園市與連江縣（馬祖），兩地學生皆可報名參加桃連區免試入學。' },
    ],
  },
  {
    slug: 'hsinchu-miaoli',
    regionId: 'hsinchu',
    name: '竹苗區',
    cities: '新竹市、新竹縣、苗栗縣',
    active: true,
    scoringRulesId: 'hsinchu',
    description: '竹苗區涵蓋新竹市、新竹縣與苗栗縣，由均衡發展、多元學習表現與國中教育會考三部分組成，合計 100 分。竹苗區重視扶助弱勢與就近入學，偏遠和經濟弱勢學生可額外獲得積分。',
    keywords: ['竹苗區會考落點分析', '竹苗區志願選填', '新竹會考落點', '苗栗會考落點', '竹苗區高中錄取分數', '竹苗區會考積分', '新竹高中職落點', '新竹高中志願選填'],
    faqs: [
      { q: '竹苗區會考落點分析怎麼用？', a: '輸入會考各科等級與標示後選擇竹苗區，即可查看推薦校科與落點參考。' },
      { q: '竹苗區超額比序總分是多少？', a: '竹苗區超額比序合計 100 分，由均衡發展 30 分、多元學習表現 40 分與國中教育會考 30 分組成。' },
      { q: '竹苗區涵蓋哪些縣市？', a: '竹苗區涵蓋新竹市、新竹縣與苗栗縣，三地學生皆可報名竹苗區免試入學。' },
      { q: '竹苗區志願選填最多可以填幾個志願？', a: '竹苗區一般免試入學最多可選填 30 個志願，同校連續科別視為同一志願序；實際上限以當學年度簡章公告為準。' },
      { q: '竹苗區超額比序中最重要的項目是什麼？', a: '竹苗區以多元學習表現佔比最高（40 分），包含幹部服務、競賽、品德等；建議考生提早累積多元記錄。' },
    ],
  },
  {
    slug: 'taichung',
    regionId: 'central',
    name: '中投區',
    cities: '臺中市、南投縣',
    active: true,
    scoringRulesId: 'central',
    description: '中投區涵蓋臺中市與南投縣，超額比序由志願序、多元學習表現、會考成績與扶助弱勢四部分構成，合計 100 分。臺中市為中部最大都會區，高中職與五專選擇豐富。',
    keywords: ['中投區會考落點分析', '中投區志願選填', '臺中會考落點', '台中高中落點', '南投會考落點', '中投區高中錄取分數', '中投區會考積分', '台中高中職落點'],
    faqs: [
      { q: '中投區會考落點分析怎麼用？', a: '輸入會考成績並選擇中投區，系統會依據成績推薦適合的校科與落點參考。' },
      { q: '中投區超額比序總分是多少？', a: '中投區超額比序合計 100 分，由志願序、多元學習表現、會考成績與扶助弱勢四大項目組成。' },
      { q: '中投區涵蓋哪些縣市？', a: '中投區涵蓋臺中市與南投縣，兩地學生皆可報名中投區免試入學。' },
      { q: '中投區志願選填最多可以填幾個志願？', a: '中投區一般免試入學最多可選填 30 個志願；實際上限以當學年度簡章公告為準。' },
      { q: '中投區弱勢學生可以獲得額外加分嗎？', a: '中投區超額比序設有扶助弱勢項目，符合低收入戶、身心障礙等資格的考生可獲得額外積分；詳情請參閱當學年度入學簡章。' },
    ],
  },
  {
    slug: 'changhua',
    regionId: 'changhua',
    name: '彰化區',
    cities: '彰化縣',
    active: true,
    scoringRulesId: 'changhua',
    description: '彰化區為單一縣市就學區，涵蓋彰化縣所有國中畢業生。區內高中職校數適中，考生可透過落點分析快速了解各校科的落點趨勢，提前規劃志願選填方向。',
    keywords: ['彰化區會考落點分析', '彰化區志願選填', '彰化會考落點', '彰化高中落點', '彰化區高中錄取分數', '彰化區會考積分', '彰化高中職落點'],
    faqs: [
      { q: '彰化區會考落點分析怎麼用？', a: '輸入會考各科等級與標示後選擇彰化區，即可查看推薦校科與落點參考。' },
      { q: '彰化區涵蓋哪些縣市？', a: '彰化區僅涵蓋彰化縣，設籍或就讀彰化縣國中的畢業生可報名參加。' },
      { q: '彰化區志願選填最多可以填幾個志願？', a: '彰化區一般免試入學最多可選填 30 個志願；實際上限以當學年度簡章公告為準。' },
      { q: '彰化區超額比序最重要的項目是什麼？', a: '彰化區超額比序項目包含志願序、多元學習表現與國中教育會考等，詳細配分請參考本站彰化區計分規則頁面，正式規定以當年度簡章為準。' },
    ],
  },
  {
    slug: 'yunlin',
    regionId: 'yunlin',
    name: '雲林區',
    cities: '雲林縣',
    active: false,
    description: '雲林區涵蓋雲林縣，為單一縣市就學區。區內包含多所高中與技術型高中，考生可依個人興趣與會考成績規劃志願方向。雲林區落點分析功能正在籌備中，敬請期待。',
    keywords: ['雲林區會考落點分析', '雲林區志願選填', '雲林會考落點', '雲林高中落點', '雲林區高中錄取分數', '雲林高中職落點'],
    faqs: [
      { q: '雲林區會考落點分析什麼時候開放？', a: '雲林區的落點分析資料正在整理中，開放後將第一時間更新。目前可先參考會考成績等級與志願選填策略進行規劃。' },
      { q: '雲林區涵蓋哪些縣市？', a: '雲林區僅涵蓋雲林縣，設籍或就讀雲林縣國中的畢業生可報名參加。' },
      { q: '雲林區高中職有哪些類型？', a: '雲林區內設有普通型高中、技術型高中（高職）等學校類型，考生可依興趣與升學方向選擇；詳細校科清單請以當年度入學簡章為準。' },
      { q: '雲林區學生可以跨區報名嗎？', a: '免試入學原則上以就學區為主，雲林學生若符合共同就學區規定，可查閱當年度簡章了解是否能報名鄰近區域。' },
    ],
  },
  {
    slug: 'chiayi',
    regionId: 'chiayi',
    name: '嘉義區',
    cities: '嘉義市、嘉義縣',
    active: true,
    scoringRulesId: 'chiayi',
    description: '嘉義區涵蓋嘉義市與嘉義縣，區內學校類型多元，兼具普通型高中與技術型高中。考生可輸入會考成績查看落點參考，並使用模擬志願序規劃免試入學志願。',
    keywords: ['嘉義區會考落點分析', '嘉義區志願選填', '嘉義會考落點', '嘉義高中落點', '嘉義區高中錄取分數', '嘉義區會考積分', '嘉義高中職落點', '嘉義高中志願選填'],
    faqs: [
      { q: '嘉義區會考落點分析怎麼用？', a: '輸入國中教育會考各科等級與寫作級分，選擇嘉義區後即可查看推薦校科與落點參考，作為志願選填的輔助依據。' },
      { q: '嘉義區涵蓋哪些縣市？', a: '嘉義區涵蓋嘉義市與嘉義縣，兩地學生皆可報名嘉義區免試入學。' },
      { q: '嘉義區有哪些學校類型？', a: '嘉義區內設有普通型高中、技術型高中與五專等學制，考生可依個人興趣與生涯方向選擇適合的學校類型。' },
      { q: '嘉義區志願選填最多可以填幾個志願？', a: '嘉義區一般免試入學最多可選填 30 個志願；第 1 至 6 志願的志願序積分最高，實際選填與同校科別認定仍以當學年度簡章為準。' },
      { q: '嘉義區超額比序總分是多少？', a: '嘉義區超額比序總分為 82 分，包含志願序、扶助弱勢、均衡學習、適性輔導、多元學習表現及國中教育會考。' },
    ],
  },
  {
    slug: 'tainan',
    regionId: 'tainan',
    name: '臺南區',
    cities: '臺南市',
    active: true,
    scoringRulesId: 'tainan',
    description: '臺南區涵蓋臺南市，為南部重要的就學區之一。區內高中職與五專學校選擇多元，考生可透過落點分析工具，依會考成績查看各校科的推薦結果與志願規劃建議。',
    keywords: ['臺南區會考落點分析', '台南區志願選填', '臺南會考落點', '台南高中落點', '臺南區高中錄取分數', '台南區會考積分', '台南高中職落點', '台南高中志願選填'],
    faqs: [
      { q: '臺南區會考落點分析怎麼用？', a: '輸入會考成績並選擇臺南區，系統會依據成績推薦適合的校科與落點參考。' },
      { q: '臺南區超額比序怎麼計分？', a: '臺南區的超額比序項目與積分換算方式，可參考本站的臺南區計分規則頁面，正式規定以當年度簡章為準。' },
      { q: '臺南區涵蓋哪些縣市？', a: '臺南區僅涵蓋臺南市，設籍或就讀臺南市國中的畢業生可報名參加。' },
      { q: '臺南區志願選填最多可以填幾個志願？', a: '臺南區一般免試入學最多可選填 30 個志願；實際上限以當學年度簡章公告為準。' },
      { q: '臺南區有哪些知名高中可以參考落點？', a: '臺南區內涵蓋多所公私立高中職與五專，可使用本站的搜尋功能依校名或科別查找，再對照落點分析結果規劃志願。' },
    ],
  },
  {
    slug: 'kaohsiung',
    regionId: 'kaohsiung',
    name: '高雄區',
    cities: '高雄市',
    active: true,
    scoringRulesId: 'kaohsiung',
    description: '高雄區涵蓋高雄市，為南部規模最大的免試入學就學區。區內高中職與五專數量眾多，考生可透過落點分析工具快速比對各校科的錄取趨勢，並搭配模擬志願序完成選填規劃。',
    keywords: ['高雄區會考落點分析', '高雄區志願選填', '高雄會考落點', '高雄高中落點', '高雄區高中錄取分數', '高雄區會考積分', '高雄高中職落點', '高雄高中志願選填'],
    faqs: [
      { q: '高雄區會考落點分析怎麼用？', a: '輸入會考成績並選擇高雄區，系統會依據成績推薦適合的校科與落點參考。' },
      { q: '高雄區超額比序怎麼計分？', a: '高雄區的超額比序項目與積分換算方式，可參考本站的高雄區計分規則頁面，正式規定以當年度簡章為準。' },
      { q: '高雄區涵蓋哪些縣市？', a: '高雄區僅涵蓋高雄市，設籍或就讀高雄市國中的畢業生可報名參加。' },
      { q: '高雄區志願選填最多可以填幾個志願？', a: '高雄區一般免試入學最多可選填 30 個志願；實際上限以當學年度簡章公告為準。' },
      { q: '高雄區成績多少才有機會上公立高中？', a: '高雄區各校科錄取成績每年略有不同，建議輸入自己的會考等級後使用本站落點分析查看推薦結果，作為志願選填參考。' },
    ],
  },
  {
    slug: 'pingtung',
    regionId: 'pingtung',
    name: '屏東區',
    cities: '屏東縣',
    active: false,
    description: '屏東區涵蓋屏東縣，為南部的單一縣市就學區。區內包含多所高中與技術型高中，考生可依興趣與會考成績進行升學規劃。屏東區落點分析功能正在籌備中。',
    keywords: ['屏東區會考落點分析', '屏東區志願選填', '屏東會考落點', '屏東高中落點', '屏東區高中錄取分數', '屏東高中職落點'],
    faqs: [
      { q: '屏東區會考落點分析什麼時候開放？', a: '屏東區的落點分析資料正在整理中，開放後將第一時間更新。目前可先參考興趣測驗與志願策略進行前期規劃。' },
      { q: '屏東區涵蓋哪些縣市？', a: '屏東區僅涵蓋屏東縣，設籍或就讀屏東縣國中的畢業生可報名參加。' },
      { q: '屏東區有哪些學校類型？', a: '屏東區內設有普通型高中與技術型高中，考生可依個人興趣選擇適合的學制；詳細校科資訊可使用本站搜尋功能查詢。' },
      { q: '等待屏東區落點分析開放期間，可以做哪些準備？', a: '建議先透過本站的 Holland 興趣測驗了解個人職群傾向，並閱讀志願選填策略頁，做好選填前的準備。' },
    ],
  },
  {
    slug: 'yilan',
    regionId: 'yilan',
    name: '宜蘭區',
    cities: '宜蘭縣',
    active: false,
    description: '宜蘭區涵蓋宜蘭縣，為東部的就學區之一。區內高中職校數雖然較少，但各校特色鮮明，考生可依個人興趣選擇適合的升學方向。宜蘭區落點分析功能正在籌備中。',
    keywords: ['宜蘭區會考落點分析', '宜蘭區志願選填', '宜蘭會考落點', '宜蘭高中落點', '宜蘭區高中錄取分數', '宜蘭高中職落點'],
    faqs: [
      { q: '宜蘭區會考落點分析什麼時候開放？', a: '宜蘭區的落點分析資料正在整理中，開放後將第一時間更新。' },
      { q: '宜蘭區涵蓋哪些縣市？', a: '宜蘭區僅涵蓋宜蘭縣，設籍或就讀宜蘭縣國中的畢業生可報名參加。' },
      { q: '宜蘭區高中職學校有哪些特色？', a: '宜蘭區高中職各校特色鮮明，包含普通高中、技術型高中等，考生可依個人升學規劃選擇；詳細資訊可查閱當年度入學簡章。' },
      { q: '宜蘭區學生需要特別注意什麼升學事項？', a: '宜蘭地區學生在選填志願時，可同時關注宜蘭區的免試名額配置，建議搭配本站模擬志願序工具預先規劃。' },
    ],
  },
  {
    slug: 'hualien',
    regionId: 'hualien',
    name: '花蓮區',
    cities: '花蓮縣',
    active: false,
    description: '花蓮區涵蓋花蓮縣，考區內學校各有辦學特色，考生可依個人興趣與生涯規劃選擇適合的方向。花蓮區落點分析功能正在籌備中，敬請期待。',
    keywords: ['花蓮區會考落點分析', '花蓮區志願選填', '花蓮會考落點', '花蓮高中落點', '花蓮區高中錄取分數', '花蓮高中職落點'],
    faqs: [
      { q: '花蓮區會考落點分析什麼時候開放？', a: '花蓮區的落點分析資料正在整理中，開放後將第一時間更新。' },
      { q: '花蓮區涵蓋哪些縣市？', a: '花蓮區僅涵蓋花蓮縣，設籍或就讀花蓮縣國中的畢業生可報名參加。' },
      { q: '花蓮區有哪些高中職學校？', a: '花蓮區設有普通型高中、技術型高中等，各校辦學特色不同，考生可依個人興趣選擇；詳細資訊可查閱當年度入學簡章。' },
      { q: '等待花蓮區落點分析開放期間，可以用什麼工具？', a: '可先透過本站的 Holland 興趣測驗探索職群方向，並使用模擬志願序工具提前整理候選學校清單。' },
    ],
  },
  {
    slug: 'taitung',
    regionId: 'taitung',
    name: '臺東區',
    cities: '臺東縣',
    active: false,
    description: '臺東區涵蓋臺東縣，為東部的就學區之一。區內高中職雖然數量較少，但各校具備獨特的在地辦學特色。臺東區落點分析功能正在籌備中。',
    keywords: ['臺東區會考落點分析', '台東區志願選填', '臺東會考落點', '台東高中落點', '臺東區高中錄取分數', '台東高中職落點'],
    faqs: [
      { q: '臺東區會考落點分析什麼時候開放？', a: '臺東區的落點分析資料正在整理中，開放後將第一時間更新。' },
      { q: '臺東區涵蓋哪些縣市？', a: '臺東區僅涵蓋臺東縣，設籍或就讀臺東縣國中的畢業生可報名參加。' },
      { q: '臺東區高中職有哪些在地特色？', a: '臺東區高中職各具在地辦學特色，包含普通型高中與技術型高中；考生可依個人興趣與升學目標選擇，詳情以當年度簡章為準。' },
      { q: '等待臺東區落點分析開放期間，可以做哪些升學準備？', a: '建議先使用本站的興趣測驗了解職群傾向，並閱讀學校類型解析頁面，釐清普高、技高與五專的差異。' },
    ],
  },
  {
    slug: 'penghu',
    regionId: 'penghu',
    name: '澎湖區',
    cities: '澎湖縣',
    active: false,
    description: '澎湖區涵蓋澎湖縣，為離島就學區之一。區內設有高中與技術型高中，考生可依個人興趣選擇升學方向。澎湖區落點分析功能正在籌備中。',
    keywords: ['澎湖區會考落點分析', '澎湖區志願選填', '澎湖會考落點', '澎湖高中落點', '澎湖區高中錄取分數', '澎湖高中職落點'],
    faqs: [
      { q: '澎湖區會考落點分析什麼時候開放？', a: '澎湖區的落點分析資料正在整理中，開放後將第一時間更新。' },
      { q: '澎湖區涵蓋哪些縣市？', a: '澎湖區僅涵蓋澎湖縣，設籍或就讀澎湖縣國中的畢業生可報名參加。' },
      { q: '澎湖區有哪些高中職學校？', a: '澎湖區設有高中與技術型高中，提供離島學生在地升學選擇；考生亦可依需求參閱臺灣本島各就學區資訊。' },
      { q: '澎湖區學生可以報名本島就學區嗎？', a: '離島學生的跨區報名資格請依當年度各就學區入學簡章規定為準，建議及早查閱官方公告。' },
    ],
  },
  {
    slug: 'kinmen',
    regionId: 'kinmen',
    name: '金門區',
    cities: '金門縣',
    active: false,
    description: '金門區涵蓋金門縣，為離島就學區之一。區內設有高中與技術型高中，考生亦可報名桃連區免試入學。金門區落點分析功能正在籌備中。',
    keywords: ['金門區會考落點分析', '金門區志願選填', '金門會考落點', '金門高中落點', '金門區高中錄取分數', '金門高中職落點'],
    faqs: [
      { q: '金門區會考落點分析什麼時候開放？', a: '金門區的落點分析資料正在整理中，開放後將第一時間更新。' },
      { q: '金門區涵蓋哪些縣市？', a: '金門區僅涵蓋金門縣，設籍或就讀金門縣國中的畢業生可報名參加。' },
      { q: '金門區學生可以報名其他區嗎？', a: '金門縣學生除了金門區外，也可依規定報名桃連區免試入學，詳情請參考各區簡章公告。' },
      { q: '金門區有哪些高中職學校？', a: '金門區設有高中與技術型高中，提供在地學生升學選擇；有意就讀本島學校的考生，可同時了解桃連區的相關規定。' },
      { q: '等待金門區落點分析開放期間，可以用什麼工具規劃升學？', a: '建議先使用本站的 Holland 興趣測驗探索職群方向，並閱讀學校類型解析了解各學制特色，落點分析開放後即可搭配使用。' },
    ],
  },
];

export const getAreaBySlug = (slug: string): AreaData | undefined => AREA_DATA.find((area) => area.slug === slug);

// Links to related tools shown on every area page
const toolCards = [
  { title: '搜尋學校與科別', desc: '依學校名稱、科別、縣市快速查找校科資訊。', href: '/search', icon: Search, tone: 'bg-sky-100 text-sky-700' },
  { title: '模擬志願序', desc: '建立志願清單並調整順序，列印草稿核對。', href: '/mock-volunteer', icon: ListChecks, tone: 'bg-amber-100 text-amber-700' },
  { title: '填志願策略', desc: '了解夢幻、實際、保守志願的安排原則。', href: '/strategy', icon: Target, tone: 'bg-orange-100 text-orange-700' },
  { title: 'Holland 興趣測驗', desc: '探索個人興趣特質，找出適合的職群方向。', href: '/holland', icon: Sparkles, tone: 'bg-purple-100 text-purple-700' },
  { title: '技職群科百科', desc: '認識技職各群科的學習內容與未來進路。', href: '/vocational-encyclopedia', icon: BookOpen, tone: 'bg-emerald-100 text-emerald-700' },
  { title: '學校類型解析', desc: '比較普高、技高、綜高與五專的特色差異。', href: '/school-types', icon: GraduationCap, tone: 'bg-rose-100 text-rose-700' },
  { title: '歷年會考統計', desc: '查看歷年成績分布與等級趨勢。', href: '/historical-stats', icon: LineChart, tone: 'bg-indigo-100 text-indigo-700' },
  { title: '會考成績等級', desc: '確認 A、B、C 與標示的對照方式。', href: '/grade-level', icon: HelpCircle, tone: 'bg-fuchsia-100 text-fuchsia-700' },
];

export default function AreaPage({ slug }: { slug: string }) {
  const area = getAreaBySlug(slug);

  if (!area) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 p-6"><section className="max-w-lg rounded-3xl border-4 border-slate-900 bg-white p-8 text-center shadow-[8px_8px_0_0_#0f172a]"><h1 className="text-2xl font-black">找不到此就學區</h1><a className="mt-6 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-300 px-4 py-3 font-black" href={withBasePath('/')}>返回首頁 <ArrowRight className="h-4 w-4" /></a></section></main>;
  }

  const otherAreas = AREA_DATA.filter((a) => a.slug !== slug);

  return <main className="min-h-screen bg-slate-50 text-slate-900">
    {/* Hero */}
    <section className="border-b-4 border-slate-900 bg-indigo-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[2px_2px_0_0_#0f172a]"><ArrowLeft className="h-4 w-4" />返回首頁</a>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-sm font-black"><MapPin className="h-4 w-4 text-rose-600" />{area.cities}</div>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">{area.name}會考落點分析</h1>
            <p className="mt-2 text-base font-bold text-indigo-700">{area.cities}免試入學志願選填</p>
            <p className="mt-4 max-w-3xl text-lg font-bold leading-8 text-slate-700">{area.description}</p>
          </div>
          <div className="w-full lg:w-auto shrink-0">
            {area.active
              ? <a href={withBasePath('/')} className="flex w-full justify-center lg:inline-flex lg:w-auto items-center gap-3 rounded-2xl border-4 border-slate-900 bg-indigo-600 px-6 py-4 text-lg font-black text-white shadow-[5px_5px_0_0_#0f172a] transition hover:bg-indigo-700"><Compass className="h-6 w-6" />開始落點分析</a>
              : <div className="w-full sm:w-auto rounded-2xl border-4 border-slate-900 bg-slate-200 px-6 py-4 text-center shadow-[5px_5px_0_0_#0f172a]"><p className="text-lg font-black text-slate-600">落點分析籌備中</p><p className="mt-1 text-sm font-bold text-slate-500">資料整理完成後將開放查詢</p></div>
            }
          </div>
        </div>
      </div>
    </section>

    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Scoring rules link */}
      {area.scoringRulesId && <section className="mb-8">
        <a href={withBasePath(`/scoring-rules/${area.scoringRulesId}`)} className="flex items-center gap-4 rounded-2xl border-4 border-slate-900 bg-amber-50 p-5 shadow-[4px_4px_0_0_#0f172a] transition hover:bg-amber-100">
          <div className="rounded-xl border-2 border-slate-900 bg-amber-300 p-3"><Calculator className="h-6 w-6" /></div>
          <div className="flex-1"><h2 className="text-xl font-black">{area.name}超額比序計分規則</h2><p className="mt-1 text-sm font-bold text-slate-600">查看一般免試入學的超額比序項目、會考換算與官方簡章入口。</p></div>
          <ArrowRight className="h-5 w-5 shrink-0" />
        </a>
      </section>}

      {/* Tools grid */}
      <section className="mb-10">
        <h2 className="text-2xl font-black">升學規劃工具</h2>
        <p className="mt-2 text-sm font-bold text-slate-600">搭配落點結果，使用這些工具完成{area.name}的志願選填規劃。</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toolCards.map((card) => <a key={card.href} href={withBasePath(card.href)} className="flex flex-col rounded-2xl border-3 border-slate-900 bg-white p-4 shadow-[3px_3px_0_0_#0f172a] transition hover:shadow-[5px_5px_0_0_#0f172a]">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 ${card.tone}`}><card.icon className="h-5 w-5" /></div>
            <h3 className="mt-3 font-black">{card.title}</h3>
            <p className="mt-1 text-sm font-bold leading-6 text-slate-600">{card.desc}</p>
          </a>)}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="text-2xl font-black">{area.name}常見問題</h2>
        <div className="mt-5 space-y-4">
          {area.faqs.map((faq) => <details key={faq.q} className="group rounded-2xl border-3 border-slate-900 bg-white shadow-[3px_3px_0_0_#0f172a]">
            <summary className="cursor-pointer list-none px-5 py-4 font-black [&::-webkit-details-marker]:hidden">
              <div className="flex items-center justify-between gap-3">
                <span>{faq.q}</span>
                <span className="shrink-0 text-xl leading-none transition group-open:rotate-45">+</span>
              </div>
            </summary>
            <div className="border-t-2 border-slate-200 px-5 py-4 text-sm font-bold leading-7 text-slate-700">{faq.a}</div>
          </details>)}
        </div>
      </section>

      {/* Other regions navigation */}
      <section>
        <h2 className="text-2xl font-black">其他就學區</h2>
        <p className="mt-2 text-sm font-bold text-slate-600">查看全國其他就學區的會考落點分析入口。</p>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {otherAreas.map((a) => <a key={a.slug} href={withBasePath(`/area/${a.slug}`)} title={`${a.name}會考落點分析（${a.cities}）${a.active ? '' : '｜籌備中'}`} className="flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2.5 text-sm font-black shadow-[2px_2px_0_0_#0f172a] transition hover:bg-slate-50 hover:shadow-[3px_3px_0_0_#0f172a]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-rose-600" />{a.name}
            {!a.active && <span className="ml-auto rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-black text-slate-500">籌備中</span>}
          </a>)}
        </div>
      </section>

      {/* SEO Schools List */}
      <section className="mb-10 mt-16">
        <details className="group rounded-2xl border-3 border-slate-900 bg-slate-100 shadow-[3px_3px_0_0_#0f172a] transition-colors hover:bg-amber-50">
          <summary className="cursor-pointer list-none px-5 py-4 font-black [&::-webkit-details-marker]:hidden">
            <div className="flex items-center justify-between gap-3 text-slate-700 group-hover:text-slate-900">
              <span className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                {area.name}涵蓋高中職與五專學校列表
              </span>
              <span className="shrink-0 text-xl leading-none transition duration-300 group-open:rotate-45">+</span>
            </div>
          </summary>
          <div className="border-t-3 border-slate-900 bg-white px-5 py-6 rounded-b-[14px]">
            <div className="flex flex-wrap gap-2">
              {AREA_SCHOOLS[slug]?.map(school => (
                <span key={school} className="inline-block rounded-lg border-2 border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
                  {school}
                </span>
              ))}
            </div>
            <p className="mt-5 text-[11px] font-bold text-slate-400">
              * 上述清單包含{area.name}免試入學與共同就學區之相關學校，供會考落點分析與志願選填參考。
            </p>
          </div>
        </details>
      </section>
    </div>
  </main>;
}
