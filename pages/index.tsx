import LandingContent from '@/components/home/landing-content.component';
import cssClass from '@/pages/index.module.scss';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
export default function HomePage() {
  const { t } = useTranslation('common');
  return (
    <div className={twMerge('home-page-container', cssClass.landingPage)}>
      <div className="landing-container">
        <section className="section">
          <LandingContent />
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
