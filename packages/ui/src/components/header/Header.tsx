'use client';

import { Typography } from 'antd';
import { useAtomValue } from 'jotai';
import { pageTitleAtom } from '../../store/LayoutStore';
import styles from './Header.module.css';

type HeaderProps = {
  className?: string;
};

export default function Header({ className }: HeaderProps) {
  const pageTitle = useAtomValue(pageTitleAtom);

  return (
    <header className={className ?? styles.header}>
      <Typography.Title level={4} style={{ margin: 0, color: '#000' }}>
        {pageTitle}
      </Typography.Title>
    </header>
  );
}
