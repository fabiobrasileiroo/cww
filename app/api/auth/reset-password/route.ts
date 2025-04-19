// app/api/auth/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { email, token, newPassword } = await req.json()

  // 1) busca usuário pelo email
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.passwordResetToken || !user.passwordResetExpires) {
    return NextResponse.json(
      { message: 'Requisição inválida.' },
      { status: 400 }
    )
  }

  // 2) verifica expiração
  if (user.passwordResetExpires < new Date()) {
    return NextResponse.json(
      { message: 'Token expirado.' },
      { status: 400 }
    )
  }

  // 3) compara token
  const isValid = await bcrypt.compare(token, user.passwordResetToken)
  if (!isValid) {
    return NextResponse.json(
      { message: 'Token inválido.' },
      { status: 400 }
    )
  }

  // 4) atualiza senha e limpa campos de reset
  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { email },
    data: {
      password: hashed,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  })

  return NextResponse.json(
    { message: 'Senha resetada com sucesso.' },
    { status: 200 }
  )
}
