// Vercel Serverless Function: Exotel Call Connector
// Initiates outbound calls to Indian cellular numbers via Exotel Voice v1 API

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' })
  }

  try {
    const {
      accountSid,
      apiKey,
      apiToken,
      callerId,
      from,
      to,
      appUrl,
      cluster = 'api.exotel.com',
      timeLimit,
      timeOut,
    } = req.body || {}

    if (!accountSid || !apiKey || !apiToken) {
      return res.status(400).json({
        success: false,
        error: 'Missing Exotel credentials (accountSid, apiKey, and apiToken are required). Please configure in Telephony Settings.',
      })
    }

    if (!from) {
      return res.status(400).json({
        success: false,
        error: 'Missing "from" phone number to call.',
      })
    }

    if (!callerId) {
      return res.status(400).json({
        success: false,
        error: 'Missing "callerId" (Your Exotel ExoPhone virtual number is required).',
      })
    }

    // Clean phone numbers: Exotel accepts 0XXXXXXXXXX or +91XXXXXXXXXX
    const cleanNumber = (num) => {
      const digits = (num || '').replace(/\D/g, '')
      if (digits.length === 10) return `0${digits}`
      if (digits.length === 12 && digits.startsWith('91')) return `+${digits}`
      return num
    }

    const formattedFrom = cleanNumber(from)
    const formattedCallerId = cleanNumber(callerId)
    const formattedTo = to ? cleanNumber(to) : null

    // Determine cluster host
    const validCluster = cluster === 'api.in.exotel.com' ? 'api.in.exotel.com' : 'api.exotel.com'
    const endpoint = `https://${validCluster}/v1/Accounts/${encodeURIComponent(accountSid)}/Calls/connect.json`

    // Prepare form URL-encoded body
    const params = new URLSearchParams()
    params.append('From', formattedFrom)
    params.append('CallerId', formattedCallerId)
    params.append('CallType', 'trans')

    if (appUrl) {
      params.append('Url', appUrl)
    } else if (formattedTo) {
      params.append('To', formattedTo)
    } else {
      // If neither appUrl nor to is provided, call from and connect to agent or default IVR
      params.append('To', formattedFrom)
    }

    if (timeLimit) params.append('TimeLimit', String(timeLimit))
    if (timeOut) params.append('TimeOut', String(timeOut))

    const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiToken}`).toString('base64')}`

    const exotelResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })

    const responseText = await exotelResponse.text()
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch {
      responseData = { raw: responseText }
    }

    if (!exotelResponse.ok) {
      return res.status(exotelResponse.status).json({
        success: false,
        status: exotelResponse.status,
        error: responseData.RestException?.Message || responseData.message || 'Exotel API returned an error',
        data: responseData,
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Exotel outbound call queued successfully',
      callSid: responseData.Call?.Sid,
      status: responseData.Call?.Status,
      data: responseData,
    })
  } catch (err) {
    console.error('Exotel proxy error:', err)
    return res.status(500).json({
      success: false,
      error: err.message || 'Internal server error while calling Exotel API',
    })
  }
}
