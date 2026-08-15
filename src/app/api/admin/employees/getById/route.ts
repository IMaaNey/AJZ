import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/serverAuth'

export async function GET(req: Request) {
  try {
    requireAdmin(req)
    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get('id'))
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })
    const employee = await prisma.employee.findUnique({ where: { id }, include: { user: true, department: true } })
    return NextResponse.json({ employee })
  } catch (err:any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
