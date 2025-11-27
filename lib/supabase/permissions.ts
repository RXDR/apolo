import { supabase } from './client'
import type { Database } from './database.types'

type Usuario = Database['public']['Tables']['usuarios']['Row']
type Perfil = Database['public']['Tables']['perfiles']['Row']
type Modulo = Database['public']['Tables']['modulos']['Row']
type Permiso = Database['public']['Tables']['permisos']['Row']

/**
 * Verifica si el usuario actual tiene un permiso específico en un módulo
 */
export async function tienePermiso(
    usuarioId: string,
    moduloNombre: string,
    permisoCode: string
): Promise<boolean> {
    try {
        const { data, error } = await supabase.rpc('tiene_permiso', {
            p_usuario_id: usuarioId,
            p_modulo_nombre: moduloNombre,
            p_permiso_codigo: permisoCode,
        })

        if (error) {
            console.error('Error verificando permiso:', error)
            return false
        }

        return data || false
    } catch (error) {
        console.error('Error en tienePermiso:', error)
        return false
    }
}

/**
 * Obtiene todos los permisos del usuario actual
 */
export async function obtenerPermisosUsuario(usuarioId: string) {
    try {
        const { data, error } = await supabase.rpc('obtener_permisos_usuario', {
            p_usuario_id: usuarioId,
        })

        if (error) {
            console.error('Error obteniendo permisos:', error)
            return []
        }

        return data || []
    } catch (error) {
        console.error('Error en obtenerPermisosUsuario:', error)
        return []
    }
}

/**
 * Obtiene el usuario actual desde la sesión de Supabase
 */
export async function obtenerUsuarioActual() {
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
            return null
        }

        // Buscar el usuario en la tabla usuarios por auth_user_id
        const { data: usuario, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('auth_user_id', session.user.id)
            .single()

        if (error) {
            console.error('Error obteniendo usuario:', error)
            return null
        }

        return usuario
    } catch (error) {
        console.error('Error en obtenerUsuarioActual:', error)
        return null
    }
}

/**
 * Obtiene los perfiles asignados a un usuario
 */
export async function obtenerPerfilesUsuario(usuarioId: string) {
    try {
        const { data, error } = await supabase
            .from('usuario_perfil')
            .select(
                `
        *,
        perfiles:perfil_id (*)
      `
            )
            .eq('usuario_id', usuarioId)
            .eq('activo', true)

        if (error) {
            console.error('Error obteniendo perfiles:', error)
            return []
        }

        return data || []
    } catch (error) {
        console.error('Error en obtenerPerfilesUsuario:', error)
        return []
    }
}

/**
 * Obtiene los módulos accesibles para un usuario
 */
export async function obtenerModulosAccesibles(usuarioId: string) {
    try {
        const permisos = await obtenerPermisosUsuario(usuarioId)

        // Agrupar por módulo
        const modulosMap = new Map<string, any>()

        permisos.forEach((permiso) => {
            if (!modulosMap.has(permiso.modulo_nombre)) {
                modulosMap.set(permiso.modulo_nombre, {
                    nombre: permiso.modulo_nombre,
                    ruta: permiso.modulo_ruta,
                    permisos: [],
                })
            }

            modulosMap.get(permiso.modulo_nombre)?.permisos.push({
                codigo: permiso.permiso_codigo,
                nombre: permiso.permiso_nombre,
            })
        })

        return Array.from(modulosMap.values())
    } catch (error) {
        console.error('Error en obtenerModulosAccesibles:', error)
        return []
    }
}

/**
 * Verifica si el usuario puede acceder a una ruta específica
 */
export async function puedeAccederRuta(
    usuarioId: string,
    ruta: string
): Promise<boolean> {
    try {
        const modulos = await obtenerModulosAccesibles(usuarioId)
        return modulos.some((modulo) => modulo.ruta === ruta)
    } catch (error) {
        console.error('Error en puedeAccederRuta:', error)
        return false
    }
}

/**
 * Tipo de permiso para componentes
 */
export type PermisoComponente = {
    crear: boolean
    leer: boolean
    actualizar: boolean
    eliminar: boolean
    exportar: boolean
    importar: boolean
    aprobar: boolean
    administrar: boolean
}

/**
 * Obtiene los permisos CRUD de un usuario para un módulo específico
 */
export async function obtenerPermisosCRUD(
    usuarioId: string,
    moduloNombre: string
): Promise<PermisoComponente> {
    try {
        const permisos = await obtenerPermisosUsuario(usuarioId)

        const permisosModulo = permisos.filter(
            (p) => p.modulo_nombre === moduloNombre
        )

        return {
            crear: permisosModulo.some((p) => p.permiso_codigo === 'CREATE'),
            leer: permisosModulo.some((p) => p.permiso_codigo === 'READ'),
            actualizar: permisosModulo.some((p) => p.permiso_codigo === 'UPDATE'),
            eliminar: permisosModulo.some((p) => p.permiso_codigo === 'DELETE'),
            exportar: permisosModulo.some((p) => p.permiso_codigo === 'EXPORT'),
            importar: permisosModulo.some((p) => p.permiso_codigo === 'IMPORT'),
            aprobar: permisosModulo.some((p) => p.permiso_codigo === 'APPROVE'),
            administrar: permisosModulo.some((p) => p.permiso_codigo === 'ADMIN'),
        }
    } catch (error) {
        console.error('Error en obtenerPermisosCRUD:', error)
        return {
            crear: false,
            leer: false,
            actualizar: false,
            eliminar: false,
            exportar: false,
            importar: false,
            aprobar: false,
            administrar: false,
        }
    }
}
