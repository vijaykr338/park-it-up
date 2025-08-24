import { NextResponse } from 'next/server'
import { computeAccrued, getSession } from '../store'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const reservationId = url.searchParams.get('reservationId')
  if (!reservationId) return NextResponse.json({ error: 'missing reservationId' }, { status: 400 })
  const s = getSession(reservationId)
  if (!s) return NextResponse.json({ error: 'no active session' }, { status: 404 })
  const accrued = computeAccrued(reservationId)
  return NextResponse.json({ ok: true, accrued })
}
