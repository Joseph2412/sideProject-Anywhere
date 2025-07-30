"use client";

import { ReactNode, useEffect } from "react";
import { ConfigProvider } from "antd";
import theme from "../theme/theme";

export default function LayoutClientWrapper({
  children,
}: {
  children: ReactNode;
}) {
  // Qualsiasi logica client-only (es. message.config, effetto scroll, dark mode, ecc.)
  useEffect(() => {
    console.log("Layout montato lato client");
  }, []);

  return <ConfigProvider theme={theme}>{children}</ConfigProvider>;
}
