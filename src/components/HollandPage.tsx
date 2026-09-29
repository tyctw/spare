import PageBreadcrumb from './PageBreadcrumb';
import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  FileText,
  Printer,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';
import { pageNavigationAsideClassName } from './PageNavigation';
import './holland-page.css';
import hollandPrintStyles from './holland-print.css?inline';

type HollandType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

type Question = {
  id: number;
  type: HollandType;
  text: string;
};

const questions: Question[] = [
  { id: 1, type: 'R', text: '我喜歡動手操作工具、機械、設備，或把東西修好。' },
  { id: 2, type: 'I', text: '我喜歡找出問題背後的原因，並用資料或邏輯推理。' },
  { id: 3, type: 'A', text: '我喜歡用設計、文字、音樂、影像或表演表達想法。' },
  { id: 4, type: 'S', text: '我喜歡協助別人、照顧他人，或讓團隊氣氛變好。' },
  { id: 5, type: 'E', text: '我喜歡帶領團隊、說服他人，或主動推動一件事完成。' },
  { id: 6, type: 'C', text: '我喜歡把資料、流程、表格或規則整理得清楚有秩序。' },
  { id: 7, type: 'R', text: '比起長時間討論，我更喜歡實際做做看、試著完成作品。' },
  { id: 8, type: 'I', text: '遇到未知問題時，我會想查資料、做比較，慢慢找答案。' },
  { id: 9, type: 'A', text: '我常會注意顏色、造型、排版、故事或作品的風格。' },
  { id: 10, type: 'S', text: '朋友遇到困難時，我通常願意聽他說，並一起想辦法。' },
  { id: 11, type: 'E', text: '我不排斥站出來分配工作、主持活動或向別人介紹想法。' },
  { id: 12, type: 'C', text: '我做事時會希望步驟明確，並能照著計畫逐步完成。' },
  { id: 13, type: 'R', text: '我對交通工具、建築、電機、農業、餐飲或實作技術感興趣。' },
  { id: 14, type: 'I', text: '我對科學實驗、程式、醫藥、檢驗、研究或分析工作感興趣。' },
  { id: 15, type: 'A', text: '我對設計、影像、表演、音樂、文創或美感相關工作感興趣。' },
  { id: 16, type: 'S', text: '我對教育、照護、服務、諮詢、社福或與人互動的工作感興趣。' },
  { id: 17, type: 'E', text: '我對企劃、銷售、管理、創業、活動或商業溝通感興趣。' },
  { id: 18, type: 'C', text: '我對會計、行政、資料處理、金融、倉儲或規範流程感興趣。' },
  { id: 19, type: 'R', text: '我能接受需要體力、耐心或重複練習的技術訓練。' },
  { id: 20, type: 'I', text: '我能接受花時間觀察細節、分析數據或驗證假設。' },
  { id: 21, type: 'A', text: '我能接受作品被反覆修改，也願意嘗試不同表現方式。' },
  { id: 22, type: 'S', text: '我能接受與不同個性的人合作，並理解別人的感受。' },
  { id: 23, type: 'E', text: '我能接受面對競爭、壓力與不確定性，並嘗試爭取成果。' },
  { id: 24, type: 'C', text: '我能接受檢查細節、遵守標準，並維持穩定準確。' },
  { id: 25, type: 'R', text: '看到實體成果完成時，我會特別有成就感。' },
  { id: 26, type: 'I', text: '理解一個原理或解開一個難題時，我會特別有成就感。' },
  { id: 27, type: 'A', text: '完成有個人風格的作品時，我會特別有成就感。' },
  { id: 28, type: 'S', text: '看到自己幫助別人改善狀況時，我會特別有成就感。' },
  { id: 29, type: 'E', text: '成功推動活動、交易或團隊目標時，我會特別有成就感。' },
  { id: 30, type: 'C', text: '把複雜事情整理得井然有序時，我會特別有成就感。' },
];

const hollandTypes: Record<HollandType, { name: string; desc: string; color: string; bg: string; border: string }> = {
  R: { name: '實用型', desc: '偏好動手操作、機械工具、戶外或具體成果，適合重視技術、實作與解決實際問題的學習環境。', color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-300' },
  I: { name: '研究型', desc: '偏好觀察、分析、實驗與推理，適合需要探究原理、處理資料或解決複雜問題的領域。', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300' },
  A: { name: '藝術型', desc: '偏好創作、設計、表達與美感，適合需要想像力、風格判斷與作品呈現的學習方向。', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-300' },
  S: { name: '社會型', desc: '偏好互動、照顧、教導與支持他人，適合重視溝通、同理與服務的領域。', color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-300' },
  E: { name: '企業型', desc: '偏好領導、說服、企劃與目標達成，適合商業、管理、活動與需要主動推進的環境。', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-300' },
  C: { name: '常規型', desc: '偏好秩序、資料、流程與標準，適合行政、財務、資訊整理與重視準確度的工作。', color: 'text-slate-700', bg: 'bg-slate-100', border: 'border-slate-300' },
};

const vocationalGroups = [
  { id: '機械群', codes: ['R', 'I'], icon: '⚙️' },
  { id: '動力機械群', codes: ['R', 'I'], icon: '🚗' },
  { id: '電機與電子群', codes: ['R', 'I', 'C'], icon: '⚡' },
  { id: '化工群', codes: ['I', 'R'], icon: '🧪' },
  { id: '土木與建築群', codes: ['R', 'I', 'A'], icon: '🏗️' },
  { id: '商業與管理群', codes: ['E', 'C'], icon: '💼' },
  { id: '外語群', codes: ['S', 'A', 'E'], icon: '🌍' },
  { id: '設計群', codes: ['A', 'R'], icon: '🎨' },
  { id: '農業群', codes: ['R', 'I'], icon: '🌱' },
  { id: '食品群', codes: ['R', 'I', 'A'], icon: '🍔' },
  { id: '家政群', codes: ['S', 'A', 'R'], icon: '🏠' },
  { id: '餐旅群', codes: ['S', 'E'], icon: '🏨' },
  { id: '水產群', codes: ['R', 'I'], icon: '🐟' },
  { id: '海事群', codes: ['R', 'E', 'C'], icon: '🚢' },
  { id: '藝術群', codes: ['A'], icon: '🎭' },
] satisfies Array<{ id: string; codes: HollandType[]; icon: string }>;

const answerOptions = [
  { score: 0, label: '不太符合', desc: '很少這樣想或做' },
  { score: 1, label: '有一點符合', desc: '偶爾會這樣' },
  { score: 2, label: '非常符合', desc: '很像平常的我' },
];

const questionGroups = Array.from({ length: 5 }, (_, index) => questions.slice(index * 6, index * 6 + 6));

const hollandPrintCopy: Record<HollandType, { name: string; desc: string }> = {
  R: {
    name: '實用型',
    desc: '偏好動手操作、工具設備、機械結構、戶外或實體任務，適合在明確目標中透過實作解決問題。',
  },
  I: {
    name: '研究型',
    desc: '偏好觀察、分析、推理、實驗與資料判讀，適合需要探究原理、找出規律或解決複雜問題的方向。',
  },
  A: {
    name: '藝術型',
    desc: '偏好創作、設計、表達與美感判斷，適合需要想像力、作品呈現與個人風格的學習或工作環境。',
  },
  S: {
    name: '社會型',
    desc: '偏好與人互動、協助、教學、照顧與溝通，適合重視服務、人際支持與團隊合作的方向。',
  },
  E: {
    name: '企業型',
    desc: '偏好說服、領導、企劃、銷售與目標推進，適合需要主動表達、組織資源與帶動成果的情境。',
  },
  C: {
    name: '常規型',
    desc: '偏好有規則、流程、資料整理、行政與精確執行的工作，適合重視秩序、細節與穩定性的方向。',
  },
};

export default function HollandPage() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [showMissingModal, setShowMissingModal] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === questions.length;
  const missingQuestionNumbers = questions
    .filter((question) => answers[question.id] === undefined)
    .map((question) => question.id);
  const activeGroupIndex = Math.min(4, Math.floor(((missingQuestionNumbers[0] ?? 30) - 1) / 6));

  const results = useMemo(() => {
    const scores: Record<HollandType, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    questions.forEach((question) => {
      scores[question.type] += answers[question.id] ?? 0;
    });

    const topTypes = (Object.entries(scores) as Array<[HollandType, number]>)
      .sort((a, b) => b[1] - a[1])
      .map(([type, score]) => ({ type, score }))
      .slice(0, 3);

    const weights = topTypes.reduce<Record<string, number>>((acc, item, index) => {
      acc[item.type] = 3 - index;
      return acc;
    }, {});

    const topGroups = vocationalGroups
      .map((group) => {
        const priorityScore = group.codes.reduce((sum, code) => sum + (weights[code] || 0), 0);
        const rawScore = group.codes.reduce((sum, code) => sum + scores[code], 0);
        const matchPercentage = Math.round((rawScore / (group.codes.length * 10)) * 100);
        return { ...group, priorityScore, matchPercentage };
      })
      .filter((group) => group.priorityScore > 0)
      .sort((a, b) => (b.priorityScore === a.priorityScore ? b.matchPercentage - a.matchPercentage : b.priorityScore - a.priorityScore))
      .slice(0, 6);

    return { topTypes, topGroups };
  }, [answers]);

  const scrollToElement = (id: string) => {
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const startTest = () => {
    setStarted(true);
    setShowResults(false);
    setShowMissingModal(false);
    scrollToElement('holland-questions');
  };

  const setAnswer = (questionId: number, score: number) => {
    setAnswers((current) => ({ ...current, [questionId]: score }));
    setShowResults(false);

    const currentIndex = questions.findIndex((question) => question.id === questionId);
    const nextQuestion = questions[currentIndex + 1];
    scrollToElement(nextQuestion ? `holland-question-${nextQuestion.id}` : 'holland-actions');
  };

  const reset = () => {
    setAnswers({});
    setStarted(false);
    setShowResults(false);
    setShowMissingModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const analyzeResults = () => {
    if (!isComplete) {
      setShowMissingModal(true);
      return;
    }
    setShowMissingModal(false);
    setShowResults(true);
    window.setTimeout(() => {
      document.getElementById('holland-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const jumpToQuestion = (questionNumber: number) => {
    setShowMissingModal(false);
    window.setTimeout(() => {
      const target = document.getElementById(`holland-question-${questionNumber}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target?.focus({ preventScroll: true });
    }, 80);
  };

  const applyFilterHref = () => {
    const params = new URLSearchParams();
    params.set('hollandGroups', results.topGroups.map((group) => group.id).join(','));
    return `${withBasePath('/')}?${params.toString()}`;
  };

  const printOrganizedResults = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('無法開啟列印視窗，請允許瀏覽器彈出視窗後再試一次。');
      return;
    }

    const reportDate = new Date().toLocaleDateString('zh-TW');
    const hollandCode = results.topTypes.map((item) => item.type).join(' - ');
    const typesHtml = results.topTypes
      .map((item, index) => {
        const copy = hollandPrintCopy[item.type];
        return `
          <article class="type-card">
            <div class="type-card-top"><span class="type-rank">第 ${index + 1} 特質</span><strong>${item.score}<small> / 10</small></strong></div>
            <div class="type-title"><span class="type-code">${item.type}</span><h3>${copy.name}</h3></div>
            <p>${copy.desc}</p>
          </article>
        `;
      })
      .join('');

    const groupsHtml = results.topGroups
      .map((group, index) => `
        <article class="group-card">
          <span class="group-rank">${String(index + 1).padStart(2, '0')}</span>
          <div class="group-main"><h3>${group.id}</h3><p>關聯類型 ${group.codes.join(' / ')}</p></div>
          <div class="group-match"><strong>${group.matchPercentage}%</strong><span>興趣關聯</span></div>
        </article>
      `)
      .join('');

    printWindow.document.write(`
      <!doctype html>
      <html lang="zh-Hant">
        <head>
          <meta charset="utf-8" />
          <title>荷倫碼性向測驗｜興趣探索報告</title>
          <style>${hollandPrintStyles}</style>
        </head>
        <body>
          <main class="report">
            <header>
              <div class="report-heading"><span class="eyebrow">興趣探索報告</span><h1>荷倫碼性向測驗結果</h1><p>從興趣特質出發，整理值得進一步認識的學習方向。</p></div>
              <div class="date"><span>測驗日期</span><strong>${reportDate}</strong></div>
            </header>

            <section class="code-panel" aria-label="荷倫碼摘要">
              <div><span class="eyebrow">你的前三項興趣特質</span><div class="code">${hollandCode}</div></div>
              <p>依作答分數排序；分數相同時依題目類型順序排列。</p>
            </section>

            <section class="report-section">
              <div class="section-heading"><div><span class="section-index">01</span><h2>前三項興趣特質</h2></div><p>看看你較偏好的活動與學習方式</p></div>
              <div class="types-grid">${typesHtml}</div>
            </section>

            <section class="report-section groups-section">
              <div class="section-heading"><div><span class="section-index">02</span><h2>優先探索的技職群別</h2></div><p>依興趣代碼整理的前六項群別</p></div>
              <div class="groups-grid">${groupsHtml}</div>
            </section>

            <section class="note">
              <strong>如何使用這份結果</strong>
              <p>先查看感興趣群別的課程內容與實作方式，再搭配成績、學習經驗與學校輔導資源討論。興趣關聯百分比只是題目分數的對照，並非錄取機率或適合程度的保證。</p>
            </section>

            <footer>
              <span>TW 全國會考落點分析引擎</span>
              <span>本報告僅供升學探索參考 · 第 1 頁</span>
            </footer>
          </main>
        </body>
      </html>
    `);
    printWindow.document.close();
    window.setTimeout(() => {
      if (printWindow.closed) return;
      printWindow.focus();
      printWindow.print();
    }, 400);
  };

  return (
    <main className={`holland-page min-h-screen text-slate-900 ${started ? 'is-started' : 'is-intro'}`}>
      <section className="holland-hero">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <PageBreadcrumb title="荷倫碼性向測驗" />

          <div className="holland-hero-grid grid gap-8 py-9 lg:grid-cols-[minmax(0,1fr)_310px] lg:items-center">
            <div>
              <p className="holland-eyebrow"><Brain className="h-4 w-4" />RIASEC 興趣探索<span>30 題・約 3 分鐘</span></p>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">荷倫碼性向測驗</h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-700 sm:text-lg">
                從你喜歡的活動與做事方式出發，認識六種興趣特質，找到值得進一步探索的技職群科。
              </p>
              {!started && <button type="button" onClick={startTest} className="holland-primary mt-6 inline-flex items-center justify-center gap-2 px-6 py-3.5 font-black">開始測驗<ArrowRight className="h-4 w-4" /></button>}
              {started && <a href="#holland-questions" className="holland-text-link mt-5 inline-flex items-center gap-2 font-bold">前往作答題目<ArrowRight className="h-4 w-4" /></a>}
            </div>

            <div className="holland-progress-card rounded-2xl bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-slate-500">作答進度</p>
                  <p className="mt-1 text-3xl font-black text-slate-900">{answeredCount}<span className="text-lg text-slate-400"> / {questions.length}</span></p>
                </div>
                <div className="holland-progress-percent flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-black text-purple-700">
                  {Math.round((answeredCount / questions.length) * 100)}%
                </div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={answeredCount} aria-valuemin={0} aria-valuemax={questions.length} aria-label="作答進度">
                <div className="h-full rounded-full bg-purple-600 transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
              </div>
              <p className="mt-3 text-xs font-bold text-slate-500">{isComplete ? '題目已完成，可以查看分析結果。' : started ? '依直覺選擇，答案可以隨時修改。' : '開始後會顯示所有題目，依直覺作答即可。'}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="holland-layout mx-auto grid max-w-7xl gap-7 px-4 py-9 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <aside className={`holland-aside ${started ? pageNavigationAsideClassName : ''}`}>
          <div className="holland-aside-card rounded-2xl bg-white p-4">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-700"><FileText className="h-4 w-4 text-purple-700" />{started ? '題組導覽' : '認識六種興趣類型'}</h2>
            {started ? <>
              <p className="mb-3 text-xs font-bold leading-5 text-slate-500">每組 6 題。完成後可回頭修改答案。</p>
              <nav aria-label="測驗題組" className="holland-group-nav">
                {questionGroups.map((group, index) => <a key={index} href={`#holland-question-${group[0].id}`} aria-current={activeGroupIndex === index ? 'step' : undefined}><span>第 {index + 1} 組</span><small>{String(group[0].id).padStart(2, '0')}–{String(group[5].id).padStart(2, '0')}</small></a>)}
              </nav>
              <div className="holland-aside-tip mt-4 text-xs leading-5 text-slate-600">{isComplete ? '全部題目已完成，請前往查看結果。' : `還有 ${questions.length - answeredCount} 題未完成。`}</div>
            </> : <div className="holland-type-list">
              {(Object.keys(hollandTypes) as HollandType[]).map((type) => {
                const data = hollandTypes[type];
                return (
                  <div key={type} className="holland-type-card" data-type={type}>
                    <div className="holland-type-letter">{type}</div><div><h3>{data.name}</h3><p>{data.desc}</p></div>
                  </div>
                );
              })}
            </div>}
          </div>
        </aside>

        <div className="holland-content space-y-6">
          {!started ? (
            <div className="holland-intro-card rounded-2xl bg-white p-6 sm:p-8">
              <p className="holland-section-kicker">開始之前</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">依直覺回答，沒有標準答案</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">每題選一個最接近自己的程度。完成 30 題後，才能查看興趣類型與推薦探索職群。</p>
              <div className="holland-answer-guide mt-6 grid gap-3 md:grid-cols-3">
                {answerOptions.map((option) => (
                  <div key={option.score} className="rounded-2xl p-4">
                    <span className="holland-answer-guide-score">{option.score + 1}</span>
                    <div className="mt-3 text-lg font-black text-slate-900">{option.label}</div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{option.desc}</p>
                  </div>
                ))}
              </div>
              <button type="button" onClick={startTest} className="holland-primary mt-6 inline-flex items-center justify-center gap-2 px-5 py-3 font-black">開始作答<ArrowRight className="h-4 w-4" /></button>
            </div>
          ) : (
            <div id="holland-questions" className="holland-question-list scroll-mt-6 space-y-6">
              <div className="holland-question-intro"><div><p className="holland-section-kicker">測驗進行中</p><h2 className="mt-1 text-2xl font-black">選出最符合你的答案</h2></div><p>點選答案後會移到下一題；也可以用左側題組導覽回頭調整。</p></div>
              {questionGroups.map((group, groupIndex) => (
                <section className="holland-question-group" key={groupIndex} aria-label={`第 ${groupIndex + 1} 組題目`}>
                  <div className="holland-group-heading"><div><span>第 {groupIndex + 1} 組・共 5 組</span><h2>題目 {String(group[0].id).padStart(2, '0')}–{String(group[5].id).padStart(2, '0')}</h2></div><strong>已答 {group.filter((question) => answers[question.id] !== undefined).length} / 6</strong></div>
                  <div className="holland-group-questions">
                    {group.map((question) => {
                      const selectedScore = answers[question.id];
                      return <article id={`holland-question-${question.id}`} key={question.id} tabIndex={-1} className="holland-question scroll-mt-6 outline-none">
                        <div className="holland-question-heading"><span className="holland-question-number">{String(question.id).padStart(2, '0')}</span><span className="holland-question-type" data-type={question.type}>{question.type}・{hollandTypes[question.type].name}</span></div>
                        <h3 className="mt-3 text-lg font-black leading-7 text-slate-900 sm:text-xl">{question.text}</h3>
                        <div className="holland-answer-options mt-4 grid grid-cols-3 gap-2" role="group" aria-label={`第 ${question.id} 題答案`}>
                          {answerOptions.map((option) => {
                            const active = selectedScore === option.score;
                            return <button type="button" key={option.score} onClick={() => setAnswer(question.id, option.score)} aria-pressed={active} className="holland-answer-option flex min-h-12 items-center justify-center gap-1 rounded-xl px-2 py-2 text-center text-xs font-bold sm:text-sm">{active && <Check className="h-4 w-4 shrink-0" />}{option.label}</button>;
                          })}
                        </div>
                      </article>;
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}

          {started && (
            <section id="holland-actions" className="holland-actions scroll-mt-6 rounded-2xl p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="holland-section-kicker">完成作答</p>
                  <h2 className="mt-1 text-xl font-black">查看你的興趣輪廓</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {isComplete ? '30 題已完成，可以查看荷倫碼與建議探索的職群。' : `還有 ${questions.length - answeredCount} 題未完成，按下分析結果可快速找到漏答題目。`}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={analyzeResults} className="holland-primary inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-black">
                      <Sparkles className="h-4 w-4" />
                      分析結果
                    </button>
                  <button type="button" onClick={reset} className="holland-secondary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-black">
                    <RotateCcw className="h-4 w-4" />
                    重新作答
                  </button>
                </div>
              </div>
            </section>
          )}

          {isComplete && showResults && (
            <section id="holland-results" className="holland-results scroll-mt-6 space-y-5">
              <div className="holland-result-panel rounded-2xl bg-white p-6 sm:p-8">
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="holland-section-kicker">你的測驗結果</div>
                    <h2 className="mt-2 text-3xl font-black tracking-tight">荷倫碼 {results.topTypes.map((item) => item.type).join('・')}</h2>
                    <p className="mt-2 text-sm text-slate-600">前三項興趣特質，幫你整理適合深入了解的學習方向。</p>
                  </div>
                  <button type="button" onClick={printOrganizedResults} className="holland-secondary inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-black">
                    <Printer className="h-4 w-4" />
                    列印結果
                  </button>
                </div>

                <div className="holland-result-types mt-6 grid gap-4 md:grid-cols-3">
                  {results.topTypes.map((item, index) => {
                    const data = hollandTypes[item.type];
                    return (
                      <div key={item.type} className="holland-result-type rounded-2xl p-5" data-type={item.type}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="holland-result-letter text-5xl font-black">{item.type}</div>
                          <span className="holland-rank">{index === 0 ? '主要特質' : `第 ${index + 1} 特質`}</span>
                        </div>
                        <h3 className="mt-3 text-xl font-black text-slate-900">{data.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{data.desc}</p>
                        <div className="holland-result-score mt-4"><span>興趣分數</span><strong>{item.score} <small>/ 10</small></strong></div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="holland-result-panel rounded-2xl bg-white p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="holland-section-icon flex h-11 w-11 items-center justify-center rounded-xl"><Sparkles className="h-5 w-5" /></div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">推薦探索職群</h2>
                    <p className="mt-1 text-sm text-slate-600">依前三項興趣特質整理，點選職群可查看學習內容與科別。</p>
                  </div>
                </div>

                <div className="holland-group-results mt-6 grid gap-3 md:grid-cols-2">
                  {results.topGroups.map((group, index) => (
                    <a
                      key={group.id}
                      href={`${withBasePath('/vocational-encyclopedia')}?group=${encodeURIComponent(group.id)}`}
                      aria-label={`查看${group.id}的職群科系百科`}
                      className="holland-group-result group flex items-center justify-between gap-4 rounded-2xl p-4 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{group.icon}</div>
                        <div>
                          <div className="text-lg font-black text-slate-900">{group.id}</div>
                          <div className="mt-1 text-xs text-slate-500">關聯類型：{group.codes.join(' / ')}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-purple-700">{group.matchPercentage}%</div>
                        <div className="text-[10px] font-bold text-slate-500">{index === 0 ? '最高關聯' : '興趣關聯'}</div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-purple-600" />
                    </a>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-5 text-slate-500">百分比依本次回答換算，僅供探索方向參考，並非正式職涯診斷。</p>

                <div className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">
                  <a href={applyFilterHref()} className="holland-secondary inline-flex flex-1 items-center justify-center px-4 py-3 text-sm font-black">回首頁套用篩選</a>
                  <a href={withBasePath('/vocational-encyclopedia')} className="holland-primary inline-flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-black">
                    <BookOpen className="h-4 w-4" />
                    查看職群百科
                  </a>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>

      {showMissingModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" role="presentation">
          <button
            type="button"
            aria-label="關閉未填寫題號提示"
            onClick={() => setShowMissingModal(false)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          <div role="dialog" aria-modal="true" aria-labelledby="holland-missing-title" className="holland-missing-dialog relative w-full max-w-lg rounded-2xl bg-white p-6">
            <div className="flex items-start gap-3">
              <div className="holland-missing-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <FileText className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <h2 id="holland-missing-title" className="text-2xl font-black text-slate-900">還有題目未填寫</h2>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                  請先完成下列題號，再按一次「分析結果」。
                </p>
              </div>
            </div>

            <div className="holland-missing-list mt-5 max-h-56 overflow-y-auto rounded-2xl bg-slate-50 p-4">
              <div className="flex flex-wrap gap-2">
                {missingQuestionNumbers.map((number) => (
                  <button
                    type="button"
                    key={number}
                    onClick={() => jumpToQuestion(number)}
                    aria-label={`跳到第 ${number} 題`}
                    className="holland-missing-number inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-white px-2 text-sm font-black text-purple-700 transition-all hover:bg-purple-50"
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowMissingModal(false)}
              className="holland-primary mt-5 w-full px-4 py-3 text-sm font-black"
            >
              繼續填答
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
