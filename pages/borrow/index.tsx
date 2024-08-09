import cssClass from '@/pages/borrow/index.module.scss';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
import React, { useState } from 'react';
import SelectComponent from '@/components/common/select.component';
import TitleComponent from '@/components/common/title.component';
import OverviewComponent from '@/components/common/overview.component';
import { useTranslation } from 'next-i18next';
import { TYPE_COMMON } from '@/constants/common.constant';
import LoansComponent from '@/components/borrow/loans.component';
import AssetComponent from '@/components/borrow/asset.component';
import ModalBorrowComponent from '@/components/borrow/modal-borrow.component';
import ModalRepayComponent from '@/components/borrow/modal-repay.component';
import type { SelectProps } from 'antd';
import Image from 'next/image';
import { Select } from 'antd';
import { SUPPORTED_CHAINS, CHAIN_INFO } from '@/constants/chains.constant';
import { CaretDownOutlined } from '@ant-design/icons';
import { useNetwork, useAccount } from 'wagmi';
import { COLLATERAL_TOKEN } from '@/constants/common.constant';

type LabelRender = SelectProps['labelRender'];

export default function BorrowPage() {
  const { t } = useTranslation('common');
  const { chain, chains } = useNetwork();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalRepayOpen, setIsModalRepayOpen] = useState(false);

  const [currentToken, setCurrentToken] = useState('');
  const [step, setStep] = useState(0);
  const [token, setToken] = useState(COLLATERAL_TOKEN[0].name);
  const { isConnected } = useAccount();

  const showModal = (token: string) => {
    setCurrentToken(token);
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setCurrentToken('');
    setIsModalOpen(false);
    setStep(0);
    setToken(COLLATERAL_TOKEN[0].name);
  };

  const showRepayModal = (token: string) => {
    setCurrentToken(token);
    setIsModalRepayOpen(true);
  };

  const handleRepayCancel = () => {
    setCurrentToken('');
    setIsModalRepayOpen(false);
    setStep(0);
  };

  const itemLeft = [
    {
      text: t('BORROW_OVERVIEW_BALANCE'),
      content: ' 1,875.00',
      type: TYPE_COMMON.USD,
    },
    {
      text: t('BORROW_OVERVIEW_COLLATERAL'),
      content: ' 1,875.00',
      type: TYPE_COMMON.USD,
    },
  ];

  const itemRight = [
    {
      text: t('BORROW_OVERVIEW_APR'),
      content: '0.07',
      type: TYPE_COMMON.PERCENT,
    },
    {
      text: t('BORROW_OVERVIEW_FINANCE_HEALTH'),
      content: '1.66',
      type: TYPE_COMMON.FINANCE_HEALTH,
    },
  ];
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
  const selectedChain = CHAIN_INFO.get(chain?.id) || {};

  return (
    <div className={twMerge('borrow-page-container', cssClass.borrowPage)}>
      <div className="borrow-header">
        <TitleComponent text={t('BORROW_OVERVIEW_TITLE')}>
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
        </TitleComponent>
      </div>
      {isConnected && (
        <div className="mb-4">
          <OverviewComponent itemLeft={itemLeft} itemRight={itemRight} />
        </div>
      )}
      <div className="flex gap-6 borrow-inner">
        {isConnected && (
          <div className="xl:basis-1/2 basis-full">
            <LoansComponent showModal={showModal} showRepayModal={showRepayModal} />
          </div>
        )}
        <div className={`${isConnected ? 'xl:basis-1/2' : 'xl:basis-full'} basis-full`}>
          <AssetComponent showModal={showModal} />
        </div>
      </div>
      <ModalBorrowComponent
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        currentToken={currentToken}
        step={step}
        setStep={setStep}
        token={token}
        setToken={setToken}
      />
      <ModalRepayComponent
        isModalOpen={isModalRepayOpen}
        handleCancel={handleRepayCancel}
        currentToken={currentToken}
        step={step}
        setStep={setStep}
      />
    </div>
  );
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
