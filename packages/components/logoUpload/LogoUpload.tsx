import { useState, useEffect } from 'react';
import { Upload, Button, Avatar, message, Typography } from 'antd';
import { UploadOutlined, ShopOutlined } from '@ant-design/icons';
import { useSetAtom } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import { messageToast } from '@repo/ui/store/LayoutStore';
import { useVenues } from '@repo/hooks';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';
import { RcFile } from 'antd/es/upload/interface';
import styles from './LogoUpload.module.css';

interface LogoUploadProps {
  size?: number;
  showRemove?: boolean;
  className?: string;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
  size = 64,
  showRemove = true,
  className,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setToast = useSetAtom(messageToast);
  const queryClient = useQueryClient();

  // Hooks per dati
  const { data: venueData } = useVenues();

  // SEMPRE gestisce SOLO il logo della venue, mai l'avatar
  const uploadType = 'logo';

  // ID per upload (sempre venue)
  const uploadId = venueData?.venues.venue.id;

  // Carica immagine esistente (sempre logo della venue)
  useEffect(() => {
    if (venueData?.venues.venue.logoURL) {
      setImageUrl(venueData.venues.venue.logoURL);
    } else {
      setImageUrl(null);
    }
  }, [venueData]);

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
    // Verifica se il file è disponibile (con fallback come ProfilePhotoUpload)
    const file = info.file.originFileObj || (info.file as RcFile);
    if (!file) {
      console.error('Nessun file selezionato.');
      return;
    }

    if (!uploadId) {
      console.error('Upload ID non disponibile (venue ID mancante).');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', uploadType);
      formData.append('id', uploadId.toString());
      formData.append('filename', file.name);
      formData.append('entity', 'venues');

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

      // Invalida la cache per aggiornare i dati della venue
      await queryClient.invalidateQueries({ queryKey: ['venues'] });

      setToast({
        type: 'success',
        message: 'Upload completato!',
        description: 'Logo caricato con successo.',
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
    if (!imageUrl || !uploadId) return;

    setLoading(true);

    try {
      // Estrai la chiave S3 dall'URL
      const key = extractS3KeyFromUrl(imageUrl);
      if (!key) {
        throw new Error('Impossibile estrarre la chiave S3');
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/media/delete?type=${uploadType}&id=${uploadId}&filename=${encodeURIComponent(key)}`,
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

      // Invalida la cache per aggiornare i dati della venue
      await queryClient.invalidateQueries({ queryKey: ['venues'] });

      setToast({
        type: 'success',
        message: 'Immagine rimossa!',
        description: 'Logo rimosso con successo.',
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
      <div className={styles.logoContainer}>
        <Avatar
          size={size}
          src={imageUrl || undefined} // Passa undefined invece di null per evitare icona di errore
          icon={!imageUrl && <ShopOutlined />}
          shape="square" // Rende l'avatar quadrato
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
              style={{ borderColor: '#D9D9D9', minWidth: 100 }}
            >
              Upload
            </Button>
          </Upload>

          {showRemove && imageUrl && (
            <Button
              onClick={handleRemove}
              loading={loading}
              disabled={loading}
              style={{ borderColor: '#D9D9D9', minWidth: 100 }}
            >
              Remove
            </Button>
          )}
        </div>
      </div>
      <div>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          Formato 1:1, Dimensione suggerita: 400px X 400px.
        </Typography.Text>
      </div>
    </div>
  );
};
