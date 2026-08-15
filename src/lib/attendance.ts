import { zonedTimeToUtc } from 'date-fns-tz'
import { differenceInMinutes } from 'date-fns'

export function buildScheduledDate(date: Date, timeStr: string, timezone: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const yyyy = date.getUTCFullYear()
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(date.getUTCDate()).padStart(2, '0')
  const iso = `${yyyy}-${mm}-${dd}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
  const utcDate = zonedTimeToUtc(iso, timezone)
  return utcDate
}

export function calcArrivalStatus(scheduledStart: Date, arrivedAt: Date, graceMinutes: number) {
  const diff = differenceInMinutes(arrivedAt, scheduledStart)
  if (diff < 0) {
    return { status: 'early', minutes: Math.abs(diff) }
  }
  if (diff <= graceMinutes) {
    return { status: 'on_time', minutes: diff }
  }
  return { status: 'late', minutes: diff }
}

export function secondsBetween(a: Date, b: Date) {
  return Math.max(0, Math.floor((b.getTime() - a.getTime()) / 1000))
}
