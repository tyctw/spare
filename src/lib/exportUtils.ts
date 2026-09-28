import { saveAs } from 'file-saver';
import { formatSchoolOwnership, formatSchoolOwnershipPreference } from './schoolDisplay';
import { buildResultsPrintHtml } from './resultsPrintReport';

const escapeHtml = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export const exportTxt = (data: any, regionName: string) => {
  const content = `===============================================
               115年 會考落點分析報告                
===============================================
【基本資料】
身份: ${data.identity === 'student' ? '學生' : data.identity === 'teacher' ? '老師' : '家長'}
分析區域: ${regionName}
選取偏好: ${data.scores.schoolOwnership === 'all' ? '公私立不拘' : data.scores.schoolOwnership === 'public' ? '公立' : '私立'} / ${data.scores.schoolType === 'all' ? '普通與職業類科' : data.scores.schoolType}${data.scores.schoolType === '職業類科' && data.vocationalGroups ? ` (群別: ${data.vocationalGroups.includes('all') ? '全群別不拘' : data.vocationalGroups.join(', ')})` : ''}
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
        ownership: formatSchoolOwnershipPreference(data.scores.schoolOwnership),
        type: data.scores.schoolType,
        vocationalGroups: data.scores.schoolType === '職業類科' ? data.vocationalGroups : undefined
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
        ownership: formatSchoolOwnership(s.ownership),
        group: s.group || null,
        zone: s.zone === 'reach' ? '夢幻區' : s.zone === 'target' ? '實際區' : s.zone === 'safe' ? '保守區' : null,
        estimatedThreshold: s.minScore || s.points || s.score || null
      })) || []
    }
  };
  const blob = new Blob([JSON.stringify(enhancedData, null, 2)], { type: 'application/json;charset=utf-8' });
  saveAs(blob, `115年_會考落點分析_${data.scores.region}.json`);
};

export const exportExcel = async (data: any, regionName: string) => {
  const { default: ExcelJS } = await import('exceljs');
  const wb = new ExcelJS.Workbook();
  wb.creator = '升學導航平台';
  wb.created = new Date();
  wb.modified = new Date();
  
  // 1. Summary Sheet
  const summary = [
    ["115年 會考落點分析結果報告"],
    ["", ""],
    ["【基本資料】"],
    ["產生日期", new Date().toLocaleString('zh-TW')],
    ["分析區域", regionName],
    ["選取偏好-公立私立", data.scores.schoolOwnership === 'all' ? '公立與私立整體評選' : data.scores.schoolOwnership === 'public' ? '僅評選公立學校' : '僅評選私立學校'],
    ["選取偏好-學校類型", data.scores.schoolType === 'all' ? '普通與職業類科' : data.scores.schoolType],
    ...(data.scores.schoolType === '職業類科' && data.vocationalGroups ? [["選取偏好-職業群別", data.vocationalGroups.includes('all') ? '全群別不拘' : data.vocationalGroups.join(', ')]] : []),
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
  const summaryWs = wb.addWorksheet("分析摘要與成績");
  summaryWs.addRows(summary);
  summaryWs.mergeCells('A1:B1');
  summaryWs.views = [{ showGridLines: false }];
  summaryWs.pageSetup = { orientation: 'portrait', fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
  summaryWs.pageSetup.margins = { left: 0.3, right: 0.3, top: 0.5, bottom: 0.5, header: 0.2, footer: 0.2 };
  summaryWs.headerFooter.oddFooter = '第 &P 頁，共 &N 頁';
  summaryWs.getColumn(1).width = 28;
  summaryWs.getColumn(2).width = 48;
  summaryWs.getRow(1).height = 30;
  summaryWs.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  summaryWs.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
  summaryWs.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  summaryWs.eachRow((row, rowNumber) => {
    if (rowNumber === 1 || !row.getCell(1).value) return;
    const label = String(row.getCell(1).value);
    const value = row.getCell(2);
    if (!value.value && label.length < 30) {
      summaryWs.mergeCells(`A${rowNumber}:B${rowNumber}`);
      row.getCell(1).font = { bold: true, color: { argb: 'FF1E3A8A' } };
      row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E7FF' } };
      row.getCell(1).alignment = { vertical: 'middle', horizontal: 'left' };
      row.height = 22;
      return;
    }
    row.getCell(1).font = { bold: true, color: { argb: 'FF334155' } };
    value.alignment = { vertical: 'middle', wrapText: true };
    row.getCell(1).border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
    value.border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
  });

  // 2. Schools Sheet
  if (data.results.eligibleSchools?.length) {
    const schoolsData = [
      ["推薦排序", "學校名稱", "群別/科系", "學校類型", "公立/私立", "落點區間", "預估錄取門檻"],
      ...data.results.eligibleSchools.map((s: any, index: number) => [
        index + 1,
        s.name, 
        s.group || "--",
        s.type, 
        formatSchoolOwnership(s.ownership),
        s.zone === 'reach' ? '夢幻區' : s.zone === 'target' ? '實際區' : s.zone === 'safe' ? '保守區' : "--",
        s.minScore || s.points || s.score || "--"
      ])
    ];
    const schoolsWs = wb.addWorksheet("推薦學校清單");
    schoolsWs.addRows(schoolsData);
    schoolsWs.views = [{ state: 'frozen', ySplit: 1, showGridLines: false }];
    schoolsWs.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
    schoolsWs.pageSetup.margins = { left: 0.25, right: 0.25, top: 0.45, bottom: 0.45, header: 0.2, footer: 0.2 };
    schoolsWs.headerFooter.oddFooter = '第 &P 頁，共 &N 頁';
    schoolsWs.autoFilter = { from: 'A1', to: `G${schoolsWs.rowCount}` };
    [10, 28, 22, 18, 12, 14, 18].forEach((width, index) => {
      schoolsWs.getColumn(index + 1).width = width;
    });
    const schoolsHeader = schoolsWs.getRow(1);
    schoolsHeader.height = 26;
    schoolsHeader.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    });
    for (let rowNumber = 2; rowNumber <= schoolsWs.rowCount; rowNumber += 1) {
      const row = schoolsWs.getRow(rowNumber);
      row.height = 22;
      row.eachCell((cell) => {
        cell.alignment = { vertical: 'middle', wrapText: true };
        cell.border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
      });
      row.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
      row.getCell(7).alignment = { horizontal: 'right', vertical: 'middle' };
      const zoneCell = row.getCell(6);
      const zone = data.results.eligibleSchools[rowNumber - 2]?.zone;
      const zoneColors: Record<string, string> = { reach: 'FFFEE2E2', target: 'FFFEF3C7', safe: 'FFDCFCE7' };
      if (zoneColors[zone]) {
        zoneCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: zoneColors[zone] } };
        zoneCell.font = { bold: true, color: { argb: 'FF334155' } };
      }
    }
    
  } else {
    const emptyWs = wb.addWorksheet("推薦學校清單");
    emptyWs.addRow(["無符合條件之推薦學校"]);
  }

  const content = await wb.xlsx.writeBuffer();
  saveAs(
    new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    `115年_會考落點分析_${regionName}.xlsx`,
  );
};

type ComparisonExportOptions = {
  schools: any[];
  visibleFields: string[];
};

const comparisonFieldLabels: Record<string, string> = {
  region: '就學區',
  type: '學校類型',
  ownership: '公立／私立',
  group: '特色及群別',
  historicalScores: '歷年成績',
  admissionQuota: '招生名額（一般生）',
  map: '學校地圖',
};

const formatComparisonHistoricalScores = (school: any) => {
  const scores = Array.isArray(school.historicalScores) ? school.historicalScores : [];
  const values = scores
    .filter((item) => item && item.points !== null && item.points !== undefined)
    .sort((left, right) => Number(right.year) - Number(left.year))
    .slice(0, 4)
    .map((item) => `${item.year || '歷年'}：${item.points} 分／${item.credits ?? '無'} 點`);
  return values.length ? values.join('\n') : '資料建置中';
};

const getComparisonFieldValue = (school: any, field: string): string | number => {
  if (field === 'region') return school.region || '未提供';
  if (field === 'type') return school.type || '未提供';
  if (field === 'ownership') return formatSchoolOwnership(school.ownership);
  if (field === 'group') return school.group || '—';
  if (field === 'historicalScores') return formatComparisonHistoricalScores(school);
  if (field === 'admissionQuota') return school.admissionQuota === null || school.admissionQuota === undefined ? '尚未公告' : Number(school.admissionQuota);
  if (field === 'map') return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name || '')}`;
  return '—';
};

const getComparisonColumns = (visibleFields: string[]) => [
  { id: 'name', label: '學校（科系）' },
  ...visibleFields.filter((field) => field !== 'map' && comparisonFieldLabels[field]).map((field) => ({ id: field, label: comparisonFieldLabels[field] })),
];

export const exportComparisonExcel = async ({ schools, visibleFields }: ComparisonExportOptions) => {
  const { default: ExcelJS } = await import('exceljs');
  const columns = getComparisonColumns(visibleFields);
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'TW 全國會考落點分析';
  workbook.created = new Date();
  const worksheet = workbook.addWorksheet('比較表');
  const lastColumn = String.fromCharCode(64 + columns.length);

  worksheet.mergeCells(`A1:${lastColumn}1`);
  worksheet.getCell('A1').value = '會考落點分析｜學校比較表';
  worksheet.getCell('A1').font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
  worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
  worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(1).height = 30;
  worksheet.mergeCells(`A2:${lastColumn}2`);
  worksheet.getCell('A2').value = `匯出時間：${new Date().toLocaleString('zh-TW')}｜共 ${schools.length} 所學校`;
  worksheet.getCell('A2').font = { bold: true, color: { argb: 'FF475569' } };
  worksheet.getCell('A2').alignment = { horizontal: 'left', vertical: 'middle' };
  worksheet.getRow(2).height = 22;
  worksheet.addRow(columns.map((column) => column.label));
  const headerRow = worksheet.getRow(3);
  headerRow.height = 26;
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });

  schools.forEach((school) => {
    const row = worksheet.addRow(columns.map((column) => column.id === 'name' ? school.name || '未命名學校' : getComparisonFieldValue(school, column.id)));
    row.height = visibleFields.includes('historicalScores') ? 56 : 24;
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'middle', wrapText: true };
      cell.border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
    });
  });
  worksheet.views = [{ state: 'frozen', ySplit: 3, showGridLines: false }];
  const tableEndRow = worksheet.rowCount;
  worksheet.autoFilter = { from: 'A3', to: `${lastColumn}${tableEndRow}` };
  worksheet.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
  worksheet.pageSetup.margins = { left: 0.25, right: 0.25, top: 0.45, bottom: 0.45, header: 0.2, footer: 0.2 };
  worksheet.headerFooter.oddFooter = '第 &P 頁，共 &N 頁';
  columns.forEach((column, index) => {
    worksheet.getColumn(index + 1).width = column.id === 'name' ? 28 : column.id === 'historicalScores' ? 36 : column.id === 'map' ? 54 : 18;
  });
  worksheet.addRow([]);
  const websiteRow = worksheet.addRow([`網站網址：${window.location.href}`]);
  worksheet.mergeCells(`A${websiteRow.number}:${lastColumn}${websiteRow.number}`);
  websiteRow.getCell(1).font = { bold: true, color: { argb: 'FF475569' } };
  websiteRow.getCell(1).alignment = { vertical: 'middle', wrapText: true };
  const disclaimerRow = worksheet.addRow(['免責聲明：本系統分析結果僅供參考，不代表實際錄取結果；請以各校最新官方招生簡章與公告為準。']);
  worksheet.mergeCells(`A${disclaimerRow.number}:${lastColumn}${disclaimerRow.number}`);
  disclaimerRow.getCell(1).font = { bold: true, color: { argb: 'FF92400E' } };
  disclaimerRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF7ED' } };
  disclaimerRow.getCell(1).alignment = { vertical: 'middle', wrapText: true };
  disclaimerRow.height = 32;

  const content = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `會考落點分析_學校比較_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const printComparison = ({ schools, visibleFields }: ComparisonExportOptions, existingWindow?: Window) => {
  const printWindow = existingWindow || window.open('', '_blank');
  if (!printWindow) {
    alert('無法開啟列印視窗，請檢查是否被瀏覽器阻擋。');
    return;
  }
  const columns = getComparisonColumns(visibleFields);
  const headerHtml = columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('');
  const rowsHtml = schools.map((school) => `<tr>${columns.map((column) => {
    const value = column.id === 'name' ? school.name || '未命名學校' : getComparisonFieldValue(school, column.id);
    return `<td>${escapeHtml(value).replace(/\n/g, '<br>')}</td>`;
  }).join('')}</tr>`).join('');

  printWindow.document.write(`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><title>會考落點分析｜學校比較表</title><style>body{font-family:"Noto Sans TC","Microsoft JhengHei",Arial,sans-serif;color:#0f172a;margin:28px}h1{margin:0;font-size:24px}p{color:#475569;font-size:12px}table{width:100%;border-collapse:collapse;margin-top:20px;font-size:12px}th{background:#1e293b;color:#fff;text-align:left;padding:10px;border:1px solid #0f172a}td{vertical-align:top;padding:9px;border:1px solid #cbd5e1;line-height:1.55}tr:nth-child(even){background:#f8fafc}.print-footer{margin-top:18px;border-top:2px solid #cbd5e1;padding-top:10px;font-size:11px;line-height:1.65;color:#475569}.print-footer strong{color:#92400e}@page{size:landscape;margin:12mm}@media print{body{margin:0}thead{display:table-header-group}tr{break-inside:avoid}}</style></head><body><h1>會考落點分析｜學校比較表</h1><p>列印時間：${escapeHtml(new Date().toLocaleString('zh-TW'))}　・　共 ${schools.length} 所學校</p><table><thead><tr>${headerHtml}</tr></thead><tbody>${rowsHtml}</tbody></table><footer class="print-footer"><div>網站網址：${escapeHtml(window.location.href)}</div><div><strong>免責聲明：</strong>本系統分析結果僅供參考，不代表實際錄取結果；請以各校最新官方招生簡章與公告為準。</div></footer></body></html>`);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 250);
};

export const printResults = (data: any, regionName: string, existingWindow?: Window) => {
  const printWindow = existingWindow || window.open('', '_blank');
  if (!printWindow) {
    alert('無法開啟報告預覽，請檢查是否被瀏覽器阻擋。');
    return;
  }

  const html = buildResultsPrintHtml(data, regionName);
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.document.querySelector<HTMLButtonElement>('.btn-print')?.addEventListener('click', () => {
    if (!printWindow.closed) printWindow.print();
  });
  printWindow.focus();
};

export const printSchoolTypes = () => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('無法開啟列印視窗，請檢查是否被瀏覽器阻擋。');
    return;
  }

  const currentDate = new Date().toLocaleString('zh-TW');
  const rawCurrentUrl = window.location.href;
  // Keep the raw URL for QR encoding, but never interpolate it into popup HTML.
  const currentUrl = escapeHtml(rawCurrentUrl);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(rawCurrentUrl)}`;

  const html = `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
      <meta charset="UTF-8">
      <title>學校類型解析 - TW全國會考落點分析</title>
      <style>
        @page {
          size: A4;
          margin: 10mm;
        }
        body {
          font-family: "PingFang TC", "Hiragino Sans GB", "Microsoft JhengHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 0;
          color: #0f172a;
          background: #f8fafc;
          font-size: 11px;
          line-height: 1.3;
        }
        .print-container {
          max-width: 100%;
          margin: 0 auto;
          background: #ffffff;
          padding: 0;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #0f172a;
        }
        .header-left h1 {
          font-size: 20px;
          font-weight: 900;
          margin: 0 0 4px 0;
          color: #0f172a;
          text-align: left;
        }
        .header-left p {
          color: #64748b;
          font-size: 11px;
          margin: 0;
          text-align: left;
        }
        .header-right {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .qr-box {
          background: #fff;
          padding: 4px;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          display: inline-block;
        }
        .qr-box img {
          width: 44px;
          height: 44px;
          display: block;
        }
        .site-link {
          font-size: 9px;
          color: #64748b;
          margin-top: 4px;
          max-width: 120px;
          word-break: break-all;
          line-height: 1.2;
          text-align: right;
        }
        
        .section-title {
          font-size: 14px;
          font-weight: 900;
          color: #0f172a;
          margin-top: 12px;
          margin-bottom: 8px;
          padding-left: 8px;
          border-left: 4px solid #3b82f6;
        }
        
        :root { --print-table-grid: #94a3b8; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 12px;
          border: 1px solid var(--print-table-grid);
        }
        th, td {
          border: 1px solid var(--print-table-grid);
          padding: 4px 8px;
          text-align: left;
        }
        th {
          background-color: #f1f5f9;
          font-weight: 800;
          color: #0f172a;
        }
        td {
          font-weight: 600;
          color: #334155;
        }
        
        .card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }
        
        .card {
          border: 1px solid #0f172a;
          border-radius: 8px;
          padding: 10px;
          break-inside: avoid;
        }
        .card h3 {
          font-size: 13px;
          font-weight: 900;
          margin-top: 0;
          margin-bottom: 6px;
          padding-bottom: 4px;
          border-bottom: 1px solid #e2e8f0;
        }
        .card p {
          margin-bottom: 4px;
          font-weight: 600;
        }
        .card p strong {
          color: #0f172a;
          font-weight: 900;
          margin-right: 4px;
        }
        
        .card-full {
          grid-column: 1 / -1;
        }
        
        ul, ol {
          margin-top: 2px;
          margin-bottom: 2px;
          padding-left: 18px;
        }
        li {
          margin-bottom: 2px;
        }
        
        .school-pt { border-color: #10b981; background: #ecfdf5; }
        .school-pt h3 { color: #047857; border-color: #a7f3d0; }
        
        .school-zh { border-color: #0ea5e9; background: #f0f9ff; }
        .school-zh h3 { color: #0369a1; border-color: #bae6fd; }
        
        .school-js { border-color: #f59e0b; background: #fffbeb; }
        .school-js h3 { color: #b45309; border-color: #fde68a; }
        
        .school-dk { border-color: #f43f5e; background: #fff1f2; }
        .school-dk h3 { color: #be123c; border-color: #fecdd3; }
        
        .school-wz { border-color: #a855f7; background: #faf5ff; }
        .school-wz h3 { color: #7e22ce; border-color: #e9d5ff; }

        .flex-tables {
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        
        .flex-tables > div {
          flex: 1;
        }

        @media print {
          body { background: white; }
          .print-container { padding: 0; max-width: 100%; border: none; box-shadow: none; }
          .card { border-width: 1px; }
        }
      </style>
    </head>
    <body>
      <div class="print-container">
        <div class="header">
          <div class="header-left">
            <h1>學校類型解析指南</h1>
            <p>列印日期：${currentDate} | TW全國會考落點分析系統</p>
          </div>
          <div class="header-right">
            <div class="qr-box">
              <img src="${qrCodeUrl}" alt="QR Code" />
            </div>
            <div class="site-link">掃描查看原網站<br/>${currentUrl}</div>
          </div>
        </div>

        <div class="section-title">綜合比較表</div>
        <table>
          <thead>
            <tr>
              <th>類型</th>
              <th>就讀年份</th>
              <th>課程特色</th>
              <th>適合學生</th>
              <th>畢業出路</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="color: #047857; font-weight: 800;">普通型高中</td>
              <td>3</td>
              <td>學科為主，重視通識與基礎學科</td>
              <td>想升大學、探索學術領域</td>
              <td>大學或科技大學</td>
            </tr>
            <tr>
              <td style="color: #0369a1; font-weight: 800;">綜合型高中</td>
              <td>3</td>
              <td>學科＋專業技能＋實習</td>
              <td>對專業技能有興趣</td>
              <td>就業、科技大學、專科</td>
            </tr>
            <tr>
              <td style="color: #b45309; font-weight: 800;">技術型高中</td>
              <td>3</td>
              <td>普通＋技術並行，提供探索</td>
              <td>尚未確定方向，邊學邊試</td>
              <td>大學、專科、就業</td>
            </tr>
            <tr>
              <td style="color: #be123c; font-weight: 800;">單科型高中</td>
              <td>3</td>
              <td>專注特定領域（如體育、藝術、科學）</td>
              <td>有明確專長或天賦</td>
              <td>升讀相關科系或專長發展</td>
            </tr>
            <tr>
              <td style="color: #7e22ce; font-weight: 800;">五專</td>
              <td>5</td>
              <td>五年一貫，專業銜接完整</td>
              <td>已確定專業興趣</td>
              <td>就業、二技、大學</td>
            </tr>
          </tbody>
        </table>

        <div class="section-title">四種類型詳細解析</div>
        <div class="card-grid">
          <div class="card school-pt">
            <h3>普通型高中 (就讀3年)</h3>
            <p><strong>適合:</strong> 對學術研究有濃厚興趣、尚未決定特定職業方向、想持續探索多元學科領域的學生。</p>
            <p><strong>課程:</strong> 以學術知能為核心，強調基礎考科（國/英/數/自然/社會），並搭配通識教育與多元選修。</p>
            <p><strong>出路:</strong> 主要透過學測、分科測驗，升讀<strong>一般大學</strong>。</p>
          </div>
          
          <div class="card school-zh">
            <h3>綜合型高中 (就讀3年)</h3>
            <p><strong>適合:</strong> 畢業前尚未決定要走學術路線或技術路線，希望多一年的時間一邊學習一邊摸索未來的學生。</p>
            <p><strong>課程:</strong> 高一不分流修習基礎科目；高二起依志向，自由選修「學術學程」(偏高)或「專門學程」(偏職)。</p>
            <p><strong>出路:</strong> 可報考學測升讀一般大學，或報考統測升讀科大/專科，也可選擇就業。</p>
          </div>
          
          <div class="card school-js">
            <h3>技術型高中/高職 (就讀3年)</h3>
            <p><strong>適合:</strong> 對特定技術領域已有興趣，喜歡動手實作，希望能提早學習一技之長的學生。</p>
            <p><strong>課程:</strong> 第一年涵蓋共同科目與基礎專業；後兩年著重於進階專業科目與大量實習實作，培養實戰力。</p>
            <p><strong>出路:</strong> 統測為主，升讀科大、專科學校，或憑技能投入職場就業。</p>
          </div>
          
          <div class="card school-dk">
            <h3>單科型高中 (就讀3年)</h3>
            <p><strong>適合:</strong> 已具備極高的專長天賦（如術科頂尖）或非常明確的高度興趣，決心深耕單一領域者。</p>
            <p><strong>課程:</strong> 針對特定領域（如體育/藝術/科學/音樂等）提供高度專業且密集的訓練。</p>
            <p><strong>出路:</strong> 術科考試或保送甄試為主，升學至特定領域相關學系，或成為職業選手/藝術家。</p>
          </div>

          <div class="card school-wz card-full">
            <h3>五專 (五年制專科學校) - 就讀5年</h3>
            <div style="display: flex; gap: 24px;">
              <div style="flex: 1;">
                <p><strong>學制:</strong> 五年一貫(前3年為高中職，後2年專科)，免受升大學階段性考試壓力。</p>
                <p><strong>招生:</strong> 採全國聯合招生，提供優免、聯免、完免等管道。</p>
                <p><strong>課程:</strong> 前段為基礎，後段著重專業實務知能與企業實習。修畢五年課程授予<strong>副學士學位</strong>。</p>
              </div>
              <div style="flex: 1;">
                <p><strong>適合:</strong> 確立興趣（如護理、外語、資訊等），想避開升學考，盡早培養職場能力者。</p>
                <p><strong>就業:</strong> 以一技之長提早進入職場，起薪通常具備優勢。</p>
                <p><strong>升學:</strong> 可報考二技(取得學士)、插考大學轉學考，或畢業滿三年以上可報考研究所。</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-tables">
          <div>
            <div class="section-title">高職與高中學程差異比較</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">項目</th>
                  <th style="width: 37.5%;">高中</th>
                  <th style="width: 37.5%;">高職</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>課程導向</strong></td>
                  <td>學術基礎知識 (依各校設班群)</td>
                  <td>專門技術實作 (共15個專業群別)</td>
                </tr>
                <tr>
                  <td><strong>考試類型</strong></td>
                  <td>學測、分科</td>
                  <td>學測、統測</td>
                </tr>
                <tr>
                  <td><strong>考試科目</strong></td>
                  <td>
                    <div style="color: #4f46e5; font-weight: 800;">▶ 學測:</div>
                    <p style="margin: 2px 0 6px 0;">國/英/數/社/自</p>
                    <div style="color: #4f46e5; font-weight: 800;">▶ 分科:</div>
                    <p style="margin: 2px 0 0 0;">數甲/物/化/生/歷/地/公</p>
                  </td>
                  <td>
                    <div style="color: #d97706; font-weight: 800;">▶ 學測:</div>
                    <p style="margin: 2px 0 6px 0;">國/英/數/社/自</p>
                    <div style="color: #d97706; font-weight: 800;">▶ 統測: (共20群別)</div>
                    <p style="margin: 2px 0 0 0;">國/英/數/專(一)/專(二)</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <div class="section-title">升學管道差異</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 25%;">學制</th>
                  <th style="width: 37.5%;">高中</th>
                  <th style="width: 37.5%;">高職</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="color: #4f46e5; font-weight: 800; font-size: 13px;">大學</td>
                  <td>
                    <ul style="padding-left:14px; margin:0">
                      <li>特殊選才</li>
                      <li>繁星推薦</li>
                      <li>申請入學</li>
                      <li>考試分發</li>
                    </ul>
                  </td>
                  <td>
                    <ul style="padding-left:14px; margin:0">
                      <li>特殊選才</li>
                      <li>申請入學</li>
                      <li>考試分發</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td style="color: #d97706; font-weight: 800; font-size: 13px;">四技<br/>二專</td>
                  <td>
                    <ul style="padding-left:14px; margin:0">
                      <li>特殊選才</li>
                      <li>四技申請入學</li>
                      <li>技優保送/甄審</li>
                    </ul>
                  </td>
                  <td>
                    <ul style="padding-left:14px; margin:0">
                      <li>特殊選才</li>
                      <li>技職繁星</li>
                      <li>四技甄選</li>
                      <li>統測分發</li>
                      <li>技優保送/甄審</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="margin-top: 12px; text-align: center; color: #94a3b8; font-size: 10px;">
          <p>本資料表僅供參考，詳情請以官方最新之招生簡章為準。</p>
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
