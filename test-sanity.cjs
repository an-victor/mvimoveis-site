const client = require('@sanity/client').createClient({
  projectId: "98pdr6kx",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
})

const query = `*[_type == "property" && status == "available" 
  && ($search == "" || title match $search + "*" || location match $search + "*")
  && ($type == "" || type == $type)
  && ($bedrooms == 0 || bedrooms >= $bedrooms)
  && ($bathrooms == 0 || bathrooms >= $bathrooms)
] | order(_createdAt desc) { title }`

client.fetch(query, {
  search: "", type: "", bedrooms: 0, bathrooms: 0
}).then(res => console.log('Fixed:', res.length)).catch(console.error)
