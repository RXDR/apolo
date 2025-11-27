'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { obtenerPermisosCRUD, type PermisoComponente } from '@/lib/supabase/permissions'
import type { Database } from '@/lib/supabase/database.types'
import type { User } from '@supabase/supabase-js'

type Usuario = Database['public']['Tables']['usuarios']['Row']

interface AuthContextType {
    user: User | null
    usuario: Usuario | null
    permisos: Map<string, PermisoComponente>
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    getPermisos: (moduloNombre: string) => PermisoComponente | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [usuario, setUsuario] = useState<Usuario | null>(null)
    const [permisos, setPermisos] = useState<Map<string, PermisoComponente>>(new Map())
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        // Verificar sesión actual
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                cargarUsuarioYPermisos(session.user.id)
            } else {
                setLoading(false)
            }
        })

        // Escuchar cambios de autenticación
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                cargarUsuarioYPermisos(session.user.id)
            } else {
                setUsuario(null)
                setPermisos(new Map())
                setLoading(false)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    async function cargarUsuarioYPermisos(authUserId: string) {
        try {
            // Cargar usuario
            const { data: usuarioData, error: usuarioError } = await supabase
                .from('usuarios')
                .select('*')
                .eq('auth_user_id', authUserId)
                .single()

            if (usuarioError) {
                console.error('Error cargando usuario:', usuarioError)
                setLoading(false)
                return
            }

            setUsuario(usuarioData)

            // Cargar permisos de todos los módulos
            const { data: modulos } = await supabase.from('modulos').select('nombre').eq('activo', true)

            if (modulos) {
                const permisosMap = new Map<string, PermisoComponente>()

                await Promise.all(
                    modulos.map(async (modulo) => {
                        const permisosMod = await obtenerPermisosCRUD(usuarioData.id, modulo.nombre)
                        permisosMap.set(modulo.nombre, permisosMod)
                    })
                )

                setPermisos(permisosMap)
            }
        } catch (error) {
            console.error('Error cargando usuario y permisos:', error)
        } finally {
            setLoading(false)
        }
    }

    async function signIn(email: string, password: string) {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error

            router.push('/dashboard')
        } catch (error) {
            console.error('Error en login:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    async function signOut() {
        try {
            setLoading(true)
            const { error } = await supabase.auth.signOut()

            if (error) throw error

            setUser(null)
            setUsuario(null)
            setPermisos(new Map())
            router.push('/login')
        } catch (error) {
            console.error('Error en logout:', error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    function getPermisos(moduloNombre: string): PermisoComponente | null {
        return permisos.get(moduloNombre) || null
    }

    const value = {
        user,
        usuario,
        permisos,
        loading,
        signIn,
        signOut,
        getPermisos,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider')
    }
    return context
}
