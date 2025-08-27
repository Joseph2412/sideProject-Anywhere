import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Upload } from 'antd';
import type { GetProp, UploadProps, UploadFile } from 'antd';
import styles from './imageUpload.module.css';
import { useAtomValue, useSetAtom } from 'jotai';
import { authUserAtom } from '@repo/ui';
import { useParams } from 'next/navigation';
import { messageToast } from '@repo/ui/store/ToastStore';

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

const UPLOAD_ENDPOINT = `${process.env.NEXT_PUBLIC_API_HOST}/media/images`;

export const ImageUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile<string>[]>([]);
  const authUser = useAtomValue(authUserAtom);
  const userId = authUser?.id;
  const setToast = useSetAtom(messageToast);

  const params = useParams();
  const packageId = params.packageId ? Number(params.packageId) : undefined;

  const handleChange: UploadProps['onChange'] = info => {
    console.log('Upload info:', info);

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
        name="galleryPhotos"
        listType="picture-card"
        showUploadList
        action={UPLOAD_ENDPOINT}
        headers={{
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        data={file => ({
          type: 'gallery',
          id: packageId ?? userId,
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
