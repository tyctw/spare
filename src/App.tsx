import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, User, BookOpen, Calculator, Award, PenTool,
  Search, Building2, Map, Compass, Anchor, Cpu,
  Mountain, Sparkles, AlertCircle, ChevronRight, ChevronDown,
  Library, ArrowRight, Activity, KeyRound, Info, Shield, History, ChartBar, Download, List, QrCode, Check, Menu, X, Filter, Share2, Mail, Link as LinkIcon,
  Target, Lightbulb, Flame, ShieldCheck, Layers, Brain, Copyright, Database, Instagram, AtSign
} from 'lucide-react';
import VocationalModal from './components/VocationalModal';
import VocationalEncyclopediaModal from './components/VocationalEncyclopediaModal';
import HollandTestModal from './components/HollandTestModal';
import { InfoModal } from './components/InfoModals';
import ChangelogModal from './components/ChangelogModal';
import DisclaimerModal from './components/DisclaimerModal';
import ComparisonModal from './components/ComparisonModal';
import QRCodeModal from './components/QRCodeModal';
import MockVolunteerModal from './components/MockVolunteerModal';
import CyberAuthOverlay from './components/CyberAuthOverlay';
import QuantumLoadingOverlay from './components/QuantumLoadingOverlay';
import { exportTxt, exportExcel, exportJson, printResults } from './lib/exportUtils';
import RegionModal, { ALL_REGIONS } from './components/RegionModal';
import ExportModal from './components/ExportModal';
import GradeLevelModal from './components/GradeLevelModal';
import AuthFailModal from './components/AuthFailModal';
import RegionScoringModal from './components/RegionScoringModal';
import SharePlatformModal from './components/SharePlatformModal';
import RatingModal from './components/RatingModal';
import AdvantagesModal from './components/AdvantagesModal';
import InstructionsModal from './components/InstructionsModal';
import ReportErrorModal from './components/ReportErrorModal';
import SchoolTypesModal from './components/SchoolTypesModal';
import StrategyModal from './components/StrategyModal';
import PrivacyModal from './components/PrivacyModal';
import TermsModal from './components/TermsModal';
import HistoricalStatsModal from './components/HistoricalStatsModal';
import ScoreInquiryModal from './components/ScoreInquiryModal';
import DataProviderModal from './components/DataProviderModal';

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
const [activeModal, setActiveModal] = useState<'instructions' | 'disclaimer' | 'changelog' | 'gradeLevel' | 'importantDates' | 'qrcode' | 'rating' | 'authFail' | 'validationFailed' | 'export' | 'scoringMethod' | 'sharePlatform' | 'advantages' | 'reportError' | 'schoolTypes' | 'strategy' | 'terms' | 'privacy' | 'mockVolunteer' | 'historicalStats' | 'scoreInquiry' | 'dataProvider' | null>(null);
  const [isVocationalOpen, setIsVocationalOpen] = useState(false);
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  const [isHollandTestOpen, setIsHollandTestOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [vocationalGroups, setVocationalGroups] = useState<string[]>(['all']);
  const [isExternalLinksOpen, setIsExternalLinksOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [expandedNavCategory, setExpandedNavCategory] = useState<string | null>('schoolDetails');
  
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
    setActiveModal('disclaimer');

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code') || params.get('invitationCode') || params.get('invite');
    if (code) {
      setFormData(prev => ({ ...prev, invitationCode: code }));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Check if user has entered data
      const hasData = results !== null || 
                      formData.chinese !== '' ||
                      formData.english !== '' ||
                      formData.math !== '' ||
                      formData.science !== '' ||
                      formData.social !== '' ||
                      formData.composition !== '';
      
      if (hasData) {
        e.preventDefault();
        // The dialog message can't be customized in modern browsers, 
        // but returning a string activates the standard warning.
        e.returnValue = ''; 
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, results]);

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleAnalyze = async () => {
    const missing: string[] = [];
    if (!formData.invitationCode) missing.push('系統授權碼');
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
    
    // Check if 10min cached auth exists
    const lastAuthSuccess = localStorage.getItem('lastInvitationAuthSuccess');
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    
    // Always call executeAnalysis since it runs async. 
    if (lastAuthSuccess && (now - parseInt(lastAuthSuccess) < tenMinutes)) {
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
        invitationCode: formData.invitationCode,
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

      const res = await fetch('https://script.google.com/macros/s/AKfycbwGbahUGJP18GWmkPsTF9KbNG-KSu26lgAHOXoSIk3y2DEbuhAM_la3-DwkDDQghM-j/exec', {
        method: 'POST',
        // use no-cors to avoid CORS preflight, but in this specific environment JSON stringify body might work or fail. 
        // Typically Google Apps Script requires text/plain fetch for simple requests
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      setResults(data);
      
      // Delay status change to allow Quantum overlay to finish
      // QuantumLoadingOverlay handles it internally calling onComplete which will set status to success
    } catch (e: any) {
      setStatus('error');
      setErrorMessage('分析過程中發生錯誤，這可能是由於 CORS 或網路連線問題。');
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

  const handleExport = (type: 'txt' | 'excel' | 'json' | 'print') => {
    if (!results) return;
    const regionName = ALL_REGIONS.find(r => r.id === formData.region)?.name || '未選擇';
    const payload = { scores: formData, results, identity: formData.identity, vocationalGroups };
    switch (type) {
      case 'txt': exportTxt(payload, regionName); break;
      case 'excel': exportExcel(payload, regionName); break;
      case 'json': exportJson(payload); break;
      case 'print': printResults(payload, regionName); break;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 pb-32 overflow-hidden relative">
      
      {/* Modern Background Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-300/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-sky-300/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Dynamic Header */}
      <div className={`fixed top-0 left-0 right-0 z-50 pointer-events-none transition-all duration-300 ${isScrolled ? 'p-2 sm:p-2' : 'p-4 sm:p-6'}`}>
        <div className="max-w-6xl mx-auto pointer-events-auto">
          <header className={`bg-white/90 backdrop-blur-md rounded-3xl flex items-center justify-between transition-all duration-300 will-change-transform ${isScrolled ? 'border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] p-2 sm:p-3' : 'border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] p-3 sm:p-4 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(15,23,42,1)]'}`}>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`bg-indigo-600 border-slate-900 flex items-center justify-center text-white font-black text-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-6 transform origin-bottom-left hover:rotate-0 transition-all ${isScrolled ? 'w-10 h-10 sm:w-10 sm:h-10 rounded-xl border-2 sm:text-xl' : 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-4 sm:text-3xl'}`}>
                會
              </div>
              <div className="flex flex-col">
                <h1 className={`font-black text-slate-900 tracking-tight leading-none uppercase transition-all ${isScrolled ? 'text-lg sm:text-xl' : 'text-xl sm:text-3xl'}`}>會考落點分析</h1>
                <span className={`font-bold text-slate-500 hidden sm:block mt-1 transition-all ${isScrolled ? 'text-[10px] sm:text-[10px] h-0 opacity-0 overflow-hidden' : 'text-[10px] sm:text-xs h-auto opacity-100'}`}>115 年最新各區數據分析平台</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="https://tyctw.github.io/form/"
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-center gap-2 bg-amber-400 text-slate-900 border-slate-900 font-black transition hover:bg-amber-300 active:translate-y-1 active:shadow-none ${isScrolled ? 'px-3 h-10 sm:h-10 rounded-xl border-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'px-4 sm:px-5 h-12 sm:h-14 rounded-xl sm:rounded-2xl border-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'}`}
              >
                <KeyRound className={`text-slate-900 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
                <span className={`hidden md:inline uppercase tracking-wide ${isScrolled ? 'text-xs' : ''}`}>取得邀請碼</span>
              </a>
              <button
                onClick={() => setActiveModal('sharePlatform')}
                className={`bg-emerald-200 flex items-center justify-center border-slate-900 transition hover:bg-emerald-300 active:translate-y-1 active:shadow-none ${isScrolled ? 'w-10 h-10 sm:w-10 sm:h-10 rounded-xl border-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'}`}
              >
                <Share2 className={`text-slate-900 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
              </button>
              <button
                onClick={() => setIsNavMenuOpen(true)}
                className={`bg-sky-200 flex items-center justify-center border-slate-900 transition hover:bg-sky-300 active:translate-y-1 active:shadow-none ${isScrolled ? 'w-10 h-10 sm:w-10 sm:h-10 rounded-xl border-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' : 'w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl border-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'}`}
              >
                <Menu className={`text-slate-900 ${isScrolled ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'}`} />
              </button>
            </div>
          </header>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 mt-32 sm:mt-40 space-y-8 relative z-10">
        
        {/* NEW HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="pt-8 pb-12 sm:pt-12 sm:pb-16 flex flex-col items-center justify-center text-center px-2"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-black rounded-full mb-8 border-2 border-indigo-200 shadow-sm"
          >
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <span className="tracking-wide">115學年度最新版上線</span>
          </motion.div>
          
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
            探索適合你的<br className="sm:hidden" />
            <span className="relative inline-block mt-2 sm:mt-0">
               <span className="relative z-10 text-indigo-600">未來理想校系</span>
               <span className="absolute bottom-1 sm:bottom-2 left-0 w-full h-4 sm:h-6 bg-amber-300 -z-10 -rotate-1 rounded-sm"></span>
            </span>
          </h2>
          
          <p className="text-slate-600 font-bold text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            我們致力於提供最精準的會考落點資訊，幫助每一位國中生發掘潛能，探索最適合的高中職校與職群發展方向。
          </p>
        </motion.div>

        {/* Announcement Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-indigo-100 border-4 border-slate-900 rounded-[2rem] p-5 sm:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
            <Info className="w-32 h-32 text-indigo-900" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row gap-5 items-start md:items-center">
            <div className="w-14 h-14 bg-indigo-500 text-white rounded-2xl border-4 border-slate-900 flex flex-shrink-0 items-center justify-center shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-6 hover:rotate-0 transition-transform">
               <Info className="w-7 h-7" />
            </div>
            <div className="flex-1">
               <h3 className="font-black text-xl text-slate-900 mb-1.5 flex items-center gap-2">
                 系統公告 <span className="bg-rose-500 text-white text-[10px] uppercase px-2 py-1 rounded-full animate-pulse border-2 border-slate-900">HOT</span>
               </h3>
               <p className="font-bold text-slate-700 text-sm sm:text-base leading-relaxed">
                 115 學年度最新落點資料將於「公布個人序位區間」後進行全面更新。<br className="hidden lg:block"/>
                 <span className="text-indigo-800">歡迎各高中職校方、補教機構與我們聯繫，提供歷年錄取數據並申請專屬邀請碼！</span>
               </p>
            </div>
            <button onClick={() => setActiveModal('dataProvider')} className="w-full md:w-auto text-center px-6 py-3 bg-white border-4 border-slate-900 font-black text-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all whitespace-nowrap">
              提供歷屆數據
            </button>
          </div>
        </motion.div>

        {errorMessage && (
          <div className="p-4 bg-red-50 text-red-700 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] font-bold flex items-center gap-3">
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
              <div className="mb-4 p-3 bg-amber-100/80 border-2 border-amber-400 rounded-xl relative z-10 overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none"></div>
                {(() => {
                  const now = new Date();
                  const start = new Date('2026-06-18T00:00:00+08:00');
                  const end = new Date('2026-06-30T23:59:59+08:00');
                  const isDuringInterval = now >= start && now <= end;
                  
                  if (isDuringInterval) {
                    return (
                      <>
                        <h3 className="text-sm font-black text-amber-900 flex items-center gap-1.5 mb-1.5">
                          <span className="text-lg">📢</span> 期間邀請碼
                        </h3>
                        <p className="text-xs font-bold text-amber-800 leading-relaxed">
                          需填寫序位分享才可獲取邀請碼：<br />
                          <a href="https://tyctw.github.io/form/" target="_blank" rel="noopener noreferrer" className="inline-block mt-1 text-indigo-700 bg-white px-2 py-1 rounded border-2 border-indigo-200 shadow-[2px_2px_0px_rgba(199,210,254,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(199,210,254,1)] active:translate-y-0 active:shadow-none transition-all">
                            https://tyctw.github.io/form/
                          </a>
                        </p>
                      </>
                    );
                  }
                  
                  return (
                    <>
                      <h3 className="text-sm font-black text-amber-900 flex items-center gap-1.5 mb-1.5">
                        <span className="text-lg">📢</span> 限時公告
                      </h3>
                      <p className="text-xs font-bold text-amber-800 leading-relaxed">
                        慶祝上線！即日起至 <span className="inline-block bg-amber-200 text-amber-900 px-1 py-0.5 rounded font-black border border-amber-300/50">2026/06/17</span> 前，提供限時免費體驗。<br className="hidden sm:block" />
                        請於下方輸入邀請碼 <span className="inline-block bg-white text-indigo-700 font-mono text-sm px-1.5 py-0.5 rounded border-2 border-indigo-200 shadow-[2px_2px_0px_rgba(199,210,254,1)] mx-0.5 select-all">TYCTW</span> 即可一鍵解鎖所有進階功能。
                      </p>
                    </>
                  );
                })()}
              </div>
              
              <div className="flex gap-2 relative z-10">
                <input
                  type="text"
                  placeholder="請輸入您的邀請碼"
                  value={formData.invitationCode}
                  onChange={(e) => updateForm('invitationCode', e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white border-2 border-slate-900 focus:outline-none focus:ring-4 focus:ring-amber-400/30 transition-all font-black text-slate-900 shadow-[inset_2px_2px_0px_rgba(0,0,0,0.05)] placeholder-slate-400 tracking-wide"
                />
                <button 
                  onClick={() => setActiveModal('qrcode')}
                  className="px-4 py-3 bg-slate-900 text-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(251,191,36,1)] hover:bg-slate-800 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center group"
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
                      key={opt.id}
                      onClick={() => updateForm('identity', opt.id)}
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
                  <label className="text-sm font-black text-slate-900 flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 border border-slate-900 inline-block"></span>
                    偏好學校屬性
                  </label>
                  <div className="relative">
                    <select
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
                    <label className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 border border-slate-900 inline-block"></span>
                      偏好學校類型
                    </label>
                    <button 
                      onClick={() => setActiveModal('schoolTypes')}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <Building2 className="w-3 h-3" />
                      學校類型解析說明
                    </button>
                  </div>
                  <div className="relative">
                    <select
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
                        onClick={() => setIsEncyclopediaOpen(true)}
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
                    onClick={() => setIsRegionOpen(true)}
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
                  { id: 'english', label: '英文', icon: PenTool, color: 'text-amber-600', bgBorder: 'bg-amber-50 border-amber-300 focus:ring-amber-400 focus:border-amber-400 hover:border-amber-400', theme: 'bg-white' },
                  { id: 'math', label: '數學', icon: Calculator, color: 'text-blue-600', bgBorder: 'bg-blue-50 border-blue-300 focus:ring-blue-400 focus:border-blue-400 hover:border-blue-400', theme: 'bg-white' },
                  { id: 'science', label: '自然', icon: Activity, color: 'text-emerald-600', bgBorder: 'bg-emerald-50 border-emerald-300 focus:ring-emerald-400 focus:border-emerald-400 hover:border-emerald-400', theme: 'bg-white' },
                  { id: 'social', label: '社會', icon: Map, color: 'text-purple-600', bgBorder: 'bg-purple-50 border-purple-300 focus:ring-purple-400 focus:border-purple-400 hover:border-purple-400', theme: 'bg-white' }
                ].map(subject => (
                  <div key={subject.id} className={`relative group ${subject.theme} border-2 border-slate-900 rounded-2xl p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center justify-between gap-4`}>
                    <label className="text-base sm:text-lg font-black text-slate-700 flex items-center gap-3 w-24 shrink-0">
                      <div className={`w-10 h-10 rounded-xl border-2 border-slate-900 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] bg-slate-50`}>
                        <subject.icon className={`w-5 h-5 ${subject.color}`} />
                      </div>
                      {subject.label}
                    </label>
                    <div className="relative w-full max-w-[200px]">
                      <select
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 font-black text-base sm:text-lg appearance-none outline-none focus:outline-none focus:ring-4 transition-all cursor-pointer ${subject.bgBorder}`}
                        value={(formData as any)[subject.id]}
                        onChange={(e) => updateForm(subject.id, e.target.value)}
                      >
                        <option value="" disabled>-- 選擇等級 --</option>
                        {gradeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                      <ChevronRight className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none rotate-90" />
                    </div>
                  </div>
                ))}

                {/* Composition */}
                <div className="relative group bg-slate-900 border-2 border-slate-900 rounded-2xl p-3 sm:p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all flex items-center justify-between gap-4">
                  <label className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-3 w-24 shrink-0">
                    <div className="w-10 h-10 rounded-xl border-2 border-amber-400/50 flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(251,191,36,0.2)] bg-slate-800">
                      <PenTool className="w-5 h-5 text-amber-400" />
                    </div>
                    寫作
                  </label>
                  <div className="relative w-full max-w-[200px]">
                    <select
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border-2 border-slate-700 bg-slate-800 text-amber-400 font-black text-base sm:text-lg appearance-none outline-none focus:outline-none focus:ring-4 focus:ring-amber-400/50 hover:border-amber-500/50 transition-all cursor-pointer"
                      value={formData.composition}
                      onChange={(e) => updateForm('composition', e.target.value)}
                    >
                      <option value="" disabled>-- 選擇級分 --</option>
                      {[6, 5, 4, 3, 2, 1, 0].map(s => <option key={s} value={s}>{s} 級分</option>)}
                    </select>
                    <ChevronRight className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500/50 pointer-events-none rotate-90" />
                  </div>
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
            onClick={handleAnalyze}
            disabled={status === 'auth' || status === 'quantum'}
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
          localStorage.setItem('lastInvitationAuthSuccess', Date.now().toString());
          setStatus('quantum');
          executeAnalysis();
        }}
        onFail={() => {
          setStatus('idle');
          setActiveModal('authFail');
        }}
      />

      <QuantumLoadingOverlay 
        isOpen={status === 'quantum'}
        onComplete={() => {
          setStatus('success');
          setTimeout(() => {
            document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }}
      />

      {/* Results Section */}
      <AnimatePresence>
        {status === 'success' && results && (
          <motion.div 
            id="results-section"
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
                          onClick={() => setActiveModal('strategy')}
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

              <div className="lg:col-span-4 flex flex-col gap-4">
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
                    <button onClick={() => setActiveModal('mockVolunteer')} className="px-3 py-1.5 bg-sky-50 text-sky-700 font-bold text-xs rounded-lg border-2 border-slate-900 flex items-center gap-1 hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none">
                      <Target className="w-4 h-4" /> 模擬選填
                    </button>
                    <button onClick={() => setIsComparisonOpen(true)} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg border-2 border-slate-900 flex items-center gap-1 hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none">
                      <List className="w-4 h-4" /> 比較清單 ({comparisonSchools.length})
                    </button>
                    <button onClick={() => setActiveModal('export')} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-lg border-2 border-slate-900 flex items-center gap-1 hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none">
                      <Download className="w-4 h-4" /> 匯出報告
                    </button>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-4 bg-slate-50 p-3 rounded-2xl border-2 border-slate-200">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="搜尋學校、科別關鍵字..." 
                      value={resultFilterText}
                      onChange={e => setResultFilterText(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border-2 border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 placeholder:text-slate-400 transition-all"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select 
                      value={resultFilterZone} 
                      onChange={e => setResultFilterZone(e.target.value)}
                      className="flex-1 sm:flex-none px-3 py-2 bg-white rounded-xl border-2 border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900"
                    >
                      <option value="all">落點區間不拘</option>
                      <option value="reach">夢幻區</option>
                      <option value="target">實際區</option>
                      <option value="safe">保守區</option>
                    </select>
                    <select 
                      value={resultFilterOwnership} 
                      onChange={e => setResultFilterOwnership(e.target.value)}
                      className="flex-1 sm:flex-none px-3 py-2 bg-white rounded-xl border-2 border-slate-200 text-sm font-bold focus:outline-none focus:border-slate-900"
                    >
                      <option value="all">公私立不拘</option>
                      <option value="public">公立</option>
                      <option value="private">私立</option>
                    </select>
                    <select 
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
                  const filteredSchools = (results.eligibleSchools || []).filter((school: any) => {
                    const matchText = !resultFilterText || 
                      school.name?.includes(resultFilterText) || 
                      school.type?.includes(resultFilterText) || 
                      school.group?.includes(resultFilterText);
                    const matchZone = resultFilterZone === 'all' || school.zone === resultFilterZone;
                    const matchOwnership = resultFilterOwnership === 'all' || school.ownership === resultFilterOwnership;
                    const matchType = resultFilterType === 'all' || 
                      (resultFilterType === '普通科' && school.type === '普通科') || 
                      (resultFilterType === '職業類科' && school.type !== '普通科');
                    return matchText && matchZone && matchOwnership && matchType;
                  });

                  return filteredSchools.length > 0 ? (
                    <div className="flex-1 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4">
                      {filteredSchools.map((school: any, i: number) => {
                        const isCompared = !!comparisonSchools.find(s => s.name === school.name);

                      
                      const userScore = results.totalPoints ? parseFloat(results.totalPoints) : 0;
                      let numDiff: number | null = null;
                      
                      if (school.scoreDiff !== undefined && school.scoreDiff !== null && school.scoreDiff !== '') {
                        numDiff = parseFloat(school.scoreDiff);
                      } else if (school.pointsDiff !== undefined && school.pointsDiff !== null && school.pointsDiff !== '') {
                        numDiff = parseFloat(school.pointsDiff);
                      } else if (school.diff !== undefined && school.diff !== null && school.diff !== '') {
                        numDiff = parseFloat(school.diff);
                      } else if (school.points !== undefined && school.points !== null && school.points !== '') {
                        numDiff = parseFloat((userScore - parseFloat(school.points)).toFixed(2));
                      } else if (school.minScore !== undefined && !isNaN(parseFloat(school.minScore))) {
                        numDiff = parseFloat((userScore - parseFloat(school.minScore)).toFixed(2));
                      } else if (school.score !== undefined && !isNaN(parseFloat(school.score))) {
                        numDiff = parseFloat((userScore - parseFloat(school.score)).toFixed(2));
                      }

                      const diffDisplay = numDiff !== null 
                        ? (numDiff > 0 ? '+' : '') + (Number.isInteger(numDiff) ? numDiff : numDiff.toFixed(2))
                        : '?';

                      const ownership = school.ownership || '公立';
                      const ownershipColor = ownership === '私立' ? 'bg-purple-100 text-purple-800 border-purple-300' : 'bg-sky-100 text-sky-800 border-sky-300';
                      const OwnershipIcon = ownership === '私立' ? Building2 : Library;

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
                            
                            {/* Diff Score Box */}
                            <div className="flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex-1 min-w-[70px]">
                              <span className="text-[10px] font-black uppercase text-slate-500 mb-0.5 whitespace-nowrap">分差</span>
                              <div className="font-black flex items-baseline gap-0.5 whitespace-nowrap text-sm">
                                <span className={numDiff !== null ? (numDiff > 0 ? "text-emerald-500" : numDiff < 0 ? "text-rose-500" : "text-slate-700") : "text-slate-400"}>
                                  {diffDisplay}
                                </span>
                              </div>
                            </div>
                          </div>

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
      <AdvantagesModal 
        isOpen={activeModal === 'advantages'} 
        onClose={() => setActiveModal(null)} 
      />
      <QRCodeModal 
        isOpen={activeModal === 'qrcode'} 
        onClose={() => setActiveModal(null)} 
        onScan={(code) => { updateForm('invitationCode', code); setActiveModal(null); }} 
      />
      
      <MockVolunteerModal
        isOpen={activeModal === 'mockVolunteer'}
        onClose={() => setActiveModal(null)}
        region={formData.region}
      />

      <VocationalModal 
        isOpen={isVocationalOpen} 
        onClose={() => setIsVocationalOpen(false)}
        selectedGroups={vocationalGroups}
        onChange={setVocationalGroups}
        onOpenHollandTest={() => { setIsVocationalOpen(false); setIsHollandTestOpen(true); }}
      />

      <VocationalEncyclopediaModal
        isOpen={isEncyclopediaOpen}
        onClose={() => setIsEncyclopediaOpen(false)}
        onOpenHollandTest={() => { setIsEncyclopediaOpen(false); setIsHollandTestOpen(true); }}
      />
      
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
          setIsEncyclopediaOpen(true);
        }}
      />

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

      <ExportModal
        isOpen={activeModal === 'export'}
        onClose={() => setActiveModal(null)}
        onExport={handleExport}
      />

      <DisclaimerModal 
        isOpen={activeModal === 'disclaimer'} 
        onClose={() => setActiveModal(null)}
      />

      <InstructionsModal 
        isOpen={activeModal === 'instructions'} 
        onClose={() => setActiveModal(null)}
      />

      <ChangelogModal 
        isOpen={activeModal === 'changelog'} 
        onClose={() => setActiveModal(null)}
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

      <GradeLevelModal 
        isOpen={activeModal === 'gradeLevel'} 
        onClose={() => setActiveModal(null)} 
      />

      <SchoolTypesModal 
        isOpen={activeModal === 'schoolTypes'} 
        onClose={() => setActiveModal(null)} 
      />

      <StrategyModal 
        isOpen={activeModal === 'strategy'} 
        onClose={() => setActiveModal(null)} 
      />

      <HistoricalStatsModal 
        isOpen={activeModal === 'historicalStats'}
        onClose={() => setActiveModal(null)}
      />

      <ScoreInquiryModal 
        isOpen={activeModal === 'scoreInquiry'}
        onClose={() => setActiveModal(null)}
      />

      <DataProviderModal 
        isOpen={activeModal === 'dataProvider'}
        onClose={() => setActiveModal(null)}
      />

      <PrivacyModal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)} 
      />
      <TermsModal 
        isOpen={activeModal === 'terms'} 
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

      {/* Navigation Drawer */}
      <AnimatePresence>
        {isNavMenuOpen && (
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
                              onClick={() => { setIsHollandTestOpen(true); setIsNavMenuOpen(false); }}
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
                              onClick={() => { setIsEncyclopediaOpen(true); setIsNavMenuOpen(false); }}
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
                              onClick={() => { setActiveModal('schoolTypes'); setIsNavMenuOpen(false); }}
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
                              onClick={() => { setActiveModal(btn.id as any); setIsNavMenuOpen(false); }}
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
                            { id: 'advantages', icon: Sparkles, label: '系統優點', color: 'text-indigo-600', bg: 'bg-indigo-100' },
                            { id: 'rating', icon: StarIcon, label: '評分系統', color: 'text-amber-500', bg: 'bg-amber-100' },
                            { id: 'changelog', icon: History, label: '更新日誌', color: 'text-slate-500', bg: 'bg-slate-100' },
                            { id: 'privacy', icon: Database, label: '隱私權政策', color: 'text-emerald-600', bg: 'bg-emerald-100' },
                            { id: 'terms', icon: Shield, label: '服務條款', color: 'text-slate-600', bg: 'bg-slate-100' },
                            { id: 'reportError', icon: AlertCircle, label: '錯誤回報', color: 'text-red-500', bg: 'bg-red-100' }
                          ].map(btn => (
                            <button
                              key={btn.id}
                              onClick={() => { setActiveModal(btn.id as any); setIsNavMenuOpen(false); }}
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
        title="資料不齊全"
        icon={<AlertCircle className="w-8 h-8 text-rose-500" />}
      >
        <div className="space-y-4 text-center">
          <div className="bg-rose-50 border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-slate-900 p-6 rounded-3xl font-bold flex flex-col gap-4 items-center mx-auto">
            <div className="w-16 h-16 bg-white border-4 border-slate-900 rounded-2xl flex items-center justify-center -rotate-6 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <span className="text-3xl">⚠️</span>
            </div>
            <div>
              <p className="text-lg font-black mb-2">請填寫完整的資訊</p>
              <p className="text-sm font-bold text-slate-600 mb-4">系統需要完整的資料才能為您進行最準確的落點分析運算。</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {missingFields.map((field, index) => (
                  <span key={index} className="inline-flex items-center gap-1 bg-white border-2 border-slate-900 px-3 py-1 rounded-xl text-sm font-black text-rose-600 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                    {field}
                  </span>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setActiveModal(null)}
              className="mt-4 px-8 py-3 bg-slate-900 text-white rounded-xl border-2 border-slate-900 font-black shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:bg-slate-800 transition-all active:translate-y-1 active:shadow-none inline-block w-full"
            >
              我知道了，繼續填寫
            </button>
          </div>
        </div>
      </InfoModal>

      {/* Footer */}
      <footer className="mt-24 w-full px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-[3rem] border-4 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col">
            
            {/* Top Section */}
            <div className="p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row justify-between items-center xl:items-start gap-12 bg-slate-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 opacity-60"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-100 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 opacity-60"></div>

              <div className="flex flex-col items-center xl:items-start text-center xl:text-left gap-6 max-w-lg relative z-10 w-full">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="bg-indigo-600 p-4 rounded-3xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-transform duration-300">
                    <Compass className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-1">TW全國會考</h2>
                    <div className="inline-block bg-amber-200 px-3 py-1 rounded-lg border-2 border-slate-900 shadow-sm">
                       <h3 className="text-sm sm:text-base font-black tracking-widest text-slate-800 uppercase">落點分析系統</h3>
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center justify-center xl:justify-start gap-2 px-4 py-2.5 bg-white rounded-full border-2 border-slate-200 w-fit shadow-sm">
                  <div className="relative flex h-3 w-3 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </div>
                  <span className="text-slate-600 font-bold text-xs sm:text-sm">非政府官方機構 · 運算僅供參考</span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:flex gap-3 sm:gap-4 w-full xl:w-auto relative z-10">
                <button 
                  onClick={() => setActiveModal('privacy')}
                  className="group flex-1 xl:flex-none flex flex-col items-center xl:items-start p-4 sm:p-6 bg-white border-4 border-slate-900 rounded-3xl sm:rounded-[2rem] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all outline-none"
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 border-2 border-slate-900 rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <Database className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                  <span className="font-black text-slate-900 text-base sm:text-lg xl:text-xl mb-1 text-center xl:text-left">隱私權政策</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-500 flex items-center justify-center xl:justify-start gap-1 group-hover:text-emerald-600 transition-colors w-full">
                    資料授權 <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
                  </span>
                </button>

                <button 
                  onClick={() => setActiveModal('terms')}
                  className="group flex-1 xl:flex-none flex flex-col items-center xl:items-start p-4 sm:p-6 bg-white border-4 border-slate-900 rounded-3xl sm:rounded-[2rem] shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all outline-none"
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 border-2 border-slate-900 rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                  <span className="font-black text-slate-900 text-base sm:text-lg xl:text-xl mb-1 text-center xl:text-left">服務條款</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-500 flex items-center justify-center xl:justify-start gap-1 group-hover:text-indigo-600 transition-colors w-full">
                    使用規範 <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 hidden sm:block" />
                  </span>
                </button>

                <a 
                  href="mailto:tyctw.analyze@gmail.com" 
                  className="col-span-2 group flex-1 xl:flex-none flex flex-col items-center xl:items-start p-4 sm:p-6 bg-slate-900 border-4 border-slate-900 rounded-3xl sm:rounded-[2rem] shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(251,191,36,1)] active:translate-y-0 active:shadow-none transition-all text-white outline-none"
                >
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 border-2 border-slate-700 rounded-xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
                  </div>
                  <span className="font-black text-white text-base sm:text-lg xl:text-xl mb-1 text-center xl:text-left">聯絡我們信箱</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-400 group-hover:text-indigo-300 transition-colors break-all text-center xl:text-left w-full">
                    tyctw.analyze@gmail.com
                  </span>
                </a>
              </div>
            </div>

            {/* Bottom Copyright Section */}
            <div className="bg-amber-400 border-t-4 border-slate-900 p-4 sm:p-6 flex flex-row items-center justify-between gap-2 sm:gap-4 overflow-hidden relative">
              <div className="flex items-center gap-1.5 sm:gap-2 z-10 bg-amber-400">
                <Copyright className="w-4 h-4 sm:w-5 sm:h-5 text-slate-900 shrink-0" />
                <span className="font-black text-slate-900 text-sm sm:text-lg xl:text-xl tracking-tight leading-none pt-0.5">COPYRIGHT {new Date().getFullYear()}</span>
              </div>
              <div className="z-10 text-right bg-amber-400">
                <span className="font-black text-slate-900 text-[10px] sm:text-sm xl:text-base border-b-2 border-slate-900/30 pb-0.5">ALL RIGHTS RESERVED.</span>
              </div>
              {/* Marquee text in background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 overflow-hidden whitespace-nowrap z-0">
                <span className="text-5xl font-black text-slate-900 tracking-tighter uppercase px-4 select-none">
                  TW會考落點分析 TW會考落點分析 TW會考落點分析 TW會考落點分析 TW會考落點分析 TW會考落點分析 TW會考落點分析
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </footer>

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
