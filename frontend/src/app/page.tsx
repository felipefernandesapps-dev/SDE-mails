'use client';

import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Spin } from 'antd';
import { UserOutlined, MailOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import MainLayout from '@/components/MainLayout';
import api from '@/services/api';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { Destinatario, HistoricoDisparo, Stats } from '@/types';

dayjs.locale('pt-br');

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [proximosAniversarios, setProximosAniversarios] = useState<Destinatario[]>([]);
  const [ultimosDisparos, setUltimosDisparos] = useState<HistoricoDisparo[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, destinatariosRes, historicoRes] = await Promise.all([
        api.get('/historico/stats'),
        api.get('/destinatarios?limit=100'),
        api.get('/historico?limit=5')
      ]);

      setStats(statsRes.data);

      const hoje = dayjs();
      const proximos = destinatariosRes.data.data
        .filter((d: Destinatario) => d.ativo)
        .map((d: Destinatario) => {
          const aniv = dayjs(d.dataAniversario);
          let proxAniv = aniv.year(hoje.year());
          if (proxAniv.isBefore(hoje, 'day')) {
            proxAniv = proxAniv.add(1, 'year');
          }
          return {
            ...d,
            diasRestantes: proxAniv.diff(hoje, 'day')
          };
        })
        .sort((a: any, b: any) => a.diasRestantes - b.diasRestantes)
        .slice(0, 5);

      setProximosAniversarios(proximos);
      setUltimosDisparos(historicoRes.data.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <h1 style={{ marginBottom: 24 }}>Dashboard</h1>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total de E-mails"
              value={stats?.total || 0}
              prefix={<MailOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Enviados com Sucesso"
              value={stats?.enviados || 0}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Falhas"
              value={stats?.falhas || 0}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Taxa de Sucesso"
              value={stats?.taxaSucesso || 0}
              suffix="%"
              precision={2}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Próximos Aniversários (7 dias)" extra={<UserOutlined />}>
            <List
              dataSource={proximosAniversarios}
              renderItem={(item: any) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.nome}
                    description={`${item.profissao} • ${dayjs(item.dataAniversario).format('DD/MM')}`}
                  />
                  <Tag color={item.diasRestantes === 0 ? 'red' : 'blue'}>
                    {item.diasRestantes === 0 ? 'Hoje!' : `${item.diasRestantes} dias`}
                  </Tag>
                </List.Item>
              )}
              locale={{ emptyText: 'Nenhum aniversário nos próximos dias' }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Últimos Disparos" extra={<MailOutlined />}>
            <List
              dataSource={ultimosDisparos}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.destinatario.nome}
                    description={dayjs(item.dataDisparo).format('DD/MM/YYYY HH:mm')}
                  />
                  <Tag color={item.status === 'enviado' ? 'success' : item.status === 'falha' ? 'error' : 'warning'}>
                    {item.status}
                  </Tag>
                </List.Item>
              )}
              locale={{ emptyText: 'Nenhum disparo ainda' }}
            />
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
}
