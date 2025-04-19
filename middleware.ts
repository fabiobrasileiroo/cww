import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Chave secreta para JWT - deve ser a mesma usada em lib/auth.ts
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "seu_segredo_super_secreto_aqui")

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  let isAuthenticated = false
  let isAdmin = false
  let isRoot = false

  if (token) {
    try {
      const verified = await jwtVerify(token, JWT_SECRET)
      const payload = verified.payload as any

      isAuthenticated = true
      isAdmin = payload.role === "ADMIN" || payload.role === "ROOT"
      isRoot = payload.role === "ROOT"
    } catch (error) {
      // Token inválido
    }
  }

  // Rotas que requerem autenticação
  const authRoutes = ["/perfil", "/meus-eventos" ]

  // Rotas que requerem papel de administrador
  const adminRoutes = ["/admin", "/admin/eventos", "/admin/usuarios"]

  // Rotas que requerem papel de root
  const rootRoutes = ["/admin/usuarios/papeis"]

  const path = request.nextUrl.pathname

  // Verificar rotas de autenticação
  if (authRoutes.some((route) => path.startsWith(route)) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Verificar rotas de administrador
  if (adminRoutes.some((route) => path.startsWith(route)) && !isAdmin) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Verificar rotas de root
  if (rootRoutes.some((route) => path.startsWith(route)) && !isRoot) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // Redirecionar usuários autenticados das páginas de login/registro
  if ((path === "/login" || path === "/cadastro") && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/perfil/:path*", "/meus-eventos/:path*", "/eventos/novo", "/admin/:path*", "/login", "/cadastro"],
}
