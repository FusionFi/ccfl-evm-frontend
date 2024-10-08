import { CARDANO_NETWORK_ID, SUPPORTED_CHAINS_MAP } from '@/constants/chains.constant';
import { useConnectedNetworkManager, useProviderManager } from '@/hooks/auth.hook';
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
import cssClass from './supply-overview.component.module.scss';

type LabelRender = SelectProps['labelRender'];

export default function SupplyOverviewComponent() {
  const { t } = useTranslation('common');

  const { selectedChain, updateNetwork } = useConnectedNetworkManager();
  const [, updateNetworks] = useSupplyNetworkManager()
  const [provider] = useProviderManager();

  const [user] = useUserManager();

  const labelRender: LabelRender = (props: any) => {
    let { value } = props;

    const _chain: any = SUPPORTED_CHAINS_MAP.get(value);
    console.log('🚀 ~ SupplyOverviewComponent ~ _chain:', _chain);

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
      const currentTab = selectedChain?.id == CARDANO_NETWORK_ID ? 'cardano' : 'evm';
      const changedTab = item == CARDANO_NETWORK_ID ? 'cardano' : 'evm';
      if (currentTab != changedTab) {
        eventBus.emit('openWeb3Modal', {
          tab: changedTab,
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
            options={[...(SUPPORTED_CHAINS_MAP.values() as any)].map(item => ({
              value: item.id,
            }))}
            optionRender={(option: any) => {
              const _chain: any = SUPPORTED_CHAINS_MAP.get(option.value);
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
            suffixIcon={<CaretDownOutlined className='pointer-events-none' />}
          />
        </div>
      </div>
      {provider?.account && (
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
