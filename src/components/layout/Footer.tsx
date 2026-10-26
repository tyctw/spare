import { ArrowUpRight, Copyright, Mail } from 'lucide-react';
import { withBasePath } from '../../lib/routes';
import './footer.css';

const columns = [
  {
    title: '成績與志願',
    links: [
      { label: '落點分析', href: '/' },
      { label: '會考成績查詢', href: '/score-inquiry' },
      { label: '模擬志願序', href: '/mock-volunteer' },
      { label: '志願選填攻略', href: '/strategy' },
    ],
  },
  {
    title: '學校與科別',
    links: [
      { label: '搜尋學校與科別', href: '/search' },
      { label: '學校類型解析', href: '/school-types' },
      { label: '技職群科百科', href: '/vocational-encyclopedia' },
      { label: '歷年會考統計', href: '/historical-stats' },
    ],
  },
  {
    title: '關於',
    links: [
      { label: '小額支持', href: '/support' },
      { label: '服務條款', href: '/terms' },
      { label: '隱私權政策', href: '/privacy' },
      { label: '網站地圖', href: '/site-map' },
    ],
  },
];

const watermarkText = Array.from({ length: 6 }, () => 'TW 會考落點分析');

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-card">
        <div className="site-footer-main">
          <section className="site-footer-brand" aria-label="TW 全國會考落點分析">
            <a href={withBasePath('/')} className="site-footer-wordmark" aria-label="回到首頁">
              會考<span>落點</span>分析
            </a>
            <p className="site-footer-tagline">把複雜的升學資訊整理得更清楚，陪你一步步找到適合自己的選擇。</p>
            <div className="site-footer-meta">
              <a href="mailto:tyctw.analyze@gmail.com" className="site-footer-mail">
                <Mail aria-hidden="true" size={16} />
                tyctw.analyze@gmail.com
                <ArrowUpRight aria-hidden="true" size={15} />
              </a>
            </div>
          </section>

          <nav className="site-footer-nav" aria-label="頁尾導覽">
            {columns.map((column) => (
              <div key={column.title} className="site-footer-col">
                <h2>{column.title}</h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a href={withBasePath(link.href)}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="site-footer-bar">
          <div className="site-footer-bar-copy">
            <Copyright aria-hidden="true" size={16} />
            <span>COPYRIGHT {new Date().getFullYear()}</span>
          </div>
          <div className="site-footer-watermark" aria-hidden="true">
            <div className="site-footer-watermark-track">
              {watermarkText.map((text, index) => (
                <span key={index}>{text}</span>
              ))}
            </div>
          </div>
          <a href={withBasePath('/privacy')} className="site-footer-bar-link">隱私權政策</a>
        </div>
      </div>
    </footer>
  );
}
