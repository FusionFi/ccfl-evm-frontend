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
import { toCurrency } from '@/utils/common';
import { switchOrAddNetwork } from '@/utils/contract/web3';
import { computeWithMinThreashold } from '@/utils/percent.util';
import type { TableProps } from 'antd';
import { Button, Table } from 'antd';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAccount, useNetwork } from 'wagmi';
import supplyBE from '@/utils/backend/supply';
import { useAssetManager } from '@/hooks/supply.hook'

interface DataType {
  key: string;
  asset: Array<any>;
  supply_balance: string;
  earned_reward: string;
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
  const { isConnected } = useAccount();
  const { address } = useAccount();
  const { chain } = useNetwork();

  const [_, showError] = useNotification();

  const [networkInfo, setNetworkInfo] = useState<any | null>(null);
  const [assets, updateAssets] = useAssetManager();

  const fetchInitiaData = async () => {
    try {
      const [assets] = await Promise.all([
        supplyBE.fetchAssets()
      ])
      updateAssets(assets)
    } catch (error) {
      console.error("fetch initial data on supply page failed: ", error)
    }
  }

  const switchNetwork = async () => {
    try {
      const provider = { rpcUrl: STAKE_DEFAULT_NETWORK?.rpc };
      await switchOrAddNetwork(STAKE_DEFAULT_NETWORK, provider);
    } catch (error) {
      console.log('🚀 ~ switchNetwork ~ error:', error);
      showError(error);
    }
  };

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

  const data: DataType[] = assets.map((item: any) => {
    return {
      key: `${item.chainId}_${item.symbol}`,
      asset: [item.symbol, item.name],
      supply_balance: '3500', // TODO: please update
      earned_reward: '350', // TODO: please update
      apy: '0.009', //TODO: please update
      wallet_balance: '1000', // TODO: please update
    }
  })

  const initNetworkInfo = useCallback(() => {
    if (chain) {
      const networkCurrent = NETWORKS.find(item => item.chain_id_decimals === chain?.id);
      setNetworkInfo(networkCurrent || null);
    }
  }, [chain]);

  useEffect(() => {
    if (address) {
      // getBalance();
      initNetworkInfo();
    }

    fetchInitiaData();
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
