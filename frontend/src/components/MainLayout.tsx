'use client';

import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  SettingOutlined,
  CalendarOutlined,
  HistoryOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const { Header, Content, Sider } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link href="/">Dashboard</Link>,
    },
    {
      key: '/destinatarios',
      icon: <UserOutlined />,
      label: <Link href="/destinatarios">Destinatários</Link>,
    },
    {
      key: '/templates',
      icon: <MailOutlined />,
      label: <Link href="/templates">Templates</Link>,
    },
    {
      key: '/datas-comemorativas',
      icon: <CalendarOutlined />,
      label: <Link href="/datas-comemorativas">Datas Comemorativas</Link>,
    },
    {
      key: '/historico',
      icon: <HistoryOutlined />,
      label: <Link href="/historico">Histórico</Link>,
    },
    {
      key: '/configuracoes',
      icon: <SettingOutlined />,
      label: <Link href="/configuracoes">Configurações SMTP</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo">
          {collapsed ? '📧' : '📧 E-mail System'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[pathname]}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{ padding: '0 24px', fontSize: '20px', fontWeight: 'bold' }}>
            Sistema de Disparo de E-mails Personalizados
          </div>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
