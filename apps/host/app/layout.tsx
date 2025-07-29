import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import theme from "../theme/theme";

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
      <body className="{inter.className}">
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
      </body>
    </html>
  );
}
