import Banner from '@/components/home/banner.component';
import Statistic from '@/components/home/statistic.component';
import TokenInfo from '@/components/home/token-info.component';
import cssClass from '@/pages/index.module.scss';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
export default function HomePage() {
  const { t } = useTranslation('common');
  return (
    <div className={twMerge('home-page-container', cssClass.landingPage)}>
      <div className="landing-container">
        <h1>{t('LAYOUT_MAIN_HEADER_NAV_TEXT_SUPPLY')}</h1>
        <section>
          <Banner />
        </section>
        <section>
          <Statistic />
        </section>
        <section>
          <TokenInfo />
        </section>
      </div>
    </div>
  );
}
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
