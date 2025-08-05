'use client';

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { messageToast, ToastPayload } from '../../../ui/src/store/LayoutStore';
import { useAtom } from 'jotai';
import { notification } from 'antd';

export function MessageProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [toast, setToast] = useAtom<ToastPayload | false>(messageToast);

  const [isHydrated, setIsHydrated] = useState(false);

  const lastShownMessageRef = useRef<string | null>(null);
  //Ref per tenere traccia dei messaggi mostrati

  const [api, contextHolder] = notification.useNotification({
    stack: {
      threshold: 3,
    },
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!toast || !isHydrated) return;

    //Se showOnce è attivo ed il messaggio è identico a quello già mostrato, non mostrare di nuovo stesso messaggio
    if (toast.showOnce && toast.message === lastShownMessageRef.current) return;

    if (toast && isHydrated) {
      api.open({
        type: toast.type || 'info',
        //FallBack ad INFO. Type Info è come la il nero: Sta bene su tutto

        message: toast.message,
        description: toast.description || '',
        //FallBack a Vuoto: Magari il Titolo basta da solo

        duration: toast.duration ?? 3,
        placement: toast.placement || 'bottomRight',
        //FallBack in basso a sinistra: Di norma L'utente lo vede lì
        onClose: () => {
          setToast(false);
        },
      });

      //Se SHOW Once è attivo, Salva il messaggio come già mostrato
      if (toast.showOnce) {
        lastShownMessageRef.current = toast.message;
      }
    }
  }, [toast, isHydrated]);

  return (
    <>
      {children}
      {isHydrated && contextHolder}
    </>
  );
}
