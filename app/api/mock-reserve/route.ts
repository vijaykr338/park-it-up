import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    // Very small mock: validate required fields
    const { slotId, contact, payment } = body
    if (!slotId) return NextResponse.json({ error: 'slotId required' }, { status: 400 })
    // In a real integration we'd check lock, payment, etc. Here we accept and return mock id
    const reservationId = `R-${Math.floor(Math.random() * 9000) + 1000}`
    return NextResponse.json({ ok: true, reservationId })
  } catch (e) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
}
