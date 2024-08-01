import InputComponent from '@/components/stake/input.component';
import cssClass from '@/components/stake/stake-form.component.module.scss';
import { NETWORKS } from '@/constants/stake/networks';
import { useNotification } from '@/hooks/notifications.hook';
import { useWeb3 } from '@/hooks/web3.hook';
import contractService from '@/utils/contract/stOAS.service';
import { LoadingOutlined } from '@ant-design/icons';
import { Button, Card, Spin, Switch } from 'antd';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAccount, useNetwork } from 'wagmi';

export default function StakeForm({
  formType = 'stake',
  inputFrom,
  inputTo,
  network,
  onChangeInput,
  initParentData,
  neptureStatus,
}: {
  formType?: string;
  inputFrom: any;
  inputTo: any;
  network: any;
  initParentData: any;
  onChangeInput: any;
  neptureStatus: any;
}) {
  /**
   * STATES
   */
  const [isLoading, setIsLoading] = useState(false);
  const [isBridgeDefi, setIsBridgeDefi] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState<any | null>(null);
  const inputFromRef = useRef<any | null>();
  const inputToRef = useRef<any | null>();
  const [balance, setBalance] = useState(0);
  /**
   * HOOKS
   */
  const { getBalanceCoin } = useWeb3();
  const { address, connector } = useAccount();
  const { chain } = useNetwork();
  const [showSuccess, showError, showWarning, contextHolder] = useNotification();
  /**
   * FUNCTIONS
   */
  const getBalance = useCallback(async () => {
    try {
      if (!address) {
        return;
      }
      const provider = { rpcUrl: inputFrom?.rpc };
      if (provider) {
        const rs: any = await getBalanceCoin(provider, address);
        setBalance(rs);
      }
    } catch (error) {
      console.log('🚀 ~ getBalance ~ error:', error);
      setBalance(0);
    }
  }, [address, getBalanceCoin, inputFrom?.rpc]);
  const initData = useCallback(async () => {
    getBalance();
  }, [getBalance]);
  const checkNetwork = () => {
    if (chain?.id !== inputFrom?.chain_id) {
      return true;
    }
    return false;
  };
  const onChangeInputFrom = (input: any) => {
    onChangeInput(input, 'from');
  };
  const onChangeInputTo = (input: any) => {
    onChangeInput(input, 'to');
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
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      if (formType === 'stake') {
        // check network fee
        const isEstimate = true;
        const estimateGas: any = await handleDeposit(isEstimate);
        const networkFee = BigNumber(estimateGas?.gasLimit || 0)
          .times(estimateGas?.gasPrice || 0)
          .div(Math.pow(10, inputFrom.decimals))
          .toNumber();
        if (networkFee > balance) {
          showError('Insufficient balance');
          setIsLoading(false);
          return;
        }
        // submit
        await handleDeposit();
      }
      if (formType === 'unstake') {
        // check network fee
        const isEstimate = true;
        const estimateGas: any = await handleRedeem(isEstimate);

        const networkFee = BigNumber(estimateGas?.gasLimit || 0)
          .times(estimateGas?.gasPrice || 0)
          .div(Math.pow(10, inputFrom.decimals))
          .toNumber();

        if (networkFee > balance) {
          showError('Insufficient balance');
          setIsLoading(false);
          return;
        }
        // check network fee
        await handleRedeem();
      }
      if (inputFromRef) await inputFromRef?.current?.getBalance();
      if (inputToRef) await inputToRef?.current?.getBalance();
      setIsLoading(false);
    } catch (error) {
      console.log('🚀 ~ handleSubmit ~ error:', error);
      setIsLoading(false);
      showError(error);
    }
  };
  const handleRedeem = async (isEstimate = false) => {
    try {
      const provider = await connector?.getProvider();
      let contract_address = inputFrom?.address;
      const params = {
        amount: BigNumber(inputFrom.amount).times(Math.pow(10, inputFrom.decimals)).toFixed(),
      };
      const rs = await contractService.redeem(
        provider,
        contract_address,
        address,
        params,
        isEstimate,
      );
      if (isEstimate) {
        return rs; // get estimate
      }
      setIsLoading(false);
      showSuccess('Redeem success');
      initData();
      initParentData();
    } catch (error) {
      throw error;
    }
  };
  const handleDeposit = async (isEstimate = false) => {
    try {
      const provider = await connector?.getProvider();
      let contract_address = network?.stOASContract;

      const params = {
        amount: BigNumber(inputFrom.amount).times(Math.pow(10, inputFrom.decimals)).toFixed(),
        isBridgeToLayer2: isBridgeDefi,
      };
      const rs: any = await contractService.deposit(
        provider,
        contract_address,
        address,
        params,
        isEstimate,
      );
      if (isEstimate) {
        return rs; // get estimate
      }
      setIsLoading(false);
      showSuccess('Deposit success');
      initData();
      initParentData();
    } catch (error) {
      console.log('🚀 ~ handleDeposit ~ error:', error);
      throw error;
    }
  };

  /**
   * SIDE EFFECTS
   */
  useEffect(() => {
    initData();
  }, [initData]);
  useEffect(() => {
    checkNetwork();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /**
   * RENDERS
   * */
  const btnAction = () => {
    if (checkNetwork()) {
      return (
        <Button
          disabled={isLoading}
          className="w-full btn-primary-custom"
          onClick={() => {
            switchOrAddNetwork();
          }}>
          Switch to {network.name} network
        </Button>
      );
    } else {
      return (
        <Button
          disabled={isLoading || inputFrom?.amount <= 0}
          className={`w-full btn-primary-custom ${isBridgeDefi ? 'btn-defi' : ''}`}
          onClick={handleSubmit}>
          {isLoading && <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}{' '}
          {formType === 'stake'
            ? isBridgeDefi
              ? `Stake and bridge ${inputTo?.symbol} to DeFiVerse`
              : 'Stake'
            : 'Redeem'}
        </Button>
      );
    }
  };
  return (
    <div className={twMerge(cssClass.stakeFormComponent)}>
      {contextHolder}
      <Card bordered={false} className="card-form">
        <div className="stake-form-content">
          <InputComponent
            ref={inputFromRef}
            label={formType === 'stake' ? 'Stake' : 'Redeem'}
            disabled={false}
            input={inputFrom}
            network={network}
            onChangeInput={onChangeInputFrom}
            className="mb-4"
            isShowNetworks={formType === 'stake' ? false : true}
            isSendMax={true}
            isBridgeDefi={isBridgeDefi}
          />
          <InputComponent
            ref={inputToRef}
            label="Receive"
            disabled={true}
            input={inputTo}
            network={network}
            onChangeInput={onChangeInputTo}
          />
        </div>
        {formType === 'stake' && (
          <>
            <div className="is-bridge-container flex items-center mt-4">
              <div className="label">Bridge to Defiverse</div>
              <div className="ml-auto">
                <Switch disabled={isLoading} checked={isBridgeDefi} onChange={setIsBridgeDefi} />{' '}
              </div>
            </div>
            {isBridgeDefi && (
              <div className="is-bridge-warning mt-4">
                <div className="label mb-1"> Stake and bridge can combine </div>
                <div className="label"> Stake and bridge stOAS to Defiverse in one Tx </div>
              </div>
            )}
          </>
        )}
        <div className="btn-group-actions mt-4">{btnAction()}</div>
        <div className="exchange-rate-container flex items-center mt-4">
          <div className="label">Exchange rate</div>
          <div className="ml-auto">
            1 {inputFrom?.symbol} = {neptureStatus?.rate * 1} {inputTo?.symbol}
          </div>
        </div>
      </Card>
    </div>
  );
}
