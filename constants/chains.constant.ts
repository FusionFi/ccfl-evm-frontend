export const CHAIN_ID = {
  ETH_MAINNET: 1,
  SEPOLIA_TESTNET: 11155111,
  POLYGON_TESTNET: 80001,
  POLYGON_MAINNET: 137,
  BINANCE_TESTNET: 97,
  BINANCE_MAINNET: 56,
  ASTAR_SHIBUYA_TESTNET: 81,
  ASTAR_MAINNET: 592,
  AVAX_MAINNET: 43114,
  AVAX_TESTNET: 43113,
};

export const CHAIN_INFO: any = {
  [CHAIN_ID.POLYGON_TESTNET]: {
    host: 'mumbai',
    explorer: 'https://mumbai.polygonscan.com',
    name: 'Polygon Mumbai Testnet',
    logo: '/images/tokens/matic.png',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
  },
  [CHAIN_ID.POLYGON_MAINNET]: {
    host: 'matic',
    explorer: 'https://polygonscan.com',
    name: 'Polygon',
    logo: '/images/tokens/matic.png',
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrl: 'https://polygon-rpc.com',
  },
};

export const CHAIN_INFO_SELECT: any =
  CHAIN_INFO[Number(process.env.NEXT_PUBLIC_CHAIN_ID)];
