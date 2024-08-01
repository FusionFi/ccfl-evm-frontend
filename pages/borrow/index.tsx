import cssClass from '@/pages/borrow/index.module.scss';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
import SelectComponent from '@/components/common/select.component';

export default function BorrowPage() {
  return (
    <div className={twMerge('borrow-page-container', cssClass.borrowPage)}>
      <div className="borrow-header">
        Borrow overview
        <SelectComponent />
      </div>
    </div>
  );
}
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
