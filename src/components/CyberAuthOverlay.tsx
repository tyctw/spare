import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KeyRound, Check, ShieldAlert, Zap } from 'lucide-react';

interface Props {
  isOpen: boolean;
  code: string;
  onSuccess: () => void;
  onFail: () => void;
}

export default function CyberAuthOverlay({ isOpen, code, onSuccess, onFail }: Props) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'validating' | 'success' | 'fail'>('validating');
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "解析授權碼格式...",
    "建立安全連線通道...",
    "比對雲端憑證庫...",
    "金鑰驗證程序..."
  ];

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setStatus('validating');
      setCurrentStep(0);
      return;
    }

    let progressVal = 0;
    const progressInterval = setInterval(() => {
      progressVal += 1.5;
      if (progressVal >= 99) {
        progressVal = 99;
      }
      
      setProgress(progressVal);
      if (progressVal < 25) setCurrentStep(0);
      else if (progressVal < 50) setCurrentStep(1);
      else if (progressVal < 75) setCurrentStep(2);
      else setCurrentStep(3);
      
    }, 25);

    // Execute validation immediately
    fetch('https://script.google.com/macros/s/AKfycbxGOW2caEmqW51hNmTe3Kq24D-UzfhKuhtS3xMP0OB9WNCjxKvwSGU5W4VnszDjfdZw/exec', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'validateInvitationCode', invitationCode: code })
    })
    .then(res => res.json())
    .then(res => {
      clearInterval(progressInterval);
      setProgress(100);
      if (res.valid) {
        setStatus('success');
        onSuccess();
      } else {
        setStatus('fail');
        onFail();
      }
    })
    .catch(err => {
      clearInterval(progressInterval);
      setProgress(100);
      console.error(err);
      setStatus('fail');
      onFail();
    });

    return () => {
      clearInterval(progressInterval);
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
                {status === 'validating' ? <><Zap className="w-4 h-4 text-amber-500 fill-amber-500" /> {steps[currentStep]}</> : status === 'success' ? '歡迎使用系統，準備進入...' : '存取被拒，邀請碼錯誤或過期'}
              </div>

              {status === 'validating' && (
                <div className="w-full">
                  <div className="w-full h-8 bg-slate-50 rounded-xl border-4 border-slate-900 p-0.5 overflow-hidden shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)] relative">
                    <motion.div 
                      className="h-full bg-indigo-500 rounded-md border-r-4 border-slate-900 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(0,0,0,0.1)_10px,rgba(0,0,0,0.1)_20px)]"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-3 text-right font-black text-slate-900 text-xl tracking-tight">
                    {Math.floor(progress)}%
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
