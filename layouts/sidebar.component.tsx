import { useCallback, useEffect, useMemo } from 'react';

// import components
import { KeyOutlineIcon } from '@/components/icons/key-outline.icon';
import { useAuth } from '@/hooks/auth.hook';
import { useSiderbarManager } from '@/hooks/global.hook';
import {
  CloseOutlined,
  HomeOutlined,
  KeyOutlined,
  PicLeftOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Typography, theme } from 'antd';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import layout from '@/styles/layout/layout.module.scss';
import { twMerge } from 'tailwind-merge';
const { Text } = Typography;
const { useToken } = theme;

const IconsMap = {
  HomeOutlined: HomeOutlined,
  KeyOutlined: KeyOutlined,
  SearchOutlined: SearchOutlined,
  PicLeftOutlined: PicLeftOutlined,
  KeyOutlineIcon: KeyOutlineIcon,
  CloseOutlined: CloseOutlined,
};

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  key: string,
  label: string,
  icon?: string,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  const IconNode = IconsMap[icon];
  return {
    key: key,
    icon: <IconNode />,
    children,
    label: <span>{label}</span>,
    type,
  } as MenuItem;
}

export const Sidebar = () => {
  // STATES

  /**
   * HOOKS
   */
  const router = useRouter();
  const [siderbar, updateSiderbar] = useSiderbarManager();
  const { token } = useToken();
  const [auth, updateAuth] = useAuth();
  const { t } = useTranslation('common');

  const items: MenuItem[] = useMemo(() => {
    return [
      getItem('/', t('SIDEBAR_NAV_TEXT_HOME'), 'HomeOutlined'),
      getItem('/supply', t('SIDEBAR_NAV_TEXT_SUPPLY'), 'KeyOutlineIcon'),
      getItem('/borrow', t('SIDEBAR_NAV_TEXT_BORROW'), 'KeyOutlineIcon'),
    ];
  }, []);

  /**
   * FUNCTIONS
   */

  const handleItemClick = useCallback(
    (item: any) => {
      if (window.innerWidth <= 767) {
        updateSiderbar({
          collapsed: true,
        });
      }
      router.push(item.key);
    },
    [router, updateSiderbar],
  );

  /**
   * USE EFFECTS
   */
  useEffect(() => {
    const handleResize = () => {
      updateSiderbar({
        collapsed: true,
      });
      // Close the drawer if window width is less than 768px
    };
    handleResize();
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Run only once on component mount
  /**
   * RENDER
   */
  return (
    <div
      className={twMerge(
        'fixed z-10 pt-4 transition-all z-40 overflow-hidden sidebar-container',
        'flex flex-col',
        layout.mainContainer,
      )}
      style={{
        width: siderbar?.collapsed ? 0 : 256,
      }}>
      {/* <div className="close-icon">
        <span onClick={() => updateSiderbar({ collapsed: true })}>
          <closeOutlined />
        </span>
      </div> */}
      <Menu
        onClick={handleItemClick}
        selectedKeys={[router.pathname]}
        mode="inline"
        items={items}
      />
      <ul className="ant-menu pt-16 ant-menu-root ant-menu-inline ant-menu-light">
        <li className="ant-menu-item" style={{ paddingLeft: '24px' }}>
          <span
            className="ant-menu-title-content"
            style={{
              marginInlineStart: '14px',
            }}>
            <a href="https://app.v2.tealswap.com/bridge/cbridge/" target="_blank">
              {t('LAYOUT_MAIN_HEADER_NAV_BTN_TITLE_BRIDGE')}
            </a>
          </span>
        </li>
        <li className="ant-menu-item" style={{ paddingLeft: '24px' }}>
          <span
            className="ant-menu-title-content"
            style={{
              marginInlineStart: '14px',
            }}>
            <a href="https://app.v2.tealswap.com/bridge/cbridge/" target="_blank">
              {t('LAYOUT_MAIN_HEADER_NAV_BTN_TITLE_SWAP')}
            </a>
          </span>
        </li>
      </ul>
    </div>
  );
};
