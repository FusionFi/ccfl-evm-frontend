import AbiPool from '@/utils/contract/abi/ccflPool.json';
import {
  getGasPrice,
  watchChainId,
  watchAccount,
  waitForTransactionReceipt,
  switchChain,
  writeContract,
  connect,
  disconnect,
  getChainId,
  getAccount,
  getConnectors,
  readContract,
  simulateContract,
  estimateGas,
} from '@wagmi/core';
import { config } from '@/libs/wagmi.lib';
import BaseProvider from './base.provider';
import AbiERC20 from '@/utils/contract/abi/erc20.json';
import { createConfigWithCustomTransports } from '@/libs/wagmi.lib';
import BigNumber from 'bignumber.js';
import * as Actions from '@/actions/auth.action';
import service_ccfl_borrow from '@/utils/contract/ccflBorrow.service';
import service_ccfl_repay from '@/utils/contract/ccflRepay.service';
import { ACTION_TYPE } from '@/constants/common.constant';
import service_ccfl_collateral from '@/utils/contract/ccflCollateral.service';
import { encodeFunctionData } from 'viem';
// TODO: watch chain, account

let events: any = [];
console.log('events: ', events);

class EVMProvider extends BaseProvider {
  constructor(params: any) {
    super({
      ...params,
      type: 'evm',
    });
  }

  async connect(connector: any) {
    const account = getAccount(config);

    if (account?.isConnected && account?.status == 'connected') {
      return {
        accounts: account.addresses,
        chainId: account.chainId,
      };
    }

    const connectors = getConnectors(config);
    const _connector: any = connectors.find(
      item => item.name.toLowerCase() == connector.id.toLowerCase() || connector.id == item.type,
    );
    return await connect(config, {
      connector: _connector,
    });
  }

  async switchChain(chainId: any) {
    return await switchChain(config, { chainId });
  }

  async disconnect() {
    const connectors = getConnectors(config);
    const connector: any = connectors.find(
      item => item.name.toLowerCase() == this.connector?.id?.toLowerCase() || this?.connector?.id == item.type,
    );

    const result = await disconnect(config, {
      connector,
    });
    return result;
  }

  async supply({ amount, contractAddress, abi }: any) {
    const result = await writeContract(config, {
      address: contractAddress,
      abi: abi || AbiPool,
      functionName: 'supply',
      args: [amount],
    });

    const tx = await waitForTransactionReceipt(config, {
      confirmations: 1,
      hash: result,
    });

    return tx?.transactionHash || result;
  }

  async estimateGasForSupply({ amount, contractAddress, abi, chain, network }: any) {
    const config_ = createConfigWithCustomTransports({ chain, rpc: network?.rpcUrl });
    const gasLimit = await (async () => {
      try {
        return await estimateGas(config, {
          to: contractAddress,
          data: encodeFunctionData({
            abi: abi || AbiPool,
            functionName: 'supply',
            args: ['1000000'],
          }),
        });
      } catch (error) {
        return 150000;
      }
    })();

    const gasPrice = await getGasPrice(config_);
    const result = new BigNumber(gasPrice.toString())
      .times(new BigNumber(gasLimit?.toString() || 0))
      .toString();

    return result;
  }

  async estimateGasForWithdraw({ amount, contractAddress, abi, chain, network }: any) {
    const config_ = createConfigWithCustomTransports({ chain, rpc: network?.rpcUrl });
    const gasLimit = await (async () => {
      try {
        return await estimateGas(config, {
          to: contractAddress,
          data: encodeFunctionData({
            abi: abi || AbiPool,
            functionName: 'withdraw',
            args: ['1000000'],
          }),
        });
      } catch (error) {
        return 150000;
      }
    })();

    const gasPrice = await getGasPrice(config_);
    const result = new BigNumber(gasPrice.toString())
      .times(new BigNumber(gasLimit?.toString() || 0))
      .toString();

    return result;
  }

  async approve({ abi, value, spender, contractAddress }: any) {
    const result = await writeContract(config, {
      address: contractAddress,
      abi: abi || AbiERC20,
      functionName: 'approve',
      args: [spender, value],
    });

    const tx = await waitForTransactionReceipt(config, {
      confirmations: 1,
      hash: result,
    });

    return tx?.transactionHash || result;
  }

  async fetchAllowance({ abi, owner, spender, chain, contractAddress, network }: any) {
    if (!contractAddress) {
      return 0;
    }

    const config_ = createConfigWithCustomTransports({ chain, rpc: network?.rpcUrl });
    const result = await readContract(config_, {
      abi: abi || AbiERC20,
      address: contractAddress,
      functionName: 'allowance',
      args: [owner, spender],
    });

    return result;
  }

  async estimateNormalTxFee({ chain, network }: any) {
    const config_ = createConfigWithCustomTransports({ chain, rpc: network?.rpcUrl });
    const gasPrice = await getGasPrice(config_);
    const result = new BigNumber(gasPrice.toString()).times(21000).toString();

    return result;
  }

  subscribeEvents(dispatch: any): any {
    events.push(
      watchAccount(config, {
        onChange(data) {
          console.log('Account changed!', data);
          dispatch(
            Actions.updateProvider({
              provider: {
                account: data.address,
              },
            }),
          );
        },
      }),
    );

    events.push(
      watchChainId(config, {
        onChange(chainId) {
          console.log('Chain ID changed!', chainId);
          dispatch(
            Actions.updateProvider({
              provider: {
                chainId,
              },
            }),
          );
        },
      }),
    );
  }

  unsubscribeEvents(): any {
    events.forEach((unwatch: any) => {
      unwatch();
    });
    events = [];
  }

  async withdraw({ amount, contractAddress, abi }: any) {
    const result = await writeContract(config, {
      address: contractAddress,
      abi: abi || AbiPool,
      functionName: 'withdraw',
      args: [amount],
    });

    const tx = await waitForTransactionReceipt(config, {
      confirmations: 1,
      hash: result,
    });

    return tx?.transactionHash || result;
  }

  // start borrow part
  async approveBorrow({ provider, contract_address, amount, address, tokenContract }: any) {
    const tx = await service_ccfl_borrow.approveBorrow(
      provider,
      contract_address,
      amount,
      address,
      tokenContract,
    );

    return tx;
  }

  async createLoan({
    amount,
    amountCollateral,
    stableCoin,
    collateral,
    IsYieldGenerating,
    IsFiat,
    provider,
    account,
    contract_address,
    isGas,
    isFiat,
  }: any) {
    let tx;
    if (isGas) {
      tx = await service_ccfl_borrow.getGasFeeCreateLoan(
        provider,
        account,
        contract_address,
        amount,
        stableCoin,
        amountCollateral,
        collateral,
        IsYieldGenerating,
        isFiat,
      );
    } else {
      tx = await service_ccfl_borrow.createLoan(
        amount,
        amountCollateral,
        stableCoin,
        collateral,
        IsYieldGenerating,
        IsFiat,
        provider,
        account,
        contract_address,
      );
    }

    return tx;
  }

  async getCollateralMinimum({ provider, contract_address, amount, stableCoin, collateral }: any) {
    const res = await service_ccfl_borrow.getCollateralMinimum(
      provider,
      contract_address,
      amount,
      stableCoin,
      collateral,
    );

    return res;
  }

  async getHealthFactor({
    type,
    provider,
    contract_address,
    amount,
    stableCoin,
    collateral,
    amountCollateral,
    loanId,
  }: any) {
    let res;
    switch (type) {
      case ACTION_TYPE.REPAY:
        res = await service_ccfl_repay.getHealthFactor(provider, contract_address, amount, loanId);
        break;
      case ACTION_TYPE.COLLATERAL:
        res = await service_ccfl_collateral.getHealthFactor(
          provider,
          contract_address,
          amount,
          loanId,
        );
        break;
      case ACTION_TYPE.BORROW:
        res = await service_ccfl_borrow.getHealthFactor(
          provider,
          contract_address,
          amount,
          stableCoin,
          collateral,
          amountCollateral,
        );
        break;
    }

    return res;
  }

  async getGasFeeApprove({ provider, account, amount, tokenAddress, contract_address }: any) {
    const res = await service_ccfl_borrow.getGasFeeApprove(
      provider,
      account,
      amount,
      tokenAddress,
      contract_address,
    );
    return res;
  }

  async allowanceBorrow({ provider, tokenAddress, account, spender }: any) {
    const res = await service_ccfl_borrow.checkAllowance(provider, tokenAddress, account, spender);

    return res;
  }

  async repayLoan({ amount, stableCoin, provider, account, contract_address, loanId, isGas }: any) {
    let tx;
    if (isGas) {
      tx = await service_ccfl_repay.getGasFeeRepayLoan(
        provider,
        account,
        contract_address,
        amount,
        stableCoin,
        loanId,
      );
    } else {
      tx = await service_ccfl_repay.repayLoan(
        amount,
        stableCoin,
        provider,
        account,
        contract_address,
        loanId,
      );
    }

    return tx;
  }

  async addCollateral({
    provider,
    account,
    contract_address,
    amountCollateral,
    collateral,
    loanId,
    isGas,
  }: any) {
    let tx;
    if (isGas) {
      tx = await service_ccfl_collateral.getGasFeeAddCollateral(
        provider,
        account,
        contract_address,
        amountCollateral,
        collateral,
        loanId,
      );
    } else {
      tx = await service_ccfl_collateral.addCollateral(
        provider,
        account,
        contract_address,
        amountCollateral,
        collateral,
        loanId,
      );
    }

    return tx;
  }

  async withdrawAllCollateral({ provider, account, contract_address, loanId, isETH, isGas }: any) {
    let tx;
    console.log(provider, account, contract_address, loanId, isETH, isGas);
    if (isGas) {
      tx = await service_ccfl_collateral.getGasFeeWithdrawAllCollateral(
        provider,
        account,
        contract_address,
        loanId,
        isETH,
      );
    } else {
      tx = await service_ccfl_collateral.withdrawAllCollateral(
        provider,
        account,
        contract_address,
        loanId,
        isETH,
      );
    }

    return tx;
  }
  //end borrow part
}

export default EVMProvider;
