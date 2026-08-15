import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/serverAuth'
import { logAudit } from '@/lib/audit'

export async function GET(req: Request) {
  try {
    requireAdmin(req)
    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get('id'))
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })
    const h = await prisma.holiday.findUnique({ where: { id } })
    return NextResponse.json({ holiday: h })
  } catch (err:any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const payload: any = requireAdmin(req)
    const body = await req.json()
    const { id, name, date, description } = body
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })
    const h = await prisma.holiday.update({ where: { id }, data: { name, date: date ? new Date(date) : undefined, description } })
    await logAudit(payload.userId, 'update_holiday', 'Holiday', id, JSON.stringify(body))
    return NextResponse.json({ holiday: h })
  } catch (err:any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const payload: any = requireAdmin(req)
    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get('id'))
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })
    await prisma.holiday.delete({ where: { id } })
    await logAudit(payload.userId, 'delete_holiday', 'Holiday', id, null)
    return NextResponse.json({ ok: true })
  } catch (err:any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
