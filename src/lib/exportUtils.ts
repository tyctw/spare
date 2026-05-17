import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const exportTxt = (data: any, regionName: string) => {
  const content = `===============================================
               115年 會考落點分析報告                
===============================================
【基本資料】
身份: ${data.identity === 'student' ? '學生' : data.identity === 'teacher' ? '老師' : '家長'}
分析區域: ${regionName}
選取偏好: ${data.scores.schoolOwnership === 'all' ? '公私立不拘' : data.scores.schoolOwnership === 'public' ? '公立' : '私立'} / ${data.scores.schoolType === 'all' ? '普通與職業類科' : data.scores.schoolType}
產生時間: ${new Date().toLocaleString('zh-TW')}

【您的會考成績】
國文: ${data.scores.chinese}
英文: ${data.scores.english}
數學: ${data.scores.math}
自然: ${data.scores.science}
社會: ${data.scores.social}
作文: ${data.scores.composition} 級分

【積分試算結果】
您的總積分: ${data.results.totalPoints}
您的總積點: ${data.results.totalCredits || '無'}
符合條件推薦學校數: ${data.results.eligibleSchools?.length || 0} 所

===============================================
【推薦名單 (依序位推薦)】
${data.results.eligibleSchools?.map((s: any, i: number) => 
  `${String(i + 1).padStart(2, ' ')}. ${s.name} ${s.group ? `[${s.group}]` : ''} - 落點區間: ${s.zone === 'reach' ? '夢幻區' : s.zone === 'target' ? '實際區' : s.zone === 'safe' ? '保守區' : '--'} - 預估錄取門檻: ${s.minScore || s.points || s.score || '--'}`
).join('\n') || '無推薦名單'}

===============================================
【系統免責聲明】
本系統分析結果僅供參考，不代表實際錄取結果。實際錄取情況可能會因當年度招生政策變化、考生整體表現、特種身分加分、各校招生名額調整等因素而有所不同。請務必以各校最新官方發布之「免試入學招生簡章」為最終依據。
版權宣告TW全國會考落點分析 © ${new Date().getFullYear()} (我們非政府創建)
網址: ${window.location.href}
`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `115年_會考落點分析_${regionName}.txt`);
};

export const exportJson = (data: any) => {
  const enhancedData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      system: 'TW全國會考落點分析引擎',
      version: '1.5.0',
      sourceUrl: window.location.href,
      disclaimer: '本系統分析結果僅供參考，不代表實際錄取結果。'
    },
    userProfile: {
      identity: data.identity,
      region: data.scores.region,
      preferences: {
        ownership: data.scores.schoolOwnership,
        type: data.scores.schoolType
      }
    },
    examScores: {
      chinese: data.scores.chinese,
      english: data.scores.english,
      math: data.scores.math,
      science: data.scores.science,
      social: data.scores.social,
      composition: parseInt(data.scores.composition) || 0
    },
    calculatedResults: {
      totalPoints: data.results.totalPoints,
      totalCredits: data.results.totalCredits || null,
      eligibleSchoolCount: data.results.eligibleSchools?.length || 0,
      recommendedSchools: data.results.eligibleSchools?.map((s: any) => ({
        name: s.name,
        type: s.type,
        ownership: s.ownership,
        group: s.group || null,
        zone: s.zone === 'reach' ? '夢幻區' : s.zone === 'target' ? '實際區' : s.zone === 'safe' ? '保守區' : null,
        estimatedThreshold: s.minScore || s.points || s.score || null
      })) || []
    }
  };
  const blob = new Blob([JSON.stringify(enhancedData, null, 2)], { type: 'application/json;charset=utf-8' });
  saveAs(blob, `115年_會考落點分析_${data.scores.region}.json`);
};

export const exportExcel = (data: any, regionName: string) => {
  const wb = XLSX.utils.book_new();
  
  // 1. Summary Sheet
  const summary = [
    ["115年 會考落點分析結果報告"],
    ["", ""],
    ["【基本資料】"],
    ["產生日期", new Date().toLocaleString('zh-TW')],
    ["分析區域", regionName],
    ["使用者身份", data.identity === 'student' ? '學生' : data.identity === 'teacher' ? '老師' : '家長'],
    ["", ""],
    ["【會考成績】"],
    ["國文", data.scores.chinese],
    ["英文", data.scores.english],
    ["數學", data.scores.math],
    ["自然", data.scores.science],
    ["社會", data.scores.social],
    ["作文級分", data.scores.composition],
    ["", ""],
    ["【運算結果】"],
    ["總積分", data.results.totalPoints],
    ["總積點 (若適用)", data.results.totalCredits || "無"],
    ["", ""],
    ["【免責聲明】"],
    ["本系統結果僅供參考，不代表最終錄取結果。請務必以發布之簡章為準。"],
    ["版權宣告", `TW全國會考落點分析 © ${new Date().getFullYear()}`],
    ["分析來源網址", window.location.href]
  ];
  const summaryWs = XLSX.utils.aoa_to_sheet(summary);
  XLSX.utils.book_append_sheet(wb, summaryWs, "分析摘要與成績");

  // 2. Schools Sheet
  if (data.results.eligibleSchools?.length) {
    const schoolsData = [
      ["推薦排名", "學校名稱", "群別/科系", "學校類型", "公立/私立", "落點區間", "預估錄取門檻"],
      ...data.results.eligibleSchools.map((s: any, index: number) => [
        index + 1,
        s.name, 
        s.group || "--",
        s.type, 
        s.ownership === '公立' ? '公立' : s.ownership === '私立' ? '私立' : s.ownership,
        s.zone === 'reach' ? '夢幻區' : s.zone === 'target' ? '實際區' : s.zone === 'safe' ? '保守區' : "--",
        s.minScore || s.points || s.score || "--"
      ])
    ];
    const schoolsWs = XLSX.utils.aoa_to_sheet(schoolsData);
    
    // Auto-size columns slightly
    schoolsWs['!cols'] = [
      { wch: 10 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 }
    ];
    
    XLSX.utils.book_append_sheet(wb, schoolsWs, "推薦學校清單");
  } else {
    const emptyWs = XLSX.utils.aoa_to_sheet([["無符合條件之推薦學校"]]);
    XLSX.utils.book_append_sheet(wb, emptyWs, "推薦學校清單");
  }

  XLSX.writeFile(wb, `115年_會考落點分析_${regionName}.xlsx`);
};

export const printResults = (data: any, regionName: string) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('無法開啟列印視窗，請檢查是否被瀏覽器阻擋。');
    return;
  }

  const identityStr = data.identity === 'student' ? '學生' : data.identity === 'teacher' ? '老師' : '家長';
  const ownershipStr = data.scores.schoolOwnership === 'all' ? '公私立不拘' : data.scores.schoolOwnership === 'public' ? '公立' : '私立';
  const typeStr = data.scores.schoolType === 'all' ? '普通與職業類科' : data.scores.schoolType;

  const currentUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(currentUrl)}`;

  let creditsHtml = '';
  if (data.results.totalCredits) {
    creditsHtml = `<div class="result-point">總積點：<strong>${data.results.totalCredits}</strong></div>`;
  }

  let analysisReportHtml = '';
  if (data.results.analysisReport) {
    const report = data.results.analysisReport;
    analysisReportHtml = `
      <div class="report-card">
        <div class="report-header">
          <div class="report-badge">AI 智能報告</div>
          <h3>${report.analysisSummary}</h3>
        </div>
        <div class="report-metrics">
          <div class="metric-item">
            <span class="metric-label">夢幻區間</span>
            <span class="metric-val text-reach">${report.zoneCounts?.reach || 0}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">實際區間</span>
            <span class="metric-val text-target">${report.zoneCounts?.target || 0}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">保守區間</span>
            <span class="metric-val text-safe">${report.zoneCounts?.safe || 0}</span>
          </div>
        </div>
        <div class="report-suggestion">
          <strong>策略建議：</strong>${report.suggestion}
        </div>
      </div>
    `;
  }

  let schoolsHtml = '<p style="text-align: center; padding: 20px; color: #64748b;">無符合條件之推薦學校</p>';
  if (data.results.eligibleSchools && data.results.eligibleSchools.length > 0) {
    let rowsHtml = '';
    data.results.eligibleSchools.forEach((s: any, i: number) => {
      const thresholdScore = s.minScore || s.points || s.score || '--';
      const zoneText = s.zone === 'reach' ? '夢幻區' : s.zone === 'target' ? '實際區' : s.zone === 'safe' ? '保守區' : '--';

      rowsHtml += `
      <tr>
        <td style="font-weight: 600; color: #64748b;">#${i + 1}</td>
        <td style="font-weight: 700; color: #0f172a;">${s.name}</td>
        <td>${s.group || s.type || '-'}</td>
        <td>${s.ownership}</td>
        <td><span class="badge eval-${s.zone || 'normal'}">${zoneText}</span></td>
        <td style="font-weight: 600;">${thresholdScore}</td>
      </tr>
      `;
    });

    schoolsHtml = `
      <table>
        <thead>
          <tr>
            <th width="10%">排名</th>
            <th width="25%">學校名稱</th>
            <th width="25%">群別/科系/類型</th>
            <th width="10%">公私立</th>
            <th width="15%">落點區間</th>
            <th width="15%">預估錄取門檻</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
      <meta charset="UTF-8">
      <title>115年會考落點分析報告 - ${regionName}</title>
      <style>
        @page { size: A4 portrait; margin: 1cm; }
        * { box-sizing: border-box; }
        body {
          font-family: 'Helvetica Neue', 'PingFang TC', 'Microsoft JhengHei', sans-serif;
          color: #1e293b;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          background: #f1f5f9;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .print-wrapper {
          position: relative;
          max-width: 210mm;
          margin: 20px auto;
          background: #fff;
          padding: 40px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          border-top: 12px solid #2563eb;
          overflow: hidden;
        }
        @media print {
          body { background: #fff; }
          .print-wrapper { box-shadow: none; padding: 0; margin: 0; width: 100%; max-width: none; border-radius: 0; border-top: 8px solid #2563eb; }
          .btn-print { display: none !important; }
        }
        /* Optional watermark for a professional look */
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-30deg);
          font-size: 120px;
          color: rgba(226, 232, 240, 0.3);
          font-weight: 900;
          white-space: nowrap;
          pointer-events: none;
          z-index: 0;
          user-select: none;
        }
        .content-relative {
          position: relative;
          z-index: 10;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid #0f172a;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header-left h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          color: #0f172a;
          letter-spacing: 1.5px;
          font-weight: 800;
        }
        .header-left p {
          margin: 0;
          color: #475569;
          font-size: 14px;
        }
        .header-right {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .qr-box {
          background: #fff;
          padding: 6px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          display: inline-block;
        }
        .qr-box img {
          width: 76px;
          height: 76px;
          display: block;
        }
        .site-link {
          font-size: 10px;
          color: #64748b;
          margin-top: 6px;
          max-width: 150px;
          word-break: break-all;
          line-height: 1.3;
        }
        .section { margin-bottom: 32px; }
        .section-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e3a8a;
          background-color: #eff6ff;
          padding: 8px 16px;
          border-radius: 6px;
          border-left: 5px solid #2563eb;
          margin-bottom: 16px;
          display: inline-block;
          min-width: 200px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          background: #f8fafc;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .info-item { display: flex; align-items: center; }
        .info-label { font-weight: 600; color: #64748b; width: 90px; flex-shrink: 0; font-size: 14px; }
        .info-value { font-weight: 800; color: #0f172a; font-size: 16px; }
        
        .scores-wrapper {
          display: flex;
          gap: 20px;
          align-items: stretch;
        }
        .scores-grid {
          flex: 2;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          background: #fff;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .score-item {
          text-align: center;
          padding: 12px 8px;
          background: #f8fafc;
          border-radius: 8px;
          border: 1px solid #f1f5f9;
        }
        .score-label { font-size: 13px; color: #64748b; margin-bottom: 4px; font-weight: 600; }
        .score-val { font-size: 24px; font-weight: 800; color: #2563eb; }
        .score-val.comp { color: #7c3aed; }
        
        .result-summary {
          flex: 1;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          padding: 24px;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .result-summary-title { font-size: 15px; font-weight: 800; color: #1e40af; margin-bottom: 12px; }
        .result-point { font-size: 15px; margin-bottom: 8px; color: #1e3a8a; font-weight: 600; }
        .result-point strong { font-size: 32px; color: #1d4ed8; font-weight: 800; margin-left: 8px; }
        
        /* Report Card Styles */
        .report-card {
          background: #f8fafc;
          border-radius: 16px;
          border: 2px solid #0f172a;
          padding: 24px;
          margin-bottom: 30px;
          box-shadow: 4px 4px 0px 0px #0f172a;
        }
        .report-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .report-badge {
          background: #0f172a;
          color: white;
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }
        .report-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
        }
        .report-metrics {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        .metric-item {
          flex: 1;
          padding: 12px;
          background: white;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .metric-label { font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 4px; }
        .metric-val { font-size: 20px; font-weight: 900; }
        .text-reach { color: #f43f5e; }
        .text-target { color: #0ea5e9; }
        .text-safe { color: #10b981; }
        .report-suggestion {
          background: #f1f5f9;
          padding: 16px;
          border-radius: 12px;
          font-size: 14px;
          color: #334155;
          line-height: 1.6;
        }

        table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }
        th, td { padding: 14px 16px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        th { 
          background-color: #f8fafc; 
          font-weight: 800; 
          color: #334155; 
          font-size: 14px; 
          border-bottom: 2px solid #cbd5e1; 
        }
        tbody tr:last-child td { border-bottom: none; }
        tbody tr:nth-child(even) { background-color: #fbfcfd; }
        tbody tr:hover { background-color: #f1f5f9; }
        
        .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 700; }
        .eval-safe { background: #dcfce7; color: #166534; }
        .eval-target { background: #dbeafe; color: #1e40af; }
        .eval-normal { background: #f1f5f9; color: #475569; }
        .eval-reach { background: #fee2e2; color: #991b1b; }
        .eval-low { background: #fee2e2; color: #991b1b; }
        
        .btn-print {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 180px;
          margin: 0 auto 30px auto;
          padding: 12px 24px;
          background-color: #0f172a;
          color: white;
          text-align: center;
          border-radius: 8px;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 6px rgba(15, 23, 42, 0.2);
          transition: all 0.2s;
        }
        .btn-print:hover { background-color: #334155; transform: translateY(-1px); }
        .btn-print svg { width: 18px; height: 18px; }
        
        .footer {
          margin-top: 50px;
          padding-top: 24px;
          border-top: 2px solid #e2e8f0;
          font-size: 12px;
          color: #64748b;
          text-align: center;
          line-height: 1.8;
        }
        .footer p { margin: 4px 0; }
        .footer strong { color: #0f172a; }
      </style>
    </head>
    <body>
      <button class="btn-print" onclick="window.print()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        列印分析報告
      </button>
      
      <div class="print-wrapper">
        <div class="watermark">落點分析</div>
        <div class="content-relative">
          <div class="header">
          <div class="header-left">
            <h1>115年會考落點分析報告</h1>
            <p>分析區域：<strong>${regionName}</strong> &nbsp;|&nbsp; 報告產生時間：${new Date().toLocaleString('zh-TW')}</p>
          </div>
          <div class="header-right">
            <div class="qr-box">
              <img src="${qrCodeUrl}" alt="QR Code" />
            </div>
            <div class="site-link">掃描查看原網站<br/>${currentUrl}</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">考生基本設定</div>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">使用者身份</div><div class="info-value">${identityStr}</div></div>
            <div class="info-item"><div class="info-label">學校屬性</div><div class="info-value">${ownershipStr}</div></div>
            <div class="info-item"><div class="info-label">學校類型</div><div class="info-value">${typeStr}</div></div>
            <div class="info-item"><div class="info-label">系統辨識碼</div><div class="info-value" style="font-family: monospace; color: #64748b;">${data.scores.invitationCode || '---'}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">會考成績與積分試算</div>
          <div class="scores-wrapper">
            <div class="scores-grid">
              <div class="score-item"><div class="score-label">國文</div><div class="score-val">${data.scores.chinese}</div></div>
              <div class="score-item"><div class="score-label">英文</div><div class="score-val">${data.scores.english}</div></div>
              <div class="score-item"><div class="score-label">數學</div><div class="score-val">${data.scores.math}</div></div>
              <div class="score-item"><div class="score-label">自然</div><div class="score-val">${data.scores.science}</div></div>
              <div class="score-item"><div class="score-label">社會</div><div class="score-val">${data.scores.social}</div></div>
              <div class="score-item"><div class="score-label">寫作測驗</div><div class="score-val comp">${data.scores.composition} 級分</div></div>
            </div>
            <div class="result-summary">
              <div class="result-summary-title">落點分析引擎試算結果</div>
              <div class="result-point">總積分：<strong>${data.results.totalPoints}</strong></div>
              ${creditsHtml}
              <div style="margin-top: 10px; font-size: 13px; color: #1e3a8a;">
                符合條件推薦學校：<strong>${data.results.eligibleSchools?.length || 0}</strong> 所
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">智能落點分析總結</div>
          ${analysisReportHtml}
        </div>

        <div class="section">
          <div class="section-title">精選推薦學校清單 (依序位評估)</div>
          ${schoolsHtml}
        </div>

        <div class="footer">
          <p><strong>【系統免責聲明】</strong> 本系統分析結果僅供參考，不代表實際錄取結果。實際錄取情況可能會因當年度招生政策變化、<br/>考生整體表現、特種身分加分、各校招生名額調整等因素而有所不同。請務必以各校最新官方發布之「免試入學招生簡章」為最終依據。</p>
          <p>TW全國會考落點分析引擎 © ${new Date().getFullYear()} (非政府官方機構) | <a href="${currentUrl}" style="color: #3b82f6; text-decoration: none;">點此返回網站</a></p>
        </div>
        </div>
      </div>
      
      <script>
        window.onload = function() {
          setTimeout(function() {
             window.print();
          }, 500);
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
};
