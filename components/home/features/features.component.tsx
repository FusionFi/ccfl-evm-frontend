import cssClass from '@/components/home/features/features.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
export default function FeaturesComponent() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.featuresComponent)}>
      <div className="features-container">
        <div className="features-list">
          <div
            className="feature-item feature-1"
            data-aos="fade-left"
            data-aos-duration="300"
            data-aos-delay="300">
            <div className="feature-bg">
              <Image
                src="/images/landing/features/feature-card.png"
                alt="feature-bg"
                width={528}
                height={500}
              />
            </div>
            <div className="feature-icon">
              <Image
                src="/images/landing/features/feature-1.png"
                alt="feature1"
                width={590}
                height={492}
              />
            </div>
            <div className="feature-content">
              <div className="feature-title">{t('LANDING_PAGE_FEATURES_1_TITLE')}</div>
              <div className="feature-description">{t('LANDING_PAGE_FEATURES_1_DESCRIPTION')}</div>
            </div>
          </div>
          <div
            className="feature-item feature-2"
            data-aos="fade-left"
            data-aos-duration="300"
            data-aos-delay="600">
            <div className="feature-bg">
              <Image
                src="/images/landing/features/feature-card.png"
                alt="feature-bg"
                width={528}
                height={500}
              />
            </div>
            <div className="feature-icon">
              <Image
                src="/images/landing/features/feature-2.png"
                alt="feature2"
                width={590}
                height={492}
              />
            </div>
            <div className="feature-content">
              <div className="feature-title">{t('LANDING_PAGE_FEATURES_2_TITLE')}</div>
              <div className="feature-description">{t('LANDING_PAGE_FEATURES_2_DESCRIPTION')}</div>
            </div>
          </div>
          <div
            className="feature-item feature-3"
            data-aos="fade-left"
            data-aos-duration="300"
            data-aos-delay="900">
            <div className="feature-bg">
              <Image
                src="/images/landing/features/feature-card.png"
                alt="feature-bg"
                width={528}
                height={500}
              />
            </div>
            <div className="feature-icon">
              <Image
                src="/images/landing/features/feature-3.png"
                alt="feature3"
                width={590}
                height={492}
              />
            </div>
            <div className="feature-content">
              <div className="feature-title">{t('LANDING_PAGE_FEATURES_3_TITLE')}</div>
              <div className="feature-description">{t('LANDING_PAGE_FEATURES_3_DESCRIPTION')}</div>
            </div>
          </div>
          <div
            className="feature-item feature-4"
            data-aos="fade-left"
            data-aos-duration="300"
            data-aos-delay={1200}>
            <div className="feature-bg">
              <Image
                src="/images/landing/features/feature-card.png"
                alt="feature-bg"
                width={528}
                height={500}
              />
            </div>
            <div className="feature-icon">
              <Image
                src="/images/landing/features/feature-4.png"
                alt="feature4"
                width={590}
                height={492}
              />
            </div>
            <div className="feature-content">
              <div className="feature-title">{t('LANDING_PAGE_FEATURES_4_TITLE')}</div>
              <div className="feature-description">{t('LANDING_PAGE_FEATURES_4_DESCRIPTION')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
