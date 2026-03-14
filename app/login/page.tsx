import LoginForm from "./login-form"

export const metadata = {
  title: "Login | Área do Usuário",
  description: "Faça login para acessar o painel de gestão.",
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 md:p-8 bg-muted/40">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </main>
  )
}