import { useState } from 'react'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import { categories, formulas } from '../data/formulas'

export default function Formulas() {
  const [activeCat, setActiveCat] = useState('all')
  const [search, setSearch] = useState('')

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
        <title>EE Formula Reference — EE Formula Hub</title>
        <meta name="description" content="Complete electrical engineering formula reference." />
      </Head>
      <Navbar />
      <main className="min-h-screen pt-14 bg-[#0F1117]">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Formula Reference</h1>
            <p className="text-gray-500 text-sm">Quick reference only. Want to solve? Go to <a href="/calculators" className="text-[#00D4FF] hover:underline">Calculators</a>.</p>
          </div>
          <div className="relative mb-5">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-sm">⌕</span>
            <input className="calc-input pl-9 text-sm" placeholder="Search formulas..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap mb-6">
            <button onClick={() => setActiveCat('all')} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${activeCat === 'all' ? 'bg-[#00D4FF] text-[#0F1117] border-[#00D4FF] font-semibold' : 'bg-transparent text-gray-400 border-[#2A2D3A] hover:border-[#00D4FF66]'}`}>All ({formulas.length})</button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`text-xs px-3 py-1.5 rounded-full border transition-all ${activeCat === cat.id ? 'bg-[#00D4FF] text-[#0F1117] border-[#00D4FF] font-semibold' : 'bg-transparent text-gray-400 border-[#2A2D3A] hover:border-[#00D4FF66]'}`}>{cat.icon} {cat.label}</button>
            ))}
          </div>
          <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl overflow-hidden">
            {filtered.map((f, i) => (
              <div key={f.id} className={`flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 ${i !== filtered.length - 1 ? 'border-b border-[#2A2D3A]' : ''} hover:bg-[#ffffff05] transition-colors group`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-white">{f.name}</p>
                    {f.pro && <span className="text-[10px] bg-[#00D4FF20] text-[#00D4FF] border border-[#00D4FF40] px-1.5 py-0.5 rounded-full">PRO</span>}
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{f.description}</p>
                </div>
                <div className="sm:w-64 shrink-0">
                  <p className="font-mono text-sm text-[#00D4FF] bg-[#00D4FF08] border border-[#00D4FF20] px-3 py-1.5 rounded-lg">{f.formula}</p>
                </div>
                <div className="shrink-0">
                  <a href={`/calculators?cat=${f.category}`} className="text-xs text-gray-600 group-hover:text-[#00D4FF] transition-colors whitespace-nowrap">Solve →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}