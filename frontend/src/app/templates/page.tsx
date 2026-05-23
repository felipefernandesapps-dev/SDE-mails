'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, Select, Switch, message, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import MainLayout from '@/components/MainLayout';
import api from '@/services/api';
import { Template, Destinatario } from '@/types';

const { TextArea } = Input;

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [destinatarios, setDestinatarios] = useState<Destinatario[]>([]);
  const [form] = Form.useForm();
  const [previewForm] = Form.useForm();

  useEffect(() => {
    loadData();
    loadDestinatarios();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await api.get<Template[]>('/templates');
      setTemplates(response.data);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDestinatarios = async () => {
    try {
      const response = await api.get('/destinatarios?limit=100');
      setDestinatarios(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar destinatários:', error);
    }
  };

  const showModal = (record?: Template) => {
    if (record) {
      setEditingId(record.id);
      form.setFieldsValue(record);
    } else {
      setEditingId(null);
      form.resetFields();
      form.setFieldsValue({ ativo: true, tipo: 'aniversario' });
    }
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingId) {
        await api.put(`/templates/${editingId}`, values);
        message.success('Template atualizado com sucesso!');
      } else {
        await api.post('/templates', values);
        message.success('Template criado com sucesso!');
      }

      setModalVisible(false);
      loadData();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: 'Tem certeza que deseja excluir?',
      content: 'Esta ação não poderá ser desfeita.',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: async () => {
        try {
          await api.delete(`/templates/${id}`);
          message.success('Template excluído com sucesso!');
          loadData();
        } catch (error: any) {
          message.error(error.message);
        }
      }
    });
  };

  const showPreview = async (template: Template) => {
    if (destinatarios.length === 0) {
      message.warning('Nenhum destinatário cadastrado para preview');
      return;
    }

    previewForm.setFieldsValue({ destinatarioId: destinatarios[0].id });
    setPreviewModalVisible(true);

    handlePreviewUpdate(template.corpo, destinatarios[0].id);
  };

  const handlePreviewUpdate = async (corpo: string, destinatarioId: number) => {
    try {
      const response = await api.post('/templates/preview', {
        corpo,
        destinatarioId
      });
      setPreviewHtml(response.data.preview);
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const variaveisDisponiveis = [
    { label: '{{nome}}', desc: 'Nome do destinatário' },
    { label: '{{email}}', desc: 'E-mail do destinatário' },
    { label: '{{profissao}}', desc: 'Profissão do destinatário' },
    { label: '{{data_aniversario}}', desc: 'Data de aniversário' },
    { label: '{{ano_atual}}', desc: 'Ano atual' },
  ];

  return (
    <MainLayout>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Templates de E-mail</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Novo Template
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {templates.map((template) => (
          <Col xs={24} lg={12} key={template.id}>
            <Card
              title={
                <Space>
                  {template.assunto}
                  <Tag color={template.tipo === 'aniversario' ? 'blue' : 'green'}>
                    {template.tipo === 'aniversario' ? 'Aniversário' : 'Profissão'}
                  </Tag>
                  {!template.ativo && <Tag color="red">Inativo</Tag>}
                </Space>
              }
              actions={[
                <Button
                  key="preview"
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => showPreview(template)}
                >
                  Preview
                </Button>,
                <Button
                  key="edit"
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => showModal(template)}
                >
                  Editar
                </Button>,
                <Button
                  key="delete"
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(template.id)}
                >
                  Excluir
                </Button>,
              ]}
            >
              <div style={{ maxHeight: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {template.corpo.substring(0, 200)}...
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingId ? 'Editar Template' : 'Novo Template'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        okText="Salvar"
        cancelText="Cancelar"
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="tipo"
            label="Tipo de Template"
            rules={[{ required: true, message: 'Tipo é obrigatório' }]}
          >
            <Select>
              <Select.Option value="aniversario">Aniversário</Select.Option>
              <Select.Option value="profissao">Profissão</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="assunto"
            label="Assunto do E-mail"
            rules={[{ required: true, message: 'Assunto é obrigatório' }, { min: 3 }]}
          >
            <Input placeholder="Ex: Feliz Aniversário, {{nome}}!" />
          </Form.Item>

          <Form.Item label="Variáveis Disponíveis">
            <Space wrap>
              {variaveisDisponiveis.map((v) => (
                <Tag key={v.label} color="blue">
                  {v.label} - {v.desc}
                </Tag>
              ))}
            </Space>
          </Form.Item>

          <Form.Item
            name="corpo"
            label="Corpo do E-mail (HTML)"
            rules={[{ required: true, message: 'Corpo é obrigatório' }, { min: 10 }]}
          >
            <TextArea rows={12} placeholder="Use HTML e variáveis como {{nome}}" />
          </Form.Item>

          <Form.Item name="ativo" label="Ativo" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Preview do Template"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewModalVisible(false)}>
            Fechar
          </Button>
        ]}
        width={800}
      >
        <Form form={previewForm} layout="inline" style={{ marginBottom: 16 }}>
          <Form.Item label="Destinatário" name="destinatarioId">
            <Select
              style={{ width: 300 }}
              onChange={(value) => {
                const corpo = form.getFieldValue('corpo') || '';
                handlePreviewUpdate(corpo, value);
              }}
            >
              {destinatarios.map((d) => (
                <Select.Option key={d.id} value={d.id}>
                  {d.nome} ({d.email})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        <div
          style={{
            border: '1px solid #d9d9d9',
            padding: 16,
            borderRadius: 4,
            minHeight: 300
          }}
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </Modal>
    </MainLayout>
  );
}
