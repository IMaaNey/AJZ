import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/serverAuth'
import bcrypt from 'bcrypt'

export async function PATCH(req: Request) {
  try {
    requireAdmin(req)
    const body = await req.json()
    const { id, fullName, designation, departmentId, status } = body
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })
    const data: any = {}
    if (fullName) data.fullName = fullName
    if (designation) data.designation = designation
    if (departmentId !== undefined) data.departmentId = departmentId
    const employee = await prisma.employee.update({ where: { id }, data })
    if (status) {
      // update user status
      const emp = await prisma.employee.findUnique({ where: { id } })
      if (emp) await prisma.user.update({ where: { id: emp.userId }, data: { status } })
    }
    return NextResponse.json({ employee })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    requireAdmin(req)
    const { searchParams } = new URL(req.url)
    const id = Number(searchParams.get('id'))
    if (!id) return NextResponse.json({ message: 'Missing id' }, { status: 400 })
    await prisma.employee.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  // reset password
  try {
    requireAdmin(req)
    const body = await req.json()
    const { id, newPassword } = body
    if (!id || !newPassword) return NextResponse.json({ message: 'Missing' }, { status: 400 })
    const emp = await prisma.employee.findUnique({ where: { id } })
    if (!emp) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    const hash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: emp.userId }, data: { passwordHash: hash } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 })
  }
}
