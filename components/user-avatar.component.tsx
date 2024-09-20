//Import components
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
//import css class module
import cssClass from '@/components/user-avatar.module.scss';
import { twMerge } from 'tailwind-merge';

export const UserAvatar = ({ style, className, size = 32, disabled, address }: any) => {
  /**
   * STATES
   */

  /**
   * HOOKS
   */
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
