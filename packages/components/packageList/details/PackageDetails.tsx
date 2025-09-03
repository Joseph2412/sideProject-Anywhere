import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

//Componete FORM DETTAGLI PACCHETTO

import { Form, Button, Space, Row, Col, Card, Select, Input, Switch, Popconfirm } from 'antd';

import { NibolInput } from '../../inputs/Input';
import { useState } from 'react';

// Jotai e store
import { useSetAtom } from 'jotai';
import { messageToast, Package } from '@repo/ui/store/LayoutStore';
import { PrimaryButton } from '../../buttons/PrimaryButton';
import { fetchPackagesAtom, packageFormAtom } from '@repo/ui/store/PackageFormStore';
import { useParams } from 'next/navigation';

export const PackageDetails = () => {
  const params = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const setMessage = useSetAtom(messageToast);
  const fetchPackages = useSetAtom(fetchPackagesAtom);
  const [details, setDetails] = useState<Package | null>(null);
  const router = useRouter();

  const setPackageForm = useSetAtom(packageFormAtom);
  const [popVisible, setPopVisible] = useState(false);

  // Solo fetch tramite id dai params
  useEffect(() => {
    const id = params?.id;
    if (id) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/packages/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setDetails(data);
          setPackageForm({
            name: data.name,
            type: data.type,
          });
          form.setFieldsValue({
            name: data.name,
            type: data.type === 'Sala' ? 'SALA' : data.type === 'Desk' ? 'DESK' : data.type,
            description: data.description,
            services: data.services,
            capacity: data.capacity,
            squareMetres: data.squareMetres,
            seats: data.seats,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [params, form, setPackageForm]);

  // Calcola direttamente il tipo selezionato dall'atomo
  const selectedType = details?.type ? (details.type.toLowerCase() as 'sala' | 'desk') : undefined;

  // Gestione submit del form per aggiornare i dati
  const handleFinish = async (values: Package) => {
    setLoading(true);
    const id = params?.id;
    const payload = { ...values, isActive: details?.isActive };
    try {
      let url = '';
      let method: 'POST' | 'PUT' = 'POST';
      let successMsg = '';
      if (id) {
        url = `${process.env.NEXT_PUBLIC_API_HOST}/api/packages/${id}`;
        method = 'PUT';
        successMsg = 'Pacchetto aggiornato!';
      } else {
        url = `${process.env.NEXT_PUBLIC_API_HOST}/api/packages/add`;
        method = 'POST';
        successMsg = 'Pacchetto aggiunto!';
      }
      // Forza POST se non c'è id (aggiunta)
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setDetails(data);
        setMessage({ type: 'success', message: successMsg });
        await fetchPackages();
      } else {
        setMessage({ type: 'error', message: 'Errore durante la richiesta' });
      }
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
      setMessage({ type: 'error', message: 'Errore durante la richiesta' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!details?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/packages/${details.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (res.ok) {
        setMessage({ type: 'success', message: 'Pacchetto eliminato!' });
        await fetchPackages();
        setPackageForm(null); // Resetta lo stato globale
        router.replace('/packages'); // Ti ributto su un packages Form Vuoto
      } else {
        setMessage({ type: 'error', message: 'Errore durante la richiesta' });
      }
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
      setMessage({ type: 'error', message: 'Errore durante la richiesta' });
    } finally {
      setLoading(false);
    }
  };

  const handleActiveChange = async (newIsActive: boolean) => {
    if (!details?.id) return;
    setLoading(true);
    try {
      const payload = { ...details, isActive: newIsActive };
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/packages/${details.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setDetails(data);
        setMessage({
          type: 'success',
          message: newIsActive ? 'Pacchetto attivato!' : 'Pacchetto disattivato!',
        });
        await fetchPackages();
      } else {
        setMessage({ type: 'error', message: 'Errore durante la richiesta' });
      }
    } catch (error) {
      console.error('Errore durante la richiesta:', error);
      setMessage({ type: 'error', message: 'Errore durante la richiesta' });
    } finally {
      setLoading(false);
    }
  };

  // Sincronizza i valori del form con details ogni volta che details cambia
  useEffect(() => {
    // Ogni volta che details cambia (es. da onValuesChange), aggiorna il form
    if (details) {
      form.setFieldsValue({
        name: details.name,
        type: details.type === 'Sala' ? 'SALA' : details.type === 'Desk' ? 'DESK' : details.type,
      });
    }
  }, [details, form]);

  const isDisabled = details?.isActive === false;

  // Helper DRY per le rules required
  const requiredRule = (message: string) => (isDisabled ? [] : [{ required: true, message }]);

  return (
    <Form
      layout="vertical"
      style={{ width: '100%', borderRadius: 8 }}
      form={form}
      requiredMark={false}
      validateTrigger="onSubmit"
      onValuesChange={(_, allValues) => {
        if (!details) return;
        setDetails({
          ...details,
          ...allValues,
          type: allValues.type ? (allValues.type as 'Sala' | 'Desk') : details.type,
        });
      }}
      onFinish={handleFinish}
    >
      <Card style={{ marginRight: 16 }}>
        <Form.Item label="Attivo">
          <Popconfirm
            title="Disattiva Pacchetto?"
            description="Una volta disattivato, tutte le prenotazioni future ricevute su questo pacchetto verranno cancellate e gli utenti riceveranno una notifica"
            placement="right"
            onConfirm={() => {
              if (!details) return;
              setDetails({ ...details, isActive: false });
              setPopVisible(false);
              handleActiveChange(false); // PATCH: invia subito al DB
            }}
            onCancel={() => setPopVisible(false)}
            okText="Si"
            cancelText="No"
            open={popVisible}
          >
            <Switch
              checked={details?.isActive}
              onClick={checked => {
                if (!details) return;
                if (checked) {
                  setDetails({ ...details, isActive: true });
                  handleActiveChange(true); // PATCH: invia subito al DB
                } else {
                  setPopVisible(true);
                }
              }}
            />
          </Popconfirm>
        </Form.Item>
        <Row style={{ gap: 16 }}>
          <Form.Item name="name" rules={requiredRule('Inserisci il Nome del Piano')}>
            <NibolInput
              validateTrigger="onSubmit"
              label="Nome del Piano"
              name="name"
              hideAsterisk={true}
              required={true}
              style={{ height: 32, width: '990px' }}
              disabled={isDisabled}
            />
          </Form.Item>

          <Form.Item name="type" rules={requiredRule('Specifica la Tipologia')} label="Tipologia">
            <Select
              style={{ width: '990px', height: 32 }}
              options={[
                { value: 'SALA', label: 'Sala' },
                { value: 'DESK', label: 'Desk' },
              ]}
              onChange={value => {
                if (value === 'desk') {
                  form.setFieldsValue({ seats: undefined });
                } else {
                  form.setFieldsValue({ capacity: undefined, squareMetres: undefined });
                }
              }}
              disabled={isDisabled}
            />
          </Form.Item>
        </Row>
        <Form.Item
          name="description"
          label="Descrizione"
          rules={requiredRule('Inserisci una descrizione')}
        >
          <Input.TextArea
            style={{ height: 32, width: '100%', minHeight: 100 }}
            disabled={isDisabled}
          />
        </Form.Item>
        <Form.Item name="services" label="Servizi">
          <Select mode="tags" style={{ height: 28, width: '100%' }} disabled={isDisabled} />
        </Form.Item>

        {selectedType === 'sala' && (
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="Capienza"
                rules={requiredRule('Inserisci la capienza')}
              >
                <Input type="number" min={1} style={{ width: 100 }} disabled={isDisabled} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="squareMetres"
                label="Metri Quadrati (m²)"
                rules={requiredRule('Inserisci i metri quadrati')}
              >
                <Input type="number" min={1} style={{ width: 100 }} disabled={isDisabled} />
              </Form.Item>
            </Col>
          </Row>
        )}

        {selectedType === 'desk' && (
          <Form.Item
            name="seats"
            label="Posti Disponibili"
            rules={requiredRule('Inserisci i posti disponibili')}
          >
            <Input type="number" min={1} style={{ width: 100 }} disabled={isDisabled} />
          </Form.Item>
        )}
        <Form.Item style={{ marginTop: 20 }}>
          <Space>
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields();
                form.setFieldsValue(details);
              }}
              disabled={loading}
            >
              Annulla
            </Button>
            <PrimaryButton type="primary" htmlType="submit" disabled={loading} loading={loading}>
              Salva
            </PrimaryButton>
          </Space>
        </Form.Item>
      </Card>
      <Card
        style={{
          marginTop: 16,
          marginRight: 16,
          padding: 0,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'left',
        }}
      >
        <Popconfirm
          title="Elimina Pacchetto?"
          description="Una volta eliminato, tutte le prenotazioni future ricevute su questo pacchetto verranno cancellate e gli utenti riceveranno una notifica"
          placement="right"
          onConfirm={handleDelete}
          okText="Si"
          cancelText="No"
        >
          <Button type="primary" danger disabled={loading || !details?.id} style={{ height: 32 }}>
            Elimina Pacchetto
          </Button>
        </Popconfirm>
      </Card>
    </Form>
  );
};
