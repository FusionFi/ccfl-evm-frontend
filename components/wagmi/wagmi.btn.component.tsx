//import css class module
import { WalletIcon } from '@/components/icons/wallet.icon';
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
  const openWeb3Modal = () => {
    open();
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
    </>
  );
};
