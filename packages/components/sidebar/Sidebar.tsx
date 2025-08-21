'use client';

//COMPONENTE SIDEBAR

import { Menu, Layout, Avatar, Modal, Select, Space, Button, Typography, Input } from 'antd';
import { CalendarOutlined, ShopOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Package } from '@repo/ui';
import { PrimaryButton } from '@repo/components';

import { useSetAtom, useAtomValue } from 'jotai';
import { packageFormAtom, packagesAtom, fetchPackagesAtom } from '@repo/ui/store/PackageFormStore';

const { Sider } = Layout;

interface SidebarProps {
  onLogout?: () => void;
  // props non più necessari: fetchPackages, packages
}

interface newPackage {
  id: number;
  title: string;
  type: 'SALA' | 'DESK';
  squareMetres?: number;
  capacity?: number;
  services?: string[];
  plans?: string[];
  photos?: string[];
}

// Rimosso: va usato dentro il componente

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
    key: 'addPackage',
    icon: <PlusOutlined />,
    label: 'Aggiungi pacchetto',
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
  console.log('SIDEBAR COMPONENT RENDERED'); // DEBUG LOG
  const packages = useAtomValue(packagesAtom);
  // Debug: mostra la struttura dei pacchetti
  console.log('Sidebar packages:', packages);
  const router = useRouter();
  // Gestione click solo per il logout
  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      onLogout?.();
    }
    if (key === 'addPackage') {
      setModalOpen(true);
    }
  };

  // (rimosso: dichiarazione duplicata)
  const fetchPackages = useSetAtom(fetchPackagesAtom);

  const isEmpty = packages.length === 0; //Controlliamo se ci sono Pacchetti da Mostrare nella sidebar

  const [modalOpen, setModalOpen] = useState(false); //Gestiamo comparsa/scomparsa della Modale
  const [localName, setLocalName] = useState('');
  const [localType, setLocalType] = useState<'Sala' | 'Desk'>('Sala');
  const setPackageForm = useSetAtom(packageFormAtom);

  // Funzione per aggiungere un nuovo pacchetto
  // Naviga alla pagina di aggiunta pacchetto passando nome e tipologia come query string
  const handleAddPackage = () => {
    setPackageForm({ name: localName, type: localType as 'Sala' | 'Desk' });
    setModalOpen(false);
    setLocalName('');
    router.push('/addPackage');
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <Sider width={220} style={{ background: '#fff', height: '100vh' }}>
      <div style={{ padding: 16 }}>
        <Avatar size="large" style={{ marginBottom: 8 }} />
        <div style={{ fontWeight: 600 }}>PlaceHolder</div>
      </div>

      <Menu mode="inline" onClick={handleMenuClick}>
        {/* Sezioni statiche */}
        <Menu.Item key="calendar" icon={<CalendarOutlined />}>
          <Link href="/calendar">Calendario</Link>
        </Menu.Item>
        <Menu.Divider />
        <Menu.SubMenu key="venue" icon={<ShopOutlined />} title="Locale">
          <Menu.Item key="venue-general">
            <Link href="/venue">Generali</Link>
          </Menu.Item>
          <Menu.Item key="payments">
            <Link href="/payments">Pagamenti</Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Divider />
        {/* Pacchetti dinamici */}
        {isEmpty ? (
          <Menu.Item key="addPackage" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Aggiungi Pacchetto
          </Menu.Item>
        ) : (
          <>
            {packages.map(pkg => (
              <Menu.Item key={pkg.id} style={{ marginLeft: 25 }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <span
                    style={{
                      flex: 1,
                      minWidth: 0,
                      fontSize: 12,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {pkg.title}
                  </span>

                  <span
                    style={{
                      marginRight: 15,
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      borderRadius: 3,
                      padding: '4px 8px', // Spazio Dello Span Colorato
                      fontSize: 11, // Font Scritta. Valuta
                      lineHeight: 1.2, // Linea in Altezza (provare a "giocarci" con questo valore)
                      fontWeight: 500,
                      background: pkg.type === 'SALA' ? '#e6f0ff' : '#fff0f0',
                      color: pkg.type === 'SALA' ? '#1976d2' : '#e53935',
                    }}
                  >
                    {pkg.type === 'SALA' ? 'Room' : 'Desk'}
                  </span>
                </div>
              </Menu.Item>
            ))}
            <Menu.Item key="addPackage" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              Aggiungi Pacchetto
            </Menu.Item>
          </>
        )}
        <Menu.Divider />
        <Menu.SubMenu key="account" icon={<UserOutlined />} title="Account">
          <Menu.Item key="profile">
            <Link href="/profile">Profilo</Link>
          </Menu.Item>
          <Menu.Item key="preferences">
            <Link href="/preferences">Notifiche</Link>
          </Menu.Item>
          <Menu.Item key="logout">Logout</Menu.Item>
        </Menu.SubMenu>
      </Menu>

      <Modal
        title="Aggiungi pacchetto"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
        }}
        footer={
          <Space>
            <Button
              onClick={() => {
                setModalOpen(false);
              }}
            >
              Annulla
            </Button>
            <PrimaryButton type="primary" style={{ color: 'white' }} onClick={handleAddPackage}>
              Aggiungi
            </PrimaryButton>
          </Space>
        }
      >
        <Typography.Text>Nome</Typography.Text>
        <Input value={localName} onChange={e => setLocalName(e.target.value)} />
        <div style={{ marginTop: 16 }}>
          <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Tipologia</label>
          <Select
            value={localType}
            onChange={value => setLocalType(value)}
            style={{ width: '100%' }}
          >
            <Select.Option value="SALA" label="Sala">
              Sala
            </Select.Option>
            <Select.Option value="DESK" label="Desk">
              Desk
            </Select.Option>
          </Select>
        </div>
      </Modal>
      <div style={{ position: 'absolute', bottom: 16, paddingLeft: 16 }}>
        <Avatar />
        <br />
        <small>Marco Cattaneo</small>
        <br />
        <small>marco@pausa.it</small>
      </div>
    </Sider>
  );
}
