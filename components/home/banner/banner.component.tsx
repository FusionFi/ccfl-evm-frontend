import cssClass from '@/components/home/banner/banner.component.module.scss';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';
import FormComponent from '../form/form.component';
import Image from 'next/image';
export default function BannerComponent() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  return (
    <div className={twMerge(cssClass.bannerContent)}>
      <div className="banner-container">
        <div className="banner-image">
          <div className="banner-image-bg"> </div>
          <div className="banner-image-container">
            <Image
              src="/images/landing/banners/fusion.png"
              alt="fusion image"
              width={1536}
              height={1536}
              className="fusion-image fusion-image-rotate"
            />

            <Image
              src="/images/landing/banners/cube.png"
              alt="cube image"
              width={808}
              height={688}
              className="cube-image"
            />

            <Image
              src="/images/landing/banners/usdc-blur.png"
              alt="usdc-blur image"
              width={201}
              height={195}
              className="usdc-blur"
            />
            <Image
              src="/images/landing/banners/usda.png"
              alt="usda image"
              width={298}
              height={290}
              className="usda"
            />
            <Image
              src="/images/landing/banners/dollar.png"
              alt="dollar  image"
              width={382}
              height={382}
              className="dollar-image"
            />
            <Image
              src="/images/landing/banners/usdc.png"
              alt="usdc image"
              width={248}
              height={204}
              className="usdc-image"
            />
            <Image
              src="/images/landing/banners/usdt.png"
              alt="usdt image"
              width={292}
              height={210}
              className="usdt-image"
            />
            <Image
              src="/images/landing/banners/ada.png"
              alt="ada image"
              width={548}
              height={546}
              className="ada-image"
            />
          </div>
        </div>
        <div className="banner-form">
          <FormComponent className="dark-themes" />
        </div>
        <div className="banner-infos">
          <div className="banner-info">
            <div className="content-left">
              <div className="info-title">
                {t('LANDING_PAGE_BANNER_ABOUT_TITLE')}
                <Image src="/images/landing/banner-logo.png" alt="logo" width={260} height={64} />
              </div>
            </div>
            <div className="content-right">
              <div className="info-description">{t('LANDING_PAGE_BANNER_ABOUT_DESCRIPTION')}</div>
            </div>
          </div>
          <div className="banner-info">
            <div className="info-description">
              <ul className="partners-list">
                <li>
                  <Image
                    src="/images/landing/partners/emurgo.png"
                    alt="emurgo logo"
                    width={438}
                    height={108}
                    className="emurgo"
                  />
                </li>
                <li>
                  <Image
                    src="/images/landing/partners/encryptus.png"
                    alt="encryptus logo"
                    width={462}
                    height={96}
                    className="encryptus"
                  />
                </li>
                <li>
                  <Image
                    src="/images/landing/partners/anzens.png"
                    alt="anzens logo"
                    width={358}
                    height={103}
                    className="anzens"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
