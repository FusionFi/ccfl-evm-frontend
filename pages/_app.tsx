import { MainLayout } from '@/layouts/main.layout';
import yoroiConnector from '@/libs/YoroiWalletConnector';
import { wrapper } from '@/store/index.store';
import '@/styles/antd.css';
import '@/styles/globals-custom.scss';
import '@/styles/globals.css';
import { StyleProvider } from '@ant-design/cssinjs';
import { Inter } from '@next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
//const CHAIN_ID_CONFIG = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Your WalletConnect Cloud project ID
const projectId = 'e44a1758d79ad2f0154ca0b27b46b9f0';

// 2. Create wagmiConfig
const metadata = {
  name: 'fusionfi',
  description: 'fusionfi',
  url: 'https://eadev.fusionfi.io', // TODO
  icons: ['https://eadev.fusionfi.io/favicon.ico'], // TODO
};

const chains = [sepolia, mainnet] as const;
const wagmiOptions = {}; // Optional - for overriding default options if necessary

const config = defaultWagmiConfig({
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

// 3. Create Web3Modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  enableOnramp: false, // Optional - false as default
});
// TODO: config chaings
const supportedChains = process.env.NEXT_PUBLIC_IS_TESTNET ? [sepolia] : [mainnet];

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  adjustFontFallback: false, // may be fix load google font
});

function App({ Component, ...rest }: AppProps) {
  /**
   * HOOKS
   */
  const { store, props } = wrapper.useWrappedStore(rest);
  const persistor = persistStore(store, {}, function () {
    persistor.persist();
  });

  useEffect(() => {
    document.body.className = 'app-container dark-theme';
  }, []);
  useEffect(() => {
    Aos.init({
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }, []);
  return (
    <StyleProvider hashPriority="high">
      <Head>
        <title>FUSIONFI</title>
        <meta name="description" content="FUNSIONFI on EVM" key="desc" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Provider store={store}>
        <PersistGate
          loading={
            <div className="min-h-screen flex justify-center items-center">
              <Image
                className="rotate"
                width={48}
                height={55}
                src="/images/loading.png"
                alt="loading"
                priority={true}
              />

              {/* <Spin size="large" /> */}
            </div>
          }
          persistor={persistor}>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <div className={inter.className}>
                <MainLayout>
                  <Component {...props.pageProps} />
                </MainLayout>
              </div>
            </QueryClientProvider>
          </WagmiProvider>
        </PersistGate>
      </Provider>
    </StyleProvider>
  );
}

export default appWithTranslation(App);
