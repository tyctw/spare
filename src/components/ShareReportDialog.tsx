import { useEffect, useState } from "react";
import {
  Check,
  Clock3,
  Copy,
  CopyPlus,
  Link,
  Loader2,
  LockKeyhole,
  Share2,
  Users,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { callBackend } from "../lib/api";
import { withBasePath } from "../lib/routes";

type ShareKind = "analysis" | "volunteer";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  kind: ShareKind;
  payload: Record<string, unknown> | null;
  snapshotKey: string;
};
const text = {
  close: "\u95dc\u9589\u5206\u4eab\u8996\u7a97",
  title: "\u5206\u4eab\u7d66\u5bb6\u9577",
  expiry: "\u552f\u8b80\u9023\u7d50\u6709\u6548\u671f\u70ba 5 \u5929\u3002",
  memberExpiry: "會員專屬連結不會失效；分享內容維持建立當下的快照。",
  snapshot:
    "\u6703\u5efa\u7acb\u73fe\u5728\u5831\u544a\u7684\u5feb\u7167\uff0c\u5f8c\u7e8c\u4fee\u6539\u4e0d\u6703\u5f71\u97ff\u5df2\u5206\u4eab\u7684\u5167\u5bb9\u3002",
  create: "\u5efa\u7acb\u552f\u8b80\u9023\u7d50",
  scan: "\u6383\u63cf QR Code\uff0c\u6216\u8907\u88fd\u4e0b\u65b9\u9023\u7d50\u4ee5\u958b\u555f\u552f\u8b80\u5831\u544a\u3002",
  copied: "\u5df2\u8907\u88fd",
  copy: "\u8907\u88fd",
  createError:
    "\u7121\u6cd5\u5efa\u7acb\u5206\u4eab\u9023\u7d50\uff0c\u8acb\u7a0d\u5f8c\u518d\u8a66\u3002",
  copyError:
    "\u7121\u6cd5\u81ea\u52d5\u8907\u88fd\uff0c\u8acb\u624b\u52d5\u8907\u88fd\u9023\u7d50\u3002",
};

export default function ShareReportDialog({
  isOpen,
  onClose,
  kind,
  payload,
  snapshotKey,
}: Props) {
  const [url, setUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isMemberShare, setIsMemberShare] = useState(false);
  const [isCheckingMembership, setIsCheckingMembership] = useState(false);

  // Keep a previously created link for the same list. A list change means a
  // new snapshot must be created, so the old link is intentionally discarded.
  useEffect(() => {
    setUrl("");
    setError("");
    setCopied(false);
  }, [snapshotKey]);

  useEffect(() => {
    let cancelled = false;
    if (!isOpen || kind !== "volunteer") {
      setIsMemberShare(false);
      setIsCheckingMembership(false);
      return () => { cancelled = true; };
    }

    setIsCheckingMembership(true);
    callBackend<{ active?: boolean }>({ action: "getMembershipStatus" })
      .then((status) => {
        if (!cancelled) setIsMemberShare(status.active === true);
      })
      .catch(() => {
        if (!cancelled) setIsMemberShare(false);
      })
      .finally(() => {
        if (!cancelled) setIsCheckingMembership(false);
      });
    return () => { cancelled = true; };
  }, [isOpen, kind]);

  const createLink = async () => {
    if (!payload) return;
    setIsCreating(true);
    setError("");
    try {
      const response = await callBackend<{ token: string }>({
        action: "createSharedReport",
        kind,
        payload,
        persistent: isMemberShare,
      });
      setUrl(
        `${window.location.origin}${withBasePath(`/shared/${response.token}`)}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : text.createError);
    } finally {
      setIsCreating(false);
    }
  };
  const copyLink = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setError(text.copyError);
    }
  };
  if (!isOpen) return null;
  const durationText = isMemberShare ? text.memberExpiry : text.expiry;
  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 sm:p-6">
      <button
        aria-label={text.close}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-report-title"
      className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border-4 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(15,23,42,1)]"
      >
        <header className="relative overflow-hidden border-b-4 border-slate-900 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 px-5 pb-6 pt-5 text-white sm:px-7">
          <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border-4 border-white/20 bg-white/10" />
          <div className="pointer-events-none absolute right-16 top-10 h-12 w-12 rounded-full border-4 border-amber-200/50" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-3 py-1 text-[11px] font-black tracking-[0.14em] text-indigo-50">
                <Users className="h-3.5 w-3.5" />
                FAMILY VIEW
              </div>
              <h2
                id="share-report-title"
                className="mt-3 text-2xl font-black tracking-tight sm:text-3xl"
              >
                {text.title}
              </h2>
              <p className="mt-2 max-w-sm text-sm font-bold leading-6 text-indigo-100">
                把目前志願整理成一份容易討論的唯讀清單。
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label={text.close}
              className="rounded-xl border-2 border-slate-900 bg-white p-2 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>
        <div className="p-5 sm:p-7">
          {!url ? (
            <>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-2.5 sm:p-3"><Share2 className="h-4 w-4 text-indigo-700 sm:h-5 sm:w-5" /><h3 className="mt-1.5 text-xs font-black text-slate-900 sm:mt-2 sm:text-sm">建立連結</h3><p className="mt-1 text-[10px] font-bold leading-4 text-slate-500 sm:text-xs sm:leading-5">一鍵產生可轉傳網址</p></div>
                <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-2.5 sm:p-3"><LockKeyhole className="h-4 w-4 text-indigo-700 sm:h-5 sm:w-5" /><h3 className="mt-1.5 text-xs font-black text-slate-900 sm:mt-2 sm:text-sm">安心查看</h3><p className="mt-1 text-[10px] font-bold leading-4 text-slate-500 sm:text-xs sm:leading-5">家長只能閱讀內容</p></div>
                <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-2.5 sm:p-3"><CopyPlus className="h-4 w-4 text-indigo-700 sm:h-5 sm:w-5" /><h3 className="mt-1.5 text-xs font-black text-slate-900 sm:mt-2 sm:text-sm">另存副本</h3><p className="mt-1 text-[10px] font-bold leading-4 text-slate-500 sm:text-xs sm:leading-5">對方可自行修改副本</p></div>
              </div>
              <div className="mt-5 flex items-center gap-2 rounded-xl border-2 border-amber-300 bg-amber-50 px-3 py-2.5 text-xs font-black text-amber-950">
                <Clock3 className="h-4 w-4 shrink-0" />
                {durationText}
              </div>
              <button
                onClick={createLink}
                disabled={!payload || isCreating || isCheckingMembership}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 bg-amber-300 px-4 py-3.5 font-black text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition hover:-translate-y-0.5 hover:bg-amber-400 active:translate-y-0 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Share2 className="h-5 w-5" />
                )}
                {isCreating ? "正在建立連結…" : isCheckingMembership ? "正在確認會員資格…" : text.create}
              </button>
            </>
          ) : (
            <>
              <div className="grid gap-5 md:grid-cols-[210px_minmax(0,1fr)] md:items-stretch">
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-4 text-center">
                  <p className="text-xs font-black tracking-wider text-indigo-700">手機掃描開啟</p>
                  <div className="mt-3 rounded-2xl border-2 border-slate-900 bg-white p-3 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
                    <QRCodeSVG value={url} size={160} includeMargin />
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-4 sm:p-5">
                  <div className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Link className="h-4 w-4 text-indigo-700" />
                    直接複製連結
                  </div>
                  <p className="mt-1 text-xs font-bold leading-5 text-slate-500">
                    {text.scan}
                  </p>
                  <p className="mt-4 break-all rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-3 font-mono text-xs font-bold leading-5 text-slate-600">
                    {url}
                  </p>
                  <button
                    onClick={copyLink}
                    className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-slate-900 px-4 py-3 text-sm font-black shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition active:translate-y-0 active:shadow-none ${copied ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
                  >
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied ? text.copied : text.copy}
                  </button>
                  <p className="mt-4 flex items-center gap-1.5 border-t-2 border-dashed border-slate-200 pt-3 text-xs font-black text-amber-800">
                    <Clock3 className="h-3.5 w-3.5" />
                    {durationText}
                  </p>
                </div>
              </div>
            </>
          )}
          {error && (
            <p
              role="alert"
              className="mt-4 rounded-xl border-2 border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700"
            >
              {error}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
