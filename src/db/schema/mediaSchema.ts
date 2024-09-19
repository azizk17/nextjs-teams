
import { pgTable, text, timestamp, integer, jsonb, AnyPgColumn } from 'drizzle-orm/pg-core';
import { nanoId } from '@/lib/utils';
import { relations } from 'drizzle-orm';
import { platformsTable } from './platformsSchema';

export const mediaTable = pgTable('media', {
    id: text('id').primaryKey().$defaultFn(() =>  nanoId(10)),
    title: text('title').notNull(),
    content: jsonb('content'),
    url: text('url').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    type: text('type').notNull(), // e.g. image, video, audio, file
    metadata: jsonb('metadata'),
    
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
export const mediaCollectionsTable = pgTable('media_collections', {
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

// Relations


export const mediaRelations = relations(mediaTable, ({ many }) => ({
    collections: many(mediaCollectionsTable),
    tags: many(mediaTagsTable),
    categories: many(mediaCategoriesTable),
}));

export const authorRelations = relations(authorsTable, ({ many }) => ({
    media: many(mediaTable),
}));

export const collectionRelations = relations(collectionsTable, ({ many }) => ({
    media: many(mediaCollectionsTable),
}));

export const tagRelations = relations(tagsTable, ({ many }) => ({
    media: many(mediaTagsTable),
}));

export const categoryRelations = relations(categoriesTable, ({ many, one }) => ({
    media: many(mediaCategoriesTable),
    parent: one(categoriesTable, {
        fields: [categoriesTable.parentId],
        references: [categoriesTable.id],
    }),
    children: many(categoriesTable),
}));



