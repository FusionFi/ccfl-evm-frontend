'use client';
import { injected } from 'wagmi/connectors';

const yoroiConnector = injected({
  target() {
    return {
      icon: 'https://yoroi-wallet.com/assets/favicon.ico',
      id: 'yoroiWalllet',
      name: 'Yoroi Wallet',
      provider: 'window?.ethereum', // TODO add provider here
    };
  },
});
export default yoroiConnector;
