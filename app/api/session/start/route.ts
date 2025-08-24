import { NextResponse } from 'next/server'
import { startSession, getSession } from '../store'

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}))
  const { reservationId, hourlyRate } = body || {}
  if (!reservationId) return NextResponse.json({ error: 'missing reservationId' }, { status: 400 })
  const existing = getSession(reservationId)
  if (existing) return NextResponse.json({ error: 'session already started' }, { status: 409 })
  const s = startSession(reservationId, hourlyRate || 30)
  return NextResponse.json({ ok: true, session: s })
}
