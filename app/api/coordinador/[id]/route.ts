import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const supabase = createClient(cookies())
        const { id } = params

        const { data, error } = await supabase
            .from('v_coordinadores_completo')
            .select('*')
            .eq('coordinador_id', id)
            .single()

        if (error) {
            console.error('Error obteniendo coordinador:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!data) {
            return NextResponse.json({ error: 'Coordinador no encontrado' }, { status: 404 })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error en GET /api/coordinador/[id]:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const supabase = createClient(cookies())
        const { id } = params
        const body = await request.json()

        const { perfil_id, referencia_coordinador_id, estado, tipo } = body

        // Preparar datos de actualización
        const updateData: any = {}
        if (perfil_id !== undefined) updateData.perfil_id = perfil_id
        if (referencia_coordinador_id !== undefined) updateData.referencia_coordinador_id = referencia_coordinador_id
        if (estado) updateData.estado = estado
        if (tipo) updateData.tipo = tipo

        const { data, error } = await supabase.from('coordinadores').update(updateData).eq('id', id).select().single()

        if (error) {
            console.error('Error actualizando coordinador:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Actualizar perfil del usuario si cambió
        if (perfil_id !== undefined) {
            const { data: coordinador } = await supabase.from('coordinadores').select('usuario_id').eq('id', id).single()

            if (coordinador) {
                // Desactivar perfiles actuales
                await supabase.from('usuario_perfil').update({ activo: false }).eq('usuario_id', coordinador.usuario_id)

                // Asignar nuevo perfil
                if (perfil_id) {
                    await supabase.from('usuario_perfil').upsert({
                        usuario_id: coordinador.usuario_id,
                        perfil_id,
                        es_principal: true,
                        activo: true,
                    })
                }
            }
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error en PATCH /api/coordinador/[id]:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const supabase = createClient(cookies())
        const adminClient = createAdminClient()
        const { id } = params

        // Obtener el auth_user_id antes de eliminar
        const { data: coordinador } = await supabase.from('coordinadores').select('auth_user_id').eq('id', id).single()

        if (!coordinador) {
            return NextResponse.json({ error: 'Coordinador no encontrado' }, { status: 404 })
        }

        // Eliminar coordinador
        const { error: deleteError } = await supabase.from('coordinadores').delete().eq('id', id)

        if (deleteError) {
            console.error('Error eliminando coordinador:', deleteError)
            return NextResponse.json({ error: deleteError.message }, { status: 500 })
        }

        // Eliminar usuario de Auth si existe
        if (coordinador.auth_user_id) {
            const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(coordinador.auth_user_id)

            if (authDeleteError) {
                console.error('Error eliminando usuario de Auth:', authDeleteError)
                // No fallar por esto, ya eliminamos el coordinador
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error en DELETE /api/coordinador/[id]:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
