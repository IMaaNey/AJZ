import { calcArrivalStatus, buildScheduledDate } from '../attendance'
import { describe, it, expect } from 'vitest'

describe('arrival status', () => {
  const timezone = 'Asia/Karachi'
  it('marks early when before schedule', () => {
    const sched = buildScheduledDate(new Date('2026-08-15T00:00:00Z'), '09:00', timezone)
    const arrived = new Date(sched.getTime() - 20 * 60 * 1000) // 20 min early
    const res = calcArrivalStatus(sched, arrived, 15)
    expect(res.status).toBe('early')
    expect(res.minutes).toBe(20)
  })

  it('marks on_time when within grace', () => {
    const sched = buildScheduledDate(new Date('2026-08-15T00:00:00Z'), '09:00', timezone)
    const arrived = new Date(sched.getTime() + 10 * 60 * 1000) // 10 min late
    const res = calcArrivalStatus(sched, arrived, 15)
    expect(res.status).toBe('on_time')
  })

  it('marks late after grace', () => {
    const sched = buildScheduledDate(new Date('2026-08-15T00:00:00Z'), '09:00', timezone)
    const arrived = new Date(sched.getTime() + 20 * 60 * 1000) // 20 min late
    const res = calcArrivalStatus(sched, arrived, 15)
    expect(res.status).toBe('late')
    expect(res.minutes).toBe(20)
  })
})
