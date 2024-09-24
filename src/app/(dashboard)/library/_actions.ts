"use server"

import qs from "qs"
import { redirect } from "next/navigation"
import MeiliSearch from "meilisearch"
import { deleteMedia, getMedia, searchMedia } from "@/services/mediaService"
import { errorResponse, successResponse } from "@/lib/utils"
import { z } from "zod"
import { revalidatePath } from "next/cache"

export async function mediaFiltersActions(_: any, data: FormData) {
    // validate data
    const title = data.get("title")
    const platform = data.get("platform")
    const author = data.get("author")

    const filters = {
        title,
        platform,
        author,
    }

    const queryString = qs.stringify(filters, { skipNulls: true });
    redirect(`/library?${queryString}`)
}
const client = new MeiliSearch({
    host: 'http://localhost:7700', // Replace with your Meilisearch server URL
    apiKey: process.env.MEILISEARCH_API_KEY, // Replace with your API key
})

export async function searchMediaAction(query: string) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const validate = z.string()
    const result = validate.safeParse(query)
    if (!result.success) {
        return errorResponse(400, "Invalid data")
    }
    const data = await searchMedia(result.data)
    return {
        hits: data,
    }

    const mockData = [
        {
            id: "1",
            title: "React Tutorial for Beginners",
            description: "Learn React in 1 hour",
            platform: "Youtube",
            author: "Traversy Media",
            tags: ["Tag 1", "Tag 2"],
            thumbnail: "https://picsum.photos/150",
        },
        {
            id: "2",
            title: "Next.js Tutorial for Beginners",
            description: "Learn Next.js in 1 hour",
            platform: "Youtube",
            author: "Traversy Media",
            tags: ["Tag 1", "Tag 2"],
            thumbnail: "https://picsum.photos/150",
        },
        {
            id: "3",
            title: "Test 3",
            description: "Learn React in 1 hour",
            platform: "Youtube",
            author: "Traversy Media",
            tags: ["Tag 1", "Tag 2"],
            thumbnail: "https://picsum.photos/150",
        },
    ];

    const filteredResults = mockData.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );

    return {
        hits: filteredResults,
    }
}

// Delete action for media 
// -------------------------------------------------------------------------------------------------
export async function deleteMediaAction(_: any, id: string) {

    await new Promise(resolve => setTimeout(resolve, 5000))
    const validate = z.string()

    const result = validate.safeParse(id)

    if (!result.success) {
        return errorResponse(400, "Invalid data")
    }
    const media = await getMedia(result.data)

    if (!media) {
        return errorResponse(404, "Media not found")
    }

    await deleteMedia(result.data)
    revalidatePath("/library")
    return successResponse("Media deleted")
}

// Import video action
// -------------------------------------------------------------------------------------------------
const importFormSchema = z.object({
    url: z.string().url("Please enter a valid URL"),
    title: z.string().optional(),
});
export async function importVideoAction(prevState: any, formData: FormData) {
    const validatedFields = importFormSchema.safeParse({
        url: formData.get("url"),
        title: formData.get("title"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input. Please check the URL." };
    }

    const { url, title } = validatedFields.data;

    try {
        // TODO: Implement the actual import logic here
        // This is where you'd use yt-dlp or other tools to process the URL
        console.log("Importing video:", { url, title });

        // Simulating an async operation
        await new Promise(resolve => setTimeout(resolve, 2000));

        return { success: true };
    } catch (error) {
        return { error: "Failed to import video. Please try again." };
    }
}

// create collection action
// -------------------------------------------------------------------------------------------------
export async function createCollectionAction(_: any, data: FormData) {

    const validate = z.object({
        name: z.string().min(1, "Please enter a name"),
    })
    const result = validate.safeParse({
        name: data.get("name"),
    })
    if (!result.success) {
        return errorResponse(400, "Invalid data")
    }
    return successResponse("Collection created")
}