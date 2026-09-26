import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, BookOpenCheck, CalendarClock, Check, CircleAlert, MessageCircle, ShieldAlert, X } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import './disclaimer-modal.css';

interface Props { isOpen: boolean; onClose: () => void; }

const notices = [
  { title: '落點是推估', text: '推薦校科與落點區間協助規劃志願，無法保證實際錄取。', icon: ShieldAlert },
  { title: '招生條件會變動', text: '名額、報名人數、比序規則與政策，每年都可能調整。', icon: CalendarClock },
  { title: '以官方資訊為準', text: '資格、時程與錄取結果，請依當學年度招生簡章及公告確認。', icon: BookOpenCheck },
];

export default function DisclaimerModal({ isOpen, onClose }: Props) {
  const dialogRef = useRef<HTMLElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen]);

  return <AnimatePresence>{isOpen && <div className="disclaimer-overlay">
    <motion.div className="disclaimer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden="true" />
    <motion.section
      ref={dialogRef}
      tabIndex={-1}
      initial={{ opacity: 0, y: 16, scale: .98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: .98 }}
      transition={{ duration: .25 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-modal-title"
      className="disclaimer-dialog"
    >
      <header className="disclaimer-header">
        <div className="disclaimer-heading-row">
          <span className="disclaimer-icon"><CircleAlert aria-hidden="true" size={23} /></span>
          <div className="disclaimer-heading-copy">
            <p className="disclaimer-kicker">使用前提醒</p>
            <h2 id="disclaimer-modal-title">先了解分析結果的用途</h2>
          </div>
          <button type="button" className="disclaimer-close" onClick={onClose} aria-label="關閉免責聲明"><X aria-hidden="true" size={20} /></button>
        </div>
      </header>

      <div className="disclaimer-content">
        <div className="disclaimer-principle"><span>最重要的原則</span><strong>分析結果僅供規劃參考，無法保證錄取。</strong></div>
        <div className="disclaimer-notices">{notices.map(({ title, text, icon: Icon }) => <article key={title}>
          <span className="disclaimer-notice-icon"><Icon aria-hidden="true" size={20} /></span>
          <div><h3>{title}</h3><p>{text}</p></div>
        </article>)}</div>
        <aside className="disclaimer-line" aria-label="本站 LINE 資訊">
          <span className="disclaimer-line-icon"><MessageCircle aria-hidden="true" size={20} /></span>
          <div><strong>想持續掌握升學資訊？</strong><p>加入本站 LINE，查看升學消息與常用功能。</p></div>
          <a href="https://line.me/R/ti/p/@166zozmd" target="_blank" rel="noopener noreferrer" aria-label="加入本站 LINE（另開新分頁）">加入 LINE<ArrowUpRight aria-hidden="true" size={16} /></a>
        </aside>
      </div>

      <footer className="disclaimer-footer"><button type="button" onClick={onClose}><Check aria-hidden="true" size={20} />我已了解，開始使用</button></footer>
    </motion.section>
  </div>}</AnimatePresence>;
}
