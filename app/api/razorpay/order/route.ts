import { NextRequest } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const amount = body?.amount // expected in rupees
    const reservationId = body?.reservationId || 'demo'
    if (!amount) return new Response(JSON.stringify({ error: 'missing amount' }), { status: 400 })

    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !keySecret) return new Response(JSON.stringify({ error: 'razorpay keys not configured in env' }), { status: 500 })

    const orderPayload = {
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `rcpt_${reservationId}_${Date.now()}`,
      payment_capture: 1,
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
    const r = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(orderPayload),
    })
    const j = await r.json()
    if (!r.ok) return new Response(JSON.stringify({ error: j }), { status: 500 })
    return new Response(JSON.stringify({ ok: true, order: j, keyId }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500 })
  }
}
