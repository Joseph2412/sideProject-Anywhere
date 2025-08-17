'use client';
import React from 'react';
import { LoginForm } from '@repo/components';
import { useRouter } from 'next/navigation';
import { MessageProvider } from '@repo/components';

export default function LoginPage() {
  const router = useRouter();

  return (
    <>
      <MessageProvider>
        <LoginForm
          onLoginSuccess={() => {
            setTimeout(() => {
              router.push('/calendar');
            }, 300);
          }}
          onGoToSignup={() => router.replace('/signup')}
        />
      </MessageProvider>
    </>
  );
}
