"use server"

import { writeClient } from "@/sanity/lib/write-client"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function updateSiteSettingsAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, message: "Acesso negado. Faça login." }
  }

  const documentId = formData.get("documentId") as string
  const logoFile = formData.get("logo") as File
  const bannerFile = formData.get("banner") as File

  try {
    const dataToUpdate: any = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      primaryColor: formData.get("primaryColor") as string,
      secondaryColor: formData.get("secondaryColor") as string,
      heroTitle: formData.get("heroTitle") as string,
      heroSubtitle: formData.get("heroSubtitle") as string,
      heroDescription: formData.get("heroDescription") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      whatsapp: formData.get("whatsapp") as string,
      address: formData.get("address") as string,
    }

    // Upload do Logo se houver novo arquivo
    if (logoFile && logoFile.size > 0) {
      const buffer = Buffer.from(await logoFile.arrayBuffer())
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: logoFile.name,
        contentType: logoFile.type
      })
      dataToUpdate.logo = {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id }
      }
    }

    // Upload do Banner — ADICIONA ao array existente (não substitui)
    if (bannerFile && bannerFile.size > 0) {
      const buffer = Buffer.from(await bannerFile.arrayBuffer())
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: bannerFile.name,
        contentType: bannerFile.type
      })
      // Usa append para guardar todas as imagens do carrossel
      dataToUpdate.bannerImages = {
        _type: 'reference',  // sinalizador para o patch abaixo usar append
        _asset: asset._id
      }
    }

    const existingDoc = await writeClient.getDocument(documentId)

    // Separa o banner do resto do patch para usar insert em vez de set
    const bannerAsset = dataToUpdate.bannerImages as any
    delete dataToUpdate.bannerImages

    if (existingDoc) {
      let patch = writeClient.patch(documentId).set(dataToUpdate)
      if (bannerAsset?._asset) {
        patch = patch.insert('after', 'bannerImages[-1]', [{
          _type: 'image',
          _key: bannerAsset._asset,
          asset: { _type: 'reference', _ref: bannerAsset._asset }
        }])
      }
      await patch.commit()
    } else {
      await writeClient.create({
        _type: "siteSettings",
        _id: documentId,
        ...dataToUpdate
      })
    }

    // Revalida todas as rotas que dependem do layout e de configurações
    revalidatePath("/", "layout")
    revalidatePath("/dashboard/settings")
    
    return { success: true, message: "Configurações salvas com sucesso!" }
  } catch (error: any) {
    console.error("Erro ao salvar:", error)
    return { success: false, message: error.message || "Erro ao salvar as configurações." }
  }
}

// Remove uma imagem específica do banner pelo _key
export async function removeBannerImageAction(documentId: string, imageKey: string) {
  const session = await auth()
  if (!session?.user) return { success: false, message: "Acesso negado." }

  try {
    await writeClient
      .patch(documentId)
      .unset([`bannerImages[_key=="${imageKey}"]`])
      .commit()

    revalidatePath("/", "layout")
    revalidatePath("/dashboard/settings")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao remover imagem do banner:", error)
    return { success: false, message: error.message }
  }
}