# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-01-15

### Adicionado

#### Backend
- Sistema completo de API REST com Express.js e TypeScript
- CRUD completo de destinatários
- CRUD completo de templates de e-mail
- Gerenciamento de configuração SMTP
- CRUD de datas comemorativas por profissão
- Sistema de jobs com node-cron para disparo automático
- Serviço de envio de e-mails com Nodemailer
- Histórico completo de disparos com filtros
- Endpoint de estatísticas de envio
- Preview de templates com substituição de variáveis
- Teste de conexão SMTP
- Validação de dados com Joi
- Criptografia de senhas SMTP
- Middleware de tratamento de erros
- Health check endpoint
- Seed inicial com templates e datas comemorativas

#### Frontend
- Interface completa em Next.js 14 com Ant Design
- Dashboard com métricas e próximos aniversários
- Página de gerenciamento de destinatários com busca e paginação
- Página de templates com preview em tempo real
- Página de configuração SMTP com teste de conexão
- Página de datas comemorativas
- Página de histórico com filtros avançados
- Layout responsivo com sidebar
- Tratamento de erros e loading states
- Validação de formulários

#### Database
- Schema Prisma completo com 5 tabelas
- Migrations automáticas
- Seeds para dados iniciais
- Relacionamentos entre tabelas
- Índices para performance

#### Infraestrutura
- Dockerfiles para backend e frontend
- docker-compose.yml completo
- Script de instalação rápida (quick-start.sh)
- Variáveis de ambiente configuráveis

#### Documentação
- README.md completo com instruções
- INSTALL.md com guia de instalação
- ARCHITECTURE.md com arquitetura detalhada
- API.md com documentação de endpoints
- CONTRIBUTING.md com guia de contribuição
- PRD.md com especificação do produto

### Funcionalidades Principais

- ✅ Disparo automático de e-mails de aniversário
- ✅ Disparo automático de e-mails profissionais
- ✅ Templates personalizáveis com variáveis
- ✅ Configuração de horário de disparo
- ✅ Histórico completo com status
- ✅ Preview de templates
- ✅ Busca e filtros em todas as listagens
- ✅ Estatísticas de envio
- ✅ Proteção contra duplicação de envios
- ✅ Delay entre envios (respeitando limites SMTP)
- ✅ Criptografia de senhas

### Tecnologias

**Backend:**
- Node.js 18+
- TypeScript 5.3
- Express.js 4.18
- Prisma ORM 5.7
- PostgreSQL
- Nodemailer 6.9
- node-cron 3.0
- Joi 17.11
- bcrypt 5.1

**Frontend:**
- Next.js 14.0
- React 18.2
- Ant Design 5.12
- Axios 1.6
- Day.js 1.11
- TypeScript 5.3

### Segurança

- Senhas SMTP criptografadas com AES-256-CBC
- Validação de todos os inputs
- Proteção contra SQL injection (via Prisma)
- Sanitização de e-mails
- Rate limiting no envio de e-mails

---

## [Unreleased]

### Planejado

- [ ] Autenticação de usuários
- [ ] Multi-tenancy
- [ ] Fila de e-mails com Bull/Redis
- [ ] Anexos em e-mails
- [ ] Editor visual de templates
- [ ] Múltiplos provedores SMTP
- [ ] Webhooks para eventos
- [ ] API pública
- [ ] Testes automatizados
- [ ] CI/CD com GitHub Actions
- [ ] Logs estruturados
- [ ] Métricas com Prometheus
- [ ] Dashboard de analytics avançado
- [ ] Exportação de relatórios (CSV/PDF)
- [ ] Agendamento manual de e-mails
- [ ] Grupos de destinatários
- [ ] A/B testing de templates

### Em Consideração

- [ ] Suporte a outros idiomas
- [ ] Modo escuro
- [ ] Notificações push
- [ ] Integração com CRMs
- [ ] API GraphQL
- [ ] Mobile app (React Native)

---

## Versionamento

- **MAJOR** version: Mudanças incompatíveis na API
- **MINOR** version: Funcionalidades novas (compatíveis)
- **PATCH** version: Correções de bugs

---

## Links

- [Repositório](https://github.com/seu-usuario/email-dispatcher)
- [Issues](https://github.com/seu-usuario/email-dispatcher/issues)
- [Pull Requests](https://github.com/seu-usuario/email-dispatcher/pulls)
