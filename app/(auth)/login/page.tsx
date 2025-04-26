// app/login/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"
import { KeySquare } from "lucide-react"
import { authUrl } from "@/lib/config/oauth"
const AUTHURL = authUrl

export default function LoginPage() {
  const router = useRouter()
  const { checkSession } = useAuth()
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const form = new FormData(e.currentTarget)
    const payload = {
      email: form.get("email"),
      password: form.get("password"),
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Erro ao autenticar")
      } else {
        // O cookie já foi setado no Response do handler
        await checkSession()
        router.push("/")
      }
    } catch {
      setError("Erro na requisição")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">

      <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">Entrar</h1>

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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="bg-gray-800 border-gray-700"
            />
            <div className="text-right mt-2">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-400 hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            <Button variant="outline" asChild className="flex gap-2">
              <Link href={AUTHURL}>
                <Image src="/icon/google-icon.svg" width={24} height={24} alt="google provider" />
                Login com Google
              </Link>
            </Button>
          </div>

          {/* Link para esqueci a senha */}


          <div className="text-center text-sm mt-4">
            <Link href="/cadastro" className="text-blue-400 hover:underline">
              Não tem uma conta? Cadastre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
