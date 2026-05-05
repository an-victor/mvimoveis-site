import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import bcrypt from "bcryptjs"

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credenciais",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = (credentials.email as string).trim()
        const password = credentials.password as string

        const adminEmail = process.env.ADMIN_EMAIL?.trim()
        const adminPasswordHash = process.env.ADMIN_PASSWORD?.trim()

        if (!adminEmail || !adminPasswordHash) {
          console.error("Variáveis de ambiente ADMIN_EMAIL ou ADMIN_PASSWORD não configuradas.")
          return null
        }

        if (email === adminEmail) {
          // Verifica se a senha confere com o hash no .env (ou texto plano como fallback de emergência)
          let passwordsMatch = false
          
          if (adminPasswordHash.startsWith("$2")) {
            passwordsMatch = await bcrypt.compare(password, adminPasswordHash)
          } else {
            passwordsMatch = (password === adminPasswordHash)
          }

          if (passwordsMatch) {
            return { id: "1", name: "Corretor", email: adminEmail }
          }
        }

        console.log("Credenciais inválidas")
        return null
      },
    }),
  ],
})