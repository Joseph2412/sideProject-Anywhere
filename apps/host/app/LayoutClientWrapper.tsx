"use client";

import { ReactNode, useEffect, useState } from "react";
import { ConfigProvider, App as AntdApp } from "antd";
import theme from "../theme/theme";
import dayjs from "dayjs";
import itIt from "antd/locale/it_IT";
import "dayjs/locale/it";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

dayjs.locale("it");

export default function LayoutClientWrapper({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    console.log("Layout montato lato client");
  }, []);

  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme} locale={itIt}>
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
