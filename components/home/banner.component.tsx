import cssClass from '@/components/home/banner.component.module.scss';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import SafeHtmlComponent from '../common/safe-html.component';
export default function Banner() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.bannerComponent)}>
      <div className="banner-container">
        <div className="content-left" data-aos="fade-down">
          <div className="logo">
            <Image src="/images/landing/banner-logo.png" alt="logo" width={504} height={168} />
          </div>
          <div className="title">
            <SafeHtmlComponent htmlContent={t('LANDING_PAGE_BANNER_TITLE')} />
          </div>
          <div className="description">{t('LANDING_PAGE_BANNER_DESCRIPTION')}</div>
          <div className="btn-actions-container">
            <Link href="/supply">
              <Button className="btn-primary-custom">
                {t('LANDING_PAGE_BANNER_BTN_TITLE_LENDING')}
              </Button>
            </Link>
            <Link href="/borrow">
              <Button className="btn-outline-custom">
                {t('LANDING_PAGE_BANNER_BTN_TITLE_BORROW')}
              </Button>
            </Link>
          </div>
        </div>
        <div className="content-right" data-aos="fade-left" data-aos-delay="500">
          <div className="images-container">
            <Image
              className="image-coin"
              src="/images/landing/banner-coin.png"
              alt="banner coin"
              width={663}
              height={501}
            />
            <Image
              className="image-hand"
              src="/images/landing/banner-hand.png"
              alt="banner hand"
              width={1312}
              height={612}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
