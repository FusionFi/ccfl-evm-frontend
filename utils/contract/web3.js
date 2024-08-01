import { hexToDec } from '@/utils/common.js';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
const rpcDefault = 'https://rpc.mainnet.oasys.games';
const _getMetaMaskProvider = () => {
  let provider = null;
  if (typeof window.ethereum !== 'undefined') {
    window?.ethereum?.providers?.forEach(async p => {
      if (p.isMetaMask) provider = p;
    });
    if (!provider) {
      provider = window.ethereum;
    }
  }
  return provider;
};
const getWeb3 = provider => {
  let web3 = null;
  if (provider && provider.isMetaMask) {
    provider = _getMetaMaskProvider();
    web3 = new Web3(provider);
  } else if (provider && provider.address) {
    web3 = new Web3(window.wallet.currentProvider);
  } else if (provider && provider.rpcUrl) {
    // init provider from rpcUrl
    web3 = new Web3(new Web3.providers.HttpProvider(provider.rpcUrl));
  } else {
    web3 = new Web3(rpcDefault);
  }

  web3.eth.extend({
    methods: [
      {
        name: 'chainId',
        call: 'eth_chainId',
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
};

const getBalanceCoin = async (provider, address) => {
  try {
    const web3 = getWeb3(provider);
    const wei = await web3.eth.getBalance(address);
    return web3.utils.fromWei(wei, 'ether');
  } catch (error) {
    console.log('🚀 ~ getBalanceCoin ~ error:', error);
    return 0;
  }
};
async function getBalanceToken1155(provider, contractABI, contractAddress, params) {
  try {
    const web3 = getWeb3(provider);
    const { address, tokenId } = params;
    let contractInstance = new web3.eth.Contract(contractABI, contractAddress);
    let result = await contractInstance.methods.balanceOf(address, tokenId).call();
    return result;
  } catch (error) {
    return 0;
  }
}
// const getGasPrice = async (provider = null) => {
//   const myWeb3 = getWeb3(provider);
//   const rawGasPrice = await myWeb3.eth.getGasPrice();
//   const gasPrice =
//     typeof rawGasPrice === "string" &&
//     rawGasPrice.slice(0, 2) === "0x" &&
//     rawGasPrice.length > 2
//       ? parseInt(rawGasPrice, 16)
//       : parseInt(rawGasPrice);
//   return gasPrice;

// };
const getGasPrice = async (provider = null) => {
  try {
    const myWeb3 = getWeb3(provider);
    // const rawGasPrice = await myWeb3.eth.getGasPrice();
    // console.log("---->rawGasPrice", rawGasPrice);
    // return new BigNumber(rawGasPrice).times(1).toFixed(0);
    let block = await myWeb3.eth.getBlock('pending');
    console.log('---->block', block);
    console.log('---->block.baseFeePerGas', block.baseFeePerGas);
    console.log('---->hexToDec(block.baseFeePerGas)', hexToDec(block.baseFeePerGas));
    return new BigNumber(block.baseFeePerGas).times(1).plus(1500000000).toFixed(0);
  } catch (error) {
    console.log('🚀 ~ getGasPrice ~ error:', error);
    return null;
  }
};

const estimateGas = async (myContract, action, params, overwrite, provider) => {
  try {
    const gas = await myContract.methods[action](...params).estimateGas(overwrite);
    return new BigNumber(gas).times(1.2).toFixed(0);
  } catch (error) {
    let _error = error;
    try {
      let tmp = error.toString().replace('Error: Internal JSON-RPC error.', '');
      _error = JSON.parse(tmp);
    } catch (e) {
      _error = error;
    }
    throw _error;
  }
};

const sendRawTx = async (
  provider,
  abi,
  addressContract,
  action,
  params,
  overwrite,
  isEstimateGas,
) => {
  const myWeb3 = getWeb3(provider);
  const myContract = new myWeb3.eth.Contract(abi, addressContract);

  const gas = await estimateGas(myContract, action, params, overwrite, provider);
  console.log('--->gas: ', gas);
  overwrite.gasLimit = gas;

  overwrite.maxPriorityFeePerGas = null;
  overwrite.maxFeePerGas = null;

  const gasPrice = await getGasPrice(provider);
  console.log('----->gasPrice', gasPrice);
  if (isEstimateGas) {
    return {
      gasLimit: gas,
      gasPrice,
    };
  }
  // if (gasPrice) {
  //   overwrite.maxPriorityFeePerGas = gasPrice;
  //   overwrite.maxFeePerGas = gasPrice;
  // }
  return myContract.methods[action](...params).send(overwrite);
};
const getCurrentBlock = async () => {
  try {
    const myWeb3 = getWeb3(null);
    const currentBlock = await myWeb3.eth.getBlockNumber();
    return currentBlock;
  } catch (error) {
    console.log('covertWeiToEther: ', error);
    return error;
  }
};

const covertWeiToEther = balance => {
  try {
    let rs = Web3.utils.fromWei(balance, 'ether');
    return rs;
  } catch (error) {
    console.log('covertWeiToEther: ', error);
    return error;
  }
};

const toChecksumAddress = address => {
  try {
    let rs = Web3.utils.toChecksumAddress(address);
    return rs;
  } catch (error) {
    console.log('toChecksumAddress: ', error);
    return error;
  }
};

const coverDecimals = decimals => {
  return new BigNumber(10).pow(decimals);
};

const switchOrAddNetwork = async (network, provider) => {
  try {
    let metamaskProvider = _getMetaMaskProvider();
    if (metamaskProvider) {
      provider = metamaskProvider;
    }
    if (!provider) return;
    const web3 = getWeb3(provider);
    const chainId = network.chain_id_decimals;

    let rs = await web3?.currentProvider?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: web3.utils.toHex(chainId) }],
    });
    return rs;
  } catch (error) {
    if (error.code === 4902) {
      try {
        await addNetwork(network, provider);
        return;
      } catch (err) {
        console.log('🚀 ~ switchNetwork ~ err:', err);
        throw err;
      }
    }
    throw error;
  }
};
const addNetwork = async (network, provider) => {
  let metamaskProvider = _getMetaMaskProvider();
  if (metamaskProvider) {
    provider = metamaskProvider;
  }
  if (!provider) return;
  const chainId = network.chain_id_decimals;
  const web3 = getWeb3(provider);
  const rs = await web3?.currentProvider?.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: `0x${Number(chainId).toString(16)}`,
        chainName: network.name,
        nativeCurrency: network.nativeCurrency,
        rpcUrls: [network.rpc],
        blockExplorerUrls: [network.explorer],
      },
    ],
  });
  console.log(rs, 'addChain');
  return rs;
};
export {
  addNetwork,
  coverDecimals,
  covertWeiToEther,
  getBalanceCoin,
  getBalanceToken1155,
  getCurrentBlock,
  getGasPrice,
  getWeb3,
  sendRawTx,
  switchOrAddNetwork,
  toChecksumAddress,
};
