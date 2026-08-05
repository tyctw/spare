import { useEffect, useState } from 'react';
import { Check, Copy, Loader2, Share2, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { callBackend } from '../lib/api';
import { withBasePath } from '../lib/routes';

type ShareKind = 'analysis' | 'volunteer';
type Props = { isOpen: boolean; onClose: () => void; kind: ShareKind; payload: Record<string, unknown> | null };
const text = {
  close: '\u95dc\u9589\u5206\u4eab\u8996\u7a97',
  title: '\u5206\u4eab\u7d66\u5bb6\u9577',
  expiry: '\u552f\u8b80\u9023\u7d50\u6709\u6548\u671f\u70ba 5 \u5929\u3002',
  snapshot: '\u6703\u5efa\u7acb\u73fe\u5728\u5831\u544a\u7684\u5feb\u7167\uff0c\u5f8c\u7e8c\u4fee\u6539\u4e0d\u6703\u5f71\u97ff\u5df2\u5206\u4eab\u7684\u5167\u5bb9\u3002',
  create: '\u5efa\u7acb\u552f\u8b80\u9023\u7d50',
  scan: '\u6383\u63cf QR Code\uff0c\u6216\u8907\u88fd\u4e0b\u65b9\u9023\u7d50\u4ee5\u958b\u555f\u552f\u8b80\u5831\u544a\u3002',
  copied: '\u5df2\u8907\u88fd',
  copy: '\u8907\u88fd',
  createError: '\u7121\u6cd5\u5efa\u7acb\u5206\u4eab\u9023\u7d50\uff0c\u8acb\u7a0d\u5f8c\u518d\u8a66\u3002',
  copyError: '\u7121\u6cd5\u81ea\u52d5\u8907\u88fd\uff0c\u8acb\u624b\u52d5\u8907\u88fd\u9023\u7d50\u3002',
};

export default function ShareReportDialog({ isOpen, onClose, kind, payload }: Props) {
  const [url, setUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => { if (isOpen) { setUrl(''); setError(''); setCopied(false); } }, [isOpen, payload]);

  const createLink = async () => {
    if (!payload) return;
    setIsCreating(true); setError('');
    try {
      const response = await callBackend<{ token: string }>({ action: 'createSharedReport', kind, payload });
      setUrl(`${window.location.origin}${withBasePath(`/shared/${response.token}`)}`);
    } catch (err) { setError(err instanceof Error ? err.message : text.createError); }
    finally { setIsCreating(false); }
  };
  const copyLink = async () => {
    if (!url) return;
    try { await navigator.clipboard.writeText(url); setCopied(true); }
    catch { setError(text.copyError); }
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
    <button aria-label={text.close} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
    <section role="dialog" aria-modal="true" aria-labelledby="share-report-title" className="relative w-full max-w-md overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
      <header className="flex items-start justify-between gap-3 border-b-4 border-slate-900 bg-indigo-600 p-5 text-white"><div><h2 id="share-report-title" className="text-xl font-black">{text.title}</h2><p className="mt-1 text-sm font-bold text-indigo-100">{text.expiry}</p></div><button onClick={onClose} className="rounded-xl border-2 border-slate-900 bg-white p-2 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]"><X className="h-5 w-5" /></button></header>
      <div className="p-5">{!url ? <><p className="text-sm font-bold leading-6 text-slate-600">{text.snapshot}</p><button onClick={createLink} disabled={!payload || isCreating} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-300 px-4 py-3 font-black text-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] disabled:opacity-50">{isCreating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Share2 className="h-5 w-5" />}{text.create}</button></> : <div className="flex flex-col items-center"><div className="rounded-2xl border-2 border-slate-900 bg-white p-3"><QRCodeSVG value={url} size={180} includeMargin /></div><p className="mt-4 text-center text-xs font-bold leading-5 text-slate-500">{text.scan}</p><div className="mt-3 flex w-full gap-2"><input value={url} readOnly className="min-w-0 flex-1 rounded-xl border-2 border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600" /><button onClick={copyLink} className="inline-flex shrink-0 items-center gap-1 rounded-xl border-2 border-slate-900 bg-sky-300 px-3 py-2 text-sm font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? text.copied : text.copy}</button></div></div>}{error && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p>}</div>
    </section>
  </div>;
}
