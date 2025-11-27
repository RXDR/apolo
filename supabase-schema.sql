-- =====================================================
-- SCRIPT SQL COMPLETO PARA SUPABASE
-- CRM Político APOLO - Sistema de Usuarios y Permisos
-- Fecha: 27 de noviembre de 2025
-- =====================================================

-- =====================================================
-- 1. EXTENSIONES Y CONFIGURACIÓN INICIAL
-- =====================================================

-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Habilitar extensión para funciones de texto
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- 2. TABLAS DE CATÁLOGOS
-- =====================================================

-- Tabla: ciudades
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

CREATE INDEX IF NOT EXISTS idx_ciudades_nombre ON public.ciudades(nombre);
CREATE INDEX IF NOT EXISTS idx_ciudades_activo ON public.ciudades(activo);

COMMENT ON TABLE public.ciudades IS 'Catálogo de ciudades';

-- Tabla: localidades
CREATE TABLE IF NOT EXISTS public.localidades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20),
    ciudad_id UUID REFERENCES public.ciudades(id) ON DELETE CASCADE,
    activo BOOLEAN DEFAULT true,
    orden INTEGER,
    
    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(nombre, ciudad_id)
);

CREATE INDEX IF NOT EXISTS idx_localidades_nombre ON public.localidades(nombre);
CREATE INDEX IF NOT EXISTS idx_localidades_ciudad ON public.localidades(ciudad_id);
CREATE INDEX IF NOT EXISTS idx_localidades_activo ON public.localidades(activo);

COMMENT ON TABLE public.localidades IS 'Catálogo de localidades por ciudad';

-- Tabla: barrios
CREATE TABLE IF NOT EXISTS public.barrios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20),
    localidad_id UUID REFERENCES public.localidades(id) ON DELETE CASCADE,
    ciudad_id UUID REFERENCES public.ciudades(id) ON DELETE CASCADE,
    activo BOOLEAN DEFAULT true,
    orden INTEGER,
    
    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(nombre, localidad_id)
);

CREATE INDEX IF NOT EXISTS idx_barrios_nombre ON public.barrios(nombre);
CREATE INDEX IF NOT EXISTS idx_barrios_localidad ON public.barrios(localidad_id);
CREATE INDEX IF NOT EXISTS idx_barrios_ciudad ON public.barrios(ciudad_id);
CREATE INDEX IF NOT EXISTS idx_barrios_activo ON public.barrios(activo);

COMMENT ON TABLE public.barrios IS 'Catálogo de barrios por localidad';

-- Tabla: zonas
CREATE TABLE IF NOT EXISTS public.zonas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    codigo VARCHAR(20),
    color VARCHAR(7), -- Color hex para visualización en mapas
    activo BOOLEAN DEFAULT true,
    
    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_zonas_nombre ON public.zonas(nombre);
CREATE INDEX IF NOT EXISTS idx_zonas_activo ON public.zonas(activo);

COMMENT ON TABLE public.zonas IS 'Catálogo de zonas de trabajo';

-- Tabla: tipos_referencia
CREATE TABLE IF NOT EXISTS public.tipos_referencia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    orden INTEGER,
    
    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tipos_referencia_nombre ON public.tipos_referencia(nombre);

COMMENT ON TABLE public.tipos_referencia IS 'Catálogo de tipos de referencia personal';

-- Tabla: niveles_escolaridad
CREATE TABLE IF NOT EXISTS public.niveles_escolaridad (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    orden INTEGER,
    activo BOOLEAN DEFAULT true,
    
    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.niveles_escolaridad IS 'Catálogo de niveles educativos';

-- Tabla: tipos_vivienda
CREATE TABLE IF NOT EXISTS public.tipos_vivienda (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    orden INTEGER,
    activo BOOLEAN DEFAULT true,
    
    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.tipos_vivienda IS 'Catálogo de tipos de vivienda';

-- =====================================================
-- 3. TABLAS PRINCIPALES
-- =====================================================
----usuarionueva----
create table public.usuarios (
  id uuid not null default extensions.uuid_generate_v4 (),
  tipo_documento character varying(20) null default 'Cédula'::character varying,
  numero_documento character varying(30) not null,
  nombres character varying(100) not null,
  apellidos character varying(100) not null,
  email character varying(255) null,
  foto_perfil_url text null,
  celular character varying(20) null,
  telefono_fijo character varying(20) null,
  whatsapp character varying(20) null,
  telefono character varying(20) null,
  direccion text null,
  barrio_id uuid null,
  barrio_nombre character varying(100) null,
  localidad_id uuid null,
  localidad_nombre character varying(100) null,
  ciudad_id uuid null,
  ciudad_nombre character varying(100) null,
  fecha_nacimiento date null,
  lugar_nacimiento character varying(100) null,
  genero character varying(20) null,
  estado_civil character varying(30) null,
  numero_hijos integer null default 0,
  nivel_escolaridad character varying(50) null,
  perfil_ocupacion character varying(100) null,
  tipo_vivienda character varying(50) null,
  talla_camisa character varying(10) null,
  facebook character varying(255) null,
  twitter character varying(255) null,
  instagram character varying(255) null,
  linkedin character varying(255) null,
  tiktok character varying(255) null,
  nombre_familiar_cercano character varying(200) null,
  celular_familiar_cercano character varying(20) null,
  referencia_seleccion character varying(100) null,
  telefono_referencia character varying(20) null,
  ubicacion character varying(200) null,
  cargo_actual character varying(100) null,
  beneficiario character varying(100) null,
  zona_id uuid null,
  zona_nombre character varying(100) null,
  tipo_referencia_id uuid null,
  compromiso_marketing integer null default 0,
  compromiso_impacto integer null default 0,
  compromiso_cautivo integer null default 0,
  latitud numeric(10, 8) null,
  longitud numeric(11, 8) null,
  auth_user_id uuid null,
  ultimo_acceso timestamp with time zone null,
  estado character varying(20) null default 'activo'::character varying,
  creado_en timestamp with time zone null default now(),
  actualizado_en timestamp with time zone null default now(),
  creado_por uuid null,
  actualizado_por uuid null,
  compromiso_privado character varying(100) null,
  observaciones text null,
  tiene_hijos boolean null default false,
  estrato character varying(20) null,
  ingresos_rango character varying(50) null,
  lider_responsable character varying(255) null,
  referido_por character varying(255) null,
  constraint usuarios_pkey primary key (id),
  constraint usuarios_numero_documento_key unique (numero_documento),
  constraint usuarios_email_key unique (email),
  constraint usuarios_actualizado_por_fkey foreign KEY (actualizado_por) references usuarios (id),
  constraint usuarios_auth_user_id_fkey foreign KEY (auth_user_id) references auth.users (id) on delete CASCADE,
  constraint usuarios_creado_por_fkey foreign KEY (creado_por) references usuarios (id),
  constraint usuarios_barrio_id_fkey foreign KEY (barrio_id) references barrios (id) on delete set null,
  constraint usuarios_localidad_id_fkey foreign KEY (localidad_id) references localidades (id) on delete set null,
  constraint usuarios_ciudad_id_fkey foreign KEY (ciudad_id) references ciudades (id) on delete set null,
  constraint usuarios_zona_id_fkey foreign KEY (zona_id) references zonas (id) on delete set null,
  constraint usuarios_tipo_referencia_id_fkey foreign KEY (tipo_referencia_id) references tipos_referencia (id) on delete set null,
  constraint chk_estado check (
    (
      (estado)::text = any (
        (
          array[
            'activo'::character varying,
            'inactivo'::character varying,
            'suspendido'::character varying
          ]
        )::text[]
      )
    )
  ),
  constraint chk_genero check (
    (
      (genero)::text = any (
        (
          array[
            'Masculino'::character varying,
            'Femenino'::character varying,
            'Otro'::character varying,
            'Género'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_usuarios_documento on public.usuarios using btree (numero_documento) TABLESPACE pg_default;

create index IF not exists idx_usuarios_tipo_documento on public.usuarios using btree (tipo_documento) TABLESPACE pg_default;

create index IF not exists idx_usuarios_email on public.usuarios using btree (email) TABLESPACE pg_default;

create index IF not exists idx_usuarios_estado on public.usuarios using btree (estado) TABLESPACE pg_default;

create index IF not exists idx_usuarios_zona on public.usuarios using btree (zona_id) TABLESPACE pg_default;

create index IF not exists idx_usuarios_localidad on public.usuarios using btree (localidad_id) TABLESPACE pg_default;

create index IF not exists idx_usuarios_ciudad on public.usuarios using btree (ciudad_id) TABLESPACE pg_default;

create index IF not exists idx_usuarios_barrio on public.usuarios using btree (barrio_id) TABLESPACE pg_default;

create index IF not exists idx_usuarios_nombres_apellidos on public.usuarios using btree (nombres, apellidos) TABLESPACE pg_default;

create index IF not exists idx_usuarios_auth_user on public.usuarios using btree (auth_user_id) TABLESPACE pg_default;

create trigger trigger_actualizar_usuarios BEFORE
update on usuarios for EACH row
execute FUNCTION actualizar_timestamp ();
-------------------
-- Tabla: usuarios


-- Índices para usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_documento ON public.usuarios(numero_documento);
CREATE INDEX IF NOT EXISTS idx_usuarios_tipo_documento ON public.usuarios(tipo_documento);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON public.usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_estado ON public.usuarios(estado);
CREATE INDEX IF NOT EXISTS idx_usuarios_zona ON public.usuarios(zona_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_localidad ON public.usuarios(localidad_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_ciudad ON public.usuarios(ciudad_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_barrio ON public.usuarios(barrio_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_nombres_apellidos ON public.usuarios(nombres, apellidos);
CREATE INDEX IF NOT EXISTS idx_usuarios_auth_user ON public.usuarios(auth_user_id);

COMMENT ON TABLE public.usuarios IS 'Tabla principal de usuarios/personas del sistema CRM político';
COMMENT ON COLUMN public.usuarios.auth_user_id IS 'Referencia al usuario de autenticación de Supabase';

-- Tabla: perfiles
CREATE TABLE IF NOT EXISTS public.perfiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    nivel_jerarquico INTEGER,
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    
    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.perfiles IS 'Roles o perfiles de usuario del sistema';

-- Tabla: modulos
CREATE TABLE IF NOT EXISTS public.modulos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    icono VARCHAR(50),
    ruta VARCHAR(255),
    orden INTEGER,
    modulo_padre_id UUID REFERENCES public.modulos(id) ON DELETE CASCADE,
    
    -- Estado
    activo BOOLEAN DEFAULT true,
    obligatorio BOOLEAN DEFAULT false,
    
    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_modulos_nombre ON public.modulos(nombre);
CREATE INDEX IF NOT EXISTS idx_modulos_activo ON public.modulos(activo);
CREATE INDEX IF NOT EXISTS idx_modulos_padre ON public.modulos(modulo_padre_id);

COMMENT ON TABLE public.modulos IS 'Módulos funcionales del sistema';

-- Tabla: permisos
CREATE TABLE IF NOT EXISTS public.permisos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    
    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_permisos_codigo ON public.permisos(codigo);

COMMENT ON TABLE public.permisos IS 'Permisos granulares del sistema (CRUD, etc.)';

-- Tabla: perfil_permiso_modulo (Tabla pivote)
CREATE TABLE IF NOT EXISTS public.perfil_permiso_modulo (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relaciones
    perfil_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
    modulo_id UUID NOT NULL REFERENCES public.modulos(id) ON DELETE CASCADE,
    permiso_id UUID NOT NULL REFERENCES public.permisos(id) ON DELETE CASCADE,
    
    -- Restricciones adicionales
    condiciones JSONB,
    
    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_por UUID REFERENCES public.usuarios(id),
    
    -- Constraint para evitar duplicados
    UNIQUE(perfil_id, modulo_id, permiso_id)
);

CREATE INDEX IF NOT EXISTS idx_ppm_perfil ON public.perfil_permiso_modulo(perfil_id);
CREATE INDEX IF NOT EXISTS idx_ppm_modulo ON public.perfil_permiso_modulo(modulo_id);
CREATE INDEX IF NOT EXISTS idx_ppm_permiso ON public.perfil_permiso_modulo(permiso_id);
CREATE INDEX IF NOT EXISTS idx_ppm_perfil_modulo ON public.perfil_permiso_modulo(perfil_id, modulo_id);

COMMENT ON TABLE public.perfil_permiso_modulo IS 'Tabla pivote que relaciona perfiles, módulos y permisos';

-- Tabla: usuario_perfil
CREATE TABLE IF NOT EXISTS public.usuario_perfil (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relaciones
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    perfil_id UUID NOT NULL REFERENCES public.perfiles(id) ON DELETE CASCADE,
    
    -- Perfil principal
    es_principal BOOLEAN DEFAULT false,
    
    -- Vigencia
    fecha_asignacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_revocacion TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN DEFAULT true,
    
    -- Auditoría
    asignado_por UUID REFERENCES public.usuarios(id),
    
    -- Constraint para evitar duplicados activos
    UNIQUE(usuario_id, perfil_id)
);

CREATE INDEX IF NOT EXISTS idx_up_usuario ON public.usuario_perfil(usuario_id);
CREATE INDEX IF NOT EXISTS idx_up_perfil ON public.usuario_perfil(perfil_id);
CREATE INDEX IF NOT EXISTS idx_up_activo ON public.usuario_perfil(activo);

COMMENT ON TABLE public.usuario_perfil IS 'Asignación de perfiles a usuarios';

-- Tabla: jerarquia_usuarios
CREATE TABLE IF NOT EXISTS public.jerarquia_usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relaciones
    usuario_id UUID NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    superior_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    
    -- Tipo de relación
    tipo_relacion VARCHAR(50),
    
    -- Vigencia
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_fin TIMESTAMP WITH TIME ZONE,
    activo BOOLEAN DEFAULT true,
    
    -- Auditoría
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    creado_por UUID REFERENCES public.usuarios(id)
);

CREATE INDEX IF NOT EXISTS idx_jerarquia_usuario ON public.jerarquia_usuarios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_jerarquia_superior ON public.jerarquia_usuarios(superior_id);
CREATE INDEX IF NOT EXISTS idx_jerarquia_activo ON public.jerarquia_usuarios(activo);

COMMENT ON TABLE public.jerarquia_usuarios IS 'Estructura jerárquica organizacional';

-- =====================================================
-- 4. FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar timestamp automáticamente
CREATE OR REPLACE FUNCTION public.actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualización automática de timestamps
CREATE TRIGGER trigger_actualizar_usuarios
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_timestamp();

CREATE TRIGGER trigger_actualizar_perfiles
    BEFORE UPDATE ON public.perfiles
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_timestamp();

CREATE TRIGGER trigger_actualizar_modulos
    BEFORE UPDATE ON public.modulos
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_timestamp();

CREATE TRIGGER trigger_actualizar_ciudades
    BEFORE UPDATE ON public.ciudades
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_timestamp();

CREATE TRIGGER trigger_actualizar_localidades
    BEFORE UPDATE ON public.localidades
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_timestamp();

CREATE TRIGGER trigger_actualizar_barrios
    BEFORE UPDATE ON public.barrios
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_timestamp();

CREATE TRIGGER trigger_actualizar_zonas
    BEFORE UPDATE ON public.zonas
    FOR EACH ROW
    EXECUTE FUNCTION public.actualizar_timestamp();

-- Función para verificar permisos de usuario
CREATE OR REPLACE FUNCTION public.tiene_permiso(
    p_usuario_id UUID,
    p_modulo_nombre VARCHAR,
    p_permiso_codigo VARCHAR
) RETURNS BOOLEAN AS $$
DECLARE
    v_tiene_permiso BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM public.usuario_perfil up
        JOIN public.perfil_permiso_modulo ppm ON up.perfil_id = ppm.perfil_id
        JOIN public.modulos m ON ppm.modulo_id = m.id
        JOIN public.permisos pm ON ppm.permiso_id = pm.id
        WHERE up.usuario_id = p_usuario_id
        AND up.activo = true
        AND m.nombre = p_modulo_nombre
        AND pm.codigo = p_permiso_codigo
        AND m.activo = true
    ) INTO v_tiene_permiso;
    
    RETURN v_tiene_permiso;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.tiene_permiso IS 'Verifica si un usuario tiene un permiso específico en un módulo';

-- Función para obtener permisos de usuario
CREATE OR REPLACE FUNCTION public.obtener_permisos_usuario(p_usuario_id UUID)
RETURNS TABLE (
    modulo_nombre VARCHAR,
    modulo_ruta VARCHAR,
    permiso_codigo VARCHAR,
    permiso_nombre VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.nombre as modulo_nombre,
        m.ruta as modulo_ruta,
        pm.codigo as permiso_codigo,
        pm.nombre as permiso_nombre
    FROM public.usuario_perfil up
    JOIN public.perfil_permiso_modulo ppm ON up.perfil_id = ppm.perfil_id
    JOIN public.modulos m ON ppm.modulo_id = m.id
    JOIN public.permisos pm ON ppm.permiso_id = pm.id
    WHERE up.usuario_id = p_usuario_id
    AND up.activo = true
    AND m.activo = true
    ORDER BY m.orden, pm.codigo;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.obtener_permisos_usuario IS 'Obtiene todos los permisos de un usuario';

-- =====================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modulos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permisos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfil_permiso_modulo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuario_perfil ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jerarquia_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ciudades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.localidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barrios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zonas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_referencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.niveles_escolaridad ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tipos_vivienda ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Usuarios pueden ver su propia información"
    ON public.usuarios FOR SELECT
    USING (auth.uid() = auth_user_id);

CREATE POLICY "Usuarios con permiso pueden ver todos los usuarios"
    ON public.usuarios FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios u
            JOIN public.usuario_perfil up ON u.id = up.usuario_id
            JOIN public.perfil_permiso_modulo ppm ON up.perfil_id = ppm.perfil_id
            JOIN public.modulos m ON ppm.modulo_id = m.id
            JOIN public.permisos p ON ppm.permiso_id = p.id
            WHERE u.auth_user_id = auth.uid()
            AND m.nombre = 'Módulo Personas'
            AND p.codigo = 'READ'
            AND up.activo = true
        )
    );

CREATE POLICY "Usuarios con permiso pueden crear usuarios"
    ON public.usuarios FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.usuarios u
            JOIN public.usuario_perfil up ON u.id = up.usuario_id
            JOIN public.perfil_permiso_modulo ppm ON up.perfil_id = ppm.perfil_id
            JOIN public.modulos m ON ppm.modulo_id = m.id
            JOIN public.permisos p ON ppm.permiso_id = p.id
            WHERE u.auth_user_id = auth.uid()
            AND m.nombre = 'Módulo Personas'
            AND p.codigo = 'CREATE'
            AND up.activo = true
        )
    );

CREATE POLICY "Usuarios con permiso pueden actualizar usuarios"
    ON public.usuarios FOR UPDATE
    USING (
        auth.uid() = auth_user_id OR
        EXISTS (
            SELECT 1 FROM public.usuarios u
            JOIN public.usuario_perfil up ON u.id = up.usuario_id
            JOIN public.perfil_permiso_modulo ppm ON up.perfil_id = ppm.perfil_id
            JOIN public.modulos m ON ppm.modulo_id = m.id
            JOIN public.permisos p ON ppm.permiso_id = p.id
            WHERE u.auth_user_id = auth.uid()
            AND m.nombre = 'Módulo Personas'
            AND p.codigo = 'UPDATE'
            AND up.activo = true
        )
    );

-- Políticas para catálogos (lectura pública para usuarios autenticados)
CREATE POLICY "Usuarios autenticados pueden leer ciudades"
    ON public.ciudades FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden leer localidades"
    ON public.localidades FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden leer barrios"
    ON public.barrios FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden leer zonas"
    ON public.zonas FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden leer tipos_referencia"
    ON public.tipos_referencia FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden leer niveles_escolaridad"
    ON public.niveles_escolaridad FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden leer tipos_vivienda"
    ON public.tipos_vivienda FOR SELECT
    USING (auth.role() = 'authenticated');

-- Políticas para perfiles, módulos y permisos (solo lectura para autenticados)
CREATE POLICY "Usuarios autenticados pueden leer perfiles"
    ON public.perfiles FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden leer módulos"
    ON public.modulos FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Usuarios autenticados pueden leer permisos"
    ON public.permisos FOR SELECT
    USING (auth.role() = 'authenticated');

-- Políticas para usuario_perfil
CREATE POLICY "Usuarios pueden ver sus propios perfiles"
    ON public.usuario_perfil FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.usuarios u
            WHERE u.id = usuario_id
            AND u.auth_user_id = auth.uid()
        )
    );

-- =====================================================
-- 6. DATOS INICIALES (SEED DATA)
-- =====================================================

-- Insertar perfiles iniciales
INSERT INTO public.perfiles (nombre, descripcion, nivel_jerarquico) VALUES
('Sin rol asignado', 'Usuario sin rol específico asignado', 99),
('Candidato', 'Candidato principal de la campaña', 1),
('Dirigente', 'Dirigente de alto nivel', 2),
('Coordinador Político', 'Coordinador de área política', 3),
('Jefe de Sistemas', 'Responsable de sistemas y tecnología', 3),
('Gerencia Campaña', 'Gerente de campaña', 3),
('Gestión', 'Personal de gestión operativa', 4),
('Control Interno', 'Auditoría y control interno', 4)
ON CONFLICT (nombre) DO NOTHING;

-- Insertar módulos obligatorios
INSERT INTO public.modulos (nombre, descripcion, orden, obligatorio, ruta, icono) VALUES
('Actividades', 'Gestión de actividades y eventos de campaña', 1, true, '/dashboard/actividades', 'calendar'),
('Gestión Gerencial', 'Reportes y métricas de rendimiento', 2, true, '/dashboard/gestion-gerencial', 'chart-bar'),
('Alistamiento de Debate', 'Preparación y gestión de debates', 3, true, '/dashboard/alistamiento-debate', 'message-square'),
('Módulo Personas', 'Base de datos de personas y fichas técnicas', 4, true, '/dashboard/personas', 'users'),
('Crear/Asignar Datos', 'Creación y asignación de datos', 5, true, '/dashboard/asignar-datos', 'database'),
('Agenda y Eventos', 'Calendario y gestión de reuniones', 6, false, '/dashboard/agenda', 'calendar-check'),
('Gestión de Terreno', 'Visitas y geolocalización', 7, false, '/dashboard/terreno', 'map-pin'),
('Administración', 'Gestión de usuarios y configuración', 8, false, '/dashboard/admin', 'settings')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar permisos CRUD básicos
INSERT INTO public.permisos (nombre, descripcion, codigo) VALUES
('Crear', 'Permiso para crear nuevos registros', 'CREATE'),
('Leer', 'Permiso para ver/leer registros', 'READ'),
('Actualizar', 'Permiso para editar registros existentes', 'UPDATE'),
('Eliminar', 'Permiso para eliminar registros', 'DELETE'),
('Exportar', 'Permiso para exportar datos', 'EXPORT'),
('Importar', 'Permiso para importar datos', 'IMPORT'),
('Aprobar', 'Permiso para aprobar acciones', 'APPROVE'),
('Administrar', 'Permiso de administración completa', 'ADMIN')
ON CONFLICT (codigo) DO NOTHING;

-- Insertar catálogos iniciales
INSERT INTO public.ciudades (nombre, codigo, orden) VALUES
('Bogotá', 'BOG', 1),
('Medellín', 'MED', 2),
('Cali', 'CAL', 3),
('Barranquilla', 'BAQ', 4),
('Cartagena', 'CTG', 5)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO public.niveles_escolaridad (nombre, orden) VALUES
('Primaria', 1),
('Bachillerato', 2),
('Técnico', 3),
('Tecnólogo', 4),
('Profesional', 5),
('Especialización', 6),
('Maestría', 7),
('Doctorado', 8),
('Ninguno', 9)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO public.tipos_vivienda (nombre, orden) VALUES
('Propia', 1),
('Arrendada', 2),
('Familiar', 3),
('Otra', 4)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO public.tipos_referencia (nombre, orden) VALUES
('Familiar', 1),
('Amigo', 2),
('Compañero de trabajo', 3),
('Vecino', 4),
('Otro', 5)
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO public.zonas (nombre, codigo, color) VALUES
('Zona Norte', 'ZN', '#FF5733'),
('Zona Sur', 'ZS', '#33FF57'),
('Zona Centro', 'ZC', '#3357FF'),
('Zona Oriente', 'ZO', '#F333FF'),
('Zona Occidente', 'ZOC', '#FFD700')
ON CONFLICT (nombre) DO NOTHING;

-- Asignar permisos completos al Jefe de Sistemas en todos los módulos
INSERT INTO public.perfil_permiso_modulo (perfil_id, modulo_id, permiso_id)
SELECT 
    (SELECT id FROM public.perfiles WHERE nombre = 'Jefe de Sistemas'),
    m.id,
    p.id
FROM public.modulos m
CROSS JOIN public.permisos p
ON CONFLICT (perfil_id, modulo_id, permiso_id) DO NOTHING;

-- Asignar permisos de lectura a todos los perfiles en módulos básicos
INSERT INTO public.perfil_permiso_modulo (perfil_id, modulo_id, permiso_id)
SELECT 
    pf.id,
    m.id,
    (SELECT id FROM public.permisos WHERE codigo = 'READ')
FROM public.perfiles pf
CROSS JOIN public.modulos m
WHERE pf.nombre != 'Sin rol asignado'
ON CONFLICT (perfil_id, modulo_id, permiso_id) DO NOTHING;

-- =====================================================
-- 7. VISTAS ÚTILES
-- =====================================================

-- Vista: usuarios con sus perfiles
CREATE OR REPLACE VIEW public.v_usuarios_perfiles AS
SELECT 
    u.id as usuario_id,
    u.numero_documento,
    u.tipo_documento,
    u.nombres,
    u.apellidos,
    u.email,
    u.celular,
    u.estado,
    c.nombre as ciudad,
    z.nombre as zona,
    STRING_AGG(p.nombre, ', ') as perfiles,
    u.creado_en
FROM public.usuarios u
LEFT JOIN public.usuario_perfil up ON u.id = up.usuario_id AND up.activo = true
LEFT JOIN public.perfiles p ON up.perfil_id = p.id
LEFT JOIN public.ciudades c ON u.ciudad_id = c.id
LEFT JOIN public.zonas z ON u.zona_id = z.id
GROUP BY u.id, u.numero_documento, u.tipo_documento, u.nombres, u.apellidos, 
         u.email, u.celular, u.estado, c.nombre, z.nombre, u.creado_en;

COMMENT ON VIEW public.v_usuarios_perfiles IS 'Vista de usuarios con sus perfiles asignados';

-- =====================================================
-- FIN DEL SCRIPT
-- =====================================================

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE '✅ Script ejecutado exitosamente';
    RAISE NOTICE '📊 Tablas creadas: 14';
    RAISE NOTICE '🔐 RLS habilitado en todas las tablas';
    RAISE NOTICE '📝 Datos iniciales insertados';
    RAISE NOTICE '🎯 Sistema listo para usar';
END $$;
