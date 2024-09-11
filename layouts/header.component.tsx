import { UserInfoComponent } from '@/components/user-info.component';
import { message } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
// import css
import header from '@/styles/layout/header.module.scss';
// imports components
import { UserIcon } from '@/components/icons/user.icon';
import { WagmiButton } from '@/components/wagmi/wagmi.btn.component';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useAccount, useConnect } from 'wagmi';
import { metaMask, walletConnect } from 'wagmi/connectors';
export const MainHeader = () => {
  /**
   * STATES
   */
  const [isLandingPage, setIsLandingPage] = useState(true);
  const [backgroundChange, setBackgroundChange] = useState(false);
  /**
   * HOOKS
   */
  const router = useRouter();
  const { address, connector } = useAccount();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation('common');
  const { connect } = useConnect();

  /**
   * FUNCTIONS
   */

  const handleError = useCallback(
    (error: any) => {
      messageApi.open({
        type: 'error',
        content: error?.info || error?.message || error,
        duration: 5,
      });
    },
    [messageApi],
  );
  const connectMetamask = () => {
    connect({ connector: metaMask() });
  };
  const connectWalletConnect = () => {
    connect({
      connector: walletConnect({
        projectId: 'e44a1758d79ad2f0154ca0b27b46b9f0',
      }),
    });
  };
  /**
   * USE EFFECTS
   */
  useEffect(() => {
    if (router.pathname === '/') {
      setIsLandingPage(true);
    } else {
      setIsLandingPage(false);
    }
  }, [router.pathname]);
  useEffect(() => {
    const handleScroll = () => {
      const shouldChangeBackground = window.scrollY > 20;
      // console.log('🚀 ~ handleScroll ~ window.scrollY:', window.scrollY);
      setBackgroundChange(shouldChangeBackground);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  /**
   * RENDERS
   */
  const HeaderContent = () => {
    if (isLandingPage) {
      return <></>;
    } else {
      return (
        <div className="page-header-content flex items-center justify-center w-full">
          {!isLandingPage && (
            <div className="navigation-links">
              <ul className="flex items-center justify-center ml-4">
                <li className="text-white mr-4 hover:opacity-80">
                  <Link
                    href="/supply"
                    className={`link ${router?.pathname === '/supply' ? 'active' : ''}`}>
                    {t('LAYOUT_MAIN_HEADER_NAV_TEXT_SUPPLY')}
                  </Link>
                </li>
                <li className="text-white mr-4 hover:opacity-80">
                  <Link
                    href="/borrow"
                    className={`link ${router?.pathname === '/borrow' ? 'active' : ''}`}>
                    {t('LAYOUT_MAIN_HEADER_NAV_TEXT_BORROW')}
                  </Link>
                </li>
                {/* <li className="text-white mr-4 hover:opacity-80">
                <Link
                  href="/stake"
                  className={`link ${router?.pathname === '/stake' ? 'active' : ''}`}>
                  Stake
                </Link>
              </li>
              <li className="text-white mr-4 hover:opacity-80">
                <a href="https://app.v2.tealswap.com/bridge/cbridge/" target="_blank">
                  Bridge
                </a>
              </li> */}
              </ul>
              <button onClick={() => connectMetamask()}>Connect MetaMask</button>
              <button onClick={() => connectWalletConnect()}>Connect WalletConnect</button>
            </div>
          )}
          <div className="right-content ml-auto flex items-center">
            {!isLandingPage && address && (
              <div className="external-links flex items-center">
                <Link
                  href="/my-profile"
                  className={`btn-outline-custom mr-4 ${
                    router?.pathname === '/my-profile' ? 'active' : ''
                  }`}>
                  <UserIcon className="mr-2" /> {t('LAYOUT_MAIN_HEADER_NAV_MY_PROFILE')}
                </Link>
              </div>
            )}
            <div className={!address ? 'hidden' : 'visible'}>
              <UserInfoComponent />
            </div>

            <div className={address ? 'hidden' : 'visible'}>
              <WagmiButton
                handleError={handleError}
                btnLabel={'LAYOUT_MAIN_HEADER_NAV_BTN_TITLE_CONNECT_WALLET'}
              />
            </div>
          </div>
        </div>
      );
    }
  };
  return (
    <>
      {contextHolder}
      <div
        className={twMerge(
          'fixed top-0 z-20 w-full flex items-center bg-main-color',
          backgroundChange ? 'scrolled' : '',
          header.mainLayoutHeader,
        )}>
        <div className={twMerge('header-container', backgroundChange ? 'scrolled' : '')}>
          <div className="header-logo ">
            <Link href="/" className="flex justify-center items-center">
              <Image
                alt="logo"
                priority={true}
                src="/images/logo.png"
                width="206"
                height="64"
                className="logo-image"
              />
            </Link>
          </div>
          <HeaderContent />
        </div>
      </div>
    </>
  );
};
