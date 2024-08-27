import { sepolia, mainnet, avalancheFuji, polygonMumbai } from 'wagmi/chains';

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
    ...polygonMumbai,
    logo: '/images/tokens/matic.png',
  },
];

export const MAINNET_CHAINS = [mainnet];

export const CHAIN_INFO: any = new Map(
  [...TESTNET_CHAINS, MAINNET_CHAINS].map((chain: any) => [chain?.id, chain]),
);

export const SUPPORTED_CHAINS = process.env.NEXT_PUBLIC_IS_TESTNET
  ? TESTNET_CHAINS
  : MAINNET_CHAINS;

export const CHAIN_LOGO_MAP = new Map([
  {
    chainId: 1,
    logo: '/images/tokens/eth.png',
  }, {
    chainId: 11155111,
    logo: '/images/tokens/eth.png',
  }, {
    chainId: 137,
    logo: '/images/tokens/matic.png',
  }, {
    chainId: 80002,
    logo: '/images/tokens/matic.png',
  }
].map(item => [item.chainId, item.logo]));

