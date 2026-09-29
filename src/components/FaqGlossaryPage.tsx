import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, ChevronDown, CircleHelp, Search, ShieldAlert, X } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageBreadcrumb from './PageBreadcrumb';
import './faq-glossary-page.css';

type Entry = { category: string; term: string; summary: string; detail: string };

const entries: Entry[] = [
  { category: '會考成績', term: '國中教育會考', summary: '國中畢業生常用的升學參考測驗。', detail: '會考成績可作為免試入學等升學管道的比序資料之一。各招生區實際採計的項目與方式不完全相同，應以當年度招生簡章為準。' },
  { category: '會考成績', term: '等級與標示', summary: '各科以 A、B、C 等級及加號標示呈現學習表現。', detail: '不同等級與標示的意義、答對題數與採計方法，應查看當年度會考官方說明及各就學區簡章。本網站的換算僅供初步參考。' },
  { category: '會考成績', term: '寫作測驗級分', summary: '會考寫作測驗的成績表現。', detail: '部分就學區會將寫作測驗納入超額比序或同分比序；是否採計及採計方式會因招生區與年度而異。' },
  { category: '會考成績', term: '免試入學超額比序', summary: '當報名人數超過招生名額時，用來排序的比較規則。', detail: '常見項目可能包含志願序、多元學習表現、會考成績、寫作測驗或其他簡章所列條件。比序順序與計分方式由各區招生委員會公告。' },
  { category: '選填志願', term: '就學區', summary: '依居住、就讀或報名資格適用的招生範圍。', detail: '不同就學區的招生名額、比序規則、志願數與時程可能不同。選填前請先確認自己的報名資格及所屬就學區。' },
  { category: '選填志願', term: '志願序', summary: '你想就讀校科的排列優先順序。', detail: '志願序不只是喜好排序，在部分就學區也可能影響超額比序積分。先填真正最想讀且符合規則的校科，再安排實際與保守選項。' },
  { category: '選填志願', term: '個別序位區間', summary: '反映考生在同一招生區、相近比序條件中的相對位置。', detail: '個別序位區間通常比單看原始分數更適合判讀競爭位置，但仍不能保證錄取。請搭配當年招生名額、歷年資料及官方公告判斷。' },
  { category: '選填志願', term: '落點分析', summary: '以輸入成績與歷年資料推估可能的校科範圍。', detail: '落點分析是協助整理選項的工具，不是錄取保證。考題難度、名額、報名人數、規則與個人條件變化，都可能使實際結果不同。' },
  { category: '選填志願', term: '夢幻、實際、保守志願', summary: '用不同風險區間安排志願清單的方法。', detail: '夢幻志願是願意挑戰的選項；實際志願與目前條件較接近；保守志願則是錄取機會相對高且自己願意就讀的選項。比例應依個人情況調整。' },
  { category: '學校與科別', term: '普通型高中（普高）', summary: '以學術課程為主，常見於準備一般大學升學。', detail: '普通型高中通常重視國文、英文、數學、自然與社會等學科基礎，但各校課程特色、校訂必修與升學輔導仍有差異。' },
  { category: '學校與科別', term: '技術型高中（技高／高職）', summary: '結合共同學科與專業群科課程的高中階段教育。', detail: '技高依群科學習專業基礎與實作，也可透過統測、技優或其他管道升學。選擇前應查看科別課程、實習內容與未來進路。' },
  { category: '學校與科別', term: '綜合型高中（綜高）', summary: '提供學術與專門學程選擇的學校類型。', detail: '綜高的學程分流時間、可選學程與課程規劃會因學校不同而不同；不要只看校名，應確認目標學程是否真的開設。' },
  { category: '學校與科別', term: '五專', summary: '國中畢業後可報讀的五年制專科教育。', detail: '五專著重專業與實務養成，畢業取得副學士學位。招生管道、名額、學費、住宿及續讀選擇應直接查閱各校與當年度簡章。' },
  { category: '學校與科別', term: '職群與科別', summary: '職群是相關專業領域的分類；科別是實際就讀的專業。', detail: '同一職群內的科別名稱與學習重點仍可能差很多，例如資訊、電子與電機都有不同的課程比例與實作方向。請以各校課程地圖為準。' },
  { category: '使用本站', term: '歷年最低錄取分數', summary: '過去年度最後錄取者的參考資料，不是今年門檻。', detail: '歷年資料會受名額、報名人數、考題難度與比序規則影響。它適合觀察趨勢，不應單獨用來判定今年一定能否錄取。' },
  { category: '使用本站', term: '資料更新日與來源', summary: '用來確認資訊適用年度與可追溯性。', detail: '招生規則與日期會變動。使用本站資料前請查看標示年度與更新時間；關鍵決策請回到招生委員會、教育主管機關或學校的正式公告核對。' },
  { category: '會考成績', term: '成績複查', summary: '對成績有疑義時，依規定申請重新核對。', detail: '會考成績複查的對象、申請期間、費用與方式，應依當年度國中教育會考簡章辦理。複查通常是確認成績登錄、加總或核算程序，並不是重新閱卷或調整作答結果；請在期限內向學校或官方指定窗口確認。' },
  { category: '招生管道', term: '就學區免試入學（大免）', summary: '高中職免試入學中，依所屬就學區選填志願的主要管道。', detail: '全國免試入學分為 15 個就學區，但志願數、名額、比序與時程不完全相同。學生依規定選填校科；報名人數未超過招生名額時原則上全額錄取，超額時才依該區的超額比序規則分發。不能用其他就學區的規則推斷自己的結果。' },
  { category: '招生管道', term: '學習區完全免試入學（完免）', summary: '通常不採計會考成績、由辦理學校較早進行的免試管道。', detail: '完免是部分高中職依學習區規劃辦理的招生方式，通常有獨立時程，結果也會在會考前或一般免試入學前公告。它不是所有學校都有、名額也通常有限；資格、招生校科、適用國中、名額、報名與錄取後能否參加其他管道，都要以當年度簡章確認。' },
  { category: '招生管道', term: '優先免試入學（優免）', summary: '鼓勵學生就近入學的地區性免試招生機會。', detail: '優免僅在部分就學區辦理，並非全國都有。招生對象、適用國中或區域、名額、比序與後續影響均不一致；它不是「比較容易錄取」的同義詞。報名前先確認自己是否符合資格，以及錄取或放棄後能否、如何參加其他管道。' },
  { category: '招生管道', term: '直升入學', summary: '完全中學附設國中部學生銜接原校高中部的升學方式。', detail: '直升的對象通常是該校國中部應屆畢業生，不是所有國中學生都可申請。當報名人數超過名額時，通常依該區免試入學超額比序規則處理；實際資格、名額、比序與報到後影響，仍以各校及各區當年度簡章為準。' },
  { category: '招生管道', term: '技優甄審入學', summary: '供技藝教育、技能競賽或相關表現符合資格學生申請的管道。', detail: '主要適用於修習國中技藝教育課程，或在技能、技藝競賽具備簡章所列成果的學生；通常由招生學校依積分或審查規定辦理。可採認的資格、證明文件、招生校科、名額與比序每年均可能不同，不是擁有任一獎狀就一定能報名。' },
  { category: '招生管道', term: '特色招生', summary: '針對特定學術、技能或課程特色辦理的招生方式。', detail: '特色招生可能包含專業群科甄選入學與考試分發入學等不同類型。前者常有術科或實務選才；後者依辦理區域與學校，可能有學科測驗。是否可跨區、測驗內容、採計成績與錄取後規定，都必須逐校閱讀當年度簡章。' },
  { category: '招生管道', term: '產業特殊需求類科與實用技能學程', summary: '偏向特定產業需求或實作、就業取向的學習進路。', detail: '實用技能學程以做中學與技術課程為重，招生通常不採計會考成績；全國分區、可報名區域及是否限報一區，均應依當年度簡章確認。這些管道不是每個就學區或每所學校都有；選擇前要看實作比例、通勤、實習與後續升學或就業進路。' },
  { category: '招生管道', term: '免試入學單獨招生', summary: '由個別學校依核定簡章辦理的招生方式。', detail: '單獨招生的招生對象、校科、名額、報名方式與時程可能和分區免試不同。看到招生公告時，先確認是否適用自己的身分、是否與其他管道的報到或放棄規定相互影響，再決定是否報名。' },
  { category: '特色招生與甄選', term: '科學班甄選入學', summary: '提供具科學潛能學生進入科學班的單獨招生方式。', detail: '科學班由當年度核定辦理的高中各自招生，通常在會考前完成甄選，並依校方規定進行科學能力檢定、實驗實作或面談等評量。學校數、報名限制、評量項目與錄取方式會調整；例如 115 學年度有 10 校辦理，不能把該校數當成每年固定規則。' },
  { category: '特色招生與甄選', term: '專業群科甄選入學', summary: '以術科或實作評量為主，招收適合特定技高群科的學生。', detail: '這是特色招生的一類，通常由招生學校依群科需求辦理術科測驗或實作評量；國中畢業生可依興趣與性向報考，部分招生不受原就學區限制。招生類別、可報校數、測驗內容、是否採計會考與錄取規則皆依當年度簡章，不能只用「幾類幾群」的舊資料判斷。' },
  { category: '特色招生與甄選', term: '體育班甄選入學與運動成績優良升學', summary: '讓具運動專長學生依術科或運動表現申請的升學方式。', detail: '體育班甄選通常以術科測驗及簡章所列條件評量；另有運動成績優良學生甄審、甄試等不同制度。兩者的資格、可跨區與否、採計成績、報名校數及放榜時程不相同，應確認自己要報的是哪一種管道，並以當年度招生簡章為準。' },
  { category: '特色招生與甄選', term: '藝術才能班甄選入學', summary: '讓具音樂、美術、舞蹈或戲劇等專長學生報考藝才班的方式。', detail: '藝才班招生常分為術科測驗與分發（或安置）兩個階段；術科類別、成績採計、志願選填、學校與名額依區域及年度而異。術科成績好不代表已完成錄取，仍要在指定期限內依簡章完成後續分發或報到程序。' },
  { category: '特色招生與甄選', term: '特色招生考試分發入學', summary: '少數核定學校或特色班，以學科測驗與分發方式招生。', detail: '這類招生常見於特定課程或特色班，由各招生區或學校依簡章辦理紙筆測驗與分發；會考成績是否列為門檻或超額比序項目也依簡章而定。辦理區數與學校數每年可能不同，例如 115 學年度並非沿用前一年度的固定校數，請直接查當年官方簡章。' },
  { category: '選填志願', term: '變更就學區', summary: '依規定申請至非原就學區就讀的程序。', detail: '變更就學區不是只因為想讀某校就自然成立，通常涉及適用事由、證明文件與申請期限。各年度與就學區規定可能不同；請在正式選填前向國中承辦人員或招生委員會確認資格，避免最後才發現無法報名。' },
  { category: '選填志願', term: '共同就學區', summary: '就學區交界依規定可跨區選填的學校範圍。', detail: '共同就學區的適用學校與學生範圍由官方公告，並不表示可任意跨所有就學區選填。若目標校位於交界或不同縣市，請查當年度共同就學區劃定結果與招生簡章。' },
  { category: '選填志願', term: '招生名額、一般生與特殊身分名額', summary: '同一校科可能依招生類別或身分區分不同席次。', detail: '比較名額時要確認校科、招生管道與適用身分完全相同。一般生名額、特殊身分名額、外加名額、直升或其他管道名額不能直接加在一起當成自己可競爭的名額；名額如有修正，應以最新官方公告為準。' },
  { category: '選填志願', term: '報名、儲存、列印與確認', summary: '選填完成後仍須依系統與學校規定完成程序。', detail: '在系統輸入志願不一定等於完成報名。各區可能要求儲存、列印志願表、學生或家長簽名、交由國中確認或完成其他程序；請依當年度系統提示與校內通知逐項完成，並保留必要的確認紀錄。' },
  { category: '選填志願', term: '報到與放棄錄取資格', summary: '錄取後必須在期限內完成或聲明放棄的程序。', detail: '錄取不等於已完成報到；若改變心意，也不能只是不去學校。請查看錄取學校和該招生管道的當年度公告，確認報到方式、應備資料、放棄期限與後續影響。不同管道規定不同，不能互相套用。' },
  { category: '五專與進路', term: '五專完全免試、優先免試與聯合免試', summary: '五專主要招生管道，志願與比序方式不完全相同。', detail: '五專完全免試、優先免試及北、中、南區聯合免試，招生學校、志願選擇、會考成績採計與分發方式各有規定。以 115 學年度為例，五專完全免試不採計會考成績；其他管道及不同校科的採計方式仍應詳閱當年度招生簡章，不宜只憑前一年經驗判斷。' },
  { category: '五專與進路', term: '副學士學位與後續升學', summary: '五專畢業後取得副學士學位，仍有繼續升學選擇。', detail: '五專修業完成後可取得副學士學位，後續可依相關規定升讀二技、報考轉學考或探索其他進路。各校科的課程、實習、證照、升學銜接與資格不完全相同；選填前建議直接查看目標校科的課程規劃與招生資訊。' },
  { category: '使用本站', term: '網站資料和官方簡章不同，該相信哪一個？', summary: '正式簡章與最新公告優先。', detail: '本站用於整理與理解資料，但無法取代招生委員會、主管機關與學校的正式公告。若發現校名、科別、名額、日期或規則不同，請以當年度較新的官方來源為準，並可透過資料問題回報功能提供可公開查核的連結。' },
  { category: '使用本站', term: '沒有某校科的歷年資料，還能放進志願嗎？', summary: '可以研究，但不能把空白當成安全訊號。', detail: '先確認今年是否招生、招生類別與名額，再以相近校科、官方資料、個人序位和就讀意願建立判斷。若它是想讀的選項可以保留；若只是因為沒有看到分數才當保底，應另外準備資料較完整且願意就讀的替代方案。' },
  { category: '會考成績', term: '只看總分或等級，能判斷志願嗎？', summary: '不能只看單一分數；要一起看就學區比序與個別條件。', detail: '會考的等級與標示很重要，但免試入學遇到超額時，還可能依志願序、多元學習表現、寫作測驗或各區規定比較。建議先確認自己所屬就學區的比序表，再搭配個別序位區間、招生名額與歷年趨勢安排志願。' },
  { category: '學校與科別', term: '選學校還是選科別？', summary: '兩者都要看，但應先確認自己願不願意讀該科的三年課程。', detail: '普高、技高、綜高與五專的學習方式不同；同一所學校內，不同科別的專業課程、實習、作息與後續進路也可能差很多。先看課程地圖、實習內容與通勤，再把「想讀的科別」和「能接受的校園生活」一起排序。' },
  { category: '特色招生與甄選', term: '報名特色招生後，還能參加免試入學嗎？', summary: '可能可以，但錄取、報到或放棄的時點與限制必須逐一確認。', detail: '不同特色招生類型與就學區的規定不盡相同，尤其牽涉到錄取後是否需要報到、放棄期限，以及能否再參加其他管道。不要只看考試日期沒有衝突；報名前請同時閱讀招生簡章的「錄取生報到」與「其他入學管道」規定，並向國中承辦人員確認。' },
];

const questions = entries.filter((entry) => /[？?]/.test(entry.term));
const glossary = entries.filter((entry) => !/[？?]/.test(entry.term));
const categories = Array.from(new Set(glossary.map((entry) => entry.category)));

type View = 'all' | 'questions' | 'glossary';

export default function FaqGlossaryPage() {
  const [keyword, setKeyword] = useState('');
  const [view, setView] = useState<View>('all');
  const [category, setCategory] = useState('全部');
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const query = keyword.trim().toLocaleLowerCase();
  const matches = (entry: Entry) => !query || [entry.category, entry.term, entry.summary, entry.detail].some((value) => value.toLocaleLowerCase().includes(query));
  const visibleQuestions = useMemo(() => questions.filter(matches), [query]);
  const visibleGlossary = useMemo(() => glossary.filter((entry) => matches(entry) && (category === '全部' || entry.category === category)), [query, category]);
  const groupedGlossary = useMemo(() => visibleGlossary.reduce<Record<string, Entry[]>>((groups, entry) => {
    (groups[entry.category] ??= []).push(entry);
    return groups;
  }, {}), [visibleGlossary]);
  const showQuestions = view !== 'glossary';
  const showGlossary = view !== 'questions';
  const resultCount = (showQuestions ? visibleQuestions.length : 0) + (showGlossary ? visibleGlossary.length : 0);
  const selectView = (next: View) => { setView(next); setOpenTerm(null); };
  const selectCategory = (next: string) => { setCategory(next); setOpenTerm(null); };
  const clearFilters = () => { setKeyword(''); setCategory('全部'); setView('all'); setOpenTerm(null); };

  return <main className="faq-page"><div className="faq-shell">
    <PageBreadcrumb title="常見問答與名詞百科" />
    <header className="faq-hero"><div><p className="faq-kicker"><BookOpen size={17} /> FAQ & GLOSSARY</p><h1>升學問題，<br /><span>在這裡找到答案。</span></h1><p>把常見疑問和升學名詞整理成容易理解的說明。從會考成績、招生管道到志願選填，找到你現在需要的資訊。</p></div><div className="faq-hero-stats"><span><strong>{questions.length.toString().padStart(2, '0')}</strong>則常見問答</span><span><strong>{glossary.length.toString().padStart(2, '0')}</strong>個升學名詞</span></div></header>
    <div className="faq-search-panel"><label className="faq-search"><Search size={21} /><span className="sr-only">搜尋名詞與問題</span><input type="search" value={keyword} onChange={(event) => { setKeyword(event.target.value); setOpenTerm(null); }} placeholder="搜尋名詞、問題或關鍵字，例如：序位、五專、報到" />{keyword && <button type="button" onClick={() => setKeyword('')} aria-label="清除搜尋"><X size={18} /></button>}</label><p>快速搜尋 {entries.length} 則說明</p></div>
    <div className="faq-tabs" role="group" aria-label="內容類型"><button type="button" aria-pressed={view === 'all'} onClick={() => selectView('all')}>全部內容<span>{entries.length}</span></button><button type="button" aria-pressed={view === 'questions'} onClick={() => selectView('questions')}>常見問答<span>{questions.length}</span></button><button type="button" aria-pressed={view === 'glossary'} onClick={() => selectView('glossary')}>名詞百科<span>{glossary.length}</span></button></div>
    {showGlossary && <div className="faq-category-filter"><span>主題分類</span><div>{['全部', ...categories].map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => selectCategory(item)}>{item}</button>)}</div></div>}
    <div className="faq-result-line"><p role="status">找到 <strong>{resultCount}</strong> 則內容</p>{(keyword || category !== '全部' || view !== 'all') && <button type="button" onClick={clearFilters}>清除所有篩選<X size={14} /></button>}</div>
    {resultCount === 0 ? <div className="faq-empty"><Search size={32} /><h2>找不到相符的內容</h2><p>試試較短的關鍵字，或清除篩選查看全部內容。</p><button type="button" onClick={clearFilters}>查看全部內容<ArrowRight size={16} /></button></div> : <div className="faq-content">
      {showQuestions && visibleQuestions.length > 0 && <section className="faq-section" aria-labelledby="faq-questions-title"><div className="faq-section-heading"><div><p>FREQUENTLY ASKED</p><h2 id="faq-questions-title">常見問答<span>{visibleQuestions.length}</span></h2></div><p>先從大家最常問的問題開始</p></div><div className="faq-entry-list">{visibleQuestions.map((entry, index) => <EntryCard key={entry.term} entry={entry} index={index} open={openTerm === entry.term} onToggle={() => setOpenTerm(openTerm === entry.term ? null : entry.term)} question />)}</div></section>}
      {showGlossary && visibleGlossary.length > 0 && <section className="faq-section" aria-labelledby="faq-glossary-title"><div className="faq-section-heading"><div><p>UNDERSTAND THE TERMS</p><h2 id="faq-glossary-title">名詞百科<span>{visibleGlossary.length}</span></h2></div><p>從基礎概念看懂升學資訊</p></div>{Object.entries(groupedGlossary).map(([group, items]) => <div className="faq-group" key={group}><div className="faq-group-heading"><h3>{group}</h3><span>{items.length} 個名詞</span></div><div className="faq-entry-list">{items.map((entry, index) => <EntryCard key={entry.term} entry={entry} index={index} open={openTerm === entry.term} onToggle={() => setOpenTerm(openTerm === entry.term ? null : entry.term)} />)}</div></div>)}</section>}
    </div>}
    <aside className="faq-notice"><ShieldAlert size={21} /><div><h2>查詢前先知道</h2><p>本頁協助理解名詞與流程；招生資格、計分、比序、名額與時程可能因年度及就學區不同，正式選填請以當年度招生簡章與官方公告為準。</p></div></aside>
  </div></main>;
}

function EntryCard({ entry, index, open, onToggle, question = false }: { entry: Entry; index: number; open: boolean; onToggle: () => void; question?: boolean }) {
  const panelId = `faq-detail-${entry.term.replace(/[^\w\u4e00-\u9fff]/g, '-')}`;
  return <article className={`faq-entry ${open ? 'is-open' : ''}`}><button type="button" aria-expanded={open} aria-controls={panelId} onClick={onToggle}><span className="faq-entry-number">{question ? 'Q' : String(index + 1).padStart(2, '0')}</span><span className="faq-entry-title"><strong>{entry.term}</strong><small>{entry.summary}</small></span><ChevronDown size={19} className="faq-entry-chevron" /></button>{open && <div id={panelId} className="faq-entry-detail"><span>{question ? '回答' : '詳細說明'}</span><p>{entry.detail}</p></div>}</article>;
}
