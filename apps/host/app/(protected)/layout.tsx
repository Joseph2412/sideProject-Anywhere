"use client";

import { ReactNode } from "react";
import { UserProvider } from "../components/providers/User.provider";
// import Sidebar from "../components/layout/Sidebar"; //Da creare poi
// import Header from "../components/layout/Header"; //Da creare poi
//import styles from "./InternalLayout.module.css"; // opzionale Vediamo..

type InternalLayoutProps = {
  children: ReactNode;
};

function Sidebar() {
  return <aside style={{ width: 200 }}>SideBar Nav</aside>;
}

function Header() {
  return <header style={{ width: 200 }}>intestazione</header>;
}

//Sono dei placeholder. Dobbiamo ancora crearli.

export default function InternalLayout({ children }: InternalLayoutProps) {
  return (
    <UserProvider>
      <div className="layout-container">
        <Sidebar />
        <div className="content-container">
          <Header />
          <main>{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}
