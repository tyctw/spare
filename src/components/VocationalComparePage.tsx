import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Briefcase, Check, Compass, Info, Search, X } from 'lucide-react';
import { groups } from '../lib/vocationalGroups';
import { withBasePath } from '../lib/routes';
import './vocational-compare-page.css';

const dimensions = [
  { id: 'learning', label: '學什麼', icon: BookOpen, description: '比較每天會接觸的課程與常見科別，想想哪一種學習讓你願意投入。', fields: [['主要學習內容', 'learning'], ['常見相關科別', 'majors']] },
  { id: 'future', label: '往哪裡走', icon: Briefcase, description: '看看升學與職涯可能延伸的方向。這些是探索線索，不是唯一的出路。', fields: [['升學延伸方向', 'furtherStudy'], ['可能職涯方向', 'careers']] },
  { id: 'interest', label: '適合我嗎', icon: Compass, description: '從興趣和願意培養的能力出發，檢查自己是否喜歡實際的學習過程。', fields: [['適合培養的特質', 'traits'], ['Holland 興趣提醒', 'hollandDesc'], ['選擇前，先問自己', 'selectionTip']] },
] as const;

type DimensionId = (typeof dimensions)[number]['id'];

export default function VocationalComparePage() {
  const [ids, setIds] = useState<string[]>(() => Array.from(new Set(new URLSearchParams(window.location.search).getAll('group'))).filter((id) => groups.some((group) => group.id === id)).slice(0, 3));
  const [dimension, setDimension] = useState<DimensionId>('learning');
  const [query, setQuery] = useState('');
  const selected = ids.map((id) => groups.find((group) => group.id === id)!);
  const active = dimensions.find((item) => item.id === dimension)!;
  const filteredGroups = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('zh-TW');
    if (!term) return groups;
    return groups.filter((group) => [group.id, group.summary, ...group.majors].some((value) => value.toLocaleLowerCase('zh-TW').includes(term)));
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams();
    ids.forEach((id) => params.append('group', id));
    window.history.replaceState(null, '', `${withBasePath('/vocational-compare')}${params.size ? `?${params}` : ''}`);
  }, [ids]);

  const toggle = (id: string) => setIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);

  return (
    <main className="vc-page">
      <div className="vc-shell">
        <nav className="vc-breadcrumb" aria-label="麵包屑導覽">
          <a href={withBasePath('/vocational-encyclopedia')}><ArrowLeft size={15} />職群科系百科</a>
          <span aria-hidden="true">/</span>
          <span>職群比較</span>
        </nav>

        <header className="vc-hero">
          <div>
            <p className="vc-kicker"><Compass size={16} />探索選擇 · 比較方向</p>
            <h1>把感興趣的職群，<span>放在一起看。</span></h1>
            <p className="vc-intro">不用一次決定未來。先挑選 2～3 個職群，再從學習內容、發展方向與個人興趣，找到值得深入了解的選項。</p>
          </div>
          <div className="vc-hero-guide" aria-label="比較步驟">
            <div><span>01</span><p>挑選職群</p></div>
            <ArrowRight size={17} aria-hidden="true" />
            <div><span>02</span><p>切換面向</p></div>
            <ArrowRight size={17} aria-hidden="true" />
            <div><span>03</span><p>深入了解</p></div>
          </div>
        </header>

        <div className="vc-layout">
          <section className="vc-picker" aria-labelledby="choose-heading">
            <div className="vc-section-heading">
              <div><span className="vc-section-number">01 / SELECT</span><h2 id="choose-heading">選擇比較職群</h2></div>
              <span className="vc-count">{ids.length} / 3</span>
            </div>
            <p className="vc-section-description">至少選 2 個，最多選 3 個；點選已加入的職群即可移除。</p>

            <div className="vc-selected" aria-label="已選職群">
              {[0, 1, 2].map((index) => {
                const group = selected[index];
                return group ? (
                  <div className={`vc-selected-item vc-tone-${index + 1}`} key={group.id}>
                    <span className="vc-selected-icon" aria-hidden="true">{group.icon}</span>
                    <span><small>比較職群 {String(index + 1).padStart(2, '0')}</small><strong>{group.id}</strong></span>
                    <button type="button" onClick={() => toggle(group.id)} aria-label={`移除${group.id}`}><X size={15} /></button>
                  </div>
                ) : <div className="vc-selected-empty" key={index}><span>{String(index + 1).padStart(2, '0')}</span>{index === 2 ? '可再加入一個' : '尚未選擇'}</div>;
              })}
            </div>

            <div className="vc-picker-tools">
              <div className="vc-search">
                <Search size={17} aria-hidden="true" />
                <input type="search" aria-label="搜尋職群或科別" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋職群或科別" />
                {query && <button type="button" aria-label="清除搜尋" onClick={() => setQuery('')}><X size={15} /></button>}
              </div>
              <button type="button" className="vc-clear" disabled={!ids.length} onClick={() => setIds([])}>清空選擇</button>
            </div>

            <div className="vc-group-list" aria-label="可比較的職群">
              {filteredGroups.length ? filteredGroups.map((group) => {
                const isSelected = ids.includes(group.id);
                const disabled = ids.length === 3 && !isSelected;
                return <button type="button" key={group.id} className={`vc-group-option${isSelected ? ' is-selected' : ''}`} aria-pressed={isSelected} disabled={disabled} onClick={() => toggle(group.id)}>
                  <span className="vc-group-icon" aria-hidden="true">{group.icon}</span>
                  <span className="vc-group-name"><strong>{group.id}</strong><small>{group.majors.slice(0, 2).join(' · ')}</small></span>
                  <span className="vc-group-check" aria-hidden="true">{isSelected && <Check size={15} />}</span>
                </button>;
              }) : <p className="vc-no-match">找不到符合的職群或科別，請試試其他關鍵字。</p>}
            </div>
            <p className="vc-picker-status" role="status">{ids.length === 3 ? '已選滿 3 個；移除一個即可更換。' : ids.length < 2 ? '再選擇職群，即可開始比較。' : '已可開始比較，也能再加入一個職群。'}</p>
          </section>

          <section className="vc-results" id="compare-results" aria-labelledby="compare-heading">
            <div className="vc-section-heading">
              <div><span className="vc-section-number">02 / COMPARE</span><h2 id="compare-heading">換個角度，看見差異</h2></div>
              <span className="vc-result-count">{selected.length >= 2 ? `比較 ${selected.length} 個職群` : '等待選擇'}</span>
            </div>
            <p className="vc-section-description">先選一個面向，所有職群會用相同的項目呈現，方便逐一對照。</p>

            <div className="vc-dimensions" aria-label="比較面向">
              {dimensions.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-pressed={dimension === id} onClick={() => setDimension(id)}><Icon size={19} />{label}</button>)}
            </div>
            <p className="vc-dimension-description">{active.description}</p>

            {selected.length < 2 ? (
              <div className="vc-empty">
                <span><Compass size={28} /></span>
                <h3>先挑兩個想了解的方向</h3>
                <p>比較內容會依照你選擇的職群與面向顯示在這裡。</p>
                <a href="#choose-heading">前往選擇職群 <ArrowRight size={15} /></a>
              </div>
            ) : (
              <div className={`vc-comparison vc-columns-${selected.length}`}>
                {selected.map((group, index) => <article className={`vc-comparison-card vc-tone-${index + 1}`} key={group.id}>
                  <div className="vc-card-head">
                    <span className="vc-card-index">職群 {String(index + 1).padStart(2, '0')}</span>
                    <span className="vc-card-icon" aria-hidden="true">{group.icon}</span>
                    <h3>{group.id}</h3>
                    <p>{group.summary}</p>
                    {dimension === 'interest' && <span className="vc-holland">Holland {group.holland}</span>}
                  </div>
                  <div className="vc-card-body">
                    {active.fields.map(([label, key]) => <section key={key}>
                      <h4>{label}</h4>
                      {Array.isArray(group[key]) ? <ul>{(group[key] as string[]).map((item) => <li key={item}>{item}</li>)}</ul> : <p>{group[key]}</p>}
                    </section>)}
                  </div>
                  <div className="vc-card-actions">
                    <a className="vc-primary-link" href={withBasePath(`/search?${new URLSearchParams({ group: group.id })}`)}>查看開設學校 <ArrowUpRight size={16} /></a>
                    <a className="vc-secondary-link" href={withBasePath(`/vocational-encyclopedia?${new URLSearchParams({ group: group.id })}`)}>深入了解{group.id} <ArrowRight size={15} /></a>
                  </div>
                </article>)}
              </div>
            )}
          </section>
        </div>

        <aside className="vc-next-step">
          <span className="vc-next-step-icon"><Info size={20} /></span>
          <div><p>下一步，回到真實的學習生活。</p><span>比較課程之外，也看看學校設備、通勤與招生資訊。Holland 代碼只是探索興趣的線索；實際科別與招生情況，仍以各校當年度簡章為準。</span></div>
          <a href={withBasePath('/vocational-encyclopedia')}>瀏覽職群百科 <ArrowUpRight size={16} /></a>
        </aside>
      </div>
    </main>
  );
}
