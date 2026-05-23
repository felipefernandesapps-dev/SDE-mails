'use client';

import { useState, useEffect } from 'react';
import { Table, Tag, DatePicker, Select, Space, Card, Row, Col, Statistic } from 'antd';
import { MailOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import MainLayout from '@/components/MainLayout';
import api from '@/services/api';
import dayjs from 'dayjs';
import { HistoricoDisparo, PaginatedResponse, Stats } from '@/types';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;

export default function HistoricoPage() {
  const [data, setData] = useState<HistoricoDisparo[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
  const [filters, setFilters] = useState<{
    status?: string;
    dataInicio?: string;
    dataFim?: string;
  }>({});
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize, filters]);

  useEffect(() => {
    loadStats();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.get<PaginatedResponse<HistoricoDisparo>>('/historico', {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          ...filters
        }
      });
      setData(response.data.data);
      setPagination(prev => ({ ...prev, total: response.data.pagination.total }));
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get<Stats>('/historico/stats', {
        params: filters
      });
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination(prev => ({ ...prev, current: newPagination.current, pageSize: newPagination.pageSize }));
  };

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates[0] && dates[1]) {
      setFilters(prev => ({
        ...prev,
        dataInicio: dates[0].format('YYYY-MM-DD'),
        dataFim: dates[1].format('YYYY-MM-DD')
      }));
    } else {
      setFilters(prev => {
        const { dataInicio, dataFim, ...rest } = prev;
        return rest;
      });
    }
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleStatusChange = (value: string) => {
    if (value) {
      setFilters(prev => ({ ...prev, status: value }));
    } else {
      setFilters(prev => {
        const { status, ...rest } = prev;
        return rest;
      });
    }
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      enviado: { color: 'success', text: 'Enviado' },
      falha: { color: 'error', text: 'Falha' },
      pendente: { color: 'warning', text: 'Pendente' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: ColumnsType<HistoricoDisparo> = [
    {
      title: 'Data/Hora',
      dataIndex: 'dataDisparo',
      key: 'dataDisparo',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
      sorter: (a, b) => dayjs(a.dataDisparo).unix() - dayjs(b.dataDisparo).unix(),
    },
    {
      title: 'Destinatário',
      dataIndex: ['destinatario', 'nome'],
      key: 'destinatario',
    },
    {
      title: 'E-mail',
      dataIndex: ['destinatario', 'email'],
      key: 'email',
    },
    {
      title: 'Tipo',
      dataIndex: ['template', 'tipo'],
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
      dataIndex: 'erroMensagem',
      key: 'erroMensagem',
      render: (erro: string | null) => erro ? (
        <span style={{ color: 'red', fontSize: '12px' }}>{erro.substring(0, 50)}...</span>
      ) : '-',
    },
  ];

  return (
    <MainLayout>
      <h1 style={{ marginBottom: 24 }}>Histórico de Disparos</h1>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total"
              value={stats?.total || 0}
              prefix={<MailOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Enviados"
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

      <Space style={{ marginBottom: 16 }} wrap>
        <RangePicker
          format="DD/MM/YYYY"
          placeholder={['Data inicial', 'Data final']}
          onChange={handleDateRangeChange}
        />
        <Select
          placeholder="Filtrar por status"
          style={{ width: 200 }}
          onChange={handleStatusChange}
          allowClear
        >
          <Select.Option value="enviado">Enviado</Select.Option>
          <Select.Option value="falha">Falha</Select.Option>
          <Select.Option value="pendente">Pendente</Select.Option>
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
    </MainLayout>
  );
}
