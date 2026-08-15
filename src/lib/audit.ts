import { prisma } from '@/lib/prisma'

export async function logAudit(adminId: number, action: string, targetType: string, targetId: number | null, details?: string) {
  try {
    await prisma.auditLog.create({ data: { adminId, action, targetType, targetId: targetId || undefined, details } })
  } catch (err) {
    console.error('Failed to write audit log', err)
  }
}
