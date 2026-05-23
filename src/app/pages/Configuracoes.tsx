import { Form, Input, InputNumber, Button, Card, Space, TimePicker, Alert } from 'antd';
import { SaveOutlined, CheckCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function Configuracoes() {
  const [form] = Form.useForm();

  return (
    <>
      <h1 style={{ marginBottom: 24 }}>Configurações SMTP</h1>

      <Alert
        title="Importante"
        description={
          <>
            Para usar o Gmail SMTP, você precisa:
            <ul style={{ marginTop: 8, marginBottom: 0 }}>
              <li>Ativar a verificação em 2 etapas na sua conta Google</li>
              <li>Gerar uma senha de app em: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer">myaccount.google.com/apppasswords</a></li>
              <li>Usar a senha de app gerada (não sua senha normal)</li>
            </ul>
          </>
        }
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            servidor: 'smtp.gmail.com',
            porta: 587,
            horarioDisparoAniversario: dayjs('09:00', 'HH:mm'),
            horarioDisparoProfissao: dayjs('10:00', 'HH:mm')
          }}
        >
          <Form.Item name="servidor" label="Servidor SMTP" rules={[{ required: true }]}>
            <Input placeholder="smtp.gmail.com" />
          </Form.Item>

          <Form.Item name="porta" label="Porta" rules={[{ required: true }]}>
            <InputNumber min={1} max={65535} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="usuario"
            label="E-mail (Usuário)"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input placeholder="seuemail@gmail.com" />
          </Form.Item>

          <Form.Item name="senha" label="Senha de App" rules={[{ required: true }]}>
            <Input.Password placeholder="Senha de app gerada no Google" />
          </Form.Item>

          <Form.Item
            name="horarioDisparoAniversario"
            label="Horário de Disparo - Aniversários"
            rules={[{ required: true }]}
            tooltip="Horário em que serão enviados e-mails de aniversário"
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} placeholder="Ex: 09:00" />
          </Form.Item>

          <Form.Item
            name="horarioDisparoProfissao"
            label="Horário de Disparo - Datas Profissionais"
            rules={[{ required: true }]}
            tooltip="Horário em que serão enviados e-mails de datas comemorativas"
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} placeholder="Ex: 10:00" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />}>
                Salvar Configuração
              </Button>
              <Button icon={<CheckCircleOutlined />}>
                Testar Conexão
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card style={{ marginTop: 16 }} title="Informações">
        <p><strong>Limites do Gmail:</strong></p>
        <ul>
          <li>Máximo de 500 e-mails por dia (conta gratuita)</li>
          <li>Máximo de 100 destinatários por mensagem</li>
          <li>O sistema adiciona um delay de 1,5 segundos entre envios</li>
        </ul>
      </Card>
    </>
  );
}
