import PropertyForm from "../property-form"

export const metadata = {
  title: "Cadastrar Imóvel | Área do Usuário",
}

export default function NewPropertyPage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cadastrar Novo Imóvel</h1>
        <p className="text-muted-foreground">Preencha os dados e faça o upload da foto principal.</p>
      </div>

      <PropertyForm />
    </div>
  )
}