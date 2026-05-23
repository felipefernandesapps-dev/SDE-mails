import { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  SettingOutlined,
  CalendarOutlined,
  HistoryOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Content, Sider } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function MainLayout({ children, currentPage, onNavigate }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuProps['items'] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => onNavigate('dashboard')
    },
    {
      key: 'destinatarios',
      icon: <UserOutlined />,
      label: 'Destinatários',
      onClick: () => onNavigate('destinatarios')
    },
    {
      key: 'templates',
      icon: <MailOutlined />,
      label: 'Templates',
      onClick: () => onNavigate('templates')
    },
    {
      key: 'datas-comemorativas',
      icon: <CalendarOutlined />,
      label: 'Datas Comemorativas',
      onClick: () => onNavigate('datas-comemorativas')
    },
    {
      key: 'historico',
      icon: <HistoryOutlined />,
      label: 'Histórico',
      onClick: () => onNavigate('historico')
    },
    {
      key: 'configuracoes',
      icon: <SettingOutlined />,
      label: 'Configurações SMTP',
      onClick: () => onNavigate('configuracoes')
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{
          height: 32,
          margin: 16,
          color: 'white',
          fontSize: 18,
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {collapsed ? '📧' : '📧 E-mail System'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[currentPage]}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
            Sistema de Disparo de E-mails Personalizados
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{
            padding: 24,
            minHeight: 360,
            background: '#fff',
            borderRadius: 8
          }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
