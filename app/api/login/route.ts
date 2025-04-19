// app/api/login/route.ts
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { SignJWT } from "jose"
import { jwtSecret } from "@/lib/config/config"

const JWT_SECRET = jwtSecret

export async function POST(req: Request) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email e senha são obrigatórios" },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, password: true, role: true, image: true },
  })
  if (!user) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
  }

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
  }

  // Gera o JWT
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    image: user.image
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  // Cria a resposta, setando o cookie HttpOnly
  const res = NextResponse.json({ success: true })
  // maxAge em segundos: aqui 7 dias
  res.cookies.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })

  return res
}
