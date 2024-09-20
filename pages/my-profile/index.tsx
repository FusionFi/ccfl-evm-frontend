import { useAuth } from '@/hooks/auth.hook';
import cssClass from '@/pages/my-profile/index.module.scss';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';

import { ProfileAccount } from '@/components/profile/profile-account.component'
import { ProfileKycStatus } from '@/components/profile/profile-kyc-status.component'
import { ProfileSupply } from '@/components/profile/profile-supply.component'
import { ProfileBorrowed } from '@/components/profile/profile-borrowed.component'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi';
import { useCardanoWalletConnected } from '@/hooks/cardano-wallet.hook'

export default function MyProfilePage() {
  /**
   * HOOKS
   */
  const { t } = useTranslation('common');
  const router = useRouter()
  const [auth] = useAuth();
  console.log('🚀 ~ MyProfilePage ~ auth:', auth);
  const { address } = useAccount();
  const [cardanoWalletConnected] = useCardanoWalletConnected();

  useEffect(() => {
    if (!address && !cardanoWalletConnected?.address) {
      router.push('/supply')
    }
  }, [address, cardanoWalletConnected])
  return (
    <div className={twMerge('my-profile-page-container', cssClass.myProfilePage)}>
      <div className="my-profile-page-wrapper">
        <div className="my-profile-page-wrapper__title">{t('MY_PROFILE_TITLE')}</div>
        <ProfileBorrowed />
        <ProfileSupply />
      </div>
      <div className="my-profile-page-wrapper__account">
        <div className="my-profile-page-wrapper__account__title">
          {t('MY_PROFILE_ACCOUNT_TITLE')}
          <ProfileKycStatus />
        </div>
        <div className="my-profile-page-wrapper__account__content">
          <ProfileAccount />
        </div>
      </div>
    </div>
  );
}
export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});
