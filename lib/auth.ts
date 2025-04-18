import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { jwtVerify, SignJWT } from "jose"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import type { Role } from "@prisma/client"

// Chave secreta para JWT - em produção, use uma variável de ambiente
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "seu_segredo_super_secreto_aqui")

export type User = {
  id: string
  name: string
  email: string
  image?: string | null
  role: Role
}

export async function login(email: string, password: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      image: true,
      role: true,
    },
  })

  if (!user) return null

  const passwordMatch = await bcrypt.compare(password, user.password)
  if (!passwordMatch) return null

  // Criar token JWT
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token válido por 7 dias
    .sign(JWT_SECRET)

  // Salvar token em cookie
  ;(await
    // Salvar token em cookie
    cookies()).set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  }
}

export async function register(name: string, email: string, password: string): Promise<User | { error: string }> {
  // Verificar se o usuário já existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return { error: "Este email já está em uso" }
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10)

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "USER", // Papel padrão
    },
  })

  // Criar token JWT
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token válido por 7 dias
    .sign(JWT_SECRET)

  // Salvar token em cookie
  ;(await
    // Salvar token em cookie
    cookies()).set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  })

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  }
}

export async function logout() {
  (await cookies()).delete("auth-token")
}

export async function getSession(): Promise<User | null> {
  const token = (await cookies()).get("auth-token")?.value

  if (!token) return null

  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as unknown as User
  } catch (error) {
    return null
  }
}

export async function updateSession() {
  const session = await getSession()
  if (!session) return null

  // Atualizar dados do usuário
  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
    },
  })

  if (!user) {
    logout()
    return null
  }

  // Criar novo token JWT
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token válido por 7 dias
    .sign(JWT_SECRET)

  // Atualizar token em cookie
  ;(await
    // Atualizar token em cookie
    cookies()).set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  })

  return user
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect("/login")
  }
  return session
}

export async function requireAdmin() {
  const session = await getSession()
  if (!session || (session.role !== "ADMIN" && session.role !== "ROOT")) {
    redirect("/")
  }
  return session
}

export async function requireRoot() {
  const session = await getSession()
  if (!session || session.role !== "ROOT") {
    redirect("/admin")
  }
  return session
}
