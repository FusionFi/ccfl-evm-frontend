import cssClass from '@/components/borrow/asset.component.module.scss';
import SafeHtmlComponent from '@/components/common/safe-html.component';
import { STAKE_DEFAULT_NETWORK } from '@/constants/networks';
import eventBus from '@/hooks/eventBus.hook';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface AssetProps {
  showModal: any;
  isConnected: any;
  switchNetwork: any;
  networkInfo: any;
}

export default function assetComponent({
  showModal,
  isConnected,
  switchNetwork,
  networkInfo,
}: AssetProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation('common');

  const tokenList = [
    {
      name: 'USDC',
      value: '10,000.00',
      usd: '4,000.00',
      percent: '0.07',
    },
    {
      name: 'USDT',
      value: '10,000.00',
      usd: '4,000.00',
      percent: '0.07',
    },
    {
      name: 'FIAT',
      value: '10,000.00',
      usd: '4,000.00',
      percent: '0.07',
    },
  ];

  return (
    <div className={twMerge(cssClass.assetComponent)}>
      <div className="asset-container">
        <div className="asset-header">{t('BORROW_MODAL_BORROW_ASSET_TO_BORROW')}</div>
        <div className="flex asset-wrapper">
          {/* <div className="xl:gap-6 asset-nav gap-1">
            <div
              className={`${
                isConnected && networkInfo ? 'xl:basis-1/4' : 'xl:basis-1/6'
              } basis-1/4`}>
              {t('BORROW_MODAL_BORROW_ADJUST_ASSET')}
            </div>
            <div
              className={`${
                isConnected && networkInfo ? 'xl:basis-1/4' : 'xl:basis-1/6'
              } basis-1/4`}>
              {t('BORROW_MODAL_BORROW_BORROW_LOAN_AVAILABLE')}
            </div>
            <div
              className={`${
                isConnected && networkInfo ? 'xl:basis-1/4' : 'xl:basis-1/6'
              } basis-1/4`}>
              {t('BORROW_MODAL_BORROW_ADJUST_APR_VARIABLE')}
            </div>
            <div
              className={`${
                isConnected && networkInfo ? 'xl:basis-1/4' : 'xl:basis-3/6'
              } basis-1/4`}></div>
          </div> */}
          {tokenList.map((item: any) => (
            <div className="xl:gap-6 asset-body gap-1" key={item.name}>
              <div className="flex ">
                <div className={`flex items-center`}>
                  <Image
                    className="mr-2"
                    src={`/images/common/${item.name}.png`}
                    alt={item.name}
                    width={40}
                    height={40}
                  />
                  {item.name.toUpperCase()}
                </div>
                <div className={` flex justify-end `}>
                  {isConnected && networkInfo ? (
                    <Button onClick={() => showModal(item.name)}>
                      {t('BORROW_MODAL_BORROW_BORROW')}
                    </Button>
                  ) : (
                    <React.Fragment>
                      {isConnected ? (
                        <Button onClick={() => switchNetwork()} className={'guest'}>
                          <SafeHtmlComponent
                            htmlContent={t('BORROW_SWITCH_NETWORK', {
                              networkName: STAKE_DEFAULT_NETWORK?.name,
                            })}
                          />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => eventBus.emit('handleWalletConnect')}
                          className={'guest'}>
                          <SafeHtmlComponent htmlContent={t('BORROW_CONNECT')} />
                        </Button>
                      )}
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="flex items-start">
                {item.name !== 'FIAT' && (
                  <div className={`flex-col items-start justify-center`}>
                    <div className="asset-title">
                      {t('BORROW_MODAL_BORROW_BORROW_LOAN_AVAILABLE')}
                    </div>
                    <div>{item.value}</div>
                    {item.usd && <div className="usd">$ {item.usd}</div>}
                  </div>
                )}
                <div className={``}>
                  <div className="asset-title">{t('BORROW_MODAL_BORROW_ADJUST_APR_VARIABLE')}</div>
                  {item.percent}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
