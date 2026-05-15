'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const ADMIN_UUID = 'cadcbca6-05fb-44cc-913e-55a4f297e650'

export default function Dashboard() {
  const [prenom, setPrenom] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      if (user.id === ADMIN_UUID) setIsAdmin(true)
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
        <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.6)'}}>Bienvenue sur Sion Émergence</p>
      </div>

      <div className="p-6 space-y-4 max-w-lg mx-auto">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-bold mb-1" style={{color:'#2F5D50'}}>Parent Lab</p>
          <p className="text-sm mb-3" style={{color:'#6B7280'}}>Les ateliers seront disponibles ici</p>
          <button
            onClick={() => router.push('/parentlab')}
            className="w-full py-3 rounded-xl font-bold text-white"
            style={{background:'#2F5D50'}}>
            Voir les ateliers
          </button>
        </div>

        {isAdmin && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border-2" style={{borderColor:'#2F5D50'}}>
            <p className="font-bold mb-1" style={{color:'#2F5D50'}}>Administration</p>
            <p className="text-sm mb-3" style={{color:'#6B7280'}}>Gérer les demandes d'inscription</p>
            <button
              onClick={() => router.push('/dashboard/admin')}
              className="w-full py-3 rounded-xl font-bold text-white"
              style={{background:'#2F5D50'}}>
              Accéder au dashboard admin
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
