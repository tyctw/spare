import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

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
          <span className="home-hero-kicker"><Sparkles aria-hidden="true" size={20} />116 學年度會考落點分析</span>
          <h1 id="home-hero-title">探索適合你的<br /><span>未來理想校系</span></h1>
          <p className="home-hero-description">我們致力於提供完善的會考落點資訊，協助每位國中生發掘自身潛能，探索適合自己的高中職校與職群，找到理想的升學方向。</p>
        </div>
      </div>
    </motion.section>
  );
}
