import { Select, type ThemeConfig } from "antd";

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
      colorBorder: "#000000",
      colorPrimaryHover: "#000000",
      fontFamily: "Plus Jakarta Sans, sans-serif",
      borderRadius: 6,
      fontWeight: 500,
      fontSize: 14,
      controlHeight: 32,
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
    Menu: {
      itemSelectedBg: "#00063e", // Usa lo stesso di colorPrimary
      itemSelectedColor: "#fff", // Colore del testo su tab attivo
      itemHoverColor: "#00063e", // Colore al passaggio mouse
    },
    Select: {
      optionSelectedBg: "#00063e",
      optionSelectedColor: "#fff",
    },
    Tabs: {
      itemSelectedColor: "#fff", // testo bianco su tab selezionato
    },
  },
};

export default theme;
