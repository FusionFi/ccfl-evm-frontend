import cssClass from '@/pages/supply/index.module.scss';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
export default function SupplyPage() {
  return (
    <div className={twMerge('supply-page-container', cssClass.supplyPage)}>Supply content here</div>
  );
}
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
