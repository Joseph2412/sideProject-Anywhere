// app/host/theme/theme.ts
import type { ThemeConfig } from "antd";

const theme: ThemeConfig = {
  token: {
    colorPrimary: "#000000",
    controlOutline: "none",
  },
  components: {
    Input: {
      hoverBorderColor: "#000000",
      activeBorderColor: "#000000",
      activeShadow: "none",
    },
    Button: {
      defaultBorderColor: "#000000",
      defaultHoverBorderColor: "#000000",
    },
  },
};

export default theme;
