# 資安檢查（2026-10-01）

基準：`be2d870`。檢查前工作目錄乾淨。本次僅新增稽核文件，未修改產品、推送、部署、付款或操作正式會員資料。

## 優先處理

### 1. 高：共編憑證留在網址，分享頁啟動第三方分析

`src/components/ShareReportDialog.tsx:132`、`:155` 產生 `?collab=<key>`；`src/components/SharedReportPage.tsx:84` 從 query 讀取且未移除。`public/bootstrap.js:49` 啟動未設定安全 page_location 的 GA config。`index.html:108` 後的入口沒有載入現存的 collab-fragment-guard。

使用虛構 token/key 離線執行實際 bootstrap，確認第三方分析腳本載入時網址仍帶唯讀 token 與編輯 key。編輯 key 是共編權限憑證，可修改、留言及還原版本；不只影響瀏覽紀錄。query 同時會送入託管層請求。未查看 GA 後台或正式封包，不宣稱已發生外洩或有人利用。

修正：私人與分享路由停止分析、廣告載入；編輯 key 改 fragment，於任何第三方腳本前取出及清除。同步修改新建、換發、舊連結讀取流程。任何保留的分析事件只使用不帶憑證的固定路由。評估既有編輯 key 換發及历史遙測清理。

驗收：新舊連結、換發及重新整理均正常；所有第三方請求不包含讀取 token 或編輯 key。

### 2. 中：可推算的邀請碼跳過資料庫使用次數限制

`supabase/functions/backend/index.ts:660` 接受固定前綴加台北年月日時（當小時及上一小時）。命中直接有效，不執行 consume_invitation_code，因此繞過 active、expires_at、max_uses。

離線執行實際函式，確認推算值被接受且 consume RPC 呼叫為 0。影響分析入口控管，不會直接取得會員或管理員權限。若此入口原本就是公開功能，應明確當成公開入口。

修正：取消時間碼捷徑，統一使用不可預測、資料庫原子消耗的邀請碼。驗收過期、停用、額度耗盡與並發請求。

### 3. 套件風險：brace-expansion 的兩個鎖定版本命中已知 DoS

`package-lock.json:1808` 為 1.1.18，`:3437` 為 2.1.4。向 npm security advisories bulk API 查詢 302 個套件名稱，命中此套件的三則公告，最高公告嚴重度 high。上游不可信 glob pattern 可造成堆疊耗盡或 CPU 阻塞。

目前依賴鏈含 ExcelJS、archiver、glob/minimatch；本次沒有證明網站對外輸入可到達受影響函式，因此不把公告的 high 直接等同本站可遠端利用的高風險，也不是資料竊取或程式碼執行證據。

修正：依相容分支更新至少 1.1.21、2.1.7，重新產生 lock、查詢公告並驗證匯出及建置。

上游原始公告：[CPU 阻塞與修正版](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-q2hr-2g5m-vwhr)、[堆疊耗盡](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-6j4f-fj2g-mc7p)、[巢狀括號耗盡](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-qhr7-859c-m2p7)。完整查詢見 dependency-advisories.json。

### 4. 中：正式首頁缺少反嵌入 HTTP 標頭

對 https://tyctw.github.io/spare/ 執行單次 HEAD，200 且有 HSTS，沒有 CSP HTTP header／X-Frame-Options。`public/_headers` 雖有 frame-ancestors 與 DENY，實際此回應未套用；index.html 的 meta CSP 無法提供 frame-ancestors 防護。

可能遭外站嵌入誘導點擊；未實測針對會員的 clickjacking。需在實際託管層回傳 `Content-Security-Policy: frame-ancestors 'none'` 及 `X-Frame-Options: DENY`，驗證會員、分享路由與首頁。純前端檔案修改不能保證 GitHub Pages 提供這些標頭。

### 5. 中：持久資料缺少容量管理

`supabase/functions/backend/index.ts:1546` 持續新增成績，讀取 limit(30) 不是儲存上限；`supabase/migrations/20260908000100_add_volunteer_versions.sql` 持續插入完整版本及事件，讀取 limit(100) 不是歷史上限。限流 migration `20260919000200` 最後的 DELETE 只執行一次，沒有持續清理 rate-limit bucket 的排程。

現有 IP 限流、64KiB body cap、分享期限及分享清理降低短期濫用，但持續流量仍可能增加容量／費用。正式平台額外配額未知。設定帳號成績、分享版本與事件上限，並排程清理過期限流桶、建立容量告警。

### 6. 中（平台防護未確認）：LINE 登入起始端沒有應用層限流

`supabase/functions/line-login/index.ts:30` 起始 GET 只驗證公開 browserChallenge 格式便插入交易；不經 backend 的 rate-limit handler。兩個 LINE fetch 亦未設定明確 timeout。登入交易已有每十分鐘清理排程，不列為「永遠不清理」。

可能造成交易寫入與函式成本濫用；未做壓力測試，也未查 Supabase/WAF 限制。建議登入開始及 callback 獨立限流、限制外部請求時間，確認平台額度與告警。

### 7. 部署完整性：migration 版本重複，後端部署仍待確認

離線檔名檢查確認 `20260807000100` 與 `20260807000200` 各有兩個 migration。先核對正式 migration history，制定唯一版本與 repair 流程；不要任意重命名已部署檔案或直接盲目 db push。

目前 `.github/workflows/deploy.yml` 部署前端 Pages，未部署 Supabase functions 或 SQL。Git 推送成功不代表登入、付款與刪帳的後端修正已正式套用。

## 已確認的本地防護與測試

- LINE 登入採伺服器一次性交易、PKCE、nonce 及獨立 browser verifier；27 項登入／Cookie／付款安全測試全部通過，含重放、過期、競爭兌換、舊 token 拒絕及第三方 Origin 拒絕。
- session 與付款查詢憑證使用 HttpOnly、Secure Cookie，不再將長效登入 token 存入 localStorage。會員 cookie 有 Partitioned；須另驗證實際瀏覽器跨站 Cookie 相容性。
- 管理權限驗證 Supabase JWT 並查 admin_users；個人成績查詢／刪除核對 LINE owner。僅查程式與 migration，未核對正式 DB grants/RLS。
- ECPay callback 驗 MAC、商店 ID、金額及模擬付款，会员結算使用原子 RPC。此輪是程式審查，未向正式付款端送測試通知。
- 刪帳分享清除 migration 已在 repo；本次未重新執行隔離 PostgreSQL 測試，也未確認正式套用，不能直接沿用舊報告說「仍未修正」。
- 262 個 tracked 檔案與本地所有 refs 文字 diff（約23.2MB）未命中已知高辨識度秘密格式。沒有證明任意密碼、未追蹤檔案、遠端 Secrets 或二進位歷史不存在秘密。
- 列印 HTML 動態值有 escapeHtml；本次未確認可利用的 XSS、SQL injection、SSRF 或管理員越權。

## 範圍與後續

檢查前端、backend／line-login／ecpay-callback、敏感資料 migrations、分享權限、Cookie、部署流程、套件 lock 與秘密格式。使用本地 mock／程式碼、套件公告查詢及一次正式首頁 HEAD；未對正式資料庫或 API 發起漏洞利用、刪帳、大量請求或付款。

未取得正式 Supabase secrets、migration history、資料表權限、WAF、GA 後台、告警及完整日誌。無法保證正式環境安全或本地修正已部署。本次沒有修改產品程式及發布設定。

建議順序：先修分享憑證與第三方載入，再處理邀請碼及套件；核對後端部署與 migration history，接著處理託管標頭、登入限流及資料容量管理。
