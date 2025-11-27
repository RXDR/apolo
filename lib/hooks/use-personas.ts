'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/database.types'

type Usuario = Database['public']['Tables']['usuarios']['Row']
type UsuarioInsert = Database['public']['Tables']['usuarios']['Insert']
type UsuarioUpdate = Database['public']['Tables']['usuarios']['Update']

interface FiltrosPersonas {
    busqueda?: string
    estado?: string
    ciudad_id?: string
    zona_id?: string
    perfil_id?: string
}

export function usePersonas() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    async function listar(filtros: FiltrosPersonas = {}, page = 1, pageSize = 10) {
        try {
            setLoading(true)
            setError(null)

            let query = supabase
                .from('usuarios')
                .select('*, ciudades(nombre), zonas(nombre)', { count: 'exact' })

            // Aplicar filtros
            if (filtros.busqueda) {
                query = query.or(
                    `nombres.ilike.%${filtros.busqueda}%,apellidos.ilike.%${filtros.busqueda}%,numero_documento.ilike.%${filtros.busqueda}%`
                )
            }

            if (filtros.estado) {
                query = query.eq('estado', filtros.estado)
            }

            if (filtros.ciudad_id) {
                query = query.eq('ciudad_id', filtros.ciudad_id)
            }

            if (filtros.zona_id) {
                query = query.eq('zona_id', filtros.zona_id)
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
                data: data || [],
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
                .from('usuarios')
                .select('*')
                .eq('id', id)
                .single()

            if (queryError) throw queryError

            return data
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido')
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    async function crear(persona: UsuarioInsert) {
        try {
            setLoading(true)
            setError(null)

            const { data, error: insertError } = await supabase
                .from('usuarios')
                .insert(persona)
                .select()
                .single()

            if (insertError) throw insertError

            return data
        } catch (err) {
            const error = err instanceof Error ? err : new Error('Error desconocido')
            setError(error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    async function actualizar(id: string, persona: UsuarioUpdate) {
        try {
            setLoading(true)
            setError(null)

            const { data, error: updateError } = await supabase
                .from('usuarios')
                .update(persona)
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

            const { error: deleteError } = await supabase.from('usuarios').delete().eq('id', id)

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
                .from('usuarios')
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
