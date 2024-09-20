import ethTokenIcon from '@/public/images/common/WETH.png';
import avalancheIcon from '@/public/images/stake/networks/avalanche.png';
import defiIcon from '@/public/images/stake/networks/defi.png';
import oasIcon from '@/public/images/stake/networks/oas.png';
import polygonIcon from '@/public/images/stake/networks/polygon.png';
import oasTokenIcon from '@/public/images/stake/tokens/oas.png';
export const NETWORKS_MAINNET = [
  {
    id: 248,
    chain_id: '0xF8',
    chain_id_decimals: 248,
    img_url: oasIcon,
    name: 'Oasys Mainnet',
    gasPrice: null,
    explorer: 'https://explorer.oasys.games/',
    rpc: 'https://rpc.mainnet.oasys.games',
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
    id: 11155111,
    chain_id: '0xF8',
    chain_id_decimals: 11155111,
    img_url: ethTokenIcon,
    name: 'Sepolia Test Network',
    gasPrice: null,
    explorer: 'https://explorer.oasys.games/',
    rpc: 'https://1rpc.io/sepolia',
    nativeCurrency: {
      name: 'SepoliaETH',
      symbol: 'ETH',
      decimals: 18,
      img_url: ethTokenIcon,
    },
  },
  {
    id: 43113,
    chain_id: '0xA869',
    chain_id_decimals: 43113,
    img_url: avalancheIcon,
    name: 'Alanvache Fuji Network',
    gasPrice: null,
    explorer: 'https://explorer.oasys.games/',
    rpc: 'https://testnet.snowtrace.io',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
      img_url: avalancheIcon,
    },
  },
  {
    id: 80002,
    chain_id: '0x13882',
    chain_id_decimals: 80002,
    img_url: polygonIcon,
    name: 'Polygon Amoy',
    gasPrice: null,
    explorer: 'https://amoy.polygonscan.com',
    rpc: 'https://rpc-amoy.polygon.technology',
    nativeCurrency: {
      name: 'POL',
      symbol: 'POL',
      decimals: 18,
      img_url: polygonIcon,
    },
  },
  {
    id: '9372',
    chain_id: '0x249C',
    chain_id_decimals: 9372,
    img_url: oasIcon,
    name: 'OASYS Testnet',
    network: 'oasys-testnet',
    gasPrice: null,
    explorer: 'https://explorer.testnet.oasys.games/',
    rpc: 'https://rpc.testnet.oasys.games/',
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
