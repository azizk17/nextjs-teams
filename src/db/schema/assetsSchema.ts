import { pgTable, text, timestamp, integer, jsonb, AnyPgColumn, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { nanoId } from '@/lib/utils';
import { createInsertSchema } from 'drizzle-zod';

const usageRightsEnum = pgEnum('usage_rights', [
    'OWNER',
    'LICENSED',
    'CREATIVE_COMMONS',
    'PUBLIC_DOMAIN',
    'FAIR_USE',
    'THIRD_PARTY_CONTENT',
    'CONTENT_ID_MATCHED',
    'UNSPECIFIED'
]);
export const assetsTable = pgTable('assets', {
    id: text('id').primaryKey().$defaultFn(() => nanoId(10)),
    name: text('name').notNull(),
    description: text('description'),
    url: text('url').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    type: text('type').notNull(), // e.g. image, video, audio, file
    usageRights: usageRightsEnum("usage_rights").default('UNSPECIFIED'),
    metadata: jsonb('metadata'),
    isArchived: boolean('is_archived').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});


export const insertAssetSchema = createInsertSchema(assetsTable);
export type InsertAsset = typeof assetsTable.$inferInsert;
export type Asset = typeof assetsTable.$inferSelect;
