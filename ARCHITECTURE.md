# 🏗️ Arquitetura do Sistema

## Visão Geral

Sistema de três camadas (Frontend, Backend, Database) para disparo automático de e-mails personalizados.

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│              Next.js 14 + Ant Design                    │
│  ┌────────┬─────────┬─────────┬──────────┬─────────┐  │
│  │Dashboard│Destinat.│Templates│Config SMTP│Histórico│  │
│  └────────┴─────────┴─────────┴──────────┴─────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/REST API
┌─────────────────────┴───────────────────────────────────┐
│                      BACKEND                            │
│              Node.js + Express + TypeScript             │
│  ┌──────────────────────────────────────────────────┐  │
│  │              REST API Endpoints                   │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  Controllers  │  Services  │  Jobs  │  Routes    │  │
│  ├──────────────────────────────────────────────────┤  │
│  │           Prisma ORM (Database Layer)            │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  Nodemailer        │      node-cron              │  │
│  │  (Email Service)   │  (Job Scheduler)            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│                    DATABASE                             │
│                   PostgreSQL                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │  destinatarios  │  templates  │  historico       │  │
│  │  config_smtp    │  datas_comemorativas           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                      │
                      ▼
              ┌──────────────┐
              │  SMTP Gmail  │
              │ (Envio Real) │
              └──────────────┘
```

## Componentes Principais

### 1. Frontend (Next.js)

**Responsabilidades:**
- Interface do usuário
- Validação de formulários
- Comunicação com API
- Renderização de dados

**Páginas:**
- `/` - Dashboard com métricas
- `/destinatarios` - CRUD de destinatários
- `/templates` - Gestão de templates
- `/configuracoes` - Config SMTP
- `/datas-comemorativas` - Datas profissionais
- `/historico` - Log de disparos

**Tecnologias:**
- Next.js 14 (App Router)
- React 18
- Ant Design (UI)
- Axios (HTTP)
- Day.js (Datas)
- TypeScript

### 2. Backend (Node.js)

**Responsabilidades:**
- API REST
- Lógica de negócio
- Validação de dados
- Cron jobs
- Envio de e-mails

**Estrutura:**

```
src/
├── config/
│   └── database.ts          # Prisma Client
├── controllers/
│   ├── destinatarioController.ts
│   ├── templateController.ts
│   ├── smtpController.ts
│   ├── datasComemorativasController.ts
│   └── historicoController.ts
├── services/
│   └── emailService.ts      # Nodemailer
├── jobs/
│   ├── emailDispatchJob.ts  # Lógica de disparo
│   └── scheduler.ts         # Cron setup
├── routes/
│   └── index.ts             # Rotas agregadas
├── middleware/
│   └── errorHandler.ts      # Erro global
├── utils/
│   └── crypto.ts            # Encriptação
└── server.ts                # Entry point
```

**Tecnologias:**
- Express.js
- Prisma ORM
- Nodemailer
- node-cron
- Joi (validação)
- bcrypt/crypto (segurança)
- TypeScript

### 3. Database (PostgreSQL)

**Modelo de Dados:**

```sql
destinatarios
  ├── id (PK)
  ├── nome
  ├── email (UNIQUE)
  ├── dataAniversario
  ├── profissao
  └── ativo

templates
  ├── id (PK)
  ├── tipo (enum)
  ├── assunto
  ├── corpo
  └── ativo

configuracao_smtp
  ├── id (PK)
  ├── servidor
  ├── porta
  ├── usuario
  ├── senha (encrypted)
  └── horarioDisparo

datas_comemorativas
  ├── id (PK)
  ├── profissao
  ├── dataComemorativa (MM-DD)
  ├── descricao
  └── ativo

historico_disparos
  ├── id (PK)
  ├── destinatarioId (FK)
  ├── templateId (FK)
  ├── dataDisparo
  ├── status (enum)
  └── erroMensagem
```

## Fluxo de Dados

### 1. Cadastro de Destinatário

```
User (Frontend)
  │
  ▼ POST /api/destinatarios
Backend Controller
  │
  ▼ Validação (Joi)
  │
  ▼ Prisma.create()
PostgreSQL
  │
  ▼ Destinatário salvo
Response 201
```

### 2. Disparo Automático de E-mails

```
Cron Scheduler (diário, horário configurado)
  │
  ▼ Trigger Job
emailDispatchJob.ts
  │
  ├─▶ processarAniversariantes()
  │     │
  │     ├─▶ Buscar destinatários (data = hoje)
  │     ├─▶ Verificar se já enviado (histórico)
  │     ├─▶ Buscar template ativo (tipo: aniversario)
  │     ├─▶ Substituir variáveis
  │     ├─▶ Enviar e-mail (SMTP)
  │     └─▶ Registrar no histórico
  │
  └─▶ processarDatasComemorativas()
        │
        ├─▶ Buscar datas comemorativas (data = hoje)
        ├─▶ Buscar destinatários (profissão match)
        ├─▶ Verificar se já enviado
        ├─▶ Buscar template ativo (tipo: profissao)
        ├─▶ Substituir variáveis
        ├─▶ Enviar e-mail (SMTP)
        └─▶ Registrar no histórico
```

### 3. Envio de E-mail

```
emailService.ts
  │
  ▼ getTransporter()
  │   ├─▶ Buscar config SMTP
  │   └─▶ Descriptografar senha
  │
  ▼ sendEmail()
  │   ├─▶ Criar transporter
  │   ├─▶ Enviar via SMTP
  │   └─▶ Delay 1.5s
  │
  ▼ SMTP Gmail
  │
  ▼ E-mail entregue
```

## Segurança

### 1. Senha SMTP

- Armazenada **criptografada** no banco
- Algoritmo: AES-256-CBC
- Chave: env var `ENCRYPTION_KEY`
- Nunca retornada pela API

### 2. Validação de Inputs

- Joi schemas em todos os endpoints
- Sanitização de HTML
- Validação de e-mail
- Proteção contra SQL injection (Prisma)

### 3. Rate Limiting

- Delay de 1.5s entre envios
- Respeita limites do Gmail (500/dia)
- Verificação de duplicação

## Escalabilidade

### Limitações Atuais

- Single instance (não clusterizado)
- Cron job local (não distribuído)
- SMTP único (Gmail)

### Melhorias Futuras

1. **Fila de E-mails**
   - Bull/BullMQ com Redis
   - Processamento paralelo
   - Retry automático

2. **Multi-tenancy**
   - Múltiplas organizações
   - SMTP por tenant
   - Isolamento de dados

3. **Cache**
   - Redis para configurações
   - Cache de templates
   - Rate limiting distribuído

4. **Monitoramento**
   - Logs estruturados
   - Metrics (Prometheus)
   - Alertas (falhas de envio)

## Padrões de Código

### Backend

- Controllers: Recebem requisições, validam, delegam
- Services: Lógica de negócio, integrações externas
- Repositories: Acesso a dados (Prisma)
- Middleware: Cross-cutting concerns

### Frontend

- Pages: Containers de rota
- Components: Reutilizáveis, sem lógica complexa
- Services: Chamadas à API
- Types: Interfaces TypeScript compartilhadas

## Tratamento de Erros

### Backend

1. Try-catch em todos os controllers
2. Middleware global de erro
3. Logs detalhados (console)
4. Response padronizado

### Frontend

1. Try-catch em async calls
2. Message.error() do Ant Design
3. Feedback visual ao usuário
4. Loading states

## Performance

### Otimizações

- Pagination em listagens
- Índices no PostgreSQL (email, profissao)
- Eager loading (includes do Prisma)
- Cache de configuração SMTP

### Métricas

- Tempo de resposta: < 200ms (APIs)
- Disparo de e-mail: ~2s cada
- Batch de 100 e-mails: ~5 minutos

## Testes (Futuro)

### Backend

- Unit: Controllers, Services
- Integration: APIs completas
- E2E: Fluxo de disparo (mock SMTP)

### Frontend

- Unit: Componentes isolados
- Integration: Páginas completas
- E2E: Cypress (fluxos críticos)

## Deploy

### Recomendações

**Backend:**
- Heroku, Railway, Render
- Variáveis de ambiente seguras
- Migrations automáticas
- Health check endpoint

**Frontend:**
- Vercel, Netlify
- SSR desabilitado (páginas client)
- CDN automático

**Database:**
- Supabase, Neon, Railway
- Backups automáticos
- SSL obrigatório

## Monitoramento

### Logs

- Servidor iniciado
- Jobs executados
- E-mails enviados/falhos
- Erros de SMTP

### Alertas

- Falhas > 10% em 1 hora
- SMTP não configurado
- Banco de dados offline
- Fila de e-mails travada

---

**Última atualização:** 2024
**Versão:** 1.0.0
