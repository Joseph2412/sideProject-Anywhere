"use client";

import { UserProvider } from "./../components/providers/UserAuthProvider";
import style from "./style.module.css";
import LayoutClientWrapper from "app/LayoutClientWrapper";
import { Sidebar, Header, MessageProvider } from "@repo/components";
import { useLogout } from "./../hooks/useLogout";
import { usePathname } from "next/navigation";
import { useSetAtom } from "jotai";
import { packageFormAtom } from "@repo/ui/store/PackageFormStore";
import { useEffect } from "react";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logout = useLogout();
  const pathname = usePathname();
  const setPackageForm = useSetAtom(packageFormAtom);

  // Reset packageFormAtom quando NON sei su una pagina pacchetto
  useEffect(() => {
    if (!pathname.startsWith("/packages/")) {
      setPackageForm(null);
    }
  }, [pathname, setPackageForm]);

  return (
    <MessageProvider>
      <LayoutClientWrapper>
        <UserProvider>
          <div className={style["layout-container"]}>
            <Sidebar onLogout={logout} />
            <div className={style["content-container"]}>
              <Header className={style.header} />
              <main className={style["main-content"]}>{children}</main>
            </div>
          </div>
        </UserProvider>
      </LayoutClientWrapper>
    </MessageProvider>
  );
}
