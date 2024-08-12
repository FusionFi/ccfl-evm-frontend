import React from 'react';
import cssClass from './supply-overview.component.module.scss';

import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';
import { useNetwork } from 'wagmi';
import { SUPPORTED_CHAINS, CHAIN_INFO } from '@/constants/chains.constant';
import type { SelectProps } from 'antd';
import Image from 'next/image';

type LabelRender = SelectProps['labelRender'];

export default function SupplyOverviewComponent({
  isModalOpen,
  handleCancel,
  message
}: any) {
  const { t } = useTranslation('common');

  const { chain, chains } = useNetwork();

  const selectedChain = CHAIN_INFO.get(chain?.id) || {};

  const labelRender: LabelRender = (props: any) => {
    let { name, logo } = props;

    // TODO: please remove before release it to PRD
    if (!name) {
      name = 'Avalanche';
      logo = '/images/tokens/avax.png';
    }

    return (
      <div className="flex items-center">
        <Image
          src={logo}
          alt={name}
          width={24}
          height={24}
          style={{
            height: 24,
            width: 24,
          }}
          className="mr-2"
        />
        {name}
      </div>
    );
  };

  return (
    <div className={cssClass['supply-overview']}>
      <div className="flex">
        {t('SUPPLY_OVERVIEW_TITLE')}
        <div className="select-wrapper ml-6">
          <Select
            labelRender={labelRender}
            defaultValue={{
              value: selectedChain?.id,
              label: selectedChain?.name,
              logo: selectedChain?.logo,
            }}
            options={SUPPORTED_CHAINS.map((item: any) => ({
              value: item.id,
              name: item.name,
              label: (
                <div className="chain-dropdown-item-wrapper">
                  <Image
                    src={item.logo}
                    alt={item.name}
                    width={12}
                    height={12}
                    style={{
                      height: 12,
                      width: 12,
                    }}
                    className="mr-2"
                  />
                  {item.name}
                </div>
              ),
              logo: item?.logo,
            }))}
            suffixIcon={<CaretDownOutlined />}
          />
        </div>
      </div>
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
    </div>
  );
}
