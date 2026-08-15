import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/serverAuth'
import { logAudit } from '@/lib/audit'

export async function GET(req: Request) {
  try {
    const payload = requireAdmin(req)
    const settings = await prisma.companySettings.findFirst({ include: { defaultSchedule: true } })
    const schedules = await prisma.schedule.findMany()
    return NextResponse.json({ settings, schedules })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 403 })
  }
}

export async function PATCH(req: Request) {
  try {
    const payload: any = requireAdmin(req)
    const body = await req.json()
    const { companyName, timezone, defaultScheduleId } = body
    const settings = await prisma.companySettings.findFirst()
    let updated
    if (!settings) {
      updated = await prisma.companySettings.create({ data: { companyName: companyName || 'AJZ Consultants', timezone: timezone || 'Asia/Karachi', defaultScheduleId: defaultScheduleId || undefined } })
      await logAudit(payload.userId, 'create_settings', 'CompanySettings', updated.id, JSON.stringify(body))
    } else {
      updated = await prisma.companySettings.update({ where: { id: settings.id }, data: { companyName: companyName || settings.companyName, timezone: timezone || settings.timezone, defaultScheduleId: defaultScheduleId || settings.defaultScheduleId } })
      await logAudit(payload.userId, 'update_settings', 'CompanySettings', updated.id, JSON.stringify(body))
    }
    return NextResponse.json({ settings: updated })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
