// app/cadastro/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function CadastroPage() {
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const form = new FormData(e.currentTarget)
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      confirmPassword: form.get("confirmPassword"),
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Erro desconhecido")
      } else {
        // redireciona para login
        router.push("/login")
      }
    } catch (err) {
      setError("Falha na requisição")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">Cadastre-se</h1>

        {error && (
          <Alert
            variant="destructive"
            className="bg-red-900/30 border border-red-500 text-red-300 mb-4"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" required className="bg-gray-800 border-gray-700" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="bg-gray-800 border-gray-700" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" required className="bg-gray-800 border-gray-700" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirme a senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Cadastrando..." : "Cadastre-se"}
          </Button>

          <div className="text-center text-sm">
            <Link href="/login" className="text-blue-400 hover:underline">
              Já tem uma conta? Faça login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
