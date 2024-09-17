import { pgTable, text, timestamp, primaryKey, integer, boolean, unique, json, serial, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { nanoId } from '@/lib/utils';
import { usersTable } from './userSchema';
import { relations } from 'drizzle-orm';

// Posts table

const postTypeEnum = pgEnum('post_type', ['post', 'video', 'audio', 'image', 'file']);
export const postsTable = pgTable('posts', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    title: text('title').notNull(),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    authorId: text('author_id').references(() => usersTable.id),
});



// Collections table
export const collectionsTable = pgTable('collections', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
    authorId: text('author_id').references(() => usersTable.id),
});

// Relation table for posts and collections
export const postCollectionsTable = pgTable('post_collections', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    postId: text('post_id').references(() => postsTable.id),
    collectionId: text('collection_id').references(() => collectionsTable.id),
    createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const postsRelations = relations(postsTable, ({ many }) => ({
    collections: many(postCollectionsTable),
}));

export const collectionsRelations = relations(collectionsTable, ({ many }) => ({
    posts: many(postCollectionsTable),
}));

export const postCollectionsRelations = relations(postCollectionsTable, ({ one }) => ({
    post: one(postsTable, {
        fields: [postCollectionsTable.postId],
        references: [postsTable.id],
    }),
    collection: one(collectionsTable, {
        fields: [postCollectionsTable.collectionId],
        references: [collectionsTable.id],
    }),
}));

