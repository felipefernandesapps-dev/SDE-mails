# 🚀 Guia de Instalação Rápida

## Opção 1: Instalação Completa (Desenvolvimento)

### 1. Instalar dependências

```bash
# Backend
cd backend
pnpm install

# Frontend
cd ../frontend
pnpm install
```

### 2. Configurar PostgreSQL

```bash
# Criar banco de dados
createdb email_dispatcher

# Ou via psql
psql -U postgres
CREATE DATABASE email_dispatcher;
\q
```

### 3. Configurar variáveis de ambiente

**Backend (.env):**
```bash
cd backend
cp .env.example .env
```

Edite o `.env`:
```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/email_dispatcher?schema=public"
PORT=3001
NODE_ENV=development
ENCRYPTION_KEY=minha-chave-super-secreta-32char
```

**Frontend (.env.local):**
```bash
cd ../frontend
cp .env.local.example .env.local
```

Edite o `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 4. Inicializar banco de dados

```bash
cd backend
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

### 5. Iniciar servidores

**Terminal 1 - Backend:**
```bash
cd backend
pnpm dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
pnpm dev
```

### 6. Acessar o sistema

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Prisma Studio: `pnpm prisma:studio`

---

## Opção 2: Docker (Recomendado para Produção)

### 1. Criar docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: email_dispatcher
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/email_dispatcher?schema=public"
      PORT: 3001
      NODE_ENV: production
      ENCRYPTION_KEY: sua-chave-aqui-32-caracteres
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 2. Executar

```bash
docker-compose up -d
```

---

## Primeira Configuração

### 1. Configurar SMTP

1. Acesse http://localhost:3000/configuracoes
2. Preencha:
   - Servidor: `smtp.gmail.com`
   - Porta: `587`
   - Usuário: `seuemail@gmail.com`
   - Senha: (senha de app do Google)
   - Horário: `09:00`
3. Clique em "Testar Conexão"
4. Salve

### 2. Cadastrar Destinatários

1. Acesse http://localhost:3000/destinatarios
2. Clique em "Novo Destinatário"
3. Preencha os dados
4. Salve

### 3. Verificar Templates

1. Acesse http://localhost:3000/templates
2. Veja os templates pré-configurados
3. Edite se necessário

### 4. Monitorar Disparos

1. Acesse http://localhost:3000/historico
2. Veja o histórico de envios
3. Confira estatísticas

---

## Comandos Úteis

### Backend

```bash
# Ver logs do servidor
cd backend && pnpm dev

# Acessar banco via Prisma Studio
pnpm prisma:studio

# Resetar banco (CUIDADO!)
pnpm prisma:migrate reset

# Ver estrutura do banco
pnpm prisma:generate && pnpm prisma:studio
```

### Frontend

```bash
# Limpar cache do Next.js
rm -rf .next

# Build para produção
pnpm build
pnpm start
```

### PostgreSQL

```bash
# Backup do banco
pg_dump email_dispatcher > backup.sql

# Restaurar backup
psql email_dispatcher < backup.sql

# Acessar banco
psql -U postgres -d email_dispatcher
```

---

## Verificação de Instalação

Execute estes comandos para verificar se tudo está OK:

```bash
# Verificar se PostgreSQL está rodando
pg_isready

# Verificar se backend está OK
curl http://localhost:3001/health

# Verificar tabelas criadas
cd backend && pnpm prisma:studio
```

---

## Problemas Comuns

### "Error: P1001: Can't reach database server"

**Solução:** PostgreSQL não está rodando
```bash
# Linux
sudo systemctl start postgresql

# macOS
brew services start postgresql

# Windows
net start postgresql-x64-15
```

### "Error: P3009: Failed to create migration"

**Solução:** Banco não existe
```bash
createdb email_dispatcher
```

### "EADDRINUSE: address already in use"

**Solução:** Porta já está em uso
```bash
# Matar processo na porta 3001
lsof -ti:3001 | xargs kill -9

# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9
```

---

## Próximos Passos

1. ✅ Configurar SMTP do Gmail
2. ✅ Cadastrar alguns destinatários
3. ✅ Testar preview de templates
4. ✅ Aguardar horário de disparo configurado
5. ✅ Verificar histórico de envios

**Pronto! Seu sistema está funcionando!** 🎉
