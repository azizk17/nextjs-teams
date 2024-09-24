import { eq, and, inArray, countDistinct, like, or, desc } from 'drizzle-orm';
import { db } from '../db'; // Assuming you have a db instance set up
import {
    mediaTable,
    authorsTable,
    mediaAuthorsTable,
    collectionsTable,
    mediaCollectionsTable,
    tagsTable,
    mediaTagsTable,
    categoriesTable,
    mediaCategoriesTable,
    InsertMedia,
    InsertMediaCollection,
    InsertCollection
} from '@/db/schema/mediaSchema';
import { Pagination } from '@/types';
import { platformsTable } from '@/db/schema';



// Get a single media item by ID
// -------------------------------------------------------------------------------------------------
export const getMedia = async (id: string) => {
    const [data] = await db.select({
        id: mediaTable.id,
        title: mediaTable.title,
        content: mediaTable.content,
        url: mediaTable.url,
        thumbnailUrl: mediaTable.thumbnailUrl,
        createdAt: mediaTable.createdAt,
        updatedAt: mediaTable.updatedAt,
        publishedAt: mediaTable.publishedAt,
        platform: {
            id: mediaTable.platformId,
            name: platformsTable.name,
        },
        author: {
            id: authorsTable.id,
            name: authorsTable.name,
            // avatarUrl: authorsTable?.avatarUrl,
        },
    }).from(mediaTable).leftJoin(platformsTable, eq(mediaTable.platformId, platformsTable.id)).leftJoin(authorsTable, eq(mediaTable.authorId, authorsTable.id)).where(eq(mediaTable.id, id));
    return data;
};

// create media
// -------------------------------------------------------------------------------------------------
export const createMedia = async (media: InsertMedia) => {
    return db.insert(mediaTable).values(media).returning();
};

// update media
// -------------------------------------------------------------------------------------------------
export const updateMedia = async (id: string, media: InsertMedia) => {
    return db.update(mediaTable).set(media).where(eq(mediaTable.id, id));
};

// delete media
// -------------------------------------------------------------------------------------------------
export const deleteMedia = async (id: string) => {
    // First, delete related records in the media_categories table
    await db.delete(mediaCategoriesTable).where(eq(mediaCategoriesTable.mediaId, id));
    // Use a transaction to ensure atomicity of the delete operations
    return await db.transaction(async (trx) => {
        // Delete related records in the media_categories table
        await trx.delete(mediaCategoriesTable).where(eq(mediaCategoriesTable.mediaId, id));
        // Delete related records in the media_tags table
        await trx.delete(mediaTagsTable).where(eq(mediaTagsTable.mediaId, id));

        // Delete the media record
        const deletedMedia = await trx.delete(mediaTable).where(eq(mediaTable.id, id)).returning();

        return deletedMedia;
    });

};

// search media
// -------------------------------------------------------------------------------------------------
export const searchMedia = async (query: string) => {
    return db.select({
        id: mediaTable.id,
        title: mediaTable.title,
        content: mediaTable?.content,
        url: mediaTable.url,
        thumbnailUrl: mediaTable.thumbnailUrl,
        createdAt: mediaTable.createdAt,
        updatedAt: mediaTable.updatedAt,
        publishedAt: mediaTable.publishedAt,
        platform: {
            id: mediaTable.platformId,
            name: platformsTable.name,
        },
        author: {
            id: authorsTable.id,
            name: authorsTable.name,
        },
    }).from(mediaTable)
        .leftJoin(platformsTable, eq(mediaTable.platformId, platformsTable.id))
        .leftJoin(authorsTable, eq(mediaTable.authorId, authorsTable.id))
        .where(
            or(
                like(mediaTable.title, `%${query}%`),
                eq(mediaTable.id, query)
            )
        );
};


// Get all media items
export const getAllMedia = async (pagination: Pagination) => {
    // Sleep for a specified duration
    await new Promise(resolve => setTimeout(resolve, 1000));
    const { page = 1, limit = 10 } = pagination;
    return db.select({
        id: mediaTable.id,
        title: mediaTable.title,
        content: mediaTable?.content,
        url: mediaTable.url,
        thumbnailUrl: mediaTable.thumbnailUrl,
        createdAt: mediaTable.createdAt,
        updatedAt: mediaTable.updatedAt,
        publishedAt: mediaTable.publishedAt,
        platform: {
            id: mediaTable.platformId,
            name: platformsTable.name,
        },
        author: {
            id: authorsTable.id,
            name: authorsTable.name,
        },
    })
        .from(mediaTable)
        .leftJoin(platformsTable, eq(mediaTable.platformId, platformsTable.id))
        .leftJoin(authorsTable, eq(mediaTable.authorId, authorsTable.id))
        .limit(limit)
        .offset((page - 1) * limit);
};

export const getMediaCount = async (/** add filters here */) => {
    const [count] = await db.select({ count: countDistinct(mediaTable.id) }).from(mediaTable);
    return count.count;
};

// Get media items with their authors
export const getMediaWithAuthors = () => {
    return db
        .select({
            media: mediaTable,
            author: authorsTable,
        })
        .from(mediaTable)
        .leftJoin(mediaAuthorsTable, eq(mediaTable.id, mediaAuthorsTable.mediaId))
        .leftJoin(authorsTable, eq(mediaAuthorsTable.authorId, authorsTable.id));
};

// Get media items in a specific collection
export const getMediaInCollection = (collectionId: string) => {
    return db
        .select({
            media: mediaTable,
            collection: collectionsTable,
        })
        .from(mediaTable)
        .innerJoin(mediaCollectionsTable, eq(mediaTable.id, mediaCollectionsTable.mediaId))
        .innerJoin(collectionsTable, eq(mediaCollectionsTable.collectionId, collectionsTable.id))
        .where(eq(collectionsTable.id, collectionId));
};

// Get media items with specific tags
export const getMediaByTags = (tagIds: string[]) => {
    return db
        .select({
            media: mediaTable,
            tag: tagsTable,
        })
        .from(mediaTable)
        .innerJoin(mediaTagsTable, eq(mediaTable.id, mediaTagsTable.mediaId))
        .innerJoin(tagsTable, eq(mediaTagsTable.tagId, tagsTable.id))
        .where(inArray(tagsTable.id, tagIds));
};

// Get media items in a specific category
export const getMediaInCategory = (categoryId: string) => {
    return db
        .select({
            media: mediaTable,
            category: categoriesTable,
        })
        .from(mediaTable)
        .innerJoin(mediaCategoriesTable, eq(mediaTable.id, mediaCategoriesTable.mediaId))
        .innerJoin(categoriesTable, eq(mediaCategoriesTable.categoryId, categoriesTable.id))
        .where(eq(categoriesTable.id, categoryId));
};

// Get media items with all related data
export const getMediaWithAllRelations = () => {
    return db
        .select({
            media: mediaTable,
            author: authorsTable,
            collection: collectionsTable,
            tag: tagsTable,
            category: categoriesTable,
        })
        .from(mediaTable)
        .leftJoin(mediaAuthorsTable, eq(mediaTable.id, mediaAuthorsTable.mediaId))
        .leftJoin(authorsTable, eq(mediaAuthorsTable.authorId, authorsTable.id))
        .leftJoin(mediaCollectionsTable, eq(mediaTable.id, mediaCollectionsTable.mediaId))
        .leftJoin(collectionsTable, eq(mediaCollectionsTable.collectionId, collectionsTable.id))
        .leftJoin(mediaTagsTable, eq(mediaTable.id, mediaTagsTable.mediaId))
        .leftJoin(tagsTable, eq(mediaTagsTable.tagId, tagsTable.id))
        .leftJoin(mediaCategoriesTable, eq(mediaTable.id, mediaCategoriesTable.mediaId))
        .leftJoin(categoriesTable, eq(mediaCategoriesTable.categoryId, categoriesTable.id));
};



// collections
// -------------------------------------------------------------------------------------------------
export const getCollections = async () => {
    return db.select().from(collectionsTable);
};
// get recent collections
export const getRecentCollections = async () => {
    return db.select().from(collectionsTable).orderBy(desc(collectionsTable.createdAt)).limit(10);
};

// get collection by id
export const getCollectionById = async (id: string) => {
    return db.select().from(collectionsTable).where(eq(collectionsTable.id, id));
};

// create collection
export const createCollection = async (collection: InsertCollection) => {
    return db.insert(collectionsTable).values(collection).returning();
};

// update collection
export const updateCollection = async (id: string, collection: InsertCollection) => {
    return db.update(collectionsTable).set(collection).where(eq(collectionsTable.id, id));
};

// delete collection
export const deleteCollection = async (id: string) => {
    return db.delete(collectionsTable).where(eq(collectionsTable.id, id));
};
