'use client';
import { injected } from 'wagmi/connectors';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { mainnet, sepolia } from 'wagmi/chains';

import yoroiConnector from '@/libs/YoroiWalletConnector';

export const projectId = 'e44a1758d79ad2f0154ca0b27b46b9f0';
export const chains = [sepolia, mainnet] as const;

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
  auth: {
    email: false, // default to true
    socials: [],
    showWallets: false, // default to true
    walletFeatures: false, // default to true
  },
  connectors: [yoroiConnector],
  ...wagmiOptions, // Optional - override createConfig parameters
});
