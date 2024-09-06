import { useCallback, useEffect, useMemo } from 'react';
import cssClass from './supply-overview.component.module.scss';

import { CHAIN_LOGO_MAP, DEFAULT_CHAIN_ID } from '@/constants/chains.constant';
import { useNetworkManager, useUserManager } from '@/hooks/supply.hook';
import supplyBE from '@/utils/backend/supply';
import { computeWithMinThreashold } from '@/utils/percent.util';
import { CaretDownOutlined } from '@ant-design/icons';
import type { SelectProps } from 'antd';
import { Select } from 'antd';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useAccount } from 'wagmi';

type LabelRender = SelectProps['labelRender'];

export default function SupplyOverviewComponent() {
  const { t } = useTranslation('common');

  const { isConnected, chainId } = useAccount();

  const [network, updateNetworks, selectNetwork] = useNetworkManager();
  const [user] = useUserManager();

  const _updateSelectedChainId = () => {
    try {
      const result: any = network.listMap.get(chainId) || {};
      if (result && result.chainId) {
        selectNetwork(result.chainId);
      }
    } catch (error) {
      console.error('update selected chain on SupplyOverviewComponent failed: ', error);
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
    _updateSelectedChainId();
  }, []);

  const labelRender: LabelRender = (props: any) => {
    let { value } = props;

    let _chain: any = network.listMap.get(value);

    if (!_chain) {
      _chain = network.listMap.get(DEFAULT_CHAIN_ID);
    }

    const logo = CHAIN_LOGO_MAP.get(_chain?.chainId);

    return (
      <div className="flex items-center">
        <Image
          src={logo as any}
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

  const handleNetworkChange = useCallback((data: any) => {
    selectNetwork(data);
  }, []);

  const totalSupply = useMemo(() => {
    return new BigNumber(user?.total_supply || 0).toFormat(2);
  }, [user?.total_supply]);

  const totalEarned = useMemo(() => {
    return new BigNumber(user?.total_earned || 0).toFormat(2);
  }, [user?.total_earned]);

  return (
    <div className={cssClass['supply-overview']}>
      <div className="flex">
        {t('SUPPLY_OVERVIEW_TITLE')}
        <div className="select-wrapper ml-6">
          <Select
            labelRender={labelRender}
            onChange={handleNetworkChange}
            defaultValue={{
              value: network.selected,
            }}
            value={{
              value: network.selected,
            }}
            options={network.list.map((item: any) => ({
              value: item.chainId,
            }))}
            optionRender={(option: any) => {
              const _chain: any = network.listMap.get(option.value);
              const _logo: any = CHAIN_LOGO_MAP.get(_chain.chainId);

              return (
                <div className="chain-dropdown-item-wrapper">
                  <Image
                    src={_logo}
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
      {isConnected && (
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
        </div>
      )}
    </div>
  );
}
