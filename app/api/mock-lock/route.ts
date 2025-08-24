import { NextResponse } from 'next/server'

type LockRecord = { slotId: string; expiresAt: number }

// module-level lock store (mock, server-process lifetime)
const locks = new Map<string, LockRecord>()

function cleanup() {
  const now = Date.now()
  for (const [k, v] of locks.entries()) {
    if (v.expiresAt <= now) locks.delete(k)
  }
}

export async function POST(req: Request) {
  cleanup()
  try {
    const body = await req.json()
    const { slotId, ttl } = body
    if (!slotId) return NextResponse.json({ error: 'slotId required' }, { status: 400 })
    const existing = locks.get(slotId)
    if (existing && existing.expiresAt > Date.now()) {
      return NextResponse.json({ error: 'locked' }, { status: 409 })
    }
    const expiresAt = Date.now() + (typeof ttl === 'number' ? ttl * 1000 : 15 * 60 * 1000)
    locks.set(slotId, { slotId, expiresAt })
    return NextResponse.json({ ok: true, slotId, expiresAt })
  } catch (e) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { slotId } = body
    if (!slotId) return NextResponse.json({ error: 'slotId required' }, { status: 400 })
    locks.delete(slotId)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
}

export async function GET(req: Request) {
  cleanup()
  const entries = Array.from(locks.values())
  return NextResponse.json({ locks: entries })
}
