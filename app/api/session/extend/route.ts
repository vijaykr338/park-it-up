import { NextResponse } from 'next/server'
import { extendSession } from '../store'

export async function POST(req: Request){
  const body = await req.json().catch(()=>({}))
  const { reservationId, hours } = body || {}
  if(!reservationId) return NextResponse.json({ error: 'missing reservationId' }, { status: 400 })
  const s = extendSession(reservationId, hours || 1)
  if(!s) return NextResponse.json({ error: 'no active session' }, { status: 404 })
  return NextResponse.json({ ok: true, session: s })
}
