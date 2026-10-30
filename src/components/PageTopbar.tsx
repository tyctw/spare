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
    <a className="page-topbar-title" href={withBasePath('/')} onClick={onHomeClick}>{title}<span className="sr-only">，返回首頁</span></a>
    <a className="page-topbar-home" href={withBasePath('/')} onClick={onHomeClick}><ArrowLeft size={16} aria-hidden="true" />返回首頁</a>
  </nav>;
}
