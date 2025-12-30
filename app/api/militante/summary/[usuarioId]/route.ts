import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request, { params }: { params: { usuarioId: string } }) {
  const { usuarioId } = params
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data, error } = await supabase.from('militantes').select('*').eq('usuario_id', usuarioId).limit(1).single()
    if (error) {
      console.error('Error fetching militante summary:', error)
      return NextResponse.json(null, { status: 500 })
    }
    return NextResponse.json(data)
  } catch (e) {
    console.error('Unexpected error fetching militante summary:', e)
    return NextResponse.json(null, { status: 500 })
  }
}
