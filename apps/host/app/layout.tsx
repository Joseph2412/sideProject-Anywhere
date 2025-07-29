import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import theme from "../theme/theme";
import "./global.css"; //sistma

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
      <body>
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
      </body>
    </html>
  );
}
