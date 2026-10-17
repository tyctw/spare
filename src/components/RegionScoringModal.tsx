import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calculator, MapPin, BookOpen, ArrowUpRight, Info } from 'lucide-react';
import { ALL_REGIONS } from './RegionModal';
import { withBasePath } from '../lib/routes';
import './region-scoring-modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedRegion: string;
}

export const REGION_SCORING_DATA: Record<string, {
  total: string;
  items: { label: string; score: string; desc: string }[];
  examDetail?: { level: string; score: string }[];
  note?: string;
}> = {
  taipei: {
    total: '108',
    items: [
      { label: '志願序', score: '36', desc: '第1-5志願36分，第6-10志願35分，依序遞減至32分' },
      { label: '多元學習表現', score: '36', desc: '均衡學習(健體/藝文/綜合, 每領域及格7分, 上限21分)；服務學習(每學期滿6小時5分, 上限15分)' },
      { label: '國中教育會考', score: '36', desc: '五科每科最高7分(上限35分)；寫作測驗最高1分' },
    ],
    examDetail: [
      { level: 'A++', score: '7分' },
      { level: 'A+', score: '6分' },
      { level: 'A', score: '5分' },
      { level: 'B++', score: '4分' },
      { level: 'B+', score: '3分' },
      { level: 'B', score: '2分' },
      { level: 'C', score: '1分' },
    ],
    note: '寫作測驗：六級分(1分)、五級分(0.8分)、四級分(0.6分)、三級分(0.4分)、二級分(0.2分)、一級分(0.1分)'
  },
  taoyuan: {
    total: '100',
    items: [
      { label: '適性輔導', score: '32', desc: '志願序上限15分、畢業資格最高6分、生涯規劃符合建議最高6分、就近入學5分' },
      { label: '多元學習表現', score: '35', desc: '品德上限10分、服務上限10分、均衡學習最高9分、體適能上限6分、才藝表現上限5分、本土語認證2分' },
      { label: '國中教育會考', score: '33', desc: '五科精熟(6分)/基礎(4分)/待加強(2分)，寫作4~6級(3分)/2~3級(2分)/1級(1分)' }
    ],
    examDetail: [
      { level: 'A++', score: '7點 (積分6分)' },
      { level: 'A+', score: '6點 (積分6分)' },
      { level: 'A', score: '5點 (積分6分)' },
      { level: 'B++', score: '4點 (積分4分)' },
      { level: 'B+', score: '3點 (積分4分)' },
      { level: 'B', score: '2點 (積分4分)' },
      { level: 'C', score: '1點 (積分2分)' },
    ],
    note: '【超額比序順序】1.低收入戶優先 2.適性輔導 3.多元學習表現 4.國中教育會考 5.志願序 6.教育會考總點數 7.國中教育會考單科成績標示(國>數>英>社>自)。'
  },
  central: {
    total: '100',
    items: [
      { label: '志願序', score: '30', desc: '依志願序給分，群組計分' },
      { label: '多元學習表現', score: '30', desc: '含均衡學習、服務學習、體適能等' },
      { label: '國中教育會考', score: '30', desc: '精熟(6分)、基礎(4分)、待加強(2分)' },
      { label: '扶助弱勢', score: '10', desc: '符合資格者給分' }
    ],
    examDetail: [
      { level: 'A++', score: '21點 (積分6分)' },
      { level: 'A+', score: '18點 (積分6分)' },
      { level: 'A', score: '15點 (積分6分)' },
      { level: 'B++', score: '12點 (積分4分)' },
      { level: 'B+', score: '9點 (積分4分)' },
      { level: 'B', score: '6點 (積分4分)' },
      { level: 'C', score: '3點 (積分2分)' }
    ],
    note: '【點數對照表】作同分比序用。各科點數：A++(21點)、A+(18點)、A(15點)、B++(12點)、B+(9點)、B(6點)、C(3點)。寫作測驗點數：6級分(6點)~1級分(1點)。總計111點。'
  },
  changhua: {
    total: '135',
    items: [
      { label: '志願序', score: '45', desc: '第1至20志願45分，第21志願以後44分 (連續選填同校同職群計為同一志願)' },
      { label: '身分別', score: '2', desc: '低收入戶2分 / 中低收入戶1分' },
      { label: '就近入學', score: '7', desc: '彰化區免試就學區或共同就學區7分' },
      { label: '品德服務', score: '20', desc: '服務學習上限8分、獎勵紀錄上限6分、生活教育上限8分' },
      { label: '績優表現', score: '16', desc: '均衡學習上限6分、社團參與上限4分、競賽表現上限6分、體適能上限6分' },
      { label: '國中教育會考', score: '45', desc: '五科按等級加標示轉換積分3至9分' }
    ],
    examDetail: [
      { level: 'A++', score: '9分' },
      { level: 'A+', score: '8分' },
      { level: 'A', score: '7分' },
      { level: 'B++', score: '6分' },
      { level: 'B+', score: '5分' },
      { level: 'B', score: '4分' },
      { level: 'C', score: '3分' }
    ],
    note: '寫作測驗列為比序總積分相同後之比序項目。除教育會考外，其餘採計限國中階段取得。'
  },
  tainan: {
    total: '100',
    items: [
      { label: '志願序', score: '10', desc: '第1-3志願10分，4-6志願9分，7-9志願8分，10-12志願7分，13-15志願6分，16-30志願5分' },
      { label: '就近入學', score: '10', desc: '符合台南區免試就學區(包含共同就學區)得10分，不符合得0分' },
      { label: '多元表現', score: '50', desc: '競賽上限10分、獎勵上限15分(大功4.5/小功1.5/嘉獎0.5)、服務學習上限15分(每小時0.3)、社團參與上限10分、體適能上限10分' },
      { label: '國中教育會考', score: '30', desc: '五科轉換積分：達精熟者每科6分、達基礎者每科4分、待加強者每科2分' }
    ],
    examDetail: [
      { level: '精熟 (A++, A+, A)', score: '6分' },
      { level: '基礎 (B++, B+, B)', score: '4分' },
      { level: '待加強 (C)', score: '2分' }
    ],
    note: '【競賽】國際最高10分、全國7分、縣市4分，團體賽折半。【體適能】依達標門檻分為4至10分。 各項多元表現不得因同一事由重複採計。'
  },
  kaohsiung: {
    total: '100',
    items: [
      { label: '志願序', score: '30', desc: '第1志願群30分，第2志願群29分，第3志願群28分 (每志願群可填10校)' },
      { label: '多元發展', score: '40', desc: '均衡學習上限10分、服務學習上限10分(滿3小時1分)、體適能上限20分、競賽表現上限20分、檢定證照上限20分、獎勵紀錄上限10分(大功4.5/小功1.5/嘉獎0.5)、幹部任期上限10分' },
      { label: '國中教育會考', score: '30', desc: '五科轉換積分：精熟者每科6分、基礎者每科4分、待加強者每科2分' }
    ],
    examDetail: [
      { level: 'A++', score: '6分 (7點)' },
      { level: 'A+', score: '6分 (6點)' },
      { level: 'A', score: '6分 (5點)' },
      { level: 'B++', score: '4分 (4點)' },
      { level: 'B+', score: '4分 (3點)' },
      { level: 'B', score: '4分 (2點)' },
      { level: 'C', score: '2分 (1點)' }
    ],
    note: '【超額比序順序】總積分→多元發展項目→志願序→會考總積分→會考總積點→會考單科積分→會考單科積點→寫作級分→經濟弱勢保障→同志願群優先志願。 (單科依序比較：國→數→英→社→自)。'
  },
  hsinchu: {
    total: '100',
    items: [
      { label: '均衡發展', score: '30', desc: '扶助弱勢上限5分、就近入學上限5分、志願順序上限10分(第1-5志願10分)、均衡學習上限15分' },
      { label: '多元學習表現', score: '40', desc: '日常表現上限10分、出席狀況上限12分、獎勵狀況上限20分(大功4.5/小功1.5/嘉獎0.5)、服務學習上限10分' },
      { label: '國中教育會考', score: '30', desc: '五科轉換積分：達精熟者每科6分、達基礎者每科4分、待加強者每科2分' }
    ],
    examDetail: [
      { level: '精熟 (A++, A+, A)', score: '6分' },
      { level: '基礎 (B++, B+, B)', score: '4分' },
      { level: '待加強 (C)', score: '2分' }
    ],
    note: '【均衡發展】均衡學習為健體、藝術、綜合三領域，五學期平均成績及格者各5分。【多元學習】獎勵採功過相抵後紀錄，服務學習每學期最多2分。'
  },
  chiayi: {
    total: '82',
    items: [
      { label: '志願序', score: '10', desc: '第1–6志願10分，之後每6個志願遞減1分；第25–30志願6分' },
      { label: '扶助弱勢', score: '1', desc: '低收入戶1分' },
      { label: '均衡學習', score: '12', desc: '健體、藝術、綜合、科技四領域，前五學期平均及格者各3分' },
      { label: '適性輔導', score: '6', desc: '與家長、導師、輔導教師意見相符者各2分' },
      { label: '多元學習表現', score: '26', desc: '品德、服務、體適能、競賽四項原始合計上限40分，採計上限26分' },
      { label: '國中教育會考', score: '27', desc: '五科精熟5分、基礎3分、待加強1分；寫作最高2分' },
    ],
    examDetail: [
      { level: 'A++', score: '5分（積點9）' },
      { level: 'A+', score: '5分（積點8）' },
      { level: 'A', score: '5分（積點7）' },
      { level: 'B++', score: '3分（積點5）' },
      { level: 'B+', score: '3分（積點4）' },
      { level: 'B', score: '3分（積點3）' },
      { level: 'C', score: '1分（積點1）' },
    ],
    note: '寫作測驗：6、5級分2分；4、3級分1.5分；2、1級分1分。五科加寫作最高27分；積點為五科 A++ 至 C 的細分換算。'
  }
};

export default function RegionScoringModal({ isOpen, onClose, selectedRegion }: Props) {
  const region = ALL_REGIONS.find(r => r.id === selectedRegion);
  const regionName = region?.name || '未知區域';
  const scoringData = REGION_SCORING_DATA[selectedRegion];
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();
  const rows = scoringData?.examDetail?.map(({ level, score }) => {
    const numbers = score.match(/\d+(?:\.\d+)?/g) || [];
    const pointsFirst = score.includes('點 (積分');
    return { level, credit: pointsFirst ? numbers[1] : numbers[0], points: numbers.length > 1 ? (pointsFirst ? numbers[0] : numbers[1]) : undefined };
  });
  const hasPoints = rows?.some(row => row.points !== undefined);

  React.useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); }
      if (event.key !== 'Tab') return;
      const elements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href]') || []);
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="score-modal-overlay">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="score-modal-backdrop" onClick={onClose} aria-hidden="true" />
          <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={descriptionId}
            onAnimationComplete={() => { if (isOpen && !dialogRef.current?.contains(document.activeElement)) closeRef.current?.focus(); }}
            initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.2 }} className="score-modal">
            <header className="score-modal-header">
              <div className="score-modal-eyebrow"><span><MapPin size={14} aria-hidden="true" />{regionName}</span><span>入學計分指南</span></div>
              <button ref={closeRef} type="button" onClick={onClose} className="score-modal-close" aria-label="關閉計分方式"><X size={22} /></button>
              <h2 id={titleId}>超額比序<span>計分方式</span></h2>
              <p id={descriptionId}>先看懂會考換算，再掌握志願選填的計分規則。</p>
              <Calculator className="score-modal-decoration" size={112} strokeWidth={1.2} aria-hidden="true" />
            </header>

            <div className="score-modal-body custom-scrollbar">
              {!scoringData ? (
                <div className="score-modal-empty"><Calculator size={36} aria-hidden="true" /><h3>此區計分資料整理中</h3><p>請先至所屬就學區的官方網站查閱招生簡章。</p></div>
              ) : (
                <>
                  <div className="score-modal-section-heading"><span className="score-modal-section-icon"><Calculator size={20} aria-hidden="true" /></span><div><h3>會考成績換算速覽</h3><p>依單科等級，查找對應{hasPoints ? '積分與積點' : '積分'}。</p></div><span className="score-modal-tag">{regionName}適用</span></div>
                  <div className="score-modal-grid">
                    {rows && <div className="score-modal-table-wrap"><table className="score-modal-table"><caption className="sr-only">{regionName}會考單科等級計分換算</caption><thead><tr><th scope="col">等級標示</th><th scope="col">換算積分 <small>分</small></th>{hasPoints && <th scope="col">比序積點 <small>點</small></th>}</tr></thead><tbody>{rows.map(row => <tr key={row.level}><th scope="row"><span className={`score-modal-grade score-modal-grade-${row.level.startsWith('A') || row.level.startsWith('精熟') ? 'a' : row.level.startsWith('B') || row.level.startsWith('基礎') ? 'b' : 'c'}`}>{row.level}</span></th><td>{row.credit}</td>{hasPoints && <td className="score-modal-points">{row.points ?? '—'}</td>}</tr>)}</tbody></table></div>}
                    <aside className="score-modal-notes">
                      <div className="score-modal-reading-note"><BookOpen size={20} aria-hidden="true" /><h4>怎麼看這張表？</h4><p>五科成績各自換算後加總；寫作測驗依各區規定採計。</p>{hasPoints && <p><strong>積分</strong>用於計分，<strong>積點</strong>用於進一步比序，請分別核對。</p>}</div>
                      {scoringData.note && <div className="score-modal-region-note"><h4><Info size={16} aria-hidden="true" />本區計分提醒</h4><p>{scoringData.note}</p></div>}
                    </aside>
                  </div>
                  <p className="score-modal-scope"><Info size={15} aria-hidden="true" /><span>本表為會考換算速覽。志願序、多元表現及完整比序，請查看完整規則；正式採計以當年度官方簡章為準。</span></p>
                </>
              )}
            </div>

            <footer className="score-modal-footer">
              {scoringData ? <><div><BookOpen size={18} aria-hidden="true" /><span>想了解其他採計項目？<small>志願序・多元表現・官方簡章</small></span></div><a href={withBasePath(`/scoring-rules/${selectedRegion}`)}>查看{regionName}完整規則<ArrowUpRight size={18} aria-hidden="true" /></a></> : <button type="button" onClick={onClose}>返回填寫成績</button>}
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
