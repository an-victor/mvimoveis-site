"use server"

import { supabase } from "@/lib/supabase"

export async function saveLead(formData: {
  name: string
  phone: string
  property_slug: string
  property_title: string
}) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([
        {
          name: formData.name,
          phone: formData.phone,
          property_slug: formData.property_slug,
          property_title: formData.property_title,
        },
      ])
      .select()

    if (error) {
      console.error('Error saving lead to Supabase:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Unexpected error saving lead:', error)
    return { success: false, error: 'Ocorreu um erro inesperado ao salvar o lead.' }
  }
}
