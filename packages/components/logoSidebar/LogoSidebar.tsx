import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useVenues, useUserProfile } from '@repo/hooks';
import { usePathname } from 'next/navigation';
import styles from './LogoSidebar.module.css';

interface LogoSidebarProps {
  size?: number;
  showName?: boolean;
  className?: string;
}

export const LogoSidebar: React.FC<LogoSidebarProps> = ({
  size = 40,
  showName = false,
  className,
}) => {
  const pathname = usePathname();
  const { data: venueData } = useVenues();
  const { data: profileData } = useUserProfile();

  // Determina quale immagine mostrare basato sul contesto
  const isVenueContext = pathname.includes('/venue') || pathname.includes('/packages');

  const imageUrl = isVenueContext ? venueData?.venues.venue.logoUrl : profileData?.user.avatarUrl;

  const displayName = isVenueContext
    ? venueData?.venues.venue.name
    : `${profileData?.user.firstName} ${profileData?.user.lastName}`;

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Avatar
        size={size}
        src={imageUrl}
        icon={!imageUrl && <UserOutlined />}
        className={styles.logo}
      />
      {showName && displayName && <span className={styles.name}>{displayName}</span>}
    </div>
  );
};
