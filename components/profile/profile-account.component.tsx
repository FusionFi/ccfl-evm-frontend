import { ScanIcon } from '@/components/icons/scan.icon';
import { ComponentProps } from 'react';
import { UserSquareIcon } from '@/components/icons/user-square.icon';
import { useAuth } from '@/hooks/auth.hook';
import { EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import eventBus from '@/hooks/eventBus.hook';
import sumsub from '@/utils/backend/sumsub';
import ModalKycWarningEmailComponent from '@/layouts/modal-kyc-warning-email/modal-kyc-warning-email.component';
export const ProfileAccount = ({}: ComponentProps<any>) => {
  const { t } = useTranslation('common');
  const [auth, updateAuth] = useAuth();
  console.log('🚀 ~ ProfileAccount ~ auth:', auth);

  const handleSignin = () => {
    eventBus.emit('openSignInModal');
  };

  const handleSignup = () => {
    eventBus.emit('openSignUpModal');
  };

  const handlePasswordChange = () => {
    eventBus.emit('openChangePasswordModal');
  };

  const handleKycVerify = async () => {
    try {
      console.error('handle kyc verifying failed:');

      eventBus.emit('toggleKycWarningEmailModal', true);
      // const { url }: any = await sumsub.generateExternalLink({
      //   levelName: 'basic-kyc-level',
      //   externalUserId: 1,
      // });
      // window?.open(url, '_blank')?.focus();
      // updateAuth({ kyc: true });
    } catch (error) {
      console.error('handle kyc verifying failed: ', error);
    }
  };

  if (auth && auth.access_token && auth.userName) {
    if (auth.kyc_info) {
      return (
        <div className="my-profile-page-wrapper__account__content--has-account--verified">
          <div className="my-profile-page-wrapper__account__content--has-account--verified__content">
            <div className="my-profile-page-wrapper__account__content--has-account--verified__content__title">
              {t('MY_PROFILE_ACCOUNT_DETAIL')}
            </div>
            <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body">
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  {t('MY_PROFILE_ACCOUNT_USERNAME')}
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  {auth.userName}
                </span>
              </div>
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  {t('MY_PROFILE_ACCOUNT_EMAIL')}
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  {auth?.email}
                </span>
              </div>
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  {t('MY_PROFILE_ACCOUNT_PASSWORD')}
                </span>
                <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  ********{' '}
                  <Button icon={<EditOutlined />} type="text">
                    {t('MY_PROFILE_ACCOUNT_PASSWORD_CHANGE')}
                  </Button>
                </div>
              </div>
            </div>
            <div className="my-profile-page-wrapper__account__content--has-account--verified__content__title">
              {t('MY_PROFILE_ACCOUNT_PERSONAL_DETAIL')}
            </div>
            <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body">
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  {t('MY_PROFILE_ACCOUNT_PERSONAL_FULL_NAME')}
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  {auth.kyc_info.firstName} {auth.kyc_info.lastName}
                </span>
              </div>
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  {t('MY_PROFILE_ACCOUNT_PERSONAL_DATE_BIRTH')}
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  {auth.kyc_info.dob}
                </span>
              </div>
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  {t('MY_PROFILE_ACCOUNT_PERSONAL_SSN')}
                </span>
                <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  {auth.kyc_info.document_info &&
                    auth.kyc_info.document_info.length >= 2 &&
                    auth.kyc_info.document_info[1].value}
                </div>
              </div>
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  {t('MY_PROFILE_ACCOUNT_PERSONAL_PHONE_NUMBER')}
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  {auth.kyc_info.phone}
                </span>
              </div>
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  {t('MY_PROFILE_ACCOUNT_PERSONAL_ADDRESS')}
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  {auth.kyc_info.addresses && auth.kyc_info.addresses[0]?.formattedAddress}
                </span>
              </div>
              {/* <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  {t('MY_PROFILE_ACCOUNT_PERSONAL_EMAIL_ADDRESS')}
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  {auth?.email}
                </span>
              </div> */}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="my-profile-page-wrapper__account__content--has-account--no-verified">
        <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content">
          <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content__title">
            {t('MY_PROFILE_ACCOUNT_DETAIL')}
          </div>
          <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body">
            <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item">
              <span className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item__title">
                {t('MY_PROFILE_ACCOUNT_USERNAME')}
              </span>
              <span className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item__value">
                {auth?.userName}
              </span>
            </div>
            <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item">
              <span className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item__title">
                {t('MY_PROFILE_ACCOUNT_EMAIL')}
              </span>
              <span className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item__value">
                {auth?.email}
              </span>
            </div>
            <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item">
              <span className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item__title">
                {t('MY_PROFILE_ACCOUNT_PASSWORD')}
              </span>
              <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item__value">
                ********{' '}
                <Button onClick={handlePasswordChange} icon={<EditOutlined />} type="text">
                  {t('MY_PROFILE_ACCOUNT_PASSWORD_CHANGE')}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer">
          <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__left">
            <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__left__item">
              <UserSquareIcon className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__left__item__icon" />
              <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__left__item__wrapper">
                <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__left__item__title">
                  {t('MY_PROFILE_ACCOUNT_STEP', {
                    number: 1,
                  })}
                </div>
                {t('MY_PROFILE_ACCOUNT_IDENTITY_DOCUMENT')}
              </div>
            </div>
            <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__left__item">
              <ScanIcon className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__left__item__icon" />
              <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__left__item__wrapper">
                <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__left__item__title">
                  {t('MY_PROFILE_ACCOUNT_STEP', {
                    number: 2,
                  })}
                </div>
                {t('MY_PROFILE_ACCOUNT_FACE_SCAN')}
              </div>
            </div>
          </div>

          <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__right">
            <Button
              type="primary"
              onClick={handleKycVerify}
              className={twMerge('btn-primary-custom')}>
              {t('MY_PROFILE_ACCOUNT_CONTINUE')}
            </Button>
            <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__right__powered">
              {t('MY_PROFILE_ACCOUNT_POWERED_BY')}{' '}
              <Image src="/images/sumsub.png" alt="Sumsub" width={84} height={34} />
            </div>
          </div>
        </div>
        <ModalKycWarningEmailComponent />
      </div>
    );
  }

  return (
    <div className="my-profile-page-wrapper__account__content--no-account">
      <Button
        type="primary"
        onClick={handleSignup}
        className={twMerge(
          'btn-primary-custom',
          'my-profile-page-wrapper__account__content--no-account__signup',
        )}>
        {t('MY_PROFILE_ACCOUNT_SIGNUP')}
      </Button>
      <div className="my-profile-page-wrapper__account__content--no-account__signin">
        {t('MY_PROFILE_ACCOUNT_SIGNIN_MSG')}
        <Button onClick={handleSignin} type="link">
          {t('MY_PROFILE_ACCOUNT_SIGNIN')}
        </Button>
      </div>
    </div>
  );
};
