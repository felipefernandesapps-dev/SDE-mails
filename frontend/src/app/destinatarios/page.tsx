'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, DatePicker, Switch, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import MainLayout from '@/components/MainLayout';
import api from '@/services/api';
import dayjs from 'dayjs';
import { Destinatario, PaginatedResponse } from '@/types';
import type { ColumnsType } from 'antd/es/table';

export default function DestinatariosPage() {
  const [data, setData] = useState<Destinatario[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, [pagination.current, pagination.pageSize, searchText]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.get<PaginatedResponse<Destinatario>>('/destinatarios', {
        params: {
          page: pagination.current,
          limit: pagination.pageSize,
          search: searchText
        }
      });
      setData(response.data.data);
      setPagination(prev => ({ ...prev, total: response.data.pagination.total }));
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (newPagination: any) => {
    setPagination(prev => ({ ...prev, current: newPagination.current, pageSize: newPagination.pageSize }));
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const showModal = (record?: Destinatario) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue({
        ...record,
        dataAniversario: dayjs(record.dataAniversario)
      });
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ ativo: true });
    }
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        dataAniversario: values.dataAniversario.format('YYYY-MM-DD')
      };

      if (editingId) {
        await api.put(`/destinatarios/${editingId}`, payload);
        message.success('Destinatário atualizado com sucesso!');
      } else {
        await api.post('/destinatarios', payload);
        message.success('Destinatário criado com sucesso!');
      }

      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/destinatarios/${id}`);
      message.success('Destinatário excluído com sucesso!');
      loadData();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns: ColumnsType<Destinatario> = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
      sorter: (a, b) => a.nome.localeCompare(b.nome),
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Data de Aniversário',
      dataIndex: 'dataAniversario',
      key: 'dataAniversario',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Profissão',
      dataIndex: 'profissao',
      key: 'profissao',
    },
    {
      title: 'Ativo',
      dataIndex: 'ativo',
      key: 'ativo',
      render: (ativo: boolean) => (
        <Switch checked={ativo} disabled />
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="Tem certeza que deseja excluir?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sim"
            cancelText="Não"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Excluir
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Destinatários</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Novo Destinatário
        </Button>
      </div>

      <Input.Search
        placeholder="Buscar por nome, email ou profissão"
        onSearch={handleSearch}
        style={{ marginBottom: 16, maxWidth: 400 }}
        allowClear
      />

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />

      <Modal
        title={editingId ? 'Editar Destinatário' : 'Novo Destinatário'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nome"
            label="Nome"
            rules={[{ required: true, message: 'Nome é obrigatório' }, { min: 3, message: 'Mínimo 3 caracteres' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              { required: true, message: 'E-mail é obrigatório' },
              { type: 'email', message: 'E-mail inválido' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="dataAniversario"
            label="Data de Aniversário"
            rules={[{ required: true, message: 'Data é obrigatória' }]}
          >
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="profissao"
            label="Profissão"
            rules={[{ required: true, message: 'Profissão é obrigatória' }, { min: 3, message: 'Mínimo 3 caracteres' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="ativo" label="Ativo" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
}
