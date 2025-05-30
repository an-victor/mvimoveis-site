"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Captura e ignora erros de ResizeObserver
    const handleError = (event: ErrorEvent) => {
      if (event.message.includes("ResizeObserver")) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    window.addEventListener("error", handleError as EventListener)
    console.error("Erro na página de imóveis:", error)

    return () => {
      window.removeEventListener("error", handleError as EventListener)
    }
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Algo deu errado!</h2>
      <p className="text-slate-600 mb-6 text-center max-w-md">
        Ocorreu um erro ao carregar a página de imóveis. Por favor, tente novamente.
      </p>
      <div className="flex gap-4">
        <button onClick={reset} className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800">
          Tentar novamente
        </button>
        <Link href="/" className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50">
          Voltar para página inicial
        </Link>
      </div>
    </div>
  )
}
