import { CHAIN_INFO, SUPPORTED_CHAINS } from '@/constants/chains.constant';
import { useCardanoConnected, useNetworkManager } from '@/hooks/auth.hook';
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook';
import eventBus from '@/hooks/eventBus.hook';
import { useUserManager, useNetworkManager as useSupplyNetworkManager } from '@/hooks/supply.hook';
import supplyBE from '@/utils/backend/supply';
import { computeWithMinThreashold } from '@/utils/percent.util';
import { CaretDownOutlined } from '@ant-design/icons';
import type { SelectProps } from 'antd';
import { Select } from 'antd';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import cssClass from './supply-overview.component.module.scss';

type LabelRender = SelectProps['labelRender'];

export default function SupplyOverviewComponent() {
  const { t } = useTranslation('common');

  const { isConnected, address } = useAccount();
  const [cardanoWalletConnected] = useCardanoWalletConnected();
  const [isCardanoConnected] = useCardanoConnected();
  const [chainId, updateNetwork] = useNetworkManager();
  const [, updateNetworks] = useSupplyNetworkManager()

  const [user] = useUserManager();
  const isConnected_ = useMemo(() => {
    return isConnected || !!cardanoWalletConnected?.address;
  }, [isConnected, cardanoWalletConnected?.address]);
  const CHAIN_MAP = new Map(SUPPORTED_CHAINS.map(item => [item.id, item]));

  const selectedChain = useMemo(() => {
    let _chain = CHAIN_INFO.get(chainId);
    if (!_chain) {
      if (isCardanoConnected) {
        _chain = CHAIN_MAP.get('ADA');
      } else {
        _chain = CHAIN_MAP.get(11155111);
      }
    }
    return _chain;
  }, [chainId, isCardanoConnected]);

  const labelRender: LabelRender = (props: any) => {
    let { value } = props;

    let _chain: any = CHAIN_MAP.get(value);
    console.log('🚀 ~ SupplyOverviewComponent ~ _chain:', _chain);
    if (!_chain) {
      if (isCardanoConnected) {
        _chain = CHAIN_MAP.get('ADA');
      } else {
        _chain = CHAIN_MAP.get(11155111);
      }
    }

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

  const totalSupply = useMemo(() => {
    return new BigNumber(user?.total_supply || 0).toFormat(2);
  }, [user?.total_supply]);

  const totalEarned = useMemo(() => {
    return new BigNumber(user?.total_earned || 0).toFormat(2);
  }, [user?.total_earned]);

  const handleNetworkChange = (item: any) => {
    try {
      console.log(item, 'item');
      console.log(chainId, 'chainId');
      const currentTab = chainId == 'ADA' ? 'cardano' : 'evm';
      const changedTab = item == 'ADA' ? 'cardano' : 'evm';
      if (currentTab != changedTab) {
        eventBus.emit('openWeb3Modal', {
          tab: item == 'ADA' ? 'cardano' : 'evm',
          chainId: item,
        });
      } else {
        updateNetwork(item);
      }
    } catch (error) {
      console.error('handle network changing failed: ', error);
    }
  };
  

  const fetchInitiaData = async () => {
    try {
      const [_networks] = await Promise.all([supplyBE.fetchNetworks()]);
      updateNetworks(_networks);
    } catch (error) {
      console.error('fetch initial data on SupplyOverviewComponent failed: ', error);
    }
  };

  useEffect(() => {
    fetchInitiaData();
  }, []);

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
            value={{
              value: selectedChain?.id,
            }}
            onChange={handleNetworkChange}
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
                  {totalSupply}
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
                  {computeWithMinThreashold(user?.net_apy)}
                </span>{' '}
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
                  +${totalEarned}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
