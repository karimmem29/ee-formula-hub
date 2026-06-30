import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'
import { categories, formulas } from '../data/formulas'

export default function Home() {
  return (
    <>
      <Head>
        <title>EE Formula Hub — Electrical Engineering Calculators & Formulas</title>
        <meta name="description" content="Free electrical engineering calculators and formula reference. Instant solvers for DC circuits, AC, filters, op-amps, transistors, power systems and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="google-site-verification" content="sW7OKOkm63VY2_84HkYx8TUSYGkx3kbFDVCLMJ1ruR4" />
        <meta name="google-site-verification" content="l1OpOMFtw6rDE9sdm8kGc6OwPO22Xh18jXdMLy7Xd6c" />
      </Head>

      <Navbar />

      <main className="grid-bg min-h-screen pt-14">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-[#00D4FF15] border border-[#00D4FF30] text-[#00D4FF] text-xs px-3 py-1.5 rounded-full mb-6 font-medium">
            <span>⚡</span>
            <span>200+ formulas · instant solver · AI explanations</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight tracking-tight">
            Every EE formula you need,<br />
            <span className="text-[#00D4FF]">solved instantly.</span>
          </h1>

          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Stop rearranging equations by hand. Pick your formula, enter your known values, get the answer. Built by an EE masters student, for EE students.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/calculators"
              className="bg-[#00D4FF] text-[#0F1117] font-semibold px-6 py-3 rounded-xl hover:bg-[#00BBDD] transition-colors text-sm"
            >
              Open calculators →
            </Link>
            <Link
              href="/pricing"
              className="border border-[#2A2D3A] text-gray-300 px-6 py-3 rounded-xl hover:border-[#00D4FF44] transition-colors text-sm"
            >
              View Pro features
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
            {[
              { val: `${formulas.length}+`, label: 'Formulas' },
              { val: categories.length, label: 'Topics' },
              { val: 'Free', label: 'To start' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-white">{s.val}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Category grid */}
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Browse by topic</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map(cat => {
              const count = formulas.filter(f => f.category === cat.id).length
              return (
                <Link
                  key={cat.id}
                  href={`/calculators?cat=${cat.id}`}
                  className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-4 hover:border-[#00D4FF44] transition-all group text-center"
                >
                  <div className="text-2xl mb-2">{cat.icon}</div>
                  <p className="text-sm font-medium text-white group-hover:text-[#00D4FF] transition-colors">{cat.label}</p>
                  <p className="text-xs text-gray-600 mt-1">{count} formulas</p>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-[#2A2D3A] py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl font-semibold text-white mb-10 text-center">Why EE Formula Hub?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: '⚡', title: 'Instant solver', body: 'Enter known values, pick what to solve for. Handles any variable automatically.' },
                { icon: '✦', title: 'AI explain (Pro)', body: 'Ask why a formula works. Claude explains in plain English with real context.' },
                { icon: '📱', title: 'Lab-ready mobile', body: 'Fast, one-thumb UI. Designed for use in labs, not just at a desk.' },
              ].map(f => (
                <div key={f.title} className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-5">
                  <div className="text-2xl mb-3">{f.icon}</div>
                  <h3 className="font-semibold text-white text-sm mb-1.5">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="max-w-md mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Start for free today</h2>
            <p className="text-gray-500 text-sm mb-6">No account needed for basic calculators. Sign up for Pro to unlock AI explanations.</p>
            <Link
              href="/calculators"
              className="bg-[#00D4FF] text-[#0F1117] font-semibold px-8 py-3 rounded-xl hover:bg-[#00BBDD] transition-colors inline-block text-sm"
            >
              Open all calculators →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#2A2D3A] py-8">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#00D4FF] flex items-center justify-center">
                <span className="text-[#0F1117] font-bold text-[10px]">EE</span>
              </div>
              <span className="text-sm text-gray-500">EE Formula Hub</span>
            </div>
            <p className="text-xs text-gray-600">Built by an EE student, for EE students.</p>
            <div className="flex gap-4">
              <Link href="/pricing" className="text-xs text-gray-600 hover:text-gray-400">Pricing</Link>
              <Link href="/auth" className="text-xs text-gray-600 hover:text-gray-400">Sign in</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
