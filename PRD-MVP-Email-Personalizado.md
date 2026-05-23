# PRD - MVP Sistema de Disparo de E-mails Personalizados

## 1. Visão Geral do Projeto

Sistema para gerenciamento e disparo automático de e-mails personalizados baseados em datas comemorativas (aniversários e datas profissionais).

### 1.1 Objetivos
- Cadastrar destinatários com informações básicas
- Enviar e-mails automáticos em datas específicas
- Gerenciar templates personalizáveis
- Acompanhar histórico de disparos

### 1.2 Stack Tecnológica
- **Frontend:** Next.js + Ant Design
- **Backend:** Node.js
- **Banco de Dados:** PostgreSQL (histórico de disparos) + solução para dados gerais
- **Envio de E-mails:** SMTP Gmail com senha de app

---

## 2. Requisitos Funcionais

### 2.1 Cadastro de Destinatários
- Nome completo
- E-mail
- Data de aniversário
- Profissão

### 2.2 Configuração SMTP
- Servidor SMTP
- Usuário
- Senha (senha de app do Gmail)
- Horário de disparo

### 2.3 Templates de E-mail
- Templates editáveis
- Suporte a variáveis dinâmicas (ex: `{{nome}}`, `{{profissao}}`)
- Tipos de template:
  - Aniversário
  - Data comemorativa profissional

### 2.4 Disparo de E-mails
- Automático na data de aniversário
- Automático em datas comemorativas profissionais
- Execução no horário configurado

### 2.5 Relatório de Disparos
- Data do disparo
- Destinatário
- Tipo de template
- Status (enviado, falha, pendente)

---

## 3. Arquitetura Sugerida

### 3.1 Estrutura de Pastas
```
project-root/
├── frontend/                 # Next.js
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
│
├── backend/                  # Node.js
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── jobs/           # Cron jobs para disparo
│   │   └── config/
│   └── package.json
│
└── database/
    └── migrations/
```

### 3.2 Banco de Dados

#### Tabela: `destinatarios`
```sql
- id (PK)
- nome
- email
- data_aniversario
- profissao
- ativo (boolean)
- created_at
- updated_at
```

#### Tabela: `templates`
```sql
- id (PK)
- tipo (enum: 'aniversario', 'profissao')
- assunto
- corpo (text com variáveis)
- ativo (boolean)
- created_at
- updated_at
```

#### Tabela: `configuracao_smtp`
```sql
- id (PK)
- servidor
- porta
- usuario
- senha (criptografada)
- horario_disparo
- updated_at
```

#### Tabela: `historico_disparos`
```sql
- id (PK)
- destinatario_id (FK)
- template_id (FK)
- data_disparo
- status (enum: 'enviado', 'falha', 'pendente')
- erro_mensagem (text, nullable)
- created_at
```

#### Tabela: `datas_comemorativas`
```sql
- id (PK)
- profissao
- data_comemorativa (dia/mês)
- descricao
- ativo (boolean)
```

---

## 4. Tarefas Separadas por Etapas

### **FASE 1: Configuração Inicial**

#### Etapa 1.1 - Setup do Projeto
- [ ] Criar repositório Git
- [ ] Inicializar projeto Next.js (frontend)
- [ ] Inicializar projeto Node.js (backend)
- [ ] Configurar ESLint e Prettier
- [ ] Criar estrutura de pastas base

#### Etapa 1.2 - Configuração do Banco de Dados
- [ ] Instalar PostgreSQL
- [ ] Criar banco de dados
- [ ] Configurar ORM (Prisma ou Sequelize recomendado)
- [ ] Criar migrations iniciais
- [ ] Criar seeds para dados de teste

#### Etapa 1.3 - Configuração Frontend
- [ ] Instalar Ant Design
- [ ] Configurar layout base (Header, Sidebar, Content)
- [ ] Criar rotas principais
- [ ] Configurar Axios ou Fetch para API calls

---

### **FASE 2: Backend - API Base**

#### Etapa 2.1 - Estrutura Base do Backend
- [ ] Configurar Express.js
- [ ] Implementar middleware de CORS
- [ ] Implementar middleware de error handling
- [ ] Configurar variáveis de ambiente (.env)
- [ ] Implementar validação de requests (Joi ou Zod)

#### Etapa 2.2 - CRUD de Destinatários
- [ ] `POST /api/destinatarios` - Criar destinatário
- [ ] `GET /api/destinatarios` - Listar destinatários (com paginação)
- [ ] `GET /api/destinatarios/:id` - Buscar destinatário
- [ ] `PUT /api/destinatarios/:id` - Atualizar destinatário
- [ ] `DELETE /api/destinatarios/:id` - Deletar destinatário
- [ ] Validação de e-mail único
- [ ] Validação de formato de data

#### Etapa 2.3 - CRUD de Templates
- [ ] `POST /api/templates` - Criar template
- [ ] `GET /api/templates` - Listar templates
- [ ] `GET /api/templates/:id` - Buscar template
- [ ] `PUT /api/templates/:id` - Atualizar template
- [ ] `DELETE /api/templates/:id` - Deletar template
- [ ] Validação de variáveis no template

#### Etapa 2.4 - Configuração SMTP
- [ ] `POST /api/config/smtp` - Salvar configuração SMTP
- [ ] `GET /api/config/smtp` - Buscar configuração SMTP
- [ ] `PUT /api/config/smtp` - Atualizar configuração SMTP
- [ ] Criptografia de senha (bcrypt ou crypto)
- [ ] `POST /api/config/smtp/test` - Testar conexão SMTP

#### Etapa 2.5 - Datas Comemorativas
- [ ] `POST /api/datas-comemorativas` - Criar data comemorativa
- [ ] `GET /api/datas-comemorativas` - Listar datas
- [ ] `PUT /api/datas-comemorativas/:id` - Atualizar data
- [ ] `DELETE /api/datas-comemorativas/:id` - Deletar data
- [ ] Seed inicial com datas profissionais comuns

---

### **FASE 3: Sistema de Disparo**

#### Etapa 3.1 - Serviço de E-mail
- [ ] Instalar Nodemailer
- [ ] Criar service para conexão SMTP
- [ ] Implementar função de envio de e-mail
- [ ] Implementar substituição de variáveis no template
- [ ] Implementar retry em caso de falha
- [ ] Logging de tentativas de envio

#### Etapa 3.2 - Job Scheduler
- [ ] Instalar node-cron ou bull
- [ ] Criar job para verificar aniversários do dia
- [ ] Criar job para verificar datas comemorativas
- [ ] Configurar execução no horário definido
- [ ] Implementar lock para evitar duplicação

#### Etapa 3.3 - Lógica de Disparo
- [ ] Buscar destinatários com aniversário no dia
- [ ] Buscar destinatários por profissão em data comemorativa
- [ ] Validar se já foi enviado (evitar duplicação)
- [ ] Processar fila de envios
- [ ] Registrar disparo no histórico
- [ ] Atualizar status (enviado/falha)

#### Etapa 3.4 - Histórico de Disparos
- [ ] `GET /api/historico` - Listar histórico (com filtros)
- [ ] `GET /api/historico/stats` - Estatísticas de disparos
- [ ] Filtros: data, status, destinatário, tipo
- [ ] Paginação de resultados

---

### **FASE 4: Frontend - Interfaces**

#### Etapa 4.1 - Tela de Destinatários
- [ ] Listagem com tabela Ant Design (Table)
- [ ] Formulário de cadastro (Modal ou página)
- [ ] Edição inline ou modal
- [ ] Confirmação de exclusão
- [ ] Busca e filtros
- [ ] Validação de formulário
- [ ] Feedback visual (mensagens de sucesso/erro)

#### Etapa 4.2 - Tela de Templates
- [ ] Listagem de templates
- [ ] Editor de template (Input.TextArea)
- [ ] Preview de template com variáveis substituídas
- [ ] Seletor de tipo (aniversário/profissão)
- [ ] Lista de variáveis disponíveis
- [ ] Validação de template

#### Etapa 4.3 - Tela de Configuração SMTP
- [ ] Formulário de configuração
- [ ] Campo de senha tipo password
- [ ] Seletor de horário de disparo (TimePicker)
- [ ] Botão "Testar Conexão"
- [ ] Feedback de teste de conexão
- [ ] Persistência segura

#### Etapa 4.4 - Tela de Datas Comemorativas
- [ ] Listagem de datas por profissão
- [ ] Formulário de cadastro
- [ ] Seletor de data (dia/mês)
- [ ] Input de profissão
- [ ] CRUD completo

#### Etapa 4.5 - Tela de Relatório
- [ ] Tabela de histórico de disparos
- [ ] Filtros: data range, status, destinatário
- [ ] Indicador visual de status (Tag do Ant Design)
- [ ] Exportação para CSV (opcional)
- [ ] Cards com estatísticas (total enviado, falhas, taxa de sucesso)
- [ ] Gráficos simples (opcional)

#### Etapa 4.6 - Dashboard (Página Inicial)
- [ ] Cards com métricas principais
- [ ] Próximos aniversários (7 dias)
- [ ] Próximas datas comemorativas
- [ ] Últimos disparos
- [ ] Status do sistema (SMTP configurado?)

---

### **FASE 5: Melhorias e Ajustes**

#### Etapa 5.1 - Segurança
- [ ] Implementar autenticação (opcional para MVP)
- [ ] Sanitização de inputs
- [ ] Rate limiting na API
- [ ] HTTPS (em produção)
- [ ] Proteção contra SQL injection
- [ ] Validação de CORS

#### Etapa 5.2 - Testes
- [ ] Testes unitários backend (Jest)
- [ ] Testes de integração da API
- [ ] Testes de envio de e-mail (mock)
- [ ] Testes de jobs/cron
- [ ] Testes frontend (React Testing Library - opcional)

#### Etapa 5.3 - Deploy
- [ ] Dockerizar aplicação
- [ ] Configurar CI/CD (GitHub Actions)
- [ ] Deploy backend (Heroku, Railway, ou VPS)
- [ ] Deploy frontend (Vercel, Netlify)
- [ ] Configurar variáveis de ambiente
- [ ] Backup automático do banco de dados

#### Etapa 5.4 - Documentação
- [ ] README.md com instruções de instalação
- [ ] Documentação da API (Swagger/OpenAPI)
- [ ] Guia de uso do sistema
- [ ] Variáveis de ambiente necessárias
- [ ] Processo de deploy

---

## 5. Variáveis de Template Suportadas

- `{{nome}}` - Nome completo do destinatário
- `{{email}}` - E-mail do destinatário
- `{{profissao}}` - Profissão do destinatário
- `{{data_aniversario}}` - Data de aniversário formatada
- `{{ano_atual}}` - Ano atual

---

## 6. Dependências Principais

### Backend
```json
{
  "express": "^4.18.0",
  "nodemailer": "^6.9.0",
  "pg": "^8.11.0",
  "prisma": "^5.0.0",
  "node-cron": "^3.0.0",
  "joi": "^17.9.0",
  "dotenv": "^16.0.0",
  "bcrypt": "^5.1.0",
  "cors": "^2.8.5"
}
```

### Frontend
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "antd": "^5.10.0",
  "axios": "^1.5.0",
  "dayjs": "^1.11.0"
}
```

---

## 7. Estimativa de Tempo

| Fase | Tempo Estimado |
|------|----------------|
| Fase 1 - Configuração | 8-12 horas |
| Fase 2 - Backend API | 20-30 horas |
| Fase 3 - Sistema de Disparo | 16-24 horas |
| Fase 4 - Frontend | 24-32 horas |
| Fase 5 - Melhorias | 12-16 horas |
| **Total** | **80-114 horas** |

---

## 8. Fluxo de Dados Simplificado

```
1. Admin cadastra destinatários → DB
2. Admin cria templates → DB
3. Admin configura SMTP → DB (senha criptografada)
4. Cron Job executa no horário configurado
5. Job busca aniversariantes do dia
6. Job busca datas comemorativas do dia
7. Para cada destinatário:
   - Busca template apropriado
   - Substitui variáveis
   - Envia e-mail via SMTP
   - Registra no histórico
8. Admin visualiza relatório de disparos
```

---

## 9. Considerações Importantes

### Senha de App Gmail
- Necessário ativar verificação em 2 etapas
- Gerar senha de app em: https://myaccount.google.com/apppasswords
- Usar senha de app (não a senha normal) no campo de senha SMTP

### Limites do Gmail SMTP
- Máximo 500 e-mails por dia (conta gratuita)
- Máximo 100 destinatários por mensagem
- Implementar delay entre envios (recomendado: 1-2 segundos)

### Fuso Horário
- Considerar timezone do servidor vs. destinatários
- Armazenar datas em UTC
- Converter para timezone local ao exibir

### Backup
- Backup diário do PostgreSQL
- Export de templates regularmente
- Logs de erros persistentes

---

## 10. Próximos Passos Após MVP

- Autenticação e multi-usuário
- Agendamento manual de e-mails
- Anexos em e-mails
- Editor visual de templates (drag-and-drop)
- Múltiplos idiomas
- Integração com outros provedores SMTP
- Webhooks para eventos
- API pública
- Analytics avançado
