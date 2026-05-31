import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, Brain, Sparkles, CheckCircle2, ChevronRight, BookOpen, ShieldAlert, Printer } from 'lucide-react';

export const HOLLAND_QUESTIONS = [
  { id: 1, type: 'R', text: '喜歡修理腳踏車、五金或家電用品' },
  { id: 2, type: 'I', text: '喜歡做科學實驗或細心觀察自然現象' },
  { id: 3, type: 'A', text: '喜歡畫畫、設計或創作各種藝術作品' },
  { id: 4, type: 'S', text: '喜歡幫助別人解決困難或傾聽他人心事' },
  { id: 5, type: 'E', text: '喜歡在團隊中擔任領導者或帶動氣氛' },
  { id: 6, type: 'C', text: '喜歡按部就班，遵循明確的規則完成工作' },
  
  { id: 7, type: 'R', text: '喜歡在戶外操作工具、機械或設備' },
  { id: 8, type: 'I', text: '喜歡去解決數學難題或複雜的邏輯問題' },
  { id: 9, type: 'A', text: '喜歡參加音樂會、戲劇表演或看展覽' },
  { id: 10, type: 'S', text: '喜歡主動教導別人、分享並交流新事物' },
  { id: 11, type: 'E', text: '喜歡發表意見，說服別人接受自己的想法' },
  { id: 12, type: 'C', text: '喜歡整理東西或分類資料，讓它們井然有序' },

  { id: 13, type: 'R', text: '喜歡親手組裝模型、家具或電子零件' },
  { id: 14, type: 'I', text: '喜歡閱讀科學、歷史、科技或新知相關文章' },
  { id: 15, type: 'A', text: '喜歡發揮想像力，寫作、攝影或編故事' },
  { id: 16, type: 'S', text: '喜歡參與社團活動、康樂或志工服務' },
  { id: 17, type: 'E', text: '喜歡參加辯論、推銷活動或上台演講分享' },
  { id: 18, type: 'C', text: '喜歡處理數字、報表、紀錄日常或財務帳目' },

  { id: 19, type: 'R', text: '喜歡體力勞動、戶外運動或動手實作的課程' },
  { id: 20, type: 'I', text: '喜歡分析資料數據，並找出其中的邏輯與規律' },
  { id: 21, type: 'A', text: '喜歡獨特、與眾不同的事物，討厭一成不變' },
  { id: 22, type: 'S', text: '充滿親和力，容易與初次見面的人建立良好關係' },
  { id: 23, type: 'E', text: '對於創業、商業策劃或投資有濃厚的興趣' },
  { id: 24, type: 'C', text: '做事細心謹慎，有規劃，不容易粗心犯錯' },

  { id: 25, type: 'R', text: '喜歡研究汽車、飛機等交通工具的構造' },
  { id: 26, type: 'I', text: '對於未知事物充滿好奇，喜歡探究「為什麼」' },
  { id: 27, type: 'A', text: '喜歡透過音樂、舞蹈或表演來表達情感' },
  { id: 28, type: 'S', text: '關心社會弱勢群體，希望能為社會付出貢獻' },
  { id: 29, type: 'E', text: '喜歡競爭，勇於面對挑戰，並追求更高的目標' },
  { id: 30, type: 'C', text: '喜歡穩定、可預期的工作環境與固定的生活作息' }
];

const HOLLAND_TYPES: Record<string, { name: string, color: string, bg: string, border: string, desc: string }> = {
  R: { name: '實用型', color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-300', desc: '做事講求實際，喜歡動手親自操作。' },
  I: { name: '研究型', color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-300', desc: '善於思考分析，喜歡探究事物原理。' },
  A: { name: '藝術型', color: 'text-amber-600', bg: 'bg-amber-100', border: 'border-amber-300', desc: '富有豐富創意，具備美感與想像力。' },
  S: { name: '社會型', color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-300', desc: '熱心服務人群，善於傾聽與教導。' },
  E: { name: '企業型', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-300', desc: '具備領導特質，企圖心強且勇於挑戰。' },
  C: { name: '常規型', color: 'text-slate-600', bg: 'bg-slate-200', border: 'border-slate-300', desc: '重視細節規範，做事非常有條理。' }
};

const VOCATIONAL_HOLLAND_MAP = [
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
  { id: '藝術群', codes: ['A'], icon: '🎭' }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (recommendedGroups: string[]) => void;
  onViewEncyclopedia: () => void;
}

type Step = 'start' | 'testing' | 'result';

const printHollandResults = (topTypes: any[], topGroups: any[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('無法開啟列印視窗，請檢查是否被瀏覽器阻擋。');
    return;
  }
  
  const DateStr = new Date().toLocaleDateString('zh-TW');

  const typesHtml = topTypes.map((t, i) => {
    const tData = HOLLAND_TYPES[t.type as keyof typeof HOLLAND_TYPES];
    return `
      <div style="border: 2px solid #e2e8f0; border-radius: 16px; padding: 20px; margin-bottom: 16px; display: flex; flex-direction: column; background-color: ${i === 0 ? '#f0fdf4' : '#fff'}; border-color: ${i === 0 ? '#bbf7d0' : '#e2e8f0'}; position: relative; overflow: hidden;">
        ${i === 0 ? '<div style="position: absolute; top: 0; right: 0; background: #22c55e; color: white; font-size: 10px; font-weight: bold; padding: 4px 12px; border-bottom-left-radius: 12px;">主要特質</div>' : ''}
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
           <div style="display: flex; align-items: baseline; gap: 8px;">
             <span style="font-size: 32px; font-weight: 900; color: ${i === 0 ? '#16a34a' : '#4f46e5'};">${t.type}</span>
             <span style="font-size: 18px; font-weight: 900; color: #1e293b;">${tData.name}</span>
           </div>
           <div style="background: ${i === 0 ? '#dcfce7' : '#e0e7ff'}; color: ${i === 0 ? '#16a34a' : '#4338ca'}; padding: 6px 16px; border-radius: 20px; font-weight: 900; font-size: 14px;">
              ${t.score} 分
           </div>
        </div>
        <div style="font-size: 14px; color: #475569; margin: 0; font-weight: 600; line-height: 1.6; background: #f8fafc; padding: 12px; border-radius: 8px;">${tData.desc}</div>
      </div>
    `;
  }).join('');

  const groupsHtml = topGroups.map((g, i) => `
      <div style="border: 2px solid ${i < 3 ? '#cbd5e1' : '#f1f5f9'}; border-radius: 16px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; background-color: ${i < 3 ? '#fff' : '#f8fafc'}; box-shadow: ${i < 3 ? '4px 4px 0 0 #f1f5f9' : 'none'};">
         <div style="display: flex; align-items: center; gap: 12px;">
           <div style="width: 32px; height: 32px; border-radius: 8px; background: ${i < 3 ? '#e2e8f0' : '#f1f5f9'}; display: flex; align-items: center; justify-content: center; font-weight: 900; color: #64748b;">${i + 1}</div>
           <span style="font-size: 18px; font-weight: 900; color: #0f172a;">${g.icon} ${g.id}</span>
         </div>
         <div style="text-align: right;">
            <div style="font-size: 24px; font-weight: 900; color: ${i < 3 ? '#4f46e5' : '#64748b'};">${g.matchPercentage}%</div>
            <div style="font-size: 11px; font-weight: bold; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px;">Match Rate</div>
         </div>
      </div>
  `).join('');

  const codeHtml = `
     <div style="display: flex; justify-content: center; align-items: center; gap: 12px; margin-bottom: 24px;">
       ${topTypes.map(t => `<div style="width: 50px; height: 50px; background: #0f172a; color: white; display: flex; justify-content: center; align-items: center; font-size: 28px; font-weight: 900; border-radius: 12px; box-shadow: 4px 4px 0 #cbd5e1;">${t.type}</div>`).join('<div style="font-size: 24px; font-weight: 900; color: #94a3b8;">-</div>')}
     </div>
  `;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>荷倫碼性向分析報告</title>
      <style>
        @page { size: A4; margin: 0; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-print-color-adjust: exact; color: #0f172a; margin: 0; padding: 20mm; background: #fff; }
        * { box-sizing: border-box; }
        
        .report-wrapper {
            max-width: 100%;
            height: calc(100vh - 40mm);
            display: flex;
            flex-direction: column;
            border: 2px solid #e2e8f0;
            border-radius: 24px;
            padding: 40px;
            position: relative;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 4px solid #0f172a;
            padding-bottom: 24px;
            margin-bottom: 32px;
        }

        .header-title {
            margin: 0;
        }

        .header-title h1 {
            font-size: 32px;
            font-weight: 900;
            margin: 0 0 8px 0;
            color: #0f172a;
            letter-spacing: -0.5px;
        }

        .header-title p {
            font-size: 14px;
            font-weight: bold;
            color: #64748b;
            margin: 0;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .header-meta {
            text-align: right;
        }

        .date-badge {
            display: inline-block;
            background: #f8fafc;
            border: 2px solid #cbd5e1;
            padding: 6px 16px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 800;
            color: #475569;
        }

        .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            flex: 1;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
        }

        .section-icon {
            width: 32px;
            height: 32px;
            background: #0f172a;
            color: white;
            border-radius: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
        }

        .section-title {
            font-size: 20px;
            font-weight: 900;
            color: #0f172a;
            margin: 0;
        }

        .footer {
            margin-top: auto;
            border-top: 2px solid #e2e8f0;
            padding-top: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 12px;
            font-weight: bold;
            color: #94a3b8;
        }
        
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-30deg);
            font-size: 120px;
            font-weight: 900;
            color: rgba(241, 245, 249, 0.5);
            pointer-events: none;
            z-index: -1;
            white-space: nowrap;
        }
      </style>
    </head>
    <body>
      <div class="report-wrapper">
        <div class="watermark">HOLLAND CODE</div>
        
        <div class="header">
            <div class="header-title">
                <h1>荷倫碼性向分析報告</h1>
                <p>Holland Occupational Themes Assessment Result</p>
            </div>
            <div class="header-meta">
                <div class="date-badge">測驗日期：${DateStr}</div>
            </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 32px;">
           <div style="font-size: 14px; font-weight: bold; color: #64748b; margin-bottom: 12px; letter-spacing: 2px;">專屬荷倫碼組合</div>
           ${codeHtml}
        </div>
        
        <div class="content-grid">
            <div>
                <div class="section-header">
                    <div class="section-icon">🧠</div>
                    <h2 class="section-title">人格特質分析</h2>
                </div>
                ${typesHtml}
            </div>
            
            <div>
                <div class="section-header">
                    <div class="section-icon">🎯</div>
                    <h2 class="section-title">適合職群推薦</h2>
                </div>
                <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 16px; margin-bottom: 24px;">
                    <p style="margin: 0; font-size: 13px; font-weight: 600; color: #64748b; line-height: 1.6;">
                        系統已根據您的測驗結果，與 15 大技職群別進行精準比對。以下為最符合您特質傾向的推薦發展方向：
                    </p>
                </div>
                ${groupsHtml}
            </div>
        </div>

        <div class="footer">
            <div>本報告由 TW全國會考落點分析系統 生成</div>
            <div>僅供學涯規劃與探索參考 · 嚴禁作為唯一選填依據</div>
        </div>
      </div>

      <script>
         window.onload = () => { setTimeout(() => { window.print(); window.close(); }, 800); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
};

export default function HollandTestModal({ isOpen, onClose, onComplete, onViewEncyclopedia }: Props) {
  const [step, setStep] = useState<Step>('start');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [validationError, setValidationError] = useState<string>('');
  
  // Resets test state
  const resetTest = () => {
    setStep('start');
    setCurrentQIndex(0);
    setAnswers({});
    setStartTime(0);
    setValidationError('');
  };

  const handleClose = () => {
    resetTest();
    onClose();
  };

  const handleStart = () => {
    setStep('testing');
    setStartTime(Date.now());
  };

  const handleAnswer = (score: number) => {
    const newAnswers = { ...answers, [HOLLAND_QUESTIONS[currentQIndex].id]: score };
    setAnswers(newAnswers);

    if (currentQIndex < HOLLAND_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      setStep('result');
    }
  };

  const handleBackQuestion = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(prev => prev - 1);
    }
  };

  const { topTypes, topGroups } = useMemo(() => {
    if (step !== 'result') return { topTypes: [], topGroups: [] };

    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    Object.entries(answers).forEach(([qIdStr, scoreUntyped]) => {
      const qId = parseInt(qIdStr);
      const score = scoreUntyped as number;
      const q = HOLLAND_QUESTIONS.find(x => x.id === qId);
      if (q) {
        scores[q.type as keyof typeof scores] += score;
      }
    });

    // Sort types by score descending
    const sortedTypes = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(entry => ({ type: entry[0], score: entry[1] }));

    const top3 = sortedTypes.slice(0, 3);
    
    // Calculate recommended groups
    // Score logic: 1st=3, 2nd=2, 3rd=1
    const weights: Record<string, number> = {
      [top3[0].type]: 3,
      [top3[1].type]: 2,
      [top3[2].type]: 1
    };

    const groupScores = VOCATIONAL_HOLLAND_MAP.map(group => {
      let score = 0;
      let rawScoreSum = 0;
      let maxScore = group.codes.length * 10;

      group.codes.forEach(c => {
        if (weights[c]) score += weights[c];
        rawScoreSum += scores[c as keyof typeof scores];
      });

      const matchPercentage = Math.round((rawScoreSum / maxScore) * 100);

      return { ...group, score, matchPercentage };
    });

    // filter non zero, sort and get top 4
    const validGroups = groupScores
      .filter(g => g.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.matchPercentage - a.matchPercentage;
      });
    const topGroupsResult = validGroups.slice(0, 4);

    return { topTypes: top3, topGroups: topGroupsResult };
  }, [answers, step]);

  const currentQ = HOLLAND_QUESTIONS[currentQIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
            animate={{ opacity: 1, backdropFilter: 'blur(4px)' }} 
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="absolute inset-0 bg-slate-900/60"
            onClick={handleClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl border-4 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b-4 border-slate-900 flex items-center justify-between bg-indigo-50 z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transform -rotate-3 text-white">
                  <Brain className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">荷倫碼性向測驗</h2>
              </div>
              <button 
                onClick={handleClose} 
                className="w-10 h-10 flex items-center justify-center bg-white border-2 border-slate-900 rounded-xl hover:bg-slate-100 hover:text-rose-500 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 relative">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>

              {step === 'start' && (
                <div className="p-8 md:p-12 text-center flex flex-col items-center">
                  <div className="w-32 h-32 bg-white rounded-full border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-2 border-2 border-dashed border-slate-200 rounded-full animate-[spin_10s_linear_infinite]" />
                    <Brain className="w-16 h-16 text-indigo-600" />
                    <div className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-xs font-black px-2 py-1 rounded-lg border-2 border-slate-900 shadow-sm rotate-12">
                      30題
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">最適合你的技職在哪裡？</h3>
                  <p className="text-slate-600 font-bold mb-8 max-w-sm leading-relaxed">
                    只要花 3 分鐘，透過 30 個簡單的生活情境測試，就能發掘你的關鍵人格特質 (RIASEC)，並推薦你最佳的職業群別！
                  </p>
                  
                  <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 w-full mb-8 text-sm font-bold text-slate-700 flex flex-col gap-3 relative">
                    <div className="flex items-center gap-2 text-amber-600">
                       <ShieldAlert className="w-5 h-5" />
                       <span className="font-black text-amber-900">免責聲明與測驗須知</span>
                    </div>
                    <ul className="text-left list-disc list-inside space-y-1.5 ml-1">
                      <li>本測驗僅為輔助探索職業性向之參考工具，不能完全代表您的未來發展。</li>
                      <li>測驗結果不具任何強制力，建議仍須搭配學校輔導機制與多方實務探索。</li>
                      <li>測驗不計分且結果會即時計算，請依照最真實的直覺作答以獲得準確結果。</li>
                    </ul>
                  </div>

                  <button 
                    onClick={handleStart}
                    className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl border-4 border-slate-900 font-black text-xl hover:bg-indigo-500 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-3"
                  >
                    開始測驗 <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}

              {step === 'testing' && (
                <div className="p-6 md:p-10 flex flex-col h-full relative z-10">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-3">
                      <button 
                        onClick={handleBackQuestion}
                        className={`text-sm font-bold flex items-center gap-1 transition-colors ${currentQIndex > 0 ? 'text-slate-500 hover:text-slate-900' : 'text-transparent pointer-events-none'}`}
                      >
                        <ArrowLeft className="w-4 h-4" /> 上一題
                      </button>
                      <span className="font-black text-indigo-600 font-mono text-lg">{currentQIndex + 1} / {HOLLAND_QUESTIONS.length}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                      <div 
                        className="h-full bg-indigo-500 transition-all duration-300 ease-out"
                        style={{ width: `${((currentQIndex) / HOLLAND_QUESTIONS.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center mb-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.15 }}
                        className="text-center"
                      >
                        <div className="text-4xl mb-6">🤔</div>
                        <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-snug px-4">
                          {currentQ.text}
                        </h3>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto">
                    <button 
                      onClick={() => handleAnswer(0)}
                      className="group flex flex-col items-center justify-center p-4 bg-white border-2 border-slate-200 rounded-2xl hover:border-rose-400 hover:bg-rose-50 hover:shadow-[4px_4px_0px_0px_#fb7185] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none"
                    >
                      <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">😔</span>
                      <span className="font-black text-slate-600 group-hover:text-rose-600">非常不符合</span>
                    </button>
                    <button 
                      onClick={() => handleAnswer(1)}
                      className="group flex flex-col items-center justify-center p-4 bg-white border-2 border-slate-200 rounded-2xl hover:border-amber-400 hover:bg-amber-50 hover:shadow-[4px_4px_0px_0px_#fbbf24] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none"
                    >
                      <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">😐</span>
                      <span className="font-black text-slate-600 group-hover:text-amber-600">有一點符合</span>
                    </button>
                    <button 
                      onClick={() => handleAnswer(2)}
                      className="group flex flex-col items-center justify-center p-4 bg-white border-2 border-slate-200 rounded-2xl hover:border-emerald-400 hover:bg-emerald-50 hover:shadow-[4px_4px_0px_0px_#34d399] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none"
                    >
                      <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🤩</span>
                      <span className="font-black text-slate-600 group-hover:text-emerald-600">非常符合我</span>
                    </button>
                  </div>
                </div>
              )}

              {step === 'result' && (
                <div className="p-6 md:p-8">
                  <div className="text-center mb-8">
                    <div className="inline-block bg-indigo-100 text-indigo-700 font-black px-4 py-1.5 rounded-full mb-4 border-2 border-indigo-200">
                      專屬分析報告
                    </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-2">你的職業性向特質</h3>
                      <p className="text-slate-600 font-bold">根據測驗結果，你的優勢荷倫碼為</p>
                    </div>

                    {/* Top 3 Traits Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                      {topTypes.map((type, index) => {
                        const tData = HOLLAND_TYPES[type.type];
                        return (
                          <div key={type.type} className={`relative bg-white border-2 ${tData.border} rounded-2xl p-4 overflow-hidden shadow-sm`}>
                            <div className={`absolute top-0 right-0 w-16 h-16 ${tData.bg} rounded-bl-[40px] -z-10 opacity-50`}></div>
                            <div className="flex items-center justify-between mb-3">
                              <span className={`text-4xl font-black ${tData.color}`}>{type.type}</span>
                              {index === 0 && <span className="bg-amber-100 text-amber-700 text-xs font-black px-2 py-1 rounded border border-amber-300 shadow-sm">主導特質</span>}
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-1">{tData.name}</h4>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed">{tData.desc}</p>
                          </div>
                        )
                      })}
                    </div>

                  {/* Recommended Groups */}
                  <div className="bg-white rounded-[2rem] p-6 sm:p-8 border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden">
                    <div className="absolute -right-8 -top-8 text-[120px] opacity-[0.03] select-none pointer-events-none">🎯</div>
                      <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl border-2 border-slate-900 -rotate-3">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900">推薦技職群別</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10 mb-6">
                        {topGroups.map((group, index) => (
                          <div key={group.id} className="flex items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border-2 border-slate-200">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">{group.icon}</div>
                              <div>
                                <div className="font-black text-lg text-slate-800 leading-tight mb-1">{group.id}</div>
                                {index === 0 && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">最高契合度</span>}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-black text-2xl text-indigo-600 leading-none mb-1">{group.matchPercentage}%</div>
                              <div className="text-[10px] font-bold text-slate-500">吻合度</div>
                            </div>
                          </div>
                        ))}
                      </div>

                    <div className="pt-6 border-t-2 border-slate-100 flex flex-wrap gap-3">
                       <button 
                         onClick={resetTest}
                         className="flex-1 min-w-[120px] px-4 py-3 bg-white text-slate-700 rounded-xl border-2 border-slate-900 font-bold hover:bg-slate-50 hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none text-center"
                       >
                         再測一次
                       </button>
                       <button
                         onClick={() => printHollandResults(topTypes, topGroups)}
                         className="flex-1 min-w-[120px] px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl border-2 border-slate-900 font-bold hover:bg-indigo-100 hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none text-center flex items-center justify-center gap-2"
                       >
                         列印結果 <Printer className="w-4 h-4" />
                       </button>
                       <button 
                         onClick={() => {
                           const groups = topGroups.map(g => g.id);
                           onComplete(groups);
                           handleClose();
                         }}
                         className="flex-[2] min-w-[200px] px-4 py-3 bg-indigo-600 text-white rounded-xl border-2 border-slate-900 font-bold hover:bg-indigo-500 hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none text-center"
                       >
                         採用推薦群別
                       </button>
                       <button 
                         onClick={onViewEncyclopedia}
                         className="flex-[2] min-w-[200px] px-4 py-3 bg-white text-slate-700 rounded-xl border-2 border-slate-900 font-bold hover:bg-slate-50 hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none text-center flex items-center justify-center gap-2"
                       >
                         去百科看科系 <BookOpen className="w-4 h-4" />
                       </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

