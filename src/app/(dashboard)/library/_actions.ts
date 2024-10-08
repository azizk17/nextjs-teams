"use server"

import qs from "qs"
import { redirect } from "next/navigation"
import MeiliSearch from "meilisearch"
import { addMediaToCollection, createCollection, deleteMedia, getCollectionsByMediaId, getMedia, getRecentCollections, isMediaInCollection, removeMediaFromCollection, searchCollections, searchMedia } from "@/services/mediaService"
import { errorResponse, successResponse } from "@/lib/utils"
import { z } from "zod"
import { revalidatePath } from "next/cache"

export async function mediaFiltersActions(_: any, data: FormData) {
    // validate data
    const title = data.get("title")
    const platforms = data.getAll("platforms")
    const author = data.get("author")

    const filters = {
        title,
        platforms,
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

// create post action
// -------------------------------------------------------------------------------------------------
const createPostSchema = z.object({
    title: z.string().min(1, "Please enter a title"),
    description: z.string().min(1, "Please enter a description"),
    tags: z.array(z.string()).min(1, "Please enter at least one tag"),
    thumbnail: z.string().min(1, "Please enter a thumbnail"),
});
export async function createPostAction(prevState: any, formData: FormData) {
    const validatedFields = createPostSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        tags: formData.get("tags"),
        thumbnail: formData.get("thumbnail"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input. Please check the URL." };
    }

    const { title, description, tags, thumbnail } = validatedFields.data;

    try {
        // TODO: Implement the actual import logic here
        // This is where you'd use yt-dlp or other tools to process the URL
        console.log("Importing video:", { title });

        // Simulating an async operation
        await new Promise(resolve => setTimeout(resolve, 2000));

        return { success: true };
    } catch (error) {
        return { error: "Failed to import video. Please try again." };
    }
}

// Import video action
// -------------------------------------------------------------------------------------------------
const importFormSchema = z.object({
    url: z.string().url("Please enter a valid URL"),
    title: z.string().optional(),
});
export async function importPostAction(prevState: any, formData: FormData) {
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
    const collection = await createCollection(result.data)
    revalidatePath("/library")
    return successResponse("Collection created", { collection })
}

// toggle collection action
// -------------------------------------------------------------------------------------------------
export async function toggleCollectionAction(_: any, data: FormData) {
    const validate = z.object({
        mediaId: z.string().min(1, "Please enter a media id"),
        collectionId: z.string().min(1, "Please enter a collection id"),
    })
    const result = validate.safeParse({
        mediaId: data.get("mediaId"),
        collectionId: data.get("collectionId"),
    })

    console.log(result.data)
    if (!result.success) {
        console.log(result.error.errors)
        return errorResponse(400, "Invalid data")
    }
    const { mediaId, collectionId } = result.data
    const isExist = await isMediaInCollection(mediaId, collectionId)
    if (isExist) {
        await removeMediaFromCollection(mediaId, collectionId)
        revalidatePath("/library")
        return successResponse("Media removed from collection", { id: collectionId, added: false })
    } else {
        await addMediaToCollection([mediaId], [collectionId])
        revalidatePath("/library")
        return successResponse("Media added to collection", { id: collectionId, added: true })
    }
}

// add media to collection action
// -------------------------------------------------------------------------------------------------
export async function addMediaToCollectionAction(_: any, data: FormData) {
    const validate = z.object({
        mediaIds: z.array(z.string()),
        collectionIds: z.array(z.string()),
    })
    const result = validate.safeParse({
        mediaIds: data.get("mediaIds"),
        collectionIds: data.get("collectionIds"),
    })
    if (!result.success) {
        return errorResponse(400, "Invalid data")
    }

    // TODO: check if media and collections exist

    const { mediaIds, collectionIds } = result.data
    await addMediaToCollection(mediaIds, collectionIds)
    revalidatePath("/library")
    return successResponse("Media added to collection")
}

// getCollectionsByMediaId action
// -------------------------------------------------------------------------------------------------
export async function getCollectionsByMediaIdAction({ mediaId, limit = 3 }: { mediaId: string, limit?: number }) {
    const validate = z.object({
        mediaId: z.string().min(1, "Please enter a media id"),
        limit: z.number().optional(),
    })
    const result = validate.safeParse({
        mediaId,
        limit,
    })
    if (!result.success) {
        return errorResponse(400, "Invalid data")
    }
    const collections = await getCollectionsByMediaId(result.data.mediaId, limit)
    if (collections.length === 0) {
        return errorResponse(404, "Collections not found")
    }
    return successResponse("Collections found", collections)
}

// get recent collections action
// -------------------------------------------------------------------------------------------------
export async function getRecentCollectionsAction({ limit = 3 }) {
    const validate = z.object({
        limit: z.number(),
    })
    const result = validate.safeParse({
        limit
    })
    if (!result.success) {
        return errorResponse(400, "Invalid data")
    }
    const collections = await getRecentCollections({ limit: result.data.limit })

    return successResponse("Collections found", collections)
}

// search collections action
// -------------------------------------------------------------------------------------------------
export async function searchForCollection(_: any, data: FormData) {
    const validate = z.object({
        query: z.string().min(3, "Please enter a search query"),
    })
    const result = validate.safeParse({
        query: data.get("query"),
    })
    if (!result.success) {
        return errorResponse(400, "Invalid data")
    }
    const collections = await searchCollections(result.data.query)
    if (collections.length === 0) {
        return errorResponse(404, "Collections not found")
    }
    return successResponse("Collections found", collections)
}
