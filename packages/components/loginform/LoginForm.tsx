// 'use client' - DIRETTIVA FONDAMENTALE DI NEXT.JS 13+
// Questa direttiva dice a Next.js che questo componente deve essere eseguito sul CLIENT (nel browser)
// Senza questa direttiva, Next.js cercherebbe di eseguirlo sul SERVER (durante il build)
// È necessaria perché usiamo:
// - useState (stato reattivo)
// - event handlers (onClick, onSubmit)
// - localStorage e document.cookie
// - API calls dal browser
"use client";

// IMPORTAZIONI DI LIBRERIE ESTERNE
// Ant Design - Libreria UI professionale con componenti pre-costruiti
import { Form, Button, Divider } from "antd";
// React hooks - strumenti per gestire stato e ciclo di vita del componente
import { useState } from "react";

// IMPORTAZIONI INTERNE AL PROGETTO
// CSS Modules - file CSS con scope locale (non si sovrappone ad altri stili)
import styles from "./LoginForm.module.css";
// Componenti custom del nostro design system
import { NibolInput } from "../inputs/Input";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { GoogleLoginButton } from "../buttons/GoogleLoginButton";
// Jotai - libreria per gestione stato globale (alternative: Redux, Zustand)
import { useSetAtom } from "jotai";
import { messageToast } from "@repo/ui/store/LayoutStore";

// TIPI TYPESCRIPT - DEFINISCONO LA STRUTTURA DEI DATI

// Questo tipo definisce ESATTAMENTE come deve essere strutturata la risposta del server
// quando un utente fa login con successo. TypeScript ci protegge da errori!
type LoginResponse = {
  message: string; // Messaggio di conferma dal server (es: "Login successful")
  token: string; // JWT token per autenticazione - stringa lunga e codificata
  user: {
    // Informazioni base dell'utente loggato
    id: number; // ID numerico univoco nel database
    name: string; // Nome dell'utente per UI personalizzata
    email: string; // Email per identificazione e comunicazioni
  };
};

// CONFIGURAZIONE ENDPOINT API
// Indirizzo del nostro backend Fastify che gira su porta 3001
// In produzione sarà sostituito con l'URL reale (es: https://api.nibol.com)
const endPoint = process.env.NEXT_PUBLIC_API_HOST;

/**
 * FUNZIONE DI AUTENTICAZIONE UTENTE
 *
 * COSA FA:
 * Questa funzione si collega al nostro backend Fastify per verificare se email e password
 * sono corrette. Se sì, il server ci restituisce un token JWT per accedere alle aree protette.
 *
 * COME FUNZIONA:
 * 1. Invia una richiesta POST al endpoint /auth/login
 * 2. Include email e password nel body della richiesta
 * 3. Il server controlla nel database se le credenziali sono valide
 * 4. Se valide, ritorna un token JWT + info utente
 * 5. Se invalide, ritorna un errore
 *
 * PERCHÉ ASYNC/AWAIT:
 * Le chiamate HTTP richiedono tempo (network latency). Con async/await possiamo
 * "aspettare" la risposta senza bloccare l'interfaccia utente.
 *
 * SICUREZZA:
 * - Usiamo HTTPS in produzione per crittografare i dati
 * - Il token JWT ha scadenza automatica
 * - credentials: 'include' permette l'invio di cookie per sessioni
 *
 * @param email - Email inserita dall'utente nel form di login
 * @param password - Password inserita dall'utente (sarà hashata dal backend)
 * @returns Promise<LoginResponse> - Promessa che si risolve con i dati utente e token
 * @throws Error - Se credenziali invalide o problemi server/network
 */
const userLogin = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  // CHIAMATA HTTP POST al nostro backend
  const res = await fetch(endPoint + "/auth/login", {
    method: "POST", // POST perché stiamo inviando dati sensibili
    headers: {
      "Content-Type": "application/json", // Diciamo al server che inviamo JSON
    },
    credentials: "include", // Include cookie per gestione sessioni cross-origin
    body: JSON.stringify({ email, password }), // Converte oggetto JS in stringa JSON
  });

  //  Parsing della risposta JSON del server
  const data = await res.json();

  // GESTIONE ERRORI HTTP
  // res.ok è false per status codes 400-500 (errori client/server)
  if (!res.ok) {
    // Lancia un errore con il messaggio specifico dal server
    // || serve come "fallback" se il server non specifica il messaggio
    throw new Error(data.message || data.error);
  }

  // SUCCESS - ritorna i dati per il componente
  return data;
};

// PROPS DEL COMPONENTE - INTERFACCIA DI COMUNICAZIONE
// Definisce quali "parametri" può ricevere il nostro componente LoginForm
// Sono tutte OPZIONALI (? significa optional)
type Props = {
  // Callback per successo login - funzione che viene chiamata quando login va a buon fine
  // Il componente padre può passare questa funzione per sapere quando l'utente è loggato
  // Riceve il nome utente per personalizzare l'UI (es: "Benvenuto Mario!")
  onLoginSuccess?: (user: { name: string }) => void;

  // Callback per navigazione signup - funzione per passare alla registrazione
  // Permette al componente padre di gestire il cambio di vista/pagina
  onGoToSignup?: () => void;
};

/**
 * COMPONENTE LOGINFORM - IL CUORE DELL'AUTENTICAZIONE
 *
 * ARCHITETTURA:
 * Questo è un componente React funzionale che gestisce tutto il processo di login.
 * Combina UI (form, input, bottoni) con logica (validazione, API calls, gestione errori).
 *
 * RESPONSABILITÀ:
 * - Raccogliere email e password dall'utente
 * - Validare i dati inseriti (formato email, campi obbligatori)
 * - Comunicare con il backend per autenticazione
 * - Salvare il token di autenticazione (localStorage + cookie)
 * - Verificare l'accesso alle aree protette
 * - Mostrare feedback all'utente (successo/errore)
 * - Gestire il reset password
 *
 * STATO INTERNO:
 * - form: istanza del form Ant Design per validazione
 * - loading: boolean per mostrare spinner durante operazioni async
 * - setMessage: funzione per mostrare notifiche toast globali
 *
 * INTEGRAZIONE:
 * - Si connette al ToastStore per notifiche globali
 * - Comunica con il backend Fastify per autenticazione
 * - Salva dati in localStorage e cookie per persistenza
 * - Informa il componente padre tramite callback
 */
const LoginForm: React.FC<Props> = ({ onLoginSuccess, onGoToSignup }) => {
  // FORM MANAGEMENT con Ant Design
  // useForm() crea un'istanza del form con validazione e gestione dati integrata
  // Ant Design gestisce automaticamente validazione, errori, reset, etc.
  const [form] = Form.useForm();

  // LOADING STATE per UX
  // useState hook di React per gestire stato locale del componente
  // loading=true mostra spinner e disabilita form durante API calls
  // Previene doppi click e migliora esperienza utente
  const [loading, setLoading] = useState(false);

  // TOAST NOTIFICATIONS
  // useSetAtom di Jotai per accedere al sistema di notifiche globali
  // setMessage permette di mostrare toast in qualunque punto dell'app
  // Connesso al ToastStore che abbiamo documentato prima
  const setMessage = useSetAtom(messageToast);

  /**
   * HANDLER PRINCIPALE DEL LOGIN - IL FLUSSO COMPLETO
   *
   * QUESTO È IL CUORE DEL PROCESSO DI AUTENTICAZIONE!
   *
   * FLUSSO STEP-BY-STEP:
   * 1. Attiva loading (spinner + disabilita form)
   * 2. Valida i campi del form (email formato valido, password non vuota)
   * 3. Chiama API backend per verificare credenziali
   * 4. Salva token JWT in localStorage E cookie (doppia sicurezza)
   * 5. Testa accesso area protetta per confermare validità token
   * 6. Mostra notifica successo e informa componente padre
   * 7. In caso di errore, mostra messaggio specifico sull'input
   * 8. Disattiva loading in ogni caso (finally)
   *
   * PERCHÉ DOPPIO STORAGE (localStorage + cookie):
   * - localStorage: accessibile da JavaScript per API calls
   * - Cookie: automaticamente incluso nelle richieste HTTP
   *
   * PATTERN TRY/CATCH/FINALLY:
   * - try: logica principale che può fallire
   * - catch: gestione errori specifici
   * - finally: cleanup che deve sempre essere eseguito
   *
   * VALIDAZIONE FORM:
   * validateFields() di Ant Design controlla tutti i rules definiti nei NibolInput
   * Se fallisce, lancia un'eccezione e interrompe il flusso
   *
   * SICUREZZA:
   * - Verifichiamo sempre che il token funzioni prima di dichiarare successo
   * - Errori non espongono informazioni sensibili
   * - Token ha scadenza automatica (gestita dal backend)
   */
  const handleLogin = async () => {
    try {
      // STEP 1: Attiva stato loading per feedback utente
      setLoading(true);

      // STEP 2: Validazione form con regole definite nei componenti
      // Se validazione fallisce, lancia eccezione e va direttamente al catch
      const values = await form.validateFields(); // estrae { email, password }

      // STEP 3: Autenticazione tramite API backend
      const response = await userLogin(values.email, values.password);

      // STEP 4: Salvataggio token per richieste future
      // localStorage - accessibile da JavaScript per header Authorization
      localStorage.setItem("token", response.token);
      // Cookie - incluso automaticamente nelle richieste HTTP
      document.cookie = `token=${response.token}; path=/`;

      // STEP 5: Verifica accesso area protetta per validare token
      // Questo assicura che il token funzioni prima di dichiarare successo
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/user/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${response.token}`, // Standard JWT authentication
          },
        },
      );

      // Parsing risposta della verifica accesso
      const userData = await res.json();

      // Se verifica accesso fallisce, trattiamo come errore login
      if (!res.ok) {
        throw new Error(userData.message || userData.error || "Accesso Negato");
      }

      // STEP 6: SUCCESS - Login completato con successo!
      // Mostra notifica toast di successo all'utente
      setMessage({
        type: "success",
        message: "Login effettuato!",
        description: "Accesso Area Personale OK",
        duration: 3, // secondi di visualizzazione
        placement: "bottomRight", // posizione toast
      });

      //  Informa il componente padre che login è riuscito
      // onLoginSuccess è opzionale (?.) - chiamata solo se funzione passata
      onLoginSuccess?.({ name: response.user.name });
    } catch (err) {
      // GESTIONE ERRORI - Mostra messaggio specifico all'utente
      if (err instanceof Error) {
        // Imposta errore sul campo password del form
        // L'utente vedrà il messaggio di errore sotto l'input password
        form.setFields([
          {
            name: "password", // Campo specifico dove mostrare l'errore
            errors: [err.message], // Array di messaggi di errore
          },
        ]);
      }
    } finally {
      // CLEANUP: Disattiva loading in OGNI caso (successo o errore)
      // finally viene sempre eseguito, garantendo UI consistency
      setLoading(false);
    }
  };

  /**
   * HANDLER RESET PASSWORD - FUNZIONALITÀ DI RECUPERO ACCOUNT
   *
   * COSA FA:
   * Permette agli utenti di recuperare l'accesso al proprio account quando
   * dimenticano la password. Invia email con link per creare nuova password.
   *
   * FLUSSO LOGICO:
   * 1. Valida SOLO il campo email (password non serve per reset)
   * 2. Invia richiesta al backend con l'email
   * 3. Backend cerca email nel database
   * 4. Se trovata, invia email con link temporaneo
   * 5. Mostra conferma all'utente
   * 6. Se email non esiste, mostra errore appropriato
   *
   * SICUREZZA:
   * - Non rivela se un'email esiste nel database (per privacy)
   * - Link di reset ha scadenza (gestita dal backend)
   * - Token temporaneo usa-e-getta
   *
   * UX PATTERNS:
   * - Valida email prima di inviare richiesta (evita chiamate inutili)
   * - Return early se validazione fallisce (non mostra toast di errore)
   * - Messaggio di successo incoraggia controllo SPAM
   * - Feedback specifico per diversi tipi di errore
   */
  const handleResetPassword = async () => {
    // STEP 1: Validazione email isolata
    let email: string;

    try {
      // Valida SOLO il campo email, ignora altri campi del form
      const values = await form.validateFields(["email"]);
      email = values.email;
    } catch {
      // EARLY RETURN: Se email non valida, fermati qui
      // NON mostrare toast di errore - Ant Design già evidenzia il campo
      // Questo previene spam di notifiche per validazione normale
      return;
    }

    try {
      // Attiva loading per feedback durante operazione
      setLoading(true);

      // STEP 2: Richiesta reset password al backend
      const res = await fetch(`${endPoint}/auth/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Invia solo email
      });

      // Parsing risposta server
      const data = await res.json();

      // STEP 3: Gestione errori (email non trovata, server down, etc.)
      if (!res.ok) {
        console.warn("Reset password fallita:", data); // Log per debugging
        setMessage({
          type: "error",
          message: "Errore durante il reset password",
          description:
            data.message || data.error || "Email non Presente in Database.",
          duration: 4, // Errori mostrati più a lungo per leggibilità
          placement: "bottomRight",
        });
        return; // Ferma esecuzione qui
      }

      // STEP 4: SUCCESS - Email inviata!
      setMessage({
        type: "success",
        message: "Email inviata!",
        description: `Abbiamo inviato una mail all'indirizzo ${email} con le istruzioni per resettare la tua Password. Controlla la SPAM per sicurezza!`,
        duration: 4, // Messaggio importante, mostrato più a lungo
        placement: "bottomRight",
      });
    } catch (err) {
      // STEP 5: Gestione errori di rete o parsing
      console.error("Errore Reset Password:", err);

      if (err instanceof Error) {
        setMessage({
          type: "error",
          message: "Errore durante l'invio dell'email",
          description: err.message,
          duration: 4,
          placement: "bottomRight",
        });
      }
    } finally {
      // CLEANUP: Sempre disattiva loading
      setLoading(false);
    }
  };

  // RENDERING - STRUTTURA VISUALE DEL COMPONENTE
  return (
    <>
      {/* CONTAINER PRINCIPALE - Centrato e responsive */}
      <div className={styles.container}>
        {/* CARD - Superficie elevata con bordi arrotondati per il form */}
        <div className={styles.card}>
          {/* LOGO AZIENDALE - Branding e identità visuale */}
          <img src="/logo.svg" alt="Nibol" className={styles.logo} />

          {/* DIVIDER - Separatore visuale tra logo e contenuto */}
          <Divider />

          {/* TITOLO - Messaggio chiaro dell'azione richiesta */}
          <div className={styles.title}>
            <b>Accedi per gestire il tuo locale su Nibol</b>
          </div>

          {/* FORM COMPONENT - Wrapper Ant Design per validazione automatica */}
          {/* layout="vertical" = label sopra input (più leggibile su mobile) */}
          <Form form={form} layout="vertical" style={{ width: "100%" }}>
            {/* INPUT EMAIL - Campo per identificazione utente */}
            <NibolInput
              validateTrigger="onSubmit" // Valida solo al submit, non ad ogni keystroke
              label="Email"
              name="email" // Nome del campo nel form object
              hideAsterisk={true} // Non mostra * rosso (design più pulito)
              required={false} // Required gestito dalle rules, non dall'attributo
              style={{ height: 32 }} // Altezza consistente con design system
              className={styles.input} // Stili custom dal CSS module
              rules={[
                // Regole di validazione Ant Design
                { required: true, message: "Inserisci la tua email" },
                { type: "email", message: "Email non valida" }, // Regex automatica email
              ]}
            />

            {/* INPUT PASSWORD - Campo per autenticazione */}
            <NibolInput
              validateTrigger="onSubmit"
              label="Password"
              name="password"
              hideAsterisk={true}
              className={styles.input}
              style={{ height: 32 }}
              rules={[{ required: true, message: "Inserisci la password" }]}
              password // Prop custom per mostrare/nascondere password
            />

            {/* FORM ACTIONS - Bottoni e opzioni alternative */}
            <Form.Item style={{ marginBottom: 12 }}>
              {/* BOTTONE LOGIN PRINCIPALE */}
              <PrimaryButton
                loading={loading} // Spinner durante API call
                disabled={loading} // Previene doppi click
                onClick={handleLogin} // Handler principale
                className={styles.primaryButton}
                text="Continua"
              />

              {/* SEPARATORE "OR" - Divide opzioni login */}
              <Divider
                plain // Stile semplice senza bordi
                className={styles.orDivider}
                style={{ marginTop: "0px", marginBottom: "8px" }}
              >
                OR
              </Divider>

              {/* GOOGLE LOGIN - Autenticazione alternativa OAuth */}
              <GoogleLoginButton
                className={styles.googleButton}
                disabled={loading} // Consistenza con bottone principale
              />
            </Form.Item>
          </Form>
        </div>

        {/* LINK AGGIUNTIVI - Azioni secondarie fuori dal form principale */}
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            flexDirection: "column", // Stack verticale
            alignItems: "center", // Centrati orizzontalmente
            gap: "0px", // Nessuno spazio tra bottoni per design compatto
          }}
        >
          {/* LINK REGISTRAZIONE - Per nuovi utenti */}
          <Button
            type="text" // Stile link, non bottone pieno
            onClick={onGoToSignup} // Callback per navigazione
            disabled={loading} // Consistenza durante operazioni
            className={`${styles.register} ${styles.registerWrapper}`} // Multi-class CSS modules
          >
            Non hai un account? Registrati
          </Button>

          {/* LINK RESET PASSWORD - Per recupero account */}
          <Button
            type="text"
            onClick={handleResetPassword} // Handler reset password
            disabled={loading}
            className={`${styles.register} ${styles.registerWrapper}`}
            style={{ marginTop: 4 }} // Piccolo spazio per separazione visuale
          >
            Reimposta password
          </Button>
        </div>
      </div>
    </>
  );
};

// EXPORT DEFAULT - Rende il componente disponibile per importazione
// Altri file possono fare: import LoginForm from './LoginForm'
export default LoginForm;
