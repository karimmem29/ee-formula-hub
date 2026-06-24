import Head from 'next/head'
import Link from 'next/link'
import Navbar from '../components/Navbar'

const FREE_FEATURES = [
  'All basic calculators',
  'DC, AC, Filter, Op-Amp formulas',
  'Solve for any variable',
  'Search & filter by topic',
  'Mobile friendly',
]

const PRO_FEATURES = [
  'Everything in Free',
  'AI explain any formula (Claude-powered)',
  'Bookmark favourite formulas',
  'Calculation history',
  'Download as PDF for exam revision',
  'Pro-only calculators (MOSFET, PCB, Skin depth)',
  'Priority support from the developer',
]

const CHECKOUT_URL = 'https://eeformulahub.lemonsqueezy.com/checkout/buy/144ab85d-74ee-4e14-8524-3f11b2153e8b'

export default function Pricing() {
  const handleUpgrade = () => {
    window.open(CHECKOUT_URL, '_blank')
  }

  return (
    <>
      <Head>
        <title>Pricing — EE Formula Hub</title>
        <meta name="description" content="Free and Pro plans for EE Formula Hub. Upgrade for AI explanations and advanced calculators." />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-14 bg-[#0F1117] grid-bg">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-white mb-3">Simple pricing</h1>
            <p className="text-gray-500">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free */}
            <div className="bg-[#1A1D27] border border-[#2A2D3A] rounded-2xl p-7">
              <p className="text-sm text-gray-400 font-medium mb-1">Free</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-white">$0</span>
              </div>
              <p className="text-xs text-gray-600 mb-6">Forever free, no card needed</p>

              <Link
                href="/calculators"
                className="block text-center border border-[#2A2D3A] text-gray-300 font-semibold py-3 rounded-xl hover:border-[#00D4FF44] transition-colors text-sm mb-6"
              >
                Open calculators →
              </Link>

              <ul className="flex flex-col gap-3">
                {FREE_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                    <span className="text-[#00D4FF] text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro */}
            <div className="bg-[#1A1D27] border border-[#00D4FF] rounded-2xl p-7 relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-[#00D4FF] text-[#0F1117] text-[10px] font-bold px-2 py-1 rounded-full">
                MOST POPULAR
              </div>

              <p className="text-sm text-[#00D4FF] font-medium mb-1">Pro</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-bold text-white">$4.99</span>
                <span className="text-gray-500 text-sm mb-1">/month</span>
              </div>
              <p className="text-xs text-gray-600 mb-6">Or $29/year (save 50%)</p>

              <button
                onClick={handleUpgrade}
                className="w-full bg-[#00D4FF] text-[#0F1117] font-semibold py-3 rounded-xl hover:bg-[#00BBDD] transition-colors text-sm mb-6"
              >
                Upgrade to Pro →
              </button>

              <ul className="flex flex-col gap-3">
                {PRO_FEATURES.map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <span className="text-[#00D4FF] text-xs">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-lg font-semibold text-white mb-6 text-center">Frequently asked</h2>
            <div className="flex flex-col gap-4">
              {[
                { q: 'Can I cancel anytime?', a: 'Yes, cancel anytime from your account. You keep Pro access until the end of the billing period.' },
                { q: 'What payment methods are accepted?', a: 'All major credit and debit cards, Apple Pay, and Google Pay through Lemon Squeezy.' },
                { q: 'Is the free tier really free?', a: 'Yes, fully free forever. No credit card required. All basic calculators are always free.' },
                { q: 'How does the AI explanation work?', a: 'Pro users can tap "AI Explain" on any formula. Claude gives a plain-English explanation of what the formula means, when to use it, and why it works.' },
              ].map(item => (
                <div key={item.q} className="bg-[#1A1D27] border border-[#2A2D3A] rounded-xl p-5">
                  <p className="text-sm font-medium text-white mb-2">{item.q}</p>
                  <p className="text-sm text-gray-500">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
