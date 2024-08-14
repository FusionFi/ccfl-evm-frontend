//Import components
import { LogoutIcon } from '@/components/icons/logout.icon';
import { useWeb3 } from '@/hooks/web3.hook';
import { truncate } from '@/utils/address.util';
//import css class module
import { UserAvatar } from '@/components/user-avatar.component';
import cssClass from '@/components/user-info.module.scss';
import { NETWORKS, STAKE_DEFAULT_NETWORK } from '@/constants/networks';
import { useResetState } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';
import { useNotification } from '@/hooks/notifications.hook';
import { switchOrAddNetwork } from '@/utils/contract/web3';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getNetwork } from '@wagmi/core';
import { Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAccount, useDisconnect } from 'wagmi';
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
  const { chain, chains } = getNetwork();
  const [resetState] = useResetState();
  const { address, connector } = useAccount();
  const { getBalanceCoin } = useWeb3();
  const [showSuccess, showError, showWarning, contextHolder] = useNotification();
  /**
   * FUNCTIONS
   */
  const switchNetwork = async () => {
    try {
      const provider = { rpcUrl: STAKE_DEFAULT_NETWORK?.rpc };
      const rs = await switchOrAddNetwork(STAKE_DEFAULT_NETWORK, provider);
    } catch (error) {
      console.log('🚀 ~ switchNetwork ~ error:', error);
      showError(error);
    }
  };
  const initNetworkInfo = useCallback(() => {
    if (chain) {
      const networkCurrent = NETWORKS.find(item => item.chain_id_decimals === chain?.id);
      setNetworkInfo(networkCurrent || null);
    }
  }, [chain]);
  const handleDisconnect = useCallback(() => {
    disconnect();
    resetState();
  }, [disconnect, resetState]);
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
    if (!networkInfo) {
      return (
        <div className="flex items-center">
          <Button className="switch-network btn-primary-custom" onClick={() => switchNetwork()}>
            <ExclamationCircleOutlined /> Switch to {STAKE_DEFAULT_NETWORK?.name}
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
        <UserBalance />
        {networkInfo && (
          <div className="rounded-full user-icon">
            <div className="btn-actions">
              <Button size="small" onClick={() => handleDisconnect()}>
                <UserAvatar size={24} /> {truncate(address)} <LogoutIcon />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
