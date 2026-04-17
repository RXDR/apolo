-- =====================================================
-- SCRIPT MIGRACION: Ajuste Modulo Personas a v_personas_export
-- Se agregan los campos faltantes de la plantilla de exportacion a usuarios y militantes
-- =====================================================

-- 1. Tabla Usuarios
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS fecha_registro DATE,
ADD COLUMN IF NOT EXISTS verificacion_sticker VARCHAR(255),
ADD COLUMN IF NOT EXISTS fecha_verificacion_sticker TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS observacion_verificacion_sticker TEXT,
ADD COLUMN IF NOT EXISTS nombre_verificador VARCHAR(255),
ADD COLUMN IF NOT EXISTS poblacion VARCHAR(255);

-- 2. Tabla Militantes
ALTER TABLE public.militantes
ADD COLUMN IF NOT EXISTS compromiso_difusion VARCHAR(255),
ADD COLUMN IF NOT EXISTS compromiso_proyecto VARCHAR(255);

-- NOTA: Los campos `referencia_seleccion` y `telefono_referencia` ya existen en `usuarios`
--       Los vamos a usar para almacenar en texto la referencia del Excel.

-- Tipos en supabase-schema.sql para verificar persistencia.
COMMENT ON COLUMN public.usuarios.fecha_registro IS 'Mapping from Excel: fecha';
COMMENT ON COLUMN public.usuarios.verificacion_sticker IS 'Mapping from Excel: verificacion_sticker';
COMMENT ON COLUMN public.usuarios.poblacion IS 'Mapping from Excel: poblacion';
COMMENT ON COLUMN public.militantes.compromiso_difusion IS 'Mapping from Excel: comp_difusion';
COMMENT ON COLUMN public.militantes.compromiso_proyecto IS 'Mapping from Excel: comp_proyecto';
