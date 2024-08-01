import oasIcon from '@/public/images/stake/tokens/oas.png';
import stoasIcon from '@/public/images/stake/tokens/stoas.png';
export const ST_OAS_OASYS_TESTNET = process.env.NEXT_PUBLIC_ST_OAS_OASYS_TESTNET;
export const ST_OAS_DEFI_TESTNET = process.env.NEXT_PUBLIC_ST_OAS_DEFI_TESTNET;
export const TOKENS_MAINNET = [
  {
    name: 'OAS',
    address: '',
    logoURI: oasIcon,
    symbol: 'OAS',
    decimals: 18,
    is_native: true,
    rpc: 'https://rpc.mainnet.oasys.games',
    chain_id: 248,
  },
  {
    name: 'stOAS',
    address: '0x4200000000000000000000000000000000000010',
    logoURI: stoasIcon,
    symbol: 'stOAS',
    decimals: 18,
    is_native: false,
    rpc: 'https://rpc.mainnet.oasys.games',
    chain_id: 248,
  },
  {
    name: 'stOAS',
    address: '0x4200000000000000000000000000000000000010',
    logoURI: stoasIcon,
    symbol: 'stOAS',
    decimals: 18,
    is_native: false,
    rpc: 'https://rpc.defi-verse.org',
    chain_id: 16116,
  },
];

export const TOKENS_TESTNET = [
  {
    name: 'OAS',
    address: '',
    logoURI: oasIcon,
    symbol: 'OAS',
    decimals: 18,
    is_native: true,
    rpc: 'https://rpc.testnet.oasys.games/',
    chain_id: 9372,
  },
  {
    name: 'stOAS',
    address: ST_OAS_OASYS_TESTNET,
    logoURI: stoasIcon,
    symbol: 'stOAS',
    decimals: 18,
    is_native: false,
    rpc: 'https://rpc.testnet.oasys.games/',
    chain_id: 9372,
  },
  {
    name: 'stOAS',
    address: ST_OAS_DEFI_TESTNET,
    logoURI: stoasIcon,
    symbol: 'stOAS',
    decimals: 18,
    is_native: false,
    rpc: 'https://rpc-testnet.defi-verse.org',
    chain_id: 17117,
  },
];

const TOKENS = process.env.NEXT_PUBLIC_IS_TESTNET ? TOKENS_TESTNET : TOKENS_MAINNET;
export const STAKE_TOKEN_FROM = TOKENS[0];
export const STAKE_TOKEN_TO = TOKENS[1]; // OASYS or OASYS Testnet
export const OAS_UNSTAKE_TOKEN_FROM = TOKENS[1];
export const DEFI_UNSTAKE_TOKEN_FROM = TOKENS[2];
export const UNSTAKE_TOKEN_TO = TOKENS[0]; // OASYS or OASYS Testnet
