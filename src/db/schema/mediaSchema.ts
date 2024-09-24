
import { pgTable, text, timestamp, integer, jsonb, AnyPgColumn, pgEnum } from 'drizzle-orm/pg-core';
import { nanoId } from '@/lib/utils';
import { platformsTable } from './platformsSchema';
import { createInsertSchema } from 'drizzle-zod';

const usageRightsEnum = pgEnum('usage_rights', ['public', 'private', 'royalty-free', 'copyrighted', 'custom']);
export const mediaTable = pgTable('media', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    title: text('title').notNull(),
    content: jsonb('content'),
    url: text('url').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    type: text('type').notNull(), // e.g. image, video, audio, file
    duration: integer('duration'),
    publishedAt: timestamp('published_at'),
    authorId: text('author_id').references(() => authorsTable.id),
    platformId: text('platform_id').references(() => platformsTable.id),
    usageRights: usageRightsEnum("usage_rights").default('public'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),

});

// Subtitles table
export const subtitlesTable = pgTable('subtitles', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    mediaId: text('media_id').notNull().references(() => mediaTable.id),
    language: text('language').notNull(),
    url: text('url').notNull(),
    format: text('format').notNull(), // e.g., 'srt', 'vtt', 'ass'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


// Authors table
export const authorsTable = pgTable('authors', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull(),
    bio: text('bio'),
    platformId: text('platform_id').references(() => platformsTable.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Media authors relation table
export const mediaAuthorsTable = pgTable('media_authors', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    mediaId: text('media_id').notNull().references(() => mediaTable.id),
    authorId: text('author_id').notNull().references(() => authorsTable.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Collections table
export const collectionsTable = pgTable('collections', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Media collections relation table
export const mediaToCollectionsTable = pgTable('media_to_collections', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    mediaId: text('media_id').notNull().references(() => mediaTable.id),
    collectionId: text('collection_id').notNull().references(() => collectionsTable.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Tags table
export const tagsTable = pgTable('tags', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Media tags relation table
export const mediaTagsTable = pgTable('media_tags', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    mediaId: text('media_id').notNull().references(() => mediaTable.id),
    tagId: text('tag_id').notNull().references(() => tagsTable.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Categories table
export const categoriesTable = pgTable('categories', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull().unique(),
    description: text('description'),
    parentId: text('parent_id').references((): AnyPgColumn => categoriesTable.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Media categories relation table
export const mediaCategoriesTable = pgTable('media_categories', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    mediaId: text('media_id').notNull().references(() => mediaTable.id),
    categoryId: text('category_id').notNull().references(() => categoriesTable.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});



// types
export type Media = typeof mediaTable.$inferSelect;
export type InsertMedia = typeof mediaTable.$inferInsert;
export const insertMediaSchema = createInsertSchema(mediaTable);

export type Subtitle = typeof subtitlesTable.$inferSelect;
export type InsertSubtitle = typeof subtitlesTable.$inferInsert;
export const insertSubtitleSchema = createInsertSchema(subtitlesTable);


export type MediaToCollection = typeof mediaToCollectionsTable.$inferSelect;
export type InsertMediaToCollection = typeof mediaToCollectionsTable.$inferInsert;
export const insertMediaToCollectionSchema = createInsertSchema(mediaToCollectionsTable);

export type Collection = typeof collectionsTable.$inferSelect;
export type InsertCollection = typeof collectionsTable.$inferInsert;
export const insertCollectionSchema = createInsertSchema(collectionsTable);


export type Tag = typeof tagsTable.$inferSelect;
export type InsertTag = typeof tagsTable.$inferInsert;
export const insertTagSchema = createInsertSchema(tagsTable);

export type MediaTag = typeof mediaTagsTable.$inferSelect;
export type InsertMediaTag = typeof mediaTagsTable.$inferInsert;
export const insertMediaTagSchema = createInsertSchema(mediaTagsTable);

export type Category = typeof categoriesTable.$inferSelect;
export type InsertCategory = typeof categoriesTable.$inferInsert;
export const insertCategorySchema = createInsertSchema(categoriesTable);

export type MediaCategory = typeof mediaCategoriesTable.$inferSelect;
export type InsertMediaCategory = typeof mediaCategoriesTable.$inferInsert;
export const insertMediaCategorySchema = createInsertSchema(mediaCategoriesTable);

