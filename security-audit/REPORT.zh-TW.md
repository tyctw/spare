# 專案資安檢查報告

檢查日期：2026-09-19。對象：本地 spare-main 專案快照。

修復狀態：登入交換碼與共編網址問題已修正並完成回歸檢查；其餘項目仍待處理。

## 2026-09-19 回歸檢查

已確認：交換碼現在以資料庫中的 `binding_hash` 比對 HttpOnly、Secure、SameSite=None、Partitioned Cookie；跨 GitHub Pages／Supabase 的合法跨站請求可攜帶它，其他瀏覽器沒有綁定 Cookie 時無法兌換。共編金鑰先放在 fragment，再由 `public/collab-fragment-guard.js` 在 head 階段同步移除，React 只讀取記憶體值。

仍未解決：`consume_api_rate_limit` RPC 仍沒有出現在 migrations；migration 版本 `20260807000100` 與 `20260807000200` 各有兩個檔案；帳號刪除後的分享清理、可預測邀請碼、實際部署反嵌入標頭、儲存容量配額仍需處理。這些問題不因本次兩項修復而自動消失。

## 結論與範圍

發現 2 項高風險、4 項中風險及 1 項部署完整性問題，應先處理登入交接與協作金鑰外洩。這是程式碼與設定審查，搭配離線重現、套件漏洞資料庫查詢和一次公開首頁 HTTP HEAD 檢查；不是正式站完整滲透測試或安全認證。沒有修改產品程式碼、付款資料或正式資料庫。

涵蓋 React 前端、3 個 Supabase Edge Functions、SQL migrations、付款與 LINE 登入、分享與協作權限、列印 HTML、瀏覽器儲存、CI 與部署設定、npm lockfile。未取得正式 Supabase 權限與 Secrets，無法確認已套用 migrations、實際 RLS/GRANT、WAF、備份、稽核日誌、告警及第三方分析後台設定。資料夾沒有 .git，無法檢查歷史提交。兩個 ZIP 僅列出項目並檢查常見敏感檔名，未全面分析內文。

## 1. 高：登入交換碼可注入其他瀏覽器（登入 CSRF／工作階段置換）

位置：`supabase/functions/line-login/index.ts:65-71`、`supabase/functions/backend/index.ts:1554-1568`、`public/auth-fragment-guard.js:5-23`。

LINE 原始 OAuth 流程有 state、nonce、PKCE；但完成後另發行的 line_login_exchange_codes 只綁定 session，未綁定發起登入的瀏覽器。前端看到 fragment 就自動兌換，後端只驗證代碼、期限與 used_at，接著覆寫登入 Cookie。

成立情境：攻擊者以自己的 LINE 完成登入，攔住尚未兌換的回跳網址，再讓受害者於十分鐘內開啟該網址。受害者會登入攻擊者帳號；若繼續儲存成績或購買方案，資料或權益會歸到攻擊者。這不是直接竊取受害者既有帳號。允許 Origin 與一次性兌換均無法阻擋，因兌換是從真正網站發出。

驗證：離線執行原始 fragment guard，確認未發起登入也會送出兌換請求；後端缺少瀏覽器綁定已逐段檢查。未用真人帳號執行端到端攻擊。

修正：在前端啟動登入時建立每次交易專屬的隨機 verifier，將 challenge 綁入登入流程及交換碼，兌換時驗證原始 verifier；或以同站後端 Cookie 完整維持登入交易。須涵蓋跨站與 Partitioned Cookie 行為，不能只把 state 字串放回 URL。

驗收：A 瀏覽器取得的未使用交換碼，在 B 瀏覽器兌換必須失敗；原瀏覽器正常登入成功、重放失敗、過期失敗。

參考：[RFC 9700 授權碼注入與交易綁定](https://www.rfc-editor.org/rfc/rfc9700.html#section-4.5)。這裡將相同原則套用於自訂交換碼。

## 2. 高：協作網址含編輯憑證，會暴露給第三方程式與預設分析事件

位置：`src/components/ShareReportDialog.tsx:127-128`、`src/components/SharedReportPage.tsx:98`、`public/bootstrap.js:45-50`。

共編連結使用 `?collab=<key>`，頁面讀取後沒有清除。bootstrap 載入 Google Analytics 並以預設 config 啟用頁面事件；第三方程式也可直接讀取網址。該金鑰搭配路徑中的分享 token 就能呼叫留言、修改、還原與確認版本，不需會員登入。只看分析資料的人因而可能取得實際編輯能力。

Google 官方文件載明 page_view 預設開啟，page_location 預設取頁面網址。因此依現有程式與預設設定，網址會進入分析流程；尚未檢查正式 GA 的遮罩設定或擷取實際傳輸封包，不能宣稱已有人取得金鑰。一般跨站 Referrer 限制無法阻擋程式主動讀取 URL。

修正：共編與私人分享頁停用第三方分析／廣告；金鑰改用 fragment 並在載入第三方程式前同步移除，存於記憶體或交換成限權工作階段。僅改 fragment 仍不足，第三方 JavaScript 一樣能讀 fragment。分享路徑中的讀取 token 也要排除於遙測。檢查歷史分析與存取日誌，必要時換發已暴露金鑰。

驗收：以虛構 token/key 開啟分享頁，所有第三方請求、分析事件、瀏覽器後續可見 URL 均不得含憑證；舊 key 換發後不能寫入。

參考：[Google Analytics 頁面瀏覽事件與 page_location](https://developers.google.com/analytics/devguides/collection/ga4/views)。

## 3. 中：內建邀請碼可依時間推算，繞過發碼及使用次數限制

位置：`supabase/functions/backend/index.ts:647-676`、`:2015-2018`。

固定前綴加台北年月日時即被視為有效，接受目前與上一小時；走這個分支時不查資料庫的 active、expires_at、max_uses，也不消耗 use_count。任何知道規則的人都能自製有效邀請碼，使用原本需有效邀請碼或會員的分析功能。

驗證：離線執行原始 validateInvitationCode，consume=true 時可接受由公開時間生成的值，且未呼叫 consume_invitation_code。此缺陷不會授予管理員權限，也不會啟用付費會員。

修正：移除可預測的特殊碼，統一由資料庫原子消耗隨機碼；若本來就是公開入口，則取消將該碼視為存取控制的設計。

## 4. 中：帳號刪除後，個人分享與協作權限仍存活

位置：`supabase/migrations/20260906000200_add_member_score_records.sql:21-37`、`supabase/functions/backend/index.ts:1667-1693`。

最新 delete_membership_account 刪除成績與登入 session、解除付款 LINE 關聯，但沒有處理 shared_reports.owner_line_user_id、分享 payload、共編金鑰與相關歷史。分享讀取／協作不要求擁有者帳號存在，因此在原到期日前仍能被原連結持有人使用；期限可達 90 天。

這是資料生命週期缺口：刪除帳號並不會終止該帳號建立的分享，也保留可連回 LINE 的識別值。付款記錄另含 email／payer_name，單純清除 line_user_id 不能稱為完全匿名化，應明確區分依法／業務需要保留的紀錄與刪除範圍。

修正：在同一交易內撤銷或刪除帳號所屬分享，移除 owner identity，依既定政策清理 payload、events、versions；刪除畫面明確說明財務資料保留範圍。避免只刪 owner 而讓 bearer 連結繼續有效。

驗收：建立分享、刪帳後，原唯讀及共編連結均無法使用；確認資料庫殘留欄位符合實際承諾。未執行正式刪帳。

## 5. 中：GitHub Pages 實際首頁沒有反嵌入安全標頭

位置：`.github/workflows/` 的 GitHub Pages 部署流程、`public/_headers`、`index.html:14`。

本次對 `https://tyctw.github.io/spare/` 發出一次 HEAD，回應 200，有 HSTS，但無 Content-Security-Policy HTTP header，也無 X-Frame-Options。本地雖有 `_headers`，GitHub Pages 不會依 Cloudflare 格式套用它。meta CSP 未提供反嵌入防護；frame-ancestors 本來就必須由 HTTP header 提供。

這使該受查 URL 缺少 HTTP 層的點擊劫持防護；Cookie 分區、是否登入與頁面操作會影響實際攻擊效果。未搭建惡意 iframe 或操作使用者帳號。其他正式網域是否有防護尚未驗證。

修正：在實際提供內容的平台加入 `Content-Security-Policy: frame-ancestors 'none'` 與 `X-Frame-Options: DENY`，逐條路由驗證。若遷移 Cloudflare，補齊 README 宣稱存在但目前缺少的部署設定。

參考：[MDN frame-ancestors 不支援 meta](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors)。

## 6. 中：持久化寫入僅有每 IP 速率，缺少帳號與分享總量上限

位置：`supabase/functions/backend/index.ts:1526-1541`、`:1617-1663`、`supabase/migrations/20260908000100_add_volunteer_versions.sql:47-77`。

成績每次 insert，沒有每帳號筆數上限；讀取 limit(30) 只限制顯示。協作每次修改都保存完整 choices 快照，history 的 limit(100) 不刪舊版本。公開分享可選 90 天，沒有全站／使用者容量配額。每 IP 限流不能限制長時間累積或多 IP 濫用。

風險：持有帳號或有效共編連結者可持續增加儲存量與處理成本；匿名分享也提供持續寫入面。現有 64 KiB request cap、速率限制與到期分享清理確實降低單次及短期風險，因此未評為高風險。未進行大量寫入或壓力測試。

修正：用交易／鎖保證每帳號成績、每分享版本與事件、每帳號分享容量的上限，加入保留政策與總量告警；匿名建立分享可搭配人機驗證或較短到期。

## 7. 部署完整性：限流 RPC 缺失及 migration 版本重複

位置：`supabase/functions/backend/index.ts:578-595`、`:2185-2188`，以及 `supabase/migrations/`。

每個 backend POST 執行前都呼叫 consume_api_rate_limit，但全部現有 migration 都沒有建立此函式。從此快照新建環境，將在 RPC 出錯後回傳 500，無法正常服務。這是 fail-closed 可用性問題，不能說是限流被直接繞過；正式環境可能曾手動建立，尚未確認。

另有兩組重複 migration version：20260807000100、20260807000200，各對應兩個 SQL 檔。已用離線檔名檢查確認；未以 Supabase CLI 對資料庫重播，實際錯誤取決於 CLI／歷史狀態。重複版本會使安全修補的套用與追蹤不可靠。

修正：補入限流資料表、原子 RPC、RLS、service_role-only execute 及清理策略；比對正式 migration history 後制定唯一版本的修復流程，不要直接任意改已部署 migration 檔名。建立乾淨測試資料庫驗證完整重建。

## 其他強化事項（未列為已確認漏洞）

- vite.config.ts 將 GEMINI_API_KEY 放入前端 define。目前未找到程式引用或實際金鑰，不能宣稱已外洩；應移除，避免未來引用時被打包。
- npm audit 本次回報 0 已知漏洞，統計 351 相依項目；不等於沒有未知漏洞。Edge Functions 使用浮動 `npm:@supabase/supabase-js@2`，不受此 package-lock 與 npm audit 結果涵蓋。
- 常見高辨識度金鑰格式掃描未命中，沒有 .env 檔；不涵蓋 git 歷史、正式 Secrets 或 ZIP 內文。公開 anon key 本身不是 service-role secret。
- CI actions 使用 major tag 而非 commit SHA；可固定版本以降低供應鏈變動。安裝過程有過時套件警告，與本次 audit 漏洞數是兩件事。
- LINE callback 未見應用層限流，callback body reader 未設期限；平台是否已有 WAF／時間限制未知。
- 個資 API 的 no-store 清單未涵蓋會員狀態、交易歷史等端點；建議統一設定，但未發現實際跨使用者快取洩漏。

## 已確認的正向防護

- 管理操作以 Supabase getUser 驗證 JWT，另查 admin_users，而非只信任前端或公開 anon key。
- 私人資料表啟用 RLS；多數敏感表明確撤銷 anon/authenticated 權限；敏感 SECURITY DEFINER RPC 限 service_role 並固定 search_path。正式 DB 狀態未驗證。
- backend 逐次要求允許清單內的 Origin、JSON Content-Type，採 HttpOnly/Secure Cookie，限制 request body；Origin 是瀏覽器 CSRF 防護，並非服務端身分憑證。
- 付款驗章、MerchantID、金額核對、拒絕模擬付款、pending 條件更新；會員結算有 row lock 及使用者級 advisory lock。
- 分享讀取不回傳共編 key；寫入驗證 key、撤銷與期限；版本更新在 DB 交易中檢查 expected version。
- 列印路徑檢查到 HTML escaping；未確認可利用的 XSS、SQL 注入、任意 URL fetch／SSRF 或管理員越權。

## 驗證紀錄與後續順序

`npm run lint`（TypeScript 型別檢查）通過；`npx vite build` 通過。建置時未提供 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY，故只確認編譯成功，不代表後端連線或登入付款可用。另有資產大小與重複匯入警告。為避免 prebuild 更新 sitemap 日期，直接執行 Vite；未執行完整 npm build 前置流程。沒有 Deno/PostgreSQL 執行環境，未跑 Edge Functions 與 SQL 整合測試。

可用 `node security-audit/reproduce.mjs` 重跑四項離線檢查。它只執行本地函式與模擬請求，不連正式 API。測試通過表示成功重現上述弱點或缺漏，不表示已修復。

先處理 1、2，再修復資料庫部署完整性與 3–6。正式環境下一階段需要在測試帳號與測試資料庫上驗證：跨瀏覽器登入注入、不同帳號的資料隔離、匿名直接 REST/RPC 拒絕、金額竄改／callback 重放、共編 key 換發／撤銷／並發更新、刪帳清理、實際限流與所有私人路由安全標頭。
