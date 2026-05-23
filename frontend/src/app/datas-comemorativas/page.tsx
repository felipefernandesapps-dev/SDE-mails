'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Switch, message, Popconfirm, Radio } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SortAscendingOutlined } from '@ant-design/icons';
import MainLayout from '@/components/MainLayout';
import api from '@/services/api';
import { DataComemorativa } from '@/types';
import type { ColumnsType } from 'antd/es/table';

type SortType = 'alfabetica' | 'data';

export default function DatasComemorativasPage() {
  const [data, setData] = useState<DataComemorativa[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sortType, setSortType] = useState<SortType>('alfabetica');
  const [form] = Form.useForm();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.get<DataComemorativa[]>('/datas-comemorativas');
      setData(response.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSortedData = () => {
    const sorted = [...data];

    if (sortType === 'alfabetica') {
      return sorted.sort((a, b) => a.profissao.localeCompare(b.profissao));
    } else {
      return sorted.sort((a, b) => {
        const [mesA, diaA] = a.dataComemorativa.split('-').map(Number);
        const [mesB, diaB] = b.dataComemorativa.split('-').map(Number);

        if (mesA !== mesB) return mesA - mesB;
        return diaA - diaB;
      });
    }
  };

  const showModal = (record?: DataComemorativa) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record);
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

      if (editingId) {
        await api.put(`/datas-comemorativas/${editingId}`, values);
        message.success('Data comemorativa atualizada com sucesso!');
      } else {
        await api.post('/datas-comemorativas', values);
        message.success('Data comemorativa criada com sucesso!');
      }

      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/datas-comemorativas/${id}`);
      message.success('Data comemorativa excluída com sucesso!');
      loadData();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const formatData = (data: string) => {
    const [mes, dia] = data.split('-');
    return `${dia}/${mes}`;
  };

  const columns: ColumnsType<DataComemorativa> = [
    {
      title: 'Profissão',
      dataIndex: 'profissao',
      key: 'profissao',
      sorter: (a, b) => a.profissao.localeCompare(b.profissao),
    },
    {
      title: 'Data',
      dataIndex: 'dataComemorativa',
      key: 'dataComemorativa',
      render: (data: string) => formatData(data),
      sorter: (a, b) => a.dataComemorativa.localeCompare(b.dataComemorativa),
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      key: 'descricao',
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Datas Comemorativas por Profissão</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Nova Data Comemorativa
        </Button>
      </div>

      <div style={{ marginBottom: 16, padding: '12px 16px', background: '#fafafa', borderRadius: '8px' }}>
        <Space align="center">
          <SortAscendingOutlined style={{ fontSize: 16, color: '#666' }} />
          <span style={{ fontWeight: 500 }}>Ordenar por:</span>
          <Radio.Group value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <Radio.Button value="alfabetica">Ordem Alfabética</Radio.Button>
            <Radio.Button value="data">Data Crescente</Radio.Button>
          </Radio.Group>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={getSortedData()}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? 'Editar Data Comemorativa' : 'Nova Data Comemorativa'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="profissao"
            label="Profissão"
            rules={[{ required: true, message: 'Profissão é obrigatória' }, { min: 3 }]}
          >
            <Input placeholder="Ex: Médico" />
          </Form.Item>

          <Form.Item
            name="dataComemorativa"
            label="Data (MM-DD)"
            rules={[
              { required: true, message: 'Data é obrigatória' },
              { pattern: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, message: 'Formato: MM-DD (ex: 10-18)' }
            ]}
          >
            <Input placeholder="Ex: 10-18 para 18 de outubro" />
          </Form.Item>

          <Form.Item
            name="descricao"
            label="Descrição"
            rules={[{ required: true, message: 'Descrição é obrigatória' }, { min: 3 }]}
          >
            <Input placeholder="Ex: Dia do Médico" />
          </Form.Item>

          <Form.Item name="ativo" label="Ativo" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </MainLayout>
  );
}
