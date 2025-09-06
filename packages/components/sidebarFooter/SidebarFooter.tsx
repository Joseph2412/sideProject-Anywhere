import { Avatar, Typography } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUserProfile } from '@repo/hooks';
import styles from './SidebarFooter.module.css';

const { Text } = Typography;

interface SidebarFooterProps {
  avatarSize?: number;
  className?: string;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ avatarSize = 32, className }) => {
  const { data: profileData } = useUserProfile();

  const fullName = profileData?.user
    ? `${profileData.user.firstName} ${profileData.user.lastName}`
    : '';

  const email = profileData?.user?.email || '';
  const avatarUrl = profileData?.user?.avatarUrl;

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <Avatar
        size={avatarSize}
        src={avatarUrl || undefined} // Passa undefined invece di null per evitare icona di errore
        icon={!avatarUrl && <UserOutlined />}
        className={styles.avatar}
      />
      <div className={styles.userInfo}>
        {fullName && <Text className={styles.name}>{fullName}</Text>}
        {email && <Text className={styles.email}>{email}</Text>}
      </div>
    </div>
  );
};
