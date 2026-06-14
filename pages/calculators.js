import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import FormulaCard from '../components/FormulaCard'
import AiExplainModal from '../components/AiExplainModal'
import { categories, formulas } from '../data/formulas'
import { useAuth } from '../lib/AuthContext'

export default function Calculators() {
  const router = useRouter()
  const [activeCat, setActiveCat] = useState(router.query.cat || 'all')
  const [search, setSearch] = useState('')
  const [selectedFormula, setSelectedFormula] = useState(null)

  // Pro status comes from the signed-in user's profile (Supabase). Defaults to
  // false while loading and for anonymous users.
  const { isPro } = useAuth()

  const filtered = formulas.filter(f => {
    const matchesCat = activeCat === 'all' || f.category === activeCat
    const matchesSearch = !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.tags.some(t => t.includes(search.toLowerCase()))
    return matchesCat && matchesSearch
  })

  return (
    <>
      <Head>
        <title>EE Calculators — EE Formula Hub</title>
        <meta name="description" content="Interactive electrical engineering calculators. Solve for any variable instantly." />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-14 bg-[#0F1117]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">EE Calculators</h1>
            <p className="text-gray-500 text-sm">{formulas.length} formulas across {categories.length} topics</p>
          </div>

          {/* Search */}
          <div className="relative mb-5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">⌕</span>
            <input
              className="calc-input pl-9 text-sm"
              placeholder="Search formulas... (e.g. voltage, RC, op-amp)"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 flex-wrap mb-6">
            <button
              onClick={() => setActiveCat('all')}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                activeCat === 'all'
                  ? 'bg-[#00D4FF] text-[#0F1117] border-[#00D4FF] font-semibold'
                  : 'bg-transparent text-gray-400 border-[#2A2D3A] hover:border-[#00D4FF66]'
              }`}
            >
              All ({formulas.length})
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  activeCat === cat.id
                    ? 'bg-[#00D4FF] text-[#0F1117] border-[#00D4FF] font-semibold'
                    : 'bg-transparent text-gray-400 border-[#2A2D3A] hover:border-[#00D4FF66]'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-xs text-gray-600 mb-4">
            {filtered.length} formula{filtered.length !== 1 ? 's' : ''} found
          </p>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-3xl mb-3">∅</p>
              <p>No formulas found for "{search}"</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(formula => (
                <FormulaCard
                  key={formula.id}
                  formula={formula}
                  isPro={isPro}
                  onAiExplain={f => setSelectedFormula(f)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* AI Modal */}
      {selectedFormula && (
        <AiExplainModal
          formula={selectedFormula}
          isPro={isPro}
          onClose={() => setSelectedFormula(null)}
        />
      )}
    </>
  )
}
