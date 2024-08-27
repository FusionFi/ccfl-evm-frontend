import { useAuth, useResetState } from '@/hooks/auth.hook';
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
    updateAuth({ userName: 'JohnDoe', email: 'johndoe@example.com' });
  };

  const handleResetState = () => {
    resetState();
  };
  return (
    <div className={twMerge('my-profile-page-container', cssClass.myProfilePage)}>
      My profile page here
      <div className="flex items-center gap-8">
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
      </div>
    </div>
  );
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
