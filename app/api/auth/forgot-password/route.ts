import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import prisma from '@/lib/prisma'
import { transporter } from '@/lib/smtp/connectSmpt'


export async function POST(req: NextRequest) {
  const { email } = await req.json()

  // 1) Verifica usuário
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 })
  }

  // 2) Gera token e hash
  const resetToken = crypto.randomBytes(32).toString('hex')
  const hashedToken = await bcrypt.hash(resetToken, 10)
  const expires = new Date(Date.now() + 1000 * 60 * 60) // 1h

  // 3) Salva no banco
  await prisma.user.update({
    where: { email },
    data: {
      passwordResetToken: hashedToken,
      passwordResetExpires: expires,
    },
  })

  // 4) Monta URL de front-end
  const urlFront = 
    `${process.env.NEXT_PUBLIC_APP_URL}/new-password?token=${resetToken}&email=${encodeURIComponent(email)}`

  // 5) Dispara e‑mail
  const html = `
    <div style="font-family: sans-serif; line-height:1.5">
      <h2>Redefinição de Senha</h2>
      <p>Você solicitou a redefinição de senha. Clique no botão abaixo:</p>
      <a href="${urlFront}" style="
        display:inline-block; padding:12px 24px;
        background:#FF1FFF; color:#fff; border-radius:4px;
        text-decoration:none;
      ">Redefinir Senha</a>
      <p>Link válido por 1 hora.</p>
    </div>
  `
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Redefinição de senha',
    html,
  })
  console.log("🚀 ~ POST ~ transporter:", transporter)

  return NextResponse.json({ message: 'Token enviado por e‑mail' })
}
