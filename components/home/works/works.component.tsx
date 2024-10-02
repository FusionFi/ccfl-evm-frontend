import cssClass from '@/components/home/works/works.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import SafeHtmlComponent from '@/components/common/safe-html.component';
export default function WorksComponent() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.worksComponent)}>
      <div className="works-container">
        <div className="works-bg"> </div>
        <div className="ipad-below">
          <div className="works-title">
            <SafeHtmlComponent htmlContent={t('LANDING_PAGE_WORKS_TITLE')} />
          </div>
          <div className="works-description">{t('LANDING_PAGE_WORKS_DESCRIPTION')}</div>
        </div>

        <div className="content-left" data-aos="fade-right">
          <div className="content-left-bg"> </div>
          <div className="content-left-container">
            <Image
              src="/images/landing/works/main.png"
              alt="works image"
              width={1080}
              height={808}
              className="main-image"
            />
            <div
              data-aos="fade-down"
              data-aos-duration="500"
              data-aos-delay="500"
              className="step1-container">
              <Image
                src="/images/landing/works/step1.png"
                alt="step1 image"
                width={334}
                height={302}
                className="step1-image"
              />
            </div>
            <div
              data-aos="fade-down"
              data-aos-duration="500"
              data-aos-delay="1000"
              className="step4-container">
              <Image
                src="/images/landing/works/step4.png"
                alt="step4 image"
                width={470}
                height={182}
                className="step4-image"
              />
            </div>
            <div
              data-aos="fade-down"
              data-aos-duration="500"
              data-aos-delay="1500"
              className="step2-container">
              <Image
                src="/images/landing/works/step2.png"
                alt="step2 image"
                width={636}
                height={192}
                className="step2-image"
              />
            </div>
            <div
              data-aos="fade-down"
              data-aos-duration="500"
              data-aos-delay="2000"
              className="step3-container">
              <Image
                src="/images/landing/works/step3.png"
                alt="step3 image"
                width={714}
                height={148}
                className="step3-image"
              />
            </div>
          </div>
        </div>
        <div className="content-right" data-aos="fade-down">
          <div className="ipad-above">
            <div className="works-title">
              <SafeHtmlComponent htmlContent={t('LANDING_PAGE_WORKS_TITLE')} />
            </div>
            <div className="works-description">{t('LANDING_PAGE_WORKS_DESCRIPTION')}</div>
          </div>

          <div className="steps-container">
            <div className="step step1">
              <div className="step-number"> 01</div>
              <div className="step-label"> {t('LANDING_PAGE_WORKS_STEP_2')}</div>
              <div className="arrow arrow-up">
                <Image
                  src="/images/landing/works/arrow-up.png"
                  alt="arrow up image"
                  width={88}
                  height={38}
                />
              </div>
            </div>
            <div className="step step2">
              <div className="step-number"> 02</div>
              <div className="step-label"> {t('LANDING_PAGE_WORKS_STEP_2')}</div>
              <div className="arrow arrow-down">
                <Image
                  src="/images/landing/works/arrow-down.png"
                  alt="arrow down image"
                  width={88}
                  height={38}
                />
              </div>
            </div>
            <div className="step step3">
              <div className="step-number"> 03</div>
              <div className="step-label"> {t('LANDING_PAGE_WORKS_STEP_3')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
