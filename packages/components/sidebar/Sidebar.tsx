'use client';

//COMPONENTE SIDEBAR

import { Menu, Layout, Modal, Select, Space, Button, Typography, Input, Form } from 'antd';
import { CalendarOutlined, ShopOutlined, UserOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { PrimaryButton, LogoSidebar, SidebarFooter } from '@repo/components';
import { messageToast } from '@repo/ui/store/ToastStore';

import { useSetAtom, useAtomValue } from 'jotai';
import { packagesAtom, fetchPackagesAtom } from '@repo/ui/store/PackageFormStore';

import sidebarStyles from './Sidebar.module.css';
import { useVenues } from '@repo/hooks';

const { Sider } = Layout;

interface SidebarProps {
  onLogout?: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  console.log('SIDEBAR RENDER'); // DEBUG LOG

  const { data } = useVenues();
  console.log(data?.venues); // DEBUG LOG
  console.log(data?.venues.venue.id); // DEBUG LOG. Testa su altri utenti
  const idVenue = data?.venues.venue.id; // usa il primo venue
  const packages = useAtomValue(packagesAtom);
  // Ordina prima per tipologia (DESK prima di SALA), poi per id crescente

  const filteredPackages = packages.filter(pkg => pkg.venueId === idVenue);
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    if (a.type === b.type) return a.id - b.id;
    if (a.type === 'SALA') return -1;
    if (b.type === 'DESK') return 1;
    return 0;
  });

  // Debug: mostra la struttura dei pacchetti
  console.log('Sidebar packages:', packages);
  const [form] = Form.useForm();
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

  const fetchPackages = useSetAtom(fetchPackagesAtom);

  const isEmpty = packages.length === 0; //Controlliamo se ci sono Pacchetti da Mostrare nella sidebar

  const [modalOpen, setModalOpen] = useState(false); //Gestiamo comparsa/scomparsa della Modale

  // Funzione per aggiungere un nuovo pacchetto
  // Crea il pacchetto, aggiorna la sidebar e fa redirect a /packages/:id
  const setToastMessage = useSetAtom(messageToast);
  const handleAddPackage = async () => {
    try {
      const values = await form.validateFields();
      setModalOpen(false);
      form.resetFields();
      // Chiamata API per creare il pacchetto
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/packages/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ name: values.name, type: values.type, venueId: idVenue }),
      });
      if (!res.ok) throw new Error('Errore creazione pacchetto');
      const data = await res.json();
      // Aggiorna la sidebar
      await fetchPackages();
      // Redirect a /packages/:id
      if (data.id) {
        router.push(`/packages/${data.id}`);
      }
    } catch (err) {
      setToastMessage({
        type: 'error',
        message: 'Errore durante la creazione del pacchetto',
        placement: 'bottomRight',
      });
      console.error("Errore durante l'aggiunta del pacchetto:", err);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  return (
    <Sider width={248} style={{ background: '#fff', height: '100vh' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <Menu
          mode="inline"
          onClick={handleMenuClick}
          style={{ borderRight: 'none', flex: 1, overflowY: 'auto' }}
        >
          <div style={{ padding: 16 }}>
            <LogoSidebar size={48} showName={true} />
          </div>
          <Menu.Divider style={{ margin: '8px 16px' }} />
          {/* Sezioni statiche */}
          <Menu.Item key="calendar" icon={<CalendarOutlined />}>
            <Link href="/calendar">Calendario</Link>
          </Menu.Item>
          <Menu.Divider style={{ margin: '8px 16px' }} />
          <Menu.SubMenu key="venue" icon={<ShopOutlined />} title="Locale">
            <Menu.Item key="venue-general" className={sidebarStyles['my-tab']}>
              <Link href="/venue">Generali</Link>
            </Menu.Item>
            <Menu.Item key="payments" className={sidebarStyles['my-tab']}>
              <Link href="/payments">Pagamenti</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.Divider style={{ margin: '8px 16px' }} />
          {/* Pacchetti dinamici */}
          {isEmpty ? (
            <Menu.Item key="addPackage" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
              Aggiungi Pacchetto
            </Menu.Item>
          ) : (
            <>
              <Menu.SubMenu
                key="packages"
                icon={
                  // Usa una icona a piacere, qui un esempio con ShopOutlined
                  <ShopOutlined />
                }
                title="Pacchetti"
                style={{
                  marginLeft: 0,
                  paddingLeft: 0,
                  fontWeight: 500,
                }}
              >
                {sortedPackages.map(pkg => (
                  <Menu.Item
                    key={pkg.id}
                    style={{
                      paddingLeft: 40,
                      paddingRight: 16,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 16,
                      marginBottom: 5,
                    }}
                    onClick={() => router.push(`/packages/${pkg.id}`)}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          minWidth: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {pkg.name}
                      </span>
                      <span
                        style={{
                          whiteSpace: 'nowrap',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 6,
                          height: 20,
                          minWidth: 50,
                          padding: '0px 10px',
                          background: pkg.type === 'SALA' ? '#e6f0ff' : '#fff0f0',
                          color: pkg.type === 'SALA' ? '#1976d2' : '#e53935',
                        }}
                      >
                        {pkg.type === 'SALA' ? 'Room' : 'Desk'}
                      </span>
                    </div>
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
              <Menu.Item
                key="addPackage"
                icon={<PlusOutlined />}
                onClick={() => setModalOpen(true)}
              >
                Aggiungi Pacchetto
              </Menu.Item>
            </>
          )}
          <Menu.Divider style={{ margin: '8px 16px' }} />
          <Menu.SubMenu key="account" icon={<UserOutlined />} title="Account">
            <Menu.Item key="profile">
              <Link href="/profile">Profilo</Link>
            </Menu.Item>
            <Menu.Item key="preferences">
              <Link href="/preferences">Notifiche</Link>
            </Menu.Item>
            <Menu.Item key="logout">Logout</Menu.Item>
          </Menu.SubMenu>
          <Menu.Divider style={{ margin: '8px 16px' }} />
        </Menu>
        <div
          style={{
            bottom: 16,
            left: 0,
            right: 0,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          <SidebarFooter avatarSize={32} />
        </div>
      </div>

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
              style={{ borderColor: '#D9D9D9' }}
            >
              Annulla
            </Button>
            <PrimaryButton type="primary" style={{ color: 'white' }} onClick={handleAddPackage}>
              Aggiungi
            </PrimaryButton>
          </Space>
        }
      >
        <Form form={form} layout="vertical" requiredMark={false} validateTrigger="onSubmit">
          <Form.Item
            name="name"
            label={<Typography.Text>Nome</Typography.Text>}
            rules={[{ required: true, message: 'Inserisci il nome' }]}
            validateTrigger="onSubmit"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="type"
            label={
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>
                Tipologia
              </label>
            }
            rules={[{ required: true, message: 'Seleziona la tipologia' }]}
            validateTrigger="onSubmit"
          >
            <Select style={{ width: '100%' }}>
              <Select.Option value="SALA" label="Sala">
                Sala
              </Select.Option>
              <Select.Option value="DESK" label="Desk">
                Desk
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Sider>
  );
}
