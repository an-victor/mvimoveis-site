import Image from "next/image"
import { getImageUrl } from "@/sanity/lib/image"
import type { SiteSettings } from "@/types/sanity"

interface AboutSectionProps {
  siteSettings: SiteSettings | null
}

export function AboutSection({ siteSettings }: AboutSectionProps) {
  return (
    <section id="sobre" className="py-16">
      <div className="container">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div className="relative aspect-square overflow-hidden rounded-lg md:aspect-auto md:h-[600px]">
            <Image
              src={getImageUrl(siteSettings?.aboutImage as any, 600, 600) || "/placeholder.svg"}
              alt={siteSettings?.aboutTitle || "Sobre o corretor"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {siteSettings?.aboutTitle || "Sobre Marcelo Victor"}
            </h2>
            <p className="text-lg text-slate-600">
              {siteSettings?.aboutDescription ||
                "Com mais de 15 anos de experiência no mercado imobiliário, me dedico a encontrar o imóvel perfeito para cada cliente, entendendo suas necessidades e oferecendo um atendimento personalizado do início ao fim."}
            </p>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-bold text-slate-900">Atendimento Personalizado</h3>
                <p className="text-slate-600">
                  Cada cliente recebe atenção exclusiva e dedicada às suas necessidades específicas.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-bold text-slate-900">Especialista em Alto Padrão</h3>
                <p className="text-slate-600">
                  Conhecimento profundo do mercado de imóveis de luxo e suas particularidades.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-bold text-slate-900">Negociação Transparente</h3>
                <p className="text-slate-600">
                  Processos claros e objetivos para garantir a melhor experiência na compra ou venda.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-bold text-slate-900">Suporte Contínuo</h3>
                <p className="text-slate-600">
                  Acompanhamento em todas as etapas, desde a visita até a finalização do contrato.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
