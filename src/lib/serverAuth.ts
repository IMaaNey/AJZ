import { prisma } from './prisma'
import { getTokenFromReq, verifyToken } from './auth'

export async function getUserFromRequest(req: Request) {
  const token = getTokenFromReq(req as any)
  if (!token) return null
  const payload: any = verifyToken(token)
  if (!payload) return null
  const user = await prisma.user.findUnique({ where: { id: payload.userId }, include: { employee: true } })
  return user
}

export function requireAdmin(req: Request) {
  const token = getTokenFromReq(req as any)
  if (!token) throw new Error('Unauthorized')
  const payload: any = verifyToken(token)
  if (!payload || payload.role !== 'admin') throw new Error('Forbidden')
  return payload
}
