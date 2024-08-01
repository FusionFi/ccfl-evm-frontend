import cssClass from '@/components/stake/stake.component.module.scss';
import { NETWORKS, STAKE_DEFAULT_NETWORK } from '@/constants/stake/networks';
import {
  OAS_UNSTAKE_TOKEN_FROM,
  STAKE_TOKEN_FROM,
  STAKE_TOKEN_TO,
  UNSTAKE_TOKEN_TO,
} from '@/constants/stake/tokens';
import eventBus from '@/hooks/eventBus.hook';
import { useNotification } from '@/hooks/notifications.hook';
import backendService from '@/utils/backend/index';
import { convertExponentialToDecimal, truncateDecimal } from '@/utils/common';
import contractService from '@/utils/contract/stOAS.service';
import { InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Card, Pagination, Spin, Tabs, TabsProps, Tooltip } from 'antd';
import BigNumber from 'bignumber.js';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAccount, useNetwork } from 'wagmi';
import StakeForm from './stake-form.component';
import UnstakeHistory from './unstake-history.component';
export default function Stake() {
  /**
   * STATES
   * */
  const [activeKey, setActiveKey] = useState('1');
  const [inputFrom, setInputFrom] = useState<any | null>(null);
  const [inputTo, setInputTo] = useState<any | null>(null);
  const [neptureStatus, setNeptureStatus] = useState<any | null>(null);
  const [withdrawAmount, setWithdrawAmount] = useState<any | null>(null);
  const [unstakeHistoryList, setUnstakeHistoryList] = useState<any | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  /**
   * HOOKS
   */
  const { address, connector } = useAccount();
  const { chain } = useNetwork();
  const [showSuccess, showError, showWarning, contextHolder] = useNotification();

  /**
   * FUNCTIONS
   */
  const checkNetwork = () => {
    if (chain?.id !== inputFrom?.chain_id) {
      return true;
    }
    return false;
  };
  const switchOrAddNetwork = async () => {
    try {
      setIsLoading(true);
      const provider = { rpcUrl: inputFrom?.rpc };
      const networkSwitch = NETWORKS.find(item => item.chain_id_decimals === inputFrom?.chain_id);
      const rs = await contractService.switchOrAddNetwork(networkSwitch, provider);
      setIsLoading(false);
    } catch (error) {
      console.log('🚀 ~ switchNetwork ~ error:', error);
      setIsLoading(false);
      showError(error);
    }
  };
  const calculateInputTo = (input: any) => {
    if (input && input.amount) {
      let inputToAmount: any = new BigNumber(input.amount).times(neptureStatus.rate).toNumber();
      // covert -e
      if (/^[-+]?\d*\.?\d*(e[-+]?\d+)?$/i.test(inputToAmount)) {
        inputToAmount = convertExponentialToDecimal(inputToAmount);
      }
      setInputTo({
        ...inputTo,
        amount: inputToAmount,
      });
    }
  };
  const onChangeInput = (input: any, type: string) => {
    if (type === 'from') {
      setInputFrom(input);
      calculateInputTo(input);
    } else if (type === 'to') {
      setInputTo(input);
    }
  };

  const onChange = (key: string) => {
    setActiveKey(key);
    initForm();
  };
  const initStakeForm = () => {
    setInputFrom({
      ...STAKE_TOKEN_FROM,
      amount: null,
    });
    setInputTo({
      ...STAKE_TOKEN_TO,
      amount: null,
    });
  };
  const initUnstakeForm = () => {
    setInputFrom({
      ...OAS_UNSTAKE_TOKEN_FROM,
      amount: null,
    });
    setInputTo({
      ...UNSTAKE_TOKEN_TO,
      amount: null,
    });
  };
  const initForm = useCallback(() => {
    if (activeKey === '1') {
      initStakeForm();
    } else if (activeKey === '2') {
      initUnstakeForm();
    }
  }, [activeKey]);
  const getWithdrawAmount = useCallback(async () => {
    try {
      if (!address) {
        return;
      }
      const provider = { rpcUrl: STAKE_DEFAULT_NETWORK?.rpc }; // network is default network OAS
      const contract_address = STAKE_DEFAULT_NETWORK?.stOASContract;
      const rs: any = await contractService.getWithdrawAmount(provider, contract_address, address);

      setWithdrawAmount(
        Number(
          BigNumber(rs)
            .div(Math.pow(10, inputTo?.decimals || 18))
            .toFixed(),
        ),
      );
    } catch (error) {
      console.log('getWithdrawAmount=>error', error);
    }
  }, [address, inputTo?.decimals]);

  const getNeptureStatus = useCallback(async () => {
    try {
      const provider = { rpcUrl: STAKE_DEFAULT_NETWORK?.rpc };
      const contract_address = STAKE_DEFAULT_NETWORK?.stOASContract;
      const params = {
        // estimateOAS 1 stOAS = xxx OAS
        // estimateStOAS 1 OAS = xxx stOAS
        rate: Number(activeKey) === 2 ? 'estimateOAS' : 'estimateStOAS',
      };

      const rs: any = await contractService.getStOASInfo(provider, contract_address, params);

      setNeptureStatus({
        rate: Number(rs?.exchangeRate),
        total_staked: BigNumber(Number(rs?.totalOAS))
          .div(Math.pow(10, inputTo?.decimals || 18))
          .toFixed(),
        stakers: Number(rs?.totalStakers),
        stOAS_market: BigNumber(Number(rs?.totalStOAS))
          .div(Math.pow(10, inputTo?.decimals || 18))
          .toFixed(),
      });
    } catch (error) {
      console.log('getNeptureStatus=>error', error);
    }
  }, [activeKey, inputTo?.decimals]);
  const getUnstakeHistory = useCallback(async () => {
    try {
      if (!address) {
        return;
      }
      setIsLoadingHistory(true);
      const params = {
        user_address: address,
        offset: (currentPage - 1) * pageSize,
        limit: pageSize,
      };
      const rs: any = await backendService.getWithdrawHistory(params);
      const items = rs?.items || [];
      const list = items.map((item: any) => {
        return {
          ...item,
          unstakeTime: dayjs(item.updated_at).unix(),
          withdrawAmount: BigNumber(item.amount_out)
            .div(Math.pow(10, inputTo?.decimals || 18))
            .toFixed(),
          withdrawTime: item.unlock_time ? dayjs(item.unlock_time * 1000).unix() : null,
        };
      });
      console.log('🚀 ~ list ~ list:', list);
      setUnstakeHistoryList(list);
      setTotalPage(rs?.total || 0);
      setIsLoadingHistory(false);
    } catch (error) {
      setIsLoadingHistory(false);
      console.log('getUnstakeHistory=>error', error);
    }
  }, [address, inputTo?.decimals, currentPage]);
  const initData = useCallback(() => {
    initForm();
    getWithdrawAmount();
    getNeptureStatus();
    getUnstakeHistory();
    eventBus.emit('reloadBalance');
  }, [initForm, getWithdrawAmount, getNeptureStatus, getUnstakeHistory]);
  const onWithdraw = async () => {
    try {
      setIsLoading(true);
      await handleWithdraw();

      setIsLoading(false);
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error);
      setIsLoading(false);
      showError(error);
    }
  };
  const handleWithdraw = async () => {
    try {
      const provider = await connector?.getProvider();
      let contract_address = STAKE_DEFAULT_NETWORK?.stOASContract;

      const rs: any = await contractService.withdraw(provider, contract_address, address);

      setIsLoading(false);
      showSuccess('Withdraw success');
      await initData();
    } catch (error) {
      throw error;
    }
  };
  const onChangePage = (page: number) => {
    console.log('🚀 ~ onChangePage ~ page:', page);
    setCurrentPage(page);
    getUnstakeHistory();
  };
  const reloadData = () => {
    setTimeout(() => {
      initData();
    }, 2000);
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Stake',
      children: (
        <StakeForm
          formType="stake"
          inputFrom={inputFrom}
          inputTo={inputTo}
          network={STAKE_DEFAULT_NETWORK}
          onChangeInput={onChangeInput}
          initParentData={reloadData}
          neptureStatus={neptureStatus}
        />
      ),
    },
    {
      key: '2',
      label: 'Unstake',
      children: (
        <StakeForm
          formType="unstake"
          inputFrom={inputFrom}
          inputTo={inputTo}
          network={STAKE_DEFAULT_NETWORK}
          onChangeInput={onChangeInput}
          initParentData={initData}
          neptureStatus={neptureStatus}
        />
      ),
    },
  ];
  /**
   * SIDE EFFECTS
   * */
  useEffect(() => {
    initData();
  }, [initData]);
  useEffect(() => {
    checkNetwork();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * RENDERS
   */
  return (
    <div className={twMerge(cssClass.stakeComponent)}>
      {activeKey === '1' && <div className="stake-title">Stake OAS and receive stOAS </div>}
      {activeKey === '2' && <div className="stake-title">Unstake stOAS and receive OAS </div>}
      <div className="stake-form-container">
        <Tabs activeKey={activeKey} items={items} onChange={onChange} />
      </div>
      {activeKey === '2' && (
        <div className="stake-info-container history">
          <div className="nepture-title mt-6">
            <h1>Unstake history</h1>
          </div>
          <Card bordered={false} className="card-nepture">
            <div className="unstake-history-list">
              <UnstakeHistory list={unstakeHistoryList} inputFrom={inputFrom} inputTo={inputTo} />
              {unstakeHistoryList?.length > 0 && totalPage > pageSize && (
                <div className="pagination">
                  <Pagination
                    disabled={isLoadingHistory}
                    pageSize={pageSize}
                    current={currentPage}
                    total={totalPage}
                    onChange={onChangePage}
                  />
                </div>
              )}
            </div>
            <div className="nepture-status flex items-center">
              <div className="label">Withdraw amount</div>
              <div className="value ml-auto">
                {truncateDecimal(withdrawAmount)} {inputTo?.symbol}
              </div>
            </div>
            {withdrawAmount > 0 &&
              (checkNetwork() ? (
                <Button
                  disabled={isLoading}
                  className="w-full mt-4 btn-primary-custom"
                  onClick={() => {
                    switchOrAddNetwork();
                  }}>
                  Switch to {STAKE_DEFAULT_NETWORK.name} network
                </Button>
              ) : (
                <Button
                  disabled={isLoading}
                  className="w-full mt-4 btn-primary-custom"
                  onClick={onWithdraw}>
                  {isLoading && (
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                  )}
                  Withdraw
                </Button>
              ))}
          </Card>
        </div>
      )}
      <div className="stake-info-container">
        <div className="nepture-title my-4">
          <h1>Nepture Stats</h1>
        </div>
        <Card bordered={false} className="card-nepture">
          <div className="nepture-status flex items-center mb-2">
            <div className="label">
              Annual percentage rate
              <Tooltip
                title="The Annual Percentage Yield for Validators APY is the Annual Percentage Yield, which
                is the annual rate of return, including compound interest. The difference between
                APY and APR is whether or not it includes compound interest. To obtain the maximum
                APY interest rate, you must restake each epoch. A 10% flat rate validator reward is
                applied to all validators; therefore, stakers can earn 9% = 10% x (1-10%) of the
                staking amount.">
                <InfoCircleOutlined />
              </Tooltip>
            </div>
            <div className="value ml-auto">
              <span className="blue">{truncateDecimal(10)}% </span>
            </div>
          </div>
          <div className="nepture-status flex items-center mb-2">
            <div className="label">Total staked with Neptune</div>
            <div className="value ml-auto">{truncateDecimal(neptureStatus?.total_staked)}</div>
          </div>
          <div className="nepture-status flex items-center mb-2">
            <div className="label">Stakers</div>
            <div className="value ml-auto">{truncateDecimal(neptureStatus?.stakers)}</div>
          </div>
          <div className="nepture-status flex items-center mb-2">
            <div className="label">stOAS market cap</div>
            <div className="value ml-auto">{truncateDecimal(neptureStatus?.stOAS_market)}</div>
          </div>
        </Card>
        {activeKey === '2' && (
          <div className="unstake-warning-text mt-8">
            <div className="description mt-2 text-center">
              Unstaking is only possible on Oasys hub.
            </div>
            <div className="description mt-4 text-center">Unstaking requires 10 days</div>
          </div>
        )}
      </div>
    </div>
  );
}
