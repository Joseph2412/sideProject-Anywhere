import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useUserProfile } from '@repo/hooks';
import styles from './ProfileSidebar.module.css';

interface ProfileSidebarProps {
  size?: number;
  showEmail?: boolean;
  showFullName?: boolean;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  size = 40,
  showEmail = false,
  showFullName = true,
  layout = 'horizontal',
  className,
}) => {
  const { data: profileData } = useUserProfile();

  const fullName = profileData?.user
    ? `${profileData.user.firstName} ${profileData.user.lastName}`
    : '';

  const email = profileData?.user?.email || '';
  const avatarUrl = profileData?.user?.avatarUrl;

  return (
    <div className={`${styles.container} ${styles[layout]} ${className || ''}`}>
      <Avatar
        size={size}
        src={avatarUrl}
        icon={!avatarUrl && <UserOutlined />}
        className={styles.avatar}
      />

      {(showFullName || showEmail) && (
        <div className={styles.info}>
          {showFullName && fullName && <div className={styles.name}>{fullName}</div>}
          {showEmail && email && <div className={styles.email}>{email}</div>}
        </div>
      )}
    </div>
  );
};
