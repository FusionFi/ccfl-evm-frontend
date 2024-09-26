import cssClass from '@/components/home/landing-content.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';
import BannerComponent from './banner/banner.component';
import FeaturesComponent from './features/features.component';
import FormComponent from './form/form.component';
import WhyComponent from './why/why.component';
import WorksComponent from './works/works.component';
import { Element } from 'react-scroll';

export default function LandingContent() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.landingContent)}>
      <div className="landing-container">
        <Element name="banner" className="section">
          <BannerComponent />
        </Element>

        <Element name="works" className="section">
          <WorksComponent />
        </Element>

        <Element name="features" className="section">
          <FeaturesComponent />
        </Element>

        <Element name="why" className="section">
          <WhyComponent />
        </Element>

        <Element name="form" className="section">
          <FormComponent />
        </Element>
      </div>
    </div>
  );
}
