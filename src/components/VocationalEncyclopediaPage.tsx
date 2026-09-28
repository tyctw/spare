import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Briefcase, GraduationCap, Search, Sparkles, Tags, X } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import { groups, type VocationalGroup } from '../lib/vocationalGroups';
import './vocational-encyclopedia-page.css';

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

const getFiveGroupMyths = (group: VocationalGroup): Myth[] => [
  ...groupMyths[group.id],
  { myth: `迷思：同是${group.id}，每所學校的課程都完全一樣。`, fact: `正確觀念：${group.id}有共同專業核心，但實際開設科別、實習設備、特色課程與專題方向仍會因學校而不同。` },
  { myth: `迷思：只看科名，就能知道自己適不適合${group.id}。`, fact: '正確觀念：應進一步閱讀課程地圖、實作內容與學校介紹；科名相近，實際學習經驗可能差異很大。' },
  { myth: `迷思：選${group.id}後，未來只能走單一路徑。`, fact: '正確觀念：可依個人學習成果、興趣與入學管道繼續升學或探索相關產業；高中階段的選擇是起點，不是唯一限制。' },
];

export default function VocationalEncyclopediaPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const requestedGroup = new URLSearchParams(window.location.search).get('group');
  const [selectedId, setSelectedId] = useState(() => groups.some((group) => group.id === requestedGroup) ? requestedGroup! : groups[0].id);
  const filteredGroups = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return groups;
    return groups.filter((group) => [group.id, group.summary, group.holland, ...group.traits, ...group.learning, ...group.majors, ...group.careers].some((text) => text.toLowerCase().includes(keyword)));
  }, [searchTerm]);
  const selectedGroup = filteredGroups.find((group) => group.id === selectedId) ?? filteredGroups[0];
  const selectedGroupMyths = selectedGroup ? getFiveGroupMyths(selectedGroup) : [];
  const chooseGroup = (id: string) => {
    setSelectedId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('group', id);
    window.history.replaceState(null, '', url);
    window.setTimeout(() => document.getElementById('group-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0);
  };

  return <main className="voc-page">
    <section className="voc-hero"><div className="voc-shell">
      <a href={withBasePath('/')} className="voc-back"><ArrowLeft size={16} />返回首頁</a>
      <div className="voc-hero-grid"><div><p className="voc-kicker"><BookOpen size={17} />技術型高中職群指南</p><h1>職群科系百科</h1><p className="voc-lead">從 15 個職群認識學習內容、常見科別與未來方向。先找到感興趣的群，再比較實際開設的學校與課程。</p><a href="#explore-groups" className="voc-primary">開始探索職群<ArrowRight size={17} /></a></div>
        <div className="voc-hero-aside"><strong>15 個職群</strong><span>每個職群都有不同的課程、實作方式與科別。</span><p>群別是專業領域分類，不代表每所學校都開設群內所有科別。</p></div>
      </div>
    </div></section>

    <div id="explore-groups" className="voc-shell voc-layout">
      <aside className="voc-selector" aria-label="選擇職群">
        <div className="voc-selector-heading"><p>先選方向</p><h2>探索 15 個職群</h2><span>搜尋群別、科別或感興趣的內容。</span></div>
        <label className="voc-search"><Search size={18} aria-hidden="true" /><span className="sr-only">搜尋群別、科別或興趣</span><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="例如：資訊、餐飲、設計" />{searchTerm && <button type="button" onClick={() => setSearchTerm('')} aria-label="清除搜尋"><X size={16} /></button>}</label>
        <p className="voc-search-count" aria-live="polite">{filteredGroups.length === groups.length ? '全部 15 個職群' : `找到 ${filteredGroups.length} 個職群`}</p>
        <div className="voc-group-list">
          {filteredGroups.length === 0 ? <div className="voc-no-results"><strong>沒有符合的職群</strong><span>試試群別名稱、科別或其他關鍵字。</span><button type="button" onClick={() => setSearchTerm('')}>清除搜尋</button></div> : filteredGroups.map((group) => <button type="button" key={group.id} onClick={() => chooseGroup(group.id)} aria-pressed={group.id === selectedGroup?.id} className="voc-group-button"><span className="voc-group-icon" aria-hidden="true">{group.icon}</span><span><strong>{group.id}</strong><small>Holland {group.holland}</small></span><ArrowRight size={16} aria-hidden="true" /></button>)}
        </div>
        <a href={withBasePath('/holland')} className="voc-holland-link"><Sparkles size={20} /><span><strong>還不確定方向？</strong><small>先做荷倫碼興趣測驗</small></span><ArrowUpRight size={16} /></a>
      </aside>

      <div className="voc-content">
        {selectedGroup ? <>
          <section id="group-detail" className="voc-detail" aria-labelledby="voc-group-title">
            <div className="voc-detail-heading"><span className="voc-detail-emoji" aria-hidden="true">{selectedGroup.icon}</span><div><p>目前探索的職群 · Holland {selectedGroup.holland}</p><h2 id="voc-group-title">{selectedGroup.id}</h2></div></div>
            <p className="voc-summary">{selectedGroup.summary}</p>
            <div className="voc-detail-actions"><a href={withBasePath(`/search?${new URLSearchParams({ group: selectedGroup.id })}`)} className="voc-action-primary">查看開設學校<ArrowUpRight size={16} /></a><a href={withBasePath(`/vocational-compare?${new URLSearchParams({ group: selectedGroup.id })}`)} className="voc-action-secondary">與其他職群比較<ArrowRight size={16} /></a></div>
          </section>

          <section className="voc-info-section"><div className="voc-section-heading"><p>從課程開始</p><h3>在這個職群會學什麼？</h3></div><InfoList items={selectedGroup.learning} /></section>
          <section className="voc-info-section"><div className="voc-section-heading"><p>往下看科別</p><h3>常見相關科別</h3><span>點科別可查看開設學校；實際招生仍以當年度簡章為準。</span></div><div className="voc-major-list">{selectedGroup.majors.map((major) => <a key={major} href={withBasePath(`/search?${new URLSearchParams({ group: selectedGroup.id, q: major })}`)} aria-label={`查看開設${major}的學校`}>{major}<ArrowUpRight size={15} /></a>)}</div></section>
          <section className="voc-future-section"><div className="voc-section-heading"><p>放眼未來</p><h3>升學與職涯方向</h3></div><div className="voc-future-grid"><div><GraduationCap size={21} /><h4>升學延伸</h4><InfoList items={selectedGroup.furtherStudy} /></div><div><Briefcase size={21} /><h4>可能職涯</h4><InfoList items={selectedGroup.careers} /></div></div></section>
          <section className="voc-traits-section"><div className="voc-section-heading"><p>了解自己</p><h3>適合培養的特質</h3></div><div className="voc-trait-list">{selectedGroup.traits.map((trait) => <span key={trait}>{trait}</span>)}</div><div className="voc-holland-note"><Tags size={18} /><div><strong>Holland {selectedGroup.holland}</strong><p>{selectedGroup.hollandDesc}</p><small>興趣代碼僅供探索參考，不能單獨決定選科。</small></div></div></section>
          <section className="voc-choice-section"><div className="voc-section-heading"><p>選科前想清楚</p><h3>這個方向適合我嗎？</h3></div><p>{selectedGroup.selectionTip}</p><div className="voc-choice-steps"><div><strong>01 看課程</strong><span>這些學習內容，是我願意長期練習的嗎？</span></div><div><strong>02 看學校</strong><span>目標科別、設備、實習與通勤條件合適嗎？</span></div><div><strong>03 核對簡章</strong><span>招生名額、採計與最新課程都確認過了嗎？</span></div></div></section>
          <section className="voc-myths"><div className="voc-section-heading"><p>釐清印象</p><h3>{selectedGroup.id}的五個常見迷思</h3></div>{selectedGroupMyths.map((item, index) => <details key={item.myth}><summary><span>{String(index + 1).padStart(2, '0')}</span>{item.myth.replace(/^迷思：/, '')}<span className="voc-plus">＋</span></summary><p>{item.fact.replace(/^正確觀念：/, '')}</p></details>)}</section>
        </> : <div className="voc-empty-detail">請調整搜尋關鍵字，或清除搜尋查看全部職群。</div>}
      </div>
    </div>
    <section className="voc-shell voc-bottom"><div className="voc-section-heading"><p>把興趣變成選擇</p><h2>選科四步走</h2></div><div className="voc-bottom-grid">{selectionSteps.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
  </main>;
}

function InfoList({ items }: { items: string[] }) {
  return <ul className="voc-info-list">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}
