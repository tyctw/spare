import React, { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Heart, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

const DONATION_URL = 'https://p.ecpay.com.tw/955D011';

interface DonationPageProps {
  onBack: () => void;
}

const DonationPage: React.FC<DonationPageProps> = ({ onBack }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    QRCode.toDataURL(DONATION_URL, {
      width: 440,
      margin: 2,
      errorCorrectionLevel: 'M',
      color: { dark: '#1e293b', light: '#ffffff' },
    }).then(setQrCodeUrl).catch(() => setQrCodeUrl(''));
  }, []);

  return (
  <main id="main-content" className="relative z-10 mx-auto max-w-4xl pb-12 opacity-0 animate-fade-in-up delay-100">
    <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-xl shadow-rose-100/50 backdrop-blur-xl">
      <div className="relative overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-violet-600 px-6 py-10 text-white sm:px-10 sm:py-14">
        <div className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-white/15 blur-2xl" aria-hidden="true" />
        <button type="button" onClick={onBack} className="relative mb-8 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white transition-colors hover:bg-white/25" aria-label="返回首頁">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="relative flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-lg shadow-rose-900/10"><Heart className="h-6 w-6 fill-current" /></span>
          <div>
            <p className="text-sm font-bold tracking-[0.18em] text-rose-100">SUPPORT FOCUS SPACE</p>
            <h1 className="mt-1 text-3xl font-black tracking-tight sm:text-4xl">小額贊助</h1>
          </div>
        </div>
        <p className="relative mt-5 max-w-xl text-sm font-semibold leading-relaxed text-rose-50 sm:text-base">如果這個網站有幫助到你的備考生活，歡迎用一杯飲料的心意支持我們持續維護與改善。</p>
      </div>

      <div className="grid items-center gap-8 p-6 sm:p-10 md:grid-cols-[1fr_280px]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-black text-rose-600"><Heart className="h-3.5 w-3.5 fill-current" />感謝你的支持</div>
          <h2 className="mt-5 text-2xl font-black tracking-tight text-slate-900">每一份心意，都讓網站走得更遠</h2>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">點擊按鈕或使用手機掃描 QR Code，即可前往綠界科技贊助頁面，自行選擇贊助金額。</p>
          <a href={DONATION_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-3.5 text-sm font-black text-white shadow-lg shadow-rose-200 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-rose-200">
            前往小額贊助 <ExternalLink className="h-4 w-4" />
          </a>
          <p className="mt-4 text-xs font-medium text-slate-400">將在新分頁開啟綠界科技付款頁面。</p>
        </div>

        <div className="rounded-[1.75rem] border border-rose-100 bg-gradient-to-b from-rose-50 to-white p-5 text-center shadow-sm">
          <div className="mb-3 flex items-center justify-center gap-2 text-sm font-black text-rose-600"><QrCode className="h-4 w-4" />掃描 QR Code 贊助</div>
          <a href={DONATION_URL} target="_blank" rel="noopener noreferrer" className="inline-block rounded-2xl bg-white p-3 shadow-md transition-transform hover:scale-[1.02]" aria-label="開啟小額贊助頁面">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} width="220" height="220" alt="前往 Focus Space 小額贊助頁面的 QR Code" className="h-[220px] w-[220px]" />
            ) : (
              <span className="flex h-[220px] w-[220px] items-center justify-center rounded-xl bg-slate-50 text-xs font-bold text-slate-400">正在產生 QR Code…</span>
            )}
          </a>
          <p className="mt-3 text-xs font-semibold text-slate-500">使用手機相機掃描即可開啟贊助頁面</p>
        </div>
      </div>
    </section>
  </main>
  );
};

export default DonationPage;
