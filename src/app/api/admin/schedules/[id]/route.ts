import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/serverAuth'
import { logAudit } from '@/lib/audit'

export async function PATCH(req: Request) {
  try {
    const payload: any = requireAdmin(req)
    const body = await req.json()
    const { id, name, startTime, endTime, gracePeriodMinutes, breakEnabled, timezone } = body
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })
    const s = await prisma.schedule.update({ where: { id }, data: { name, startTime, endTime, gracePeriodMinutes, breakEnabled, timezone } })
    await logAudit(payload.userId, 'update_schedule', 'Schedule', id, JSON.stringify(body))
    return NextResponse.json({ schedule: s })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const payload: any = requireAdmin(req)
    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get('id'))
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })
    await prisma.schedule.delete({ where: { id } })
    await logAudit(payload.userId, 'delete_schedule', 'Schedule', id, null)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
