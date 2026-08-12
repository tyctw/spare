# 全國會考落點分析

React + Vite 前端，資料與付款、LINE 會員驗證 API 使用 Supabase Edge Functions。

## Cloudflare Pages 部署

在 Cloudflare Dashboard 建立 **Pages** 專案並連接此 GitHub repository，使用下列設定：

| 設定 | 值 |
| --- | --- |
| Production branch | `main` |
| Build command | `npm ci && npm run build` |
| Build output directory | `dist` |
| Node.js version | `24` |

在 Pages 的 **Environment variables** 設定：

```text
VITE_BASE_PATH=/
VITE_SUPABASE_URL=https://<你的專案>.supabase.co
VITE_SUPABASE_ANON_KEY=<Supabase publishable／anon key>
```

`public/_headers` 會在 Pages 回應中加入 CSP、反嵌入與其他安全標頭；`public/_redirects` 讓 React 的直接網址與重新整理正常回到單頁應用程式。

## 上線前同步更新

以實際 Pages 網址（例如 `https://analyze.pages.dev` 或自訂網域）更新 Supabase Secrets：

```text
ALLOWED_ORIGINS=https://<你的 Pages 網址>
SITE_URL=https://<你的 Pages 網址>
```

並到 LINE Developers Console：

1. 將 LINE Login callback URL 設為 `https://<你的 Supabase 專案>.supabase.co/functions/v1/line-login`。
2. 將隱私權與服務條款網址改為新的 Pages 網址。

ECPay callback 仍維持 Supabase `ecpay-callback` Function；不需放入 Cloudflare Pages。
