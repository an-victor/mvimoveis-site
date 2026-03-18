import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false
})

const query = `*[_type == "property" && status == "available" 
  && ($search == "" || title match $search + "*" || location match $search + "*")
  && ($type == "" || type == $type)
  && ($bedrooms == 0 || bedrooms >= $bedrooms)
  && ($bathrooms == 0 || bathrooms >= $bathrooms)
  && (price >= $minPrice && price <= $maxPrice)
] | order($order) { title }`

async function run() {
  try {
    const res = await client.fetch(query, {
      search: "",
      type: "",
      bedrooms: 0,
      bathrooms: 0,
      minPrice: 0,
      maxPrice: 10000000,
      order: "_createdAt desc"
    })
    console.log("Success:", res)
  } catch (err) {
    console.error("Error:", err.message)
  }
}

run()
