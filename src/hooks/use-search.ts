import { useState, useEffect } from 'react'
import { MeiliSearch } from 'meilisearch'

const client = new MeiliSearch({
    host: 'http://localhost:7700', // Replace with your Meilisearch server URL
    apiKey: process.env.MEILISEARCH_API_KEY, // Replace with your API key
})

export function useSearch(query: string) {
    const [results, setResults] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const searchIndex = async () => {
            if (query.trim() === '') {
                setResults([])
                return
            }

            setIsLoading(true)
            try {
                const response = await client.index('library').search(query)
                setResults(response.hits)
            } catch (error) {
                console.error('Search error:', error)
                setResults([])
            } finally {
                setIsLoading(false)
            }
        }

        searchIndex()
    }, [query])

    return { results, isLoading }
}