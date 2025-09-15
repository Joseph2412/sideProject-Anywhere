/**
 * Barrel export per il package @repo/components
 * Pattern: Organizzazione modulare per categoria funzionale
 * Vantaggi: Import centralizzati, tree-shaking ottimizzato, interfaccia pulita
 * Uso: import { LoginForm, Header } from '@repo/components'
 */

// Providers
export * from './src/providers';

// Authentication Components
export * from './loginform';
export * from './signupform';

// Form Components
export * from './inputs';
export * from './buttons';

// Layout Components
export * from './header';
export * from './sidebar';

// User Components
export * from './account/ProfileForm';
export * from './preferences';

// Venue Components
export * from './venue';

// Media Components
export * from './imageUpload';
export * from './logoUpload';
export * from './profilePhotoUpload';

// Navigation Components
export * from './tabs';

// Calendar Components
export * from './calendar';

// Bundle Components
export * from './packageList/PackageForm';
export * from './packageList/PackagesList';

// Bookings Components
export * from './bookings/BookingsForm';

// Sidebar Components
export * from './logoSidebar';
export * from './sidebarFooter';
