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
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
        <!-- Cabeçalho com logo -->
        <tr>
          <td align="center" style="padding:20px;background:#f4b590;">
            <img
              src="https://i.ibb.co/dx7tbWz/cww-logo.png"
              alt="Next Payment"
              width="120"
              style="display:block; border:0;"
            />
          </td>
        </tr>

        <!-- Corpo do e‑mail -->
        <tr>
          <td style="padding:30px;font-family:Arial, sans-serif;line-height:1.5;color:#333;">
            <h2 style="color:#f4b590;margin-top:0;">Redefinição de Senha</h2>
            <p>Olá,</p>
            <p>Você solicitou a redefinição de senha da sua conta. Clique no botão abaixo para prosseguir:</p>

            <!-- Botão centralizado -->
            <table cellpadding="0" cellspacing="0" width="100%" style="margin:20px 0;">
              <tr>
                <td align="center">
                  <a
                    href="${urlFront}"
                    style="
                      display:inline-block;
                      padding:12px 24px;
                      background-color:#fe6000;
                      color:#ffffff;
                      text-decoration:none;
                      border-radius:5px;
                      font-weight:bold;
                    "
                  >
                    Redefinir Senha
                  </a>
                </td>
              </tr>
            </table>

            <p style="font-size:14px;color:#777;">
              Esse link é válido por 1 hora. Se você não solicitou essa ação, ignore este e‑mail.
            </p>

            <p style="margin-top:30px;">Atenciosamente,<br/><strong>CWW</strong></p>
          </td>
        </tr>

        <!-- Rodapé opcional -->
        <tr>
          <td align="center" style="padding:15px;font-size:12px;color:#aaa;">
            © ${new Date().getFullYear()} cww. Todos os direitos reservados.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`;

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: 'Redefinição de senha',
    html,
  })
  console.log("🚀 ~ POST ~ transporter:", transporter)

  return NextResponse.json({ message: 'Token enviado por e‑mail' })
}
