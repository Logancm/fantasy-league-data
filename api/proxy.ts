import { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { type } = req.query

  if (!type || (type !== 'dynasty' && type !== 'redraft')) {
    return res.status(400).json({ error: 'Invalid type parameter' })
  }

  try {
    const url = `https://dynasty-daddy.com/api/v1/values/${type}`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Dynasty Daddy API returned ${response.status}`)
    }

    const data = await response.json()

    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.status(200).json(data)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Failed to fetch trade values' })
  }
}
