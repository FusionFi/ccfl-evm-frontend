import type { ThemeConfig } from 'antd';
import { theme } from 'antd';
import Colors from '@/constants/colors.constant';

const LightTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: Colors.blue.blue6,
    colorLink: Colors.blue.blue6,
    colorTextBase: Colors.gray.gray9,
    colorText: Colors.gray.gray9,
    colorTextTertiary: Colors.gray.gray8,
    colorBgLayout: Colors.extra.bg1,
    colorBgElevated: Colors.GeekBlue.geekblue5,
    fontFamily: 'Segoe UI',
  },
  components: {
    Input: {
      colorText: Colors.gray.gray9,
      borderRadius: 6,
    },
    Menu: {
      itemSelectedBg: Colors.GeekBlue.geekblue1,
      itemSelectedColor: Colors.blue.blue6,
      boxShadow: '-1px 0px 0px 0px #F0F0F0 inset',
      itemSelectedBoxShadow: '-3px 0px 0px 0px #0400C6 inset',
    },
    Divider: {
      colorSplit: Colors.gray.gray4,
    },
    Logout: {
      colorBgContainer: Colors.gray.gray2,
      colorBorder: Colors.gray.gray4,
    },
    Card: {
      boxShadow: '0px 6px 16px 0px rgba(0, 0, 0, 0.08)',
    },
    Upload: {
      colorFillAlter: Colors.gray.gray3,
      colorText: Colors.gray.gray7,
      colorBorder: Colors.gray.gray5,
      colorTextDescription: Colors.gray.gray8,
      colorBgButton: '#fff',
      colorBorderButton: Colors.gray.gray5,
    },
    Button: {
      colorBgContainerDisabled: Colors.GeekBlue.geekblue6,
      colorTextDisabled: 'white',
      borderColorDisabled: '',
    },
    Modal: {
      colorTextBase: Colors.gray.gray9,
      contentBg: '#ffffff',
      headerBg: '#ffffff',
    },
    Message: {
      contentBg: '#ffffff',
    },
    Exchange: {
      Card: {
        boxShadow: '0px 3px 6px -4px rgba(0, 0, 0, 0.12)',
      },
    },
    Pagination: {
      borderRadius: 2,
      fontSize: 14,
      controlHeight: 32,
      colorText: Colors.gray.gray9,
      colorTextDisabled: Colors.gray.gray6,
      colorBgContainerDisabled: Colors.blue.blue6,
      colorFillAlter: Colors.blue.blue6,
    },
  },
};

export default LightTheme;
