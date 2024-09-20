//import css class module
import { WalletIcon } from '@/components/icons/wallet.icon';
import ModalWeb3Component from '@/components/wagmi/modal-web3.component';
import cssClass from '@/components/wagmi/wagmi.btn.module.scss';
import { useAuth, useResetState } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';
import { watchAccount } from '@wagmi/core';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAccount, useConfig, useConnect, useDisconnect } from 'wagmi';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const WagmiButton = ({
  className,
  btnLabel = 'Wallet Connect',
  handleError,
}: {
  className?: string;
  btnLabel?: string;
  handleError: any;
}) => {
  // const CHAIN_ID_CONFIG = Number(process.env.NEXT_PUBLIC_CHAIN_ID);

  /**
   * STATES
   */
  const [isMobile, setIsMobile] = useState(false);

  /***
   * HOOKS
   */
  const { connectAsync, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [loading, setLoading] = useState('');
  const { address, isConnected, connector } = useAccount();
  const { t } = useTranslation('common');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const config = useConfig();
  // hook from store auth module
  const [auth, updateAuth] = useAuth();
  const [resetState] = useResetState();
  const { open } = useWeb3Modal();

  // Check if the screen width is below a certain threshold (e.g., 768px) to determine if it's a mobile device
  const handleWindowSizeChange = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };
  const updateStore = useCallback(
    (_address: `0x${string}`) => {
      const dataAuth = {
        wallet_address: _address,
      };
      updateAuth(dataAuth);
    },
    [updateAuth],
  );
  const _handelLogin = useCallback(
    async (_connector: any, _address: `0x${string}`) => {
      try {
        updateStore(_address);
      } catch (error) {
        console.log('====>error', error);
        throw error;
      }
    },
    [updateStore],
  );

  useEffect(() => {
    // Add an event listener to handle window resize
    window.addEventListener('resize', handleWindowSizeChange);

    // Initialize the isMobile state based on the initial window size
    if (window.innerWidth <= 768) {
      setIsMobile(true);
    }
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  useEffect(() => {
    const handleWalletConnect = () => {
      console.log('🚀 ~ handleWalletConnect ~ handleWalletConnect:', buttonRef);
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    };

    eventBus.on('handleWalletConnect', handleWalletConnect);

    return () => {
      eventBus.off('handleWalletConnect', handleWalletConnect);
    };
  }, []);

  useEffect(() => {
    const unwatch = watchAccount(config, {
      async onChange(account) {
        try {
          console.log('-----------------account', account);

          // console.log(account, provider.address, 'account=>watch');
          if (
            account.isConnected === true &&
            account?.address &&
            auth.wallet_address &&
            account?.address !== auth.wallet_address
          ) {
            await _handelLogin(account?.connector, account?.address);
          }
        } catch (error) {
          handleError(error);
        }
      },
    });

    // Cleanup by calling unwatch to unsubscribe from the account change event
    return () => unwatch();
  }, [connector, _handelLogin, auth.wallet_address, handleError, config]);

  /***
   * FUNCTIONS
   */
  const sleep = (delay: any) => new Promise(resolve => setTimeout(resolve, delay));
  const observeShadowRoot = (root: any, callback: any) => {
    const observer = new MutationObserver(mutationsList => {
      console.log('🚀 ~ observer ~ mutationsList:', mutationsList);
      callback();
    });

    observer.observe(root, { childList: true, subtree: true });
    console.log('Observer is set up and observing:', root);
    return observer;
  };

  const observeRecursively = (element: any, callback: any) => {
    if (element.shadowRoot) {
      const shadowRoot = element.shadowRoot;
      observeShadowRoot(shadowRoot, callback);

      // Recursively observe any nested shadow roots
      shadowRoot.querySelectorAll('*').forEach((child: any) => observeRecursively(child, callback));
    }
  };
  const changeYoroi = () => {
    // Locate the shadow host and shadow roots
    const shadowHost = document.querySelector('w3m-modal');
    if (!shadowHost) return;

    const shadowRoot = shadowHost.shadowRoot;
    if (!shadowRoot) return;

    const shadowHostRouter = shadowRoot.querySelector('w3m-router');
    if (!shadowHostRouter) return;

    const shadowRootRouter = shadowHostRouter.shadowRoot;
    if (!shadowRootRouter) return;

    const shadowHostView = shadowRootRouter.querySelector('w3m-connect-view');
    if (!shadowHostView) return;

    const shadowRootView = shadowHostView.shadowRoot;
    if (!shadowRootView) return;

    const shadowHostViewFlex = shadowRootView.querySelector('wui-flex');
    if (!shadowHostViewFlex) return;

    const shadowWalletLoginList = shadowHostViewFlex.querySelector('w3m-wallet-login-list');
    if (!shadowWalletLoginList) return;

    const shadowRootWalletLoginList = shadowWalletLoginList.shadowRoot;
    if (!shadowRootWalletLoginList) return;

    const WuiFlexEle = shadowRootWalletLoginList.querySelector('wui-flex');
    if (!WuiFlexEle) return;

    const connectorListEle = WuiFlexEle.querySelector('w3m-connector-list');
    if (!connectorListEle) return;

    const shadowRootConnectorList = connectorListEle.shadowRoot;
    if (!shadowRootConnectorList) return;

    const injectWidgetEle = shadowRootConnectorList.querySelector('w3m-connect-injected-widget');
    if (!injectWidgetEle) return;

    const shadowRootInjectWidget = injectWidgetEle.shadowRoot;
    console.log('🚀 ~ changeYoroi ~ shadowRootInjectWidget:', shadowRootInjectWidget);
    if (!shadowRootInjectWidget) return;

    const wuiListWalletEle = shadowRootInjectWidget.querySelector(
      'wui-list-wallet[imagesrc^="https://yoroi-wallet.com/assets/favicon.ico"]',
    );
    console.log('🚀 ~ changeYoroi ~ wuiListWalletEle:', wuiListWalletEle);

    if (wuiListWalletEle) {
      wuiListWalletEle.style.opacity = 0.5;
      wuiListWalletEle.style.pointerEvents = 'none';
      const shadowRootWuiListWalletEle = wuiListWalletEle.shadowRoot;
      console.log('🚀 ~ changeYoroi ~ shadowRootWuiListWalletEle:', shadowRootWuiListWalletEle);
      if (!shadowRootWuiListWalletEle) return;
      const tag = shadowRootWuiListWalletEle.querySelector('wui-tag');
      console.log('🚀 ~ changeYoroi ~ tag:', tag);
      if (tag) {
        console.log('🚀 ~ changeYoroi ~ tag:', tag);
        tag.setAttribute('data-variant', 'default');
        tag.setAttribute('variant', 'default');
        tag.textContent = 'Coming soon';
      }
    }
  };
  const openWeb3Modal = async () => {
    eventBus.emit('openWeb3Modal', {
      tab: 'evm'
    });
    // USE web3modal lib old code
    // await open();
    // setTimeout(() => {
    //   // Initialize the observer
    //   setupObserver();

    //   // Run the function once initially to handle existing elements
    //   changeYoroi();
    // });
  };
  const setupObserver = () => {
    const shadowHost = document.querySelector('w3m-modal');
    if (!shadowHost) return;

    observeRecursively(shadowHost, changeYoroi);
  };
  /**
   * RENDERS
   */
  const getPopupContainer = (triggerNode: any) => triggerNode.parentNode;

  return (
    <>
      <div className={twMerge('flex justify-end', cssClass.btnActions)}>
        <Button
          ref={buttonRef}
          className={twMerge('btn-primary-custom', className)}
          onClick={openWeb3Modal}>
          <WalletIcon className="mr-2" />
          {t(btnLabel)}
        </Button>
      </div>
      <ModalWeb3Component />
    </>
  );
};
