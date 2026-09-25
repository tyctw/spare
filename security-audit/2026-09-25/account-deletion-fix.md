# 刪帳分享撤銷修正

狀態：本機修正與隔離資料庫測試完成；未推送 Git、未套用正式資料庫。

新增 migration `20260925000100_delete_account_owned_shares.sql`，在既有刪帳交易中刪除 `owner_line_user_id` 相符的分享報告。既有外鍵會連帶刪除協作事件與志願版本，讀取 token 及編輯 key 因報告不存在而失效。成績紀錄、session 清除及付款解除 LINE 關聯仍在同一交易；有效付費會員仍不能刪帳。

分享建立／變更擁有者與刪帳使用同一帳號層級的交易鎖。擁有者必須仍有有效 cookie-only session，避免已通過 HTTP 登入檢查的請求，在刪帳後才寫入孤立分享。匿名分享不受影響；歷史上沒有擁有者資料的匿名連結無法安全歸屬到特定帳號，不能隨意刪除。

刪帳確認視窗同步說明會刪除成績、名下分享與協作資料，相關分享連結失效。

## 驗證

使用暫存目錄安裝的 PGlite，執行實際分享／協作／版本 migration 與新增修正；session 和付款表使用本次測試需要的最小 schema。測試未連線正式服務。

- 分享及協作歷史連帶刪除；舊讀取 token 查無資料，舊編輯 key 查歷史回 SHARE_UNAVAILABLE。
- 其他帳號及匿名分享保留。
- 有效會員、空身分拒絕刪除。
- 強制後續刪除失敗，確認分享與版本刪除會完整回滾。
- 刪帳後模擬延遲到達的分享新增／擁有者變更被拒絕。
- anon/authenticated 無法執行刪帳 RPC，service_role 可執行。

結果見 `account-deletion-results.log`，可執行測試見 `account-deletion.test.mjs`。PGlite 為單連線，未實測多連線鎖排程；正式 schema 與既有 migration history 仍需部署前核對。原稽核指出的重複 migration 版本號尚未在此修正，請勿直接盲目執行全量 db push。

本修正需將新增 migration 套用至實際 Supabase 資料庫才會影響正式服務；目前沒有執行部署。
