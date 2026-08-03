import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Building2,
  CheckCircle2,
  Filter,
  Loader2,
  Plus,
  Printer,
  Search,
  Target,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { callBackend } from '../lib/api';
import { withBasePath } from '../lib/routes';
import { pageNavigationAsideClassName } from './PageNavigation';

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

const createChoiceId = (school: SchoolItem) =>
  `${school.code}-${school.deptCode}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const REGION_COUNTIES: Record<string, string[]> = {
  taipei: ['基隆市', '臺北市', '新北市'],
  yilan: ['宜蘭縣'],
  taoyuan: ['桃園市', '連江縣'],
  hsinchu: ['新竹市', '新竹縣', '苗栗縣'],
  central: ['臺中市', '彰化縣', '南投縣'],
  changhua: ['彰化縣'],
  yunlin: ['雲林縣'],
  chiayi: ['嘉義市', '嘉義縣'],
  tainan: ['臺南市'],
  kaohsiung: ['高雄市'],
  pingtung: ['屏東縣'],
  hualien: ['花蓮縣'],
  taitung: ['臺東縣'],
  penghu: ['澎湖縣'],
  kinmen: ['金門縣'],
};

const MOCK_VOLUNTEER_REGIONS = [
  { id: 'taipei', name: '基北區' },
  { id: 'yilan', name: '宜蘭區' },
  { id: 'taoyuan', name: '桃連區' },
  { id: 'hsinchu', name: '竹苗區' },
  { id: 'central', name: '中投區' },
  { id: 'changhua', name: '彰化區' },
  { id: 'yunlin', name: '雲林區' },
  { id: 'chiayi', name: '嘉義區' },
  { id: 'tainan', name: '臺南區' },
  { id: 'kaohsiung', name: '高雄區' },
  { id: 'pingtung', name: '屏東區' },
  { id: 'hualien', name: '花蓮區' },
  { id: 'taitung', name: '臺東區' },
  { id: 'penghu', name: '澎湖區' },
  { id: 'kinmen', name: '金門區' },
];

const PREFERENCE_RULES: Record<string, string> = {
  taipei: '第 1–5 志願 36 分、第 6–10 志願 35 分、第 11–15 志願 34 分、第 16–20 志願 33 分、第 21–30 志願 32 分；同校類科連續選填視為同一志願序。',
  taoyuan: '第 1–3 志願 15 分，第 4–6 志願 12 分，之後每 3 個志願遞減；第 16–30 志願為 1 分。專業群科同職群連續選填視為同一志願序。',
  hsinchu: '第 1–5 志願序位 10 分，之後每 5 個志願序遞減 1 分，至第 21–25 志願序位為 6 分；同校同學群連續選填視為同一志願序。',
  central: '第 1–10 志願序 30 分、第 11–20 志願序 29 分、第 21 志願序以後 28 分；同校類科連續選填視為同一志願序。',
  changhua: '第 1–20 志願序 45 分，第 21 志願序以後 44 分；同校同職群連續選填視為同一志願序。',
  tainan: '第 1–3 志願 10 分，之後每 3 個志願遞減 1 分；第 16–30 志願為 5 分。',
  kaohsiung: '每 10 所學校為一個志願學校群：第 1 群 30 分、第 2 群 29 分、第 3 群 28 分；同校不同科連續選填以同一所學校計算。',
};

const getPreferenceScore = (region: string, rank: number): number | null => {
  if (region === 'taipei') return rank <= 5 ? 36 : rank <= 10 ? 35 : rank <= 15 ? 34 : rank <= 20 ? 33 : rank <= 30 ? 32 : null;
  if (region === 'taoyuan') return rank <= 3 ? 15 : rank <= 6 ? 12 : rank <= 9 ? 9 : rank <= 12 ? 6 : rank <= 15 ? 3 : rank <= 30 ? 1 : null;
  if (region === 'hsinchu') return rank <= 5 ? 10 : rank <= 10 ? 9 : rank <= 15 ? 8 : rank <= 20 ? 7 : rank <= 25 ? 6 : null;
  if (region === 'central') return rank <= 10 ? 30 : rank <= 20 ? 29 : rank <= 30 ? 28 : null;
  if (region === 'changhua') return rank <= 20 ? 45 : rank <= 30 ? 44 : null;
  if (region === 'tainan') return rank <= 3 ? 10 : rank <= 6 ? 9 : rank <= 9 ? 8 : rank <= 12 ? 7 : rank <= 15 ? 6 : rank <= 30 ? 5 : null;
  if (region === 'kaohsiung') return rank <= 10 ? 30 : rank <= 20 ? 29 : rank <= 30 ? 28 : null;
  return null;
};

// Only professional-program departments are vocational categories. Academic
// groups and comprehensive high-school programs must each keep their own rank.
const isVocationalProgram = (choice: SchoolItem) => choice.levelInfo?.trim() === '專業群科';

const preferenceGroupKey = (region: string, choice: SchoolItem) => {
  if (region === 'taipei' || region === 'central' || region === 'kaohsiung') return choice.code;

  const vocationalGroup = choice.groupCode?.trim() || choice.groupName?.trim();
  if (!isVocationalProgram(choice)) return choice.id;

  if (region === 'taoyuan') return vocationalGroup ? `group-${vocationalGroup}` : choice.id;
  if (region === 'hsinchu' || region === 'changhua') return vocationalGroup ? `${choice.code}-${vocationalGroup}` : choice.id;

  return choice.id;
};

const preferenceMergeReason = (region: string) => {
  if (region === 'taipei' || region === 'central') return '同校類科連續選填';
  if (region === 'taoyuan') return '同職群連續選填';
  if (region === 'hsinchu' || region === 'changhua') return '同校同職群連續選填';
  if (region === 'kaohsiung') return '同校不同科連續選填';
  return '依區域規則合併';
};

const normalizeCounty = (county = '') => county.trim().replace(/台/g, '臺');

const getRegionCountyText = (regionId: string) => (REGION_COUNTIES[regionId] || []).join('、');

export default function MockVolunteerPage() {
  const [region, setRegion] = useState(MOCK_VOLUNTEER_REGIONS[0].id);
  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [selectedChoices, setSelectedChoices] = useState<SchoolItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCounty, setFilterCounty] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterGroup, setFilterGroup] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [notice, setNotice] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [choicePendingRemoval, setChoicePendingRemoval] = useState<SchoolItem | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [crossRegionChoice, setCrossRegionChoice] = useState<SchoolItem | null>(null);
  const allowPageExitRef = useRef(false);

  useEffect(() => {
    let ignore = false;

    const fetchSchools = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await callBackend<{ schools: SchoolItem[] } | SchoolItem[]>({
          action: 'getVolunteerSchools',
          region,
        });
        const nextSchools = Array.isArray(data) ? data : data?.schools;
        if (!ignore) {
          setSchools(Array.isArray(nextSchools) ? nextSchools : []);
        }
      } catch (err) {
        console.error('Volunteer school fetch failed:', err);
        if (!ignore) {
          setError('志願資料載入失敗，請稍後再試。');
          setSchools([]);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchSchools();

    return () => {
      ignore = true;
    };
  }, [region]);

  useEffect(() => {
    setFilterCounty('region');
    setFilterType('all');
    setFilterGroup('all');
    setFilterDepartment('all');
    setSearchQuery('');
  }, [region]);

  useEffect(() => {
    const confirmBeforeUnload = (event: BeforeUnloadEvent) => {
      if (selectedChoices.length === 0 || allowPageExitRef.current) return;
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', confirmBeforeUnload);
    return () => window.removeEventListener('beforeunload', confirmBeforeUnload);
  }, [selectedChoices.length]);

  const activeRegionName = MOCK_VOLUNTEER_REGIONS.find((item) => item.id === region)?.name || '目前就學區';
  const activeRegionCountyText = getRegionCountyText(region);
  const activeRegionCounties = useMemo(() => (REGION_COUNTIES[region] || []).map(normalizeCounty), [region]);
  const preferenceRule = PREFERENCE_RULES[region];
  const choicePreferenceScores = useMemo(() => {
    let previousKey = '';
    let rank = 0;
    return selectedChoices.map((choice) => {
      const key = preferenceGroupKey(region, choice);
      const samePreference = key === previousKey;
      if (!samePreference) rank += 1;
      previousKey = key;
      return { rank, score: getPreferenceScore(region, rank), samePreference };
    });
  }, [region, selectedChoices]);

  const uniqueCounties = useMemo(
    () => Array.from(new Set([...REGION_COUNTIES[region], ...schools.map((school) => school.county).filter(Boolean)])).sort(),
    [region, schools],
  );

  const uniqueTypes = useMemo(
    () => Array.from(new Set(schools.map((school) => school.levelInfo).filter(Boolean))).sort(),
    [schools],
  );

  const uniqueGroups = useMemo(
    () => Array.from(new Set(schools.map((school) => school.groupName).filter(Boolean))).sort(),
    [schools],
  );

  const uniqueDepartments = useMemo(
    () => Array.from(new Set(schools.map((school) => school.deptName).filter(Boolean))).sort(),
    [schools],
  );

  const filteredSchools = useMemo(() => {
    const keyword = searchQuery.trim();
    return schools.filter((school) => {
      const normalizedCounty = normalizeCounty(school.county);
      if (filterCounty === 'region' && activeRegionCounties.length > 0 && !activeRegionCounties.includes(normalizedCounty)) {
        return false;
      }
      if (filterCounty !== 'all' && filterCounty !== 'region' && school.county !== filterCounty) return false;
      if (filterType !== 'all' && school.levelInfo !== filterType) return false;
      if (filterGroup !== 'all' && school.groupName !== filterGroup) return false;
      if (filterDepartment !== 'all' && school.deptName !== filterDepartment) return false;
      if (!keyword) return true;

      return [school.name, school.deptName, school.county, school.groupName, school.levelInfo, school.code]
        .filter(Boolean)
        .some((value) => value.includes(keyword));
    });
  }, [schools, filterCounty, activeRegionCounties, filterType, filterGroup, filterDepartment, searchQuery]);

  const addChoice = (school: SchoolItem) => {
    if (selectedChoices.length >= 30) {
      setNotice('最多可加入 30 個志願。');
      return;
    }

    const exists = selectedChoices.some((choice) => choice.code === school.code && choice.deptCode === school.deptCode);
    if (exists) {
      setNotice('這個校科已經在志願清單中。');
      return;
    }

    const selectedRegionCounties = REGION_COUNTIES[region] || [];
    const schoolCounty = normalizeCounty(school.county);
    const isCrossRegion =
      selectedRegionCounties.length > 0 &&
      Boolean(schoolCounty) &&
      !selectedRegionCounties.map(normalizeCounty).includes(schoolCounty);

    if (isCrossRegion) {
      setCrossRegionChoice(school);
      return;
    }

    setSelectedChoices((choices) => [...choices, { ...school, id: createChoiceId(school) }]);
  };

  const confirmAddCrossRegionChoice = () => {
    if (!crossRegionChoice) return;
    setSelectedChoices((choices) => [...choices, { ...crossRegionChoice, id: createChoiceId(crossRegionChoice) }]);
    setCrossRegionChoice(null);
  };

  const confirmRemoveChoice = () => {
    if (!choicePendingRemoval) return;
    setSelectedChoices((choices) => choices.filter((choice) => choice.id !== choicePendingRemoval.id));
    setChoicePendingRemoval(null);
  };

  const requestLeavePage = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (selectedChoices.length === 0) return;
    event.preventDefault();
    setShowLeaveConfirm(true);
  };

  const confirmLeavePage = () => {
    allowPageExitRef.current = true;
    window.location.assign(withBasePath('/'));
  };

  const moveChoice = (from: number, to: number) => {
    if (to < 0 || to >= selectedChoices.length || from === to) return;
    setSelectedChoices((choices) => {
      const next = [...choices];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const handlePrint = () => {
    if (selectedChoices.length === 0) {
      setNotice('請先加入志願後再列印。');
      return;
    }

    const printWindow = window.open('', '', 'width=900,height=700');
    if (!printWindow) {
      setNotice('無法開啟列印視窗，請確認瀏覽器沒有封鎖彈出視窗。');
      return;
    }

    const rows = selectedChoices
      .map(
        (choice, index) => `
          <tr>
            <td class="seq">${index + 1}</td>
            <td><strong>${choice.name}</strong></td>
            <td>${choice.deptName || ''}${choice.shift ? ` <span>(${choice.shift})</span>` : ''}</td>
            <td>${choice.groupName || choice.levelInfo || ''}</td>
            <td>${choice.county || ''}</td>
            <td class="score">${choicePreferenceScores[index] ? `第${choicePreferenceScores[index].rank}志願序・${choicePreferenceScores[index].score === null ? '不計分' : `${choicePreferenceScores[index].score} 分`}` : '—'}</td>
          </tr>
        `,
      )
      .join('');

    printWindow.document.write(`
      <!doctype html>
      <html lang="zh-Hant">
        <head>
          <title>${activeRegionName} 模擬志願選填表</title>
          <style>
            body { font-family: "Microsoft JhengHei", sans-serif; color: #0f172a; margin: 24px; }
            h1 { margin: 0 0 8px; font-size: 24px; }
            p { margin: 0 0 16px; color: #475569; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; table-layout: auto; }
            th, td { border: 1px solid #94a3b8; padding: 8px; text-align: left; font-size: 12px; vertical-align: top; }
            th { background: #e0f2fe; color: #0f172a; }
            .seq { width: 48px; text-align: center; font-weight: 800; }
            .score { width: 108px; font-weight: 800; color: #3730a3; }
          </style>
        </head>
        <body>
          <h1>${activeRegionName} 模擬志願選填表</h1>
          <p>列印日期：${new Date().toLocaleDateString('zh-TW')}，共 ${selectedChoices.length} 個志願。正式選填仍應以招生簡章與官方公告為準。</p>
          <table>
            <thead>
              <tr>
                <th class="seq">序</th>
                <th>學校</th>
                <th>科別</th>
                <th>類群</th>
                <th>縣市</th>
                <th class="score">志願序積分</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="border-b-4 border-slate-900 bg-gradient-to-br from-sky-100 via-white to-indigo-100">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <a
            href={withBasePath('/')}
            onClick={requestLeavePage}
            className="mb-5 inline-flex items-center gap-2 rounded-lg border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black text-slate-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            <ArrowLeft className="h-4 w-4" />
            回到落點分析
          </a>

          <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-xs font-black text-sky-700">
                <Target className="h-4 w-4" />
                獨立頁面工具
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-5xl">模擬志願選填</h1>
              <p className="mt-3 max-w-3xl text-sm font-bold leading-7 text-slate-600 sm:text-base">
                先選就學區，再搜尋校科並加入右側清單。這裡適合用來反覆調整排序、比較科別與列印草稿，不會影響正式志願資料。
              </p>
            </div>

            <div className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
              <label className="mb-2 block text-xs font-black text-slate-500">就學區</label>
              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="w-full rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-3 text-sm font-black outline-none transition focus:bg-white focus:ring-4 focus:ring-sky-300/40"
              >
                {MOCK_VOLUNTEER_REGIONS.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <div className="text-xs font-black text-slate-500">目前區域</div>
            <div className="mt-1 text-2xl font-black text-slate-900">{activeRegionName}</div>
          </div>
          <div className="rounded-2xl border-2 border-slate-900 bg-sky-50 p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <div className="text-xs font-black text-slate-500">搜尋結果</div>
            <div className="mt-1 text-2xl font-black text-slate-900">{filteredSchools.length}</div>
          </div>
          <div className="rounded-2xl border-2 border-slate-900 bg-amber-50 p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <div className="text-xs font-black text-slate-500">已選志願</div>
            <div className="mt-1 text-2xl font-black text-slate-900">{selectedChoices.length} / 30</div>
          </div>
        </div>

        <section className={`mb-6 rounded-2xl border-2 p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] ${preferenceRule ? 'border-indigo-200 bg-indigo-50' : 'border-amber-300 bg-amber-50'}`}>
          <div className="flex items-center gap-2 text-sm font-black text-slate-900">
            <Target className={`h-5 w-5 ${preferenceRule ? 'text-indigo-700' : 'text-amber-700'}`} />
            {activeRegionName}志願序規則
          </div>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-700">{preferenceRule || '此區志願序規則尚未完成 115 學年度官方簡章核對，暫不提供積分試算。'}</p>
          <p className="mt-2 text-xs font-bold leading-5 text-slate-500">此為志願序項目說明；資格、會考、多元表現與其他超額比序項目，請以當年度官方系統與簡章為準。</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          <section className="min-h-[620px] overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
            <div className="border-b-4 border-slate-900 bg-sky-50/70 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-lg font-black">
                <Search className="h-5 w-5 text-sky-600" />
                搜尋校科
              </div>
              <div className="mt-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="輸入學校、科別、群科或代碼"
                    className="w-full rounded-xl border-2 border-slate-900 bg-white py-3 pl-9 pr-3 text-sm font-bold outline-none transition focus:ring-4 focus:ring-sky-300/40"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                <select value={filterCounty} onChange={(event) => setFilterCounty(event.target.value)} className="rounded-xl border-2 border-slate-900 bg-white px-3 py-3 text-sm font-bold outline-none transition focus:ring-4 focus:ring-sky-300/40">
                  <option value="region">本區全部縣市{activeRegionCountyText ? `（${activeRegionCountyText}）` : ''}</option>
                  <option value="all">全部縣市</option>
                  {uniqueCounties.map((county) => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
                <select value={filterType} onChange={(event) => setFilterType(event.target.value)} className="rounded-xl border-2 border-slate-900 bg-white px-3 py-3 text-sm font-bold outline-none transition focus:ring-4 focus:ring-sky-300/40">
                  <option value="all">全部類型</option>
                  {uniqueTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select value={filterGroup} onChange={(event) => setFilterGroup(event.target.value)} className="rounded-xl border-2 border-slate-900 bg-white px-3 py-3 text-sm font-bold outline-none transition focus:ring-4 focus:ring-sky-300/40">
                  <option value="all">全部群科</option>
                  {uniqueGroups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                <select value={filterDepartment} onChange={(event) => setFilterDepartment(event.target.value)} className="rounded-xl border-2 border-slate-900 bg-white px-3 py-3 text-sm font-bold outline-none transition focus:ring-4 focus:ring-sky-300/40">
                  <option value="all">全部科系</option>
                  {uniqueDepartments.map((department) => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
                </div>
              </div>
            </div>

            <div className="max-h-[720px] overflow-y-auto p-4 custom-scrollbar">
              {isLoading ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 className="h-9 w-9 animate-spin text-sky-500" />
                  <div className="font-black">正在載入志願資料...</div>
                </div>
              ) : error ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 px-6 text-center text-rose-600">
                  <AlertCircle className="h-10 w-10" />
                  <div className="font-black">{error}</div>
                </div>
              ) : filteredSchools.length === 0 ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 text-slate-400">
                  <Filter className="h-10 w-10" />
                  <div className="font-black">沒有符合條件的校科</div>
                </div>
              ) : (
                <div className="grid gap-3 xl:grid-cols-2">
                  {filteredSchools.map((school, index) => {
                    const isSelected = selectedChoices.some((choice) => choice.code === school.code && choice.deptCode === school.deptCode);
                    return (
                      <article key={`${school.code}-${school.deptCode}-${index}`} className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap gap-1.5">
                              {school.county && <span className="rounded-md border border-slate-300 bg-white px-2 py-0.5 text-[11px] font-black text-slate-600">{school.county}</span>}
                              {(school.groupName || school.levelInfo) && <span className="rounded-md border border-sky-200 bg-sky-100 px-2 py-0.5 text-[11px] font-black text-sky-800">{school.groupName || school.levelInfo}</span>}
                            </div>
                            <h2 className="line-clamp-2 text-base font-black leading-snug text-slate-950">{school.name}</h2>
                            <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-600">
                              <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                              <span className="line-clamp-1">{school.deptName}{school.shift ? ` (${school.shift})` : ''}</span>
                            </p>
                          </div>
                          <button
                            onClick={() => addChoice(school)}
                            disabled={isSelected}
                            className={`flex h-10 shrink-0 items-center justify-center gap-1 rounded-xl border-2 border-slate-900 px-2 text-xs font-black transition-all ${
                              isSelected
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-white text-slate-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 hover:bg-sky-300 active:translate-y-0 active:shadow-none'
                            }`}
                            aria-label={isSelected ? '已加入' : '加入志願'}
                          >
                            {isSelected ? <><CheckCircle2 className="h-4 w-4" />已加入</> : <><Plus className="h-4 w-4" />加入</>}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <aside className={`${pageNavigationAsideClassName} overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]`}>
            <div className="border-b-4 border-slate-900 bg-amber-50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-lg font-black">
                    <Target className="h-5 w-5 text-amber-700" />
                    我的志願順序
                  </div>
                  <p className="mt-1 text-xs font-bold text-slate-500">用上下鍵調整排序，第一志願放最上面。</p>
                </div>
                <div className="rounded-lg border-2 border-slate-900 bg-white px-3 py-1 text-sm font-black">
                  {selectedChoices.length}/30
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={handlePrint}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-slate-900 bg-sky-300 px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                >
                  <Printer className="h-4 w-4" />
                  列印
                </button>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={selectedChoices.length === 0}
                  className="rounded-lg border-2 border-slate-900 bg-white px-3 py-2 text-sm font-black text-rose-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  清空
                </button>
              </div>
            </div>

            <div className="max-h-[720px] overflow-y-auto p-4 custom-scrollbar">
              {selectedChoices.length === 0 ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-400">
                  <Target className="mb-3 h-12 w-12 stroke-1" />
                  <div className="font-black">尚未加入志願</div>
                  <p className="mt-1 text-sm font-bold">從左側搜尋結果加入校科後，這裡會顯示你的排序清單。</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedChoices.map((choice, index) => (
                    <article key={choice.id} className="rounded-xl border-2 border-slate-900 bg-white p-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                      <div className="flex gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-2 border-slate-900 bg-amber-300 text-lg font-black">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="line-clamp-2 text-sm font-black leading-snug text-slate-950">{choice.name}</h3>
                          <p className="mt-1 line-clamp-2 text-xs font-bold text-sky-700">{choice.deptName}</p>
                          <p className="mt-1 text-[11px] font-bold text-slate-500">{choice.county} · {choice.groupName || choice.levelInfo}</p>
                          {preferenceRule && choicePreferenceScores[index] && (
                            <span className="mt-2 inline-flex items-center rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-[11px] font-black text-indigo-800">
                              志願序 {choicePreferenceScores[index].rank}・{choicePreferenceScores[index].score === null ? '不計分' : `${choicePreferenceScores[index].score} 分`}{choicePreferenceScores[index].samePreference ? `・同序：${preferenceMergeReason(region)}` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-end gap-2 border-t-2 border-slate-100 pt-3">
                        <button onClick={() => moveChoice(index, index - 1)} disabled={index === 0} className="rounded-lg border-2 border-slate-900 bg-slate-50 p-1.5 text-slate-700 disabled:border-slate-200 disabled:text-slate-300">
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button onClick={() => moveChoice(index, index + 1)} disabled={index === selectedChoices.length - 1} className="rounded-lg border-2 border-slate-900 bg-slate-50 p-1.5 text-slate-700 disabled:border-slate-200 disabled:text-slate-300">
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button onClick={() => setChoicePendingRemoval(choice)} className="rounded-lg border-2 border-slate-900 bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-500 hover:text-white" aria-label="刪除志願">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {showClearConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="clear-volunteer-title" className="w-full max-w-md overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <div className="border-b-4 border-slate-900 bg-rose-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <AlertTriangle className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h2 id="clear-volunteer-title" className="text-xl font-black text-slate-900">清空志願清單？</h2>
                  <p className="mt-1 text-sm font-bold text-rose-900">將移除目前全部 {selectedChoices.length} 個志願。</p>
                </div>
              </div>
            </div>
            <div className="p-5 text-sm font-bold leading-7 text-slate-600">此動作無法復原，建議先列印或確認不再需要這份排序。</div>
            <div className="flex gap-3 border-t-2 border-slate-200 bg-slate-50 p-5">
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:bg-slate-100 active:translate-y-0.5 active:shadow-none">保留清單</button>
              <button onClick={() => { setSelectedChoices([]); setShowClearConfirm(false); }} className="flex-1 rounded-xl border-2 border-slate-900 bg-rose-500 px-4 py-2.5 text-sm font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:bg-rose-600 active:translate-y-0.5 active:shadow-none">確認清空</button>
            </div>
          </section>
        </div>
      )}

      {choicePendingRemoval && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="remove-volunteer-title" className="w-full max-w-md overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <div className="border-b-4 border-slate-900 bg-rose-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <AlertTriangle className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <h2 id="remove-volunteer-title" className="text-xl font-black text-slate-900">刪除這個志願？</h2>
                  <p className="mt-1 text-sm font-bold text-rose-900">刪除後無法復原。</p>
                </div>
              </div>
            </div>
            <div className="p-5 text-sm font-bold leading-7 text-slate-600">
              <p className="font-black text-slate-900">{choicePendingRemoval.name}</p>
              <p>{choicePendingRemoval.deptName}</p>
            </div>
            <div className="flex gap-3 border-t-2 border-slate-200 bg-slate-50 p-5">
              <button onClick={() => setChoicePendingRemoval(null)} className="flex-1 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:bg-slate-100 active:translate-y-0.5 active:shadow-none">取消</button>
              <button onClick={confirmRemoveChoice} className="flex-1 rounded-xl border-2 border-slate-900 bg-rose-500 px-4 py-2.5 text-sm font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:bg-rose-600 active:translate-y-0.5 active:shadow-none">確認刪除</button>
            </div>
          </section>
        </div>
      )}

      {showLeaveConfirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="leave-volunteer-title" className="w-full max-w-md overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <div className="border-b-4 border-slate-900 bg-amber-300 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <AlertTriangle className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <h2 id="leave-volunteer-title" className="text-xl font-black text-slate-900">要離開模擬志願選填嗎？</h2>
                  <p className="mt-1 text-sm font-bold text-amber-900">目前清單有 {selectedChoices.length} 個志願。</p>
                </div>
              </div>
            </div>
            <div className="p-5 text-sm font-bold leading-7 text-slate-600">離開後，本次模擬志願清單將不會保留。</div>
            <div className="flex gap-3 border-t-2 border-slate-200 bg-slate-50 p-5">
              <button onClick={() => setShowLeaveConfirm(false)} className="flex-1 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:bg-slate-100 active:translate-y-0.5 active:shadow-none">留在頁面</button>
              <button onClick={confirmLeavePage} className="flex-1 rounded-xl border-2 border-slate-900 bg-rose-500 px-4 py-2.5 text-sm font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:bg-rose-600 active:translate-y-0.5 active:shadow-none">確認離開</button>
            </div>
          </section>
        </div>
      )}

      {crossRegionChoice && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <div className="border-b-4 border-slate-900 bg-amber-300 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <AlertTriangle className="h-6 w-6 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">跨區選填提醒</h2>
                  <p className="text-sm font-bold text-amber-900">請先確認招生簡章與跨區資格。</p>
                </div>
              </div>
            </div>
            <div className="space-y-4 p-5 text-sm font-bold leading-7 text-slate-700">
              <p>
                「{crossRegionChoice.name}」位於
                <span className="font-black text-rose-700"> {crossRegionChoice.county}</span>，
                不在目前就學區可選縣市內。
              </p>
              <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-black text-slate-500">目前就學區包含</div>
                <div className="mt-1 font-black text-slate-900">{getRegionCountyText(region) || '未設定縣市範圍'}</div>
              </div>
              <p className="text-xs leading-6 text-slate-500">
                跨區選填可能有名額、資格或作業規定限制；此清單僅供模擬排序參考。
              </p>
            </div>
            <div className="flex gap-3 border-t-2 border-slate-200 bg-slate-50 p-5">
              <button
                onClick={() => setCrossRegionChoice(null)}
                className="flex-1 rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:bg-slate-100 active:translate-y-0.5 active:shadow-none"
              >
                取消
              </button>
              <button
                onClick={confirmAddCrossRegionChoice}
                className="flex-1 rounded-xl border-2 border-slate-900 bg-amber-400 px-4 py-2.5 text-sm font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all hover:bg-amber-300 active:translate-y-0.5 active:shadow-none"
              >
                仍要加入
              </button>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-md items-center justify-between gap-3 rounded-xl border-4 border-slate-900 bg-white p-4 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
          <div className="text-sm font-black text-slate-800">{notice}</div>
          <button onClick={() => setNotice('')} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-black text-white">
            知道了
          </button>
        </div>
      )}
    </main>
  );
}
