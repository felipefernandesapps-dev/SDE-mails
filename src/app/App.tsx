import { useState } from 'react';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import Destinatarios from './pages/Destinatarios';
import Templates from './pages/Templates';
import Configuracoes from './pages/Configuracoes';
import DatasComemorativas from './pages/DatasComemorativas';
import Historico from './pages/Historico';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'destinatarios':
        return <Destinatarios />;
      case 'templates':
        return <Templates />;
      case 'configuracoes':
        return <Configuracoes />;
      case 'datas-comemorativas':
        return <DatasComemorativas />;
      case 'historico':
        return <Historico />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ConfigProvider locale={ptBR}>
      <MainLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </MainLayout>
    </ConfigProvider>
  );
}