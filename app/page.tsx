
import { client } from "@/lib/sanity.client"
import { featuredPropertiesQuery, settingsQuery } from "@/lib/sanity.queries"
import HomeClient from "./HomeClient"

export default async function Home() {
  const [settings, properties] = await Promise.all([
    client.fetch(settingsQuery),
    client.fetch(featuredPropertiesQuery),
  ])

  return <HomeClient settings={settings} properties={properties} />
}
