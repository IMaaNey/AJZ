import { NextResponse } from 'next/server'
import { getTokenFromReq, verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfDay } from 'date-fns'
import { calcArrivalStatus, buildScheduledDate } from '@/lib/attendance'

export async function POST(req: Request) {
  const token = getTokenFromReq(req as any)
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const payload: any = verifyToken(token)
  if (!payload) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { id: payload.userId }, include: { employee: true } })
  if (!user || !user.employee) return NextResponse.json({ message: 'No employee' }, { status: 400 })

  const todayStart = startOfDay(new Date())
  const existing = await prisma.attendance.findUnique({ where: { employeeId_date: { employeeId: user.employee.id, date: todayStart } } }).catch(()=>null)
  if (existing) return NextResponse.json({ message: 'Already clocked in' }, { status: 400 })

  const schedule = user.employee.scheduleId ? await prisma.schedule.findUnique({ where: { id: user.employee.scheduleId } }) : await prisma.schedule.findFirst()
  const timezone = schedule?.timezone || 'Asia/Karachi'
  const scheduledStart = buildScheduledDate(todayStart, schedule?.startTime || '09:00', timezone)
  const scheduledEnd = buildScheduledDate(todayStart, schedule?.endTime || '18:00', timezone)

  const now = new Date()
  const arrival = calcArrivalStatus(scheduledStart, now, schedule?.gracePeriodMinutes || 15)

  const attendance = await prisma.attendance.create({ data: {
    employeeId: user.employee.id,
    date: todayStart,
    scheduledStart,
    scheduledEnd,
    clockIn: now,
    arrivalStatus: arrival.status,
    attendanceStatus: 'working'
  }})

  return NextResponse.json({ attendance })
}
