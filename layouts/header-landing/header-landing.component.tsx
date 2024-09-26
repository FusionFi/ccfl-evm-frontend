import { useTranslation } from 'next-i18next';
import { Link, Button } from 'react-scroll';
import cssClass from '@/layouts/header-landing/header-landing.component.module.scss';
import { twMerge } from 'tailwind-merge';
export default function HeaderLanding({}: any) {
  const { t } = useTranslation('common');

  /**
   * FUNCTIONS
   **/

  return (
    <div
      className={twMerge(
        cssClass.landingContent,
        'page-header-content flex items-center justify-center w-full',
      )}>
      <div className="landing-navigation-links">
        <Link
          activeClass="active"
          className="nav-link"
          to="works"
          spy={true}
          offset={-72}
          smooth={true}
          duration={500}>
          {t('LANDING_PAGE_HEADER_NAVIGATION_HOW_IT_WORK')}
        </Link>
        <Link
          activeClass="active"
          className="nav-link"
          to="features"
          spy={true}
          offset={-72}
          smooth={true}
          duration={500}>
          {t('LANDING_PAGE_HEADER_NAVIGATION_FEATURES')}
        </Link>
        <Link
          activeClass="active"
          className="nav-link"
          to="why"
          spy={true}
          offset={-72}
          smooth={true}
          duration={500}>
          {t('LANDING_PAGE_HEADER_NAVIGATION_WHY')}
        </Link>
      </div>
      <div className="content-right">
        <Button
          className="button btn-outline-custom"
          to="form"
          spy={true}
          offset={-72}
          smooth={true}
          duration={500}>
          {t('LANDING_PAGE_HEADER_BUTTON')}
        </Button>
      </div>
    </div>
  );
}
