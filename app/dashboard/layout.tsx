import { ReactNode } from "react"
import Link from "next/link"
import { DashboardNav } from "@/components/dashboard-nav"
import { Button } from "@/components/ui/button"
import { logOut } from "@/app/lib/actions"
import { LogOut, Home } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span>Área do Corretor</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <div className="grid items-start px-4 text-sm font-medium">
            <DashboardNav />
          </div>
        </div>
      </aside>
      
      <div className="flex flex-col md:pl-64 flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 justify-between">
          <div className="md:hidden">
            <span className="font-semibold">Área do Corretor</span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-2">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2" title="Voltar ao site">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Ver Site</span>
              </Button>
            </Link>
            <form action={logOut}>
              <Button variant="ghost" size="sm" type="submit" className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}