import abi from '@/utils/contract/abi/ccfl_metadata.json';
import {
  addNetwork,
  getWeb3,
  sendRawTx,
  switchOrAddNetwork,
  coverDecimals,
} from '@/utils/contract/web3';
import BigNumber from 'bignumber.js';
import { toAmountShow } from '@/utils/common';

//import multicall from './multicall.js';
const _initContract = (provider, contract_address) => {
  const myWeb3 = getWeb3(provider);
  return new myWeb3.eth.Contract(abi, contract_address);
};

const getCollateralInfo = async (provider, contract_address) => {
  try {
    const contract = _initContract(provider, contract_address);
    let amount = coverDecimals(10);

    const calls = [
      contract.methods
        .checkMinimalCollateralForLoan(
          amount,
          '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
          '0x29f2D40B0605204364af54EC677bD022dA425d03',
        )
        .call(),
    ];
    let [resMinimalCollateral] = await Promise.allSettled(calls);

    return {
      minimalCollateral:
        resMinimalCollateral.status === 'fulfilled' ? resMinimalCollateral.value : 0,
    };
  } catch (error) {
    console.log('🚀 ~ getStOASInfo ~ error:', error);
    return {
      minimalCollateral: 0,
    };
  }
};

const service_ccfl_borrow = {
  getCollateralInfo,
};
export default service_ccfl_borrow;
