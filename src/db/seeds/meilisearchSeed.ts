import { getAllMedia } from "@/services/mediaService"
import MeiliSearch from "meilisearch"

export async function seedMeilisearch() {
    const client = new MeiliSearch({
        host: process.env.MEILISEARCH_HOST!,
        apiKey: process.env.MEILISEARCH_API_KEY!,
    })

    const index = await client.getIndex('library')
    const data = await getAllMedia({ page: 1, limit: 100 })
    const indexableData = data.map(item => ({
        id: item.id,
        title: item.title
    }))
    await index.addDocuments(indexableData)
}