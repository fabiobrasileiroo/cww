"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Home,
  Calendar,
  PlusCircle,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  LayoutDashboard,
  CheckCircle,
  Clock,
  Users,
  FileText,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/components/auth-provider"
import { logoutAction } from "@/lib/actions/auth-actions"
import Image from "next/image"

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  console.log("🚀 ~ Sidebar ~ user:", user)

  const isAdmin = user?.role === "ADMIN" || user?.role === "ROOT"
  const isRoot = user?.role === "ROOT"
  const isAuthenticated = !!user

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  // Fechar sidebar quando mudar de página em dispositivos móveis
  useEffect(() => {
    closeSidebar()
  }, [pathname])

  return (
    <>
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className={`fixed top-4 left-4 z-50 md:hidden ${isOpen ? '' : ''}`} onClick={toggleSidebar}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeSidebar} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-[#0a0a0a] border-r border-gray-800 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-800">
            <Link href="/" className={`flex items-center gap-2 ${isOpen ? 'ml-14' : ''}`}>
              <div className="text-orange-500 w-10 h-10">
                <Image src="/cww-logo.svg" quality={100} width={202} height={83} alt="logo cww" />

              </div>
              <span className="text-2xl font-bold">CWW</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <div className="mb-4">
              <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Navegação</p>
              <div className="space-y-1">
                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors",
                    pathname === "/" ? "bg-gray-800 text-orange-500" : "text-gray-300",
                  )}
                >
                  <Home size={20} />
                  <span>Home</span>
                </Link>

                <Link
                  href="/eventos"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors",
                    pathname === "/eventos" || (pathname.startsWith("/eventos/") && !pathname.includes("/novo"))
                      ? "bg-gray-800 text-orange-500"
                      : "text-gray-300",
                  )}
                >
                  <Calendar size={20} />
                  <span>Calendário de eventos</span>
                </Link>

                {isAuthenticated && (
                  <Link
                    href="/eventos/novo"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors",
                      pathname === "/eventos/novo" ? "bg-gray-800 text-orange-500" : "text-gray-300",
                    )}
                  >
                    <PlusCircle size={20} />
                    <span>Criar evento</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Admin section - only visible to admins */}
            {isAdmin && (
              <div className="mb-4">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Administração</p>
                <div className="space-y-1">
                  <Link
                    href="/admin"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors",
                      pathname === "/admin" ? "bg-gray-800 text-orange-500" : "text-gray-300",
                    )}
                  >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/admin/eventos/pendentes"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors",
                      pathname === "/admin/eventos/pendentes" ? "bg-gray-800 text-orange-500" : "text-gray-300",
                    )}
                  >
                    <Clock size={20} />
                    <span>Eventos Pendentes</span>
                  </Link>

                  <Link
                    href="/admin/eventos/aprovados"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors",
                      pathname === "/admin/eventos/aprovados" ? "bg-gray-800 text-orange-500" : "text-gray-300",
                    )}
                  >
                    <CheckCircle size={20} />
                    <span>Eventos Aprovados</span>
                  </Link>

                  <Link
                    href="/admin/eventos/rejeitados"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors",
                      pathname === "/admin/eventos/rejeitados" ? "bg-gray-800 text-orange-500" : "text-gray-300",
                    )}
                  >
                    <XCircle size={20} />
                    <span>Eventos Rejeitados</span>
                  </Link>

                  {isRoot && (
                    <Link
                      href="/admin/usuarios"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors",
                        pathname === "/admin/usuarios" ? "bg-gray-800 text-orange-500" : "text-gray-300",
                      )}
                    >
                      <Users size={20} />
                      <span>Gerenciar Usuários</span>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* User section - visible to all logged in users */}
            {isAuthenticated && (
              <div>
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Minha Conta</p>
                <div className="space-y-1">
                  <Link
                    href="/perfil"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors",
                      pathname === "/perfil" ? "bg-gray-800 text-orange-500" : "text-gray-300",
                    )}
                  >
                    <User size={20} />
                    <span>Meu Perfil</span>
                  </Link>

                  <Link
                    href="/meus-eventos"
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-800 transition-colors",
                      pathname === "/meus-eventos" ? "bg-gray-800 text-orange-500" : "text-gray-300",
                    )}
                  >
                    <FileText size={20} />
                    <span>Meus Eventos</span>
                  </Link>
                </div>
              </div>
            )}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-800">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">

                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    {user.image ? (
                      <Image
                        src={user.image || "/placeholder.svg"}
                        alt={user.name || "Usuário"}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name || "Usuário"}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <Link
                    href="/configuracoes"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-800 text-gray-300 transition-colors"
                  >
                    <Settings size={16} />
                    <span>Configurações</span>
                  </Link>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-gray-800 text-gray-300 transition-colors w-full text-left"
                    >
                      <LogOut size={16} />
                      <span>Sair</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="space-y-2 px-3 md:hidden">
                <Link href="/login">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">Entrar</Button>
                </Link>
                <Link href="/cadastro">
                  <Button variant="outline" className="w-full">
                    Cadastre-se
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
