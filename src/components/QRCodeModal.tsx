import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Camera, AlertCircle, ExternalLink } from 'lucide-react';
import jsQR from 'jsqr';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onScan: (code: string) => void;
}

export default function QRCodeModal({ isOpen, onClose, onScan }: Props) {
  const [mode, setMode] = useState<'camera' | 'upload'>('camera');
  const [cameraError, setCameraError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    if (!isOpen) { 
      stopCamera();
      return;
    }
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen, mode]);

  const stopCamera = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        requestRef.current = requestAnimationFrame(tick);
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      // In an iframe (like AI Studio preview), camera might be blocked
      if (window.self !== window.top) {
        setCameraError('在預覽視窗中無法存取相機，請點擊畫面右上方的「在新分頁中開啟」，或切換至「圖片上傳」功能。');
      } else {
        setCameraError('無法存取相機：請確認您已允許瀏覽器使用相機權限。');
      }
    }
  };

  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          stopCamera();
          onScan(code.data);
          return;
        }
      }
    }
    requestRef.current = requestAnimationFrame(tick);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            onScan(code.data);
          } else {
            alert('無法從圖片中讀取 QR Code，請換一張圖片嘗試！');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col max-h-[90vh]"
          >
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-emerald-50 shrink-0">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Camera className="w-6 h-6 text-emerald-600" />
                掃描邀請碼
              </h2>
              <button 
                onClick={onClose} 
                className="p-2 bg-white hover:bg-slate-100 rounded-xl transition-colors border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
               <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => setMode('camera')}
                    className={`flex-1 py-2 font-bold text-sm rounded-xl border-2 transition-all flex items-center justify-center gap-1 ${
                      mode === 'camera' 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-900 hover:text-slate-900'
                    }`}
                  >
                    <Camera className="w-4 h-4" /> 鏡頭掃描
                  </button>
                  <button 
                    onClick={() => setMode('upload')}
                    className={`flex-1 py-2 font-bold text-sm rounded-xl border-2 transition-all flex items-center justify-center gap-1 ${
                      mode === 'upload' 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-900 hover:text-slate-900'
                    }`}
                  >
                    <Upload className="w-4 h-4" /> 圖片上傳
                  </button>
               </div>

               {mode === 'camera' ? (
                 <div className="w-full rounded-2xl overflow-hidden min-h-[300px] border-4 border-slate-900 bg-slate-100 flex items-center justify-center relative shadow-[inset_0px_0px_10px_rgba(0,0,0,0.1)]">
                    {cameraError ? (
                      <div className="p-6 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-rose-100 rounded-2xl border-2 border-slate-900 flex items-center justify-center mb-4 text-rose-500 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] -rotate-6">
                          <AlertCircle className="w-8 h-8" />
                        </div>
                        <p className="font-bold text-slate-700">{cameraError}</p>
                        {window.self !== window.top && (
                          <div className="mt-4 p-3 bg-amber-50 border-2 border-amber-200 rounded-xl text-amber-800 text-sm font-bold flex items-start gap-2">
                            <ExternalLink className="w-5 h-5 shrink-0" />
                            請使用「新分頁中開啟」或改用「圖片上傳」。
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        <div className="absolute inset-0 border-[40px] border-slate-900/40 z-10 pointer-events-none" />
                        <div className="absolute inset-0 m-auto w-3/4 h-1/2 border-2 border-white/50 z-20 pointer-events-none">
                          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400" />
                          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400" />
                          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400" />
                          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400" />
                        </div>
                      </>
                    )}
                 </div>
               ) : (
                 <div className="w-full min-h-[300px] rounded-2xl border-4 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center p-6 text-center hover:bg-slate-100 hover:border-slate-400 transition-colors">
                    <Upload className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="font-black text-lg text-slate-700 mb-2">上傳 QR Code 圖片</p>
                    <p className="font-bold text-slate-500 text-sm mb-6 max-w-[200px]">支援 JPG, PNG 等常見圖片格式</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-indigo-500 text-white font-black rounded-xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all flex items-center gap-2"
                    >
                      <Upload className="w-5 h-5" /> 選擇圖片
                    </button>
                 </div>
               )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
