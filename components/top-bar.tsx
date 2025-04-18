"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { user } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="border-b border-gray-800 py-4 px-4 sticky top-0 z-30 bg-[#121212]">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="w-10 md:w-64">{/* Espaço reservado para o botão do menu na versão mobile */}</div>

        <form onSubmit={handleSearch} className="relative flex-1 max-w-md mx-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            placeholder="Encontre o hackathon"
            className="pl-10 w-full bg-gray-800 border-gray-700 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-white hidden sm:inline-flex">
                  Entrar
                </Button>
              </Link>
              <Link href="/cadastro">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Cadastre-se</Button>
              </Link>
            </>
          ) : (
            <div className="text-sm text-gray-300 hidden sm:block">
              Olá, <span className="font-medium text-white">{user.name?.split(" ")[0] || "Usuário"}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
