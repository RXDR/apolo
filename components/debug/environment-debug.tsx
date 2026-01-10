'use client'

import { useEffect, useState } from 'react'

export function EnvironmentDebug() {
  const [envDebug, setEnvDebug] = useState<any>(null)

  useEffect(() => {
    const debugInfo = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 50) + '...',
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length,
      nodeEnv: process.env.NODE_ENV,
      isClient: typeof window !== 'undefined',
      allPublicEnvs: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')),
      // Raw values for debugging
      rawUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      rawKeyStart: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...',
      timestamp: new Date().toISOString()
    }
    
    console.log('🔍 Environment Debug:', debugInfo)
    setEnvDebug(debugInfo)
  }, [])

  if (!envDebug) return null

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">Environment Debug</h4>
      <div className="space-y-1">
        <div>URL: {envDebug.hasSupabaseUrl ? '✅' : '❌'}</div>
        <div>Key: {envDebug.hasSupabaseKey ? '✅' : '❌'}</div>
        <div>URL Value: {envDebug.urlValue}</div>
        <div>Key Length: {envDebug.keyLength}</div>
        <div>Env: {envDebug.nodeEnv}</div>
        <div>Client: {envDebug.isClient ? 'Yes' : 'No'}</div>
        <div>Public Envs: {envDebug.allPublicEnvs.length}</div>
      </div>
    </div>
  )
}