import type { MouseEventHandler } from 'react';
import { ArrowLeft } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import './page-topbar.css';

export default function PageTopbar({ title, onHomeClick }: {
  title: string;
  parent?: { label: string; href: string };
  onHomeClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return <nav className="page-topbar" aria-label="頁面導覽">
    <button type="button" className="page-topbar-title" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{title}<span className="sr-only">，捲動至頁面頂端</span></button>
    <a href={withBasePath('/')} onClick={onHomeClick}><ArrowLeft size={16} aria-hidden="true" />返回首頁</a>
  </nav>;
}
