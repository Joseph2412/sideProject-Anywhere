'use client';

import { Menu, Layout, Avatar } from 'antd';
import {
  CalendarOutlined,
  ShopOutlined,
  UserOutlined,
  PlusOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { useLogout } from '../../../../../apps/host/app/hooks/useLogout';
import { useAtom, useSetAtom } from 'jotai';
import { selectedTabAtom, pageTitleAtom, TabKey } from '../../store/LayoutStore';
import { useState } from 'react';

const { Sider } = Layout;

export default function Sidebar() {
  // Hook personalizzato per gestire il logout
  const logout = useLogout();

  // Lettura e aggiornamento dello stato globale con Jotai
  const [selectedTab, setSelectedTab] = useAtom(selectedTabAtom); // Setter per selectedTabAtom
  const setPageTitle = useSetAtom(pageTitleAtom); // Setter per il titolo dinamico in Header

  // Stato locale per gestire i dropdown (SubMenu) aperti nella sidebar
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  // Mappa delle chiavi tab → titolo da mostrare nell'intestazione
  const keyToTitleMap: Record<string, string> = {
    calendar: 'Calendario',
    gestione: 'Gestione Locale',
    orari: 'Orari',
    aggiungi: 'Aggiungi pacchetto',
    profilo: 'Profilo',
    preferenze: 'Notifiche',
    pacchetti: 'Pacchetti',
  };

  // Gestisce l'apertura dei dropdown (SubMenu). Limita l'apertura multipla.
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys); // Lascia i dropdown aperti normalmente (senza chiuderli tra loro)
  };

  // Gestione del click su ogni voce di menu
  const handleMenuClick = ({ key, keyPath }: { key: string; keyPath: string[] }) => {
    // Se si clicca su "logout", esegue il logout e interrompe il flusso
    if (key === 'logout') {
      logout();
      return;
    }

    // Se la chiave cliccata è una delle chiavi valide, aggiorna lo stato
    const title = keyToTitleMap[key];
    if (title) {
      setPageTitle(title); // Aggiorna il titolo in Header
      setSelectedTab(key as TabKey); // Aggiorna l'atomo globale per il contenuto dinamico
    }

    // Se la voce cliccata NON è dentro un SubMenu (quindi keyPath.length === 1), chiude i dropdown
    if (keyPath.length === 1) {
      setOpenKeys([]); // Chiude tutti i dropdown
    }
  };

  return (
    <Sider width={220} style={{ background: '#fff', height: '100vh' }}>
      {/* Header della sidebar (logo + nome coworking) */}
      <div style={{ padding: 16 }}>
        <Avatar
          size="large"
          // src="/logo-milano.png" // Da attivare se si ha il logo
          style={{ marginBottom: 8 }}
        />
        <div style={{ fontWeight: 600 }}>PlaceHolder</div>
      </div>

      {/* Menu principale della sidebar */}
      <Menu
        mode="inline"
        selectedKeys={[selectedTab]} // Evidenziazione della voce attiva
        openKeys={openKeys} // Dropdown attualmente aperti
        onOpenChange={handleOpenChange} // Gestione apertura dropdown
        onClick={handleMenuClick} // Gestione click su ogni voce
      >
        {/* Voci dirette (non in dropdown) */}
        <Menu.Item key="calendar" icon={<CalendarOutlined />}>
          Calendario
        </Menu.Item>
        <div style={{ height: 1, background: '#f0f0f0', margin: '12px 16px' }} />

        {/* Dropdown "Locale" con voci annidate */}
        <Menu.SubMenu key="locale" icon={<ShopOutlined />} title="Locale">
          <Menu.Item key="gestione">Gestione Locale</Menu.Item>
          <Menu.Item key="orari">Orari</Menu.Item>
        </Menu.SubMenu>

        <div style={{ height: 1, background: '#f0f0f0', margin: '12px 16px' }} />
        <Menu.SubMenu key="pacchetti" icon={<TagOutlined />} title="Pacchetti"></Menu.SubMenu>
        {/* Voce singola fuori da dropdown */}
        <Menu.Item key="aggiungi" icon={<PlusOutlined />}>
          Aggiungi pacchetto
        </Menu.Item>
        <div style={{ height: 1, background: '#f0f0f0', margin: '12px 16px' }} />

        {/* Dropdown "Account" con voce "profilo" e logout */}
        <Menu.SubMenu key="account" icon={<UserOutlined />} title="Account">
          <Menu.Item key="profilo">Profilo</Menu.Item>
          <Menu.Item key="preferenze">Notifiche</Menu.Item>
          <Menu.Item key="logout">Logout</Menu.Item>
        </Menu.SubMenu>
      </Menu>

      {/* Footer della sidebar (dati utente attivo) */}
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
