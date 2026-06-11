<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 會考落點分析系統

前端使用 React/Vite，後端已遷移至 Supabase Postgres 與 Edge Functions。

## Run Locally

**Prerequisites:** Node.js、Docker、Supabase CLI

1. Install dependencies:
   `npm install`
2. 建立 `.env.local`，內容參考 `.env.example`
3. 啟動 Supabase：
   `npm run supabase:start`
4. 將 CLI 顯示的 API URL 與 anon key 填入 `.env.local`
5. Run the app:
   `npm run dev`

## Supabase 部署

目前部署專案 ref：`ufanwuihknmjlfnmdvzo`

1. `npx supabase login`
2. `npx supabase link --project-ref ufanwuihknmjlfnmdvzo`
3. `npm run supabase:deploy`
4. 在 Supabase Table Editor 匯入原 Google Sheets 資料：
   - `supabase/seed/schools.csv` 匯入 `schools`
   - `supabase/seed/volunteer_schools.csv` 匯入 `volunteer_schools`

`schools.region` 可使用：`taoyuan`、`kaohsiung`、`central`、`changhua`、
`taipei`、`tainan`、`hsinchu`。

## 邀請碼

- `TYCTW` 由 migration 建立為永久啟用的期間邀請碼。
- 系統仍支援 `TYCTW`、`TW`、`CTTW`、`KHTW`、`CHCTW` 加上台北時間
  `YYYYMMDDHH` 的當小時與前一小時動態碼。
- 可在 `invitation_codes` 新增自訂碼，並設定 `expires_at`、`max_uses` 與
  `active`。
- 每次驗證與使用都會寫入 `invitation_logs`；分析、評分、錯誤回報則分別
  寫入對應資料表。
