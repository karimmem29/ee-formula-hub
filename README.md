# EE Formula Hub

Electrical engineering calculators and formula reference. Free with Pro upgrade.

## Setup (do this once)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy the example file:
```bash
cp .env.local.example .env.local
```

Then fill in your keys in `.env.local`:
- **Supabase**: Create free project at supabase.com → Settings → API
- **Anthropic**: Get key at console.anthropic.com
- **Lemon Squeezy**: Create account at lemonsqueezy.com → Settings → API

### 3. Run locally
```bash
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

1. Push code to GitHub
2. Go to vercel.com → New Project → Import your GitHub repo
3. Add your environment variables in Vercel dashboard (Settings → Environment Variables)
4. Click Deploy

Your site is live!

## Project structure

```
pages/
  index.js          Homepage
  calculators.js    Main calculator page
  pricing.js        Pricing page
  auth.js           Sign in / Sign up
  api/
    explain.js      AI explanation API endpoint

components/
  Navbar.js         Top navigation
  FormulaCard.js    Interactive calculator card
  AiExplainModal.js AI explanation popup

data/
  formulas.js       All formula definitions and solvers

styles/
  globals.css       Global styles
```

## Adding new formulas

Open `data/formulas.js` and add to the `formulas` array:

```js
{
  id: 'unique-id',
  category: 'dc',          // matches category id
  name: 'Formula Name',
  formula: 'V = I × R',
  description: 'What it does',
  variables: [
    { symbol: 'V', name: 'Voltage', unit: 'V' },
    { symbol: 'I', name: 'Current', unit: 'A' },
  ],
  solve: {
    V: ({ I, R }) => I * R,   // function to solve for each variable
    I: ({ V, R }) => V / R,
  },
  tags: ['dc', 'basic'],
  pro: false,               // true = Pro users only
}
```

## Connecting Supabase auth (optional for v1)

1. Create project at supabase.com
2. Install: `npm install @supabase/supabase-js`
3. Create `lib/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
```
4. Uncomment the Supabase code in `pages/auth.js`

## Connecting Lemon Squeezy payments

1. Create account at lemonsqueezy.com
2. Create a product: "EE Formula Hub Pro" at $4.99/month
3. Copy the checkout URL
4. Replace the placeholder URL in `pages/pricing.js` handleUpgrade function
