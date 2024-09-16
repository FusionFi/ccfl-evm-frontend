import cssClass from './supply-overview.component.module.scss';

import { CHAIN_INFO, SUPPORTED_CHAINS } from '@/constants/chains.constant';
import { CaretDownOutlined } from '@ant-design/icons';
import type { SelectProps } from 'antd';
import { Select } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useAccount } from 'wagmi';
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook'
import { useMemo } from 'react';

type LabelRender = SelectProps['labelRender'];

export default function SupplyOverviewComponent({ isModalOpen, handleCancel, message }: any) {
  const { t } = useTranslation('common');

  const { isConnected, chainId } = useAccount();
  const [cardanoWalletConnected] = useCardanoWalletConnected();

  const isConnected_ = useMemo(() => {
    return isConnected || !!cardanoWalletConnected?.address;
  }, [isConnected, cardanoWalletConnected?.address])

  const selectedChain = CHAIN_INFO.get(chainId) || {};
  const labelRender: LabelRender = (props: any) => {
    let { value } = props;

    const _chain: any = CHAIN_MAP.get(value) || {
      name: 'Avalanche',
      logo: '/images/tokens/avax.png',
    };

    return (
      <div className="flex items-center">
        <Image
          src={_chain?.logo}
          alt={_chain?.name}
          width={24}
          height={24}
          style={{
            height: 24,
            width: 24,
          }}
          className="mr-2"
        />
        {_chain?.name}
      </div>
    );
  };

  const CHAIN_MAP = new Map(SUPPORTED_CHAINS.map(item => [item.id, item]));

  return (
    <div className={cssClass['supply-overview']}>
      <div className="flex">
        {t('SUPPLY_OVERVIEW_TITLE')}
        <div className="select-wrapper ml-6">
          <Select
            labelRender={labelRender}
            defaultValue={{
              value: selectedChain?.id,
            }}
            options={[...(CHAIN_MAP.values() as any)].map(item => ({
              value: item.id,
            }))}
            optionRender={(option: any) => {
              const _chain: any = CHAIN_MAP.get(option.value);
              return (
                <div className="chain-dropdown-item-wrapper">
                  <Image
                    src={_chain?.logo}
                    alt={_chain?.name}
                    width={12}
                    height={12}
                    style={{
                      height: 12,
                      width: 12,
                    }}
                    className="mr-2"
                  />
                  {_chain?.name}
                </div>
              );
            }}
            suffixIcon={<CaretDownOutlined />}
          />
        </div>
      </div>
      {isConnected_ && (
        <div className="supply-overview__body">
          <div className="supply-overview__body__wrapper">
            <div className="supply-overview__body__wrapper__item">
              <span className="supply-overview__body__wrapper__item__label">
                {t('SUPPLY_OVERVIEW_TOTAL_SUPPLY')}
              </span>
              <div className="supply-overview__body__wrapper__item__value">
                ${' '}
                <span
                  className="font-bold"
                  style={{
                    color: '#F0F0F0',
                  }}>
                  4,567.87
                </span>
              </div>
            </div>
            <div className="supply-overview__body__wrapper__item">
              <span className="supply-overview__body__wrapper__item__label">
                {t('SUPPLY_OVERVIEW_NET_APY')}
              </span>
              <div className="supply-overview__body__wrapper__item__value">
                <span
                  className="font-bold"
                  style={{
                    color: '#F0F0F0',
                  }}>
                  0.07
                </span>{' '}
                %
              </div>
            </div>
            <div className="supply-overview__body__wrapper__item">
              <span className="supply-overview__body__wrapper__item__label">
                {t('SUPPLY_OVERVIEW_TOTAL_EARNED')}
              </span>
              <div className="supply-overview__body__wrapper__item__value">
                <span
                  className="font-bold"
                  style={{
                    color: '#52C41A',
                  }}>
                  +$65.87
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
