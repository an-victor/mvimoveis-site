import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Settings } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-muted-foreground">Bem-vindo à área de gestão do seu site.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/properties">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gerenciar Imóveis</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Adicione, edite ou remova imóveis do seu catálogo. Controle os preços e galerias de fotos.</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/settings">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Personalização</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Altere a cor principal do site, modifique os textos institucionais e o banner.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}