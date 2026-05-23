# 🔄 Guia de Migration - Horários Separados

## Mudanças Implementadas

A partir desta versão, o sistema suporta **horários separados** para:
- ✅ E-mails de **Aniversário**
- ✅ E-mails de **Datas Profissionais**

## O que mudou?

### Backend

#### 1. Schema Prisma
```prisma
model ConfiguracaoSmtp {
  // ANTES:
  horarioDisparo String @default("09:00")
  
  // DEPOIS:
  horarioDisparoAniversario String @default("09:00")
  horarioDisparoProfissao   String @default("10:00")
}
```

#### 2. Scheduler
- Dois jobs separados agora:
  - Job de Aniversários (executa no horário configurado para aniversários)
  - Job de Profissões (executa no horário configurado para profissões)

#### 3. API Endpoint
```typescript
// POST /api/config/smtp
{
  "servidor": "smtp.gmail.com",
  "porta": 587,
  "usuario": "email@gmail.com",
  "senha": "senha-app",
  "horarioDisparoAniversario": "09:00",  // NOVO
  "horarioDisparoProfissao": "10:00"     // NOVO
}
```

### Frontend

#### Tela de Configurações
- Dois campos TimePicker:
  1. **Horário de Disparo - Aniversários**
  2. **Horário de Disparo - Datas Profissionais**

## Como Migrar

### Opção 1: Nova Instalação

Se está instalando pela primeira vez, siga o guia normal:

```bash
cd backend
pnpm prisma:migrate
pnpm prisma:seed
```

### Opção 2: Banco Existente

Se já tem o banco configurado, execute a migration:

```bash
cd backend

# Gerar nova migration
pnpm prisma:migrate

# OU aplicar migration SQL manual
psql -U seu_usuario -d email_dispatcher < prisma/migrations/add_separate_schedule_times.sql
```

### Opção 3: Migration Manual

```sql
-- Conecte ao banco PostgreSQL
psql -U postgres -d email_dispatcher

-- Execute os comandos:
ALTER TABLE "configuracao_smtp" 
ADD COLUMN "horario_disparo_aniversario" TEXT NOT NULL DEFAULT '09:00',
ADD COLUMN "horario_disparo_profissao" TEXT NOT NULL DEFAULT '10:00';

UPDATE "configuracao_smtp"
SET 
  "horario_disparo_aniversario" = "horario_disparo",
  "horario_disparo_profissao" = "horario_disparo";

ALTER TABLE "configuracao_smtp" DROP COLUMN "horario_disparo";
```

## Comportamento Padrão

Se você já tinha uma configuração SMTP:
- ✅ O horário antigo será copiado para AMBOS os novos campos
- ✅ Você pode então alterar cada um individualmente

Valores padrão para novas instalações:
- **Aniversários:** 09:00
- **Profissões:** 10:00

## Verificar Migração

```bash
# Acessar Prisma Studio
cd backend
pnpm prisma:studio

# Verificar tabela configuracao_smtp
# Deve ter os campos:
# - horario_disparo_aniversario
# - horario_disparo_profissao
```

## Impacto nos Jobs

### Antes
- 1 job executava às `horarioDisparo` e enviava:
  - Aniversários
  - Profissões

### Depois
- 2 jobs independentes:
  - Job 1: Aniversários às `horarioDisparoAniversario`
  - Job 2: Profissões às `horarioDisparoProfissao`

## Vantagens

✅ **Flexibilidade:** Configure horários diferentes  
✅ **Distribuição:** Evite picos de envio  
✅ **Controle:** Gerencie cada tipo separadamente  

## Exemplo de Uso

```
Configuração:
- Aniversários: 08:00 (início do expediente)
- Profissões: 14:00 (após almoço)

Resultado:
- 08:00 → Sistema verifica e envia aniversários do dia
- 14:00 → Sistema verifica e envia datas profissionais
```

## Troubleshooting

### Erro: Column not found
**Causa:** Migration não aplicada  
**Solução:** Execute `pnpm prisma:migrate`

### Jobs não executam
**Causa:** Scheduler não reiniciou  
**Solução:** Reinicie o backend: `pnpm dev`

### Frontend não salva
**Causa:** API antiga  
**Solução:** Verifique se o backend está atualizado

## Rollback (se necessário)

Se precisar reverter:

```sql
ALTER TABLE "configuracao_smtp" 
ADD COLUMN "horario_disparo" TEXT NOT NULL DEFAULT '09:00';

UPDATE "configuracao_smtp"
SET "horario_disparo" = "horario_disparo_aniversario";

ALTER TABLE "configuracao_smtp" 
DROP COLUMN "horario_disparo_aniversario",
DROP COLUMN "horario_disparo_profissao";
```

**⚠️ Atenção:** Isso perderá a configuração separada de horários.

---

**Data:** 2024-05-22  
**Versão:** 1.1.0  
**Breaking Change:** Sim (requer migration)
