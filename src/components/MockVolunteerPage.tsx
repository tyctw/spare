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
  Share2,
  Target,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { withBasePath } from '../lib/routes';
import ShareReportDialog from './ShareReportDialog';

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

const SHARED_COPY_STORAGE_KEY = 'mock-volunteer-import';

// The shared-report endpoint is intentionally public. Never interpolate data
// originating from it into the print document without HTML encoding.
const escapeHtml = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const sanitizeSharedChoice = (value: unknown): SchoolItem | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const record = value as Record<string, unknown>;
  const text = (key: string, maxLength = 160) =>
    typeof record[key] === 'string'
      ? record[key].replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maxLength)
      : '';

  const choice = {
    id: '',
    county: text('county'),
    code: text('code', 40),
    name: text('name'),
    levelInfo: text('levelInfo'),
    shift: text('shift', 80),
    groupCode: text('groupCode', 40),
    groupName: text('groupName'),
    deptCode: text('deptCode', 40),
    deptName: text('deptName'),
  };

  return choice.name && choice.code && choice.deptCode ? choice : null;
};

const isSameVolunteerOption = (first: SchoolItem, second: SchoolItem) =>
  first.code === second.code
  && first.deptCode === second.deptCode
  && first.shift?.trim() === second.shift?.trim();

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
  chiayi: '第 1–6 志願 10 分、第 7–12 志願 9 分、第 13–18 志願 8 分、第 19–24 志願 7 分、第 25–30 志願 6 分；最多可填 30 個志願。',
  tainan: '第 1–3 志願 10 分，之後每 3 個志願遞減 1 分；第 16–30 志願為 5 分。',
  kaohsiung: '每 10 所學校為一個志願學校群：第 1 群 30 分、第 2 群 29 分、第 3 群 28 分；同校不同科連續選填以同一所學校計算。',
};

const getPreferenceScore = (region: string, rank: number): number | null => {
  if (region === 'taipei') return rank <= 5 ? 36 : rank <= 10 ? 35 : rank <= 15 ? 34 : rank <= 20 ? 33 : rank <= 30 ? 32 : null;
  if (region === 'taoyuan') return rank <= 3 ? 15 : rank <= 6 ? 12 : rank <= 9 ? 9 : rank <= 12 ? 6 : rank <= 15 ? 3 : rank <= 30 ? 1 : null;
  if (region === 'hsinchu') return rank <= 5 ? 10 : rank <= 10 ? 9 : rank <= 15 ? 8 : rank <= 20 ? 7 : rank <= 25 ? 6 : null;
  if (region === 'central') return rank <= 10 ? 30 : rank <= 20 ? 29 : rank <= 30 ? 28 : null;
  if (region === 'changhua') return rank <= 20 ? 45 : rank <= 30 ? 44 : null;
  if (region === 'chiayi') return rank <= 6 ? 10 : rank <= 12 ? 9 : rank <= 18 ? 8 : rank <= 24 ? 7 : rank <= 30 ? 6 : null;
  if (region === 'tainan') return rank <= 3 ? 10 : rank <= 6 ? 9 : rank <= 9 ? 8 : rank <= 12 ? 7 : rank <= 15 ? 6 : rank <= 30 ? 5 : null;
  if (region === 'kaohsiung') return rank <= 10 ? 30 : rank <= 20 ? 29 : rank <= 30 ? 28 : null;
  return null;
};

const VOCATIONAL_GROUP_DEPARTMENTS: Record<string, string[]> = {
  '機械群': ['機械科', '鑄造科', '板金科', '機械木模科', '配管科', '模具科', '機電科', '製圖科', '生物產業機電科', '電腦機械製圖科'],
  '動力機械群': ['汽車科', '重機科', '飛機修護科', '動力機械科', '農業機械科', '軌道車輛科'],
  '電機與電子群': ['資訊科', '電子科', '控制科', '電機科', '冷凍空調科', '航空電子科', '電機空調科'],
  '化工群': ['化工科', '紡織科', '染整科'],
  '土木與建築群': ['建築科', '土木科', '消防工程科', '空間測繪科'],
  '商業與管理群': ['商業經營科', '國際貿易科', '會計事務科', '資料處理科', '不動產事務科', '電子商務科', '流通管理科', '農產行銷科', '航運管理科'],
  '外語群': ['應用外語科（英文組）', '應用外語科（日文組）'],
  '設計群': ['家具木工科', '美工科', '陶瓷工程科', '室內空間設計科', '圖文傳播科', '金屬工藝科', '家具設計科', '廣告設計科', '多媒體設計科', '多媒體應用科', '室內設計科'],
  '農業群': ['農場經營科', '園藝科', '森林科', '野生動物保育科', '造園科', '畜產保健科'],
  '食品群': ['食品加工科', '食品科', '水產食品科', '烘焙科'],
  '家政群': ['家政科', '服裝科', '幼兒保育科', '美容科', '時尚模特兒科', '流行服飾科', '時尚造型科', '照顧服務科'],
  '餐旅群': ['觀光事業科', '餐飲管理科'],
  '水產群': ['漁業科', '水產養殖科'],
  '海事群': ['輪機科', '航海科'],
  '藝術群': ['戲劇科', '音樂科', '舞蹈科', '美術科', '影劇科', '西樂科', '國樂科', '電影電視科', '表演藝術科', '多媒體動畫科', '時尚工藝科'],
};

const normalizeDepartmentName = (name = '') => name.trim().replace(/\s+/g, '').replace(/[（]/g, '(').replace(/[）]/g, ')');
const VOCATIONAL_GROUP_BY_DEPARTMENT = new Map(
  Object.entries(VOCATIONAL_GROUP_DEPARTMENTS).flatMap(([group, departments]) =>
    departments.map((department) => [normalizeDepartmentName(department), group] as const),
  ),
);

// Source records use different level labels for daytime, evening and practical
// skills programs. Use the department-to-group mapping as the primary signal,
// while excluding academic and comprehensive high-school programs.
const isVocationalProgram = (choice: SchoolItem) => {
  const levelInfo = choice.levelInfo?.trim();
  const groupName = choice.groupName?.trim();
  if (levelInfo === '普通科' || levelInfo === '綜合高中' || groupName === '學術群' || groupName === '綜合群') return false;

  return VOCATIONAL_GROUP_BY_DEPARTMENT.has(normalizeDepartmentName(choice.deptName)) || levelInfo === '專業群科';
};

const getVocationalGroup = (choice: SchoolItem) =>
  VOCATIONAL_GROUP_BY_DEPARTMENT.get(normalizeDepartmentName(choice.deptName)) || choice.groupName?.trim();

const preferenceGroupKey = (region: string, choice: SchoolItem) => {
  if (region === 'taipei' || region === 'central' || region === 'kaohsiung') return choice.code;

  if (!isVocationalProgram(choice)) return choice.id;
  const vocationalGroup = getVocationalGroup(choice);

  if (region === 'taoyuan') return vocationalGroup ? `group-${vocationalGroup}` : choice.id;
  if (region === 'hsinchu' || region === 'changhua') return vocationalGroup ? `${choice.code}-${vocationalGroup}` : choice.id;

  return choice.id;
};

const canSharePreferenceRank = (region: string, previousChoice: SchoolItem | null, choice: SchoolItem) => {
  if (!previousChoice) return false;
  if (region === 'taipei' || region === 'central' || region === 'kaohsiung') return previousChoice.code === choice.code;

  if (region === 'taoyuan' || region === 'hsinchu' || region === 'changhua') {
    return isVocationalProgram(previousChoice)
      && isVocationalProgram(choice)
      && preferenceGroupKey(region, previousChoice) === preferenceGroupKey(region, choice);
  }

  return false;
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
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [choicePendingRemoval, setChoicePendingRemoval] = useState<SchoolItem | null>(null);
  const [rankPickerChoiceId, setRankPickerChoiceId] = useState<string | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [leaveDestination, setLeaveDestination] = useState(withBasePath('/'));
  const [crossRegionChoice, setCrossRegionChoice] = useState<SchoolItem | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const allowPageExitRef = useRef(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('import') !== 'shared') return;
    const raw = window.localStorage.getItem(SHARED_COPY_STORAGE_KEY);
    if (!raw) return;
    try {
      const imported = JSON.parse(raw);
      if (Array.isArray(imported.choices)) {
        const choices = imported.choices
          .slice(0, 30)
          .map(sanitizeSharedChoice)
          .filter((choice): choice is SchoolItem => choice !== null)
          .map((choice) => ({ ...choice, id: createChoiceId(choice) }));
        setSelectedChoices(choices);
        if (typeof imported.region === 'string' && MOCK_VOLUNTEER_REGIONS.some((item) => item.id === imported.region)) setRegion(imported.region);
        setNotice('已建立個人副本：可在此自由調整，原分享清單不會被修改。');
      }
    } catch { setNotice('副本資料無法讀取，請回到分享頁再試一次。'); }
    window.localStorage.removeItem(SHARED_COPY_STORAGE_KEY);
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchSchools = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(withBasePath('/data/volunteer_schools.json'));
        if (!response.ok) throw new Error(`Unable to load volunteer schools (${response.status})`);
        const nextSchools: unknown = await response.json();
        if (!ignore) {
          setSchools(Array.isArray(nextSchools) ? nextSchools : []);
        }
      } catch (err) {
        console.error('Volunteer school JSON load failed:', err);
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
  }, []);

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
  const shareSnapshotKey = useMemo(
    () => JSON.stringify({ version: 2, region, choices: selectedChoices.map(({ id, ...choice }) => choice) }),
    [region, selectedChoices],
  );
  const activeRegionCounties = useMemo(() => (REGION_COUNTIES[region] || []).map(normalizeCounty), [region]);
  const preferenceRule = PREFERENCE_RULES[region];
  const choicePreferenceScores = useMemo(() => {
    let previousChoice: SchoolItem | null = null;
    let rank = 0;
    return selectedChoices.map((choice) => {
      const samePreference = canSharePreferenceRank(region, previousChoice, choice);
      if (!samePreference) rank += 1;
      previousChoice = choice;
      return { rank, score: getPreferenceScore(region, rank), samePreference };
    });
  }, [region, selectedChoices]);

  const filterOptions = useMemo(() => {
    type FilterName = 'county' | 'type' | 'group' | 'department';
    const matchesOtherFilters = (school: SchoolItem, omit: FilterName) => {
      const normalizedCounty = normalizeCounty(school.county);
      if (omit !== 'county') {
        if (filterCounty === 'region' && activeRegionCounties.length > 0 && !activeRegionCounties.includes(normalizedCounty)) return false;
        if (filterCounty !== 'all' && filterCounty !== 'region' && school.county !== filterCounty) return false;
      }
      if (omit !== 'type' && filterType !== 'all' && school.levelInfo !== filterType) return false;
      if (omit !== 'group' && filterGroup !== 'all' && school.groupName !== filterGroup) return false;
      if (omit !== 'department' && filterDepartment !== 'all' && school.deptName !== filterDepartment) return false;
      return true;
    };
    const getValues = (omit: FilterName, value: (school: SchoolItem) => string) =>
      Array.from(new Set(schools.filter((school) => matchesOtherFilters(school, omit)).map(value).filter(Boolean))).sort();

    return {
      counties: getValues('county', (school) => school.county),
      types: getValues('type', (school) => school.levelInfo),
      groups: getValues('group', (school) => school.groupName),
      departments: getValues('department', (school) => school.deptName),
    };
  }, [schools, activeRegionCounties, filterCounty, filterType, filterGroup, filterDepartment]);

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

    const exists = selectedChoices.some((choice) => isSameVolunteerOption(choice, school));
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
    setLeaveDestination(event.currentTarget.href);
    setShowLeaveConfirm(true);
  };

  const confirmLeavePage = () => {
    allowPageExitRef.current = true;
    window.location.assign(leaveDestination);
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

  const handlePrint = (isBlankForm = false) => {
    if (!isBlankForm && selectedChoices.length === 0) {
      setNotice('請先加入志願後再列印。');
      return;
    }

    const printWindow = window.open('', '', 'width=900,height=700');
    if (!printWindow) {
      setNotice('無法開啟列印視窗，請確認瀏覽器沒有封鎖彈出視窗。');
      return;
    }

    const printedChoiceCount = isBlankForm ? 30 : selectedChoices.length;
    const printLayout = printedChoiceCount >= 25
      ? { bodyFont: '9px', headerFont: '8.5px', cellPadding: '3px 4px', titleFont: '18px', noteFont: '9px' }
      : selectedChoices.length >= 16
        ? { bodyFont: '9.5px', headerFont: '9px', cellPadding: '3.5px 4px', titleFont: '19px', noteFont: '9.5px' }
        : { bodyFont: '10.5px', headerFont: '10px', cellPadding: '4.5px 5px', titleFont: '20px', noteFont: '10px' };
    const printRowHeight = `${Math.min(120, Math.max(31, Math.round(920 / printedChoiceCount)))}px`;

    const rows = isBlankForm
      ? Array.from({ length: 30 }, (_, index) => `
          <tr class="blank-row">
            <td class="seq">${index + 1}</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td class="score"></td>
          </tr>
        `).join('')
      : selectedChoices
        .map(
          (choice, index) => `
          <tr>
            <td class="seq">${index + 1}</td>
            <td><strong>${escapeHtml(choice.name)}</strong></td>
            <td>${escapeHtml(choice.deptName)}${choice.shift ? ` <span>(${escapeHtml(choice.shift)})</span>` : ''}</td>
            <td>${escapeHtml(choice.groupName || choice.levelInfo)}</td>
            <td>${escapeHtml(choice.county)}</td>
            <td class="score">${choicePreferenceScores[index] ? `第${choicePreferenceScores[index].rank}志願序・${choicePreferenceScores[index].score === null ? '不計分' : `${choicePreferenceScores[index].score} 分`}` : '—'}</td>
          </tr>
          `,
        )
        .join('');

    printWindow.document.write(`
      <!doctype html>
      <html lang="zh-Hant">
        <head>
          <title>${escapeHtml(activeRegionName)}${isBlankForm ? ' 討論用空白志願表' : ' 模擬志願選填表'}</title>
          <style>
            @page { size: A4 portrait; margin: 9mm 8mm; }
            * { box-sizing: border-box; }
            body { font-family: "Microsoft JhengHei", sans-serif; color: #0f172a; margin: 0; }
            h1 { margin: 0 0 3px; font-size: ${printLayout.titleFont}; line-height: 1.3; }
            p { margin: 0 0 8px; color: #475569; font-size: ${printLayout.noteFont}; line-height: 1.4; }
            table { width: 100%; border-collapse: collapse; table-layout: fixed; }
            th, td { border: 0.5px solid #94a3b8; padding: ${printLayout.cellPadding}; text-align: left; font-size: ${printLayout.bodyFont}; line-height: 1.28; vertical-align: middle; word-break: break-word; }
            th { background: #e0f2fe; color: #0f172a; font-size: ${printLayout.headerFont}; }
            tbody td { height: ${printRowHeight}; }
            thead { display: table-header-group; }
            tr { break-inside: avoid; page-break-inside: avoid; }
            .seq { text-align: center; font-weight: 800; }
            .score { font-weight: 800; color: #3730a3; }
            .print-footer { margin-top: 6px; color: #64748b; font-size: ${printLayout.headerFont}; font-weight: 700; }
            .print-warning { color: #9f1239; }
            .print-site { margin-top: 2px; text-align: right; }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(activeRegionName)}${isBlankForm ? ' 討論用空白志願表' : ' 模擬志願選填表'}</h1>
          <p>${isBlankForm ? '供討論與手寫排序使用，共 30 個志願欄位。' : `列印日期：${new Date().toLocaleDateString('zh-TW')}，共 ${selectedChoices.length} 個志願。`}正式選填仍應以招生簡章與官方公告為準。</p>
          <table>
            <colgroup>
              <col style="width: 6%" />
              <col style="width: 25%" />
              <col style="width: 25%" />
              <col style="width: 16%" />
              <col style="width: 10%" />
              <col style="width: 18%" />
            </colgroup>
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
          <div class="print-footer">
            <div class="print-warning">注意：本表僅供模擬／討論使用，非正式志願選填文件；實際選填請以官方系統與招生簡章為準。</div>
            <div class="print-site">網站網址：https://tyctw.github.io/spare/</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    const isMobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    if (!isMobileDevice) {
      printWindow.onafterprint = () => printWindow.close();
    }
    printWindow.focus();
    printWindow.print();
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
                  {filterOptions.counties.map((county) => (
                    <option key={county} value={county}>{county}</option>
                  ))}
                </select>
                <select value={filterType} onChange={(event) => setFilterType(event.target.value)} className="rounded-xl border-2 border-slate-900 bg-white px-3 py-3 text-sm font-bold outline-none transition focus:ring-4 focus:ring-sky-300/40">
                  <option value="all">全部類型</option>
                  {filterOptions.types.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select value={filterGroup} onChange={(event) => setFilterGroup(event.target.value)} className="rounded-xl border-2 border-slate-900 bg-white px-3 py-3 text-sm font-bold outline-none transition focus:ring-4 focus:ring-sky-300/40">
                  <option value="all">全部群科</option>
                  {filterOptions.groups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                <select value={filterDepartment} onChange={(event) => setFilterDepartment(event.target.value)} className="rounded-xl border-2 border-slate-900 bg-white px-3 py-3 text-sm font-bold outline-none transition focus:ring-4 focus:ring-sky-300/40">
                  <option value="all">全部科系</option>
                  {filterOptions.departments.map((department) => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
                </div>
              </div>
            </div>

            <div className="max-h-[720px] overflow-y-auto p-3 custom-scrollbar">
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
                    const isSelected = selectedChoices.some((choice) => isSameVolunteerOption(choice, school));
                    return (
                      <article key={`${school.code}-${school.deptCode}-${index}`} className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 hover:bg-sky-50 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap gap-1.5 text-[11px] font-black">
                              {school.county && <span className="rounded-md border border-slate-300 bg-slate-50 px-2 py-0.5 text-slate-600">{school.county}</span>}
                              {school.levelInfo && <span className="rounded-md border border-amber-200 bg-amber-100 px-2 py-0.5 text-amber-900">類型：{school.levelInfo}</span>}
                            </div>
                            <h2 className="line-clamp-2 text-base font-black leading-snug text-slate-950">{school.name}</h2>
                            <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-600">
                              <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                              <span className="line-clamp-1">{school.deptName}{school.shift ? ` (${school.shift})` : ''}</span>
                            </p>
                            {school.groupName && <div className="mt-1.5"><span className="inline-flex rounded-md border border-sky-200 bg-sky-100 px-2 py-0.5 text-[11px] font-black text-sky-800">群別：{school.groupName}</span></div>}
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

          <aside className="min-w-0 overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain">
            <div className="relative overflow-hidden border-b-4 border-slate-900 bg-gradient-to-br from-amber-200 via-amber-50 to-white p-5">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border-4 border-amber-300/60 bg-amber-100/70" />
              <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xl font-black tracking-tight">
                    <Target className="h-5 w-5 text-amber-700" />
                    我的志願順序
                  </div>
                  <p className="mt-1 text-xs font-bold text-slate-500">用上下鍵調整排序，第一志願放最上面。</p>
                </div>
                <div className="shrink-0 rounded-xl border-2 border-slate-900 bg-slate-900 px-3 py-2 text-center text-sm font-black text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <div className="text-lg leading-none">{selectedChoices.length}</div>
                  <div className="mt-0.5 text-[10px] tracking-wide text-amber-200">/ 30</div>
                </div>
              </div>
              <div className="relative mt-4 rounded-2xl border-2 border-indigo-300 bg-indigo-50 p-4 text-left shadow-[3px_3px_0px_0px_rgba(67,56,202,0.18)]">
                <div className="flex items-center gap-2 text-[11px] font-black tracking-wider text-indigo-700"><Share2 className="h-4 w-4" />一起討論志願</div>
                <div className="mt-1 text-base font-black text-indigo-950">分享志願清單</div>
                <p className="mt-1 text-xs font-bold leading-5 text-slate-600">建立唯讀連結給家長、老師查看；對方可複製到自己的模擬頁修改，原始清單不會變更。</p>
              </div>
              <div className="relative mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsShareOpen(true)}
                  disabled={selectedChoices.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-indigo-600 px-3 py-3 text-sm font-black text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Share2 className="h-4 w-4" />
                  {'\u5206\u4eab'}
                </button>
                <button
                  onClick={() => setShowPrintDialog(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-sky-300 px-3 py-3 text-sm font-black text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all hover:-translate-y-0.5 hover:bg-sky-400 active:translate-y-0 active:shadow-none"
                >
                  <Printer className="h-4 w-4" />
                  列印
                </button>
                <button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={selectedChoices.length === 0}
                  className="col-span-2 inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 text-sm font-black text-rose-700 transition hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" />
                  清空
                </button>
              </div>
              <a href={withBasePath('/strategy')} onClick={requestLeavePage} className="relative mt-4 inline-flex w-full items-center justify-center gap-1.5 text-xs font-black text-slate-600 underline decoration-amber-400 decoration-2 underline-offset-4 transition hover:text-slate-950">
                <Target className="h-3.5 w-3.5 text-amber-700" />需要排序建議？查看志願選填攻略
              </a>
            </div>

            <div className="min-h-[560px] max-h-[840px] overflow-y-auto p-4 custom-scrollbar">
              {selectedChoices.length === 0 ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-400">
                  <Target className="mb-3 h-12 w-12 stroke-1" />
                  <div className="font-black">尚未加入志願</div>
                  <p className="mt-1 text-sm font-bold">從左側搜尋結果加入校科後，這裡會顯示你的排序清單。</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedChoices.map((choice, index) => (
                    <article key={choice.id} className="relative rounded-xl border-2 border-slate-900 bg-white p-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:bg-amber-50">
                      <div className="absolute right-3 top-3 flex items-center gap-1">
                        <div className="flex overflow-hidden rounded-md border border-slate-300 bg-white">
                          <button onClick={() => moveChoice(index, index - 1)} disabled={index === 0} className="border-r border-slate-300 p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300" aria-label="上移志願">
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button onClick={() => moveChoice(index, index + 1)} disabled={index === selectedChoices.length - 1} className="p-1.5 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300" aria-label="下移志願">
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button onClick={() => setChoicePendingRemoval(choice)} className="rounded-md border border-rose-200 bg-rose-50 p-1.5 text-rose-600 transition hover:bg-rose-500 hover:text-white" aria-label="刪除志願">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-start gap-2.5">
                        {rankPickerChoiceId === choice.id ? (
                          <select
                            autoFocus
                            value={index}
                            onChange={(event) => {
                              moveChoice(index, Number(event.target.value));
                              setRankPickerChoiceId(null);
                            }}
                            onBlur={() => setRankPickerChoiceId(null)}
                            className="h-10 w-10 shrink-0 rounded-lg border-2 border-slate-900 bg-amber-300 text-center text-sm font-black outline-none"
                            aria-label="選擇目標志願序"
                          >
                            {selectedChoices.map((_, rankIndex) => <option key={rankIndex} value={rankIndex}>{rankIndex + 1}</option>)}
                          </select>
                        ) : (
                          <button
                            onClick={() => setRankPickerChoiceId(choice.id)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-slate-900 bg-amber-300 text-base font-black transition hover:bg-amber-400"
                            aria-label={`調整第 ${index + 1} 志願`}
                            title="點擊選擇目標志願序"
                          >
                            {index + 1}
                          </button>
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate pr-[78px] text-sm font-black leading-5 text-slate-950">{choice.name}</h3>
                          <p className="truncate text-sm font-bold text-sky-700">{choice.deptName}{choice.shift ? ` (${choice.shift})` : ''}</p>
                          <div className="mt-1.5 space-y-0.5 border-t border-slate-100 pt-1.5 text-[11px] font-black leading-4 text-[#4f76a4]">
                            <div><span className="inline-flex max-w-full rounded-md border border-amber-200 bg-amber-100 px-1.5 py-0.5 text-amber-900"><span className="truncate">類型：{choice.levelInfo || '未提供'}</span></span></div>
                            <div className="flex min-w-0 items-center justify-between gap-2">
                              <span className="inline-flex min-w-0 max-w-[58%] rounded-md border border-sky-200 bg-sky-100 px-1.5 py-0.5 text-sky-800"><span className="truncate">群別：{choice.groupName || '未提供'}</span></span>
                              {preferenceRule && choicePreferenceScores[index] && <span className="shrink-0 rounded-md border border-indigo-200 bg-indigo-50 px-1.5 py-0.5 text-indigo-800">第 {choicePreferenceScores[index].rank} 志願・{choicePreferenceScores[index].score === null ? '不計分' : `${choicePreferenceScores[index].score} 分`}{choicePreferenceScores[index].samePreference ? '・同序' : ''}</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      {showPrintDialog && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <section role="dialog" aria-modal="true" aria-labelledby="print-volunteer-title" className="w-full max-w-md overflow-hidden rounded-2xl border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <div className="border-b-4 border-slate-900 bg-sky-200 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <Printer className="h-6 w-6 text-sky-700" />
                </div>
                <div>
                  <h2 id="print-volunteer-title" className="text-xl font-black text-slate-900">選擇列印表單</h2>
                  <p className="mt-1 text-sm font-bold text-sky-900">可列印目前排序，或準備空白表單討論。</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <button
                onClick={() => { setShowPrintDialog(false); handlePrint(false); }}
                disabled={selectedChoices.length === 0}
                className={`w-full rounded-xl border-2 border-slate-900 p-4 text-left shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition disabled:cursor-not-allowed disabled:opacity-40 ${selectedChoices.length > 0
                  ? 'bg-sky-500 text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] hover:bg-sky-600'
                  : 'bg-white text-slate-900'
                }`}
              >
                <div className="font-black">列印目前志願表</div>
                <div className={`mt-1 text-xs font-bold ${selectedChoices.length > 0 ? 'text-sky-50' : 'text-slate-500'}`}>列出目前的 {selectedChoices.length} 個志願與志願序積分。</div>
              </button>
              <button
                onClick={() => { setShowPrintDialog(false); handlePrint(true); }}
                className="w-full rounded-xl border-2 border-slate-900 bg-amber-50 p-4 text-left shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:bg-amber-100"
              >
                <div className="font-black text-slate-900">列印討論用空白志願表</div>
                <div className="mt-1 text-xs font-bold text-slate-500">提供 30 個空白順位欄，可手寫討論與排序。</div>
              </button>
            </div>
            <div className="border-t-2 border-slate-200 bg-slate-50 p-4">
              <button onClick={() => setShowPrintDialog(false)} className="w-full rounded-xl border-2 border-slate-900 bg-white px-4 py-2.5 text-sm font-black text-slate-800 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:bg-slate-100 active:translate-y-0.5 active:shadow-none">取消</button>
            </div>
          </section>
        </div>
      )}

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
        <div className={`fixed inset-x-0 bottom-4 z-50 mx-auto flex w-[calc(100%-2rem)] max-w-md items-center justify-between gap-3 rounded-xl border-4 p-4 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] ${notice === '最多可加入 30 個志願。' ? 'border-amber-500 bg-amber-50' : 'border-slate-900 bg-white'}`}>
          <div className="text-sm font-black text-slate-800">{notice}</div>
          <button onClick={() => setNotice('')} className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-black text-white">
            知道了
          </button>
        </div>
      )}
      <ShareReportDialog
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        kind="volunteer"
        snapshotKey={shareSnapshotKey}
        payload={{
          region,
          regionName: activeRegionName,
          choices: selectedChoices.map((choice, index) => ({
            ...choice,
            preferenceRank: choicePreferenceScores[index]?.rank ?? null,
            preferenceScore: choicePreferenceScores[index]?.score ?? null,
            sharesPreferenceRank: choicePreferenceScores[index]?.samePreference ?? false,
          })),
          createdAt: new Date().toISOString(),
        }}
      />
    </main>
  );
}
