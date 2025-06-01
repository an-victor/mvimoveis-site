import Link from "next/link"
import { client } from "@/sanity/lib/client"
import { urlForImage } from "@/sanity/lib/image"
import { PROPERTIES_QUERY } from "@/sanity/lib/queries"
import type { Property } from "@/types/sanity"

async function getProperties() {
  const properties = await client.fetch<Property[]>(PROPERTIES_QUERY)
  return properties
}

export default async function AllProperties() {
  const properties = await getProperties()

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">Carlos Imóveis</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-orange-500">
              Início
            </Link>
            <Link href="/imoveis" className="text-sm font-medium text-slate-900 hover:text-orange-500">
              Imóveis
            </Link>
            <Link href="/#sobre" className="text-sm font-medium text-slate-600 hover:text-orange-500">
              Sobre
            </Link>
            <Link href="/#depoimentos" className="text-sm font-medium text-slate-600 hover:text-orange-500">
              Depoimentos
            </Link>
            <Link href="/#contato" className="text-sm font-medium text-slate-600 hover:text-orange-500">
              Contato
            </Link>
          </nav>
          <div className="md:hidden">
            <button className="p-2">
              <span className="sr-only">Abrir menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-slate-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-slate-600">
              <Link href="/" className="hover:text-orange-500">
                Início
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-2 h-4 w-4"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span className="text-slate-900">Imóveis</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-12 bg-slate-900">
          <div className="container mx-auto px-4 text-center text-white">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Encontre seu imóvel ideal</h1>
            <p className="mt-4 text-lg text-slate-300">
              Explore nossa seleção de imóveis de alto padrão em localizações privilegiadas
            </p>
          </div>
        </section>

        {/* Filtros e Listagem */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center text-sm font-medium text-orange-500 hover:underline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1 h-4 w-4"
                  >
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </svg>
                  Voltar para página inicial
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative w-full sm:w-auto">
                  <input
                    type="search"
                    placeholder="Buscar imóveis..."
                    className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-4 text-sm sm:w-[250px]"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </div>
                <select className="rounded-md border border-slate-300 py-2 px-4 text-sm w-full sm:w-auto">
                  <option value="recent">Mais recentes</option>
                  <option value="price-asc">Menor preço</option>
                  <option value="price-desc">Maior preço</option>
                  <option value="area-asc">Menor área</option>
                  <option value="area-desc">Maior área</option>
                </select>
                <button className="rounded-md border border-slate-300 py-2 px-4 text-sm flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                  </svg>
                  Filtros
                </button>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-slate-500">Exibindo {properties.length} imóveis</div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500">Visualização:</span>
                <button className="rounded-md border border-slate-300 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                </button>
                <button className="rounded-md border border-slate-300 p-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <line x1="3" x2="21" y1="6" y2="6" />
                    <line x1="3" x2="21" y1="12" y2="12" />
                    <line x1="3" x2="21" y1="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((property) => (
                <div
                  key={property._id}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={
                        property.images?.[0]
                          ? urlForImage(property.images[0]).width(800).height(600).url()
                          : "/placeholder.svg"
                      }
                      alt={property.title}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900">{property.title}</h3>
                    <div className="mt-2 flex items-center text-slate-500">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1 h-4 w-4"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-500">{property.price}</span>
                      <div className="flex items-center gap-1 text-sm">
                        <span>{property.area}</span>
                        <span className="text-slate-300">|</span>
                        <span>{property.bedrooms} quartos</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t bg-orange-50 p-4">
                    <Link href={`/imoveis/${property.slug.current}`} className="w-full">
                      <button className="w-full rounded-md bg-orange-500 py-2 px-4 text-white hover:bg-orange-600">
                        Ver detalhes
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex items-center justify-center">
              <nav className="flex items-center gap-1">
                <button
                  disabled
                  className="h-8 w-8 rounded-md border border-slate-300 flex items-center justify-center opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button className="h-8 w-8 rounded-md border border-slate-300 bg-orange-50 text-sm">1</button>
                <button className="h-8 w-8 rounded-md border border-slate-300 text-sm">2</button>
                <button className="h-8 w-8 rounded-md border border-slate-300 text-sm">3</button>
                <button className="h-8 w-8 rounded-md border border-slate-300 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-xl font-bold text-slate-900">Carlos Imóveis</div>
              <p className="mt-4 text-slate-600">
                Especialista em imóveis de alto padrão, oferecendo um serviço personalizado e exclusivo para cada
                cliente.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Links Rápidos</h3>
              <nav className="mt-4 flex flex-col space-y-2">
                <Link href="/" className="text-slate-600 hover:text-orange-500">
                  Início
                </Link>
                <Link href="/imoveis" className="text-slate-600 hover:text-orange-500">
                  Imóveis
                </Link>
                <Link href="/#sobre" className="text-slate-600 hover:text-orange-500">
                  Sobre
                </Link>
                <Link href="/#depoimentos" className="text-slate-600 hover:text-orange-500">
                  Depoimentos
                </Link>
                <Link href="/#contato" className="text-slate-600 hover:text-orange-500">
                  Contato
                </Link>
              </nav>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Fale Conosco</h3>
              <div className="mt-4 space-y-2">
                <p className="flex items-center text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-5 w-5 text-orange-500"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  (11) 99999-9999
                </p>
                <p className="flex items-center text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-5 w-5 text-orange-500"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  contato@carlosimoveis.com
                </p>
                <p className="flex items-center text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-5 w-5 text-orange-500"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Av. Paulista, 1000 - Bela Vista, São Paulo - SP
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="https://wa.me/5511999999999"
                  className="inline-flex items-center rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  Fale pelo WhatsApp
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t pt-6 text-center text-sm text-slate-500">
            <p>© {new Date().getFullYear()} Carlos Imóveis. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
