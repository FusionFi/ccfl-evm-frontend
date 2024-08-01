import defiIcon from '@/public/images/stake/networks/defi.png';
import oasIcon from '@/public/images/stake/networks/oas.png';
import oasTokenIcon from '@/public/images/stake/tokens/oas.png';
export const ST_OAS_OASYS_TESTNET = process.env.NEXT_PUBLIC_ST_OAS_OASYS_TESTNET;
export const ST_OAS_DEFI_TESTNET = process.env.NEXT_PUBLIC_ST_OAS_DEFI_TESTNET;

export const NETWORKS_MAINNET = [
  {
    chain_id: '0xF8',
    chain_id_decimals: 248,
    img_url: oasIcon,
    name: 'Oasys Mainnet',
    gasPrice: null,
    explorer: 'https://explorer.oasys.games/',
    rpc: 'https://rpc.mainnet.oasys.games',
    stOASContract: '0x4200000000000000000000000000000000000010',
    nativeCurrency: {
      name: 'OASYS',
      symbol: 'OAS',
      decimals: 18,
      img_url: oasTokenIcon,
    },
  },
  {
    chain_id: '0x3EF4',
    chain_id_decimals: 16116,
    img_url: defiIcon,
    name: 'Defiverse',
    gasPrice: 5000000000000,
    explorer: 'https://scan.defi-verse.org/',
    rpc: 'https://rpc.defi-verse.org',
    stOASContract: '0x4200000000000000000000000000000000000010', /// I2ERC20Bridge
    nativeCurrency: {
      name: 'OASYS',
      symbol: 'OAS',
      decimals: 18,
      address: '0x4200000000000000000000000000000000000010',
      img_url: oasTokenIcon,
    },
  },
];
export const NETWORKS_TESTNET = [
  {
    chain_id: '0x249C',
    chain_id_decimals: 9372,
    img_url: oasIcon,
    name: 'OASYS Testnet',
    gasPrice: null,
    explorer: 'https://explorer.testnet.oasys.games/',
    rpc: 'https://rpc.testnet.oasys.games/',
    stOASContract: ST_OAS_OASYS_TESTNET,
    nativeCurrency: {
      name: 'OASYS',
      symbol: 'OAS',
      decimals: 18,
      img_url: oasTokenIcon,
    },
  },
  {
    chain_id: '0x42DD',
    chain_id_decimals: 17117,
    name: 'Defiverse Testnet',
    img_url: defiIcon,
    gasPrice: 50000000000,
    explorer: 'https://scan-testnet.defi-verse.org',
    rpc: 'https://rpc-testnet.defi-verse.org',
    stOASContract: ST_OAS_DEFI_TESTNET,
    nativeCurrency: {
      name: 'OASYS',
      symbol: 'OAS',
      decimals: 18,
      address: '0x4200000000000000000000000000000000000010',
      img_url: oasTokenIcon,
    },
  },
];
export const NETWORKS = process.env.NEXT_PUBLIC_IS_TESTNET ? NETWORKS_TESTNET : NETWORKS_MAINNET;
export const STAKE_DEFAULT_NETWORK = NETWORKS[0]; // OASYS or OASYS Testnet
