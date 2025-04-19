// app/new-password/page.tsx
import React, { Suspense } from 'react'
import NewPasswordForm from './NewPasswordForm'

export const metadata = { title: 'Redefinir Senha' }

export default function NewPasswordPage() {
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Suspense fallback={<div>Carregando formulário…</div>}>
        <NewPasswordForm />
      </Suspense>
    </div>
  )
}
