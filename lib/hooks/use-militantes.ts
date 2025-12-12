'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Militante {
    militante_id: string
    usuario_id: string
    nombres: string
    apellidos: string
    numero_documento: string
    tipo_documento: string
    celular: string | null
    usuario_email: string | null
    tipo: string
    coordinador_id: string | null
    coordinador_email: string | null
    coordinador_nombre: string | null
    compromiso_marketing: string | null
    compromiso_cautivo: string | null
    compromiso_impacto: string | null
    formulario: string | null
    perfil_id: string | null
    perfil_nombre: string | null
    ciudad_nombre: string | null
    zona_nombre: string | null
    estado: string
    creado_en: string
    actualizado_en: string
}

interface FiltrosMilitantes {
    busqueda?: string
    estado?: string
}

interface CrearMilitanteData {
    usuario_id: string
    tipo: string
    coordinador_id?: string
    compromiso_marketing?: string
    compromiso_cautivo?: string
    compromiso_impacto?: string
    formulario?: string
    perfil_id?: string
}

interface ActualizarMilitanteData {
    tipo?: string
    coordinador_id?: string
    compromiso_marketing?: string
    compromiso_cautivo?: string
    compromiso_impacto?: string
    formulario?: string
    perfil_id?: string
    estado?: string
}

export function useMilitantes() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    async function listar(filtros: FiltrosMilitantes = {}, page = 1, pageSize = 10) {
        try {
            setLoading(true)
            setError(null)

            // Usar la API route en lugar de consultar directamente
            const params = new URLSearchParams({
                page: page.toString(),
                pageSize: pageSize.toString(),
            })

            if (filtros.busqueda) {
                params.append('busqueda', filtros.busqueda)
            }

            if (filtros.estado) {
                params.append('estado', filtros.estado)
            }

            const response = await fetch(`/api/militante?${params.toString()}`)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al listar militantes')
            }

            const result = await response.json()

            return {
                data: (result.data as Militante[]) || [],
                count: result.count || 0,
                page: result.page || page,
                pageSize: result.pageSize || pageSize,
                totalPages: result.totalPages || Math.ceil((result.count || 0) / pageSize),
            }
        } catch (err) {
            console.error('Error completo en listar militantes:', err)
            const error = err instanceof Error ? err : new Error(`Error desconocido: ${JSON.stringify(err)}`)
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    async function obtenerPorId(id: string) {
        try {
            setLoading(true)
            setError(null)

            const { data, error: queryError } = await supabase
                .from('v_militantes_completo')
                .select('*')
                .eq('militante_id', id)
                .single()

            if (queryError) throw queryError

            return data as Militante
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido')
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    async function crear(militanteData: CrearMilitanteData) {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/militante', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(militanteData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al crear militante')
            }

            const data = await response.json()
            return data
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido')
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    async function actualizar(id: string, militanteData: ActualizarMilitanteData) {
        try {
            setLoading(true)
            setError(null)

            const { data, error: updateError } = await supabase
                .from('militantes')
                .update(militanteData)
                .eq('id', id)
                .select()
                .single()

            if (updateError) throw updateError

            return data
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido')
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    async function eliminar(id: string) {
        try {
            setLoading(true)
            setError(null)

            const { error: deleteError } = await supabase.from('militantes').delete().eq('id', id)

            if (deleteError) throw deleteError

            return true
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido')
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    async function cambiarEstado(id: string, nuevoEstado: 'activo' | 'inactivo' | 'suspendido') {
        try {
            setLoading(true)
            setError(null)

            const { data, error: updateError } = await supabase
                .from('militantes')
                .update({ estado: nuevoEstado })
                .eq('id', id)
                .select()
                .single()

            if (updateError) throw updateError

            return data
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido')
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    return {
        listar,
        obtenerPorId,
        crear,
        actualizar,
        eliminar,
        cambiarEstado,
        loading,
        error,
    }
}

