import { nanoId } from '@/lib/utils';
import { pgTable, text, timestamp, primaryKey, integer, boolean, unique, json, serial, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { teamsTable } from './teamSchema';

export const channelsTable = pgTable('channels', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// Social integration for channels
export const channelIntegrationsTable = pgTable('channel_integrations', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    channelId: text('channel_id').notNull().references(() => channelsTable.id),
    platformId: text('platform_id').notNull(), // Assuming a platforms table exists
    credentials: jsonb('credentials'),
    metadata: jsonb('metadata'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
    uniqueIntegration: unique().on(table.channelId, table.platformId),
}));

// channels team table
export const channelTeamsTable = pgTable('channel_teams', {
    channelId: text('channel_id').notNull().references(() => channelsTable.id),
    teamId: text('team_id').notNull().references(() => teamsTable.id),
}, (table) => ({
    pk: primaryKey({ columns: [table.channelId, table.teamId] }),
}));

// posts
export const postsTable = pgTable('posts', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    channelId: text('channel_id').notNull().references(() => channelsTable.id),
    title: text('title').notNull(),
    content: text('content').notNull(),
    metadata: jsonb('metadata'),
    status: text('status').notNull().default('draft'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

// posts comments
export const postsCommentsTable = pgTable('posts_comments', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    postId: text('post_id').notNull().references(() => postsTable.id),
    content: text('content').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export type ChannelIntegration = typeof channelIntegrationsTable.$inferSelect;
export type NewChannelIntegration = typeof channelIntegrationsTable.$inferInsert;
export const channelIntegrationSchema = createInsertSchema(channelIntegrationsTable);


export type Channel = typeof channelsTable.$inferSelect;
export type NewChannel = typeof channelsTable.$inferInsert;
export const channelSchema = createInsertSchema(channelsTable);