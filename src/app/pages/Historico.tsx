import { Table, Tag, DatePicker, Select, Space, Card, Row, Col, Statistic } from 'antd';
import { MailOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface HistoricoItem {
  id: number;
  dataDisparo: string;
  destinatario: string;
  email: string;
  tipo: string;
  status: string;
  erro?: string;
}

export default function Historico() {
  const data: HistoricoItem[] = [
    {
      id: 1,
      dataDisparo: '2024-05-12 09:00',
      destinatario: 'João Silva',
      email: 'joao@example.com',
      tipo: 'aniversario',
      status: 'enviado'
    },
    {
      id: 2,
      dataDisparo: '2024-05-12 09:02',
      destinatario: 'Maria Santos',
      email: 'maria@example.com',
      tipo: 'profissao',
      status: 'enviado'
    },
    {
      id: 3,
      dataDisparo: '2024-05-11 09:00',
      destinatario: 'Pedro Costa',
      email: 'pedro@example.com',
      tipo: 'aniversario',
      status: 'falha',
      erro: 'Conexão SMTP recusada'
    },
  ];

  const getStatusTag = (status: string) => {
    const config = {
      enviado: { color: 'success', text: 'Enviado' },
      falha: { color: 'error', text: 'Falha' },
      pendente: { color: 'warning', text: 'Pendente' }
    };
    const s = config[status as keyof typeof config] || { color: 'default', text: status };
    return <Tag color={s.color}>{s.text}</Tag>;
  };

  const columns = [
    {
      title: 'Data/Hora',
      dataIndex: 'dataDisparo',
      key: 'dataDisparo',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Destinatário',
      dataIndex: 'destinatario',
      key: 'destinatario',
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      render: (tipo: string) => (
        <Tag color={tipo === 'aniversario' ? 'blue' : 'green'}>
          {tipo === 'aniversario' ? 'Aniversário' : 'Profissão'}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Erro',
      dataIndex: 'erro',
      key: 'erro',
      render: (erro?: string) => erro ? (
        <span style={{ color: 'red', fontSize: '12px' }}>{erro}</span>
      ) : '-',
    },
  ];

  return (
    <>
      <h1 style={{ marginBottom: 24 }}>Histórico de Disparos</h1>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6} key="stat-total">
          <Card>
            <Statistic
              title="Total"
              value={150}
              prefix={<MailOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} key="stat-enviados">
          <Card>
            <Statistic
              title="Enviados"
              value={145}
              prefix={<CheckCircleOutlined />}
              styles={{ content: { color: '#3f8600' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} key="stat-falhas">
          <Card>
            <Statistic
              title="Falhas"
              value={3}
              prefix={<CloseCircleOutlined />}
              styles={{ content: { color: '#cf1322' } }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} key="stat-sucesso">
          <Card>
            <Statistic
              title="Taxa de Sucesso"
              value={96.67}
              suffix="%"
              precision={2}
              styles={{ content: { color: '#3f8600' } }}
            />
          </Card>
        </Col>
      </Row>

      <Space style={{ marginBottom: 16 }} wrap>
        <RangePicker format="DD/MM/YYYY" placeholder={['Data inicial', 'Data final']} />
        <Select placeholder="Filtrar por status" style={{ width: 200 }} allowClear>
          <Select.Option value="enviado">Enviado</Select.Option>
          <Select.Option value="falha">Falha</Select.Option>
          <Select.Option value="pendente">Pendente</Select.Option>
        </Select>
      </Space>

      <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 20 }} />
    </>
  );
}
