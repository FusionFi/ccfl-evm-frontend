import abi from '@/utils/contract/abi/ccfl_metadata.json';
import { getWeb3, sendRawTx, _getMetaMaskProvider, getBalanceCoin } from '@/utils/contract/web3';
import BigNumber from 'bignumber.js';
import { addTokenToMetamask, approveStableCoin } from '@/utils/contract/erc20';
import { getAllowance } from '@/utils/contract/erc20';
import { ethers } from 'ethers';
import abi_erc20 from '@/utils/contract/abi/erc20.json';

const _initContract = (provider, contract_address) => {
  const myWeb3 = getWeb3(provider);
  return new myWeb3.eth.Contract(abi, contract_address);
};

const getCollateralInfo = async (
  provider,
  contract_address,
  amount,
  stableCoin,
  collateral,
  amountCollateral,
) => {
  try {
    const contract = _initContract(provider, contract_address);

    console.log(
      'getCollateralInfo',
      amount,
      stableCoin,
      collateral,
      contract_address,
      amountCollateral,
    );
    const calls = [
      contract.methods.checkMinimalCollateralForLoan(amount, stableCoin, collateral).call(),
      contract.methods
        .estimateHealthFactor(stableCoin, amount, collateral, amountCollateral)
        .call(),
    ];
    let [resMinimalCollateral, resHealthFactor] = await Promise.allSettled(calls);
    console.log('resMinimalCollateral', resMinimalCollateral, healthFactor);
    return {
      minimalCollateral:
        resMinimalCollateral.status === 'fulfilled' ? resMinimalCollateral.value : 0,
      healthFactor: resHealthFactor.status === 'fulfilled' ? healthFactor.value / 100 : 0,
    };
  } catch (error) {
    console.log('🚀 ~ minimalCollateral ~ error:', error);
    return {
      minimalCollateral: 0,
    };
  }
};

// start debug - keep to check contract
// const providerURL = 'https://eth-sepolia.g.alchemy.com/v2/h_yCYWntvdt2dbI4vL2J-XjZnQk0jYnl';
// const BORROWER_PRIVATE_KEY =
//   '6e7889948e6b548c95088cf8c02badb705897e71210aea60bf5778155cad8226' || '';
// const USDC_ERC20_CONTRACT = '0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8' || '';
// const WBTC_ERC20_CONTRACT = '0x29f2D40B0605204364af54EC677bD022dA425d03' || '';
// const CCFL = '0xC5095DEaAb52F0f788158790244BEBCa5b590368' || '';
// const IsYieldGenerating = true;
// const IsFiat = false;
// const provider = new ethers.JsonRpcProvider(providerURL);
// const wallet = new ethers.Wallet(BORROWER_PRIVATE_KEY, provider);
// const contractERC20 = new ethers.Contract(CCFL, abi_erc20, wallet);
// const contract = new ethers.Contract(CCFL, abi, wallet);
// const tokenContract = new ethers.Contract(WBTC_ERC20_CONTRACT, abi_erc20, wallet);

// const createLoanDebug = async (
//   amountLoan,
//   amountCollateral,
//   stableCoinContract,
//   collateralContract,
//   IsYieldGenerating,
//   IsFiat,
// ) => {
//   try {
//     console.log(
//       'createLoan',
//       amountLoan,
//       stableCoinContract,
//       amountCollateral,
//       collateralContract,
//       IsYieldGenerating,
//       IsFiat,
//     );

//     const txResponse = await contract.createLoan(
//       amountLoan,
//       stableCoinContract,
//       amountCollateral,
//       collateralContract,
//       IsYieldGenerating,
//       IsFiat,
//     );
//     const txReceipt = await txResponse.wait();
//     console.log('Transaction successful:', txReceipt);
//     return txReceipt;
//   } catch (error) {
//     console.error('Error calling contract method:', error);
//     return '';
//   }
// };
//end debug - keep to check contract

const approveBorrow = async (provider, contract_address, amount, adresss, tokenContract) => {
  try {
    console.log('PARAMS approveBorrow', provider, contract_address, amount, adresss, tokenContract);
    const balanceCoin = await getBalanceCoin(provider, adresss);
    console.log('balanceCoin', balanceCoin);
    // addTokenToMetamask({ address: WBTC_ERC20_CONTRACT, symbol: 'WBTC', decimals: 8 });

    const tx = await approveStableCoin(provider, adresss, tokenContract, contract_address, amount);
    console.log('Transaction hash:', tx, tx.transactionHash);
    // const receipt = await tx.wait();
    console.log('Transaction was mined in block:', tx.blockNumber);
    if (tx.transactionHash || tx.hash) {
      return tx.hash || tx.transactionHash;
    } else {
      return;
    }
  } catch (error) {
    console.error('Error during approval:', error);
    return;
  }
};

const createLoan = async (
  amount,
  amountCollateral,
  stableCoin,
  collateral,
  IsYieldGenerating,
  IsFiat,
  provider,
  account,
  contract_address,
) => {
  let overwrite = { from: account };

  try {
    console.log(
      'createLoan',
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
    const txResponse = await sendRawTx(
      provider,
      abi,
      contract_address,
      'createLoan',
      [amount, stableCoin, amountCollateral, collateral, IsYieldGenerating, IsFiat],
      overwrite,
    );

    // const txReceipt = await txResponse.wait();
    console.log('Transaction successful:', tx);
    if (tx.transactionHash || tx.hash) {
      return tx.hash || tx.transactionHash;
    } else {
      return;
    }
  } catch (error) {
    console.error('Error calling create loan method:', error);
    return;
  }
};

const checkAllowance = async (provider, tokenAddress, account, contract_address) => {
  try {
    const allowance = await getAllowance(provider, tokenAddress, account, contract_address);
    return allowance;
  } catch (error) {}
};

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
  } catch (error) {}
};

const getGasFeeCreateLoan = async (
  provider,
  account,
  contract_address,
  amount,
  stableCoin,
  amountCollateral,
  collateral,
  IsYieldGenerating,
  isFiat,
) => {
  console.log(
    'getGasFeeCreateLoan',
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

  let overwrite = { from: account };
  try {
    const res = await sendRawTx(
      provider,
      abi,
      contract_address,
      'createLoan',
      [amount, stableCoin, amountCollateral, collateral, IsYieldGenerating, isFiat],
      overwrite,
      true,
    );
    console.log('getGasFeeCreateLoan res', res);

    return res && res.gasPrice
      ? BigNumber(res.gasPrice)
          .div(10 ** 18)
          .toFixed()
      : 0;
  } catch (error) {}
};

const service_ccfl_borrow = {
  getCollateralInfo,
  approveBorrow,
  createLoan,
  getGasFeeApprove,
  checkAllowance,
  getGasFeeCreateLoan,
};
export default service_ccfl_borrow;
