import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient(cookies())

        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '10')
        const busqueda = searchParams.get('busqueda') || ''
        const estado = searchParams.get('estado') || ''
        const perfil_id = searchParams.get('perfil_id') || ''

        let query = supabase.from('v_coordinadores_completo').select('*', { count: 'exact' })

        // Aplicar filtros
        if (busqueda) {
            query = query.or(
                `nombres.ilike.%${busqueda}%,apellidos.ilike.%${busqueda}%,numero_documento.ilike.%${busqueda}%,email.ilike.%${busqueda}%`
            )
        }

        if (estado) {
            query = query.eq('estado', estado)
        }

        if (perfil_id) {
            query = query.eq('perfil_id', perfil_id)
        }

        // Paginación
        const from = (page - 1) * pageSize
        const to = from + pageSize - 1
        query = query.range(from, to).order('creado_en', { ascending: false })

        const { data, error, count } = await query

        if (error) {
            console.error('Error listando coordinadores:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({
            data,
            count,
            page,
            pageSize,
            totalPages: Math.ceil((count || 0) / pageSize),
        })
    } catch (error) {
        console.error('Error en GET /api/coordinador:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = createClient(cookies())
        const adminClient = createAdminClient()
        const body = await request.json()

        let { usuario_id, email, password, perfil_id, referencia_coordinador_id, tipo } = body

        // Sanitización de campos UUID vacíos
        if (perfil_id === "") perfil_id = null;
        if (referencia_coordinador_id === "") referencia_coordinador_id = null;

        // Si no hay referencia explícita, usar el mismo usuario_id como referencia.
        if (!referencia_coordinador_id && usuario_id) {
            referencia_coordinador_id = usuario_id;
        }

        // Validaciones
        if (!usuario_id || !email || !password || !tipo) {
            return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
        }

        // 1. Verificar que el usuario existe
        const { data: usuario, error: usuarioError } = await supabase
            .from('usuarios')
            .select('id')
            .eq('id', usuario_id)
            .single()

        if (usuarioError || !usuario) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        // 2. Verificar que el email no esté registrado
        const { data: emailExistente } = await supabase.from('coordinadores').select('id').eq('email', email).single()

        if (emailExistente) {
            return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
        }

        // 3. Crear usuario en Auth
        const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
        })

        if (authError) {
            console.error('Error creando usuario en Auth:', authError)
            return NextResponse.json({ error: `Error creando usuario: ${authError.message}` }, { status: 500 })
        }

        // 4. Crear coordinador en la tabla
        const { data: coordinador, error: coordinadorError } = await supabase
            .from('coordinadores')
            .insert({
                usuario_id,
                email,
                auth_user_id: authData.user.id,
                perfil_id,
                referencia_coordinador_id,
                tipo,
            })
            .select()
            .single()

        if (coordinadorError) {
            console.error('Error creando coordinador:', coordinadorError)
            // Si falla, intentar eliminar el usuario de Auth
            try {
                await adminClient.auth.admin.deleteUser(authData.user.id)
            } catch (deleteError) {
                console.error('Error eliminando usuario auth tras fallo:', deleteError)
            }
            return NextResponse.json({ error: coordinadorError.message }, { status: 500 })
        }

        // 5. Asignar perfil al usuario si se proporcionó
        if (perfil_id) {
            const { error: perfilError } = await supabase.from('usuario_perfil').insert({
                usuario_id,
                perfil_id,
                es_principal: true,
                activo: true,
            })

            if (perfilError) {
                console.error('Error asignando perfil:', perfilError)
                // No fallar por esto, solo loguear
            }
        }

        return NextResponse.json(coordinador, { status: 201 })
    } catch (error: any) {
        console.error('Error en POST /api/coordinador:', error)
        return NextResponse.json({ error: `Error interno del servidor: ${error.message || error}` }, { status: 500 })
    }
}
