# 會員憑證改為 HttpOnly Cookie

## 修復結果

會員憑證只透過 `Set-Cookie` 傳送，登入交換 JSON 僅回傳 `{ authenticated: true }`。Cookie 名稱改為 `__Secure-line_membership_session_v2`，使用 HttpOnly、Secure、SameSite=None、Partitioned，限定 `/functions/v1/backend`、不指定 Domain，有效期最多 24 小時，後端仍檢查資料庫到期時間。

前端停止讀取／寫入會員 token，也不再送 X-Line-Session。啟動 guard 和會員初始化主動移除舊 localStorage 副本。後端停止接受 X-Line-Session 與 UUID Bearer 作為會員身分；Supabase gateway 所需 anon Authorization 及管理員 JWT 驗證不受影響。

新增 `line_login_sessions.cookie_only`，既有資料預設 false；只有新版登入流程建立的 session 設 true。所有會員查詢要求 true，因此攻擊者即使持有舊 token 並手工放進新版 Cookie，也無法重新使用。舊 session 保留到既有到期清理，並不會被自動升級為可信；部署後所有舊登入須重新登入。舊交換碼若指向舊 session 也不能取得新版 Cookie。

登入交換後會再查一次 getLineLoginSession，驗證瀏覽器真的送回 Cookie。Cookie 被阻擋時顯示登入未完成，不降級為 JavaScript token。登出等候後端成功撤銷，再清除畫面狀態；失敗提示重試，避免假登出。成功 API 回應統一 no-store，保留允許清單 Origin 與 JSON Content-Type 檢查。

## 驗證與限制

`node --test security-audit/line-login-security.test.mjs security-audit/cookie-session-security.test.mjs`：22 項離線測試通過。涵蓋回跳網址外洩、交換碼重放／過期／並發、Cookie 安全屬性與清除屬性、拒絕舊 header／Cookie／session、過期／撤銷 session、前端無 token 寫入或 header、Cookie 被阻擋時不報成功、缺少或惡意 Origin 拒絕。

測試執行實際程式片段與 handler，但使用記憶體 DB、LINE 與瀏覽器替身；不等於已驗證正式瀏覽器 Cookie 政策或 PostgreSQL。正式環境需測試 Chromium、Safari、LINE WebView 的登入、重新整理、會員查詢、登出及再次載入。

前端與 Supabase 為跨站架構，所以使用分區 Cookie。瀏覽器／使用者政策若仍阻擋此 Cookie，必須調整政策或改為同站 API／BFF 部署，不能重新啟用 localStorage token。分區 Cookie 的設計依據：[MDN CHIPS](https://developer.mozilla.org/en-US/docs/Web/Privacy/Guides/Third-party_cookies/Partitioned_cookies)。

HttpOnly 防止頁面腳本直接讀走會員憑證，不阻止已在可信 origin 執行的惡意脚本借用 Cookie 發起操作；第三方腳本隔離及 XSS 防護仍必要。登入用的短效一次性 browser verifier 仍在本地保存，與已登入的長效 session 不同。付款查詢 token 尚未在此次範圍轉換。

## 部署

1. 先核對既有 migration history，解決報告中的重複版本套用問題；不要直接重命名已部署 migration。
2. 在測試庫套用先前 `20260919000300_secure_line_login_transactions.sql` 及本次 `20260919000400_cookie_only_line_sessions.sql`。
3. 部署新版 backend、line-login，再部署前端。後端會拒絕所有未標示 cookie_only 的舊工作階段；切換期間重新登入即可，不提供不安全相容模式。
4. 驗證匿名／authenticated 無法直接修改 cookie_only、登入 JSON 無 token、瀏覽器 document.cookie/localStorage 無會員憑證、重新整理仍登入、登出後舊 Cookie 不可用；模擬斷線登出應提示失敗。
5. 正式環境同樣依序部署。回滾到接受舊 header／JSON token 的後端會重新引入漏洞，不能只回滾前端或取消資料庫篩選。

目前僅本地修復，未部署正式站。
