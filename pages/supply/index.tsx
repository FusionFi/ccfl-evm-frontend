import { WalletSolidIcon } from '@/components/icons/wallet-solid.icon';
import ModalError from '@/components/supply/modal-error/modal-error.component';
import ModalSuccess from '@/components/supply/modal-success/modal-success.component';
import ModalSupply from '@/components/supply/modal-supply/modal-supply.component';
import ModalWithdraw from '@/components/supply/modal-withdraw/modal-withdraw.component';
import SupplyOverview from '@/components/supply/supply-overview/supply-overview.component';
import { NETWORKS, STAKE_DEFAULT_NETWORK } from '@/constants/networks';
import eventBus from '@/hooks/eventBus.hook';
import { useNotification } from '@/hooks/notifications.hook';
import cssClass from '@/pages/supply/index.module.scss';
import { computeWithMinThreashold } from '@/utils/percent.util';
import type { TableProps } from 'antd';
import { Button, Table } from 'antd';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAccount, useSwitchChain } from 'wagmi';

interface DataType {
  key: string;
  asset: Array<any>;
  supply_balance: any;
  earned_reward: any;
  apy: string;
  wallet_balance: string;
}

enum ModalType {
  Supply = 1,
  Withdraw,
  Success,
  Error,
}

export default function SupplyPage() {
  const { t } = useTranslation('common');
  const { switchChain } = useSwitchChain();
  const { isConnected, chainId } = useAccount();
  const { address } = useAccount();

  const [_, showError] = useNotification();

  const [networkInfo, setNetworkInfo] = useState<any | null>(null);

  const switchNetwork = async () => {
    try {
      const rs = await switchChain({ chainId: STAKE_DEFAULT_NETWORK?.chain_id_decimals });
    } catch (error) {
      console.log('🚀 ~ switchNetwork ~ error:', error);
      showError(error);
    }
  };

  let columns: TableProps<DataType>['columns'] = [
    {
      title: t('SUPPLY_TABLE_HEADER_ASSET'),
      dataIndex: 'asset',
      key: 'asset',
      render: values => {
        const [symbol, name] = values;
        return (
          <div className="flex items-center table-wrapper__asset">
            <Image
              src={`/images/common/${symbol}.png`}
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
      render: values => {
        const [value, valueWithPrice] = values;
        return (
          <div className="table-wrapper__supply-balance">
            {value}
            <span className="table-wrapper__supply-balance__price">$ {valueWithPrice}</span>
          </div>
        );
      },
    },
    {
      title: t('SUPPLY_TABLE_HEADER_EARNED_REWARD'),
      dataIndex: 'earned_reward',
      key: 'earned_reward',
      render: values => {
        const [value, valueWithPrice] = values;
        return (
          <div className="table-wrapper__earned-reward">
            {value}
            <span className="table-wrapper__supply-balance__price">$ {valueWithPrice}</span>
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
  ];

  if (isConnected) {
    columns.push({
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
      render: values => {
        const [value, valueWithPrice] = values;
        return (
          <div className="table-wrapper__supply-balance">
            {value}
            <span className="table-wrapper__supply-balance__price">$ {valueWithPrice}</span>
          </div>
        );
      },
    });
  }

  const data: DataType[] = [
    {
      key: '1',
      asset: ['USDC', 'USDC'],
    },
    {
      key: '2',
      asset: ['USDT', 'USDT'],
    },
  ].map((item: any) => {
    item.apy = '0.009';
    if (isConnected) {
      item.supply_balance = ['3,500.00', '3,500.00'];
      item.earned_reward = ['350.00', '350.00'];
      item.wallet_balance = ['1,000.00', '1,000.00'];
    } else {
      item.supply_balance = ['0.00', '0'];
      item.earned_reward = ['0.00', '0'];
    }

    return item;
  });

  const initNetworkInfo = useCallback(() => {
    if (chainId) {
      const networkCurrent = NETWORKS.find(item => item.chain_id_decimals === chainId);
      setNetworkInfo(networkCurrent || null);
    }
  }, [chainId]);

  useEffect(() => {
    if (address) {
      // getBalance();
      initNetworkInfo();
    }
  }, [address, initNetworkInfo]);

  const TableAction = ({ children }: any) => {
    return <div className="table-wrapper__action">{children}</div>;
  };

  const [modal, setModal] = useState({} as any);

  const expandedRowRender = (record: any) => {
    if (!isConnected) {
      return (
        <TableAction>
          <Button
            className="btn-primary-custom table-wrapper__action__connect"
            onClick={() => eventBus.emit('handleWalletConnect')}>
            {t('COMMON_CONNECT_WALLET')}
          </Button>
        </TableAction>
      );
    }

    if (!networkInfo) {
      return (
        <TableAction>
          <Button
            onClick={() => switchNetwork()}
            className="btn-primary-custom table-wrapper__action__connect">
            {t('COMMON_CONNECT_WALLET_SWITCH', {
              network: STAKE_DEFAULT_NETWORK?.name,
            })}
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
          onClick={() =>
            setModal({
              type: ModalType.Supply,
            })
          }>
          {t('SUPPLY_TABLE_ACTION_SUPPLY_MORE')}
        </Button>
        <Button
          className={twMerge('btn-default-custom')}
          style={{
            width: 200,
          }}
          onClick={() =>
            setModal({
              type: ModalType.Withdraw,
            })
          }>
          {t('SUPPLY_TABLE_ACTION_WITHDRAW')}
        </Button>
      </TableAction>
    );
  };

  const handleModalSupplyOk = () => {
    setModal({
      type: ModalType.Success,
      txhash: 'input here',
      message: t('SUPPLY_SUCCESS_MODAL_MESSAGE', {
        token: 'USDT',
        amount: 4000,
      }),
    });
  };

  const handleModalWithdrawOk = () => {
    setModal({
      type: ModalType.Error,
      code: '503',
      txhash: 'input here',
      message: 'Error message',
    });
  };

  const title = () => {
    if (!isConnected) {
      return t('SUPPLY_GUEST_TABLE_TITLE');
    }
    return t('SUPPLY_TABLE_TITLE');
  };

  return (
    <div className={twMerge('supply-page-container', cssClass.supplyPage)}>
      <SupplyOverview />
      <div className="content">
        <Table
          title={title}
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

      <ModalSupply
        {...modal}
        handleOk={handleModalSupplyOk}
        isModalOpen={modal?.type == ModalType.Supply}
        handleCancel={() => setModal({})}
      />
      <ModalWithdraw
        {...modal}
        handleOk={handleModalWithdrawOk}
        isModalOpen={modal?.type == ModalType.Withdraw}
        handleCancel={() => setModal({})}
      />
      <ModalSuccess
        {...modal}
        isModalOpen={modal?.type == ModalType.Success}
        handleCancel={() => setModal({})}
      />
      <ModalError
        {...modal}
        isModalOpen={modal?.type == ModalType.Error}
        handleCancel={() => setModal({})}
      />
    </div>
  );
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
