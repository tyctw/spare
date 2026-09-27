import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardPlus,
  LogIn,
  Save,
  Trash2,
} from "lucide-react";
import { callBackend } from "../lib/api";
import { startLineLogin } from "../lib/lineLogin";
import { consumeLineLoginCodeFromFragment } from "../lib/membership";
import { withBasePath } from "../lib/routes";
import ScoreRecordsAnalytics from "./ScoreRecordsAnalytics";
import "./score-records-page.css";

type Scores = {
  chinese: string;
  english: string;
  math: string;
  science: string;
  social: string;
  composition: number | "";
};
type RecordItem = {
  id: string;
  record_type: "mock" | "official";
  title: string;
  exam_date: string | null;
  note: string | null;
  scores: Scores;
  created_at: string;
};
const emptyScores: Scores = {
  chinese: "",
  english: "",
  math: "",
  science: "",
  social: "",
  composition: "",
};
const gradeOptions = ["A++", "A+", "A", "B++", "B+", "B", "C"];
const subjects: Array<[keyof Omit<Scores, "composition">, string]> = [
  ["chinese", "國文"],
  ["english", "英文"],
  ["math", "數學"],
  ["science", "自然"],
  ["social", "社會"],
];
export default function ScoreRecordsPage() {
  const [isLoadingAccount, setIsLoadingAccount] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [recordType, setRecordType] = useState<"mock" | "official">("mock");
  const [title, setTitle] = useState("");
  const [examDate, setExamDate] = useState("");
  const [note, setNote] = useState("");
  const [scores, setScores] = useState<Scores>(emptyScores);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(""), 3000);
    return () => window.clearTimeout(timeout);
  }, [notice]);
  const load = async () => {
    const result = await callBackend<{
      loggedIn: boolean;
      name?: string;
      records: RecordItem[];
    }>({ action: "getMemberScoreRecords" });
    setLoggedIn(result.loggedIn);
    setName(result.name || "");
    setRecords(result.records || []);
  };
  useEffect(() => {
    void (async () => {
      try {
        const hash = new URLSearchParams(window.location.hash.slice(1));
        const hasLoginCode = hash.has('line_login_code');
        const consumed = await consumeLineLoginCodeFromFragment();
        if (hasLoginCode && !consumed) {
          setNotice("LINE 登入連結已失效或逾時，請重新點擊「LINE 登入」。");
        }
        await load();
      } catch {
        setNotice("無法讀取帳號資料，請稍後再試。");
      } finally {
        setIsLoadingAccount(false);
      }
    })();
  }, []);
  const login = () => {
    if (!import.meta.env.VITE_SUPABASE_URL) {
      setNotice("尚未設定 LINE 登入服務。");
      return;
    }
    startLineLogin('/score-records');
  };
  const save = async () => {
    if (!title.trim()) {
      setNotice("請替這筆成績取一個名稱，例如：第一次模擬考。");
      return;
    }
    if (subjects.some(([key]) => !scores[key]) || scores.composition === "") {
      setNotice("請完整填寫五科等級與寫作級分。");
      return;
    }
    setSaving(true);
    setNotice("");
    try {
      await callBackend({
        action: "saveMemberScoreRecord",
        recordType,
        title,
        examDate: examDate || null,
        note,
        scores,
      });
      setTitle("");
      setExamDate("");
      setNote("");
      setScores(emptyScores);
      await load();
      setNotice("已安全儲存到你的帳號。");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "儲存失敗，請稍後再試。",
      );
    } finally {
      setSaving(false);
    }
  };
  const remove = async (id: string) => {
    if (!window.confirm("確定要刪除這筆成績紀錄嗎？")) return;
    try {
      await callBackend({ action: "deleteMemberScoreRecord", id });
      await load();
      setNotice("已刪除成績紀錄。");
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "刪除失敗，請稍後再試。",
      );
    }
  };
  return (
    <main className="score-records-page min-h-screen text-slate-900">
      <div className="score-records-shell">
        <a
          href={withBasePath("/")}
          className="score-records-back"
        >
          <ArrowLeft className="h-4 w-4" />
          回到落點分析
        </a>
        <header className="score-records-hero">
          <div className="score-records-hero-copy">
            <span className="score-eyebrow"><ClipboardPlus size={17} /> 個人學習儀表板</span>
            <h1>我的成績紀錄</h1>
            <p>把每次模擬考與會考成績整理在一起，從等級變化找到下一步的練習方向。</p>
            <small>請勿在名稱或備註輸入准考證號、姓名等不必要個資。</small>
          </div>
          {loggedIn && <div className="score-records-account"><span><Check size={16} /> 已登入</span><strong>{name || '我的帳號'}</strong><small>紀錄會保存在你的帳號中</small></div>}
        </header>
        {isLoadingAccount ? (
          <section
            role="status"
            aria-live="polite"
            className="score-records-loading"
          >
            正在確認登入狀態…
          </section>
        ) : !loggedIn ? (
          <section className="score-records-login">
            <span className="score-records-login-icon"><LogIn size={27} /></span>
            <h2>登入後，開始整理你的成績</h2>
            <p>使用 LINE 登入即可保存模擬考與正式會考紀錄，查看個人趨勢；不需要另設密碼，也不必是付費會員。</p>
            <button
              type="button"
              onClick={login}
              className="score-records-primary-button"
            >
              <LogIn className="h-4 w-4" />
              使用 LINE 登入
            </button>
          </section>
        ) : (
          <>
            <section id="score-new-record" className="score-records-entry">
              <div className="score-section-heading">
                <div><span className="score-eyebrow"><ClipboardPlus size={16} /> 新增紀錄</span><h2>記下這次的成績</h2><p>填入五科等級與寫作級分，讓之後的比較有完整依據。</p></div>
              </div>
              <div className="score-records-fields">
                <label className="text-sm font-black">
                  成績類型
                  <select
                    value={recordType}
                    onChange={(event) => {
                      const type = event.target.value as "mock" | "official";
                      setRecordType(type);
                      if (!title)
                        setTitle(type === "mock" ? "模擬考" : "正式會考");
                    }}
                    className="score-records-input"
                  >
                    <option value="mock">模擬考成績</option>
                    <option value="official">正式會考成績</option>
                  </select>
                </label>
                <label className="text-sm font-black">
                  這筆成績的名稱
                  <input
                    list="score-record-title-options"
                    value={title}
                    onChange={(event) =>
                      setTitle(event.target.value.slice(0, 60))
                    }
                    placeholder="例如：第一次模擬考"
                    className="score-records-input"
                  />
                  <datalist id="score-record-title-options">
                    {Array.from({ length: 6 }, (_, index) => (
                      <option key={index} value={`第${index + 1}次模擬考`} />
                    ))}
                  </datalist>
                </label>
                <label className="text-sm font-black">
                  考試日期（選填）
                  <input
                    type="date"
                    value={examDate}
                    onChange={(event) => setExamDate(event.target.value)}
                    className="score-records-input"
                  />
                </label>
                <label className="text-sm font-black">
                  備註（選填）
                  <input
                    value={note}
                    onChange={(event) =>
                      setNote(event.target.value.slice(0, 80))
                    }
                    placeholder="例如：第二次模擬考前"
                    className="score-records-input"
                  />
                </label>
              </div>
              <div className="score-records-subject-grid">
                {subjects.map(([key, label]) => (
                  <label
                    key={key}
                    className="score-records-subject"
                  >
                    {label}
                    <select
                      value={scores[key]}
                      onChange={(event) =>
                        setScores((current) => ({
                          ...current,
                          [key]: event.target.value,
                        }))
                      }
                      className="score-records-input"
                    >
                      <option value="">選擇等級</option>
                      {gradeOptions.map((grade) => (
                        <option key={grade}>{grade}</option>
                      ))}
                    </select>
                  </label>
                ))}
                <label className="score-records-subject">
                  寫作
                  <select
                    value={scores.composition}
                    onChange={(event) =>
                      setScores((current) => ({
                        ...current,
                        composition:
                          event.target.value === ""
                            ? ""
                            : Number(event.target.value),
                      }))
                    }
                    className="score-records-input"
                  >
                    <option value="" disabled>
                      請選擇級分
                    </option>
                    {[0, 1, 2, 3, 4, 5, 6].map((score) => (
                      <option key={score} value={score}>
                        {score} 級分
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="score-records-save-row"><p>儲存後可在下方查看或刪除這筆紀錄。</p><button type="button" onClick={save} disabled={saving} className="score-records-primary-button"><Save size={18} />{saving ? "儲存中…" : "儲存這筆成績"}</button></div>
            </section>
            <ScoreHistory records={records} onRemove={remove} />
            <ScoreRecordsAnalytics records={records} />
          </>
        )}
        {notice && (
          <div
            className="score-records-notice"
          >
            <p role="status" aria-live="polite" className="min-w-0 flex-1 break-words">
              {notice}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function ScoreHistory({
  records,
  onRemove,
}: {
  records: RecordItem[];
  onRemove: (id: string) => void;
}) {
  const [filter, setFilter] = useState<'all' | 'mock' | 'official'>('all');
  const visibleRecords = filter === 'all' ? records : records.filter((record) => record.record_type === filter);
  return (
    <section className="score-records-history" aria-labelledby="score-records-history-title">
      <div className="score-section-heading"><div><span className="score-eyebrow"><BookOpen size={16} /> 全部資料</span><h2 id="score-records-history-title">已儲存的成績</h2><p>保留每一次的原始等級，方便回頭比對與整理。</p></div><span className="score-history-total">共 {records.length} 筆</span></div>
      <div className="score-history-filters" role="group" aria-label="篩選紀錄類型">
        {([['all', '全部'], ['mock', '模擬考'], ['official', '正式會考']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</button>)}
      </div>
      {records.length ? (
        visibleRecords.length ? <div className="score-history-grid">
          {visibleRecords.map((record) => (
            <article
              key={record.id}
              className="score-history-card"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`score-history-type ${record.record_type === 'official' ? 'score-history-type--official' : ''}`}>
                    {record.record_type === "official" ? "正式會考" : "模擬考"}
                  </span>
                  <h3>{record.title}</h3>
                  <p className="score-history-date">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {record.exam_date || new Date(record.created_at).toLocaleDateString("zh-TW")}
                    {record.note ? ` · 備註：${record.note}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(record.id)}
                  className="score-history-delete"
                  aria-label={`刪除${record.title}成績紀錄`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="score-history-scores">
                {[
                  ["國", record.scores.chinese],
                  ["英", record.scores.english],
                  ["數", record.scores.math],
                  ["自", record.scores.science],
                  ["社", record.scores.social],
                  ["寫", record.scores.composition],
                ].map(([label, score]) => (
                  <span
                    key={String(label)}
                    className="score-history-score"
                  >
                    <small>{label}</small><strong>{score}</strong>
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div> : <p className="score-history-empty">目前沒有這一類成績紀錄。</p>
      ) : (
        <p className="score-history-empty">
          尚未儲存成績；新增第一筆模擬考或會考成績吧。
        </p>
      )}
    </section>
  );
}
