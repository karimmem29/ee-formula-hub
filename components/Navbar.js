import Link from 'next/link'
import { useState } from 'react'

export default function Navbar({ user, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#2A2D3A] bg-[#0F1117]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-lg bg-[#00D4FF] flex items-center justify-center">
            <span className="text-[#0F1117] font-bold text-xs">EE</span>
          </div>
          <span className="font-semibold text-white text-sm">Formula Hub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/calculators" className="text-sm text-gray-400 hover:text-white transition-colors">
            Calculators
          </Link>
          <Link href="/formulas" className="text-sm text-gray-400 hover:text-white transition-colors">
            Formulas
          </Link>
          <Link href="/pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
            Pricing
          </Link>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-gray-500 hidden md:block">{user.email}</span>
              <button
                onClick={onSignOut}
                className="text-xs text-gray-400 hover:text-white border border-[#2A2D3A] px-3 py-1.5 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/pricing"
                className="text-xs bg-[#00D4FF] text-[#0F1117] font-semibold px-3 py-1.5 rounded-lg hover:bg-[#00BBDD] transition-colors"
              >
                Get Pro
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
