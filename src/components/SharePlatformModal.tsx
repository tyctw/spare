import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, Copy, Check, Facebook, X, Link2, QrCode } from 'lucide-react';

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
    <text x="12" y="12.9" textAnchor="middle" fill="#fff" fontSize="5.2" fontWeight="900" fontFamily="Arial, sans-serif">LINE</text>
  </svg>;
}

export default function SharePlatformModal({ isOpen, onClose }: SharePlatformModalProps) {
  const [copied, setCopied] = React.useState(false);
  const [copyError, setCopyError] = React.useState(false);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const platformUrl = window.location.href.split('?')[0];

  React.useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(platformUrl);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopyError(true);
    }
  };

  const shareLinks = [
    {
      id: 'line',
      name: 'LINE',
      icon: LineIcon,
      iconClassName: 'bg-[#e7f9ed] text-[#06a747]',
      url: `https://line.me/R/msg/text/?${encodeURIComponent(`推薦你使用這個會考落點分析工具：${platformUrl}`)}`,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      iconClassName: 'bg-[#e8f1ff] text-[#1877F2]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(platformUrl)}`,
    },
    {
      id: 'threads',
      name: 'Threads',
      icon: ThreadsIcon,
      iconClassName: 'bg-slate-100 text-slate-900',
      url: `https://www.threads.net/intent/post?text=${encodeURIComponent(`推薦你使用這個會考落點分析工具：${platformUrl}`)}`,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#17203a]/60 backdrop-blur-[3px]"
            onClick={onClose}
          />
          <motion.section
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-platform-title"
            aria-describedby="share-platform-description"
            className="relative max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-[26px] border border-[#e3e6f3] bg-[#fbfbfe] shadow-[0_28px_80px_rgba(16,26,62,0.25)] sm:max-h-[calc(100dvh-3rem)] sm:rounded-[28px]"
          >
            <div className="sticky top-0 z-10 border-b border-[#e7e9f4] bg-gradient-to-br from-[#f0edff] via-[#f9f8ff] to-white px-4 py-4 sm:relative sm:px-8 sm:py-7">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e4dcff] text-[#653cbd] sm:h-12 sm:w-12 sm:rounded-2xl">
                    <Share2 className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h2 id="share-platform-title" className="text-[22px] font-black tracking-tight text-[#202640] sm:text-[28px]">分享平台</h2>
                    <p id="share-platform-description" className="mt-0.5 text-xs leading-5 text-[#5f6881] sm:mt-1 sm:text-sm sm:leading-6">把會考落點分析分享給家人或朋友。</p>
                  </div>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label="關閉分享平台"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/85 text-[#556078] transition-colors hover:bg-white hover:text-[#202640] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6842c2]"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 p-4 pb-6 sm:gap-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_210px] md:gap-6">
              <div className="min-w-0 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-[15px] font-extrabold text-[#252c45] sm:text-base">分享到社群</h3>
                  <p className="mt-1 hidden text-xs leading-5 text-[#727a8d] sm:block">選擇常用的平台，分享頁面連結。</p>
                  <div className="mt-2 grid grid-cols-3 gap-2 sm:mt-3 sm:gap-3">
                    {shareLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`分享到 ${link.name}（另開新分頁）`}
                        className="group flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#e2e5ef] bg-white px-1 py-2 text-[#26304b] shadow-[0_4px_14px_rgba(35,45,80,0.04)] transition hover:-translate-y-0.5 hover:border-[#bcb0ee] hover:shadow-[0_9px_22px_rgba(64,47,121,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6842c2] sm:min-h-[94px] sm:gap-2 sm:px-2 sm:py-3"
                      >
                        <span className={`flex h-8 w-8 items-center justify-center rounded-lg sm:h-10 sm:w-10 sm:rounded-xl ${link.iconClassName}`}>
                          <link.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </span>
                        <span className="text-xs font-bold sm:text-sm">{link.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 text-[15px] font-extrabold text-[#252c45] sm:text-base">
                    <Link2 className="h-4 w-4 text-[#6842c2]" aria-hidden="true" />
                    複製分享連結
                  </h3>
                  <p className="mt-1 hidden text-xs leading-5 text-[#727a8d] sm:block">也可以把連結貼到訊息或其他平台。</p>
                  <div className="mt-2 flex gap-2 sm:mt-3">
                    <input
                      readOnly
                      value={platformUrl}
                      onFocus={(event) => event.currentTarget.select()}
                      aria-label="分享連結"
                      className="h-11 min-w-0 flex-1 rounded-xl border border-[#dfe3ee] bg-white px-3 text-sm text-[#536078] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6842c2]"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[#6034b8] px-3 text-xs font-bold text-white transition-colors hover:bg-[#4f269f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6842c2] sm:gap-2 sm:px-4 sm:text-sm"
                    >
                      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                      {copied ? '已複製' : '複製連結'}
                    </button>
                  </div>
                  <p role="status" className="mt-2 text-xs text-[#67718a] empty:hidden sm:min-h-5">
                    {copyError ? '無法自動複製，請選取上方連結手動複製。' : copied ? '連結已複製，可以貼給家人或朋友。' : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-[#f1edfc] p-3 md:flex-col md:justify-center md:gap-0 md:p-5 md:text-center">
                <div className="shrink-0 rounded-xl bg-white p-1.5 shadow-[0_8px_24px_rgba(61,45,119,0.1)] md:order-2 md:mt-4 md:rounded-2xl md:p-2">
                  <QRCodeSVG
                    value={platformUrl}
                    size={156}
                    level="H"
                    includeMargin
                    role="img"
                    aria-label="分享連結 QR Code"
                    className="h-24 w-24 md:h-36 md:w-36"
                  />
                </div>
                <div className="min-w-0 text-left md:contents">
                  <div className="flex items-center gap-2 text-sm font-extrabold text-[#4e398c] md:order-1">
                    <QrCode className="h-4 w-4" aria-hidden="true" />
                    掃描 QR Code
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[#6f668a] md:order-3 md:mt-4 md:text-center">用手機相機掃描，即可開啟目前頁面。</p>
                </div>
              </div>
            </div>

          </motion.section>
        </div>
      )}
    </AnimatePresence>
  );
}
