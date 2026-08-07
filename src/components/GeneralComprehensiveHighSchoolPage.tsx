import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Compass,
  GraduationCap,
  HelpCircle,
  Route,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { withBasePath } from "../lib/routes";

export default function GeneralComprehensiveHighSchoolPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-gradient-to-br from-sky-100 via-white to-emerald-100">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
          <a
            href={withBasePath("/")}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"
          >
            <ArrowLeft className="h-4 w-4" />
            回到首頁
          </a>
          <div className="py-8 sm:py-12">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1.5 text-xs font-black text-sky-800">
              <GraduationCap className="h-4 w-4" />
              學制介紹
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
              普通科與綜合高中，怎麼選？
            </h1>
            <p className="mt-4 max-w-3xl text-base font-bold leading-8 text-slate-700 sm:text-lg">
              兩者都可依個人興趣規劃升學，但課程安排與探索節奏不同。普通科以學術領域課程為主；綜合高中則讓學生先探索，再依校內開設學程選擇學術或專門方向。
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto max-w-6xl space-y-7 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-5 lg:grid-cols-2">
          <SchoolTypeCard
            title="普通科（普通型高中）"
            icon={<BookOpen className="h-7 w-7" />}
            tone="sky"
            intro="適合已大致確認想以學術領域為主、準備大學校系探索的學生。"
            bullets={[
              "課程以語文、數學、社會、自然科學等一般科目為核心，並由校訂必修、選修與彈性學習補足個人興趣。",
              "高二、高三的課程選擇會因校本課程而異；不要只看傳統「文／理組」名稱，應直接看學校公布的課程計畫與選修地圖。",
              "可依各校招生與校系規定，規劃大學多元入學管道。",
            ]}
          />
          <SchoolTypeCard
            title="綜合高中（綜合型高中）"
            icon={<Compass className="h-7 w-7" />}
            tone="emerald"
            intro="適合還想透過課程探索學術與技術專業方向、且學校確實開有適合學程的學生。"
            bullets={[
              "高一通常以統整、試探為主；高二起依適性發展選擇學術學程或專門學程，實際時程與學程名稱須以各校課程計畫為準。",
              "學術學程偏向大學升學準備；專門學程則結合專業及實習課程，可規劃四技二專等進路。",
              "不是每所綜合高中都開設相同學程，也不保證每個人都能選到所有學程；入學前要確認班級數、選課規則與近年實際開課情況。",
            ]}
          />
        </section>
        <section className="rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border-2 border-slate-900 bg-amber-200 p-2">
              <Route className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black tracking-[0.16em] text-amber-800">
                HOW TO DECIDE
              </p>
              <h2 className="text-2xl font-black">
                用這 4 件事比較，會比看校名更準
              </h2>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["課程", "看高一到高三的課程表、必修與選修，而非只看學制名稱。"],
              [
                "探索程度",
                "方向已明確可優先看普通科；仍在探索可比較綜高的學程設計。",
              ],
              [
                "學程供給",
                "綜高請確認想要的學程是否真的有開、何時分流、如何選課。",
              ],
              [
                "升學準備",
                "反推目標校系採計科目、學習歷程與考試規畫，再確認校內資源。",
              ],
            ].map(([title, description], index) => (
              <article
                key={title}
                className="rounded-2xl border-2 border-slate-900 bg-slate-50 p-4"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-black text-slate-950">{title}</h3>
                <p className="mt-1 text-sm font-bold leading-6 text-slate-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-2xl border-4 border-slate-900 bg-indigo-50 p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-indigo-700" />
              <h2 className="text-xl font-black">常見誤解</h2>
            </div>
            <div className="mt-4 space-y-3">
              <Fact
                title="綜合高中就是普通高中和高職各上一半？"
                text="不完全是。綜高的共同核心與校訂課程安排，會依學生選擇的學程與學校課程計畫而不同；重點是延後分流與課程試探，而不是把兩種課表直接相加。"
              />
              <Fact
                title="選了綜高就一定能學到想要的專業？"
                text="不一定。學程開設受學校師資、設備、班級數與選課規則影響，必須以該校當年度課程計畫與新生說明為準。"
              />
              <Fact
                title="普通科只能走單一路線？"
                text="不是。普通型高中也有校訂選修、彈性學習與多元課程；關鍵是校內實際提供哪些課程與支持資源。"
              />
            </div>
          </div>
          <aside className="rounded-2xl border-4 border-slate-900 bg-amber-50 p-5 text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
            <Sparkles className="h-7 w-7 text-amber-700" />
            <h2 className="mt-3 text-xl font-black">入學前，請向學校確認</h2>
            <ul className="mt-4 space-y-3 text-sm font-bold leading-6 text-slate-700">
              {[
                "三年課程計畫與選修清單",
                "綜高學程的分流年級、名額與選課規則",
                "學術／專門學程近年實際開設情形",
                "升學輔導、學習歷程與生涯探索資源",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </section>
        <a
          href={withBasePath("/grade-11-pathways")}
          className="group block rounded-[2rem] border-4 border-slate-900 bg-rose-50 p-5 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-1 sm:p-7"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black tracking-[0.16em] text-rose-700">
                GRADE 11 PATHWAYS
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                高二「班群」是什麼？怎麼選？
              </h2>
              <p className="mt-2 text-sm font-bold leading-7 text-slate-600">
                查看獨立完整指南：班群定位、課程判讀、選群流程、轉群與升學規劃。
              </p>
            </div>
            <Route className="h-8 w-8 shrink-0 text-rose-700 transition group-hover:translate-x-1" />
          </div>
        </a>
      </div>
    </main>
  );
}

function SchoolTypeCard({
  title,
  icon,
  tone,
  intro,
  bullets,
}: {
  title: string;
  icon: ReactNode;
  tone: "sky" | "emerald";
  intro: string;
  bullets: string[];
}) {
  const classes =
    tone === "sky"
      ? "bg-sky-50 text-sky-800 border-sky-300"
      : "bg-emerald-50 text-emerald-800 border-emerald-300";
  return (
    <article className="rounded-[2rem] border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] sm:p-6">
      <div
        className={`inline-flex rounded-xl border-2 border-slate-900 p-3 ${classes}`}
      >
        {icon}
      </div>
      <h2 className="mt-4 text-2xl font-black text-slate-950">{title}</h2>
      <p className="mt-2 font-bold leading-7 text-slate-700">{intro}</p>
      <ul className="mt-4 space-y-3">
        {bullets.map((item) => (
          <li
            key={item}
            className="flex gap-2 text-sm font-bold leading-6 text-slate-600"
          >
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
function Fact({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-xl border-2 border-indigo-200 bg-white p-4">
      <h3 className="font-black text-indigo-950">{title}</h3>
      <p className="mt-1 text-sm font-bold leading-6 text-slate-600">{text}</p>
    </article>
  );
}
