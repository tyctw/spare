import React from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, BookOpenCheck, CalendarDays, History, Rocket, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import PageBreadcrumb from './PageBreadcrumb';
import PageNavigation from './PageNavigation';
import './changelog-page.css';

type Release = {
  version: string;
  date: string;
  title: string;
  summary: string;
  icon: React.ElementType;
  tone: 'emerald' | 'indigo' | 'amber' | 'slate';
  sections: { title: string; items: string[] }[];
};

const updatedAt = '2026-09-09';

const releases: Release[] = [
  {
    version: 'v2.7', date: '2026-09-09', title: '個資管理、志願版本與共編體驗更新', icon: ShieldCheck, tone: 'emerald',
    summary: '新增個資與分享管理中心，並完成志願版本比較、還原及家長共編的流程強化，讓重要的升學討論更容易保存、追蹤與管理。',
    sections: [
      { title: '個資與分享管理', items: ['新增管理中心，可查看自己建立的分享連結、分享類型、建立時間、期限、協作版本及目前狀態。', '支援由建立者撤銷唯讀與協作分享；撤銷後的新讀取與編輯請求會被拒絕。', '新增本機資料匯出與確認清除流程，採用白名單管理，避免將登入憑證或付款資料一併匯出。'] },
      { title: '志願版本比較', items: ['模擬志願序可保存不同時間的清單，標示新增、刪除及順位變動。', '支援比較歷史版本與目前清單，並可在確認後還原；還原會保留原歷史並建立新版本。', '版本面板改為點擊展開，手機與桌機均採用更清楚的摘要、統計卡及還原確認操作。'] },
      { title: '家長協作與安全', items: ['協作寫入加入版本檢查，避免舊版本覆蓋其他人剛完成的修改。', '修改、還原與確認會在同一個交易流程中保存目前清單、版本事件及確認狀態。', '協作載入失敗時會停用修改，並清楚提示重新讀取、權限失效或後端版本尚未同步等狀態。'] },
      { title: '介面與響應式版面', items: ['放寬模擬志願序、分享頁、各區計分、職群百科、荷倫測驗、成績紀錄與升學說明頁的桌機內容寬度。', '改善手機版管理按鈕的自動延伸與排列，並將撤銷與清除等高風險操作改用確認彈窗。', '調整分享頁標頭、會員比較彈窗、資訊卡與陰影層次，區分唯讀分享與可共同編輯權限。'] },
    ],
  },
  {
    version: 'v2.6', date: '2026-08-15', title: '分類導覽、新聞文章與行動選單優化', icon: Sparkles, tone: 'indigo',
    summary: '新增五個分類說明頁與可收錄的獨立新聞文章頁，並持續調整桌機、平板與手機的導覽、搜尋及互動細節。',
    sections: [
      { title: '分類與搜尋', items: ['新增「我要查資料、我要選志願、我要規劃升學、會員與資源、使用協助」五個分類說明頁，桌機主選單可直接前往閱讀完整功能介紹。', '分類說明頁與網站地圖加入「沒有找到功能嗎？」入口，提供網站功能搜尋與使用協助。', '五個分類說明頁新增獨立 SEO 標題、描述、canonical 與 sitemap 收錄。'] },
      { title: '最新消息', items: ['最新消息改為獨立文章頁，使用文章編號網址並提供發布日期、內文段落、資料提醒與 NewsArticle 結構化資料。', '新增「預告 117 學年度竹苗區高級中等學校免試入學比序項目採計方式」新聞文章，整理公告與比序採計重點。', '新聞文章網址已加入 sitemap，方便搜尋引擎收錄。'] },
      { title: '導覽與體驗', items: ['優化桌機懸浮選單、手機與平板漢堡選單的切換規則，避免兩種選單同時顯示。', '補強全站搜尋、彈窗與導覽的鍵盤操作、焦點提示與顯示層級。', '首頁廣告延後至互動或 5 秒後載入；其他頁面維持立即開始載入流程。'] },
    ],
  },
  {
    version: 'v2.5', date: '2026-08-12', title: '會員免廣告與登入流程更新', icon: BadgeCheck, tone: 'emerald',
    summary: '新增會員免廣告服務與 LINE 身分確認流程；有效會員可享有更少干擾、跨裝置恢復資格，以及更順暢的落點分析操作。',
    sections: [
      { title: '會員權益', items: ['新增月費與年費免廣告方案；會員資格有效期間，查校、比對與規劃頁面不會載入 Google 廣告或 Offerwall。', '有效會員登入 LINE 後，填妥成績即可直接開始落點分析，不需再輸入系統授權碼。', '方案採一次付款，到期前不會自動續扣。'] },
      { title: '會員帳號', items: ['新增會員帳號頁，可查看目前資格、有效期限與購買紀錄。', 'LINE 登入用於確認與恢復會員資格；可在會員頁登出目前裝置的網站登入工作階段。', '支援在符合條件時提出帳號刪除，避免誤刪仍在有效期間的會員帳號。'] },
      { title: '安全與體驗', items: ['會員資格改由伺服器端驗證 LINE 身分與已完成付款紀錄，不採用瀏覽器可複製的會員憑證。', '登入工作階段採短期 HttpOnly Cookie；登出或工作階段到期後，頁面會恢復一般使用者的廣告與授權碼流程。', '新增會員、售後服務、退款與取消政策、隱私權與服務條款等說明頁面。'] },
    ],
  },
  {
    version: 'v2.4', date: '2026-08-10', title: '分析結果與成績評估介面優化', icon: Sparkles, tone: 'indigo',
    summary: '更新分析結果清單的檢視方式與篩選操作，並調整會考成績換算資訊的呈現，讓閱讀與操作更直覺。',
    sections: [
      { title: '分析結果', items: ['新增卡片與表格檢視切換；表格可直接點擊整列查看學校完整資訊。', '優化手機、平板與桌面版的篩選、清除篩選及推薦清單排版。'] },
      { title: '成績評估', items: ['調整就學區換算積分的顯示格式，清楚區分積分與積點資訊。', '改善寫作級分與同分比序資訊的色彩對比，降低閱讀負擔。'] },
      { title: '易用性', items: ['補強表格、篩選器與彈窗的無障礙標示與鍵盤操作。'] },
    ],
  },
  {
    version: 'v2.3', date: '2026-08-06', title: '各區計分規則與網站導覽全面更新', icon: Sparkles, tone: 'emerald',
    summary: '新增各招生區域的獨立計分規則頁，將原本彈窗保留為會考速覽，完整比序、採計上限與注意事項改由規則頁清楚呈現。',
    sections: [
      { title: '各區計分規則', items: ['新增基北、桃連、中投、彰化、臺南、高雄、竹苗等區域的完整計分對照表，並提供五專優先免試入學規則頁。', '基北區更新為 115 學年度、111 學年度後入學學生適用版本：均衡學習最高 24 分、服務學習最高 12 分。', '竹苗區同步收錄 117 學年度預告採計方式，並明確標示為預告內容，避免與 115 學年度規則混用。'] },
      { title: '閱讀與操作體驗', items: ['計分方式彈窗調整為會考成績換算速覽，加入前往完整規則頁的按鈕。', '規則頁表格支援手機橫向滑動提示、固定第一欄與更合適的手機字級。', '各區規則頁新增推薦閱讀及「核對官方完整簡章」連結，方便延伸查閱。'] },
      { title: '網站地圖與搜尋', items: ['網站地圖新增各區計分規則及五專規則入口。', '搜尋支援多關鍵字篩選、常用別名，以及「臺／台」字詞視為相同，例如可搜尋「高雄 會考」、「基北」或「五專」。'] },
    ],
  },
  {
    version: 'v2.2', date: '2026-08-01', title: '升學資訊架構與內容頁優化', icon: BookOpenCheck, tone: 'indigo',
    summary: '持續整理升學資訊頁面，讓學生可從學校查詢、志願模擬、會考成績到策略說明之間更順暢地切換。',
    sections: [
      { title: '資訊整合', items: ['強化學校類型、技職百科、綜合高中與高二升學路徑等內容入口。', '補充重要時程、歷年統計與常見問題頁面的導覽關聯。'] },
      { title: '頁面一致性', items: ['統一資訊頁的返回首頁、側邊導覽與卡片閱讀版型。', '改善行動裝置上的間距、按鈕與內容層級。'] },
    ],
  },
  {
    version: 'v2.1', date: '2026-05-16', title: '志願規劃工具改善', icon: Rocket, tone: 'amber',
    summary: '優化志願模擬與升學策略相關內容，協助使用者依成績、興趣與校系方向規劃下一步。',
    sections: [
      { title: '志願規劃', items: ['改善模擬志願序的操作流程與結果閱讀。', '整理填志願策略與會考等級說明，降低資訊理解門檻。'] },
      { title: '資料提醒', items: ['在重要資訊頁補充採計條件與年度差異提醒。', '提醒使用者送件前仍須以當學年度官方簡章及招生系統公告為準。'] },
    ],
  },
  {
    version: 'v2.0', date: '2026-05-10', title: '介面改版與導覽重整', icon: History, tone: 'slate',
    summary: '改版資訊頁的視覺層級與導覽方式，讓常用功能、升學工具與說明內容更容易找到。',
    sections: [
      { title: '版面設計', items: ['導入卡片式資訊呈現與更明確的標題層級。', '優化桌機與手機的響應式版面。'] },
      { title: '導覽', items: ['重新整理主要功能入口與相關閱讀連結。', '增加頁面內快速跳轉，縮短查找資訊的時間。'] },
    ],
  },
  {
    version: 'v1.0', date: '2024-05-01', title: '服務正式推出', icon: Wrench, tone: 'slate',
    summary: '建立升學資訊、學校查詢與志願規劃的基礎服務。',
    sections: [
      { title: '核心功能', items: ['提供升學資訊整理、學校探索與會考等級說明。', '提供志願規劃與相關輔助工具。'] },
    ],
  },
];

const latestRelease = releases[0];

export default function ChangelogPage() {
  return <main className="changelog-page">
    <div className="changelog-shell">
      <PageBreadcrumb title="系統更新日誌" />

      <header className="changelog-hero">
        <div className="changelog-hero-copy">
          <p className="changelog-kicker"><History size={17} aria-hidden="true" /> RELEASE NOTES · 系統更新</p>
          <h1>系統更新日誌</h1>
          <p className="changelog-lead">從新功能到操作細節，依版本整理每次重要調整。你可以先看最近更新，再往下查找過去的改動。</p>
          <div className="changelog-hero-meta"><span><CalendarDays size={17} aria-hidden="true" />最後收錄 {updatedAt}</span><span>{releases.length} 筆版本紀錄</span></div>
        </div>
        <a className="changelog-latest" href={`#${latestRelease.version}`}>
          <span className="changelog-latest-label"><Sparkles size={17} aria-hidden="true" />最近更新</span>
          <strong>{latestRelease.version}</strong>
          <span className="changelog-latest-title">{latestRelease.title}</span>
          <span className="changelog-latest-action">閱讀這次更新 <ArrowRight size={18} aria-hidden="true" /></span>
        </a>
      </header>

      <div className="changelog-layout">
        <aside className="changelog-aside">
          <PageNavigation
            title="依版本查看"
            navClassName="changelog-version-nav"
            itemLayoutClassName="changelog-version-list"
            items={releases.map((release) => ({ id: release.version, label: `${release.version} · ${release.title}` }))}
          />
          <p className="changelog-aside-note">版本依發布時間由新到舊排列。</p>
        </aside>

        <div className="changelog-history">
          <div className="changelog-history-heading"><div><span>ALL UPDATES</span><h2>版本紀錄</h2></div><p>共 {releases.length} 筆更新</p></div>
          <div className="changelog-timeline">
            {releases.map((release, index) => {
              const Icon = release.icon;
              return <article key={release.version} id={release.version} className="changelog-release" data-tone={release.tone}>
                <div className="changelog-timeline-marker" aria-hidden="true"><Icon size={18} /></div>
                <div className="changelog-release-card">
                  <header className="changelog-release-head">
                    <div className="changelog-release-meta"><span className="changelog-version">{release.version}</span><time dateTime={release.date}>{release.date}</time>{index === 0 && <span className="changelog-newest">最新收錄</span>}</div>
                    <h3>{release.title}</h3>
                    <p>{release.summary}</p>
                  </header>
                  <div className="changelog-release-sections">
                    {release.sections.map((section, sectionIndex) => <section key={section.title} className="changelog-change-group">
                      <div className="changelog-change-heading"><span>{String(sectionIndex + 1).padStart(2, '0')}</span><h4>{section.title}</h4></div>
                      <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul>
                    </section>)}
                  </div>
                </div>
              </article>;
            })}
          </div>
          <p className="changelog-source-note">計分及招生資訊可能隨公告調整；實際申請請以當學年度官方簡章與招生系統公告為準。</p>
        </div>
      </div>
    </div>
  </main>;
}
