import { useState } from 'react'

export default function FormulaCard({ formula, isPro, onAiExplain }) {
  const [inputs, setInputs] = useState({})
  const [solveFor, setSolveFor] = useState(formula.variables[0].symbol)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const isLocked = formula.pro && !isPro

  const knownVars = formula.variables.filter(v => v.symbol !== solveFor)

  const calculate = () => {
    setError('')
    setResult(null)

    const vals = {}
    for (const v of knownVars) {
      const raw = inputs[v.symbol]
      if (raw === undefined || raw === '') {
        setError(`Enter a value for ${v.name}`)
        return
      }
      const num = parseFloat(raw)
      if (isNaN(num)) {
        setError(`${v.name} must be a number`)
        return
      }
      vals[v.symbol] = num
    }

    try {
      const fn = formula.solve[solveFor]
      if (!fn) { setError('Cannot solve for this variable yet.'); return }
      const res = fn(vals)
      if (!isFinite(res)) { setError('Result is undefined (check your inputs)'); return }
      setResult(res)
    } catch (e) {
      setError('Calculation error — check your inputs')
    }
  }

  const formatResult = (val) => {
    if (Math.abs(val) >= 1e6) return `${(val / 1e6).toFixed(4)} M`
    if (Math.abs(val) >= 1e3) return `${(val / 1e3).toFixed(4)} k`
    if (Math.abs(val) < 1e-6 && val !== 0) return `${(val * 1e9).toFixed(4)} n`
    if (Math.abs(val) < 1e-3 && val !== 0) return `${(val * 1e6).toFixed(4)} μ`
    if (Math.abs(val) < 1 && val !== 0) return `${(val * 1e3).toFixed(4)} m`
    return parseFloat(val.toPrecision(6)).toString()
  }

  const resultVar = formula.variables.find(v => v.symbol === solveFor)

  return (
    <div className={`bg-[#1A1D27] border rounded-xl p-5 transition-all ${
      isLocked ? 'border-[#2A2D3A] opacity-70' : 'border-[#2A2D3A] hover:border-[#00D4FF44]'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-white text-sm">{formula.name}</h3>
            {formula.pro && (
              <span className="text-[10px] bg-[#00D4FF20] text-[#00D4FF] border border-[#00D4FF40] px-2 py-0.5 rounded-full font-medium">
                PRO
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{formula.description}</p>
        </div>
      </div>

      {/* Formula display */}
      <div className="formula-display mb-4 text-sm">{formula.formula}</div>

      {isLocked ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 mb-3">This calculator is a Pro feature</p>
          <a
            href="/pricing"
            className="text-xs bg-[#00D4FF] text-[#0F1117] font-semibold px-4 py-2 rounded-lg hover:bg-[#00BBDD] transition-colors inline-block"
          >
            Upgrade to Pro — $4.99/mo
          </a>
        </div>
      ) : (
        <>
          {/* Solve for selector */}
          <div className="mb-3">
            <label className="text-xs text-gray-500 mb-1.5 block">Solve for</label>
            <div className="flex flex-wrap gap-2">
              {formula.variables.map(v => (
                <button
                  key={v.symbol}
                  onClick={() => { setSolveFor(v.symbol); setResult(null); setError('') }}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-mono ${
                    solveFor === v.symbol
                      ? 'bg-[#00D4FF] text-[#0F1117] border-[#00D4FF] font-semibold'
                      : 'bg-transparent text-gray-400 border-[#2A2D3A] hover:border-[#00D4FF66]'
                  }`}
                >
                  {v.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-2.5 mb-3">
            {knownVars.map(v => (
              <div key={v.symbol}>
                <label className="text-xs text-gray-500 mb-1 block">
                  {v.name} <span className="text-gray-600">({v.unit || '—'})</span>
                </label>
                <input
                  className="calc-input"
                  type="number"
                  placeholder={`Enter ${v.symbol}`}
                  value={inputs[v.symbol] || ''}
                  onChange={e => {
                    setInputs(prev => ({ ...prev, [v.symbol]: e.target.value }))
                    setResult(null)
                    setError('')
                  }}
                  onKeyDown={e => e.key === 'Enter' && calculate()}
                />
              </div>
            ))}
          </div>

          {/* Calculate button */}
          <button
            onClick={calculate}
            className="w-full bg-[#00D4FF] text-[#0F1117] font-semibold text-sm py-2.5 rounded-lg hover:bg-[#00BBDD] transition-colors"
          >
            Calculate {solveFor}
          </button>

          {/* Result */}
          {result !== null && (
            <div className="mt-3 p-3 bg-[#00D4FF10] border border-[#00D4FF30] rounded-lg animate-in">
              <p className="text-xs text-gray-500 mb-1">Result</p>
              <p className="font-mono text-lg text-[#00D4FF] font-semibold">
                {formatResult(result)} <span className="text-sm font-normal text-gray-400">{resultVar?.unit}</span>
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          {/* AI Explain button */}
          {onAiExplain && (
            <button
              onClick={() => onAiExplain(formula)}
              className="mt-3 w-full text-xs text-gray-500 border border-[#2A2D3A] py-2 rounded-lg hover:border-[#00D4FF44] hover:text-gray-300 transition-all flex items-center justify-center gap-1.5"
            >
              <span>✦</span>
              <span>{isPro ? 'AI Explain this formula' : 'AI Explain (Pro)'}</span>
            </button>
          )}
        </>
      )}
    </div>
  )
}
