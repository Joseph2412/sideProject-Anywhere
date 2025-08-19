import Tab from '../tabs/tab';
import { BundleDetails } from './details/BundleDetails';
import { BundlePlans } from './plans/BundlePlans';
import { ImageUpload } from './../imageUpload/imageUpload';

const tabs = [
  { key: 'details', label: 'Dettagli', children: <BundleDetails /> },
  { key: 'plans', label: 'Piani', children: <BundlePlans /> },
  { key: 'images', label: 'Immagini', children: <ImageUpload /> },
];

export const BundleForm = () => <Tab tabs={tabs} />;
