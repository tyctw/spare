import type { MouseEventHandler } from 'react';
import { withBasePath } from '../lib/routes';
import './page-topbar.css';

export default function PageTopbar({ title, onHomeClick }: {
  title: string;
  parent?: { label: string; href: string };
  onHomeClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return <nav className="page-topbar" aria-label="頁面導覽">
    <p className="page-topbar-title">{title}</p>
    <a href={withBasePath('/')} onClick={onHomeClick}>返回首頁</a>
  </nav>;
}
