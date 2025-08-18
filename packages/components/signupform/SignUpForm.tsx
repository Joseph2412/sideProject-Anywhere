// 'use client' - COMPONENTE LATO CLIENT
// Stesso pattern del LoginForm - questo componente deve girare nel browser
// perché usa state, event handlers, e API calls
"use client";

// IMPORTAZIONI ESTERNE
// Ant Design - Componenti UI professionali per form e validazione
import { Form, Checkbox, Divider, App, Button } from "antd";
// React hooks per gestione stato
import { useState } from "react";
import React from "react";

// IMPORTAZIONI INTERNE
// Design system custom e stili
import { NibolInput } from "../inputs/Input";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { GoogleLoginButton } from "../buttons/GoogleLoginButton";
import styles from "./SignUpForm.module.css";

// TIPI TYPESCRIPT - CONTRATTI DATI PER REGISTRAZIONE

// PAYLOAD che inviamo al backend per creare nuovo utente
// Questo è il formato ESATTO che il nostro backend Fastify si aspetta
type SignupPayload = {
  firstName: string; // Nome dell'utente (validazione required nel form)
  lastName: string; // Cognome dell'utente (validazione required nel form)
  email: string; // Email unica nel sistema (validazione email + required)
  password: string; // Password hashata dal backend (validazione regex complessa)
  role: "HOST"; // Ruolo fisso - tutti i nuovi utenti sono gestori di locali
};

//  RESPONSE che riceviamo dal backend dopo registrazione riuscita
// Il backend ci conferma l'avvenuta creazione con questi dati
type SignupResponse = {
  message: string; // Messaggio di conferma (es: "User created successfully")
  user: {
    // Dati essenziali del nuovo utente creato
    id: number; // ID autogenerato dal database (primary key)
    name: string; // Nome completo (firstName + lastName combinati)
    email: string; // Email confermata e salvata
    role: "HOST"; // Ruolo assegnato (sempre HOST per nuove registrazioni)
  };
};

/**
 * FUNZIONE REGISTRAZIONE UTENTE - CREA NUOVO ACCOUNT NEL SISTEMA
 *
 * RESPONSABILITÀ:
 * Questa funzione gestisce l'intero processo di creazione di un nuovo account utente.
 * Comunica con il nostro backend Fastify per salvare i dati nel database.
 *
 * PROCESSO BACKEND (cosa succede dall'altra parte):
 * 1. Backend riceve i dati e valida il formato
 * 2. Controlla che l'email non sia già registrata
 * 3. Cripta la password con algoritmo sicuro (bcrypt)
 * 4. Salva tutti i dati nel database PostgreSQL
 * 5. Restituisce conferma con ID del nuovo utente
 *
 * SICUREZZA:
 * - Password mai inviata in chiaro (HTTPS in produzione)
 * - Backend valida tutti i campi server-side
 * - Email deve essere unica nel sistema
 * - Role hardcoded per prevenire privilege escalation
 *
 * GESTIONE ERRORI:
 * - Email già esistente → errore specifico
 * - Dati invalidi → errore di validazione
 * - Problemi server → errore generico
 * - Network issues → errore di connessione
 *
 * @param payload - Dati completi per la registrazione (nome, cognome, email, password, role)
 * @returns Promise<SignupResponse> - Conferma registrazione con ID nuovo utente
 * @throws Error - Se registrazione fallisce per qualsiasi motivo
 */
const userSignup = async (payload: SignupPayload): Promise<SignupResponse> => {
  // Chiamata HTTP POST al endpoint di registrazione
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/auth/signup`, {
    method: "POST", // POST per inviare dati sensibili
    headers: {
      "Content-Type": "application/json", // Specifica formato dati JSON
    },
    credentials: "include", // Include cookie per sessioni future
    body: JSON.stringify(payload), // Serializza oggetto JavaScript in JSON
  });

  // Parsing risposta del server
  const data = await res.json();

  // Controllo errori HTTP (status 400-500)
  if (!res.ok) {
    // Lancia errore con messaggio specifico dal backend
    // Ordine di priorità: error → message → fallback generico
    throw new Error(data.error || data.message || "Errore nella registrazione");
  }

  // Ritorna dati di successo al componente
  return data;
};

// PROPS E TIPI DEL COMPONENTE

// Props che il componente può ricevere dal componente padre
type SignUpFormProps = {
  // Callback opzionale per tornare al login dopo registrazione riuscita
  onGoToLogin?: () => void;
};

// STRUTTURA DATI DEL FORM - Come Ant Design organizza i valori
// Questo tipo rappresenta ESATTAMENTE i campi del nostro form HTML
type FormValues = {
  firstName: string; // Input nome utente
  lastName: string; // Input cognome utente
  email: string; // Input email con validazione formato
  password: string; // Input password con validazione regex complessa
  terms: boolean; // Checkbox accettazione termini (obbligatorio)
};

/**
 * COMPONENTE SIGNUPFORM - REGISTRAZIONE NUOVI UTENTI
 *
 * SCOPO:
 * Questo componente gestisce l'intero flusso di registrazione per nuovi utenti che
 * vogliono diventare gestori di locali sulla piattaforma Nibol.
 *
 * CARATTERISTICHE UNICHE rispetto al LoginForm:
 * - Raccoglie più dati (nome, cognome, email, password)
 * - Validazione password complessa (maiuscola, simbolo, numero, 8+ caratteri)
 * - Checkbox obbligatorio per termini e condizioni
 * - Layout a due colonne per nome/cognome (responsive design)
 * - Redirect automatico al login dopo registrazione
 *
 * INTEGRAZIONE BUSINESS:
 * - Tutti i nuovi utenti diventano HOST (gestori locali)
 * - Non esiste registrazione per ruoli diversi (admin, customer)
 * - Email deve essere unica in tutto il sistema
 * - Dopo registrazione, utente deve fare login separatamente
 *
 * UX PATTERNS:
 * - Form validation in real-time con Ant Design
 * - Disabled state durante operazioni async
 * - Success message + redirect automatico
 * - Error handling specifico per ogni tipo di errore
 * - Consistent styling con LoginForm
 */
const SignUpForm: React.FC<SignUpFormProps> = ({ onGoToLogin }) => {
  // SISTEMA NOTIFICHE - App.useApp() hook di Ant Design
  // Fornisce accesso al sistema di messaggi globali (diverso dai toast del LoginForm)
  // Questo approccio è più nuovo e preferito rispetto ai toast standalone
  const { message } = App.useApp();

  // LOADING STATE per UX durante operazioni async
  const [loading, setLoading] = useState(false);

  // FORM INSTANCE - Controller Ant Design per validazione e gestione dati
  const [form] = Form.useForm();

  /**
   * HANDLER SUBMIT REGISTRAZIONE - FLUSSO COMPLETO CREAZIONE ACCOUNT
   *
   * DIFFERENZE CHIAVE dal handleLogin:
   * - Non salva token (utente deve rifare login dopo registrazione)
   * - Trasforma FormValues in SignupPayload (aggiunge role forzato)
   * - Reset del form dopo successo
   * - Redirect automatico al login
   *
   * FLUSSO STEP-BY-STEP:
   * 1. Attiva loading state
   * 2. Log dei dati per debugging (DA RIMUOVERE IN PRODUZIONE!)
   * 3. Trasforma dati form in formato richiesto dal backend
   * 4. Chiamata API per creare account
   * 5. Reset form per sicurezza
   * 6. Mostra messaggio successo
   * 7. Redirect al login per fare accesso
   * 8. Gestione errori con messaggi specifici
   *
   * BUSINESS LOGIC:
   * - Role sempre forzato a 'HOST' (gestori locali)
   * - Non esiste registrazione per altri ruoli
   * - Dopo registrazione, nuovo utente deve fare login
   *
   * SICUREZZA:
   * - Dati validati sia client-side che server-side
   * - Password mai loggata o esposta
   * - Form reset previene residui in memoria
   *
   * @param values - Dati del form validati da Ant Design
   */
  const handleSubmit = async (values: FormValues) => {
    try {
      // Attiva stato loading per UX
      setLoading(true);

      // TRASFORMAZIONE DATI: FormValues → SignupPayload
      // Mappiamo i dati del form nel formato richiesto dal backend
      const payload: SignupPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: "HOST", // HARDCODED - Tutti i nuovi utenti sono gestori locali
      };

      // CHIAMATA API per registrazione
      await userSignup(payload);

      // RESET FORM per sicurezza e UX
      // Pulisce tutti i campi dopo registrazione riuscita
      form.resetFields();

      // FEEDBACK SUCCESSO all'utente
      message.success("Registrazione completata con successo!");

      // REDIRECT automatico al login
      // L'utente deve ora fare login con le credenziali appena create
      onGoToLogin?.(); // Chiamata opzionale al componente padre
    } catch (err) {
      // GESTIONE ERRORI specifici
      if (err instanceof Error) {
        // Mostra messaggio di errore con dettagli dal backend
        message.error(err.message || "Errore nella registrazione");
      }
    } finally {
      // CLEANUP: Disattiva loading in ogni caso
      setLoading(false);
    }
  };

  // RENDERING - STRUTTURA UI DEL FORM REGISTRAZIONE
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* BRANDING - Logo aziendale per identità visuale */}
        <img src="/Logo.svg" alt="Nibol" className={styles.logo} />
        <Divider />

        {/* TITOLO - Messaggio chiaro dell'azione (registrazione per gestori) */}
        <div className={styles.title}>
          <b>
            Crea un nuovo account
            <br />
            per il tuo locale
          </b>
        </div>

        {/* FORM PRINCIPALE - onFinish si attiva al submit del form */}
        {/* Ant Design gestisce automaticamente prevent default e validazione */}
        <Form
          form={form}
          layout="vertical"
          style={{ width: "100%" }}
          onFinish={handleSubmit} // Chiamato solo se validazione passa
        >
          {/* SEZIONE NOME/COGNOME - Layout a due colonne per ottimizzazione spazio */}
          <div className={styles.doubleInput}>
            {/* INPUT NOME */}
            <NibolInput
              label="Nome"
              name="firstName" // Nome campo nel form object
              className={styles.input}
              style={{ height: 32 }}
              rules={[{ required: true, message: "Inserisci il nome" }]}
              hideAsterisk={true} // Design pulito senza asterisco rosso
            />
            {/* INPUT COGNOME */}
            <NibolInput
              label="Cognome"
              name="lastName"
              className={styles.input}
              style={{ height: 32 }}
              rules={[{ required: true, message: "Inserisci il cognome" }]}
              hideAsterisk={true}
            />
          </div>

          {/* INPUT EMAIL - Con validazione formato automatica */}
          <NibolInput
            label="Email"
            name="email"
            style={{ height: 32 }}
            className={styles.input}
            rules={[
              { required: true, message: "Inserisci la tua email" },
              { type: "email", message: "Email non valida" }, // Regex automatica Ant Design
            ]}
            hideAsterisk={true}
          />

          {/* INPUT PASSWORD - Con validazione complessa custom */}
          <NibolInput
            label="Password"
            name="password"
            style={{ height: 32 }}
            className={styles.input}
            password // Mostra/nascondi password
            hideAsterisk={true}
            rules={[
              { required: true, message: "Inserisci una password" },
              {
                // REGEX COMPLESSA per password sicura
                // (?=.*[A-Z]) = almeno una maiuscola
                // (?=.*[a-z]) = almeno una minuscola
                // (?=.*\d) = almeno un numero
                // (?=.*[^\w\s]) = almeno un simbolo
                // .{8,} = minimo 8 caratteri
                pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
                message:
                  "Password non valida, almeno 8 caratteri, 1 maiuscola, 1 simbolo e 1 numero.",
              },
            ]}
          />

          {/* HINT PASSWORD - Guida utente per requisiti */}
          <div className={styles.passwordNote}>
            Almeno 8 caratteri, 1 maiuscola, 1 simbolo e 1 numero.
          </div>

          {/* CHECKBOX TERMINI - Campo obbligatorio con link legali */}
          <Form.Item
            name="terms"
            valuePropName="checked" // Ant Design: usa 'checked' invece di 'value' per checkbox
            rules={[
              {
                required: true,
                message: "Devi accettare i termini per continuare.",
              },
            ]}
          >
            <Checkbox className={styles.checkboxText}>
              Creando un account, accetto le{" "}
              <a href="#" className={styles.link}>
                Condizioni di Servizio – Locale
              </a>{" "}
              e la{" "}
              <a href="#" className={styles.link}>
                Privacy Policy
              </a>
              .
            </Checkbox>
          </Form.Item>

          {/* BOTTONE SUBMIT - Trigger del form con loading state */}
          <Form.Item>
            <PrimaryButton
              text="Crea account"
              htmlType="submit" // Tipo HTML per trigger form submit
              loading={loading} // Spinner durante API call
              disabled={loading} // Previene doppi click
              style={{ height: 32, marginTop: 10, width: "100%" }}
            />
          </Form.Item>
        </Form>

        {/* SEPARATORE "OR" per opzioni alternative */}
        <Divider plain className={styles.orDivider}>
          OR
        </Divider>

        {/* GOOGLE SIGNUP - Registrazione OAuth alternativa */}
        <GoogleLoginButton style={{ height: 32, width: 380 }} />
      </div>

      {/* LINK LOGIN - Per utenti che hanno già account */}
      <div
        style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}
      >
        <Button
          type="text" // Stile link
          onClick={onGoToLogin} // Callback navigazione
          disabled={loading} // Consistenza durante operazioni
          className={`${styles.register} ${styles.registerWrapper}`}
        >
          Sei già Registrato? Accedi!
        </Button>
      </div>
    </div>
  );
};

// EXPORT DEFAULT - Esporta il componente per uso in altre parti dell'app
export default SignUpForm;
