# LINE 聊天室逐步操作

## 安裝與上線

1. 在現有 LINE Webhook 的 Apps Script 專案更新 `b.gs`，新增 `c.gs`（兩份必須在同一個專案）。`a.gs` 是原有日程廣播，本次無需修改。
2. 保留指令碼屬性 `LINE_CHANNEL_ACCESS_TOKEN`。逐步操作不需要新建試算表、資料欄位或排程。
3. 先執行 `testBotRouting()`。可再執行 `validateGuideMessages()`，使用 LINE 的 `validate/reply` 端點檢查所有引導卡片；這個函式不向好友發送訊息。原有卡片另可執行 `validateAllFlexMessages()`。
4. Apps Script「部署 → 管理部署 → 編輯 → 新版本 → 部署」，沿用原 Web App URL。LINE Developers 的 Webhook 需指向此部署並開啟。
5. 網站須同步部署 `src/lib/lineGuide.ts` 和 `src/App.tsx` 的變更，才會接收聊天輸入的成績；建議先部署網站，再更新 Apps Script。舊版網站仍可開啟，但不會預填成績。
6. 在 LINE 一對一聊天室輸入「開始」，實際走完選區、五科、寫作與確認；也測試「上一步」「取消」、校科搜尋及原有關鍵字。若官方帳號另外啟用了自動回應，請檢查是否與 Webhook 重複回覆。

本機沒有這個 Apps Script 的部署 ID 或 LINE Token；本次變更不會自動更新線上的 Apps Script。

## 涵蓋功能

- 8 大分類、48 個既有功能，全數提供功能入口、3 步操作引導、返回與取消。
- 落點分析：網站已開放的 8 區 → 國文 → 英文 → 數學 → 自然 → 社會 → 寫作 0～6 級分 → 確認。可用按鈕或輸入等級，支援全形與小寫；可返回修改。
- 確認後帶入網站表單，沿用網站的授權碼／會員驗證及分析服務。聊天室不計算完整超額比序、不提供錄取保證，也不直接查詢私人會員資料。
- 各區計分：依區選擇完整規則、換算說明、成績輸入或重要日程；五專走獨立說明。未開放分析的區域提供其他工具入口。
- 學校科別：輸入關鍵字（1～60 字）後產生帶入條件的搜尋連結。明確指令 `搜尋：資訊科` 可在任何階段使用。
- 15 個技職群：選群後可閱讀課程與進路、搜尋開設學校或加入群科比較。
- 志願、比較、成績紀錄、探索、日程、會員、個資、協助、政策與外部資源都有相應準備和操作說明。實際儲存、協作、付款、退款與提交回報仍在網站完成。
- 原有關鍵字、模糊搜尋和歡迎訊息保留。舊列表改為先開啟操作卡片，卡片仍提供直接前往網站的按鈕。

## 對話與資料處理

- `開始`／`選單`／`逐步操作`／`重新開始`：回主選單。
- `上一步`／`返回`：回到目前步驟的上一頁。
- `取消`／`取消操作`／`結束`／`退出`：清除暫存操作進度。
- 按鈕使用版本化 postback，包含完整操作路徑；即使暫存到期，舊按鈕仍可從該步繼續。只接受程式中允許的路徑及數值，不接受任意網址。
- 文字回覆進度按一對一 LINE user ID 隔離，存於 Script Cache，期限 30 分鐘，可能因平台回收而提前失效；失效時提示重新選擇。群組／多人聊天室可查公開導覽，輸入成績和文字搜尋則請使用一對一聊天。
- 成績不存入 Sheet 或 Script Properties，但 LINE 訊息及卡片仍保留在聊天記錄中。取消不會刪除 LINE 歷史訊息。
- 成績傳入網站採 `#line-guide=v1.<region>.<6 digits>`，五科為等級索引，最後一位是寫作級分。網站驗證後只預填可編輯欄位並清除網址片段，不自動執行分析、不授予會員資格。LINE 登入及協作片段不由此解析器處理。
- 成功處理的 `webhookEventId` 暫存 6 小時，降低重送文字造成重複前進的情況。Cache 不提供永久或跨併發的精確一次保證；按鈕使用完整狀態路徑避免重複增量操作。

## 本機測試

Node.js 22.18+（原生 TypeScript 型別移除）或 Node.js 24：

```sh
node 'app script/guide.test.mjs'
npm run lint
npm run build
```

測試不呼叫 LINE API、不發送訊息，包含 48 功能的全部導覽分支、所有區域與等級邊界、0 級分、網站匯入格式、無效輸入、不同使用者隔離、過期、取消、返回、舊按鈕、重送與原有路由。`validateGuideMessages()` 才會呼叫 LINE 官方格式驗證。

實作參考：[LINE postback](https://developers.line.biz/en/reference/messaging-api/#postback-action)、[Quick Reply](https://developers.line.biz/en/docs/messaging-api/using-quick-reply/)、[Apps Script Cache](https://developers.google.com/apps-script/reference/cache/cache)。
