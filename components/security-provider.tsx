"use client"

import { useEffect, useState } from "react"
import { ShieldAlert, ShieldCheck, Lock } from "lucide-react"

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [showWarning, setShowWarning] = useState(false)

  useEffect(() => {
    // 1. Bloqueio de Botão Direito
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    // 2. Bloqueio de Atalhos de DevTools
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") {
        e.preventDefault()
        triggerWarning()
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
      if (
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U") ||
        (e.metaKey && e.altKey && ["I", "J"].includes(e.key.toUpperCase())) // Mac
      ) {
        e.preventDefault()
        triggerWarning()
      }
    }

    const triggerWarning = () => {
      setShowWarning(true)
      setTimeout(() => setShowWarning(false), 3000)
    }

    document.addEventListener("contextmenu", handleContextMenu)
    document.addEventListener("keydown", handleKeyDown)

    // Anti-Debugger Trap (Opcional - pode ser agressivo)
    // const interval = setInterval(() => {
    //   debugger;
    // }, 100);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu)
      document.removeEventListener("keydown", handleKeyDown)
      // clearInterval(interval);
    }
  }, [])

  return (
    <>
      {children}
      
      {/* Toast de Segurança Premium */}
      {showWarning && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl shadow-2xl text-white">
            <Lock className="h-5 w-5 text-orange-400 animate-pulse" />
            <div>
              <p className="text-sm font-bold tracking-tight">Ambiente Seguro Antigravity</p>
              <p className="text-[11px] text-slate-400">Proteção de propriedade intelectual ativa.</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
