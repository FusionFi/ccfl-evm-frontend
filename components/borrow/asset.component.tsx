import cssClass from '@/components/borrow/asset.component.module.scss';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import { useAccount } from 'wagmi';
import eventBus from '@/hooks/eventBus.hook';
import SafeHtmlComponent from '@/components/common/safe-html.component';

interface AssetProps {
  showModal: any;
}

export default function assetComponent(props: AssetProps) {
  const { t } = useTranslation('common');
  const { isConnected } = useAccount();

  const tokenList = [
    {
      name: 'usdc',
      value: '10,000.00',
      usd: '4,000.00',
      percent: '0.07',
    },
    {
      name: 'usdt',
      value: '10,000.00',
      usd: '4,000.00',
      percent: '0.07',
    },
  ];

  return (
    <div className={twMerge(cssClass.assetComponent)}>
      <div className="asset-container">
        <div className="asset-header">{t('BORROW_MODAL_BORROW_ASSET_TO_BORROW')}</div>
        <div className="">
          <div className="xl:gap-6 asset-nav gap-2">
            <div className={`${isConnected ? 'xl:basis-1/4' : 'xl:basis-1/6'} basis-1/4`}>
              {t('BORROW_MODAL_BORROW_ADJUST_ASSET')}
            </div>
            <div className={`${isConnected ? 'xl:basis-1/4' : 'xl:basis-1/6'} basis-1/4`}>
              {t('BORROW_MODAL_BORROW_BORROW_LOAN_AVAILABLE')}
            </div>
            <div className={`${isConnected ? 'xl:basis-1/4' : 'xl:basis-1/6'} basis-1/4`}>
              {t('BORROW_MODAL_BORROW_ADJUST_APR_VARIABLE')}
            </div>
            <div className={`${isConnected ? 'xl:basis-1/4' : 'xl:basis-3/6'} basis-1/4`}></div>
          </div>
          {tokenList.map((item: any) => (
            <div className="xl:gap-6 asset-body gap-2" key={item.name}>
              <div className={`${isConnected ? 'xl:basis-1/4' : 'xl:basis-1/6'} basis-1/4`}>
                <Image
                  className="mr-2"
                  src={`/images/common/${item.name}.png`}
                  alt={item.name}
                  width={40}
                  height={40}
                />
                {item.name.toUpperCase()}
              </div>
              <div
                className={`${
                  isConnected ? 'xl:basis-1/4' : 'xl:basis-1/6'
                } flex-col items-start justify-center	basis-1/4`}>
                <div>{item.value}</div>
                <div className="usd">$ {item.usd}</div>
              </div>
              <div className={`${isConnected ? 'xl:basis-1/4' : 'xl:basis-1/6'} basis-1/4`}>
                {item.percent}%
              </div>
              <div
                className={`${
                  isConnected ? 'xl:basis-1/4' : 'xl:basis-3/6'
                } justify-end basis-1/4`}>
                {isConnected ? (
                  <Button onClick={() => props.showModal(item.name)}>
                    {t('BORROW_MODAL_BORROW_BORROW')}
                  </Button>
                ) : (
                  <Button
                    onClick={() => eventBus.emit('handleWalletConnect')}
                    className={`${isConnected ? '' : 'guest'}`}>
                    <SafeHtmlComponent htmlContent={t('BORROW_CONNECT_WALLET')} />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
