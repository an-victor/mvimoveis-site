import { client } from "@/sanity/lib/client"
import { SITE_SETTINGS_QUERY, TESTIMONIALS_QUERY } from "@/sanity/lib/queries"
import SettingsForm from "./settings-form"
import { TestimonialsManager } from "./testimonials-manager"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MessageSquareQuote } from "lucide-react"

export const metadata = {
  title: "Personalização | Área do Usuário",
}

export default async function SettingsPage() {
  const [settings, documentInfo, testimonials] = await Promise.all([
    client.fetch(SITE_SETTINGS_QUERY),
    client.fetch(`*[_type == "siteSettings"][0]{_id}`),
    client.fetch(TESTIMONIALS_QUERY),
  ])

  const documentId = documentInfo?._id || "siteSettings"

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personalização do Site</h1>
        <p className="text-muted-foreground">Altere as informações principais, textos institucionais e cores.</p>
      </div>

      <SettingsForm initialData={settings || {}} documentId={documentId} />

      {/* Seção de Depoimentos */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
          <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-brand-primary" />
            Depoimentos de Clientes
          </CardTitle>
          <CardDescription>
            Gerencie os depoimentos que aparecem na página inicial. Adicione fotos reais para aumentar a credibilidade.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <TestimonialsManager testimonials={testimonials || []} />
        </CardContent>
      </Card>
    </div>
  )
}