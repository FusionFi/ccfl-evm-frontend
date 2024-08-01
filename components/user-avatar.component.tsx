//Import components
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
//import css class module
import cssClass from '@/components/user-avatar.module.scss';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { useAccount } from 'wagmi';

export const UserAvatar = ({ style, className, size = 32, disabled }: ComponentProps<{}>) => {
  /**
   * STATES
   */

  /**
   * HOOKS
   */
  const { address } = useAccount();
  /**
   * FUNCTIONS
   */

  /**
   * RENDERS
   */
  return (
    <div className={twMerge('flex justify-end items-center', cssClass.userAvatar, className)}>
      {address && (
        <div className={twMerge('user-image', disabled ? 'disabled' : '')}>
          <Jazzicon diameter={size} seed={jsNumberForAddress(address)} />
        </div>
      )}
    </div>
  );
};
