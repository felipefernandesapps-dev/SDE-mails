-- Migration: Adicionar horários separados para aniversários e profissões
-- Data: 2024-05-22

-- Adicionar novas colunas
ALTER TABLE "configuracao_smtp"
ADD COLUMN "horario_disparo_aniversario" TEXT NOT NULL DEFAULT '09:00',
ADD COLUMN "horario_disparo_profissao" TEXT NOT NULL DEFAULT '10:00';

-- Copiar valores existentes do horario_disparo para os novos campos
UPDATE "configuracao_smtp"
SET
  "horario_disparo_aniversario" = "horario_disparo",
  "horario_disparo_profissao" = "horario_disparo";

-- Remover coluna antiga
ALTER TABLE "configuracao_smtp" DROP COLUMN "horario_disparo";

-- Adicionar comentários
COMMENT ON COLUMN "configuracao_smtp"."horario_disparo_aniversario" IS 'Horário para envio de e-mails de aniversário (formato HH:mm)';
COMMENT ON COLUMN "configuracao_smtp"."horario_disparo_profissao" IS 'Horário para envio de e-mails de datas comemorativas profissionais (formato HH:mm)';
