import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import PropertyForm from "../property-form"
import { notFound } from "next/navigation"

export const metadata = {
  title: "Editar Imóvel | Área do Usuário",
}

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const property = await client.fetch(groq`*[_type == "property" && _id == $id][0]`, { id })

  if (!property) {
    notFound()
  }

  // Prepara os dados iniciais para o form
  const initialData = {
    ...property,
    features: property.features?.join(", ") || ""
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Editar Imóvel</h1>
        <p className="text-muted-foreground">Atualize as informações de "{property.title}".</p>
      </div>

      <PropertyForm initialData={initialData} isEditing />
    </div>
  )
}