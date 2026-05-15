'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou mot de passe incorrect')
    } else {
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{background:'linear-gradient(160deg,#2F5D50 0%,#1a3d34 100%)'}}>
      <div className="w-full max-w-sm px-6">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full border-4 border-white/20 flex items-center justify-center mb-4 shadow-xl" style={{background:'#2F5D50'}}>
            <span className="text-white text-3xl font-black">S</span>
          </div>
          <h1 className="text-white text-2xl font-bold">Sion Emergence</h1>
          <p className="text-sm mt-1" style={{color:'rgba(255,255,255,0.6)'}}>Votre espace tiers-lieu</p>
        </div>
        <div className="rounded-2xl p-6 space-y-4" style={{background:'rgba(255,255,255,0.1)'}}>
          <div>
            <label className="text-sm font-medium mb-1 block" style={{color:'rgba(255,255,255,0.75)'}}>Adresse email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="marie.dumont@gmail.com"
              className="w-full bg-white rounded-xl px-4 py-3 text-gray-800 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block" style={{color:'rgba(255,255,255,0.75)'}}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white rounded-xl px-4 py-3 text-gray-800 text-sm outline-none"
            />
          </div>
          {error && (
            <p className="text-sm text-center" style={{color:'#F47C72'}}>{error}</p>
          )}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-sm"
            style={{background:'#D4A017'}}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <p className="text-center text-xs" style={{color:'rgba(255,255,255,0.5)'}}>
            Mot de passe oublie ?
          </p>
        </div>
        <div className="flex gap-2 justify-center mt-6 flex-wrap">
          {['Famille', 'BAFA', 'BAFD', 'Admin'].map(p => (
            <span key={p} className="text-xs px-3 py-1 rounded-full" style={{background:'rgba(255,255,255,0.15)',color:'rgba(255,255,255,0.7)'}}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}
