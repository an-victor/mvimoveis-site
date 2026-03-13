"use client"

import type React from "react"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

interface NavigationLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export function NavigationLink({ href, children, className }: NavigationLinkProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Se é um link com âncora (começa com /#)
    if (href.startsWith("/#")) {
      e.preventDefault()
      const sectionId = href.substring(2) // Remove o "/#"

      // Se já estamos na página principal
      if (pathname === "/") {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      } else {
        // Se estamos em outra página, navega para a principal e depois faz scroll
        router.push("/")
        setTimeout(() => {
          const element = document.getElementById(sectionId)
          if (element) {
            element.scrollIntoView({ behavior: "smooth" })
          }
        }, 100)
      }
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
