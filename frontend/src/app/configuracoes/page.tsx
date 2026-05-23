'use client';

import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, Card, message, Space, TimePicker, Alert } from 'antd';
import { SaveOutlined, CheckCircleOutlined } from '@ant-design/icons';
import MainLayout from '@/components/MainLayout';
import api from '@/services/api';
import dayjs from 'dayjs';
import { ConfiguracaoSmtp } from '@/types';

export default function ConfiguracoesPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const response = await api.get<ConfiguracaoSmtp>('/config/smtp');
      const config = response.data;
      setHasConfig(true);

      const [horaAniv, minutoAniv] = config.horarioDisparoAniversario.split(':');
      const [horaProf, minutoProf] = config.horarioDisparoProfissao.split(':');

      form.setFieldsValue({
        servidor: config.servidor,
        porta: config.porta,
        usuario: config.usuario,
        horarioDisparoAniversario: dayjs().hour(Number(horaAniv)).minute(Number(minutoAniv)),
        horarioDisparoProfissao: dayjs().hour(Number(horaProf)).minute(Number(minutoProf))
      });
    } catch (error) {
      setHasConfig(false);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const payload = {
        servidor: values.servidor,
        porta: values.porta,
        usuario: values.usuario,
        senha: values.senha,
        horarioDisparoAniversario: values.horarioDisparoAniversario.format('HH:mm'),
        horarioDisparoProfissao: values.horarioDisparoProfissao.format('HH:mm')
      };

      await api.post('/config/smtp', payload);
      message.success('Configuração SMTP salva com sucesso!');
      setHasConfig(true);
      form.resetFields(['senha']);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      const values = await form.validateFields(['servidor', 'porta', 'usuario', 'senha']);

      if (!values.senha) {
        message.warning('Informe a senha para testar a conexão');
        return;
      }

      setTestLoading(true);

      const response = await api.post('/config/smtp/test', {
        servidor: values.servidor,
        porta: values.porta,
        usuario: values.usuario,
        senha: values.senha
      });

      if (response.data.success) {
        message.success(response.data.message);
      }
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <MainLayout>
      <h1 style={{ marginBottom: 24 }}>Configurações SMTP</h1>

      <Alert
        message="Importante"
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
          onFinish={handleSubmit}
          initialValues={{
            servidor: 'smtp.gmail.com',
            porta: 587
          }}
        >
          <Form.Item
            name="servidor"
            label="Servidor SMTP"
            rules={[{ required: true, message: 'Servidor é obrigatório' }]}
          >
            <Input placeholder="smtp.gmail.com" />
          </Form.Item>

          <Form.Item
            name="porta"
            label="Porta"
            rules={[{ required: true, message: 'Porta é obrigatória' }]}
          >
            <InputNumber min={1} max={65535} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="usuario"
            label="E-mail (Usuário)"
            rules={[
              { required: true, message: 'E-mail é obrigatório' },
              { type: 'email', message: 'E-mail inválido' }
            ]}
          >
            <Input placeholder="seuemail@gmail.com" />
          </Form.Item>

          <Form.Item
            name="senha"
            label={hasConfig ? 'Senha (deixe em branco para manter a atual)' : 'Senha de App'}
            rules={hasConfig ? [] : [{ required: true, message: 'Senha é obrigatória' }]}
          >
            <Input.Password placeholder="Senha de app gerada no Google" />
          </Form.Item>

          <Form.Item
            name="horarioDisparoAniversario"
            label="Horário de Disparo - Aniversários"
            rules={[{ required: true, message: 'Horário de aniversários é obrigatório' }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} placeholder="Ex: 09:00" />
          </Form.Item>

          <Form.Item
            name="horarioDisparoProfissao"
            label="Horário de Disparo - Datas Profissionais"
            rules={[{ required: true, message: 'Horário de profissões é obrigatório' }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} placeholder="Ex: 10:00" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
                Salvar Configuração
              </Button>
              <Button
                icon={<CheckCircleOutlined />}
                onClick={handleTestConnection}
                loading={testLoading}
              >
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
    </MainLayout>
  );
}
