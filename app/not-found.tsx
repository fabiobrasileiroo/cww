"use client"

import NotFoundAnimation from '@/components/notFoundAnimation'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(true)

  useEffect(() => {
    if (typeof document !== "undefined") {
      const referrer = document.referrer
      console.log("Referrer:", referrer)

      // Se o usuário não veio de dentro do próprio app, melhor mandar pra Home
      if (!referrer || !referrer.includes(window.location.host)) {
        setCanGoBack(false)
      }
    }
  }, [])

  const handleNavigation = () => {
    if (canGoBack) {
      window.history.back()
    } else {
      router.push('/')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h2 className="text-3xl font-bold mb-6 text-white">Página não encontrada</h2>
      <div className="w-96 h-72 mb-6">
        <NotFoundAnimation />
      </div>
      <button
        onClick={handleNavigation}
        className="mt-4 inline-block px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition duration-300"
      >
        {canGoBack ? 'Voltar para página anterior' : 'Ir para Home'}
      </button>
    </div>
  )
}
