import { useEffect, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  BarChart3,
  CalendarDays,
  ClipboardList,
  Copy,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Loader2,
  MapPin,
  MessageCircle,
  Send,
  ArrowUp,
  ArrowDown,
  Trash2,
  PieChart,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { callBackend } from "../lib/api";
import { withBasePath } from "../lib/routes";
import VolunteerVersionHistory from './VolunteerVersionHistory';
import type { VolunteerVersion } from '../lib/volunteerVersions';
import RelatedReading from "./RelatedReading";

type SharedReport = {
  kind: "analysis" | "volunteer";
  payload: any;
  expiresAt: string | null;
  collaborationEnabled?: boolean;
  collaborationVersion?: number;
  collaborationConfirmedAt?: string | null;
  collaborationConfirmedBy?: string | null;
};
const copyStorageKey = "mock-volunteer-import";

export default function SharedReportPage({ token }: { token: string }) {
  const [report, setReport] = useState<SharedReport | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    callBackend<SharedReport>({ action: "getSharedReport", token })
      .then(setReport)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "無法讀取分享內容。"),
      );
  }, [token]);
  if (error)
    return (
      <PageState
        icon={<AlertCircle />}
        title="此分享連結無法使用"
        message={error}
      />
    );
  if (!report)
    return (
      <PageState
        icon={<Loader2 className="animate-spin" />}
        title="正在載入分享報告"
        message="請稍候…"
      />
    );
  const createdAt = report.payload?.createdAt
    ? new Date(report.payload.createdAt).toLocaleString("zh-TW")
    : "";
  if (report.kind === "volunteer")
    return (
      <VolunteerReport
        token={token}
        choices={
          Array.isArray(report.payload?.choices) ? report.payload.choices : []
        }
        region={String(report.payload?.region || "")}
        regionName={String(
          report.payload?.regionName || report.payload?.region || "--",
        )}
        createdAt={createdAt}
        expiresAt={report.expiresAt}
        collaborationKey={new URLSearchParams(window.location.search).get("collab") || ""}
        collaborationEnabled={report.collaborationEnabled === true}
        collaborationVersion={report.collaborationVersion || 1}
        collaborationConfirmedAt={report.collaborationConfirmedAt || null}
        collaborationConfirmedBy={report.collaborationConfirmedBy || null}
        onChoicesUpdated={(choices, version, confirmation) => setReport((current) => current ? {
          ...current,
          payload: { ...current.payload, choices },
          collaborationVersion: version,
          collaborationConfirmedAt: confirmation?.confirmedAt ?? null,
          collaborationConfirmedBy: confirmation?.confirmedBy ?? null,
        } : current)}
      />
    );
  const schools = report.payload?.results?.eligibleSchools || [];
  return (
    <Layout
      title="落點分析結果"
      createdAt={createdAt}
      expiresAt={report.expiresAt}
    >
      <section className="rounded-2xl border-2 border-slate-900 bg-slate-900 p-5 text-white">
        <p className="text-sm font-black text-amber-300">分析摘要</p>
        <p className="mt-2 font-bold leading-7">
          {report.payload?.results?.analysisReport?.analysisSummary ||
            "此報告沒有可顯示的摘要。"}
        </p>
        <p className="mt-3 text-sm font-bold text-slate-300">
          總積分：{report.payload?.results?.totalPoints ?? "--"} ·
          符合條件校科：{schools.length}
        </p>
      </section>
      <div className="mt-5 space-y-3">
        {schools.map((school: any, index: number) => (
          <article
            key={`${school.name}-${index}`}
            className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
          >
            <h2 className="font-black text-slate-950">{school.name}</h2>
            <p className="mt-1 text-sm font-bold text-slate-600">
              {[school.type, school.group, school.ownership]
                .filter(Boolean)
                .join(" / ")}
            </p>
            <p className="mt-2 text-sm font-black text-indigo-700">
              參考門檻：{school.points ?? "--"} / {school.zone || "推薦"}
            </p>
          </article>
        ))}
      </div>
    </Layout>
  );
}

function VolunteerReport({
  token,
  choices,
  region,
  regionName,
  createdAt,
  expiresAt,
  collaborationKey,
  collaborationEnabled,
  collaborationVersion,
  collaborationConfirmedAt,
  collaborationConfirmedBy,
  onChoicesUpdated,
}: {
  token: string;
  choices: any[];
  region: string;
  regionName: string;
  createdAt: string;
  expiresAt: string | null;
  collaborationKey: string;
  collaborationEnabled: boolean;
  collaborationVersion: number;
  collaborationConfirmedAt: string | null;
  collaborationConfirmedBy: string | null;
  onChoicesUpdated: (choices: any[], version: number, confirmation?: { confirmedAt: string | null; confirmedBy: string | null }) => void;
}) {
  const summaryChoices = choices.slice(0, 10);
  const groupCounts = countBy(
    summaryChoices,
    (choice) => choice.groupName || "其他",
  );
  const typeCounts = countBy(summaryChoices, schoolCategory);
  const createCopy = () => {
    window.localStorage.setItem(
      copyStorageKey,
      JSON.stringify({ region, regionName, choices }),
    );
    window.location.href = withBasePath("/mock-volunteer?import=shared");
  };
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f7ff] px-4 py-5 text-slate-900 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-sky-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-72 h-80 w-80 rounded-full bg-amber-200/60 blur-3xl" />
      <div className="relative mx-auto max-w-4xl">
        <a
          href={withBasePath("/")}
          className="inline-flex items-center gap-2 rounded-xl border-[3px] border-slate-900 bg-white px-5 py-3 text-lg font-black text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]"
        >
          <ArrowLeft className="h-5 w-5 stroke-[3]" />
          回到首頁
        </a>
        <header className="relative mt-6 overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-slate-900 px-6 py-7 text-white shadow-[9px_9px_0px_0px_rgba(15,23,42,1)] sm:px-9 sm:py-9">
          <div className="absolute -right-12 -top-14 h-44 w-44 rounded-full border-4 border-slate-900 bg-amber-300" />
          <div className="relative max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-indigo-100">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              唯讀分享
            </div>
            <div className="mt-5 flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-900 bg-amber-300 text-slate-900">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-black text-sky-200">學生志願規劃</p>
                <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-5xl">
                  模擬志願序
                </h1>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-sm font-bold leading-7 text-slate-200">
              依志願順序整理，讓家庭可以快速討論孩子的探索方向。
            </p>
          </div>
        </header>
        <section className="relative z-10 -mt-4 mx-2 grid gap-3 sm:grid-cols-3">
          <StatCard
            icon={<MapPin className="h-5 w-5" />}
            label="就學區"
            value={regionName}
            tone="bg-sky-100 text-sky-800"
          />
          <StatCard
            icon={<Sparkles className="h-5 w-5" />}
            label="志願數"
            value={String(choices.length)}
            tone="bg-amber-100 text-amber-800"
          />
          <StatCard
            icon={<CalendarDays className="h-5 w-5" />}
            label={expiresAt ? "連結有效至" : "分享狀態"}
            value={expiresAt ? new Date(expiresAt).toLocaleDateString("zh-TW") : "會員專屬長期連結"}
            tone="bg-violet-100 text-violet-800"
          />
        </section>
        {choices.length > 0 && (
          <section className="mt-9 rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-700">
                  <BarChart3 className="h-5 w-5" />
                  <p className="text-xs font-black tracking-[0.16em]">
                    DIRECTION SNAPSHOT
                  </p>
                </div>
                <h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
                  志願方向總覽
                </h2>
                <p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-600">
                  從前幾個志願看出目前的探索方向；群科與類型標籤可點擊查看介紹。
                </p>
              </div>
              <span className="shrink-0 rounded-xl border-2 border-slate-900 bg-amber-100 px-3 py-2 text-xs font-black">
                以前 10 個志願統計
              </span>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <DistributionCard
                icon={<GraduationCap className="h-5 w-5" />}
                title="前幾志願的群科分布"
                entries={groupCounts}
                linkFor={(name) =>
                  name === "學術群"
                    ? withBasePath("/general-comprehensive-high-school")
                    : withBasePath("/vocational-encyclopedia") +
                      "?group=" +
                      encodeURIComponent(name)
                }
              />
              <DistributionCard
                icon={<PieChart className="h-5 w-5" />}
                title="普通高中／技高比例"
                entries={typeCounts}
                linkFor={() => withBasePath("/school-types")}
              />
            </div>
            <div className="mt-5 rounded-2xl border-2 border-slate-900 bg-indigo-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white">
                  <Copy className="h-5 w-5 text-indigo-700" />
                </div>
                <p className="text-sm font-bold leading-6 text-slate-700">
                  <span className="block font-black text-slate-950">
                    建立我的模擬副本
                  </span>
                  將這份清單帶到自己的模擬頁繼續調整；原分享內容不會被修改。
                </p>
              </div>
              <button
                onClick={createCopy}
                className="mt-4 inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none sm:mt-0 sm:w-auto"
              >
                <Copy className="h-4 w-4" />
                建立我的副本
              </button>
            </div>
          </section>
        )}
        {collaborationEnabled && collaborationKey && <VolunteerCollaborationPanel
          token={token}
          editorKey={collaborationKey}
          choices={choices}
          initialVersion={collaborationVersion}
          initialConfirmedAt={collaborationConfirmedAt}
          initialConfirmedBy={collaborationConfirmedBy}
          onChoicesUpdated={onChoicesUpdated}
        />}
        <section className="mt-9">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black tracking-[0.16em] text-indigo-600">
                PREFERENCE LIST
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">
                志願順序
              </h2>
            </div>
            <div className="rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              {choices.length} / 30
            </div>
          </div>
          {choices.length === 0 ? (
            <p className="mt-5 rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center font-bold text-slate-500">
              此報告尚未加入志願。
            </p>
          ) : (
            <ol className="relative mt-5 space-y-4 before:absolute before:bottom-6 before:left-[25px] before:top-6 before:w-1 before:rounded-full before:bg-indigo-200">
              {choices.map((choice: any, index: number) => (
                <li
                  key={`${choice.code}-${choice.deptCode}-${index}`}
                  className="relative"
                >
                  <article className="relative overflow-hidden rounded-2xl border-3 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-5">
                    <div className="relative flex gap-4">
                      <div className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-3 border-slate-900 bg-amber-300 text-lg font-black text-slate-950">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-black leading-tight text-slate-950 sm:text-xl">
                          {choice.name}
                        </h3>
                        <p className="mt-1 font-black text-sky-700">
                          {choice.deptName}
                          {choice.shift ? `（${choice.shift}）` : ""}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 border-t-2 border-dashed border-slate-200 pt-3">
                          <a
                            href={withBasePath("/school-types")}
                            className="rounded-lg border border-amber-300 bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-900 underline decoration-amber-400 underline-offset-2"
                          >
                            {choice.levelInfo || "--"}
                          </a>
                          {choice.groupName && (
                            <a
                              href={
                                choice.groupName === "學術群"
                                  ? withBasePath("/general-comprehensive-high-school")
                                  : withBasePath("/vocational-encyclopedia") +
                                    "?group=" +
                                    encodeURIComponent(choice.groupName)
                              }
                              className="rounded-lg border border-sky-300 bg-sky-100 px-2.5 py-1 text-xs font-black text-sky-800 underline decoration-sky-400 underline-offset-2"
                            >
                              {choice.groupName}
                            </a>
                          )}
                          {choice.county && (
                            <span className="rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs font-black text-slate-600">
                              {choice.county}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          )}
        </section>
        <DecisionFooter createdAt={createdAt} />
      </div>
    </main>
  );
}

type CollaborationEvent = { id: string; event_type: 'comment' | 'revision' | 'confirmed'; actor_name: string; message: string | null; version: number | null; created_at: string };

function VolunteerCollaborationPanel({ token, editorKey, choices, initialVersion, initialConfirmedAt, initialConfirmedBy, onChoicesUpdated }: {
  token: string;
  editorKey: string;
  choices: any[];
  initialVersion: number;
  initialConfirmedAt: string | null;
  initialConfirmedBy: string | null;
  onChoicesUpdated: (choices: any[], version: number, confirmation?: { confirmedAt: string | null; confirmedBy: string | null }) => void;
}) {
  const [versions, setVersions] = useState<VolunteerVersion[]>([]);
  const [revisionNote, setRevisionNote] = useState('');
  const [actorName, setActorName] = useState(() => {
    try { return window.localStorage.getItem('volunteer-collaboration-name') || ''; } catch { return ''; }
  });
  const [message, setMessage] = useState('');
  const [events, setEvents] = useState<CollaborationEvent[]>([]);
  const [version, setVersion] = useState(initialVersion);
  const [confirmedAt, setConfirmedAt] = useState(initialConfirmedAt);
  const [confirmedBy, setConfirmedBy] = useState(initialConfirmedBy);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [schoolSearch, setSchoolSearch] = useState('');
  const [availableSchools, setAvailableSchools] = useState<any[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const load = async () => {
    setLoading(true); setReady(false); setError('');
    try {
      const data = await callBackend<{ versions: VolunteerVersion[]; choices: any[]; events: CollaborationEvent[]; version: number; confirmedAt: string | null; confirmedBy: string | null }>({ action: 'getVolunteerVersions', token, editorKey });
      if (!Array.isArray(data.choices) || !Number.isInteger(data.version) || !Array.isArray(data.versions)) {
        throw new Error('共編服務版本不相容，請重新整理；若仍失敗，請聯絡管理員確認前後端已同步更新。');
      }
      onChoicesUpdated(data.choices, data.version, data);
      setReady(true);
      setVersions(data.versions || []);
      setEvents(data.events || []); setVersion(data.version || 1); setConfirmedAt(data.confirmedAt); setConfirmedBy(data.confirmedBy);
      return true;
    } catch (err) { setError(err instanceof Error ? err.message : '無法讀取協作紀錄。'); return false; }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, [token, editorKey]);
  useEffect(() => {
    let cancelled = false;
    setSchoolsLoading(true);
    fetch(withBasePath('/data/volunteer_schools.json'))
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('無法載入校科資料。')))
      .then((data) => { if (!cancelled) setAvailableSchools(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setError('校科資料載入失敗，請稍後再試。'); })
      .finally(() => { if (!cancelled) setSchoolsLoading(false); });
    return () => { cancelled = true; };
  }, []);
  const rememberName = () => {
    const value = actorName.trim();
    try { if (value) window.localStorage.setItem('volunteer-collaboration-name', value); } catch { /* Remembering a name is optional; collaboration must still work. */ }
    return value;
  };
  const sendComment = async () => {
    if (!ready || loading || saving) return;
    const name = rememberName();
    if (!name || !message.trim()) { setError('請先填寫你的稱呼與留言內容。'); return; }
    setSaving(true); setError('');
    try { await callBackend({ action: 'addVolunteerShareComment', token, editorKey, actorName: name, message }); setMessage(''); await load(); }
    catch (err) { setError(err instanceof Error ? err.message : '留言送出失敗。'); }
    finally { setSaving(false); }
  };
  const saveChoices = async (nextChoices: any[], restoreVersion?: number, note = revisionNote) => {
    if (!ready || loading || saving) return;
    const name = rememberName();
    if (!name) { setError('請先填寫你的稱呼，再調整志願。'); return; }
    setSaving(true); setError('');
    try {
      const result = await callBackend<{ conflict?: boolean } | null>({ action: restoreVersion ? 'restoreVolunteerVersion' : 'updateVolunteerShareChoices', token, editorKey, actorName: name, choices: nextChoices, expectedVersion: version, restoreVersion, note });
      if (result?.conflict) { const refreshed = await load(); if (refreshed) setError('清單已由其他人更新，已重新讀取。請比較後再操作。'); return; }
      setRevisionNote('');
      // Mutation responses may only acknowledge the write. Publish choices,
      // version and confirmation together from the validated history read.
      // If it fails, retain the last displayed list and block further edits.
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : '儲存志願變更失敗。'); }
    finally { setSaving(false); }
  };
  const moveChoice = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= choices.length) return;
    const next = [...choices]; [next[index], next[target]] = [next[target], next[index]]; saveChoices(next);
  };
  const removeChoice = (index: number) => saveChoices(choices.filter((_, itemIndex) => itemIndex !== index));
  const matchingSchools = schoolSearch.trim()
    ? availableSchools.filter((school) => [school.name, school.deptName, school.county, school.groupName, school.levelInfo].join(' ').toLowerCase().includes(schoolSearch.trim().toLowerCase()))
      .filter((school) => !choices.some((choice) => choice.code === school.code && choice.deptCode === school.deptCode && String(choice.shift || '').trim() === String(school.shift || '').trim())).slice(0, 12)
    : [];
  const addChoice = (school: any) => {
    setSchoolSearch('');
    saveChoices([...choices, { ...school, id: `${school.code}-${school.deptCode}-${Date.now()}` }]);
  };
  const confirmVersion = async () => {
    if (!ready || loading || saving) return;
    const name = rememberName();
    if (!name) { setError('請先填寫你的稱呼，再確認版本。'); return; }
    setSaving(true); setError('');
    try {
      const result = await callBackend<{ conflict?: boolean } | null>({ action: 'confirmVolunteerShareVersion', token, editorKey, actorName: name, expectedVersion: version });
      if (result?.conflict) { const refreshed = await load(); if (refreshed) setError('清單已變更，請閱讀新版後再確認。'); return; }
      await load();
    } catch (err) { setError(err instanceof Error ? err.message : '確認版本失敗。'); }
    finally { setSaving(false); }
  };
  return <section className="mt-9 rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] sm:p-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><p className="flex items-center gap-2 text-xs font-black tracking-[.16em] text-indigo-700"><MessageCircle className="h-4 w-4" />FAMILY COLLABORATION</p><h2 className="mt-1 text-2xl font-black text-slate-950">一起調整，也留下討論紀錄</h2><p className="mt-2 max-w-2xl text-sm font-bold leading-6 text-slate-600">這是一份可編輯連結。調整志願、留言與確認都會記錄時間與版本；請只轉傳給願意一起討論的人。</p></div><span className="shrink-0 rounded-xl border-2 border-slate-900 bg-indigo-100 px-3 py-2 text-sm font-black text-indigo-950">第 {version} 版</span></div>
    <label className="mt-4 block text-sm font-bold">這次修改的原因（選填）<input maxLength={120} value={revisionNote} onChange={e => setRevisionNote(e.target.value)} placeholder="例如：考量交通，調整優先順序" className="mt-2 w-full rounded-xl border-2 p-2" /></label>
    <button disabled={saving || loading} onClick={() => void load()} className="mt-3 rounded-lg border px-3 py-2">重新讀取最新清單</button>
    <VolunteerVersionHistory versions={versions} choices={choices} busy={!ready || saving || loading} onSave={note => saveChoices(choices, undefined, note)} onRestore={v => saveChoices(v.choices, v.version)} />
    <p className="text-xs text-slate-500">顯示最近 100 版；功能啟用前的舊內容無法回溯。每次修改自動保存，還原會清除原確認狀態。</p>
    <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"><div className="rounded-2xl border-2 border-slate-900 bg-slate-50 p-4"><label className="text-sm font-black text-slate-900">我的稱呼<input value={actorName} onChange={(event) => setActorName(event.target.value.slice(0, 24))} placeholder="例如：媽媽、爸爸、小明" className="mt-2 w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 font-bold outline-none focus:border-indigo-600" /></label><label className="mt-4 block text-sm font-black text-slate-900">留言<textarea value={message} onChange={(event) => setMessage(event.target.value.slice(0, 800))} placeholder="例如：這個科別的通勤時間要再確認。" className="mt-2 min-h-28 w-full resize-y rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 font-bold leading-6 outline-none focus:border-indigo-600" /></label><button type="button" onClick={sendComment} disabled={!ready || saving || loading} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] disabled:opacity-50"><Send className="h-4 w-4" />送出留言</button><button type="button" onClick={confirmVersion} disabled={!ready || saving || loading} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] disabled:opacity-50"><CheckCircle2 className="h-4 w-4" />確認目前版本</button>{confirmedAt && <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-bold leading-5 text-emerald-900">已由「{confirmedBy}」於 {new Date(confirmedAt).toLocaleString('zh-TW')} 確認第 {version} 版。</p>}</div>
      <div className="rounded-2xl border-2 border-slate-900 bg-white p-4"><h3 className="font-black text-slate-950">共同調整志願</h3><p className="mt-1 text-xs font-bold leading-5 text-slate-500">可新增校科、調整優先順序或移除不考慮的選項；每次變更會新增版本。</p><div className="relative z-20 mt-3 rounded-xl border-2 border-indigo-200 bg-indigo-50 p-3"><label className="relative block"><span className="sr-only">搜尋要加入的校科</span><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500" /><input value={schoolSearch} onChange={(event) => setSchoolSearch(event.target.value)} placeholder="搜尋學校、科別或地區後加入" className="w-full rounded-xl border-2 border-indigo-200 bg-white py-2.5 pl-9 pr-3 text-sm font-bold outline-none focus:border-indigo-600" /></label>{schoolsLoading && schoolSearch.trim() && <p className="absolute left-3 right-3 top-[calc(100%-0.75rem)] z-30 rounded-xl border-2 border-indigo-200 bg-white p-3 text-xs font-bold text-slate-500 shadow-[3px_4px_10px_rgba(15,23,42,0.14)]">正在載入校科資料…</p>}{matchingSchools.length > 0 && <ul className="absolute left-3 right-3 top-[calc(100%-0.75rem)] z-30 max-h-64 space-y-1 overflow-y-auto rounded-xl border-2 border-indigo-200 bg-white p-2 shadow-[3px_4px_10px_rgba(15,23,42,0.14)]">{matchingSchools.map((school) => <li key={`${school.code}-${school.deptCode}-${school.shift}`} className="flex items-center gap-2 rounded-lg p-2 hover:bg-indigo-50"><span className="min-w-0 flex-1"><strong className="block truncate text-xs text-slate-900">{school.name}</strong><small className="block truncate font-bold text-slate-500">{school.deptName} · {school.county}</small></span><button type="button" disabled={!ready || saving || loading || choices.length >= 30} onClick={() => addChoice(school)} className="inline-flex shrink-0 items-center gap-1 rounded-lg border-2 border-slate-900 bg-amber-300 px-2 py-1.5 text-xs font-black disabled:opacity-40"><Plus className="h-3.5 w-3.5" />加入</button></li>)}</ul>}{schoolSearch.trim() && !schoolsLoading && matchingSchools.length === 0 && <p className="absolute left-3 right-3 top-[calc(100%-0.75rem)] z-30 rounded-xl border-2 border-indigo-200 bg-white p-3 text-xs font-bold text-slate-500 shadow-[3px_4px_10px_rgba(15,23,42,0.14)]">找不到可加入的校科，或它已在目前志願中。</p>}</div><ol className="relative z-10 mt-3 space-y-2">{choices.map((choice, index) => <li key={`${choice.code}-${choice.deptCode}-${index}`} className="flex items-center gap-2 rounded-xl border-2 border-slate-200 bg-slate-50 p-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-300 text-sm font-black">{index + 1}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">{choice.name}</strong><small className="block truncate font-bold text-slate-500">{choice.deptName}</small></span><div className="flex shrink-0 gap-1"><button type="button" aria-label="上移志願" disabled={!ready || saving || loading || index === 0} onClick={() => moveChoice(index, -1)} className="rounded-lg border border-slate-300 bg-white p-2 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button><button type="button" aria-label="下移志願" disabled={!ready || saving || loading || index === choices.length - 1} onClick={() => moveChoice(index, 1)} className="rounded-lg border border-slate-300 bg-white p-2 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button><button type="button" aria-label="移除志願" disabled={!ready || saving || loading} onClick={() => removeChoice(index)} className="rounded-lg border border-rose-300 bg-rose-50 p-2 text-rose-700 disabled:opacity-30"><Trash2 className="h-4 w-4" /></button></div></li>)}</ol></div></div>
    <div className="mt-4 rounded-2xl border-2 border-slate-900 bg-amber-50 p-4"><h3 className="font-black text-slate-950">討論與版本紀錄</h3>{loading ? <p className="mt-3 text-sm font-bold text-slate-500">正在讀取紀錄…</p> : events.length ? <ol className="mt-3 space-y-3">{events.map((event) => <li key={event.id} className="border-l-4 border-indigo-300 pl-3 text-sm"><p className="font-black text-slate-950">{event.actor_name} <span className="font-bold text-slate-500">· {event.event_type === 'comment' ? '留言' : event.event_type === 'confirmed' ? '確認版本' : '更新志願'}</span></p><p className="mt-1 font-bold leading-6 text-slate-700">{event.message}</p><p className="mt-1 text-xs font-bold text-slate-400">{new Date(event.created_at).toLocaleString('zh-TW')}{event.version ? ` · 第 ${event.version} 版` : ''}</p></li>)}</ol> : <p className="mt-3 text-sm font-bold text-slate-500">還沒有討論紀錄；從一則留言開始吧。</p>}</div>
    {error && <p role="alert" className="mt-4 rounded-xl border-2 border-rose-300 bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}
  </section>;
}

function DecisionFooter({ createdAt }: { createdAt?: string }) {
  return (
    <footer className="relative mt-8 overflow-hidden rounded-[2rem] border-2 border-slate-900 bg-white">
      <div aria-hidden="true" className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-amber-200/70 blur-2xl" />
      <div className="relative bg-gradient-to-br from-amber-100 via-white to-sky-50 px-5 py-6 sm:px-7 sm:py-8">
        <p className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-[11px] font-black tracking-[0.16em] text-amber-200">
          NEXT STEPS
        </p>
        <h2 className="mt-4 max-w-2xl text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          別急著離開，這幾頁能幫你更快做決定
        </h2>
        <p className="mt-2 max-w-xl text-sm font-bold leading-6 text-slate-600">
          多看一點學制、職群與選填策略，再和家人一起確認方向。
        </p>
      </div>
      <div className="relative p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            href={withBasePath("/strategy")}
            className="group rounded-2xl border-2 border-sky-200 bg-sky-50 p-5 text-sky-950 transition hover:-translate-y-0.5 hover:border-sky-500 hover:bg-sky-100"
          >
            <span className="text-xs font-black tracking-[0.14em] text-sky-700">01 · 排好志願</span>
            <span className="mt-2 block text-lg font-black">志願選填策略</span>
            <span className="mt-1 block text-sm font-bold leading-6 text-slate-600">掌握排序與風險配置</span>
          </a>
          <a
            href={withBasePath("/vocational-encyclopedia")}
            className="group rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5 text-emerald-950 transition hover:-translate-y-0.5 hover:border-emerald-500 hover:bg-emerald-100"
          >
            <span className="text-xs font-black tracking-[0.14em] text-emerald-700">02 · 找到方向</span>
            <span className="mt-2 block text-lg font-black">職群介紹百科</span>
            <span className="mt-1 block text-sm font-bold leading-6 text-slate-600">認識學習內容與發展方向</span>
          </a>
        </div>
        <a
          href={withBasePath("/support")}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-rose-500 px-5 py-3.5 font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
        >
          <Sparkles className="h-5 w-5" />
          加入小額贊助
        </a>
      </div>
      <p className="border-t-2 border-slate-200 bg-slate-50 px-5 py-3 text-center text-xs font-bold leading-6 text-slate-500 sm:px-6">
        {createdAt && `建立於 ${createdAt} · `}
        本頁僅供檢視；實際選填請以官方系統與簡章為準。
      </p>
    </footer>
  );
}
function countBy(
  choices: any[],
  getKey: (choice: any) => string,
): [string, number][] {
  const counts = new Map<string, number>();
  choices.forEach((choice) => {
    const key = getKey(choice);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}
function schoolCategory(choice: any) {
  if (choice.levelInfo === "普通科" || choice.groupName === "學術群")
    return "普通高中";
  if (
    ["專業群科", "實用技能學程"].includes(choice.levelInfo) ||
    (choice.groupName && choice.groupName !== "學術群")
  )
    return "技術型高中";
  return "其他類型";
}
function DistributionCard({
  icon,
  title,
  entries,
  linkFor,
}: {
  icon: ReactNode;
  title: string;
  entries: [string, number][];
  linkFor?: (name: string) => string;
}) {
  const total = entries.reduce((sum, [, count]) => sum + count, 0) || 1;
  return (
    <section className="rounded-2xl border-2 border-slate-900 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <span className="rounded-lg border-2 border-slate-900 bg-white p-2 text-indigo-700">
          {icon}
        </span>
        <h3 className="font-black text-slate-950">{title}</h3>
      </div>
      <div className="mt-4 space-y-3">
        {entries.map(([name, count]) => {
          const href = linkFor?.(name);
          return (
            <div key={name}>
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate font-bold text-slate-700">
                  {href ? (
                    <a
                      href={href}
                      className="inline-flex items-center gap-1 text-indigo-700 underline decoration-indigo-300 underline-offset-2 hover:text-indigo-950"
                    >
                      {name}
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  ) : (
                    name
                  )}
                </span>
                <span className="shrink-0 font-black text-slate-950">
                  {count}{" "}
                  <small className="text-slate-500">
                    ({Math.round((count / total) * 100)}%)
                  </small>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${(count / total) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <article className="rounded-2xl border-3 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
      <div
        className={`inline-flex rounded-xl border-2 border-slate-900 p-2 ${tone}`}
      >
        {icon}
      </div>
      <p className="mt-2 text-xs font-black text-slate-500">{label}</p>
      <p className="mt-1 truncate text-lg font-black text-slate-950">{value}</p>
    </article>
  );
}
function Layout({
  title,
  createdAt,
  expiresAt,
  children,
}: {
  title: string;
  createdAt: string;
  expiresAt: string | null;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <a
          href={withBasePath("/")}
          className="inline-flex items-center gap-2 rounded-xl border-[3px] border-slate-900 bg-white px-5 py-3 text-lg font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
        >
          <ArrowLeft className="h-5 w-5 stroke-[3]" />
          回到首頁
        </a>
        <header className="mt-5 rounded-[2rem] border-4 border-slate-900 bg-indigo-600 p-6 text-white shadow-[7px_7px_0px_0px_rgba(15,23,42,1)]">
          <div className="flex items-center gap-2 text-indigo-100">
            <ShieldCheck className="h-5 w-5" />
            唯讀分享
          </div>
          <h1 className="mt-2 text-3xl font-black">{title}</h1>
          <p className="mt-3 text-sm font-bold text-indigo-100">
            {createdAt && `建立於 ${createdAt} · `}{expiresAt ? `有效至 ${new Date(expiresAt).toLocaleDateString("zh-TW")}` : "會員專屬長期連結"}
          </p>
        </header>
        <div className="mt-6">{children}</div>
        <p className="mt-6 text-center text-xs font-bold text-slate-500">
          本頁僅供檢視；實際選填請以官方系統與簡章為準。
        </p>
        <div className="mt-8">
          <RelatedReading path="/strategy" />
        </div>
      </div>
    </main>
  );
}
function PageState({
  icon,
  title,
  message,
}: {
  icon: ReactNode;
  title: string;
  message: string;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-5 text-center text-slate-900">
      <div>
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-slate-900 bg-amber-300">
          {icon}
        </div>
        <h1 className="text-2xl font-black">{title}</h1>
        <p className="mt-2 font-bold text-slate-500">{message}</p>
      </div>
    </main>
  );
}
