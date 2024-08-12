import React, { useCallback, useState } from 'react';
import cssClass from '@/pages/supply/index.module.scss';
import { Button } from 'antd';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'next-i18next';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { toCurrency } from '@/utils/common';
import { computeWithMinThreashold } from '@/utils/percent.util';
import { WalletSolidIcon } from '@/components/icons/wallet-solid.icon';
import eventBus from '@/hooks/eventBus.hook';
import ModalSupply from '@/components/supply/modal-supply/modal-supply.component'
import ModalWithdraw from '@/components/supply/modal-withdraw/modal-withdraw.component'
import ModalSuccess from '@/components/supply/modal-success/modal-success.component'
import SupplyOverview from '@/components/supply/supply-overview/supply-overview.component'

interface DataType {
  key: string;
  asset: Array<any>;
  supply_balance: string;
  earned_reward: string;
  apy: string;
  wallet_balance: string;
}

export default function SupplyPage() {
  const { t } = useTranslation('common');
  const { isConnected } = useAccount();

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
          onClick={() => setIsModalSupplyOpen(record)}>
          {t('SUPPLY_TABLE_ACTION_SUPPLY_MORE')}
        </Button>
        <Button
          className={twMerge('btn-default-custom')}
          style={{
            width: 200,
          }}
          onClick={() => setIsModalWithdrawOpen(record)}>
          {t('SUPPLY_TABLE_ACTION_WITHDRAW')}
        </Button>
      </TableAction>
    );
  };

  const [isModalSupplyOpen, setIsModalSupplyOpen] = useState(false);
  const [isModalWithdrawOpen, setIsModalWithdrawOpen] = useState(false);
  const [isModalSuccessOpen, setIsModalSuccessOpen] = useState(false);

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

    setIsModalSuccessOpen(true)
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

    setIsModalSuccessOpen(true)
  };

  const [successMsg, setSuccessMsg] = useState('');

  const handleModalSuccessCancel = useCallback(() => {
    setIsModalSuccessOpen(false);
  }, []);


  return (
    <div className={twMerge('supply-page-container', cssClass.supplyPage)}>
      <SupplyOverview />
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
      <ModalSuccess message={successMsg} isModalOpen={isModalSuccessOpen} handleCancel={handleModalSuccessCancel} />
    </div>
  );
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
