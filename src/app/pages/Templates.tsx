import { useState } from 'react';
import { Card, Button, Modal, Form, Input, Select, Switch, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { TextArea } = Input;

export default function Templates() {
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [form] = Form.useForm();

  const templates = [
    {
      id: 1,
      tipo: 'aniversario',
      assunto: 'Feliz Aniversário, {{nome}}! 🎉',
      corpo: '<div>Parabéns {{nome}}! Desejamos muita saúde e felicidades!</div>',
      ativo: true
    },
    {
      id: 2,
      tipo: 'profissao',
      assunto: 'Feliz Dia do(a) {{profissao}}! 🎊',
      corpo: '<div>Olá {{nome}}! Feliz dia do(a) {{profissao}}!</div>',
      ativo: true
    },
  ];

  const variaveisDisponiveis = [
    { label: '{{nome}}', desc: 'Nome do destinatário' },
    { label: '{{email}}', desc: 'E-mail do destinatário' },
    { label: '{{profissao}}', desc: 'Profissão do destinatário' },
    { label: '{{data_aniversario}}', desc: 'Data de aniversário' },
    { label: '{{ano_atual}}', desc: 'Ano atual' },
  ];

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Templates de E-mail</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
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
                  key={`preview-${template.id}`}
                  type="link"
                  icon={<EyeOutlined />}
                  onClick={() => setPreviewVisible(true)}
                >
                  Preview
                </Button>,
                <Button
                  key={`edit-${template.id}`}
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => setModalVisible(true)}
                >
                  Editar
                </Button>,
                <Button key={`delete-${template.id}`} type="link" danger icon={<DeleteOutlined />}>
                  Excluir
                </Button>,
              ]}
            >
              <div style={{ maxHeight: 100, overflow: 'hidden' }}>
                {template.corpo.substring(0, 150)}...
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="Novo Template"
        open={modalVisible}
        onOk={() => setModalVisible(false)}
        onCancel={() => setModalVisible(false)}
        okText="Salvar"
        cancelText="Cancelar"
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="tipo" label="Tipo de Template" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="aniversario">Aniversário</Select.Option>
              <Select.Option value="profissao">Profissão</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="assunto" label="Assunto do E-mail" rules={[{ required: true }]}>
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

          <Form.Item name="corpo" label="Corpo do E-mail (HTML)" rules={[{ required: true }]}>
            <TextArea rows={12} placeholder="Use HTML e variáveis como {{nome}}" />
          </Form.Item>

          <Form.Item name="ativo" label="Ativo" valuePropName="checked">
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Preview do Template"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            Fechar
          </Button>
        ]}
        width={800}
      >
        <div
          style={{
            border: '1px solid #d9d9d9',
            padding: 16,
            borderRadius: 4,
            minHeight: 300
          }}
        >
          <h2>Feliz Aniversário, João Silva! 🎉</h2>
          <p>Parabéns João Silva! Desejamos muita saúde e felicidades!</p>
        </div>
      </Modal>
    </>
  );
}
