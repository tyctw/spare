import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { 
  Building2, 
  GraduationCap, 
  BookOpen, 
  Calculator, 
  Globe, 
  Atom, 
  PenTool, 
  Percent, 
  ListOrdered, 
  Mail, 
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Clock,
  Copy,
  AlertCircle,
  HelpCircle,
  X,
  Ticket,
  Info,
  Share2,
  QrCode,
  ChevronDown,
  MapPin,
  User,
  Users
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { QuestionnaireData, SubjectScore, EssayScoreType } from './types';

// Constants for dropdowns
const REGIONS = [
  "基北區", "桃園區", "竹苗區", "中投區", "彰化區", 
  "雲林區", "嘉義區", "台南區", "高雄區", "屏東區", 
  "宜蘭區", "花蓮區", "台東區", "澎湖區", "金門區", "其他"
];
const EXAM_YEARS = ["115", "114", "113", "112", "111", "110"];
const IDENTITIES = ["學生", "家長", "老師", "補教業"];
const SCORES: SubjectScore[] = ['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C'];
const ESSAY_SCORES: EssayScoreType[] = ['6', '5', '4', '3', '2', '1', '0'];

function generateInvitationCode() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  return "SH" + year + month + day + hour;
}

function calculateExpirationTime() {
  const now = new Date();
  const expiration = new Date(now);
  expiration.setMinutes(59, 59, 999);
  return expiration;
}

const initialData: QuestionnaireData = {
  region: '',
  examYear: '115',
  identity: '',
  chineseScore: '',
  mathScore: '',
  englishScore: '',
  socialScore: '',
  scienceScore: '',
  essayScore: '',
  minRatio: '',
  maxRatio: '',
  minRankInterval: '',
  maxRankInterval: '',
  email: '',
  skipRanking: false
};

export default function App() {
  const [formData, setFormData] = useState<QuestionnaireData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inviteResult, setInviteResult] = useState<{code: string, expiration: Date} | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const isBeforeAnnouncement = new Date() < new Date('2026-06-16T12:00:00+08:00');
  const forceSkipRanking = formData.examYear === '115' && isBeforeAnnouncement;
  const effectiveSkipRanking = formData.skipRanking || forceSkipRanking;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccess && inviteResult) {
      const checkExpiration = () => {
        if (new Date() >= inviteResult.expiration) {
          setIsSuccess(false);
          setInviteResult(null);
        }
      };
      
      // Check every second
      timer = setInterval(checkExpiration, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSuccess, inviteResult]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    if (target.type === 'checkbox') {
      const { name, checked } = target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      const { name, value } = target;
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleScoreClick = (name: keyof QuestionnaireData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: string[] = [];
    if (!formData.region) errors.push('招生區');
    if (!formData.examYear) errors.push('會考年度');
    if (!formData.identity) errors.push('分析身分');
    if (!formData.chineseScore) errors.push('國文成績');
    if (!formData.mathScore) errors.push('數學成績');
    if (!formData.englishScore) errors.push('英文成績');
    if (!formData.socialScore) errors.push('社會成績');
    if (!formData.scienceScore) errors.push('自然成績');
    if (!formData.essayScore) errors.push('作文級分');
    
    if (!effectiveSkipRanking) {
      if (!formData.minRatio) errors.push('全區序位最小比率 (%)');
      if (!formData.maxRatio) errors.push('全區序位最大比率 (%)');
      if (!formData.minRankInterval) errors.push('全區序位最小區間');
      if (!formData.maxRankInterval) errors.push('全區序位最大區間');
      
      if (Number(formData.minRatio) > Number(formData.maxRatio)) errors.push('「最小比率」不能大於「最大比率」');
      if (Number(formData.minRankInterval) > Number(formData.maxRankInterval)) errors.push('「最小區間」不能大於「最大區間」');
    }

    if (!formData.email) errors.push('Email 信箱');
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) errors.push('有效的 Email 格式');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors([]);
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    try {
      const gasUrl = import.meta.env.VITE_GAS_WEB_APP_URL;

      if (!gasUrl) {
        throw new Error("尚未設定系統連線 (未配置後端網址)，請聯絡管理員。");
      }

      const payload = {
        ...formData,
        skipRanking: effectiveSkipRanking,
        timestamp: new Date().toISOString()
      };
      
      let serverInviteCode = '';

      // Retry logic for high concurrency stability
      let retries = 3;
      let success = false;
      let lastError = null;

      while (retries > 0 && !success) {
        try {
          const response = await fetch(gasUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'text/plain',
            },
            body: JSON.stringify(payload)
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          // Handle JSON response
          const responseText = await response.text();
          let result;
          try {
            result = JSON.parse(responseText);
          } catch(e) {
             // Ignore non-json parsing error that sometimes happens with google scripts
          }
          if (result && result.status === 'error') {
            throw new Error(result.message);
          }
          
          if (result && result.inviteCode) {
            serverInviteCode = result.inviteCode;
          }
          
          success = true;
        } catch (err) {
          lastError = err;
          retries--;
          if (retries > 0) {
            // Exponential backoff
            await new Promise(r => setTimeout(r, (3 - retries) * 1000));
          }
        }
      }

      if (!success) {
        throw lastError;
      }

      setInviteResult({
        code: serverInviteCode || generateInvitationCode(),
        expiration: calculateExpirationTime()
      });
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Submission failed:", error);
      const errorMessage = error instanceof Error && error.message.includes("尚未設定系統連線") 
        ? error.message 
        : "伺服器繁忙，多次提交失敗，請稍後再試。";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyLink = () => {
    if (!inviteResult) return;
    const link = `https://tyctw.github.io/spare/?invite=${inviteResult.code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isSuccess && inviteResult) {
    const linkUrl = `https://tyctw.github.io/spare/?invite=${inviteResult.code}`;
    return (
      <>
        <Header onShareClick={() => setShowShareModal(true)} />
        <div className="min-h-screen grid-pattern pt-28 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="max-w-4xl w-full">
            <div className="bg-white border-4 border-slate-900 shadow-[12px_12px_0_#0F172A] flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
              
              {/* Left Column: Code & Data */}
              <div className="flex-1 p-8 sm:p-12 border-b-4 md:border-b-0 md:border-r-4 border-slate-900 bg-[size:20px_20px] bg-slate-50 flex flex-col justify-center relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400"></div>
                
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-10 h-10 bg-slate-900 text-emerald-400 flex items-center justify-center font-black shadow-[4px_4px_0_#34D399]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">System Response</div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">落點分析邀請碼</h2>
                  </div>
                </div>

                <div className="bg-white border-2 border-slate-900 shadow-[4px_4px_0_#0F172A] p-6 mb-8 group hover:shadow-[8px_8px_0_#0F172A] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-2 bg-emerald-400"></div>
                    <Ticket className="w-6 h-6 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <div className="font-mono text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 mb-2 select-all">
                    {inviteResult.code}
                  </div>
                  <div className="inline-flex items-center px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 shadow-sm">
                    此代碼為系統自動帶入
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center text-xs font-black tracking-widest text-slate-500 uppercase mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    失效時間
                  </div>
                  <div className="font-mono text-2xl font-black text-rose-600 mb-2">
                    {inviteResult.expiration.toLocaleTimeString('zh-TW', { hour12: false })}
                  </div>
                  <p className="text-xs font-bold text-slate-500">代碼於填寫當小時末失效，請盡速使用</p>
                </div>
              </div>

              {/* Right Column: Instructions & Actions */}
              <div className="flex-1 p-8 sm:p-12 bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-slate-800 rounded-full blur-3xl opacity-50"></div>
                
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center justify-center p-3 bg-blue-500 text-white shadow-[4px_4px_0_#FFFFFF] mb-2">
                    <Info className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white tracking-wide">邀請碼使用說明</h3>
                  <p className="text-slate-300 leading-relaxed font-medium text-sm sm:text-base">
                    獲取邀請碼後，您可以直接點擊下方按鈕前往「落點分析系統」進行進階數據比對。本系統數據僅供參考，實際分發請依正式簡章為準。
                  </p>
                </div>

                <div className="relative z-10 mt-12 space-y-4">
                  <a 
                    href={linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full group relative flex items-center justify-center py-4 px-6 bg-emerald-400 text-slate-900 font-black text-lg border-2 border-emerald-400 shadow-[4px_4px_0_#FFFFFF] hover:bg-emerald-300 hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    進入分析系統
                    <ExternalLink className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </a>
                  
                  <button 
                    onClick={handleCopyLink}
                    className="w-full group flex items-center justify-center py-4 px-6 bg-slate-800 text-white font-bold text-base hover:bg-slate-700 transition-all border border-slate-700 hover:border-slate-500"
                  >
                    {copied ? (
                      <span className="flex items-center text-emerald-400"><CheckCircle2 className="w-5 h-5 mr-2" /> 已複製專屬連結</span>
                    ) : (
                      <span className="flex items-center text-slate-300 group-hover:text-white"><Copy className="w-5 h-5 mr-2" /> 複製專屬連結</span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsSuccess(false);
                      setInviteResult(null);
                    }}
                    className="w-full text-slate-400 hover:text-white font-medium text-sm transition-colors mt-4 py-2"
                  >
                    返回填寫頁面
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 分享系統彈窗 */}
        {showShareModal && (
          <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_#0F172A] p-6 sm:p-8 max-w-sm w-full animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-100">
                <h3 className="text-2xl font-extrabold flex items-center text-slate-900">
                  <Share2 className="w-6 h-6 mr-3 text-slate-900" />
                  分享系統
                </h3>
                <button 
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-slate-100 transition-colors border-2 border-transparent hover:border-slate-900 geometric-card !border-slate-900 !shadow-[2px_2px_0_#0F172A] active:!translate-y-0.5 active:!shadow-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col items-center justify-center space-y-6">
                <p className="text-slate-600 font-medium text-sm text-center">
                  掃描下方 QR Code 或複製連結，分享「全國會考分析系統」給需要的朋友與同學。
                </p>
                
                <div className="p-4 bg-white border-4 border-slate-900 shadow-[4px_4px_0_#0F172A]">
                  <QRCodeSVG 
                    value={window.location.href} 
                    size={200}
                    bgColor={"#ffffff"}
                    fgColor={"#0f172a"}
                    level={"H"}
                    includeMargin={false}
                  />
                </div>
                
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="w-full group flex items-center justify-center py-3 px-4 bg-slate-50 text-slate-900 font-bold text-sm hover:bg-slate-100 transition-all border-2 border-slate-900 shadow-[4px_4px_0_#0F172A] active:translate-y-1 active:shadow-none"
                >
                  {copied ? (
                    <span className="flex items-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mr-2" /> 已複製連結</span>
                  ) : (
                    <span className="flex items-center text-slate-900"><Copy className="w-5 h-5 mr-2" /> 複製系統連結</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Header onShareClick={() => setShowShareModal(true)} />
      <div className="min-h-screen grid-pattern pt-28 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto geometric-card bg-white overflow-hidden">
        
        <div className="p-8 sm:p-10 border-b-2 border-slate-900 border-dashed relative">
          <div className="status-badge mb-4">Survey Mode v1.0.4</div>
          <button 
            type="button" 
            onClick={() => setShowHelpModal(true)}
            className="absolute top-8 right-8 text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1 font-bold text-sm"
          >
            <HelpCircle className="w-5 h-5" />
            <span className="hidden sm:inline">使用說明</span>
          </button>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 text-slate-900">會考序位調查問卷</h1>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            為提供更精準的落點分析數據，請填寫您的會考成績與序位區間。<br className="hidden sm:block"/>
            填寫完成後，系統將自動產生您的專屬邀請碼供登入使用。
          </p>
        </div>

        {isBeforeAnnouncement ? (
          <div className="mx-8 mt-8 bg-slate-100 text-slate-800 p-4 border-2 border-slate-900 flex items-start">
            <AlertCircle className="w-5 h-5 mt-0.5 mr-3 shrink-0 text-slate-900" />
            <div className="text-sm">
              <strong className="font-bold block mb-1">公告：序位區間尚未開放查詢</strong>
              <p>115年度個人序位區間將於 2026/06/16 12:00 正式公告。在此之前，您可以先填寫成績獲取邀請碼。</p>
            </div>
          </div>
        ) : (
          <div className="mx-8 mt-8 bg-blue-50 text-blue-900 p-4 border-2 border-blue-600 flex items-start geometric-card !shadow-[4px_4px_0_#2563EB]">
            <Info className="w-5 h-5 mt-0.5 mr-3 shrink-0 text-blue-600" />
            <div className="text-sm">
              <strong className="font-bold block mb-1">公告：115年度序位區間已開放查詢</strong>
              <p className="mb-2">請先前往系統查詢您的序位資訊，再回來完整填寫，以獲得更準確的落點分析。</p>
              <a 
                href="https://tyctw.github.io/volunteer/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-700 hover:text-blue-900 font-bold transition-colors underline underline-offset-2"
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                前往查詢序位區間
              </a>
            </div>
          </div>
        )}

        <div className="p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* 基本資料 */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b-2 border-slate-100 flex items-center uppercase tracking-wider">
                <span className="w-8 h-8 geometric-card bg-slate-900 text-white flex items-center justify-center mr-3 text-sm font-bold">1</span>
                基本資料
              </h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="region" className="text-[11px] font-bold uppercase text-slate-400 flex items-center mb-1">
                    <Building2 className="w-4 h-4 mr-1.5 text-slate-400" /> 招生區域 <span className="text-slate-900 ml-1">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowRegionModal(true)}
                    className="geo-input w-full text-left bg-white flex justify-between items-center"
                  >
                    <span className={formData.region ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                      {formData.region || '請選擇招生區'}
                    </span>
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div>
                  <label htmlFor="examYear" className="text-[11px] font-bold uppercase text-slate-400 flex items-center mb-1">
                    <GraduationCap className="w-4 h-4 mr-1.5 text-slate-400" /> 會考年度 <span className="text-slate-900 ml-1">*</span>
                  </label>
                  <select
                    id="examYear"
                    name="examYear"
                    value={formData.examYear}
                    onChange={handleChange}
                    className="geo-input"
                  >
                    {EXAM_YEARS.map(y => <option key={y} value={y}>{y}年度</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="text-[11px] font-bold uppercase text-slate-400 flex items-center mb-2">
                  <span className="w-4 h-4 mr-1.5 flex items-center justify-center font-black">
                    <User className="w-4 h-4 text-slate-400" />
                  </span>
                  分析身分 <span className="text-slate-900 ml-1">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {IDENTITIES.map(identity => (
                    <button
                      key={identity}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, identity }))}
                      className={`py-3 px-2 font-bold transition-all border-2 geometric-card active:translate-y-0.5 active:shadow-none flex items-center justify-center ${
                        formData.identity === identity
                          ? 'bg-slate-900 text-white border-slate-900 shadow-[3px_3px_0_#0F172A]' 
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-900 shadow-[2px_2px_0_transparent] hover:shadow-[3px_3px_0_#0F172A]'
                      }`}
                    >
                      {identity}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* 各科成績 */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b-2 border-slate-100 flex items-center uppercase tracking-wider">
                <span className="w-8 h-8 geometric-card bg-slate-900 text-white flex items-center justify-center mr-3 text-sm font-bold">2</span>
                各科會考成績
              </h2>
              
              <div className="flex flex-col space-y-6">
                {[
                  { id: 'chineseScore', label: '國文', icon: BookOpen },
                  { id: 'mathScore', label: '數學', icon: Calculator },
                  { id: 'englishScore', label: '英文', icon: Globe },
                  { id: 'socialScore', label: '社會', icon: Building2 },
                  { id: 'scienceScore', label: '自然', icon: Atom },
                ].map((subject, index) => (
                  <div key={subject.id} className={`relative ${index !== 0 ? 'pt-6 border-t-2 border-slate-100' : ''}`}>
                    <label className="text-[11px] font-bold uppercase text-slate-400 flex items-center mb-2">
                      <subject.icon className="w-4 h-4 mr-1.5 text-slate-400" /> {subject.label}成績 <span className="text-slate-900 ml-1">*</span>
                    </label>
                    <div className="flex flex-row gap-1.5 sm:gap-2 w-full">
                      {SCORES.map(s => {
                        const isSelected = (formData as any)[subject.id] === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => handleScoreClick(subject.id as keyof QuestionnaireData, s)}
                            className={`flex-1 py-2 sm:py-2.5 border-2 font-bold text-xs sm:text-sm transition-all text-center focus:outline-none
                              ${isSelected 
                                ? 'border-slate-900 bg-slate-900 text-white shadow-[inset_0_3px_6px_rgba(0,0,0,0.6)]' 
                                : 'border-slate-300 bg-white text-slate-700 shadow-[2px_2px_0_#94a3b8] hover:border-slate-900 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#0F172A]'
                              }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                    {/* Native validation hidden select */}
                    <select
                      id={subject.id}
                      name={subject.id}
                      value={(formData as any)[subject.id]}
                      onChange={handleChange}
                      className="absolute bottom-0 left-1/2 w-px h-px opacity-0 pointer-events-none"
                      tabIndex={-1}
                    >
                      <option value="" disabled></option>
                      {SCORES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                ))}
                
                <div className="relative pt-6 border-t-2 border-slate-100">
                  <label className="text-[11px] font-bold uppercase text-slate-400 flex items-center mb-2">
                    <PenTool className="w-4 h-4 mr-1.5 text-slate-400" /> 作文級分 <span className="text-slate-900 ml-1">*</span>
                  </label>
                  <div className="flex flex-row gap-1.5 sm:gap-2 w-full">
                    {ESSAY_SCORES.map(s => {
                      const isSelected = formData.essayScore === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleScoreClick('essayScore', s)}
                          className={`flex-1 py-2 sm:py-2.5 border-2 font-bold text-xs sm:text-sm transition-all text-center focus:outline-none
                            ${isSelected 
                              ? 'border-slate-900 bg-slate-900 text-white shadow-[inset_0_3px_6px_rgba(0,0,0,0.6)]' 
                              : 'border-slate-300 bg-white text-slate-700 shadow-[2px_2px_0_#94a3b8] hover:border-slate-900 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#0F172A]'
                            }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                  {/* Native validation hidden select */}
                  <select
                    id="essayScore"
                    name="essayScore"
                    value={formData.essayScore}
                    onChange={handleChange}
                    className="absolute bottom-0 left-1/2 w-px h-px opacity-0 pointer-events-none"
                    tabIndex={-1}
                  >
                    <option value="" disabled></option>
                    {ESSAY_SCORES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* 隱藏序位區間選項 */}
            <div className={`flex flex-col items-start bg-slate-50 p-4 border-2 border-slate-900 geometric-card ${forceSkipRanking ? 'opacity-90 bg-slate-100' : ''} ${effectiveSkipRanking ? '!mb-20 mt-4' : 'mb-12'}`}>
              <div className="flex items-center w-full">
                <input
                  type="checkbox"
                  id="skipRanking"
                  name="skipRanking"
                  checked={effectiveSkipRanking}
                  disabled={forceSkipRanking}
                  onChange={handleChange}
                  className={`w-5 h-5 accent-slate-900 border-2 border-slate-900 bg-white ${forceSkipRanking ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
                />
                <label htmlFor="skipRanking" className={`ml-3 block text-sm font-bold text-slate-900 select-none ${forceSkipRanking ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                  不想提供序位資訊，直接獲取邀請碼
                </label>
              </div>
              {forceSkipRanking && (
                <p className="mt-3 text-xs font-bold text-rose-600 pl-8">
                  ※ 115年度個人序位區間公告前（2026/06/16 12:00），自動略過填寫序位資訊。
                </p>
              )}
            </div>

            {/* 序位區間 */}
            {!effectiveSkipRanking && (
            <section>
              <div className="flex justify-between items-end mb-6 pb-2 border-b-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 flex items-center uppercase tracking-wider">
                  <span className="w-8 h-8 geometric-card bg-slate-900 text-white flex items-center justify-center mr-3 text-sm font-bold">3</span>
                  全區序位數據
                </h2>
                <a 
                  href="https://tyctw.github.io/volunteer/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 border-2 border-blue-600 hover:bg-blue-600 hover:text-white font-bold text-sm transition-all geometric-card !shadow-[3px_3px_0_#2563EB] active:!translate-y-1 active:!shadow-none"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  序位這裡查詢
                </a>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="minRatio" className="text-[11px] font-bold uppercase text-slate-400 flex items-center mb-1">
                    <Percent className="w-4 h-4 mr-1.5 text-slate-400" /> 最小比率 (%) <span className="text-slate-900 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="minRatio"
                    name="minRatio"
                    placeholder="例: 1.54"
                    value={formData.minRatio}
                    onChange={handleChange}
                    className="geo-input"
                  />
                </div>

                <div>
                  <label htmlFor="maxRatio" className="text-[11px] font-bold uppercase text-slate-400 flex items-center mb-1">
                    <Percent className="w-4 h-4 mr-1.5 text-slate-400" /> 最大比率 (%) <span className="text-slate-900 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    id="maxRatio"
                    name="maxRatio"
                    placeholder="例: 1.82"
                    value={formData.maxRatio}
                    onChange={handleChange}
                    className="geo-input"
                  />
                </div>

                <div>
                  <label htmlFor="minRankInterval" className="text-[11px] font-bold uppercase text-slate-400 flex items-center mb-1">
                    <ListOrdered className="w-4 h-4 mr-1.5 text-slate-400" /> 最小區間 <span className="text-slate-900 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    id="minRankInterval"
                    name="minRankInterval"
                    placeholder="例: 101"
                    value={formData.minRankInterval}
                    onChange={handleChange}
                    className="geo-input"
                  />
                </div>

                <div>
                  <label htmlFor="maxRankInterval" className="text-[11px] font-bold uppercase text-slate-400 flex items-center mb-1">
                    <ListOrdered className="w-4 h-4 mr-1.5 text-slate-400" /> 最大區間 <span className="text-slate-900 ml-1">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    id="maxRankInterval"
                    name="maxRankInterval"
                    placeholder="例: 200"
                    value={formData.maxRankInterval}
                    onChange={handleChange}
                    className="geo-input"
                  />
                </div>
              </div>
            </section>
            )}

            {/* 聯絡資訊 */}
            <section>
              <h2 className="text-xl font-bold text-slate-900 mb-6 pb-2 border-b-2 border-slate-100 flex items-center uppercase tracking-wider">
                <span className="w-8 h-8 geometric-card bg-slate-900 text-white flex items-center justify-center mr-3 text-sm font-bold">
                  {effectiveSkipRanking ? '3' : '4'}
                </span>
                聯絡資訊
              </h2>
              <div>
                <label htmlFor="email" className="text-[11px] font-bold uppercase text-slate-400 flex items-center mb-1">
                  <Mail className="w-4 h-4 mr-1.5 text-slate-400" /> Email信箱 <span className="text-slate-900 ml-1">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="geo-input max-w-md"
                />
                <p className="mt-2 text-[11px] uppercase font-bold text-slate-400">此信箱僅用於驗證及補發分析報告使用。</p>
              </div>
            </section>

            <div className="pt-6 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 mt-8 border-4 border-slate-900 transition-all flex items-center justify-center group ${isSubmitting ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-emerald-400 text-slate-900 font-black text-lg shadow-[8px_8px_0_#0F172A] hover:bg-emerald-300 hover:-translate-y-1 hover:shadow-[10px_10px_0_#0F172A] active:translate-y-2 active:shadow-none'}`}
              >
                {isSubmitting ? '資料提交中...' : '提交資料並獲取邀請碼'}
                {!isSubmitting && <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* 頁尾版權與聯絡資訊 */}
      <footer className="max-w-3xl mx-auto mt-8 text-center pb-8">
        <p className="text-slate-500 font-bold text-sm tracking-widest uppercase mb-1">
          © {new Date().getFullYear()} 全國會考分析系統
        </p>
        <p className="text-slate-400 font-medium text-xs mb-5">
          非政府官方架設，由民間團隊營運
        </p>
        <div className="flex items-center justify-center gap-6 mb-2">
          <button 
            type="button" 
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors underline underline-offset-4"
          >
            <Share2 className="w-4 h-4 mr-1.5" />
            分享系統
          </button>
          <button 
            type="button" 
            onClick={() => setShowPrivacyModal(true)}
            className="inline-flex items-center text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors underline underline-offset-4"
          >
            <BookOpen className="w-4 h-4 mr-1.5" />
            隱私權政策
          </button>
          <a href="mailto:tyctw.analyze@gmail.com" className="inline-flex items-center text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors underline underline-offset-4 pointer-events-auto">
            <Mail className="w-4 h-4 mr-1.5" />
            聯絡我們
          </a>
        </div>
      </footer>
    </div>

    {/* 防呆錯誤彈窗 */}
    {validationErrors.length > 0 && (
      <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_#0F172A] p-6 max-w-sm w-full animate-in fade-in zoom-in duration-200">
          <h3 className="text-xl font-bold flex items-center text-rose-600 mb-4">
            <AlertCircle className="w-6 h-6 mr-2 shrink-0" />
            資料未完整填寫或格式有誤
          </h3>
          <div className="bg-rose-50 p-4 mb-6 border-2 border-rose-100 max-h-[40vh] overflow-y-auto">
            <p className="text-rose-800 font-bold mb-2 text-sm">請檢查以下欄位：</p>
            <ul className="text-rose-700 font-medium text-sm list-disc pl-5 space-y-1">
              {validationErrors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setValidationErrors([])}
            className="w-full py-3 bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors border-2 border-slate-900 shadow-[4px_4px_0_#0F172A] active:translate-y-1 active:shadow-[2px_2px_0_#0F172A]"
          >
            我知道了，返回修改
          </button>
        </div>
      </div>
    )}

    {/* 確認資料彈窗 */}
    {showConfirmModal && (
      <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
        <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_#0F172A] p-6 max-w-lg w-full my-8 animate-in fade-in zoom-in duration-200">
          <h3 className="text-2xl font-bold flex items-center text-slate-900 mb-4 border-b-2 border-slate-200 pb-2">
            <CheckCircle2 className="w-6 h-6 mr-2 text-blue-600" />
            最後確認資料是否正確！
          </h3>
          <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-2 text-sm border-b-2 border-slate-100 pb-2">
              <span className="text-slate-500 font-bold">區域</span>
              <span className="font-bold text-slate-900 text-right">{formData.region}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm border-b-2 border-slate-100 pb-2">
              <span className="text-slate-500 font-bold">會考年度</span>
              <span className="font-bold text-slate-900 text-right">{formData.examYear}年度</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm border-b-2 border-slate-100 pb-2">
              <span className="text-slate-500 font-bold">分析身分</span>
              <span className="font-bold text-slate-900 text-right">{formData.identity}</span>
            </div>
            <div className="flex flex-col gap-1 border-b-2 border-slate-100 pb-2">
              <span className="text-slate-500 font-bold text-sm">各科成績</span>
              <span className="font-bold text-slate-900 text-base">
                國 {formData.chineseScore} / 數 {formData.mathScore} / 英 {formData.englishScore} / 
                社 {formData.socialScore} / 自 {formData.scienceScore}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm border-b-2 border-slate-100 pb-2">
              <span className="text-slate-500 font-bold">作文級分</span>
              <span className="font-bold text-slate-900 text-right">{formData.essayScore} 級分</span>
            </div>
            {effectiveSkipRanking ? (
              <div className="bg-slate-100 p-3 text-sm font-bold text-slate-600 text-center border-2 border-dashed border-slate-300">
                已略過序位區間資訊
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-2 text-sm border-b-2 border-slate-100 pb-2">
                  <span className="text-slate-500 font-bold">全區比率</span>
                  <span className="font-bold text-slate-900 text-right">{formData.minRatio}% ~ {formData.maxRatio}%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm border-b-2 border-slate-100 pb-2">
                  <span className="text-slate-500 font-bold">全區區間</span>
                  <span className="font-bold text-slate-900 text-right">{formData.minRankInterval} ~ {formData.maxRankInterval}</span>
                </div>
              </>
            )}
            <div className="grid grid-cols-1 gap-2 text-sm pt-2">
              <span className="text-slate-500 font-bold">聯絡 Email</span>
              <span className="font-bold text-slate-900 truncate">{formData.email}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 py-3 bg-white text-slate-900 font-bold border-2 border-slate-900 shadow-[4px_4px_0_#0F172A] hover:bg-slate-50 active:translate-y-1 active:shadow-[2px_2px_0_#0F172A] transition-all"
              disabled={isSubmitting}
            >
              返回修改
            </button>
            <button
              onClick={handleConfirmSubmit}
              className="flex-1 py-3 bg-blue-600 text-white font-bold border-2 border-blue-900 shadow-[4px_4px_0_#1E3A8A] hover:bg-blue-700 active:translate-y-1 active:shadow-[2px_2px_0_#1E3A8A] transition-all flex justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? '傳送中...' : '確認無誤送出'}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* 隱私權政策彈窗 */}
    {showPrivacyModal && (
      <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
        <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_#0F172A] p-6 sm:p-8 max-w-2xl w-full my-8 animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-100">
            <h3 className="text-2xl font-extrabold flex items-center text-slate-900">
              <BookOpen className="w-6 h-6 mr-3 text-slate-900" />
              隱私權政策
            </h3>
            <button 
              onClick={() => setShowPrivacyModal(false)}
              className="p-2 hover:bg-slate-100 transition-colors border-2 border-transparent hover:border-slate-900 geometric-card !border-slate-900 !shadow-[2px_2px_0_#0F172A] active:!translate-y-0.5 active:!shadow-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 pb-4">
            <p className="text-slate-600 font-medium leading-relaxed">
              本系統非常重視用戶的隱私權，為保障您的權益，請詳閱以下隱私權規範：
            </p>
            
            <div className="space-y-2">
              <h4 className="font-bold text-lg text-slate-900 flex items-center">
                <span className="w-2 h-2 rounded-full bg-slate-900 mr-2"></span>
                資料收集與目的
              </h4>
              <p className="text-slate-600 pl-4 leading-relaxed text-sm font-medium">
                本系統收集的資料（包含成績、序位及 Email）僅用於落點分析統計及系統防呆運作。Email 僅做為防止惡意填入與系統寄送通知之用，不會移作他用。
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-bold text-lg text-slate-900 flex items-center">
                <span className="w-2 h-2 rounded-full bg-slate-900 mr-2"></span>
                資料保護與去識別化
              </h4>
              <p className="text-slate-600 pl-4 leading-relaxed text-sm font-medium">
                收集之數據將進行去識別化處理。所有成績與序位數據皆做為整體趨勢分析之用，無法直接連結或反查至您個人身份。
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-bold text-lg text-slate-900 flex items-center">
                <span className="w-2 h-2 rounded-full bg-slate-900 mr-2"></span>
                資料分享政策
              </h4>
              <p className="text-slate-600 pl-4 leading-relaxed text-sm font-medium">
                本系統承諾絕不將您的個人資訊出售、交換或出租給任何第三方。於發布相關數據分析時，皆不會包含任何可辨識個人的資訊。
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-lg text-slate-900 flex items-center">
                <span className="w-2 h-2 rounded-full bg-slate-900 mr-2"></span>
                免責聲明
              </h4>
              <p className="text-slate-600 pl-4 leading-relaxed text-sm font-medium">
                本系統之各式分析結果僅供參考。實際分發規定與錄取狀況，應以當年度各區官方所發布之免試入學簡章與正式分發結果為準。
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t-2 border-slate-100 flex justify-end">
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="px-8 py-3 bg-slate-900 text-white font-bold border-2 border-slate-900 shadow-[4px_4px_0_#0F172A] hover:bg-slate-800 active:translate-y-1 active:shadow-[2px_2px_0_#0F172A] transition-all"
            >
              我知道了
            </button>
          </div>
        </div>
      </div>
    )}

    {/* 使用說明彈窗 */}
    {showHelpModal && (
      <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm">
        <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_#0F172A] p-6 sm:p-8 max-w-2xl w-full my-8 animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-100">
            <h3 className="text-2xl font-extrabold flex items-center text-slate-900">
              <HelpCircle className="w-6 h-6 mr-3 text-blue-600" />
              使用說明與常見問題
            </h3>
            <button 
              onClick={() => setShowHelpModal(false)}
              className="p-2 hover:bg-slate-100 transition-colors border-2 border-transparent hover:border-slate-900 geometric-card !border-slate-900 !shadow-[2px_2px_0_#0F172A] active:!translate-y-0.5 active:!shadow-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 pb-4">
            <div className="space-y-2">
              <h4 className="font-bold text-lg text-slate-900 flex items-center">
                <span className="w-6 h-6 geometric-card bg-slate-900 text-white flex items-center justify-center mr-3 text-xs font-bold">1</span>
                什麼是會考序位調查問卷？
              </h4>
              <p className="text-slate-600 pl-9 leading-relaxed text-sm font-medium">
                本問卷旨在收集當年度會考考生的成績與序位區間資料。為幫助後續的落點分析更為精準，您的成績資料將成為分析系統的參考基底。
              </p>
            </div>
            
             <div className="space-y-2">
              <h4 className="font-bold text-lg text-slate-900 flex items-center">
                <span className="w-6 h-6 geometric-card bg-slate-900 text-white flex items-center justify-center mr-3 text-xs font-bold">2</span>
                獲取邀請碼有什麼用？
              </h4>
              <p className="text-slate-600 pl-9 leading-relaxed text-sm font-medium">
                填寫完成並成功送出後，系統會自動核發一組專屬邀請碼。您可以憑此邀請碼進入「會考落點分析系統」，系統會自動帶入您的成績並進行落點比對。邀請碼設有時效，請於當下取得後盡量於時效內使用。
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-bold text-lg text-slate-900 flex items-center">
                <span className="w-6 h-6 geometric-card bg-slate-900 text-white flex items-center justify-center mr-3 text-xs font-bold">3</span>
                序位區間該去哪裡查詢？
              </h4>
              <p className="text-slate-600 pl-9 leading-relaxed text-sm font-medium">
                各招生區會於特定時間開放序位區間查詢。請登入您所在招生區的「免試入學報名分發系統」進行查詢。如果您尚未能查詢到序位資訊，系統提供「略過序位」之選項。
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-lg text-slate-900 flex items-center">
                <span className="w-6 h-6 geometric-card bg-slate-900 text-white flex items-center justify-center mr-3 text-xs font-bold">4</span>
                系統如何保護我的資料？
              </h4>
              <p className="text-slate-600 pl-9 leading-relaxed text-sm font-medium">
                本系統採去識別化處理，資料僅作地區性、整體性的統計與分析使用，絕不會外洩您的個人辨識資訊。您的 Email 僅作為防呆與後續系統通知備用。
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t-2 border-slate-100 flex justify-end">
            <button
              onClick={() => setShowHelpModal(false)}
              className="px-8 py-3 bg-slate-900 text-white font-bold border-2 border-slate-900 shadow-[4px_4px_0_#0F172A] hover:bg-slate-800 active:translate-y-1 active:shadow-[2px_2px_0_#0F172A] transition-all"
            >
              我知道了
            </button>
          </div>
        </div>
      </div>
    )}
    {/* 分享系統彈窗 */}
    {showShareModal && (
      <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_#0F172A] p-6 sm:p-8 max-w-sm w-full animate-in fade-in zoom-in duration-200">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-100">
            <h3 className="text-2xl font-extrabold flex items-center text-slate-900">
              <Share2 className="w-6 h-6 mr-3 text-slate-900" />
              分享系統
            </h3>
            <button 
              onClick={() => setShowShareModal(false)}
              className="p-2 hover:bg-slate-100 transition-colors border-2 border-transparent hover:border-slate-900 geometric-card !border-slate-900 !shadow-[2px_2px_0_#0F172A] active:!translate-y-0.5 active:!shadow-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-6">
            <p className="text-slate-600 font-medium text-sm text-center">
              掃描下方 QR Code 或複製連結，分享「全國會考分析系統」給需要的朋友與同學。
            </p>
            
            <div className="p-4 bg-white border-4 border-slate-900 shadow-[4px_4px_0_#0F172A]">
              <QRCodeSVG 
                value={window.location.href} 
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#0f172a"}
                level={"H"}
                includeMargin={false}
              />
            </div>
            
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="w-full group flex items-center justify-center py-3 px-4 bg-slate-50 text-slate-900 font-bold text-sm hover:bg-slate-100 transition-all border-2 border-slate-900 shadow-[4px_4px_0_#0F172A] active:translate-y-1 active:shadow-none"
            >
              {copied ? (
                <span className="flex items-center text-emerald-600"><CheckCircle2 className="w-5 h-5 mr-2" /> 已複製連結</span>
              ) : (
                <span className="flex items-center text-slate-900"><Copy className="w-5 h-5 mr-2" /> 複製系統連結</span>
              )}
            </button>
          </div>
        </div>
      </div>
    )}

    {/* 招生區彈窗 */}
    {showRegionModal && (
      <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <div className="bg-white border-4 border-slate-900 shadow-[8px_8px_0_#0F172A] p-6 sm:p-8 max-w-md w-full animate-in fade-in zoom-in duration-200 flex flex-col max-h-[85vh]">
          <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-slate-100 shrink-0">
            <h3 className="text-2xl font-extrabold flex items-center text-slate-900">
              <MapPin className="w-6 h-6 mr-3 text-slate-900" />
              選擇招生區域
            </h3>
            <button 
              onClick={() => setShowRegionModal(false)}
              className="p-2 hover:bg-slate-100 transition-colors border-2 border-transparent hover:border-slate-900 geometric-card !border-slate-900 !shadow-[2px_2px_0_#0F172A] active:!translate-y-0.5 active:!shadow-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="overflow-y-auto overflow-x-hidden flex-1 scrollbar-hide -mx-2 px-2 pb-2">
            <div className="grid grid-cols-2 gap-3 pb-2">
              {REGIONS.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, region: r }));
                    setShowRegionModal(false);
                  }}
                  className={`py-3 px-4 text-left font-bold transition-all border-2 geometric-card active:translate-y-0.5 active:shadow-[1px_1px_0_#0F172A] flex items-center justify-between group ${
                    formData.region === r 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-[3px_3px_0_#0F172A]' 
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-900 shadow-[3px_3px_0_transparent] hover:shadow-[3px_3px_0_#0F172A] hover:text-slate-900'
                  }`}
                >
                  <span className="truncate">{r}</span>
                  {formData.region === r && <CheckCircle2 className="w-4 h-4 ml-2 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    </>
  );
}

