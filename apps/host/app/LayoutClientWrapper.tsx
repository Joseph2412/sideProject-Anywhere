"use client";

import { ReactNode, useEffect } from "react";
import { ConfigProvider, App as AntdApp } from "antd";
import theme from "../theme/theme";

export default function LayoutClientWrapper({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    console.log("Layout montato lato client");
  }, []);

  return (
    <ConfigProvider theme={theme}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
