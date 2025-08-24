import { NextRequest } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) return new Response(JSON.stringify({ error: 'razorpay secret not configured' }), { status: 500 })

    const generated = crypto.createHmac('sha256', keySecret).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex')
    const valid = generated === razorpay_signature
    return new Response(JSON.stringify({ ok: valid }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err?.message || String(err) }), { status: 500 })
  }
}
