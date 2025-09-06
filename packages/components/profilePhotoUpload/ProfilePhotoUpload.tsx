import { useState, useEffect } from 'react';
import { Upload, Button, Avatar, message, Typography } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import { messageToast } from '@repo/ui/store/LayoutStore';
import { useUserProfile } from '@repo/hooks';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import styles from './ProfilePhotoUpload.module.css';
import { RcFile } from 'antd/es/upload/interface';

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
  const queryClient = useQueryClient();
  const { data: profileData } = useUserProfile();

  // Carica immagine esistente
  useEffect(() => {
    if (profileData?.user.avatarUrl) {
      setImageUrl(profileData.user.avatarUrl);
    }
  }, [profileData]);

  // Validazione file
  const beforeUpload = (file: File) => {
    console.log('Validazione file:', file);
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
    console.log('Evento onChange attivato:', info);

    // Verifica se il file è disponibile
    const file = info.file.originFileObj || (info.file as RcFile); // Usa RcFile come fallback
    if (!file) {
      console.error('Nessun file selezionato.');
      return;
    }

    console.log('File selezionato:', file);

    if (!profileData?.user.id) {
      console.error('ID utente non disponibile.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file); // File originale
      formData.append('type', 'avatar'); // Tipo di upload
      formData.append('id', profileData.user.id.toString()); // ID utente
      formData.append('filename', file.name); // Nome del file
      formData.append('entity', 'users'); // Entità (es. 'users' per foto profilo)

      console.log('Dati inviati al backend:', {
        file: file.name,
        type: 'avatar',
        id: profileData.user.id.toString(),
        filename: file.name,
        entity: 'users',
      });

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/media/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      console.log('Risposta backend:', response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null); // Prova a leggere il messaggio di errore
        console.error('Errore dal backend:', errorData || response.statusText);
        throw new Error("Errore durante l'upload");
      }

      const data = await response.json();
      setImageUrl(data.url);

      // Invalida la cache per aggiornare i dati del profilo
      await queryClient.invalidateQueries({ queryKey: ['profile'] });

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

      // Invalida la cache per aggiornare i dati del profilo
      await queryClient.invalidateQueries({ queryKey: ['profile'] });

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
          src={imageUrl || undefined} // Passa undefined invece di null per evitare icona di errore
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
