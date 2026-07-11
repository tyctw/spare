import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { InfoModal } from './InfoModals';
import {
  AtSign,
  Check,
  Copy,
  ExternalLink,
  Facebook,
  Link as LinkIcon,
  MessageCircle,
  QrCode,
  Share2,
} from 'lucide-react';

interface SharePlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SharePlatformModal({ isOpen, onClose }: SharePlatformModalProps) {
  const [copied, setCopied] = React.useState(false);
  const platformUrl = window.location.href.split('?')[0];
  const shareText = `分享給你這個會考落點分析平台 ${platformUrl}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(platformUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareLinks = [
    {
      id: 'line',
      name: 'LINE',
      description: '傳給同學或家長',
      icon: MessageCircle,
      card: 'bg-[#06C755] border-[#049f44] text-white',
      glow: 'shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[7px_7px_0px_0px_rgba(4,159,68,0.45)]',
      url: `https://line.me/R/msg/text/?${encodeURIComponent(shareText)}`,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: '分享到動態消息',
      icon: Facebook,
      card: 'bg-[#1877F2] border-[#145ec0] text-white',
      glow: 'shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[7px_7px_0px_0px_rgba(24,119,242,0.35)]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(platformUrl)}`,
    },
    {
      id: 'threads',
      name: 'Threads',
      description: '發佈到 Threads',
      icon: AtSign,
      card: 'bg-slate-950 border-slate-700 text-white',
      glow: 'shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-[7px_7px_0px_0px_rgba(100,116,139,0.45)]',
      url: `https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}`,
    },
  ];

  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      title="分享平台"
      icon={<Share2 className="h-8 w-8 text-emerald-500" />}
    >
      <div className="overflow-hidden rounded-[1.75rem] border-4 border-slate-900 bg-slate-950 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.38),transparent_34%),linear-gradient(135deg,#0f172a_0%,#1e293b_48%,#064e3b_100%)] p-5 text-white sm:p-6">
          <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-emerald-100">
            SHARE
          </div>
          <div className="flex items-start gap-3 pr-20">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-white/30 bg-white text-slate-950 shadow-[3px_3px_0px_0px_rgba(16,185,129,0.8)]">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black leading-tight text-white">快速分享平台</h3>
              <p className="mt-1 text-sm font-bold leading-relaxed text-emerald-100">
                掃描 QR Code、貼上連結，或直接分享到常用社群。
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 bg-slate-50 p-4 sm:grid-cols-[minmax(190px,0.8fr)_1fr] sm:p-6">
          <div className="rounded-3xl border-4 border-slate-900 bg-white p-4 shadow-[5px_5px_0px_0px_rgba(15,23,42,1)]">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border border-slate-900 bg-emerald-400" />
                <span className="text-xs font-black uppercase tracking-wide text-slate-500">QR Code</span>
              </div>
              <Share2 className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mx-auto flex aspect-square max-w-[230px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-3">
              <QRCodeSVG
                value={platformUrl}
                size={190}
                level="H"
                includeMargin={true}
                role="img"
                aria-label="目前頁面的分享 QR Code"
                className="h-full w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {shareLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`分享到 ${link.name}，新分頁開啟`}
                className={`group flex items-center justify-between gap-4 rounded-2xl border-4 p-4 transition-all hover:-translate-y-1 active:translate-y-0 active:shadow-none ${link.card} ${link.glow}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-2 border-white/35 bg-white/15 transition-transform group-hover:scale-105">
                    <link.icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-base font-black leading-tight">{link.name}</div>
                    <div className="mt-0.5 truncate text-xs font-bold opacity-80">{link.description}</div>
                  </div>
                </div>
                <ExternalLink className="h-5 w-5 shrink-0 opacity-75 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </div>
        </div>

        <div className="border-t-4 border-slate-900 bg-white p-4 sm:p-5">
          <div className="flex flex-col gap-3 rounded-2xl border-2 border-slate-900 bg-slate-50 p-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-slate-900 bg-amber-300">
                <LinkIcon className="h-5 w-5 text-slate-900" />
              </div>
              <div className="min-w-0 text-left">
                <div className="text-xs font-black text-slate-500">分享連結</div>
                <div className="truncate text-sm font-black text-slate-900">{platformUrl}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={copied ? '已複製分享連結' : '複製分享連結'}
              aria-live="polite"
              className={`flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-slate-900 px-5 font-black transition-all active:translate-y-1 active:shadow-none ${
                copied
                  ? 'bg-emerald-400 text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]'
                  : 'bg-slate-900 text-white shadow-[3px_3px_0px_0px_rgba(251,191,36,1)] hover:bg-slate-800'
              }`}
            >
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
              <span>{copied ? '已複製' : '複製'}</span>
            </button>
          </div>
        </div>
      </div>
    </InfoModal>
  );
}
