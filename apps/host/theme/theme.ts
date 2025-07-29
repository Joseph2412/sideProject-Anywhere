import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#000000",
    controlOutline: "none",
    fontFamily: "Plus Jakarta Sans, sans-serif",
  },
  components: {
    Input: {
      hoverBorderColor: "#000000",
      activeBorderColor: "#000000",
      activeShadow: "none",
      fontFamily: "Plus Jakarta Sans, sans-serif",
    },
    Button: {
      defaultBorderColor: "#000000",
      defaultHoverBorderColor: "#000000",
      fontFamily: "Plus Jakarta Sans, sans-serif",
    },
    Typography: {
      fontFamily: "Plus Jakarta Sans, sans-serif",
    },
    Form: {
      fontFamily: "Plus Jakarta Sans, sans-serif",
    },
    Checkbox: {
      fontFamily: "Plus Jakarta Sans, sans-serif",
    },
  },
};

export default theme;
