import { client } from "@/sanity/lib/client"
import { groq } from "next-sanity"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Home as HomeIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deletePropertyAction } from "./actions"

export const metadata = {
  title: "Gerenciar Imóveis | Área do Usuário",
}

// Uma query um pouco mais abrangente que a PROPERTIES_QUERY (que filtrava só disponíveis)
const DASHBOARD_PROPERTIES_QUERY = groq`*[_type == "property"] | order(_createdAt desc) {
  _id, title, price, location, status
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
        <Link href="/dashboard/properties/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Cadastrar Imóvel
          </Button>
        </Link>
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
                    <TableCell className="font-medium">{property.title}</TableCell>
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
                        <Link href={`/dashboard/properties/${property._id}`}>
                          <Button variant="ghost" size="icon" title="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <form action={deletePropertyAction}>
                          <input type="hidden" name="id" value={property._id} />
                          <Button variant="ghost" size="icon" type="submit" title="Excluir" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {properties.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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