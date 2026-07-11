import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { InfoModal } from './InfoModals';
import { Share2, Copy, Check, Facebook, MessageCircle, AtSign } from 'lucide-react';

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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const shareLinks = [
    {
      id: 'line',
      name: 'LINE',
      icon: MessageCircle,
      bg: 'bg-[#06C755]',
      border: 'border-[#05a546]',
      text: 'text-white',
      url: `https://line.me/R/msg/text/?${encodeURIComponent('推薦這個超好用的會考落點分析平台！ ' + platformUrl)}`
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      bg: 'bg-[#1877F2]',
      border: 'border-[#1464cc]',
      text: 'text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(platformUrl)}`
    },
    {
      id: 'threads',
      name: 'Threads',
      icon: AtSign,
      bg: 'bg-black',
      border: 'border-slate-800',
      text: 'text-white',
      url: `https://www.threads.net/intent/post?text=${encodeURIComponent('推薦這個超好用的會考落點分析平台！ ' + platformUrl)}`
    }
  ];

  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      title="分享平台"
      icon={<Share2 className="w-8 h-8 text-emerald-500" />}
    >
      <div className="space-y-6 text-center flex flex-col items-center">
        <p className="text-slate-600 font-bold mb-2">請朋友掃描下方 QR Code 或點擊社群平台分享</p>
        
        <div className="bg-white p-6 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] inline-block">
          <QRCodeSVG 
            value={platformUrl} 
            size={180} 
            level="H" 
            includeMargin={true}
            role="img"
            aria-label="目前頁面的分享 QR Code"
            className="w-40 h-40 sm:w-56 sm:h-56"
          />
        </div>

        <div className="grid grid-cols-3 gap-3 w-full max-w-md pt-2">
          {shareLinks.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border-4 ${link.border} ${link.bg} shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all group`}
            >
              <div className="mb-1.5 group-hover:scale-110 transition-transform">
                <link.icon className={`w-6 h-6 sm:w-7 sm:h-7 ${link.text}`} />
              </div>
              <span className={`font-black ${link.text} text-xs sm:text-sm`}>{link.name}</span>
            </a>
          ))}
        </div>

        <div className="w-full max-w-md mx-auto pt-2 flex gap-2">
          <div className="flex-1 bg-slate-100 rounded-xl px-4 py-3 border-2 border-slate-900 overflow-hidden text-ellipsis whitespace-nowrap text-left font-bold text-slate-700">
            {platformUrl}
          </div>
          <button 
            type="button"
            onClick={handleCopy}
            aria-label={copied ? '已複製分享連結' : '複製分享連結'}
            aria-live="polite"
            className="shrink-0 bg-slate-900 text-white rounded-xl px-5 py-3 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:bg-slate-800 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center font-bold"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </InfoModal>
  );
}
