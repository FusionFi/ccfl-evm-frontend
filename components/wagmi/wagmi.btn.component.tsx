//import css class module
import { WalletIcon } from '@/components/icons/wallet.icon';
import cssClass from '@/components/wagmi/wagmi.btn.module.scss';
import { useAuth, useResetState } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';
import { watchAccount } from '@wagmi/core';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
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
  const handleConnect = useCallback(
    async (item: any) => {
      try {
        return;
        console.log(item, 'item');
        if (!item?.connector?.ready) {
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.href = 'https://metamask.io/';
          a.target = '_blank';
          a.click();
          document.body.removeChild(a);
          return;
        }
        setLoading(item.connector?.id);
        const rs = await connectAsync(item);
        await sleep(1000); // hack for walletConnect
        console.log(rs, 'rs=>handleConnect');
        const { chain: chainRs, account, connector: _connector } = rs;
        // if (
        //   chainRs &&
        //   chainRs.id != CHAIN_ID_CONFIG &&
        //   _connector?.id === 'metaMask'
        // ) {
        //   try {
        //     const network = await switchNetwork({
        //       chainId: CHAIN_ID_CONFIG,
        //     });
        //     if (address && isConnected) {
        //       await connectAsync(item);
        //     }

        //   } catch (error) {
        //     await addChain();
        //     if (address && isConnected) {
        //       await connectAsync(item);
        //     }
        //   }
        // }

        // if (_connector?.id !== 'metaMask') {
        //   const provider = await _connector?.getProvider();
        //   const web3 = new Web3(provider);
        //   let _chain_check = await web3.eth.getChainId();
        //   if (Number(CHAIN_ID_CONFIG) != Number(_chain_check)) {
        //     const chainId = Number(CHAIN_ID_CONFIG);
        //     const chain_info = CHAIN_INFO[chainId];
        //     throw `Please change network: ${chain_info.name}`;
        //   }
        // }
        console.log('2------_handelLogin');
        await _handelLogin(_connector, account);
        setLoading('');
      } catch (error) {
        handleError(error);
        disconnect(); // disconnect wagmi
        resetState();
        setLoading('');
      }
    },
    [_handelLogin, resetState, handleError, connectAsync, disconnect],
  );
  /**
   * RENDERS
   */
  const getPopupContainer = (triggerNode: any) => triggerNode.parentNode;

  const CustomTooltipContent = connectors.map(connector => (
    <Button
      style={{
        minHeight: 24,
      }}
      disabled={isConnected}
      loading={loading == connector.id}
      key={connector.id}
      onClick={() => handleConnect({ connector })}
      className={twMerge('btn-outline-custom', connector.name)}>
      <div className="flex items-center justify-center w-full">
        <Image
          alt="logo"
          priority={true}
          src={`/images/header/${connector.name}.png`}
          width="32"
          height="32"
        />
        {connector.name}
      </div>
    </Button>
  ));

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
