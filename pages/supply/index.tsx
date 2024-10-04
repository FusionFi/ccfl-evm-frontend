import { WalletSolidIcon } from '@/components/icons/wallet-solid.icon';
import ModalError from '@/components/supply/modal-error/modal-error.component';
import ModalSuccess from '@/components/supply/modal-success/modal-success.component';
import ModalSupply from '@/components/supply/modal-supply/modal-supply.component';
import ModalWithdraw from '@/components/supply/modal-withdraw/modal-withdraw.component';
import SupplyOverview from '@/components/supply/supply-overview/supply-overview.component';
import eventBus from '@/hooks/eventBus.hook';
import { useNotification } from '@/hooks/notifications.hook';
import { useAssetManager, useUserManager } from '@/hooks/supply.hook';
import cssClass from '@/pages/supply/index.module.scss';
import supplyBE from '@/utils/backend/supply';
import { computeWithMinThreashold } from '@/utils/percent.util';
import type { TableProps } from 'antd';
import { Button, Table } from 'antd';
import BigNumber from 'bignumber.js';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useProviderManager, useConnectedNetworkManager } from '@/hooks/auth.hook';

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

  const [_, showError] = useNotification();

  const [asset, updateAssets] = useAssetManager();
  const [user, updateUser] = useUserManager();
  const [provider, updateProvider] = useProviderManager();
  const { selectedChain, switchNetwork } = useConnectedNetworkManager()

  const fetchPublicData = async () => {
    try {
      const [assets, pools, contracts]: any = await Promise.all([
        supplyBE.fetchAssets({
          chainId: selectedChain?.id,
        }),
        supplyBE.fetchPools({
          chainId: selectedChain?.id,
        }),
        supplyBE.fetchContracts({
          chainId: selectedChain?.id,
        }),
      ]);

      const poolMap = new Map(pools.map((item: any) => [item.asset, item]));
      const contractMap = new Map(contracts.map((item: any) => [item.asset, {
        pool_address: item.address
      }]));

      updateAssets(
        assets.map((item: any) => {
          const x: any = poolMap.get(item.symbol);
          const y: any = contractMap.get(item.symbol);
          return {
            ...x,
            ...y,
            ...item,
          };
        }),
      );
    } catch (error) {
      console.error('fetch initial data on supply page failed: ', error);
    }
  };

  const fetchUserData = async () => {
    try {
      if (!provider?.account) {
        updateUser(null);
        return;
      }

      const [user] = await Promise.all([
        supplyBE.fetchUserSupply({
          chainId: selectedChain?.id,
          address: provider?.account,
        }),
      ]);

      updateUser(user);
    } catch (error) {
      console.error('fetch user data on supply page failed: ', error);
    }
  };

  const handleNetworkSwitch = async () => {
    try {
      // TODO: need to check the method using wallet connect or coinbase wallet
      await switchNetwork();
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

  if (!!provider?.account) {
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

  const data: DataType[] = asset.list.map((item: any) => {
    const result = {
      key: `${item.chainId}_${item.symbol}`,
      asset: [item.symbol, item.name, item],
      supply_balance: ['N/A', '0.00', 0],
      earned_reward: ['0.00', '0.00', 0],
      apy: Number(item?.apy || '0') * 100,
      wallet_balance: ['0.00', '0.00', 0],
    };
    if (provider?.account) {
      const supplied = user.supplyMap.get(item.symbol);
      if (supplied) {
        const supplyBalance = new BigNumber(supplied.supply_balance || 0).dividedBy(
          10 ** supplied.decimals,
        );
        if (supplyBalance.isGreaterThan(0)) {
          result.supply_balance = [
            supplyBalance.toFormat(2),
            supplyBalance.times(supplied.asset_price).toFormat(2),
            supplied.supply_balance,
          ];
        }

        const earned = new BigNumber(supplied.earned_reward || 0).dividedBy(
          10 ** supplied.decimals,
        );

        if (earned.isGreaterThan(0)) {
          result.earned_reward = [
            earned.toFormat(2),
            earned.times(supplied.asset_price).toFormat(2),
            earned.toString(),
          ];
        }

        const walletBalance = new BigNumber(supplied.wallet_balance || 0).dividedBy(
          10 ** supplied.decimals,
        );
        if (walletBalance.isGreaterThan(0)) {
          result.wallet_balance = [
            walletBalance.toFormat(2),
            walletBalance.times(supplied.asset_price).toFormat(2),
            supplied.wallet_balance,
          ];
        }
      }
    }
    return result;
  });


  useEffect(() => {
    fetchUserData();
    fetchPublicData();
  }, [provider?.account, selectedChain?.id]);

  const TableAction = ({ children }: any) => {
    return <div className="table-wrapper__action">{children}</div>;
  };

  const [modal, setModal] = useState({} as any);

  const expandedRowRender = (record: any) => {
    if (!provider?.account) {
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

    if (selectedChain?.id != provider?.chainId) {
      return (
        <TableAction>
          <Button
            onClick={handleNetworkSwitch}
            className="btn-primary-custom table-wrapper__action__connect">
            {t('COMMON_CONNECT_WALLET_SWITCH', {
              network: selectedChain?.name,
            })}
          </Button>
        </TableAction>
      );
    }

    const handleModalOpen = (type: any) => {
      setModal({
        type,
        asset: {
          ...record.asset[2],
          wallet_balance: record.wallet_balance[0],
          wallet_balance_in_wei: record.wallet_balance[2],
          supply_balance: record.supply_balance[0],
          supply_balance_in_wei: record.supply_balance[2],
          earned_reward: record.earned_reward[0],
          earned_reward_in_wei: record.earned_reward[2],
          apy: record.apy,
        },
      });
    };

    return (
      <TableAction>
        <Button
          className={twMerge('btn-primary-custom')}
          style={{
            width: 200,
            marginRight: 8,
          }}
          onClick={() => handleModalOpen(ModalType.Supply)}>
          {t('SUPPLY_TABLE_ACTION_SUPPLY_MORE')}
        </Button>
        <Button
          className={twMerge('btn-default-custom')}
          style={{
            width: 200,
          }}
          onClick={() => handleModalOpen(ModalType.Withdraw)}>
          {t('SUPPLY_TABLE_ACTION_WITHDRAW')}
        </Button>
      </TableAction>
    );
  };

  const handleOk = ({ amount, txUrl, token }: any) => {
    fetchUserData();
    setModal({
      type: ModalType.Success,
      txUrl,
      message: t('SUPPLY_SUCCESS_MODAL_MESSAGE', {
        token,
        amount,
      }),
    });
  };

  const title = () => {
    if (!provider?.account) {
      return t('SUPPLY_GUEST_TABLE_TITLE');
    }
    return t('SUPPLY_TABLE_TITLE');
  };

  const handleError = ({ code, message, txhash }: any) => {
    setModal({
      type: ModalType.Error,
      code, message, txhash
    });
  }

  return (
    <div className={twMerge('supply-page-container', cssClass.supplyPage)}>
      <SupplyOverview />
      <div className="content">
        <Table
          title={title}
          expandable={{
            expandedRowKeys: data.map(item => item.key),
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
        handleOk={handleOk}
        handleError={handleError}
        isModalOpen={modal?.type == ModalType.Supply}
        handleCancel={() => setModal({})}
      />
      <ModalWithdraw
        {...modal}
        handleOk={handleOk}
        handleError={handleError}
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
