import React, { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, Briefcase, GraduationCap, Search, Sparkles, Tags } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import { pageNavigationAsideClassName } from './PageNavigation';

type VocationalGroup = {
  id: string;
  icon: string;
  summary: string;
  holland: string;
  hollandDesc: string;
  traits: string[];
  learning: string[];
  majors: string[];
  careers: string[];
  furtherStudy: string[];
  selectionTip: string;
};

// 15 groups follow the technical senior high school group classification.
// Departments offered differ by school; this page intentionally lists common
// examples rather than implying every school offers every department.
const groups: VocationalGroup[] = [
  { id: '機械群', icon: '⚙️', summary: '以機械設計、製圖、加工與製造為核心，從材料、量測到車床、銑床、CNC 與自動化設備，練習把圖面做成可用的零件或成品。', holland: 'R／I', hollandDesc: '適合喜歡動手拆裝、理解機構原理、耐心調整細節的人；對數學、空間概念與實作都有興趣會更容易投入。', traits: ['喜歡動手製作', '重視精準與安全', '具空間與邏輯概念'], learning: ['機械製圖與電腦繪圖', '機械加工、量測與材料', '機構、機件原理與製造'], majors: ['機械科', '模具科', '製圖科', '電腦機械製圖科', '鑄造科', '板金科', '機電科', '生物產業機電科'], careers: ['機械製造與加工技術', '模具與產品開發', '品管與量測', '自動化設備維護'], furtherStudy: ['機械工程', '材料工程', '自動化工程', '工業工程與管理'], selectionTip: '先確認自己是否喜歡長時間的實作、量測與反覆修正；不同學校的設備與實習工場特色差異很大。' },
  { id: '動力機械群', icon: '🚗', summary: '認識車輛、引擎、底盤、電系、液壓與動力系統的運作，重點不只在修車，也包含故障診斷、保養、安全與新式車輛技術。', holland: 'R／I', hollandDesc: '適合對汽機車、引擎、交通工具與機械維修有好奇心，願意依流程檢測問題並重視操作安全的人。', traits: ['對車輛與機械有興趣', '願意實作檢測', '具問題排除耐心'], learning: ['引擎、底盤與車身系統', '汽機車電系與電子控制', '保養、檢修與故障診斷'], majors: ['汽車科', '重機科', '動力機械科', '農業機械科', '飛機修護科', '軌道車輛科'], careers: ['汽機車檢修', '車輛保養服務', '車輛零組件製造', '運輸與維修技術'], furtherStudy: ['車輛工程', '機械工程', '航空工程', '運輸與物流管理'], selectionTip: '喜歡車不等於喜歡維修；先了解實習是否包含拆裝、油污環境與依規範進行的檢修流程。' },
  { id: '電機與電子群', icon: '💡', summary: '涵蓋電路、電子、資訊、控制、通訊與冷凍空調，從配線、程式與電路實驗，理解各種電力與智慧設備如何運作。', holland: 'R／I', hollandDesc: '適合喜歡電腦、電路、科技產品或解題的人。需要細心閱讀圖表、依規範操作，並持續練習邏輯思考。', traits: ['喜歡科技與拆解原理', '邏輯思考佳', '能細心依規範操作'], learning: ['基本電學、電子學與電路實驗', '程式設計、控制與資訊應用', '電機配線、通訊或冷凍空調實作'], majors: ['電機科', '電子科', '資訊科', '控制科', '冷凍空調科', '電子通信科', '航空電子科', '電機空調科'], careers: ['電機電子製造與測試', '資訊與網路技術', '自動控制設備', '冷凍空調維護'], furtherStudy: ['電機工程', '電子工程', '資訊工程', '自動化與控制工程'], selectionTip: '資訊科、電子科與電機科名稱相近但課程重心不同；務必比較學校課程地圖、專題與實習設備。' },
  { id: '化工群', icon: '🧪', summary: '以化學實驗、分析、製程與安全管理為基礎，認識原料如何轉化為日常產品，並學習在實驗室與工廠環境中正確操作。', holland: 'I／R', hollandDesc: '適合對化學反應、實驗操作與數據紀錄感興趣，能遵守安全規範、耐心觀察並分析結果的人。', traits: ['喜歡化學與實驗', '重視安全細節', '能整理觀察數據'], learning: ['化學、化工原理與分析', '實驗器材與製程操作', '工業安全、環保與品質管理'], majors: ['化工科', '紡織科', '染整科'], careers: ['化學製程操作', '品管與檢驗', '材料與紡織技術', '環安衛相關工作'], furtherStudy: ['化學工程', '材料工程', '環境工程', '生物科技'], selectionTip: '化工課程很重視實驗安全與紀錄；若只喜歡「做實驗」但不喜歡化學原理與數據分析，需先審慎評估。' },
  { id: '土木與建築群', icon: '🏗️', summary: '從建築圖、測量、營建材料到施工管理，理解建物與公共工程如何被規劃、設計、建造與維護。', holland: 'R／I', hollandDesc: '適合喜歡建築、空間規劃、模型或戶外測量的人；需具備細心、空間感與團隊協作能力。', traits: ['喜歡建築與空間規劃', '具空間想像力', '能配合現場與團隊作業'], learning: ['工程圖學與電腦繪圖', '測量、營建材料與施工', '建築構造與工程管理'], majors: ['土木科', '建築科', '消防工程科', '空間測繪科'], careers: ['營造與工程技術', '測量與繪圖', '建築設計助理', '工地管理與建物維護'], furtherStudy: ['土木工程', '建築', '營建工程', '空間資訊與測繪'], selectionTip: '建築科不等於只畫設計圖，土木科也不等於只做工地；先看課程中的測量、施工、繪圖比例。' },
  { id: '商業與管理群', icon: '📈', summary: '學習會計、經濟、商業概論、行銷、門市與數位商務，理解商品、金流、資訊與顧客需求如何串成一門生意。', holland: 'E／C', hollandDesc: '適合喜歡規劃、數字、溝通或經營想法的人。細心整理資料、與人合作及理解市場變化都很重要。', traits: ['喜歡規劃與數字', '溝通與協作能力', '做事有條理'], learning: ['會計、經濟與商業概論', '行銷、門市與顧客服務', '商業資訊與電子商務'], majors: ['商業經營科', '國際貿易科', '會計事務科', '資料處理科', '流通管理科', '電子商務科'], careers: ['會計與行政', '行銷企劃與門市管理', '電商營運', '貿易與物流服務'], furtherStudy: ['企業管理', '會計', '資訊管理', '行銷與流通管理'], selectionTip: '商管群不只是在學「做生意」；會計、文書、資料處理與報表閱讀是常見基礎，需能接受細節性工作。' },
  { id: '外語群', icon: '🌐', summary: '透過英語或日語等語言的聽說讀寫、跨文化溝通與商務應用，培養運用外語取得資訊、服務他人與連結世界的能力。', holland: 'S／A／E', hollandDesc: '適合喜歡語言、文化、閱讀、表達與交流的人。需要願意長期練習，並對不同文化保持開放態度。', traits: ['喜歡語言與文化', '願意持續練習', '樂於溝通表達'], learning: ['外語聽說讀寫', '跨文化溝通', '商務、觀光或數位外語應用'], majors: ['應用英語科', '應用日語科'], careers: ['國際事務與行政', '觀光與旅運服務', '外語客服', '翻譯與語言相關進修'], furtherStudy: ['應用外語', '國際貿易', '觀光與休閒', '語言與文化相關領域'], selectionTip: '外語能力來自長期累積；選科前可先想想自己是否享受每天聽、說、讀、寫與反覆練習。' },
  { id: '設計群', icon: '🎨', summary: '把觀察、創意與技術轉化成視覺、商品、空間或互動作品；除了美感，也重視使用者需求、製作流程與作品表達。', holland: 'A／R', hollandDesc: '適合喜歡畫畫、影像、手作、觀察生活細節與解決設計問題的人；願意反覆修改作品很重要。', traits: ['具美感與觀察力', '喜歡創作與手作', '能接受反覆修正'], learning: ['設計基礎、色彩與構成', '繪圖、攝影或數位設計', '模型、工藝與作品集表達'], majors: ['廣告設計科', '多媒體設計科', '室內空間設計科', '家具設計科', '陶瓷工程科', '圖文傳播科'], careers: ['視覺與平面設計', '數位內容製作', '空間與商品設計', '印刷與傳播技術'], furtherStudy: ['視覺傳達設計', '數位媒體設計', '工業設計', '室內設計'], selectionTip: '設計不是只靠靈感；需接受基礎素描、軟體操作、提案與作品反覆修改，作品集累積也很重要。' },
  { id: '農業群', icon: '🌱', summary: '認識作物、園藝、畜產、森林、生物技術與農業經營，將自然科學、環境永續與實作管理結合在一起。', holland: 'R／I', hollandDesc: '適合喜歡自然、生物、動植物或戶外實作的人；需有耐心觀察、照護生命並重視環境與安全。', traits: ['喜歡自然與生命科學', '願意戶外實作', '細心觀察與照護'], learning: ['植物、動物與生物技術', '栽培、飼養與農業機械', '農業經營、環境與永續'], majors: ['農場經營科', '園藝科', '森林科', '畜產保健科', '野生動物保育科', '生物產業機電科'], careers: ['農業與園藝技術', '畜產與動物照護', '生態保育', '農業經營與技術服務'], furtherStudy: ['農業', '園藝', '動物科學', '森林與自然資源'], selectionTip: '農業群有許多戶外、栽培與照護實作；對動植物有興趣外，也要能接受依季節與工作流程進行作業。' },
  { id: '食品群', icon: '🍞', summary: '從食品原料、加工、烘焙到衛生、檢驗與品質管理，學習安全地製作與保存食物，並了解食品產業的流程。', holland: 'R／I／C', hollandDesc: '適合喜歡食品、烘焙、化學實驗或精準操作的人。對衛生規範、流程紀錄與品質要求要有耐心。', traits: ['喜歡食品製作或科學', '重視衛生與流程', '能精準操作'], learning: ['食品加工與烘焙', '食品化學、微生物與檢驗', '衛生安全與品質管理'], majors: ['食品加工科', '食品科', '烘焙科'], careers: ['食品製造', '烘焙與產品研發', '食品檢驗與品管', '餐飲食品創業'], furtherStudy: ['食品科學', '保健營養相關領域', '餐飲管理', '生物科技'], selectionTip: '食品群除了烘焙，也會學食品化學、衛生與檢驗；若只想做料理，餐旅群的課程可能更符合期待。' },
  { id: '家政群', icon: '🧵', summary: '聚焦生活應用、服飾、美容、美髮、幼兒保育與照顧服務，從專業技術、衛生安全到服務溝通，回應人的生活需求。', holland: 'S／A／R', hollandDesc: '適合喜歡照顧人、造型、美感或生活服務的人。需具備同理心、耐心、衛生觀念與與人互動的能力。', traits: ['有服務與同理心', '重視衛生與細節', '喜歡美感或照護'], learning: ['服飾、造型或美容技術', '幼兒保育與生活照顧', '衛生、安全與服務溝通'], majors: ['家政科', '服裝科', '美容科', '美髮技術科', '幼兒保育科', '時尚造型科'], careers: ['美容美髮與造型', '服飾製作', '幼兒與照顧服務', '生活服務相關工作'], furtherStudy: ['美容與造型設計', '服飾設計', '幼兒教育與保育', '老人服務與健康管理'], selectionTip: '與幼兒、照顧或美容相關工作各有法規與專業資格要求；高中所學是基礎，升學與證照規劃要另外確認。' },
  { id: '餐旅群', icon: '🍽️', summary: '學習餐飲製備、旅館服務、飲調、烘焙與旅遊實務，重視服務流程、衛生安全、團隊合作與面對顧客的應對能力。', holland: 'S／E', hollandDesc: '適合喜歡料理、服務、旅遊文化與團隊合作的人。工作節奏可能較快，需能溝通、應變並維持專業態度。', traits: ['喜歡料理或旅遊服務', '樂於與人互動', '能在忙碌中保持條理'], learning: ['中西餐烹調、烘焙或飲調', '旅館、餐飲與旅遊服務', '衛生安全、成本與服務管理'], majors: ['餐飲管理科', '觀光事業科', '餐飲技術科', '烘焙科', '旅遊事務科'], careers: ['餐飲內外場服務', '廚藝與烘焙', '旅館與旅運服務', '活動與宴會企劃'], furtherStudy: ['餐旅管理', '觀光與休閒', '餐飲廚藝', '運動休閒與活動管理'], selectionTip: '餐旅群的重點是服務專業與現場合作，不只「吃喝玩樂」；實作、服儀、衛生與顧客應對都會占重要比重。' },
  { id: '水產群', icon: '🐟', summary: '以水生生物、養殖、漁業資源與水產食品為主，認識從繁殖、飼養、環境管理到水產品處理的完整過程。', holland: 'R／I', hollandDesc: '適合喜歡海洋、生物、動物照護與實地觀察的人；需能配合戶外或水域環境，並重視生物與作業安全。', traits: ['喜歡海洋與生物', '能接受戶外實作', '具觀察與照護耐心'], learning: ['水產生物與養殖', '水質、飼養與疾病管理', '漁業資源與水產食品'], majors: ['水產養殖科', '漁業科'], careers: ['養殖與水產技術', '水質與生物管理', '水產加工', '漁業相關服務'], furtherStudy: ['水產養殖', '海洋科學', '食品科學', '環境與生態相關領域'], selectionTip: '水產群的校數與地理分布較集中，選填時除興趣外，也要確認通勤、住宿及學校的實習場域。' },
  { id: '海事群', icon: '⚓', summary: '認識船舶、航海、輪機、海運與海洋工程；學習航行、機電、船舶維護與海上安全等專業基礎。', holland: 'R／I', hollandDesc: '適合對船舶、海洋、機械或航行有興趣，能遵守嚴謹安全規範、具責任感並適應團隊生活的人。', traits: ['對海洋與船舶有興趣', '責任感與安全意識', '能適應團隊與規範'], learning: ['航海、船藝與海上安全', '輪機、船舶電機與維修', '海運與海事法規基礎'], majors: ['航海科', '輪機科', '船舶機電科', '船舶電機科'], careers: ['航運與船務', '船舶輪機維護', '港埠與海運服務', '海事技術工作'], furtherStudy: ['航運管理', '輪機工程', '海洋工程', '物流與港埠管理'], selectionTip: '海事相關工作與升學可能涉及體格、證照或航海實習條件；請直接查閱學校及主管機關最新規定。' },
  { id: '藝術群', icon: '🎭', summary: '以音樂、戲劇、舞蹈、影視等藝術專業為核心，透過長期練習、表演製作與作品呈現，培養藝術表達與舞台合作能力。', holland: 'A', hollandDesc: '適合對表演、音樂、影像或舞台創作有熱情且願意長期練功的人；除了天分，持續練習與團隊合作同樣關鍵。', traits: ['強烈藝術表達動機', '願意持續練習', '能接受公開演出與回饋'], learning: ['表演、音樂、舞蹈或影視專業', '藝術史、創作與製作', '舞台技術與作品呈現'], majors: ['音樂科', '西樂科', '國樂科', '戲劇科', '舞蹈科', '影視科'], careers: ['表演與創作', '影視與舞台製作', '藝術教育與推廣', '文化內容產業'], furtherStudy: ['音樂', '戲劇', '舞蹈', '影視與表演藝術'], selectionTip: '部分藝術群科別設有術科或甄選要求；選填前應確認招生方式、專長準備與持續練習所需的時間投入。' },
];

type Myth = { myth: string; fact: string };

const groupMyths: Record<string, Myth[]> = {
  '機械群': [
    { myth: '迷思：機械群就是一直操作車床。', fact: '正確觀念：加工實作很重要，但同時也要學製圖、材料、量測、機構原理與製造流程。' },
    { myth: '迷思：不會修東西就不能讀機械。', fact: '正確觀念：先備經驗不是必要條件；願意動手、能耐心練習與重視安全，比一開始就會修更重要。' },
  ],
  '動力機械群': [
    { myth: '迷思：動力機械群只有修汽車。', fact: '正確觀念：課程還會涉及引擎、底盤、電系、診斷、保養與其他動力或運輸工具技術。' },
    { myth: '迷思：喜歡賽車就一定適合。', fact: '正確觀念：興趣是起點，但專業學習需要接受拆裝、量測、故障診斷與安全規範。' },
  ],
  '電機與電子群': [
    { myth: '迷思：喜歡用電腦就應該選資訊科。', fact: '正確觀念：電機、電子、資訊、控制與冷凍空調的核心不同，要看自己喜歡程式、電路、配線或設備控制。' },
    { myth: '迷思：學電機電子就是一直寫程式。', fact: '正確觀念：程式只是其中一部分，還包括電學、電子電路、實驗、量測與實作安全。' },
  ],
  '化工群': [
    { myth: '迷思：化工群只是在做有趣的化學實驗。', fact: '正確觀念：也重視化學原理、製程、分析、紀錄、品質與工業安全。' },
    { myth: '迷思：只要背化學方程式就好。', fact: '正確觀念：需要理解原理、正確操作器材並根據數據判讀結果。' },
  ],
  '土木與建築群': [
    { myth: '迷思：建築科就是每天畫漂亮房子。', fact: '正確觀念：設計與繪圖之外，還有構造、材料、測量與施工等基礎。' },
    { myth: '迷思：土木群只適合想做工地的人。', fact: '正確觀念：可延伸至測量、繪圖、營建管理、建物維護與工程相關領域。' },
  ],
  '商業與管理群': [
    { myth: '迷思：商管群就是學怎麼當老闆。', fact: '正確觀念：會從會計、經濟、資訊、行銷與流通等基礎，理解企業實際運作。' },
    { myth: '迷思：不喜歡數字也沒關係。', fact: '正確觀念：不同科別比重不同，但帳務、資料整理與基本數字判讀通常是重要能力。' },
  ],
  '外語群': [
    { myth: '迷思：外語群只要英文好就夠了。', fact: '正確觀念：還需要持續練習聽說讀寫、跨文化理解與實際溝通表達。' },
    { myth: '迷思：讀外語群畢業就會當翻譯。', fact: '正確觀念：語言可應用在國際事務、觀光、服務與商務等多個方向，仍需累積專業能力。' },
  ],
  '設計群': [
    { myth: '迷思：喜歡畫圖就一定適合設計群。', fact: '正確觀念：設計還涉及觀察、問題解決、軟體操作、提案與反覆修改。' },
    { myth: '迷思：設計只要有靈感，不必練基本功。', fact: '正確觀念：色彩、構成、繪圖、製作與作品表達都需要持續練習。' },
  ],
  '農業群': [
    { myth: '迷思：農業群就是務農。', fact: '正確觀念：涵蓋園藝、畜產、森林、生物技術、保育與農業經營等多元方向。' },
    { myth: '迷思：喜歡動物就只需要讀獸醫。', fact: '正確觀念：畜產保健與保育重點在飼養、照護與產業技術；不同升學與職業路徑有不同資格要求。' },
  ],
  '食品群': [
    { myth: '迷思：食品群和餐旅群完全一樣。', fact: '正確觀念：食品群較著重加工、檢驗、衛生、品質與保存；餐旅群更著重料理、服務與旅宿實務。' },
    { myth: '迷思：食品群只會做烘焙。', fact: '正確觀念：烘焙是部分科別內容，食品化學、微生物、檢驗與安全管理同樣重要。' },
  ],
  '家政群': [
    { myth: '迷思：家政群只學做家事。', fact: '正確觀念：涵蓋服飾、美容、美髮、幼保與照顧服務等專業技術與服務能力。' },
    { myth: '迷思：喜歡小孩就適合幼兒保育。', fact: '正確觀念：幼保工作也需要學習發展知識、活動設計、安全與溝通，並非只有陪伴玩耍。' },
  ],
  '餐旅群': [
    { myth: '迷思：餐旅群就是每天做菜、吃美食。', fact: '正確觀念：課程包含衛生、成本、服務流程、服儀、顧客應對與團隊合作。' },
    { myth: '迷思：只要外向就適合餐旅群。', fact: '正確觀念：外向有幫助，但更需要在忙碌環境中維持細心、責任感與專業態度。' },
  ],
  '水產群': [
    { myth: '迷思：水產群就是出海捕魚。', fact: '正確觀念：也包含養殖、水質管理、水產生物、資源管理與水產食品。' },
    { myth: '迷思：喜歡海洋就完全不用學科學。', fact: '正確觀念：水質、生物、疾病管理與養殖技術需要自然科學基礎與細心觀察。' },
  ],
  '海事群': [
    { myth: '迷思：海事群畢業一定要上船。', fact: '正確觀念：也可延伸至船務、港埠、海運、維修與相關管理領域。' },
    { myth: '迷思：只要不怕海就能讀。', fact: '正確觀念：海事重視安全、規範、團隊生活與實務條件，部分路徑也可能有資格或健康要求。' },
  ],
  '藝術群': [
    { myth: '迷思：有天分就不需要長期練習。', fact: '正確觀念：音樂、戲劇、舞蹈與影視都需要穩定練習、作品累積與接受回饋。' },
    { myth: '迷思：藝術群只能當表演者。', fact: '正確觀念：也可探索製作、技術、教育、推廣與文化內容等多樣角色。' },
  ],
};

const selectionSteps = [
  ['先看課程', '打開目標學校的課程地圖或科別介紹，確認是否真的想學那些內容。'],
  ['再看自己', '想想自己喜歡的活動、擅長的學科、能接受的實作環境與學習方式。'],
  ['比較學校', '比較學校位置、實習設備、特色課程、升學輔導與當年度招生資訊。'],
  ['確認簡章', '填志願前，以當年度免試入學與學校招生簡章為最後依據。'],
];

const groupThemes: Record<string, { hero: string; icon: string; chip: string }> = {
  '機械群': { hero: 'from-slate-800 via-slate-700 to-cyan-700', icon: 'bg-cyan-200', chip: 'bg-cyan-100 text-cyan-950' },
  '動力機械群': { hero: 'from-orange-700 via-amber-600 to-yellow-500', icon: 'bg-amber-200', chip: 'bg-amber-100 text-amber-950' },
  '電機與電子群': { hero: 'from-blue-800 via-indigo-700 to-violet-600', icon: 'bg-indigo-200', chip: 'bg-indigo-100 text-indigo-950' },
  '化工群': { hero: 'from-fuchsia-800 via-purple-700 to-violet-600', icon: 'bg-fuchsia-200', chip: 'bg-fuchsia-100 text-fuchsia-950' },
  '土木與建築群': { hero: 'from-stone-800 via-amber-800 to-orange-700', icon: 'bg-orange-200', chip: 'bg-orange-100 text-orange-950' },
  '商業與管理群': { hero: 'from-emerald-800 via-teal-700 to-cyan-700', icon: 'bg-emerald-200', chip: 'bg-emerald-100 text-emerald-950' },
  '外語群': { hero: 'from-sky-800 via-blue-700 to-indigo-600', icon: 'bg-sky-200', chip: 'bg-sky-100 text-sky-950' },
  '設計群': { hero: 'from-rose-800 via-pink-700 to-fuchsia-600', icon: 'bg-pink-200', chip: 'bg-pink-100 text-pink-950' },
  '農業群': { hero: 'from-green-800 via-emerald-700 to-lime-600', icon: 'bg-lime-200', chip: 'bg-lime-100 text-lime-950' },
  '食品群': { hero: 'from-amber-800 via-orange-700 to-red-600', icon: 'bg-yellow-200', chip: 'bg-yellow-100 text-yellow-950' },
  '家政群': { hero: 'from-rose-800 via-pink-700 to-purple-600', icon: 'bg-rose-200', chip: 'bg-rose-100 text-rose-950' },
  '餐旅群': { hero: 'from-red-800 via-orange-700 to-amber-600', icon: 'bg-orange-200', chip: 'bg-orange-100 text-orange-950' },
  '水產群': { hero: 'from-cyan-800 via-sky-700 to-blue-600', icon: 'bg-cyan-200', chip: 'bg-cyan-100 text-cyan-950' },
  '海事群': { hero: 'from-blue-950 via-blue-800 to-cyan-700', icon: 'bg-sky-200', chip: 'bg-sky-100 text-sky-950' },
  '藝術群': { hero: 'from-violet-900 via-purple-700 to-fuchsia-600', icon: 'bg-fuchsia-200', chip: 'bg-fuchsia-100 text-fuchsia-950' },
};

const getFiveGroupMyths = (group: VocationalGroup): Myth[] => [
  ...groupMyths[group.id],
  { myth: `迷思：同是${group.id}，每所學校的課程都完全一樣。`, fact: `正確觀念：${group.id}有共同專業核心，但實際開設科別、實習設備、特色課程與專題方向仍會因學校而不同。` },
  { myth: `迷思：只看科名，就能知道自己適不適合${group.id}。`, fact: '正確觀念：應進一步閱讀課程地圖、實作內容與學校介紹；科名相近，實際學習經驗可能差異很大。' },
  { myth: `迷思：選${group.id}後，未來只能走單一路徑。`, fact: '正確觀念：可依個人學習成果、興趣與入學管道繼續升學或探索相關產業；高中階段的選擇是起點，不是唯一限制。' },
];

const getDetailedSelectionTip = (group: VocationalGroup) => {
  const courseExample = group.learning.slice(0, 2).join('、');
  const majorExamples = group.majors.slice(0, 3).join('、');
  return `${group.selectionTip} 先回頭看課程：如果「${courseExample}」這些內容是你願意花時間練習的，而不只是覺得名稱好聽，才值得優先考慮。再比較目標學校是否實際設有${majorExamples}等科別，以及實習設備、特色課程、通勤與生活安排是否可行。最後請以當年度招生簡章為準，必要時可參加校園參訪或向在校師生詢問真實的學習情況。`;
};

export default function VocationalEncyclopediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(groups[0].id);
  const filteredGroups = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return groups;
    return groups.filter((group) => [group.id, group.summary, group.holland, ...group.traits, ...group.learning, ...group.majors, ...group.careers].some((text) => text.toLowerCase().includes(keyword)));
  }, [searchTerm]);
  const resolvedGroup = groups.find((group) => group.id === selectedId) || filteredGroups[0] || groups[0];
  const selectedGroup = { ...resolvedGroup, selectionTip: getDetailedSelectionTip(resolvedGroup) };
  const selectedGroupMyths = getFiveGroupMyths(selectedGroup);
  const selectedTheme = groupThemes[selectedGroup.id] || groupThemes['機械群'];
  const chooseGroup = (id: string) => { setSelectedId(id); window.setTimeout(() => document.getElementById('group-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0); };

  return <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
    <section className="border-b-4 border-slate-900 bg-emerald-50"><div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
      <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"><ArrowLeft className="h-4 w-4" />回首頁</a>
      <div className="py-8 sm:py-10"><div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-3 py-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"><div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-emerald-100"><BookOpen className="h-5 w-5 text-emerald-700" /></div><div><p className="text-xs font-black uppercase text-slate-500">Vocational Encyclopedia</p><p className="text-sm font-black text-slate-700">技術型高中 15 群完整導覽</p></div></div>
        <h1 className="text-3xl font-black sm:text-5xl lg:text-6xl">職群科系百科</h1><p className="mt-4 max-w-4xl text-[15px] font-bold leading-8 text-slate-700 sm:text-lg">認識技術型高中 15 群的學習內容、常見科別與職涯方向。群別是專業領域的分類，不等於每所學校都設有該群全部科別；選填前請務必再查閱各校當年度招生簡章。</p>
      </div></div></section>
    <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8"><div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end"><div><p className="text-sm font-black text-emerald-700">從興趣開始探索</p><h2 className="text-2xl font-black">先選一個想了解的職群</h2></div><p className="text-sm font-bold text-slate-600">可從左側搜尋或點選群別，查看完整學習與選科資訊。</p></div></div></section>
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[340px_1fr] lg:px-8">
      <aside className={pageNavigationAsideClassName}><div className="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><label className="mb-3 flex items-center gap-2 text-sm font-black text-slate-500"><Search className="h-4 w-4" />搜尋群別、科別或興趣</label><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="例如：資訊、餐飲、設計、I" className="w-full rounded-xl border-2 border-slate-900 bg-slate-50 py-3 pl-10 pr-3 text-sm font-bold outline-none focus:bg-white" /></div>
        <div className="mt-4 grid max-h-[520px] gap-2 overflow-y-auto pr-1">{filteredGroups.length === 0 ? <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm font-bold text-slate-500">找不到符合的群別，試試其他關鍵字。</div> : filteredGroups.map((group) => { const active = group.id === selectedGroup.id; return <button key={group.id} onClick={() => chooseGroup(group.id)} className={`flex items-center justify-between gap-3 rounded-xl border-2 px-3 py-3 text-left transition-all ${active ? 'border-slate-900 bg-emerald-500 text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]' : 'border-slate-200 bg-white text-slate-800 hover:border-slate-900 hover:bg-emerald-50'}`}><span className="flex items-center gap-3"><span className="text-2xl">{group.icon}</span><span><span className="block text-sm font-black">{group.id}</span><span className={`block text-xs font-bold ${active ? 'text-emerald-50' : 'text-slate-500'}`}>Holland {group.holland}</span></span></span><Tags className="h-4 w-4 shrink-0" /></button>; })}</div></div></aside>
      <div className="min-w-0 space-y-6"><section className="overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-emerald-100 text-lg font-black text-emerald-800">15</div><div><p className="text-sm font-black text-slate-900">技術型高中 15 群</p><p className="mt-1 text-sm font-bold text-slate-500">從興趣、學習內容與科別開始探索。</p></div></div><a href={withBasePath('/holland')} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-purple-600 px-4 py-3 font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5"><Sparkles className="h-5 w-5" />還不確定方向？做荷倫碼測驗</a></div></section>
        <section id="group-detail" className="scroll-mt-6 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]"><div className={`relative overflow-hidden bg-gradient-to-br ${selectedTheme.hero} px-5 py-6 text-white sm:px-7 sm:py-8`}><div className="pointer-events-none absolute -right-14 -top-16 h-52 w-52 rounded-full border-8 border-white/20" /><div className="pointer-events-none absolute bottom-0 right-28 h-24 w-24 rotate-12 rounded-3xl bg-white/10" /><div className="relative flex flex-col gap-5 sm:flex-row sm:items-center"><div className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-[1.4rem] border-4 border-slate-900 ${selectedTheme.icon} text-5xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]`}>{selectedGroup.icon}</div><div className="min-w-0"><div className="flex flex-wrap gap-2"><span className="rounded-full border-2 border-white/80 bg-white/15 px-3 py-1 text-xs font-black">技術型高中 15 群</span><span className="rounded-full border-2 border-white/80 bg-white/15 px-3 py-1 text-xs font-black">Holland {selectedGroup.holland}</span></div><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{selectedGroup.id}</h2><p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-white/90 sm:text-base">{selectedGroup.summary}</p></div></div></div>
          <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]"><div className="space-y-5"><InfoBlock icon={<BookOpen className="h-5 w-5" />} title="主要學習內容" tone="emerald" items={selectedGroup.learning} /><InfoBlock icon={<GraduationCap className="h-5 w-5" />} title="常見相關科別" tone="emerald" items={selectedGroup.majors} /><InfoBlock icon={<GraduationCap className="h-5 w-5" />} title="升學延伸方向" tone="emerald" items={selectedGroup.furtherStudy} /><InfoBlock icon={<Briefcase className="h-5 w-5" />} title="可能職涯方向" tone="amber" items={selectedGroup.careers} /></div><div className="space-y-5"><InfoBlock icon={<Tags className="h-5 w-5" />} title="適合培養的特質" tone="amber" items={selectedGroup.traits} /><div className="rounded-2xl border-2 border-amber-700 bg-amber-50 p-5"><h3 className="text-lg font-black text-amber-900">選擇前，先問自己</h3><p className="mt-3 text-sm font-bold leading-7 text-slate-700">{selectedGroup.selectionTip}</p></div><div className="rounded-2xl border-2 border-slate-900 bg-purple-50 p-5"><h3 className="text-lg font-black text-purple-800">Holland 興趣提醒</h3><p className="mt-3 text-sm font-bold leading-7 text-slate-700">{selectedGroup.hollandDesc}</p><p className="mt-3 text-xs font-bold leading-6 text-slate-500">Holland 代碼只適合作為探索興趣的線索，不應作為選科的唯一依據。</p></div></div></div></section>
        <section className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]"><div className="rounded-2xl border-4 border-slate-900 bg-amber-50 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><p className="text-sm font-black text-amber-800">{selectedGroup.id}專屬提醒</p><h2 className="text-2xl font-black">選 {selectedGroup.id} 前，先破解 5 個迷思</h2><div className="mt-4 grid gap-3">{selectedGroupMyths.map((item, index) => <details key={item.myth} className="group rounded-xl border-2 border-amber-200 bg-white p-4"><summary className="cursor-pointer list-none font-black text-amber-900 marker:hidden"><span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-xs text-amber-950">{index + 1}</span>{item.myth}<span className="float-right text-lg transition-transform group-open:rotate-45">＋</span></summary><p className="mt-3 border-t border-amber-100 pt-3 text-sm font-bold leading-7 text-slate-700">{item.fact}</p></details>)}</div></div><div className="rounded-2xl border-4 border-slate-900 bg-sky-50 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"><h2 className="text-2xl font-black">選科 4 步走</h2><ol className="mt-4 grid gap-3">{selectionSteps.map(([title, description], index) => <li key={title} className="flex gap-3 rounded-xl border-2 border-sky-200 bg-white p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">{index + 1}</span><div><h3 className="font-black text-sky-900">{title}</h3><p className="mt-1 text-sm font-bold leading-6 text-slate-700">{description}</p></div></li>)}</ol></div></section>
      </div></section></main>;
}

function InfoBlock({ icon, title, tone, items }: { icon: React.ReactNode; title: string; tone: 'emerald' | 'amber'; items: string[] }) {
  const iconClasses = tone === 'emerald' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800';
  const numberClasses = tone === 'emerald' ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900';
  return <section className="rounded-2xl border-2 border-slate-900 bg-white p-5"><div className="flex items-center gap-3"><div className={`rounded-lg border border-slate-200 p-2 ${iconClasses}`}>{icon}</div><h3 className="text-lg font-black text-slate-900">{title}</h3></div><ul className="mt-4 grid auto-rows-fr gap-2 sm:grid-cols-2">{items.map((item, index) => <li key={item} className={`flex items-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-3 py-3 text-sm font-bold leading-6 text-slate-700 ${items.length % 2 === 1 && index === items.length - 1 ? 'sm:col-span-2' : ''}`}><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black ${numberClasses}`}>{String(index + 1).padStart(2, '0')}</span><span>{item}</span></li>)}</ul></section>;
}
