import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export const exportTxt = (data: any, regionName: string) => {
  const content = `===============================================
               114年 會考落點分析報告                
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
  `${String(i + 1).padStart(2, ' ')}. ${s.name} ${s.group ? `[${s.group}]` : ''} - 預估分數區間: ${s.minScore || s.points || s.score} / 錄取評估: ${
    (s.scoreDiff !== undefined && parseFloat(s.scoreDiff) >= 2) || 
    (s.pointsDiff !== undefined && parseFloat(s.pointsDiff) >= 2) || 
    ((data.results.totalPoints - parseFloat(s.minScore || s.points || s.score || 0)) >= 2) ? '極高 (安全)' :
    (s.scoreDiff !== undefined && parseFloat(s.scoreDiff) >= 0.5) || 
    (s.pointsDiff !== undefined && parseFloat(s.pointsDiff) >= 0.5) || 
    ((data.results.totalPoints - parseFloat(s.minScore || s.points || s.score || 0)) >= 0.5) ? '穩健 (合理)' :
    (s.scoreDiff !== undefined && parseFloat(s.scoreDiff) >= -1) || 
    (s.pointsDiff !== undefined && parseFloat(s.pointsDiff) >= -1) || 
    ((data.results.totalPoints - parseFloat(s.minScore || s.points || s.score || 0)) >= -1) ? '夢幻 (進取)' : '落後'
  }`
).join('\n') || '無推薦名單'}

===============================================
【系統免責聲明】
本系統分析結果僅供參考，不代表實際錄取結果。實際錄取情況可能會因當年度招生政策變化、考生整體表現、特種身分加分、各校招生名額調整等因素而有所不同。請務必以各校最新官方發布之「免試入學招生簡章」為最終依據。
版權宣告TW全國會考落點分析 © ${new Date().getFullYear()} (我們非政府創建)
`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, `114年_會考落點分析_${regionName}.txt`);
};

export const exportJson = (data: any) => {
  const enhancedData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      system: 'TW全國會考落點分析引擎',
      version: '1.5.0',
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
        estimatedThreshold: s.minScore || s.points || s.score || null
      })) || []
    }
  };
  const blob = new Blob([JSON.stringify(enhancedData, null, 2)], { type: 'application/json;charset=utf-8' });
  saveAs(blob, `114年_會考落點分析_${data.scores.region}.json`);
};

export const exportExcel = (data: any, regionName: string) => {
  const wb = XLSX.utils.book_new();
  
  // 1. Summary Sheet
  const summary = [
    ["114年 會考落點分析結果報告"],
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
    ["本系統結果僅供參考，不代表最終錄取結果。請務必以發布之簡章為準。"]
  ];
  const summaryWs = XLSX.utils.aoa_to_sheet(summary);
  XLSX.utils.book_append_sheet(wb, summaryWs, "分析摘要與成績");

  // 2. Schools Sheet
  if (data.results.eligibleSchools?.length) {
    const schoolsData = [
      ["推薦排名", "學校名稱", "群別/科系", "學校類型", "公立/私立", "預估錄取門檻"],
      ...data.results.eligibleSchools.map((s: any, index: number) => [
        index + 1,
        s.name, 
        s.group || "--",
        s.type, 
        s.ownership === '公立' ? '公立' : s.ownership === '私立' ? '私立' : s.ownership,
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
      { wch: 15 }
    ];
    
    XLSX.utils.book_append_sheet(wb, schoolsWs, "推薦學校清單");
  } else {
    const emptyWs = XLSX.utils.aoa_to_sheet([["無符合條件之推薦學校"]]);
    XLSX.utils.book_append_sheet(wb, emptyWs, "推薦學校清單");
  }

  XLSX.writeFile(wb, `114年_會考落點分析_${regionName}.xlsx`);
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

  let creditsHtml = '';
  if (data.results.totalCredits) {
    creditsHtml = `<div>總積點：<strong style="color: #059669; font-size: 18px;">${data.results.totalCredits}</strong></div>`;
  }

  let schoolsHtml = '<p>無符合條件之推薦學校</p>';
  if (data.results.eligibleSchools && data.results.eligibleSchools.length > 0) {
    let rowsHtml = '';
    data.results.eligibleSchools.forEach((s: any, i: number) => {
      let userScore = data.results.totalPoints ? parseFloat(data.results.totalPoints) : 0;
      let isSafe = false;
      let isNormal = false;
      let isReach = false;
      
      if (s.scoreDiff !== undefined && parseFloat(s.scoreDiff) >= 2) isSafe = true;
      else if (s.pointsDiff !== undefined && parseFloat(s.pointsDiff) >= 2) isSafe = true;
      else if ((userScore - parseFloat(s.minScore || s.points || s.score || 0)) >= 2) isSafe = true;
      
      if (!isSafe) {
        if (s.scoreDiff !== undefined && parseFloat(s.scoreDiff) >= 0.5) isNormal = true;
        else if (s.pointsDiff !== undefined && parseFloat(s.pointsDiff) >= 0.5) isNormal = true;
        else if ((userScore - parseFloat(s.minScore || s.points || s.score || 0)) >= 0.5) isNormal = true;
      }
      
      if (!isSafe && !isNormal) {
         if (s.scoreDiff !== undefined && parseFloat(s.scoreDiff) >= -1) isReach = true;
         else if (s.pointsDiff !== undefined && parseFloat(s.pointsDiff) >= -1) isReach = true;
         else if ((userScore - parseFloat(s.minScore || s.points || s.score || 0)) >= -1) isReach = true;
      }

      let evalRisk = isSafe ? '<span class="eval-safe">極高 (安全)</span>' :
                     isNormal ? '<span class="eval-normal">穩健 (合理)</span>' :
                     isReach ? '<span class="eval-reach">夢幻 (進取)</span>' : '<span class="eval-low">落後</span>';
      
      rowsHtml += `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${s.name}</strong></td>
        <td>${s.group || s.type || '-'}</td>
        <td>${s.ownership}</td>
        <td>${evalRisk}</td>
      </tr>
      `;
    });

    schoolsHtml = `
      <table>
        <thead>
          <tr>
            <th>排名</th>
            <th>學校名稱</th>
            <th>群別/科系</th>
            <th>公私立</th>
            <th>錄取評估</th>
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
      <title>114年 會考落點分析報告 - ${regionName}</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, '微軟正黑體', sans-serif;
          color: #333;
          line-height: 1.6;
          margin: 0;
          padding: 20px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 5px 0 0;
          color: #666;
          font-size: 14px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          background-color: #f0f0f0;
          padding: 5px 10px;
          border-left: 4px solid #333;
          margin-bottom: 10px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;
        }
        .info-item {
          display: flex;
        }
        .info-label {
          font-weight: bold;
          width: 100px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px 12px;
          text-align: left;
        }
        th {
          background-color: #f9f9f9;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #ccc;
          padding-top: 10px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body {
            padding: 0;
          }
          .btn-print {
            display: none !important;
          }
        }
        .btn-print {
          display: block;
          width: 200px;
          margin: 20px auto;
          padding: 10px;
          background-color: #0f172a;
          color: white;
          text-align: center;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          border: none;
        }
        .eval-safe { color: #059669; font-weight: bold; }
        .eval-normal { color: #2563eb; font-weight: bold; }
        .eval-reach { color: #d97706; font-weight: bold; }
        .eval-low { color: #dc2626; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <button class="btn-print" onclick="window.print()">列印此報告</button>
        
        <div class="header">
          <h1>114年 會考落點分析報告</h1>
          <p>產生時間：${new Date().toLocaleString('zh-TW')}</p>
        </div>

        <div class="section">
          <div class="section-title">基本資料</div>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">分析區域</div><div>${regionName}</div></div>
            <div class="info-item"><div class="info-label">使用者身份</div><div>${identityStr}</div></div>
            <div class="info-item"><div class="info-label">學校屬性</div><div>${ownershipStr}</div></div>
            <div class="info-item"><div class="info-label">學校類型</div><div>${typeStr}</div></div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">會考成績與積分試算</div>
          <div class="info-grid">
            <div class="info-item"><div class="info-label">國文</div><div>${data.scores.chinese}</div></div>
            <div class="info-item"><div class="info-label">自然</div><div>${data.scores.science}</div></div>
            <div class="info-item"><div class="info-label">英文</div><div>${data.scores.english}</div></div>
            <div class="info-item"><div class="info-label">社會</div><div>${data.scores.social}</div></div>
            <div class="info-item"><div class="info-label">數學</div><div>${data.scores.math}</div></div>
            <div class="info-item"><div class="info-label">作文</div><div>${data.scores.composition} 級分</div></div>
          </div>
          <div style="margin-top: 15px; padding: 15px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
            <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">試算結果</div>
            <div>總積分：<strong style="color: #4f46e5; font-size: 18px;">${data.results.totalPoints}</strong></div>
            ${creditsHtml}
            <div>符合推薦學校：${data.results.eligibleSchools?.length || 0} 所</div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">推薦學校清單</div>
          ${schoolsHtml}
        </div>

        <div class="footer">
          <p>【系統免責聲明】本系統分析結果僅供參考，不代表實際錄取結果。實際錄取情況可能會因當年度招生政策變化、考生整體表現、特種身分加分、各校招生名額調整等因素而有所不同。請務必以各校最新官方發布之「免試入學招生簡章」為最終依據。</p>
          <p>TW全國會考落點分析 © ${new Date().getFullYear()} (非政府官方機構)</p>
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
