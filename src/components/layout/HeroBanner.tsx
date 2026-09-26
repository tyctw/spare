import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { withBasePath } from '../../lib/routes';

export default function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="home-hero"
      aria-labelledby="home-hero-title"
    >
      <div className="home-hero-copy">
        <div className="home-hero-heading">
          <span className="home-hero-kicker"><Sparkles aria-hidden="true" size={16} />116 學年度會考落點分析</span>
          <h1 id="home-hero-title">探索適合你的<br /><span>未來理想校系</span></h1>
        </div>
        <div className="home-hero-details">
          <p>從就學區與會考成績出發，比較適合的高中職校科，整理下一步的志願方向。</p>
          <div className="home-hero-actions">
            <a href="#analysis-form" className="home-hero-primary">開始填寫資料<ArrowRight aria-hidden="true" size={18} /></a>
            <a href={withBasePath('/school-types')} className="home-hero-secondary">先認識學校類型<ArrowRight aria-hidden="true" size={16} /></a>
          </div>
          <span className="home-hero-note">依各就學區資料提供參考，實際結果仍以招生簡章為準。</span>
        </div>
      </div>
    </motion.section>
  );
}
