import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'greengrid_super_secret_jwt_key_2026_rural_workfare'

export interface UserPayload {
  id: string
  name: string
  phone: string
  role: 'supervisor' | 'worker'
  site_id: string
}

export function signJwtToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyJwtToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload
  } catch (err) {
    return null
  }
}

export async function getAuthUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) return null
    return verifyJwtToken(token)
  } catch (err) {
    return null
  }
}
