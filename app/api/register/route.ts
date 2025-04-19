import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { uploadImage } from "@/lib/uploadToFreeImage"

export async function POST(req: Request) {
  const { name, email, password, confirmPassword, image } = await req.json()

  // validações
  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
  }
  if (password !== confirmPassword) {
    return NextResponse.json({ error: "As senhas não coincidem" }, { status: 400 })
  }
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 })
  }

  // faz o upload da imagem, se houver
  let imageUrl: string | null = null
  if (image) {
    imageUrl = await uploadImage(image)
    if (!imageUrl) {
      return NextResponse.json({ error: "Falha ao enviar imagem" }, { status: 500 })
    }
  }

  // cria hash e usuário
  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "USER",
      image: imageUrl,      // armazena a URL retornada
    },
  })

  return NextResponse.json({ success: true, userId: user.id })
}
