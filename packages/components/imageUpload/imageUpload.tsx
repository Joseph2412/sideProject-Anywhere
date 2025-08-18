import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, message, Upload } from 'antd';
import type { GetProp, UploadProps } from 'antd';
import styles from './imageUpload.module.css';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

/**
 * Converte file immagine in base64 per preview
 * Utilizza FileReader API per conversione asincrona
 * @param img - File immagine da convertire
 * @param callback - Funzione chiamata con il risultato base64
 */
const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

/**
 * Validazione pre-upload per file immagini
 * Pattern: validazione client-side per UX immediata
 * Controlli: formato (JPG/PNG) e dimensione (max 2MB)
 * @param file - File da validare
 * @returns boolean - true se il file passa la validazione
 */
const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

/**
 * Componente per upload multiplo di immagini venue
 * Pattern: gestione stati upload + preview con base64
 * Features: validazione client, loading states, preview immediato
 * Limite: max 12 immagini per venue
 */
export const ImageUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  /**
   * Gestisce i cambi di stato durante l'upload
   * Pattern: switch su status per gestire stati diversi di upload
   */
  const handleChange: UploadProps['onChange'] = info => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as FileType, url => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Card className={styles.upload207}>
      <Upload
        maxCount={12}
        className={styles.upload207}
        name="venuePhotos"
        listType="picture-card"
        showUploadList={false}
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="venuePhoto" /> : uploadButton}
      </Upload>
    </Card>
  );
};

export default ImageUpload;
