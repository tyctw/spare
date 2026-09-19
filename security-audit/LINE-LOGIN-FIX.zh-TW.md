# LINE 登入交換碼修復

## 已完成的變更

- 瀏覽器建立 32 bytes 隨機 verifier，存入獨立 v2 localStorage 欄位；登入 URL 只攜带 SHA-256 challenge。
- LINE state 只攜帶隨機交易 ID；nonce、LINE PKCE verifier、browser challenge 與回跳路徑留在 RLS 保護的資料表。
- callback 原子刪除並取得未過期交易。交易有效 10 分鐘，一次使用；無效、過期或重放不呼叫 LINE。
- 回跳 fragment 只有交換碼，有效 5 分鐘。後端要求原瀏覽器 verifier 並核對雜湊；完整網址、challenge 或其他瀏覽器的 verifier 都不能代替它。
- 交換碼須為 binding_version=2，拒絕升級前未使用但可能外洩的舊碼。舊版瀏覽器須重新載入頁面再開始登入，不提供不安全降級。
- 啟動 guard 與 React fallback 都在驗證之前清除登入 fragment，包括失敗與舊版回跳。OAuth 回應設 no-store、no-referrer；成功兌換回應設 no-store。
- CI 執行安全測試，並確認建置包含 challenge／verifier 流程。

## 驗證

`node --test security-audit/line-login-security.test.mjs` 共 13 項測試：正常發起與兌換、完整網址外洩、錯誤 verifier、challenge 當 verifier、state 竄改、交易／交換碼過期、重放、並發單一成功、拒絕舊碼、guard 與 React fallback 的成功與失敗清除網址。

測試執行實際程式，資料庫與 LINE 使用記憶體替身；並發測試驗證應用查詢條件與流程，不代替真實 PostgreSQL 並發測試。TypeScript 檢查及 Vite 建置另行驗證。沒有使用正式帳號、正式付款或連線正式資料庫。

型別檢查與建置已通過。另以 `https://audit.invalid` 與假 anon key 建置，確認登入功能未因缺少設定被移除，輸出確實含 browserChallenge 與 browserVerifier；這只驗證打包，不代表正式連線成功。

## 上線順序

1. 先確認 Supabase migration history。專案既有兩組重複版本，不要直接假定全量 db push 安全；本次不任意改動已存在的 migration 歷史。
2. 在測試庫套用 `supabase/migrations/20260919000300_secure_line_login_transactions.sql`。新增交易表、v2 標記及每 10 分鐘清理過期交易排程；依賴既有 pg_cron。確認匿名及一般 authenticated 角色無法讀取交易。
3. 部署新版 backend，再部署 line-login，最後部署前端。切換期間舊登入嘗試可能失敗，請重新載入後重試；不恢復舊的 URL verifier 流程。
4. 真實瀏覽器 A 發起登入，複製回跳 URL 到 B，確認 B 直接呼叫 API 也無法兌換、A 可成功。再測並發、重放、過期、LINE 取消授權、Safari／LINE WebView。
5. 通過後在正式環境以相同順序套用，確認兩個函式與前端都為新版；前端更新本身不能修好舊後端。

未自動部署。瀏覽器若在登入途中切換到不共享原站儲存空間的 WebView／瀏覽器，將安全地拒絕兌換，應在同一瀏覽器重新開始。

後續會員 session 修復已另行完成：見 `COOKIE-SESSION-FIX.zh-TW.md`，需一併套用 20260919000400 migration。新版會使舊會員 session 失效並要求重新登入；不再回傳或儲存 JavaScript 可讀的會員 token。同 origin 第三方程式與共編網址仍是獨立待修項目。
