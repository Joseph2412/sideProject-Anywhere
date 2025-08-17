import { Form, Checkbox, Row, Col, Card, Typography, Divider } from 'antd';
import { useEffect, useState } from 'react';
import { useSetAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/LayoutStore';
import { NotificationChannel, NotificationType } from './NotificationType';
import { NotificationGroups } from './NotificationGroups';
import { NotificationItems } from './NotificationItems';

type NotificationPreference = {
  [key in NotificationType]: {
    push: boolean;
    email: boolean;
  };
};
export const PreferencesForm = () => {
  const [form] = Form.useForm();

  const setMessage = useSetAtom(messageToast);

  const urlFetch = `${process.env.NEXT_PUBLIC_API_HOST}/user/preferences`; //Mi scocciava riscrivere sempre sta fetch de m****
  const token = localStorage.getItem('token'); //Ripeschiamo il Token

  const [formValues, setFormValues] = useState<NotificationPreference>(
    {} as NotificationPreference
  );
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Gestisce il toggle di massa per gruppi di preferenze
   * Pattern: forEach per aggiornamento bulk di multiple preferenze
   * Logica: clona state → modifica gruppo → salva immediatamente
   * Eccezione: push notifications non disponibili per alcune tipologie
   */
  // Gestione del CheckBox Master
  const handleGroupToggle = (
    groupItems: NotificationType[],
    channel: NotificationChannel,
    checked: boolean
  ) => {
    const updated = { ...formValues };

    groupItems.forEach(key => {
      if (channel === 'push' && key === 'booking_cancelled_due_to_low_participation') return;
      updated[key] = {
        ...updated[key],
        [channel]: checked,
      };
    });

    setFormValues(updated);

    fetch(urlFetch, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    }).catch(() => {
      setMessage({
        type: 'error',
        message: 'Salvataggio fallito',
        description: 'Preferenze Non Salvate',
        placement: 'bottomRight',
      });
    });
  };

  /**
   * useEffect per caricamento iniziale delle preferenze utente
   * Pattern: GET → normalizzazione dati → reduce per struttura predefinita
   * Normalizzazione: converte dati API in formato standardizzato con fallback
   * Reduce: crea oggetto completo anche per preferenze non ancora salvate
   */
  useEffect(() => {
    fetch(urlFetch, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Non Autorizzato');
        return res.json();
      })
      .then((data: { preferences: NotificationPreference } | null) => {
        const normalized = NotificationItems.reduce((acc, item) => {
          const saved = data?.preferences?.[item.key];
          acc[item.key] = {
            push: saved?.push ?? false,
            email: saved?.email ?? false,
          };
          return acc;
        }, {} as NotificationPreference);

        setFormValues(normalized);
      })
      .catch(() => {
        const fallback = NotificationItems.reduce((acc, item) => {
          acc[item.key] = { push: false, email: false };
          return acc;
        }, {} as NotificationPreference);

        setFormValues(fallback);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [token]);

  const handleCheckboxChange = async (
    type: NotificationType,
    channel: NotificationChannel,
    checked: boolean
  ) => {
    const updated = {
      ...formValues,
      [type]: {
        ...formValues[type],
        [channel]: checked,
      },
    };

    setFormValues(updated);

    // autosave subito dopo la modifica
    try {
      const res = await fetch(urlFetch, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Salvataggio Fallito');
    } catch (error) {
      console.error('Errore Nel Salvataggio delle preferenze', error);
      setMessage({
        type: 'error',
        message: 'Salvataggio fallito',
        description: 'Preferenze Non Salvate',
        placement: 'bottomRight',
      });
    }
  };

  const isDisabled = (key: NotificationType, channel: NotificationChannel) =>
    key === 'booking_cancelled_due_to_low_participation' && channel === 'push';

  if (isLoading) return null;

  return (
    <Form form={form}>
      <Card style={{ borderRadius: 8 }} bodyStyle={{ padding: 20 }}>
        {NotificationGroups.map((group, index) => (
          <div key={group.title}>
            {/* Titolo gruppo */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
              <Col>
                <Typography.Text strong>{group.title}</Typography.Text>
                <br />
                <Typography.Text>{group.description}</Typography.Text>
              </Col>
              <Col style={{ display: 'flex', gap: 12 }}>
                <Checkbox
                  checked={group.items
                    .filter(key => !isDisabled(key, 'push'))
                    .every(key => formValues?.[key]?.push === true)}
                  onChange={e => handleGroupToggle(group.items, 'push', e.target.checked)}
                >
                  Push
                </Checkbox>

                <Checkbox
                  checked={group.items
                    .filter(key => !isDisabled(key, 'email'))
                    //Al momento non serve ma se un domani aggiungessimo un campo su email che è disabled, logica già pronta
                    .every(key => formValues?.[key]?.email === true)}
                  onChange={e => handleGroupToggle(group.items, 'email', e.target.checked)}
                >
                  E-mail
                </Checkbox>
              </Col>
            </Row>

            {/* Lista notifiche */}
            {group.items.map(key => {
              const label = NotificationItems.find(item => item.key === key)?.label || key;
              return (
                <Row key={key} style={{ marginTop: 12, alignItems: 'center' }}>
                  <Col span={12}>{label}</Col>
                  <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <Checkbox
                      checked={formValues[key]?.push}
                      onChange={e => handleCheckboxChange(key, 'push', e.target.checked)}
                      disabled={key === 'booking_cancelled_due_to_low_participation'}
                    >
                      Push
                    </Checkbox>
                    <Checkbox
                      checked={formValues[key]?.email}
                      onChange={e => handleCheckboxChange(key, 'email', e.target.checked)}
                    >
                      E-mail
                    </Checkbox>
                  </Col>
                </Row>
              );
            })}

            {/* Divider tra gruppi */}
            {index < NotificationGroups.length - 1 && (
              <Divider style={{ marginTop: 24, marginBottom: 24 }} />
            )}
          </div>
        ))}
      </Card>
    </Form>
  );
};
