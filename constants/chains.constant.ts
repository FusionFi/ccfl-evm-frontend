import { avalancheFuji, mainnet, polygonAmoy, sepolia } from 'wagmi/chains';

const adaChain = {
  id: 'ADA',
  name: 'Cardano',
  nativeCurrency: {
    name: 'ADA',
    symbol: 'ADA',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.sepolia.org'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
      apiUrl: 'https://api-sepolia.etherscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '', //TODO
      blockCreated: null,
    },
    ensRegistry: {
      address: '', //TODO
    },
    ensUniversalResolver: {
      address: '', //TODO
      blockCreated: null, //TODO
    },
  },
  testnet: false,
};
export const TESTNET_CHAINS = [
  {
    ...sepolia,
    logo: '/images/tokens/eth.png',
  },
  {
    ...avalancheFuji,
    logo: '/images/tokens/avax.png',
  },
  {
    ...polygonAmoy,
    logo: '/images/tokens/matic.png',
  },
  {
    ...adaChain,
    logo: '/images/tokens/ada.png',
  },
];

// TODO: will be removed because will use data from the be side
export const MAINNET_CHAINS = [mainnet];

// TODO: will be removed because will use data from the be side
export const CHAIN_INFO: any = new Map(
  [...TESTNET_CHAINS, MAINNET_CHAINS].map((chain: any) => {
    return [chain?.id, chain];
  }),
);

// TODO: will be removed because will use data from the be side
export const SUPPORTED_CHAINS = process.env.NEXT_PUBLIC_IS_TESTNET
  ? TESTNET_CHAINS
  : MAINNET_CHAINS;

export const DEFAULT_CHAIN_ID = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || 11155111);
