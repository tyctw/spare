import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Clock3,
  Copy,
  Loader2,
  LockKeyhole,
  MessageSquare,
  Share2,
  X,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { callBackend } from "../lib/api";
import { withBasePath } from "../lib/routes";
import "./share-report-dialog.css";

type ShareKind = "analysis" | "volunteer";
type Props = {
  isOpen: boolean;
  onClose: () => void;
  kind: ShareKind;
  payload: Record<string, unknown> | null;
  snapshotKey: string;
};
const text = {
  close: '關閉分享視窗',
  createError: '無法建立分享連結，請稍後再試。',
  copyError: '無法自動複製，請手動複製連結。',
};

export default function ShareReportDialog({
  isOpen,
  onClose,
  kind,
  payload,
  snapshotKey,
}: Props) {
  const [url, setUrl] = useState("");
  const [editorUrl, setEditorUrl] = useState("");
  const [shareToken, setShareToken] = useState("");
  const [showEditorSettings, setShowEditorSettings] = useState(false);
  const [expiresInDays, setExpiresInDays] = useState(30);
  const [isManaging, setIsManaging] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedEditor, setCopiedEditor] = useState(false);
  const [isMemberShare, setIsMemberShare] = useState(false);
  const [isCheckingMembership, setIsCheckingMembership] = useState(false);
  const [collaborationEnabled, setCollaborationEnabled] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen, onClose]);

  // Keep a previously created link for the same list. A list change means a
  // new snapshot must be created, so the old link is intentionally discarded.
  useEffect(() => {
    setUrl("");
    setEditorUrl("");
    setShareToken("");
    setShowEditorSettings(false);
    setError("");
    setCopied(false);
    setCopiedEditor(false);
  }, [snapshotKey]);

  useEffect(() => {
    let cancelled = false;
    if (!isOpen || kind !== "volunteer") {
      setIsMemberShare(false);
      setCollaborationEnabled(false);
      setIsCheckingMembership(false);
      return () => {
        cancelled = true;
      };
    }

    setIsCheckingMembership(true);
    callBackend<{ active?: boolean }>({ action: "getMembershipStatus" })
      .then((status) => {
        if (!cancelled) {
          setIsMemberShare(status.active === true);
          setCollaborationEnabled(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsMemberShare(false);
          setCollaborationEnabled(false);
        }
      })
      .finally(() => {
        if (!cancelled) setIsCheckingMembership(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isOpen, kind]);

  const createLink = async () => {
    if (!payload) return;
    setIsCreating(true);
    setError("");
    try {
      const response = await callBackend<{
        token: string;
        collaborationKey?: string | null;
      }>({
        action: "createSharedReport",
        kind,
        payload,
        persistent: false,
        collaboration: collaborationEnabled,
        expiresInDays: isMemberShare ? expiresInDays : 5,
      });
      const readUrl = `${window.location.origin}${withBasePath(`/shared/${response.token}`)}`;
      setUrl(readUrl);
      setEditorUrl(
        response.collaborationKey
          ? `${readUrl}?collab=${encodeURIComponent(response.collaborationKey)}`
          : "",
      );
      setShareToken(response.token);
      setShowEditorSettings(false);
      setCopied(false);
      setCopiedEditor(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : text.createError);
    } finally {
      setIsCreating(false);
    }
  };
  const rotateEditorLink = async () => {
    if (!shareToken) return;
    setIsManaging(true);
    setError("");
    try {
      const response = await callBackend<{ collaborationKey: string }>({
        action: "rotateVolunteerShareEditorKey",
        token: shareToken,
      });
      setEditorUrl(
        `${url}?collab=${encodeURIComponent(response.collaborationKey)}`,
      );
      setCopiedEditor(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "無法更新協作連結。");
    } finally {
      setIsManaging(false);
    }
  };
  const revokeLink = async () => {
    if (
      !shareToken ||
      !window.confirm("停止後，閱讀與協作連結都會立刻失效。確定要停止分享嗎？")
    )
      return;
    setIsManaging(true);
    setError("");
    try {
      await callBackend({ action: "revokeVolunteerShare", token: shareToken });
      setUrl("");
      setEditorUrl("");
      setShareToken("");
      setShowEditorSettings(false);
      setError("此分享連結已停止，原網址無法再開啟。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "無法停止分享。");
    } finally {
      setIsManaging(false);
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
  const copyEditorLink = async () => {
    try {
      await navigator.clipboard.writeText(editorUrl);
      setCopiedEditor(true);
    } catch {
      setError(text.copyError);
    }
  };
  if (!isOpen) return null;
  const isVolunteer = kind === "volunteer";
  const durationText = `${isMemberShare ? expiresInDays : 5} 天`;
  return (
    <div className="share-dialog-backdrop">
      <button type="button" aria-label={text.close} className="share-dialog-overlay" onClick={onClose} />
      <section role="dialog" aria-modal="true" aria-labelledby="share-report-title" className="share-dialog">
        <header className="share-dialog-header">
          <div className="share-dialog-header-copy">
            <span className="share-dialog-kicker"><Share2 size={16} /> {isVolunteer ? '模擬志願序 · 分享' : '落點分析 · 分享'}</span>
            <h2 id="share-report-title">{url ? '分享連結已準備好' : isVolunteer ? '把志願表分享給家長' : '分享這份分析結果'}</h2>
            <p>{url ? '複製唯讀連結，傳給想一起討論的人。' : isVolunteer ? '讓家長依照目前順序查看校科，討論時有同一份清單可參考。' : '建立目前結果的唯讀快照，方便和家人一起查看。'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={text.close} autoFocus className="share-dialog-close"><X size={20} /></button>
        </header>

        <div className="share-dialog-body">
          {!url ? <>
            <section className="share-dialog-preview" aria-labelledby="share-preview-title">
              <div className="share-dialog-preview-icon"><LockKeyhole size={23} /></div>
              <div><span className="share-dialog-section-kicker">即將建立</span><h3 id="share-preview-title">{isVolunteer ? '唯讀分享清單' : '唯讀分析報告'}</h3><p>{isVolunteer ? '家長能查看內容，也可以另存副本自行調整；原本的清單不會被更動。' : '收到連結的人可查看目前分析結果，無法修改原報告。'}</p></div>
            </section>
            <div className="share-dialog-note"><Clock3 size={18} /><p><strong>連結有效 {durationText}</strong><span>分享的是建立當下的快照；之後調整原清單，這個連結不會跟著更新。</span></p></div>
            {isMemberShare && <div className="share-dialog-options">
              <label className="share-dialog-select-label" htmlFor="share-expiry">連結有效期限</label>
              <select id="share-expiry" value={expiresInDays} onChange={(event) => setExpiresInDays(Number(event.target.value))}><option value={7}>7 天</option><option value={30}>30 天</option><option value={90}>90 天</option></select>
              <label className="share-dialog-collab-option"><input type="checkbox" checked={collaborationEnabled} onChange={(event) => setCollaborationEnabled(event.target.checked)} /><span><strong><MessageSquare size={18} />另外產生協作編輯連結</strong><small>只把編輯連結私下傳給需要共同調整的人；一般唯讀連結仍不能修改。</small></span></label>
            </div>}
            {!isCheckingMembership && !isMemberShare && isVolunteer && <div className="share-dialog-member-hint"><MessageSquare size={19} /><p><strong>需要家長一起調整？</strong><span>會員可另外建立協作連結，保留留言與修改版本。</span></p><a href={withBasePath('/membership')}>了解會員功能 <ArrowRight size={15} /></a></div>}
          </> : <>
            <div className="share-dialog-success"><span><Check size={21} /></span><p><strong>唯讀連結已建立</strong><small>取得連結的人可以檢視及轉傳，請分享給預期的對象。</small></p></div>
            <section className="share-dialog-result" aria-labelledby="share-read-link-title"><div className="share-dialog-result-copy"><span className="share-dialog-section-kicker">給家長或老師查看</span><h3 id="share-read-link-title">唯讀連結</h3><p>{isVolunteer ? '對方只能看這份快照；若想自行調整，可在分享頁建立副本。' : '對方只能查看這份快照，無法修改分析結果。'}</p><label htmlFor="share-read-url" className="sr-only">唯讀分享網址</label><input id="share-read-url" readOnly value={url} onFocus={(event) => event.currentTarget.select()} /><div className="share-dialog-result-actions"><button type="button" onClick={copyLink}><Copy size={17} />{copied ? '已複製唯讀連結' : '複製唯讀連結'}</button><a href={url} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">預覽頁面 <ArrowRight size={16} /></a></div></div><div className="share-dialog-qr"><QRCodeSVG value={url} size={138} includeMargin /><span>掃描 QR Code 開啟</span></div></section>
            <div className="share-dialog-note"><Clock3 size={18} /><p><strong>連結有效 {durationText}</strong><span>到期後將無法再開啟。你也可以到分享管理中心提早撤銷。</span></p></div>
            {editorUrl && <section className="share-dialog-editor"><button type="button" className="share-dialog-editor-toggle" aria-expanded={showEditorSettings} onClick={() => setShowEditorSettings((value) => !value)}><span><LockKeyhole size={19} /><strong>協作編輯連結</strong><small>具備修改權限，請分開傳送</small></span><span aria-hidden="true">{showEditorSettings ? '收合 −' : '查看設定 ＋'}</span></button>{showEditorSettings && <div className="share-dialog-editor-content"><p>持有此連結的人可留言、調整志願及確認版本。換發後舊編輯連結會立刻失效。</p><label htmlFor="share-editor-url" className="sr-only">協作編輯網址</label><input id="share-editor-url" readOnly value={editorUrl} onFocus={(event) => event.currentTarget.select()} /><div className="share-dialog-editor-actions"><button type="button" onClick={copyEditorLink} disabled={isManaging}><Copy size={16} />{copiedEditor ? '已複製編輯連結' : '複製編輯連結'}</button><button type="button" onClick={rotateEditorLink} disabled={isManaging}>換發編輯連結</button><button type="button" onClick={revokeLink} disabled={isManaging}>停止分享</button></div></div>}</section>}
            {shareToken && isMemberShare && !editorUrl && <div className="share-dialog-revoke"><span>不再需要這份分享？停止後連結會立即失效。</span><button type="button" onClick={revokeLink} disabled={isManaging}>停止分享</button></div>}
          </>}
          {error && <p role="alert" className="share-dialog-error">{error}</p>}
          {url && <a href={withBasePath('/privacy-center')} className="share-dialog-manage"><span><strong>管理我的分享連結</strong><small>查看期限、撤銷連結與個資設定</small></span><ArrowRight size={18} /></a>}
        </div>

        <footer className="share-dialog-footer">
          {!url ? <><p><LockKeyhole size={15} />建立後才會產生可轉傳的網址</p><button type="button" onClick={createLink} disabled={!payload || isCreating || isCheckingMembership}>{isCreating ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}{isCreating ? '正在建立連結…' : isCheckingMembership ? '正在確認會員資格…' : '建立唯讀連結'}</button></> : <><p>分享連結已建立，可複製後傳給預期的對象。</p><button type="button" onClick={onClose}>完成 <Check size={18} /></button></>}
        </footer>
      </section>
    </div>
  );
}
