"use client"

import { useState } from "react"
import { WhatsAppLeadModal } from "@/components/whatsapp-lead-modal"

interface WhatsAppLeadButtonProps {
  whatsappNumber: string
  /** Classe CSS customizada para o botão */
  className?: string
  /** Conteúdo do botão (children) */
  children: React.ReactNode
  /** Mensagem pré-preenchida (opcional — se não informada, usa padrão para contexto geral) */
  whatsappMessage?: string
  /** Dados opcionais de imóvel para pré-popular a mensagem */
  propertyTitle?: string
  propertySlug?: string
  propertyLocation?: string
  propertyPrice?: string
  /** Se true, renderiza como <a> (para compatibilidade visual) mas captura o clique */
  asAnchor?: boolean
}

export function WhatsAppLeadButton({
  whatsappNumber,
  className,
  children,
  whatsappMessage,
  propertyTitle,
  propertySlug,
  propertyLocation,
  propertyPrice,
}: WhatsAppLeadButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={className}
        aria-label="Falar no WhatsApp"
      >
        {children}
      </button>

      <WhatsAppLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        whatsappNumber={whatsappNumber}
        whatsappMessage={whatsappMessage}
        propertyTitle={propertyTitle}
        propertySlug={propertySlug}
        propertyLocation={propertyLocation}
        propertyPrice={propertyPrice}
      />
    </>
  )
}
