// app/new-password/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function NewPasswordPage() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') ?? ''
  const email = params.get('email') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  // Se faltar token ou email, redireciona pro login ou forgot-password
  useEffect(() => {
    if (!token || !email) {
      router.replace('/login')
    }
  }, [token, email, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setInfo('')

    if (password.length < 6) {
      return setError('A senha precisa ter no mínimo 6 caracteres.')
    }
    if (password !== confirm) {
      return setError('As senhas não coincidem.')
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword: password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Erro ao redefinir senha.')
      } else {
        setInfo('Senha alterada com sucesso! Voltando ao login…')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch {
      setError('Falha na requisição.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-gray-900 rounded-lg space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">
          Redefinir senha
        </h1>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {info && (
          <Alert variant="default">
            <AlertDescription>{info}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="password">Nova senha</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="confirm">Confirme a senha</Label>
          <Input
            id="confirm"
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            className="bg-gray-800 border-gray-700"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Enviando…' : 'Redefinir senha'}
        </Button>
      </form>
    </div>
  )
}
