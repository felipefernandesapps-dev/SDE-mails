# 📧 Sistema de Disparo de E-mails Personalizados

MVP completo para gerenciamento e disparo automático de e-mails personalizados baseados em datas comemorativas (aniversários e datas profissionais).

## 🚀 Tecnologias

### Backend
- **Node.js** com TypeScript
- **Express.js** - Framework web
- **Prisma** - ORM para PostgreSQL
- **Nodemailer** - Envio de e-mails via SMTP
- **node-cron** - Agendamento de tarefas
- **Joi** - Validação de dados

### Frontend
- **Next.js 14** - Framework React
- **Ant Design** - Biblioteca de componentes UI
- **Axios** - Cliente HTTP
- **Day.js** - Manipulação de datas

### Banco de Dados
- **PostgreSQL** - Banco de dados relacional

## 📋 Funcionalidades

- ✅ Cadastro completo de destinatários (CRUD)
- ✅ Gestão de templates de e-mail com variáveis dinâmicas
- ✅ Configuração de servidor SMTP (Gmail)
- ✅ Cadastro de datas comemorativas por profissão
- ✅ Disparo automático de e-mails de aniversário
- ✅ Disparo automático de e-mails profissionais
- ✅ Histórico completo de disparos
- ✅ Dashboard com estatísticas e métricas
- ✅ Sistema de agendamento configurável
- ✅ Preview de templates

## 📁 Estrutura do Projeto

```
.
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── jobs/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── configuracoes/
│   │   │   ├── datas-comemorativas/
│   │   │   ├── destinatarios/
│   │   │   ├── historico/
│   │   │   ├── templates/
│   │   │   └── page.tsx (Dashboard)
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🔧 Instalação

### Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 12+ instalado e rodando
- pnpm (ou npm/yarn)

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd email-dispatcher
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
pnpm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas configurações
nano .env
```

**Configure o arquivo `.env`:**

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/email_dispatcher?schema=public"
PORT=3001
NODE_ENV=development
ENCRYPTION_KEY=sua-chave-secreta-aqui-32-caracteres
```

**Inicializar banco de dados:**

```bash
# Gerar cliente Prisma
pnpm prisma:generate

# Executar migrations
pnpm prisma:migrate

# Popular banco com dados iniciais (templates e datas comemorativas)
pnpm prisma:seed
```

**Iniciar servidor backend:**

```bash
# Modo desenvolvimento
pnpm dev

# Ou modo produção
pnpm build
pnpm start
```

O backend estará rodando em `http://localhost:3001`

### 3. Configurar Frontend

```bash
cd ../frontend

# Instalar dependências
pnpm install

# Copiar arquivo de ambiente
cp .env.local.example .env.local

# Editar .env.local
nano .env.local
```

**Configure o arquivo `.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

**Iniciar servidor frontend:**

```bash
pnpm dev
```

O frontend estará rodando em `http://localhost:3000`

## 📧 Configuração do Gmail SMTP

Para usar o Gmail como servidor SMTP:

1. **Ativar verificação em 2 etapas** na sua conta Google
2. Acessar: https://myaccount.google.com/apppasswords
3. **Gerar senha de app**:
   - Selecionar app: "E-mail"
   - Selecionar dispositivo: "Outro" (digite "Sistema de E-mails")
   - Copiar a senha gerada (16 caracteres)

4. No sistema, ir em **Configurações SMTP** e preencher:
   - Servidor: `smtp.gmail.com`
   - Porta: `587`
   - Usuário: `seuemail@gmail.com`
   - Senha: *Cole a senha de app gerada*
   - Horário: Defina o horário diário para disparo

5. Clicar em **Testar Conexão** antes de salvar

### Limites do Gmail

- **500 e-mails por dia** (conta gratuita)
- **100 destinatários por mensagem**
- O sistema adiciona delay de 1,5s entre envios

## 🎯 Como Usar

### 1. Dashboard

Acesse a página inicial para ver:
- Total de e-mails enviados
- Taxa de sucesso
- Próximos aniversários (7 dias)
- Últimos disparos

### 2. Cadastrar Destinatários

1. Ir em **Destinatários** → **Novo Destinatário**
2. Preencher: Nome, E-mail, Data de Aniversário, Profissão
3. Salvar

### 3. Configurar Templates

Os templates já vêm pré-configurados com o seed, mas você pode:

1. Ir em **Templates**
2. Editar templates existentes ou criar novos
3. Usar variáveis:
   - `{{nome}}` - Nome do destinatário
   - `{{email}}` - E-mail
   - `{{profissao}}` - Profissão
   - `{{data_aniversario}}` - Data formatada
   - `{{ano_atual}}` - Ano atual
4. Clicar em **Preview** para testar

### 4. Datas Comemorativas

O sistema já vem com 12 datas pré-cadastradas:
- Dia do Médico (18/10)
- Dia do Professor (15/10)
- Dia do Programador (13/09)
- E outros...

Você pode adicionar mais em **Datas Comemorativas**

### 5. Histórico

Em **Histórico** você pode:
- Ver todos os disparos realizados
- Filtrar por data e status
- Ver estatísticas de sucesso/falha
- Identificar erros de envio

## ⚙️ Funcionamento do Sistema

### Disparo Automático

O sistema usa **node-cron** para executar verificações diárias no horário configurado:

1. **Aniversários**: Verifica todos os destinatários com aniversário no dia atual
2. **Datas Profissionais**: Busca profissões com data comemorativa no dia
3. Para cada destinatário elegível:
   - Verifica se já foi enviado hoje (evita duplicação)
   - Substitui variáveis no template
   - Envia e-mail via SMTP
   - Registra no histórico (status: enviado/falha)

### Fluxo de Dados

```
1. Admin configura SMTP
2. Admin cadastra destinatários
3. Admin cria/edita templates
4. Cron job executa diariamente
5. Sistema busca destinatários elegíveis
6. Envia e-mails personalizados
7. Registra histórico
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas

- `destinatarios` - Cadastro de pessoas
- `templates` - Templates de e-mail
- `configuracao_smtp` - Config do servidor SMTP
- `datas_comemorativas` - Datas por profissão
- `historico_disparos` - Log de todos os envios

## 🧪 Testes

### Testar Conexão SMTP

Vá em **Configurações SMTP** → **Testar Conexão**

### Testar Template

1. Vá em **Templates**
2. Clique em **Preview** no template desejado
3. Selecione um destinatário
4. Veja o e-mail renderizado

### Executar Disparo Manual (Dev)

No backend, você pode executar manualmente:

```typescript
// No terminal Node
import { processarAniversariantes, processarDatasComemorativas } from './src/jobs/emailDispatchJob';

await processarAniversariantes();
await processarDatasComemorativas();
```

## 🐛 Troubleshooting

### Erro de autenticação SMTP

- ✅ Verifique se usou senha de app (não senha normal)
- ✅ Confirme que 2FA está ativado no Google
- ✅ Tente gerar nova senha de app

### E-mails não são enviados

- ✅ Verifique logs do backend
- ✅ Confirme que o cron job está rodando
- ✅ Veja o histórico para identificar erros
- ✅ Verifique se há destinatários elegíveis

### Erro de conexão com banco

- ✅ Confirme que PostgreSQL está rodando
- ✅ Verifique credenciais no `.env`
- ✅ Execute migrations: `pnpm prisma:migrate`

## 📝 Scripts Disponíveis

### Backend

```bash
pnpm dev              # Inicia em modo desenvolvimento
pnpm build            # Compila TypeScript
pnpm start            # Inicia em produção
pnpm prisma:generate  # Gera Prisma Client
pnpm prisma:migrate   # Executa migrations
pnpm prisma:seed      # Popula banco inicial
pnpm prisma:studio    # Abre Prisma Studio
```

### Frontend

```bash
pnpm dev     # Inicia em modo desenvolvimento
pnpm build   # Build para produção
pnpm start   # Inicia em produção
pnpm lint    # Executa ESLint
```

## 🚀 Deploy

### Backend (Heroku, Railway, ou VPS)

1. Configurar variáveis de ambiente
2. Executar `pnpm build`
3. Executar migrations: `pnpm prisma:migrate`
4. Executar seed (primeira vez): `pnpm prisma:seed`
5. Iniciar: `pnpm start`

### Frontend (Vercel, Netlify)

1. Configurar `NEXT_PUBLIC_API_URL` apontando para backend
2. Build automático via Git push

### Variáveis de Ambiente (Produção)

**Backend:**
```env
DATABASE_URL=postgresql://...
PORT=3001
NODE_ENV=production
ENCRYPTION_KEY=chave-super-secreta-32-caracteres
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://seu-backend.com/api
```

## 📄 Licença

MIT

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra issues ou pull requests.

## 📧 Suporte

Em caso de dúvidas, consulte a documentação ou abra uma issue.

---

**Desenvolvido com ❤️ usando Next.js, Node.js e PostgreSQL**
