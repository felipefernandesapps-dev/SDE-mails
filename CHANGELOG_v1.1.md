# 📋 Changelog v1.1.0 - Horários Separados

## 🎯 Nova Funcionalidade

### Horários de Disparo Separados

Agora você pode configurar **horários diferentes** para:
- 📅 **E-mails de Aniversário**
- 💼 **E-mails de Datas Profissionais**

## ✨ Benefícios

1. **Maior Flexibilidade**
   - Configure o melhor horário para cada tipo de e-mail
   - Exemplo: Aniversários às 08:00, Profissões às 14:00

2. **Melhor Distribuição**
   - Evite enviar todos os e-mails de uma vez
   - Reduza picos de carga no servidor SMTP

3. **Controle Independente**
   - Gerencie cada tipo de disparo separadamente
   - Logs e monitoramento mais detalhados

## 🔧 Mudanças Técnicas

### Backend

#### Schema do Banco
```sql
-- ANTES
horario_disparo VARCHAR DEFAULT '09:00'

-- DEPOIS
horario_disparo_aniversario VARCHAR DEFAULT '09:00'
horario_disparo_profissao VARCHAR DEFAULT '10:00'
```

#### API Endpoint
```typescript
POST /api/config/smtp
{
  "servidor": "smtp.gmail.com",
  "porta": 587,
  "usuario": "email@gmail.com",
  "senha": "senha-app",
  "horarioDisparoAniversario": "09:00",  // ✨ NOVO
  "horarioDisparoProfissao": "10:00"     // ✨ NOVO
}
```

#### Scheduler
```typescript
// ANTES: 1 job único
cron.schedule(horarioDisparo, async () => {
  await processarAniversariantes();
  await processarDatasComemorativas();
});

// DEPOIS: 2 jobs separados
cron.schedule(horarioDisparoAniversario, async () => {
  await processarAniversariantes();
});

cron.schedule(horarioDisparoProfissao, async () => {
  await processarDatasComemorativas();
});
```

### Frontend

#### Configurações SMTP
- ✅ Campo: "Horário de Disparo - Aniversários"
- ✅ Campo: "Horário de Disparo - Datas Profissionais"
- ✅ Tooltips explicativos
- ✅ Validação de formato HH:mm

## 📦 Arquivos Modificados

### Backend
- ✅ `prisma/schema.prisma` - Schema atualizado
- ✅ `src/controllers/smtpController.ts` - Validação e save
- ✅ `src/jobs/scheduler.ts` - Dois jobs separados
- ✅ `prisma/migrations/add_separate_schedule_times.sql` - Migration

### Frontend (Next.js)
- ✅ `src/types/index.ts` - Interface atualizada
- ✅ `src/app/configuracoes/page.tsx` - Dois campos de horário

### Frontend (Visualização)
- ✅ `src/app/pages/Configuracoes.tsx` - Dois campos com tooltips

### Documentação
- ✅ `MIGRATION_GUIDE.md` - Guia de migração completo
- ✅ `CHANGELOG_v1.1.md` - Este arquivo

## 🚀 Como Atualizar

### 1. Atualizar Código
```bash
git pull origin main
```

### 2. Instalar Dependências
```bash
cd backend && pnpm install
cd ../frontend && pnpm install
```

### 3. Migrar Banco de Dados
```bash
cd backend
pnpm prisma:migrate
```

### 4. Reiniciar Aplicação
```bash
# Terminal 1 - Backend
cd backend && pnpm dev

# Terminal 2 - Frontend
cd frontend && pnpm dev
```

### 5. Atualizar Configuração
1. Acesse **Configurações SMTP**
2. Defina os horários:
   - **Aniversários:** Escolha o horário ideal
   - **Profissões:** Escolha o horário ideal
3. Salve

## 🔍 Verificação

### Logs do Scheduler
```
[Scheduler] Job de ANIVERSÁRIOS agendado para 09:00 (0 9 * * *)
[Scheduler] Job de PROFISSÕES agendado para 10:00 (0 10 * * *)
```

### Execução
```
[Scheduler] Executando job de ANIVERSÁRIOS às 09:00
[Job] Processando aniversariantes do dia...

[Scheduler] Executando job de PROFISSÕES às 10:00
[Job] Processando datas comemorativas...
```

## ⚠️ Breaking Changes

### API
❌ Campo `horarioDisparo` removido  
✅ Novos campos: `horarioDisparoAniversario` e `horarioDisparoProfissao`

### Banco de Dados
❌ Coluna `horario_disparo` removida  
✅ Novas colunas: `horario_disparo_aniversario` e `horario_disparo_profissao`

### Migration Automática
✅ Valores antigos copiados automaticamente para ambos os novos campos

## 💡 Casos de Uso

### Caso 1: Mesmo Horário
```
Aniversários: 09:00
Profissões: 09:00
→ Comportamento igual à versão anterior
```

### Caso 2: Horários Distribuídos
```
Aniversários: 08:00 (início expediente)
Profissões: 14:00 (após almoço)
→ Distribuição ao longo do dia
```

### Caso 3: Prioridade
```
Aniversários: 07:00 (primeiro)
Profissões: 17:00 (final do dia)
→ Aniversários têm prioridade
```

## 📊 Impacto

### Performance
- ✅ Sem impacto negativo
- ✅ Melhor distribuição de carga

### SMTP
- ✅ Respeita limites do Gmail (500/dia)
- ✅ Evita picos de envio

### Usuário
- ✅ Mais controle
- ✅ Interface intuitiva
- ✅ Sem necessidade de reconfiguração

## 🐛 Bug Fixes

Nenhum bug conhecido nesta versão.

## 📝 Notas

- Configurações antigas são migradas automaticamente
- Ambos os horários herdam o valor original de `horarioDisparo`
- Você pode personalizar cada um após a migration

## 🔮 Próximos Passos

Funcionalidades planejadas:
- [ ] Horários por dia da semana
- [ ] Múltiplos horários por tipo
- [ ] Fuso horário por destinatário
- [ ] Agendamento manual de envios

---

**Versão:** 1.1.0  
**Data:** 2024-05-22  
**Tipo:** Feature Release  
**Breaking Change:** Sim (requer migration)
