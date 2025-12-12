-- =====================================================
-- GESTIÓN DE LUGARES: CIUDADES Y BARRIOS
-- =====================================================

-- 1. Tabla: ciudades
CREATE TABLE IF NOT EXISTS public.ciudades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    codigo VARCHAR(20),
    activo BOOLEAN DEFAULT true,
    orden INTEGER,
    
    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla: barrios
-- Nota: Se asume que barrios pertenece a una ciudad. 
-- Si existe la tabla localidades, se puede vincular, pero aquí lo hacemos directo a ciudad o opcional.
CREATE TABLE IF NOT EXISTS public.barrios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20),
    ciudad_id UUID REFERENCES public.ciudades(id) ON DELETE CASCADE,
    activo BOOLEAN DEFAULT true,
    orden INTEGER,
    
    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.ciudades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barrios ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (Permitir todo a usuarios autenticados por ahora para gestión)
CREATE POLICY "Auth users select ciudades" ON public.ciudades FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users insert ciudades" ON public.ciudades FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth users update ciudades" ON public.ciudades FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users delete ciudades" ON public.ciudades FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth users select barrios" ON public.barrios FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users insert barrios" ON public.barrios FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth users update barrios" ON public.barrios FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users delete barrios" ON public.barrios FOR DELETE USING (auth.role() = 'authenticated');
