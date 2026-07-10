import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
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

const hollandPrintCopy: Record<HollandType, { name: string; desc: string }> = {
  R: {
    name: '實作型',
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
          <article class="type-card ${index === 0 ? 'primary' : ''}">
            <div class="type-row">
              <div>
                <span class="type-code">${item.type}</span>
                <h3>${copy.name}</h3>
              </div>
              <div class="score">${item.score} / 10</div>
            </div>
            <p>${copy.desc}</p>
          </article>
        `;
      })
      .join('');

    const groupsHtml = results.topGroups
      .map((group, index) => `
        <tr>
          <td class="rank">${index + 1}</td>
          <td>
            <strong>${group.id}</strong>
            <span>${group.codes.join(' / ')}</span>
          </td>
          <td class="match">${group.matchPercentage}%</td>
        </tr>
      `)
      .join('');

    printWindow.document.write(`
      <!doctype html>
      <html lang="zh-Hant">
        <head>
          <meta charset="utf-8" />
          <title>Holland 性向測驗結果</title>
          <style>
            @page { size: A4; margin: 14mm; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              color: #0f172a;
              font-family: "Noto Sans TC", "Microsoft JhengHei", Arial, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .report {
              min-height: 100vh;
              border: 3px solid #0f172a;
              border-radius: 18px;
              padding: 28px;
            }
            header {
              display: flex;
              justify-content: space-between;
              gap: 24px;
              border-bottom: 3px solid #0f172a;
              padding-bottom: 18px;
              margin-bottom: 22px;
            }
            h1 { margin: 0; font-size: 30px; font-weight: 900; }
            .subtitle {
              margin-top: 6px;
              color: #64748b;
              font-size: 13px;
              font-weight: 800;
              letter-spacing: 0.08em;
              text-transform: uppercase;
            }
            .date {
              align-self: flex-start;
              border: 2px solid #cbd5e1;
              border-radius: 12px;
              padding: 8px 12px;
              color: #475569;
              font-size: 13px;
              font-weight: 900;
              white-space: nowrap;
            }
            .code-panel {
              background: #f5f3ff;
              border: 2px solid #8b5cf6;
              border-radius: 18px;
              padding: 22px;
              text-align: center;
              margin-bottom: 22px;
            }
            .label {
              color: #6d28d9;
              font-size: 12px;
              font-weight: 900;
              letter-spacing: 0.14em;
              text-transform: uppercase;
            }
            .code {
              margin-top: 8px;
              font-size: 44px;
              font-weight: 900;
              letter-spacing: 0.06em;
            }
            .grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
            }
            h2 { margin: 0 0 12px; font-size: 20px; font-weight: 900; }
            .type-card {
              border: 2px solid #e2e8f0;
              border-radius: 16px;
              padding: 14px;
              margin-bottom: 10px;
              background: #fff;
            }
            .type-card.primary {
              border-color: #7c3aed;
              background: #f5f3ff;
            }
            .type-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 12px;
            }
            .type-code {
              display: inline-flex;
              width: 42px;
              height: 42px;
              align-items: center;
              justify-content: center;
              border-radius: 12px;
              background: #0f172a;
              color: #fff;
              font-size: 24px;
              font-weight: 900;
            }
            h3 {
              display: inline-block;
              margin: 0 0 0 10px;
              font-size: 18px;
              font-weight: 900;
            }
            .score {
              border-radius: 999px;
              background: #ede9fe;
              color: #6d28d9;
              padding: 5px 10px;
              font-size: 13px;
              font-weight: 900;
              white-space: nowrap;
            }
            p {
              margin: 10px 0 0;
              color: #475569;
              font-size: 13px;
              font-weight: 700;
              line-height: 1.7;
            }
            table { width: 100%; border-collapse: separate; border-spacing: 0 8px; }
            td {
              background: #f8fafc;
              border-top: 2px solid #e2e8f0;
              border-bottom: 2px solid #e2e8f0;
              padding: 12px;
              font-size: 13px;
              font-weight: 800;
            }
            td:first-child {
              border-left: 2px solid #e2e8f0;
              border-radius: 12px 0 0 12px;
            }
            td:last-child {
              border-right: 2px solid #e2e8f0;
              border-radius: 0 12px 12px 0;
            }
            .rank { width: 42px; text-align: center; color: #64748b; font-weight: 900; }
            td span {
              display: block;
              margin-top: 3px;
              color: #64748b;
              font-size: 11px;
              font-weight: 800;
            }
            .match {
              width: 78px;
              text-align: right;
              color: #6d28d9;
              font-size: 18px;
              font-weight: 900;
            }
            .note {
              margin-top: 20px;
              border: 2px dashed #cbd5e1;
              border-radius: 16px;
              background: #f8fafc;
              padding: 14px;
              color: #475569;
              font-size: 12px;
              font-weight: 700;
              line-height: 1.7;
            }
            footer {
              margin-top: 18px;
              border-top: 2px solid #e2e8f0;
              padding-top: 12px;
              color: #94a3b8;
              font-size: 11px;
              font-weight: 800;
              display: flex;
              justify-content: space-between;
              gap: 12px;
            }
          </style>
        </head>
        <body>
          <main class="report">
            <header>
              <div>
                <h1>Holland 性向測驗結果</h1>
                <div class="subtitle">Organized Result Report</div>
              </div>
              <div class="date">測驗日期：${reportDate}</div>
            </header>

            <section class="code-panel">
              <div class="label">你的 Holland Code</div>
              <div class="code">${hollandCode}</div>
            </section>

            <section class="grid">
              <div>
                <h2>前三項性向整理</h2>
                ${typesHtml}
              </div>
              <div>
                <h2>推薦技職群別</h2>
                <table>
                  <tbody>${groupsHtml}</tbody>
                </table>
                <div class="note">
                  這份結果用來輔助探索興趣與選校方向，不代表唯一適合的科系。建議搭配成績、學習經驗、家庭討論與學校輔導資源一起判斷。
                </div>
              </div>
            </section>

            <footer>
              <span>TW 全國會考落點分析引擎</span>
              <span>列印內容已排除題目與作答明細，只保留整理後結果。</span>
            </footer>
          </main>
          <script>
            window.onload = () => setTimeout(() => { window.print(); window.close(); }, 400);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-purple-50">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <a href={withBasePath('/')} className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <ArrowLeft className="h-4 w-4" />
            返回首頁
          </a>

          <div className="grid gap-8 py-10 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <div className="mb-5 inline-flex items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 bg-purple-100">
                  <Brain className="h-6 w-6 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">RIASEC Assessment</p>
                  <p className="text-sm font-black text-slate-700">30 題 · 約 3 分鐘</p>
                </div>
              </div>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">荷倫碼性向測驗</h1>
              <p className="mt-5 max-w-4xl text-base font-bold leading-8 text-slate-700 sm:text-lg">
                透過 RIASEC 六大興趣類型，快速整理你的學習偏好、職涯傾向與可能適合的高職群科。完成作答後，按下「分析結果」才會顯示分析。
              </p>
            </div>

            <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-slate-500">作答進度</p>
                  <p className="mt-1 text-3xl font-black text-slate-900">{answeredCount}/{questions.length}</p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-slate-900 bg-purple-100 text-xl font-black text-purple-700">
                  {Math.round((answeredCount / questions.length) * 100)}%
                </div>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                <div className="h-full rounded-full bg-purple-600 transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
              </div>
              {!started && (
                <button onClick={startTest} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-purple-600 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                  開始測驗
                  <Sparkles className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
        <aside className={pageNavigationAsideClassName}>
          <div className="rounded-2xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-500">
              <FileText className="h-4 w-4" />
              頁面導覽
            </div>
            <div className="space-y-2">
              {(Object.keys(hollandTypes) as HollandType[]).map((type) => {
                const data = hollandTypes[type];
                return (
                  <div key={type} className={`rounded-xl border-2 ${data.border} ${data.bg} px-3 py-2`}>
                    <div className={`text-sm font-black ${data.color}`}>{type} {data.name}</div>
                    <p className="mt-1 text-xs font-bold leading-5 text-slate-600">{data.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          {!started ? (
            <div className="rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-8">
              <h2 className="text-2xl font-black tracking-tight">作答方式</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {answerOptions.map((option) => (
                  <div key={option.score} className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
                    <div className="text-lg font-black text-slate-900">{option.label}</div>
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{option.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div id="holland-questions" className="scroll-mt-6 space-y-4">
              {questions.map((question, index) => {
                const selectedScore = answers[question.id];
                return (
                  <article id={`holland-question-${question.id}`} key={question.id} className="scroll-mt-6 rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="rounded-lg border-2 border-slate-900 bg-slate-900 px-2 py-1 text-xs font-black text-white">{String(index + 1).padStart(2, '0')}</span>
                          <span className={`rounded-lg border px-2 py-1 text-xs font-black ${hollandTypes[question.type].border} ${hollandTypes[question.type].bg} ${hollandTypes[question.type].color}`}>
                            {question.type} {hollandTypes[question.type].name}
                          </span>
                        </div>
                        <h2 className="text-lg font-black leading-7 text-slate-900 sm:text-xl">{question.text}</h2>
                      </div>

                      <div className="grid shrink-0 grid-cols-3 gap-2 lg:w-[360px]">
                        {answerOptions.map((option) => {
                          const active = selectedScore === option.score;
                          return (
                            <button
                              key={option.score}
                              onClick={() => setAnswer(question.id, option.score)}
                              className={`flex min-h-[64px] flex-col items-center justify-center rounded-xl border-2 px-2 py-2 text-center text-xs font-black transition-all ${active ? 'border-slate-900 bg-purple-600 text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-900 hover:bg-white'}`}
                            >
                              {active && <Check className="mb-1 h-4 w-4" />}
                              {option.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {started && (
            <section id="holland-actions" className="scroll-mt-6 rounded-2xl border-4 border-slate-900 bg-amber-300 p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-black">測驗結果</h2>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {isComplete ? '已完成全部題目。按下分析結果後，系統會顯示你的荷倫碼與推薦職群。' : '完成全部題目後，才可以進行分析。'}
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <button onClick={analyzeResults} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-purple-600 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                      <Sparkles className="h-4 w-4" />
                      分析結果
                    </button>
                  <button onClick={reset} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                    <RotateCcw className="h-4 w-4" />
                    重新作答
                  </button>
                </div>
              </div>
            </section>
          )}

          {isComplete && showResults && (
            <section id="holland-results" className="scroll-mt-6 space-y-5">
              <div className="rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-8">
                <div className="flex flex-col gap-4 border-b-2 border-dashed border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-black uppercase tracking-widest text-purple-600">Your Holland Code</div>
                    <h2 className="mt-2 text-3xl font-black tracking-tight">{results.topTypes.map((item) => item.type).join(' - ')}</h2>
                  </div>
                  <button onClick={printOrganizedResults} className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-slate-900 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(251,191,36,1)]">
                    <Printer className="h-4 w-4" />
                    列印結果
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {results.topTypes.map((item, index) => {
                    const data = hollandTypes[item.type];
                    return (
                      <div key={item.type} className={`rounded-2xl border-2 ${data.border} ${data.bg} p-5`}>
                        <div className="flex items-center justify-between gap-3">
                          <div className={`text-5xl font-black ${data.color}`}>{item.type}</div>
                          {index === 0 && <span className="rounded-lg border border-amber-300 bg-amber-100 px-2 py-1 text-xs font-black text-amber-700">主要特質</span>}
                        </div>
                        <h3 className="mt-3 text-xl font-black text-slate-900">{data.name}</h3>
                        <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{data.desc}</p>
                        <div className="mt-4 text-sm font-black text-slate-500">分數：{item.score} / 10</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-slate-900 bg-emerald-100">
                    <Sparkles className="h-6 w-6 text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">推薦探索職群</h2>
                    <p className="mt-1 text-sm font-bold text-slate-500">依你的前三項荷倫碼計算契合度，建議從高分群科開始了解。</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {results.topGroups.map((group, index) => (
                    <div key={group.id} className="flex items-center justify-between gap-4 rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{group.icon}</div>
                        <div>
                          <div className="text-lg font-black text-slate-900">{group.id}</div>
                          <div className="mt-1 text-xs font-bold text-slate-500">關聯類型：{group.codes.join(' / ')}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-purple-700">{group.matchPercentage}%</div>
                        {index === 0 && <div className="text-[10px] font-black text-emerald-600">最高契合</div>}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t-2 border-dashed border-slate-200 pt-6 sm:flex-row">
                  <a href={applyFilterHref()} className="inline-flex flex-1 items-center justify-center rounded-xl border-2 border-slate-900 bg-white px-4 py-3 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">回首頁套用篩選</a>
                  <a href={withBasePath('/vocational-encyclopedia')} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-purple-600 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="關閉未填寫題號提示"
            onClick={() => setShowMissingModal(false)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-lg rounded-2xl border-4 border-slate-900 bg-white p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-amber-100">
                <FileText className="h-6 w-6 text-amber-700" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900">還有題目未填寫</h2>
                <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                  請先完成下列題號，再按一次「分析結果」。
                </p>
              </div>
            </div>

            <div className="mt-5 max-h-56 overflow-y-auto rounded-2xl border-2 border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap gap-2">
                {missingQuestionNumbers.map((number) => (
                  <span
                    key={number}
                    className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg border-2 border-slate-900 bg-white px-2 text-sm font-black text-purple-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
                  >
                    {number}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowMissingModal(false)}
              className="mt-5 w-full rounded-xl border-2 border-slate-900 bg-purple-600 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
            >
              繼續填答
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
