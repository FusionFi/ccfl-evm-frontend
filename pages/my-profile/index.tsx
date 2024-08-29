import { useAuth, useResetState } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';
import cssClass from '@/pages/my-profile/index.module.scss';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
import { useAccount } from 'wagmi';

export default function MyProfilePage() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  const { isConnected, address } = useAccount();
  const [auth, updateAuth] = useAuth();
  console.log('🚀 ~ MyProfilePage ~ auth:', auth);
  const [resetState] = useResetState();
  /**
   * FUNCTIONS
   */
  const handleUpdateAuth = () => {
    eventBus.emit('openSignInModal');
    // updateAuth({ userName: 'JohnDoe', email: 'johndoe@example.com' });
  };

  const handleResetState = () => {
    resetState();
  };
  const openSuccessModal = () => {
    eventBus.emit('toggleActivationSuccessModal', true);
  };
  const openSignUpSuccessModal = () => {
    eventBus.emit('toggleSignUpSuccessModal', { isOpen: true, email: 'johndoe@example.com' });
  };
  const openKycWarningModal = () => {
    eventBus.emit('toggleKycWarningModal', true);
  };
  const openNewPasswordModal = () => {
    eventBus.emit('openNewPasswordModal', true);
  };
  return (
    <div className={twMerge('my-profile-page-container', cssClass.myProfilePage)}>
      My profile page here
      <div>
        <div>username: {auth?.userName}</div>
        <div>email: {auth?.email}</div>
        <div>password: {auth?.password}</div>
      </div>
      <div className="flex items-center gap-4 flex-wrap">
        <Button disabled={auth?.email} className="btn-primary-custom" onClick={handleUpdateAuth}>
          Sign in
        </Button>
        <Button disabled={!auth?.email} className="btn-primary-custom" onClick={handleResetState}>
          Sign out
        </Button>
        <Button
          disabled={!auth?.email || auth?.kyc}
          className="btn-primary-custom"
          onClick={() => updateAuth({ kyc: true })}>
          enable KYC
        </Button>
        <Button
          disabled={!auth?.email || !auth?.kyc}
          className="btn-primary-custom"
          onClick={() => updateAuth({ kyc: false })}>
          remove kyc
        </Button>
        <Button className="btn-primary-custom" onClick={() => openKycWarningModal()}>
          Open kyc warning modal
        </Button>
        <Button className="btn-primary-custom" onClick={() => openSuccessModal()}>
          Open activation success modal
        </Button>
        <Button className="btn-primary-custom" onClick={() => openSignUpSuccessModal()}>
          Open signup success modal
        </Button>
        <Button className="btn-primary-custom" onClick={() => openNewPasswordModal()}>
          Open new password modal
        </Button>
      </div>
    </div>
  );
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
