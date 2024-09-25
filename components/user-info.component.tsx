//Import components
import { LogoutIcon } from '@/components/icons/logout.icon';
import { truncate } from '@/utils/address.util';
//import css class module
import { UserAvatar } from '@/components/user-avatar.component';
import cssClass from '@/components/user-info.module.scss';
import { useResetState } from '@/hooks/auth.hook';
import { useNotification } from '@/hooks/notifications.hook';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Image from 'next/image';

import { useConnectedNetworkManager, useProviderManager } from '@/hooks/auth.hook';
import { Button } from 'antd';
import { useCallback, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';
import { ProviderType } from '@/providers/index.provider';

export const UserInfoComponent = () => {
  /**
   * STATES
   */

  /**
   * HOOKS
   */
  const [resetState] = useResetState();
  const [, showError, , contextHolder] = useNotification();

  const { selectedChain } = useConnectedNetworkManager();
  const [provider, updateProvider] = useProviderManager();

  const address_ = useMemo(() => {
    return provider?.account;
  }, [provider]);

  /**
   * FUNCTIONS
   */
  const switchNetwork = async () => {
    try {
      // TODO: need to check the method using wallet connect or coinbase wallet
      const rs = await provider.switchChain(selectedChain?.id);

      console.log('🚀 ~ switchNetwork ~ rs:', rs);
      updateProvider({
        chainId: selectedChain?.id
      });
    } catch (error) {
      console.log('🚀 ~ switchNetwork ~ error:', error);
      showError(error);
    }
  };

  const handleDisconnect = useCallback(async () => {
    try {
      console.log('provider handleDisconnect: ', provider)
      await provider?.disconnect()
      resetState();
    } catch (error) {
      console.error('disconnect wallet failed: ', error)
    }
  }, [resetState, provider]);


  /**
   * USE EFFECTS
   */
  // get balance coin

  /**
   * RENDERS
   */

  const UserBalance = () => {
    if (selectedChain?.id != provider?.chainId) {
      return (
        <div className="flex items-center">
          <Button className="switch-network btn-primary-custom" onClick={() => switchNetwork()}>
            <ExclamationCircleOutlined /> Switch to {selectedChain?.name}
          </Button>
        </div>
      );
    }

    return null;
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
          <span>{provider?.type == ProviderType.Cardano ? 'Cardano' : 'EVM'}:</span>
        </div>
        <UserBalance />
        {selectedChain?.id == provider?.chainId && (
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
