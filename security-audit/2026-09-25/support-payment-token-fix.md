# S08 付款查詢憑證修正

本機完成，未推送 Git 或部署。

- 建立支持付款時，直接透過 HttpOnly、Secure、SameSite=None、24 小時 Cookie 傳遞查詢憑證，不再將憑證放進回應物件。
- 後端只從 Cookie 取得憑證，不接受 X-Payment-Status-Token 或 JSON 憑證；仍同時驗證交易編號、token 及 24 小時有效期。
- 前端不再儲存或傳送此 token；共用早期載入腳本會清除舊版 localStorage 值，並更新腳本版本參數。
- 保留 credentials: include、成功／失敗狀態清除 Cookie，以及 no-store 回應。sessionStorage 僅保留交易編號與建立時間。
- 新增 security-audit/support-payment-security.test.mjs，使用實際後端 HTTP/action 程式及模擬資料庫，沒有對外付款或訊息。部署工作流程已在本機加入此回歸測試。

驗證：付款安全新增 5 項與原登入 22 項共 27 項全部通過。涵蓋 JSON 不含憑證、Cookie 屬性、無 Cookie 拒絕、忽略偽造標頭、正常查詢、錯誤 Cookie 不匹配、完成付款清 Cookie、前端不讀取／傳送儲存憑證，以及早期清除舊值與儲存受限情境。

需更新正式前端與 backend Edge Function 才會生效，不需要資料庫 migration。未執行正式支付端到端測試。若瀏覽器拒絕必要跨站 Cookie，狀態查詢不會退回 JavaScript token；付款完成仍由綠界通知驗證。已外洩的舊 token 並未被本次本機程式修正追溯撤銷，原交易查詢的 24 小時期限仍適用。
