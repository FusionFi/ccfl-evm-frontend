import cssClass from '@/pages/borrow/index.module.scss';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
import SelectComponent from '@/components/common/select.component';
import TitleComponent from '@/components/common/title.component';
import OverviewComponent from '@/components/common/overview.component';

export default function BorrowPage() {
  const itemLeft = [
    {
      text: 'Borrowed balance',
      content: ' 1,875.00',
      type: 'usd',
    },
    {
      text: 'Collateral',

      content: ' 1,875.00',
      type: 'usd',
    },
  ];

  const itemRight = [
    {
      text: 'Net APR',
      content: '0.07',
      type: 'percent',
    },
    {
      text: 'Finance health',
      content: '1.66',
      type: 'health',
    },
  ];

  return (
    <div className={twMerge('borrow-page-container', cssClass.borrowPage)}>
      <div className="borrow-header">
        <TitleComponent text="Borrow overview">
          <SelectComponent />
        </TitleComponent>
      </div>
      <OverviewComponent itemLeft={itemLeft} itemRight={itemRight} />
    </div>
  );
}
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
