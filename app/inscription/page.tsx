'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'

export default function InscriptionPage() {
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '', message: ''
  })
  const [services, setServices] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  function toggleService(s: string) {
    setServices(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    )
  }

  async function handleSubmit() {
    if (!form.prenom || !form.nom || !form.email) {
      setError('Prénom, nom et email sont obligatoires')
      return
    }
    if (services.length === 0) {
      setError('Choisissez au moins un service')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.from('demandes_inscription').insert({
      ...form, services
    })
    if (error) {
      setError('Une erreur est survenue. Réessayez.')
    } else {
      setDone(true)
    }
    setLoading(false)
  }

  if (done) return (
    <main className="min-h-screen flex items-center justify-center" style={{background:'#F7F6F2'}}>
      <div className="max-w-sm mx-auto px-6 text-center">
        <div className="text-5xl mb-4">🌱</div>
        <h1 className="text-2xl font-bold mb-3" style={{color:'#2F5D50'}}>Demande envoyée</h1>
        <p className="text-gray-500 text-sm">Nous reviendrons vers vous dans les 48h pour finaliser votre inscription.</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen" style={{background:'#F7F6F2'}}>
      <div className="px-6 pt-12 pb-6" style={{background:'#2F5D50'}}>
        <h1 className="text-white text-2xl font-bold">Rejoindre Sion</h1>
        <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.7)'}}>Remplissez ce formulaire — nous validons votre accès sous 48h</p>
      </div>

      <div className="p-6 space-y-4 max-w-lg mx-auto">

        {/* Services */}
        <div>
          <p className="text-sm font-bold mb-3" style={{color:'#2F5D50'}}>Je souhaite rejoindre</p>
          <div className="space-y-3">
            {[
              { id: 'joyclub', label: 'Joy Club', desc: 'Centre aéré pour mon enfant', color: '#2F5D50' },
              { id: 'parentlab', label: 'Parent Lab', desc: 'Ateliers parentalité pour adultes', color: '#F47C72' },
            ].map(s => (
              <button
                key={s.id}
                onClick={() => toggleService(s.id)}
                className="w-full text-left p-4 rounded-2xl border-2 transition-all"
                style={{
                  background: services.includes(s.id) ? s.color : 'white',
                  borderColor: services.includes(s.id) ? s.color : '#E5E7EB',
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold" style={{color: services.includes(s.id) ? 'white' : '#1A1A1A'}}>{s.label}</p>
                    <p className="text-sm mt-0.5" style={{color: services.includes(s.id) ? 'rgba(255,255,255,0.8)' : '#6B7280'}}>{s.desc}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    style={{borderColor: services.includes(s.id) ? 'white' : '#E5E7EB', background: services.includes(s.id) ? 'white' : 'transparent'}}>
                    {services.includes(s.id) && <div className="w-3 h-3 rounded-full" style={{background: s.color}}></div>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Champs */}
        <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm">
          {[
            { key: 'prenom', label: 'Prénom', placeholder: 'Marie', type: 'text' },
            { key: 'nom', label: 'Nom', placeholder: 'Dumont', type: 'text' },
            { key: 'email', label: 'Email', placeholder: 'marie@email.com', type: 'email' },
            { key: 'telephone', label: 'Téléphone', placeholder: '0696 12 34 56', type: 'tel' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold mb-1 block" style={{color:'#6B7280'}}>{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={(form as any)[f.key]}
                onChange={e => setForm(prev => ({...prev, [f.key]: e.target.value}))}
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none"
                style={{borderColor:'#E5E7EB'}}
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold mb-1 block" style={{color:'#6B7280'}}>Message (optionnel)</label>
            <textarea
              placeholder="Dites-nous en plus sur votre situation..."
              value={form.message}
              onChange={e => setForm(prev => ({...prev, message: e.target.value}))}
              rows={3}
              className="w-full border rounded-xl px-4 py-3 text-sm outline-none resize-none"
              style={{borderColor:'#E5E7EB'}}
            />
          </div>
        </div>

        {error && <p className="text-sm text-center" style={{color:'#F47C72'}}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-white text-sm"
          style={{background:'#2F5D50'}}
        >
          {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
        </button>

        <p className="text-center text-xs" style={{color:'#6B7280'}}>
          Déjà un compte ?{' '}
          <a href="/login" className="underline" style={{color:'#2F5D50'}}>Se connecter</a>
        </p>
      </div>
    </main>
  )
}
