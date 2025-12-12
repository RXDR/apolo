import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    try {
        // Usar adminClient para evitar problemas con RLS
        const adminClient = createAdminClient()

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '10')
        const busqueda = searchParams.get('busqueda') || ''
        const estado = searchParams.get('estado') || ''

        // Intentar usar la vista primero, si falla usar la tabla directamente
        let query = (adminClient as any).from('v_militantes_completo').select('*', { count: 'exact' })

        // Si la vista no existe, usar la tabla con joins
        try {
            // Aplicar filtros
            if (busqueda) {
                query = query.or(`nombres.ilike.%${busqueda}%,apellidos.ilike.%${busqueda}%,numero_documento.ilike.%${busqueda}%`)
            }

            if (estado) {
                query = query.eq('estado', estado)
            }

            // Paginación
            const from = (page - 1) * pageSize
            const to = from + pageSize - 1
            query = query.range(from, to).order('creado_en', { ascending: false })

            const { data, error, count } = await query

            if (error) {
                console.error('Error listando militantes desde vista:', error)
                // Si falla la vista, intentar con la tabla directamente
                throw error
            }

            return NextResponse.json({
                data,
                count,
                page,
                pageSize,
                totalPages: Math.ceil((count || 0) / pageSize),
            })
        } catch (viewError: any) {
            // Si la vista no existe, usar la tabla directamente con joins
            console.warn('Vista no disponible, usando tabla directamente:', viewError.message)
            
            let tableQuery = (adminClient as any)
                .from('militantes')
                .select('*, usuarios!militantes_usuario_id_fkey(nombres, apellidos, numero_documento, tipo_documento, celular, email), coordinadores(email), perfiles(nombre)', { count: 'exact' })

            // Aplicar filtros en la tabla
            if (busqueda) {
                tableQuery = tableQuery.or(`usuarios.nombres.ilike.%${busqueda}%,usuarios.apellidos.ilike.%${busqueda}%,usuarios.numero_documento.ilike.%${busqueda}%`)
            }

            if (estado) {
                tableQuery = tableQuery.eq('estado', estado)
            }

            // Paginación
            const from = (page - 1) * pageSize
            const to = from + pageSize - 1
            tableQuery = tableQuery.range(from, to).order('creado_en', { ascending: false })

            const { data, error: tableError, count } = await tableQuery

            if (tableError) {
                console.error('Error listando militantes desde tabla:', tableError)
                return NextResponse.json({ error: tableError.message }, { status: 500 })
            }

            return NextResponse.json({
                data,
                count,
                page,
                pageSize,
                totalPages: Math.ceil((count || 0) / pageSize),
            })
        }
    } catch (error: any) {
        console.error('Error en GET /api/militante:', error)
        return NextResponse.json({ error: `Error interno del servidor: ${error.message || error}` }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const adminClient = createAdminClient()
        const body = await request.json()

        let { usuario_id, tipo, coordinador_id, compromiso_marketing, compromiso_cautivo, compromiso_impacto, formulario, perfil_id } = body

        // Validaciones básicas
        if (!usuario_id || !tipo) {
            return NextResponse.json({ 
                error: 'Faltan campos requeridos: usuario_id y tipo son obligatorios' 
            }, { status: 400 })
        }

        // Validar formato UUID
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (!uuidRegex.test(usuario_id)) {
            return NextResponse.json({ 
                error: `usuario_id no tiene formato UUID válido: ${usuario_id}` 
            }, { status: 400 })
        }

        // Sanitización de campos UUID vacíos
        if (perfil_id === "") perfil_id = null;
        if (coordinador_id === "") coordinador_id = null;

        // Verificar que el usuario existe
        const { data: usuario, error: usuarioError } = await (adminClient as any)
            .from('usuarios')
            .select('id, nombres, apellidos')
            .eq('id', usuario_id)
            .single()

        if (usuarioError || !usuario) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        // Verificar coordinador si se proporciona
        if (coordinador_id) {
            if (!uuidRegex.test(coordinador_id)) {
                return NextResponse.json({ 
                    error: `coordinador_id no tiene formato UUID válido: ${coordinador_id}` 
                }, { status: 400 })
            }

            const { data: coordinador, error: coordError } = await (adminClient as any)
                .from('coordinadores')
                .select('id')
                .eq('id', coordinador_id)
                .single()

            if (coordError || !coordinador) {
                return NextResponse.json({ error: 'Coordinador no encontrado' }, { status: 404 })
            }
        }

        // Crear militante
        const { data: militante, error: militanteError } = await (adminClient as any)
            .from('militantes')
            .insert({
                usuario_id,
                tipo,
                coordinador_id: coordinador_id || null,
                compromiso_marketing: compromiso_marketing || null,
                compromiso_cautivo: compromiso_cautivo || null,
                compromiso_impacto: compromiso_impacto || null,
                formulario: formulario || null,
                perfil_id: perfil_id || null,
            })
            .select()
            .single()

        if (militanteError) {
            console.error('Error creando militante:', militanteError)
            return NextResponse.json({ error: militanteError.message }, { status: 500 })
        }

        return NextResponse.json(militante, { status: 201 })
    } catch (error: any) {
        console.error('Error en POST /api/militante:', error)
        return NextResponse.json({ error: `Error interno del servidor: ${error.message || error}` }, { status: 500 })
    }
}

