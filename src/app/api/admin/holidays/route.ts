import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/serverAuth'
import { logAudit } from '@/lib/audit'

export async function GET(req: Request) {
  try {
    requireAdmin(req)
    const holidays = await prisma.holiday.findMany({ orderBy: { date: 'asc' } })
    return NextResponse.json({ holidays })
  } catch (err:any) {
    return NextResponse.json({ message: err.message }, { status: 403 })
  }
}

export async function POST(req: Request) {
  try {
    const payload: any = requireAdmin(req)
    const body = await req.json()
    const { name, date, description } = body
    if (!name || !date) return NextResponse.json({ message: 'Missing' }, { status: 400 })
    const h = await prisma.holiday.create({ data: { name, date: new Date(date), description } })
    await logAudit(payload.userId, 'create_holiday', 'Holiday', h.id, JSON.stringify(body))
    return NextResponse.json({ holiday: h })
  } catch (err:any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
