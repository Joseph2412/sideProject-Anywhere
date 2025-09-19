import React, { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Select,
  Space,
  Tag,
  Button,
  DatePicker,
  Row,
  Col,
  Tooltip,
  Avatar,
  message,
  Spin,
} from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  CalendarOutlined,
  UserOutlined,
  ClockCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useVenueBookings, useDeleteBooking } from '@repo/hooks';
import { useVenues } from '@repo/hooks';
import dayjs from 'dayjs';
import type { BookingData } from '@repo/hooks';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface VenueBookingsHistoryProps {
  venueId?: number;
}

export const BookingsForm: React.FC<VenueBookingsHistoryProps> = ({ venueId: propVenueId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // Ottieni venue ID dal contesto se non fornito
  const { data: venueData } = useVenues();

  // Debug per capire la struttura dei dati venue
  console.log('🏢 VenueData structure:', venueData);
  console.log('🏢 VenueData venues:', venueData?.venues);
  console.log('🏢 VenueData venue from venues:', venueData?.venues?.venue);

  // Fix: Assicurati di estrarre l'ID numerico dall'oggetto venue
  const currentVenueId = propVenueId || venueData?.venues?.venue?.id;

  console.log('🏢 Final currentVenueId (should be number):', currentVenueId);

  // Hook per le prenotazioni con filtri
  console.log('BookingsForm - Before hook call:');
  console.log('currentVenueId:', currentVenueId);
  console.log('statusFilter:', statusFilter);
  console.log('currentPage:', currentPage);
  console.log('pageSize:', pageSize);
  console.log('dateRange:', dateRange);
  const {
    data: bookingsData,
    isLoading,
    error,
    refetch,
  } = useVenueBookings(currentVenueId, {
    status: statusFilter || undefined,
    page: currentPage,
    pageSize,
    startDate: dateRange?.[0]?.format('YYYY-MM-DD'),
    endDate: dateRange?.[1]?.format('YYYY-MM-DD'),
  });

  // ✅ SICURO: Disabilita hook se currentVenueId non è disponibile
  // const isHookDisabled = !currentVenueId;

  // Hook per eliminare prenotazioni
  const deleteBookingMutation = useDeleteBooking();

  // Aggiorna la pagina quando cambiano i filtri
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateRange]);

  // ✅ SICURO: Handler per date range con validazione
  const handleDateRangeChange = (dates: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    if (!dates || !dates[0] || !dates[1]) {
      setDateRange(null);
      return;
    }
    setDateRange([dates[0], dates[1]]);
  };

  const handleDelete = async (booking: BookingData) => {
    try {
      await deleteBookingMutation.mutateAsync(booking.id);
      message.success('Prenotazione eliminata con successo');
      refetch();
    } catch (error) {
      console.error('Errore nella cancellazione:', error);
      message.error("Errore durante l'eliminazione della prenotazione");
    }
  };

  const handleViewDetails = (booking: BookingData) => {
    // TODO: Implementare modal o navigazione per dettagli prenotazione
    message.info(`Dettagli prenotazione #${booking.id} - Feature in sviluppo`);
  };

  const handleRefresh = () => {
    refetch();
    message.success('Dati aggiornati');
  };

  const handleExportCSV = () => {
    // TODO: Implementare export CSV
    message.info('Export CSV - Feature in sviluppo');
  };

  // ✅ SICURO: Calcola statistiche dalle prenotazioni reali con fallback
  const calculateStats = () => {
    const bookings = bookingsData?.bookings || [];
    const stats = {
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
      pending: bookings.filter(b => b.status === 'PENDING').length,
      confirmed: bookings.filter(b => b.status === 'CONFIRMED').length,
      totalRevenue:
        bookings
          .filter(b => b.status === 'COMPLETED' && typeof b.price === 'number')
          .reduce((sum, b) => sum + (b.price || 0), 0) || 0, // ✅ Fallback a 0
    };
    return stats;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'cancelled':
        return 'red';
      case 'completed':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'Confermata';
      case 'pending':
        return 'In attesa';
      case 'cancelled':
        return 'Cancellata';
      case 'completed':
        return 'Completata';
      default:
        return status;
    }
  };

  const stats = calculateStats();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (id: number) => <span style={{ fontWeight: 'bold', color: '#1890ff' }}>#{id}</span>,
    },
    {
      title: 'Cliente',
      key: 'customer',
      width: 200,
      render: (record: BookingData) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{record.costumerName}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.costumerEmail}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Servizio',
      key: 'service',
      width: 180,
      render: (record: BookingData) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#262626' }}>{record.package?.name}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: 2 }}>
            {record.package?.name}
          </div>
        </div>
      ),
    },
    {
      title: 'Data & Ora',
      key: 'datetime',
      width: 160,
      render: (record: BookingData) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <CalendarOutlined style={{ color: '#1890ff', fontSize: '12px' }} />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>
              {dayjs(record.start).format('DD/MM/YYYY')}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <ClockCircleOutlined style={{ color: '#52c41a', fontSize: '12px' }} />
            <span style={{ fontSize: '12px', color: '#666' }}>
              {record.start} - {record.end}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Durata',
      key: 'duration',
      width: 100,
      render: (record: BookingData) => {
        const start = dayjs(`2024-01-01 ${record.start}`);
        const end = dayjs(`2024-01-01 ${record.end}`);
        const duration = end.diff(start, 'hour', true);
        return (
          <Tag color="cyan" style={{ fontSize: '12px' }}>
            {duration}h
          </Tag>
        );
      },
    },
    {
      title: 'Prezzo',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (price: number) => (
        <span style={{ fontWeight: 'bold', color: '#52c41a', fontSize: '16px' }}>
          €{price?.toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Stato',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag
          color={getStatusColor(status)}
          style={{
            borderRadius: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            fontSize: '11px',
          }}
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Azioni',
      key: 'actions',
      width: 100,
      render: (record: BookingData) => (
        <Space>
          <Tooltip title="Visualizza dettagli">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              style={{ color: '#1890ff' }}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Tooltip title="Elimina prenotazione">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
              size="small"
              disabled={record.status === 'COMPLETED'}
              loading={deleteBookingMutation.isPending}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Gestione stati di errore e caricamento
  if (error) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#ff4d4f', marginBottom: 16 }}>
            Errore nel caricamento delle prenotazioni
          </p>
          <Button type="primary" onClick={handleRefresh} icon={<ReloadOutlined />}>
            Riprova
          </Button>
        </div>
      </Card>
    );
  }

  if (!currentVenueId) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Nessun venue selezionato</p>
        </div>
      </Card>
    );
  }

  return (
    <Spin spinning={isLoading}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarOutlined style={{ color: '#1890ff' }} />
            <span>Storico Prenotazioni</span>
          </div>
        }
        style={{ width: '100%' }}
        bodyStyle={{ padding: '16px' }}
        extra={
          <Button type="text" icon={<ReloadOutlined />} onClick={handleRefresh} loading={isLoading}>
            Aggiorna
          </Button>
        }
      >
        {/* Header con statistiche reali */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={6}>
            <Card size="small" style={{ textAlign: 'center', background: '#f6ffed' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {stats.completed}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Completate</div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small" style={{ textAlign: 'center', background: '#fff7e6' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                {stats.pending}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>In attesa</div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small" style={{ textAlign: 'center', background: '#f6ffed' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {stats.confirmed}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Confermate</div>
            </Card>
          </Col>
          <Col xs={24} sm={6}>
            <Card size="small" style={{ textAlign: 'center', background: '#e6f7ff' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                €{stats.totalRevenue.toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>Ricavo totale</div>
            </Card>
          </Col>
        </Row>

        {/* Filtri */}
        <Card size="small" style={{ marginBottom: 16, background: '#fafafa' }}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8} md={6}>
              <Select
                placeholder="Filtra per stato"
                style={{ width: '100%' }}
                value={statusFilter}
                onChange={setStatusFilter}
                allowClear
              >
                <Option value="">Tutti gli stati</Option>
                <Option value="pending">In attesa</Option>
                <Option value="confirmed">Confermata</Option>
                <Option value="completed">Completata</Option>
                <Option value="cancelled">Cancellata</Option>
              </Select>
            </Col>
            <Col xs={24} sm={12} md={10}>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={handleDateRangeChange}
                placeholder={['Data inizio', 'Data fine']}
                format="DD/MM/YYYY"
              />
            </Col>
            <Col xs={24} sm={8} md={4}>
              <Select value={pageSize} onChange={setPageSize} style={{ width: '100%' }}>
                <Option value={10}>10 per pagina</Option>
                <Option value={25}>25 per pagina</Option>
                <Option value={50}>50 per pagina</Option>
              </Select>
            </Col>
            <Col xs={24} sm={8} md={4}>
              <Button type="primary" block onClick={handleExportCSV}>
                Esporta CSV
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Tabella con dati reali */}
        <Table
          columns={columns}
          dataSource={bookingsData?.bookings || []}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: currentPage,
            pageSize,
            total: bookingsData?.total || 0,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} di ${total} prenotazioni`,
            onChange: setCurrentPage,
          }}
          scroll={{ x: 1000 }}
          size="small"
          rowClassName={(record: BookingData) => {
            if (record.status === 'PENDING') return 'pending-row';
            if (record.status === 'CANCELLED') return 'cancelled-row';
            return '';
          }}
        />

        {/* Messaggio quando non ci sono prenotazioni */}
        {!isLoading && (!bookingsData?.bookings || bookingsData.bookings.length === 0) && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <CalendarOutlined
              style={{ fontSize: '48px', marginBottom: '16px', color: '#d9d9d9' }}
            />
            <p>Nessuna prenotazione trovata</p>
            {(statusFilter || dateRange) && (
              <Button
                type="link"
                onClick={() => {
                  setStatusFilter('');
                  setDateRange(null);
                }}
              >
                Rimuovi filtri
              </Button>
            )}
          </div>
        )}
      </Card>
    </Spin>
  );
};

export default BookingsForm;
