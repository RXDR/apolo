import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

// Instancia singleton del cliente de Supabase
let supabaseInstance: SupabaseClient<Database> | null = null

export function createClient(): SupabaseClient<Database> {
    // Si ya existe una instancia, retornarla (patrón singleton)
    if (supabaseInstance) {
        return supabaseInstance
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    console.log('🔍 Creando cliente Supabase:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey,
        url: supabaseUrl?.substring(0, 30) + '...',
        env: process.env.NODE_ENV,
        isServer: typeof window === 'undefined'
    })

    // Durante el build, usar valores por defecto si las variables no están disponibles
    if (!supabaseUrl || !supabaseAnonKey) {
        if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
            // Durante el build en producción, usar valores temporales
            console.warn('Supabase environment variables not found during build. Using temporary values.')
            supabaseInstance = createBrowserClient(
                'https://placeholder.supabase.co',
                'placeholder-key'
            )
            return supabaseInstance
        }
        
        // En el cliente, mostrar error específico
        const error = new Error(
            `Missing Supabase environment variables. URL: ${!!supabaseUrl}, Key: ${!!supabaseAnonKey}`
        )
        console.error('❌ Supabase configuration error:', error)
        throw error
    }

    // Crear la instancia una sola vez
    supabaseInstance = createBrowserClient<Database>(
        supabaseUrl,
        supabaseAnonKey,
        {
            auth: {
                // CRÍTICO: Desactivar revalidación automática para evitar recargas
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: true,
                flowType: 'pkce',
                // Esta es la clave para evitar recargas al cambiar de pestaña
                storage: typeof window !== 'undefined' ? window.localStorage : undefined,
            },
            global: {
                headers: {
                    'x-application-name': 'datanalisis-app',
                },
            },
        }
    )

    return supabaseInstance
}

// Exportar la instancia singleton
export const supabase = createClient()
export default supabase
