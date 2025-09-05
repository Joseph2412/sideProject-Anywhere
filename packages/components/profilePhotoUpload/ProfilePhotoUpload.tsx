import { useState, useEffect } from 'react';
import { Upload, Button, Avatar, message, Typography } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/LayoutStore';
import { useUserProfile } from '@repo/hooks';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import styles from './ProfilePhotoUpload.module.css';

const { Text } = Typography;

interface ProfilePhotoUploadProps {
  size?: number;
  showTitle?: boolean;
  showRemove?: boolean;
  title?: string;
  description?: string;
  className?: string;
}

export const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  size = 100,
  showTitle = true,
  showRemove = true,
  title = 'Foto Profilo',
  description = '',
  className,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setToast = useSetAtom(messageToast);
  const { data: profileData } = useUserProfile();

  // Carica immagine esistente
  useEffect(() => {
    if (profileData?.user.avatarUrl) {
      setImageUrl(profileData.user.avatarUrl);
    }
  }, [profileData]);

  // Validazione file
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Puoi caricare solo file JPG/PNG!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("L'immagine deve essere più piccola di 2MB!");
      return false;
    }
    return false; // Previeni upload automatico
  };

  // Handler upload
  const handleUpload = async (info: UploadChangeParam<UploadFile>) => {
    const file = info.file.originFileObj;
    if (!file || !profileData?.user.id) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'avatar');
      formData.append('id', profileData.user.id.toString());

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/media/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Errore durante l'upload");
      }

      const data = await response.json();
      setImageUrl(data.url);

      setToast({
        type: 'success',
        message: 'Upload completato!',
        description: 'Foto profilo caricata con successo.',
        duration: 3,
        placement: 'bottomRight',
      });
    } catch (error) {
      console.error('Errore upload:', error);
      setToast({
        type: 'error',
        message: 'Errore upload',
        description: error instanceof Error ? error.message : 'Errore sconosciuto',
        duration: 4,
        placement: 'bottomRight',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handler rimozione
  const handleRemove = async () => {
    if (!imageUrl || !profileData?.user.id) return;

    setLoading(true);

    try {
      // Estrai la chiave S3 dall'URL
      const key = extractS3KeyFromUrl(imageUrl);
      if (!key) {
        throw new Error('Impossibile estrarre la chiave S3');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/media/delete?type=avatar&id=${profileData.user.id}&filename=${encodeURIComponent(key)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Errore durante la rimozione');
      }

      setImageUrl(null);

      setToast({
        type: 'success',
        message: 'Immagine rimossa!',
        description: 'Foto profilo rimossa con successo.',
        duration: 3,
        placement: 'bottomRight',
      });
    } catch (error) {
      console.error('Errore rimozione:', error);
      setToast({
        type: 'error',
        message: 'Errore rimozione',
        description: error instanceof Error ? error.message : 'Errore sconosciuto',
        duration: 4,
        placement: 'bottomRight',
      });
    } finally {
      setLoading(false);
    }
  };

  // Utility per estrarre chiave S3
  const extractS3KeyFromUrl = (url: string): string | null => {
    const match = url.match(/\.amazonaws\.com\/(.+?)(\?|$)/);
    return match ? (match[1] ?? null) : null;
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {showTitle && (
        <div className={styles.header}>
          <Text strong className={styles.title}>
            {title}
          </Text>
          {description && (
            <Text type="secondary" className={styles.description}>
              {description}
            </Text>
          )}
        </div>
      )}

      <div className={styles.profileContainer}>
        <Avatar
          size={size}
          src={imageUrl}
          icon={!imageUrl && <UserOutlined />}
          className={styles.avatar}
        />
        <div className={styles.buttonsContainer}>
          <Upload
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleUpload}
            disabled={loading}
          >
            <Button
              icon={<UploadOutlined />}
              loading={loading}
              disabled={loading}
              className={styles.uploadButton}
            >
              Carica
            </Button>
          </Upload>
          {showRemove && (
            <Button
              onClick={handleRemove}
              loading={loading}
              disabled={loading}
              className={styles.removeButton}
            >
              Rimuovi
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
