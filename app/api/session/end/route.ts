import { NextResponse } from 'next/server'
import { endSession } from '../store'

export async function POST(req: Request) {
  const body = await req.json().catch(()=>({}))
  const { reservationId } = body || {}
  if (!reservationId) return NextResponse.json({ error: 'missing reservationId' }, { status: 400 })
  const res = endSession(reservationId)
  if (!res) return NextResponse.json({ error: 'no active session' }, { status: 404 })
  return NextResponse.json({ ok: true, ...res })
}
