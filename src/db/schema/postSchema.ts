import { pgTable, text, timestamp, primaryKey, integer, boolean, unique, json, serial, pgEnum, jsonb, AnyPgTable, AnyPgColumn } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { nanoId } from '@/lib/utils';
import { usersTable } from './userSchema';
import { relations } from 'drizzle-orm';
import { platformsTable } from './platformsSchema';

// Posts table
const postTypeEnum = pgEnum('post_type', ['post', 'video', 'audio', 'image', 'file']);
export const postsTable = pgTable('posts', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    title: text('title').notNull(),
    content: jsonb('content').notNull(),
    type: postTypeEnum('type').$default(() => 'post'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    authorId: text('author_id').references(() => authorTable.id),
    platformId: text('platform_id').references(() => platformsTable.id),
    // user_id
    // userId: text('user_id').references(() => usersTable.id),
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

// media table
const mediaTypeEnum = pgEnum('media_type', ['image', 'video', 'audio', 'file']);
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
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// post media table
export const postMediaTable = pgTable('post_media', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    postId: text('post_id').references(() => postsTable.id),
    mediaId: text('media_id').references(() => mediaTable.id),
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

// Schemas
export const postSchema = createInsertSchema(postsTable);
export const collectionSchema = createInsertSchema(collectionsTable);
export const postCollectionSchema = createInsertSchema(postCollectionsTable);
export const postMediaSchema = createInsertSchema(postMediaTable);
export const mediaSchema = createInsertSchema(mediaTable);
export const authorSchema = createInsertSchema(authorTable);
export const tagSchema = createInsertSchema(tagsTable);
export const categorySchema = createInsertSchema(categoriesTable);
export const postTagSchema = createInsertSchema(postTagsTable);
export const postCategorySchema = createInsertSchema(postCategoriesTable);
export const mediaTagSchema = createInsertSchema(mediaTagsTable);


