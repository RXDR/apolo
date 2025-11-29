'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'

interface Coordinador {
    coordinador_id: string
    email: string
    estado: string
    tipo: 'Coordinador' | 'Estructurador' | null
    usuario_id: string
    nombres: string
    apellidos: string
    numero_documento: string
    tipo_documento: string
    celular: string | null
    ciudad_nombre: string | null
    zona_nombre: string | null
    rol: string | null
    perfil_id: string | null
    referencia_id: string | null
    referencia_nombre: string | null
    creado_en: string
    actualizado_en: string
}

interface FiltrosCoordinadores {
    busqueda?: string
    estado?: string
    perfil_id?: string
    tipo?: string
}

interface CrearCoordinadorData {
    usuario_id: string
    email: string
    password: string
    perfil_id?: string
    referencia_coordinador_id?: string
    tipo: 'Coordinador' | 'Estructurador'
}

interface ActualizarCoordinadorData {
    perfil_id?: string
    referencia_coordinador_id?: string
    estado?: string
    tipo?: 'Coordinador' | 'Estructurador'
}

export function useCoordinadores() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    async function listar(filtros: FiltrosCoordinadores = {}, page = 1, pageSize = 10) {
        try {
            setLoading(true)
            setError(null)

            let query = supabase
                .from('v_coordinadores_completo')
                .select('*', { count: 'exact' })

            // Aplicar filtros
            if (filtros.busqueda) {
                query = query.or(
                    `nombres.ilike.%${filtros.busqueda}%,apellidos.ilike.%${filtros.busqueda}%,numero_documento.ilike.%${filtros.busqueda}%,email.ilike.%${filtros.busqueda}%`
                )
            }

            if (filtros.estado) {
                query = query.eq('estado', filtros.estado)
            }

            if (filtros.perfil_id) {
                query = query.eq('perfil_id', filtros.perfil_id)
            }

            // Paginación
            const from = (page - 1) * pageSize
            const to = from + pageSize - 1
            query = query.range(from, to)

            // Ordenar
            query = query.order('creado_en', { ascending: false })

            const { data, error: queryError, count } = await query

            if (queryError) throw queryError

            return {
                data: (data as Coordinador[]) || [],
                count: count || 0,
                page,
                pageSize,
                totalPages: Math.ceil((count || 0) / pageSize),
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido')
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
                .from('v_coordinadores_completo')
                .select('*')
                .eq('coordinador_id', id)
                .single()

            if (queryError) throw queryError

            return data as Coordinador
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido')
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    async function crear(coordinadorData: CrearCoordinadorData) {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch('/api/coordinador', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(coordinadorData),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al crear coordinador')
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

    async function actualizar(id: string, coordinadorData: ActualizarCoordinadorData) {
        try {
            setLoading(true)
            setError(null)

            const { data, error: updateError } = await supabase
                .from('coordinadores')
                .update(coordinadorData)
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

            const { error: deleteError } = await supabase.from('coordinadores').delete().eq('id', id)

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
                .from('coordinadores')
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

    async function buscarCoordinadores(termino: string) {
        try {
            setLoading(true)
            setError(null)

            if (!termino || termino.length < 3) return []

            const { data, error: queryError } = await supabase
                .from('v_coordinadores_completo')
                .select('coordinador_id, nombres, apellidos, email')
                .or(`nombres.ilike.%${termino}%,apellidos.ilike.%${termino}%,email.ilike.%${termino}%`)
                .limit(10)

            if (queryError) throw queryError

            return data || []
        } catch (err) {
            console.error('Error buscando coordinadores:', err)
            return []
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
        buscarCoordinadores,
        loading,
        error,
    }
}
