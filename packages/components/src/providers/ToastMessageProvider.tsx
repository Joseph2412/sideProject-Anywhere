// ToastMessageProvider: gestisce notifiche toast globali con Ant Design

'use client'; // Indica che questo è un Client Component (Next.js 13+)

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { messageToast, ToastPayload } from '@repo/ui/store/ToastStore';
import { useAtom } from 'jotai';
import { notification } from 'antd';

// MessageProvider: provider per notifiche toast globali
export function MessageProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  // Jotai atom connection per toast
  const [toast, setToast] = useAtom<ToastPayload | false>(messageToast);

  // Stato hydration per SSR/CSR
  const [isHydrated, setIsHydrated] = useState(false);

  // Tracciamento duplicati toast: evita duplicati se showOnce=true, usa useRef per persistenza tra re-render
  const lastShownMessageRef = useRef<string | null>(null);

  /**
   * ANT DESIGN NOTIFICATION API
   *
   * Inizializza l'API di notifica di Ant Design con configurazione custom.
   *
   * @param api - Oggetto con metodi per mostrare notifiche (api.success, api.error, ecc.)
   * @param contextHolder - Element React che renderizza le notifiche
   *
   * CONFIGURAZIONE:
   * - stack.threshold: 3 = massimo 3 notifiche sovrapposte
   * - Altre opzioni: durata, posizione, stili personalizzati
   */
  const [api, contextHolder] = notification.useNotification({
    stack: {
      threshold: 3, // Massimo 3 notifiche contemporanee
    },
  });

  /**
   * HYDRATION EFFECT
   *
   * useEffect che si attiva solo una volta al mount del component.
   * Serve per segnalare che il component è pronto lato client.
   *
   * QUANDO SI ATTIVA:
   * - Primo render lato client (dopo SSR se presente)
   * - Array dependecies vuoto [] = solo al mount, mai ai re-render
   *
   * IMPORTANTE:
   * - Su server questo non si attiva mai
   * - Su client si attiva sempre al primo render
   * - Questo distingue server da client in modo affidabile
   */
  useEffect(() => {
    setIsHydrated(true); // Ora il component è pronto per notifiche
  }, []);

  /**
   * TOAST DISPLAY EFFECT
   *
   * useEffect principale che gestisce la visualizzazione delle notifiche.
   * Si attiva ogni volta che cambia toast, isHydrated, api o setToast.
   *
   * DEPENDENCIES SPIEGAZIONE:
   * - toast: si attiva quando arriva nuova notifica da mostrare
   * - isHydrated: evita di mostrare notifiche prima che client sia pronto
   * - api: se cambia istanza API (molto raro, ma buona pratica)
   * - setToast: per reset dell'atom dopo notifica mostrata
   *
   * LOGICA:
   * 1. Controllo preliminare: se toast è false o client non pronto, esci
   * 2. Anti-duplicazione: se showOnce=true e messaggio già mostrato, esci
   * 3. Mostra notifica con configurazione personalizzata
   * 4. Setup callback onClose per reset atom
   * 5. Se showOnce=true, salva messaggio come "già mostrato"
   */
  useEffect(() => {
    // EARLY RETURN: Se non c'è notifica da mostrare o client non pronto
    if (!toast || !isHydrated) return;

    // ANTI-DUPLICAZIONE: Evita messaggi ripetuti se showOnce è attivo
    if (toast.showOnce && toast.message === lastShownMessageRef.current) return;

    // MOSTRA NOTIFICA: Usa API Ant Design con configurazione da ToastPayload
    api.open({
      type: toast.type || 'info', // Tipo: success, error, warning, info
      message: toast.message, // Titolo principale
      description: toast.description || '', // Testo aggiuntivo
      duration: toast.duration ?? 3, // Durata in secondi (default 3)
      placement: toast.placement || 'bottomRight', // Posizione schermo
      onClose: () => {
        setToast(false); // Reset atom quando notifica si chiude
      },
    });

    // TRACCIAMENTO DUPLICATI: Salva messaggio se showOnce è attivo
    if (toast.showOnce) {
      lastShownMessageRef.current = toast.message;
    }
  }, [toast, isHydrated, api, setToast]);

  /**
   * RENDER COMPONENT
   *
   * Il component renderizza:
   * 1. {children} - Tutti i componenti child (layout, pages, ecc.)
   * 2. {isHydrated && contextHolder} - Sistema notifiche solo se client pronto
   *
   * CONDITIONAL RENDERING:
   * - contextHolder viene renderizzato solo dopo hydration
   * - Evita errori di mismatch SSR/CSR
   * - Assicura che notifiche funzionino solo lato client
   *
   * FRAGMENT:
   * - <> è shorthand per React.Fragment
   * - Evita di aggiungere DOM nodes inutili
   * - Mantiene pulita la struttura HTML
   */
  return (
    <>
      {children}
      {isHydrated && contextHolder}
    </>
  );
}
