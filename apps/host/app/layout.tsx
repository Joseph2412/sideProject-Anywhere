import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import theme from "../theme/theme";
import "./global.css"; //CSS Globale
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500"], // scegli i pesi che userai
  display: "swap",
});

export const metadata = {
  title: "Nibol Login",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={jakarta.className}>
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
      </body>
    </html>
  );
}
