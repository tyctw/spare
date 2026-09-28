import { ArrowRight, ChevronDown, List } from 'lucide-react';
import './mobile-contents-nav.css';

export interface MobileContentsItem {
  id: string;
  label: string;
  number?: string;
}

export default function MobileContentsNav({ items, activeId }: { items: MobileContentsItem[]; activeId?: string }) {
  if (items.length === 0) return null;

  return <details className="mobile-contents-nav">
    <summary>
      <span className="mobile-contents-nav-title"><List size={18} /><strong>本頁內容</strong></span>
      <span className="mobile-contents-nav-count">{items.length} 個章節</span>
      <ChevronDown size={18} aria-hidden="true" />
    </summary>
    <div className="mobile-contents-nav-links" role="navigation" aria-label="手機版頁內導覽">
      {items.map((item, index) => <a key={item.id} href={`#${item.id}`} aria-current={activeId === item.id ? 'location' : undefined} onClick={(event) => { const details = event.currentTarget.closest('details'); if (details) details.open = false; }}>
        <span>{item.number ?? String(index + 1).padStart(2, '0')}</span>{item.label}<ArrowRight size={15} aria-hidden="true" />
      </a>)}
    </div>
  </details>;
}
