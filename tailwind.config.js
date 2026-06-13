/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: '#0F1117',
        surface: '#1A1D27',
        border: '#2A2D3A',
        accent: '#00D4FF',
        'accent-dim': '#0099BB',
        'accent-glow': 'rgba(0,212,255,0.15)',
        muted: '#6B7280',
        subtle: '#374151',
      },
    },
  },
  plugins: [],
}
