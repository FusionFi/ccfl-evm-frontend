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
  {
    name: 'ADA',
  }
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
export const ASSET_TYPE = {
  USD: 'USD',
  FIAT: 'FIAT',
  USDT: 'USDT',
  USDC: 'USDC',
};

export const EVM_WALLETS = [
  {
    id: 'metamask',
    name: 'WEB3_MODAL_COMPONENT_METAMASK',
    iconUrl: '/images/wallet/metamask.png',
  },
  {
    id: 'walletConnect',
    name: 'WEB3_MODAL_COMPONENT_WALLET_CONNECT',
    iconUrl: '/images/wallet/walletconnect.png',
  },
  {
    id: 'coinbase',
    name: 'WEB3_MODAL_COMPONENT_COINBASE',
    iconUrl: '/images/wallet/coinbase.png',
  },
];

export const CARDANO_WALLETS = [
  {
    id: 'yoroi',
    name: 'WEB3_MODAL_COMPONENT_YOROI',
    iconUrl: '/images/wallet/yoroi.png',
  },
  {
    id: 'nami',
    name: 'WEB3_MODAL_COMPONENT_NAMI',
    iconUrl: '/images/wallet/nami.png',
  },
  {
    id: 'eternl',
    name: 'WEB3_MODAL_COMPONENT_ETERNL',
    iconUrl: '/images/wallet/eternl.png',
  },
];
