import { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, DatePicker, Switch, Tag, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

interface Destinatario {
  id: number;
  nome: string;
  email: string;
  dataAniversario: string;
  profissao: string;
  ativo: boolean;
}

interface DataComemorativa {
  id: number;
  profissao: string;
  dataComemorativa: string;
  descricao: string;
  ativo: boolean;
}

export default function Destinatarios() {
  const [modalVisible, setModalVisible] = useState(false);
  const [profissoesDisponiveis, setProfissoesDisponiveis] = useState<DataComemorativa[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    loadProfissoes();
  }, []);

  const loadProfissoes = () => {
    // Mock data - em produção isso viria da API /datas-comemorativas
    const mockProfissoes: DataComemorativa[] = [
      { id: 1, profissao: 'Médico', dataComemorativa: '10-18', descricao: 'Dia do Médico', ativo: true },
      { id: 2, profissao: 'Professor', dataComemorativa: '10-15', descricao: 'Dia do Professor', ativo: true },
      { id: 3, profissao: 'Enfermeiro', dataComemorativa: '05-12', descricao: 'Dia do Enfermeiro', ativo: true },
      { id: 4, profissao: 'Programador', dataComemorativa: '09-13', descricao: 'Dia do Programador', ativo: true },
      { id: 5, profissao: 'Advogado', dataComemorativa: '08-11', descricao: 'Dia do Advogado', ativo: true },
      { id: 6, profissao: 'Contador', dataComemorativa: '04-25', descricao: 'Dia do Contador', ativo: true },
      { id: 7, profissao: 'Dentista', dataComemorativa: '10-25', descricao: 'Dia do Dentista', ativo: true },
      { id: 8, profissao: 'Engenheiro', dataComemorativa: '12-11', descricao: 'Dia do Engenheiro', ativo: true },
    ];
    // Filtrar apenas profissões ativas
    setProfissoesDisponiveis(mockProfissoes.filter(p => p.ativo));
  };

  const data: Destinatario[] = [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@example.com',
      dataAniversario: '1990-05-15',
      profissao: 'Médico',
      ativo: true
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@example.com',
      dataAniversario: '1985-03-20',
      profissao: 'Professora',
      ativo: true
    },
    {
      id: 3,
      nome: 'Pedro Costa',
      email: 'pedro@example.com',
      dataAniversario: '1992-08-10',
      profissao: 'Engenheiro',
      ativo: false
    },
  ];

  const columns = [
    {
      title: 'Nome',
      dataIndex: 'nome',
      key: 'nome',
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
        <Tag color={ativo ? 'success' : 'default'}>{ativo ? 'Sim' : 'Não'}</Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button key={`edit-${record.id}`} type="link" icon={<EditOutlined />} onClick={() => setModalVisible(true)}>
            Editar
          </Button>
          <Button key={`delete-${record.id}`} type="link" danger icon={<DeleteOutlined />}>
            Excluir
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Destinatários</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Novo Destinatário
        </Button>
      </div>

      <Input.Search
        placeholder="Buscar por nome, email ou profissão"
        style={{ marginBottom: 16, maxWidth: 400 }}
        allowClear
      />

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Novo Destinatário"
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="nome" label="Nome" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="E-mail" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>

          <Form.Item name="dataAniversario" label="Data de Aniversário" rules={[{ required: true }]}>
            <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="profissao"
            label="Profissão"
            rules={[{ required: true, message: 'Selecione uma profissão' }]}
          >
            <Select
              placeholder="Selecione uma profissão"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={profissoesDisponiveis
                .sort((a, b) => a.profissao.localeCompare(b.profissao))
                .map(p => ({
                  value: p.profissao,
                  label: p.profissao
                }))}
            />
          </Form.Item>

          <Form.Item name="ativo" label="Ativo" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
