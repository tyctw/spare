import { useEffect, useState } from 'react';
import { ArrowRight, Crown, KeyRound, Sparkles } from 'lucide-react';
import { MEMBERSHIP_STATUS_EVENT, type MembershipStatus } from '../lib/membership';
import { withBasePath } from '../lib/routes';

export default function MembershipPromo() {
  const [hasActiveMembership, setHasActiveMembership] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const applyStatus = (status: MembershipStatus) => {
      if (isMounted) setHasActiveMembership(status.active);
    };
    const handleMembershipStatus = (event: Event) => {
      applyStatus((event as CustomEvent<MembershipStatus>).detail);
    };

    window.addEventListener(MEMBERSHIP_STATUS_EVENT, handleMembershipStatus);
    return () => {
      isMounted = false;
      window.removeEventListener(MEMBERSHIP_STATUS_EVENT, handleMembershipStatus);
    };
  }, []);

  if (hasActiveMembership) return null;

  return <section aria-labelledby="membership-promo-title" className="home-membership-promo">
    <span className="home-promo-icon"><Crown aria-hidden="true" size={24} /></span>
    <div className="home-promo-copy"><p>會員免廣告</p><h2 id="membership-promo-title">專心分析，不被廣告打斷。</h2><span>NT$49 起，免廣告、免輸入系統授權碼；LINE 登入可在其他裝置接續使用。</span><div><small><Sparkles aria-hidden="true" size={14} />查校不中斷</small><small><KeyRound aria-hidden="true" size={14} />免輸入授權碼</small></div></div>
    <a href={withBasePath('/membership')}>查看會員方案<ArrowRight aria-hidden="true" size={17} /></a>
  </section>;
}
