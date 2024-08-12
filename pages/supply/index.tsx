import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import cssClass from '@/pages/supply/index.module.scss';
import { Button, InputNumber, Tooltip } from 'antd';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
import { Select } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';
import { useAccount, useNetwork } from 'wagmi';
import { SUPPORTED_CHAINS, CHAIN_INFO } from '@/constants/chains.constant';
import type { SelectProps } from 'antd';
import Image from 'next/image';
import { Table, Modal } from 'antd';
import type { TableProps } from 'antd';
import { toCurrency } from '@/utils/common';
import { computeWithMinThreashold } from '@/utils/percent.util';
import { WalletSolidIcon } from '@/components/icons/wallet-solid.icon';
import { InfoCircleIcon } from '@/components/icons/info-circle.icon';
import { QuestionCircleIcon } from '@/components/icons/question-circle.icon';
import { LinkIcon } from '@/components/icons/link.icon';
import eventBus from '@/hooks/eventBus.hook';
import ModalSupply from '@/components/supply/modal-supply/modal-supply.component'
import ModalWithdraw from '@/components/supply/modal-withdraw/modal-withdraw.component'

interface DataType {
  key: string;
  asset: Array<any>;
  supply_balance: string;
  earned_reward: string;
  apy: string;
  wallet_balance: string;
}
type LabelRender = SelectProps['labelRender'];

export default function SupplyPage() {
  const { t } = useTranslation('common');
  const { chain, chains } = useNetwork();
  const { connector: activeConnector, isConnected } = useAccount();

  const columns: TableProps<DataType>['columns'] = [
    {
      title: t('SUPPLY_TABLE_HEADER_ASSET'),
      dataIndex: 'asset',
      key: 'asset',
      render: values => {
        const [symbol, name] = values;
        return (
          <div className="flex items-center table-wrapper__asset">
            <Image
              src={`/images/tokens/${symbol}.png`}
              style={{
                marginRight: 8,
              }}
              alt={name}
              width={40}
              height={40}
            />
            {name}
          </div>
        );
      },
    },
    {
      title: t('SUPPLY_TABLE_HEADER_SUPPLY_BALANCE'),
      dataIndex: 'supply_balance',
      key: 'supply_balance',
      render: value => {
        return (
          <div className="table-wrapper__supply-balance">
            {toCurrency(value)}
            <span className="table-wrapper__supply-balance__price">$ {toCurrency(value, 2)}</span>
          </div>
        );
      },
    },
    {
      title: t('SUPPLY_TABLE_HEADER_EARNED_REWARD'),
      dataIndex: 'earned_reward',
      key: 'earned_reward',
      render: value => {
        return (
          <div className="table-wrapper__earned-reward">
            {toCurrency(value)}
            <span className="table-wrapper__supply-balance__price">$ {toCurrency(value, 2)}</span>
          </div>
        );
      },
    },
    {
      title: t('SUPPLY_TABLE_HEADER_APY'),
      key: 'apy',
      dataIndex: 'apy',
      render: value => (
        <span className="table-wrapper__apy">{computeWithMinThreashold(value)}</span>
      ),
    },
    {
      title: () => {
        return (
          <div className="flex items-center">
            <WalletSolidIcon className="mr-2" />
            {t('SUPPLY_TABLE_HEADER_WALLET_BALANCE')}
          </div>
        );
      },

      key: 'wallet_balance',
      dataIndex: 'wallet_balance',
      render: value => {
        return (
          <div className="table-wrapper__supply-balance">
            {toCurrency(value)}
            <span className="table-wrapper__supply-balance__price">$ {toCurrency(value, 2)}</span>
          </div>
        );
      },
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      asset: ['USDC', 'USDC'],
      supply_balance: '3500',
      earned_reward: '350',
      apy: '0.009',
      wallet_balance: '1000',
    },
    {
      key: '2',
      asset: ['USDT', 'USDT'],
      supply_balance: '3500',
      earned_reward: '350',
      apy: '0.009',
      wallet_balance: '1000',
    },
  ];

  const showModalToSupplyMore = useCallback((asset: any) => {
    showModal();
  }, []);

  const TableAction = ({ children }: any) => {
    return <div className="table-wrapper__action">{children}</div>;
  };

  const expandedRowRender = (record: any) => {
    if (!isConnected) {
      return (
        <TableAction>
          <Button
            className="btn-primary-custom table-wrapper__action__connect"
            onClick={() => eventBus.emit('handleWalletConnect')}>
            Connect Wallet
          </Button>
        </TableAction>
      );
    }

    return (
      <TableAction>
        <Button
          className={twMerge('btn-primary-custom')}
          style={{
            width: 200,
            marginRight: 8,
          }}
          onClick={() => showModalToSupplyMore(record)}>
          {t('SUPPLY_TABLE_ACTION_SUPPLY_MORE')}
        </Button>
        <Button
          className={twMerge('btn-default-custom')}
          style={{
            width: 200,
          }}
          onClick={() => setIsModalWithdrawOpen(true)}>
          {t('SUPPLY_TABLE_ACTION_WITHDRAW')}
        </Button>
      </TableAction>
    );
  };

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

  const [isModalSupplyOpen, setIsModalSupplyOpen] = useState(false);
  const [isModalWithdrawOpen, setIsModalWithdrawOpen] = useState(false);
  const [isModalTxSuccessOpen, setIsModalTxSuccessOpen] = useState(false);

  const showModal = () => {
    setIsModalSupplyOpen(true);
  };

  const handleOk = () => {
    setIsModalSupplyOpen(false);
  };

  const handleModalSupplyCancel = () => {
    setIsModalSupplyOpen(false);
  };

  const handleModalSupplyOk = () => {
    setIsModalSupplyOpen(false);

    setSuccessMsg(
      t('SUPPLY_SUCCESS_MODAL_MESSAGE', {
        token: 'USDT',
        amount: 4000,
      }),
    );

    setIsModalTxSuccessOpen(true)
  };

  const handleModalWithdrawCancel = () => {
    setIsModalWithdrawOpen(false);
  };

  const handleModalWithdrawOk = () => {
    setIsModalWithdrawOpen(false);

    setSuccessMsg(
      t('WITHDRAW_SUCCESS_MODAL_MESSAGE', {
        token: 'USDT',
        amount: 4000,
      }),
    );

    setIsModalTxSuccessOpen(true)
  };

  const [successMsg, setSuccessMsg] = useState('');

  const handleTxStatusModallCancel = useCallback(() => {
    setIsModalTxSuccessOpen(false);
  }, []);

  return (
    <div className={twMerge('supply-page-container', cssClass.supplyPage)}>
      <div className="overview">
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
        <div className="overview__body">
          <div className="overview__body__wrapper">
            <div className="overview__body__wrapper__item">
              <span className="overview__body__wrapper__item__label">
                {t('SUPPLY_OVERVIEW_TOTAL_SUPPLY')}
              </span>
              <div className="overview__body__wrapper__item__value">
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
            <div className="overview__body__wrapper__item">
              <span className="overview__body__wrapper__item__label">
                {t('SUPPLY_OVERVIEW_NET_APY')}
              </span>
              <div className="overview__body__wrapper__item__value">
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
            <div className="overview__body__wrapper__item">
              <span className="overview__body__wrapper__item__label">
                {t('SUPPLY_OVERVIEW_TOTAL_EARNED')}
              </span>
              <div className="overview__body__wrapper__item__value">
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
      <div className="content">
        <Table
          title={() => t('SUPPLY_TABLE_TITLE')}
          expandable={{
            defaultExpandAllRows: true,
            expandedRowRender,
            rowExpandable: record => true,
            showExpandColumn: false,
          }}
          virtual
          className="table-wrapper"
          bordered={false}
          rowHoverable={false}
          pagination={false}
          columns={columns}
          dataSource={data}
        />
      </div>

      <ModalSupply handleOk={handleModalSupplyOk} isModalOpen={isModalSupplyOpen} handleCancel={handleModalSupplyCancel} />
      <ModalWithdraw handleOk={handleModalWithdrawOk} isModalOpen={isModalWithdrawOpen} handleCancel={handleModalWithdrawCancel} />

      <Modal
        closeIcon={false}
        wrapClassName={cssClass['supply-modal-tx-success-tx-success-wrapper']}
        classNames={{
          mask: cssClass['supply-modal-tx-success-mask'],
        }}
        title={t('SUCCESS_MODAL_TITLE')}
        open={isModalTxSuccessOpen}
        onOk={handleTxStatusModallCancel}
        onCancel={handleTxStatusModallCancel}
        footer={null}>
        <div className="supply-modal-tx-success-container">
          <div className="supply-modal-tx-success-container__status">
            <Image
              src="/images/status/success.png"
              alt="Transaction Success"
              width={80}
              height={80}
            />
            <div className="supply-modal-tx-success-container__status__msg">{successMsg}</div>
          </div>
          <div className="supply-modal-tx-success-container__action">
            <div className="supply-modal-tx-success-container__action__helper">
              <LinkIcon />
              <Link
                className="supply-modal-tx-success-container__action__helper__link"
                href={'https://psychcentral.com/blog/what-drives-our-need-for-approval'}
                target="_blank">
                {t('SUCCESS_MODAL_REVIEW')}
              </Link>
            </div>

            <Button
              onClick={handleTxStatusModallCancel}
              type="primary"
              className={twMerge('btn-default-custom')}
              block>
              {t('SUCCESS_MODAL_OK')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
