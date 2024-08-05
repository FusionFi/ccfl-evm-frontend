import { sepolia, mainnet } from 'wagmi/chains';

export const TESTNET_CHAINS = [
  {
    ...sepolia,
    logo: '/images/tokens/avax.png' // TODO: update
  }
]

export const MAINNET_CHAINS = [
  mainnet
]

export const CHAIN_INFO: any = new Map([...TESTNET_CHAINS, MAINNET_CHAINS].map((chain: any) => [chain?.id, chain]))

export const SUPPORTED_CHAINS = process.env.NEXT_PUBLIC_IS_TESTNET ? TESTNET_CHAINS : MAINNET_CHAINS