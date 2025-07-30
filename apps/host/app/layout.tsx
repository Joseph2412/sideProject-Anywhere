import "antd/dist/reset.css";
import "./global.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import LayoutClientWrapper from "./LayoutClientWrapper";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500"],
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
        <LayoutClientWrapper>{children}</LayoutClientWrapper>
      </body>
    </html>
  );
}
