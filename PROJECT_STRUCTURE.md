# 📁 Estrutura do Projeto

## Visão Geral

Este repositório contém **3 aplicações**:

1. **Vite App (Root)** - Página de informações do projeto
2. **Backend (Node.js)** - API REST e sistema de disparo
3. **Frontend (Next.js)** - Interface administrativa completa

---

## 🎯 Diretório Raiz (Vite App)

**Propósito:** Página informativa sobre o projeto

**Arquivos principais:**
```
/
├── src/
│   ├── app/App.tsx           # App React principal
│   └── styles/               # CSS/Tailwind
├── package.json              # Dependências Vite/React
├── vite.config.ts            # Configuração Vite
├── tsconfig.json             # TypeScript config
└── __figma__entrypoint__.ts  # Entry point Figma Make
```

**Como executar:**
```bash
# Já está rodando automaticamente no ambiente Figma Make
# Ou manualmente:
pnpm dev
```

**Acesso:** Esta página é informativa e contém instruções de setup.

---

## 🖥️ Backend (Node.js + Express)

**Localização:** `/backend`

**Propósito:** API REST completa para gerenciamento de e-mails

**Arquivos principais:**
```
backend/
├── src/
│   ├── controllers/          # 5 controllers (CRUD)
│   ├── services/            # emailService (Nodemailer)
│   ├── jobs/                # Cron jobs para disparo
│   ├── routes/              # Rotas da API
│   ├── middleware/          # Error handling
│   ├── utils/               # Crypto
│   └── server.ts            # Entry point
├── prisma/
│   ├── schema.prisma        # Schema do DB
│   └── seed.ts              # Dados iniciais
├── package.json
└── tsconfig.json
```

**Instalação:**
```bash
cd backend
pnpm install
cp .env.example .env
# Edite o .env

# Configurar banco
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed

# Executar
pnpm dev
```

**Porta:** `http://localhost:3001`

**Endpoints:** Ver `API.md` na raiz

---

## 🎨 Frontend (Next.js + Ant Design)

**Localização:** `/frontend`

**Propósito:** Interface administrativa completa

**Arquivos principais:**
```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Dashboard
│   │   ├── destinatarios/page.tsx      # CRUD Destinatários
│   │   ├── templates/page.tsx          # Editor Templates
│   │   ├── configuracoes/page.tsx      # Config SMTP
│   │   ├── datas-comemorativas/page.tsx
│   │   └── historico/page.tsx          # Relatórios
│   ├── components/
│   │   └── MainLayout.tsx              # Layout base
│   ├── services/
│   │   └── api.ts                      # Axios instance
│   └── types/
│       └── index.ts                    # TypeScript types
├── package.json
└── tsconfig.json
```

**Instalação:**
```bash
cd frontend
pnpm install
cp .env.local.example .env.local
# Edite o .env.local

# Executar
pnpm dev
```

**Porta:** `http://localhost:3000`

**Páginas:**
- `/` - Dashboard
- `/destinatarios` - Gerenciar destinatários
- `/templates` - Editor de templates
- `/configuracoes` - Config SMTP
- `/datas-comemorativas` - Datas profissionais
- `/historico` - Histórico de disparos

---

## 🗄️ Banco de Dados

**Tecnologia:** PostgreSQL

**Tabelas:**
- `destinatarios` - Pessoas que receberão e-mails
- `templates` - Templates de e-mail (HTML)
- `configuracao_smtp` - Config do servidor SMTP
- `datas_comemorativas` - Datas por profissão
- `historico_disparos` - Log de todos os envios

**Gerenciar:**
```bash
cd backend

# Prisma Studio (GUI)
pnpm prisma:studio

# Migrations
pnpm prisma:migrate

# Resetar (CUIDADO!)
pnpm prisma:migrate reset
```

---

## 🚀 Fluxo de Desenvolvimento

### Setup Inicial

```bash
# 1. Criar banco
createdb email_dispatcher

# 2. Backend
cd backend
pnpm install
cp .env.example .env
# Editar DATABASE_URL no .env
pnpm prisma:migrate
pnpm prisma:seed

# 3. Frontend  
cd ../frontend
pnpm install
cp .env.local.example .env.local

# 4. Executar (2 terminais)
# Terminal 1:
cd backend && pnpm dev

# Terminal 2:
cd frontend && pnpm dev
```

### Desenvolvimento

**Adicionar novo endpoint no backend:**
1. Criar controller em `backend/src/controllers/`
2. Adicionar rota em `backend/src/routes/`
3. Testar com cURL ou Postman

**Adicionar nova página no frontend:**
1. Criar `frontend/src/app/nome-pagina/page.tsx`
2. Adicionar link no `MainLayout.tsx`
3. Criar interface TypeScript em `types/index.ts`

**Modificar banco de dados:**
1. Editar `backend/prisma/schema.prisma`
2. `pnpm prisma:migrate`
3. Atualizar types no frontend

---

## 📦 Scripts Úteis

### Raiz
```bash
pnpm dev              # Vite app (página info)
pnpm install:all      # Instalar tudo
pnpm dev:backend      # Backend
pnpm dev:frontend     # Frontend
pnpm db:migrate       # Migrations
pnpm db:seed          # Seed
pnpm db:studio        # Prisma Studio
```

### Backend
```bash
pnpm dev              # Dev server
pnpm build            # Build TypeScript
pnpm start            # Produção
pnpm prisma:generate  # Gerar Prisma Client
pnpm prisma:migrate   # Executar migrations
pnpm prisma:seed      # Popular banco
pnpm prisma:studio    # GUI do banco
```

### Frontend
```bash
pnpm dev              # Dev server
pnpm build            # Build Next.js
pnpm start            # Produção
pnpm lint             # ESLint
```

---

## 🐳 Docker

**Executar tudo com Docker:**
```bash
docker-compose up -d
```

**Serviços:**
- PostgreSQL: porta 5432
- Backend: porta 3001
- Frontend: porta 3000

**Logs:**
```bash
docker-compose logs -f
```

**Parar:**
```bash
docker-compose down
```

---

## 📚 Documentação

Toda a documentação está na raiz:

| Arquivo | Conteúdo |
|---------|----------|
| `README.md` | Visão geral e guia completo |
| `INSTALL.md` | Instalação detalhada |
| `QUICKSTART.md` | Início rápido |
| `API.md` | Documentação da API REST |
| `ARCHITECTURE.md` | Arquitetura técnica |
| `CONTRIBUTING.md` | Como contribuir |
| `CHANGELOG.md` | Histórico de versões |
| `PRD-MVP-Email-Personalizado.md` | Especificação original |

---

## ⚠️ Notas Importantes

### Ambiente Figma Make
- A raiz é um app Vite gerenciado pelo Figma Make
- Não modificar `__figma__entrypoint__.ts`
- Backend e Frontend são independentes

### Portas
- **Root Vite:** Gerenciado pelo Figma Make
- **Backend:** 3001
- **Frontend:** 3000
- **PostgreSQL:** 5432

### Variáveis de Ambiente

**Backend (`.env`):**
```env
DATABASE_URL="postgresql://..."
PORT=3001
ENCRYPTION_KEY="..."
```

**Frontend (`.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Estrutura Independente

- Backend e Frontend são **aplicações separadas**
- Podem ser deployadas independentemente
- Frontend consome API do Backend via HTTP
- Raiz (Vite) é apenas informativa

---

## 🎯 Caso de Uso Típico

1. **Desenvolvedor acessa root:** Vê página informativa
2. **Segue instruções:** Configura backend e frontend
3. **Acessa frontend:** `http://localhost:3000`
4. **Configura SMTP:** Em "Configurações"
5. **Cadastra destinatários:** Em "Destinatários"
6. **Sistema funciona:** Dispara e-mails automaticamente

---

## 🤝 Contribuindo

Veja `CONTRIBUTING.md` para guia completo.

---

**Última atualização:** 2024
**Versão:** 1.0.0
