'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [prenom, setPrenom] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('profiles').select('prenom').eq('id', user.id).single()
      setPrenom(data?.prenom || user.email || '')
    }
    getUser()
  }, [])

  return (
    <main className="min-h-screen" style={{background:'#F7F6F2'}}>
      <div className="px-6 pt-12 pb-6" style={{background:'#2F5D50'}}>
        <p className="text-sm" style={{color:'rgba(255,255,255,0.7)'}}>Bonjour</p>
        <h1 className="text-white text-2xl font-bold mt-1">{prenom || '...'}</h1>
        <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.6)'}}>Bienvenue sur Sion Emergence</p>
      </div>
      <div className="p-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <p className="font-bold text-lg" style={{color:'#2F5D50'}}>Parent Lab arrive bientot</p>
          <p className="text-gray-500 text-sm mt-2">Les ateliers seront disponibles ici</p>
        </div>
      </div>
    </main>
  )
}
