import React, { useEffect, useMemo, useState } from 'react';
import { FileText } from 'lucide-react';

export interface PageNavigationItem {
  id: string;
  label: string;
  className?: string;
}

interface PageNavigationProps {
  items: PageNavigationItem[];
  title?: string;
  itemLayoutClassName?: string;
  navClassName?: string;
}

export default function PageNavigation({
  items,
  title = '頁面導覽',
  itemLayoutClassName = 'grid gap-2',
  navClassName = 'rounded-lg border-4 border-slate-900 bg-white p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]',
}: PageNavigationProps) {
  const validItems = useMemo(() => items.filter((item) => item.id && item.label), [items]);
  const itemIds = useMemo(() => validItems.map((item) => item.id).join('|'), [validItems]);
  const [activeId, setActiveId] = useState(validItems[0]?.id ?? '');

  useEffect(() => {
    if (validItems.length === 0) return;

    const updateActiveSection = () => {
      const anchorLine = window.scrollY + Math.min(180, window.innerHeight * 0.32);
      let currentId = validItems[0].id;

      for (const item of validItems) {
        const section = document.getElementById(item.id);
        if (!section) continue;
        if (section.offsetTop <= anchorLine) {
          currentId = item.id;
        }
      }

      setActiveId(currentId);
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [itemIds]);

  return (
    <nav className={navClassName}>
      <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-500">
        <FileText className="h-4 w-4" />
        {title}
      </div>
      <div className={itemLayoutClassName}>
        {validItems.map((item) => {
          const active = item.id === activeId;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active ? 'location' : undefined}
              className={`${item.className ?? ''} rounded-lg px-3 py-2 text-sm font-black transition-all ${
                active
                  ? 'translate-x-1 border-2 border-slate-900 bg-slate-900 text-white shadow-[2px_2px_0px_0px_rgba(244,63,94,1)]'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
