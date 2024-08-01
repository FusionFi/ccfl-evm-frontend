import abi from '@/utils/contract/abi/erc1155.json';
import { getWeb3, sendRawTx } from '@/utils/contract/web3';

export const getContract = (provider, address) => {
  const web3 = getWeb3(provider);
  const contract = new web3.eth.Contract(abi, address);
  return contract;
};

export const getTokenBalanceERC1155 = async (provider, tokenAddress, userAddress, tokenID) => {
  const contract = getContract(provider, tokenAddress);
  try {
    const balance = await contract.methods.balanceOf(userAddress, tokenID).call();
    return balance;
  } catch (e) {
    return '0';
  }
};
export const getBalanceOfBatch = async (provider, ids, arr_user_address, token_address) => {
  console.log(token_address, 'token_addressAAA');
  const contract = getContract(provider, token_address);
  try {
    const balance = await contract.methods.balanceOfBatch(arr_user_address, ids).call();
    return balance;
  } catch (e) {
    console.log('-------------e', e);
    return [];
  }
};
export const approveProxyERC1155 = async (provider, account, sender, erc1155Address) => {
  let overwrite = { from: account };

  const res = await sendRawTx(
    provider,
    abi,
    erc1155Address,
    'setApprovalForAll',
    [sender, true],
    overwrite,
  );
  return res;
};

export const isApproveProxyERC1155 = async (account, sender, erc1155Address) => {
  try {
    if (!account) return;
    const myWeb3 = getWeb3();
    let nftContract = new myWeb3.eth.Contract(abi, erc1155Address);
    let isApprovedForAll = await nftContract.methods.isApprovedForAll(account, sender).call();
    console.log('----------12', isApprovedForAll);
    return isApprovedForAll;
  } catch (error) {
    console.log('----------', error);
    return false;
  }
};
