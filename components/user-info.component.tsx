//Import components
import { LogoutIcon } from '@/components/icons/logout.icon';
import { useWeb3 } from '@/hooks/web3.hook';
import { truncate } from '@/utils/address.util';
//import css class module
import { UserAvatar } from '@/components/user-avatar.component';
import cssClass from '@/components/user-info.module.scss';
import { CHAIN_INFO, SUPPORTED_CHAINS } from '@/constants/chains.constant';
import { NETWORKS } from '@/constants/networks';
import { useResetState } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';
import { useNotification } from '@/hooks/notifications.hook';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Image from 'next/image';

import { useCardanoConnected, useNetworkManager } from '@/hooks/auth.hook';
import { useCardanoWalletConnected, useCardanoWalletDisconnect } from '@/hooks/cardano-wallet.hook';
import { Button } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAccount, useDisconnect, useSwitchChain } from 'wagmi';

export const UserInfoComponent = () => {
  /**
   * STATES
   */
  const [balance, setBalance] = useState<any | null>(0);
  const [networkInfo, setNetworkInfo] = useState<any | null>(null);
  /**
   * HOOKS
   */
  const { disconnect } = useDisconnect();
  const [resetState] = useResetState();
  const { address, connector, chainId: wagmiChainId } = useAccount();
  const { getBalanceCoin } = useWeb3();
  const [showSuccess, showError, showWarning, contextHolder] = useNotification();
  const { switchChain } = useSwitchChain();

  const [chainId, updateNetwork] = useNetworkManager();
  const [isCardanoConnected, updateCardanoConnected] = useCardanoConnected();
  const [cardanoWalletConnected] = useCardanoWalletConnected();
  const [disconnectCardanoWallet] = useCardanoWalletDisconnect();
  const CHAIN_MAP = new Map(SUPPORTED_CHAINS.map(item => [item.id, item]));

  const selectedChain = useMemo(() => {
    let _chain = CHAIN_INFO.get(chainId);
    if (!_chain) {
      if (isCardanoConnected) {
        _chain = CHAIN_MAP.get('ADA');
      } else {
        _chain = CHAIN_MAP.get(11155111);
      }
    }
    return _chain;
  }, [chainId, isCardanoConnected]);

  console.log('selectedChain: ', selectedChain);

  const address_ = useMemo(() => {
    if (isCardanoConnected) {
      return cardanoWalletConnected?.address;
    }

    return address;
  }, [address, cardanoWalletConnected?.address]);

  /**
   * FUNCTIONS
   */
  const switchNetwork = async () => {
    try {
      const provider = { rpcUrl: selectedChain?.rpc };
      const rs = await switchChain({ chainId: selectedChain?.id });

      console.log('🚀 ~ switchNetwork ~ rs:', rs);
      updateNetwork(selectedChain?.id);
    } catch (error) {
      console.log('🚀 ~ switchNetwork ~ error:', error);
      showError(error);
    }
  };
  const initNetworkInfo = useCallback(() => {
    if (chainId) {
      console.log('🚀 ~ initNetworkInfo ~ chainId:', chainId);
      const networkCurrent = NETWORKS.find(item => item.chain_id_decimals === chainId);
      console.log('🚀 ~ initNetworkInfo ~ networkCurrent:', networkCurrent);
      setNetworkInfo(networkCurrent || null);
    }
  }, [chainId]);

  const handleDisconnect = useCallback(() => {
    if (isCardanoConnected) {
      disconnectCardanoWallet();
    } else {
      disconnect();
    }

    resetState();
  }, [disconnect, resetState, disconnectCardanoWallet, isCardanoConnected]);

  const getBalance = useCallback(async () => {
    try {
      if (!address) {
        return;
      }
      const provider = await connector?.getProvider();
      if (provider) {
        const rs = await getBalanceCoin(provider, address);
        setBalance(rs);
      }
    } catch (error) {
      console.log('🚀 ~ getBalance ~ error:', error);
      setBalance(0);
    }
  }, [address, connector, getBalanceCoin]);
  /**
   * USE EFFECTS
   */
  // get balance coin
  useEffect(() => {
    if (address) {
      getBalance();
      initNetworkInfo();
    }
  }, [address, getBalance, initNetworkInfo]);

  useEffect(() => {
    const reloadBalance = () => {
      getBalance();
    };

    eventBus.on('reloadBalance', reloadBalance);

    // Cleanup listener on component unmount
    return () => {
      eventBus.off('reloadBalance', reloadBalance);
    };
  }, []);
  /**
   * RENDERS
   */

  const UserBalance = () => {
    if (isCardanoConnected) {
      return null; // TODO: need to update here
    }

    if (!networkInfo || (networkInfo && networkInfo.id !== wagmiChainId)) {
      return (
        <div className="flex items-center">
          <Button className="switch-network btn-primary-custom" onClick={() => switchNetwork()}>
            <ExclamationCircleOutlined /> Switch to {selectedChain?.name}
          </Button>
        </div>
      );
    }
    // return (
    //   <div className="user-balance">
    //     <div className="token-image">
    //       {networkInfo?.nativeCurrency?.img_url && (
    //         <Image
    //           src={networkInfo?.nativeCurrency?.img_url}
    //           alt="token logo"
    //           width={24}
    //           height={24}
    //         />
    //       )}
    //     </div>
    //     <div className="network-image">
    //       {networkInfo?.img_url && (
    //         <Image src={networkInfo?.img_url} alt="network logo" width={24} height={24} />
    //       )}
    //     </div>
    //     <div className="balance">
    //       {truncateDecimal(balance, 2)} {STAKE_DEFAULT_NETWORK?.nativeCurrency?.symbol}
    //     </div>
    //   </div>
    // );
  };
  return (
    <div className={twMerge('flex justify-end items-center', cssClass.userInfo)}>
      {contextHolder}
      <div className="user-info-content flex items-center">
        <div className="chain">
          <Image
            src={selectedChain?.logo}
            alt={selectedChain?.name}
            width={24}
            height={24}
            className="mr-2"
          />
          <span>{isCardanoConnected ? 'Cardano' : 'EVM'}:</span>
        </div>
        <UserBalance />
        {((networkInfo && networkInfo.id === wagmiChainId) || isCardanoConnected) && (
          <div className="rounded-full user-icon">
            <div className="btn-actions">
              <Button size="small" onClick={() => handleDisconnect()}>
                <UserAvatar address={address_} size={24} /> {truncate(address_)} <LogoutIcon />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
