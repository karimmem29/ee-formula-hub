import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

// Lemon Squeezy signs the raw request body, so we must verify against the exact
// bytes received — disable Next.js's automatic JSON body parsing.
export const config = { api: { bodyParser: false } }

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (c) => chunks.push(typeof c === 'string' ? Buffer.from(c) : c))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

// Subscription statuses that should grant Pro access.
const PRO_STATUSES = ['active', 'on_trial', 'paid']

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!secret || !serviceKey || !supabaseUrl) {
    return res.status(500).json({ error: 'Webhook not configured' })
  }

  const raw = await readRawBody(req)

  // Verify the HMAC-SHA256 signature.
  const signature = req.headers['x-signature']
  const digest = crypto.createHmac('sha256', secret).update(raw).digest('hex')
  const sigBuf = Buffer.from(signature || '', 'hex')
  const digBuf = Buffer.from(digest, 'hex')
  if (sigBuf.length !== digBuf.length || !crypto.timingSafeEqual(sigBuf, digBuf)) {
    return res.status(401).json({ error: 'Invalid signature' })
  }

  let event
  try {
    event = JSON.parse(raw.toString('utf8'))
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' })
  }

  const attributes = event?.data?.attributes || {}
  const email = attributes.user_email
  const status = attributes.status || 'free'
  if (!email) return res.status(200).json({ received: true, note: 'no user_email on event' })

  // Service-role client bypasses RLS so it can write the protected is_pro flag.
  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { error } = await admin
    .from('profiles')
    .update({
      is_pro: PRO_STATUSES.includes(status),
      subscription_status: status,
      ls_subscription_id: event?.data?.id ? String(event.data.id) : null,
      ls_customer_id: attributes.customer_id ? String(attributes.customer_id) : null,
      current_period_end: attributes.renews_at || attributes.ends_at || null,
    })
    .eq('email', email)

  if (error) {
    console.error('Webhook profile update failed:', error)
    return res.status(500).json({ error: 'Failed to update profile' })
  }

  return res.status(200).json({ received: true })
}
