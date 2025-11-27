import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Validar variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
    throw new Error(
        'NEXT_PUBLIC_SUPABASE_URL no está definida. Verifica tu archivo .env.local'
    )
}

if (!supabaseAnonKey) {
    throw new Error(
        'NEXT_PUBLIC_SUPABASE_ANON_KEY no está definida. Verifica tu archivo .env.local'
    )
}

// Cliente de Supabase para el navegador
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
})

// Cliente admin (solo para uso en servidor)
// IMPORTANTE: Solo usar en API routes o Server Components
export function getSupabaseAdmin() {
    if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL no está definida')
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!serviceRoleKey) {
        console.warn('SUPABASE_SERVICE_ROLE_KEY no está definida')
        return null
    }

    return createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    })
}
