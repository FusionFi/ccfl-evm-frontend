import { MainLayout } from '@/layouts/main.layout';
import { wrapper } from '@/store/index.store';
import '@/styles/antd.css';
import '@/styles/globals-custom.scss';
import '@/styles/globals.css';
import { StyleProvider } from '@ant-design/cssinjs';
import { Inter } from '@next/font/google';
import Aos from 'aos';
import 'aos/dist/aos.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';

//import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from '@wagmi/core/providers/infura';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';

//import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from '@wagmi/core/connectors/metaMask';
import { appWithTranslation } from 'next-i18next';
import Image from 'next/image';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
//const CHAIN_ID_CONFIG = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

// TODO: config chaings
const supportedChains = process.env.NEXT_PUBLIC_IS_TESTNET ? [sepolia] : [mainnet];

// Configure chains & providers with the Alchemy provider.
const { chains, publicClient, webSocketPublicClient } = configureChains(
  // [mainnet, polygon, polygonMumbai],
  supportedChains as any,
  [
    infuraProvider({ apiKey: '87e1c45a4ffc42a2ad67fe5865a833c5' }),
    publicProvider(),
    jsonRpcProvider({
      rpc: () => ({
        http: 'QUICKNODE_HTTP_PROVIDER_URL', // 👈 Replace this with your HTTP URL from the previous step
      }),
    }),
  ],
);

// Set up wagmi config
const config = createConfig({
  autoConnect: true,
  logger: {
    warn: message => console.log(message, 'message'),
  },
  connectors: [
    new MetaMaskConnector({
      chains,
    }),
    // new CoinbaseWalletConnector({
    //   chains,
    //   options: {
    //     appName: 'wagmi',
    //   },
    // }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: '654348a04b90d0f90b50ca5fa4a4e2d6',
        metadata: {
          name: 'Nepture',
          description: 'Nepture',
          url: 'https://dmtp.vinaweb.app', // TODO
          icons: ['https://dmtp.vinaweb.app/favicon.ico'],
        },
      },
    }),
    // new InjectedConnector({
    //   chains,
    //   options: {
    //     name: 'Injected',
    //     shimDisconnect: true,
    //   },
    // }),
  ],
  publicClient,
  webSocketPublicClient,
});
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
          <WagmiConfig config={config}>
            <div className={inter.className}>
              <MainLayout>
                <Component {...props.pageProps} />
              </MainLayout>
            </div>
          </WagmiConfig>
        </PersistGate>
      </Provider>
    </StyleProvider>
  );
}

export default appWithTranslation(App);
