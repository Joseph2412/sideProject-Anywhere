import "antd/dist/reset.css";
import "./global.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import LayoutClientWrapper from "./LayoutClientWrapper";
import "@ant-design/v5-patch-for-react-19";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

export const metadata = {
  // title: 'Nibol Login', Sti stronzi di marketing hanno cambiato idea
  title: "Anywhere",
  description: "Piattaforma di gestione per lavoratori in mobilità",
};

/**
 * Layout principale dell'applicazione Next.js (Server Component)
 * Architettura: Server Component che wrappa tutto in LayoutClientWrapper per funzionalità client
 * Pattern: Separation of Concerns - server rendering + client interactivity separati
 * Setup: Font Google Jakarta, CSS reset Antd, lingua italiana
 */

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
