"use server"

import { writeClient } from "@/sanity/lib/write-client"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function deletePropertyAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Acesso negado")
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    throw new Error("ERRO DE CONFIGURAÇÃO: O token SANITY_API_WRITE_TOKEN não está configurado. O imóvel não foi deletado no banco de dados.")
  }

  const id = formData.get("id") as string
  if (!id) return

  try {
    await writeClient.delete(id)
    revalidatePath("/")
    revalidatePath("/imoveis")
    revalidatePath("/dashboard/properties")
  } catch (error) {
    console.error("Erro ao deletar imóvel:", error)
  }
}

export async function createPropertyAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, message: "Acesso negado. Faça login." }
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return { success: false, message: "ERRO: SANITY_API_WRITE_TOKEN não está configurado na Vercel ou localmente. Não é possível salvar dados no banco." }
  }

  const title = formData.get("title") as string
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  
  // Coletar assets já enviados via upload direto e ordem das imagens
  const assetIds = formData.getAll("assetIds") as string[]
  const imageFiles = formData.getAll("image") as File[]
  const imagesOrderStr = formData.get("imagesOrder") as string
  
  let images: any[] = assetIds.map(id => ({
    _type: 'image',
    _key: id,
    asset: { _type: 'reference', _ref: id }
  }))

  try {
    // Processar arquivos em paralelo para maior velocidade
    let uploadedImages: any[] = []
    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(async (file) => {
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer())
          const asset = await writeClient.assets.upload('image', buffer, {
            filename: file.name,
            contentType: file.type
          })
          return {
            _type: 'image',
            _key: asset._id,
            asset: { _type: 'reference', _ref: asset._id }
          }
        }
        return null
      })

      uploadedImages = (await Promise.all(uploadPromises)).filter(Boolean) as any[]
    }

    if (imagesOrderStr) {
      const order = JSON.parse(imagesOrderStr)
      let newFileIdx = 0
      
      const orderedImages = order.map((item: any) => {
        if (item.type === 'local') return item.data
        if (item.type === 'new') {
          const up = uploadedImages[newFileIdx]
          newFileIdx++
          return up
        }
        return null
      }).filter(Boolean)
      
      orderedImages.push(...images) // assetIds diretos no final se houver
      images = orderedImages
    } else {
      images.push(...uploadedImages)
    }

    const propertyData = {
      _type: "property",
      title,
      slug: { _type: "slug", current: slug },
      price: formData.get("price") as string,
      location: formData.get("location") as string,
      area: formData.get("area") as string,
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      parkingSpots: Number(formData.get("parkingSpots")),
      status: formData.get("status") as string,
      featured: formData.get("featured") === "on",
      description: [
        {
          _type: "block",
          style: "normal",
          children: [{ _type: "span", text: formData.get("description") as string || title }]
        }
      ],
      features: (formData.get("features") as string).split(",").map(f => f.trim()).filter(Boolean),
      images: images
    }

    await writeClient.create(propertyData)
    
    revalidatePath("/")
    revalidatePath("/imoveis")
    revalidatePath("/dashboard/properties")
    
    return { success: true, message: "Imóvel cadastrado com sucesso!" }
  } catch (error: any) {
    console.error("Erro ao criar imóvel:", error)
    return { success: false, message: error.message || "Erro ao cadastrar imóvel." }
  }
}

export async function updatePropertyAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    return { success: false, message: "Acesso negado. Faça login." }
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return { success: false, message: "ERRO: SANITY_API_WRITE_TOKEN não está configurado na Vercel ou localmente. Não é possível salvar dados no banco." }
  }

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  
  // Coletar assets já enviados via upload direto e ordem das imagens
  const assetIds = formData.getAll("assetIds") as string[]
  const imageFiles = formData.getAll("image") as File[]
  const imagesOrderStr = formData.get("imagesOrder") as string
  
  const directAssetImages: any[] = assetIds.map(id => ({
    _type: 'image',
    _key: id,
    asset: { _type: 'reference', _ref: id }
  }))

  try {
    const updateData: any = {
      title,
      price: formData.get("price") as string,
      location: formData.get("location") as string,
      area: formData.get("area") as string,
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      parkingSpots: Number(formData.get("parkingSpots")),
      status: formData.get("status") as string,
      featured: formData.get("featured") === "on",
      features: (formData.get("features") as string).split(",").map(f => f.trim()).filter(Boolean),
    }

    // Processar arquivos em paralelo para maior velocidade
    let uploadedImages: any[] = []
    if (imageFiles.length > 0) {
      const uploadPromises = imageFiles.map(async (file) => {
        if (file && file.size > 0) {
          const buffer = Buffer.from(await file.arrayBuffer())
          const asset = await writeClient.assets.upload('image', buffer, {
            filename: file.name,
            contentType: file.type
          })
          return {
            _type: 'image',
            _key: asset._id,
            asset: { _type: 'reference', _ref: asset._id }
          }
        }
        return null
      })

      uploadedImages = (await Promise.all(uploadPromises)).filter(Boolean) as any[]
    }

    const patch = writeClient.patch(id).set(updateData)

    if (imagesOrderStr) {
      // Reconstrói o array seguindo a ordem
      const order = JSON.parse(imagesOrderStr)
      let newFileIdx = 0
      
      const finalImages = order.map((item: any) => {
        if (item.type === 'local') return item.data
        if (item.type === 'new') {
          const up = uploadedImages[newFileIdx]
          newFileIdx++
          return up
        }
        return null
      }).filter(Boolean)
      
      finalImages.push(...directAssetImages)
      patch.set({ images: finalImages })
    } else {
      const newImages = [...directAssetImages, ...uploadedImages]
      if (newImages.length > 0) {
        patch.setIfMissing({ images: [] }).append('images', newImages)
      }
    }

    await patch.commit()
    
    revalidatePath("/")
    revalidatePath("/imoveis")
    revalidatePath(`/imoveis/${formData.get("slug")}`)
    revalidatePath("/dashboard/properties")
    
    return { success: true, message: "Imóvel atualizado com sucesso!" }
  } catch (error: any) {
    console.error("Erro ao atualizar imóvel:", error)
    return { success: false, message: error.message || "Erro ao atualizar imóvel." }
  }
}

// Remove uma foto específica do array de imagens de um imóvel
export async function removePropertyImageAction(propertyId: string, imageKey: string) {
  const session = await auth()
  if (!session?.user) throw new Error("Acesso negado")

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return { success: false, message: "ERRO: SANITY_API_WRITE_TOKEN não está configurado." }
  }

  try {
    await writeClient
      .patch(propertyId)
      .unset([`images[_key=="${imageKey}"]`])
      .commit()

    revalidatePath("/")
    revalidatePath("/imoveis")
    revalidatePath("/dashboard/properties")
    return { success: true }
  } catch (error: any) {
    console.error("Erro ao remover imagem:", error)
    return { success: false, message: error.message }
  }
}

// Cria ou atualiza um depoimento
export async function saveTestimonialAction(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session?.user) return { success: false, message: "Acesso negado." }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return { success: false, message: "ERRO: SANITY_API_WRITE_TOKEN não está configurado." }
  }

  const id = formData.get("id") as string
  const avatarFile = formData.get("avatar") as File
  const avatarAssetId = formData.get("avatarAssetId") as string

  try {
    const data: any = {
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      text: formData.get("text") as string,
      rating: Number(formData.get("rating") || 5),
      featured: formData.get("featured") === "on",
    }

    if (avatarAssetId) {
      data.avatar = { _type: 'image', asset: { _type: 'reference', _ref: avatarAssetId } }
    } else if (avatarFile && avatarFile.size > 0) {
      const buffer = Buffer.from(await avatarFile.arrayBuffer())
      const asset = await writeClient.assets.upload('image', buffer, {
        filename: avatarFile.name,
        contentType: avatarFile.type
      })
      data.avatar = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
    }

    if (id) {
      await writeClient.patch(id).set(data).commit()
    } else {
      await writeClient.create({ _type: "testimonial", ...data })
    }

    revalidatePath("/")
    revalidatePath("/dashboard/settings")
    return { success: true, message: id ? "Depoimento atualizado!" : "Depoimento criado com sucesso!" }
  } catch (error: any) {
    console.error("Erro ao salvar depoimento:", error)
    return { success: false, message: error.message || "Erro ao salvar depoimento." }
  }
}

// Delete um depoimento
export async function deleteTestimonialAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Acesso negado")

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("ERRO: SANITY_API_WRITE_TOKEN não configurado.")
    return
  }

  const id = formData.get("id") as string
  if (!id) return

  try {
    await writeClient.delete(id)
    revalidatePath("/")
    revalidatePath("/dashboard/settings")
  } catch (error: any) {
    console.error("Erro ao deletar depoimento:", error)
  }
}

// Upload de uma única imagem para o Sanity Assets
export async function uploadImageAssetAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error("Acesso negado")

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return { success: false, message: "ERRO: SANITY_API_WRITE_TOKEN não configurado." }
  }

  const file = formData.get("file") as File
  if (!file || file.size === 0) throw new Error("Arquivo inválido")

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const asset = await writeClient.assets.upload('image', buffer, {
      filename: file.name,
      contentType: file.type
    })

    return { 
      success: true, 
      assetId: asset._id,
      url: asset.url
    }
  } catch (error: any) {
    console.error("Erro no upload do asset:", error)
    return { success: false, message: error.message }
  }
}