import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Plus, Trash2, ArrowUp, ArrowDown, Building2, Target, AlertCircle, Loader2, Printer, Filter, ChevronDown, AlertTriangle } from 'lucide-react';
import { ALL_REGIONS } from './RegionModal';
import { callBackend } from '../lib/api';

interface SchoolItem {
  id: string;
  county: string;
  code: string;
  name: string;
  levelInfo: string;
  shift: string;
  groupCode: string;
  groupName: string;
  deptCode: string;
  deptName: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  region: string;
}

const REGION_TO_COUNTIES: Record<string, string[]> = {
  'taipei': ['基隆市', '臺北市', '新北市'],
  'taoyuan': ['桃園市', '連江縣'],
  'hsinchu': ['新竹市', '新竹縣', '苗栗縣'],
  'central': ['臺中市', '南投縣'],
  'changhua': ['彰化縣'],
  'yunlin': ['雲林縣'],
  'chiayi': ['嘉義市', '嘉義縣'],
  'tainan': ['臺南市'],
  'kaohsiung': ['高雄市'],
  'pingtung': ['屏東縣'],
};

export default function MockVolunteerModal({ isOpen, onClose, region }: Props) {
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRegion, setFilterRegion] = useState(region);
  const [filterOwnership, setFilterOwnership] = useState('all');
  const [filterCounty, setFilterCounty] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [crossRegionWarning, setCrossRegionWarning] = useState<SchoolItem | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>('');
  
  const [selectedChoices, setSelectedChoices] = useState<SchoolItem[]>([]);

  useEffect(() => {
    if (isOpen && schools.length === 0) {
      fetchSchools();
    }
  }, [isOpen]);

  const fetchSchools = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await callBackend<{ schools: SchoolItem[] }>({
        action: 'getVolunteerSchools',
        region,
      });
      if (data && data.schools && Array.isArray(data.schools)) {
        setSchools(data.schools);
      } else if (Array.isArray(data) && data.length > 0) {
         setSchools(data);
      } else {
        // Fallback or empty handle
        setSchools([
          { id: '1', county: '新北市', code: '010301', name: '國立華僑高級中等學校', levelInfo: '普通科', shift: '日間部', groupCode: '11', groupName: '學術群', deptCode: '101', deptName: '普通科' },
          { id: '2', county: '新北市', code: '011301', name: '私立淡江高中', levelInfo: '普通科', shift: '日間部', groupCode: '11', groupName: '學術群', deptCode: '101', deptName: '普通科' },
          { id: '3', county: '臺北市', code: '333401', name: '市立大安高工', levelInfo: '專業群科', shift: '日間部', groupCode: '21', groupName: '機械群', deptCode: '301', deptName: '機械科' },
        ]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('無法連接雲端資料庫，顯示部分離線測試資料');
      // fallback
      setSchools([
         { id: '1', county: '新北市', code: '010301', name: '國立華僑高級中等學校', levelInfo: '普通科', shift: '日間部', groupCode: '11', groupName: '學術群', deptCode: '101', deptName: '普通科' },
         { id: '2', county: '新北市', code: '011301', name: '私立淡江高中', levelInfo: '專業群科', shift: '日間部', groupCode: '26', groupName: '商業群', deptCode: '401', deptName: '資料處理科' },
         { id: '3', county: '臺北市', code: '333401', name: '市立大安高工', levelInfo: '專業群科', shift: '日間部', groupCode: '21', groupName: '機械群', deptCode: '301', deptName: '機械科' },
         { id: '4', county: '臺北市', code: '333401', name: '市立大安高工', levelInfo: '專業群科', shift: '日間部', groupCode: '23', groupName: '電機電子群', deptCode: '305', deptName: '資訊科' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const effectiveRegion = useMemo(() => {
    if (selectedChoices.length > 0) {
      const firstSchoolCounty = selectedChoices[0].county;
      if (firstSchoolCounty) {
        const formattedCounty = firstSchoolCounty.replace(/臺/g, '台');
        for (const [reg, counties] of Object.entries(REGION_TO_COUNTIES)) {
          const formattedCounties = counties.map(c => c.replace(/臺/g, '台'));
          if (formattedCounties.includes(formattedCounty)) {
            return reg;
          }
        }
      }
    }
    return region || 'taipei';
  }, [selectedChoices, region]);

  const allowedCountiesInRegion = useMemo(() => {
    if (filterRegion === 'all') return [];
    return (REGION_TO_COUNTIES[filterRegion] || []).map(c => c.replace(/臺/g, '台'));
  }, [filterRegion]);
  
  const uniqueCounties = useMemo(() => {
    return Array.from(new Set(schools.filter(s => {
      const c = s.county ? s.county.replace(/臺/g, '台') : '';
      return allowedCountiesInRegion.length === 0 || allowedCountiesInRegion.includes(c);
    }).map(s => s.county))).sort();
  }, [schools, allowedCountiesInRegion]);

  const uniqueTypes = useMemo(() => {
    return Array.from(new Set(schools.map(s => s.levelInfo).filter(Boolean))).sort();
  }, [schools]);

  const uniqueGroups = useMemo(() => {
    return Array.from(new Set(schools.map(s => s.groupName).filter(Boolean))).sort();
  }, [schools]);

  const filteredSchools = useMemo(() => {
    return schools.filter(s => {
      const c = s.county ? s.county.replace(/臺/g, '台') : '';
      const inRegion = allowedCountiesInRegion.length > 0 ? allowedCountiesInRegion.includes(c) : true;
      if (!inRegion) return false;

      if (filterOwnership !== 'all') {
        const isPublic = s.name.includes('國立') || s.name.includes('市立') || s.name.includes('縣立');
        if (filterOwnership === 'public' && !isPublic) return false;
        if (filterOwnership === 'private' && isPublic) return false;
      }

      if (filterCounty !== 'all' && s.county !== filterCounty) return false;
      if (filterType !== 'all' && s.levelInfo !== filterType) return false;
      if (filterGroup !== 'all' && s.groupName !== filterGroup) return false;

      if (!searchQuery) return true;

      return s.name.includes(searchQuery) || 
        (s.deptName && s.deptName.includes(searchQuery)) || 
        s.county.includes(searchQuery) ||
        (s.groupName && s.groupName.includes(searchQuery));
    });
  }, [schools, allowedCountiesInRegion, searchQuery, filterOwnership, filterCounty, filterType, filterGroup]);

  const handleAddChoice = (school: SchoolItem) => {
    if (selectedChoices.length >= 30) {
      setAlertMessage('最多只能選填 30 個志願');
      return;
    }
    const isExist = selectedChoices.find(c => c.code === school.code && c.deptCode === school.deptCode);
    if (isExist) {
        setAlertMessage('此志願已在清單中');
        return;
    }
    
    // 防呆：跨區警告
    if (selectedChoices.length > 0) {
      const userRegionId = effectiveRegion;
      const userRegionCounties = (REGION_TO_COUNTIES[userRegionId] || []).map(c => c.replace(/臺/g, '台'));
      const schoolCounty = school.county ? school.county.replace(/臺/g, '台') : '';
      if (userRegionCounties.length > 0 && !userRegionCounties.includes(schoolCounty)) {
        setCrossRegionWarning(school);
        return;
      }
    }

    confirmAddChoice(school);
  };

  const confirmAddChoice = (school: SchoolItem) => {
    setSelectedChoices([...selectedChoices, { ...school, id: Math.random().toString() }]);
    setCrossRegionWarning(null);
  };

  const handleRemoveChoice = (index: number) => {
    const newChoices = [...selectedChoices];
    newChoices.splice(index, 1);
    setSelectedChoices(newChoices);
  };

  const handleMoveTo = (currentIndex: number, targetIndex: number) => {
    if (currentIndex === targetIndex) return;
    const newChoices = [...selectedChoices];
    const item = newChoices.splice(currentIndex, 1)[0];
    newChoices.splice(targetIndex, 0, item);
    setSelectedChoices(newChoices);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newChoices = [...selectedChoices];
    const temp = newChoices[index - 1];
    newChoices[index - 1] = newChoices[index];
    newChoices[index] = temp;
    setSelectedChoices(newChoices);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedChoices.length - 1) return;
    const newChoices = [...selectedChoices];
    const temp = newChoices[index + 1];
    newChoices[index + 1] = newChoices[index];
    newChoices[index] = temp;
    setSelectedChoices(newChoices);
  };

  const handlePrint = () => {
    if (selectedChoices.length === 0) return;
    
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) {
      setAlertMessage('請允許瀏覽器彈出視窗以進行列印');
      return;
    }

    const regionNameMapping: Record<string, string> = {
      'taipei': '基北區',
      'taoyuan': '桃聯區',
      'hsinchu': '竹苗區',
      'central': '中投區',
      'changhua': '彰化區',
      'tainan': '台南區',
      'kaohsiung': '高雄區'
    };

    const regionName = regionNameMapping[effectiveRegion] || effectiveRegion;

    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${regionName} 個人模擬志願選填清單</title>
          <style>
            @page { size: A4 portrait; margin: 5mm; }
            html, body { height: 100%; }
            body { font-family: "PingFang TC", "Microsoft JhengHei", sans-serif; color: #0f172a; margin: 0; padding: 0; font-size: 10px; }
            .container { 
               display: flex; 
               flex-direction: column; 
               height: 100%;
               max-height: 100%;
               box-sizing: border-box;
            }
            h1 { text-align: center; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 5px; margin-bottom: 5px; font-size: 16px; margin-top: 5px; }
            p { margin: 2px 0; font-size: 9px; color: #475569; }
            table { width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 9px; table-layout: fixed; }
            th, td { border: 1px solid #94a3b8; padding: 3px 4px; text-align: left; vertical-align: middle; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; line-height: 1.1; }
            th { background-color: #f1f5f9; font-weight: bold; color: #0f172a; border-bottom: 2px solid #64748b; }
            tr { page-break-inside: avoid; height: 14px; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .seq { text-align: center; font-weight: bold; width: 6%; }
            .col-name { width: 34%; }
            .col-dept { width: 30%; }
            .col-group { width: 20%; }
            .col-county { width: 10%; }
          </style>
        </head>
        <body>
          <div class="container">
          <h1>${regionName} 模擬志願選填表</h1>
          <div style="display: flex; justify-content: space-between; align-items: flex-end;">
             <p>列印日期: ${new Date().toLocaleDateString()}</p>
             <p>共計 ${selectedChoices.length} 個志願</p>
          </div>
          <table>
            <thead>
              <tr>
                <th class="seq">志願序</th>
                <th class="col-name">學校名稱</th>
                <th class="col-dept">科系名稱</th>
                <th class="col-group">群別 / 類型</th>
                <th class="col-county">縣市</th>
              </tr>
            </thead>
            <tbody>
    `;

    selectedChoices.forEach((c, i) => {
      html += `
        <tr>
          <td class="seq">${i + 1}</td>
          <td><strong>${c.name}</strong></td>
          <td>${c.deptName} ${c.shift && c.shift !== '日間部' ? `<span style="color:#64748b; font-size: 10px;">(${c.shift})</span>` : ''}</td>
          <td>${c.groupName || c.levelInfo}</td>
          <td>${c.county}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
          <div style="flex: 1;"></div>
          <p style="margin-top: 10px; text-align: center; color: #64748b; font-size: 9px; padding-bottom: 5px;">本表僅供參考非官方系統，實際分發結果依各區免試入學委員會公告為準</p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const [mobileTab, setMobileTab] = useState<'search' | 'selected'>('search');

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={onClose}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] w-full max-w-6xl h-[90vh] flex flex-col relative z-10 overflow-hidden"
            >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b-4 border-slate-900 bg-sky-50 gap-4 shrink-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full pr-12">
              <div className="w-12 h-12 bg-sky-400 border-2 border-slate-900 rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] shrink-0 -rotate-3">
                <Target className="w-6 h-6 text-slate-900" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">模擬志願選填清單</h2>
                <p className="text-xs sm:text-sm font-bold text-slate-600 mt-1">從資料庫加入您的理想校系並進行志願序排序</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 hover:bg-slate-200 rounded-xl transition-colors active:scale-95 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] z-10"
            >
              <X className="w-5 h-5 text-slate-900" />
            </button>
          </div>

          {/* Mobile Tabs */}
          <div className="flex lg:hidden border-b-4 border-slate-900 bg-white shrink-0">
            <button
              onClick={() => setMobileTab('search')}
              className={`flex-1 py-3 font-black transition-colors flex items-center justify-center gap-2 ${mobileTab === 'search' ? 'bg-sky-50 text-sky-700 border-b-4 border-sky-400 -mb-1' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Search className="w-4 h-4" /> 搜尋校系
            </button>
            <button
              onClick={() => setMobileTab('selected')}
              className={`flex-1 py-3 font-black transition-colors flex items-center justify-center gap-2 ${mobileTab === 'selected' ? 'bg-amber-50 text-amber-700 border-b-4 border-amber-400 -mb-1' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Target className="w-4 h-4" /> 我的志願 {selectedChoices.length > 0 && <span className="bg-slate-900 text-white px-2 py-0.5 rounded-full text-xs">{selectedChoices.length}</span>}
            </button>
          </div>

          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden bg-white">
            {/* Left: School List */}
            <div className={`${mobileTab === 'search' ? 'flex' : 'hidden'} lg:flex flex-1 lg:w-1/2 lg:border-r-4 border-slate-900 flex-col bg-slate-50 h-full overflow-hidden`}>
              <div className="p-3 sm:p-4 border-b-2 border-slate-200 shrink-0 bg-white">
                <div className="flex gap-2 relative">
                  <div className="relative flex-1">
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜尋學校名稱、科系、群別、縣市..."
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl border-2 border-slate-900 font-bold focus:ring-4 focus:ring-sky-400/30 transition-all outline-none bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-xs sm:text-base relative z-10"
                    />
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                  </div>
                  <button
                    onClick={() => setShowFilters(true)}
                    className="flex items-center justify-center p-2.5 sm:p-3 rounded-xl border-2 border-slate-900 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:scale-95 active:shadow-none active:translate-y-0.5 shrink-0 bg-white hover:bg-slate-50 text-slate-700 relative z-10"
                  >
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 custom-scrollbar">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
                    <p className="font-bold text-sm sm:text-base">連線至雲端讀取資料庫...</p>
                  </div>
                ) : error && schools.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-rose-500 space-y-2 text-center px-4">
                    <AlertCircle className="w-8 h-8" />
                    <p className="font-bold text-sm sm:text-base">{error}</p>
                    <button onClick={fetchSchools} className="mt-4 px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 text-sm">重試</button>
                  </div>
                ) : filteredSchools.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <p className="font-bold text-sm sm:text-base">找不到相符的校系</p>
                  </div>
                ) : (
                  filteredSchools.map((school, i) => {
                    const isSelected = selectedChoices.some(c => c.code === school.code && c.deptCode === school.deptCode);
                    return (
                    <div key={`${school.code}-${school.deptCode}-${i}`} className={`bg-white border-2 border-slate-900 rounded-xl p-3 sm:p-4 flex items-center justify-between transition-transform shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] group ${isSelected ? 'opacity-50 grayscale select-none pointer-events-none' : 'hover:-translate-y-1'}`}>
                      <div className="min-w-0 pr-3">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                          <span className="text-[10px] font-black bg-slate-100 px-1.5 sm:px-2 py-0.5 rounded-md border border-slate-300 text-slate-600 shrink-0">{school.county}</span>
                          <span className="text-[10px] font-black bg-sky-100 px-1.5 sm:px-2 py-0.5 rounded-md border border-sky-300 text-sky-800 shrink-0">{school.groupName || school.levelInfo}</span>
                        </div>
                        <h4 className="font-black text-slate-900 line-clamp-2 text-sm sm:text-base leading-snug" title={school.name}>{school.name}</h4>
                        <p className="text-xs sm:text-sm font-bold text-slate-500 flex items-center gap-1.5 mt-1" title={school.deptName}>
                          <Building2 className="w-3.5 h-3.5 shrink-0" />
                          <span className="line-clamp-1">{school.deptName} {school.shift && school.shift !== '日間部' ? `(${school.shift})` : ''}</span>
                        </p>
                      </div>
                      <button 
                        onClick={() => !isSelected && handleAddChoice(school)}
                        disabled={isSelected}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center border-2 border-slate-900 transition-all outline-none flex-shrink-0 text-slate-700 ${isSelected ? 'bg-slate-200 cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'bg-slate-50 hover:bg-sky-400 hover:text-slate-900 active:scale-95 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-none active:translate-y-0.5'}`}
                        title={isSelected ? "已加入" : "加入志願"}
                      >
                        <Plus className="w-4 h-4 sm:w-5 sm:h-5 font-black" />
                      </button>
                    </div>
                  )})
                )}
              </div>
            </div>

            {/* Right: Selected Choices */}
            <div className={`${mobileTab === 'selected' ? 'flex' : 'hidden'} lg:flex flex-1 lg:w-1/2 flex-col bg-slate-100 h-full overflow-hidden`}>
              <div className="p-3 sm:p-4 border-b-2 border-slate-200 flex items-center justify-between bg-white shrink-0 sm:sticky top-0 z-10 shadow-sm">
                <div>
                  <h3 className="font-black text-slate-900 text-base sm:text-lg">我的志願順序</h3>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">已選 {selectedChoices.length} / 30 項志願</p>
                </div>
                {selectedChoices.length > 0 && (
                  <div className="flex gap-1.5 sm:gap-2">
                    <button 
                      onClick={handlePrint}
                      className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-black text-sky-700 bg-sky-50 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg border-2 border-slate-900 transition-all whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                    >
                      <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">列印</span>
                    </button>
                    {showClearConfirm ? (
                      <div className="flex gap-1.5 sm:gap-2">
                        <button 
                          onClick={() => {
                              setSelectedChoices([]);
                              setShowClearConfirm(false);
                          }}
                          className="text-[10px] sm:text-xs font-black text-white bg-rose-600 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg border-2 border-slate-900 transition-all whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                        >
                          確定清空
                        </button>
                        <button 
                          onClick={() => setShowClearConfirm(false)}
                          className="text-[10px] sm:text-xs font-black text-slate-700 bg-slate-100 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg border-2 border-slate-900 transition-all whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowClearConfirm(true)}
                        className="text-[10px] sm:text-xs font-black text-rose-700 bg-rose-50 px-2 sm:px-3 py-2 sm:py-1.5 rounded-lg border-2 border-slate-900 transition-all whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                      >
                        清空全部
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 custom-scrollbar relative">
                {selectedChoices.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-slate-400 opacity-60">
                    <Target className="w-12 sm:w-16 h-12 sm:h-16 mb-4 stroke-1" />
                    <p className="font-black text-base sm:text-lg">尚未選擇任何志願</p>
                    <p className="text-xs sm:text-sm font-bold mt-1 max-w-[200px] text-center">請從列表加入想讀的校系</p>
                  </div>
                ) : (
                  selectedChoices.map((choice, index) => (
                    <div key={choice.id} className="bg-white border-2 border-slate-900 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden group">
                      <select
                        value={index + 1}
                        onChange={(e) => handleMoveTo(index, parseInt(e.target.value) - 1)}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg border-2 border-slate-900 bg-amber-300 text-slate-900 font-black flex items-center justify-center shrink-0 mt-3 sm:mt-0 text-sm sm:text-base text-center appearance-none outline-none cursor-pointer pl-2 sm:pl-3"
                      >
                        {selectedChoices.map((_, i) => (
                          <option key={i} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <div className="flex-1 min-w-0 flex flex-col justify-center pt-1 sm:pt-0">
                        <h4 className="font-black text-slate-900 line-clamp-2 pr-12 sm:pr-20 text-sm sm:text-base leading-snug" title={choice.name}>{choice.name}</h4>
                        <p className="text-[11px] sm:text-sm font-bold text-sky-700 mt-0.5 line-clamp-2" title={choice.deptName}>{choice.deptName}</p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 mt-2 pt-2 border-t-2 border-slate-100 sm:border-0 sm:pt-0 sm:mt-0">
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                            className={`p-1.5 rounded-lg border-2 border-slate-900 transition-all ${index === 0 ? 'bg-slate-100 text-slate-300 border-slate-300 cursor-not-allowed' : 'bg-slate-50 hover:bg-slate-200 active:scale-95 text-slate-700 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'}`}
                            title="往上移"
                          >
                            <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-inherit" />
                          </button>
                          <button 
                            onClick={() => handleMoveDown(index)}
                            disabled={index === selectedChoices.length - 1}
                            className={`p-1.5 rounded-lg border-2 border-slate-900 transition-all ${index === selectedChoices.length - 1 ? 'bg-slate-100 text-slate-300 border-slate-300 cursor-not-allowed' : 'bg-slate-50 hover:bg-slate-200 active:scale-95 text-slate-700 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'}`}
                            title="往下移"
                          >
                            <ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-inherit" />
                          </button>
                        </div>
                        <button 
                          onClick={() => handleRemoveChoice(index)}
                          className="p-1.5 ml-1 sm:ml-2 rounded-lg border-2 border-slate-900 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 active:scale-95 transition-colors hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                          title="移除"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-inherit" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
          {/* Filters Modal */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.95, opacity: 0, y: 10 }}
                  className="bg-white rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] w-full max-w-md max-h-full flex flex-col overflow-hidden"
                >
                  <div className="flex justify-between items-center p-4 sm:p-5 border-b-2 border-slate-900 bg-sky-50 shrink-0">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-slate-900" />
                      <h3 className="font-black text-slate-900 text-lg">進階篩選</h3>
                    </div>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors active:scale-95"
                    >
                      <X className="w-5 h-5 text-slate-900" />
                    </button>
                  </div>
                  
                  <div className="p-4 sm:p-5 space-y-4 overflow-y-auto custom-scrollbar min-h-[300px]">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600 block">就學區</label>
                      <select 
                        value={filterRegion} 
                        onChange={(e) => {
                          setFilterRegion(e.target.value);
                          setFilterCounty('all');
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm font-bold focus:border-sky-400 focus:bg-white outline-none transition-colors"
                      >
                        <option value="all">全國</option>
                        {ALL_REGIONS.filter(r => r.active).map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600 block">學校縣市</label>
                      <select 
                        value={filterCounty} 
                        onChange={(e) => setFilterCounty(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm font-bold focus:border-sky-400 focus:bg-white outline-none transition-colors"
                      >
                        <option value="all">所有縣市</option>
                        {uniqueCounties.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600 block">公/私立</label>
                      <select 
                        value={filterOwnership} 
                        onChange={(e) => setFilterOwnership(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm font-bold focus:border-sky-400 focus:bg-white outline-none transition-colors"
                      >
                        <option value="all">不限</option>
                        <option value="public">公立</option>
                        <option value="private">私立</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600 block">科系類型</label>
                      <select 
                        value={filterType} 
                        onChange={(e) => {
                          setFilterType(e.target.value);
                          if (e.target.value !== '專業群科' && e.target.value !== 'all') {
                            setFilterGroup('all');
                          }
                        }}
                        className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm font-bold focus:border-sky-400 focus:bg-white outline-none transition-colors"
                      >
                        <option value="all">所有類型</option>
                        {uniqueTypes.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-600 block">職業群別</label>
                      <select 
                        value={filterGroup} 
                        onChange={(e) => setFilterGroup(e.target.value)}
                        disabled={filterType !== 'all' && filterType !== '專業群科'}
                        className="w-full px-3 py-2 bg-slate-50 border-2 border-slate-300 rounded-lg text-sm font-bold focus:border-sky-400 focus:bg-white outline-none disabled:bg-slate-100 disabled:opacity-50 transition-colors"
                      >
                        <option value="all">所有群別</option>
                        {uniqueGroups.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div className="p-4 sm:p-5 border-t-2 border-slate-200 bg-slate-50 relative mt-auto shrink-0">
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="w-full py-2.5 sm:py-3 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-800 active:scale-95 transition-all outline-none border-2 border-transparent focus:border-sky-400"
                    >
                      套用篩選
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {crossRegionWarning && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm shadow-[0_0_0_100vw_rgba(0,0,0,0.5)]"
              onClick={() => setCrossRegionWarning(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] w-full max-w-sm flex flex-col relative z-10 overflow-hidden"
            >
              <div className="p-5 sm:p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">跨區警告</h3>
                <p className="text-sm font-bold text-slate-600 mb-4 whitespace-pre-line text-left">
                  {`「${crossRegionWarning.name}」位於${crossRegionWarning.county}，非您所屬就學區。\n跨區選填可能需符合特殊規定，確定要加入此志願嗎？`}
                </p>
                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setCrossRegionWarning(null)}
                    className="flex-1 py-2 outline-none rounded-xl border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none"
                  >
                    取消
                  </button>
                  <button
                    onClick={() => confirmAddChoice(crossRegionWarning)}
                    className="flex-1 py-2 outline-none rounded-xl border-2 border-slate-900 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none"
                  >
                    確定加入
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {alertMessage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm shadow-[0_0_0_100vw_rgba(0,0,0,0.5)]"
              onClick={() => setAlertMessage('')}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-white rounded-2xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] w-full max-w-sm flex flex-col relative z-10 overflow-hidden"
            >
              <div className="p-5 sm:p-6 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center mb-4 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <AlertCircle className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">提示</h3>
                <p className="text-sm font-bold text-slate-600 mb-5">
                  {alertMessage}
                </p>
                <button
                  onClick={() => setAlertMessage('')}
                  className="w-full py-2 outline-none rounded-xl border-2 border-slate-900 bg-sky-400 hover:bg-sky-300 text-slate-900 font-black transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none"
                >
                  確認
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
