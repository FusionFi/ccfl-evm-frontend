import type { ThemeConfig } from 'antd';
import LightTheme from './light.theme';
import DarkTheme from './dark.theme';
import { merge } from '@/utils/object.util';
import { themes } from '@/themes/constant.theme';

const defaultConfig: ThemeConfig = {
  token: {
    fontSize: 16,
    controlHeight: 40,
    borderRadius: 4,
  },
  components: {
    Form: {
      fontSize: 14,
      itemMarginBottom: 12,
    },
    Menu: {
      itemMarginInline: 0,
      itemHeight: 40,
      itemBorderRadius: 0,
    },
    Avatar: {
      containerSize: 32,
    },
    Upload: {
      fontSize: 14,
      borderRadiusLG: 2,
    },
    Button: {
      paddingContentHorizontal: 25,
    },
    Modal: {
      titleFontSize: 20,
    },
    Tabs: {
      horizontalItemPadding: '16px 0 18px 0',
      titleFontSize: 16,
    },
  },
};

export default (name: any) => {
  const ThemeMap = {
    [themes.light]: LightTheme,
    [themes.dark]: DarkTheme,
  };

  const theme = ThemeMap[name || themes.light];

  return merge(defaultConfig, theme);
};
