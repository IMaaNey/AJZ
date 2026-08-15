import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/serverAuth'
import bcrypt from 'bcrypt'

export async function GET(req: Request) {
  try {
    requireAdmin(req)
    const employees = await prisma.employee.findMany({ include: { user: true, department: true } })
    return NextResponse.json({ employees })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 403 })
  }
}

export async function POST(req: Request) {
  try {
    requireAdmin(req)
    const body = await req.json()
    const { fullName, email, password, departmentId, designation, joiningDate } = body
    if (!fullName || !email || !password) return NextResponse.json({ message: 'Missing' }, { status: 400 })
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ message: 'Email already exists' }, { status: 400 })
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, passwordHash: hash, role: 'employee', status: 'active' } })
    const employee = await prisma.employee.create({ data: { userId: user.id, fullName, departmentId: departmentId || undefined, designation: designation || undefined, joiningDate: joiningDate ? new Date(joiningDate) : new Date() } })
    return NextResponse.json({ employee })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
