import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, Check, ShieldAlert, Zap } from 'lucide-react';
import { callBackend, isBackendError, normalizeInvitationCode } from '../lib/api';

interface Props {
  isOpen: boolean;
  code: string;
  onSuccess: () => void;
  onFail: (reason: 'invalid' | 'service', message?: string) => void;
}

export default function CyberAuthOverlay({ isOpen, code, onSuccess, onFail }: Props) {
  const [status, setStatus] = useState<'validating' | 'success' | 'fail'>('validating');
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const steps = [
    "解析授權碼格式...",
    "建立安全連線通道...",
    "比對雲端憑證庫...",
    "金鑰驗證程序..."
  ];

  useEffect(() => {
    if (!isOpen) {
      setStatus('validating');
      setCurrentStep(0);
      setErrorMsg('');
      return;
    }

    let completionTimer: ReturnType<typeof setTimeout> | undefined;
    const stepInterval = setInterval(() => {
      setCurrentStep(step => (step + 1) % steps.length);
    }, 900);

    const controller = new AbortController();
    const normalizedCode = normalizeInvitationCode(code);

    if (!normalizedCode) {
      clearInterval(stepInterval);
      setStatus('fail');
      setErrorMsg('請輸入邀請碼');
      onFail('invalid');
      return () => controller.abort();
    }

    callBackend<{ valid: boolean }>({
      action: 'validateInvitationCode',
      invitationCode: normalizedCode,
    }, { timeoutMs: 12_000, signal: controller.signal })
    .then(res => {
      clearInterval(stepInterval);
      if (res.valid) {
        setStatus('success');
        completionTimer = setTimeout(onSuccess, 700);
      } else {
        setStatus('fail');
        setErrorMsg('邀請碼無效或已過期');
        onFail('invalid');
      }
    })
    .catch((err: unknown) => {
      if (controller.signal.aborted) return;
      clearInterval(stepInterval);
      console.error(err);
      setStatus('fail');
      const message = isBackendError(err) ? err.message : '驗證服務暫時無法使用，請稍後再試';
      setErrorMsg(message);
      onFail('service', message);
    });

    return () => {
      clearInterval(stepInterval);
      controller.abort();
      if (completionTimer) clearTimeout(completionTimer);
    };
  }, [isOpen, code]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="w-full max-w-md bg-white p-8 rounded-3xl border-4 border-slate-900 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center text-center relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0f172a 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
            
            <div className="relative z-10 w-full">
              <div className="mb-6 flex justify-center relative">
                {status === 'validating' && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute inset-0 m-auto w-28 h-28 border-4 border-dashed border-amber-300 rounded-full"
                  />
                )}
                <motion.div 
                  initial={{ rotate: -10 }}
                  animate={status === 'validating' ? { rotate: [5, -5, 5] } : status === 'success' ? { rotate: 0, scale: 1.1 } : { rotate: 0 }}
                  transition={status === 'validating' ? { repeat: Infinity, duration: 0.5, ease: "easeInOut" } : { type: "spring" }}
                  className={`w-24 h-24 rounded-3xl border-4 border-slate-900 flex items-center justify-center relative z-10 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] ${status === 'success' ? 'bg-emerald-400' : status === 'fail' ? 'bg-rose-400' : 'bg-amber-400'}`}
                >
                  {status === 'success' ? (
                    <Check className="w-12 h-12 text-slate-900" strokeWidth={3} />
                  ) : status === 'fail' ? (
                    <ShieldAlert className="w-12 h-12 text-slate-900" strokeWidth={3} />
                  ) : (
                    <KeyRound className="w-12 h-12 text-slate-900" strokeWidth={3} />
                  )}
                </motion.div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-2">
                {status === 'success' ? '授權成功！' : status === 'fail' ? '憑證無效！' : '驗證邀請碼中...'}
              </h2>
              <div className="text-slate-500 font-bold mb-8 h-6 flex items-center justify-center gap-2">
                {status === 'validating' ? <><Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> {steps[currentStep]}</> : status === 'success' ? '歡迎使用系統，準備進入...' : (errorMsg || '存取被拒')}
              </div>

              {status !== 'fail' && (
                <div className="w-full">
                  <div
                    className="w-full h-8 bg-slate-50 rounded-xl border-4 border-slate-900 p-0.5 overflow-hidden shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)] relative"
                    role="progressbar"
                    aria-label={status === 'success' ? '邀請碼驗證完成' : '正在驗證邀請碼'}
                  >
                    <motion.div
                      className={`h-full w-1/3 rounded-md border-x-4 border-slate-900 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)] ${
                        status === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
                      }`}
                      animate={status === 'success' ? { x: '200%' } : { x: ['-120%', '320%'] }}
                      transition={status === 'success'
                        ? { duration: 0.35, ease: 'easeOut' }
                        : { repeat: Infinity, duration: 1.15, ease: 'linear' }}
                    />
                  </div>
                  <div className="mt-3 text-center font-black text-slate-600 text-sm tracking-widest">
                    {status === 'success' ? '驗證完成' : '安全驗證進行中'}
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
