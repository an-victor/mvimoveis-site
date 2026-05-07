import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import Link from "next/link"
import { getImageUrl } from "@/sanity/lib/image"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Home as HomeIcon, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deletePropertyAction } from "./actions"
import { DeleteButton } from "./delete-button"

export const metadata = {
  title: "Gerenciar Imóveis | Área do Usuário",
}

export const dynamic = "force-dynamic"

// Uma query um pouco mais abrangente que a PROPERTIES_QUERY (que filtrava só disponíveis)
const DASHBOARD_PROPERTIES_QUERY = groq`*[_type == "property"] | order(_createdAt desc) {
  _id, title, price, location, status, images, featured
}`

export default async function PropertiesPage() {
  const properties = await client.fetch(DASHBOARD_PROPERTIES_QUERY)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Imóveis</h1>
          <p className="text-muted-foreground">Gerencie o catálogo de imóveis do seu site.</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/properties/new">
            <Plus className="h-4 w-4" />
            Cadastrar Imóvel
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Imóveis Cadastrados ({properties.length})</CardTitle>
          <CardDescription>
            Nota: Para gestão avançada de galerias de fotos ou edição de textos complexos, 
            você também pode acessar o painel completo do <strong>Sanity Studio</strong> em <code>/studio</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Imagem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property: any) => (
                  <TableRow key={property._id}>
                    <TableCell>
                      <div className="relative h-12 w-16 overflow-hidden rounded-md bg-muted">
                        <img 
                          src={getImageUrl(property.images?.[0] as any, 120, 100) || "/placeholder.svg"} 
                          alt={property.title}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {property.title}
                        {property.featured && (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" title="Imóvel em Destaque" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{property.price}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        property.status === 'available' ? 'bg-green-100 text-green-800' :
                        property.status === 'sold' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status === 'available' ? 'Disponível' : property.status === 'sold' ? 'Vendido' : property.status === 'rented' ? 'Alugado' : 'Disponível'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <div className="flex justify-end gap-2">
                        <Button asChild variant="ghost" size="icon" title="Editar">
                          <Link href={`/dashboard/properties/${property._id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <form action={deletePropertyAction}>
                          <input type="hidden" name="id" value={property._id} />
                          <DeleteButton />
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {properties.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum imóvel cadastrado. Clique em "Cadastrar Imóvel" para começar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}