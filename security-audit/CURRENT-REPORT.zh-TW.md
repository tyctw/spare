# 全面資安檢查：目前工作目錄

> 後續修復：第 1 項已在本地程式修正，尚未部署。OAuth state 改為伺服器端一次性交易，瀏覽器僅傳 challenge，兌換需本地 verifier；舊版交換碼被拒絕。新增 13 項離線安全回歸測試。下文保留原檢查證據，部署步驟與限制見 `LINE-LOGIN-FIX.zh-TW.md`。其他發現不在本次修復範圍。

> 後續修復（二）：第 3 項的會員 session 已改為 HttpOnly、Secure、Partitioned Cookie；移除 JSON token、localStorage 副本與自訂登入標頭，拒絕舊 session。兩套離線測試共 22 項通過，尚未部署；見 `COOKIE-SESSION-FIX.zh-TW.md`。付款查詢 token 與第三方腳本的其他風險仍未修復。

檢查日期：2026-09-19。基準：Git HEAD `11d7904`，包含檢查開始前已存在的 `index.html`、`public/auth-fragment-guard.js` 未提交修改。

## 結論

確認 **2 項高風險、5 項中風險、1 項部署完整性問題**。優先修正 LINE 登入秘密的傳遞方式，以及共編網址進入第三方分析的路徑。風險等級依可能影響與利用條件判定，不代表已有攻擊事件。

本報告取代舊 `REPORT.zh-TW.md` 對「目前版本」的判斷。舊報告保留作歷史紀錄；它所稱的 Cookie 綁定與共編 fragment 修復，與現在實際程式不同。限流 RPC 已補入，不再列為缺失。舊 `reproduce.mjs` 也不適用，請使用 `verify-current.mjs`。

本次完成前端、三個 Edge Functions、SQL migrations、OAuth、會員與管理權限、付款驗證、分享與共編、瀏覽器儲存、輸出 HTML、CI、套件及 Git 歷史敏感資料格式檢查。採程式碼審查、離線模擬、npm 漏洞查詢與公開首頁一次 HEAD；未對正式 API 發起攻擊、付款、刪帳或大量請求。

## 1. 高：登入秘密與交換碼一起傳遞，無法提供獨立瀏覽器綁定

位置：`supabase/functions/line-login/index.ts:26`、`:61`、`:78`、`:105`；`supabase/functions/backend/index.ts:1570`；`public/auth-fragment-guard.js:17`。

OAuth `state` 是 Base64URL JSON，包含 `verifier`、`nonce`、`browserBinding`，沒有簽章、伺服器端交易比對或自身到期驗證。註解稱 signed JSON，但實際只有編碼。PKCE verifier 因而出現在授權 URL，回到 callback 時又與 authorization code 一起出現。

自訂回跳網址再把 `line_login_code` 與 `line_login_binding` 同時放入 fragment。後端兌換只檢查這兩個由請求提供的值、有效期限與未使用狀態；沒有獨立 Cookie／瀏覽器 verifier。取得完整未使用回跳網址的人可直接呼叫後端兌換，並得到 JSON 內的 sessionToken。非瀏覽器客戶端可以自行填入 Origin；公開 anon key 也不是阻擋條件。

前端 localStorage 比對有阻擋「另一瀏覽器直接開啟攻擊者網址就自動登入」的作用，本次已確認，因此不沿用舊版對自動登入 CSRF 的無條件結論。但前端比對不能約束直接 API 呼叫，也不能保護已外洩的整組 code + binding。收到錯誤／過期 binding 時，guard 在清除 fragment 前直接返回，亦留下 URL 被後續第三方程式讀取的機會。

**利用條件與限制：** 攻擊者仍需取得未使用、未過期的完整 callback／回跳資料，例如網址轉貼、紀錄外洩或瀏覽器端讀取；不能僅知道 LINE ID 就登入。修改 state 本身也不等於能偽造 LINE 的 token：真正的 code、nonce 仍會送 LINE 驗證。本次使用假資料與 mock DB 驗證秘密可解碼、state 可竄改與兌換分支不要求額外秘密；未冒用真人帳號測試。

**修正：** 伺服器保存短效、一次性 OAuth 交易，URL 僅放隨機 state；PKCE verifier 不離開伺服器。前端登入前產生 verifier，僅把 challenge 綁入交易與交換碼；兌換時提供原始 verifier，不能把它放在回跳 URL。跨站 Cookie 不可靠時可用此 challenge 機制，或改同站 BFF。所有成功與失敗分支都應先同步移除敏感 fragment，再啟動其他程式。單純替 state 加簽章仍會暴露 verifier，並不足夠。

**驗收：** A 的回跳網址複製到 B 後，B 即使直接呼叫 API 也無法兌換；A 正常登入成功；重放、過期、state 竄改拒絕；失敗頁 URL 不殘留憑證。

依據：[RFC 9700](https://www.rfc-editor.org/rfc/rfc9700.html) 的 OAuth 交易綁定與 PKCE 原則。

## 2. 高：共編讀寫憑證保留在網址，分享頁照常啟動分析

位置：`src/components/ShareReportDialog.tsx:124`、`:149`；`src/components/SharedReportPage.tsx:84`；`public/bootstrap.js:49`；`src/main.tsx:164`；`index.html:108`。

現行新增、換發連結均使用 `/shared/<token>?collab=<key>`，讀取端也從 query 取 key，未清除。分享頁會啟動預設 GA config，沒有移除 page_location 中的 token/key，也沒有排除私人路由。`public/collab-fragment-guard.js` 雖存在，但 index.html 沒有載入它，現行產生器亦未用 fragment。

Google 文件說明預設 config 會送 page_view，page_location 預設來自頁面網址。因此依現行程式和預設行為，第三方分析會接收到包含分享憑證的網址；共編 key 在 query，也會隨頁面 HTTP 請求送到託管平台。讀取憑證可查看成績／志願內容，共編憑證可留言、修改、還原與確認版本，不另要求會員登入。

**證據與限制：** 離線執行實際 bootstrap，確認帶虛構共編 query 的分享頁啟動 gtag，URL 未改變。沒有取得 GA 後台、正式網路封包或歷史存取紀錄，不宣稱已有第三方取用資料。

**修正：** 分享與登入／個人資料路由停止載入分析及廣告；共編 key 改 fragment 並在其他腳本之前取出、移除，讀取端同步改用安全狀態。分析若保留，必須使用不含憑證的固定路由名稱，涵蓋自動 page_view、history 事件與所有事件參數；僅設定 Referrer-Policy 不足。檢查歷史遙測與日誌、評估換發編輯金鑰及撤銷舊分享。

**驗收：** 用假讀取 token、共編 key 開啟分享，所有第三方請求均不含這兩個值；新舊連結轉換、撤銷與換發行為一致。

依據：[Google Analytics pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views)、[page_location 設定](https://developers.google.com/analytics/devguides/collection/ga4/reference/config)。

## 3. 中：長效會員憑證存入 localStorage，HttpOnly 無法防止其被讀走

位置：`public/auth-fragment-guard.js:39`；`src/lib/membership.ts:63`；`src/lib/api.ts:83`；`supabase/functions/backend/index.ts:363`、`:1587`。

兌換成功後將 sessionToken 存入 localStorage，每次 API 以 X-Line-Session 傳送；後端接受此 bearer 憑證。雖另設 HttpOnly Cookie，同一 token 的 JavaScript 可讀副本讓 Cookie 的防竊取效果失去意義。bootstrap 在登入完成後仍載入分析，非付費帳號亦可能載入廣告。任何在同 origin 執行的惡意／受入侵第三方腳本，都可讀取並帶走有效約一天的憑證。GitHub Pages 同一主機的其他專案路徑也共享 localStorage 邊界。

這是已確認的憑證暴露面，**不是已確認 XSS，也不代表 Google 正在讀取 token**；利用前提是同 origin 腳本不可信、遭入侵或另有注入。付款查詢 token 亦有 localStorage 副本，影響較小但應一起處理。

**修正：** 採同站 BFF／HttpOnly 工作階段，不向前端 JSON 回傳長效 sessionToken；敏感頁移除第三方腳本。若須暫時採前端 token，使用記憶體、短效與換發撤銷策略，清楚接受其殘餘風險。改 sessionStorage 仍可被 JavaScript 讀取，不能視為完整修復。

依據：[OWASP HTML5 Security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)。

## 4. 中：可推算邀請碼绕過發碼與次數限制

位置：`supabase/functions/backend/index.ts:667`–`:690`，以及 analyzeScores 分支。

固定前綴加台北年月日時，接受本小時及上一小時。命中後即跳過資料庫 active、expires_at、max_uses 與原子 consume。離線執行實際 validateInvitationCode，成功接受推算值，RPC 呼叫次數為 0。

影響是取得需邀請碼的分析功能，不會變成管理員或付費會員。若本意就是公開入口，則此設計不應被當作存取控制。

**修正／驗收：** 移除時間碼特殊分支，統一使用不可預測的資料庫邀請碼並原子消耗；驗證過期、停用、用盡及並發超額均失敗。

## 5. 中：刪帳沒有撤銷個人分享及清理共編資料

位置：`supabase/migrations/20260906000200_add_member_score_records.sql:21`；`supabase/functions/backend/index.ts:1598`、`:1686`。

最新 delete_membership_account 只清除成績、session，並把付款 line_user_id 設 null；沒有刪除／撤銷 shared_reports、owner_line_user_id、payload 或版本事件。分享讀寫以 bearer token/key 判斷，不要求擁有者仍有帳號。非有效付費會員成功刪帳後，既有分享仍可在原到期日前使用，新分享可達 90 天。

付款資料尚有 contact_email、payer_name 與 callback_payload；清除 LINE ID 不等於完全匿名化。此處是資料生命週期與產品承諾問題，未作法律合規判定。

**修正／驗收：** 同一交易內撤銷或刪除該帳號所有分享並清理版本、事件與 owner；明確定義付款資料保留欄位。測試刪帳後舊唯讀與共編連結失效，並處理刪帳與新增分享同時發生的情況。

## 6. 中：公開 GitHub Pages 首頁未提供反嵌入標頭

位置：`.github/workflows/` 的 Pages 部署；`public/_headers`；`index.html:14`。

2026-09-19 09:01 UTC 對 `https://tyctw.github.io/spare/` 的 HEAD 回傳 200，有 HSTS，未見 Content-Security-Policy HTTP header 或 X-Frame-Options。現有 meta CSP 沒有反嵌入能力；Cloudflare 格式的 `_headers` 不會由 GitHub Pages 套用。

可能讓 UI 被外站嵌入誘導點擊，實際敏感操作是否可利用會受 Cookie／瀏覽器與登入狀態影響；本次沒有執行 iframe 攻擊。僅驗證此首頁，其他網域與路由未知。

**修正／驗收：** 在實際託管層回傳 `Content-Security-Policy: frame-ancestors 'none'`、`X-Frame-Options: DENY`，逐條私人與分享路由驗證。README 宣稱存在的 wrangler.jsonc 在本快照缺少，Cloudflare 部署不能僅依 README 判定已完成。

## 7. 中：持久資料缺少總量上限，限流桶亦沒有持續清理

位置：`supabase/functions/backend/index.ts:1542`、`:1636`；`supabase/migrations/20260908000100_add_volunteer_versions.sql:47`、`:75`；`supabase/migrations/20260919000200_add_api_rate_limit.sql:52`、`:71`。

成績每次 insert，讀取 limit(30) 不會限制儲存筆數；共編每次保存完整快照，history limit(100) 不會刪除舊版本。公開分享只有每 IP／時間窗速率，沒有帳號或全站容量配額。更直接的新增缺口：api_rate_limits 以 client/action/window 為主鍵，時間窗一直增加；檔案結尾 DELETE 只在 migration 執行一次，沒有排程持續刪除過期桶。因此一般長期流量本身就會造成累積。

64 KiB body cap、IP 限流及分享到期刪除已有降低短期濫用，不能說完全沒限制；正式平台可能另有配額與排程，本次未確認。未做壓力或大量寫入測試。

**修正／驗收：** 設每帳號成績／分享、每分享版本／事件上限，交易內保證並發安全；對 rate-limit 桶與各類日誌設定索引、定期分批清理和容量告警。驗收配額耗盡、跨 IP、連續多時間窗與到期清理。

## 8. 部署完整性：兩組 migration 版本重複

以下版本各有兩個檔案：

- `20260807000100`：add_school_admission_quotas、replace_admin_code_with_auth_roles。
- `20260807000200`：purge_expired_shared_reports、remove_school_admission_quota_year。

此缺口讓安全更新套用及 history 追蹤不可靠。离線檔名檢查已重現；未在乾淨 PostgreSQL 重播，不能宣稱每一現有環境均已部署失敗。

**修正／驗收：** 先對照正式 migration history，制定唯一版本與 repair 流程，再在新測試 DB 全量重建。不要直接任意重命名已套用檔案。`20260919000200` 現在已定義 service_role-only 限流 RPC，因此舊版「缺少 RPC」結論已撤回。

## 其他強化項目

- `vite.config.ts` 仍定義前端 `process.env.GEMINI_API_KEY`。目前未發現引用／實際金鑰，不列為已外洩；建議移除以免日後誤打包。
- Edge Functions 使用浮動 `npm:@supabase/supabase-js@2`，npm audit 不涵蓋它；應固定與鎖定 Deno 依賴。
- CI actions 使用 major tag；建議固定 commit SHA，加入型別、安全回歸及 migration 重建檢查。目前 CI 僅搜尋 browserBinding 字樣，不能驗證安全性。
- getMembershipStatus、getMembershipPurchaseHistory、getLineLoginSession、redeemLineLoginCode 等未統一 no-store；尚未發現實際跨使用者快取外洩。
- LINE handler 未见應用層限流與外部 fetch timeout；付款 callback 讀取 body 雖限制大小，未設讀取期限。平台限制／WAF 未驗證。
- `.gitignore` 未全面忽略 `.env`、`.env.production` 等檔案，應建立秘密管理與提交前掃描規則。

## 已確認存在的防護

- 管理操作呼叫 Supabase getUser 驗證 JWT，另查 admin_users；並非僅相信前端或 anon key。
- 個人成績與管理分享查詢帶入經驗證的 LINE owner，刪除成績也同時匹配 id 與 owner。
- 敏感資料表啟用 RLS，多數撤銷匿名／authenticated 權限；敏感 RPC 固定 search_path 且限制 service_role。僅確認 migrations 描述，未查正式 DB。
- 後端 POST 要求允許的 Origin 與 JSON Content-Type，限制 body 大小並使用資料庫限流；Origin 在此是瀏覽器 CSRF 防護，不是服務端身分驗證。
- 付款 callback 驗 CheckMacValue、MerchantID、金額、模擬付款標誌及 pending 狀態；會員結算使用 row lock／使用者級 advisory lock。未確認付款偽造漏洞。
- 分享讀取不回傳 editor key；共編 DB RPC 檢查 key、撤銷、期限與 expected version。列印動態字串有 HTML escaping；本次未確認可利用的 XSS、SQL injection、SSRF 或管理員越權。

## 驗證紀錄與範圍限制

| 檢查 | 結果 |
| --- | --- |
| npm audit --json | 0 已知漏洞，metadata 共 351 dependencies；不代表無未知漏洞 |
| npm run lint | 通過；實際是 TypeScript 型別檢查 |
| npx --no-install vite build --outDir security-audit/build-check | 通過；有缺少 Supabase build env、資產大小與重複匯入警告 |
| node security-audit/verify-current.mjs | 7 項觀察通過，僅離線 mock／原始碼檢查，沒有正式 API 請求 |
| node security-audit/scan-secrets.mjs | 166 個 tracked 檔案與所有本地 refs 的 Git 文字 diff 未命中所列高辨識度秘密格式 |
| Git 歷史 | HEAD 可達 563 commits；掃描文字 diff 約 14.45 MB，不含二進位、reflog 或未抓取的遠端歷史 |
| 兩個 ZIP | 151／173 entries，僅檔名檢查，未見常見 .env／私鑰檔名；未全面分析壓縮檔內文 |
| 公開首頁 HEAD | 200，有 HSTS，缺少 CSP HTTP header／X-Frame-Options |

秘密掃描涵蓋私鑰標記、常見 GitHub／Google／OpenAI／AWS access ID／Supabase secret 格式，以及 JWT payload 的 service_role；不涵蓋任意密碼、所有服務的 token 或所有未追蹤檔案。報告和輸出不列出秘密值。

建置未跑 prebuild，以免改 sitemap；未提供 Supabase URL／anon key，因此編譯成功不代表登入或付款可用。未取得正式 Secrets、DB 權限、GA 後台、WAF、備份、告警與完整日誌；本機未找到 Deno／psql／Docker，未做 Edge Functions／SQL 整合重播。驗證產生的 build-check 暫存目錄仍留在 security-audit，清除命令被自動執行政策拒絕。

未改產品程式、既有未提交修改、正式設定或資料。新增報告、離線驗證與不含機密值的結果。後續測試應在測試帳號／資料庫完成跨瀏覽器交易綁定、各角色 REST/RPC 權限、付款重放、共編撤銷與並發、刪帳清理、速率與容量限制，再查正式環境是否部署相同版本。
