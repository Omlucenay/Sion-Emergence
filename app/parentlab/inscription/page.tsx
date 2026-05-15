'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const WEBHOOK_INSCRIPTION = 'https://hook.eu2.make.com/sp0og4bdl76lfxmtzav4si9y9coyeyr4'

function InscriptionForm() {
  const searchParams = useSearchParams()
  const atelier_id = searchParams.get('atelier_id')
  const atelier_titre = searchParams.get('titre') || 'cet atelier'

  const [form, setForm] = useState({ prenom: '', nom: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()

  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  async function handleSubmit() {
    if (!form.prenom || !form.nom || !form.email) {
      setError('Tous les champs sont obligatoires')
      return
    }
    if (!isValidEmail(form.email)) {
      setError('Adresse email invalide')
      return
    }
    setLoading(true)
    setError('')

    const { data: existing } = await supabase
      .from('inscriptions_ateliers')
      .select('id')
      .eq('email', form.email)
      .eq('atelier_id', atelier_id)
      .maybeSingle()

    if (existing) {
      setError('Tu es déjà inscrit à cet atelier.')
      setLoading(false)
      return
    }

    const { error: dbError } = await supabase
      .from('inscriptions_ateliers')
      .insert({ prenom: form.prenom, nom: form.nom, email: form.email, atelier_id, statut: 'confirme' })

    if (dbError) {
      setError('Une erreur est survenue : ' + dbError.message)
      setLoading(false)
      return
    }

    await supabase.rpc('decrement_places', { atelier_id })

    await fetch(WEBHOOK_INSCRIPTION, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, atelier_id, atelier_titre })
    })

    setDone(true)
    setLoading(false)
  }

  if (done) return (
    <main className="min-h-screen flex items-center justify-center" style={{background:'#F7F6F2'}}>
      <div className="max-w-sm mx-auto px-6 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold mb-2" style={{color:'#2F5D50'}}>Tu es inscrit !</h1>
        <p className="text-sm" style={{color:'#6B7280'}}>Un email de confirmation avec les détails t'a été envoyé.</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen" style={{background:'#F7F6F2'}}>
      <div className="px-6 pt-12 pb-6" style={{background:'#2F5D50'}}>
        <button onClick={() => router.push('/parentlab')} className="text-xs mb-2 underline" style={{color:'rgba(255,255,255,0.6)'}}>Retour aux ateliers</button>
        <h1 className="text-white text-2xl font-bold">Je m'inscris</h1>
        <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.7)'}}>{atelier_titre}</p>
      </div>
      <div className="p-6 space-y-4 max-w-lg mx-auto">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {['prenom', 'nom', 'email'].map(field => (
          <div key={field}>
            <label className="text-sm font-bold block mb-1" style={{color:'#2F5D50'}}>
              {field === 'prenom' ? 'Prénom' : field === 'nom' ? 'Nom' : 'Email'}
            </label>
            <input
              type={field === 'email' ? 'email' : 'text'}
              value={form[field as keyof typeof form]}
              onChange={e => setForm(prev => ({...prev, [field]: e.target.value}))}
              className="w-full p-3 rounded-xl border-2 bg-white"
              style={{borderColor:'#E5E7EB'}}
            />
          </div>
        ))}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white mt-2"
          style={{background:'#2F5D50'}}>
          {loading ? 'Inscription...' : "Confirmer mon inscription"}
        </button>
      </div>
    </main>
  )
}

export default function InscriptionAtelierPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <InscriptionForm />
    </Suspense>
  )
}
