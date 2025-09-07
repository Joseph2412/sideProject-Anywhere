import { Avatar, Typography } from 'antd';
import { useUserProfile } from '@repo/hooks';
import styles from './SidebarFooter.module.css';

//Import ICONE CUSTOM
import { IconNoPic } from '../customIcons';

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
      {avatarUrl ? (
        <Avatar size={avatarSize} src={avatarUrl} className={styles.avatar} />
      ) : (
        <div
          className={styles.avatar}
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: '50%',
            backgroundColor: 'grey',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #f0f0f0',
          }}
        >
          <IconNoPic />
        </div>
      )}
      <div className={styles.userInfo}>
        {fullName && <Text className={styles.name}>{fullName}</Text>}
        {email && <Text className={styles.email}>{email}</Text>}
      </div>
    </div>
  );
};
