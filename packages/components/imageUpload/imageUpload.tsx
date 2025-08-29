import React, { useEffect, useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Upload } from 'antd';
import type { GetProp, UploadProps, UploadFile } from 'antd';
import styles from './imageUpload.module.css';
import { useSetAtom } from 'jotai';
import { useParams } from 'next/navigation';
import { messageToast } from '@repo/ui/store/ToastStore';
import { usePathname } from 'next/navigation';
import { useVenues } from '@repo/hooks';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const beforeUpload = (file: FileType) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    console.log('Formato non valido:', file.type);
  }
  const isLt1GB = file.size / 1024 / 1024 < 1024;
  if (!isLt1GB) {
    console.log('File troppo grande:', file.size);
  }
  return isJpgOrPng && isLt1GB;
};

const UPLOAD_ENDPOINT = `${process.env.NEXT_PUBLIC_API_HOST}/media/upload`;

export const ImageUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile<string>[]>([]);

  const { data } = useVenues();
  const venueId = data?.venue?.id;

  const setToast = useSetAtom(messageToast);

  const pathname = usePathname();
  const params = useParams();

  let id: number | undefined;

  if (pathname.startsWith('/packages/')) {
    id = params.packageId ? Number(params.packageId) : undefined;
  } else if (pathname.startsWith('/venue')) {
    id = venueId;
  }

  // Logga il valore di id che verrà inviato e altre variabili utili per debug
  console.log('venueDetails:', data?.venue);
  console.log('ID inviato per upload:', id);
  console.log('pathname:', pathname);
  console.log('params:', params);

  const handleChange: UploadProps['onChange'] = info => {
    setLoading(info.file.status === 'uploading');
    setFileList(info.fileList.slice(-12)); // Limita a 12 immagini

    if (info.file.status === 'done') {
      setLoading(false);
      setToast({
        type: 'success',
        message: 'Upload completato!',
        description: `L'immagine "${info.file.name}" è stata caricata con successo su S3.`,
        duration: 4,
        placement: 'bottomRight',
      });
      console.log('Upload success:', info.file.response);
    } else if (info.file.status === 'error') {
      setLoading(false);
      setToast({
        type: 'error',
        message: 'Errore upload',
        description: `Errore durante l'upload di "${info.file.name}".`,
        duration: 4,
        placement: 'bottomRight',
      });
      console.error('Upload error:', info.file.error);
    }
  };

  // const handleRemove = (file: UploadFile<string>) => {};
  //TODO: Devi implementare funzione per Cancellare la Singola Foto
  //Cancello la foto a DB o comando su S3? Don't Know

  useEffect(() => {
    async function fetchGallery() {
      if (!venueId) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/media/gallery/${venueId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const { urls } = await res.json();
      const files = (urls || []).map((url: string, idx: number) => ({
        uid: url,
        name: `Immagine ${idx + 1}`,
        status: 'done',
        url,
      }));
      setFileList(files);
    }
    fetchGallery();
  }, [venueId]);

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
        name="file"
        listType="picture-card"
        showUploadList
        action={UPLOAD_ENDPOINT}
        headers={{
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        //disabled={!id} serve per testare se passi l'Id. Si abilita se presente
        data={file => ({
          type: 'gallery',
          id,
          filename: file.name,
        })}
        fileList={fileList}
        multiple
      >
        {fileList.length >= 12 ? null : uploadButton}
      </Upload>
    </Card>
  );
};

export default ImageUpload;
