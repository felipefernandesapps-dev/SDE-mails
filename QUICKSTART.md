# ⚡ Quick Start Guide

## 📥 Instalação em 5 Minutos

### Passo 1: Clonar e Instalar

```bash
# Clone o projeto
git clone <url>
cd email-dispatcher

# Opção A: Script automático (Linux/Mac)
chmod +x quick-start.sh
./quick-start.sh

# Opção B: Manual
cd backend && pnpm install
cd ../frontend && pnpm install
```

### Passo 2: Configurar PostgreSQL

```bash
# Criar banco
createdb email_dispatcher

# Configurar .env
cd backend
cp .env.example .env
# Edite DATABASE_URL no .env
```

### Passo 3: Inicializar Banco

```bash
cd backend
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

### Passo 4: Iniciar Servidores

**Terminal 1:**
```bash
cd backend
pnpm dev
```

**Terminal 2:**
```bash
cd frontend
pnpm dev
```

### Passo 5: Acessar

Abra http://localhost:3000

---

## 🎯 Primeiros Passos no Sistema

### 1. Configurar SMTP (OBRIGATÓRIO)

1. Vá em **Configurações SMTP**
2. Gere senha de app no Google: https://myaccount.google.com/apppasswords
3. Preencha:
   ```
   Servidor: smtp.gmail.com
   Porta: 587
   Usuário: seuemail@gmail.com
   Senha: (senha de app de 16 caracteres)
   Horário: 09:00
   ```
4. Clique em **Testar Conexão**
5. Se OK, clique em **Salvar**

### 2. Adicionar Destinatários

1. Vá em **Destinatários**
2. Clique em **Novo Destinatário**
3. Preencha:
   ```
   Nome: João Silva
   E-mail: joao@example.com
   Data de Aniversário: 15/05/1990
   Profissão: Médico
   Ativo: Sim
   ```
4. Salvar

Adicione pelo menos 3-5 destinatários para testar.

### 3. Ver Templates

1. Vá em **Templates**
2. Dois templates já estão criados:
   - Template de Aniversário
   - Template de Profissão
3. Clique em **Preview** para ver como ficará
4. Edite se quiser personalizar

### 4. Verificar Datas Comemorativas

1. Vá em **Datas Comemorativas**
2. Já existem 12 profissões cadastradas
3. Adicione mais se necessário

### 5. Testar o Sistema

#### Opção A: Aguardar Disparo Automático
- O sistema enviará e-mails no horário configurado
- Vá em **Histórico** para verificar

#### Opção B: Testar Manualmente (Dev)
```bash
# No terminal do backend, abra o console Node
node
> const { processarAniversariantes } = require('./dist/jobs/emailDispatchJob');
> await processarAniversariantes();
```

### 6. Monitorar Disparos

1. Vá em **Dashboard**
   - Veja total de e-mails
   - Taxa de sucesso
   - Próximos aniversários

2. Vá em **Histórico**
   - Veja todos os disparos
   - Filtre por data/status
   - Identifique erros

---

## 🎨 Interface Rápida

```
┌─────────────────────────────────────────────┐
│  📧 E-mail System                           │
├─────────────────────────────────────────────┤
│                                             │
│  📊 Dashboard                               │
│  ├─ Total: 150 e-mails                      │
│  ├─ Enviados: 145 (96%)                     │
│  └─ Próximos aniversários (7 dias)          │
│                                             │
│  👥 Destinatários                           │
│  ├─ Listar todos                            │
│  ├─ Adicionar novo                          │
│  └─ Buscar/filtrar                          │
│                                             │
│  📧 Templates                               │
│  ├─ Aniversário                             │
│  ├─ Profissão                               │
│  └─ Preview com variáveis                   │
│                                             │
│  📅 Datas Comemorativas                     │
│  ├─ Médico: 18/10                           │
│  ├─ Professor: 15/10                        │
│  └─ Programador: 13/09                      │
│                                             │
│  📊 Histórico                               │
│  ├─ Filtrar por data                        │
│  ├─ Filtrar por status                      │
│  └─ Estatísticas                            │
│                                             │
│  ⚙️  Configurações SMTP                     │
│  ├─ Servidor/Porta                          │
│  ├─ Credenciais                             │
│  ├─ Horário de disparo                      │
│  └─ Testar conexão                          │
│                                             │
└─────────────────────────────────────────────┘
```

---

## ✅ Checklist de Configuração

- [ ] PostgreSQL instalado e rodando
- [ ] Backend instalado (`cd backend && pnpm install`)
- [ ] Frontend instalado (`cd frontend && pnpm install`)
- [ ] Arquivo `.env` configurado
- [ ] Migrations executadas (`pnpm prisma:migrate`)
- [ ] Seed executado (`pnpm prisma:seed`)
- [ ] Backend rodando (porta 3001)
- [ ] Frontend rodando (porta 3000)
- [ ] SMTP configurado e testado
- [ ] Pelo menos 1 destinatário cadastrado
- [ ] Templates revisados

---

## 🐛 Problemas Comuns

### PostgreSQL não conecta

```bash
# Verificar se está rodando
pg_isready

# Iniciar PostgreSQL
# Linux
sudo systemctl start postgresql

# macOS
brew services start postgresql
```

### Porta já em uso

```bash
# Backend (3001)
lsof -ti:3001 | xargs kill -9

# Frontend (3000)
lsof -ti:3000 | xargs kill -9
```

### Erro no SMTP

- ✅ Use senha de APP (não senha normal)
- ✅ Ative 2FA no Google
- ✅ Verifique servidor/porta
- ✅ Tente gerar nova senha de app

### E-mails não são enviados

- ✅ Verifique logs do backend
- ✅ Confirme horário de disparo
- ✅ Veja histórico para erros
- ✅ Verifique se há destinatários elegíveis hoje

---

## 📱 Usando Docker (Alternativa)

```bash
# Iniciar tudo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down
```

Acesse: http://localhost:3000

---

## 🎯 Fluxo Típico de Uso

```
1️⃣  Configurar SMTP
     ↓
2️⃣  Cadastrar destinatários
     ↓
3️⃣  Personalizar templates (opcional)
     ↓
4️⃣  Adicionar datas comemorativas (opcional)
     ↓
5️⃣  Sistema roda automaticamente
     ↓
6️⃣  Monitorar histórico
```

---

## 📚 Documentação Completa

- **README.md** - Visão geral e instalação
- **INSTALL.md** - Guia de instalação detalhado
- **ARCHITECTURE.md** - Arquitetura do sistema
- **API.md** - Documentação da API REST
- **CONTRIBUTING.md** - Como contribuir

---

## 🚀 Pronto!

Seu sistema está funcionando! Em poucos minutos você terá:
- ✅ E-mails de aniversário automáticos
- ✅ E-mails profissionais automáticos
- ✅ Dashboard com estatísticas
- ✅ Histórico completo de envios

**Próximos passos:**
- Personalize os templates
- Adicione mais datas comemorativas
- Cadastre todos os seus destinatários
- Configure o horário ideal de disparo

Alguma dúvida? Consulte a documentação ou abra uma issue!
