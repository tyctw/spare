import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, ChevronRight, List, Megaphone, ShieldCheck } from 'lucide-react';
import { withBasePath } from '../lib/routes';
import { getNewsArticle, newsArticles } from '../lib/news';
import './news-article-page.css';

export default function NewsArticlePage({ articleId }: { articleId: string }) {
  const article = getNewsArticle(articleId);
  if (!article) return <main className="article-page"><div className="article-shell article-not-found"><Megaphone size={32} /><h1>找不到這篇消息</h1><p>這篇文章可能已移動，請回到最新消息列表查看。</p><a href={withBasePath('/news')}>返回最新消息<ArrowRight size={17} /></a></div></main>;

  const ordered = [...newsArticles].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || Number(b.id) - Number(a.id));
  const position = ordered.findIndex((item) => item.id === article.id);
  const newer = position > 0 ? ordered[position - 1] : undefined;
  const older = position < ordered.length - 1 ? ordered[position + 1] : undefined;
  const related = ordered.filter((item) => item.id !== article.id).sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category)).slice(0, 2);

  return <main className="article-page"><article className="article-shell">
    <nav className="article-breadcrumb" aria-label="麵包屑"><a href={withBasePath('/news')}>最新消息</a><ChevronRight size={14} /><span aria-current="page">{article.category}</span></nav>
    <header className="article-header"><div className="article-heading"><div className="article-meta"><span className="article-category"><Megaphone size={14} />{article.category}</span><time dateTime={article.publishedAt}><CalendarDays size={15} />{article.publishedLabel}</time></div><h1>{article.title}</h1><p className="article-deck">{article.summary}</p></div><div className="article-header-rule"><span>NEWS / {article.id}</span><span>網站最新動態</span></div></header>
    <div className="article-layout"><aside className="article-sidebar"><div className="article-sidebar-inner"><p className="article-sidebar-label"><List size={15} />本篇內容</p><nav aria-label="文章段落">{article.body.map((section, index) => <a href={`#section-${index + 1}`} key={`${index}-${section.heading}`}><span>{String(index + 1).padStart(2, '0')}</span>{section.heading}</a>)}</nav><a className="article-sidebar-back" href={withBasePath('/news')}><ArrowLeft size={15} />返回消息列表</a></div><details className="article-mobile-toc"><summary><List size={17} />本篇內容<span>{article.body.length} 個段落</span><ChevronRight size={17} /></summary><nav aria-label="手機版文章段落">{article.body.map((section, index) => <a href={`#section-${index + 1}`} key={`${index}-${section.heading}`}><span>{String(index + 1).padStart(2, '0')}</span>{section.heading}</a>)}</nav></details></aside>
      <div className="article-main"><div className="article-body">{article.body.map((section, index) => <section id={`section-${index + 1}`} key={`${index}-${section.heading}`}><div className="article-section-heading"><span>{String(index + 1).padStart(2, '0')}</span><h2>{section.heading}</h2></div>{section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}</section>)}</div>
        {article.relatedLinks && article.relatedLinks.length > 0 && <section className="article-actions" aria-labelledby="article-actions-title"><div className="article-block-label">NEXT STEPS</div><h2 id="article-actions-title">接下來可以這樣做</h2><div className="article-action-links">{article.relatedLinks.map((link) => <a key={`${link.href}-${link.label}`} href={withBasePath(link.href)}><span>{link.label}</span><ArrowUpRight size={18} /></a>)}</div></section>}
        <aside className="article-source"><ShieldCheck size={20} /><div><h2>資料與提醒</h2><p>{article.sourceNote}</p></div></aside>
      </div>
    </div>
    <section className="article-more" aria-labelledby="article-more-title"><div className="article-more-heading"><div><p className="article-block-label">KEEP READING</p><h2 id="article-more-title">繼續閱讀</h2></div><a href={withBasePath('/news')}>查看全部消息<ArrowRight size={16} /></a></div><div className="article-more-grid">{related.map((item) => <a href={withBasePath(`/news/${item.id}`)} key={item.id}><span>{item.category} · {item.publishedLabel}</span><h3>{item.title}</h3><ArrowUpRight size={20} /></a>)}</div><div className="article-neighbor-nav">{newer ? <a href={withBasePath(`/news/${newer.id}`)}><span>較新的消息</span><strong><ArrowLeft size={16} />{newer.title}</strong></a> : <span />}{older ? <a href={withBasePath(`/news/${older.id}`)}><span>較早的消息</span><strong>{older.title}<ArrowRight size={16} /></strong></a> : <span />}</div></section>
  </article></main>;
}
