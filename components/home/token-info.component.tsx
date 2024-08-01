import cssClass from '@/components/home/token-info.component.module.scss';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';
export default function Banner() {
  return (
    <div className={twMerge(cssClass.tokenInfoComponent)}>
      <div className="token-info-container">
        <div className="content-left" data-aos="fade-right" data-aos-delay="200">
          <div className="title">About stOAS</div>
          <div className="description paragraph-1">
            When OAS is staked, stOAS is received. stOAS accumulates validator rewards from OAS, and
            upon unstaking, both the accumulated rewards and the original OAS are received.
          </div>
          <div className="description paragraph-2">
            stOAS(Staked OAS) is a Liquid Staking Token (LST) representing OAS. Being an ERC20
            token, it can be easily integrated into various applications.
          </div>
        </div>
        <div className="content-right" data-aos="fade-down" data-aos-delay="400">
          <Image src="/images/landing/token/stoas.png" alt="token" width={310} height={310} />
        </div>
      </div>
    </div>
  );
}
