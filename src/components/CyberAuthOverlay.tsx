import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Activity,
  Award,
  Calculator,
  Check,
  KeyRound,
  ShieldAlert,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { callBackend, isBackendError, normalizeInvitationCode } from '../lib/api';

interface Props {
  isOpen: boolean;
  code: string;
  /** Used when the invitation code was verified recently. */
  skipValidation?: boolean;
  onSuccess: () => void;
  onFail: (reason: 'invalid' | 'service', message?: string) => void;
}

type OverlayStatus = 'validating' | 'analyzing' | 'fail';

const validationSteps = ['讀取邀請碼', '驗證使用權限', '建立安全工作階段'];

const analysisSteps = [
  { label: '成績資料建模', detail: '轉換各科等級與加權規則', icon: Calculator, color: 'bg-amber-300', ring: 'border-amber-400' },
  { label: '比對歷年資料', detail: '搜尋相近的錄取分布', icon: Activity, color: 'bg-sky-300', ring: 'border-sky-400' },
  { label: '校科適配排序', detail: '依志願條件評估落點區間', icon: Target, color: 'bg-violet-300', ring: 'border-violet-400' },
  { label: '產生個人報告', detail: '整理推薦清單與填選策略', icon: Award, color: 'bg-emerald-300', ring: 'border-emerald-400' },
];

export default function CyberAuthOverlay({ isOpen, code, skipValidation = false, onSuccess, onFail }: Props) {
  const [status, setStatus] = useState<OverlayStatus>('validating');
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setStatus('validating');
      setCurrentStep(0);
      setErrorMsg('');
      return;
    }

    if (skipValidation) {
      setStatus('analyzing');
      setCurrentStep(0);
      return;
    }

    setStatus('validating');
    const stepInterval = window.setInterval(() => {
      setCurrentStep((step) => (step + 1) % validationSteps.length);
    }, 700);
    const controller = new AbortController();
    const normalizedCode = normalizeInvitationCode(code);

    if (!normalizedCode) {
      window.clearInterval(stepInterval);
      setStatus('fail');
      setErrorMsg('請先輸入邀請碼。');
      onFail('invalid');
      return () => controller.abort();
    }

    callBackend<{ valid: boolean }>({ action: 'validateInvitationCode', invitationCode: normalizedCode }, { timeoutMs: 12_000, signal: controller.signal })
      .then((result) => {
        window.clearInterval(stepInterval);
        if (!result.valid) {
          setStatus('fail');
          setErrorMsg('邀請碼無效或已無法使用。');
          onFail('invalid');
          return;
        }
        onSuccess();
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        window.clearInterval(stepInterval);
        const message = isBackendError(error) ? error.message : '驗證服務暫時無法使用，請稍後再試。';
        setStatus('fail');
        setErrorMsg(message);
        onFail('service', message);
      });

    return () => {
      window.clearInterval(stepInterval);
      controller.abort();
    };
  }, [isOpen, code, skipValidation]);

  useEffect(() => {
    if (!isOpen || status !== 'analyzing') return;
    const interval = window.setInterval(() => setCurrentStep((step) => (step + 1) % analysisSteps.length), 1300);
    return () => window.clearInterval(interval);
  }, [isOpen, status]);

  const isAnalyzing = status === 'analyzing';
  const activeAnalysis = analysisSteps[currentStep];
  const ActiveAnalysisIcon = activeAnalysis.icon;
  const completedValidationSteps = validationSteps.length;
  const progressStep = isAnalyzing ? completedValidationSteps + currentStep : currentStep;
  const totalSteps = completedValidationSteps + analysisSteps.length;
  const activeLabel = isAnalyzing ? activeAnalysis.label : validationSteps[currentStep];
  const activeDetail = isAnalyzing ? activeAnalysis.detail : '安全驗證不會儲存你的邀請碼。';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-live="polite">
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={isAnalyzing ? '正在進行落點分析' : '正在驗證邀請碼'}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="relative w-full max-w-xl overflow-hidden rounded-[30px] border-4 border-slate-900 bg-[#fffdf8] p-5 shadow-[4px_4px_0_#0f172a] sm:p-8"
          >
            <div className="pointer-events-none absolute inset-0 opacity-[0.45]" style={{ backgroundImage: 'radial-gradient(#c7d2fe 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-[11px] font-black tracking-[0.14em] text-indigo-700">
                    <span className={`h-2 w-2 rounded-full ${status === 'fail' ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`} />
                    {isAnalyzing ? 'ANALYSIS ENGINE' : 'SECURE ACCESS'}
                  </div>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                    {isAnalyzing ? '正在建立你的落點地圖' : status === 'fail' ? '驗證未完成' : '正在確認分析資格'}
                  </h2>
                  <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
                    {isAnalyzing ? '系統正在交叉比對成績、就學區與志願偏好。' : status === 'fail' ? errorMsg : '正在以加密連線驗證邀請碼，請稍候。'}
                  </p>
                </div>
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-4 border-slate-900 shadow-[3px_3px_0_#0f172a] ${status === 'fail' ? 'bg-rose-300' : isAnalyzing ? activeAnalysis.color : 'bg-amber-300'}`}>
                  {status === 'fail' ? <ShieldAlert className="h-7 w-7" strokeWidth={2.8} /> : isAnalyzing ? <Sparkles className="h-7 w-7" strokeWidth={2.5} /> : <KeyRound className="h-7 w-7" strokeWidth={2.5} />}
                </div>
              </div>

              <div className="mt-6 rounded-3xl border-2 border-slate-900 bg-white/90 p-5">
                {status === 'fail' ? (
                  <div className="flex items-center gap-3 text-sm font-bold text-rose-700"><ShieldAlert className="h-5 w-5 shrink-0" />請關閉提示後確認邀請碼，再重新開始分析。</div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 ${isAnalyzing ? activeAnalysis.color : 'bg-amber-300'}`}>
                        {isAnalyzing ? <ActiveAnalysisIcon className="h-5 w-5" /> : <KeyRound className="h-5 w-5" />}
                      </div>
                      <div>
                        <AnimatePresence mode="wait"><motion.p key={activeLabel} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-sm font-black text-slate-900">{activeLabel}</motion.p></AnimatePresence>
                        <p className="text-xs font-bold text-slate-500">{activeDetail}</p>
                      </div>
                    </div>
                    <div className="mt-5 flex gap-1.5" aria-label={`完整分析流程，第 ${progressStep + 1} 步，共 ${totalSteps} 步`}>
                      {Array.from({ length: totalSteps }, (_, index) => (
                        <span key={index} className={`h-2 flex-1 rounded-full transition-colors ${index < progressStep ? 'bg-emerald-400' : index === progressStep ? isAnalyzing ? 'bg-indigo-500' : 'bg-amber-400' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                    <p className="mt-3 text-center text-[11px] font-black tracking-wider text-slate-500">完整流程 {progressStep + 1} / {totalSteps}</p>
                  </>
                )}
              </div>
              <p className="mt-4 text-center text-xs font-bold text-slate-500"><Check className="mr-1 inline h-3.5 w-3.5 text-emerald-600" />資料僅用於本次分析，結果僅供選填規劃參考。</p>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
