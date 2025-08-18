"use client";

import { UserProvider } from "./../components/providers/UserAuthProvider";
import style from "./style.module.css";
import LayoutClientWrapper from "app/LayoutClientWrapper";
import { Sidebar, Header, MessageProvider } from "@repo/components";
import { useLogout } from "./../hooks/useLogout";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const logout = useLogout();
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
