import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
// import css
import header from '@/styles/layout/footer.module.scss';
import Image from 'next/image';
import { DiscordIcon } from '@/layouts/icons/discord.icon';
import { TelegramIcon } from '@/layouts/icons/telegram.icon';
import { TwitterIcon } from '@/layouts/icons/twitter.icon';
export const MainFooter = () => {
  const { t } = useTranslation('common');
  /**
   * STATES
   */
  /**
   * HOOKS
   */
  /**
   * FUNCTIONS
   */
  /**
   * RENDERS
   */

  return (
    <div className={twMerge('w-full', header.mainLayoutFooter)}>
      <div className="landing-page-footer" data-aos="fade-up">
        <div className="footer-content mb-108">
          <div className="footer-logo">
            <Image src="/images/landing/banner-logo.png" alt="logo" width={260} height={64} />
          </div>
          <div className="footer-navigation-links">
            <a href="#" target="_blank" className="footer-nav-link">
              {t('LANDING_PAGE_FOOTER_TERM')}
            </a>
            <a href="#" target="_blank" className="footer-nav-link">
              {t('LANDING_PAGE_FOOTER_PRIVACY')}
            </a>
            <a href="#" target="_blank" className="footer-nav-link">
              {t('LANDING_PAGE_FOOTER_SUPPORT')}
            </a>
          </div>
        </div>
        <div className="footer-content">
          <div className="copy-right">© 2024 FusionFi. All rights reserved.</div>
          <div className="social-icons">
            <a href="#" target="_blank">
              <DiscordIcon className="social-icon" />
            </a>
            <a href="#" target="_blank">
              <TwitterIcon className="social-icon" />
            </a>
            <a href="#" target="_blank">
              <TelegramIcon className="social-icon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
