import { KycNoVerifiedIcon } from '@/components/icons/kyc-no-verified.icon';
import { KycVerifiedIcon } from '@/components/icons/kyc-verified.icon';
import { ScanIcon } from '@/components/icons/scan.icon';
import { UserSquareIcon } from '@/components/icons/user-square.icon';
import { useAuth, useResetState } from '@/hooks/auth.hook';
import eventBus from '@/hooks/eventBus.hook';
import cssClass from '@/pages/my-profile/index.module.scss';
import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { twMerge } from 'tailwind-merge';
import { useAccount } from 'wagmi';

import Image from 'next/image';
import { useEffect } from 'react';

const AccountContent = () => {
  const [auth, updateAuth] = useAuth();

  const handleUpdateAuth = () => {
    updateAuth({ userName: 'JohnDoe', email: 'johndoe@example.com' });
  };

  if (auth && auth.email) {
    if (auth.kyc) {
      return (
        <div className="my-profile-page-wrapper__account__content--has-account--verified">
          <div className="my-profile-page-wrapper__account__content--has-account--verified__content">
            <div className="my-profile-page-wrapper__account__content--has-account--verified__content__title">
              Account detail
            </div>
            <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body">
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  Username
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  username01
                </span>
              </div>
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  Email
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  mail@mail.com
                </span>
              </div>
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  Password
                </span>
                <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  ********{' '}
                  <Button icon={<EditOutlined />} type="text">
                    Search
                  </Button>
                </div>
              </div>
            </div>
            <div className="my-profile-page-wrapper__account__content--has-account--verified__content__title">
              Your Personal Detail
            </div>
            <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body">
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  Full name
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  James E. Hart
                </span>
              </div>
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  Date of birth
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  12/12/2001
                </span>
              </div>
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  SSN
                </span>
                <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  84753293465
                </div>
              </div>
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  Phone number
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  303-956-4577
                </span>
              </div>
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  Address
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  1023 Roy Alley, Empire, Colorado, 80438
                </span>
              </div>
              <div className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item">
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__title">
                  Email Address
                </span>
                <span className="my-profile-page-wrapper__account__content--has-account--verified__content__body__item__value">
                  mail@mail.com
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="my-profile-page-wrapper__account__content--has-account--no-verified">
        <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content">
          <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content__title">
            Account detail
          </div>
          <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body">
            <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item">
              <span className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item__title">
                Username
              </span>
              <span className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item__value">
                username01
              </span>
            </div>
            <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item">
              <span className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item__title">
                Email
              </span>
              <span className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item__value">
                mail@mail.com
              </span>
            </div>
            <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item">
              <span className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item__title">
                Password
              </span>
              <div className="my-profile-page-wrapper__account__content--has-account--no-verified__content__body__item__value">
                ********{' '}
                <Button icon={<EditOutlined />} type="text">
                  Search
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
                  Step 1
                </div>
                Provide identity document
              </div>
            </div>
            <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__left__item">
              <ScanIcon className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__left__item__icon" />
              <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__left__item__wrapper">
                <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__left__item__title">
                  Step 2
                </div>
                Get ready for a face scan
              </div>
            </div>
          </div>

          <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__right">
            <Button
              type="primary"
              onClick={() => updateAuth({ kyc: true })}
              className={twMerge('btn-primary-custom')}>
              Continue
            </Button>
            <div className="my-profile-page-wrapper__account__content--has-account--no-verified__footer__right__powered">
              powered by <Image src="/images/sumsub.png" alt="Sumsub" width={84} height={34} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-profile-page-wrapper__account__content--no-account">
      <Button
        type="primary"
        className={twMerge(
          'btn-primary-custom',
          'my-profile-page-wrapper__account__content--no-account__signup',
        )}>
        Signup for an account
      </Button>
      <div className="my-profile-page-wrapper__account__content--no-account__signin">
        Already had an account?
        <Button onClick={handleUpdateAuth} type="link">
          Signin
        </Button>
      </div>
    </div>
  );
};

const KycStatus = () => {
  const [auth, updateAuth] = useAuth();
  if (auth?.email) {
    if (auth.kyc) {
      return (
        <div className="my-profile-page-wrapper__account__title__kyc">
          <KycVerifiedIcon className="my-profile-page-wrapper__account__title__kyc__icon" />
          <div className="my-profile-page-wrapper__account__title__kyc__wrapper">
            <span className="my-profile-page-wrapper__account__title__kyc__title">KYC Status:</span>
            Verified
          </div>
        </div>
      );
    }

    return (
      <div className="my-profile-page-wrapper__account__title__kyc">
        <KycNoVerifiedIcon className="my-profile-page-wrapper__account__title__kyc__icon" />
        <div className="my-profile-page-wrapper__account__title__kyc__wrapper">
          <span className="my-profile-page-wrapper__account__title__kyc__title">KYC Status:</span>
          Not verified
        </div>
      </div>
    );
  }

  return null;
};
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

  useEffect(() => {
    handleResetState();
  }, []);

  return (
    <div className={twMerge('my-profile-page-container', cssClass.myProfilePage)}>
      <div className="my-profile-page-wrapper">
        <div className="my-profile-page-wrapper__title">My Profile</div>
        <div className="my-profile-page-wrapper__borrowed">
          <div className="my-profile-page-wrapper__borrowed__left">
            <div className="my-profile-page-wrapper__borrowed__item">
              <div className="my-profile-page-wrapper__borrowed__item__title">Borrowed balance</div>
              <div className="my-profile-page-wrapper__borrowed__item__value">
                <span className="my-profile-page-wrapper__borrowed__item__value__unit">$</span>
                1,875.00
              </div>
            </div>
            <div className="my-profile-page-wrapper__borrowed__item">
              <div className="my-profile-page-wrapper__borrowed__item__title">Collateral</div>
              <div className="my-profile-page-wrapper__borrowed__item__value">
                <span className="my-profile-page-wrapper__borrowed__item__value__unit">$</span>
                4,017.87
              </div>
            </div>
          </div>
          <div className="my-profile-page-wrapper__borrowed__right">
            <div className="my-profile-page-wrapper__borrowed__item">
              <div className="my-profile-page-wrapper__borrowed__item__title">Net APY</div>
              <div className="my-profile-page-wrapper__borrowed__item__value">
                0.07
                <span className="my-profile-page-wrapper__borrowed__item__value__unit">%</span>
              </div>
            </div>
            <div className="my-profile-page-wrapper__borrowed__item">
              <div className="my-profile-page-wrapper__borrowed__item__title">Finance health</div>
              <div className="my-profile-page-wrapper__borrowed__item__value">
                <span className="my-profile-page-wrapper__borrowed__item__value__health--good">
                  1.66B
                </span>
                <InfoCircleOutlined
                  size={12}
                  style={{
                    color: '#1890FF',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="my-profile-page-wrapper__supply">
          <div className="my-profile-page-wrapper__supply__item">
            <span className="my-profile-page-wrapper__supply__item__label">
              {t('SUPPLY_OVERVIEW_TOTAL_SUPPLY')}
            </span>
            <div className="my-profile-page-wrapper__supply__item__value">
              ${' '}
              <span
                className="font-bold"
                style={{
                  color: '#F0F0F0',
                }}>
                4,567.87
              </span>
            </div>
          </div>
          <div className="my-profile-page-wrapper__supply__item">
            <span className="my-profile-page-wrapper__supply__item__label">
              {t('SUPPLY_OVERVIEW_NET_APY')}
            </span>
            <div className="my-profile-page-wrapper__supply__item__value">
              <span
                className="font-bold"
                style={{
                  color: '#F0F0F0',
                }}>
                0.07
              </span>{' '}
              %
            </div>
          </div>
          <div className="my-profile-page-wrapper__supply__item">
            <span className="my-profile-page-wrapper__supply__item__label">
              {t('SUPPLY_OVERVIEW_TOTAL_EARNED')}
            </span>
            <div className="my-profile-page-wrapper__supply__item__value">
              <span
                className="font-bold"
                style={{
                  color: '#52C41A',
                }}>
                +$65.87
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="my-profile-page-wrapper__account">
        <div className="my-profile-page-wrapper__account__title">
          My Account
          <KycStatus />
        </div>
        <div className="my-profile-page-wrapper__account__content">
          <AccountContent />
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
