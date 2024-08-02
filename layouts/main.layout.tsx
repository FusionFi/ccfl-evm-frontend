// imports components

import { useSiderbarManager, useThemeManager } from '@/hooks/global.hook';
import { MainFooter } from '@/layouts/footer.component';
import { MainHeader } from '@/layouts/header.component';
import { Sidebar } from '@/layouts/sidebar.component';
import getTheme from '@/themes/config.theme';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { Button, ConfigProvider } from 'antd';
import { useRouter } from 'next/router';
import { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';

import layout from '@/styles/layout/layout.module.scss';
import { twMerge } from 'tailwind-merge';

export const MainLayout = ({ children }: PropsWithChildren<{}>) => {
  /**
   * STATES
   */
  const [isLandingPage, setIsLandingPage] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  /**
   * HOOKS
   */
  const router = useRouter();
  const [siderbar, updateSiderbar] = useSiderbarManager();
  const [theme] = useThemeManager();

  const themeConfig = useMemo(() => getTheme(theme), [theme]);
  const token = useMemo(() => {
    return Object.assign({}, themeConfig.token, themeConfig.components);
  }, [themeConfig]);

  /***
   * FUNCTIONS
   */
  const handleSiderbarCollapsed = useCallback(() => {
    updateSiderbar({
      collapsed: !siderbar?.collapsed,
    });
  }, [siderbar, updateSiderbar]);
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
      const isScrolled = window.scrollY > 40;
      setIsHeaderScrolled(isScrolled);
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
  return (
    <ConfigProvider
      theme={{
        ...themeConfig,
      }}>
      <MainHeader />

      <div className="flex w-full main-container">
        <Sidebar />
        <div
          className={twMerge(layout.mainContainer)}
          style={{
            width: 'inherit',
          }}>
          <div
            className={twMerge(
              isHeaderScrolled ? 'top-3.5' : 'top-5',
              'fixed transition-all block md:hidden z-40',
            )}>
            <Button
              type="link"
              onClick={handleSiderbarCollapsed}
              className="text-white"
              icon={siderbar?.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}></Button>
          </div>
          <div className="h-full relative">{children}</div>
        </div>
      </div>
      {isLandingPage && <MainFooter />}
    </ConfigProvider>
  );
};
