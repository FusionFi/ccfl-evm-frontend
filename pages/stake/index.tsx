import Stake from '@/components/stake/stake.component';
import { MainFooter } from '@/layouts/footer.component';
import cssClass from '@/pages/stake/index.module.scss';
import { twMerge } from 'tailwind-merge';
export default function StakePage() {
  return (
    <div className={twMerge('stake-page-container', cssClass.stakePage)}>
      <Stake />
      <MainFooter />
    </div>
  );
}
