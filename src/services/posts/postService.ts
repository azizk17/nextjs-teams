import { db } from '@/db';
import { postsTable, postTagsTable, postCategoriesTable, postMediaTable, NewPost, NewPostTag, NewPostCategory, NewPostMedia, Post } from '@/db/schema/postSchema';
import { eq } from 'drizzle-orm';

// Create a new post
// --------------------------------------------------
export async function createPost(postData: NewPost, tagIds: string[], categoryIds: string[], mediaIds: string[]): Promise<string> {
    return await db.transaction(async (tx) => {
        // Insert the new post
        const [insertedPost] = await tx.insert(postsTable).values(postData).returning({ id: postsTable.id });

        // Add tags to the post
        if (tagIds.length > 0) {
            const postTags: NewPostTag[] = tagIds.map(tagId => ({
                postId: insertedPost.id,
                tagId,
            }));
            await tx.insert(postTagsTable).values(postTags);
        }

        // Add categories to the post
        if (categoryIds.length > 0) {
            const postCategories: NewPostCategory[] = categoryIds.map(categoryId => ({
                postId: insertedPost.id,
                categoryId,
            }));
            await tx.insert(postCategoriesTable).values(postCategories);
        }

        // Add media to the post
        if (mediaIds.length > 0) {
            const postMedia: NewPostMedia[] = mediaIds.map(mediaId => ({
                postId: insertedPost.id,
                mediaId,
            }));
            await tx.insert(postMediaTable).values(postMedia);
        }

        return insertedPost.id;
    });
}

// Delete a post and all associated records
// --------------------------------------------------
export async function deletePost(postId: string): Promise<boolean> {
    return await db.transaction(async (tx) => {
        // Delete associated records first
        await tx.delete(postTagsTable).where(eq(postTagsTable.postId, postId));
        await tx.delete(postCategoriesTable).where(eq(postCategoriesTable.postId, postId));
        await tx.delete(postMediaTable).where(eq(postMediaTable.postId, postId));

        // Delete the post itself
        const result = await tx.delete(postsTable).where(eq(postsTable.id, postId));

        // Check if a post was actually deleted
        return result.rowCount > 0;
    });
}

// Get a post by id
// --------------------------------------------------
export async function getPostById(postId: string): Promise<Post | null> {
    const [post] = await db.select().from(postsTable).where(eq(postsTable.id, postId));
    return post || null;
}

// Get posts by author id
// --------------------------------------------------
export async function getPostsByAuthorId(authorId: string): Promise<Post[]> {
    const posts = await db.select().from(postsTable).where(eq(postsTable.authorId, authorId));
    return posts || [];
}

// Get posts by tag id
// --------------------------------------------------
export async function getPostsByTagId(tagId: string): Promise<Post[]> {
    const posts = await db.select().from(postsTable).innerJoin(postTagsTable, eq(postTagsTable.postId, postsTable.id)).where(eq(postTagsTable.tagId, tagId));
    return posts || [];
}

// Get posts by category id
// --------------------------------------------------
export async function getPostsByCategoryId(categoryId: string): Promise<Post[]> {
    const posts = await db.select().from(postsTable).innerJoin(postCategoriesTable, eq(postCategoriesTable.postId, postsTable.id)).where(eq(postCategoriesTable.categoryId, categoryId));
    return posts || [];
}

// Get posts by media id
// --------------------------------------------------
export async function getPostsByMediaId(mediaId: string): Promise<Post[]> {
    const posts = await db.select().from(postsTable).innerJoin(postMediaTable, eq(postMediaTable.postId, postsTable.id)).where(eq(postMediaTable.mediaId, mediaId));
    return posts || [];
}

// Get posts
// --------------------------------------------------
export async function getPosts(limit: number = 10, offset: number = 0): Promise<Post[]> {
    const posts = await db.select().from(postsTable).limit(limit).offset(offset);
    return posts || [];
}

// Update a post
// --------------------------------------------------
export async function updatePost(postId: string, postData: Partial<NewPost>, tagIds: string[], categoryIds: string[], mediaIds: string[]): Promise<boolean> {

    return await db.transaction(async (tx) => {
        // Update the post
        const [updatedPost] = await tx.update(postsTable).set(postData).where(eq(postsTable.id, postId)).returning();

        // Update tags
        if (tagIds.length > 0) {
            await tx.delete(postTagsTable).where(eq(postTagsTable.postId, postId));
            const postTags: NewPostTag[] = tagIds.map(tagId => ({
                postId,
                tagId,
            }));
            await tx.insert(postTagsTable).values(postTags);
        }

        // Update categories
        if (categoryIds.length > 0) {
            await tx.delete(postCategoriesTable).where(eq(postCategoriesTable.postId, postId));
            const postCategories: NewPostCategory[] = categoryIds.map(categoryId => ({
                postId,
                categoryId,
            }));
            await tx.insert(postCategoriesTable).values(postCategories);
        }

        // Update media
        if (mediaIds.length > 0) {
            await tx.delete(postMediaTable).where(eq(postMediaTable.postId, postId));
            const postMedia: NewPostMedia[] = mediaIds.map(mediaId => ({
                postId,
                mediaId,
            }));
            await tx.insert(postMediaTable).values(postMedia);
        }

        // Check if the post was updated
        return updatedPost ? true : false;
    });
}