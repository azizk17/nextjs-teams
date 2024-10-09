
// Get all posts
export type GetPostsArgs = {
    limit?: number;
    offset?: number;
};
export async function getPosts({ limit, offset }: GetPostsArgs) {
    const posts = await db.select().from(postsTable).limit(limit).offset(offset)
}