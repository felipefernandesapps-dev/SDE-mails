-- Migration: adjust-schema (generated manually)
-- Adds created_at to configuracao_smtp, index on historico_disparos.data_disparo,
-- enforces ON DELETE CASCADE for template relation, and constrains data_comemorativa length.

-- 1) Add created_at to configuracao_smtp
ALTER TABLE IF EXISTS configuracao_smtp
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- 2) Add index on historico_disparos(data_disparo)
CREATE INDEX IF NOT EXISTS idx_historico_disparos_data_disparo
  ON historico_disparos (data_disparo);

-- 3) Recreate foreign key on historico_disparos.template_id with ON DELETE CASCADE
DO $$
DECLARE
  conname text;
BEGIN
  SELECT c.conname INTO conname
  FROM pg_constraint c
  JOIN pg_class t ON c.conrelid = t.oid
  WHERE t.relname = 'historico_disparos' AND c.contype = 'f'
    AND EXISTS (
      SELECT 1 FROM pg_attribute a
      WHERE a.attrelid = t.oid AND a.attnum = ANY(c.conkey) AND a.attname = 'template_id'
    )
  LIMIT 1;

  IF conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE historico_disparos DROP CONSTRAINT %I', conname);
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Could not drop existing FK constraint: %', SQLERRM;
END$$;

ALTER TABLE IF EXISTS historico_disparos
  ADD CONSTRAINT fk_historico_template FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE;

-- 4) Change data_comemorativa to varchar(5)
ALTER TABLE IF EXISTS datas_comemorativas
  ALTER COLUMN data_comemorativa TYPE varchar(5);

-- End of migration
