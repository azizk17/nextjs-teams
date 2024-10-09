
// this should be renamed to postSchema.ts


import { pgTable, text, timestamp, integer, jsonb, AnyPgColumn, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { nanoId } from '@/lib/utils';
import { platformsTable } from './platformsSchema';
import { createInsertSchema } from 'drizzle-zod';

const post = {
    id: "11",
    content: {
        text: "Hello World",
        images: ["image1", "image2"],
    },
    author: {
        id: "123",
        name: "John Doe",
    },
    platform: {
        id: "youtube",
        name: "YouTube",
    },
}


export const postsTable = pgTable('posts', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    content: text('content').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    type: text('type').notNull(), // e.g. image, video, audio, file
    publishedAt: timestamp('published_at'),
    authorId: text('author_id').references(() => authorsTable.id),
    platformId: text('platform_id').references(() => platformsTable.id),
});


// you need versioning, cleaning, and moderation
export const usageRightsEnum = pgEnum('usage_rights', [
    'OWNER',
    'LICENSED',
    'CREATIVE_COMMONS',
    'PUBLIC_DOMAIN',
    'FAIR_USE',
    'THIRD_PARTY_CONTENT',
    'CONTENT_ID_MATCHED',
    'UNSPECIFIED'
]);
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
    usageRights: usageRightsEnum("usage_rights").default('UNSPECIFIED'),
    metadata: jsonb('metadata'),
    isArchived: boolean('is_archived').default(false),
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

// Transcript table
export const transcriptTable = pgTable('transcript', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    mediaId: text('media_id').notNull().references(() => mediaTable.id),
    text: text('text').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Summary table
export const summaryTable = pgTable('summary', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    mediaId: text('media_id').notNull().references(() => mediaTable.id),
    text: text('text').notNull(),
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
    mediaId: text('media_id').notNull().references(() => mediaTable.id),
    collectionId: text('collection_id').notNull().references(() => collectionsTable.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});


// Topics table
export const topicsTable = pgTable('topics', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull().unique(),
    description: text('description'),
    parentId: text('parent_id').references((): AnyPgColumn => topicsTable.id),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Media topics relation table
export const mediaTopicsTable = pgTable('media_topics', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    mediaId: text('media_id').notNull().references(() => mediaTable.id),
    topicId: text('topic_id').notNull().references(() => topicsTable.id),
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

export type Topic = typeof topicsTable.$inferSelect;
export type InsertTopic = typeof topicsTable.$inferInsert;
export const insertTopicSchema = createInsertSchema(topicsTable);

export type MediaTopic = typeof mediaTopicsTable.$inferSelect;
export type InsertMediaTopic = typeof mediaTopicsTable.$inferInsert;
export const insertMediaTopicSchema = createInsertSchema(mediaTopicsTable);

