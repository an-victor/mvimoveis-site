import { client } from "../sanity/lib/client"

const sampleTestimonials = [
  {
    _type: "testimonial",
    name: "Maria Silva",
    location: "Jardins, São Paulo",
    text: "Excelente atendimento! Marcelo me ajudou a encontrar o apartamento perfeito. Profissional dedicado e muito atencioso durante todo o processo.",
    rating: 5,
    featured: true,
  },
  {
    _type: "testimonial",
    name: "João Santos",
    location: "Vila Nova Conceição, São Paulo",
    text: "Recomendo muito o trabalho do Marcelo. Conseguiu vender minha casa rapidamente e pelo valor que eu esperava. Muito profissional!",
    rating: 5,
    featured: true,
  },
  {
    _type: "testimonial",
    name: "Ana Costa",
    location: "Alphaville, Barueri",
    text: "Atendimento excepcional! Marcelo entendeu exatamente o que eu procurava e me apresentou opções perfeitas. Muito satisfeita com o resultado.",
    rating: 5,
    featured: true,
  },
]

async function addSampleTestimonials() {
  try {
    console.log("Adicionando depoimentos de exemplo...")

    for (const testimonial of sampleTestimonials) {
      const result = await client.create(testimonial)
      console.log(`✅ Depoimento criado: ${result.name}`)
    }

    console.log("🎉 Todos os depoimentos foram adicionados com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao adicionar depoimentos:", error)
  }
}

addSampleTestimonials()
