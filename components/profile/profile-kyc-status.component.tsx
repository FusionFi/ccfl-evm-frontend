import { ComponentProps } from 'react';
import { useAuth } from '@/hooks/auth.hook';
import { KycVerifiedIcon } from '@/components/icons/kyc-verified.icon';
import { useTranslation } from 'next-i18next';
import { KycNoVerifiedIcon } from '@/components/icons/kyc-no-verified.icon';

export const ProfileKycStatus = ({}: ComponentProps<any>) => {
  const [auth] = useAuth();
  const { t } = useTranslation('common');

  if (auth?.email) {
    if (auth.kyc_info) {
      return (
        <div className="my-profile-page-wrapper__account__title__kyc">
          <KycVerifiedIcon className="my-profile-page-wrapper__account__title__kyc__icon" />
          <div className="my-profile-page-wrapper__account__title__kyc__wrapper">
            <span className="my-profile-page-wrapper__account__title__kyc__title">
              {t('MY_PROFILE_ACCOUNT_KYC_STATUS')}:
            </span>
            {t('MY_PROFILE_ACCOUNT_KYC_VERIFIED')}
          </div>
        </div>
      );
    }

    return (
      <div className="my-profile-page-wrapper__account__title__kyc">
        <KycNoVerifiedIcon className="my-profile-page-wrapper__account__title__kyc__icon" />
        <div className="my-profile-page-wrapper__account__title__kyc__wrapper">
          <span className="my-profile-page-wrapper__account__title__kyc__title">
            {t('MY_PROFILE_ACCOUNT_KYC_STATUS')}:
          </span>
          {t('MY_PROFILE_ACCOUNT_KYC_NOT_VERIFIED')}
        </div>
      </div>
    );
  }

  return null;
};
