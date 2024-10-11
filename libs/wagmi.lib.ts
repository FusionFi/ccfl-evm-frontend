'use client';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { createConfig, http } from 'wagmi';
import { avalancheFuji, mainnet, polygonAmoy, sepolia } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

export const projectId = 'e44a1758d79ad2f0154ca0b27b46b9f0';
export const chains = [avalancheFuji, mainnet, polygonAmoy, sepolia] as const; //TODO: config chains from backend side

export const metadata = {
  name: 'fusionfi',
  description: 'fusionfi',
  url: 'https://eadev.fusionfi.io', // TODO
  icons: ['https://eadev.fusionfi.io/favicon.ico'], // TODO
};

export const wagmiOptions = {};

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: false,
  enableInjected: false,
  enableCoinbase: true,
  auth: {
    email: false, // default to true
    socials: [],
    showWallets: false, // default to true
    walletFeatures: false, // default to true
  },
  connectors: [walletConnect({
    projectId
  }), metaMask({
    useDeeplink: false
  })],
  ...wagmiOptions, // Optional - override createConfig parameters
});

export const createConfigWithCustomTransports = ({ chain, rpc }: any) => {
  if (!chain) {
    return config;
  }

  return createConfig({
    chains: [chain],
    transports: {
      [chain?.id]: http(rpc),
    },
  });
};
