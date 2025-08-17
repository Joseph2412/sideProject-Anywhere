'use client';

import { Menu, Layout, Avatar } from 'antd';
import {
  CalendarOutlined,
  ShopOutlined,
  UserOutlined,
  PlusOutlined,
  TagOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

const { Sider } = Layout;

interface SidebarProps {
  onLogout?: () => void;
}

const menuItems = [
  {
    key: 'calendar',
    icon: <CalendarOutlined />,
    label: <Link href="/calendar">Calendario</Link>,
  },
  {
    type: 'divider' as const,
  },
  {
    key: 'venue',
    icon: <ShopOutlined />,
    label: 'Locale',
    children: [
      { key: 'venue-general', label: <Link href="/venue">Generali</Link> },
      { key: 'payments', label: <Link href="/payments">Pagamenti</Link> },
    ],
  },
  {
    type: 'divider' as const,
  },
  {
    key: 'bundles',
    icon: <TagOutlined />,
    label: <Link href="/bundles">Pacchetti</Link>,
  },
  {
    key: 'addBundle',
    icon: <PlusOutlined />,
    label: <Link href="/addBundle">Aggiungi pacchetto</Link>,
  },
  {
    type: 'divider' as const,
  },
  {
    key: 'account',
    icon: <UserOutlined />,
    label: 'Account',
    children: [
      { key: 'profile', label: <Link href="/profile">Profilo</Link> },
      { key: 'preferences', label: <Link href="/preferences">Notifiche</Link> },
      { key: 'logout', label: 'Logout' },
    ],
  },
];

export default function Sidebar({ onLogout }: SidebarProps) {
  // Gestione click solo per il logout
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      onLogout?.();
    }
  };

  return (
    <Sider width={220} style={{ background: '#fff', height: '100vh' }}>
      <div style={{ padding: 16 }}>
        <Avatar size="large" style={{ marginBottom: 8 }} />
        <div style={{ fontWeight: 600 }}>PlaceHolder</div>
      </div>
      <Menu mode="inline" onClick={handleMenuClick} items={menuItems} />
      <div style={{ position: 'absolute', bottom: 16, paddingLeft: 16 }}>
        <Avatar src="/utente.jpg" />
        <br />
        <small>Marco Cattaneo</small>
        <br />
        <small>marco@pausa.it</small>
      </div>
    </Sider>
  );
}
