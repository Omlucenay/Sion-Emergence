'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

type Demande = {
  id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  services: string[]
  message: string
  statut: string
  created_at: string
}

export default function AdminPage() {
  const [demandes, setDemandes] = useState<Demande[]>([])
  const [loading, setLoading] = useState(true)
  const [filtre, setFiltre] = useState('en_attente')
  const [authorized, setAuthorized] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || user.id !== 'cadcbca6-05fb-44cc-913e-55a4f297e650') {
        router.push('/login')
        return
      }
      setAuthorized(true)
    }
    checkAdmin()
  }, [])

  useEffect(() => {
    if (authorized) fetchDemandes()
  }, [filtre, authorized])

  async function fetchDemandes() {
    setLoading(true)
    const { data } = await supabase
      .from('demandes_inscription')
      .select('*')
      .eq('statut', filtre)
      .order('created_at', { ascending: false })
    if (data) setDemandes(data)
    setLoading(false)
  }

  async function updateStatut(id: string, statut: string) {
    await supabase
      .from('demandes_inscription')
      .update({ statut })
      .eq('id', id)
    fetchDemandes()
  }

  if (!authorized) return (
    <main className="min-h-screen flex items-center justify-center" style={{background:'#F7F6F2'}}>
      <p style={{color:'#2F5D50'}}>Vérification...</p>
    </main>
  )

  return (
    <main className="min-h-screen" style={{background:'#F7F6F2'}}>
      <div className="px-6 pt-12 pb-6" style={{background:'#2F5D50'}}>
        <h1 className="text-white text-2xl font-bold">Dashboard Admin</h1>
        <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.7)'}}>Demandes d'inscription</p>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex gap-2 mb-6">
          {['en_attente', 'valide', 'refuse'].map(s => (
            <button
              key={s}
              onClick={() => setFiltre(s)}
              className="px-4 py-2 rounded-full text-sm font-bold"
              style={{
                background: filtre === s ? '#2F5D50' : 'white',
                color: filtre === s ? 'white' : '#2F5D50',
                border: '2px solid #2F5D50'
              }}>
              {s === 'en_attente' ? 'En attente' : s === 'valide' ? 'Validés' : 'Refusés'}
            </button>
          ))}
        </div>

        {loading && <p style={{color:'#2F5D50'}}>Chargement...</p>}

        <div className="space-y-4">
          {demandes.length === 0 && !loading && (
            <p className="text-center" style={{color:'#6B7280'}}>Aucune demande dans cette catégorie.</p>
          )}
          {demandes.map(d => (
            <div key={d.id} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold" style={{color:'#2F5D50'}}>{d.prenom} {d.nom}</h2>
                <span className="text-xs" style={{color:'#6B7280'}}>{new Date(d.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
              <p className="text-sm mb-1" style={{color:'#6B7280'}}>{d.email}</p>
              {d.telephone && <p className="text-sm mb-1" style={{color:'#6B7280'}}>{d.telephone}</p>}
              {d.services && <p className="text-sm mb-1" style={{color:'#2F5D50'}}>{d.services.join(', ')}</p>}
              {d.message && <p className="text-sm mb-3 italic" style={{color:'#6B7280'}}>"{d.message}"</p>}
              {filtre === 'en_attente' && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => updateStatut(d.id, 'valide')}
                    className="flex-1 py-2 rounded-xl text-sm font-bold text-white"
                    style={{background:'#2F5D50'}}>
                    Valider
                  </button>
                  <button
                    onClick={() => updateStatut(d.id, 'refuse')}
                    className="flex-1 py-2 rounded-xl text-sm font-bold"
                    style={{background:'#FEE2E2', color:'#EF4444'}}>
                    Refuser
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
