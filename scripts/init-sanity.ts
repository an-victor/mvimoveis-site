import { client } from "../sanity/lib/client"
import { initialSiteSettings } from "../sanity/lib/initial-data"

async function initializeSanity() {
  try {
    // Verificar se já existe configuração do site
    const existingSettings = await client.fetch('*[_type == "siteSettings"][0]')

    if (!existingSettings) {
      console.log("Criando configurações iniciais do site...")
      await client.create(initialSiteSettings)
      console.log("✅ Configurações do site criadas com sucesso!")
    } else {
      console.log("ℹ️ Configurações do site já existem")
    }

    console.log("🎉 Sanity inicializado com sucesso!")
    console.log("📝 Acesse o Sanity Studio para começar a adicionar conteúdo")
  } catch (error) {
    console.error("❌ Erro ao inicializar Sanity:", error)
  }
}

initializeSanity()
