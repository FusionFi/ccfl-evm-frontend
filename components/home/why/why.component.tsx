import cssClass from '@/components/home/why/why.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';
import SafeHtmlComponent from '@/components/common/safe-html.component';
import Image from 'next/image';
export default function WhyComponent() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.whyComponent)}>
      <div className="why-container">
        <div className="why-container-bg"> </div>
        <div className="why-title" data-aos="fade-down">
          <SafeHtmlComponent htmlContent={t('LANDING_PAGE_WHY_TITLE')} />
        </div>
        <div className="why-items">
          <div className="why-item" data-aos="fade-up" data-aos-duration="500" data-aos-delay="500">
            <div className="why-bg">
              <Image
                src="/images/landing/why/why-card.png"
                alt="why-bg"
                width={1360}
                height={384}
              />
            </div>
            <div className="why-icon">
              <Image src="/images/landing/why/why-1.png" alt="why1" width={535} height={551} />
            </div>
            <div className="why-content">
              <div className="why-label">{t('LANDING_PAGE_WHY_1_TITLE')}</div>
              <div className="why-description">{t('LANDING_PAGE_WHY_1_DESCRIPTION')}</div>
            </div>
          </div>
          <div
            className="why-item why-2"
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="1000">
            <div className="why-bg">
              <Image
                src="/images/landing/why/why-card.png"
                alt="why-bg"
                width={1360}
                height={384}
              />
            </div>
            <div className="why-icon">
              <Image src="/images/landing/why/why-2.png" alt="why2" width={500} height={456} />
            </div>
            <div className="why-content">
              <div className="why-label">{t('LANDING_PAGE_WHY_2_TITLE')}</div>
              <div className="why-description">{t('LANDING_PAGE_WHY_2_DESCRIPTION')}</div>
            </div>
          </div>
          <div
            className="why-item"
            data-aos="fade-up"
            data-aos-duration="500"
            data-aos-delay="1500">
            <div className="why-bg">
              <Image
                src="/images/landing/why/why-card.png"
                alt="why-bg"
                width={1360}
                height={384}
              />
            </div>
            <div className="why-icon">
              <Image src="/images/landing/why/why-3.png" alt="why3" width={486} height={456} />
            </div>
            <div className="why-content">
              <div className="why-label">{t('LANDING_PAGE_WHY_3_TITLE')}</div>
              <div className="why-description">{t('LANDING_PAGE_WHY_3_DESCRIPTION')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
