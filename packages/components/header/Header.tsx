'use client';

import { Tooltip, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import styles from './Header.module.css';

import { selectedTabAtom } from '@repo/ui/store/LayoutStore';

type HeaderProps = {
  className?: string;
};

const keyToTitleMap: Record<string, string> = {
  calendar: 'Calendario',
  gestione: 'Generali',
  pagamenti: 'Pagamenti',
  aggiungi: 'Aggiungi pacchetto',
  profilo: 'Profilo',
  preferenze: 'Notifiche',
};

export default function Header({ className }: HeaderProps) {
  const selectedTab = useAtomValue(selectedTabAtom);
  const pageTitle = keyToTitleMap[selectedTab] ?? 'Benvenuto';

  return (
    <header className={className ?? styles.header}>
      <Typography.Title level={4} style={{ margin: 0, color: '#000' }}>
        {pageTitle}
        {pageTitle === 'Pagamenti' && (
          <Tooltip title="Accrediteremo sul tuo conto corrente mensilmente il totale incassato al netto dei costi.">
            <InfoCircleOutlined
              style={{
                color: '#888',
                cursor: 'pointer',
                marginLeft: 7,
                fontSize: 14,
              }}
            />
          </Tooltip>
        )}
      </Typography.Title>
    </header>
  );
}
