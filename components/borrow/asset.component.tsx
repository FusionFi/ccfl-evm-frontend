/* eslint-disable react-hooks/rules-of-hooks */
import cssClass from '@/components/borrow/asset.component.module.scss';
import SafeHtmlComponent from '@/components/common/safe-html.component';
import { ASSET_TYPE } from '@/constants/common.constant';
import { useAuth, useConnectedNetworkManager, useProviderManager } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';
import { formatNumber, toAmountShow, toLessPart } from '@/utils/common';
import { Button, Skeleton } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface AssetProps {
  showModal: any;
  networkInfo: any;
  tokenList: any;
  loadingAsset: any;
}

export default function assetComponent({
  showModal,
  networkInfo,
  // tokenList,
  loadingAsset,
}: AssetProps) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useTranslation('common');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [auth] = useAuth();
  const { selectedChain, switchNetwork } = useConnectedNetworkManager();
  const [provider] = useProviderManager();

  const handleCheckLogin = (name: string, apr: string, decimals: any, loan_available: any) => {
    if (!auth?.userName && name === ASSET_TYPE.FIAT) {
      eventBus.emit('toggleKycWarningModal', true);
    } else {
      showModal(name, apr, decimals, loan_available);
    }
  };

  const tokenList = [
    {
      asset: 'USDA',
      value: '10,000.00',
      usd: '4,000.00',
      percent: '0.07',
    },
    {
      asset: 'USDT',
      value: '10,000.00',
      usd: '4,000.00',
      percent: '0.07',
    },
    {
      asset: 'FIAT',
      value: '10,000.00',
      usd: '4,000.00',
      percent: '0.07',
    },
  ];

  console.log('networkInfo', networkInfo);

  return (
    <div className={twMerge(cssClass.assetComponent)}>
      <div className="asset-container">
        <div className="asset-header">{t('BORROW_MODAL_BORROW_ASSET_TO_BORROW')}</div>
        <div className="flex asset-wrapper">
          {loadingAsset ? (
            <div className="asset-empty">
              <Skeleton active />
            </div>
          ) : (
            <>
              {tokenList && tokenList.length > 0 ? (
                <>
                  {tokenList?.map((item: any, index: any) => (
                    <div className="xl:gap-6 asset-body gap-1" key={index}>
                      <div className="flex ">
                        <div className={`flex items-center`}>
                          <Image
                            className="mr-2"
                            src={`/images/common/${item.asset}.png`}
                            alt={item.asset}
                            width={40}
                            height={40}
                          />
                          {item.asset?.toUpperCase()}
                        </div>
                        <div className={` flex justify-end `}>
                          {provider?.account && selectedChain?.id == provider?.chainId ? (
                            <Button
                              onClick={() =>
                                handleCheckLogin(
                                  item.asset,
                                  item.apr,
                                  item.decimals,
                                  toLessPart(toAmountShow(item.loan_available, item.decimals), 6),
                                )
                              }>
                              {t('BORROW_MODAL_BORROW_BORROW')}
                            </Button>
                          ) : (
                            <React.Fragment>
                              {provider?.account ? (
                                <Button onClick={() => switchNetwork()} className={'guest'}>
                                  <SafeHtmlComponent htmlContent={t('BORROW_SWITCH_NETWORK')} />
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
                        {item.asset !== ASSET_TYPE.FIAT && (
                          <div className={`flex-col items-start justify-center`}>
                            <div className="asset-title">
                              {t('BORROW_MODAL_BORROW_BORROW_LOAN_AVAILABLE')}
                            </div>
                            <div>
                              {formatNumber(
                                toLessPart(toAmountShow(item.loan_available, item.decimals), 6),
                                true,
                              )}
                            </div>
                            <div className="usd">
                              ${' '}
                              {formatNumber(
                                toLessPart(toAmountShow(item.usd, item.decimals), 6),
                                true,
                              )}
                            </div>
                          </div>
                        )}
                        <div className={``}>
                          <div className="asset-title">
                            {t('BORROW_FIAT_MODAL_TAB_COLLATERAL_APY')}
                          </div>
                          {formatNumber(toLessPart(item.apr, 2))}%
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="asset-empty">{t('BORROW_MODAL_ASSET_NO_DATA')}</div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
