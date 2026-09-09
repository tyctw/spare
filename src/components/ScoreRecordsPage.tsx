import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  ClipboardPlus,
  Crown,
  LogIn,
  Save,
  Trash2,
} from "lucide-react";
import { callBackend } from "../lib/api";
import { consumeLineLoginCodeFromFragment } from "../lib/membership";
import { withBasePath } from "../lib/routes";

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
const gradeOrder = ["C", "B", "B+", "B++", "A", "A+", "A++"];
const gradePosition = (grade: string) => gradeOrder.indexOf(grade);

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
        await consumeLineLoginCodeFromFragment();
        await load();
      } catch {
        setNotice("無法讀取帳號資料，請稍後再試。");
      } finally {
        setIsLoadingAccount(false);
      }
    })();
  }, []);
  const login = () => {
    const url = (import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
    if (!url) {
      setNotice("尚未設定 LINE 登入服務。");
      return;
    }
    window.location.assign(
      `${url}/functions/v1/line-login?returnTo=/score-records`,
    );
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
    <main className="min-h-screen bg-[#f5f6ff] px-4 py-6 text-slate-900 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-[110rem]">
        <a
          href={withBasePath("/")}
          className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-4 py-2 text-sm font-black shadow-[2px_2px_0_#161b35]"
        >
          <ArrowLeft className="h-4 w-4" />
          回到落點分析
        </a>
        <header className="mt-5 rounded-[2rem] border-2 border-slate-900 bg-sky-100 p-5 shadow-[5px_5px_0_#161b35] sm:p-7">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-2 border-slate-900 bg-white text-sky-700">
              <ClipboardPlus className="h-6 w-6" />
            </span>
            <div>
              <p className="text-xs font-black tracking-[.15em] text-sky-700">
                MY SCORE RECORDS
              </p>
              <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">
                我的成績紀錄
              </h1>
              <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-600">
                登入後可保存模擬考與正式會考成績，方便比較自己的準備趨勢。請勿輸入准考證號、姓名或其他不必要個資。
              </p>
            </div>
          </div>
        </header>
        {isLoadingAccount ? (
          <section
            role="status"
            aria-live="polite"
            className="mt-5 rounded-[2rem] border-2 border-slate-900 bg-white p-6 text-center text-sm font-black text-slate-600 shadow-[4px_4px_0_#161b35]"
          >
            正在確認登入狀態…
          </section>
        ) : !loggedIn ? (
          <section className="mt-5 rounded-[2rem] border-2 border-slate-900 bg-white p-6 text-center shadow-[4px_4px_0_#161b35]">
            <Crown className="mx-auto h-8 w-8 text-amber-600" />
            <h2 className="mt-3 text-xl font-black">登入帳號，保存你的成績</h2>
            <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
              使用 LINE 登入即可建立個人紀錄，不需要另設密碼，也不必是付費會員。
            </p>
            <button
              type="button"
              onClick={login}
              className="mt-5 inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-sky-400 px-5 py-3 font-black shadow-[3px_3px_0_#161b35]"
            >
              <LogIn className="h-4 w-4" />
              使用 LINE 登入
            </button>
          </section>
        ) : (
          <>
            <section className="mt-5 rounded-[2rem] border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0_#161b35] sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black tracking-[.14em] text-sky-700">
                    ACCOUNT READY
                  </p>
                  <h2 className="mt-1 text-xl font-black">
                    {name || "你的"}成績紀錄
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-black text-emerald-800">
                  <Check className="h-3.5 w-3.5" />
                  已登入
                </span>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
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
                    className="mt-2 w-full rounded-xl border-2 border-slate-300 bg-slate-50 px-3 py-2.5 font-bold"
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
                    className="mt-2 w-full rounded-xl border-2 border-slate-300 bg-slate-50 px-3 py-2.5 font-bold"
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
                    className="mt-2 w-full rounded-xl border-2 border-slate-300 bg-slate-50 px-3 py-2.5 font-bold"
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
                    className="mt-2 w-full rounded-xl border-2 border-slate-300 bg-slate-50 px-3 py-2.5 font-bold"
                  />
                </label>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {subjects.map(([key, label]) => (
                  <label
                    key={key}
                    className="rounded-xl border-2 border-slate-200 bg-slate-50 p-3 text-sm font-black"
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
                      className="mt-2 w-full rounded-lg border-2 border-slate-300 bg-white px-2 py-2 font-bold"
                    >
                      <option value="">選擇等級</option>
                      {gradeOptions.map((grade) => (
                        <option key={grade}>{grade}</option>
                      ))}
                    </select>
                  </label>
                ))}
                <label className="rounded-xl border-2 border-slate-200 bg-slate-50 p-3 text-sm font-black">
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
                    className="mt-2 w-full rounded-lg border-2 border-slate-300 bg-white px-2 py-2 font-bold"
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
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-sky-400 px-4 py-3.5 font-black shadow-[3px_3px_0_#161b35] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "儲存中…" : "儲存這筆成績"}
              </button>
            </section>
            <ScoreHistory records={records} onRemove={remove} />
            {records.length > 0 && <ScoreInsights records={records} />}
          </>
        )}
        {notice && (
          <div
            className="fixed inset-x-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 mx-auto flex max-w-md items-center gap-3 rounded-xl border-2 border-slate-900 bg-amber-50 p-4 text-sm font-bold text-slate-800 shadow-[4px_4px_0_#161b35]"
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
  return (
    <section className="mt-5 rounded-[2rem] border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0_#161b35] sm:p-6">
      <h2 className="flex items-center gap-2 text-xl font-black">
        <BookOpen className="h-5 w-5 text-sky-700" />
        已儲存的成績
      </h2>
      {records.length ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {records.map((record) => (
            <article
              key={record.id}
              className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-black ${record.record_type === "official" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                  >
                    {record.record_type === "official" ? "正式會考" : "模擬考"}
                  </span>
                  <h3 className="mt-2 font-black">{record.title}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {record.exam_date ||
                      new Date(record.created_at).toLocaleDateString("zh-TW")}
                    {record.note ? ` · 備註：${record.note}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(record.id)}
                  className="rounded-lg border border-rose-200 bg-white p-2 text-rose-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-xl border-2 border-slate-900 bg-white text-sm font-black text-slate-700 sm:grid-cols-6">
                {[
                  ["國", record.scores.chinese],
                  ["英", record.scores.english],
                  ["數", record.scores.math],
                  ["自", record.scores.science],
                  ["社", record.scores.social],
                  ["寫", record.scores.composition],
                ].map(([label, score], index) => (
                  <span
                    key={String(label)}
                    className={`px-2 py-2 text-center ${index % 3 !== 0 ? "border-l-2 border-slate-400" : ""} ${index >= 3 ? "border-t-2 border-slate-400 sm:border-t-0" : ""} ${index > 0 ? "sm:border-l-2 sm:border-slate-400" : ""}`}
                  >
                    {label} {score}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-bold text-slate-500">
          尚未儲存成績；新增第一筆模擬考或會考成績吧。
        </p>
      )}
    </section>
  );
}

function ScoreInsights({ records }: { records: RecordItem[] }) {
  const chronological = [...records].reverse();
  const latest = chronological.at(-1)!;
  const previous = chronological.at(-2);
  const recentRecords = chronological.slice(-6);
  const grades = subjects.map(([key]) => latest.scores[key]);
  const a = grades.filter((grade) => grade.startsWith("A")).length;
  const b = grades.filter((grade) => grade.startsWith("B")).length;
  const c = grades.filter((grade) => grade === "C").length;
  const changes = previous
    ? subjects
        .map(([key, label]) => ({
          label,
          before: previous.scores[key],
          after: latest.scores[key],
          direction:
            gradePosition(latest.scores[key]) -
            gradePosition(previous.scores[key]),
        }))
        .filter((item) => item.direction !== 0)
    : [];
  const improvements = changes.filter((item) => item.direction > 0);
  const adjustments = changes.filter((item) => item.direction < 0);
  const writingChange = previous
    ? Number(latest.scores.composition) - Number(previous.scores.composition)
    : 0;
  const strengths = subjects
    .filter(([key]) => latest.scores[key].startsWith("A"))
    .map(([, label]) => label);
  const priorities = subjects
    .filter(([key]) => !latest.scores[key].startsWith("A"))
    .map(([, label]) => label);
  return (
    <section className="mt-5 rounded-[2rem] border-2 border-slate-900 bg-white p-5 shadow-[4px_4px_0_#161b35] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black tracking-[.15em] text-indigo-700">
            SCORE INSIGHTS
          </p>
          <h2 className="mt-1 text-2xl font-black">成績趨勢與分析</h2>
          <p className="mt-1 text-sm font-bold leading-6 text-slate-600">
            模擬考難度不同，請把變化當作調整方向，而非錄取預測。
          </p>
        </div>
        <span className="rounded-xl bg-indigo-100 px-3 py-2 text-sm font-black text-indigo-900">
          最新：{latest.title}
        </span>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
        <div className="overflow-hidden rounded-2xl border-2 border-slate-900 bg-slate-50 p-4">
          <h3 className="font-black">五科原始等級趨勢</h3>
          <p className="mt-1 text-xs font-bold text-slate-500">
            直接顯示每次考試的原始等級，不做總分或積分換算。
          </p>
          <div className="mt-4 overflow-x-auto">
            <div
              className="min-w-[500px]"
              style={{
                gridTemplateColumns: `72px repeat(${recentRecords.length}, minmax(72px, 1fr))`,
              }}
            >
              <div
                className="grid gap-1"
                style={{
                  gridTemplateColumns: `72px repeat(${recentRecords.length}, minmax(72px, 1fr))`,
                }}
              >
                <span className="p-2 text-xs font-black text-slate-500">
                  科目
                </span>
                {recentRecords.map((record) => (
                  <span
                    key={record.id}
                    title={record.title}
                    className="truncate p-2 text-center text-[11px] font-black text-slate-700"
                  >
                    {record.title}
                  </span>
                ))}
              </div>
              {subjects.map(([key, label]) => (
                <div
                  key={key}
                  className="mt-1 grid gap-1"
                  style={{
                    gridTemplateColumns: `72px repeat(${recentRecords.length}, minmax(72px, 1fr))`,
                  }}
                >
                  <span className="rounded-lg bg-white p-2 text-sm font-black text-slate-800">
                    {label}
                  </span>
                  {recentRecords.map((record) => (
                    <span
                      key={record.id}
                      className={`rounded-lg p-2 text-center text-sm font-black ${record.scores[key].startsWith("A") ? "bg-emerald-100 text-emerald-800" : record.scores[key].startsWith("B") ? "bg-amber-100 text-amber-800" : "bg-rose-100 text-rose-800"}`}
                    >
                      {record.scores[key]}
                    </span>
                  ))}
                </div>
              ))}
              <div
                className="mt-1 grid gap-1"
                style={{
                  gridTemplateColumns: `72px repeat(${recentRecords.length}, minmax(72px, 1fr))`,
                }}
              >
                <span className="rounded-lg bg-white p-2 text-sm font-black text-slate-800">
                  寫作
                </span>
                {recentRecords.map((record) => (
                  <span
                    key={record.id}
                    className="rounded-lg bg-indigo-100 p-2 text-center text-sm font-black text-indigo-800"
                  >
                    {record.scores.composition} 級
                  </span>
                ))}
              </div>
            </div>
          </div>
          {chronological.length > recentRecords.length && (
            <p className="mt-3 text-xs font-bold text-slate-500">
              為方便閱讀，圖表顯示最近 {recentRecords.length}{" "}
              筆；完整紀錄仍保留在上方。
            </p>
          )}
        </div>
        <div className="rounded-2xl border-2 border-slate-900 bg-amber-50 p-4">
          <h3 className="font-black">最新成績輪廓</h3>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <Stat count={a} label="A 類科目" tone="emerald" />
            <Stat count={b} label="B 類科目" tone="amber" />
            <Stat count={c} label="C 類科目" tone="rose" />
          </div>
          <p className="mt-4 text-sm font-bold leading-6 text-slate-700">
            {c
              ? "先從 C 類科目的基礎題與常錯單元開始規劃。"
              : a >= 3
                ? "強項已形成優勢；維持 A 類科目，也找出 B 類科目最常失分的題型。"
                : "從一個最常失分的科目或單元開始調整，比一次全面加量更容易持續。"}
          </p>
          <div className="mt-4 space-y-2 border-t-2 border-amber-200 pt-3 text-sm font-bold leading-6 text-slate-700">
            <p>
              <span className="font-black text-slate-950">優勢科目：</span>
              {strengths.length
                ? strengths.join("、")
                : "尚未出現 A 類科目；可先把一科穩定拉到 B++ 以上。"}
            </p>
            <p>
              <span className="font-black text-slate-950">優先調整：</span>
              {priorities.length
                ? priorities.join("、")
                : "五科皆為 A 類，可改以錯題、閱讀速度與寫作結構做精進。"}
            </p>
            <p>
              <span className="font-black text-slate-950">寫作：</span>
              {latest.scores.composition}{" "}
              級分；建議每次練習保留題目、提綱與教師回饋，才能看出進步原因。
            </p>
          </div>
        </div>
      </div>
      {previous && (
        <div className="mt-4 rounded-2xl border-2 border-slate-900 bg-emerald-50 p-4">
          <h3 className="font-black">這次進步的地方</h3>
          {improvements.length || writingChange > 0 ? (
            <>
              <p className="mt-2 text-sm font-bold leading-6 text-emerald-950">
                做得很好，你已經在以下科目留下可看見的進步；把這次有效的讀法保留下來，下一次會更有底氣。
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {improvements.map((change) => (
                  <span
                    key={change.label}
                    className="rounded-lg bg-emerald-200 px-3 py-2 text-sm font-black text-emerald-900"
                  >
                    {change.label}：{change.before} → {change.after}
                  </span>
                ))}
                {writingChange > 0 && (
                  <span className="rounded-lg bg-emerald-200 px-3 py-2 text-sm font-black text-emerald-900">
                    寫作：{previous.scores.composition} 級 →{" "}
                    {latest.scores.composition} 級
                  </span>
                )}
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm font-bold leading-6 text-emerald-950">
              這次沒有反映在等級上的上升，也不代表努力白費。等級相同仍可能是答題更穩、錯題變少；持續整理錯題與熟練度，下次就更有機會跨過門檻。
            </p>
          )}
          {adjustments.length > 0 && (
            <p className="mt-4 rounded-xl border border-amber-200 bg-white/70 p-3 text-sm font-bold leading-6 text-slate-700">
              下一步可以多照顧：
              {adjustments.map((item) => item.label).join("、")}
              。一次考試的起伏很常見，先找出一個最常錯的單元或題型，做小而持續的調整就很好。
            </p>
          )}
          {writingChange < 0 && (
            <p className="mt-3 text-sm font-bold leading-6 text-slate-700">
              寫作這次是 {previous.scores.composition} 級到{" "}
              {latest.scores.composition}{" "}
              級；可回看題意、結構與例子是否完整，下一次先設定一個可做到的改善目標。
            </p>
          )}
          <p className="mt-3 text-xs font-bold text-slate-500">
            顯示的是原始等級的變化，不是換算後的分數；不同模擬考的範圍與難度仍可能不同。
          </p>
        </div>
      )}
    </section>
  );
}

function Stat({
  count,
  label,
  tone,
}: {
  count: number;
  label: string;
  tone: "emerald" | "amber" | "rose";
}) {
  const styles = {
    emerald: "bg-emerald-100 text-emerald-800",
    amber: "bg-amber-100 text-amber-800",
    rose: "bg-rose-100 text-rose-800",
  };
  return (
    <div className={`rounded-xl p-3 ${styles[tone]}`}>
      <strong className="block text-2xl font-black">{count}</strong>
      <span className="text-xs font-black">{label}</span>
    </div>
  );
}
