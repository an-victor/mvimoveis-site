"use client"

import { useEffect, useState } from "react"
import { Loader2, CheckCircle2, Upload, Save, Globe, Clock } from "lucide-react"

type SaveStage = "uploading" | "saving" | "publishing" | "done" | null

interface PropertySaveOverlayProps {
  stage: SaveStage
  photoCount: number
  isEditing: boolean
}

const stageConfig = {
  uploading: {
    icon: Upload,
    title: "Enviando suas fotos...",
    description: "As imagens estão sendo enviadas para o servidor. Isso pode levar alguns instantes dependendo da quantidade.",
    color: "text-blue-500",
    bgGlow: "from-blue-500/20 via-transparent to-transparent",
    progress: 33,
  },
  saving: {
    icon: Save,
    title: "Salvando dados do imóvel...",
    description: "Registrando todas as informações no banco de dados.",
    color: "text-amber-500",
    bgGlow: "from-amber-500/20 via-transparent to-transparent",
    progress: 66,
  },
  publishing: {
    icon: Globe,
    title: "Publicando no site...",
    description: "Atualizando as páginas do site com o novo imóvel.",
    color: "text-emerald-500",
    bgGlow: "from-emerald-500/20 via-transparent to-transparent",
    progress: 90,
  },
  done: {
    icon: CheckCircle2,
    title: "Imóvel cadastrado com sucesso! 🎉",
    description: "",
    color: "text-green-500",
    bgGlow: "from-green-500/20 via-transparent to-transparent",
    progress: 100,
  },
}

export default function PropertySaveOverlay({ stage, photoCount, isEditing }: PropertySaveOverlayProps) {
  const [dots, setDots] = useState("")
  const [elapsed, setElapsed] = useState(0)

  // Animação dos pontinhos
  useEffect(() => {
    if (!stage || stage === "done") return
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".")
    }, 500)
    return () => clearInterval(interval)
  }, [stage])

  // Contador de tempo
  useEffect(() => {
    if (!stage) { setElapsed(0); return }
    if (stage === "done") return
    const interval = setInterval(() => setElapsed(prev => prev + 1), 1000)
    return () => clearInterval(interval)
  }, [stage])

  if (!stage) return null

  const config = stageConfig[stage]
  const Icon = config.icon
  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Barra de progresso no topo */}
        <div className="h-1.5 bg-slate-100 w-full">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-amber-500 to-green-500 transition-all duration-1000 ease-out rounded-r-full"
            style={{ width: `${config.progress}%` }}
          />
        </div>

        <div className="p-8 text-center space-y-6">
          {/* Ícone animado */}
          <div className={`mx-auto w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center ${stage !== "done" ? "animate-pulse" : ""}`}>
            {stage === "done" ? (
              <Icon className="h-10 w-10 text-green-500 animate-in zoom-in-50 duration-500" />
            ) : (
              <Loader2 className={`h-10 w-10 ${config.color} animate-spin`} />
            )}
          </div>

          {/* Título e descrição */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-800">
              {stage !== "done" ? `${config.title.replace("...", "")}${dots}` : config.title}
            </h3>
            {stage !== "done" && (
              <p className="text-sm text-slate-500">{config.description}</p>
            )}
          </div>

          {/* Info de fotos */}
          {stage === "uploading" && photoCount > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-sm text-blue-700 font-medium">
              <Upload className="h-3.5 w-3.5" />
              {photoCount} {photoCount === 1 ? "foto" : "fotos"} sendo enviada{photoCount > 1 ? "s" : ""}
            </div>
          )}

          {/* Tempo decorrido */}
          {stage !== "done" && (
            <p className="text-xs text-slate-400 font-mono tabular-nums">
              Tempo: {minutes > 0 ? `${minutes}m ` : ""}{seconds.toString().padStart(2, "0")}s
            </p>
          )}

          {/* Mensagem de sucesso */}
          {stage === "done" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-left">
                <Clock className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Seu imóvel pode levar de 1 a 5 minutos para aparecer no site.
                  </p>
                  <p className="text-xs text-amber-600 mt-1">
                    As imagens e páginas estão sendo processadas em segundo plano. Isso é normal e automático.
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Redirecionando para a lista de imóveis...
              </p>
            </div>
          )}

          {/* Aviso para não fechar */}
          {stage !== "done" && (
            <p className="text-xs text-red-400 font-medium">
              ⚠️ Não feche ou atualize esta página
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
