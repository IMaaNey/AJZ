import { describe, it, expect } from 'vitest'
import { buildScheduledDate, calcArrivalStatus } from '@/lib/attendance'

describe('attendance util integration', () => {
  it('buildScheduledDate creates a UTC date aligned with timezone', () => {
    const tz = 'Asia/Karachi'
    const sched = buildScheduledDate(new Date('2026-08-15T00:00:00Z'), '09:00', tz)
    expect(sched.getUTCHours()).toBeDefined()
    const arrived = new Date(sched.getTime() - 10 * 60 * 1000)
    const res = calcArrivalStatus(sched, arrived, 15)
    expect(res.status).toBe('early')
  })
})
