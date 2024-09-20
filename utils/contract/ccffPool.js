import AbiCcflPool from '@/utils/contract/abi/ccflPool.json';
import {
  addNetwork,
  getWeb3,
  sendRawTx,
  switchOrAddNetwork,
  coverDecimals,
  _getMetaMaskProvider,
  estimateGas,
  getBalanceCoin,
} from '@/utils/contract/web3';
import BigNumber from 'bignumber.js';
import { toAmountShow } from '@/utils/common';
import { addTokenToMetamask, approveStableCoin } from '@/utils/contract/erc20';
import { MaxUint256, getAllowance } from '@/utils/contract/erc20';
import { ethers } from 'ethers';
import abi_erc20 from '@/utils/contract/abi/erc20.json';

//import multicall from './multicall.js';
const _initContract = (provider, contract_address) => {
  const myWeb3 = getWeb3(provider);
  return new myWeb3.eth.Contract(AbiCcflPool, contract_address);
};


// const providerURL = 'https://eth-sepolia.g.alchemy.com/v2/h_yCYWntvdt2dbI4vL2J-XjZnQk0jYnl';
// const BORROWER_PRIVATE_KEY =
//   '6e7889948e6b548c95088cf8c02badb705897e71210aea60bf5778155cad8226' || '';
// const USDC_ERC20_CONTRACT = '0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8' || '';
const WBTC_ERC20_CONTRACT = '0x29f2D40B0605204364af54EC677bD022dA425d03' || '';
const CCFL = '0xC5095DEaAb52F0f788158790244BEBCa5b590368' || '';

const getGasFeeApprove = async (provider, account, amount, tokenAddress, contract_address) => {
  let overwrite = { from: account };
  try {
    const res = await sendRawTx(
      provider,
      abi_erc20,
      tokenAddress,
      'approve',
      [contract_address, amount],
      overwrite,
      true,
    );
    return res && res.gasPrice
      ? BigNumber(res.gasPrice)
        .div(10 ** 18)
        .toFixed()
      : 0;
  } catch (error) { }
};

const getGasFeeCreateLoan = async (
  provider,
  account,
  contract_address,
  amountLoan,
  stableCoinContract,
  amountCollateral,
  collateralContract,
  IsYieldGenerating,
  isFiat,
) => {
  console.log(
    'getGasFeeCreateLoan',
    provider,
    account,
    contract_address,
    amountLoan,
    stableCoinContract,
    amountCollateral,
    collateralContract,
    IsYieldGenerating,
    isFiat,
  );

  let overwrite = { from: account };
  let params = {
    amount: amountLoan,
    stableCoin: stableCoinContract,
    amountCollateral,
    collateral: collateralContract,
    IsYieldGenerating,
    isFiat,
  };
  try {
    const res = await sendRawTx(
      provider,
      abi,
      contract_address,
      'CreateLoan',
      params,
      overwrite,
      true,
    );
    console.log('getGasFeeCreateLoan res', res);

    return res && res.gasPrice
      ? BigNumber(res.gasPrice)
        .div(10 ** 18)
        .toFixed()
      : 0;
  } catch (error) { }
};

const service_ccfl_borrow = {
  getCollateralInfo,
  approveBorrow,
  createLoan,
  getGasFeeApprove,
  approveBorrow1,
  checkAllowance,
  getGasFeeCreateLoan,
};
export default service_ccfl_borrow;
