import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { withBasePath } from '../../lib/routes';

const heroDesktopAvif = withBasePath('/images/hero/hero-desktop.avif');
const heroDesktopWebp = withBasePath('/images/hero/hero-desktop.webp');
const heroDesktopJpg = withBasePath('/images/hero/hero-desktop.jpg');
const heroMobileAvif = withBasePath('/images/hero/hero-mobile.avif');
const heroMobileWebp = withBasePath('/images/hero/hero-mobile.webp');
const heroMobileJpg = withBasePath('/images/hero/hero-mobile.jpg');

export default function HeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="home-hero"
      aria-labelledby="home-hero-title"
    >
      <picture className="home-hero-art" aria-hidden="true">
        <source media="(max-width: 900px)" srcSet={heroMobileAvif} type="image/avif" width={896} height={1200} />
        <source media="(max-width: 900px)" srcSet={heroMobileWebp} type="image/webp" width={896} height={1200} />
        <source media="(max-width: 900px)" srcSet={heroMobileJpg} type="image/jpeg" width={896} height={1200} />
        <source srcSet={heroDesktopAvif} type="image/avif" width={1376} height={768} />
        <source srcSet={heroDesktopWebp} type="image/webp" width={1376} height={768} />
        <img src={heroDesktopJpg} alt="" width={1376} height={768} decoding="async" fetchPriority="high" />
      </picture>

      <div className="home-hero-copy">
        <div className="home-hero-heading">
          <span className="home-hero-kicker"><Sparkles aria-hidden="true" size={17} />116 學年度會考落點分析</span>
          <h1 id="home-hero-title">探索適合你的<br /><span>未來理想校系</span></h1>
          <p className="home-hero-description">
            <span>輸入會考成績與就學區，落點一次看清楚。</span>
            <span>涵蓋全國高中職、五專與職群方向。</span>
            <span>協助你發掘潛能，找到理想的升學路。</span>
          </p>
          <a className="home-hero-cta" href="#analysis-form">
            開始落點分析
            <ArrowRight aria-hidden="true" size={19} />
          </a>
        </div>
      </div>

      <div className="home-hero-caption" aria-hidden="true">
        <p><mark>會考落點</mark>看得清！選得準。</p>
      </div>
    </motion.section>
  );
}
