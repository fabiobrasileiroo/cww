// app/api/register/route.ts
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const { name, email, password, confirmPassword } = await req.json()

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: "As senhas não coincidem" }, { status: 400 })
  }

  // Verifica se já existe
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 })
  }

  // Cria hash e usuário
  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: "USER" },
  })

  return NextResponse.json({ success: true, userId: user.id })
}
