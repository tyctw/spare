import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, User, BookOpen, Calculator, Award, PenTool,
  Search, Building2, Map, Compass, Anchor, Cpu,
  Mountain, Sparkles, AlertCircle, ChevronRight, ChevronDown,
  Library, ArrowRight, Activity, KeyRound, Info, Shield, History, ChartBar, Download, List, QrCode, Check, Menu, X, Filter, Share2, Mail, Link as LinkIcon,
  Target, Lightbulb, Flame, ShieldCheck, Layers, Brain, Copyright, Database, Instagram, AtSign, Languages
} from 'lucide-react';
import VocationalModal from './components/VocationalModal';
import { InfoModal } from './components/InfoModals';
import DisclaimerModal from './components/DisclaimerModal';
import ComparisonModal from './components/ComparisonModal';
import QRCodeModal from './components/QRCodeModal';
import CyberAuthOverlay from './components/CyberAuthOverlay';
import QuantumLoadingOverlay from './components/QuantumLoadingOverlay';
import { callBackend, isBackendError, normalizeInvitationCode } from './lib/api';
import RegionModal, { ALL_REGIONS } from './components/RegionModal';
import ExportModal from './components/ExportModal';
import AuthFailModal from './components/AuthFailModal';
import RegionScoringModal, { REGION_SCORING_DATA } from './components/RegionScoringModal';
import SharePlatformModal from './components/SharePlatformModal';
import RatingModal from './components/RatingModal';
import ReportErrorModal from './components/ReportErrorModal';
import ScoreInquiryModal from './components/ScoreInquiryModal';
import DataProviderModal from './components/DataProviderModal';
// Layout Components
import AppHeader from './components/layout/AppHeader';
import Footer from './components/layout/Footer';
import HeroBanner from './components/layout/HeroBanner';
import { formatSchoolOwnership, getSchoolOwnershipKey } from './lib/schoolDisplay';
import { withBasePath } from './lib/routes';

const HollandTestModal = React.lazy(() => import('./components/HollandTestModal'));
const MockVolunteerModal = React.lazy(() => import('./components/MockVolunteerModal'));
const HistoricalStatsModal = React.lazy(() => import('./components/HistoricalStatsModal'));
const NavigationDrawer = React.lazy(() => import('./components/layout/NavigationDrawer'));

const DISCLAIMER_SEEN_KEY = 'tw-admission-disclaimer-seen';
const RESULTS_STORAGE_KEY = 'tw-admission-analysis-results';

const normalizeHistoricalScores = (scores: any[] = []) =>
  scores
    .filter((item) => item && item.points !== null && item.points !== undefined)
    .map((item) => ({
      ...item,
      year: String(item.year || '歷年'),
      numericYear: Number.parseInt(String(item.year || '').replace(/\D/g, ''), 10),
      numericPoints: Number(item.points),
    }))
    .sort((a, b) => (Number.isFinite(b.numericYear) ? b.numericYear : 0) - (Number.isFinite(a.numericYear) ? a.numericYear : 0));

const historicalScoresPendingText = '資料建置中';

const formatHistoricalCredits = (credits: any) =>
  credits !== null && credits !== undefined && credits !== '' ? credits : '無';

const formatHistoricalScore = (item: any) => {
  const points = item?.points ?? '--';
  return `積分 ${points} / 積點 ${formatHistoricalCredits(item?.credits)}`;
};

const getHistoricalTrend = (scores: any[]) => {
  const [latest, previous] = scores;
  if (!latest || !previous || !Number.isFinite(latest.numericPoints) || !Number.isFinite(previous.numericPoints)) {
    return { label: '資料建置中', tone: 'text-slate-500 bg-slate-100 border-slate-200' };
  }
  const diff = Math.round((latest.numericPoints - previous.numericPoints) * 10) / 10;
  if (diff > 0) return { label: `較前一年 +${diff}`, tone: 'text-rose-700 bg-rose-50 border-rose-200' };
  if (diff < 0) return { label: `較前一年 ${diff}`, tone: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  return { label: '與前一年持平', tone: 'text-sky-700 bg-sky-50 border-sky-200' };
};

function HistoricalScoresModal({ school, onClose }: { school: any | null; onClose: () => void }) {
  const scores = normalizeHistoricalScores(school?.historicalScores || []).slice(0, 6);
  const latest = scores[0];
  const trend = getHistoricalTrend(scores);
  const maxPoint = Math.max(...scores.map((item: any) => Number(item.points) || 0), 1);

  return (
    <AnimatePresence>
      {school && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 18 }}
            className="relative w-full max-w-xl max-h-[88vh] overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] flex flex-col"
          >
            <div className="bg-amber-300 border-b-4 border-slate-900 p-5 sm:p-6 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl border-4 border-slate-900 bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] shrink-0 -rotate-3">
                  <History className="w-6 h-6 text-amber-700" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-black text-amber-900">歷年錄取成績</div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight break-words">{school.name}</h3>
                  <div className="mt-2">
                    <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-black ${scores.length > 0 ? trend.tone : 'border-slate-200 bg-slate-100 text-slate-500'}`}>
                      {scores.length > 0 ? trend.label : historicalScoresPendingText}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl border-4 border-slate-900 bg-white flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-slate-100 active:translate-y-0.5 active:shadow-none transition-all shrink-0"
                aria-label="關閉歷年成績"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar bg-slate-50">
              {scores.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-amber-300 bg-white p-8 text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-slate-900 bg-amber-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                    <Database className="h-7 w-7 text-amber-700" />
                  </div>
                  <div className="text-xl font-black text-slate-900">{historicalScoresPendingText}</div>
                  <div className="mt-2 text-sm font-bold text-slate-500">後端尚未提供此校歷年錄取成績，完成建置後會自動顯示。</div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                      <div className="text-[11px] font-black text-slate-500">{latest?.year || '最新'} 年積分</div>
                      <div className="mt-1 text-4xl font-black text-slate-900 leading-none">{latest?.points ?? '--'}</div>
                    </div>
                    <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                      <div className="text-[11px] font-black text-slate-500">{latest?.year || '最新'} 年積點</div>
                      <div className="mt-1 text-4xl font-black text-slate-900 leading-none">{formatHistoricalCredits(latest?.credits)}</div>
                    </div>
                  </div>
                  <div className="rounded-2xl border-2 border-slate-900 bg-white p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="font-black text-slate-900">年度趨勢</div>
                      <div className="text-[11px] font-bold text-slate-500">points=積分，credits=積點</div>
                    </div>
                    <div className="space-y-3">
                      {scores.map((item: any) => {
                        const width = `${Math.max(14, Math.round(((Number(item.points) || 0) / maxPoint) * 100))}%`;
                        return (
                          <div key={`${item.year}-${item.points}-${item.credits ?? 'none'}`} className="grid grid-cols-[48px_1fr_auto] items-center gap-3">
                            <div className="font-black text-slate-500 text-sm">{item.year}</div>
                            <div className="h-4 rounded-full border border-slate-200 bg-slate-100 overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-sky-300 to-indigo-400" style={{ width }} />
                            </div>
                            <div className="text-xs sm:text-sm font-black text-slate-800 whitespace-nowrap">{formatHistoricalScore(item)}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const gradeOptions = [
  { value: 'A++', label: 'A++ (精熟)' },
  { value: 'A+', label: 'A+ (精熟)' },
  { value: 'A', label: 'A (精熟)' },
  { value: 'B++', label: 'B++ (基礎)' },
  { value: 'B+', label: 'B+ (基礎)' },
  { value: 'B', label: 'B (基礎)' },
  { value: 'C', label: 'C (待加強)' }
];

export default function App() {
  const [formData, setFormData] = useState({
    invitationCode: '',
    region: '',
    identity: 'student',
    schoolOwnership: 'all',
    schoolType: 'all',
    chinese: '',
    english: '',
    math: '',
    science: '',
    social: '',
    composition: ''
  });

  const [status, setStatus] = useState<'idle' | 'auth' | 'quantum' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [results, setResults] = useState<any>(null);
  
  // Modals state
const [activeModal, setActiveModal] = useState<'disclaimer' | 'importantDates' | 'qrcode' | 'rating' | 'authFail' | 'validationFailed' | 'export' | 'scoringMethod' | 'sharePlatform' | 'reportError' | 'strategy' | 'mockVolunteer' | 'historicalStats' | 'scoreInquiry' | 'dataProvider' | null>(null);
  const [isVocationalOpen, setIsVocationalOpen] = useState(false);
  const [isHollandTestOpen, setIsHollandTestOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [vocationalGroups, setVocationalGroups] = useState<string[]>(['all']);
  const [isExternalLinksOpen, setIsExternalLinksOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [expandedNavCategory, setExpandedNavCategory] = useState<string | null>('schoolDetails');
  const [historicalScoreSchool, setHistoricalScoreSchool] = useState<any | null>(null);
  
  // Comparison
  const [comparisonSchools, setComparisonSchools] = useState<any[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Custom Result Filters
  const [resultFilterText, setResultFilterText] = useState('');
  const [resultFilterOwnership, setResultFilterOwnership] = useState('all');
  const [resultFilterType, setResultFilterType] = useState('all');
  const [resultFilterZone, setResultFilterZone] = useState('all');

  useEffect(() => {
    if (window.localStorage.getItem(DISCLAIMER_SEEN_KEY) !== 'true') {
      setActiveModal('disclaimer');
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code') || params.get('invitationCode') || params.get('invite');
    if (code) {
      setFormData(prev => ({ ...prev, invitationCode: code }));
    }

    const hollandGroupsParam = params.get('hollandGroups') || params.get('vocationalGroups');
    if (hollandGroupsParam) {
      const recommendedGroups = hollandGroupsParam
        .split(',')
        .map(group => group.trim())
        .filter(Boolean);

      if (recommendedGroups.length > 0) {
        setFormData(prev => ({ ...prev, schoolType: '職業類科' }));
        setVocationalGroups(recommendedGroups);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const focusMissingField = (field: string) => {
    const fieldTargets: Record<string, string> = {
      '邀請碼': 'invitation-code',
      '就學考區': 'region-select-trigger',
      '國文成績': 'score-chinese',
      '英文成績': 'score-english',
      '數學成績': 'score-math',
      '自然成績': 'score-science',
      '社會成績': 'score-social',
      '作文成績': 'score-composition',
    };
    const targetId = fieldTargets[field]
      ?? (field.includes('授權碼') || field.includes('邀請碼') ? 'invitation-code' : undefined);

    setActiveModal(null);
    if (!targetId) return;

    window.setTimeout(() => {
      const target = document.getElementById(targetId);
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target?.focus({ preventScroll: true });
    }, 180);
  };

  const handleAnalyze = async () => {
    const invitationCode = normalizeInvitationCode(formData.invitationCode);
    const missing: string[] = [];
    if (!invitationCode) missing.push('系統授權碼');
    if (!formData.region) missing.push('就學考區');
    if (!formData.chinese) missing.push('國文成績');
    if (!formData.english) missing.push('英文成績');
    if (!formData.math) missing.push('數學成績');
    if (!formData.science) missing.push('自然成績');
    if (!formData.social) missing.push('社會成績');
    if (!formData.composition) missing.push('作文成績');

    if (missing.length > 0) {
      setMissingFields(missing);
      setActiveModal('validationFailed');
      return;
    }
    
    setErrorMessage('');

    if (invitationCode !== formData.invitationCode) {
      setFormData(prev => ({ ...prev, invitationCode }));
    }
    
    const cachedAuth = localStorage.getItem('invitationAuthCache');
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    let hasValidAuthCache = false;

    if (cachedAuth) {
      try {
        const parsed = JSON.parse(cachedAuth) as { code?: string; timestamp?: number };
        hasValidAuthCache =
          parsed.code === invitationCode &&
          typeof parsed.timestamp === 'number' &&
          now - parsed.timestamp < tenMinutes;
      } catch {
        localStorage.removeItem('invitationAuthCache');
      }
    }
    
    if (hasValidAuthCache) {
      setStatus('quantum');
      executeAnalysis();
    } else {
      setStatus('auth');
    }
  };

  const executeAnalysis = async () => {
    try {
      const payload = {
        scores: {
          chinese: formData.chinese,
          english: formData.english,
          math: formData.math,
          science: formData.science,
          social: formData.social,
          composition: parseInt(formData.composition, 10) || 0
        },
        filters: {
          schoolOwnership: formData.schoolOwnership,
          schoolType: formData.schoolType,
          vocationalGroups: vocationalGroups,
          analysisIdentity: formData.identity
        },
        region: formData.region,
        invitationCode: normalizeInvitationCode(formData.invitationCode),
        timestamp: new Date().toISOString(),
        action: 'analyzeScores',
        clientInfo: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          url: window.location.href
        }
      };

      const data = await callBackend<any>(payload);
      sessionStorage.setItem(
        RESULTS_STORAGE_KEY,
        JSON.stringify({
          scores: formData,
          results: data,
          identity: formData.identity,
          vocationalGroups,
          createdAt: new Date().toISOString(),
        }),
      );
      setResults(data);
      setStatus('success');
      window.location.href = withBasePath('/results');
      
      // Delay status change to allow Quantum overlay to finish
      // QuantumLoadingOverlay handles it internally calling onComplete which will set status to success
    } catch (e: unknown) {
      setStatus('error');
      if (isBackendError(e) && e.code === 'INVALID_INVITATION_CODE') {
        localStorage.removeItem('invitationAuthCache');
        setErrorMessage('');
        setActiveModal('authFail');
      } else {
        const requestId = isBackendError(e) && e.requestId ? `（錯誤編號：${e.requestId}）` : '';
        setErrorMessage(
          `${e instanceof Error ? e.message : '分析過程中發生錯誤，請稍後再試。'}${requestId}`,
        );
      }
    }
  };

  const toggleComparison = (school: any) => {
    setComparisonSchools(prev => {
      const exists = prev.find(s => s.name === school.name);
      if (exists) return prev.filter(s => s.name !== school.name);
      if (prev.length >= 4) {
        alert('最多只能比較 4 所學校');
        return prev;
      }
      const regionName = ALL_REGIONS.find(r => r.id === formData.region)?.name || '未知';
      return [...prev, { ...school, region: regionName }];
    });
  };

  const handleExport = async (type: 'txt' | 'excel' | 'json' | 'print') => {
    if (!results) return;
    const regionName = ALL_REGIONS.find(r => r.id === formData.region)?.name || '未選擇';
    const payload = { scores: formData, results, identity: formData.identity, vocationalGroups };
    const { exportTxt, exportExcel, exportJson, printResults } = await import('./lib/exportUtils');
    switch (type) {
      case 'txt': exportTxt(payload, regionName); break;
      case 'excel': exportExcel(payload, regionName); break;
      case 'json': exportJson(payload); break;
      case 'print': printResults(payload, regionName); break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 pb-32 overflow-hidden relative">
      <a href="#main-content" className="skip-link">跳到主要內容</a>
      
      {/* Modern Background Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-300/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-sky-300/20 rounded-full blur-[100px] pointer-events-none"></div>

      <AppHeader 
        isScrolled={isScrolled} 
        onShareClick={() => setActiveModal('sharePlatform')} 
        onMenuClick={() => setIsNavMenuOpen(true)} 
        isMenuOpen={isNavMenuOpen}
      />

      <main id="main-content" className="max-w-6xl mx-auto px-4 mt-32 sm:mt-40 space-y-8 relative z-10">
        
        <HeroBanner onDataProviderClick={() => setActiveModal('dataProvider')} />

        {errorMessage && (
          <div role="alert" className="p-4 bg-red-50 text-red-700 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] font-bold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Bento Grid Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Basic Info & Region */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Card: Auth */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative p-6 bg-[#fffbea] border-4 border-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200 rounded-bl-full -z-0 opacity-50 border-b-4 border-l-4 border-slate-900 pointer-events-none"></div>
              <div className="absolute top-4 right-4 bg-amber-400 border-2 border-slate-900 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full rotate-12 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] z-10 pointer-events-none select-none">VIP ONLY</div>

              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-2 relative z-10">
                <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-slate-900 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-amber-600" />
                </div>
                <span>系統授權碼</span>
              </h2>
              <p className="text-xs font-bold text-slate-600 mb-4 relative z-10">請輸入由主辦單位提供之專屬邀請碼以解鎖進階分析</p>

              {/* Announcement */}
              <div className="mb-4 p-4 bg-gradient-to-r from-amber-200 to-amber-100 border-4 border-slate-900 rounded-xl relative z-10 overflow-hidden group shadow-[4px_4px_0px_0px_rgba(251,191,36,1)]">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                {(() => {
                  const now = new Date();
                  const start = new Date('2026-06-24T11:55:00+08:00');
                  const end = new Date('2026-06-30T23:59:59+08:00');
                  const isDuringInterval = now >= start && now <= end;
                  
                  if (isDuringInterval) {
                    return (
                      <>
                        <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5 mb-1.5">
                          <span className="text-xl animate-bounce">📢</span>分享序位，免費拿邀請碼！
                        </h3>
                        <p className="text-sm font-bold text-slate-800 leading-relaxed">
                          填寫序位分享表單後，即可免費獲得邀請碼！<br />
                          <a href="https://tyctw.github.io/form/" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-white bg-indigo-600 px-3 py-1.5 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all">
                            前往填寫表單獲取
                          </a>
                        </p>
                      </>
                    );
                  }
                  
                  return (
                    <>
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-1.5 mb-1.5">
                        <span className="text-xl animate-bounce">📢</span> 限時公告
                      </h3>
                      <p className="text-sm font-bold text-slate-800 leading-relaxed">
                        即日起至 <span className="inline-block bg-white text-rose-600 px-1.5 py-0.5 rounded font-black border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)]">2026/12/30</span> 前，提供免費使用。<br className="hidden sm:block" />
                        請於下方輸入邀請碼 <span className="inline-block bg-indigo-600 text-white font-mono text-sm px-2 py-0.5 rounded border-2 border-slate-900 shadow-[2px_2px_0px_rgba(15,23,42,1)] mx-0.5 select-all hover:-translate-y-0.5 transition-transform">TYCTW</span> 即可一鍵解鎖所有進階功能。
                      </p>
                    </>
                  );
                })()}
              </div>
              
              <div className="relative z-10 grid grid-cols-[minmax(0,1fr)_48px] gap-2">
                <label htmlFor="invitation-code" className="sr-only">邀請碼</label>
                <input
                  id="invitation-code"
                  type="text"
                  placeholder="請輸入您的邀請碼"
                  value={formData.invitationCode}
                  onChange={(e) => updateForm('invitationCode', e.target.value)}
                  autoComplete="off"
                  required
                  className="min-w-0 w-full px-3 py-3 sm:px-4 rounded-xl bg-white border-2 border-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-400/30 transition-all font-black text-slate-900 shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)] placeholder-slate-400 tracking-wide"
                />
                <button 
                  type="button"
                  onClick={() => setActiveModal('qrcode')}
                  aria-label="掃描 QR Code 輸入邀請碼"
                  className="flex h-full min-h-[52px] w-12 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(251,191,36,1)] transition-all hover:bg-slate-800 active:translate-y-1 active:shadow-none group"
                  title="掃描 QR Code"
                >
                  <QrCode className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <div className="mt-3 relative z-10 flex justify-end">
                <a 
                  href="https://tyctw.github.io/form/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1 active:scale-95 transition-transform"
                >
                  點此獲取邀請碼
                </a>
              </div>
            </motion.section>

             {/* Card: Profile Identity */}
             <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-emerald-50 border-4 border-slate-900 rounded-3xl shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] space-y-6 relative overflow-hidden"
            >
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-emerald-200 rounded-tr-[40px] opacity-40 border-t-4 border-r-4 border-slate-900 pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-slate-900 flex items-center justify-center">
                    <User className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span>使用者身份設定</span>
                </h2>
                <p className="text-xs font-bold text-slate-500 mb-4">我們將根據您的身分提供合適的落點建議</p>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'student', label: '我是學生', icon: '🎓' },
                    { id: 'teacher', label: '我是老師', icon: '👩‍🏫' },
                    { id: 'parent', label: '我是家長', icon: '👨‍👩‍👧' }
                  ].map(opt => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => updateForm('identity', opt.id)}
                      aria-pressed={formData.identity === opt.id}
                      className={`flex flex-col items-center justify-center gap-1 py-3 px-1 rounded-xl border-2 font-black transition-all ${
                        formData.identity === opt.id 
                          ? 'bg-emerald-400 text-slate-900 border-slate-900 shadow-[inset_2px_2px_0px_rgba(255,255,255,0.5)] -translate-y-1' 
                          : 'bg-white text-slate-600 border-slate-300 hover:border-slate-900 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-xs">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-6 relative z-10">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                <div>
                  <label htmlFor="school-ownership" className="text-sm font-black text-slate-900 flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 border border-slate-900 inline-block"></span>
                    偏好學校屬性
                  </label>
                  <div className="relative">
                    <select
                      id="school-ownership"
                      className="w-full pl-4 pr-10 py-3 rounded-xl bg-white border-2 border-slate-900 appearance-none focus:outline-none focus:ring-4 focus:ring-emerald-400/30 transition-all font-bold text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
                      value={formData.schoolOwnership}
                      onChange={(e) => updateForm('schoolOwnership', e.target.value)}
                    >
                      <option value="all">公/私立不拘</option>
                      <option value="public">僅公立學校</option>
                      <option value="private">僅私立學校</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none bg-emerald-100 p-1 rounded-md border border-slate-900">
                      <ChevronDown className="w-4 h-4 text-emerald-700" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mt-4 mb-3">
                    <label htmlFor="school-type" className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 border border-slate-900 inline-block"></span>
                      偏好學校類型
                    </label>
                    <button 
                      type="button"
                      onClick={() => { window.location.href = withBasePath('/school-types'); }}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <Building2 className="w-3 h-3" />
                      學校類型解析說明
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      id="school-type"
                      className="w-full pl-4 pr-10 py-3 rounded-xl bg-white border-2 border-slate-900 appearance-none focus:outline-none focus:ring-4 focus:ring-emerald-400/30 transition-all font-bold text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
                      value={formData.schoolType}
                      onChange={(e) => {
                        const value = e.target.value;
                        updateForm('schoolType', value);
                        if (value !== '職業類科') {
                          setVocationalGroups(['all']);
                        }
                      }}
                    >
                      <option value="all">全不拘</option>
                      <option value="普通科">普通科</option>
                      <option value="職業類科">職業類科</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none bg-emerald-100 p-1 rounded-md border border-slate-900">
                      <ChevronDown className="w-4 h-4 text-emerald-700" />
                    </div>
                  </div>
                </div>
                {formData.schoolType === '職業類科' && (
                  <div>
                    <div className="flex items-center justify-between mt-4 mb-3">
                      <label className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 border border-slate-900 inline-block"></span>
                        職業群別選擇
                      </label>
                      <button 
                        onClick={() => { window.location.href = withBasePath('/vocational-encyclopedia'); }}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 active:scale-95 transition-transform"
                      >
                        <BookOpen className="w-3 h-3" />
                        職群/科系深入介紹百科
                      </button>
                    </div>
                    <button
                      onClick={() => setIsVocationalOpen(true)}
                      className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-900 focus:outline-none transition-all font-bold text-left shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-emerald-50 active:translate-y-1 active:shadow-none flex justify-between items-center"
                    >
                      <span className="text-slate-900">{vocationalGroups.includes('all') ? '全部選擇' : `已選擇 ${vocationalGroups.length} 項群別`}</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                )}
              </div>
            </motion.section>

          </div>

          {/* Center/Right Column: Region & Scores */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Region Select Button */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-white border-2 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 mb-1">
                    <MapPin className="w-6 h-6 text-rose-500" /> 分析區域
                  </h2>
                  <p className="text-sm font-bold text-slate-500">請選擇您要探索的高中職就學區域</p>
                </div>
                
                <div className="flex flex-row gap-2 sm:gap-3 w-full">
                  <button
                    type="button"
                    id="region-select-trigger"
                    onClick={() => setIsRegionOpen(true)}
                    aria-haspopup="dialog"
                    aria-expanded={isRegionOpen}
                    className="flex-1 px-4 sm:px-6 py-4 rounded-2xl border-2 border-slate-900 flex items-center justify-between gap-2 sm:gap-4 font-black transition-all bg-amber-100 text-amber-900 hover:bg-amber-200 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none"
                  >
                    <div className="flex items-center gap-3">
                      {formData.region ? (
                        <>
                          <span className="text-lg sm:text-xl">{ALL_REGIONS.find(r => r.id === formData.region)?.name || '未知區域'}</span>
                        </>
                      ) : (
                        <span className="text-lg sm:text-xl">選擇就學區</span>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-900 shrink-0" />
                  </button>
                  {formData.region && (
                    <button
                      type="button"
                      onClick={() => setActiveModal('scoringMethod')}
                      className="shrink-0 px-3 sm:px-4 py-4 rounded-2xl border-2 border-slate-900 flex items-center justify-center gap-1 sm:gap-2 font-black transition-all bg-white text-slate-900 hover:bg-slate-100 active:translate-y-1 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:shadow-none"
                    >
                      <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                      <span className="shrink-0 text-sm sm:text-base">計分方式</span>
                    </button>
                  )}
                </div>
              </div>
            </motion.section>

            {/* Scores Configuration */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 sm:p-8 bg-sky-100 border-2 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <h2 className="text-xl font-black flex items-center gap-2 text-slate-900 mb-1">
                    <Calculator className="w-6 h-6 text-indigo-600" /> 會考成績評估
                  </h2>
                  <p className="text-sm font-bold text-slate-600">請設定各科成績等級，系統將即時分析</p>
                </div>
                
                {/* Result quick look or decoration */}
                <div className="bg-white border-2 border-slate-900 px-4 py-2 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hidden sm:flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <span className="font-black text-sm text-slate-900">即刻演算</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4">
                {[
                  { id: 'chinese', label: '國文', icon: BookOpen, color: 'text-rose-600', bgBorder: 'bg-rose-50 border-rose-300 focus:ring-rose-400 focus:border-rose-400 hover:border-rose-400', theme: 'bg-white' },
                  { id: 'english', label: '英文', icon: Languages, color: 'text-amber-600', bgBorder: 'bg-amber-50 border-amber-300 focus:ring-amber-400 focus:border-amber-400 hover:border-amber-400', theme: 'bg-white' },
                  { id: 'math', label: '數學', icon: Calculator, color: 'text-blue-600', bgBorder: 'bg-blue-50 border-blue-300 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400', theme: 'bg-white' },
                  { id: 'science', label: '自然', icon: Activity, color: 'text-emerald-600', bgBorder: 'bg-emerald-50 border-emerald-300 focus:ring-emerald-400 focus:border-emerald-400 hover:border-emerald-400', theme: 'bg-white' },
                  { id: 'social', label: '社會', icon: Map, color: 'text-purple-600', bgBorder: 'bg-purple-50 border-purple-300 focus:ring-purple-400 focus:border-purple-400 hover:border-purple-400', theme: 'bg-white' }
                ].map(subject => (
                  <div key={subject.id} className={`relative group ${subject.theme} border-2 border-slate-900 rounded-2xl p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col gap-3`}>
                    <div className="flex items-center justify-between gap-2 sm:gap-4">
                      <label htmlFor={`score-${subject.id}`} className="text-base sm:text-lg font-black text-slate-700 flex items-center gap-3 shrink-0">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] bg-slate-50`}>
                          <subject.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${subject.color}`} />
                        </div>
                        {subject.label}
                      </label>
                      <div className="relative w-full max-w-[180px] sm:max-w-[200px]">
                        <select
                          id={`score-${subject.id}`}
                          required
                          className={`w-full px-2 sm:px-4 py-2 sm:py-3 rounded-xl border-2 font-black text-sm sm:text-lg appearance-none outline-none focus:outline-none focus:ring-4 transition-all cursor-pointer ${subject.bgBorder}`}
                          value={(formData as any)[subject.id]}
                          onChange={(e) => updateForm(subject.id, e.target.value)}
                        >
                          <option value="" disabled>-- 選擇等級 --</option>
                          {gradeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <ChevronRight className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400 pointer-events-none rotate-90" />
                      </div>
                    </div>
                    {formData.region && (formData as any)[subject.id] && (() => {
                      const scoreData = REGION_SCORING_DATA[formData.region];
                      let scoreText: string | null = null;
                      const grade = (formData as any)[subject.id];
                      
                      if (scoreData?.examDetail) {
                        if (['tainan', 'hsinchu'].includes(formData.region)) {
                          if (grade.startsWith('A')) scoreText = '6分';
                          else if (grade.startsWith('B')) scoreText = '4分';
                          else if (grade === 'C') scoreText = '2分';
                        } else {
                          const match = scoreData.examDetail.find((d: any) => d.level === grade);
                          if (match) scoreText = match.score;
                        }
                      }

                      return scoreText ? (
                        <div className="flex items-center justify-between mt-1 pt-3.5 border-t-[3px] border-dashed border-slate-200/80 animate-in fade-in slide-in-from-top-2 duration-300">
                          <span className="text-xs sm:text-sm font-bold text-slate-500 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                            就學區換算積分
                          </span>
                          <div className={`flex items-center gap-2 bg-white border-2 border-slate-900 px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] shrink-0 hover:-translate-y-0.5 transition-transform`}>
                             <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                               <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                             </div>
                             <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">{scoreText}</span>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                ))}

                {/* Composition */}
                <div className="relative group bg-slate-900 border-2 border-slate-900 rounded-2xl p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 sm:gap-4">
                    <label htmlFor="score-composition" className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-3 shrink-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 border-amber-400/50 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(251,191,36,0.2)] bg-slate-800">
                        <PenTool className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                      </div>
                      寫作
                    </label>
                    <div className="relative w-full max-w-[180px] sm:max-w-[200px]">
                      <select
                        id="score-composition"
                        required
                        className="w-full px-2 sm:px-4 py-2 sm:py-3 rounded-xl border-2 border-slate-700 bg-slate-800 text-amber-400 font-black text-sm sm:text-lg appearance-none outline-none focus:outline-none focus:ring-4 focus:ring-amber-400/50 hover:border-amber-500/50 transition-all cursor-pointer"
                        value={formData.composition}
                        onChange={(e) => updateForm('composition', e.target.value)}
                      >
                        <option value="" disabled>-- 選擇級分 --</option>
                        {[6, 5, 4, 3, 2, 1, 0].map(s => <option key={s} value={s}>{s} 級分</option>)}
                      </select>
                      <ChevronRight className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-amber-500/50 pointer-events-none rotate-90" />
                    </div>
                  </div>
                  {formData.region && formData.composition && (() => {
                    let compScore: string | null = null;
                    const comp = parseInt(formData.composition, 10);
                    switch(formData.region) {
                      case 'taipei':
                         if (comp === 6) compScore = '1分';
                         else if (comp === 5) compScore = '0.8分';
                         else if (comp === 4) compScore = '0.6分';
                         else if (comp === 3) compScore = '0.4分';
                         else if (comp === 2) compScore = '0.2分';
                         else if (comp === 1) compScore = '0.1分';
                         else compScore = '0分';
                         break;
                      case 'taoyuan':
                         if (comp >= 4) compScore = '3分';
                         else if (comp >= 2) compScore = '2分';
                         else if (comp === 1) compScore = '1分';
                         else compScore = '0分';
                         break;
                      case 'central':
                         compScore = `${comp}點`;
                         break;
                      case 'kaohsiung':
                         compScore = `${comp}級分 (優先比序)`;
                         break;
                      default:
                         compScore = '同分比序用';
                         break;
                    }
                    
                    return compScore ? (
                      <div className="flex items-center justify-between mt-1 pt-3.5 border-t-[3px] border-dashed border-slate-700 animate-in fade-in slide-in-from-top-2 duration-300">
                        <span className="text-xs sm:text-sm font-bold text-slate-400 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                          就學區換算積分
                        </span>
                        <div className={`flex items-center gap-2 bg-slate-800 border-2 border-slate-700 px-3 py-1.5 rounded-xl shadow-[2px_2px_0px_0px_rgba(251,191,36,0.3)] shrink-0 hover:-translate-y-0.5 transition-transform`}>
                           <div className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center border border-amber-400/30">
                             <Award className="w-3.5 h-3.5 text-amber-400" />
                           </div>
                           <span className="text-sm sm:text-base font-black text-amber-400 tracking-tight">{compScore}</span>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>

              </div>
            </motion.section>

          </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <div className="sticky bottom-6 left-0 right-0 w-full px-4 z-50 pointer-events-none mt-8">
        <div className="max-w-2xl mx-auto pointer-events-auto">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={status === 'auth' || status === 'quantum'}
            aria-busy={status === 'auth' || status === 'quantum'}
            className="w-full flex items-center justify-center gap-3 bg-indigo-500 border-2 border-slate-900 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rounded-2xl py-4 px-8 text-xl font-black transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(15,23,42,1)] disabled:bg-slate-400 group"
          >
            {status === 'quantum' ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                <Activity className="w-6 h-6" />
              </motion.div>
            ) : (
              <>
                開始落點分析 <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      <CyberAuthOverlay 
        isOpen={status === 'auth'}
        code={formData.invitationCode}
        onSuccess={() => {
          localStorage.setItem('invitationAuthCache', JSON.stringify({
            code: normalizeInvitationCode(formData.invitationCode),
            timestamp: Date.now(),
          }));
          setStatus('quantum');
          executeAnalysis();
        }}
        onFail={(reason, message) => {
          setStatus('idle');
          if (reason === 'invalid') {
            localStorage.removeItem('invitationAuthCache');
            setActiveModal('authFail');
          } else {
            setErrorMessage(message || '驗證服務暫時無法使用，請稍後再試。');
          }
        }}
      />

      <QuantumLoadingOverlay 
        isOpen={status === 'quantum'}
      />

      {/* Results Section */}
      <AnimatePresence>
        {status === 'success' && results && (
          <motion.div 
            id="results-section"
            role="region"
            aria-live="polite"
            aria-label="分析結果"
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} 
            className="max-w-6xl mx-auto px-4 pt-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-12 flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  <Award className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">落點運算總結報告</h2>
              </div>

              <div className="lg:col-span-12 flex flex-col gap-4 mb-4">
                {results.analysisReport && (
                  <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-4 border-slate-900 rounded-[32px] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col gap-6 relative overflow-hidden group">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none translate-x-1/4 -translate-y-1/4 group-hover:bg-indigo-400/30 transition-colors duration-700"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl pointer-events-none -translate-x-1/4 translate-y-1/4 group-hover:bg-purple-400/30 transition-colors duration-700"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent pointer-events-none blur-xl"></div>
                    
                    <div className="relative z-10 flex flex-col gap-8">
                      {/* Header Section */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-slate-900/10 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center -rotate-3 text-indigo-600 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:rotate-0 transition-transform duration-300">
                            <Sparkles className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                              AI 智能落點分析
                              <span className="bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-lg uppercase tracking-wider relative -top-2 rotate-3 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">Beta</span>
                            </h3>
                            <p className="text-slate-600 font-bold text-sm mt-1 tracking-wide uppercase">Personalized Analytics Strategy</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { window.location.href = withBasePath('/strategy'); }}
                          className="w-full sm:w-auto px-5 py-3 bg-amber-400 text-slate-900 font-bold text-sm sm:text-base rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                          <Target className="w-5 h-5" />
                          志願選填攻略
                        </button>
                      </div>

                      {/* Content Section - Bento Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-stretch">
                        
                        {/* Reports Column */}
                        <div className="lg:col-span-7 flex flex-col gap-6 h-full">
                          <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex flex-col flex-1 relative overflow-hidden group/feedback">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-100 rounded-bl-[100px] -z-0 opacity-50 group-hover/feedback:opacity-100 transition-opacity"></div>
                            <h4 className="text-slate-900 font-black text-lg mb-3 flex items-center gap-2 relative z-10">
                              <div className="bg-rose-100 p-1.5 rounded-lg border-2 border-slate-900">
                                <Target className="w-5 h-5 text-rose-600" />
                              </div>
                              總結評價
                            </h4>
                            <p className="text-slate-700 font-bold text-lg sm:text-xl leading-relaxed flex-1 relative z-10">
                              {results.analysisReport.analysisSummary}
                            </p>
                          </div>
                          
                          <div className="bg-indigo-600 border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all relative overflow-hidden group/idea">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover/idea:bg-white/20 transition-all"></div>
                            <h4 className="text-white font-black text-lg mb-3 flex items-center gap-2 relative z-10">
                              <div className="bg-indigo-500 p-1.5 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                                <Lightbulb className="w-5 h-5 text-amber-300" />
                              </div>
                              策略建議
                            </h4>
                            <p className="text-indigo-50 font-bold leading-relaxed relative z-10 text-[15px]">
                              {results.analysisReport.suggestion}
                            </p>
                          </div>
                        </div>

                        {/* Distribution Matrix Column */}
                        <div className="lg:col-span-5 bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col h-full hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 transition-all">
                          <h4 className="text-slate-900 font-black text-lg mb-6 flex items-center gap-2 border-b-2 border-slate-100 pb-4">
                            <div className="bg-slate-100 p-1.5 rounded-lg border-2 border-slate-900">
                              <Layers className="w-5 h-5 text-slate-700" />
                            </div>
                            可填校系分佈矩陣
                          </h4>
                          
                          <div className="flex flex-col gap-4 flex-1 justify-center">
                            {/* Reach */}
                            <div className="relative group/item p-4 bg-slate-50 rounded-2xl border-2 border-slate-900 overflow-hidden flex items-center justify-between hover:bg-rose-50 transition-colors shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white border-2 border-slate-900 text-rose-500 rounded-xl flex items-center justify-center group-hover/item:scale-110 group-hover/item:-rotate-3 transition-transform shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                                  <Flame className="w-6 h-6" strokeWidth={2.5} />
                                </div>
                                <div>
                                  <div className="text-slate-900 font-black text-lg">夢幻區間 <span className="text-[10px] text-white font-black bg-rose-500 px-2 py-0.5 rounded-md border border-slate-900 ml-1 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">REACH</span></div>
                                  <div className="text-slate-500 text-xs font-bold mt-0.5">挑戰性高，可少量選填</div>
                                </div>
                              </div>
                              <div className="text-3xl font-black text-rose-600 tracking-tighter drop-shadow-sm">
                                {results.analysisReport.zoneCounts?.reach || 0}<span className="text-sm text-slate-400 ml-1 font-bold">所</span>
                              </div>
                            </div>

                            {/* Target */}
                            <div className="relative group/item p-4 bg-slate-50 rounded-2xl border-2 border-slate-900 overflow-hidden flex items-center justify-between hover:bg-sky-50 transition-colors shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white border-2 border-slate-900 text-sky-500 rounded-xl flex items-center justify-center group-hover/item:scale-110 group-hover/item:rotate-3 transition-transform shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                                  <Target className="w-6 h-6" strokeWidth={2.5} />
                                </div>
                                <div>
                                  <div className="text-slate-900 font-black text-lg">實際區間 <span className="text-[10px] text-white font-black bg-sky-500 px-2 py-0.5 rounded-md border border-slate-900 ml-1 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">TARGET</span></div>
                                  <div className="text-slate-500 text-xs font-bold mt-0.5">實力相當，主要選填目標</div>
                                </div>
                              </div>
                              <div className="text-3xl font-black text-sky-600 tracking-tighter drop-shadow-sm">
                                {results.analysisReport.zoneCounts?.target || 0}<span className="text-sm text-slate-400 ml-1 font-bold">所</span>
                              </div>
                            </div>

                            {/* Safe */}
                            <div className="relative group/item p-4 bg-slate-50 rounded-2xl border-2 border-slate-900 overflow-hidden flex items-center justify-between hover:bg-emerald-50 transition-colors shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white border-2 border-slate-900 text-emerald-500 rounded-xl flex items-center justify-center group-hover/item:scale-110 group-hover/item:-rotate-3 transition-transform shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                                  <ShieldCheck className="w-6 h-6" strokeWidth={2.5} />
                                </div>
                                <div>
                                  <div className="text-slate-900 font-black text-lg">保守區間 <span className="text-[10px] text-white font-black bg-emerald-500 px-2 py-0.5 rounded-md border border-slate-900 ml-1 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">SAFE</span></div>
                                  <div className="text-slate-500 text-xs font-bold mt-0.5">錄取率極高，保底選擇</div>
                                </div>
                              </div>
                              <div className="text-3xl font-black text-emerald-600 tracking-tighter drop-shadow-sm">
                                {results.analysisReport.zoneCounts?.safe || 0}<span className="text-sm text-slate-400 ml-1 font-bold">所</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 flex flex-col gap-4 lg:max-h-[600px] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
                <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
                  <div className="bg-indigo-300 p-4 border-b-2 border-slate-900 flex justify-between items-center">
                    <h3 className="font-black text-slate-900 flex items-center gap-2">
                      <Calculator className="w-5 h-5" /> 總分換算
                    </h3>
                  </div>
                  <div className="p-5 flex flex-col gap-3 bg-slate-50">
                    <div className="bg-white p-4 rounded-xl border-2 border-slate-900 flex justify-between items-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all">
                      <span className="font-bold text-slate-600">區域總積分</span>
                      <span className="text-3xl font-black text-indigo-600">{results.totalPoints || '無'}</span>
                    </div>
                    {results.totalCredits && (
                      <div className="bg-white p-4 rounded-xl border-2 border-slate-900 flex justify-between items-center shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all mt-1">
                        <span className="font-bold text-slate-600">區域總積點</span>
                        <span className="text-3xl font-black text-emerald-600">{results.totalCredits}</span>
                      </div>
                    )}
                    <div className="mt-2 p-4 bg-slate-900 text-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex justify-between items-center">
                      <div className="font-bold text-slate-300">合適學校總數</div>
                      <div className="text-2xl font-black text-emerald-400">{results.eligibleSchools?.length || 0} <span className="text-sm font-bold text-slate-300">所</span></div>
                    </div>
                    {(results.scoringMethod || results.analysisReport?.scoringExplanation) && (
                      <div className="bg-white p-4 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                        <div className="text-xs font-black text-slate-500 mb-2">精算依據</div>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">
                          {results.scoringMethod || results.analysisReport.scoringExplanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-amber-100 border-2 border-slate-900 rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex flex-col">
                  <h3 className="text-sm font-black text-slate-900 mb-3 flex items-center gap-2 opacity-80">
                    <Filter className="w-4 h-4" /> 篩選偏好
                  </h3>
                  <div className="flex flex-col gap-3">
                    <div className="bg-white py-3 px-4 rounded-xl border-2 border-slate-900 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                      <span className="text-sm font-bold text-slate-500">學校屬性</span>
                      <span className="font-black text-slate-800 text-sm">
                        {formData.schoolOwnership === 'all' ? '公/私立不拘' : formData.schoolOwnership === 'public' ? '僅公立學校' : '僅私立學校'}
                      </span>
                    </div>
                    <div className="bg-white py-3 px-4 rounded-xl border-2 border-slate-900 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                      <span className="text-sm font-bold text-slate-500">學校類型</span>
                      <span className="font-black text-slate-800 text-sm">
                        {formData.schoolType === 'all' ? '全不拘' : formData.schoolType === '普通科' ? '普通科' : '職業類科'}
                      </span>
                    </div>
                    {formData.schoolType === '職業類科' && (
                      <div className="bg-white py-3 px-4 rounded-xl border-2 border-slate-900 flex flex-col gap-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                        <span className="text-sm font-bold text-slate-500">職業群別</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {vocationalGroups.length === 1 && vocationalGroups[0] === 'all' ? (
                            <span className="text-sm font-black text-slate-800">全群別不拘</span>
                          ) : (
                            vocationalGroups.map(group => (
                              <span key={group} className="px-2 py-1 bg-emerald-100 text-emerald-800 border-2 border-emerald-300 rounded-lg text-xs font-black">
                                {group}
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4 gap-4">
                  <div className="w-full sm:w-auto">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                      <Building2 className="w-6 h-6 text-indigo-500" /> 最適推薦志願
                    </h3>
                    <span className="text-xs font-bold text-slate-400 mt-1 block">依據系統運算排序</span>
                  </div>
                  <div className="flex flex-wrap gap-2 relative w-full sm:w-auto">
                    <button onClick={() => { window.location.href = withBasePath('/mock-volunteer'); }} className="px-3 py-1.5 bg-sky-50 text-sky-700 font-bold text-xs rounded-lg border-2 border-slate-900 flex items-center gap-1 hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none">
                      <Target className="w-4 h-4" /> 模擬選填
                    </button>
                    <button onClick={() => setIsComparisonOpen(true)} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border-2 border-slate-900 flex items-center gap-1 hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none">
                      <List className="w-4 h-4" /> 比較清單 ({comparisonSchools.length})
                    </button>
                    <button onClick={() => setActiveModal('export')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border-2 border-slate-900 flex items-center gap-1 hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none">
                      <Download className="w-4 h-4" /> 匯出報告
                    </button>
                    <button onClick={() => { window.location.href = withBasePath('/strategy'); }} className="px-3 py-1.5 bg-amber-50 text-amber-700 font-bold text-xs rounded-lg border-2 border-slate-900 flex items-center gap-1 hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none">
                      <Target className="w-4 h-4" /> 志願選填攻略
                    </button>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <label htmlFor="result-filter-text" className="sr-only">搜尋分析結果</label>
                    <input 
                      id="result-filter-text"
                      type="text" 
                      placeholder="搜尋學校、科別關鍵字..." 
                      value={resultFilterText}
                      onChange={e => setResultFilterText(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border-2 border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 placeholder:text-slate-400 transition-all"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <label htmlFor="result-filter-zone" className="sr-only">依落點區間篩選</label>
                    <select 
                      id="result-filter-zone"
                      value={resultFilterZone} 
                      onChange={e => setResultFilterZone(e.target.value)}
                      className="flex-1 sm:flex-none px-3 py-2 bg-white rounded-xl border-2 border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900"
                    >
                      <option value="all">落點區間不拘</option>
                      <option value="reach">夢幻區</option>
                      <option value="target">實際區</option>
                      <option value="safe">保守區</option>
                    </select>
                    <label htmlFor="result-filter-ownership" className="sr-only">依學校屬性篩選</label>
                    <select 
                      id="result-filter-ownership"
                      value={resultFilterOwnership} 
                      onChange={e => setResultFilterOwnership(e.target.value)}
                      className="flex-1 sm:flex-none px-3 py-2 bg-white rounded-xl border-2 border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900"
                    >
                      <option value="all">公私立不拘</option>
                      <option value="public">公立</option>
                      <option value="private">私立</option>
                    </select>
                    <label htmlFor="result-filter-type" className="sr-only">依學校類型篩選</label>
                    <select 
                      id="result-filter-type"
                      value={resultFilterType} 
                      onChange={e => setResultFilterType(e.target.value)}
                      className="flex-1 sm:flex-none px-3 py-2 bg-white rounded-xl border-2 border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900"
                    >
                      <option value="all">科別不拘</option>
                      <option value="普通科">普通科</option>
                      <option value="職業類科">職業類科</option>
                    </select>
                  </div>
                </div>
                
                {(() => {
                  const zoneOrder: Record<string, number> = { reach: 0, target: 1, safe: 2 };
                  const getPointsGap = (school: any) => Math.abs(school.scoreDiff ?? school.pointsDiff ?? school.distanceScore ?? 0);
                  const getCreditsGap = (school: any) => Math.abs(school.creditDiff ?? school.creditsDiff ?? 0);
                  const filteredSchools = (results.eligibleSchools || []).filter((school: any) => {
                    const matchText = !resultFilterText || 
                      school.name?.includes(resultFilterText) || 
                      school.type?.includes(resultFilterText) || 
                      school.group?.includes(resultFilterText);
                    const matchZone = resultFilterZone === 'all' || school.zone === resultFilterZone;
                    const matchOwnership = resultFilterOwnership === 'all' || getSchoolOwnershipKey(school.ownership) === resultFilterOwnership;
                    const matchType = resultFilterType === 'all' || 
                      (resultFilterType === '普通科' && school.type === '普通科') || 
                      (resultFilterType === '職業類科' && school.type !== '普通科');
                    return matchText && matchZone && matchOwnership && matchType;
                  }).sort((a: any, b: any) =>
                    (zoneOrder[a.zone] ?? 99) - (zoneOrder[b.zone] ?? 99) ||
                    (a.zone === 'reach' && b.zone === 'reach'
                      ? getPointsGap(b) - getPointsGap(a) || getCreditsGap(b) - getCreditsGap(a)
                      : getPointsGap(a) - getPointsGap(b)) ||
                    (b.points ?? 0) - (a.points ?? 0)
                  );

                  return filteredSchools.length > 0 ? (
                    <div className="flex-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
                      {filteredSchools.map((school: any, i: number) => {
                        const isCompared = !!comparisonSchools.find(s => s.name === school.name);

                      
                      const ownership = formatSchoolOwnership(school.ownership || 'public');
                      const ownershipColor = ownership === '私立' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-sky-100 text-sky-800 border-sky-300';
                      const OwnershipIcon = ownership === '私立' ? Building2 : Library;
                      const schoolDistrictName = school.district || ALL_REGIONS.find(r => r.id === (school.region || formData.region))?.name || school.region || '未知區域';
                      const historicalScores = normalizeHistoricalScores(school.historicalScores || []).slice(0, 4);
                      const latestHistoricalScore = historicalScores[0];
                      const historicalTrend = getHistoricalTrend(historicalScores);

                      return (
                      <div key={i} className={`relative p-5 rounded-2xl border-2 transition-all group overflow-hidden flex flex-col h-full ${isCompared ? 'bg-indigo-50 border-indigo-500 shadow-[4px_4px_0px_0px_rgba(99,102,241,1)]' : 'bg-white border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]'}`}>
                        {/* Decorative rank number */}
                        <div className={`absolute -right-2 -bottom-4 text-8xl font-black opacity-[0.03] select-none pointer-events-none transition-opacity group-hover:opacity-10 ${i < 3 ? 'text-amber-600' : 'text-slate-900'}`}>{i + 1}</div>
                        
                        <div className="flex flex-col gap-4 relative z-10 flex-1">
                          
                          {/* Top: School Info */}
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 shrink-0 rounded-2xl border-2 border-slate-900 flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] ${i < 3 ? 'bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900' : 'bg-slate-100 text-slate-700'}`}>
                              {i + 1}
                            </div>
                            <div className="pt-1">
                              <h4 className="font-black text-xl text-slate-900 leading-tight">
                                {school.name}
                              </h4>
                            </div>
                          </div>

                          {/* Middle: Tags */}
                          <div className="flex flex-wrap items-stretch gap-2 mt-auto pt-2">
                            {/* Unmet requirements tag */}
                            {school.meetsMinRequirements === false && (
                              <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border-2 bg-red-100 text-red-800 border-red-300 flex-none min-w-[80px]">
                                <span className="text-[10px] font-black uppercase opacity-70 mb-0.5 whitespace-nowrap">特別注意</span>
                                <div className="flex items-center gap-1 font-black text-sm whitespace-nowrap">
                                  科目未達標
                                </div>
                              </div>
                            )}

                            {/* Zone Tag */}
                            {school.zone && (
                              <div className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border-2 ${
                                school.zone === 'reach' ? 'bg-rose-100 text-rose-800 border-rose-300' : 
                                school.zone === 'target' ? 'bg-sky-100 text-sky-800 border-sky-300' :
                                'bg-emerald-100 text-emerald-800 border-emerald-300'
                              } flex-1 min-w-[70px]`}>
                                <span className="text-[10px] font-black uppercase opacity-70 mb-0.5 whitespace-nowrap">落點區間</span>
                                <div className="flex items-center gap-1 font-black text-sm whitespace-nowrap">
                                  {school.zone === 'reach' ? '夢幻區' : school.zone === 'target' ? '實際區' : '保守區'}
                                </div>
                              </div>
                            )}

                            {/* Ownership Tag */}
                            <div className={`flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border-2 ${ownershipColor} flex-1 min-w-[70px]`}>
                              <span className="text-[10px] font-black uppercase opacity-70 mb-0.5 whitespace-nowrap">屬性</span>
                              <div className="flex items-center gap-1 font-black text-sm whitespace-nowrap">
                                <OwnershipIcon className="w-3.5 h-3.5" /> {ownership}
                              </div>
                            </div>

                            {/* Department Tag */}
                            <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border-2 bg-emerald-100 text-emerald-800 border-emerald-300 flex-1 min-w-[70px]">
                              <span className="text-[10px] font-black uppercase opacity-70 mb-0.5 whitespace-nowrap">科別</span>
                              <div className="flex items-center gap-1 font-black text-sm whitespace-nowrap">
                                {school.type || '普通科'}
                              </div>
                            </div>

                            {/* Group Tag */}
                            {school.group && (
                              <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border-2 bg-amber-100 text-amber-800 border-amber-300 flex-1 min-w-[70px]">
                                <span className="text-[10px] font-black uppercase opacity-70 mb-0.5 whitespace-nowrap">群別</span>
                                <div className="flex items-center gap-1 font-black text-sm whitespace-nowrap">
                                  {school.group}
                                </div>
                              </div>
                            )}
                            
                            {/* Region Box */}
                            <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex-1 min-w-[70px]">
                              <span className="text-[10px] font-black uppercase text-slate-500 mb-0.5 whitespace-nowrap">區域</span>
                              <div className="font-black flex items-baseline gap-0.5 whitespace-nowrap text-sm">
                                <span className="text-slate-700">
                                  {schoolDistrictName}
                                </span>
                              </div>
                            </div>
                          </div>

                          {school.analysisNote && (
                            <div className="rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-2">
                              <div className="text-[10px] font-black text-slate-500 mb-1">落點判讀</div>
                              <p className="text-xs font-bold text-slate-700 leading-relaxed">{school.analysisNote}</p>
                              {school.creditDiff !== null && school.creditDiff !== undefined && school.scoreDiff === 0 && (
                                <div className="text-[11px] font-bold text-emerald-700 mt-1">
                                  同分積點差：{school.creditDiff > 0 ? '+' : ''}{school.creditDiff}
                                </div>
                              )}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setHistoricalScoreSchool(school);
                            }}
                            className={`rounded-2xl border-2 border-slate-900 px-3 py-3 text-left shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all ${historicalScores.length > 0 ? 'bg-amber-50' : 'bg-slate-50'}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-9 h-9 rounded-xl border-2 border-slate-900 bg-white flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] shrink-0">
                                  {historicalScores.length > 0 ? (
                                    <History className="w-4 h-4 text-amber-700" />
                                  ) : (
                                    <Database className="w-4 h-4 text-slate-500" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-black text-slate-900">歷年錄取成績</div>
                                  <div className="text-[11px] font-bold text-slate-600 truncate">
                                    {historicalScores.length > 0 ? (
                                      <>
                                        最新 {latestHistoricalScore?.year || '--'} 年：積分 {latestHistoricalScore?.points ?? '--'}
                                        {` / 積點 ${formatHistoricalCredits(latestHistoricalScore?.credits)}`}
                                      </>
                                    ) : (
                                      historicalScoresPendingText
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1 shrink-0">
                                {historicalScores.length > 0 ? (
                                  <span className={`rounded-lg border px-2 py-0.5 text-[10px] font-black ${historicalTrend.tone}`}>
                                    {historicalTrend.label}
                                  </span>
                                ) : (
                                  <span className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500">
                                    建置中
                                  </span>
                                )}
                                <span className="text-[10px] font-black text-amber-700">點擊查看</span>
                              </div>
                            </div>
                          </button>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-2">
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(school.name)}`}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex-[2] py-2.5 px-2 rounded-xl border-2 border-slate-900 font-bold text-sm flex items-center justify-center gap-1.5 transition-all bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                            >
                              <MapPin className="w-4 h-4" /> 學校地圖
                            </a>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleComparison(school);
                              }}
                              className={`flex-[3] py-2.5 px-2 rounded-xl border-2 border-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                isCompared 
                                  ? 'bg-indigo-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:bg-indigo-500' 
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none'
                              }`}
                            >
                              {isCompared ? <Check className="w-4 h-4" /> : <List className="w-4 h-4" />}
                              {isCompared ? '已加入比較' : '加入比較'}
                            </button>
                          </div>
                        </div>
                      </div>
                      )})}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300">
                    <Search className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="text-xl font-black text-slate-500">目前沒有符合條件的推薦學校</p>
                  </div>
                );
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals Rendering */}
      <QRCodeModal 
        isOpen={activeModal === 'qrcode'} 
        onClose={() => setActiveModal(null)} 
        onScan={(code) => { updateForm('invitationCode', code); setActiveModal(null); }} 
      />
      
      {activeModal === 'mockVolunteer' && (
        <React.Suspense fallback={null}>
          <MockVolunteerModal isOpen onClose={() => setActiveModal(null)} region={formData.region} />
        </React.Suspense>
      )}

      <VocationalModal 
        isOpen={isVocationalOpen} 
        onClose={() => setIsVocationalOpen(false)}
        selectedGroups={vocationalGroups}
        onChange={setVocationalGroups}
        onOpenHollandTest={() => { window.location.href = withBasePath('/holland'); }}
      />

      {isHollandTestOpen && (
        <React.Suspense fallback={null}>
      <HollandTestModal 
        isOpen={isHollandTestOpen}
        onClose={() => setIsHollandTestOpen(false)}
        onComplete={(recommendedGroups) => {
          setVocationalGroups(recommendedGroups);
          updateForm('schoolType', '職業類科');
          setIsVocationalOpen(true);
        }}
        onViewEncyclopedia={() => {
          setIsHollandTestOpen(false);
          window.location.href = withBasePath('/vocational-encyclopedia');
        }}
      />
        </React.Suspense>
      )}

      <RegionModal 
        isOpen={isRegionOpen} 
        onClose={() => setIsRegionOpen(false)}
        selectedRegion={formData.region}
        onSelect={(region) => updateForm('region', region)} 
      />
      
      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        schools={comparisonSchools}
        onRemove={name => setComparisonSchools(prev => prev.filter(s => s.name !== name))}
        onClear={() => setComparisonSchools([])}
      />

      <HistoricalScoresModal
        school={historicalScoreSchool}
        onClose={() => setHistoricalScoreSchool(null)}
      />

      <ExportModal
        isOpen={activeModal === 'export'}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
      />

      <DisclaimerModal 
        isOpen={activeModal === 'disclaimer'} 
        onClose={() => {
          window.localStorage.setItem(DISCLAIMER_SEEN_KEY, 'true');
          setActiveModal(null);
        }}
      />

      <ReportErrorModal
        isOpen={activeModal === 'reportError'}
        onClose={() => setActiveModal(null)}
      />

      <InfoModal 
        isOpen={activeModal === 'importantDates'} 
        onClose={() => setActiveModal(null)}
        title="重要日程"
        icon={<Map className="w-8 h-8 text-purple-500" />}
      >
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-transform">
            <h3 className="font-black text-2xl mb-2 flex items-center gap-2 text-lime-400">
              <Sparkles className="w-6 h-6" /> 115 學年度
            </h3>
            <p className="text-slate-300 font-bold text-sm">國中教育會考重要時程表，請各位考生及家長密切留意。</p>
          </div>
          
          <div className="relative border-l-4 border-slate-900 ml-6 py-4 space-y-8">
            
            <div className="relative pl-8 group">
              <div className="absolute -left-[14px] top-4 w-6 h-6 bg-amber-400 border-4 border-slate-900 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              <div className="bg-white border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 border-2 border-slate-900 rounded-xl font-black text-sm mb-2">
                  03/05 ~ 03/07
                </div>
                <h4 className="font-black text-xl text-slate-900">國中會考報名</h4>
              </div>
            </div>

            <div className="relative pl-8 group">
              <div className="absolute -left-[14px] top-4 w-6 h-6 bg-slate-200 border-4 border-slate-900 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              <div className="bg-white border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                <div className="inline-block px-3 py-1 bg-slate-100 text-slate-800 border-2 border-slate-900 rounded-xl font-black text-sm mb-2">
                  04/10
                </div>
                <h4 className="font-black text-xl text-slate-900">寄發准考證</h4>
              </div>
            </div>

            <div className="relative pl-8 group">
              <div className="absolute -left-[14px] top-4 w-6 h-6 bg-purple-500 border-4 border-slate-900 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              <div className="bg-purple-100 border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <Award className="w-24 h-24 text-purple-900" />
                </div>
                <div className="inline-block px-3 py-1 bg-purple-500 text-white border-2 border-slate-900 rounded-xl font-black text-sm mb-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  05/16 ~ 05/17
                </div>
                <h4 className="font-black text-2xl text-purple-900">國中會考日期</h4>
              </div>
            </div>

            <div className="relative pl-8 group">
              <div className="absolute -left-[14px] top-4 w-6 h-6 bg-blue-500 border-4 border-slate-900 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              <div className="bg-blue-100 border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-10">
                  <ChartBar className="w-24 h-24 text-blue-900" />
                </div>
                <div className="inline-block px-3 py-1 bg-blue-500 text-white border-2 border-slate-900 rounded-xl font-black text-sm mb-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  06/05
                </div>
                <h4 className="font-black text-2xl text-blue-900">會考成績公布</h4>
              </div>
            </div>

            <div className="relative pl-8 group">
              <div className="absolute -left-[14px] top-4 w-6 h-6 bg-rose-500 border-4 border-slate-900 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              <div className="bg-white border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                <div className="inline-block px-3 py-1 bg-rose-100 text-rose-800 border-2 border-slate-900 rounded-xl font-black text-sm mb-2">
                  06/18
                </div>
                <h4 className="font-black text-xl text-slate-900">個人序位區間公告</h4>
              </div>
            </div>

            <div className="relative pl-8 group">
              <div className="absolute -left-[14px] top-4 w-6 h-6 bg-emerald-400 border-4 border-slate-900 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              <div className="bg-emerald-50 border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                <div className="inline-block px-3 py-1 bg-emerald-400 text-slate-900 border-2 border-slate-900 rounded-xl font-black text-sm mb-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  06/18 開始
                </div>
                <h4 className="font-black text-xl text-emerald-900">免試入學填志願</h4>
                <p className="text-xs font-bold text-slate-500 mt-1">（結束時間依各地區為主）</p>
              </div>
            </div>

            <div className="relative pl-8 group">
              <div className="absolute -left-[14px] top-4 w-6 h-6 bg-sky-400 border-4 border-slate-900 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              <div className="bg-sky-100 border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                <div className="inline-block px-3 py-1 bg-sky-400 text-slate-900 border-2 border-slate-900 rounded-xl font-black text-sm mb-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  07/07
                </div>
                <h4 className="font-black text-xl text-sky-900">免試入學放榜</h4>
                <p className="text-xs font-bold text-slate-500 mt-1">（放榜時間依各地區為主）</p>
              </div>
            </div>

            <div className="relative pl-8 group">
              <div className="absolute -left-[14px] top-4 w-6 h-6 bg-indigo-500 border-4 border-slate-900 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
              <div className="bg-indigo-100 border-4 border-slate-900 rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] group-hover:-translate-y-1 group-hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all">
                <div className="inline-block px-3 py-1 bg-indigo-500 text-white border-2 border-slate-900 rounded-xl font-black text-sm mb-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                  07/09
                </div>
                <h4 className="font-black text-xl text-indigo-900">免試入學報到</h4>
              </div>
            </div>

          </div>
        </div>
      </InfoModal>

      {activeModal === 'historicalStats' && (
        <React.Suspense fallback={null}>
          <HistoricalStatsModal isOpen onClose={() => setActiveModal(null)} />
        </React.Suspense>
      )}

      <ScoreInquiryModal 
        isOpen={activeModal === 'scoreInquiry'}
        onClose={() => setActiveModal(null)}
      />

      <DataProviderModal 
        isOpen={activeModal === 'dataProvider'}
        onClose={() => setActiveModal(null)}
      />

      <SharePlatformModal 
        isOpen={activeModal === 'sharePlatform'}
        onClose={() => setActiveModal(null)}
      />

      <RatingModal 
        isOpen={activeModal === 'rating'} 
        onClose={() => setActiveModal(null)}
      />

      {isNavMenuOpen && (
        <React.Suspense fallback={null}>
          <NavigationDrawer isOpen onClose={() => setIsNavMenuOpen(false)} setActiveModal={setActiveModal} />
        </React.Suspense>
      )}

      {/* Navigation Drawer */}
      <AnimatePresence>
        {false && isNavMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNavMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[380px] max-w-full border-l-4 border-slate-900 bg-slate-50 shadow-[-8px_0px_0px_0px_rgba(15,23,42,0.1)] z-[110] flex flex-col overflow-hidden"
            >
              <div className="p-5 bg-amber-400 border-b-4 border-slate-900 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <Menu className="w-6 h-6 text-slate-900" />
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">主選單</h2>
                </div>
                <button
                  onClick={() => setIsNavMenuOpen(false)}
                  className="w-10 h-10 bg-white flex items-center justify-center border-4 border-slate-900 rounded-xl hover:bg-slate-100 transition shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
                >
                  <X className="w-6 h-6 text-slate-900" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                
                {/* 學校與科系探索 */}
                <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                  <button 
                    onClick={() => setExpandedNavCategory(prev => prev === 'schoolDetails' ? null : 'schoolDetails')}
                    className="w-full flex items-center justify-between p-4 bg-sky-50 outline-none hover:bg-sky-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-sky-200 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                        <Compass className="w-5 h-5 text-sky-700" />
                      </div>
                      <span className="font-black text-slate-900 text-lg">學校與科系探索</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-900 transition-transform ${expandedNavCategory === 'schoolDetails' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {expandedNavCategory === 'schoolDetails' && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t-4 border-slate-900 bg-white">
                        <div className="p-3 flex flex-col gap-2">
                            <button
                              onClick={() => { window.location.href = withBasePath('/holland'); }}
                              className="w-full text-left px-4 py-3.5 rounded-xl border-2 border-transparent hover:border-slate-900 hover:bg-slate-50 flex items-center justify-between group active:scale-95 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-purple-100 border-2 border-slate-900 rounded-lg">
                                  <Brain className="w-5 h-5 text-purple-600" />
                                </div>
                                <span className="font-bold text-slate-900">荷倫碼性向測驗</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                            </button>
                            <button
                              onClick={() => { window.location.href = withBasePath('/vocational-encyclopedia'); }}
                              className="w-full text-left px-4 py-3.5 rounded-xl border-2 border-transparent hover:border-slate-900 hover:bg-slate-50 flex items-center justify-between group active:scale-95 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-emerald-100 border-2 border-slate-900 rounded-lg">
                                  <BookOpen className="w-5 h-5 text-emerald-600" />
                                </div>
                                <span className="font-bold text-slate-900">職群科系百科</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                            </button>
                            <button
                              onClick={() => { window.location.href = withBasePath('/school-types'); }}
                              className="w-full text-left px-4 py-3.5 rounded-xl border-2 border-transparent hover:border-slate-900 hover:bg-slate-50 flex items-center justify-between group active:scale-95 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-sky-100 border-2 border-slate-900 rounded-lg">
                                  <Building2 className="w-5 h-5 text-sky-600" />
                                </div>
                                <span className="font-bold text-slate-900">學校類型解析</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 志願選填與落點 */}
                <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                  <button 
                    onClick={() => setExpandedNavCategory(prev => prev === 'strategy' ? null : 'strategy')}
                    className="w-full flex items-center justify-between p-4 bg-amber-50 outline-none hover:bg-amber-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-200 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                        <Target className="w-5 h-5 text-amber-700" />
                      </div>
                      <span className="font-black text-slate-900 text-lg">志願選填與落點</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-900 transition-transform ${expandedNavCategory === 'strategy' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {expandedNavCategory === 'strategy' && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t-4 border-slate-900 bg-white">
                        <div className="p-3 flex flex-col gap-2">
                          {[
                            { id: 'mockVolunteer', icon: Target, label: '模擬志願選填', color: 'text-sky-600', bg: 'bg-sky-100' },
                            { id: 'strategy', icon: Target, label: '志願選填攻略', color: 'text-amber-600', bg: 'bg-amber-100' },
                            { id: 'gradeLevel', icon: Award, label: '等級對照表', color: 'text-rose-600', bg: 'bg-rose-100' },
                            { id: 'historicalStats', icon: ChartBar, label: '歷年會考統計', color: 'text-indigo-600', bg: 'bg-indigo-100' },
                            { id: 'importantDates', icon: Map, label: '重要日程', color: 'text-purple-600', bg: 'bg-purple-100' },
                            { id: 'disclaimer', icon: Shield, label: '免責聲明', color: 'text-slate-600', bg: 'bg-slate-100' }
                          ].map(btn => (
                            <button
                              key={btn.id}
                              onClick={() => {
                                if (btn.id === 'privacy' || btn.id === 'terms' || btn.id === 'changelog' || btn.id === 'advantages' || btn.id === 'instructions' || btn.id === 'historicalStats' || btn.id === 'gradeLevel' || btn.id === 'mockVolunteer' || btn.id === 'importantDates' || btn.id === 'strategy') {
                                  window.location.href = withBasePath(btn.id === 'historicalStats' ? '/historical-stats' : btn.id === 'gradeLevel' ? '/grade-level' : btn.id === 'mockVolunteer' ? '/mock-volunteer' : btn.id === 'importantDates' ? '/important-dates' : `/${btn.id}`);
                                  return;
                                }
                                setActiveModal(btn.id as any);
                                setIsNavMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-3.5 rounded-xl border-2 border-transparent hover:border-slate-900 hover:bg-slate-50 flex items-center justify-between group active:scale-95 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg border-2 border-slate-900 ${btn.bg}`}>
                                  <btn.icon className={`w-5 h-5 ${btn.color}`} />
                                </div>
                                <span className="font-bold text-slate-900">{btn.label}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 系統指南與回饋 */}
                <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                  <button 
                    onClick={() => setExpandedNavCategory(prev => prev === 'systemGuide' ? null : 'systemGuide')}
                    className="w-full flex items-center justify-between p-4 bg-indigo-50 outline-none hover:bg-indigo-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-200 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                        <Sparkles className="w-5 h-5 text-indigo-700" />
                      </div>
                      <span className="font-black text-slate-900 text-lg">系統指南與回饋</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-900 transition-transform ${expandedNavCategory === 'systemGuide' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {expandedNavCategory === 'systemGuide' && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t-4 border-slate-900 bg-white">
                        <div className="p-3 flex flex-col gap-2">
                          {[
                            { id: 'instructions', icon: Info, label: '使用說明', color: 'text-blue-600', bg: 'bg-blue-100' },
                            { id: 'advantages', icon: Sparkles, label: '系統優點與關於我們', color: 'text-indigo-600', bg: 'bg-indigo-100' },
                            { id: 'site-map', icon: Map, label: '網站地圖', color: 'text-amber-600', bg: 'bg-amber-100' },
                            { id: 'rating', icon: StarIcon, label: '評分系統', color: 'text-amber-500', bg: 'bg-amber-100' },
                            { id: 'changelog', icon: History, label: '更新日誌', color: 'text-slate-500', bg: 'bg-slate-100' },
                            { id: 'privacy', icon: Database, label: '隱私權政策', color: 'text-emerald-600', bg: 'bg-emerald-100' },
                            { id: 'terms', icon: Shield, label: '服務條款', color: 'text-slate-600', bg: 'bg-slate-100' },
                            { id: 'reportError', icon: AlertCircle, label: '錯誤回報', color: 'text-red-500', bg: 'bg-red-100' }
                          ].map(btn => (
                            <button
                              key={btn.id}
                              onClick={() => {
                                if (btn.id === 'privacy' || btn.id === 'terms' || btn.id === 'changelog' || btn.id === 'advantages' || btn.id === 'instructions' || btn.id === 'site-map') {
                                  window.location.href = withBasePath(`/${btn.id}`);
                                  return;
                                }
                                setActiveModal(btn.id as any);
                                setIsNavMenuOpen(false);
                              }}
                              className="w-full text-left px-4 py-3.5 rounded-xl border-2 border-transparent hover:border-slate-900 hover:bg-slate-50 flex items-center justify-between group active:scale-95 transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg border-2 border-slate-900 ${btn.bg}`}>
                                  <btn.icon className={`w-5 h-5 ${btn.color}`} />
                                </div>
                                <span className="font-bold text-slate-900">{btn.label}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 外部資源 */}
                <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                  <button 
                    onClick={() => setExpandedNavCategory(prev => prev === 'externalLinks' ? null : 'externalLinks')}
                     className="w-full flex items-center justify-between p-4 bg-emerald-50 outline-none hover:bg-emerald-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-200 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                        <LinkIcon className="w-5 h-5 text-emerald-700" />
                      </div>
                      <span className="font-black text-slate-900 text-lg">外部資源與分享</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-900 transition-transform ${expandedNavCategory === 'externalLinks' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {expandedNavCategory === 'externalLinks' && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t-4 border-slate-900 bg-white">
                        <div className="p-3 flex flex-col gap-2">
                          {[
                            { type: 'modal', id: 'scoreInquiry', icon: Search, label: '會考成績查詢', color: 'text-fuchsia-600', bg: 'bg-fuchsia-100' },
                            { type: 'link', href: 'https://tyctw.github.io/volunteer/', icon: ChartBar, label: '序位查詢', color: 'text-orange-600', bg: 'bg-orange-100' },
                            { type: 'link', href: 'https://tyctw.github.io/shared/', icon: Library, label: '全國錄取分享', color: 'text-indigo-600', bg: 'bg-indigo-100' },
                            { type: 'link', href: 'https://tyctw.github.io/score/', icon: List, label: '全國序位分享', color: 'text-emerald-600', bg: 'bg-emerald-100' }
                          ].map(link => (
                            link.type === 'link' ? (
                              <a 
                                key={link.label}
                                href={link.href} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-transparent hover:border-slate-900 hover:bg-slate-50 group active:scale-95 transition-all"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-1.5 rounded-lg border-2 border-slate-900 ${link.bg}`}>
                                    <link.icon className={`w-4 h-4 ${link.color}`} />
                                  </div>
                                  <span className="font-bold text-slate-900">{link.label}</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 -rotate-45 group-hover:rotate-0 transition-transform" />
                              </a>
                            ) : (
                              <button 
                                key={link.label}
                                onClick={() => {
                                  setActiveModal(link.id as any);
                                  setIsNavMenuOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 border-transparent hover:border-slate-900 hover:bg-slate-50 group active:scale-95 transition-all outline-none"
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`p-1.5 rounded-lg border-2 border-slate-900 ${link.bg}`}>
                                    <link.icon className={`w-4 h-4 ${link.color}`} />
                                  </div>
                                  <span className="font-bold text-slate-900">{link.label}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                              </button>
                            )
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="bg-white rounded-2xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-4 flex justify-center gap-4">
                  <a href="https://www.instagram.com/115.rcpet/" target="_blank" rel="noreferrer" className="flex items-center gap-2 group outline-none">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 border-2 border-slate-900 flex items-center justify-center group-hover:bg-pink-100 group-hover:scale-110 active:scale-95 transition-all text-pink-600 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                      <Instagram className="w-5 h-5 group-hover:-rotate-6 transition-transform group-hover:rotate-0" />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">Instagram</span>
                  </a>
                  <div className="w-0.5 h-10 bg-slate-200 rounded-full mx-2"></div>
                  <a href="https://www.threads.com/@115.rcpet" target="_blank" rel="noreferrer" className="flex items-center gap-2 group outline-none">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border-2 border-slate-900 flex items-center justify-center group-hover:bg-slate-100 group-hover:scale-110 active:scale-95 transition-all text-slate-700 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                      <AtSign className="w-5 h-5 group-hover:rotate-6 transition-transform group-hover:rotate-0" />
                    </div>
                    <span className="font-bold text-slate-700 text-sm">Threads</span>
                  </a>
                </div>

              </div>
              <div className="p-4 bg-slate-900 border-t-4 border-slate-900 text-center">
                <p className="text-slate-400 font-bold text-xs flex items-center justify-center gap-1">
                  <Check className="w-3 h-3 text-emerald-400" />
                  會考落點分析系統 v5.0
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AuthFailModal 
        isOpen={activeModal === 'authFail'}
        onClose={() => setActiveModal(null)}
      />

      <RegionScoringModal
        isOpen={activeModal === 'scoringMethod'}
        onClose={() => setActiveModal(null)}
        selectedRegion={formData.region}
      />

      <InfoModal 
        isOpen={activeModal === 'validationFailed'} 
        onClose={() => setActiveModal(null)}
        bare
        title="資料不齊全"
        icon={<AlertCircle className="w-8 h-8 text-rose-500" />}
      >
        <div className="space-y-5 text-left">
          <div className="relative overflow-hidden rounded-3xl border-4 border-slate-900 bg-rose-50 p-4 text-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] sm:p-6">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full border-4 border-rose-200 bg-rose-100" />
            <div className="pointer-events-none absolute -bottom-12 -left-12 h-28 w-28 rounded-full border-4 border-amber-200 bg-amber-100" />
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              aria-label="關閉資料不齊全提示"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 hover:bg-rose-100 hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative z-10 flex items-start gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-4 border-slate-900 bg-rose-400 text-xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:h-14 sm:w-14 sm:text-2xl">!</div>
              <div>
                <div className="hidden text-xs font-black tracking-[0.16em] text-rose-700 sm:block">ACTION REQUIRED</div>
                <p className="text-lg font-black text-slate-900 sm:mt-1 sm:text-xl">還有 {missingFields.length} 個資料待填寫</p>
                <p className="mt-0.5 text-xs font-bold leading-relaxed text-slate-600 sm:mt-1 sm:text-sm">點選項目即可直接前往填寫。</p>
              </div>
            </div>
            <div className="relative z-10 mt-3 border-t-2 border-dashed border-rose-200 pt-3 sm:mt-5 sm:pt-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-sm font-black text-slate-900">待補資料</span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-rose-600 ring-1 ring-rose-200">可直接跳轉</span>
              </div>
            </div>
            <div className="relative z-10 w-16 h-16 bg-white border-4 border-slate-900 rounded-2xl flex items-center justify-center -rotate-6 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hidden">
              <span className="text-3xl">⚠️</span>
            </div>
            <div className="relative z-10 [&>p]:hidden">
              <p className="text-lg font-black mb-2">請填寫完整的資訊</p>
              <p className="text-sm font-bold text-slate-600 mb-4">系統需要完整的資料才能為您進行最準確的落點分析運算。</p>
              <div className="relative z-10 grid grid-cols-2 gap-2">
                {missingFields.map((field, index) => (
                  <button
                    type="button"
                    key={index}
                    onClick={() => focusMissingField(field)}
                    className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl border-2 border-slate-900 bg-white px-2 py-1.5 text-xs font-black text-rose-600 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 hover:bg-rose-100 hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none sm:min-h-11 sm:px-3 sm:py-2 sm:text-sm"
                    title={`前往填寫${field}`}
                  >
                    {field}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setActiveModal(null)}
              className="relative z-10 mt-3 inline-flex w-full items-center justify-center rounded-xl border-2 border-slate-900 bg-slate-900 px-8 py-2.5 text-sm font-black text-white shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] transition-all hover:bg-slate-800 active:translate-y-1 active:shadow-none sm:mt-5 sm:py-3"
            >
              我知道了，繼續填寫
            </button>
          </div>
        </div>
      </InfoModal>

      <Footer />

    </div>
  );
}

// Dummy icon components since lucide-react exports specific names and I want to cover fallback safety
const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
)

const PieChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
  </svg>
)
