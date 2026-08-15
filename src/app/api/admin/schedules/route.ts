import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/serverAuth'
import { logAudit } from '@/lib/audit'

export async function GET(req: Request) {
  try {
    requireAdmin(req)
    const schedules = await prisma.schedule.findMany({ orderBy: { id: 'asc' } })
    return NextResponse.json({ schedules })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 403 })
  }
}

export async function POST(req: Request) {
  try {
    const payload: any = requireAdmin(req)
    const body = await req.json()
    const { name, startTime, endTime, gracePeriodMinutes, breakEnabled, timezone } = body
    if (!name || !startTime || !endTime) return NextResponse.json({ message: 'Missing' }, { status: 400 })
    const s = await prisma.schedule.create({ data: { name, startTime, endTime, gracePeriodMinutes: gracePeriodMinutes || 15, breakEnabled: breakEnabled !== undefined ? breakEnabled : true, timezone: timezone || 'Asia/Karachi' } })
    await logAudit(payload.userId, 'create_schedule', 'Schedule', s.id, JSON.stringify(body))
    return NextResponse.json({ schedule: s })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
