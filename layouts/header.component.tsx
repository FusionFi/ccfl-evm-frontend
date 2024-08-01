import { UserInfoComponent } from '@/components/user-info.component';
import { message } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
// import css
import header from '@/styles/layout/header.module.scss';
import { useNetwork } from 'wagmi';
// imports components
import { WagmiButton } from '@/components/wagmi/wagmi.btn.component';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
export const MainHeader = () => {
  /**
   * STATES
   */
  const [isLandingPage, setIsLandingPage] = useState(false);
  const [backgroundChange, setBackgroundChange] = useState(false);
  /**
   * HOOKS
   */
  const router = useRouter();
  const { address, connector } = useAccount();
  const { chain } = useNetwork();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation('common');
  console.log('🚀 ~ MainHeader ~ t:', t);

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
      const shouldChangeBackground = window.scrollY > 80;
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
    // if (isLandingPage) {
    //   return (
    //     <div className="landing-page-header-content  md:pl-6 pl-10 md:pr-6 pr-1.5  flex items-center justify-center w-full">
    //       <div className="right-content ml-auto">
    //         <Link href="/stake">
    //           <Button type="primary"> Stake Now</Button>
    //         </Link>
    //       </div>
    //     </div>
    //   );
    // } else {
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
          </div>
        )}
        <div className="right-content ml-auto">
          <div className={!address ? 'hidden' : 'visible'}>
            <UserInfoComponent />
          </div>

          <div className={address ? 'hidden' : 'visible'}>
            <WagmiButton handleError={handleError} />
          </div>
        </div>
      </div>
    );
    //}
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
