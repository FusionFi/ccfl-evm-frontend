import cssClass from '@/components/stake/input.component.module.scss';
import { NETWORKS } from '@/constants/stake/networks';
import { DEFI_UNSTAKE_TOKEN_FROM, OAS_UNSTAKE_TOKEN_FROM } from '@/constants/stake/tokens';
import { useWeb3 } from '@/hooks/web3.hook';
import { convertExponentialToDecimal, truncateDecimal } from '@/utils/common';
import contractService from '@/utils/contract/stOAS.service';
import { Card, Input } from 'antd';
import BigNumber from 'bignumber.js';
import Image from 'next/image';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAccount } from 'wagmi';
const InputComponent = forwardRef(
  (
    {
      label,
      input,
      network,
      disabled,
      onChangeInput, // function
      isShowNetworks = false,
      isSendMax = false,
      isBridgeDefi,
      ...props
    }: any,
    ref: any,
  ) => {
    /**
     * STATES
     */
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectNetworks, setSelectNetworks] = useState<any[]>([]);
    /**
     * HOOKS
     */
    const { address } = useAccount();
    const { getBalanceCoin, getTokenBalance, getWeb3 } = useWeb3();
    /**
     * FUNCTIONS
     */
    const initSelectNetworks = useCallback(() => {
      setSelectNetworks(
        NETWORKS.map(item => ({
          ...item,
          value: item.chain_id_decimals,
          label: item.name,
        })),
      );
    }, []);

    const getBalance = useCallback(async () => {
      try {
        if (!address) {
          return;
        }
        setLoading(true);
        setTimeout(async () => {
          const provider = { rpcUrl: input?.rpc };

          let rs: any = 0;
          if (input?.is_native) {
            rs = await getBalanceCoin(provider, address);
          } else {
            rs = await getTokenBalance(provider, input?.address, address);

            rs = BigNumber(rs?.toString()).div(Math.pow(10, input?.decimals || 18));
          }
          setBalance(isNaN(Number(rs)) ? 0 : rs);

          setLoading(false);
        }, 500);
      } catch (error) {
        console.log('🚀 ~ getBalance ~ error:', error);
        setBalance(0);
        setLoading(false);
      }
    }, [
      address,
      getBalanceCoin,
      getTokenBalance,
      input?.address,
      input?.decimals,
      input?.is_native,
      input?.rpc,
    ]);
    const handleAmount = (value: any) => {
      const cloneInput = { ...input };
      cloneInput.amount = value;
      onChangeInput(cloneInput);
    };

    const handleChange = (e: any) => {
      const { value: inputValue } = e.target;
      const reg = /^-?\d*(\.\d*)?$/;
      if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
        handleAmount(inputValue);
      }
    };
    const handleChangeNetwork = (value: any) => {
      let cloneInput = { ...input };
      cloneInput.chain_id = value;

      if (cloneInput.chain_id === OAS_UNSTAKE_TOKEN_FROM?.chain_id) {
        cloneInput = OAS_UNSTAKE_TOKEN_FROM;
      }
      if (cloneInput.chain_id === DEFI_UNSTAKE_TOKEN_FROM?.chain_id) {
        cloneInput = DEFI_UNSTAKE_TOKEN_FROM;
      }
      onChangeInput(cloneInput);
    };

    // '.' at the end or only '-' in the input box.
    const handleBlur = (e: any) => {
      const { value } = e.target;
      let valueTemp = value;
      if (value?.charAt(value?.length - 1) === '.' || value === '-') {
        valueTemp = value.slice(0, -1);
      }
      handleAmount(valueTemp?.replace(/0*(\d+)/, '$1'));
    };
    const estimateDeposit = async (amount: any) => {
      try {
        const provider = { rpcUrl: input?.rpc };
        let contract_address = network?.stOASContract;

        const params = {
          amount: BigNumber(amount).times(Math.pow(10, input.decimals)).toFixed(),
          isBridgeToLayer2: isBridgeDefi,
        };
        const isEstimateGas = true;
        const rs: any = await contractService.deposit(
          provider,
          contract_address,
          address,
          params,
          isEstimateGas,
        );
        const networkFee = BigNumber(rs?.gasLimit || 0)
          .times(rs?.gasPrice || 0)
          .div(Math.pow(10, input.decimals))
          .toNumber();

        return networkFee;
      } catch (error) {
        console.log('🚀 ~ estimateDeposit ~ error:', error);
      }
    };
    const estimateRedeem = async (amount: any) => {
      try {
        const provider = { rpcUrl: input?.rpc };
        let contract_address = input?.address;

        const params = {
          amount: BigNumber(amount).times(Math.pow(10, input.decimals)).toFixed(),
        };
        const isEstimateGas = true;
        const rs = await contractService.redeem(
          provider,
          contract_address,
          address,
          params,
          isEstimateGas,
        );
        const networkFee = BigNumber(rs?.gasLimit || 0)
          .times(rs?.gasPrice || 0)
          .div(Math.pow(10, input.decimals))
          .toNumber();

        return networkFee;
      } catch (error) {
        console.log('🚀 ~ estimateRedeem ~ error:', error);
      }
    };
    const getAmountSendMax = async () => {
      if (!isSendMax) {
        return;
      }
      // estimate network fee here
      let networkFee: any = 0;
      if (label?.toLowerCase() === 'stake') {
        networkFee = await estimateDeposit(balance);
      } else {
        networkFee = await estimateRedeem(balance);
      }
      let max_amount: any = BigNumber(balance).minus(networkFee).toNumber();
      if (max_amount < 0) {
        max_amount = 0;
      }
      // covert -e
      if (/^[-+]?\d*\.?\d*(e[-+]?\d+)?$/i.test(max_amount)) {
        max_amount = convertExponentialToDecimal(max_amount);
      }

      handleAmount(max_amount);
    };
    /**
     * SIDE EFFECTS
     */
    useEffect(() => {
      getBalance();
      if (isShowNetworks) {
        initSelectNetworks();
      }
    }, [getBalance, initSelectNetworks, isShowNetworks]);

    // EXPORTS FUNCTIONS
    useImperativeHandle(ref, () => ({
      getBalance,
    }));
    /**
     * RENDERS
     */

    return (
      <div {...props}>
        <div className={twMerge('input-component', cssClass.inputComponent)}>
          <Card loading={loading}>
            <div className="flex items-center input-title">
              <div className={`input-label ${label?.toLowerCase() === 'stake' ? 'stake' : ''}`}>
                {label}
                {/* {isShowNetworks && (
                  <Select
                    value={input.chain_id}
                    style={{ width: 120 }}
                    onChange={handleChangeNetwork}
                    options={selectNetworks}
                  /> 
                )}*/}
              </div>
              <div className={`ml-auto input-balance`}>
                Balance:
                <span
                  onClick={() => {
                    getAmountSendMax();
                  }}
                  className={`value ${isSendMax ? 'send-max' : ''}`}>
                  {truncateDecimal(balance)} {input?.symbol}
                </span>
              </div>
            </div>
            <div className="input-control flex items-center">
              <div className="input token">
                {input?.logoURI && <Image src={input?.logoURI} alt={input?.symbol} />}
              </div>
              <Input
                disabled={disabled}
                value={input?.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={'0.0'}
                maxLength={16}
              />
              <div className="input-token">{input?.symbol}</div>
            </div>
          </Card>
        </div>
      </div>
    );
  },
);
InputComponent.displayName = 'InputComponent';
export default InputComponent;
