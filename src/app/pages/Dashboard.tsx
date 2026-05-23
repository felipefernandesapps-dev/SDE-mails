import { Card, Row, Col, Statistic, Tag, Space, Divider } from 'antd';
import { UserOutlined, MailOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

export default function Dashboard() {
  const proximosAniversarios = [
    { nome: 'João Silva', profissao: 'Médico', data: '15/05', dias: 2 },
    { nome: 'Maria Santos', profissao: 'Professora', data: '18/05', dias: 5 },
    { nome: 'Pedro Costa', profissao: 'Engenheiro', data: '20/05', dias: 7 },
  ];

  const ultimosDisparos = [
    { nome: 'Ana Paula', data: '12/05/2024 09:00', status: 'enviado' },
    { nome: 'Carlos Lima', data: '12/05/2024 09:02', status: 'enviado' },
    { nome: 'Beatriz Souza', data: '11/05/2024 09:00', status: 'falha' },
  ];

  return (
    <>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6} key="stat-total">
          <Card>
            <Statistic
              title="Total de E-mails"
              value={150}
              prefix={<MailOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6} key="stat-enviados">
          <Card>
            <Statistic
              title="Enviados com Sucesso"
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

      <Row gutter={16}>
        <Col xs={24} lg={12} key="card-aniversarios">
          <Card title="Próximos Aniversários (7 dias)" extra={<UserOutlined />}>
            <div>
              {proximosAniversarios.map((item, index) => (
                <div key={item.nome}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.nome}</div>
                      <div style={{ fontSize: '14px', color: '#666' }}>{item.profissao} • {item.data}</div>
                    </div>
                    <Tag color={item.dias === 0 ? 'red' : 'blue'}>
                      {item.dias === 0 ? 'Hoje!' : `${item.dias} dias`}
                    </Tag>
                  </div>
                  {index < proximosAniversarios.length - 1 && <Divider style={{ margin: 0 }} />}
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12} key="card-disparos">
          <Card title="Últimos Disparos" extra={<MailOutlined />}>
            <div>
              {ultimosDisparos.map((item, index) => (
                <div key={item.nome + item.data}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.nome}</div>
                      <div style={{ fontSize: '14px', color: '#666' }}>{item.data}</div>
                    </div>
                    <Tag color={item.status === 'enviado' ? 'success' : 'error'}>
                      {item.status}
                    </Tag>
                  </div>
                  {index < ultimosDisparos.length - 1 && <Divider style={{ margin: 0 }} />}
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
