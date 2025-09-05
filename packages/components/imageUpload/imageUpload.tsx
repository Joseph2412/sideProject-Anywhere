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
  const venueId = data?.venues.venue.id;

  const setToast = useSetAtom(messageToast);

  const pathname = usePathname();
  const params = useParams();

  // Dichiara id ed entity PRIMA di qualsiasi useEffect
  let id: number | undefined;
  let entity: 'venues' | 'packages' | undefined;

  console.log('DEBUG params:', params);
  if (pathname.startsWith('/packages/')) {
    // Gestione robusta: usa params.id se presente (route /packages/[id])
    id = params.id ? Number(params.id) : undefined;
    entity = 'packages';
  } else if (pathname.startsWith('/venue')) {
    id = venueId;
    entity = 'venues';
  }

  // Console Log Per DEBUG
  console.log('venueDetails:', data?.venues);
  console.log('ID inviato per upload:', id);
  console.log('pathname:', pathname);
  console.log('params:', params);

  const handleChange: UploadProps['onChange'] = info => {
    setLoading(info.file.status === 'uploading');
    setFileList(
      info.fileList
        .map(file => {
          if (file.status === 'done' && file.response?.url) {
            return { ...file, url: file.response.url, thumbUrl: file.response.url };
          }
          return file;
        })
        .slice(-12)
    );

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

  //Serve per fare il match corretto con il filename e l'url di amazon
  function extractS3KeyFromUrl(url: string) {
    const match = url.match(/\.amazonaws\.com\/(.+?)(\?|$)/);
    return match ? match[1] : null;
  }

  const handleRemove = async (file: UploadFile<string>) => {
    if (!file.url) {
      setFileList(prev => prev.filter(f => f.uid !== file.uid));
      return true;
    }
    const key = extractS3KeyFromUrl(file.url || '');
    if (!key) {
      setToast({
        type: 'error',
        message: 'Errore rimozione',
        description: "Impossibile estrarre la chiave S3 dall'URL.",
        duration: 4,
        placement: 'bottomRight',
      });
      return false;
    }
    const parts = key.split('/');
    if (parts.length < 4) {
      setToast({
        type: 'error',
        message: 'Errore rimozione',
        description: 'Chiave S3 non valida.',
        duration: 4,
        placement: 'bottomRight',
      });
      return false;
    }
    const id = parts[1];
    const filename = parts.slice(3).join('/');

    let url = '';
    if (pathname.startsWith('/venue')) {
      // Per venue: aggiungi entity=venues
      url = `${process.env.NEXT_PUBLIC_API_HOST}/media/delete?entity=venues&id=${id}&filename=${encodeURIComponent(filename)}`;
    } else if (pathname.startsWith('/packages/')) {
      url = `${process.env.NEXT_PUBLIC_API_HOST}/media/delete?entity=packages&id=${id}&filename=${encodeURIComponent(filename)}`;
    } else {
      setToast({
        type: 'error',
        message: 'Errore rimozione',
        description: 'Path non supportato.',
        duration: 4,
        placement: 'bottomRight',
      });
      return false;
    }

    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Errore durante la cancellazione');
      setToast({
        type: 'success',
        message: 'Immagine eliminata!',
        duration: 3,
        placement: 'bottomRight',
      });
      return true;
    } catch (err) {
      setToast({
        type: 'error',
        message: 'Errore rimozione',
        description: (err as Error).message,
        duration: 4,
        placement: 'bottomRight',
      });
      return false;
    }
  };

  useEffect(() => {
    // id ed entity sono già nello scope del componente
    async function fetchGallery() {
      if (!id || !entity) return;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/media/gallery/${entity}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const { urls } = await res.json();
      const files = (urls || []).map((url: string, idx: number) => ({
        uid: url,
        name: `Immagine ${idx + 1}`,
        status: 'done',
        url,
        key: extractS3KeyFromUrl(url),
      }));
      setFileList(files);
    }
    fetchGallery();
  }, [id, entity]);

  const uploadButton = (
    <button
      style={{
        border: 20,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#d9d9d9',
        minWidth: '350px',
        minHeight: '260px',
        width: '350px',
        height: '260px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Card
      style={{
        paddingRight: '0px !important',
        height: '100%',
        minWidth: '100%',
        width: 'fit-content',
      }}
    >
      <div className={styles.centeredUpload}>
        <Upload
          maxCount={12}
          className="upload-Button"
          name="file"
          listType="picture-card"
          showUploadList
          action={UPLOAD_ENDPOINT}
          headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          onRemove={handleRemove}
          data={file => ({
            type: 'gallery',
            entity,
            id,
            filename: file.name,
          })}
          fileList={fileList}
          multiple
        >
          {fileList.length >= 12 ? null : uploadButton}
        </Upload>
      </div>
    </Card>
  );
};

export default ImageUpload;
