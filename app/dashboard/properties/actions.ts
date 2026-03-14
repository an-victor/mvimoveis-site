"use server"

import { writeClient } from "@/sanity/lib/write-client"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

export async function deletePropertyAction(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error("Acesso negado")
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

  const title = formData.get("title") as string
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  
  const imageFile = formData.get("image") as File
  let imageAsset;

  try {
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      imageAsset = await writeClient.assets.upload('image', buffer, {
        filename: imageFile.name,
        contentType: imageFile.type
      })
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
      description: [
        {
          _type: "block",
          style: "normal",
          children: [{ _type: "span", text: formData.get("description") as string || title }]
        }
      ],
      features: (formData.get("features") as string).split(",").map(f => f.trim()).filter(Boolean),
      images: imageAsset ? [{
        _type: 'image',
        _key: imageAsset._id,
        asset: {
          _type: 'reference',
          _ref: imageAsset._id
        }
      }] : []
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

  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const imageFile = formData.get("image") as File
  let imageAsset;

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
      features: (formData.get("features") as string).split(",").map(f => f.trim()).filter(Boolean),
    }

    // Se uma nova imagem foi enviada, faz o upload e atualiza a referência
    if (imageFile && imageFile.size > 0) {
      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      imageAsset = await writeClient.assets.upload('image', buffer, {
        filename: imageFile.name,
        contentType: imageFile.type
      })

      updateData.images = [{
        _type: 'image',
        _key: imageAsset._id,
        asset: {
          _type: 'reference',
          _ref: imageAsset._id
        }
      }]
    }

    await writeClient
      .patch(id)
      .set(updateData)
      .commit()
    
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