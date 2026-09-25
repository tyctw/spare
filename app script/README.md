# LINE 訊息回覆、逐步操作與日程提醒

## 安裝與上線

1. 依現有部署位置更新 `a.gs`、`b.gs`、`c.gs`，並在 Webhook Apps Script 專案新增 `d.gs`。`a.gs` 負責日程提醒；`b.gs`、`c.gs`、`d.gs` 需放在同一個 Webhook 專案，分別負責關鍵字回覆、逐步操作與即時日程查詢。
2. 保留指令碼屬性 `LINE_CHANNEL_ACCESS_TOKEN`。在 Webhook 專案新增 `SCHEDULE_SPREADSHEET_ID`，值設為現有「日程」工作表所屬 Google 試算表的 ID；若 Webhook 專案本身綁定該試算表，可使用作用中的試算表。逐步操作與即時查詢不需要新建試算表、資料欄位或排程。
3. 在 Webhook 專案執行 `testScheduleQuerySource()` 確認有權讀取試算表，並執行 `testBotRouting()`；再視需要執行 `validateGuideMessages()` 與 `validateAllFlexMessages()`。在日程提醒所屬專案執行 `validateScheduleFlexDesign()`。這些測試與驗證不向好友發送訊息。
4. Apps Script「部署 → 管理部署 → 編輯 → 新版本 → 部署」，沿用原 Web App URL。LINE Developers 的 Webhook 需指向此部署並開啟。
5. 若網站尚未上線逐步操作的成績匯入功能，須同步部署 `src/lib/lineGuide.ts` 和 `src/App.tsx`。本次訊息樣式調整本身不需變更網站。
6. 在 LINE 一對一聊天室輸入「開始」，實際走完選區、五科、寫作與確認；也測試「上一步」「取消」、校科搜尋及原有關鍵字。若官方帳號另外啟用了自動回應，請檢查是否與 Webhook 重複回覆。

本機沒有這個 Apps Script 的部署 ID 或 LINE Token；本次變更不會自動更新線上的 Apps Script。日程提醒的排程與資料讀取方式維持原狀，更新後請先執行格式驗證，再檢查一則實際提醒的顯示結果。

## 國三模擬考自動提醒

- 將 `115-mock-exams.csv` 的四筆資料加到現有「日程」工作表，欄位與正式日程相同；已存在的列不要重複匯入。`a.gs` 不再內建模擬考日期，所有提醒都從 Sheet 讀取。
- 請先把新版 `a.gs` 更新到日程提醒專案，再匯入四筆資料，避免舊版內建提醒與 Sheet 同時發送。若某次提醒已由舊版程式發出，請先在該列 `sent` 欄填入 `yyyy-MM-dd:提前2天` 或 `yyyy-MM-dd:今日`，多筆以逗號分隔。
- 每筆 `date` 是考試首日，完整兩天考期及範圍寫在 `message`。原有每日觸發器會在首日前兩天及首日發送，第二天不另發訊息；已過期的考試不補發。
- 模擬考提醒卡片的按鈕連到[會考倒數日程頁](https://tyctw.github.io/clock/#/schedule)。
- 範圍依[文山高中試務中心公告](https://sites.google.com/mail.wsm.ks.edu.tw/test-open/%E5%9C%8B%E4%B8%AD%E6%A8%A1%E6%93%AC%E8%80%83)整理：第一次 115/09/08–09/09（南一，國英數社第 1～2 冊、自然第 1、3 冊）；第二次 115/12/23–12/24（翰林，第 1～4 冊）；第三次 116/02/18–02/19（南一，第 1～5 冊）；第四次 116/04/15–04/16（康軒，第 1～6 冊）。各校是否施測及實際考程仍以就讀學校通知為準。
- 模擬考與正式日程共用工作表 `sent` 欄記錄發送狀態及既有 LINE 重試機制。`previewScheduleBroadcast()` 會列出當天待發送的所有提醒；部署前可執行 `validateScheduleFlexDesign()` 驗證卡片。

## 116 學年度正式日程表

- `116-admission-schedule.csv` 整理 15 筆正式會考與入學日程，欄位與現有「日程」工作表一致。若工作表已經有這些列，請勿重複匯入；`a.gs` 會直接讀取原有資料。
- 2027/05/15 與 2027/05/16 兩列的 `message` 已加入各科考試時間與時長。若 Sheet 已有這兩列，請只更新這兩格 `message`，不要重複新增列；提醒卡片會把 `當日考程：／` 後的 `／` 分隔項目顯示為逐行考程。正式考試規定及時程以當年度試務公告為準。
- `url` 欄建議使用純 HTTPS 網址。從 Markdown 表格貼入的 `[文字](網址)` 也會自動轉成網址後送給 LINE。`sent` 欄保持空白，由發送程式在成功後記錄。

## 聊天室即時日程查詢

- 輸入「今天日程」「本週日程」「下一個重要日期」，或點選歡迎卡與主選單的快速回覆，即可從同一份「日程」Sheet 查詢。今天按臺灣時間計算，本週為週一至週日；下一個日期包含今天尚未過去的日程。
- 查詢只讀取 `enabled` 為 `TRUE` 且日期有效的列，不讀取也不修改 `sent` 欄。若 Webhook 專案缺少試算表權限或 ID，LINE 會顯示暫時無法讀取日程；請先在 Webhook 專案完成試算表授權並執行 `testScheduleQuerySource()`。

## 涵蓋功能

- 8 大分類、48 個既有功能，全數提供功能入口、3 步操作引導、返回與取消。
- 落點分析：網站已開放的 8 區 → 國文 → 英文 → 數學 → 自然 → 社會 → 寫作 0～6 級分 → 確認。可用按鈕或輸入等級，支援全形與小寫；可返回修改。
- 確認後帶入網站表單，沿用網站的授權碼／會員驗證及分析服務。聊天室不計算完整超額比序、不提供錄取保證，也不直接查詢私人會員資料。
- 各區計分：依區選擇完整規則、換算說明、成績輸入或重要日程；五專走獨立說明。未開放分析的區域提供其他工具入口。
- 學校科別：輸入關鍵字（1～60 字）後產生帶入條件的搜尋連結。明確指令 `搜尋：資訊科` 可在任何階段使用。
- 15 個技職群：選群後可閱讀課程與進路、搜尋開設學校或加入群科比較。
- 志願、比較、成績紀錄、探索、日程、會員、個資、協助、政策與外部資源都有相應準備和操作說明。實際儲存、協作、付款、退款與提交回報仍在網站完成。
- 原有關鍵字、模糊搜尋和歡迎訊息保留。舊列表改為先開啟操作卡片，卡片仍提供直接前往網站的按鈕。
- 日程提醒卡片依事件標題顯示三項準備清單，涵蓋報名、報到、志願選填、准考證、成績／放榜、考試及一般期限；提前兩天與當天的最後一項提示會依時間調整。不新增試算表欄位。

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
node 'app script/schedule-card.test.mjs'
node 'app script/schedule-query.test.mjs'
npm run lint
npm run build
```

測試不呼叫 LINE API、不發送訊息，包含 48 功能的全部導覽分支、所有區域與等級邊界、0 級分、網站匯入格式、無效輸入、不同使用者隔離、過期、取消、返回、舊按鈕、重送與原有路由。`validateGuideMessages()` 才會呼叫 LINE 官方格式驗證。

實作參考：[LINE postback](https://developers.line.biz/en/reference/messaging-api/#postback-action)、[Quick Reply](https://developers.line.biz/en/docs/messaging-api/using-quick-reply/)、[Apps Script Cache](https://developers.google.com/apps-script/reference/cache/cache)。
