import cssClass from '@/pages/borrow/index.module.scss';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
export default function BorrowPage() {
  return (
    <div className={twMerge('borrow-page-container', cssClass.borrowPage)}>Borrow content here</div>
  );
}
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
