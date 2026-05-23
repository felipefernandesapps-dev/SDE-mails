import { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, Switch, Radio } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SortAscendingOutlined } from '@ant-design/icons';

interface DataComemorativa {
  id: number;
  profissao: string;
  dataComemorativa: string;
  descricao: string;
  ativo: boolean;
}

type SortType = 'alfabetica' | 'data';

export default function DatasComemorativas() {
  const [modalVisible, setModalVisible] = useState(false);
  const [sortType, setSortType] = useState<SortType>('alfabetica');
  const [form] = Form.useForm();

  const rawData: DataComemorativa[] = [
    { id: 1, profissao: 'Médico', dataComemorativa: '10-18', descricao: 'Dia do Médico', ativo: true },
    { id: 2, profissao: 'Professor', dataComemorativa: '10-15', descricao: 'Dia do Professor', ativo: true },
    { id: 3, profissao: 'Enfermeiro', dataComemorativa: '05-12', descricao: 'Dia do Enfermeiro', ativo: true },
    { id: 4, profissao: 'Programador', dataComemorativa: '09-13', descricao: 'Dia do Programador', ativo: true },
    { id: 5, profissao: 'Advogado', dataComemorativa: '08-11', descricao: 'Dia do Advogado', ativo: true },
    { id: 6, profissao: 'Contador', dataComemorativa: '04-25', descricao: 'Dia do Contador', ativo: true },
    { id: 7, profissao: 'Dentista', dataComemorativa: '10-25', descricao: 'Dia do Dentista', ativo: true },
    { id: 8, profissao: 'Engenheiro', dataComemorativa: '12-11', descricao: 'Dia do Engenheiro', ativo: true },
  ];

  const getSortedData = () => {
    const sorted = [...rawData];

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

  const data = getSortedData();

  const formatData = (data: string) => {
    const [mes, dia] = data.split('-');
    return `${dia}/${mes}`;
  };

  const columns = [
    {
      title: 'Profissão',
      dataIndex: 'profissao',
      key: 'profissao',
    },
    {
      title: 'Data',
      dataIndex: 'dataComemorativa',
      key: 'dataComemorativa',
      render: (data: string) => formatData(data),
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Datas Comemorativas por Profissão</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
          Nova Data Comemorativa
        </Button>
      </div>

      <div style={{ marginBottom: 16, padding: '12px 16px', background: '#fafafa', borderRadius: '8px' }}>
        <Space align="center">
          <SortAscendingOutlined style={{ fontSize: 16, color: '#666' }} />
          <span style={{ fontWeight: 500 }}>Ordenar por:</span>
          <Radio.Group value={sortType} onChange={(e) => setSortType(e.target.value)}>
            <Radio.Button key="sort-alfabetica" value="alfabetica">Ordem Alfabética</Radio.Button>
            <Radio.Button key="sort-data" value="data">Data Crescente</Radio.Button>
          </Radio.Group>
        </Space>
      </div>

      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        title="Nova Data Comemorativa"
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        okText="Salvar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="profissao" label="Profissão" rules={[{ required: true }]}>
            <Input placeholder="Ex: Médico" />
          </Form.Item>

          <Form.Item
            name="dataComemorativa"
            label="Data (MM-DD)"
            rules={[
              { required: true },
              { pattern: /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, message: 'Formato: MM-DD (ex: 10-18)' }
            ]}
          >
            <Input placeholder="Ex: 10-18 para 18 de outubro" />
          </Form.Item>

          <Form.Item name="descricao" label="Descrição" rules={[{ required: true }]}>
            <Input placeholder="Ex: Dia do Médico" />
          </Form.Item>

          <Form.Item name="ativo" label="Ativo" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
