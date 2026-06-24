import '../styles/globals.css'
import { AuthProvider } from '../lib/AuthContext'
import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Analytics />
    </AuthProvider>
  )
}
