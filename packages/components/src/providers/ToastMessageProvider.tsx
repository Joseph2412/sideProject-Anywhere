/**
 * TOAST MESSAGE PROVIDER
 *
 * Component che gestisce la visualizzazione delle notifiche toast in tutta l'applicazione.
 * Ascolta l'atom messageToast e mostra automaticamente le notifiche usando Ant Design.
 *
 * CONCETTI CHIAVE:
 * - PROVIDER PATTERN: Component wrapper che fornisce funzionalità a tutti i children
 * - GLOBAL NOTIFICATIONS: Sistema centralizzato per mostrare messaggi utente
 * - HYDRATION: Processo di "reidratazione" del client dopo server-side rendering
 * - ANTD NOTIFICATION: API di Ant Design per mostrare toast eleganti
 *
 * RESPONSABILITÀ:
 * 1. Ascolta cambiamenti nell'atom messageToast
 * 2. Converte ToastPayload in notifiche Ant Design
 * 3. Gestisce duplicazione messaggi con showOnce
 * 4. Assicura compatibilità SSR/CSR con hydration
 */

"use client"; // Indica che questo è un Client Component (Next.js 13+)

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { messageToast, ToastPayload } from "@repo/ui/store/ToastStore";
import { useAtom } from "jotai";
import { notification } from "antd";

/**
 * COMPONENT: MessageProvider
 *
 * Provider che wrappa l'intera applicazione per gestire notifiche toast globali.
 *
 * @param children - Tutti i componenti child che avranno accesso alle notifiche
 * @returns JSX element che renderizza children + notification system
 *
 * PATTERN PROVIDER:
 * - Si posiziona in alto nell'albero dei componenti
 * - Fornisce servizi a tutti i componenti discendenti
 * - Non modifica visualmente il layout, solo aggiunge funzionalità
 */
export function MessageProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  /**
   * JOTAI ATOM CONNECTION
   *
   * Collegamento bidirezionale con l'atom messageToast:
   * - toast: valore corrente dell'atom (ToastPayload | false)
   * - setToast: funzione per aggiornare l'atom
   *
   * QUANDO CAMBIA:
   * - Qualsiasi componente chiama setToast() con nuovi dati
   * - Questo useEffect si attiva automaticamente
   */
  const [toast, setToast] = useAtom<ToastPayload | false>(messageToast);

  /**
   * HYDRATION STATE
   *
   * Traccia se il component è stato "idratato" lato client.
   * Necessario per compatibilità SSR (Server-Side Rendering).
   *
   * PROBLEMA SSR:
   * - Server genera HTML senza JavaScript
   * - Client deve "reidratare" aggiungendo interattività
   * - Toast/notifiche richiedono JavaScript, non funzionano su server
   *
   * SOLUZIONE:
   * - Inizia false (server + primi render client)
   * - Diventa true dopo primo useEffect client
   * - Solo allora mostra notifiche
   */
  const [isHydrated, setIsHydrated] = useState(false);

  /**
   * DUPLICATE MESSAGE TRACKING
   *
   * useRef per tracciare l'ultimo messaggio mostrato.
   * Evita di mostrare lo stesso messaggio multiple volte quando showOnce=true.
   *
   * PERCHÉ useRef:
   * - Persiste tra re-render senza causarli
   * - Non fa parte dello stato del component
   * - Perfetto per valori "di servizio" come cache
   *
   * UTILIZZO:
   * - Salva il testo dell'ultimo messaggio mostrato
   * - Se showOnce=true e message è uguale, non mostra di nuovo
   */
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
      type: toast.type || "info", // Tipo: success, error, warning, info
      message: toast.message, // Titolo principale
      description: toast.description || "", // Testo aggiuntivo
      duration: toast.duration ?? 3, // Durata in secondi (default 3)
      placement: toast.placement || "bottomRight", // Posizione schermo
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
