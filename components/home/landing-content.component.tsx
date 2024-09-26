import cssClass from '@/components/home/landing-content.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';
import BannerComponent from './banner/banner.component';
import FeaturesComponent from './features/features.component';
import FormComponent from './form/form.component';
import WhyComponent from './why/why.component';
import WorksComponent from './works/works.component';
export default function LandingContent() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.landingContent)}>
      <div className="landing-container">
        <section className="section" id="banner">
          <BannerComponent />
        </section>
        <section className="section" id="works">
          <WorksComponent />
        </section>
        <section className="section" id="features">
          <FeaturesComponent />
        </section>
        <section className="section" id="why">
          <WhyComponent />
        </section>
        <section className="section" id="form">
          <FormComponent />
        </section>
      </div>
    </div>
  );
}
