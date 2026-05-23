export interface Destinatario {
  id: number;
  nome: string;
  email: string;
  dataAniversario: string;
  profissao: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: number;
  tipo: 'aniversario' | 'profissao';
  assunto: string;
  corpo: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ConfiguracaoSmtp {
  id: number;
  servidor: string;
  porta: number;
  usuario: string;
  horarioDisparoAniversario: string;
  horarioDisparoProfissao: string;
  updatedAt: string;
}

export interface DataComemorativa {
  id: number;
  profissao: string;
  dataComemorativa: string;
  descricao: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HistoricoDisparo {
  id: number;
  destinatarioId: number;
  templateId: number;
  dataDisparo: string;
  status: 'enviado' | 'falha' | 'pendente';
  erroMensagem?: string;
  createdAt: string;
  destinatario: Destinatario;
  template: Template;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Stats {
  total: number;
  enviados: number;
  falhas: number;
  pendentes: number;
  taxaSucesso: number;
}
