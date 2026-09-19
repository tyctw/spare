import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Copy, Check, Facebook, X, Link2 } from 'lucide-react';

interface SharePlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
    </svg>
  );
}

function LineIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path fill="currentColor" d="M12 2C6.48 2 2 5.64 2 10.13c0 4.02 3.55 7.39 8.34 8.02.33.07.78.22.9.51.11.27.07.7.03.97l-.14.92c-.04.27-.2 1.06.89.58 1.09-.46 5.88-3.47 8.02-5.94C21.56 13.5 22 11.87 22 10.13 22 5.64 17.52 2 12 2Z" />
    <text x="12" y="12.9" textAnchor="middle" fill="#06C755" fontSize="5.2" fontWeight="900" fontFamily="Arial, sans-serif">LINE</text>
  </svg>;
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
      icon: LineIcon,
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
      icon: ThreadsIcon,
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
            className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
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
