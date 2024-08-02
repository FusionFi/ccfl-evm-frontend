import eventBus from '@/hooks/eventBus.hook';
import cssClass from '@/pages/supply/index.module.scss';
import { Button } from 'antd';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
export default function SupplyPage() {
  return (
    <div className={twMerge('supply-page-container', cssClass.supplyPage)}>
      Supply content here
      <Button className="btn-primary-custom" onClick={() => eventBus.emit('handleWalletConnect')}>
        Connect Wallet
      </Button>
    </div>
  );
}
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
