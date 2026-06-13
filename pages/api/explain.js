export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { formulaName, formulaStr, description } = req.body

  if (!formulaName) return res.status(400).json({ error: 'Missing formula data' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `You are an electrical engineering tutor. Explain this formula clearly to a university EE student.

Formula: ${formulaName}
Expression: ${formulaStr}
Description: ${description}

Explain:
1. What each variable means physically
2. Intuitively why this relationship makes sense
3. One real-world example of when you would use this
4. One common mistake students make with it

Keep it concise, practical, and conversational. No markdown, just plain text paragraphs.`,
        }],
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err?.error?.message || 'Claude API error')
    }

    const data = await response.json()
    const explanation = data.content.map(b => b.text || '').join('')
    res.status(200).json({ explanation })

  } catch (error) {
    console.error('AI explain error:', error)
    res.status(500).json({ error: error.message || 'Failed to generate explanation' })
  }
}
