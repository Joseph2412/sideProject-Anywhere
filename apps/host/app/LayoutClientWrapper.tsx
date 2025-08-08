'use client';

import { ReactNode, useEffect } from 'react';
import { ConfigProvider, App as AntdApp } from 'antd';
import theme from '../theme/theme';
import dayjs from 'dayjs';
import itIt from 'antd/locale/it_IT';
import 'dayjs/locale/it';

dayjs.locale('it');

export default function LayoutClientWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    console.log('Layout montato lato client');
  }, []);

  return (
    <ConfigProvider theme={theme} locale={itIt}>
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
