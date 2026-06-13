import { useState, useEffect } from 'react'

export default function AiExplainModal({ formula, isPro, onClose }) {
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (formula && isPro) fetchExplanation()
  }, [formula])

  const fetchExplanation = async () => {
    setLoading(true)
    setError('')
    setExplanation('')
    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formulaName: formula.name, formulaStr: formula.formula, description: formula.description }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')
      setExplanation(data.explanation)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[#00D4FF] font-medium mb-1">✦ AI Explanation</p>
            <h3 className="text-white font-semibold">{formula.name}</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="formula-display mb-4 text-sm">{formula.formula}</div>

        {!isPro && (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm mb-4">AI explanations are a Pro feature.</p>
            <a
              href="/pricing"
              className="bg-[#00D4FF] text-[#0F1117] font-semibold px-5 py-2.5 rounded-lg hover:bg-[#00BBDD] transition-colors inline-block text-sm"
            >
              Upgrade to Pro — $4.99/mo
            </a>
          </div>
        )}

        {isPro && loading && (
          <div className="flex items-center gap-3 py-6 text-gray-400 text-sm">
            <div className="w-4 h-4 border-2 border-[#00D4FF44] border-t-[#00D4FF] rounded-full animate-spin" />
            Generating explanation...
          </div>
        )}

        {isPro && error && (
          <p className="text-red-400 text-sm py-4">{error}</p>
        )}

        {isPro && explanation && (
          <div className="prose prose-invert text-sm text-gray-300 leading-relaxed whitespace-pre-wrap animate-in">
            {explanation}
          </div>
        )}
      </div>
    </div>
  )
}
