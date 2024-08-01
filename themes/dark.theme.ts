import type { ThemeConfig } from "antd";
import { theme } from "antd";
import Colors from "@/constants/colors.constant";

const DarkTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: Colors.GeekBlue.geekblue6,
    colorLink: Colors.GeekBlue.geekblue6,
    colorTextTertiary: Colors.gray.gray3,
    colorTextPlaceholder: Colors.gray.gray7,
    colorText: "#fff",
    colorBgLayout: Colors.gray.gray9,
    colorBgElevated: Colors.GeekBlue.geekblue5,
    colorBorder: Colors.gray.gray5,
  },
  components: {
    Input: {
      colorText: Colors.gray.gray7,
    },
    Menu: {
      itemSelectedBg: Colors.GeekBlue.geekblue6,
      itemSelectedColor: 'white',
      boxShadow: "",
      itemSelectedBoxShadow: "",
    },
    Logout: {
      colorBgContainer: '#000',
      colorBorder: Colors.gray.gray7,
    },
    Divider: {
      colorSplit: Colors.gray.gray4
    },
    Card: {
      boxShadow: "0px 6px 16px 0px rgba(0, 0, 0, 0.08)",
    },
    Button: {
      colorBgContainerDisabled: Colors.GeekBlue.geekblue6,
      colorTextDisabled: 'white',
      borderColorDisabled: ""
    },
    Select: {
      colorTextQuaternary: Colors.gray.gray6
    },
    Upload: {
      colorFillAlter: Colors.gray.gray8,
      colorText: 'white',
      colorBorder: Colors.gray.gray9,
      colorTextDescription: 'white',
      colorBgButton: Colors.gray.gray7,
      colorBorderButton: Colors.gray.gray8
    },
  },
};

export default DarkTheme;
