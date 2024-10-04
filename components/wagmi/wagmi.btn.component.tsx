//import css class module
import { WalletIcon } from '@/components/icons/wallet.icon';
import ModalWeb3Component from '@/components/wagmi/modal-web3.component';
import cssClass from '@/components/wagmi/wagmi.btn.module.scss';
import eventBus from '@/hooks/eventBus.hook';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

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

  /***
   * HOOKS
   */

  const { t } = useTranslation('common');
  const buttonRef = useRef<HTMLButtonElement>(null);
  // hook from store auth module

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

  /***
   * FUNCTIONS
   */
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
