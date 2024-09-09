export const TYPE_COMMON = {
  USD: 'USD',
  PERCENT: 'PERCENT',
  FINANCE_HEALTH: 'FINANCE_HEALTH',
};

export const COLLATERAL_TOKEN = [
  {
    name: 'WETH',
  },
  {
    name: 'WBTC',
  },
];
export const LOAN_STATUS = {
  ACTIVE: 'ACTIVE',
  REPAID_FULL: 'REPAID_FULL',
  LIQUIDATION_APPROACHING: 'LIQUIDATION_APPROACHING',
  LIQUIDATED: 'LIQUIDATED',
  DISBURSEMENT: 'DISBURSEMENT',
  UNPROCESSED: 'UNPROCESSED',
};
export const TRANSACTION_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};
export const ASSET_LIST = {
  USDC: 'USDC',
  USDT: 'USDT',
};
export const DEFAULT_PARAMS = {
  address: '0x28765892272c3a49F0fb50EF32348538CE22a67C',
  chainId: '11155111',
};

export const ASSET_TYPE = {
  USD: 'USD',
  FIAT: 'FIAT',
  USDT: 'USDT',
  USDC: 'USDC',
};

export const DEFAULT_ADDRESS = {
  USDC: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
  USDT: '',
  WBTC: '0x29f2D40B0605204364af54EC677bD022dA425d03',
  WETH: '0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c',
};

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CCFL_CONTRACT_ADDRESS;
