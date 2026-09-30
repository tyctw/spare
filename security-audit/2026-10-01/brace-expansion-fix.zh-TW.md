# brace-expansion 修正

本機修正完成；未推送或部署。原始檢查報告保留修正前證據。

- 1.x 分支由 1.1.18 更新至 1.1.21；readdir-glob 下的 2.x 分支由 2.1.4 更新至 2.1.7。
- package.json 設定分支別 overrides，維持呼叫端原有主版本；package-lock.json 只更新兩個套件的版本、下載位置與完整性校驗。
- 新增安全回歸測試並納入 Pages CI。涵蓋深層括號、重複括號組與公告的 CPU 阻塞輸入；於隔離子程序設四秒期限，避免未來退版拖住測試。
- ExcelJS 匯出 XLSX 後重新載入，驗證中文欄位完整。

驗證：npm ci --ignore-scripts 成功；npm audit 為 0 項已知漏洞；TypeScript 檢查、Vite 正式建置與 176 URL SEO 檢查通過；登入、Cookie、付款及本次套件回歸共 30 項通過。

建置有既存的 Supabase env 缺少與資產大小警告，未驗證正式登入／付款。套件稽核不涵蓋 Supabase Edge Functions 的 Deno/npm 浮動依賴，也不代表原資安報告的其他問題已修正。

版本依據：[上游修正版公告](https://github.com/juliangruber/brace-expansion/security/advisories/GHSA-q2hr-2g5m-vwhr)。
