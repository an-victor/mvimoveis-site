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
  const brokerPhotoFile = formData.get("brokerPhoto") as File
  const bannerFiles = formData.getAll("banner") as File[]
  const bannerAssetIds = formData.getAll("bannerAssetIds") as string[]
  const logoAssetId = formData.get("logoAssetId") as string
  const brokerPhotoAssetId = formData.get("brokerPhotoAssetId") as string

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
      brokerName: formData.get("brokerName") as string,
      brokerTitle: formData.get("brokerTitle") as string,
      brokerBio: formData.get("brokerBio") as string,
    }

    // Upload do Logo
    if (logoAssetId) {
      dataToUpdate.logo = { _type: 'image', asset: { _type: 'reference', _ref: logoAssetId } }
    } else if (logoFile && logoFile.size > 0) {
      const buffer = Buffer.from(await logoFile.arrayBuffer())
      const asset = await writeClient.assets.upload('image', buffer, { filename: logoFile.name, contentType: logoFile.type })
      dataToUpdate.logo = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
    }

    // Upload da Foto do Corretor
    if (brokerPhotoAssetId) {
      dataToUpdate.brokerPhoto = { _type: 'image', asset: { _type: 'reference', _ref: brokerPhotoAssetId } }
    } else if (brokerPhotoFile && brokerPhotoFile.size > 0) {
      const buffer = Buffer.from(await brokerPhotoFile.arrayBuffer())
      const asset = await writeClient.assets.upload('image', buffer, { filename: brokerPhotoFile.name, contentType: brokerPhotoFile.type })
      dataToUpdate.brokerPhoto = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
    }

    // Preparar novos banners
    const newBanners: any[] = bannerAssetIds.map(id => ({
      _type: 'image',
      _key: id,
      asset: { _type: 'reference', _ref: id }
    }))

    for (const file of bannerFiles) {
      if (file && file.size > 0) {
        const buffer = Buffer.from(await file.arrayBuffer())
        const asset = await writeClient.assets.upload('image', buffer, { filename: file.name, contentType: file.type })
        newBanners.push({
          _type: 'image',
          _key: asset._id,
          asset: { _type: 'reference', _ref: asset._id }
        })
      }
    }

    const existingDoc = await writeClient.getDocument(documentId)

    if (existingDoc) {
      const patch = writeClient.patch(documentId).set(dataToUpdate)

      if (newBanners.length > 0) {
        patch.setIfMissing({ bannerImages: [] }).insert('after', 'bannerImages[-1]', newBanners)
      }

      await patch.commit()
    } else {
      await writeClient.create({
        _type: "siteSettings",
        _id: documentId,
        ...dataToUpdate,
        bannerImages: newBanners
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