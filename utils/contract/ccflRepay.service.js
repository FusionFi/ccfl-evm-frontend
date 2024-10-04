import abi from '@/utils/contract/abi/ccfl_metadata.json';
import { getWeb3, sendRawTx, _getMetaMaskProvider, getBalanceCoin } from '@/utils/contract/web3';
import BigNumber from 'bignumber.js';
import { addTokenToMetamask, approveStableCoin } from '@/utils/contract/erc20';
import { getAllowance } from '@/utils/contract/erc20';
import abi_erc20 from '@/utils/contract/abi/erc20.json';
import { isError } from 'lodash';
import abi_pool from '@/utils/contract/abi/ccflPool.json';

const _initContract = (provider, contract_address) => {
  const myWeb3 = getWeb3(provider);
  return new myWeb3.eth.Contract(abi, contract_address);
};

const _initContractPool = (provider, contract_address) => {
  const myWeb3 = getWeb3(provider);
  return new myWeb3.eth.Contract(abi_pool, contract_address);
};

const getHealthFactor = async (provider, contract_address, amount, loanId) => {
  try {
    const contract = _initContract(provider, contract_address);
    console.log('getHealthFactor repay', loanId, amount);
    const resHealthFactor = await contract.methods.repayHealthFactor(loanId, amount).call();
    console.log('getHealthFactor res', resHealthFactor);
    return resHealthFactor ? resHealthFactor / 100 : undefined;
  } catch (error) {
    console.log('🚀 ~ healthFactor ~ error:', error);
  }
};

const getMinimumRepayment = async (provider, contract_address, loanId) => {
  try {
    const contract = _initContractPool(provider, contract_address);
    console.log('getMinimumRepayment repay', loanId);
    const resMinimumRepayment = await contract.methods.getCurrentLoan(loanId).call();
    console.log('getMinimumRepayment res', resMinimumRepayment);
    return resMinimumRepayment;
  } catch (error) {
    console.log('🚀 ~ getMinimumRepayment ~ error:', error);
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

const approveRepay = async (provider, contract_address, amount, adresss, tokenContract) => {
  try {
    console.log('PARAMS approveBorrow', provider, contract_address, amount, adresss, tokenContract);
    // addTokenToMetamask({ address: WBTC_ERC20_CONTRACT, symbol: 'WBTC', decimals: 8 });

    const tx = await approveStableCoin(provider, adresss, tokenContract, contract_address, amount);
    console.log('Transaction hash:', tx, tx.transactionHash);
    // const receipt = await tx.wait();
    console.log('Transaction was mined in block:', tx.blockNumber);
    if (tx.transactionHash || tx.hash) {
      return {
        link: tx.hash || tx.transactionHash,
      };
    } else {
      return;
    }
  } catch (error) {
    console.error('Error during approval:', error);
    return {
      error: error,
    };
  }
};

const repayLoan = async (amount, stableCoin, provider, account, contract_address, loanId) => {
  let overwrite = { from: account };

  try {
    console.log('repayLoan', amount, stableCoin, provider, account, contract_address, loanId);
    const tx = await sendRawTx(
      provider,
      abi,
      contract_address,
      'repayLoan',
      [loanId, amount, stableCoin],
      overwrite,
    );

    // const txReceipt = await txResponse.wait();
    console.log('Transaction successful:', tx);
    if (tx.transactionHash || tx.hash) {
      return {
        link: tx.hash || tx.transactionHash,
      };
    } else {
      return;
    }
  } catch (error) {
    console.error('Error calling repay loan method:', error);
    return {
      error: error,
    };
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
    const balanceCoin = await getBalanceCoin(provider, account);
    console.log('balanceCoin', balanceCoin);

    const res = await sendRawTx(
      provider,
      abi_erc20,
      tokenAddress,
      'approve',
      [contract_address, amount],
      overwrite,
      true,
    );
    if (res && res.gasPrice && res.gasLimit) {
      let gasFee = new BigNumber(res.gasPrice.toString())
        .times(res.gasLimit.toString())
        .dividedBy(10 ** 18)
        .toString();
      return {
        gasPrice: gasFee,
        nonEnoughMoney: gasFee > balanceCoin ? true : false,
      };
    }
    return {
      gasPrice: 0,
      nonEnoughMoney: true,
    };
  } catch (error) {
    console.log('getGasFeeApprove error', error);
    return {
      gasPrice: 0,
      nonEnoughMoney: false,
      exceedsAllowance: true,
    };
  }
};

const getGasFeeRepayLoan = async (
  provider,
  account,
  contract_address,
  amount,
  stableCoin,
  loanId,
) => {
  console.log(
    'getGasFeeRepayLoan',
    provider,
    account,
    contract_address,
    amount,
    stableCoin,
    loanId,
  );

  let overwrite = { from: account };
  try {
    const balanceCoin = await getBalanceCoin(provider, account);
    console.log('balanceCoin', balanceCoin);

    const res = await sendRawTx(
      provider,
      abi,
      contract_address,
      'repayLoan',
      [loanId, amount, stableCoin],
      overwrite,
      true,
    );
    if (res && res.gasPrice && res.gasLimit) {
      let gasFee = new BigNumber(res.gasPrice.toString())
        .times(res.gasLimit.toString())
        .dividedBy(10 ** 18)
        .toString();
      return {
        gasPrice: gasFee,
        nonEnoughMoney: gasFee > balanceCoin ? true : false,
      };
    }
    return {
      gasPrice: 0,
      nonEnoughMoney: true,
    };
  } catch (error) {
    console.log('getGasFeeRepayLoan error', error);
    return {
      gasPrice: 0,
      nonEnoughMoney: false,
      exceedsAllowance: true,
    };
  }
};

const service_ccfl_repay = {
  approveRepay,
  repayLoan,
  getGasFeeApprove,
  checkAllowance,
  getGasFeeRepayLoan,
  getHealthFactor,
  getMinimumRepayment,
};
export default service_ccfl_repay;
