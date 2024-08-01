import erc20 from '@/utils/contract/abi/erc20.json';
import { getWeb3, sendRawTx } from '@/utils/contract/web3';
import BigNumber from 'bignumber.js';

export const MaxUint256 = new BigNumber(
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
).toFixed(0);

export const getContract = (provider, address) => {
  const web3 = getWeb3(provider);
  const contract = new web3.eth.Contract(erc20, address);
  return contract;
};

export const getTokenBalance = async (provider, tokenAddress, userAddress) => {
  if (!tokenAddress || !userAddress) {
    return;
  }
  const contract = getContract(provider, tokenAddress);
  try {
    const balance = await contract.methods.balanceOf(userAddress).call();

    return balance;
  } catch (e) {
    console.log('🚀 ~ getTokenBalance ~ e:', e);
    return '0';
  }
};

export const addTokenToMetamask = infoToken => {
  try {
    if (!window.ethereum && !window.ethereum.isMetaMask) return;

    let provider = window.ethereum;
    provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: infoToken.address,
          symbol: infoToken.symbol.slice(0, 11),
          decimals: infoToken.decimals,
          image: infoToken.logoUrl ? infoToken.logoUrl : infoToken.image ? infoToken.image : '',
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const approve = async (provider, account, tokenAddress, sender) => {
  let overwrite = { from: account };
  console.log('=======>tokenAddress', tokenAddress, sender, account);
  const res = await sendRawTx(
    provider,
    erc20,
    tokenAddress,
    'approve',
    [sender, MaxUint256],
    overwrite,
  );
  return res;
};

export const getAllowance = async (provider, tokenAddress, userAddress, spender) => {
  try {
    const myWeb3 = getWeb3(provider);
    const myContract = new myWeb3.eth.Contract(erc20, tokenAddress);
    let allowance = await myContract.methods.allowance(userAddress, spender).call();
    console.log('getAllowanceCoin ------> allowance', allowance);
    return allowance;
  } catch (error) {
    console.log('getAllowanceCoin ------> error', error);
    return 0;
  }
};
