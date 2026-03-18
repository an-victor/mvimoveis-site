"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Settings, Building2, Users } from "lucide-react"

export function DashboardNav() {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { href: "/dashboard/properties", label: "Imóveis", icon: Building2 },
    { href: "/dashboard/leads", label: "Leads", icon: Users },
    { href: "/dashboard/settings", label: "Personalização", icon: Settings },
  ]

  return (
    <nav className="grid items-start gap-2 text-sm font-medium">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || (pathname.startsWith(href) && href !== "/dashboard")
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
              isActive ? "bg-muted text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}