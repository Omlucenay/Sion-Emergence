'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'

type Atelier = {
  id: string
  titre: string
  description: string
  date: string
  heure_debut: string
  duree_minutes: number
  theme: string
  places_total: number
  places_restantes: number
  animateurs: string
  lieu: string
}

function calcHeureFin(heure_debut: string, duree_minutes: number): string {
  const [h, m] = heure_debut.split(':').map(Number)
  const total = h * 60 + m + duree_minutes
  const hf = Math.floor(total / 60) % 24
  const mf = total % 60
  return `${String(hf).padStart(2,'0')}:${String(mf).padStart(2,'0')}`
}

export default function ParentLabPage() {
  const [ateliers, setAteliers] = useState<Atelier[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchAteliers() {
      const { data } = await supabase
        .from('ateliers_parentlab')
        .select('*')
        .eq('publie', true)
        .order('date', { ascending: true })
      if (data) setAteliers(data)
      setLoading(false)
    }
    fetchAteliers()
  }, [])

  if (loading) return (
    <main className="min-h-screen flex items-center justify-center" style={{background:'#F7F6F2'}}>
      <p style={{color:'#2F5D50'}}>Chargement...</p>
    </main>
  )

  return (
    <main className="min-h-screen" style={{background:'#F7F6F2'}}>
      <div className="px-6 pt-12 pb-6" style={{background:'#2F5D50'}}>
        <h1 className="text-white text-2xl font-bold">Parent Lab</h1>
        <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.7)'}}>Nos prochains ateliers</p>
      </div>
      <div className="p-6 space-y-4 max-w-lg mx-auto">
        {ateliers.length === 0 && (
          <p className="text-center" style={{color:'#2F5D50'}}>Aucun atelier disponible pour le moment.</p>
        )}
        {ateliers.map(a => (
          <div key={a.id} className="rounded-2xl p-5 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{background:'#E5E7EB', color:'#2F5D50'}}>{a.theme}</span>
              <span className="text-xs" style={{color: a.places_restantes > 0 ? '#2F5D50' : '#EF4444'}}>
                {a.places_restantes > 0 ? `${a.places_restantes} places restantes` : 'Complet'}
              </span>
            </div>
            <h2 className="font-bold text-lg mb-1" style={{color:'#2F5D50'}}>{a.titre}</h2>
            <p className="text-sm mb-3" style={{color:'#6B7280'}}>{a.description}</p>
            <div className="text-xs space-y-1" style={{color:'#6B7280'}}>
              <p>{new Date(a.date).toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}</p>
              {a.heure_debut && (
                <p>{a.heure_debut.slice(0,5)} - {calcHeureFin(a.heure_debut, a.duree_minutes)} · {a.lieu}</p>
              )}
              {a.animateurs && <p>Avec {a.animateurs}</p>}
            </div>
            {a.places_restantes > 0 && (
              <button className="w-full mt-4 py-3 rounded-xl font-bold text-white" style={{background:'#2F5D50'}}>
                Je m'inscris
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
