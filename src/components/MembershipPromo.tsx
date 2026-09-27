import { useEffect, useState } from 'react';
import { ArrowRight, Check, Crown } from 'lucide-react';
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

  return (
    <section aria-labelledby="membership-promo-title" className="home-membership-promo">
      <div className="home-promo-copy">
        <div className="home-promo-heading">
          <span className="home-promo-icon"><Crown aria-hidden="true" size={24} /></span>
          <div>
            <p>會員免廣告</p>
            <h2 id="membership-promo-title">專心分析，不被廣告打斷。</h2>
          </div>
        </div>
        <ul className="home-promo-benefits">
          <li><Check aria-hidden="true" size={16} />免廣告</li>
          <li><Check aria-hidden="true" size={16} />免輸入系統授權碼</li>
          <li><Check aria-hidden="true" size={16} />跨裝置接續</li>
        </ul>
      </div>
      <div className="home-promo-action">
        <span>會員方案</span>
        <strong>NT$49 <small>起</small></strong>
        <a href={withBasePath('/membership')}>查看會員方案<ArrowRight aria-hidden="true" size={18} /></a>
      </div>
    </section>
  );
}
