'use client';

import { useAtomValue } from 'jotai';
import { selectedTabAtom } from '@repo/ui/store/LayoutStore';
import { UserProvider } from '../../components/providers/UserAuthProvider';
import style from './style.module.css';
import LayoutClientWrapper from 'app/LayoutClientWrapper';

import {
  Sidebar,
  Header,
  Calendar,
  ProfileForm,
  AddBundleForm,
  Venue,
  PaymentsForm,
  PackagesList,
  PreferencesForm,
  MessageProvider,
} from '@repo/components';
import { useLogout } from '../../hooks/useLogout';

export default function InternalLayout() {
  const selectedTab = useAtomValue(selectedTabAtom);
  const logout = useLogout();
  const renderContent = () => {
    switch (selectedTab) {
      case 'calendar':
        return <Calendar />;
      case 'gestione':
        return <Venue />;
      case 'pagamenti':
        return <PaymentsForm />;
      case 'aggiungi':
        return <AddBundleForm />;
      case 'profilo':
        return <ProfileForm />;
      case 'preferenze':
        return <PreferencesForm />;
      case 'pacchetti':
        return <PackagesList />;
      default:
        return <div style={{ padding: 24 }}>Benvenuto nella tua area privata</div>;
    }
  };
  return (
    <MessageProvider>
      <LayoutClientWrapper>
        <UserProvider>
          <div className={style['layout-container']}>
            {/* Sidebar a sinistra */}
            <Sidebar onLogout={logout} />

            {/* Contenuto principale */}
            <div className={style['content-container']}>
              {/* Header visibile in alto */}
              <Header className={style.header} />

              <main className={style['main-content']}>{renderContent()}</main>
            </div>
          </div>
        </UserProvider>
      </LayoutClientWrapper>
    </MessageProvider>
  );
}
