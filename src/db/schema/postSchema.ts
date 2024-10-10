import { pgTable, text, timestamp, primaryKey, integer, boolean, unique, json, serial, pgEnum, jsonb, AnyPgTable, AnyPgColumn } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { nanoId } from '@/lib/utils';
import { platformsTable } from './platformsSchema';

// Posts table
export const postsTable = pgTable('posts', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    externalId: text('external_id'),
    content: jsonb('content').notNull(),
    metadata: jsonb('metadata'),
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    authorId: text('author_id').references(() => authorTable.id),
    platformId: text('platform_id').references(() => platformsTable.id),
    // user_id
    // userId: text('user_id').references(() => usersTable.id),
});




// media table
const mediaTypeEnum = pgEnum('media_type', ['image', 'video', 'audio', 'file']);
const usageRightsEnum = pgEnum('usage_rights', ['public', 'private', 'royalty-free', 'copyrighted', 'custom']);
export const mediaTable = pgTable('media', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    url: text('url').notNull(),
    title: text('title'),
    description: text('description'),
    size: integer('size'),
    width: integer('width'),
    height: integer('height'),
    duration: integer('duration'),
    mimeType: text('mime_type'),
    fileType: text('file_type'),
    fileExtension: text('file_extension'),
    type: mediaTypeEnum('type'),
    usageRights: usageRightsEnum("usage_rights").default('public'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// post media table
export const postMediaTable = pgTable('post_media', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    postId: text('post_id').references(() => postsTable.id),
    mediaId: text('media_id').references(() => mediaTable.id),
    metadata: jsonb('metadata'), // background_music, background_video, thumbnail, etc
    createdAt: timestamp('created_at').defaultNow(),
});

// author table
export const authorTable = pgTable('author', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull(),
    email: text('email').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});


// Collections table
export const collectionsTable = pgTable('collections', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Relation table for posts and collections
export const postCollectionsTable = pgTable('post_collections', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    postId: text('post_id').references(() => postsTable.id),
    collectionId: text('collection_id').references(() => collectionsTable.id),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});



// tags table
export const tagsTable = pgTable('tags', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const categoriesTable = pgTable('categories', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull(),
    description: text('description'),
    icon: text('icon'),
    color: text('color'),
    parentId: text('parent_id').references((): AnyPgColumn => categoriesTable.id),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// post tags table
export const postTagsTable = pgTable('post_tags', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    postId: text('post_id').references(() => postsTable.id),
    tagId: text('tag_id').references(() => tagsTable.id),
    createdAt: timestamp('created_at').defaultNow(),
});

// post categories table
export const postCategoriesTable = pgTable('post_categories', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    postId: text('post_id').references(() => postsTable.id),
    categoryId: text('category_id').references(() => categoriesTable.id),
    createdAt: timestamp('created_at').defaultNow(),
});

// media tags table
export const mediaTagsTable = pgTable('media_tags', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    mediaId: text('media_id').references(() => mediaTable.id),
    tagId: text('tag_id').references(() => tagsTable.id),
    createdAt: timestamp('created_at').defaultNow(),
});





// Types
export type Post = typeof postsTable.$inferSelect;
export type NewPost = typeof postsTable.$inferInsert;

export type Collection = typeof collectionsTable.$inferSelect;
export type NewCollection = typeof collectionsTable.$inferInsert;

export type PostCollection = typeof postCollectionsTable.$inferSelect;
export type NewPostCollection = typeof postCollectionsTable.$inferInsert;

export type PostMedia = typeof postMediaTable.$inferSelect;
export type NewPostMedia = typeof postMediaTable.$inferInsert;

export type Author = typeof authorTable.$inferSelect;
export type NewAuthor = typeof authorTable.$inferInsert;

export type Tag = typeof tagsTable.$inferSelect;
export type NewTag = typeof tagsTable.$inferInsert;

export type Category = typeof categoriesTable.$inferSelect;
export type NewCategory = typeof categoriesTable.$inferInsert;

export type Media = typeof mediaTable.$inferSelect;
export type NewMedia = typeof mediaTable.$inferInsert;

export type PostTag = typeof postTagsTable.$inferSelect;
export type NewPostTag = typeof postTagsTable.$inferInsert;

export type PostCategory = typeof postCategoriesTable.$inferSelect;
export type NewPostCategory = typeof postCategoriesTable.$inferInsert;

export type MediaTag = typeof mediaTagsTable.$inferSelect;
export type NewMediaTag = typeof mediaTagsTable.$inferInsert;



// Schemas
export const insertPostSchema = createInsertSchema(postsTable);
export const insertCollectionSchema = createInsertSchema(collectionsTable);
export const insertPostCollectionSchema = createInsertSchema(postCollectionsTable);
export const insertPostMediaSchema = createInsertSchema(postMediaTable);
export const insertMediaSchema = createInsertSchema(mediaTable);
export const insertAuthorSchema = createInsertSchema(authorTable);
export const insertTagSchema = createInsertSchema(tagsTable);
export const insertCategorySchema = createInsertSchema(categoriesTable);
export const insertPostTagSchema = createInsertSchema(postTagsTable);
export const insertPostCategorySchema = createInsertSchema(postCategoriesTable);
export const insertMediaTagSchema = createInsertSchema(mediaTagsTable);


