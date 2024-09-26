import cssClass from '@/components/home/banner/banner.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';
export default function BannerComponent() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.bannerContent)}>
      <div className="banner-container">banner component here</div>
    </div>
  );
}
