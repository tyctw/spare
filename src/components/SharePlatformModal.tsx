import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Copy, Check, Facebook, MessageCircle, AtSign, X, Link2 } from 'lucide-react';

interface SharePlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SharePlatformModal({ isOpen, onClose }: SharePlatformModalProps) {
  const [copied, setCopied] = React.useState(false);
  const platformUrl = window.location.href.split('?')[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(platformUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareLinks = [
    {
      id: 'line',
      name: 'LINE',
      icon: MessageCircle,
      className: 'bg-[#06C755] text-white hover:bg-[#05b94f]',
      url: `https://line.me/R/msg/text/?${encodeURIComponent(`推薦你使用這個會考落點分析工具：${platformUrl}`)}`,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      className: 'bg-[#1877F2] text-white hover:bg-[#1464cc]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(platformUrl)}`,
    },
    {
      id: 'threads',
      name: 'Threads',
      icon: AtSign,
      className: 'bg-slate-900 text-white hover:bg-slate-700',
      url: `https://www.threads.net/intent/post?text=${encodeURIComponent(`推薦你使用這個會考落點分析工具：${platformUrl}`)}`,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/65 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.section
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-platform-title"
            className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[9px_9px_0px_0px_rgba(15,23,42,1)]"
          >
            <div className="relative overflow-hidden border-b-4 border-slate-900 bg-gradient-to-br from-emerald-300 via-cyan-200 to-sky-200 p-5 sm:p-6">
              <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full border-4 border-white/50 bg-white/30" />
              <div className="pointer-events-none absolute -bottom-14 right-20 h-28 w-28 rotate-12 rounded-3xl border-4 border-emerald-400/50 bg-emerald-200/60" />
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-4 border-slate-900 bg-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                    <Share2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-[0.16em] text-emerald-800">SHARE THE TOOL</p>
                    <h2 id="share-platform-title" className="mt-0.5 text-2xl font-black tracking-tight text-slate-900">分享平台</h2>
                    <p className="mt-1 text-sm font-bold text-slate-700">把落點分析工具分享給需要的朋友</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="關閉分享平台"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-white text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-[190px_1fr] sm:p-6">
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-slate-900 bg-slate-50 p-4 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                <div className="rounded-2xl border-2 border-slate-900 bg-white p-2">
                  <QRCodeSVG
                    value={platformUrl}
                    size={156}
                    level="H"
                    includeMargin
                    role="img"
                    aria-label="分享連結 QR Code"
                    className="h-32 w-32 sm:h-36 sm:w-36"
                  />
                </div>
                <p className="mt-3 text-center text-xs font-black text-slate-600">掃描 QR Code 開啟網站</p>
              </div>

              <div className="min-w-0">
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border-2 border-slate-900 bg-amber-300">
                    <Share2 className="h-4 w-4" />
                  </span>
                  <h3 className="font-black text-slate-900">選擇分享方式</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {shareLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className={`group flex min-h-20 flex-col items-center justify-center rounded-2xl border-2 border-slate-900 p-2 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none ${link.className}`}
                    >
                      <link.icon className="h-6 w-6 transition-transform group-hover:scale-110" />
                      <span className="mt-1 text-[11px] font-black">{link.name}</span>
                    </a>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center gap-2 text-sm font-black text-slate-900">
                    <Link2 className="h-4 w-4 text-indigo-600" />
                    或複製分享連結
                  </div>
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1 truncate rounded-xl border-2 border-slate-900 bg-slate-50 px-3 py-2.5 text-xs font-bold text-slate-600">
                      {platformUrl}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      aria-label={copied ? '已複製分享連結' : '複製分享連結'}
                      aria-live="polite"
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition active:translate-y-0.5 active:shadow-none ${copied ? 'bg-emerald-400 text-slate-900' : 'bg-indigo-500 text-white hover:bg-indigo-400'}`}
                    >
                      {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-2 text-xs font-bold text-slate-500">{copied ? '連結已複製，可以直接貼給朋友。' : '複製後可貼到任何訊息或社群平台。'}</p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}
