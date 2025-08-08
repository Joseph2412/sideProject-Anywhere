'use client';

import { useAtomValue } from 'jotai';
import { selectedTabAtom } from '@repo/ui/store/LayoutStore';
import { UserProvider } from '../../components/providers/User.provider';
import style from './style.module.css';
import LayoutClientWrapper from 'app/LayoutClientWrapper';

import Sidebar from '@repo/ui/components/sidebar/Sidebar';
import Header from '@repo/ui/components/header/Header';
import Calendar from '@repo/ui/components/calendar/calendar';
import { ProfileForm } from '@repo/ui/components/account/profile';
import AddBundle from '@repo/ui/components/bundle/bundle';
import { Venue } from '@repo/ui/components/venue/venue';
import Payments from '@repo/ui/components/payments/payments';
import Packages from '@repo/ui/components/bundle/packages';
import { MessageProvider } from '../../../../../packages/components/src/providers/Message.provider';
import { PreferencesForm } from '@repo/ui/components/preferences/PreferencesForm';

export default function InternalLayout() {
  const selectedTab = useAtomValue(selectedTabAtom);
  const renderContent = () => {
    switch (selectedTab) {
      case 'calendar':
        return <Calendar />;
      case 'gestione':
        return <Venue />;
      case 'pagamenti':
        return <Payments />;
      case 'aggiungi':
        return <AddBundle />;
      case 'profilo':
        return <ProfileForm />;
      case 'preferenze':
        return <PreferencesForm />;
      case 'pacchetti':
        return <Packages />;
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
            <Sidebar />

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
