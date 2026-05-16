import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { InfoModal } from './InfoModals';
import { Share2, Copy, Check } from 'lucide-react';

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

  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      title="分享平台"
      icon={<Share2 className="w-8 h-8 text-emerald-500" />}
    >
      <div className="space-y-6 text-center flex flex-col items-center">
        <p className="text-slate-600 font-bold mb-2">請朋友掃描下方 QR Code 或複製網址分享</p>
        
        <div className="bg-white p-6 rounded-3xl border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] inline-block">
          <QRCodeSVG 
            value={platformUrl} 
            size={200} 
            level="H" 
            includeMargin={true}
            className="w-48 h-48 sm:w-64 sm:h-64"
          />
        </div>

        <div className="w-full max-w-md mx-auto pt-4 flex gap-2">
          <div className="flex-1 bg-slate-100 rounded-xl px-4 py-3 border-2 border-slate-900 overflow-hidden text-ellipsis whitespace-nowrap text-left font-bold text-slate-700">
            {platformUrl}
          </div>
          <button 
            onClick={handleCopy}
            className="shrink-0 bg-slate-900 text-white rounded-xl px-5 py-3 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(251,191,36,1)] hover:bg-slate-800 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center font-bold"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </InfoModal>
  );
}
