type Session = {
  reservationId: string;
  startedAt: number;
  endedAt?: number;
  hourlyRate: number;
  prepaidHours?: number;
};

const sessions = new Map<string, Session>();

export function startSession(reservationId: string, hourlyRate = 30) {
  const now = Date.now();
  const s: Session = { reservationId, startedAt: now, hourlyRate, prepaidHours: 0 };
  sessions.set(reservationId, s);
  return s;
}

export function getSession(reservationId: string) {
  return sessions.get(reservationId);
}

export function endSession(reservationId: string) {
  const s = sessions.get(reservationId);
  if (!s) return null;
  if (!s.endedAt) s.endedAt = Date.now();
  // compute hours (minimum 1 hour)
  const elapsedMs = (s.endedAt - s.startedAt);
  const hours = Math.max(1, Math.ceil(elapsedMs / (1000 * 60 * 60)));
  const amount = hours * s.hourlyRate;
  const prepaid = s.prepaidHours || 0
  const netAmount = Math.max(0, amount - prepaid * s.hourlyRate)
  // remove session after ending
  sessions.delete(reservationId);
  return { session: s, hours, amount, prepaidHours: prepaid, amountDue: netAmount };
}

export function computeAccrued(reservationId: string) {
  const s = sessions.get(reservationId);
  if (!s) return null;
  const now = Date.now();
  const elapsedMs = now - s.startedAt;
  const hoursSoFar = Math.max(1, Math.ceil(elapsedMs / (1000 * 60 * 60)));
  const amountSoFar = hoursSoFar * s.hourlyRate;
  const prepaid = s.prepaidHours || 0
  const amountDue = Math.max(0, amountSoFar - prepaid * s.hourlyRate)
  return { session: s, elapsedMs, hoursSoFar, amountSoFar, prepaidHours: prepaid, amountDue };
}

export function extendSession(reservationId: string, hours: number){
  const s = sessions.get(reservationId)
  if(!s) return null
  s.prepaidHours = (s.prepaidHours || 0) + Math.max(0, Math.floor(hours))
  sessions.set(reservationId, s)
  return s
}
