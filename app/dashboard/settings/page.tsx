import { client } from "@/sanity/lib/client"
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"
import SettingsForm from "./settings-form"

export const metadata = {
  title: "Personalização | Área do Usuário",
}

export default async function SettingsPage() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY) || {}
  const documentInfo = await client.fetch(`*[_type == "siteSettings"][0]{_id}`)
  const documentId = documentInfo?._id || "siteSettings"

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personalização do Site</h1>
        <p className="text-muted-foreground">Altere as informações principais, textos institucionais e cores.</p>
      </div>

      <SettingsForm initialData={settings} documentId={documentId} />
    </div>
  )
}