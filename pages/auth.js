import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Auth() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!email || !password) { setError('Enter your email and password'); return }
    setLoading(true)
    setError('')
    setMessage('')

    // TODO: connect Supabase auth here
    // import { supabase } from '../lib/supabase'
    // const { error } = mode === 'signup'
    //   ? await supabase.auth.signUp({ email, password })
    //   : await supabase.auth.signInWithPassword({ email, password })

    // Placeholder for now
    setTimeout(() => {
      setLoading(false)
      setMessage(mode === 'signup'
        ? 'Account created! Check your email to verify.'
        : 'Signed in! (Connect Supabase to enable real auth)')
    }, 800)
  }

  return (
    <>
      <Head>
        <title>{mode === 'signin' ? 'Sign in' : 'Sign up'} — EE Formula Hub</title>
      </Head>

      <Navbar />

      <main className="min-h-screen pt-14 bg-[#0F1117] grid-bg flex items-center justify-center px-4">
        <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-8 w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-[#00D4FF] flex items-center justify-center">
              <span className="text-[#0F1117] font-bold text-xs">EE</span>
            </div>
            <span className="font-semibold text-white text-sm">Formula Hub</span>
          </div>

          <h1 className="text-xl font-bold text-white mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {mode === 'signin' ? "Don't have an account? " : 'Already have one? '}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setMessage('') }}
              className="text-[#00D4FF] hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Email</label>
              <input
                className="calc-input"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Password</label>
              <input
                className="calc-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}
            {message && <p className="text-[#00D4FF] text-xs">{message}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#00D4FF] text-[#0F1117] font-semibold py-2.5 rounded-xl hover:bg-[#00BBDD] transition-colors text-sm mt-1 disabled:opacity-50"
            >
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </div>

          <p className="text-[10px] text-gray-600 mt-5 text-center">
            By continuing you agree to our terms. No spam, ever.
          </p>
        </div>
      </main>
    </>
  )
}
