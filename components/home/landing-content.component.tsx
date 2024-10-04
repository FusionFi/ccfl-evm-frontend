import cssClass from '@/components/home/landing-content.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';
import BannerComponent from './banner/banner.component';
import FeaturesComponent from './features/features.component';
import FormComponent from './form/form.component';
import WhyComponent from './why/why.component';
import WorksComponent from './works/works.component';
import { Element } from 'react-scroll';
import SafeHtmlComponent from '@/components/common/safe-html.component';
export default function LandingContent() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.landingContent)}>
      <div className="landing-container">
        <Element name="banner" className="section banner">
          <div className="section-title">
            <SafeHtmlComponent htmlContent={t('LANDING_PAGE_BANNER_TITLE_NEW')} />
          </div>
          <div className="section-description">{t('LANDING_PAGE_BANNER_DESCRIPTION_NEW')}</div>
          <BannerComponent />
        </Element>

        <Element name="works" className="section works">
          <WorksComponent />
        </Element>

        <Element name="features" className="section features">
          <div className="section-title" data-aos="fade-down">
            <SafeHtmlComponent htmlContent={t('LANDING_PAGE_FEATURES_TITLE')} />
          </div>
          <FeaturesComponent />
        </Element>

        <Element name="why" className="section why">
          <WhyComponent />
        </Element>

        <Element name="form" className="section involved">
          <div className="section-title">
            <SafeHtmlComponent htmlContent={t('LANDING_PAGE_INVOLVED_TITLE')} />
          </div>
          <FormComponent />
          {/* <FormComponent className="dark-themes" /> */}
        </Element>
      </div>
    </div>
  );
}
