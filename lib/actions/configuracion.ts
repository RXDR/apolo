'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

// --- Tipos ---
export type Ciudad = {
    id: string
    nombre: string
    codigo?: string
    activo: boolean
    orden?: number
}

export type Barrio = {
    id: string
    nombre: string
    ciudad_id: string
    codigo?: string
    activo: boolean
    orden?: number
    ciudad?: { nombre: string }
}

// --- Ciudades ---
export async function getCiudades() {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data, error } = await supabase
        .from('ciudades')
        .select('*')
        .order('nombre')

    if (error) throw new Error(error.message)
    return data
}

export async function createCiudad(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const data = {
        nombre: formData.get('nombre'),
        codigo: formData.get('codigo'),
        activo: formData.get('activo') === 'true',
    }

    const { error } = await supabase.from('ciudades').insert([data])
    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/configuracion')
}

export async function updateCiudad(id: string, formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const data = {
        nombre: formData.get('nombre'),
        codigo: formData.get('codigo'),
        activo: formData.get('activo') === 'true',
    }

    const { error } = await supabase.from('ciudades').update(data).eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/configuracion')
}

export async function deleteCiudad(id: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase.from('ciudades').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/configuracion')
}

// --- Barrios ---
export async function getBarrios(ciudadId?: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    let query = supabase
        .from('barrios')
        .select('*, ciudad:ciudades(nombre)')
        .order('nombre')

    if (ciudadId) {
        query = query.eq('ciudad_id', ciudadId)
    }

    const { data, error } = await query

    if (error) throw new Error(error.message)
    return data
}

export async function createBarrio(formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const data = {
        nombre: formData.get('nombre'),
        ciudad_id: formData.get('ciudad_id'),
        codigo: formData.get('codigo'),
        activo: formData.get('activo') === 'true',
    }

    const { error } = await supabase.from('barrios').insert([data])
    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/configuracion')
}

export async function updateBarrio(id: string, formData: FormData) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const data = {
        nombre: formData.get('nombre'),
        ciudad_id: formData.get('ciudad_id'),
        codigo: formData.get('codigo'),
        activo: formData.get('activo') === 'true',
    }

    const { error } = await supabase.from('barrios').update(data).eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/configuracion')
}

export async function deleteBarrio(id: string) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase.from('barrios').delete().eq('id', id)
    if (error) throw new Error(error.message)
    revalidatePath('/dashboard/configuracion')
}
