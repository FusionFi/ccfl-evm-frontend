import abi from '@/utils/contract/abi/erc721.json';
import { getWeb3, sendRawTx } from '@/utils/contract/web3';
import multicall from './multicall.js';

export const approveProxy = async (provider, account, sender, token) => {
  let overwrite = { from: account };

  const res = await sendRawTx(provider, abi, token, 'setApprovalForAll', [sender, true], overwrite);
  return res;
};

export const isApproveProxy = async (account, sender, token) => {
  try {
    if (!account) return;
    const myWeb3 = getWeb3();
    let nftContract = new myWeb3.eth.Contract(abi, token);
    let isApprovedForAll = await nftContract.methods.isApprovedForAll(account, sender).call();
    console.log('----------12', isApprovedForAll);
    return isApprovedForAll;
  } catch (error) {
    console.log('----------', error);
    return false;
  }
};

export const getBalanceOfTokens = async (arr_token, address) => {
  try {
    console.log('------arr_token, address', { arr_token, address });
    const calls = arr_token.map(token => {
      return {
        address: token,
        name: 'balanceOf',
        params: [address],
      };
    });
    let results = await multicall(abi, calls);
    return results.toString().split(',');
  } catch (error) {
    console.log('----------', error);
    return;
  }
};
