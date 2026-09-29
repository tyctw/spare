import type { MouseEventHandler } from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import './page-breadcrumb.css';

export default function PageBreadcrumb({ title, parent, onHomeClick }: { title: string; parent?: { label: string; href: string }; onHomeClick?: MouseEventHandler<HTMLAnchorElement> }) {
  return <nav className="site-breadcrumb" aria-label="麵包屑導覽">
    <a href={withBasePath('/')} onClick={onHomeClick}><ArrowLeft size={15} aria-hidden="true" />返回首頁</a>
    <ChevronRight size={14} aria-hidden="true" />
    {parent && <><a href={withBasePath(parent.href)}>{parent.label}</a><ChevronRight size={14} aria-hidden="true" /></>}
    <span aria-current="page">{title}</span>
  </nav>;
}
