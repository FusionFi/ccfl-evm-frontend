import abi from '@/utils/contract/abi/stOAS.json';
import { addNetwork, getWeb3, sendRawTx, switchOrAddNetwork } from '@/utils/contract/web3';
import BigNumber from 'bignumber.js';
//import multicall from './multicall.js';
const _initContract = (provider, contract_address) => {
  const myWeb3 = getWeb3(provider);
  return new myWeb3.eth.Contract(abi, contract_address);
};

const getStOASInfo = async (provider, contract_address, params) => {
  try {
    const contract = _initContract(provider, contract_address);
    const { rate } = params;

    const rate_value = new BigNumber(1).times(10 ** 18).toFixed(0);
    const calls = [
      contract.methods[rate](rate_value).call(),
      contract.methods.totalStakers().call(),
      contract.methods.totalOAS().call(),
      contract.methods.totalStOAS().call(), // total stOAS marketcap
    ];
    let [pmRate, pmTotalStakers, pmTotalDeposit, pmTotalStOAS] = await Promise.allSettled(calls);

    return {
      exchangeRate:
        pmRate.status === 'fulfilled'
          ? BigNumber(pmRate.value)
              .div(10 ** 18)
              .toFixed()
          : 0,
      totalStakers: pmTotalStakers.status === 'fulfilled' ? pmTotalStakers.value : 0,
      totalOAS: pmTotalDeposit.status === 'fulfilled' ? pmTotalDeposit.value : 0,
      totalStOAS: pmTotalStOAS.status === 'fulfilled' ? pmTotalStOAS.value : 0,
    };
  } catch (error) {
    console.log('🚀 ~ getStOASInfo ~ error:', error);
    return {
      exchangeRate: 0,
      totalStakers: 0,
      totalOAS: 0,
      totalStOAS: 0,
    };
  }
};
const getWithdrawAmount = async (provider, contract_address, account) => {
  try {
    const contract = _initContract(provider, contract_address);
    let rs = await contract.methods.getWithdrawalAmount(account).call();
    return rs;
  } catch (error) {
    console.log('getWithdrawAmount=>error', error);
    throw error;
  }
};
export const deposit = async (provider, contract_address, account, params, isEstimateGas) => {
  try {
    const { amount, isBridgeToLayer2 } = params;
    let overwrite = { from: account, value: amount };
    console.log('🚀 ~ deposit ~ amount:', amount);
    const res = await sendRawTx(
      provider,
      abi,
      contract_address,
      'deposit',
      [amount, isBridgeToLayer2],
      overwrite,
      isEstimateGas,
      // gasParams
    );
    return res;
  } catch (error) {
    console.log('deposit=>error', error);
    throw error;
  }
};
export const redeem = async (provider, contract_address, account, params, isEstimateGas) => {
  try {
    const { amount } = params;
    let overwrite = { from: account };
    const res = await sendRawTx(
      provider,
      abi,
      contract_address,
      'redeem',
      [amount],
      overwrite,
      // gasParams
      isEstimateGas,
    );
    return res;
  } catch (error) {
    console.log('redeem=>error', error);
    throw error;
  }
};
export const withdraw = async (provider, contract_address, account) => {
  try {
    let overwrite = { from: account };
    const res = await sendRawTx(
      provider,
      abi,
      contract_address,
      'withdraw',
      [],
      overwrite,
      // gasParams
    );
    return res;
  } catch (error) {
    console.log('withdraw=>error', error);
    throw error;
  }
};
const service = {
  getStOASInfo,
  getWeb3,
  getWithdrawAmount,
  deposit,
  redeem,
  withdraw,
  switchOrAddNetwork,
  addNetwork,
};
export default service;
