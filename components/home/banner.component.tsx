import cssClass from '@/components/home/banner.component.module.scss';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
export default function Banner() {
  return (
    <div className={twMerge(cssClass.bannerComponent)}>
      <div className="banner-container" data-aos="fade-up" data-aos-delay="200">
        <div className="banner-title">
          <div className="banner-title-1">Liquid Restaking</div>
          <div className="banner-title-2">
            <div>For </div> <div className="large">Oasys</div>
          </div>
        </div>
        <div className="banner-actions">
          <Link href="/stake" className={`btn-primary-custom`}>
            Stake Now
          </Link>
        </div>
      </div>
    </div>
  );
}
