import { db } from '@/db';
import { postsTable, postTagsTable, postCategoriesTable, postMediaTable, authorTable } from '@/db/schema/postSchema';
import { createPost } from '@/services/posts/postService';
import { platformsTable } from '../schema';
import { sql } from 'drizzle-orm';

export async function seedPosts() {
    // get random author
    const author = await db.select().from(authorTable).orderBy(sql`RAND()`).limit(1);
    // get random platform
    const platform = await db.select().from(platformsTable).orderBy(sql`RAND()`).limit(1);

    // Sample data
    const posts = [
        {
            title: 'Getting Started with TypeScript',
            content: 'TypeScript is a powerful superset of JavaScript...',
            authorId: author[0].id,
            platformId: platform[0].id,
            status: 'published',
            publishedAt: new Date(),
            tags: ['typescript', 'javascript', 'programming'],
            categories: ['technology', 'web-development'],
            media: ['image1', 'image2'],
        },
        {
            title: 'The Benefits of Meditation',
            content: 'Regular meditation practice can reduce stress and improve focus...',
            authorId: author[0].id,
            platformId: platform[0].id,
            status: 'draft',
            tags: ['meditation', 'wellness', 'mental-health'],
            categories: ['health', 'lifestyle'],
            media: ['image3'],
        },
        // Add more sample posts as needed
    ];

    // Seed the posts
    for (const post of posts) {
        const { tags, categories, media, ...postData } = post;
        await createPost(postData, tags, categories, media);
    }

    console.log('Posts seeded successfully');
}

// Run the seed function
seedPosts().catch(console.error);
