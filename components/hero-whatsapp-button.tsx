"use client"

import { WhatsAppLeadButton } from "@/components/whatsapp-lead-button"

interface HeroWhatsAppButtonProps {
  whatsappNumber: string
}

export function HeroWhatsAppButton({ whatsappNumber }: HeroWhatsAppButtonProps) {
  return (
    <WhatsAppLeadButton
      whatsappNumber={whatsappNumber}
      className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-orange-700 text-white shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)] border-none transition-all duration-300 transform hover:-translate-y-1 rounded-full px-8 h-11 text-base font-semibold"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      Falar no WhatsApp
    </WhatsAppLeadButton>
  )
}
