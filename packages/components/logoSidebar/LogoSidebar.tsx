import { Avatar } from 'antd';
import { ShopOutlined } from '@ant-design/icons';
import { useVenues } from '@repo/hooks';
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
  const { data: venueData } = useVenues();

  // SEMPRE mostra logo e nome del venue, mai la foto profilo
  const imageUrl = venueData?.venues.venue.logoURL;
  const displayName = venueData?.venues.venue.name;

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Avatar
        size={size}
        src={imageUrl || undefined} // Passa undefined invece di null per evitare icona di errore
        icon={!imageUrl && <ShopOutlined />}
        className={styles.logo}
      />
      {showName && displayName && <span className={styles.name}>{displayName}</span>}
    </div>
  );
};
